import { z } from 'zod';
import { Hono } from 'hono';
import { extractText, getDocumentProxy } from 'unpdf';

import { PDFToSlidesErrorCode } from './error';
import { HTTPException, zValidator } from '../../hono';

import { openAI } from '../../openAI';
import {
  pdfToSlidesPostSchema,
  pdfToSlidesResponseSchema,
  pdfToSlidesResponseJSONSchema,
} from './schema';

const app = new Hono().post(
  '/',
  zValidator('form', pdfToSlidesPostSchema),
  async (context) => {
    const { file } = await context.req.valid('form');

    const pdf = await getDocumentProxy(await file.arrayBuffer());

    const { text } = await extractText(pdf, { mergePages: true });

    const assistant = await openAI.beta.assistants.create({
      response_format: {
        type: 'json_object',
      },
      model: 'gpt-4o-mini',
      instructions:
        'You are a bot that helps extract information from text and, based on it, generates a json for creating a presentation in Google Slides',
    });

    const thread = await openAI.beta.threads.create({});
    await openAI.beta.threads.messages.create(thread.id, {
      role: 'user',
      content: `
Parse the text below and return a json array with information for the slides,
regarding which I will generate Google Slides using gs language, use JSON schema,
the position of the elements of each individual slide is counted from the upper left corner (top: 0, left: 0):

${JSON.stringify(pdfToSlidesResponseJSONSchema, null, 2)}

Here is the text itself:

${text}
      `,
    });

    const run = await openAI.beta.threads.runs.create(thread.id, {
      assistant_id: assistant.id,
    });

    let completed = false;
    while (!completed) {
      const { status } = await openAI.beta.threads.runs.retrieve(
        thread.id,
        run.id
      );

      if (status === 'completed') {
        completed = true;

        break;
      }

      if (status !== 'in_progress') {
        throw new HTTPException(
          {
            code: PDFToSlidesErrorCode.PROCESSING_ERROR,
            message: 'An error occurred while processing the file',
          },
          500
        );
      }

      await new Promise((resolve) => {
        setTimeout(resolve, 3_000);
      });
    }

    const messages = await openAI.beta.threads.messages.list(thread.id);

    const answer = messages.data?.find(({ role }) => role === 'assistant')
      ?.content?.[0];

    if (!answer || answer.type !== 'text') {
      throw new HTTPException(
        {
          code: PDFToSlidesErrorCode.PROCESSING_ERROR,
          message: 'An error occurred while processing the file',
        },
        500
      );
    }

    const json: z.infer<typeof pdfToSlidesResponseSchema> = JSON.parse(
      answer.text.value
    );

    return context.json(json);
  }
);

export default app;

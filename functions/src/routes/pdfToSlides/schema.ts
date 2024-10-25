import { z } from 'zod';
import { zodToJsonSchema } from 'zod-to-json-schema';

const MAX_FILE_SIZE = 10 * 1_024 * 1_024; // 10MB

export const pdfToSlidesPostSchema = z.object({
  file: z.custom<File>().superRefine(async (blob, context) => {
    if (!blob?.size) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'You have selected an empty file',
      });

      return z.NEVER;
    }

    if (blob.type !== 'application/pdf') {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Only PDF files are supported',
      });
    }

    if (blob.size > MAX_FILE_SIZE) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'File too big',
      });
    }

    return z.NEVER;
  }),
});

export const pdfToSlidesResponseSchema = z.object({
  slides: z.array(
    z.object({
      title: z.object({
        value: z.string(),
        top: z.number(),
        left: z.number(),
        width: z.number(),
        height: z.number(),
      }),
      body: z.object({
        value: z.string(),
        top: z.number(),
        left: z.number(),
        width: z.number(),
        height: z.number(),
      }),
    })
  ),
});

export const pdfToSlidesResponseJSONSchema = zodToJsonSchema(
  pdfToSlidesResponseSchema,
  'pdfToSlidesResponseJSONSchema'
);

import { InferResponseType } from 'hono';

import { api } from '../client/main-sidebar/api';

export const fillSlides = (
  data: InferResponseType<typeof api.pdfToSlides.$post>['slides']
) => {
  const presentation = SlidesApp.getActivePresentation();

  data.forEach(({ title, body }) => {
    const slide = presentation.appendSlide();

    slide
      .insertTextBox(
        title.value,
        title.left,
        title.top,
        title.width,
        title.height
      )
      .getText()
      .getTextStyle()
      .setBold(true)
      .setFontSize(24);
    slide
      .insertTextBox(body.value, body.left, body.top, body.width, body.height)
      .getText()
      .getTextStyle()
      .setFontSize(16);
  });
};

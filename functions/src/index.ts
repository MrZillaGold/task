import { getRequestListener } from '@hono/node-server';
import { onRequest } from 'firebase-functions/v2/https';

import { app } from './hono';

import pdfToSlidesRoute from './routes/pdfToSlides';

const routes = app.route('/pdfToSlides', pdfToSlidesRoute);
export type APIRoutes = typeof routes;

export const api = onRequest(getRequestListener(app.fetch));

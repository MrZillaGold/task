import { hc } from 'hono/client';

import { APIRoutes } from 'functions/src';

export const api = hc<APIRoutes>(
  'http://127.0.0.1:5001/qualtir/us-central1/api'
);

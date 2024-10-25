import { Hono } from 'hono';
import { logger } from 'firebase-functions';
// import { cors } from 'hono/cors';

import { HTTPException, IS_DEVELOPMENT_MODE } from './utils';

export const enum CommonErrorCode {
  COMMON = 'common',
  INTERNAL = 'internal',
  UNKNOWN_METHOD = 'unknown_method',
}

export const app = new Hono();

/*
app.use(
  '*',
  cors({
    origin: [SITE_URL],
  })
);
*/

app.onError(async (error, context) => {
  if (error instanceof HTTPException) {
    return error.getResponse();
  }

  if (IS_DEVELOPMENT_MODE) {
    logger.log(error);
  }

  if (error.constructor.name === 'HTTPException') {
    throw new HTTPException(
      {
        code: CommonErrorCode.COMMON,
        message: await context.res.text(),
      },
      context.res.status as ConstructorParameters<typeof HTTPException>[1]
    );
  }

  throw new HTTPException(
    {
      code: CommonErrorCode.INTERNAL,
      message: 'Internal server error',
    },
    500
  );
});

app.notFound(() => {
  throw new HTTPException(
    {
      code: CommonErrorCode.UNKNOWN_METHOD,
      message: 'Unknown method',
    },
    404
  );
});

export * from './utils';

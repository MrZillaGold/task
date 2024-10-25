import { zValidator as validator } from '@hono/zod-validator';

import { HTTPException } from './HTTPException';

export const zValidator: typeof validator = (target, schema) =>
  validator(target, schema, (result) => {
    if (!result.success) {
      throw new HTTPException(
        {
          code: 'validation_error',
          message: String(
            Object.entries(result.error.flatten().fieldErrors).map(
              ([key, value]) => `${key}: ${value}`
            )
          ),
        },
        400
      );
    }

    return result.data;
  });

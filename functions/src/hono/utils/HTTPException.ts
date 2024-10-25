import { HTTPException as Exception } from 'hono/http-exception';

export interface HTTPExceptionOptions {
  code: string;
  message: string;
}

export class HTTPException extends Exception {
  readonly #code: string;

  constructor(
    { code, message }: HTTPExceptionOptions,
    statusCode: NonNullable<ConstructorParameters<typeof Exception>[0]>
  ) {
    super(statusCode, {
      message,
    });

    this.#code = code;
  }

  getResponse(): Response {
    return new Response(
      JSON.stringify({
        error: {
          code: this.#code,
          message: this.message,
        },
      }),
      {
        status: this.status,
        headers: {
          'Content-Type': 'application/json; charset=UTF-8',
        },
      }
    );
  }
}

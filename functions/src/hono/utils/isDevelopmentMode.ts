export const IS_DEVELOPMENT_MODE =
  process.env.MODE === 'development' || Boolean(process.env.FUNCTIONS_EMULATOR);

import { GASClient } from 'gas-client';

import * as publicServerFunctions from '../../server';

export const { serverFunctions } = new GASClient<typeof publicServerFunctions>({
  allowedDevelopmentDomains: (origin) =>
    /https:\/\/.*\.googleusercontent\.com$/.test(origin),
});

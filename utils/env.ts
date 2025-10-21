import * as dotenv from 'dotenv';
import * as path from 'path';

const environment = process.env.ENV || 'dev';

dotenv.config({ path: path.resolve(process.cwd(), `.env.${environment}`) });

export const EnvConfig = {
    env: environment,
    baseUrl: process.env.BASE_URL || 'http://localhost:3000',
};

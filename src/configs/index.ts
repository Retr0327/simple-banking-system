import { config } from 'dotenv';
import { z } from 'zod';

config();

const configSchema = z
  .object({
    NODE_ENV: z.enum(['test', 'development', 'production']),
    MYSQL_HOST: z.string().min(1),
    MYSQL_USER: z.string().min(1),
    MYSQL_PASSWORD: z.string().min(1),
    MYSQL_DATABASE: z.string().min(1),
  })
  .transform((env) => ({
    nodeEnv: env.NODE_ENV,
    mysqlHost: env.MYSQL_HOST,
    mysqlUser: env.MYSQL_USER,
    mysqlPassword: env.MYSQL_PASSWORD,
    mysqlDb: env.MYSQL_DATABASE,
  }));

export type Env = z.infer<typeof configSchema>;
export const env = configSchema.parse(process.env);
export default () => env;

import 'dotenv/config';
import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import * as schema from './schema';
import { env } from '@/lib/env/server';

const sql = neon(env.DATABASE_URL);
const db = drizzle(sql, { logger: true, schema });

export default db;

import pkg from '@prisma/client';
const { PrismaClient } = pkg;

import mariadb from 'mariadb';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';
import fs from 'fs';

// 1. Create the MariaDB Connection Pool
const pool = mariadb.createPool({
  host: process.env.HOST || '127.0.0.1', // Use 127.0.0.1 to avoid IPv6 issues
  port: parseInt(process.env.PORT) || 3306,
  user: process.env.DB_USER,      // Check your .env variable names
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,  // Fix: Previously was set to process.env.HOST
  ssl: { 
    ca: fs.readFileSync('./ca.pem') 
  },
  connectionLimit: 10
});

// 2. Initialize the Adapter
const adapter = new PrismaMariaDb(pool);

// 3. Instantiate the Client with the Adapter
export const prisma = new PrismaClient({ adapter });
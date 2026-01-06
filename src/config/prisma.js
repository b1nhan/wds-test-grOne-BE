import dotenv from 'dotenv'
dotenv.config();
import pkg from '@prisma/client';
const { PrismaClient } = pkg;

import { PrismaMariaDb } from '@prisma/adapter-mariadb';
import fs from 'fs';


// 2. Initialize the Adapter
const adapter = new PrismaMariaDb({
  host: process.env.DB_HOST || '127.0.0.1', // Use 127.0.0.1 to avoid IPv6 issues
  port: parseInt (process.env.DB_PORT) || 3306,
  user: process.env.DB_USERNAME, 
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  // ssl: {
  //   ca: fs.readFileSync('./ca.pem'),
  //   rejectUnauthorized: false,
  // },
  connectionLimit: 20,
});

// 3. Instantiate the Client with the Adapter
export const prisma = new PrismaClient({ adapter });




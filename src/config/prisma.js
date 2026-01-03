import { PrismaClient } from "@prisma/client";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";

// 2. Initialize the Adapter
const adapter = new PrismaMariaDb({
  host: process.env.DB_HOST, // Use 127.0.0.1 to avoid IPv6 issues
  port: parseInt(process.env.DB_PORT),
  user: process.env.DB_USERNAME, // Check your .env variable names
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE, // Fix: Previously was set to process.env.HOST
  connectionLimit: 10,
});

// 3. Instantiate the Client with the Adapter
export const prisma = new PrismaClient({ adapter });

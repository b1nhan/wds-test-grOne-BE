import { Hono } from 'hono';
import { cors } from 'hono/cors'; 

const app = new Hono();

//setup CORS
app.use(
  '*',
  cors({
    origin: 'http://localhost:5173',
    credentials: true
  })
);

// test
import authRoutes from './routes/test.route.js';
app.route('/api/test', authRoutes);

export default app;
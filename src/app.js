import { Hono } from 'hono';
import { cors } from 'hono/cors'; 
import authRoutes from './routes/auth.route.js';

const app = new Hono();

//Middleware
app.use('*', cors({ 
  origin: 'http://localhost:5173',
  credentials: true 
}));

// Routes
app.route('/api/auth', authRoutes);

export default app;
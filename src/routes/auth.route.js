// test
import { Hono } from 'hono';

const authRouter = new Hono();

authRouter.post('/login', (c) => {
  return c.json({ message: 'Login OK' });
});

export default authRouter;
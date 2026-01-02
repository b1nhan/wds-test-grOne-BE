import { Hono } from 'hono';

const testRoute = new Hono();

testRoute.get('/ping', (c) => {
  return c.json({
    message: 'tesk BE ok',
    time: new Date()
  });
});

export default testRoute;

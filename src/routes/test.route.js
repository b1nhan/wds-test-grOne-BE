import { Hono } from "hono";
import { prisma } from "../config/prisma.js";

const testRoute = new Hono();

testRoute.get("/db", async (c) => {
  const users = await prisma.user.findMany();
  return c.json({
    db: "connected",
    users,
  });
});

export default testRoute;

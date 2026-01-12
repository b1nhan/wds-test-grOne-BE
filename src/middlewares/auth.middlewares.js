import { JwtHandler } from "../utils/jwt-handler.js";

export const authMiddleware = async (c, next) => {
  try {
    const authHeader = c.req.header("Authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return c.json(
        {
          success: false,
          message: "Missing or invalid Authorization header",
          statusCode: 401,
        },
        401
      );
    }

    const token = authHeader.split(" ")[1];
    const user = JwtHandler.validateToken(token);

    c.set("user", user);

    await next();
  } catch (err) {
    return c.json(
      {
        success: false,
        message: "Unauthorized: " + err.message,
        statusCode: 401,
      },
      401
    );
  }
};

export const adminMiddleware = async (c, next) => {
  const user = c.get("user");

  if (!user) {
    return c.json(
      {
        success: false,
        message: "Unauthorized: Login required",
        statusCode: 401,
      },
      401
    );
  }

  if (user.role !== "ADMIN") {
    return c.json(
      {
        success: false,
        message: "Forbidden: Admin access required",
        statusCode: 403,
      },
      403
    );
  }

  await next();
};

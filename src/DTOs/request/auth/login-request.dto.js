import { z } from "zod";

export const LoginRequestDTO = z.object({
    email: z.email("Email sai định dạng").min(5, "Email quá ngắn"),
    password: z.string().min(6, "Mật khẩu phải chứa tối thiểu 6 ký tự"),
    rememberMe: z.boolean().optional()
});
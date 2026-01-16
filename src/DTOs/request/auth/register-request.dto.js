import { z } from "zod";

export const RegisterRequestDTO = z.object({
  full_name: z.string().min(3, "Tên quá ngắn!"),
  email: z.email("Email sai định dạng!").min(5, "Email quá ngắn!"),
  password: z.string().min(8, "Mật khẩu phải chứa tối thiểu 8 ký tự!"),
  phone: z
    .string()
    .min(10, "Số điện thoại cần có độ dài là 10 ký tự số!")
    .regex(/^\d+$/, "Số điện thoại chỉ được chứa ký tự số!"),
});

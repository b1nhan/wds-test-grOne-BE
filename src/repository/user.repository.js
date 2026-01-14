import { prisma } from "../config/prisma.js";
import { ConflictException } from "../exceptions/ConflictException.js";

export const getOne = async (criteria, value) => {
    if (!['id', 'email'].includes(criteria)) {
        throw new Error(`Invalid criteria: '${criteria}'. Allowed criteria are 'id', 'email'.`);
    }

    try {
        const where = {};
        where[criteria] = value;

        const user = await prisma.user.findUnique({
            where: where
        });

        return user ? user : null;
    } catch (err) {
        throw new Error("Database error during user retrieval.");
    }
}

export const create = async (user) => {
    // Assumes function signature is: create = async (user) => { ... }
    try {
        const name = user.fullName;
        const email = user.email;
        const role = "USER"; // User only (1)
        const password = user.password;
        const phone = user.phone;

        const newUser = await prisma.user.create({
            data: {
                fullName: name,
                email,
                password,
                phone,
                role
            }
        });

        return newUser.id;
    } catch (err) {
        console.error("Error:", err);

        if (err instanceof Prisma.PrismaClientKnownRequestError) {
            if (err.code === "P2002") {
                throw new ConflictException("Email already exists.");
            }
        }

        // 2. Các lỗi khác không xác định -> Lúc này mới Masking lại để bảo mật
        throw new Error("Database error during user creation.");
    }
}

// export const updateLastLogin = async (id) => {
//     try {
//         await prisma.user.update({
//             where: { id },
//             data: { last_login: new Date() }
//         });
//     } catch (err) {
//         throw new Error("Database error during user update.");
//     }
// };
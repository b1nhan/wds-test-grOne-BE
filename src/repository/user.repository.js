import { prisma } from "../config/prisma.js";

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
        const name = user.full_name;
        const email = user.email;
        const role = "user"; // User only (1)
        const password = user.password;

        const newUser = await prisma.user.create({
            data: {
                full_name: name,
                email,
                password,
                phone,
                role
            }
        });

        return newUser.id;
    } catch (err) {
        throw new Error("Cannot create new user. Please try again.");
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
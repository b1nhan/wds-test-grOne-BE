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
        console.log ("Error:", err);
        throw new Error("Cannot create new user. Please try again.");
    }
}

export const update = async (userId, data, tx = null) => {
    const client = tx || prisma;
    try {
        return await client.user.update({
            where: { id: Number(userId) },
            data
        });
    } catch (err) {
        console.error("Database error during user update:", err);
        throw new Error("Database error during user update.");
    }
};

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
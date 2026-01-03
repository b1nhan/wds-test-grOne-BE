import { prisma } from "../config/prisma.js";

export const getAll = async () => {
    return await prisma.product.findMany();
};

export const getOne = async (id) => {
    return await prisma.product.findUnique({
        where: { id: Number(id) },
    });
};

export const search = async (searchTerm) => {
    try {
        return await prisma.product.findMany({
            where: {
                OR: [
                    {
                        name: {
                            contains: searchTerm,
                            mode: "insensitive",
                        },
                    },
                    // {
                    //     description: {
                    //         contains: searchTerm,
                    //         mode: "insensitive",
                    //     },
                    // }
                ],
            },
            // Pagination to avoid returning too much data
            take: 20,
            orderBy: {
                name: "asc",
            },
        });
    } catch (error) {
        // Log the error but do not expose the internal database structure
        console.error("Database search error:", error);
        throw new Error("Internal Server Error");
    }
}

export const create = async (data) => {
    return await prisma.product.create({
        data,
    });
};

export const update = async (id, data) => {
    return await prisma.product.update({
        where: { id: Number(id) },
        data,
    });
};

export const remove = async (id) => {
    return await prisma.product.delete({
        where: { id: Number(id) },
    });
};

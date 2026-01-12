import { BadRequestException } from "../exceptions/BadRequestException.js";
import * as userRepository from "../repository/user.repository.js";
import bcrypt from "bcrypt";

export const login = async (email, password) => {
    const user = await userRepository.getOne("email", email);

    if (!user || !(await bcrypt.compare(password, user.password))) {
        throw new BadRequestException("Invalid credentials.");
    }

    // Fire and forget
    // userRepository
    //     .updateLastLogin(user.id)
    //     .catch((err) => {
    //         console.error("Error updating last login:", err);
    //         throw new Error("Error updating last login.");
    //     });
    return user;
};

export const register = async (
    fullName,
    email,
    password,
    phone
) => {
    const existingUser = await userRepository.getOne("email", email);
    if (existingUser) {
        throw new BadRequestException("User already exists.");
    }

    const hashedPassword = bcrypt.hashSync(password, 13);

    const user = await userRepository.create({
        fullName,
        email,
        password: hashedPassword,
        phone,
    });

    return user;
}
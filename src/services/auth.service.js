import * as userRepository from "../repository/user.repository.js";
import bcrypt from "bcrypt";

export const login = async (email, password) => {
    const user = await userRepository.getOne("email", email);

    if (!user || !bcrypt.compare(password, user.password)) {
        throw new Error("Invalid credentials.");
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
        throw new Error("User already exists.");
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
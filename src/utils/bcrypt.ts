import * as bcrypt from "bcrypt";

const SALT_ROUNDS = 10;

export const hashPassword = async (password: string) => {
    const salt = await bcrypt.genSalt(SALT_ROUNDS);
    const hash = await bcrypt.hash(password, salt);
    return hash;
};
import bcrypt from "bcryptjs";
import { pool } from "../../config/db";

const createUser = async (payload: Record<string, unknown>) => {
    const { name, email, password, phone, role } = payload;
    const hashedPass = await bcrypt.hash(password as string, 10);
    const result = await pool.query(
        `INSERT INTO users (name, email, password, phone, role) VALUES ($1, $2, $3, $4, $5) RETURNING *`,
        [name, email, hashedPass, phone, role]
    );
    delete result.rows[0].password;
    return result;
};

const loginUser = async (payload: Record<string, unknown>) => {
    const { email, password } = payload;
    const isExist = await pool.query(`SELECT * FROM users WHERE email = $1`, [
        email,
    ]);
    if (isExist.rows.length === 0) {
        return null;
    }

    const user = isExist.rows[0];
    const isPasswordMatch = await bcrypt.compare(
        password as string,
        user.password
    );
    const isEmailMatch = user.email === email;
    if (!isPasswordMatch) {
        return { message: "Password does not match!" };
    };
    if (!isEmailMatch) {
        return { message: "Email does not match!" };
    };

	delete user.password;
	return { token: "token", user };
};

export const authService = {
    createUser,
    loginUser,
};

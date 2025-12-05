import { pool } from "../../config/db";

const getAllUsers = async () => {
    const result = await pool.query(
        `SELECT	id, name, email, phone, role FROM users`
    );
    return result;
};

const updateUserById = async (
    userId: string,
    payload: Record<string, unknown>
) => {
    const id = userId;
    const keys = [];
    const values = [];
    let index = 1;

    for (const [key, value] of Object.entries(payload)) {
        if (key !== "password" && value !== undefined) {
            keys.push(`${key} = $${index}`);
            values.push(value);
            index++;
        }
    }
    if (keys.length === 0) {
        throw new Error("No valid fields to update.");
    }
    values.push(id);

    const query = `
		UPDATE users SET ${keys.join(", ")} WHERE id = $${index}
		RETURNING id, name, email, phone, role
	`;
    const result = await pool.query(query, values);
    return result;
};

const deleteUserById = async(id: string) => {
    const getBookings = await pool.query(`SELECT * FROM bookings WHERE customer_id = $1`, [id]);
    const userBookings = getBookings.rows;
    for(let i = 0; i < userBookings.length; i++) {
        if(userBookings[i].status === "active") {
            return "Cannot delete user with active bookings";
        }
    }
	const result = await pool.query(
		`DELETE FROM users WHERE id = $1 RETURNING id, name, email, phone, role`,
		[id]
	);
	return result.rows;
};

export const userService = {
    getAllUsers,
    updateUserById,
	deleteUserById
};

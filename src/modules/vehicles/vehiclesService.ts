import { pool } from "../../config/db";

const createVehicles = async (payload: Record<string, unknown>) => {
    const {
        vehicle_name,
        type,
        registration_number,
        daily_rent_price,
        availability_status,
    } = payload;
    if (!vehicle_name || !registration_number || !daily_rent_price) {
        const missingFields = [];

        if (!vehicle_name) missingFields.push("vehicle_name");
        if (!registration_number) missingFields.push("registration_number");
        if (!daily_rent_price) missingFields.push("daily_rent_price");

        return `Missing required fields: ${missingFields.join(", ")}`;
    }

    const allowedTypes = ["car", "bike", "van", "SUV"];
    const allowedStatus = ["available", "booked"];

    if (type && !allowedTypes.includes(type as string)) {
        return `Invalid type. Allowed: ${allowedTypes.join(", ")}`;
    }

    if (
        availability_status &&
        !allowedStatus.includes(availability_status as string)
    ) {
        return `Invalid availability_status. Allowed: ${allowedStatus.join(
            ", "
        )}`;
    }

    const newObj: any = {
        vehicle_name,
        type: type || null,
        registration_number,
        daily_rent_price,
        availability_status: availability_status || null,
    };

    // add to db
    const insertQuery = `
		INSERT INTO vehicles 
		(vehicle_name, type, registration_number, daily_rent_price, availability_status)
		VALUES ($1, $2, $3, $4, $5)
		RETURNING *;
	`;

    const values = [
        newObj.vehicle_name,
        newObj.type,
        newObj.registration_number,
        newObj.daily_rent_price,
        newObj.availability_status,
    ];

    const result = await pool.query(insertQuery, values);
    return result;
};

const getAllVehicles = async () => {
    const result = await pool.query(`SELECT * FROM vehicles`);
    return result;
};

const getVehiclesById = async (id: string) => {
    const result = await pool.query(`SELECT * FROM vehicles WHERE id = $1`, [
        id,
    ]);
    return result;
};

const updateVehiclesById = async (
    id: string,
    payload: Record<string, unknown>
) => {
    const validStatuses = ["booked", "available"];

    if (!validStatuses.includes(payload.availability_status as string)) {
        return "Invalid availability_status. Allowed: " + validStatuses.join(", ");
    }
    const keys = [];
    const values = [];
    let index = 1;

    for (const [key, value] of Object.entries(payload)) {
        keys.push(`${key} = $${index}`);
        values.push(value);
        index++;
    }
    if (keys.length === 0) {
        return "No valid fields to update.";
    }
    values.push(id);

    const query = `
		UPDATE vehicles SET ${keys.join(", ")} WHERE id = $${index}
		RETURNING id, vehicle_name, type, registration_number, daily_rent_price, availability_status
	`;
    const result = await pool.query(query, values);
    if(result.rowCount === 0) return "Vehicles not found";
    return result.rows[0];
};

const deleteVehiclesById = async (id: string) => {
    const result = await pool.query(
        `DELETE FROM vehicles WHERE id = $1 RETURNING *`,
        [id]
    );
    return result;
};

export const vehiclesService = {
    createVehicles,
    getAllVehicles,
    getVehiclesById,
    updateVehiclesById,
    deleteVehiclesById,
};

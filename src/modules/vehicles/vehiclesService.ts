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

export const vehiclesService = {
    createVehicles,
};

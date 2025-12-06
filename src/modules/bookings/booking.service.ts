import { pool } from "../../config/db";
import { vehiclesService } from "../vehicles/vehiclesService";

const createBookings = async(payload: Record<string, unknown>) => {
	const { customer_id, vehicle_id, rent_start_date, rent_end_date, status } = payload;
	if(!customer_id || !vehicle_id || !rent_start_date || !rent_end_date) {
		const missingFields = [];

		if(!customer_id) missingFields.push("customer_id");
		if(!vehicle_id) missingFields.push("vehicle_id");
		if(!rent_start_date) missingFields.push("rent_start_date");
		if(!rent_end_date) missingFields.push("rent_end_date");

		return `Missing required fields: ${missingFields.join(", ")}`;
	};

	if(status && status !== "active") {
		return `Invalid status. Allowed: active`;
	};

	const getVehicle = await vehiclesService.getVehiclesById(vehicle_id as string);
	if(!getVehicle) return "Vehicle not found";
	if(getVehicle.rows[0].availability_status === "booked") return "Vehicle is not available";
	const daily_rent_price = parseInt(getVehicle.rows[0].daily_rent_price);
	const total_time = new Date(rent_end_date as string).getTime() - new Date(rent_start_date as string).getTime();
	const total_days = Math.ceil(total_time / (1000 * 60 * 60 * 24));
	const total_price = daily_rent_price * total_days;

	const newObj: any = {
		customer_id,
		vehicle_id,
		rent_start_date,
		rent_end_date,
		total_price,
		status: status || "active",
	};
	//* update vehicle availability status to "booked"
	await vehiclesService.updateVehiclesById(vehicle_id as string, { availability_status: "booked" });
	const query = `
		INSERT INTO bookings 
		(customer_id, vehicle_id, rent_start_date, rent_end_date, total_price, status) 
		VALUES ($1, $2, $3, $4, $5, $6) RETURNING *
	`;
	const values = [
		newObj.customer_id,
		newObj.vehicle_id,
		newObj.rent_start_date,
		newObj.rent_end_date,
		newObj.total_price,
		newObj.status
	]
	const result: any = await pool.query(query, values);
	result.rows[0].vehicle = getVehicle.rows.length > 0 ? getVehicle.rows[0] : null;
	return result;
};

const getAllBookings = async() => {
	const result = await pool.query(`SELECT * FROM bookings`);
	const newData = result.rows;

	for (let i = 0; i < newData.length; i++) {
		const booking = newData[i];
		const customer_id = booking.customer_id;
		const vehicle_id = booking.vehicle_id;
		const getCustomer = await pool.query(`SELECT * FROM users WHERE id = ${customer_id}`);
		const getVehicle = await pool.query(`SELECT * FROM vehicles WHERE id = ${vehicle_id}`);
		booking.customer = getCustomer.rows.length > 0 ? getCustomer.rows[0] : null;
		booking.vehicle = getVehicle.rows.length > 0 ? getVehicle.rows[0] : null;
	};
	return result;
};

const getAllBookingsByUserId = async(id: string) => {
	const result = await pool.query(`SELECT * FROM bookings WHERE customer_id = ${id}`);
	return result;
}

const updateBookingsById = async(id: string, payload: Record<string, unknown>) => {};

export const bookingService = {
	createBookings,
	getAllBookings,
	getAllBookingsByUserId,
	updateBookingsById
};
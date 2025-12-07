import { pool } from "../../config/db";
import { vehiclesService } from "../vehicles/vehiclesService";

const createBookings = async (payload: Record<string, unknown>) => {
    const { customer_id, vehicle_id, rent_start_date, rent_end_date, status } =
        payload;
    if (!customer_id || !vehicle_id || !rent_start_date || !rent_end_date) {
        const missingFields = [];

        if (!customer_id) missingFields.push("customer_id");
        if (!vehicle_id) missingFields.push("vehicle_id");
        if (!rent_start_date) missingFields.push("rent_start_date");
        if (!rent_end_date) missingFields.push("rent_end_date");

        return `Missing required fields: ${missingFields.join(", ")}`;
    }

    if (status && status !== "active") {
        return `Invalid status. Allowed: active`;
    }

    const getVehicle = await vehiclesService.getVehiclesById(
        vehicle_id as string
    );
    if (!getVehicle) return "Vehicle not found";
    if (getVehicle.rows[0].availability_status === "booked")
        return "Vehicle is not available";
    const daily_rent_price = parseInt(getVehicle.rows[0].daily_rent_price);
    const total_time =
        new Date(rent_end_date as string).getTime() -
        new Date(rent_start_date as string).getTime();
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
    await vehiclesService.updateVehiclesById(vehicle_id as string, {
        availability_status: "booked",
    });
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
        newObj.status,
    ];
    const result: any = await pool.query(query, values);
    result.rows[0].vehicle =
        getVehicle.rows.length > 0 ? getVehicle.rows[0] : null;
    return result;
};

const getAllBookings = async () => {
    const result = await pool.query(`SELECT * FROM bookings`);
    const newData = result.rows;

    for (let i = 0; i < newData.length; i++) {
        const booking = newData[i];
        const customer_id = booking.customer_id;
        const vehicle_id = booking.vehicle_id;
        const getCustomer = await pool.query(
            `SELECT * FROM users WHERE id = ${customer_id}`
        );
        const getVehicle = await pool.query(
            `SELECT * FROM vehicles WHERE id = ${vehicle_id}`
        );
        booking.customer =
            getCustomer.rows.length > 0 ? getCustomer.rows[0] : null;
        booking.vehicle =
            getVehicle.rows.length > 0 ? getVehicle.rows[0] : null;
    }
    return result;
};

const getAllBookingsByUserId = async (id: string) => {
    const result = await pool.query(
        `SELECT * FROM bookings WHERE customer_id = ${id}`
    );
    const vehicle = await pool.query(
        `SELECT * FROM vehicles WHERE id = ${result.rows[0].vehicle_id}`
    );
    result.rows[0].vehicle = vehicle.rows[0];
    return result;
};

const updateBookingsById = async (id: string, user: any) => {
    if (user.role === "admin") {
        const status = "returned";

        const updateStatusAsReturned = await pool.query(
            `UPDATE bookings 
			SET status = $1 
			WHERE id = $2 
			RETURNING *`,
            [status, id]
        );

        if (updateStatusAsReturned.rowCount === 0) {
            return "Booking not found or could not update status";
        }

        // updated booking
        const booking = updateStatusAsReturned.rows[0];
        const vehicle_id = booking.vehicle_id;

        const availability_status = "available";

        const updateVehiclesAvailabilityStatus = await pool.query(
            `UPDATE vehicles 
			SET availability_status = $1 
			WHERE id = $2 
			RETURNING *`,
            [availability_status, vehicle_id]
        );

        if (updateVehiclesAvailabilityStatus.rowCount === 0) {
            return "Vehicle not found or could not update availability";
        }

        const vehicle = updateVehiclesAvailabilityStatus.rows[0];

        const result = {
            ...booking,
            vehicle: { ...vehicle },
        };
        return {
            data: result,
            message: "Booking marked as returned. Vehicle is now available",
        };
    } else if (user.role === "customer") {
        const bookingData = await pool.query(
            `SELECT * FROM bookings WHERE id = $1`,
            [id]
        );
        const booking = bookingData.rows[0];
        if (bookingData.rowCount === 0) {
            return "Booking not found or you are not the customer";
        }
        const today = new Date();
        const rentStart = new Date(booking.rent_start_date);
        if (today < rentStart) {
            const status = "cancelled";
            const result = await pool.query(
                `UPDATE bookings 
				SET status = $1 
				WHERE id = $2 
				RETURNING *`,
                [status, id]
            );
            return {
                data: result.rows[0],
                message: "Booking cancelled successfully",
            };
        }
        return "You cannot cancel a booking that has already started.";
    }
};

export const bookingService = {
    createBookings,
    getAllBookings,
    getAllBookingsByUserId,
    updateBookingsById,
};

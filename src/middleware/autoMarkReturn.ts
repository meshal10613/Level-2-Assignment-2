import nodeCron from "node-cron";
import { pool } from "../config/db";

const autoMarkReturn = () => {
    nodeCron.schedule("* * * * *", async () => {
        console.log("Running auto-return cron...");
        const query = `
			UPDATE bookings
			SET status = 'returned'
			WHERE rent_end_date < NOW() 
			AND status != 'returned'
			RETURNING *;
		`;
        const result = await pool.query(query);
        if ((result.rowCount as number) > 0) {
            console.log(`Auto-returned ${result.rowCount} booking(s).`);
            const vehicleIds = result.rows.map((b) => b.vehicle_id);    
            const vehicleQuery = `
                    UPDATE vehicles
                    SET availability_status = 'available'
                    WHERE id = ANY($1::int[])
                    RETURNING *;
                `;
            const updateResult = await pool.query(vehicleQuery, [vehicleIds]);
            console.log(
                `Updated ${updateResult.rowCount} vehicle(s) to available.`
            );
        }
    });
};

export default autoMarkReturn;

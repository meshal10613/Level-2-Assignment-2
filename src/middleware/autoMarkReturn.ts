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
			RETURNING id;
		`;
        const result = await pool.query(query);
        if (result.rowCount as number > 0) {
            console.log(`Auto-returned ${result.rowCount} booking(s).`);
        }
    });
};

export default autoMarkReturn;

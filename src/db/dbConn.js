import mongoose from "mongoose";
import logger from "../utils/logger.js";

const createDBConnection = async () => {
	try {
		await mongoose.connect(process.env.MONGO_URI);
		logger.info("Connected to MongoDB");
	} catch (err) {
		logger.error(`Error while connecting to db:${JSON.stringify(err?.message)}`);
	}
};

export { createDBConnection };

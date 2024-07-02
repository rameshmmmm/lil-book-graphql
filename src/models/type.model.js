import { Schema, model } from "mongoose";

const typesSchema = new Schema({
	name: {
		type: String,
		required: true,
		// enum: ["international", "national", "regional", "local"],
	},
});

export default model("Type", typesSchema);

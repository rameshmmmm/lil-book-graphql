import { Schema, model } from "mongoose";

const lilBooksSchema = new Schema(
	{
		title: {
			type: String,
			required: true,
			minLength: [1, "Must be at least 1, got {value}"],
		},
		details: {
			type: String,
			required: true,
		},
		type: {
			type: Schema.Types.ObjectId,
			ref: "Type",
			populate: { select: "name" },
		},
	},
	{ timestamps: true },
);

export default model("LilBook", lilBooksSchema);

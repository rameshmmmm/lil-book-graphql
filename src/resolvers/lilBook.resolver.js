import { ObjectId } from "mongodb";
import LilBookModel from "../models/lilBook.model.js";
import logger from "../utils/logger.js";
import { getType, getTypeById } from "../utils/db.utils.js";

const LilBookResolver = {
	Query: {
		lilBooks: async () => {
			try {
				const lilBooks = await LilBookModel.aggregate([
					{
						$lookup: {
							from: "types",
							localField: "type",
							foreignField: "_id",
							as: "type",
						},
					},
					{ $unwind: "$type" },
					{
						$project: {
							_id: 1,
							title: 1,
							details: 1,
							type: "$type.name",
						},
					},
				]);
				return lilBooks;
			} catch (err) {
				logger.error(`Error getting lil books: ${err?.message}`);
				throw new Error("Error getting lil books");
			}
		},
		lilBook: async (_, { lilBookId }) => {
			try {
				const actualLilBookId = new ObjectId(lilBookId);
				const lilBook = await LilBookModel.aggregate([
					{ $match: { _id: actualLilBookId } },
					{
						$lookup: {
							from: "types",
							localField: "type",
							foreignField: "_id",
							as: "type",
						},
					},
					{ $unwind: "$type" },
					{
						$project: {
							_id: 1,
							title: 1,
							details: 1,
							type: "$type.name",
						},
					},
				]);
				return lilBook?.[0];
			} catch (err) {
				logger.error(`Error getting lil book: ${err?.message}`);
				throw new Error("Error getting the lil book");
			}
		},
	},
	Mutation: {
		createLilBook: async (_, { input }) => {
			try {
				let type;
				if (input?.type) {
					type = await getType(input.type);
					input.type = type?._id;
				}
				const newLilBook = new LilBookModel({
					...input,
				});
				await newLilBook.save();
				return {
					_id: newLilBook?._id,
					title: newLilBook?.title,
					details: newLilBook?.details,
					type: type?.name,
				};
			} catch (err) {
				logger.error(`Error creating lil book: ${err?.message}`);
				throw new Error("Error creating lil book");
			}
		},
		updateLilBook: async (_, { input }) => {
			try {
				if (input?.type) {
					input.type = await getType(input.type)?._id;
				}
				const updatedLilBook = await LilBookModel.findByIdAndUpdate(
					input?.lilBookId,
					input,
					{
						new: true,
					},
				).select("_id title details type");
				const type = await getTypeById(updatedLilBook.type);
				return {
					_id: updatedLilBook?._id,
					title: updatedLilBook?.title,
					details: updatedLilBook?.details,
					type: type?.name,
				};
			} catch (err) {
				logger.error(`Error updating lil book: ${err?.message}`);
				throw new Error("Error updating lil book");
			}
		},
		removeLilBook: async (_, { lilBookId }) => {
			try {
				const removedLilBook =
					await LilBookModel.findByIdAndDelete(lilBookId);
				return !!removedLilBook?.title;
			} catch (err) {
				logger.error(`Error removing lil book: ${err?.message}`);
				throw new Error("Error removing lil book");
			}
		},
	},
	// Transaction: {
	// 	user: async (parent) => {
	// 		const userId = parent.userId;
	// 		try {
	// 			const user = await User.findById(userId);
	// 			return user;
	// 		} catch (err) {
	// 			logger.error("Error getting user:", err);
	// 			throw new Error("Error getting user");
	// 		}
	// 	},
	// },
};

export default LilBookResolver;

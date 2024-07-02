import Type from "../models/type.model.js";

export const getTypeById = async (id) => {
	const type = await Type.findById(id);
	// eslint-disable-next-line no-underscore-dangle
	return type;
};

export const getType = async (val) => {
	const type = await Type.findOne({ name: val?.toLowerCase() });
	// eslint-disable-next-line no-underscore-dangle
	return type;
};

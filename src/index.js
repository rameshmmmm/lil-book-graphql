import express from "express";
import { config } from "dotenv";
import cors from "cors";
import { createDBConnection } from "./db/dbConn.js";
import logger from "./utils/logger.js";
import LilBookTypeDef from "./typedefs/lilBook.typedef.js";
import LilBookResolver from "./resolvers/lilBook.resolver.js";
import { ApolloServer } from "@apollo/server";
// import { buildSubgraphSchema } from "@apollo/subgraph";
import { expressMiddleware } from "@apollo/server/express4";

config();

const port = process.env.PORT;
const app = express();

const setupServer = async () => {
	app.listen(port, () => {
		logger.info(`Server started successfully at port ${port}`);
	});

	const server = new ApolloServer({ typeDefs: LilBookTypeDef, resolvers: LilBookResolver });
	await server.start();

	app.use(
		"/graphql",
		cors({
			origin: "http://localhost:3000",
		}),
		express.json(),
		expressMiddleware(server),
	);
};


createDBConnection().then(async () => {
	try {
		await setupServer();
	} catch (e) {
		logger.error(`Error setting up the server ${e?.message}`);
	}
}).catch(e=>logger.error(`Error connecting to db. ${e?.message}`));

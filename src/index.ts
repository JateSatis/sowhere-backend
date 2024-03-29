require("dotenv").config();

import { DataSource } from "typeorm";
import { User } from "./entities/User";
import { Publication } from "./entities/Publication";

import express from "express";
import { createPublicatonRouter } from "./routes/create_publication";
import { authenticateRouter } from "./routes/authentication";
import { getPublicationsRouter } from "./routes/get_publications";

const app = express();

const main = async () => {
  try {
    const myDataSource = new DataSource({
      type: "postgres",
      host: process.env.POSTGRES,
      port: 5433,
      username: "postgres",
      password: "6Akshn21",
      database: "sowhere",
      entities: [User, Publication],
      synchronize: true,
    });
    await myDataSource.initialize();
    console.log("Connected to PostgreSQL");

    app.use(express.json());
    app.use(createPublicatonRouter);
		app.use(authenticateRouter);
		app.use(getPublicationsRouter)

    app.listen(3000, () => {
      console.log("Server now running at port 3000");
    });
  } catch (error) {
    console.error(error);
    throw new Error("Unable to connect to PostgreSQL database");
  }
};

main();

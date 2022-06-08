import express, {json} from "express";
import chalk from "chalk";
import cors from "cors";
import dotenv from "dotenv";

import signUpRouter from "./routes/signupRouter.js";

const server = express();
server.use(cors());
server.use(json());
dotenv.config();

server.use(signUpRouter);

const port = process.env.PORT;
server.listen(port, () => console.log(chalk.bold.magentaBright(`server running on port ${port}`)));
import express, {json} from "express";
import chalk from "chalk";
import cors from "cors";
import dotenv from "dotenv";

import signUpRouter from "./routes/signupRouter.js";
import signInRouter from "./routes/signinRouter.js";
import urlsRouter from "./routes/urlsRouter.js";
import userRouter from "./routes/usersRouter.js";

const server = express();
server.use(cors());
server.use(json());
dotenv.config();

server.use(signUpRouter);
server.use(signInRouter);
server.use(urlsRouter);
server.use(userRouter);

const port = process.env.PORT;
server.listen(port, () => console.log(chalk.bold.magentaBright(`server running on port ${port}`)));
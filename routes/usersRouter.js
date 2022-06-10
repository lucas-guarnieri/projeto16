import { Router } from "express";

import { getUSer, getRanking } from "../controllers/usersController.js";
import { tokenValidation } from "../middlewares/tokenValidation.js";

const userRouter = Router();

userRouter.get("/users/:id", tokenValidation, getUSer);
userRouter.get("/ranking", getRanking);

export default userRouter;
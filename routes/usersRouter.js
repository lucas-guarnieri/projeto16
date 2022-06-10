import { Router } from "express";

import { getUSer } from "../controllers/usersController.js";
import { tokenValidation } from "../middlewares/tokenValidation.js";

const userRouter = Router();

userRouter.get("/users/:id", tokenValidation, getUSer);

export default userRouter;
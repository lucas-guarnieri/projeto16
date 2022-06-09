import { Router } from "express";

import { signIn } from "../controllers/usersController.js";
import { signInValidation } from "../middlewares/singInValidation.js";

const signInRouter = Router();

signInRouter.post("/signin",signInValidation, signIn);

export default signInRouter;
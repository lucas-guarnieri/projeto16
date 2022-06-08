import { Router } from "express";

import { signUp } from "../controllers/usersController.js";
import { signUpValidation } from "../middlewares/signUpValidation.js";

const signUpRouter = Router();

signUpRouter.post("/signup", signUpValidation, signUp);

export default signUpRouter;
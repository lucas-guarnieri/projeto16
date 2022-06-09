import { Router } from "express";

import { postUrl } from "../controllers/urlsController.js";

import { urlsValidation } from "../middlewares/urlsValidations.js";


const urlsRouter = Router();

urlsRouter.post("/urls/shorten", urlsValidation, postUrl);

export default urlsRouter;
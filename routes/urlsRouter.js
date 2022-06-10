import { Router } from "express";

import { postUrl, getUrl, getShortUrl } from "../controllers/urlsController.js";

import { urlsValidation } from "../middlewares/urlsValidations.js";


const urlsRouter = Router();

urlsRouter.post("/urls/shorten", urlsValidation, postUrl);
urlsRouter.get("/urls/:id", getUrl);
urlsRouter.get("/urls/open/:shortUrl", getShortUrl);

export default urlsRouter;
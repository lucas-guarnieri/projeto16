import { Router } from "express";

import { postUrl, getUrl, getShortUrl, deleteUrl } from "../controllers/urlsController.js";
import { urlsValidation } from "../middlewares/urlsValidations.js";
import { tokenValidation } from "../middlewares/tokenValidation.js"


const urlsRouter = Router();

urlsRouter.post("/urls/shorten", urlsValidation, postUrl);
urlsRouter.get("/urls/:id", getUrl);
urlsRouter.get("/urls/open/:shortUrl", getShortUrl);
urlsRouter.delete("/urls/:id", tokenValidation, deleteUrl);

export default urlsRouter;
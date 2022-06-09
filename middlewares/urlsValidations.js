import joi from "joi";


export function urlsValidation(req, res, next){
    const url = req.body;
    const authorization = req.headers;

    if (!authorization){
        res.sendStatus(401);
        return;
    }
    const urlsSchema = joi.object({
        url: joi.string().uri().required(),
    });
    
    const validation = urlsSchema.validate(url);
    if (validation.error) {
        res.status(422).send(validation.error.details);
        return;
    }
    next();
}
import joi from "joi";


export function signInValidation(req, res, next){
    const user = req.body;
    const userSignInSchema = joi.object({
        email: joi.string().email().required(),
        password: joi.string().required()
    });
    
    const validation = userSignInSchema.validate(user);
    if (validation.error) {
        res.status(422).send(validation.error.details);
        return;
    }
    next();
}
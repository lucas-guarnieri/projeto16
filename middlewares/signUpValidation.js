import joi from "joi";


export function signUpValidation(req, res, next){
    const user = req.body;
    const userSignUpSchema = joi.object({
        name: joi.string().required(),
        email: joi.string().email().required(),
        password: joi.string().required(),
        confirmPassword: joi.ref("password")
    });
    const validation = userSignUpSchema.validate(user);
    if (validation.error) {
        res.status(422).send(validation.error.details);
        return;
    }
    next();
}
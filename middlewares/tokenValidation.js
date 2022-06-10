
export function tokenValidation(req, res, next){
    const { authorization } = req.headers;

    if (!authorization){
        res.sendStatus(401);
        return;
    }

    next();
}
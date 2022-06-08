import db from "./../db.js"
import bcrypt from 'bcrypt';

export async function signUp(req, res){
    const newUser = req.body;
    
    try {
        const check = await db.query(`
            SELECT *
            FROM users
            WHERE email = $1;`,
            [(newUser.email)]
        ); 
        if (check.rows.length < 1){
            await db.query(`
                INSERT
                INTO users (name, email, password)
                VALUES ($1, $2, $3);`, 
                [newUser.name, newUser.email, bcrypt.hashSync(newUser.password, 10)]
            );
            res.sendStatus(201);
        } else {
            res.status(409).send("user already exists");
        }
    } catch (error) {
        console.log(error);
        res.status(500).send("error registering new user");
    }
    
}
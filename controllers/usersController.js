import db from "./../db.js"
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken';
import dotenv from "dotenv";

dotenv.config();

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

export async function signIn(req, res){
    const login = req.body;

    try {
        const user = await db.query(`
            SELECT *
            FROM users
            WHERE email = $1;`,
            [login.email]
        );
        if (user.rowCount != 0 && bcrypt.compareSync(login.password, user.rows[0].password)){
            const data = { userId:  user.rows[0].id }
            const token = jwt.sign(data, process.env.JWT_SECRET);
            await db.query(`
                INSERT
                INTO sessions ("userId", token)
                VALUES ($1, $2);`,
                [user.rows[0].id, token]
            )
            res.status(200).send(token);
        } else {
            res.sendStatus(401);
        }
    } catch (error) {
        console.log(error);
        res.status(500).send("login error");
    }
};
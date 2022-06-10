import db from "./../db.js"
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken';
import dotenv from "dotenv";

dotenv.config();
const jwtPass = process.env.JWT_SECRET;

export async function signUp(req, res) {
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
};

export async function signIn(req, res) {
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

export async function getUSer(req, res) {
    const userId = req.params.id;
    const { authorization } = req.headers;
    const token = authorization?.replace("Bearer ", "").trim();
    try {
        const tokenData = jwt.verify(token, jwtPass);
        try {
            const session = await db.query(`
                SELECT *
                FROM sessions
                WHERE "userId" = $1 AND token =$2;`,
                [tokenData.userId, token]
            );
            if (session.rowCount != 0){
                const data = await db.query(`
                    SELECT
                    users.id AS "id", users.name, urls."visitCount", urls.id AS "urlsId", urls."shortUrl", urls.url
                    FROM users
                    JOIN urls ON urls."userId" = users.id
                    WHERE urls."userId" = $1
                    GROUP BY users.id, urls."id";`,
                    [userId]
                )
                if (data.rowCount != 0){
                    let userUrls = [];
                    let totalVisit = 0;
                    for (let urlData of data.rows) {
                        urlData = {
                            id: urlData.urlsId,
                            shortUrl: urlData.shortUrl,
                            url: urlData.url,
                            visitCount: urlData.visitCount
                        }
                        totalVisit += urlData.visitCount
                        userUrls.push(urlData);
                    }
                    const userObject = {
                        id: data.rows[0].id,
                        name: data.rows[0].name,
                        visitCount: totalVisit,
                        shortenedUrls: userUrls
                    }
                    res.status(200).send(userObject);
                } else {
                    return res.sendStatus(404);
                }
            } else {
                return res.sendStatus(401);
            }
        } catch (error) {
            console.log(error);
            res.status(500).send("loading user error");
        }
    } catch (error) {
        console.log(error);
        res.status(401).send("authorization error");
    }
};
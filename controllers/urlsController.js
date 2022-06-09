import db from "./../db.js"
import jwt from 'jsonwebtoken';
import { nanoid } from 'nanoid'
import dotenv from "dotenv";


dotenv.config();
const jwtPass = process.env.JWT_SECRET;

export async function postUrl(req, res){
    const { url } = req.body;
    const { authorization } = req.headers;
    const token = authorization?.replace("Bearer ", "").trim();

    try {
        const smallUrl = nanoid(10);
        const urlObject = { shortUrl: smallUrl }
        try{
            const tokenData = jwt.verify(token, jwtPass);
            console.log(tokenData);
            const session = await db.query(`
                SELECT *
                FROM sessions
                WHERE "userId" = $1 AND token =$2;`,
                [tokenData.userId, token]
            );
            if (session.rowCount === 0){
                return res.sendStatus(401);
            }
            await db.query(`
                INSERT
                INTO urls ("userId", url, "shortUrl")
                VALUES ($1, $2, $3);`,
                [tokenData.userId, url, smallUrl]
            )
            res.status(201).send(urlObject);
            console.log(session.rows);
        } catch (error) {
            console.log(error);
            res.status(401).send("authorization error");
        }

    } catch (error) {
        console.log(error);
        res.status(500).send("login error");
    }

}

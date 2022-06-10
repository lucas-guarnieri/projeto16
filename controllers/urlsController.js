import db from "./../db.js"
import jwt from 'jsonwebtoken';
import { nanoid } from 'nanoid'
import dotenv from "dotenv";

dotenv.config();
const jwtPass = process.env.JWT_SECRET;

export async function postUrl(req, res) {
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

export async function getUrl(req, res) {
    const urlId = req.params.id;
    try {
        const result = await db.query(`
            SELECT *
            FROM urls
            WHERE id = $1`,
            [ urlId ]
        );
        if (result.rowCount != 0) {
            const resultObj = {
                id: result.rows[0].id,
                shortUrl: result.rows[0].shortUrl,
                url: result.rows[0].url
            }
            res.status(200).send(resultObj);
        } else {
            res.sendStatus(404);
        }
        // res.send(result.rows[0]);
    } catch (error) {
        console.log(error);
        res.status(500).send("error getting url");
    }
}

export async function getShortUrl(req, res) {
    const shortUrl = req.params.shortUrl;
    try {
        const result = await db.query(`
            SELECT *
            FROM urls
            WHERE "shortUrl" = $1`,
            [ shortUrl ]
        );
        if (result.rowCount != 0) {
            const newVisitCount = result.rows[0].visitCount + 1;
            await db.query(`
                UPDATE urls
                SET "visitCount" = $1
                WHERE id = $2`,
                [ newVisitCount,  result.rows[0].id]
            );
            res.redirect(result.rows[0].url);
        } else {
            res.sendStatus(404);
        }
    } catch (error) {
        console.log(error);
        res.status(500).send("error getting url");
    }
}

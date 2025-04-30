import express from "express"
import db from "../db-sqlite.js"
import { ExpressValidator } from "express-validator"

const router = express.Router()

router.get("/", async (req, res)=> {
    const posts = await db.all(
        `SELECT posts.*, login.name FROM posts 
        JOIN login ON posts.author_id = login.id 
        ORDER BY created_at DESC;`)
    if (req.session.login) {
        res.render("news.njk", {
            message: `Welcome to the "My Pocket Henrik" Forum!`,
            posts: posts,
            loginbutton: "Log Out",
            loginURL: "/logout"
        })
    } else {
        res.render("news.njk", {
            message: `Welcome to the "My Pocket Henrik" Forum!`,
            posts: posts,
            loginbutton: "Log In",
            loginURL: "/login"
        })
    }
})

router.get("/:id/delete", async (req, res) => {
    
    const id = req.params.id
    if (req.session.adminStatus) {
        if (!Number.isInteger(Number(id))) {
            return res.status(400).send("Invalid ID")
        }

        await db.run(`DELETE FROM posts WHERE id = ?`, [id])

    } 
    res.redirect("/news")
})

router.get("/:id/edit", async (req, res) => {
    const id = req.params.id

    if (req.session.adminStatus) {
        if (!Number.isInteger(Number(id))) {
            return res.status(400).send("Invalid ID")
        }
        const rows = await db.all("SELECT * FROM posts WHERE id = ?", [id])
        if (rows.length === 0) {
        return res.status(404).send("Post not found")
        }

        res.render('edit.njk', {
        message: "Edit Post",
        rows: rows[0],
        })
    } else {
        res.redirect("/news")
    }
})

router.post('/edit', async (req, res) => {
    
    const { message, id } = req.body

    await db.run(`UPDATE posts SET message=? where id=?`, [message, id])

    res.redirect("/news")
})

router.get("/post", async (req, res) => {
    const user = await db.all(`SELECT * FROM login;`)

    if (req.session.login && req.session.adminStatus == 1) {
        res.render('post.njk', {
            message: "New Post",
            user: user
        })
    } else {
        res.redirect("/news")
    }
})

router.post("/post", async (req, res) => {  
    const { message } = req.body

    await db.run(`INSERT INTO posts (author_id, message) values (?, ?)`, [req.session.userId, message])

    res.redirect("/news")
})

export default router
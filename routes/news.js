import express from "express"
import db from "../db-sqlite.js"
import { ExpressValidator } from "express-validator"

const router = express.Router()

router.get("/test", async (req, res) => {
    const result = await db.all("SELECT * FROM comments")

    res.json(result)
})

router.get("/", async (req, res) => {
    const posts = await db.all(
        `SELECT posts.*, login.name FROM posts 
        JOIN login ON posts.author_id = login.id 
        ORDER BY created_at DESC;`)

    if (req.session.login && req.session.adminStatus) {
        res.render("news.njk", {
            message: `The Official "My Pocket Henrik" Forum!`,
            posts: posts,
            loginbutton: "Log Out",
            loginURL: "/logout",
            newpost: "/news/post"
        })
    } else if (req.session.login) {
        res.render("news.njk", {
            message: `The Official "My Pocket Henrik" Forum!`,
            posts: posts,
            loginbutton: "Log Out",
            loginURL: "/logout"
        })
    } else {
        res.render("news.njk", {
            message: `The Official "My Pocket Henrik" Forum!`,
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

        await db.run(`DELETE FROM posts WHERE id = ?`, id)
        await db.run("DELETE FROM comments WHERE comments.post_id = ?", id)

    }
    res.redirect("/news")
})

router.get("/:id/edit", async (req, res) => {
    const id = req.params.id

    if (req.session.adminStatus) {
        if (!Number.isInteger(Number(id))) {
            return res.status(400).send("Invalid ID")
        }
        const rows = await db.all("SELECT * FROM posts WHERE id = ?", id)
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
    if (!Number.isInteger(Number(id))) {
        return res.status(400).send("Invalid ID")
    }

    await db.run(`UPDATE posts SET message=? where id=?`, message, id)

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

    await db.run(`INSERT INTO posts (author_id, message) values (?, ?)`, req.session.userId, message)

    res.redirect("/news")
})

router.get("/:id", async (req, res) => {
    const id = req.params.id

    const post = await db.get("SELECT posts.*, login.name FROM posts JOIN login on posts.author_id = login.id WHERE posts.id = ?", id)
    console.log(post)
    if (post.length === 0) {
        return res.status(404).send("Post not found")
    }
    const comments = await db.all("SELECT comments.*, login.name FROM comments JOIN login on comments.author_id = login.id WHERE comments.post_id = ?", id)

    console.log(comments)

    if (req.session.login) {
        res.render("comments.njk", {
            message: "",
            post: post,
            comments: comments,
            loginbutton: "Log Out",
            loginURL: "/logout"
        })
    } else {
        res.render("comments.njk", {
            message: "",
            post: post,
            comments: comments,
            loginbutton: "Log In",
            loginURL: "/login"
        })
    }
})

router.get("/:id/reply", async (req, res) => {
    const id = req.params.id
    if (!Number.isInteger(Number(id))) {
        return res.status(400).send("Invalid ID")
    }
    const post = await db.all("SELECT * FROM posts WHERE id = ?", id)
    if (post.length === 0) {
        return res.status(404).send("Post not found")
    }
    const comments = await db.all("SELECT * FROM comments WHERE post_id = ?", id)

    if (req.session.login) {
        res.render("reply.njk", {
            message: "Post Comment",
            post: post[0],
            comments: comments,
            loginbutton: "Log Out",
            loginURL: "/logout"
        })
    } else {
        res.redirect("/login")
    }
})


router.post("/:id/reply", async (req, res) => {
    const id = req.params.id
    const { message } = req.body
    if (!Number.isInteger(Number(id))) {
        return res.status(400).send("Invalid ID")
    }

    const result = await db.run("INSERT INTO comments (message, author_id, post_id) values (?, ?, ?)", message, req.session.userId, id)
    console.log(result)
    res.redirect(`/news/${id}`)
})

router.get("/:id/:commentId/delete", async (req, res) => {
    const id = req.params.id
    const commentId = req.params.commentId

    await db.run("DELETE FROM comments WHERE comments.id = ?", commentId)
    res.redirect(`/news/${id}`)
})

export default router
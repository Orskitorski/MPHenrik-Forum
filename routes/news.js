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
            posts: posts,
            loginbutton: "Log Out",
            loginURL: "/logout",
            newpost: "/news/post"
        })
    } else if (req.session.login) {
        res.render("news.njk", {
            posts: posts,
            loginbutton: "Log Out",
            loginURL: "/logout"
        })
    } else {
        res.render("news.njk", {
            posts: posts,
            loginbutton: "Log In",
            loginURL: "/login"
        })
    }
})

router.get("/:id/delete", async (req, res) => {
    const id = req.params.id
    const post = await db.get("SELECT * FROM posts WHERE posts.id = ?", id)

    if (!Number.isInteger(Number(id))) {
        return res.status(400).send("Invalid Post-ID")
    }

    if (post === undefined) {
        return res.status(400).send("Post not found")
    }

    if (req.session.userId == post.author_id) {
        await db.run(`DELETE FROM posts WHERE id = ?`, id)
        await db.run("DELETE FROM comments WHERE comments.post_id = ?", id)
    }
    res.redirect("/news")
})

router.get("/:id/edit", async (req, res) => {
    const id = req.params.id
    const post = await db.get("SELECT * FROM posts WHERE posts.id = ?", id)
    if (post === undefined) {
        return res.status(404).send("Post not found")
    }

    if (req.session.userId == post.author_id) {
        if (!Number.isInteger(Number(id))) {
            return res.status(400).send("Invalid Post-ID")
        }

        res.render('edit.njk', {
            message: "Edit Post",
            post: post,
            loginbutton: "Log Out",
            loginURL: "/logout",
            route: "/news/edit"
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
            user: user,
            loginbutton: "Log Out",
            loginURL: "/logout",
            route: "/news/post",
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
    if (!Number.isInteger(Number(id))) {
        return res.status(400).send("Invalid Post-ID")
    }

    const post = await db.get("SELECT posts.*, login.name FROM posts JOIN login on posts.author_id = login.id WHERE posts.id = ?", id)
    console.log(post)
    if (post === undefined) {
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
        return res.status(400).send("Invalid Post-ID")
    }
    const post = await db.get("SELECT * FROM posts WHERE id = ?", id)
    if (post === undefined) {
        return res.status(404).send("Post not found")
    }
    const comments = await db.all("SELECT * FROM comments WHERE post_id = ?", id)

    if (req.session.login) {
        res.render("post.njk", {
            message: "Post Comment",
            post: post,
            comments: comments,
            loginbutton: "Log Out",
            loginURL: "/logout",
            route: "/news/reply",
        })
    } else {
        res.redirect("/login")
    }
})


router.post("/reply", async (req, res) => {
    const { message, id } = req.body
    if (!Number.isInteger(Number(id))) {
        return res.status(400).send("Invalid Post-ID")
    }

    const result = await db.run("INSERT INTO comments (message, author_id, post_id) values (?, ?, ?)", message, req.session.userId, id)
    console.log(result)
    res.redirect(`/news/${id}`)
})

router.get("/:id/:commentId/edit", async (req, res) => {
    const id = req.params.id
    const commentId = req.params.commentId

    if (!Number.isInteger(Number(id))) {
        return res.status(400).send("Invalid Post-ID")
    }
    if (!Number.isInteger(Number(commentId))) {
        return res.status(400).send("Invalid Comment-ID")
    }

    const comment = await db.get("SELECT * FROM comments WHERE comments.post_id = ? AND comments.id = ?", id, commentId)

    if (comment === undefined) {
        return res.status(400).send("Comment Not Found")
    } else {
        if (req.session.userId == comment.author_id) {
            res.render("edit.njk", {
                message: "Edit Comment",
                post: comment,
                loginbutton: "Log Out",
                loginURL: "/logout",
                route: "/news/comment/edit",
            })
        } else {
            res.redirect(`/news/${id}`)
        }
    }
})

router.post("/comment/edit", async (req, res) => {
    const {id, postId, message} = req.body

    await db.run(`UPDATE comments SET message=? where id=?`, message, id)
    
    res.redirect(`/news/${postId}`)
})

router.get("/:id/:commentId/delete", async (req, res) => {
    const id = req.params.id
    const commentId = req.params.commentId

    if (!Number.isInteger(Number(id))) {
        return res.status(400).send("Invalid Post-ID")
    }
    if (!Number.isInteger(Number(commentId))) {
        return res.status(400).send("Invalid Comment-ID")
    }

    const comment = await db.get("SELECT * FROM comments WHERE comments.post_id = ? AND comments.id = ?", id, commentId)

    if (req.session.userId == comment.author_id) {
        await db.run("DELETE FROM comments WHERE comments.id = ?", commentId)
    }

    res.redirect(`/news/${id}`)
})

export default router
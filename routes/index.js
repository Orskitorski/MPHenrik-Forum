import express from "express"
import db from "../db-sqlite.js"
import bcrypt from "bcrypt"
import { ExpressValidator } from "express-validator"
import { body, matchedData, validationResult } from "express-validator"

const router = express.Router()

router.get("/", async (req, res) => {
  res.render("index.njk", {
    message: `Welcome to the "My Pocket Henrik" Forum!`,
    login: req.session.login,
  })
})

router.get("/login", (req, res) => {
  if (!req.session.login) {
    res.render("login.njk", {
      title: "Login",
      message: "Best service, legit.",
      error: "",
      login: req.session.login,
    })
  } else {
    return res.status(404).send("You are already logged in")
  }
})

router.post("/login", async (req, res) => {
  const { username, password } = req.body

  const dbResult = await db.get(`SELECT * FROM login WHERE name = ?`, username)

  if (dbResult === undefined) {
    res.render("login.njk", {
      title: "Login",
      message: "Best service, legit.",
      error: "*Wrong username or password",
      login: req.session.login,
    })
  } else {
    
    bcrypt.compare(password, dbResult.password, async function (err, result) {
      if (result == true) {
        req.session.login = true
        req.session.userId = dbResult.id
        req.session.adminStatus = dbResult.admin_status
        res.redirect("/news")
      }
      else {
        res.render("login.njk", {
          title: "Login",
          message: "Best service, legit.",
          error: "Wrong username or password",
          login: req.session.login,
        })
      }
    })
  }
})

router.get("/signup", (req, res) => {
  if (!req.session.login) {
    res.render("signup.njk", {
      title: "Sign Up",
      message: "Best service, legit.",
      error: "",
      login: req.session.login,
    })
  } else {
    return res.status(400).send("You are already logged in")
  }
})

router.post("/signup", async (req, res) => {
  const { username, password } = req.body

  const dbResult = await db.get(`SELECT * FROM login WHERE name = ?`, username)

  if (dbResult === undefined) {
    const hashedPW = await bcrypt.hash(password, 10)

    await db.run('INSERT INTO login (name, password) VALUES (?, ?)', username, hashedPW)
    const dbResultNew = await db.get(`SELECT id FROM login WHERE login.name = ?`, username)
    req.session.userId = dbResultNew.id
    req.session.login = true
    res.redirect("/")
  } else {
    res.render("signup.njk", {
      title: "Sign Up",
      message: "Best service, legit.",
      error: "*User already exists",
      login: req.session.login,
    })
  }
})

router.get("/logout", (req, res) => {
  req.session.destroy(function (err) {
    res.redirect("/")
  })
})

export default router
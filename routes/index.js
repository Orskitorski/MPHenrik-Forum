import express from "express"
import db from "../db-sqlite.js"
import bcrypt from "bcrypt"

const router = express.Router()

router.get("/", async (req, res) => {
  if (req.session.login) {
    res.render("index.njk", {
      message: `Welcome to the "My Pocket Henrik" Forum!`,
      loginbutton: "Log Out",
      loginURL: "/logout"
    })
  } else {
    res.render("index.njk", {
      message: `Welcome to the "My Pocket Henrik" Forum!`,
      loginbutton: "Log In",
      loginURL: "/login"
    })
  }
})

router.get("/login", (req, res) => {
  if (!req.session.login) {
    res.render("login.njk", {
      title: "Login",
      message: "Best service, legit.",
      error: "",
      loginbutton: "Log In",
      loginURL: "/login"
    })
  } else {
    res.redirect("/")
  }
})

router.post("/login", async (req, res) => {
  const { username, password } = req.body

  const result = await db.get(`SELECT * FROM login WHERE name = ?`, username)

  if (result === undefined) {
    res.render("login.njk", {
      title: "Login",
      message: "Best service, legit.",
      error: "*Wrong username or password",
      loginbutton: "Log In",
      loginURL: "/login"
    })
  } else {
    const dbpassword = await db.get(`SELECT password FROM login WHERE name = ?`, username)

    bcrypt.compare(password, dbpassword.password, async function (err, result) {
      if (result == true) {
        const id = await db.get(`SELECT id FROM login WHERE name = ?`, username)
        console.log(id)
        const user = await db.all(`SELECT * FROM login WHERE name = ?`, username)
        req.session.login = true
        req.session.userId = id.id
        req.session.adminStatus = user[0].admin_status
        res.redirect("/news")
      }
      else {
        res.render("login.njk", {
          title: "Login",
          message: "Best service, legit.",
          error: "Wrong username or password",
          loginbutton: "Log In",
          loginURL: "/login"
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
      loginbutton: "Log In",
      loginURL: "/login"
    })
  } else {
    res.redirect("/")
  }
})

router.post("/signup", async (req, res) => {
  const { username, password } = req.body

  const result = await db.get(`SELECT * FROM login WHERE name = ?`, username)

  if (result === undefined) {
    const hashedPW = await bcrypt.hash(password, 10)

    await db.run('INSERT INTO login (name, password) VALUES (?, ?)', username, hashedPW)
    const id = await db.get(`SELECT id FROM login WHERE login.name = ?`, username)
    req.session.userId = id.id
    console.log(req.session.userId)
    req.session.login = true
    res.redirect("/")
  } else {
    res.render("signup.njk", {
      title: "Sign Up",
      message: "Best service, legit.",
      error: "*User already exists",
      loginbutton: "Log In",
      loginURL: "/login"
    })
  }
})

router.get("/logout", (req, res) => {
  req.session.destroy(function (err) {
    res.redirect("/")
  })
})

export default router
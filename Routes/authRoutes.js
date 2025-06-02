
const express = require("express")
const { handleLogin, handleGetAllUsers, handleForgotPassword, handleUserRegistration, handleResetPassword } = require("../Controllers")
const { authorization, validateRegistration } = require("../Middleware")

const router = express.Router()

router.post("/login", handleLogin)

router.get("/all-users", authorization, handleGetAllUsers)

router.post("/forgot-password", handleForgotPassword)

router.post("/sign-up", validateRegistration, handleUserRegistration)

router.patch("/reset-password", authorization, handleResetPassword)




module.exports = router

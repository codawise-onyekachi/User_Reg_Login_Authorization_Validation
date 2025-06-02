
const express = require("express")

const dotenv = require("dotenv")

const mongoose = require("mongoose")

const jwt = require("jsonwebtoken")

const Auth = require("./Models/authModel")

//const User = require("./Models/userModel")

const bcrypt = require("bcryptjs")

const cors = require("cors")

const routes = require("./Routes")

//const {sendForgotPasswordEmail, sendSignUpVerificationEmail, validEmail} = require("./sendMail")

//const { handleGetAllUsers, handleUserRegistration, handleLogin, handleForgotPassword, handleResetPassword } = require("./Controllers")

//const { validateRegistration, authorization } = require("./Middleware")

dotenv.config()

const app = express()

app.use(express.json())

app.use(cors())

const PORT = process.env.PORT || 8000

mongoose.connect(process.env.MONGODB_URL)
.then( ()=> {
    console.log("MongoDB connected")
    
    app.listen(PORT, () => {
     console.log(`successful, running on port ${PORT}`)
    })

})

//delete all app except one
app.use(routes)
 

//app


//app

//To reset a user's password
//app


//app


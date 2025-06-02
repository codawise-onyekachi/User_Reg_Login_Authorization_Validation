const jwt = require("jsonwebtoken")
const Auth = require("../Models/authModel")
const { findUserService } = require("../Service")
const {validEmail, sendSignUpVerificationEmail, sendForgotPasswordEmail} = require("../sendMail")
const bcrypt = require("bcryptjs")


const handleGetAllUsers = async (req, res) => {

    console.log(req.user)

    const allUsers = await findUserService()

    res.status(200).json({
        message: "Successful",
        allUsers
    })
}

const handleUserRegistration = async (req, res) => {
    
    try{
        const {email, password, firstName, lastName, state} = req.body

    if(!email) {
        return res.status(400).json({
            message: "Please enter your email"
        })
    }

    if(!validEmail(email)){
        return res.status(400).json({
            message:"Incorrect email format"
        })
    }

    if(!password) {
        return res.status(400).json({
            message: "Please enter your password"
        })
    }

    const existingUser = await Auth.findOne({email})

    if(existingUser){
        return res.status(400).json({
            message: "User alredy exists"
        })
    }

    if(password.length < 6) {
        return res.status(400).json({
            message: "Password must be greater than 6 characters"
        })
    }// You can use Regex for more password validation

    const hashedPassword = await bcrypt.hash(password, 12)

    const newUser = new Auth ({
        email, 
        password: hashedPassword, 
        firstName, 
        lastName, 
        state
    })

    await newUser.save()

    //Send the User an email to verify their account
    const accessToken = jwt.sign(
    { id: newUser._id },
    process.env.ACCESS_TOKEN,
    { expiresIn: "5m" }
    )

    await sendSignUpVerificationEmail(email, accessToken)

    res.status(201).json({
      message: "User account created successfully. Please check your email inbox and verify your account.",
      newUser: {
        email: newUser?.email,
        firstName: newUser?.firstName,
        lastName: newUser?.lastName,
        state: newUser?.state
      }
    })

    }catch (error) {
        res.status(500).json({
            message: error.message
        })

    }
}

const handleLogin = async (req, res) => {

    try{

    const {email, password} = req.body

    const user = await Auth.findOne( {email})//.select("password") // to exclude the password. so that you don't send the user's password

    if(!user) {
        return res.status(404).json({
            message: "user account does not exist"
        })
    }

    const ismatch = await bcrypt.compare(password, user?.password)

    if(!ismatch) {
        return res.status(400).json({
            message: "Incorrect email or password"
        })
    }


    //generate a Token for the user once the email and password matches

    const accessToken = jwt.sign(
        {id: user?._id},
        process.env.ACCESS_TOKEN,
        {expiresIn: "1h"}
    )

    const refreshToken = jwt.sign(
        {id: user?._id},
        process.env.REFRESH_TOKEN,
        {expiresIn: "30d"}
    )

    res.status(200).json({
        message:"Login successful",
        accessToken,
        user: {
            email: user?.email, 
            firstName: user?.firstName,
            lastName: user?.lastName, 
            state: user?.state,
            role: user?.role
        },
        refreshToken
    })
}catch (error) {
        res.status(500).json({
            message: error.message
        })

    }
}

const handleForgotPassword = async (req, res) => {

    try{

     const {email} = req.body

    // const {email, userName} = req.body

    // let user

    // if(email){
    //     const user = await Auth.findOne({email})
    // }

    //   if(userName){
    //     const user = await Auth.findOne({userName})
    // }
  

    const user = await Auth.findOne({email})



    if(!user) {
        res.status(404).json({
            message: "User not found"
        })
    }

    //In case where the email matches with the user, that is , user exist, then an email with the Token or OTP is sent to them 
    const accessToken = await jwt.sign(
        {user},
        process.env.ACCESS_TOKEN,
        {expiresIn:"5m"}

    )

    await sendForgotPasswordEmail(email, accessToken)

    res.status(200).json({
        message: "Please check your email inbox"
    })
}catch (error) {
        res.status(500).json({
            message: error.message
        })

    }
}


const handleResetPassword = async (req, res) => {

    try{

    const {email, password} = req.body

    const user = await Auth.findOne({email: req.body.email})

    if(!user){
        res.status(404).json({
            message:"User not found"
        })
    }

    const hashedPassword = await bcrypt.hash(password, 12)

    user.password = hashedPassword

    await user.save()

    res.status(200).json({
        message:"Password reset successful"
    })

}catch (error) {
        res.status(500).json({
            message: error.message
        })

    }
}

module.exports = {
    handleGetAllUsers,
    handleUserRegistration,
    handleLogin,
    handleForgotPassword,
    handleResetPassword

}
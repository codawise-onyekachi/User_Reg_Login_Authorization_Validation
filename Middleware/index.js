
const jwt = require("jsonwebtoken") //brought in to decode the token
const Auth = require("../Models/authModel")

const validateRegistration = (req, res, next) => {

    const {email, password, firstName, lastName, state} = req.body

    const errors = []

    if(!email) {
        errors.push("Please add your email")
    }

    if(!password) {
        errors.push("Please add your password")
    }

    if(errors.length > 0) {
        return res.status(400).json({
            message: errors
        })
    }

    next()
}


//Authorization
const authorization = async(req, res, next) => {
    const token = req.header("Authorization")

    if(!token){
        return res.status(401).json({
            message:"Please Login!"
        })
    }

    const splitToken = token.split(" ")

    const realToken = splitToken[1].trim()

    const decoded = jwt.verify(realToken, `${process.env.ACCESS_TOKEN}`)

    if(!decoded){
        return res.state(401).json({
            message:"Please Login!"
        })
    }

    const user = await Auth.findById(decoded.id)

    if(!user){
        return res.status(404).json({
            message: "User account does not exist"
        })
    }

    req.user = user

    //After you find the user, you will then check whether the user role is admin. If it is not admin, you returm 'invalid authentication',but if it is admin, then you call next()

    // if(user?.role !== "admin") {
    //     return res.status(404).json({
    //         message: "Invalid authorization"
    //     })
    // }

    next()

    //console.log(user)

    //console.log(realToken)

     //console.log(splitToken)

    //console.log({token})
}


module.exports = {
    validateRegistration,
    authorization
}
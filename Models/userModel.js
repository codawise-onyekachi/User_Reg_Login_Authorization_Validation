
const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
isVerified: {
    type: Boolean,
    default: false
}
})

const User = new mongoose.model("User", userSchema)


module.exports = User
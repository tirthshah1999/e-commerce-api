const User = require("../models/User");
const {StatusCodes} = require("http-status-codes");
const {BadRequestError} = require("../errors");

const register = async(req, res) => {
    const {email, name, password} = req.body;
    const emailAlreadyExists = await User.findOne({email});
    if(emailAlreadyExists){
        throw new BadRequestError("Email already exists");
    }

    // First registered user is as admin
    const isFirstUser = await User.countDocuments() === 0;
    const role = isFirstUser ? "admin" : "user"
    const user = await User.create({name, email, password, role});
    res.status(StatusCodes.CREATED).json({user});
}

const login = async(req, res) => {
    res.send("Login user");
}

const logout = (req, res) => {
    res.send("Logout user");
}

module.exports = {
    register,
    login,
    logout
}
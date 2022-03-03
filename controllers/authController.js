const User = require("../models/User");
const {StatusCodes} = require("http-status-codes");
const {BadRequestError, UnauthenticatedError} = require("../errors");
const {attachCookiesToResponse, createTokenUser} = require("../utils");

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

    const userToken = createTokenUser(user);

    // attaching cookie to our response object - (Will create JWT as well)
    attachCookiesToResponse({res, user: userToken});

    res.status(StatusCodes.CREATED).json({user: userToken});
}

const login = async(req, res) => {
    const {email, password} = req.body;
    if(!email || !password){
        throw new BadRequestError("Please provide email and password");
    }
    
    const user = await User.findOne({email});
    
    if(!user){
        throw new UnauthenticatedError("Invalid credentials");
    }

    const isPasswordCorrect = await user.comparePassword(password);
    if(!isPasswordCorrect){
        throw new UnauthenticatedError("Invalid credentials");
    }

    // create token and attach cookie to res 
    const userToken = createTokenUser(user);
    attachCookiesToResponse({res, user: userToken});
    res.status(StatusCodes.OK).json({user: userToken});
}

const logout = (req, res) => {
    res.cookie("token", "logout", {
        httpOnly: true,
        expires: new Date(Date.now())
    });

    res.status(StatusCodes.OK).json({msg: 'user logged out'});
}

module.exports = {
    register,
    login,
    logout
}
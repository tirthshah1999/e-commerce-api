const User = require("../models/User");
const {StatusCodes} = require("http-status-codes");
const {NotFoundError, UnauthenticatedError, BadRequestError} = require("../errors");
const {createTokenUser, attachCookiesToResponse, checkPermission} = require("../utils");

const getAllUsers = async (req, res) => {
    // exclude password not want to show it for security reasons
    const users = await User.find({role: 'user'}).select("-password");
    res.status(StatusCodes.OK).json({ users });  
}

const getSingleUser = async (req, res) => {
    const user = await User.findOne({_id: req.params.id}).select("-password");
    
    if(!user){
        throw new NotFoundError(`No user with id: ${req.params.id}`);
    }

    // if one user gets other userId then we have to restrict it
    checkPermission(req.user, user._id);
    res.status(StatusCodes.OK).json({ user });  
}

const showCurrentUser = async (req, res) => {
    res.status(StatusCodes.OK).json({user: req.user});
}

const updateUser = async (req, res) => {
    const {email, name} = req.body;
    if(!email || !name){
        throw new BadRequestError("Please provide all values");
    }

    const user = await User.findOne({_id: req.user.userId});
    user.email = email;
    user.name = name;

    await user.save();  // while saving it will go to pre hook in User model

    // So browser knows email, name updated
    const tokenUser = createTokenUser(user);
    attachCookiesToResponse({ res, user: tokenUser });
    res.status(StatusCodes.OK).json({ user: tokenUser });
}

const updateUserPassword = async (req, res) => {
    const {oldPassword, newPassword} = req.body;
    if(!oldPassword || !newPassword){
        throw new UnauthenticatedError("Please provide both values");
    }

    const user = await User.findOne({_id: req.user.userId});
    const isPasswordCorrect = await user.comparePassword(oldPassword);

    if(!isPasswordCorrect){
        throw new UnauthenticatedError("Invalid Credentials");
    }

    user.password = newPassword;
    await user.save();
    res.status(StatusCodes.OK).json({msg: "Password updated successfully"});
}

module.exports = {
    getAllUsers,
    getSingleUser,
    showCurrentUser,
    updateUser,
    updateUserPassword
}

// update user with findOneAndUpdate -----  
// const updateUser = async (req, res) => {
//   const { email, name } = req.body;
//   if (!email || !name) {
//     throw new CustomError.BadRequestError('Please provide all values');
//   }
//   const user = await User.findOneAndUpdate(
//     { _id: req.user.userId },
//     { email, name },
//     { new: true, runValidators: true }
//   );
//   const tokenUser = createTokenUser(user);
//   attachCookiesToResponse({ res, user: tokenUser });
//   res.status(StatusCodes.OK).json({ user: tokenUser });
// };
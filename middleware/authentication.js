const {UnauthenticatedError, UnauthorizedError} = require("../errors");
const {verifyJWT} = require("../utils");

const authenticatedUser = async (req, res, next) => {
    const token = req.signedCookies.token;    
    if(!token){
        throw new UnauthenticatedError("Authentication Invalid");
    }

    try {
        const payload = verifyJWT({token});
        const {name, userId, role} = payload;
        req.user = {name, userId, role};
        next();
    } catch (error) {
        throw new UnauthenticatedError("Authentication Invalid");
    }
}

// For Admin only: May be in future you have to allow permission to admin, master so added dynamically. Roles will be array for whom to give permission. In this case is ['admin']
const authorizePermissions = (...roles) => {
    return (req, res, next) => {
        if(!roles.includes(req.user.role)){
            throw new UnauthorizedError("Unauthorized to access this route");
        }
        next();
    }
}

module.exports = {
    authenticatedUser,
    authorizePermissions
}
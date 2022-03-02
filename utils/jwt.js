const jwt = require("jsonwebtoken");

const createJWT = ({payload}) => {
    const token = jwt.sign(payload, process.env.JWT_SECRET, {expiresIn: process.env.JWT_EXPIRES})
    return token;
}

const verifyJWT = ({token}) => {
    const isValidToken = jwt.verify(token, process.env.JWT_SECRET);
    return isValidToken;
}

const attachCookiesToResponse = ({res, user}) => {
    const token = createJWT({payload: user});
    const oneDay = 1000 * 60 * 60 * 24;

    res.cookie("token", token, {
        httpOnly: true,
        expires: new Date(Date.now() + oneDay),
        secure: process.env.NODE_ENV === "production",
        signed: true                   // if client change cookie then it will get reflect
    })
}

module.exports = {
    createJWT,
    verifyJWT,
    attachCookiesToResponse
}
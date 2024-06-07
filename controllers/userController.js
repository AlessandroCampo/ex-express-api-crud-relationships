const { PrismaClient, Prisma } = require('@prisma/client');
const prisma = new PrismaClient();
const CustomError = require('../utils/CustomError');
const prismaErorrHandler = require('../utils/prismaErorrHandler.js');
const bcrpyt = require('bcrypt');
const { hashPassword } = require('../utils/passwordUtils.js');
const generateToken = require('../middlewares/jwtToken.js');

const register = async (req, res, next) => {
    const { username, email, password, image } = req.body;
    console.log(image)

    const data = {
        username,
        email,
        password: await hashPassword(password),
        avatar: image || null
    }

    try {
        const newUser = await prisma.user.create({ data })
        const token = generateToken(newUser);
        return res.json({
            message: 'Your account has been succesfully created',
            user: {
                username: newUser.username,
                email: newUser.email
            },
            token
        })
    } catch (err) {
        const customError = prismaErorrHandler(err);
        next(customError);
    }
}

const login = async (req, res, next) => {
    const user = req.body.user;
    if (!user) {
        throw new CustomError("User not found", "Error retrieving your user data", 404)
    }
    const token = generateToken(user);
    res.json({
        message: "Login succesful",
        user: {
            username: user.username,
            email: user.email,
            profile_picture: user.avatar
        },
        token
    })
}



module.exports = {
    register, login
}
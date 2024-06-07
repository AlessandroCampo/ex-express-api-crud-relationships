const { PrismaClient, Prisma } = require('@prisma/client');
const prisma = new PrismaClient();
const CustomError = require('../utils/CustomError');
const prismaErorrHandler = require('../utils/prismaErorrHandler.js');
const bcrpyt = require('bcrypt');
const { hashPassword } = require('../utils/passwordUtils.js');
const generateToken = require('../middlewares/jwtToken.js');

const register = async (req, res, next) => {
    const { username, email, password, image } = req.body;

    const data = {
        username,
        email,
        password: await hashPassword(password),
        avatar: image
    }

    try {
        const newUser = await prisma.user.create({ data })
        const token = generateToken(newUser);
        return res.json({
            message: 'Your account has been succesfully created',
            yourAccount: {
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



module.exports = {
    register
}
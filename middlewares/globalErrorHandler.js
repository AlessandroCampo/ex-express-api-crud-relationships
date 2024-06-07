const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

module.exports = async (err, req, res, next) => {
    const status = err.status || 500;
    const message = err.message || 'Internal Server Error';
    const { username } = req.body;
    if (err.title === "Incorrect password") {
        await prisma.user.update({
            where: { username },
            data: {
                failedLoginAttempts: {
                    increment: 1
                }
            }
        });
    }
    console.error(err);
    res.status(status).json({
        error: {
            status,
            message,
        },
    });
};
const { PrismaClient } = require("@prisma/client");
const CustomError = require("../utils/CustomError");
const { isValidURL } = require("../utils/genericUtils");
const prisma = new PrismaClient();


const user = {
    username: {
        in: ["body"],
        escape: true,
        isEmpty: {
            errorMessage: "Please select an username for your account",
            bail: true,
        },
        isAlphanumeric: {
            errorMessage: "Username must contain only letters and numbers",
            bail: true
        },
        isLength: {
            options: { min: 5, max: 50 },
            errorMessage: "Your username should be between 5 and 50 characters long.",
            bail: true
        }
    },
    email: {
        in: ["body"],
        notEmpty: {
            errorMessage: "Email is required",
            bail: true,
        },
        isEmail: {
            errorMessage: "Invalid email address",
            bail: true
        }
    },
    isStrongPassword: {
        options: {
            minLength: 8,
            minLowercase: 1,
            minUppercase: 1,
            minNumbers: 1,
            minSymbols: 0,
            returnScore: false,
        },
        errorMessage: "Password should be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, and one number",
        bail: true
    },
    image: {
        in: ["body"],
        optional: true,
        custom: {
            options: (url) => {
                const urlIsValid = isValidURL(url);
                if (!urlIsValid) {
                    throw new CustomError('Validation error', "The image field contains a non valid URL.", 400)
                }
                return true
            }
        }
    },
}
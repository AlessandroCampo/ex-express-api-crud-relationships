const { PrismaClient } = require("@prisma/client");
const CustomError = require("../utils/CustomError");
const { isValidURL } = require("../utils/genericUtils");
const prisma = new PrismaClient();



const post = {
    name: {
        in: ["body"],
        escape: true,
        notEmpty: {
            errorMessage: "Please add a title for your post",
            bail: true,
        },
        isString: {
            errorMessage: "The title of your post should only contain letters.",
            bail: true
        },
        isLength: {
            options: { min: 5, max: 50 },
            errorMessage: "The title of your post should be between 5 and 50 characters long.",
            bail: true
        }
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
    content: {
        in: ["body"],
        escape: true,
        notEmpty: {
            errorMessage: "Please add a caption for your post",
            bail: true
        },
        isString: {
            errorMessage: "The caption of your post should only contain letters.",
            bail: true
        },
        isLength: {
            options: { min: 5, max: 250 },
            errorMessage: "The title of your post should be between 5 and 50 characters long.",
            bail: true
        }
    },
    userId: {
        in: ["body"],
        notEmpty: {
            errorMessage: "You need to be logged in in order to create a post",
            bail: true
        },
        isInt: {
            errorMessage: "There was an authentication error while creating your post, please log in again",
            bail: true
        },
        custom: {
            options: async (userId) => {
                const foundUser = await prisma.user.findUnique({
                    where: { id: Number(userId) }
                })
                if (!foundUser) {
                    throw new CustomError('Authentication Error', "An error occurred while accessing your account data, please log in again", 401)
                }
                return true
            }
        }
    }
};

const postSlug = {
    slug: {
        in: ["params"],
        notEmpty: {
            errorMessage: "Could not find a post with the required slug",
            bail: true
        },
        isString: {
            errorMessage: "The slug post may only contain letters",
            bail: true
        },
        custom: {
            options: async (pSlug) => {
                const foundPost = await prisma.post.findUnique({
                    where: { slug: pSlug }
                })
                if (!foundPost) {
                    throw new CustomError('Not found', `Could not find any post with slug ${pSlug}`, 404)
                }
                return true
            }
        }
    }
}

const postContent = {
    content: {
        in: ["body"],
        notEmpty: {
            errorMessage: "Please add a caption for your post",
            bail: true
        },
        isString: {
            errorMessage: "The caption of your post should only contain letters.",
            bail: true
        },
        isLength: {
            options: { min: 5, max: 250 },
            errorMessage: "The title of your post should be between 5 and 50 characters long.",
            bail: true
        }
    },
}




module.exports = { post, postSlug, postContent }
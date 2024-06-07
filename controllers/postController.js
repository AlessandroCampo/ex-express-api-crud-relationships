const { PrismaClient, Prisma } = require('@prisma/client');
const prisma = new PrismaClient();
const CustomError = require('../utils/CustomError');
const prismaErorrHandler = require('../utils/prismaErorrHandler.js');
const createUniqueSlugForPost = require('../utils/createUniqueSlugForPost.js');


const create = async (req, res, next) => {
    const { name, content, published, userId, } = req.body;
    if (!name) {
        return next(new CustomError('Validation error', 'The name field is required', 400))
    }
    const data = {
        name,
        content,
        published,
        slug: await createUniqueSlugForPost(name),
        userId: Number(userId)
    }
    try {
        const newPost = await prisma.post.create({ data })
        return res.json({
            message: 'New post has been succesfully created',
            newPost
        })
    } catch (err) {
        const customError = prismaErorrHandler(err);
        next(customError);
    }
};

const index = async (req, res, next) => {
    const where = {};
    const { page = 1, limit = 10, published, containedString } = req.query;
    if (published) where.published = published === 'true';
    if (containedString) where.name = { contains: containedString };


    const offset = (page - 1) * limit;
    const totalPosts = await prisma.post.count();
    const totalPages = Math.ceil(totalPosts / limit);

    try {
        const allPosts = await prisma.post.findMany({
            take: Number(limit),
            skip: offset,
            include: {
                user: {
                    select: {
                        username: true
                    }
                },
                comments: {
                    select: {
                        content: true
                    }
                },
                _count: {
                    select: {
                        likes: true
                    }
                }
            },
            where
        });
        return res.json({
            message: `${allPosts.length} ${allPosts.length > 1 ? 'posts' : 'post'} have been found on page number ${page}`,
            allPosts,
            currentPage: page,
            totalPages
        })
    } catch (err) {
        const customError = prismaErorrHandler(err);
        next(customError);
    }
};


const show = async (req, res, next) => {
    const { slug } = req.params;
    try {
        const foundPost = await prisma.post.findUnique({
            where: { slug },
            include: {
                user: {
                    select: {
                        username: true
                    }
                },
                comments: {
                    select: {
                        content: true
                    }
                },
                _count: {
                    select: {
                        likes: true
                    }
                }
            }
        });
        if (foundPost) {
            return res.json({
                message: `Post with slug ${slug} has succesfully been retrieved`,
                foundPost
            })
        }
        //TODO - add custom error
        throw new Error(`Post with slug ${slug} has not been found`)
    } catch (err) {
        const customError = prismaErorrHandler(err);
        next(customError);
    }
};



const update = async (req, res, next) => {
    const { slug } = req.params;
    const { name, content, published } = req.body;

    try {
        const updateData = {};
        if (name !== undefined) {
            updateData.name = name
            updateData.slug = slugify(name)
        };
        if (content !== undefined) updateData.content = content;
        if (published !== undefined) updateData.published = published;

        const updatedPost = await prisma.post.update({
            where: { slug },
            data: updateData,
        });

        return res.json({
            message: `Post with slug ${slug} has successfully been updated`,
            updatedPost,
        });
    } catch (err) {
        const customError = prismaErorrHandler(err);
        next(customError);
    }
};



const destroy = async (req, res, next) => {
    const { slug } = req.params;
    try {
        const deletedPost = await prisma.post.delete({
            where: { slug }
        });
        res.json({
            message: `Post with slug ${slug} has successfully been deleted`,
            deletedPost,
        })
    } catch (err) {
        const customError = prismaErorrHandler(err);
        next(customError);
    }
};

const comment = async (req, res, next) => {
    const { slug } = req.params;
}


module.exports = {
    index, show, create, update, destroy
}
const Joi = require("joi");

const createPostSchema = Joi.object({
    title: Joi.string().required(),
    description: Joi.string().required(),
    categories: Joi.array().items(Joi.string().hex().length(24)).required(),
    img: Joi.object({
        url: Joi.string(),
        public_id: Joi.string()
    }),
    videoUrl: Joi.string().required(),
    user: Joi.string().hex().length(24).required(),
    status: Joi.boolean().required()
});

const updatePostSchema = Joi.object({
    title: Joi.string(),
    description: Joi.string(),
    categories: Joi.array().items(Joi.string().hex().length(24)),
    img: Joi.object({
        url: Joi.string(),
        public_id: Joi.string()
    }),
    videoUrl: Joi.string(),
    user: Joi.string().hex().length(24),
    status: Joi.boolean()
});

module.exports = {
    createPostSchema,
    updatePostSchema
}
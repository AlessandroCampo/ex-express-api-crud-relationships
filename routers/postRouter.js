const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController.js');

//validation middlewares

const validator = require('../middlewares/validator.js');
const schemas = require('../validations/postValidations.js');

router.post('/', validator(schemas.post), postController.create)
router.get('/', postController.index)
router.get('/:slug', validator(schemas.postSlug), postController.show)
router.put('/:slug', validator(schemas.postSlug), validator(schemas.post), postController.update)
router.delete('/:slug', validator(schemas.postSlug), postController.destroy)




module.exports = router;
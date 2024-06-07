const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController.js');

//validation middlewares

const validator = require('../middlewares/validator.js');
const schemas = require('../validations/postValidations.js');

router.post('/', validator(schemas.post), postController.create)
router.get('/', postController.index)
router.get('/:slug', postController.show)
router.put('/:slug', postController.update)
router.delete('/:slug', postController.destroy)




module.exports = router;
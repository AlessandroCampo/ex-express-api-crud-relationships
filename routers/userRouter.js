const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController.js');
const { index } = require('../controllers/postController.js');


const validator = require('../middlewares/validator.js');
const schemas = require('../validations/userValidations.js');
const uploadFile = require('../middlewares/checkImage.js');
const testMiddleware = require('../middlewares/testMiddleware.js');




router.post('/register', uploadFile, validator(schemas.user), userController.register);

router.post('/login', validator(schemas.login), userController.login);
router.get('/:userId/posts', index)







module.exports = router;
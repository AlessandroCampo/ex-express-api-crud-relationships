const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController.js');


const validator = require('../middlewares/validator.js');
const schemas = require('../validations/userValidations.js');
const uploadFile = require('../middlewares/checkImage.js');



router.post('/', uploadFile, validator(schemas.user), userController.register);







module.exports = router;
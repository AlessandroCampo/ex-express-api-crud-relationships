const express = require('express');
const router = express.Router();

const commentController = require('../controllers/commentsController.js');
const auth = require('../middlewares/auth.js');



router.put("/:commentId", auth, commentController.update);
router.delete("/:commentId", auth, commentController.destroy);
router.post("/:commentId/like", auth, commentController.likeComment);




module.exports = router;
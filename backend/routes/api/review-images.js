const express = require('express');
const { Review, ReviewImage } = require('../../db/models');
const { requireAuth } = require('../../utils/auth');
const router = express.Router();

router.delete( '/:imageId',
  requireAuth,
  async (req, res, next) => {
    const { user } = req;
    const { imageId } = req.params;
    const reviewImg = ReviewImage.findByPk(imageId);
    const review = Review.findByPk(reviewImg.reviewId);
    if (!reviewImg) {
      const err = new Error('Review Image couldn\'t be found');
      err.status = 404;
      err.title = 'Review Image couldn\'t be found'
      return next(err);

    } else if (user.id !== review.userId ) {
      const err = new Error('Forbidden');
      err.status = 403;
      err.title = 'Forbidden'
      return next(err);

    } else {
      await reviewImg.destroy();
      return res.json({
        "message": "Successfully deleted"
      });
    }
  }
)

module.exports = router;

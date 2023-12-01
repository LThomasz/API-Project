const express = require('express');
const { Op } = require('sequelize');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const { Review, User, SpotImage, ReviewImage } = require('../../db/models');
const { requireAuth } = require('../../utils/auth');
const router = express.Router();

const validateReview = [
  check('review')
    .exists({ checkFalsy: true })
    .withMessage('Review text is required.'),
  check('stars')
    .exists({ checkFalsy: true })
    .isInt({ min: 1}, { max: 5 })
    .withMessage('Stars must be an integer from 1 to 5.'),
    handleValidationErrors
];

// Add an Image to a Review based on the Review's id
router.post( '/:reviewId/images',
  requireAuth,
  async (req, res, next) => {
    const { user } = req;
    const { reviewId } = req.params;
    const { url } = req.body;
    const review = await Review.findByPk(reviewId);
    if (!review) {
      const err = new Error('Review couldn\'t be found');
      err.status = 404;
      err.title = 'Review couldn\'t be found'
      return next(err)

    } else if (review.userId !== user.id) {
      const err = new Error('Forbidden');
      err.status = 403;
      err.title = 'Forbidden'
      return next(err)

    } else  {
      const number = await ReviewImage.count({
        where: {
          reviewId: review.id
        }
      });

      if (number === 10) {
        const err = new Error('Maximum number of images for this resource was reached');
        err.status = 403;
        err.title = 'Maximum number of images for this resource was reached'
        return next(err)
      }

      const newReviewImage = ReviewImage.build({ url });
      newReviewImage.reviewId = review.id;
      await newReviewImage.save();

      const madeReviewImage = await ReviewImage.findByPk(newReviewImage.id, {
        attributes: {
          exclude: ['reviewId', 'updatedAt', 'createdAt']
        }
      })
      return res.json(madeReviewImage)
    }
  }
)

// Edit a Review
router.put( '/:reviewId',
  requireAuth,
  validateReview,
  async (req, res, next) => {
    const { user } = req;
    const { reviewId } = req.params;
    const { review, stars } = req.body;
    const existingReview = await Review.findByPk(reviewId);
    if (!user) {
      const err = new Error('Authentication required');
      err.status = 401;
      err.title = 'Authentication required'
      return next(err)

    } else if (!existingReview) {
      const err = new Error('Review couldn\'t be found');
      err.status = 404;
      err.title = 'Review couldn\'t be found'
      return next(err)

    } else if (existingReview.userId !== user.id) {
      const err = new Error('Forbidden');
      err.status = 403;
      err.title = 'Forbidden'
      return next(err)

    } else {
      existingReview.review = review || existingReview;
      existingReview.stars = stars || existingReview;
      await existingReview.save();
      return res.json(existingReview)
    }
  }
)

// Get all Reviews of the Current User
router.get( '/current',
  requireAuth,
  async (req, res, next) => {
    const { user } = req;
    const Reviews = [];

    const allReviews = await Review.findAll({
      // attributes: ['id', 'spotId', 'userId', 'review', 'stars','createdAt', 'updatedAt'],
      where: {
        userId: user.id
      }
    });
    // const currentUser = await User.findByPk(user.id)
    for (let rev of allReviews) {
      let grapes = await rev.getUser({
        attributes: ['id', 'firstName', 'lastName']
      });

      let strawSpot = await rev.getSpot({
        attributes: {
          exclude: ['description', 'createdAt', 'updatedAt']
        }
      });
      let foundSpot = strawSpot.toJSON();

      let previewImage = await SpotImage.findOne({
        attributes: ['url'],
        where: {
          spotId: strawSpot.id,
          preview: true
        }
      });
      if (previewImage) {
        foundSpot.previewImage = previewImage.url;
      } else {
        foundSpot.previewImage = "No preview image available."
      }

      let ReviewImages = await ReviewImage.findAll({
        attributes: ['id', 'url'],
        where: {
          reviewId: rev.id
        }
      })
      let newReview = rev.toJSON();
      newReview.User = grapes;
      newReview.Spot = foundSpot;

      if (!ReviewImages.length) {
        newReview.ReviewImages = "No images available."
      } else {
        newReview.ReviewImages = ReviewImages;
      }
      Reviews.push(newReview);
    }
    return res.json({
      Reviews
    })

  }
)

router.delete( '/:reviewId',
  requireAuth,
  async (req, res, next) => {
    const { user } = req;
    const { reviewId } = req.params;
    const theReview = Review.findByPk(reviewId);

    if (!theReview) {
      const err = new Error('Review couldn\'t be found');
      err.status = 404;
      err.title = 'Review couldn\'t be found'
      return next(err)

    } else if (user.id !== theReview.userId) {
      const err = new Error('Forbidden');
      err.status = 403;
      err.title = 'Forbidden'
      return next(err);

    } else {
      await theReview.destroy();
      return res.json({
        "message": "Successfully deleted"
      });
    }

  }
)
module.exports = router;

const express = require('express');
const { Op } = require('sequelize');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const { Review, User, SpotImage, ReviewImage } = require('../../db/models');

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
router.post(
  '/:reviewId/images',    // A human said requireAuth already exists
  async (req, res, next) => {
    const { user } = req;
    const { reviewId } = req.params;
    const review = await Review.findByPk(reviewId, {
      attributes: {
        include: ['id']
      }
    });
    if (!user) {
      const err = new Error('Authentication required');
      err.status = 401;
      err.title = 'Authentication required'
      return next(err)

    } else if (!review) {
      const err = new Error('Review couldn\'t be found');
      err.status = 404;
      err.title = 'Review couldn\'t be found'
      return next(err)

    } else if (review.userId !== user.id) {
      // const allReviews = await Review.findAll(
        // attributes: {
        //   include: ['id']
        // }
      // );
      res.json(review);
      // const err = new Error('Forbidden');
      // err.status = 403;
      // err.title = 'Forbidden'
      // console.log(user.id)
      // res.json(review)
      // return next(err)
    } else {
    }
  }
)

/*
.custom((endDate, { req }) => {

         let enteredDate=new Date(endDate);
         let startDate=new Date(req.body.startDate);

           if (enteredDate.getTime() < startDate.getTime()) {
               throw new Error('End date is less than start date');
           }
           return true
       })
*/

// Get all Reviews of the Current User
router.get(
  '/current',                     // A human says to do requireAuth
  async (req, res, next) => {
    const { user } = req;
    const Reviews = [];
    if (user) {
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
            spotId: strawSpot.id
          }
        });
        foundSpot.previewImage = previewImage.url;

        let ReviewImages = await ReviewImage.findAll({
          attributes: ['id', 'url'],
          where: {
            reviewId: rev.id
          }
        })
        let newReview = rev.toJSON();
        newReview.User = grapes;
        newReview.Spot = foundSpot;
        newReview.ReviewImages = ReviewImages;
        Reviews.push(newReview);
      }
      res.json({
        Reviews
      })
    } else {
      const err = new Error('Authentication required');
      err.status = 401;
      err.title = 'Authentication required'
      return next(err)
    }
  }
)

module.exports = router;

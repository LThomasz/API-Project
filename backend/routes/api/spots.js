const express = require('express');
const { Op } = require('sequelize');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const { Spot, User, Review, SpotImage, ReviewImage, Booking } = require('../../db/models');
const { requireAuth } = require('../../utils/auth');
const router = express.Router();

const validateSpot = [
  check('address')
    .exists({ checkFalsy: true })
    .withMessage('Street address is required.'),
  check('city')
    .exists({ checkFalsy: true })
    .withMessage('City is required.'),
  check('state')
    .exists({checkFalsy: true})
    .withMessage('State is required.'),
    check('country')
    .exists({checkFalsy: true})
    .withMessage('Country is required.'),
  check('lat')
    .exists({checkFalsy: true})
    .isFloat({min: -90, max: 90})
    .withMessage('Latitude is not valid.'),
  check('lng')
    .exists({ checkFalsy: true })
    .isFloat({min: -180, max: 180})
    .withMessage('Longitude is not valid.'),
  check('name')
    .exists({ checkFalsy: true })
    .isLength({ max: 50 })
    .withMessage('Name must be less than 50 characters.'),
  check('description')
    .exists({ checkFalsy: true })
    .withMessage('Description is required.'),
  check('price')
    .exists({checkFalsy: true})
    .withMessage('Price per day is required.'),
  handleValidationErrors
];

const validateReview = [
  check('review')
    .exists({ checkFalsy: true })
    .withMessage('Review text is required.'),
  check('stars')
    .exists({ checkFalsy: true })
    .isInt({ min: 1 }, { max: 5 })
    .withMessage('Stars must be an integer from 1 to 5.'),
    handleValidationErrors
];

const validateBooking = [
  check('startDate')
    .exists({ checkFalsy: true })
    .withMessage('Start date is required'),
  check('endDate')
    .exists({ checkFalsy: true })
    .custom((endDate, { req }) => {
      if (new Date(req.body.startDate).getTime() >= new Date(endDate).getTime()) {
        throw new Error('endDate cannot be on or before startDate');
      }
      return true;
    }),
  handleValidationErrors
];

const validateQuery = (query) => {
  const err = new Error('Bad Request');
  err.status = 400;
  err.title = 'Bad Request'
  err.errors = {};
  if (query.page < 1) {
    err.errors.page = "Page must be greater than or equal to 1"
  }

  if (query.size < 1) {
    err.errors.size = "Size must be greater than or equal to 1"
  }

  if (query.maxLat < -90 || query.maxLat > 90) {
    err.errors.maxLat = "Maximum latitude is invalid"
  }

  if (query.minLat < -90 || query.minLat > 90) {
    err.errors.minLat = "Minimum latitude is invalid"
  }

  if (query.minLng < -180 || query.minLng > 180) {
    err.errors.minLng = "Minimum longitude is invalid"
  }

  if (query.maxLng < -180 || query.maxLng > 180) {
    err.errors.maxLng = "Maximum longitude is invalid"
  }

  if (query.minPrice < 0) {
    err.errors.minPrice = "Minimum price must be greater than or equal to 0"
  }

  if (query.maxPrice < 0) {
    err.errors.maxPrice = "Maximum price must be greater than or equal to 0"
  }
  return err;
}

// Get spots of current user
router.get( '/current',
  requireAuth,
  async (req, res, next) => {
    const { user } = req;
    const Spots = [];
    const allSpots = await Spot.findAll({
      where: {
        ownerId: user.id
      }
    });
    if (!allSpots.length) {
      return res.json({
        "message": "Currently no spots owned."
      })
    }

    for (let spot of allSpots) {
      const starsTotal = await Review.sum('stars', {
        where: {
          spotId: spot.id
        }
      });
      const starsCount = await Review.count({
        where: {
          spotId: spot.id
        }
      });
      let avgRating = starsTotal / starsCount;
      let previewImage = await SpotImage.findOne({
        attributes: ['url'],
        where: {
          spotId: spot.id
        }
      });
      let newSpot = spot.toJSON();
      if (avgRating) {
        newSpot.avgRating = avgRating;
      } else {
        newSpot.avgRating = "No ratings available for the spot."
      }
      if (previewImage) {
        newSpot.previewImage = previewImage.url;
      } else {
        newSpot.previewImage = "No preview image available."
      }
      Spots.push(newSpot);
    }
    return res.json({Spots})
  }
)

// Get all Spots
router.get( '/',
  async (req, res, next) => {

    if (req.query) {
      let err = validateQuery(req.query);
      let keys = Object.keys(err.errors);

      if (keys.length) {
        return next(err)
      }
    }
  const page = req.query.page || 1;
  const size = req.query.size || 20;

  const where = {};


  const { minLat, maxLat, minLng, maxLng, minPrice, maxPrice} = req.query;
  if (minLat && !maxLat) {
    where.lat = {[Op.gte]: minLat};
  }

  if (!minLat && maxLat) {
    where.lat = {[Op.lte]: maxLat};
  }

  if (minLat && maxLat) {
    where.lat = {[Op.between]: [minLat, maxLat]};
  }

  if (minLng && !maxLng) {
    where.lng = {[Op.gte]: minLng};
  }

  if (!minLng && maxLng) {
    where.lng = {[Op.lte]: maxLng};
  }

  if (minLng && maxLng) {
    where.lng = {[Op.between]: [minLng, maxLng]};
  }

  if (minPrice && !maxPrice) {
    where.price = {[Op.gte]: minPrice};
  }

  if (!minPrice && maxPrice) {
    where.price = {[Op.lte]: maxPrice};
  }

  if (minPrice && maxPrice) {
    where.price = {[Op.between]: [minPrice, maxPrice]};
  }


  const allSpots = await Spot.findAll({
    where,
    limit: size,
    offset: (page - 1) * size
  });
  const Spots = [];
  if (!allSpots.length) {
    return res.json({
      "message": "Currently no spots are available."
    })
  }

  for (let spot of allSpots) {

  const starsTotal = await Review.sum('stars', {
    where: {
      spotId: spot.id
    }
  });
  const starsCount = await Review.count({
    where: {
      spotId: spot.id
    }
  });
  let avgRating = starsTotal / starsCount;
  let previewImage = await SpotImage.findOne({
    attributes: ['url'],
    where: {
      spotId: spot.id,
      preview: true
    }
  });
    let newSpot = spot.toJSON();
    if (avgRating) {
      newSpot.avgRating = avgRating;
    } else {
      newSpot.avgRating = "No ratings available for the spot."
    }

    if (previewImage) {
      newSpot.previewImage = previewImage.url;
    } else {
      newSpot.previewImage = "No preview image available."
    }

    Spots.push(newSpot);
  }

  return res.json({
    Spots,
    page,
    size
  });
});

// Get all Bookings for a Spot based on the Spot's id
router.get( '/:spotId/bookings',
  requireAuth,
  async (req, res, next) => {
    const { user } = req;
    const { spotId } = req.params;
    const spot = await Spot.findByPk(spotId);
    if (!spot) {
      const err = new Error('Spot couldn\'t be found');
      err.status = 404;
      err.title = 'Spot couldn\'t be found'
      return next(err)

    } else if (user.id !== spot.ownerId) {
      const Bookings = await Booking.findAll({
        attributes: ['spotId', 'startDate', 'endDate'],
        where: {
          spotId: spot.id
        }
      });
      return res.json({
        Bookings
      });

    } else if (user.id === spot.ownerId) {
      const Bookings = await Booking.findAll({
        include: { model: User, attributes: ['id', 'firstName', 'lastName'] },
        where: {
          spotId: spot.id
        }
      });
      return res.json({
        Bookings
      })
    }
  }
)

// Get all Reviews by a Spot's id
router.get( '/:spotId/reviews',
  async (req, res, next) => {
    const { spotId } = req.params;
    const spot = await Spot.findByPk(spotId);

    if (spot) {
      const Reviews = [];
      const allReviews = await Review.findAll({
        attributes: {
          include: ['id']
        },
        where: {
          spotId: spot.id
        }
      });
      if (allReviews.length) {
        for (let rev of allReviews) {
        let grapes = await rev.getUser({
          attributes: ['id', 'firstName', 'lastName']
        });

        let ReviewImages = await ReviewImage.findAll({
          attributes: ['id', 'url'],
          where: {
            reviewId: rev.id
          }
        });

        let newReview = rev.toJSON();
        newReview.User = grapes;
        if (!ReviewImages.length) {
          newReview.ReviewImages = "No images available."
        } else {
          newReview.ReviewImages = ReviewImages;
        }
        Reviews.push(newReview)
        }
      } else {
        return res.json({
          Reviews: "No Reviews available."
        })
      }
      return res.json({
        Reviews
      })
    } else {
      const err = new Error('Spot couldn\'t be found');
      err.status = 404;
      err.title = 'Spot couldn\'t be found'
      return next(err)
    }
  }
)

// Get details of Spot from id
router.get( '/:spotId',
  async (req, res, next) => {
    const { spotId } = req.params;
    const spot = await Spot.findByPk(spotId);
    if (spot) {
      const starsTotal = await Review.sum('stars', {
        where: {
          spotId: spot.id
        }
      });
      const starsCount = await Review.count({
        where: {
          spotId: spot.id
        }
      });
      let avgRating = starsTotal / starsCount;
      const SpotImages = await spot.getSpotImages();
      const Owner = await User.findByPk(spot.ownerId, {
        attributes: ['id','firstName', 'lastName']
      });
      let newSpot = spot.toJSON();
      if (starsCount) {
        newSpot.numReviews = starsCount;
      } else {
        newSpot.numReviews = "No reviews available."
      }

      if (avgRating) {
        newSpot.avgRating = avgRating;
      } else {
        newSpot.avgRating = "No ratings available for the spot."
      }

      if (SpotImages.length) {
        newSpot.SpotImages = SpotImages;
      } else {
        newSpot.SpotImages = "No images available."
      }
      newSpot.Owner = Owner;

      return res.json(newSpot)
    } else {
      const err = new Error('Spot couldn\'t be found');
      err.status = 404;
      err.title = 'Spot couldn\'t be found'
      return next(err)
    }

  }
)

// Edit Spot
router.put( '/:spotId',
  requireAuth,
  validateSpot,
  async (req, res, next) => {
    const { user } = req;
    const { spotId } = req.params;
    const { address, city, state, country, lat, lng, name, description, price } = req.body;
    const spot = await Spot.findByPk(spotId);

    if (!spot) {
      const err = new Error('Spot couldn\'t be found');
      err.status = 404;
      err.title = 'Spot couldn\'t be found'
      return next(err)

    } else if (user.id !== spot.ownerId) {
      const err = new Error('Forbidden');
      err.status = 403;
      err.title = 'Forbidden'
      return next(err)

    } else {
      spot.address = address || spot.address;
      spot.city = city || spot.city;
      spot.state = state || spot.state;
      spot.country = country || spot.country;
      spot.lat = lat || spot.lat;
      spot.lng = lng || spot.lng;
      spot.name = name || spot.name;
      spot.description = description || spot.description;
      spot.price = price || spot.price;
      await spot.save();
      return res.json(spot)
    }
  }
)

// Create a Booking from a Spot based on the Spot's id
router.post( '/:spotId/bookings',
  requireAuth,
  validateBooking,
  async (req, res, next) => {
    const { user } = req;
    const { spotId } = req.params;
    const spot = await Spot.findByPk(spotId);
    const firstDate = req.body.startDate;
    const secondDate = req.body.endDate;

    if (!spot) {
      const err = new Error('Spot couldn\'t be found');
      err.status = 404;
      err.title = 'Spot couldn\'t be found'
      return next(err)

    } else if (user.id === spot.ownerId) {
      const err = new Error('Forbidden');
      err.status = 403;
      err.title = 'Forbidden'
      return next(err)

    } else {
      const bookCheck = await Booking.findAll({
        where: {
          spotId: spotId
        }
      });

      for (let book of bookCheck) {
        let inputBefore = Date.parse(firstDate);
        let inputAfter = Date.parse(secondDate);
        let before = Date.parse(book.startDate);
        let after = Date.parse(book.endDate);
        if (inputBefore >= before && inputAfter <= after) {
          const err = new Error('Sorry, this spot is already booked for the specified dates');
          err.status = 403;
          err.title = 'Sorry, this spot is already booked for the specified dates'
          err.errors = {
            "startDate": "Start date conflicts with an existing booking",
            "endDate": "End date conflicts with an existing booking"
            }
          return next(err);
        }
        if (inputAfter >= before && inputAfter <= after) {
          const err = new Error('Sorry, this spot is already booked for the specified dates');
          err.status = 403;
          err.title = 'Sorry, this spot is already booked for the specified dates'
          err.errors = {
            "endDate": "End date conflicts with an existing booking"
            }
          return next(err);
        }
        if (inputBefore >= before && inputBefore <= after) {
          const err = new Error('Sorry, this spot is already booked for the specified dates');
          err.status = 403;
          err.title = 'Sorry, this spot is already booked for the specified dates'
          err.errors = {
            "startDate": "Start date conflicts with an existing booking"
            }
          return next(err);
        }
        if (inputBefore <= before && inputAfter >= after) {
          const err = new Error('Sorry, this spot is already booked for the specified dates');
          err.status = 403;
          err.title = 'Sorry, this spot is already booked for the specified dates'
          err.errors = {
            "startDate": "Start date conflicts with an existing booking",
            "endDate": "End date conflicts with an existing booking"
            }
          return next(err);
        }

      }

      const newBooking = Booking.build({ startDate: firstDate, endDate: secondDate });
      newBooking.spotId = JSON.parse(spotId);
      newBooking.userId = user.id;
      await newBooking.save();

      return res.json(newBooking);
    }
  }
)

// Create a Review for a Spot based on the Spot's id
router.post( '/:spotId/reviews',
  requireAuth,
  validateReview,
  async (req, res, next) => {
    const { user } = req;
    const { spotId } = req.params;
    const { review, stars} = req.body;
    const spot = await Spot.findByPk(spotId);
    const seekReview = await Review.findOne({
      where: {
        spotId: spotId,
        review: review,
        stars: stars,
        userId: user.id
      }
    })
    if (!spot) {
      const err = new Error('Spot couldn\'t be found');
      err.status = 404;
      err.title = 'Spot couldn\'t be found'
      return next(err)

    } else if (seekReview) {
      const err = new Error('User already has a review for this spot');
      err.status = 500;
      err.title = 'User already has a review for this spot'
      return next(err)

    } else {

      const newReview = Review.build({ review, stars});
      newReview.spotId = JSON.parse(spotId);
      newReview.userId = user.id;
      await newReview.save();
      return res.status(201).json(newReview);
    }

  }
)

//Add SpotImage
router.post( '/:spotId/images',
  requireAuth,
  async (req, res, next) => {
    const { user } = req;
    const { spotId } = req.params;
    const { url, preview } = req.body;

    const spot = await Spot.findByPk(spotId);
    if (!spot) {
      const err = new Error('Spot couldn\'t be found');
      err.status = 404;
      err.title = 'Spot couldn\'t be found'
      return next(err)
    }

    if (user.id !== spot.ownerId) {
      const err = new Error('Forbidden');
      err.status = 403;
      err.title = 'Forbidden'
      return next(err)
    } else {

      const newSpotImage = await SpotImage.create({
        url,
        preview,
        spotId
      });

      const findImage = await SpotImage.findByPk(newSpotImage.id, {
        attributes: {
          exclude: ['spotId', 'updatedAt', 'createdAt']
        }
      })
      return res.json(findImage)
    }
});

// Create new spot
router.post( '/',
  requireAuth,
  validateSpot,
  async (req, res, next) => {
    const { user } = req;

    const { address, city, state, country, lat, lng, name, description, price } = req.body;
    const spot = Spot.build({ address, city, state, country, lat, lng, name, description, price });

    spot.ownerId = user.id;
    await spot.save();

    return res.status(201).json(spot)

});

// Delete a spot
router.delete( '/:spotId',
  requireAuth,
  async (req, res, next) => {
    const { user } = req;
    const { spotId } = req.params;
    const spot = await Spot.findByPk(spotId);

    if (!spot) {
      const err = new Error('Spot couldn\'t be found');
      err.status = 404;
      err.title = 'Spot couldn\'t be found'
      return next(err)

    } else if (user.id !== spot.ownerId) {
      const err = new Error('Forbidden');
      err.status = 403;
      err.title = 'Forbidden'
      return next(err)

    } else {
      await spot.destroy();
      return res.json({
        "message": "Successfully deleted"
      })
    }
  }
)
module.exports = router;

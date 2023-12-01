const express = require('express');
const { Op } = require('sequelize');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const { Spot, User, Review, SpotImage, ReviewImage, Booking } = require('../../db/models');

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

//Get spots of current user
router.get( '/current',
  async (req, res) => {
    const { user } = req;
    const Spots = [];
    if (user) {
      const allSpots = await Spot.findAll({
        where: {
          ownerId: user.id
        }
      });
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
        newSpot.avgRating = avgRating;
        newSpot.previewImage = previewImage.url;
        Spots.push(newSpot);
      }
      return res.json({Spots})
    } else {
      const err = new Error('Authentication required');
      err.status = 401;
      err.title = 'Authentication required'
      return next(err)
    }

  }
)

// Get all Spots
router.get( '/',
  async (req, res) => {
  // const Spots = await Spot.findAll({
  //   include: {
  //     model: Review
  //   }
  // });
  const allSpots = await Spot.findAll();
  const Spots = [];
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
    newSpot.avgRating = avgRating;
    newSpot.previewImage = previewImage.url;
    Spots.push(newSpot);
  }

  return res.json({
    Spots
  });
});

// Get all Bookings for a Spot based on the Spot's id
router.get( '/:spotId/bookings',
  async (req, res, next) => {
    const { user } = req;
    const { spotId } = req.params;
    const spot = await Spot.findByPk(spotId);
    if (!user) {
      const err = new Error('Authentication required');
      err.status = 401;
      err.title = 'Authentication required'
      return next(err)

    } else if (!spot) {
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
        newReview.ReviewImages = ReviewImages;
        Reviews.push(newReview)

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
      newSpot.avgRating = avgRating;
      newSpot.SpotImages = SpotImages;
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

//Edit Spot
router.put( '/:spotId',
  validateSpot,
  async (req, res, next) => {
    const { user } = req;
    const { spotId } = req.params;
    const { address, city, state, country, lat, lng, name, description, price } = req.body;
    const spot = await Spot.findByPk(spotId);

    if (!user) {
      const err = new Error('Authentication required');
      err.status = 401;
      err.title = 'Authentication required'
      return next(err)

    } else if (!spot) {
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
      res.json(spot)
    }
  }
)

//Create a Booking from a Spot based on the Spot's id
router.post( '/:spotId/bookings',
validateBooking,
  async (req, res, next) => {
    const { user } = req;
    const { spotId } = req.params;
    const spot = Spot.findByPk(spotId);
    const firstDate = req.body.startDate;
    const secondDate = req.body.endDate;

    if (!user) {
      const err = new Error('Authentication required');
      err.status = 401;
      err.title = 'Authentication required'
      return next(err)

    } else if (!spot) {
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
        // console.log(book.toJSON())
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

//Create a Review for a Spot based on the Spot's id
router.post( '/:spotId/reviews',
  validateReview,
  async (req, res, next) => {
    const { user } = req;
    const { spotId } = req.params;
    const spot = Spot.findByPk(spotId);

    if (!spot) {
      const err = new Error('Spot couldn\'t be found');
      err.status = 404;
      err.title = 'Spot couldn\'t be found'
      return next(err)

    } else if (!user) {
      const err = new Error('Authentication required');
      err.status = 401;
      err.title = 'Authentication required'
      return next(err)

    } else {
      const { review, stars} = req.body;

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

    if (!user) {
      const err = new Error('Authentication required');
      err.status = 401;
      err.title = 'Authentication required'
      return next(err)

    } else if (user.id !== spot.ownerId) {
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

      res.json(newSpotImage)
    }
})

// Create new spot
router.post( '/',
  validateSpot,
  async (req, res, next) => {
    const { user } = req;
      if (user) {
        const { address, city, state, country, lat, lng, name, description, price } = req.body;
        const spot = Spot.build({ address, city, state, country, lat, lng, name, description, price });

        spot.ownerId = user.id;
        await spot.save();

        return res.status(201).json(spot)
      } else {
        const err = new Error('Authentication required');
        err.status = 401;
        err.title = 'Authentication required'
        return next(err)
      }
});

module.exports = router;

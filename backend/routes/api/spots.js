const express = require('express');
const { Op } = require('sequelize');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const { Spot, User, Review, SpotImage } = require('../../db/models');
const { nextTick } = require('process');

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

//Get spots of current user
router.get(
  '/current',
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
router.get('/', async (req, res) => {
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
    // console.log(starsCount)
    // console.log(starsTotal)
    // console.log(avgRating)
  }

  return res.json({
    Spots
  });
});

// Get details of Spot from id
router.get(
  '/:spotId',
  async (req, res) => {
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
      err.title = 'Spot coulnd\'t be found'
      return next(err)
    }

  }
)

//Edit Spot
router.put(
  '/:spotId',
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

    } else if (user.id !== spot.ownerId) {
      const err = new Error('Forbidden');
      err.status = 403;
      err.title = 'Forbidden'
      return next(err)

    } else if (!spot) {
      const err = new Error('Spot couldn\'t be found');
      err.status = 404;
      err.title = 'Spot coulnd\'t be found'
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

//Add SpotImage
router.post(
  '/:spotId/images',
  async (req, res, next) => {
    const { user } = req;
    const { spotId } = req.params;
    const { url, preview } = req.body;

    const spot = await Spot.findByPk(spotId);
    if (!spot) {
      const err = new Error('Spot couldn\'t be found');
      err.status = 404;
      err.title = 'Spot coulnd\'t be found'
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
router.post(
  '/',
  validateSpot,
  async (req, res, next) => {
    const { user } = req;
      if (user) {
        const { address, city, state, country, lat, lng, name, description, price } = req.body;
        const spot = Spot.build({ address, city, state, country, lat, lng, name, description, price });

        spot.ownerId = user.id;
        await spot.save();

        return res.json(spot)
      } else {
        const err = new Error('Authentication required');
        err.status = 401;
        err.title = 'Authentication required'
        return next(err)
      }
});

module.exports = router;

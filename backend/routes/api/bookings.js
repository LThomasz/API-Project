const express = require('express');
const { Op } = require('sequelize');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const { Booking, Spot, SpotImage } = require('../../db/models');
const router = express.Router();

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

// Edit a Booking
router.put( '/:bookingId',
  validateBooking,
  async (req, res, next) => {
    const { user } = req;
    const { bookingId } = req.params;
    const theBooking = await Booking.findByPk(bookingId);
    const today = new Date();
    const firstDate = req.body.startDate;
    const secondDate = req.body.endDate;
    const spotId = theBooking.spotId;
    if (!user) {
      const err = new Error('Authentication required');
      err.status = 401;
      err.title = 'Authentication required'
      return next(err)

    } else if (!theBooking) {
      const err = new Error('Booking couldn\'t be found');
      err.status = 404;
      err.title = 'Booking couldn\'t be found'
      return next(err)

    } else if (theBooking.userId !== user.id) {
      const err = new Error('Forbidden');
      err.status = 403;
      err.title = 'Forbidden'
      return next(err)

    } else if (Date.parse(today) > Date.parse(theBooking.endDate) && Date.parse(today) > Date.parse(theBooking.endDate)) {
      const err = new Error('Past bookings can\'t be modified');
      err.status = 403;
      err.title = 'Past bookings can\'t be modified';
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

      theBooking.startDate = firstDate || theBooking.startDate;
      theBooking.endDate = secondDate || theBooking.endDate;
      await theBooking.save();

      return res.json(theBooking);
    }
  }
)

// Get all of the Current User's Bookings
router.get( '/current',
  async (req, res, next) => {
    const { user } = req;
    if (!user) {
      const err = new Error('Authentication required');
      err.status = 401;
      err.title = 'Authentication required'
      return next(err)

    } else {
      const Bookings = [];
      const foundBookings = await Booking.findAll({
        include: [
          {
            model: Spot,
            attributes: {
              exclude: ['description', 'createdAt', 'updatedAt']
            },
            // include: [
            //   {
            //     model: SpotImage,
            //     attributes: ['url']
            //   }
            // ]
          },
        ],
        where: {
        userId: user.id
        }
      });

      for (let book of foundBookings) {
        book = book.toJSON();
        let previewImage = await SpotImage.findOne({
          attributes: ['url'],
          where: {
            spotId: book.Spot.id
          }
        })
        previewImage = previewImage.toJSON();
        book.Spot.previewImage = previewImage.url;
        console.log(book)
        Bookings.push(book)
      }

      return res.json({
        Bookings
      });
    }
  }
)
module.exports = router;

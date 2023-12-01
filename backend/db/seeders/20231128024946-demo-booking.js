'use strict';

/** @type {import('sequelize-cli').Migration} */
const { Booking } = require('../models');

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
    await Booking.bulkCreate([
      {
        spotId: 2,
        userId: 1,
        startDate: '2024-02-15',
        endDate: '2024-02-20'
      },
      {
        spotId: 1,
        userId: 3,
        startDate: '2024-05-10',
        endDate: '2024-05-13'
      },
      {
        spotId: 3,
        userId: 2,
        startDate: '2024-03-24',
        endDate: '2024-03-26'
      },
      {
        spotId: 4,
        userId: 2,
        startDate: '2024-03-27',
        endDate: '2024-03-29'
      }
    ], {validate: true});
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    options.tableName = 'Bookings';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      spotId: { [Op.in]: [1, 2, 3, 4] }
    }, {});
  }
};

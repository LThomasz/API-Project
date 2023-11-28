'use strict';

/** @type {import('sequelize-cli').Migration} */
const { Review } = require('../models');

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
   await Review.bulkCreate([
    {
      spotId: 2,
      userId: 1,
      review: 'Great atmosphere for writing, but some noticeable stains and dusty windows.',
      stars: 3
    },
    {
      spotId: 1,
      userId: 3,
      review: 'Dark ambiance, but not very Addamsy, really cool to be able to see the house, though.',
      stars: 4
    },
    {
      spotId: 3,
      userId: 2,
      review: 'The most haunted place I\'ve ever been, perfect uncanny feeling at every corner. Definitely coming back.',
      stars: 5
    },
    {
      spotId: 4,
      userId: 2,
      review: 'Very clean, almost scarily clean, and it was uncomfortably quiet the whole night. Couldn\'t get an ounce of sleep.',
      stars: 2
    }
   ], {validate: true})
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    options.tableName = 'Reviews';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      spotId: { [Op.in]: [1, 2, 3, 4] }
    }, {});
  }
};

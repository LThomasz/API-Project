'use strict';

/** @type {import('sequelize-cli').Migration} */
const { SpotImage } = require('../models');

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
   await SpotImage.bulkCreate([
    {
      spotId: 1,
      url: 'image.url',
      preview: false
    },
    {
      spotId: 1,
      url: 'image1.url',
      preview: false
    },
    {
      spotId: 1,
      url: 'image2.url',
      preview: false
    },
    {
      spotId: 1,
      url: 'image3.url',
      preview: false
    },
    {
      spotId: 2,
      url: 'image4.url',
      preview: false
    },
    {
      spotId: 2,
      url: 'image5.url',
      preview: false
    },
    {
      spotId: 2,
      url: 'image6.url',
      preview: false
    },
    {
      spotId: 2,
      url: 'image7.url',
      preview: false
    },
    {
      spotId: 3,
      url: 'image8.url',
      preview: false
    },
    {
      spotId: 3,
      url: 'image9.url',
      preview: false
    },
    {
      spotId: 3,
      url: 'image10.url',
      preview: false
    },
    {
      spotId: 3,
      url: 'image11.url',
      preview: false
    },
    {
      spotId: 4,
      url: 'image12.url',
      preview: false
    },
    {
      spotId: 4,
      url: 'image13.url',
      preview: false
    },
    {
      spotId: 4,
      url: 'image14.url',
      preview: false
    },
    {
      spotId: 4,
      url: 'image15.url',
      preview: false
    },
   ], { validate: true});
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    options.tableName = 'SpotImages';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      preview: { [Op.in]: [true, false] }
    }, {});
  }
};

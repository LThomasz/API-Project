'use strict';

/** @type {import('sequelize-cli').Migration} */
const { ReviewImage } = require('../models');

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
   await ReviewImage.bulkCreate([
    {
      reviewId: 1,
      url: 'https://img.freepik.com/premium-photo/dusty-room-with-old-distressed-windows-sun-rays-abandoned-grungy-interior-with-lights-dust-generated-ai_116953-4998.jpg'
    },
    {
      reviewId: 2,
      url: 'https://photos.lensculture.com/large/9352e02f-02ff-4f0b-b373-cb2adf2bd9d1.jpg'
    },
    {
      reviewId: 3,
      url: 'https://arc-anglerfish-washpost-prod-washpost.s3.amazonaws.com/public/DWAFRTAXUII6XC62QFGKK3QTRM.jpg'
    },
    {
      reviewId: 4,
      url: 'https://i.dailymail.co.uk/i/newpix/2018/03/05/17/49B322EE00000578-0-image-a-37_1520272379176.jpg'
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
    options.tableName = 'ReviewImages';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      reviewId: { [Op.in]: [1, 2, 3, 4] }
    }, {});
  }
};

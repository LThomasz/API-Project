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
      url: 'https://21chesterplace.com/wp-content/uploads/2015/09/newhallhouse1960.jpg',
      preview: false
    },
    {
      spotId: 2,
      url: 'https://upload.wikimedia.org/wikipedia/commons/7/7a/Hemingwayhouse.jpg',
      preview: true
    },
    {
      spotId: 3,
      url: 'https://photos.zillowstatic.com/fp/e17c2e17b2462efaf63c0989e3525bf7-cc_ft_576.webp',
      preview: false
    },
    {
      spotId: 4,
      url: 'https://images1.loopnet.com/i2/QOKHja8jVwv0mH5HcQDjdiqJ3N_md8lAmzi4ObhiqFc/110/14755-Ventura-Blvd-Sherman-Oaks-CA-Primary-Photo-1-Large.jpg',
      preview: true
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

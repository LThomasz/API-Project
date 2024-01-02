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
      url: 'https://generatorfun.com/code/uploads/Random-House-image-9.jpg',
      preview: true
    },
    {
      spotId: 1,
      url: 'https://generatorfun.com/code/uploads/Random-House-image-13.jpg',
      preview: true
    },
    {
      spotId: 1,
      url: 'https://generatorfun.com/code/uploads/Random-House-image-4.jpg',
      preview: true
    },
    {
      spotId: 1,
      url: 'https://generatorfun.com/code/uploads/Random-House-image-8.jpg',
      preview: true
    },
    {
      spotId: 1,
      url: 'https://generatorfun.com/code/uploads/Random-House-image-17.jpg',
      preview: true
    },
    {
      spotId: 2,
      url: 'https://cdn.houseplansservices.com/content/9ns4vp133de3p7n98dhr862uvd/w991x660.jpg?v=2',
      preview: true
    },
    {
      spotId: 2,
      url: 'https://media.architecturaldigest.com/photos/64f71af50a84399fbdce2f6a/16:9/w_6720,h_3780,c_limit/Living%20with%20Lolo%20Photo%20Credit_%20Life%20Created%204.jpg',
      preview: true
    },
    {
      spotId: 2,
      url: 'https://www.decorilla.com/online-decorating/wp-content/uploads/2023/08/Modern-Mediterranean-interior-design-for-a-living-room.jpg',
      preview: true
    },
    {
      spotId: 2,
      url: 'https://images.unsplash.com/photo-1603283297623-f44d1dde80e5?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fGhvdXNlJTIwcm9vbXxlbnwwfHwwfHx8MA%3D%3D',
      preview: true
    },
    {
      spotId: 2,
      url: 'https://media.designcafe.com/wp-content/uploads/2021/08/07190905/10-low-budget-house-design.jpg',
      preview: true
    },
    {
      spotId: 3,
      url: 'image8.url',
      preview: true
    },
    {
      spotId: 3,
      url: 'image9.url',
      preview: true
    },
    {
      spotId: 3,
      url: 'image10.url',
      preview: true
    },
    {
      spotId: 3,
      url: 'image11.url',
      preview: true
    },
    {
      spotId: 4,
      url: 'image12.url',
      preview: true
    },
    {
      spotId: 4,
      url: 'image13.url',
      preview: true
    },
    {
      spotId: 4,
      url: 'image14.url',
      preview: true
    },
    {
      spotId: 4,
      url: 'image15.url',
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

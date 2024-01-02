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
      url: 'https://images.unsplash.com/photo-1628624747186-a941c476b7ef?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      preview: true
    },
    {
      spotId: 3,
      url: 'https://images.unsplash.com/photo-1616137466211-f939a420be84?q=80&w=1332&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      preview: true
    },
    {
      spotId: 3,
      url: 'https://images.unsplash.com/photo-1600607686527-6fb886090705?q=80&w=1287&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      preview: true
    },
    {
      spotId: 3,
      url: 'https://images.unsplash.com/photo-1616593918824-4fef16054381?q=80&w=1480&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      preview: true
    },
    {
      spotId: 3,
      url: 'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?q=80&w=1287&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      preview: true
    },
    {
      spotId: 4,
      url: 'https://images.unsplash.com/photo-1627141234469-24711efb373c?q=80&w=1469&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      preview: true
    },
    {
      spotId: 4,
      url: 'https://images.unsplash.com/photo-1602872030219-ad2b9a54315c?q=80&w=1287&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      preview: true
    },
    {
      spotId: 4,
      url: 'https://images.unsplash.com/photo-1519710164239-da123dc03ef4?q=80&w=1287&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      preview: true
    },
    {
      spotId: 4,
      url: 'https://images.unsplash.com/photo-1567225557594-88d73e55f2cb?q=80&w=1287&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      preview: true
    },
    {
      spotId: 4,
      url: 'https://images.unsplash.com/photo-1507089947368-19c1da9775ae?q=80&w=1476&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      preview: true
    },
    {
      spotId: 5,
      url: 'https://images.unsplash.com/photo-1682687982046-e5e46906bc6e?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      preview: true
    },
    {
      spotId: 5,
      url: 'https://images.unsplash.com/photo-1702589240175-53d887424963?q=80&w=1374&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      preview: true
    },
    {
      spotId: 5,
      url: 'https://images.unsplash.com/photo-1502726299822-6f583f972e02?q=80&w=1374&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      preview: true
    },
    {
      spotId: 5,
      url: 'https://images.unsplash.com/photo-1530053969600-caed2596d242?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTV8fHVuZGVyd2F0ZXIlMjBjYXN0bGV8ZW58MHx8MHx8fDA%3D',
      preview: true
    },
    {
      spotId: 5,
      url: 'https://images.unsplash.com/photo-1525467187333-8e3f68b8e742?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
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

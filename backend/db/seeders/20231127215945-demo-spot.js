'use strict';

/** @type {import('sequelize-cli').Migration} */
const { Spot } = require('../models');

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
   await Spot.bulkCreate([
    {
      ownerId: 1,
      address: '21 Chester Place',
      city: 'Los Angeles',
      state: 'California',
      country: 'United States of America',
      lat: 34.029802,
      lng: -118.278551,
      name: 'Addam\'s Family Residence',
      description: 'The house where something was filmed.',
      price: 135
    },
    {
      ownerId: 2,
      address: '907 Whitehead St',
      city: 'Key West',
      state: 'Florida',
      country: 'United States of America',
      lat: 24.5517973,
      lng: -81.8006162,
      name: 'The Hemingway Home and Museum',
      description: 'Former residence of Ernest Hemingway in the 1930s.',
      price: 300
    },
    {
      ownerId: 2,
      address: '5225 Figueroa Mountain Road',
      city: 'Los Olivos',
      state: 'California',
      country: 'United States of America',
      lat: 34.7415037,
      lng: -120.0930663,
      name: 'Neverland Railway Station',
      description: 'Something something Michael Jackson, Teehee.',
      price: 430
    },
    {
      ownerId: 3,
      address: '14755 Ventura Boulevard',
      city: 'Sherman Oaks',
      state: 'California',
      country: 'United States of America',
      lat: 34.1523966,
      lng: -118.4549588,
      name: 'Tom Cruise\'s Childhood Home',
      description: 'Scientology and other stuff.',
      price: 66
    },
    {
      ownerId: 3,
      address: '40404 Ocean Boulevard',
      city: 'Atlantis',
      state: 'Florida',
      country: 'United States of America',
      lat: 34.1523966,
      lng: 34.5832718,
      name: 'Literally The Ocean',
      description: 'The hurricanes pass right over you.',
      price: 77
    }
   ], { validate: true});
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    options.tableName = 'Spots';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      address: { [Op.in]: ['21 Chester Place', '5225 Figueroa Mountain Road', '14755 Ventura Boulevard'] }
    }, {});
  }
};

const express = require('express');
const { Op } = require('sequelize');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const { Spot, User } = require('../../db/models');

const router = express.Router();

//Get all Spots
router.get('/', async (req, res) => {
  const allSpots = await Spot.findAll();

  return res.json(allSpots);
})

module.exports = router;

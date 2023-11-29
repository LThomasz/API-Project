const express = require('express');
const { Op } = require('sequelize');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const { Review } = require('../../db/models');

const router = express.Router();

// Get all Reviews of the Current User
router.get(
  '/current',
  async (req, res, next) => {

  }
)

module.exports = router;

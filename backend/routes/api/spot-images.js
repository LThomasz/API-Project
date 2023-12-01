const express = require('express');
const { Spot, SpotImage } = require('../../db/models');
const { requireAuth } = require('../../utils/auth');
const router = express.Router();

router.delete( '/:imageId',
  requireAuth,
  async (req, res, next) => {
    const { user } = req;
    const { imageId } = req.params;
    const theImage = await SpotImage.findByPk(imageId);
    const spot = await Spot.findByPk(theImage.spotId);
    if (!theImage) {
      const err = new Error('Spot Image couldn\'t be found');
      err.status = 404;
      err.title = 'Spot Image couldn\'t be found'
      return next(err);

    } else if (user.id !== spot.ownerId) {
      const err = new Error('Forbidden');
      err.status = 403;
      err.title = 'Forbidden'
      return next(err);

    } else {
      await theImage.destroy();
      return res.json({
        "message": "Successfully deleted"
      })
    }
  }
)


module.exports = router;

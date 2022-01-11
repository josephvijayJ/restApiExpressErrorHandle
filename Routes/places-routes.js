const express = require('express');
const router = express.Router();
const { check } = require('express-validator');

const placesController = require('../controllers/places-controller');

router.get('/:placeid', placesController.getPlaceById);
router.get('/user/:userid', placesController.getPlacesByUserId);
router.post(
  '/',
  [
    check('title').not().isEmpty(),
    check('description').isLength({ min: 5 }),
    check('address').not().isEmpty(),
  ],
  placesController.createPlace
);
router.patch(
  '/:placeid',
  [check('title').not().isEmpty(), check('description').isLength({ min: 5 })],
  placesController.updatePlaceById
);
router.delete('/:placeid', placesController.deletePlace);
router.get('/', placesController.getAllPlaces);

module.exports = router;

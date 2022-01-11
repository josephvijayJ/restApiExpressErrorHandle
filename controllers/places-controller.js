const HttpError = require('../models/http-error');
const { v4: uuidv4 } = require('uuid');
const { validationResult } = require('express-validator');

let DUMMY_PLACES = [
  {
    id: 'p1',
    title: 'Empire State building',
    description: 'one of the most famous skyscrappers in the world',
    address: '20 w 34th st,NewYork',
    creator: 'u1',
  },
  {
    id: 'p2',
    title: 'Empire State building',
    description: 'one of the most famous skyscrappers in the world',
    address: '20 w 34th st,NewYork',
    creator: 'u2',
  },
];

const getPlaceById = (req, res, next) => {
  let id = req.params.placeid; //{pid:'p1'}
  let place = DUMMY_PLACES.find((placeid) => {
    return id === placeid.id;
  });
  if (!place) {
    throw new HttpError('could not find the place for the provided id', 404);
  }

  res.json({ place });
};

const getPlacesByUserId = (req, res, next) => {
  let id = req.params.userid;
  let places = DUMMY_PLACES.filter((userid) => {
    return userid.creator === id;
  });
  if (!places || places.length === 0) {
    return next(
      HttpError('could not find the place for the provided user id', 404)
    );
  }

  res.json({ places });
};

const createPlace = (req, res, next) => {
  console.log(req.body);
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new HttpError('INVALID INPUTS PASSED PLEASE CHECK YOUR DATA', 422);
  }
  const { title, description, address, creator } = req.body;
  //const title = req.body.title;
  const createdPlace = {
    id: uuidv4(),
    title,
    description,
    address,
    creator,
  };
  DUMMY_PLACES.push(createdPlace); //use unshift(createdPlace) to come first
  res.status(201);
  res.json(createdPlace);
};

const updatePlaceById = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError('Invalid inputs passed please check your input data', 422)
    );
  }
  const id = req.params.placeid; //{id:p1}
  const { title, description } = req.body;
  let IndexPlace = DUMMY_PLACES.findIndex((p) => p.id === id);
  let updatedPlace = DUMMY_PLACES.find((p) => p.id === id);
  // updatedPlace.title = title;
  // updatedPlace.description = description;
  let finalUpdatedPlace = { ...updatedPlace, title, description };
  console.log(updatedPlace);
  DUMMY_PLACES[IndexPlace] = finalUpdatedPlace;
  res.status(200).json({ updatedPlace: finalUpdatedPlace });
};

const deletePlace = (req, res, next) => {
  const deleteid = req.params.placeid;
  DUMMY_PLACES = DUMMY_PLACES.filter((p) => p.id !== deleteid);
  res.status(200).json({ message: 'place Deleted Successfully' });
};

const getAllPlaces = (req, res, next) => {
  if (DUMMY_PLACES === []) {
    console.log('error in getAllPlaces');
    throw new HttpError('PLACES ARE EMPTY', 404);
  }
  res.json(DUMMY_PLACES);
};

exports.getPlaceById = getPlaceById;
exports.getPlacesByUserId = getPlacesByUserId;
exports.createPlace = createPlace;
exports.updatePlaceById = updatePlaceById;
exports.deletePlace = deletePlace;
exports.getAllPlaces = getAllPlaces;

const HttpError = require('../models/http-error');
const { v4: uuidv4 } = require('uuid');
const { validationResult } = require('express-validator');

let DUMMY_USERS = [
  {
    id: 'u1',
    name: 'Joseph Vijay',
    email: 'jose@gmail.com',
    password: 'developer',
  },
];

const getUsers = (req, res, next) => {
  if (DUMMY_USERS.length === 0) {
    return next(new HttpError('No users found', 404));
  }
  res.json({ users: DUMMY_USERS });
};

const signUp = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new HttpError('Input values may be invalid', 422));
  }
  const { name, email, password } = req.body;
  const mailIdentifier = DUMMY_USERS.find((u) => u.email === email);
  if (mailIdentifier) {
    return next(new HttpError('Email Already Exists', 422));
  }
  const createdUser = {
    id: uuidv4(),
    name,
    email,
    password,
  };
  DUMMY_USERS.push(createdUser);
  res.status(201).json({ user: createdUser });
};

const login = (req, res, next) => {
  const { email, password } = req.body;
  const identifiedUser = DUMMY_USERS.find((p) => p.email === email);
  if (!identifiedUser || identifiedUser.password !== password) {
    //status code 401==>authentication failed
    return next(new HttpError('Invalid Credentials', 401));
  }
  res.status(200).json({ message: 'logged in successfully !!!' });
};

exports.getUsers = getUsers;
exports.signUp = signUp;
exports.login = login;

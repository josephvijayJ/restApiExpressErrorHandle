const express = require('express');
const bodyParser = require('body-parser');
const placesRoutes = require('./Routes/places-routes');
const usersRoutes = require('./Routes/users-routes');

const HttpError = require('./models/http-error');

const app = express();
app.use(bodyParser.json());

app.use('/api/places', placesRoutes); // => /api/places
app.use('/api/users', usersRoutes);
//throwing an error if we cant able to find the routes before

app.use((req, res, next) => {
  const error = new HttpError('Could not find this route', 404);
  throw error;
});

//special middleware for error handling in express js requires four parameters
// this function will only execute if midlle ware before it throws an error
app.use((error, req, res, next) => {
  if (res.headerSent) {
    return next(error);
  }
  res.status(error.code || 500); //message we have to give in that middleware
  res.json({ message: error.message || 'An unknown error Occured' });
});

app.listen(3000);

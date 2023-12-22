// server/server.js

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MongoDB Connection
mongoose.connect('mongodb+srv://timmymakay:timmy@clustermovie.6gcb4vq.mongodb.net/?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true });
const connection = mongoose.connection;

// Handle MongoDB connection errors
connection.on('error', (err) => {
  console.error('MongoDB connection error:', err);
});

connection.once('open', () => {
  console.log('MongoDB connection established successfully');
});

// Movie Schema
const movieSchema = new mongoose.Schema({
  title: String,
  genre: String,
  releaseDate: Date,
  description: String,
  review: String,
  duration: String,
});

const Movie = mongoose.model('Movie', movieSchema);

// Routes
// server/server.js

// Add a new movie
app.post('/movies/add', (req, res) => {
  const newMovie = new Movie(req.body);
  newMovie.save()
    .then(movie => {
      console.log('Movie added successfully:', movie);
      res.json(movie);
    })
    .catch(err => {
      console.error('Error adding movie:', err);
      res.status(400).json('Error: ' + err);
    });
});

// Get all movies
app.get('/movies', (req, res) => {
  Movie.find({})
    .then((movies) => {
      res.json(movies);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ error: 'Internal Server Error' });
    });
});


app.get('/movies/:id', (req, res) => {
  const movieId = req.params.id;

  // Validate if movieId is a valid ObjectId before proceeding
  if (!mongoose.Types.ObjectId.isValid(movieId)) {
    return res.status(400).json({ error: 'Invalid movie ID' });
  }

  Movie.findById(movieId)
    .then((movie) => {
      if (!movie) {
        return res.status(404).json({ error: 'Movie not found' });
      }
      res.json(movie);
    })
    .catch((error) => {
      console.error('Error fetching movie details:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    });
});


app.delete('/movies/delete/:id', (req, res) => {
  const movieId = req.params.id;

  // Validate if movieId is a valid ObjectId
  if (!mongoose.Types.ObjectId.isValid(movieId)) {
    return res.status(400).json({ error: 'Invalid movie ID' });
  }

  Movie.findByIdAndDelete(movieId)
    .then((result) => {
      if (!result) {
        return res.status(404).json({ error: 'Movie not found' });
      }
      console.log('Movie deleted successfully:', movieId);
      res.json({ success: true });
    })
    .catch((error) => {
      console.error('Error deleting movie:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    });
});


app.put('/movies/update/:id', (req, res) => {
  const movieId = req.params.id;

  // Validate if movieId is a valid ObjectId
  if (!mongoose.Types.ObjectId.isValid(movieId)) {
    return res.status(400).json({ error: 'Invalid movie ID' });
  }

  Movie.findByIdAndUpdate(movieId, req.body, { new: true })
    .then((updatedMovie) => {
      if (!updatedMovie) {
        return res.status(404).json({ error: 'Movie not found' });
      }
      console.log('Movie updated successfully:', updatedMovie);
      res.json(updatedMovie);
    })
    .catch((error) => {
      console.error('Error updating movie:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Import required modules
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path'); // Add this

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Serve static files from the "frontend" folder
app.use(express.static(path.join(__dirname, 'frontend')));

// Mock database (in-memory storage)
let movies = [
    { id: 1, title: "Inception", genre: "Sci-Fi", rating: 8.8 },
    { id: 2, title: "The Dark Knight", genre: "Action", rating: 9.0 },
];

// Routes
// Fetch all movies
app.get('/api/movies', (req, res) => {
    res.json(movies);
});

// Add a new movie
app.post('/api/movies', (req, res) => {
    const { title, genre, rating } = req.body;
    const newMovie = {
        id: movies.length + 1,
        title,
        genre,
        rating: parseFloat(rating),
    };
    movies.push(newMovie);
    res.status(201).json(newMovie);
});

// Edit a movie
app.put('/api/movies/:id', (req, res) => {
    const { id } = req.params;
    const { title, genre, rating } = req.body;

    const movie = movies.find(m => m.id === parseInt(id));
    if (movie) {
        movie.title = title;
        movie.genre = genre;
        movie.rating = parseFloat(rating);
        res.json(movie);
    } else {
        res.status(404).json({ message: "Movie not found" });
    }
});

// Delete a movie
app.delete('/api/movies/:id', (req, res) => {
    const { id } = req.params;
    const index = movies.findIndex(m => m.id === parseInt(id));

    if (index !== -1) {
        movies.splice(index, 1);
        res.json({ message: "Movie deleted successfully" });
    } else {
        res.status(404).json({ message: "Movie not found" });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

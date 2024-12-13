// Import required modules
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

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
    { id: 3, title: "Interstellar", genre: "Sci-Fi", rating: 8.6 },
    { id: 4, title: "Pulp Fiction", genre: "Drama", rating: 8.9 }
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
        id: movies.length > 0 ? Math.max(...movies.map(m => m.id)) + 1 : 1,
        title,
        genre,
        rating: parseFloat(rating),
    };
    movies.push(newMovie);
    res.status(201).json(newMovie);
});

// Edit a movie
app.put('/api/movies/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const { title, genre, rating } = req.body;

    const movieIndex = movies.findIndex(m => m.id === id);
    if (movieIndex !== -1) {
        movies[movieIndex] = {
            id,
            title,
            genre,
            rating: parseFloat(rating)
        };
        res.json(movies[movieIndex]);
    } else {
        res.status(404).json({ message: "Movie not found" });
    }
});

// Delete a movie
app.delete('/api/movies/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const index = movies.findIndex(m => m.id === id);

    if (index !== -1) {
        const deletedMovie = movies.splice(index, 1)[0];
        res.json({ message: "Movie deleted successfully", movie: deletedMovie });
    } else {
        res.status(404).json({ message: "Movie not found" });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

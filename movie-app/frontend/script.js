// Global state to track current editing mode
let isEditMode = false;

document.addEventListener("DOMContentLoaded", () => {
    fetchMovies();
    setupFormSubmission();
});

// Fetch movies from the backend and render the data table and chart
function fetchMovies() {
    fetch("/api/movies")
        .then(response => response.json())
        .then(data => {
            // Sort movies by rating in descending order
            const sortedMovies = data.sort((a, b) => b.rating - a.rating);
            renderMoviesTable(sortedMovies);
            renderMovieChart(sortedMovies);
        })
        .catch(error => {
            console.error("Error fetching movies:", error);
            showNotification("Failed to fetch movies", "error");
        });
}

// Render movie table with enhanced functionality
function renderMoviesTable(movies) {
    const tableBody = document.getElementById("movie-table-body");
    tableBody.innerHTML = ""; // Clear existing rows

    // Create table rows with more detailed actions
    movies.forEach(movie => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${movie.title}</td>
            <td>${movie.genre}</td>
            <td>${movie.rating.toFixed(1)}</td>
            <td>
                <div class="action-buttons">
                    <button onclick="editMovie(${movie.id})" class="btn edit-btn">
                        <i class="fas fa-edit"></i> Edit
                    </button>
                    <button onclick="deleteMovie(${movie.id})" class="btn delete-btn">
                        <i class="fas fa-trash"></i> Delete
                    </button>
                </div>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

// Render movie ratings chart with more visualization options
function renderMovieChart(movies) {
    const ctx = document.getElementById("movieChart").getContext("2d");

    // Extract data for chart
    const titles = movies.map(movie => movie.title);
    const ratings = movies.map(movie => movie.rating);
    const genres = movies.map(movie => movie.genre);

    // Create chart with multiple dataset options
    new Chart(ctx, {
        type: "bar",
        data: {
            labels: titles,
            datasets: [
                {
                    label: "Movie Ratings",
                    data: ratings,
                    backgroundColor: genres.map(genre => getColorForGenre(genre)),
                    borderColor: "rgba(0,0,0,0.6)",
                    borderWidth: 1,
                },
            ],
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true,
                    max: 10,
                    title: {
                        display: true,
                        text: 'Rating'
                    }
                }
            },
            plugins: {
                title: {
                    display: true,
                    text: 'Movie Ratings by Genre'
                }
            }
        }
    });
}

// Color mapping for genres
function getColorForGenre(genre) {
    const genreColors = {
        'Sci-Fi': 'rgba(54, 162, 235, 0.6)',
        'Action': 'rgba(255, 99, 132, 0.6)',
        'Drama': 'rgba(75, 192, 192, 0.6)',
        'Comedy': 'rgba(255, 205, 86, 0.6)',
        'Horror': 'rgba(153, 102, 255, 0.6)'
    };
    return genreColors[genre] || 'rgba(201, 203, 207, 0.6)';
}

// Setup form submission handler
function setupFormSubmission() {
    const form = document.getElementById("movieForm");
    form.addEventListener("submit", function(e) {
        e.preventDefault();
        
        const id = document.getElementById("movie-id").value;
        const title = document.getElementById("title").value;
        const genre = document.getElementById("genre").value;
        const rating = document.getElementById("rating").value;

        if (isEditMode && id) {
            updateMovie(id, { title, genre, rating });
        } else {
            addMovie({ title, genre, rating });
        }
    });
}

// Add a new movie
function addMovie(movieData) {
    fetch("/api/movies", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(movieData)
    })
    .then(response => response.json())
    .then(newMovie => {
        fetchMovies(); // Refresh the entire list
        resetForm();
        showNotification(`Movie "${newMovie.title}" added successfully`, "success");
    })
    .catch(error => {
        console.error("Error adding movie:", error);
        showNotification("Failed to add movie", "error");
    });
}

// Edit a movie - populate form
function editMovie(id) {
    // Find the movie to edit
    fetch("/api/movies")
        .then(response => response.json())
        .then(movies => {
            const movie = movies.find(m => m.id === id);
            if (movie) {
                // Populate form
                document.getElementById("movie-id").value = movie.id;
                document.getElementById("title").value = movie.title;
                document.getElementById("genre").value = movie.genre;
                document.getElementById("rating").value = movie.rating;

                // Change form mode
                isEditMode = true;
                document.querySelector("#movie-form h2").textContent = "Edit Movie";
                document.querySelector('button[type="submit"]').textContent = "Update Movie";
            }
        });
}

// Update an existing movie
function updateMovie(id, movieData) {
    fetch(`/api/movies/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(movieData)
    })
    .then(response => response.json())
    .then(updatedMovie => {
        fetchMovies(); // Refresh the entire list
        resetForm();
        showNotification(`Movie "${updatedMovie.title}" updated successfully`, "success");
    })
    .catch(error => {
        console.error("Error updating movie:", error);
        showNotification("Failed to update movie", "error");
    });
}

// Delete a movie
function deleteMovie(id) {
    if (confirm("Are you sure you want to delete this movie?")) {
        fetch(`/api/movies/${id}`, {
            method: "DELETE"
        })
        .then(response => response.json())
        .then(() => {
            fetchMovies(); // Refresh the entire list
            showNotification("Movie deleted successfully", "success");
        })
        .catch(error => {
            console.error("Error deleting movie:", error);
            showNotification("Failed to delete movie", "error");
        });
    }
}

// Reset form to default state
function resetForm() {
    document.getElementById("movieForm").reset();
    document.getElementById("movie-id").value = "";
    document.querySelector("#movie-form h2").textContent = "Add or Edit a Movie";
    document.querySelector('button[type="submit"]').textContent = "Save Movie";
    isEditMode = false;
}

// Show notification to user
function showNotification(message, type) {
    const notification = document.createElement("div");
    notification.className = `notification ${type}`;
    notification.textContent = message;
    document.body.appendChild(notification);

    // Remove notification after 3 seconds
    setTimeout(() => {
        document.body.removeChild(notification);
    }, 3000);
}
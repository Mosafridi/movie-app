// Fetch movies and render the chart
document.addEventListener("DOMContentLoaded", () => {
    fetchMovies();
});

// Fetch movies from the backend and render the data table
function fetchMovies() {
    fetch("/api/movies")
        .then(response => response.json())
        .then(data => {
            renderMoviesTable(data);
            renderMovieChart(data); // Pass data to the chart
        })
        .catch(error => console.error("Error fetching movies:", error));
}

// Render movie table
function renderMoviesTable(movies) {
    const tableBody = document.getElementById("movie-table-body");
    tableBody.innerHTML = ""; // Clear existing rows

    movies.forEach(movie => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${movie.title}</td>
            <td>${movie.genre}</td>
            <td>${movie.rating}</td>
            <td>
                <button onclick="editMovie('${movie.id}')">Edit</button>
                <button onclick="deleteMovie('${movie.id}')">Delete</button>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

// Render movie ratings chart
function renderMovieChart(movies) {
    const ctx = document.getElementById("movieChart").getContext("2d");

    // Extract data for chart
    const titles = movies.map(movie => movie.title);
    const ratings = movies.map(movie => movie.rating);

    // Create chart
    new Chart(ctx, {
        type: "bar",
        data: {
            labels: titles,
            datasets: [
                {
                    label: "Movie Ratings",
                    data: ratings,
                    backgroundColor: "rgba(255, 99, 132, 0.6)",
                    borderColor: "rgba(255, 99, 132, 1)",
                    borderWidth: 1,
                },
            ],
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true,
                },
            },
        },
    });
}

// Function placeholders for editing and deleting movies
function editMovie(id) {
    alert(`Edit functionality for movie with ID: ${id}`);
}

function deleteMovie(id) {
    alert(`Delete functionality for movie with ID: ${id}`);
}

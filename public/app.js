const API_URL = '/api';

async function searchMovies() {
    const query = document.getElementById('searchInput').value;
    if (!query) return;

    const res = await fetch(`${API_URL}/search?q=${encodeURIComponent(query)}`);
    const data = await res.json();
    displayMovies(data.results);
}

function displayMovies(movies) {
    const grid = document.getElementById('movieGrid');
    grid.innerHTML = ''; // Clear previous results

    movies.forEach(movie => {
        // Filter out movies with no poster
        if (!movie.poster_path) return;

        const releaseYear = movie.release_date ? movie.release_date.split('-')[0] : 'N/A';
        
        // Basic Logic to highlight 1970-2026 range (optional, just for visual)
        if (releaseYear < 1970) return; 

        const card = `
            <div class="col-md-3 col-6">
                <div class="card movie-card" onclick="openModal(${movie.id})">
                    <span class="rating-badge">${movie.vote_average.toFixed(1)}</span>
                    <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" class="card-img-top" alt="${movie.title}">
                    <div class="card-body">
                        <h6 class="card-title text-white text-truncate">${movie.title}</h6>
                        <small class="text-muted">${releaseYear}</small>
                    </div>
                </div>
            </div>
        `;
        grid.innerHTML += card;
    });
}

async function openModal(id) {
    const res = await fetch(`${API_URL}/movie/${id}`);
    const movie = await res.json();

    // Populate Text
    document.getElementById('modalTitle').innerText = movie.title;
    document.getElementById('modalOverview').innerText = movie.overview;
    document.getElementById('modalDate').innerText = movie.release_date;
    document.getElementById('modalRating').innerText = movie.vote_average.toFixed(1);
    document.getElementById('modalPoster').src = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;

    // Find Director
    const director = movie.credits.crew.find(person => person.job === 'Director');
    document.getElementById('modalDirector').innerText = director ? director.name : 'Unknown';

    // Find Trailer (Youtube)
    const trailer = movie.videos.results.find(vid => vid.site === 'YouTube' && vid.type === 'Trailer');
    const iframe = document.getElementById('modalTrailer');
    if (trailer) {
        iframe.src = `https://www.youtube.com/embed/${trailer.key}`;
        iframe.style.display = 'block';
    } else {
        iframe.style.display = 'none';
    }

    // Show Modal using Bootstrap
    const modal = new bootstrap.Modal(document.getElementById('movieModal'));
    modal.show();
}
const path = require('path');
const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.static(path.join(__dirname, 'public'))); // Serves your frontend files

const BASE_URL = 'https://api.themoviedb.org/3';
const API_KEY = process.env.TMDB_API_KEY;

// Endpoint to search movies
app.get('/api/search', async (req, res) => {
    const query = req.query.q;
    try {
        const response = await axios.get(`${BASE_URL}/search/movie`, {
            params: {
                api_key: API_KEY,
                query: query,
                include_adult: false,
                year: req.query.year // Optional: allows filtering by year
            }
        });
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch data' });
    }
});

// Endpoint to get specific movie details (Credits, Trailers)
app.get('/api/movie/:id', async (req, res) => {
    const movieId = req.params.id;
    try {
        const response = await axios.get(`${BASE_URL}/movie/${movieId}`, {
            params: {
                api_key: API_KEY,
                append_to_response: 'credits,videos' // Fetches director & trailer in one go
            }
        });
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch details' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
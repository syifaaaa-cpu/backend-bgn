const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// 1. Konfigurasi CORS agar GitHub Pages & Live Server diizinkan
app.use(cors({
    origin: ['http://127.0.0.1:5500', 'http://localhost:5500', 'https://syifaaaa-cpu.github.io'],
    credentials: true
}));

const ONEBOX_API_URL = 'https://dev.onebox.co.id';

// 2. Kredensial Login Tetap (Masukkan Username & Password API Onebox kamu di sini)
const LOGIN_CREDENTIALS = {
    username: "admin-news@ciptadrasoft.com", // Ganti dengan username/email API Onebox kamu
    password: "Admin123"  // Ganti dengan password API Onebox kamu
};

// Fungsi helper untuk mendapatkan Token Baru secara Otomatis
async function getFreshToken() {
    try {
        const response = await axios.post(`${ONEBOX_API_URL}/api/login`, LOGIN_CREDENTIALS);
        // Sesuaikan struktur token dari respon API Onebox (misal: response.data.token)
        return response.data.token || response.data.data.token; 
    } catch (error) {
        console.error('Gagal mendapatkan token otomatis:', error.message);
        throw error;
    }
}

// 3. Endpoint Berita Otomatis
app.get('/api/news/get', async (req, res) => {
    try {
        // Ambil token fresh secara otomatis setiap kali ada yang akses
        const freshToken = await getFreshToken();

        // Panggil API berita menggunakan token fresh tersebut
        const newsResponse = await axios.get(`${ONEBOX_API_URL}/api/news/get`, {
            headers: {
                'Authorization': `Bearer ${freshToken}`
            }
        });

        res.json(newsResponse.data);
    } catch (error) {
        console.error('Gagal Ambil Berita:', error.message);
        res.status(500).json({ 
            message: 'Gagal mengambil berita dari server pusat',
            error: error.message 
        });
    }
});

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});

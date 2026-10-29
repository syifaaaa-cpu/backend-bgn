const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const PORT = 3000;

app.use(express.json());

// Konfigurasi CORS agar frontend (Live Server) diizinkan mengakses backend
app.use(cors({
    origin: ['http://127.0.0.1:5500', 'http://localhost:5500', 'https://syifaaaa-cpu.github.io'],
    credentials: true
}));

// URL Dasar API Onebox
const ONEBOX_API_URL = 'https://dev.onebox.co.id';

// Token Master yang disimpan aman di backend (tidak terlihat di frontend)
const MASTER_TOKEN = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJsb2NhbGhvc3QiLCJzdWIiOjUyMSwiZXhwIjoxNzkzMjcxNTA1LCJuYmYiOjE3OTMyNjI1MDUsImlhdCI6MTc5MzI2MjUwNSwianRpIjoiOHFnaCtUeGMzQnVKZFRQdGx5U3J6Qm9SUy93dUh2cmJLNFd5OG9tMWQ0OD0iLCJzZXNpZCI6Ijk2ZTNmODdkMDljZDdiOTg2MDA3NjYzNDgyZWViYWRlIiwidXNpZCI6NjIyOCwic2lkIjoxNjl9.gNrQrhp6b5BzYSx4EfifAeAhCodpOeyeReKvTSB1Znk";

// ==========================================
// ENDPOINT BERITA OTOMATIS (Tanpa Login)
// ==========================================
app.get('/api/news/get', async (req, res) => {
    try {
        // Backend otomatis mengambil data ke Onebox menggunakan Master Token
        const response = await axios.get(`${ONEBOX_API_URL}/api/news/get?startdate=01-01-2024&enddate=31-12-2030&limit=100`, {
            headers: {
                'Authorization': `Bearer ${MASTER_TOKEN}`
            }
        });

        return res.json(response.data);

    } catch (error) {
        console.error('Gagal Ambil Berita:', error.message);
        return res.status(500).json({ success: false, message: 'Gagal mengambil data dari server Onebox.' });
    }
});

// Jalankan Server Backend di Port 3000
app.listen(PORT, () => {
    console.log(`Backend server BGN berjalan di http://localhost:${PORT}`);
});

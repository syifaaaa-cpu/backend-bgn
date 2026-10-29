const express = require('express');
const axios = require('axios');
const qs = require('qs'); // <-- Diperlukan untuk format x-www-form-urlencoded
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// 1. Konfigurasi CORS
app.use(cors({
    origin: ['http://127.0.0.1:5500', 'http://localhost:5500', 'https://syifaaaa-cpu.github.io'],
    credentials: true
}));

const ONEBOX_API_URL = 'https://dev.onebox.co.id';

// 2. Kredensial Lengkap sesuai Postman kamu
const LOGIN_CREDENTIALS = {
    email: process.env.ONEBOX_EMAIL,
    password: process.env.ONEBOX_PASSWORD,
    siteId: process.env.ONEBOX_SITE_ID
};
// Fungsi helper untuk mendapatkan Token Baru secara Otomatis
async function getFreshToken() {
    try {
        // Menggunakan format x-www-form-urlencoded dengan 'qs.stringify'
        const response = await axios.post(
            `${ONEBOX_API_URL}/api/Authenticate/post`, 
            qs.stringify(LOGIN_CREDENTIALS), 
            {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }
        );
        
        // Sesuaikan dengan struktur token balasan dari API Onebox
        return response.data.token || response.data.data.token || response.data.accessToken; 
    } catch (error) {
        console.error('Gagal mendapatkan token otomatis:', error.response?.data || error.message);
        throw error;
    }
}
// Endpoint Berita Otomatis
app.get('/api/news/get', async (req, res) => {
    try {
        const freshToken = await getFreshToken();

        // Mengirimkan parameter startdate dan enddate sesuai dengan yang ada di Postman
        const newsResponse = await axios.get(`${ONEBOX_API_URL}/api/news/get`, {
            headers: {
                'Authorization': `Bearer ${freshToken}`
            },
            params: {
                startdate: "01-01-2000",
                enddate: "31-12-2030", // Bisa pakai rentang waktu yang aman ke depan
                wilayah: "",
                actor: "",
                subject: "",
                category: ""
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

import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const SHO HOZ_HEADERS = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
  'Accept': 'application/json, text/plain, */*',
  'Origin': 'https://eticket.railway.gov.bd',
  'Referer': 'https://eticket.railway.gov.bd/'
};

// রেলওয়ের লাইভ ডাটা তোলার API Route
app.get('/api/search-trains', async (req, res) => {
  const { from, to, date, seatClass } = req.query;

  try {
    const targetUrl = `https://railspaapi.shohoz.com/v1.0/web/bookings/search-trips-v2?from_city=${encodeURIComponent(from)}&to_city=${encodeURIComponent(to)}&date_of_journey=${date}&seat_class=${seatClass || 'S_CHAIR'}`;

    const response = await fetch(targetUrl, {
      method: 'GET',
      headers: SHO HOZ_HEADERS
    });

    const data = await response.json();
    res.json({ success: true, data: data.data || [] });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch', error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
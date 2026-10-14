import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// স্পেসটি ঠিক করা হয়েছে: SHOHOZ_HEADERS
const SHOHOZ_HEADERS = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
  'Accept': 'application/json, text/plain, */*',
  'Origin': 'https://eticket.railway.gov.bd',
  'Referer': 'https://eticket.railway.gov.bd/'
};

app.get('/', (req, res) => {
  res.send('BD Railway Live Backend Proxy is Running!');
});

app.get('/api/search-trains', async (req, res) => {
  const { from, to, date, seatClass } = req.query;

  if (!from || !to || !date) {
    return res.status(400).json({ success: false, message: 'from, to and date parameters are required' });
  }

  try {
    const targetUrl = `https://railspaapi.shohoz.com/v1.0/web/bookings/search-trips-v2?from_city=${encodeURIComponent(from)}&to_city=${encodeURIComponent(to)}&date_of_journey=${date}&seat_class=${seatClass || 'S_CHAIR'}`;

    const response = await fetch(targetUrl, {
      method: 'GET',
      headers: SHOHOZ_HEADERS
    });

    const data = await response.json();
    res.json({ success: true, data: data.data || [] });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch live seat data', error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
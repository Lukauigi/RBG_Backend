const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');

const app = express();
const PORT = process.env.PORT || 5000;

app.get('/parse-price', async (req, res) => {
  // const url = req.query.url;
  const url = "https://www.pricecharting.com/game/nintendo-64/donkey-kong-64";
  console.log('Fetching URL:', url);
  if (!url) return res.status(400).send('Missing url param');

  try {
    const { data: html } = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
        'Accept-Language': 'en-US,en;q=0.9',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8'
      }
    });
    const $ = cheerio.load(html);

    // Queries
    const prices = {
      loose: $('#used_price .price').text().trim(),
      complete: $('#complete_price .price').text().trim(),
      new: $('#new_price .price').text().trim()
    };

    console.log(prices);
    res.json({ prices });
  } catch (err) {
    console.error("Axios error:", err.message); // Friendly message
    if (err.response) {
      console.error("Response status:", err.response.status);
      console.error("Response body:", err.response.data);
    } else if (err.request) {
      console.error("No response received:", err.request);
    } else {
      console.error("Setup error:", err.message);
    }
    res.status(500).send(`Error: ${err.message}`);
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

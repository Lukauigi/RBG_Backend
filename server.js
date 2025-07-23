const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');

const app = express();
require('dotenv').config();
const PORT = process.env.PORT || 5000;
const testUrl = "https://www.pricecharting.com/game/nintendo-64/donkey-kong-64";
const baseUrl = "https://www.pricecharting.com/game"

app.get('/parse-price/:platform/:title', async (req, res) => {
  const { platform, title } = req.params;
  console.log(`Plat: ${platform} ### Title: ${title}`);
  if (!platform | !title) return res.status(400).send('Missing params');

  const url = `${baseUrl}/${platform}/${title}`; 
  try {
    const { data: html } = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
        'Accept-Language': 'en-US,en;q=0.9',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8'
      }
    });
    const $ = cheerio.load(html);

    // Queries to scrape price text (e.g.: $24.15) as floats
    const prices = {
      loose: parseFloat($('#used_price .price').text().trim().replace("$", "")),
      complete: parseFloat($('#complete_price .price').text().trim().replace("$", "")),
      new: parseFloat($('#new_price .price').text().trim().replace("$", ""))
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

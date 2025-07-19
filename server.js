const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');

const app = express();
const PORT = process.env.PORT || 3000;

app.get('/parse-price', async (req, res) => {
  const url = req.query.url;
  if (!url) return res.status(400).send('Missing url param');

  try {
    const { data: html } = await axios.get(url);
    const $ = cheerio.load(html);

    // EXAMPLE: Scrape the loose price
    const loosePrice = $('#product-details td:contains("Loose Price")')
      .next()
      .text()
      .trim();

    res.json({ loosePrice });
  } catch (err) {
    res.status(500).send(`Error: ${err.message}`);
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

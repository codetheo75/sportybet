const express = require('express');
const axios = require('axios');

const app = express();
const port = 3000; // Change this to your desired port

const sportybetUrl = 'https://www.sportybet.com/api/ug/orders/share/';

const headers = {
  'Accept': '*/*',
  'Accept-Encoding': 'gzip, deflate, br',
  'Accept-Language': 'en',
  'Clientid': 'wap',
  'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36'
};

app.use(express.static('public')); // Serve static files from the "public" directory

app.get('/search/:code', async (req, res) => {
  const shareCode = req.params.code;

  try {
    const response = await axios.get(sportybetUrl + shareCode, { headers });
    const data = response.data;

    // Extract necessary information for each outcome
    const results = data.data.outcomes.map(outcome => ({
      shareCode: data.data.shareCode,
      homeTeam: outcome.homeTeamName,
      awayTeam: outcome.awayTeamName,
      startTime: outcome.estimateStartTime,
      selectedOutcome: outcome.markets[0].outcomes[0].desc,
      odds: outcome.markets[0].outcomes[0].odds
    }));

    if (results.length > 0) {
      res.json(results);
    } else {
      // Return a specific response indicating no results found
      res.status(404).json({ error: 'No results found for the entered code' });
    }
  } catch (error) {
    console.error(`Failed to retrieve data. Error: ${error.message}`);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

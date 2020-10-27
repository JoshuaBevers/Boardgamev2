const express = require('express');

const router = express.Router();

const DataBase = require('../models/functions');

router.get('/', (req, res) => {
  try {
    console.log('hello from index.js, loading screen. This updated!');
    res.send('hello from index.js, this is the res send!');
  } catch {
    console.log('failed to fetch http request.');
  }
});

/* GET home page. */
router.get('/getgames', async (req, res) => {
  try {
    const response = await DataBase.getGameList();
    console.log('hello from index.js!');
    console.log(response);
    res.send(response).status(200);
  } catch (e) {
    console.log('the api on backend failed to fetch in index.');
    return e;
  }
});

router.post('/fetchtest', async (req, res) => {
  try {
    console.log('hello from index.js!');
    res.send('hello from fetchtest').status(200);
  } catch (e) {
    console.log('the api failed.');
    return e;
  }
});

router.get('/search', async (req, res) => {
  res.send('sending from search.');
  try {
    // const response = await DataBase.getGameListJson(req.headers.game);
    console.log('hello from the search function, lambda!');

    res.send('sending from searchfsdf.');
    // res.json(response).status(200);
  } catch (e) {
    console.log('the api on backend failed to fetch in search.js.');
    return e;
  }
});

module.exports = router;
const express = require('express');
const router = express.Router();

  router.get('/api/Players', async (req, res) => {
    try {
        console.log('Fetching players...'); 

        if (!playersCollection) {
            return res.status(500).send('Players collection is not defined');
        }

        const playersRes = await playersCollection.find().toArray();
        console.log('Players fetched:', playersRes);
        
        res.setHeader('Content-Type', 'application/json');
        res.json(playersRes); 
    } catch (error) {
      console.error(error);
      res.status(500).send('Error fetching players');
    }
  });
  
  module.exports = router;
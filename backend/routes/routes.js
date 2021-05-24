const express = require('express');
const router = express.Router();
const web3 = require('./../web3/web3');

router.post('/vote-reliable', web3.voteReliable);
router.post('/vote-dangerous', web3.voteDangerous);
router.get('/url-list', web3.getURLs);
router.get('/voter-list', web3.getVoters);
router.post('/add-url', web3.addURL);
router.get('/url-names', web3.getURLsNames);
router.get('/voter-names', web3.getVotersNames);
router.get('/voter-reliability', web3.getVotersReliability);

module.exports = router;
const express = require('express');
const router = express.Router();
const controllers = require('./../controllers/controllers');
const web3 = require('./../web3/web3');

router.get('/say-something', controllers.saySomething);
router.post('/hello-you', controllers.helloYou);
router.get('/url-list', web3.getURLList);
router.post('/url-reputation', web3.getURLReputation);
router.get('/url-reputations', web3.getURLReputations);
router.post('/vote-reliable', web3.voteReliable);
router.post('/vote-dangerous', web3.voteDangerous);
router.get('/voter-list', web3.getVoters);

module.exports = router;
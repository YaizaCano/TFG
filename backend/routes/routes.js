const express = require('express');
const router = express.Router();
const model1 = require('./../web3/web3model1');
const model2 = require('./../web3/web3model2');

router.post('/vote-reliable', model1.voteReliable);
router.post('/vote-dangerous', model1.voteDangerous);
router.get('/url-list', model1.getURLs);
router.get('/voter-list', model1.getVoters);
router.post('/add-url', model1.addURL);
router.get('/url-names', model1.getURLsNames);
router.get('/voter-names', model1.getVotersNames);
router.get('/voter-reliability', model1.getVotersReliability);
router.get('/url-voters', model1.getURLsVoters);

router.get('/domain-list', model2.getDomains);
router.get('/get-repurations', model2.getReputations);
router.get('/get-participations', model2.getParticipations);
router.get('/get-voterlist', model2.getVotersList);
router.get('/get-voteraddr', model2.getVotersAddresses);
router.get('/get-domainowners', model2.getDomainOwners);
router.post('/add-domain', model2.createDomain);
router.post('/vote-rel', model2.voteReliable);
router.post('/vote-dang', model2.voteDangerous);
router.get('/get-voterrel', model2.getVotersReliability);
router.get('/get-domainbalances', model2.getDomainBalances);
router.get('/get-domainvoters', model2.getDomainsVoters);

module.exports = router;
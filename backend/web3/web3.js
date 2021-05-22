const Web3 = require('web3');
//const abi = require('./abi.json');

const metadata = require('../../blockchain/artifacts/contracts/ReputationSystem.sol/Reputation.json');
console.log(metadata.abi);


let web3 = new Web3("http://127.0.0.1:8545/");
web3.eth.handleRevert = true;
const myContract = new web3.eth.Contract(metadata.abi, 
	'0xa82fF9aFd8f496c3d6ac40E2a0F282E47488CFc9');



/*const getURLList = async (req, res, next) => {
	const urllist = await myContract.methods.showURLList().call();
	res.send(urllist);
}*/

/*const getURLReputation = async (req, res, next) => {
	const urlReputation = await myContract.methods.getURLReputation(req.query.name).call();
	res.send(urlReputation);
}

const getURLReputations = async (req, res, next) => {
	const urlReputations = await myContract.methods.getURLReputations().call();
	res.send(urlReputations);
}*/

const voteReliable = async (req, res, next) => {
	const voteReliable = await myContract.methods.vote(req.body.name, true).send({from: req.body.from});
	res.send(voteReliable);
}

const voteDangerous = async (req, res, next) => {
	const voteDangerous = await myContract.methods.vote(req.body.name, false).send({from: req.body.from});
	res.send(voteDangerous);
}

const getURLs = async (req, res, next) => {
	const urlList = await myContract.methods.getURLList().call();
	res.send(urlList);
}

const getVoters = async (req, res, next) => {
	const voterList = await myContract.methods.getVotersList().call();
	res.send(voterList);
}

const addURL = async (req, res, next) => {
	const addURL = await myContract.methods.addURL(req.body.name).send({from: req.body.from});
	res.send(addURL)
}

//module.exports.getURLList = getURLList;
//module.exports.getURLReputation = getURLReputation;
//module.exports.getURLReputations = getURLReputations;
module.exports.voteReliable = voteReliable;
module.exports.voteDangerous = voteDangerous;
module.exports.getURLs = getURLs;
module.exports.getVoters = getVoters;
module.exports.addURL = addURL;
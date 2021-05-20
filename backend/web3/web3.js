const Web3 = require('web3');
const abi = require('./abi.json');

/*async function getWeb3 () {
	let web3 = new Web3("http://127.0.0.1:8545/");

	const myContract = new web3.eth.Contract(abi, 
		'0x5FbDB2315678afecb367f032d93F642f64180aa3');

	await myContract.methods.showURLList().call();
	return "hola";
}*/
let web3 = new Web3("http://127.0.0.1:8545/");
const myContract = new web3.eth.Contract(abi, 
	'0x5FbDB2315678afecb367f032d93F642f64180aa3');

const getURLList = async (req, res, next) => {
	const urllist = await myContract.methods.showURLList().call();
	res.send(urllist);
}

const getURLReputation = async (req, res, next) => {
	const urlReputation = await myContract.methods.getURLReputation(req.query.name).call();
	res.send(urlReputation);
}

const getURLReputations = async (req, res, next) => {
	const urlReputations = await myContract.methods.getURLReputations().call();
	res.send(urlReputations);
}

const voteReliable = async (req, res, next) => {
	const voteReliable = await myContract.methods.vote(req.body.name, true).send({from: '0x90F79bf6EB2c4f870365E785982E1f101E93b906'});
	res.send(voteReliable);
}

const voteDangerous = async (req, res, next) => {
	const voteDangerous = await myContract.methods.vote(req.body.name, false).send({from: '0x90F79bf6EB2c4f870365E785982E1f101E93b906'});
	res.send(voteDangerous);
}

const getVoters = async (req, res, next) => {
	const voterList = await myContract.methods.getVotersList().call();
	res.send(voterList);
}

module.exports.getURLList = getURLList;
module.exports.getURLReputation = getURLReputation;
module.exports.getURLReputations = getURLReputations;
module.exports.voteReliable = voteReliable;
module.exports.voteDangerous = voteDangerous;
module.exports.getVoters = getVoters;
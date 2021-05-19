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

module.exports.getURLList = getURLList;
module.exports.getURLReputation = getURLReputation;
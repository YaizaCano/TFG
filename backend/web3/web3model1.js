const Web3 = require('web3');
const metadata = require('../../blockchain/artifacts/contracts/model1.sol/Reputation.json');


let web3 = new Web3("http://127.0.0.1:8545/");
web3.eth.handleRevert = true;
const myContract = new web3.eth.Contract(metadata.abi, 
	'0x5FbDB2315678afecb367f032d93F642f64180aa3');


const voteReliable = async (req, res, next) => {
	const voteReliable = await myContract.methods.vote(req.body.name, true).send({from: req.body.from}).catch(console.error);
	res.send(voteReliable);
}

const voteDangerous = async (req, res, next) => {
	const voteDangerous = await myContract.methods.vote(req.body.name, false).send({from: req.body.from}).catch(console.error);
	res.send(voteDangerous);
}

const getURLs = async (req, res, next) => {
	const urlList = await myContract.methods.getURLList().call().catch(console.error);
	res.send(urlList);
}

const getVoters = async (req, res, next) => {
	const voterList = await myContract.methods.getVotersList().call().catch(console.error);
	res.send(voterList);
}

const addURL = async (req, res, next) => {
	const addURL = await myContract.methods.addURL(req.body.name).send({from: req.body.from}).catch(console.error);
	res.send(addURL)
}

const getURLsNames = async (req, res, next) => {
	const urlList = await myContract.methods.getURLList().call().catch(console.error);
	var urls = []
	urlList.map((url) =>{
		urls.push(url[0])
	})
	res.send(urls)
}

const getVotersNames = async (req, res, next) => {
	const votersList = await myContract.methods.getVotersList().call().catch(console.error);
	var voters = []
	votersList.map((voter) =>{
		voters.push(voter[0])
	})
	res.send(voters)
}

const getVotersReliability = async (req, res, next) => {
	const urlList = await myContract.methods.getURLList().call().catch(console.error);
	var urls = []
	urlList.map((url) =>{
		urls.push(url[0])
	})
	const voters = await myContract.methods.getVotersList().call().catch(console.error);
	const list = await myContract.methods.getURLList().call().catch(console.error);

	var reliability = [];

	voters.map((voter) => {
		var trust = voter[1].length/100;
    if (trust > '1') trust = 1;

		var cred = 0;
    voter[1].map((name, index) => {
      var i = urls.indexOf(name);

      try {
      	var url = list[i][1];
      }
      catch {
      	console.log(console.error)
      }
      if (url >= 0) 
        cred += Number(voter[2][index]);
      else
        cred -= Number(voter[2][index]);
      
    })

    cred = cred/voter[2].length
    reliability.push(Number(trust * cred * 100).toFixed(2))
	})
	res.send(reliability)
}

//blockchain
module.exports.voteReliable = voteReliable;
module.exports.voteDangerous = voteDangerous;
module.exports.getURLs = getURLs;
module.exports.getVoters = getVoters;
module.exports.addURL = addURL;

//global
module.exports.getURLsNames = getURLsNames;
module.exports.getVotersNames = getVotersNames;

//computed
module.exports.getVotersReliability = getVotersReliability;
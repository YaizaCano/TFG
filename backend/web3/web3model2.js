const Web3 = require('web3');
const managerMetadata = require('../../blockchain/artifacts/contracts/model2.sol/DomainManager.json');
const domainMetadata = require('../../blockchain/artifacts/contracts/model2.sol/Domain.json');


let web3 = new Web3("http://127.0.0.1:8545/");
web3.eth.handleRevert = true;
const myContract = new web3.eth.Contract(managerMetadata.abi, 
	'0x9A9f2CCfdE556A7E9Ff0848998Aa4a0CFD8863AE');



const getDomains = async (req, res, next) => {
	const domains = await myContract.methods.getDomainList().call().catch(console.error);
	res.send(domains);
}

const getReputations = async (req, res, next) => {
	const domains = await myContract.methods.getDomainList().call().catch(console.error);
	var rep = [];
	for (var i = 0; i < domains.length; i++) {
		const r = await myContract.methods.getDomainReputation(domains[i]).call().catch(console.error);
		rep.push(r);
	}
	res.send(rep);
}

const getParticipations = async (req, res, next) => {
	const domains = await myContract.methods.getDomainList().call().catch(console.error);
	
	var par = [];
	for (var i = 0; i < domains.length; i++) {
		const p = await myContract.methods.getDomainParticipation(domains[i]).call().catch(console.error);
		par.push(p);
	}
	res.send(par);
}


const getVotersList = async (req, res, next) => {
	const voters = await myContract.methods.getVotersList().call().catch(console.error);
	res.send(voters);
}


const getVotersAddresses = async (req, res, next) => {
	const voters = await myContract.methods.getVotersList().call().catch(console.error);
	var add = [];
	for (var i = 0; i < voters.length; i++) {
		add.push(voters[i][0]);
	}
	res.send(add);
}

const getDomainOwners = async (req, res, next) => {
	const domains = await myContract.methods.getDomainList().call().catch(console.error);
	var owners = [];
	for (var i = 0; i < domains.length; i++) {
		const ow = await myContract.methods.getDomainOwner(domains[i]).call().catch(console.error);
		owners.push(ow);
	}
	res.send(owners);
}

const getDomainBalances = async (req, res, next) => {
	const domains = await myContract.methods.getDomainList().call().catch(console.error);
	var balances = [];
	for (var i = 0; i < domains.length; i++) {
		const bal = await myContract.methods.getDomainBalance(domains[i]).call().catch(console.error);
		balances.push(bal);
	}
	res.send(balances);
}

const createDomain = async (req, res, next) => {
	const domain = await myContract.methods.createDomain(req.body.domain).send({from: req.body.from}).catch(console.error);
	res.send(domain);
}


const voteReliable = async (req, res, next) => {
	const voteReliable = await myContract.methods.vote(req.body.name, true).send({from: req.body.from})
																							.on('transactionHash', function(hash){
																				        web3.eth.getTransactionReceipt(hash, async function(err, transaction) {
																				        	console.log("GAS USED: " + transaction.gasUsed)
																				        		
																				        	console.log("GAS PRICE: " + transaction.gasUsed*8)
																				        	const addr = await myContract.methods.getDomain(req.body.name).call().catch(console.error)	
																				        	const domainContract = new web3.eth.Contract(domainMetadata.abi, addr);
																				        	const ow = await domainContract.methods.getOwner().call().catch(console.error);
																				        	console.log(ow)
																							})
																				      })
																				      .catch(console.error);
	res.send(voteReliable);
}

const voteDangerous = async (req, res, next) => {
	const voteDangerous = await myContract.methods.vote(req.body.name, false).send({from: req.body.from}).catch(console.error);
	res.send(voteDangerous);
}

const getVotersReliability = async (req, res, next) => {
	const domains = await myContract.methods.getDomainList().call().catch(console.error);
	const voters = await myContract.methods.getVotersList().call().catch(console.error);
	var rep = [];
	for (var i = 0; i < domains.length; i++) {
		const r = await myContract.methods.getDomainReputation(domains[i]).call().catch(console.error);
		rep.push(r);
	}
	var reliability = [];

	voters.map((voter) => {
		var trust = voter[1].length/100;
    if (trust > '1') trust = 1;

    var cred = 0;
    voter[1].map((name, index) => {
      var i = domains.indexOf(name);

      if (rep[i] >= 0) 
        cred += Number(voter[2][index]);
      else
        cred -= Number(voter[2][index]);
      
      
    })
    cred = cred/voter[2].length
    reliability.push(Number(trust * cred * 100).toFixed(2))
	})
	res.send(reliability)

}

module.exports.getDomains = getDomains;
module.exports.getReputations = getReputations;
module.exports.getParticipations = getParticipations;
module.exports.getVotersList = getVotersList;
module.exports.getVotersAddresses = getVotersAddresses;
module.exports.getDomainOwners = getDomainOwners;
module.exports.createDomain = createDomain;
module.exports.voteReliable = voteReliable;
module.exports.voteDangerous = voteDangerous;
module.exports.getVotersReliability = getVotersReliability;
module.exports.getDomainBalances = getDomainBalances;

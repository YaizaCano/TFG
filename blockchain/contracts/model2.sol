//SPDX-License-Identifier: Unlicense
pragma solidity ^0.7.0;
pragma experimental ABIEncoderV2;

import "hardhat/console.sol";

contract Domain {
    address owner;                       // propietari del domini
    string domain;                       // url
    int256 reputation;                   // raw reputation
    uint256 votes;                       // votes received
    
    
    constructor(address _owner, string memory _domain) {
        owner = _owner;
        domain = _domain;
        reputation = 0;
        votes = 0;
    }
    
    function getBalance() public view returns (uint256) {
        return address(this).balance;
    }
    
    function getOwner() public view returns (address) {
        return owner;
    }
    
    function vote(bool _vote, uint _initGas, address payable _address) public {
        votes++;
        if (_vote)
            reputation++;
        else
            reputation--;
            
        uint transGas = (_initGas - gasleft())*22 + 8887*22;
        require(address(this).balance > transGas+(8887*22), "Not balance enough");
        _address.transfer(transGas);
    }
    
    function getReputation() public view returns (int256) {
        return reputation;
    }
    
    function getVotes() public view returns (uint256) {
        return votes;
    }
    
    fallback() external payable {}
    
    receive() external payable {}
    
    
}




contract DomainManager {
    struct Voter {
        address addr;           // person ho has voted
        string[] urlsVoted;     // urls voted by a person
        int[] votes;            // votes recorded
    }
    
    mapping(string => Domain) reputations; 
    Voter[] voters;
    string[] domains;
    
    
    modifier DomainAlreadyExists(string memory _domain) {
      require(keccak256(abi.encodePacked(reputations[_domain])) == keccak256(abi.encodePacked(address(0))), 
        "The URL already exists in our db.");
      _;
   }
   
    modifier DomainDoesNotExists(string memory _domain) {
       require(keccak256(abi.encodePacked(reputations[_domain])) != keccak256(abi.encodePacked(address(0))), 
        "The Domain does not exists in our db.");
        _;
   }
   
   modifier NotOwner(string memory _domain) {
       require(reputations[_domain].getOwner() == msg.sender, "You are not the owner of this domain");
       _;
   }
   
   modifier OwnerCantVote(string memory _domain) {
        require(reputations[_domain].getOwner() != msg.sender, "You are the owner of this domain, you can not vote");
        _;
   }
    
    
    constructor() {
        console.log("Welcome to URL reputation system model #2");
    }
    
    function createDomain(string memory _domain) public DomainAlreadyExists(_domain) {
        reputations[_domain] = new Domain(msg.sender, _domain);
        domains.push(_domain);
    }
    
    function getDomain(string memory _domain) public view DomainDoesNotExists(_domain) returns (Domain) {
        return reputations[_domain];
    }
    
    function getDomainBalance(string memory _domain) public view DomainDoesNotExists(_domain) returns (uint256) {
        return reputations[_domain].getBalance();
    }
    
    function sendMoney(string memory _domain) public payable DomainDoesNotExists(_domain) NotOwner(_domain){
        bool sent = address(reputations[_domain]).send(msg.value);
        require(sent, "Failed to send Ether");
    }
    
    function vote (string memory _domain, bool _vote) public DomainDoesNotExists(_domain) OwnerCantVote(_domain) {
        uint initGas = gasleft();
        uint v = getVoterIndex(_domain);
        if (_vote) {
            voters[v].votes.push(1);
        }
        else {
            voters[v].votes.push(-1);
        }
        reputations[_domain].vote(_vote, initGas, msg.sender);
        
    }
    
    function getDomainList() public view returns (string[] memory) {
        return domains;
    }
    
    function getVotersList () public view returns (Voter[] memory) {
        return voters;
    }
    
    function getDomainReputation(string memory _domain) public view DomainDoesNotExists(_domain) returns (int256) {
        return reputations[_domain].getReputation();
    }
    
    function getDomainParticipation(string memory _domain) public view DomainDoesNotExists(_domain) returns (uint256) {
        return reputations[_domain].getVotes();
    }
    
    function getDomainOwner(string memory _domain) public view DomainDoesNotExists(_domain) returns (address) {
        return reputations[_domain].getOwner();
    }
    
  
    function getVoterIndex (string memory _url) private returns (uint) {
        for (uint i = 0; i < voters.length; i++) {
            if (voters[i].addr == msg.sender) {
                for (uint j = 0; j < voters[i].urlsVoted.length; j++) {
                    require (keccak256(abi.encodePacked(voters[i].urlsVoted[j]))!=keccak256(abi.encodePacked(_url)),
                    "You have already voted this URL");
                }
                voters[i].urlsVoted.push(_url);
                return i;
            }
        }
       
        Voter memory v;
        v.addr = msg.sender;
        voters.push(v);
        voters[voters.length-1].urlsVoted.push(_url);
        return voters.length-1;
    }
 
}
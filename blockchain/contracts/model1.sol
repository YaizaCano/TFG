//SPDX-License-Identifier: Unlicense
pragma solidity ^0.7.0;
pragma experimental ABIEncoderV2;

import "hardhat/console.sol";

contract Reputation {
    struct Voter {
        address addr;           // person ho has voted
        string[] urlsVoted;     // urls voted by a person
        int[] votes;           // votes recorded
    }
    
    struct URL {
        string name;            // url's name
        int256 reputation;     // raw reputation
        uint256 votes;          // number of votes received
    }
    
    URL[] urlList;
    Voter[] voters;
    
    constructor() {
        console.log("Welcome to URL reputation system");
    }
  
    
    function addURL (string memory _url) public {
        checkURL(_url);
        urlList.push(URL({
            name: _url,
            reputation: 0,
            votes: 0
        }));
        console.log("Added URL '%s' with default neutral reputation", _url);
    }
    
    function vote (string memory _url, bool _vote) public {
        uint i = getURL(_url);
        uint v = getVoterIndex(_url);
        urlList[i].votes++;
        if (_vote) {
            urlList[i].reputation++;
            voters[v].votes.push(1);
        }
        else {
            urlList[i].reputation--;
            voters[v].votes.push(-1);
        }
    }
    
    function getURLList() public view returns (URL[] memory) {
        return urlList;
    }
    
    function getVotersList () public view returns (Voter[] memory) {
        return voters;
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
    
    function getURL (string memory _url) private view returns (uint256){
        uint i = 0;
        while (keccak256(abi.encodePacked(urlList[i].name))!=keccak256(abi.encodePacked(_url))) {
            i++;
            require(i < urlList.length, "The URL does not exists in our db.");
        }
        return i;
    }
    
    function checkURL (string memory _url) private view {
        for (uint i = 0; i < urlList.length; i++) {
            require(keccak256(abi.encodePacked(urlList[i].name))!=keccak256(abi.encodePacked(_url)), 
            "The URL exists already in our db.");
        }
    }

}
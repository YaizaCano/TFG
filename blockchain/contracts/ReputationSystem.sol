//SPDX-License-Identifier: Unlicense
pragma solidity ^0.7.0;
pragma experimental ABIEncoderV2;

import "hardhat/console.sol";

contract Reputation {
    struct Voter {
        uint reliability;       // person's reputation
        address addr;           // person ho has voted
        string[] urlsVoted;     // urls voted by a person
    }
    
    struct URL {
        string name;            // url's name
        uint256 reputation;     // raw reputation
        uint256 votes;          // number of votes received
    }
    
    URL[] urlList;
    Voter[] voters; 
    
    constructor() {
        console.log("Welcome to URL reputation system");
    }
  
    
    function getURLReputation (string memory _url) public view returns (uint256) {
        uint i = getURL(_url);
        return urlList[i].reputation/urlList[i].votes*100;
    }
    
    function showURLList () public view returns (string[] memory) {
        string[] memory urls = new string[] (urlList.length);
        for (uint i = 0; i < urlList.length; i++) {
            urls[i] = urlList[i].name;
        }
        return urls;
    }
    
    function addURL (string memory _url) public {
        urlList.push(URL({
            name: _url,
            reputation: 0,
            votes: 0
        }));
        console.log("Added URL '%s' with default neutral reputation", _url);
    }
    
    function vote (string memory _url, bool _vote) public {
        uint i = getURL(_url);
        getVoterIndex(_url);
        urlList[i].votes++;
        if (_vote) urlList[i].reputation++;
        else urlList[i].reputation--;
    }
    
    function getVotersList () public view returns (Voter[] memory) {
        return voters;
    }
    
    function getVoterIndex (string memory _url) private returns (uint) {
        bool _exists = false;
        for (uint i = 0; i < voters.length && !_exists; i++) {
            if (voters[i].addr == msg.sender) {
                _exists = true;
                for (uint j = 0; j < voters[i].urlsVoted.length; j++) {
                    require (keccak256(abi.encodePacked(voters[i].urlsVoted[j]))!=keccak256(abi.encodePacked(_url)),
                    "You have already voted this URL");
                }
                voters[i].urlsVoted.push(_url);
            }
        }
        console.log("Exists bool: %s", _exists);
        if (!_exists) {
            Voter memory v;
            v.reliability = 0;
            v.addr = msg.sender;
            voters.push(v);
            voters[voters.length-1].urlsVoted.push(_url);
        }
    }
    
    function getURL (string memory _url) private view returns (uint256){
        uint i = 0;
        while (keccak256(abi.encodePacked(urlList[i].name))!=keccak256(abi.encodePacked(_url))) {
            i++;
            require(i < urlList.length, "The URL does not exists in our db.");
        }
        return i;
    }
}
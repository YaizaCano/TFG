import React, { Component } from 'react';
import './App.css';
import axios from 'axios';
import { Table, Button} from 'react-bootstrap';
//import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';
import Web3 from 'web3';

class Model2 extends Component {
  state = {
    domains: [],
    reputations: [],
    participations: [],
    voters: [],
    votersaddr: [],
    voterrel: [],
    domainsvoters: [],
    balances: [],
    owners: [],
    value: '',
    web3: {},
    accounts: [],
  };

  async componentDidMount() {
    await axios.all([
      axios.get('/api/domain-list'),
      axios.get('/api/get-repurations'),
      axios.get('/api/get-participations'),
      axios.get('/api/get-voterlist'),
      axios.get('/api/get-voteraddr'),
      axios.get('/api/get-domainowners'),
      axios.get('/api/get-voterrel'),
      axios.get('/api/get-domainbalances'),
      axios.get('/api//get-domainvoters'),
    ])
    .then(axios.spread((list, reps, parts, votrs, votaddr, owns, votrel, bals, domainvtrs) => {
      const domains = list.data;
      const reputations = reps.data;
      const participations = parts.data;
      const voters = votrs.data;
      const votersaddr = votaddr.data; 
      const owners = owns.data;
      const voterrel = votrel.data;
      const balances = bals.data;
      const domainsvoters = domainvtrs.data;

      this.setState({domains});
      this.setState({reputations});
      this.setState({participations});
      this.setState({voters});
      this.setState({votersaddr});
      this.setState({owners});
      this.setState({voterrel});
      this.setState({balances});
      this.setState({domainsvoters});

    }));


    const web3 = new Web3(window.ethereum);
    web3.eth.handleRevert = true;
    this.setState({web3});
    const accounts = await window.ethereum.request({method: 'eth_requestAccounts'});
    this.setState({accounts});
  }

  handleReliable(url) {
    axios.post('/api/vote-rel', {
      name: url,
      from: this.state.accounts[0]
    }).then((res) => {
      alert(this.state.accounts[0] +' vote has been counted to ' + url);
      window.location.reload()
    }).catch(console.error);
  }

  handleDangerous(url) {
    axios.post('/api/vote-dang', {
      name: url,
      from: this.state.accounts[0]
    }).then((res) => {
      alert(this.state.accounts[0] +' vote has been counted to ' + url);
      window.location.reload()
    }).catch(console.error);
  }

  renderURLTableData() {

    var votes = []

    for(var i=0; i < this.state.votersaddr.length; ++i) {
      if (this.state.votersaddr[i].toLowerCase() === this.state.accounts[0]) {
        votes = this.state.voters[i][1]
      }
    }    

    return this.state.domains.map((url, index) => {
      //const { name, rep, votes } = url //destructuringç

      var rep = Number(0).toFixed(2)
      if (this.state.reputations[index] !== '0') rep = (Number(this.state.reputations[index]/
                                                        this.state.participations[index])*100).toFixed(2)


      var rel = Number(0);
      if (this.state.domainsvoters[index] !== undefined) {
        this.state.domainsvoters[index].map((addr) => {
          var v = this.state.votersaddr.indexOf(addr);
          rel += Number(this.state.voterrel[v])
        })
        if (rel != Number(0))
          rel /= Number(this.state.domainsvoters[index].length)
      }



      const balance = Number(this.state.balances[index])

      var disabledRel ="enabledRel";
      var disabledDan ="enabledDan";
      var msgRel = "Reliable";
      var msgDan = "Dangerous";
      
      if (this.state.owners[index] !== undefined && this.state.owners[index].toLowerCase() === this.state.accounts[0]) {
        disabledRel= "disabledRel"
        disabledDan="disabledDan"
        msgRel=msgDan="Owner"
      }
      else if (balance < Number(5127400)){
        disabledRel= "disabledRel"
        disabledDan="disabledDan";
        msgRel = msgDan = "Out of gas";
        rel = '--';
        rep = '--';
      }
      else if (votes.includes(url)){
        disabledRel= "disabledRel"
        disabledDan="disabledDan";
      } 

      

      
      return (
        <tr key={index}>
          <td>{index}</td>
          <td className="address">{url}</td>
          <td>{rep}%</td>
          <td>{rel}%</td>
          <td>{balance}</td>
          <td>
            <button className={disabledRel} onClick={() => this.handleReliable(url)}>{msgRel}</button>
            <button className={disabledDan} onClick={() => this.handleDangerous(url)}>{msgDan}</button>
          </td>
        </tr>
      )
    })
  }

  renderVoterTableData() {
    return this.state.voters.map((voter, index) => {

      return (
        <tr key={index}>
          <td>{index}</td>
          <td className="address">{voter[0]}</td>
          <td>
            <ul>
              {voter[1].map((url) => {
                return (
                  <li>{url}</li>
                )
              })}
            </ul>
          </td>
        </tr>
      )
    })
  }


  handleChange(value) {
    this.setState({value})
  }


  urlSearch() {
    var input, filter, table, tr, td, i, txtValue;
    input = document.getElementById("urlInput");
    filter = input.value.toUpperCase();
    table = document.getElementById("urlTable");
    tr = table.getElementsByTagName("tr");
    for (i = 0; i < tr.length; i++) {
      td = tr[i].getElementsByTagName("td")[1];
      if (td) {
        txtValue = td.textContent || td.innerText;
        if (txtValue.toUpperCase().indexOf(filter) > -1) {
          tr[i].style.display = "";
        } else {
          tr[i].style.display = "none";
        }
      }       
    }
  }

  voterSearch() {
    var input, filter, table, tr, td, i, txtValue;
    input = document.getElementById("voterInput");
    filter = input.value.toUpperCase();
    table = document.getElementById("voterTable");
    tr = table.getElementsByTagName("tr");
    for (i = 0; i < tr.length; i++) {
      td = tr[i].getElementsByTagName("td")[1];
      if (td) {
        txtValue = td.textContent || td.innerText;
        if (txtValue.toUpperCase().indexOf(filter) > -1) {
          tr[i].style.display = "";
        } else {
          tr[i].style.display = "none";
        }
      }       
    }
  }
        

  render() {
    return (
      <div className="App">
        <link href="//cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/3.3.2/css/bootstrap.css" rel="stylesheet"/>

        <h1 className="titleUrl">MODEL2: URLS LIST</h1>

        <input className="form-control" id="urlInput" type="text" placeholder="Search URL by Name..." onKeyUp={() => this.urlSearch()}/>

        <div className="table">
          <Table responsive="md" striped bordered hover id="urlTable">
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Reputation</th>
                <th>Reliabiity</th>
                <th>Balance (wei)</th>
                <th>Vote</th>
              </tr>
            </thead>
            <tbody>{this.renderURLTableData()}</tbody>
          </Table>
        </div>

        <h1 className="titleVoters">VOTERS LIST</h1>
        
        <input className="form-control" id="voterInput" type="text" placeholder="Search Voter by Adress..." onKeyUp={() => this.voterSearch()}/>
        <div className="table">
          <Table responsive="md" striped bordered hover id="voterTable">
            <thead>
              <tr>
                <th>#</th>
                <th>Adress</th>
                <th>URLs Voted</th>
              </tr>
            </thead>
            <tbody>{this.renderVoterTableData()}</tbody>
          </Table>
        </div>
        
      </div>

    );
  }

}

export default Model2;

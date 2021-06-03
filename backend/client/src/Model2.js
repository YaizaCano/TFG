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
    ])
    .then(axios.spread((list, reps, parts, votrs, votaddr, owns, votrel, bals) => {
      const domains = list.data;
      const reputations = reps.data;
      const participations = parts.data;
      const voters = votrs.data;
      const votersaddr = votaddr.data; 
      const owners = owns.data;
      const voterrel = votrel.data;
      const balances = bals.data;

      this.setState({domains});
      this.setState({reputations});
      this.setState({participations});
      this.setState({voters});
      this.setState({votersaddr});
      this.setState({owners});
      this.setState({voterrel});
      this.setState({balances});

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


      const balance = Number(this.state.balances[index])

      var disabled = false;
      var msgRel = "Realiable"
      var msgDan = "Dangerous"
      
      if (this.state.owners[index] !== undefined && this.state.owners[index].toLowerCase() === this.state.accounts[0]) {
        disabled = true;
        msgRel = msgDan = "Owned"
      }
      /*else if (balance == Number(0)){
        disabled = true;
        msgRel = msgDan = "Out of gas";
        rep = '--';
      }*/
      else if (votes.includes(url)){
        disabled=true;
        msgRel = msgDan = "Already voted"
      } 

      
      return (
        <tr key={index}>
          <td>{index}</td>
          <td className="address">{url}</td>
          <td>{rep}%</td>
          <td>{balance}</td>
          <td>
            <Button disabled={disabled} onClick={() => this.handleReliable(url)} variant="success">{msgRel}</Button>
            <Button style={{marginLeft: '1rem'}}disabled={disabled} onClick={() => this.handleDangerous(url)} variant="danger">{msgDan}</Button>
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
          <td>{this.state.voterrel[index]}%</td>
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
    
  handleSubmit() {
    if (this.state.domains.includes(this.state.value)) {
      alert(this.state.value + ' is already in our database')
    } 
    else {
      axios.post('/api/add-domain', {
        domain: this.state.value,
        from: this.state.accounts[0],
      }).then((res) => {
        alert(this.state.value +' has been added with initial reputation from account ' + this.state.accounts[0]);
      }).catch(console.error)
    }
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

        <h1>MODEL2: URLS LIST</h1>

        <form onSubmit={() => this.handleSubmit()}>
          <label>
            Add URL:
            <input className="add-url" type="text" name="name" onChange={event => this.handleChange(event.target.value)}/>
          </label>
          <input type="submit" value="Submit" />
        </form>

        <input className="form-control" id="urlInput" type="text" placeholder="Search URL by Name..." onKeyUp={() => this.urlSearch()}/>

        <div className="table">
          <Table responsive="md" striped bordered hover id="urlTable">
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Reputation</th>
                <th>Balance (wei)</th>
                <th>Vote</th>
              </tr>
            </thead>
            <tbody>{this.renderURLTableData()}</tbody>
          </Table>
        </div>

        <h1>VOTERS LIST</h1>
        
        <input className="form-control" id="voterInput" type="text" placeholder="Search Voter by Adress..." onKeyUp={() => this.voterSearch()}/>
        <div className="table">
          <Table responsive="md" striped bordered hover id="voterTable">
            <thead>
              <tr>
                <th>#</th>
                <th>Adress</th>
                <th>Reputation</th>
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

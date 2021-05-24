import React, { Component } from 'react';
import './App.css';
import axios from 'axios';
import { Table, Button} from 'react-bootstrap';
//import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';
import Web3 from 'web3';

class App extends Component {
  state = {
    urllist: [],
    voterlist: [],
    urlnames:[],
    voteraddresses: [],
    reliability: [],
    value: '',
    web3: {},
    accounts: [],
  };

  async componentDidMount() {
    await axios.all([
      axios.get('/api/url-list'),
      axios.get('/api/voter-list'),
      axios.get('/api/url-names'),
      axios.get('/api/voter-names'),
      axios.get('/api/voter-reliability'),
    ])
    .then(axios.spread((list, voters, urlsnames, votersnames, votersreliability) => {
      const urllist = list.data;
      const voterlist = voters.data;
      const urlnames = urlsnames.data;
      const voteraddresses = votersnames.data
      const reliability = votersreliability.data
      this.setState({urllist});
      this.setState({voterlist});
      this.setState({urlnames});
      this.setState({voteraddresses});
      this.setState({reliability});
    }));

    const web3 = new Web3(window.ethereum);
    web3.eth.handleRevert = true;
    this.setState({web3});
    const accounts = await window.ethereum.request({method: 'eth_requestAccounts'});
    this.setState({accounts});
  }

  handleReliable(url) {
    axios.post('/api/vote-reliable', {
      name: url,
      from: this.state.accounts[0]
    }).then((res) => {
      alert(this.state.accounts[0] +' vote has been counted to ' + url);
      window.location.reload()
    });
  }

  handleDangerous(url) {
    axios.post('/api/vote-dangerous', {
      name: url,
      from: this.state.accounts[0]
    }).then((res) => {
      alert(this.state.accounts[0] +' vote has been counted to ' + url);
      window.location.reload()
    });
  }

  renderURLTableData() {
    var votes = []
    for(var i=0; i < this.state.voteraddresses.length; ++i) {
      if (this.state.voteraddresses[i].toLowerCase() === this.state.accounts[0]) {
        votes = this.state.voterlist[i][1]
      }
    }
    return this.state.urllist.map((url, index) => {
      //const { name, rep, votes } = url //destructuringç
      var rep = Number(50).toFixed(2)
      if (url[1] !== '0') rep = (Number(url[1]/url[2])*100).toFixed(2)

      var disabled;
      if (votes.includes(url[0]))
        disabled=true;
      else disabled=false;
      
      return (
        <tr key={index}>
          <td>{index}</td>
          <td className="address">{url[0]}</td>
          <td>{rep}%</td>
          <td>
            <Button id = {index} disabled={disabled} onClick={() => this.handleReliable(url[0])} variant="success">Reliable</Button>
          </td>
          <td>
            <Button id = {index} disabled={disabled} onClick={() => this.handleDangerous(url[0])} variant="danger">Dangerous</Button>
          </td>
        </tr>
      )
    })
  }

  renderVoterTableData() {
    return this.state.voterlist.map((voter, index) => {

      return (
        <tr key={index}>
          <td>{index}</td>
          <td className="address">{voter[0]}</td>
          <td>{this.state.reliability[index]}%</td>
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
    if (this.state.urlnames.includes(this.state.value)) {
      alert(this.state.value + ' is already in our database');
    } 
    else {
      axios.post('/api/add-url', {
        name: this.state.value,
        from: this.state.accounts[0],
      }).then((res) => {
        console.log("Voted counted to " + this.state.value);
        alert(this.state.value +' has been added with initial reputation from account ' + this.state.accounts[0]);
      })
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

        <h1>URL LIST</h1>

        <form onSubmit={() => this.handleSubmit()}>
          <label>
            Add URL:
            <input type="text" name="name" onChange={event => this.handleChange(event.target.value)}/>
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
                <th colSpan="2">Vote</th>
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

export default App;

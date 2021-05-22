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
    urlsvoted: [],
    value: '',
    web3: {},
    accounts: [],
  };

  async componentDidMount() {
    /*axios.get('/api/url-list').then((res) => {
      const urllist = res.data;
      this.setState({urllist});
    });
    axios.get('/api/url-reputations').then((res) => {
      const reputations = res.data;
      this.setState({reputations});
    });*/
    await axios.all([
      axios.get('/api/url-list'),
      axios.get('/api/voter-list')
    ])
    .then(axios.spread((list, voters) => {
      const urllist = list.data;
      const voterlist = voters.data;
      this.setState({urllist});
      this.setState({voterlist});
    }));

    const urlnames = [];
    this.state.urllist.map((url) => {
      urlnames.push(url[0]);
    })
    this.setState({urlnames});

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
      return this.state.urllist.map((url, index) => {
         //const { name, rep, votes } = url //destructuringç
         var rep = Number(50).toFixed(2)
         if (url[1] !== '0') rep = (Number(url[1]/url[2])*100).toFixed(2)
         return (
            <tr key={index}>
              <td>{index}</td>
              <td className="address">{url[0]}</td>
              <td>{rep}%</td>
              <td>
                <Button onClick={() => this.handleReliable(url[0])} variant="success">Reliable</Button>
              </td>
              <td>
                <Button onClick={() => this.handleDangerous(url[0])} variant="danger">Dangerous</Button>
              </td>
            </tr>
         )
      })
   }

  renderVoterTableData() {
    //reliability is computed as Trust X Credibility. 
    return this.state.voterlist.map((voter, index) => {
        //const { rel, add, list } = voter;
        var trust = voter[1].length/100;
        if (trust > '1') trust = 1;
        
        var credibility = this.computeCredibility(voter[1], voter[2]);

        return (
          <tr key={index}>
            <td>{index}</td>
            <td className="address">{voter[0]}</td>
            <td>{Number(trust * credibility * 100).toFixed(2)}%</td>
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

  computeCredibility(urls, votes) {
    var cred = 0;
    urls.map((name, index) => {
      var i = this.state.urlnames.indexOf(name);
      if (i !== -1) {
        var url = this.state.urllist[i][1];
        if (url >= 0) 
          cred += Number(votes[index]);
        else
          cred -= Number(votes[index]);
      }

    })
    return cred/votes.length;
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

  handleChange(value) {
    this.setState({value})
  }


  render() {
    return (
      <div className="App">

        <h1>URL LIST</h1>

        <form onSubmit={() => this.handleSubmit()}>
          <label>
            Add URL:
            <input type="text" name="name" onChange={event => this.handleChange(event.target.value)}/>
          </label>
          <input type="submit" value="Submit" />
        </form>

        <link href="//cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/3.3.2/css/bootstrap.css" rel="stylesheet"/>
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
        
        <div className="table">
          <Table responsive="md" striped bordered hover id="urlTable">
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

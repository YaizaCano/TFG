import React, { Component } from 'react';
import './App.css';
import axios from 'axios';
import { Table, Button, Modal } from 'react-bootstrap';
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';

class App extends Component {
  state = {
    urllist: [],
    reputations: [],
    voterlist: [],
    show: false,
  };

  componentDidMount() {
    /*axios.get('/api/url-list').then((res) => {
      const urllist = res.data;
      this.setState({urllist});
    });
    axios.get('/api/url-reputations').then((res) => {
      const reputations = res.data;
      this.setState({reputations});
    });*/
    axios.all([
      axios.get('/api/url-list'), 
      axios.get('/api/url-reputations'),
      axios.get('/api/voter-list')
    ])
    .then(axios.spread((list, reps, voters) => {
      const reputations = reps.data;
      const urllist = list.data;
      const voterlist = voters.data;
      console.log(voterlist)
      this.setState({reputations});
      this.setState({urllist});
      this.setState({voterlist});
    }));

  }

  handleReliable(url) {
    axios.post('/api/vote-reliable', {
      name: url
    }).then((res) => {
      console.log("Voted counted to " + url);
    });
    window.location.reload()
  }

  handleDangerous(url) {
    axios.post('/api/vote-dangerous', {
      name: url
    }).then((res) => {
      console.log("Voted counted to " + url);
    });
    window.location.reload()
  }

  renderURLTableData() {
      return this.state.urllist.map((url, index) => {
         //const { name } = url //destructuring
         return (
            <tr key={index}>
              <td>{index}</td>
              <td className="address">{url}</td>
              <td>{this.state.reputations[index]}%</td>
              <td>
                <Button onClick={() => this.handleReliable(url)} variant="success">Reliable</Button>{''}
              </td>
              <td>
                <Button onClick={() => this.handleDangerous(url)} variant="danger">Dangerous</Button>
              </td>
            </tr>
         )
      })
   }

  showURLVoted(list) {
    console.log(list);
  }

  renderVoterTableData() {
      return this.state.voterlist.map((voter, index) => {
            //const { rel, add, list } = voter;
          return (
            <tr key={index}>
              <td>{index}</td>
              <td className="address">{voter[1]}</td>
              <td>{voter[0]}</td>
              <td>
                <ul>
                  {voter[2].map((url) => {
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

  render() {
    return (
      <div className="App">
        <h1>URL LIST</h1>
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

import React, { Component } from 'react';
import './App.css';
import axios from 'axios';
import { Table, Button } from 'react-bootstrap';

class App extends Component {
  state = {
    urllist: [],
    reputations: [],
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
      axios.get('/api/url-reputations')
    ])
    .then(axios.spread((list, reps) => {
      const reputations = reps.data;
      const urllist = list.data;
      this.setState({reputations});
      this.setState({urllist});
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

  renderTableData() {
      return this.state.urllist.map((url, index) => {
         //const { name } = url //destructuring
         return (
            <tr key={index}>
              <td>{index}</td>
              <td>{url}</td>
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
                <th>URL Name</th>
                <th>URL Reputation</th>
                <th colSpan="2">Vote</th>
              </tr>
            </thead>
            <tbody>{this.renderTableData()}</tbody>
          </Table>
        </div>
        <h1>VOTERS LIST</h1>
      </div>

    );
  }

}

export default App;

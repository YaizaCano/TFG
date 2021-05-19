import React, { Component } from 'react';
import './App.css';
import axios from 'axios'

/*class App extends Component {

  render(){
  return (
    <div className="App">
        <header className="App-header">
        <p>
          Click any of the bottom buttons
        </p>
        <form action="/api/url-list" method="post" 
              className="form">
          <button type="submit">See URL list available</button>
        </form>
        <form action="/api/url-reputation?name=yaiza" method="post" 
              className="form">
          <label>
            URL:
            <input type="text" name="name"/>
          </label>
          <input type="submit" value="Submit"/>
        </form>
      </header>
    </div>
  );
}
}*/




class App extends Component {
  state = {
    response: [],
    urllist: [],
    reputation: {},
  };

  componentDidMount() {
    axios.get('/api/say-something').then((res) => {
      const response = res.data;
      this.setState({response});
    });
    axios.get('/api/url-list').then((res) => {
      const urllist = res.data;
      this.setState({urllist});
    });
    /*axios.get('/api/url-reputation', {
      params: {
        name: 'yaiza'      
      }
    }).then((res) => {
      const reputation = res.data;
      this.setState({reputation});
      //RECORDA FER .TOSTRING SINÓ NO FURULA
    });*/
  }

  render() {
    return (
      <div className="App">
        <h1>URL LIST</h1>
        <ul>
          {this.state.urllist.map(name => 
            <li key={name}>
              <form action={"/api/url-reputation?name=" + name} method="post" 
                    className="form">
                {name}
                <input className="repButton" type="submit" value="See reputation"/>
              </form>
            </li>
          )}
        </ul>
      </div>
    );
  }

}

export default App;

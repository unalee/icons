import React, { Component } from 'react';
import { Route, Link } from 'react-router-dom';
import Home from '../home';
import Login from '../login';
import Header from '../header';
import IconDetail from '../iconDetail'
import IconList from '../iconList'
import './App.css';

class App extends Component {

  render() {
    return (
      <div className="App">
        <Header/>

        <main>
          <div className="container">
            <Route exact path="/" component={Home} />
            <Route exact path="/login" component={Login} />
            <Route path="/icon/:iconId" component={IconDetail} />
            <Route path="/icons/:tag" component={IconList} />
            <Route path="/icons" component={IconList} />
          </div>
        </main>
      </div>
    );
  }
}

export default App;

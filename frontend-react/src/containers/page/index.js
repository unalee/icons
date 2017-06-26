import React from 'react'
import { Route } from 'react-router'
import Header from '../header'
import Home from '../home'
import Login from '../login'
import Signup from '../signup'
import IconDetail from '../iconDetail'
import IconList from '../iconList'

import './Page.css'

class Page extends React.Component {

  componentWillMount() {
    console.log('Page is loaded')
  }

  render() {
    return (
      <div>
        <Header />
        <div className="container">
          <Route exact path="/" render={(props) => (
            <Home getIcons={this.props.getIcons} icons={this.props.icons} {...props} />
          )} />
          <Route exact path="/icons" render={(props) => (
            <IconList {...props} />
          )} />
          <Route exact path="/icon/:iconId" render={(props) => (
            <IconDetail {...props} />
          )} />
          <Route exact path="/login" render={(props) => (
            <Login logIn={this.props.logIn} />
          )} />

          <Route exact path="/signup" render={(props) => (
            <Signup signUp={this.props.signUp} />
          )} />
        </div>
      </div>
    )
  }
}

export default Page

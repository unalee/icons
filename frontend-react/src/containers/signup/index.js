import React, { Component } from 'react'

class Signup extends Component {

  constructor(props) {
    super(props)
    this.signUp = this.signUp.bind(this)
  }

  signUp() {
    this.props.logIn();
  }

  render() {
    return (
      <div className="row medium-6 medium-centered large-4 large-centered columns">
          <form onSubmit={this.signUp}>
            <div className="signup-form">
              <h4 className="text-center">Log in</h4>
              <label>Username
                <input type="email" placeholder="user@domain.com" required />
              </label>
              <label>Password
                <input type="password" placeholder="password" required/>
              </label>
              <button type="submit" className="button expand">Log In</button>
              <p className="text-center"><a>Forgot your password?</a></p>
            </div>
          </form>
      </div>
    )
  }
}

export default Signup

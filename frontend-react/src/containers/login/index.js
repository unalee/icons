import React, { Component } from 'react'

class Login extends Component {

  constructor(props) {
    super(props)
    this.logIn = this.logIn.bind(this)
    this.onChange = this.onChange.bind(this)
    this.state = {
      email: '',
      password: ''
    }
  }

  logIn(evt) {
    evt.preventDefault()
    const { email, password } = this.state
    this.props.logIn({email, password});
  }

  onChange(evt, key) {
    this.setState({
      [key]: evt.target.value
    })
  }

  render() {
    return (
      <div className="row medium-6 medium-centered large-4 large-centered columns">
          <form onSubmit={evt => this.logIn(evt)}>
            <div className="log-in-form">
              <h4 className="text-center">Log in</h4>
              <label>Username
                <input type="email" placeholder="Username" required value={this.state.email} onChange={evt => this.onChange(evt, 'email')} />
              </label>
              <label>Password
                <input type="password" placeholder="Password" required  value={this.state.password} onChange={evt => this.onChange(evt, 'password')}/>
              </label>
              <button type="submit" className="button expand">Log In</button>
              <p className="text-center"><a>Forgot your password?</a></p>
            </div>
          </form>
      </div>
    )
  }
}

export default Login

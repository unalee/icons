import React from 'react'
import { push } from 'react-router-redux'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

const Login = props => (
  <div className="row medium-6 medium-centered large-4 large-centered columns">
      <form ng-controller="loginCtrl" ng-submit="logIn()">
        <div className="log-in-form">
          <h4 className="text-center">Log in</h4>
          <label>Username
            <input type="email" placeholder="Username" ng-model="user.email" required />
          </label>
          <label>Password
            <input type="password" placeholder="Password" ng-model="user.password" required/>
          </label>
          <button type="submit" className="button expand">Log In</button>
          <p className="text-center"><a ui-sref="password">Forgot your password?</a></p>
        </div>
      </form>
  </div>
)

const mapStateToProps = state => ({
  icons: state.icons
})

const mapDispatchToProps = dispatch => bindActionCreators({
  upload: () => push('/upload')
}, dispatch)

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Login)

import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import './Header.css';

class Header extends Component {

  constructor(props) {
    super(props)
    this.onToggleMobileMenu = this.onToggleMobileMenu.bind(this)
    this.state = {
      menuCollapsed: true
    }
  }

  onToggleMobileMenu() {
    this.setState({
      menuCollapsed: !this.state.menuCollapsed
    })
  }
  
  render() {
    const isLoggedIn = () => {
      return this.props.token && this.props.ready
    }

    return (
      <header>
        <nav className="navbar">
          <div className="navbar-brand">
            <Link className="navbar-item" to="/"><img src="/images/logo.png" alt="Vison Archive logo" /></Link>
            <div className={this.state.menuCollapsed ? 'navbar-burger burger' : 'navbar-burger burger is-active'} data-target="menu" onClick={this.onToggleMobileMenu}>
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
          <div className="navbar-menu" className={this.state.menuCollapsed ? 'navbar-menu' : 'navbar-menu is-active'}>
            <div className="navbar-start">  
              <Link  className="navbar-item"to="/icons">Icons</Link>
              <Link  className="navbar-item"to="/about">About</Link>
              { isLoggedIn() ? <Link to="/upload">Upload</Link> : null }
            </div>
            <div className="navbar-end">
              { isLoggedIn() ? null : <Link className="navbar-item" to="/signup">Create An Account</Link>}
              { isLoggedIn() ? null :  <Link className="navbar-item" to="/login">Log In</Link> }
              { isLoggedIn() ? <Link className="navbar-item" to="/logout">Log Out</Link> : null }
            </div>
          </div>
          
        </nav>
      </header>
    );
  }
}

export default Header;

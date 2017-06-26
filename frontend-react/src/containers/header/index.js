import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import './Header.css';

class Header extends Component {
  render() {
    return (
      <header>
        <div className="header-contents">
          <div className="left-links">
            <Link className="logo" to="/"><img src="/images/logo.png" alt="Vison Archive logo" /></Link>
            <Link to="/icons">Icons</Link>
            <Link to="/about">About</Link>
            <Link to="/upload">Upload</Link>
          </div>
          <div className="right-links">
            <Link to="/signup">Create An Account</Link>
            <Link to="/login">Log In</Link>
            <Link to="/login">Log Out</Link>
          </div>
        </div>
      </header>
    );
  }
}

export default Header;

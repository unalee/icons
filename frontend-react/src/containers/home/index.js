import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import './Home.css';
import Icon from '../../components/icon'

class Home extends Component {

  constructor(props) {
    super(props)
  }

  componentDidMount() {
    this.props.getIcons({limit:6});
  }

  render() {
    return (
      <div className="home">
        <div className="home-banner row">
          <div className="large-12 columns">
            <div className="banner-container">
              <img src="/images/Banner.png" className="top-banner" alt="Vision Archive" />
              <div className="pull-up">
                <Link to="/upload">Upload An Image</Link>
              </div>
            </div>
          </div>
        </div>

        <div className="home-animation row">
          <div className="large-12 columns">
            <div className="mission-statement-container">
              <h2 className="center-title">Visionary Images<br />For Social Movements</h2>
              <img className="banner-animation" src="/images/Home-page-animation.gif" alt="Design an image, remix an image" />
              <div className="overlay">
                <Link to="/upload">Upload An Image</Link>
                <div className="circle"><Link to="/learn-more">Upload A Remix</Link></div>
                <Link to="/upload">Upload A Remix</Link>
              </div>
            </div>
          </div>
        </div>

        <div className="home-animation row">
          <div className="large-12 columns">
            <div className="mission-statement-container">
              <h3>Recent Icons</h3>
              {this.props.icons.map((icon, i) => <Icon {...this.props} key={i} i={i} icon={icon} />)}
            </div>
          </div>
        </div>


      </div>
    )
  }
}

export default Home

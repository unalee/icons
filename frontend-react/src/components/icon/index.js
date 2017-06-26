import React, { Component } from 'react';

class Icon extends Component {
  render() {
    const { icon, i } = this.props;
    return <div className="icon">
      <img src={icon.url} alt={icon.title} className="grid-photo" />
    </div>
  }
}

export default Icon

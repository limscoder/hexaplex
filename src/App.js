import React, { Component } from 'react';
import Hexagons from './Hexagons';

export default class App extends Component {
  render() {
    const containerStyle = {
      display: 'flex',
      flexDirection: 'column',
      height: '100vh'
    };
    const headerStyle = {
      height: '40px',
      margin: '10px'
    };
    const linkStyle = {
      color: 'rgb(255, 1, 175)',
      textDecoration: 'none'
    };

    return (
      <div style={ containerStyle }>
        <h1 style={ headerStyle }>
          <a href="https://github.com/limscoder/hexaplex" style={ linkStyle }>Hex-a-plex</a>
        </h1>
        <Hexagons />
      </div>
    );
  }
}

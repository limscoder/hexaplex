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
      color: 'rgb(255, 1, 175)',
      height: '40px',
      margin: '10px'
    };

    return (
      <div style={ containerStyle }>
        <h1 style={ headerStyle }>Hex-a-plex</h1>
        <Hexagons />
      </div>
    );
  }
}

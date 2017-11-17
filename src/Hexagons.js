import React, { Component } from 'react';
import * as d3 from 'd3';

const transitionDuration = 400;
const h = Math.sqrt(3) / 2;
const r = 30;

function buildHexPath(x = 0, y = 0) {
  return d3.line()
    .x(d => d.x)
    .y(d => d.y)
    .curve(d3.curveCardinalClosed.tension('0.8'))([
      { x: r + x, y },
      { x: r / 2 + x, y: r * h + y },
      { x: -r / 2 + x, y: r * h + y },
      { x: -r + x, y },
      { x: -r / 2 + x, y: -r * h + y },
      { x: r / 2 + x, y: -r * h + y }
    ]);
}
const hexPath = buildHexPath();

function buildHexData(cols = 7, rows = 7) {
  const hexes = [];
  const centerCol = Math.floor(cols / 2);
  const centerRow = Math.floor(rows / 2);
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      hexes.push({
        active: i === centerCol && j === centerRow,
        col: i,
        row: j
      });
    }
  }
  return hexes;
}

function hexFill(d) {
  return d.active ? 'rgb(255, 1, 175)' : 'rgb(60, 60, 60)';
}

function toggleHex(target, hex) {
  const firstColIdx = target.row % 2 ? 0 : -1;
  const secondColIdx = target.row % 2 ? 1 : 0;
  const isNeighbor =
    (hex.col === target.col && hex.row === target.row) || // target
    (hex.row === target.row - 1 && (hex.col === target.col + firstColIdx || hex.col === target.col + secondColIdx)) || // above row
    (hex.row === target.row && (hex.col === target.col - 1 || hex.col === target.col + 1)) || // same row
    (hex.row === target.row + 1 && (hex.col === target.col + firstColIdx || hex.col === target.col + secondColIdx)); // below row
  if (isNeighbor) {
    return { ...hex, active: !hex.active };
  }

  return hex;
}

export default class Hexagons extends Component {
  constructor(props) {
    super(props);
    this.state = { hexData: buildHexData() };
  }

  componentDidMount() {
    this.hexGroup = d3.select(this.svg).append('g');
    this.renderHexes();

    const svgBox = this.svg.getBoundingClientRect();
    const hexBox = this.hexGroup.node().getBBox();
    const scale = svgBox.height / hexBox.height;
    const centerX = (svgBox.width / 2) - ((hexBox.width * scale) / 2);
    this.hexGroup.attr('transform', `matrix(0, 0, 0, 0, ${centerX}, 0)`)
      .transition()
      .duration(transitionDuration)
        .attr('transform', `matrix(${scale}, 0, 0, ${scale}, ${centerX}, 0)`)
  }

  componentDidUpdate() {
    this.renderHexes();
  }

  render() {
    const hexStyle = { flex: 1 };
    return <svg ref={ svg => this.svg = svg } style={ hexStyle }/>;
  }

  renderHexes() {
    const hexes = this.hexGroup
      .selectAll('.hex')
      .data(this.state.hexData);

    // draw hexlinks
    this.appendHexLinks(hexes.enter());

    // update hexlink colors
    hexes.select('path')
      .transition()
      .duration(transitionDuration)
      .attr('fill', hexFill);
  }

  appendHexLinks(selection) {
    const hexlink = selection.append('svg:a')
      .attr('class', 'hex')
      .attr('href', '')
      .on('click', d => {
        d3.event.preventDefault();
        d3.event.stopPropagation();
        this.setState({
          hexData: this.state.hexData.map(hex => toggleHex(d, hex))
        });
      });
  
    hexlink.append('path')
      .attr('d', hexPath)
      .attr('fill', hexFill)
      .attr('stroke', 'transparent')
      .attr('stroke-width', 4)
      .attr('transform', d => {
        const cx = (d.col * r * 2) + (d.row % 2 ? r * 2 : r);
        const cy = (d.row * r * 1.75) + r;
        return `translate(${cx}, ${cy}) rotate(90 0 0)`;
      });
  }
}
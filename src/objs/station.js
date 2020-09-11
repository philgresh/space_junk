import SVG from './svg';

export default class Station {
  constructor($parent, type = 'cannon', position = [0, 0]) {
    this.parent = $parent;
    this.type = type;
    this.position = position;

    this.render();
  }

  render() {
    // const newNode = new SVG();
    // this.parent.append(newNode);
  }
}

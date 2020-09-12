import MARS_SIZE from '../mars';

export default class Station {
  constructor(paperScope) {
    const canvas = paperScope.project.view.element;
    this.ctx = canvas.getContext('2d');
    this.width = canvas.width;
    this.height = canvas.height;

    this.CENTER_X = this.width / 2;
    this.CENTER_Y = this.height / 2;
    this.MARS_RADIUS = this.width * MARS_SIZE;

    this.render();
  }

  render() {
    // const newNode = new SVG();
    // this.parent.append(newNode);
  }
}

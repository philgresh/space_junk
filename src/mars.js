import $ from 'jquery';
import Station from './objs/station';
const MARS_SIZE = 0.1; // Percent of screen width

export default class Mars {
  constructor(paperScope) {
    const canvas = paperScope.project.view.element;
    this.ctx = canvas.getContext('2d');
    this.width = canvas.width;
    this.height = canvas.height;

    // Set constants
    this.CENTER_X = this.width / 2;
    this.CENTER_Y = this.height / 2;
    this.MARS_RADIUS = this.width * MARS_SIZE;
    this.ATMOSPHERE_RADIUS = this.MARS_RADIUS * 1.4;
    this.resizeMars(canvas);
    this.renderBackgroundGradient();
    this.renderForegroundGradients();
    // this.renderShadow();
    // this.station1 = new Station($('.station-parent'));

    window.addEventListener('resize', this.resizeCanvas);
  }

  renderBackgroundGradient() {
    // Draw background Mars atmosphere
    let gradient = this.ctx.createRadialGradient(
      this.CENTER_X,
      this.CENTER_Y,
      0.1,
      this.CENTER_X,
      this.CENTER_Y,
      this.ATMOSPHERE_RADIUS
    );
    gradient.addColorStop(0, '#eeeeee00');
    gradient.addColorStop(0.68, '#eeeeee11');
    gradient.addColorStop(0.71, '#eeeeee44');
    gradient.addColorStop(0.73, '#eeeeee22');
    gradient.addColorStop(1, '#eeeeee00');

    this.ctx.beginPath();
    this.ctx.fillStyle = gradient;
    this.ctx.arc(
      this.CENTER_X,
      this.CENTER_Y,
      this.ATMOSPHERE_RADIUS,
      0,
      2 * Math.PI
    );
    this.ctx.fill();
    this.ctx.closePath();
  }

  renderForegroundGradients() {
    // debugger;
    // Draw foreground Mars with reflection/shadow
    let gradient = this.ctx.createRadialGradient(
      this.CENTER_X - this.MARS_RADIUS * 0.85,
      this.CENTER_Y,
      0.1,
      this.CENTER_X - this.MARS_RADIUS * 0.5,
      this.CENTER_Y,
      this.MARS_RADIUS * 2
    );
    gradient.addColorStop(0, '#00000000');
    gradient.addColorStop(0.8, '#101010FF');
    gradient.addColorStop(1, '#000000FF');

    this.ctx.beginPath();
    this.ctx.fillStyle = gradient;
    this.ctx.arc(
      this.CENTER_X,
      this.CENTER_Y,
      this.MARS_RADIUS,
      0,
      2 * Math.PI
    );
    this.ctx.fill();
    this.ctx.closePath();
  }

  renderShadow() {
    // debugger;
    // Draw foreground Mars with reflection/shadow
    let gradient = this.ctx.createRadialGradient(
      this.CENTER_X + this.ATMOSPHERE_RADIUS * 0.85,
      this.CENTER_Y,
      0.1,
      this.CENTER_X + this.ATMOSPHERE_RADIUS * 0.5,
      this.CENTER_Y,
      this.ATMOSPHERE_RADIUS
    );
    gradient.addColorStop(0, '#10101044');
    gradient.addColorStop(0.7, '#10101099');
    gradient.addColorStop(1, '#10101000');

    this.ctx.beginPath();
    this.ctx.fillStyle = gradient;
    this.ctx.arc(
      this.CENTER_X,
      this.CENTER_Y,
      this.ATMOSPHERE_RADIUS,
      0,
      2 * Math.PI
    );
    this.ctx.fill();
    this.ctx.closePath();
  }

  resizeCanvas(canvas) {
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  resizeMars() {
    const $marsImg = $('#mars img');
    $marsImg.height(this.MARS_RADIUS * 2);
    $marsImg.offset({
      top: this.CENTER_Y - this.MARS_RADIUS,
      left: this.CENTER_X - this.MARS_RADIUS,
    });
    $marsImg.css('clip-path', `circle(${this.MARS_RADIUS}px at center)`);
  }
}

const MARS_SIZE = .1;

class Mars {
  constructor(ctx, width, height) {
    this.ctx = ctx;
    this.width = width;
    this.height = height;

    // Set constants
    this.CENTER_X = this.width / 2;
    this.CENTER_Y = this.height / 2;
    this.MARS_RADIUS = this.width * MARS_SIZE
    this.renderBackground();
    this.renderGradients();
  }

  renderGradients() {

    // Draw background Mars
    // let gradient = this.ctx.createRadialGradient(
    //   this.CENTER_X,
    //   this.CENTER_Y,
    //   0.1,
    //   this.CENTER_X,
    //   this.CENTER_Y,
    //   this.MARS_RADIUS * 1.2
    // );
    // gradient.addColorStop(0, '#111');
    // gradient.addColorStop(.95, '#111');
    // gradient.addColorStop(1, '#FFFFFF11');

    // this.ctx.beginPath();
    // this.ctx.fillStyle = gradient;
    // this.ctx.arc(this.CENTER_X, this.CENTER_Y, this.MARS_RADIUS, 0, 2 * Math.PI);
    // this.ctx.fill();

    // Draw foreground Mars with reflection/shadow
    let gradient = this.ctx.createRadialGradient(
      this.CENTER_X - this.MARS_RADIUS * .85,
      this.CENTER_Y,
      0.1,
      this.CENTER_X - this.MARS_RADIUS * .5,
      this.CENTER_Y,
      this.MARS_RADIUS * 2
    );
    gradient.addColorStop(0, '#00000000');
    gradient.addColorStop(0.5, '#000000FF');
    gradient.addColorStop(1, '#000000FF');
    // gradient.addColorStop(0, '#3a81b8');
    // gradient.addColorStop(.8, '#1c3447');
    // gradient.addColorStop(.9, '#1c344711');
    // gradient.addColorStop(0.93, '#00000033');
    // gradient.addColorStop(1, '#000000');

    this.ctx.beginPath();
    this.ctx.fillStyle = gradient;
    this.ctx.arc(this.CENTER_X, this.CENTER_Y, this.MARS_RADIUS, 0, 2 * Math.PI);
    this.ctx.fill();
  }

  renderBackground() {

  }
}

module.exports = Mars;
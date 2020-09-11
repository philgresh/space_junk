export default class SVG {
  constructor(
    viewbox = '0,0 10,10',
    childType = 'triangle',
    otherChildren = null
  ) {
    this.viewbox = viewbox;
    this.childType = childType;
    this.otherChildren = otherChildren;
    this.self = document.createElement('svg');
    this.setup();
    return this.self;
  }

  setup() {
    this.self.setAttribute('viewbox', this.viewbox);
    this.self.setAttribute('class', 'station');
    this.self.appendChild(path());
    this.self.appendChild(rect());
  }
}

const rect = () => {
  const self = document.createElement('rect');
  self.setAttribute('height', '1');
  self.setAttribute('width', '1');
  self.className = 'marker';
  return self;
};

const path = () => {
  const self = document.createElement('path');
  self.setAttribute('d', 'M 5 5 m -4, 0 a 4,4 0 1,0 8,0 a 4,4 0 1,0 -8,0');
  self.setAttribute('stroke-width', '0.25');
  self.setAttribute('fill', 'none');
  self.className = 'track';
  return self;
};

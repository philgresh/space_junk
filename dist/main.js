/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/index.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/asteroid.js":
/*!*************************!*\
  !*** ./src/asteroid.js ***!
  \*************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _util_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./util.js */ \"./src/util.js\");\n/* harmony import */ var _util_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_util_js__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var _movingObject_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./movingObject.js */ \"./src/movingObject.js\");\n\n\n\nconst COLOR = \"#333\";\nconst RADIUS = 20;\n\nclass Asteroid extends _movingObject_js__WEBPACK_IMPORTED_MODULE_1__[\"default\"] {\n  constructor(obj) {\n    super({\n      game: obj.game,\n      pos: obj.pos,\n      color: obj.color || COLOR,\n      radius: obj.radius || RADIUS,\n      vel: Object(_util_js__WEBPACK_IMPORTED_MODULE_0__[\"randomVec\"])(3),\n      z: obj.z || Math.floor(Math.random() * -2 + 1)\n    });\n  }\n\n}\n\n/* harmony default export */ __webpack_exports__[\"default\"] = (Asteroid);\n\n//# sourceURL=webpack:///./src/asteroid.js?");

/***/ }),

/***/ "./src/game.js":
/*!*********************!*\
  !*** ./src/game.js ***!
  \*********************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _asteroid_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./asteroid.js */ \"./src/asteroid.js\");\n/* harmony import */ var _ship__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./ship */ \"./src/ship.js\");\n\n\n\nclass Game {\n  constructor(width, height, numAsteroids = 20) {\n    this.allObjects = [];\n    this.ship;\n    this.DIM_X = width;\n    this.DIM_Y = height;\n    this.NUM_ASTEROIDS = numAsteroids;\n    this.addAllObjects();\n  }\n\n  step(ctx) {\n    // debugger\n    ctx.clearRect(0, 0, this.DIM_X, this.DIM_Y);\n    let i = 0;\n    while (i < this.allObjects.length) {\n      const obj = this.allObjects[i];\n      // move all\n      obj.move();\n\n      // remove any off-screen\n      if (this._isCompletelyOffScreen(obj)) {\n        this.remove(i);\n        // console.log('object removed', this);\n      } else {\n\n        // create clones for almost-off-screen\n\n        // check for collisions\n        // this.checkCollisionsOnObj(obj)\n\n        // draw all\n        obj.draw(ctx);\n        i++;\n      }\n\n    };\n  }\n  cloneSideObjs(obj) {\n    let [x, y] = obj.pos;\n    const radius = obj.radius;\n    // (x + radius > this.DIM_X) ||\n    //   (x - radius < 0) ||\n    //   (y + radius > this.DIM_Y) ||\n    //   (y - radius < 0)\n    if (x + radius > this.DIM_X) { // Moving off to the right\n      const pos = 0 - this.DIM_X;\n      console.log(pos);\n      // if (this.allObjects.includes())\n      // this.cloneObj({\n      //   ...obj\n      // })\n    }\n  }\n\n\n  checkCollisionsOnObj(obj) {\n    const allObjs = this.allObjects;\n    for (let i = 0; i < allObjs.length - 1; i++) {\n      const otherObj = allObjs[j];\n      if (obj.isCollidedWith(otherObj)) {\n        this.remove(obj);\n        this.remove(otherObj);\n        break;\n      }\n    }\n  }\n\n  remove(idx) {\n    this.allObjects.splice(idx, 1);\n  }\n\n  addAllObjects() {\n    // this.ship = new Ship({\n    //   game: this,\n    //   pos: this._randomPosition(),\n    // });\n    const backgroundAsteroids = this._genAsteroids(this.NUM_ASTEROIDS / 2, -1);\n    const foregroundAsteroids = this._genAsteroids(this.NUM_ASTEROIDS / 2, 0);\n    this.allObjects = backgroundAsteroids.concat(foregroundAsteroids);\n  }\n\n  cloneObj(obj) {\n    if (obj.z === 0) {\n      // add to main field\n    } else {\n      // add to background\n    }\n  }\n\n  _randomPosition() {\n    const randX = Math.random() * this.DIM_X;\n    const randY = Math.random() * this.DIM_Y;\n    return [randX, randY];\n  }\n\n  _isPartiallyOffScreen({ pos, radius }) {\n    return (\n      this._isCompletelyOffScreen({ pos, radius: 0 }) &&\n      !this._isCompletelyOffScreen({ pos, radius })\n    );\n  }\n\n  _isCompletelyOffScreen({ pos: [x, y], radius }) {\n    return (\n      (x - radius > this.DIM_X) ||\n      (x + radius < 0) ||\n      (y - radius > this.DIM_Y) ||\n      (y + radius < 0)\n    );\n  }\n\n  _genAsteroids(num, z = 0) {\n    const asteroids = [];\n    for (let i = 0; i < num; i++) {\n      asteroids.push(\n        new _asteroid_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"]({\n          z,\n          game: this,\n          pos: this._randomPosition(),\n          radius: Math.random() * 20 + 10,\n        })\n      )\n    };\n    return asteroids;\n  }\n}\n\n\n\n/* harmony default export */ __webpack_exports__[\"default\"] = (Game);\n\n//# sourceURL=webpack:///./src/game.js?");

/***/ }),

/***/ "./src/game_view.js":
/*!**************************!*\
  !*** ./src/game_view.js ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("const Game = __webpack_require__(/*! ./game */ \"./src/game.js\").default\n\nclass GameView {\n  constructor(ctx, width, height) {\n    this.ctx = ctx;\n    this.game = new Game(width, height, 200);\n  }\n  start() {\n    setInterval(() => {\n      window.requestAnimationFrame(() => this.game.step(this.ctx))\n    }, 200);\n  }\n\n\n}\n\n\nmodule.exports = GameView;\n\n//# sourceURL=webpack:///./src/game_view.js?");

/***/ }),

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("// console.log('webpack is working!')\nconst GameView = __webpack_require__(/*! ./game_view */ \"./src/game_view.js\");\nconst Mars = __webpack_require__(/*! ./mars */ \"./src/mars.js\");\n\n$(function () {\n  const $gameCanvas = $('#game-canvas')[0];\n  const $marsCanvas = $('#mars canvas')[0];\n  const gameCtx = $gameCanvas.getContext('2d');\n  const marsCtx = $marsCanvas.getContext('2d');\n\n  resizeCanvases([$marsCanvas, $gameCanvas]);\n\n  const mars = new Mars(marsCtx, $marsCanvas.width, $marsCanvas.height);\n  // const gameView = new GameView(gameCtx, canvas.width, canvas.height);\n  // gameView.start();\n  // $canvas.removeClass('hidden');\n})\n\nfunction resizeCanvases(canvases) {\n  canvases.forEach((canvas) => {\n    canvas.width = window.innerWidth;\n    canvas.height = window.innerHeight;\n  })\n}\n\n//# sourceURL=webpack:///./src/index.js?");

/***/ }),

/***/ "./src/mars.js":
/*!*********************!*\
  !*** ./src/mars.js ***!
  \*********************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("const MARS_SIZE = .1;\n\nclass Mars {\n  constructor(ctx, width, height) {\n    this.ctx = ctx;\n    this.width = width;\n    this.height = height;\n\n    // Set constants\n    this.CENTER_X = this.width / 2;\n    this.CENTER_Y = this.height / 2;\n    this.MARS_RADIUS = this.width * MARS_SIZE\n    this.renderBackground();\n    this.renderGradients();\n  }\n\n  renderGradients() {\n\n    // Draw background Mars\n    // let gradient = this.ctx.createRadialGradient(\n    //   this.CENTER_X,\n    //   this.CENTER_Y,\n    //   0.1,\n    //   this.CENTER_X,\n    //   this.CENTER_Y,\n    //   this.MARS_RADIUS * 1.2\n    // );\n    // gradient.addColorStop(0, '#111');\n    // gradient.addColorStop(.95, '#111');\n    // gradient.addColorStop(1, '#FFFFFF11');\n\n    // this.ctx.beginPath();\n    // this.ctx.fillStyle = gradient;\n    // this.ctx.arc(this.CENTER_X, this.CENTER_Y, this.MARS_RADIUS, 0, 2 * Math.PI);\n    // this.ctx.fill();\n\n    // Draw foreground Mars with reflection/shadow\n    let gradient = this.ctx.createRadialGradient(\n      this.CENTER_X - this.MARS_RADIUS * .85,\n      this.CENTER_Y,\n      0.1,\n      this.CENTER_X - this.MARS_RADIUS * .5,\n      this.CENTER_Y,\n      this.MARS_RADIUS * 2\n    );\n    gradient.addColorStop(0, '#00000000');\n    gradient.addColorStop(0.5, '#000000FF');\n    gradient.addColorStop(1, '#000000FF');\n    // gradient.addColorStop(0, '#3a81b8');\n    // gradient.addColorStop(.8, '#1c3447');\n    // gradient.addColorStop(.9, '#1c344711');\n    // gradient.addColorStop(0.93, '#00000033');\n    // gradient.addColorStop(1, '#000000');\n\n    this.ctx.beginPath();\n    this.ctx.fillStyle = gradient;\n    this.ctx.arc(this.CENTER_X, this.CENTER_Y, this.MARS_RADIUS, 0, 2 * Math.PI);\n    this.ctx.fill();\n  }\n\n  renderBackground() {\n\n  }\n}\n\nmodule.exports = Mars;\n\n//# sourceURL=webpack:///./src/mars.js?");

/***/ }),

/***/ "./src/movingObject.js":
/*!*****************************!*\
  !*** ./src/movingObject.js ***!
  \*****************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _util__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./util */ \"./src/util.js\");\n/* harmony import */ var _util__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_util__WEBPACK_IMPORTED_MODULE_0__);\n\n\nfunction createGradient(ctx, pos, radius, z) {\n  const [x, y] = pos;\n  const gradient = ctx.createRadialGradient(\n    x - radius * .65,\n    y,\n    .1,\n    x - radius * .65,\n    y,\n    radius\n  )\n  if (z < 0) {\n    gradient.addColorStop(0, \"#555\");\n  } else {\n    gradient.addColorStop(0, \"#7f9eba\");\n  }\n  gradient.addColorStop(1, \"#111\");\n  return gradient\n};\n\nclass MovingObject {\n  constructor(obj) {\n    this.id = Object(_util__WEBPACK_IMPORTED_MODULE_0__[\"genID\"])();\n    this.game = obj.game;\n    this.pos = obj.pos;   // [100, 150]\n    this.vel = obj.vel;   // [10, 10]\n    this.radius = obj.radius;\n    this.color = obj.color;\n    this.z = obj.z;\n  }\n\n  draw(ctx) {\n    ctx.fillStyle = this.color;\n    ctx.beginPath();\n    ctx.arc(this.pos[0], this.pos[1], this.radius, 0, 2 * Math.PI);\n    const grd = createGradient(ctx, this.pos, this.radius, this.z)\n    ctx.fillStyle = grd;\n    ctx.fill();\n  }\n\n  move() {\n    this.pos[0] += this.vel[0];\n    this.pos[1] += this.vel[1];\n  }\n\n  isCollidedWith(otherObject) {\n    const z1 = this.z;\n    const z2 = otherObject.z;\n    if (z1 === z2) {\n      const distanceBetweenCenters = Object(_util__WEBPACK_IMPORTED_MODULE_0__[\"straightLineDistance\"])(this.pos, otherObject.pos);\n      const distanceWithRadius = distanceBetweenCenters - (this.radius + otherObject.radius);\n      return (distanceWithRadius <= 0);\n    } else return false;\n  }\n}\n\n\n/* harmony default export */ __webpack_exports__[\"default\"] = (MovingObject);\n\n//# sourceURL=webpack:///./src/movingObject.js?");

/***/ }),

/***/ "./src/ship.js":
/*!*********************!*\
  !*** ./src/ship.js ***!
  \*********************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _movingObject__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./movingObject */ \"./src/movingObject.js\");\n\n\nconst COLOR = \"darkMagenta\";\nconst RADIUS = 10;\n\nclass Ship extends _movingObject__WEBPACK_IMPORTED_MODULE_0__[\"default\"] {\n  constructor(obj) {\n    super({\n      game: obj.game,\n      pos: obj.pos,\n      color: obj.color || COLOR,\n      radius: RADIUS,\n      vel: [0, 0],\n      z: 0,\n    })\n  }\n\n  draw(ctx) {\n    ctx.fillStyle = this.color;\n    ctx.beginPath();\n    ctx.arc(this.pos[0], this.pos[1], this.radius, 0, 2 * Math.PI);\n    const grd = ctx.createLinearGradient(0, 0, 0, 500);\n    grd.addColorStop(0, \"#555\");\n    grd.addColorStop(1, \"#F00\");\n    ctx.fillStyle = grd;\n    ctx.fill();\n  }\n}\n\n/* harmony default export */ __webpack_exports__[\"default\"] = (Ship);\n\n//# sourceURL=webpack:///./src/ship.js?");

/***/ }),

/***/ "./src/util.js":
/*!*********************!*\
  !*** ./src/util.js ***!
  \*********************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("// function inherits(child, parent) {\n//     Surrogate() {};\n//     Surrogate.prototype = parent.prototype;\n//     child.prototype = new Surrogate(); \n//     child.prototype.constructor = child; \n// }\n\n\nconst Util = {\n  inherits(child, parent) {\n    function Surrogate() { };\n    Surrogate.prototype = parent.prototype;\n    child.prototype = new Surrogate();\n    child.prototype.constructor = child;\n  },\n  randomVec(length) {\n    const deg = 2 * Math.PI * Math.random();\n    return Util.scale([Math.sin(deg), Math.cos(deg)], length);\n  },\n  scale(vec, m) {\n    return [vec[0] * m, vec[1] * m];\n  },\n  straightLineDistance(pos1, pos2) {\n    const [x1, y1] = pos1;\n    const [x2, y2] = pos2;\n    return (Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2));\n  },\n  genID() {\n    // Math.random should be unique because of its seeding algorithm.\n    // Convert it to base 36 (numbers + letters), and grab the first 9 characters\n    // after the decimal.\n    return '_' + Math.random().toString(36).substr(2, 9);\n  }\n}\n\nmodule.exports = Util; \n\n//# sourceURL=webpack:///./src/util.js?");

/***/ })

/******/ });
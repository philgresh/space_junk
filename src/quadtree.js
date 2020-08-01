const QT_NODE_CAPACITY = 4;
const OVERLAP = 0.1;
const TOP_LEFT = 0;
const TOP_RIGHT = 1;
const BOTTOM_LEFT = 2;
const BOTTOM_RIGHT = 3;

/**
  * QuadTree data structure.
  * @class QuadTree
  * @constructor
  * @param {Object} An object representing the bounds of the top level of the QuadTree. The object
  * should contain the following properties : x, y, width, height
  * @param {Boolean} pointQuad Whether the QuadTree will contain points (true), or items with bounds
  * (width / height)(false). Default value is false.
  * @param {Number} maxDepth The maximum number of levels that the quadtree will create. Default is 4.
  * @param {Number} maxChildren The maximum number of children that a node can contain before it is split into sub-nodes.
  * @link "https://github.com/mikechambers/ExamplesByMesh/blob/master/JavaScript/QuadTree/src/QuadTree.js"
  */

class QuadTree {
  constructor(bounds, pointQuad, maxDepth, maxChildren) {
    let node = new Node(bounds, 0, maxDepth, maxChildren);

    /**
    * The root node of the QuadTree which covers the entire area being segmented.
    * @property root
    * @type Node
    **/
    this.root = node;
  }

  /**
    * Inserts an item into the QuadTree.
    * @method insert
    * @param {Object|Array} item The item or Array of items to be inserted into the QuadTree. The item should expose x, y
    * properties that represents its position in 2D space.
    **/
  insert(item) {
    if (item instanceof Array) {
      item.forEach(i => this.root.insert(item[i]))
    } else {
      this.root.insert(item);
    }
  }

  /**
    * Clears all nodes and children from the QuadTree
    * @method clear
    **/
  clear() {
    this.root.clear();
  }

  /**
    * Retrieves all items / points in the same node as the specified item / point. If the specified item
    * overlaps the bounds of a node, then all children in both nodes will be returned.
    * @method retrieve
    * @param {Object} item An object representing a 2D coordinate point (with x, y properties), or a shape
    * with dimensions (x, y, width, height) properties.
    **/
  retrieve(item) {
    return this.root.retrieve(item).slice();
  };


}


/************** Node ********************/

class Node {
  constructor(bounds, depth, maxDepth, maxChildren) {
    this._bounds = bounds;
    this.children = [];
    this.nodes = [];
    this._depth = 0;
    this._maxChildren = 4;
    this._maxDepth = 4;

    if (maxChildren) {
      this._maxChildren = maxChildren;
    }

    if (maxDepth) {
      this._maxDepth = maxDepth;
    }

    if (depth) {
      this._depth = depth;
    }
  }

  
}






Node.prototype.insert = function (item) {
  if (this.nodes.length) {
    var index = this._findIndex(item);

    this.nodes[index].insert(item);

    return;
  }

  this.children.push(item);

  var len = this.children.length;
  if (!(this._depth >= this._maxDepth) &&
    len > this._maxChildren) {

    this.subdivide();

    var i;
    for (i = 0; i < len; i++) {
      this.insert(this.children[i]);
    }

    this.children.length = 0;
  }
};

Node.prototype.retrieve = function (item) {
  if (this.nodes.length) {
    var index = this._findIndex(item);

    return this.nodes[index].retrieve(item);
  }

  return this.children;
};

Node.prototype._findIndex = function (item) {
  var b = this._bounds;
  var left = (item.x > b.x + b.width / 2) ? false : true;
  var top = (item.y > b.y + b.height / 2) ? false : true;

  //top left
  var index = Node.TOP_LEFT;
  if (left) {
    //left side
    if (!top) {
      //bottom left
      index = Node.BOTTOM_LEFT;
    }
  } else {
    //right side
    if (top) {
      //top right
      index = Node.TOP_RIGHT;
    } else {
      //bottom right
      index = Node.BOTTOM_RIGHT;
    }
  }

  return index;
};


Node.prototype.subdivide = function () {
  var depth = this._depth + 1;

  var bx = this._bounds.x;
  var by = this._bounds.y;

  //floor the values
  var b_w_h = (this._bounds.width / 2); //todo: Math.floor?
  var b_h_h = (this._bounds.height / 2);
  var bx_b_w_h = bx + b_w_h;
  var by_b_h_h = by + b_h_h;

  //top left
  this.nodes[Node.TOP_LEFT] = new this._classConstructor({
    x: bx,
    y: by,
    width: b_w_h,
    height: b_h_h
  },
    depth, this._maxDepth, this._maxChildren);

  //top right
  this.nodes[Node.TOP_RIGHT] = new this._classConstructor({
    x: bx_b_w_h,
    y: by,
    width: b_w_h,
    height: b_h_h
  },
    depth, this._maxDepth, this._maxChildren);

  //bottom left
  this.nodes[Node.BOTTOM_LEFT] = new this._classConstructor({
    x: bx,
    y: by_b_h_h,
    width: b_w_h,
    height: b_h_h
  },
    depth, this._maxDepth, this._maxChildren);


  //bottom right
  this.nodes[Node.BOTTOM_RIGHT] = new this._classConstructor({
    x: bx_b_w_h,
    y: by_b_h_h,
    width: b_w_h,
    height: b_h_h
  },
    depth, this._maxDepth, this._maxChildren);
};

Node.prototype.clear = function () {
  this.children.length = 0;

  var len = this.nodes.length;

  var i;
  for (i = 0; i < len; i++) {
    this.nodes[i].clear();
  }

  this.nodes.length = 0;
};



    // this.boundary = {
    //   minX: 0 - (OVERLAP * DIM_X),
    //   minY: 0 - (OVERLAP * DIM_Y),
    //   maxX: DIM_X / 2,
    //   maxY: DIM_Y / 2,
    // }

export default class JSONDigger {
  constructor(idProp, childrenProp) {
    this.id = idProp;
    this.children = childrenProp;
    this.count = 0;
    // this.countNodes(obj);
    this.total = this.count + 0;
  }

  countNodes (obj) {
    var _this = this;
    this.count++;
    if (!obj || !Object.keys(obj).length) {
      return false;
    } else {
      if (obj[_this.children]) {
        obj[_this.children].forEach(child => {
          _this.countNodes(child);
        });
      }
    }
  }

  generateClone (obj) {
    var target = {};
    for (var i in obj) {
      if (i !== this.children) {
        target[i] = obj[i];
      }
    }
    return target;
   }

  findNodeById (obj, id) {
    const _this = this;
    this.countNodes(obj);
    return new Promise((resolve, reject) => {
      if (!obj || !Object.keys(obj).length) {
        reject(new Error('target object is invalid'));
      } else if (!id) {
        reject(new Error('target id is invalid'));
      }
      function findNodeById (obj, id, callback) {
        if (obj[_this.id] === id) {
          _this.count = _this.total + 0;
          callback(null, obj);
        } else {
          if (_this.count === 1) {
            _this.count = _this.total + 0;
            callback('the node does not exist', null);
          }
          _this.count--;
          if (obj[_this.children]) {
            obj[_this.children].forEach(node => {
              findNodeById(node, id, callback);
            });
          }
        }
      }
      findNodeById(obj, id, (errorMessage, node) => {
        if (errorMessage) {
          reject(new Error(errorMessage));
        } else {
          resolve(node);
        }
      });
    });
  }

  matchConditions (obj, conditions) {
    var flag = true;
    Object.keys(conditions).forEach(function(item) {
      if (typeof conditions[item] === 'string' || typeof conditions[item] === 'number') {
        if (obj[item] !== conditions[item]) {
          flag = false;
          return false;
        }
      } else if (conditions[item] instanceof RegExp) {
        if (!conditions[item].test(obj[item])) {
          flag = false;
          return false;
        }
      } else if (typeof conditions[item] === 'object') {
        Object.keys(conditions[item]).forEach(function(subitem) {
          switch (subitem) {
            case '>': {
              if (!(obj[item] > conditions[item][subitem])) {
                flag = false;
                return false;
              }
              break;
            }
            case '<': {
              if (!(obj[item] < conditions[item][subitem])) {
                flag = false;
                return false;
              }
              break;
            }
            case '>=': {
              if (!(obj[item] >= conditions[item][subitem])) {
                flag = false;
                return false;
              }
              break;
            }
            case '<=': {
              if (!(obj[item] <= conditions[item][subitem])) {
                flag = false;
                return false;
              }
              break;
            }
            case '!==': {
              if (!(obj[item] !== conditions[item][subitem])) {
                flag = false;
                return false;
              }
              break;
            }
          }
        });
        if (!flag) {
          return false;
        }
      }
    });
    if (!flag) {
      return false;
    }
    return true;
  }

  findNodes (obj, conditions, callback) {
    var that = this;
    var copy = []; // ths shallow copy of nodes array
    return function(obj, conditions, callback) {
      if (that.matchConditions(obj, conditions)) {
        nodes.push(obj);
        if (that.count === 1) {
          that.count = that.total + 0;
          copy = nodes.slice(0);
          nodes = [];
          callback(null, copy);
        }
        that.count--;
      } else {
        if (that.count === 1) {
          that.count = that.total + 0;
          copy = nodes.slice(0);
          nodes = [];
          callback(null, copy);
        }
        that.count--;
        if (obj[that.children]) {
          obj[that.children].forEach(function(child) {
            that.findNodes(child, conditions, callback);
          });
        }
      }
    }(obj, conditions, callback);
  }

  findParent (obj, node, callback, needCleanNode)  {
    var that = this;
    if (this.count === 1) {
      this.count = this.total + 0;
      callback('its parent node does not exist', null);
    } else {
      this.count--;
      if (typeof obj[this.children] !== 'undefined') {
        var notFind = true;
        obj[this.children].forEach(function(item) {
          if (item[that.id] === node[that.id]) {
            that.count = that.total + 0;
            if (needCleanNode) {
              callback(null, that.generateClone(obj));
            } else {
              callback(null, obj);
            }
            notFind = false;
            return false;
          }
        });
        if (notFind) {
          obj[this.children].forEach(function(item) {
            that.findParent(item, node, callback);
          });
        }
      }
    }
  }

  findSiblings (obj, node, callback) {
    var that = this;
    this.findParent(obj, node, function(err, parent) {
      if (err) {
        callback('its sibling nodes do not exist', null);
      } else {
        var siblings = [];
        parent[that.children].forEach(function(item) {
          if (item[that.id] !== node[that.id]) {
            siblings.push(that.generateClone(item));
          }
        });
        callback(null, siblings);
      }
    }, false);
  }

  findAncestors (obj, node, callback) {
    var that = this;
    if (node[this.id] === obj[this.id]) {
      var copy = nodes.slice(0);
      nodes = [];
      callback(null, copy);
    } else {
      this.findParent(obj, node, function(err, parent) {
      if (err) {
        callback('its ancestor nodes do not exist', null);
      } else {
        nodes.push(parent);
        that.findAncestors(obj, parent, callback);
      }
    });
    }
  }

};
const { node } = require("webpack");

class JSONDigger {
  constructor(datasource, idProp, childrenProp) {
    this.ds = datasource;
    this.id = idProp;
    this.children = childrenProp;
    this.count = 0;
  }

  countNodes (obj) {
    var _this = this;
    this.count++;
    if (!obj || !Object.keys(obj).length) {
      return false;
    } else {
      if (obj[this.children]) {
        obj[this.children].forEach(child => {
          _this.countNodes(child);
        });
      }
    }
  }

  /*
  * This method returns the first node in the JSON object that satisfies the provided id. 
  * If no node satisfies the provide id, null is returned.
  */
  findNodeById (id) {
    const _this = this;

    if (!id) {
      return null;
    }

    if (this.ds[_this.id] === id) {
      return this.ds;
    }

    function findNodeById (nodes, id) {
      for (const node of nodes) {
        if (node[_this.id] === id) {
          return node;
        } 
        if (node[_this.children]) {
          const foundNode = findNodeById(node[_this.children], id);
          if (foundNode) {
            return foundNode;
          }
        }
      }
      return null;
    }

    return findNodeById(this.ds[this.children], id);
  }

  matchConditions (obj, conditions) {
    var flag = true;
    Object.keys(conditions).some(item => {
      if (typeof conditions[item] === 'string' || typeof conditions[item] === 'number' || typeof conditions[item] === 'boolean') {
        if (obj[item] !== conditions[item]) {
          flag = false;
          return true;
        }
      } else if (conditions[item] instanceof RegExp) {
        if (!conditions[item].test(obj[item])) {
          flag = false;
          return true;
        }
      } else if (typeof conditions[item] === 'object') {
        Object.keys(conditions[item]).some(subitem => {
          switch (subitem) {
            case '>': {
              if (!(obj[item] > conditions[item][subitem])) {
                flag = false;
                return true;
              }
              break;
            }
            case '<': {
              if (!(obj[item] < conditions[item][subitem])) {
                flag = false;
                return true;
              }
              break;
            }
            case '>=': {
              if (!(obj[item] >= conditions[item][subitem])) {
                flag = false;
                return true;
              }
              break;
            }
            case '<=': {
              if (!(obj[item] <= conditions[item][subitem])) {
                flag = false;
                return true;
              }
              break;
            }
            case '!==': {
              if (!(obj[item] !== conditions[item][subitem])) {
                flag = false;
                return true;
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

    return flag;
  }

  /*
  * This method returns the first node in the JSON object that satisfies the conditions. 
  * If no node satisfies the conditionas, null is returned.
  */
  findOneNode (conditions) {
    const _this = this;

    if (!conditions || !Object.keys(conditions).length) {
      return null;
    }

    if (this.matchConditions(this.ds, conditions)) {
      return this.ds;
    }

    function findOneNode (nodes, conditions) {
      for (const node of nodes) {
        if (_this.matchConditions(node, conditions)) {
          return node;
        } 
        if (node[_this.children]) {
          const foundNode = findOneNode(node[_this.children], conditions);
          if (foundNode !== null) {
            return foundNode;
          }
        }
      }
      return null;
    }

    return findOneNode(this.ds[this.children], conditions);
  }

  findNodes (conditions) {
    const _this = this;

    if (!conditions || !Object.keys(conditions).length) {
      return [];
    }

    let nodes = [];

    function findNodes(obj) {
      if (_this.matchConditions(obj, conditions)) {
        nodes.push(obj);
      }
      if (obj[_this.children]) {
        for (const node of obj[_this.children]) {
          findNodes(node);
        }
      }
    }

    findNodes(this.ds);

    return nodes;
  }

  findParent (id) {
    const _this = this;

    if (!id) {
      return null;
    }

    if (this.ds[_this.children].some(node => node[_this.id] === id)) {
      return this.ds;
    }

    function findParent (nodes, id) {
      for (const node of nodes) {
        if (node[_this.children] && node[_this.children].some(node => node[_this.id] === id)) {
          return node;
        } 
        if (node[_this.children]) {
          const foundNode = findParent(node[_this.children], id);
          if (foundNode) {
            return foundNode;
          }
        }
      }
      return null;
    }

    return findParent(this.ds[this.children], id);
  }

  findSiblings (id) {
    const _this = this;
    if (!id || this.ds[this.id] === id) {
      return [];
    }

    const parent = this.findParent(id);
    return parent[_this.children].filter(node => node[_this.id] !== id);
  }

  findAncestors (id) {
    const _this = this;

    if (!id || id === _this.ds[_this.id]) {
      return [];
    }

    const nodes = [];
    function findAncestors (id) {
      const parent = _this.findParent(id);
      if (parent) {
        nodes.push(parent);
        return findAncestors(parent[_this.id]);
      } else {
        return nodes.slice(0);
      }
    }

    return findAncestors(id);   
  }

  // validate the input parameters id and data(could be oject or array)
  validateParams(id, data) {
    if (!id
      || !data
      || (data.constructor !== Object && data.constructor !== Array)
      || (data.constructor === Object && !Object.keys(data).length)
      || (data.constructor === Array && !data.length)
      || (data.constructor === Array
        && data.length 
        && !data.every(item => item && item.constructor === Object && Object.keys(item).length))){
      return false;
    }
    return true;
  }

  addChildren (id, data) {
    if (!this.validateParams(id, data)) {
      return false;
    }

    const parent = this.findNodeById(id);
    if (!parent) {
      return false;
    }

    if (data.constructor === Object) {
      if (parent[this.children]) {
        parent[this.children].push(data);
      } else {
        parent[this.children] = [data];
      }
    } else {
      if (parent[this.children]) {
        parent[this.children].push(...data);
      } else {
        parent[this.children] = data;
      }
    }
    return true;
  }

  addSiblings (id, data) {
    if (!this.validateParams(id, data)) {
      return false;
    }

    const parent = this.findParent(id);
    if (!parent) {
      return false;
    }

    if (data.constructor === Object) {
      parent[this.children].push(data);
    } else {
      parent[this.children].push(...data);
    }
    return true;
  }

  addRoot (data) {
    const _this = this;
    if (!data || data.constructor !== Object || (data.constructor === Object && !Object.keys(data).length)) {
      return false;
    }
    
    this.ds[this.children] = [Object.assign({}, this.ds)];
    delete data[this.children];
    Object.keys(this.ds).filter(prop => prop !== this.children).forEach(prop => {
      if (!data[prop]) {
        delete this.ds[prop];
      }
    });
    Object.assign(this.ds, data);
    return true;
  }

  updateNode (data) {
    if (!data
      || data.constructor !== Object
      || (data.constructor === Object && !Object.keys(data).length)
      || (data.constructor === Object && Object.keys(data).length && !data[this.id])) {
      return false;
    }
    
    const node = this.findNodeById(data[this.id]);
    Object.assign(node, data);
    return true;
  }

  updateNodes (ids, data) {
    if (!ids
      || (ids.constructor === Array && !ids.length)
      || !data
      || data.constructor !== Object
      || (data.constructor === Object && !Object.keys(data).length)) {
      return false;
    }

    for (const id of ids) {
      data[this.id] = id; 
      if (!this.updateNode(data)) {
        return false;
      }
    }
    return true;
  }

  // remove single node based on id
  removeNode (id) {
    const _this = this;
    if (id === this.ds[this.id]) {
      return false;
    }

    const parent = this.findParent(id);
    if (!parent) {
      return false;
    }
    const index = parent[this.children].map(node => node[_this.id]).indexOf(id);
    parent[this.children].splice(index, 1);
    return true;
  }

  // param could be single id, id array or conditions object
  removeNodes (param) {
    const _this = this;
    if (!param
      || (param.constructor === Array && !param.length)
      || (param.constructor === Object && !Object.keys(param).length)) {
      return false;
    }

    // if passing in single id
    if (param.constructor === String || param.constructor === Number) {
      return this.removeNode(param);
    } else if (param.constructor === Array) { // if passing in id array
      for (const p of param) {
        if(!this.removeNode(p)) {
          return false;
        }
      }
      return true;
    } else { // if passing in conditions object
      const nodes = this.findNodes(param);
      if (!nodes.length) {
        return false;
      }
      const ids = nodes.map(node => node[_this.id]);
      for (const p of ids) {
        if (!this.removeNode(p)) {
          return false;
        }
      }
      return true;
    }
  }

};

module.exports = JSONDigger;
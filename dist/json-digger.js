/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["JsonDigger"] = factory();
	else
		root["JsonDigger"] = factory();
})(this, () => {
return /******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* binding */ JSONDigger)\n/* harmony export */ });\nclass JSONDigger {\n  constructor(datasource, idProp, childrenProp) {\n    this.ds = datasource;\n    this.id = idProp;\n    this.children = childrenProp;\n    this.count = 0;\n  }\n  countNodes(obj) {\n    var _this = this;\n    this.count++;\n    if (!obj || !Object.keys(obj).length) {\n      return false;\n    } else {\n      if (obj[this.children]) {\n        obj[this.children].forEach(child => {\n          _this.countNodes(child);\n        });\n      }\n    }\n  }\n  findNodeById(id) {\n    const _this = this;\n    this.countNodes(this.ds);\n    return new Promise((resolve, reject) => {\n      if (!id) {\n        return reject(new Error('Parameter id is invalid.'));\n      }\n      function findNodeById(obj, id, callback) {\n        if (!_this.count) {\n          return;\n        }\n        if (obj[_this.id] === id) {\n          _this.count = 0;\n          callback(null, obj);\n        } else {\n          if (_this.count === 1) {\n            _this.count = 0;\n            callback('The node doesn\\'t exist.', null);\n          }\n          _this.count--;\n          if (obj[_this.children]) {\n            obj[_this.children].forEach(node => {\n              findNodeById(node, id, callback);\n            });\n          }\n        }\n      }\n      findNodeById(this.ds, id, (msg, node) => {\n        if (msg) {\n          reject(new Error(msg));\n        } else {\n          resolve(node);\n        }\n      });\n    });\n  }\n  matchConditions(obj, conditions) {\n    var flag = true;\n    Object.keys(conditions).some(item => {\n      if (typeof conditions[item] === 'string' || typeof conditions[item] === 'number' || typeof conditions[item] === 'boolean') {\n        if (obj[item] !== conditions[item]) {\n          flag = false;\n          return true;\n        }\n      } else if (conditions[item] instanceof RegExp) {\n        if (!conditions[item].test(obj[item])) {\n          flag = false;\n          return true;\n        }\n      } else if (typeof conditions[item] === 'object') {\n        Object.keys(conditions[item]).some(subitem => {\n          switch (subitem) {\n            case '>':\n              {\n                if (!(obj[item] > conditions[item][subitem])) {\n                  flag = false;\n                  return true;\n                }\n                break;\n              }\n            case '<':\n              {\n                if (!(obj[item] < conditions[item][subitem])) {\n                  flag = false;\n                  return true;\n                }\n                break;\n              }\n            case '>=':\n              {\n                if (!(obj[item] >= conditions[item][subitem])) {\n                  flag = false;\n                  return true;\n                }\n                break;\n              }\n            case '<=':\n              {\n                if (!(obj[item] <= conditions[item][subitem])) {\n                  flag = false;\n                  return true;\n                }\n                break;\n              }\n            case '!==':\n              {\n                if (!(obj[item] !== conditions[item][subitem])) {\n                  flag = false;\n                  return true;\n                }\n                break;\n              }\n          }\n        });\n        if (!flag) {\n          return false;\n        }\n      }\n    });\n    return flag;\n  }\n  async findChildren(id) {\n    const _this = this;\n    if (!id) {\n      throw new Error('Parameter id is invalid.');\n    }\n    try {\n      const parent = await this.findParent(id);\n      return parent[this.children];\n    } catch (err) {\n      throw new Error('The child nodes don\\'t exist.');\n    }\n  }\n  findNodes(conditions) {\n    const _this = this;\n    this.countNodes(this.ds);\n    return new Promise(async (resolve, reject) => {\n      if (!conditions || !Object.keys(conditions).length) {\n        return reject(new Error('Parameter conditions are invalid.'));\n      }\n      let nodes = [];\n      function findNodes(obj, conditions, callback) {\n        if (!_this.count) {\n          return;\n        }\n        if (_this.matchConditions(obj, conditions)) {\n          nodes.push(obj);\n          if (_this.count === 1) {\n            _this.count = 0;\n            callback(!nodes.length ? 'The nodes don\\'t exist.' : null, nodes.slice(0));\n          }\n        } else {\n          if (_this.count === 1) {\n            _this.count = 0;\n            callback(!nodes.length ? 'The nodes don\\'t exist.' : null, nodes.slice(0));\n          }\n        }\n        _this.count--;\n        if (obj[_this.children]) {\n          obj[_this.children].forEach(child => {\n            findNodes(child, conditions, callback);\n          });\n        }\n      }\n      findNodes(this.ds, conditions, (msg, nodes) => {\n        if (msg) {\n          reject(new Error(msg));\n        } else {\n          resolve(nodes);\n        }\n      });\n    });\n  }\n  findParent(id) {\n    const _this = this;\n    this.countNodes(this.ds);\n    return new Promise((resolve, reject) => {\n      if (!id) {\n        return reject(new Error('Parameter id is invalid.'));\n      }\n      function findParent(obj, id, callback) {\n        if (_this.count === 1) {\n          _this.count = 0;\n          callback('The parent node doesn\\'t exist.', null);\n        } else {\n          _this.count--;\n          if (typeof obj[_this.children] !== 'undefined') {\n            obj[_this.children].forEach(function (child) {\n              if (child[_this.id] === id) {\n                _this.count = 0;\n                callback(null, obj);\n              }\n            });\n            obj[_this.children].forEach(function (child) {\n              findParent(child, id, callback);\n            });\n          }\n        }\n      }\n      findParent(this.ds, id, (msg, parent) => {\n        if (msg) {\n          reject(new Error(msg));\n        } else {\n          resolve(parent);\n        }\n      });\n    });\n  }\n  async findSiblings(id) {\n    const _this = this;\n    if (!id) {\n      throw new Error('Parameter id is invalid.');\n    }\n    try {\n      const parent = await this.findParent(id);\n      return parent[this.children].filter(child => {\n        return child[_this.id] !== id;\n      });\n    } catch (err) {\n      throw new Error('The sibling nodes don\\'t exist.');\n    }\n  }\n  findAncestors(id) {\n    const _this = this;\n    return new Promise(async (resolve, reject) => {\n      if (!id) {\n        return reject(new Error('Parameter id is invalid.'));\n      }\n      let nodes = [];\n      async function findAncestors(id) {\n        try {\n          if (id === _this.ds[_this.id]) {\n            if (!nodes.length) {\n              throw new Error('The ancestor nodes don\\'t exist.');\n            }\n            return nodes.slice(0);\n          } else {\n            const parent = await _this.findParent(id);\n            nodes.push(parent);\n            return findAncestors(parent[_this.id]);\n          }\n        } catch (err) {\n          throw new Error('The ancestor nodes don\\'t exist.');\n        }\n      }\n      try {\n        const ancestors = await findAncestors(id);\n        resolve(ancestors);\n      } catch (err) {\n        reject(err);\n      }\n    });\n  }\n\n  // validate the input parameters id and data(could be oject or array)\n  validateParams(id, data) {\n    if (!id) {\n      throw new Error('Parameter id is invalid.');\n    }\n    if (!data || data.constructor !== Object && data.constructor !== Array || data.constructor === Object && !Object.keys(data).length || data.constructor === Array && !data.length || data.constructor === Array && data.length && !data.every(item => item && item.constructor === Object && Object.keys(item).length)) {\n      throw new Error('Parameter data is invalid.');\n    }\n  }\n  async addChildren(id, data) {\n    this.validateParams(id, data);\n    try {\n      const parent = await this.findNodeById(id);\n      if (data.constructor === Object) {\n        if (parent[this.children]) {\n          parent[this.children].push(data);\n        } else {\n          parent[this.children] = [data];\n        }\n      } else {\n        if (parent[this.children]) {\n          parent[this.children].push(...data);\n        } else {\n          parent[this.children] = data;\n        }\n      }\n    } catch (err) {\n      throw new Error('Failed to add child nodes.');\n    }\n  }\n  async addSiblings(id, data) {\n    this.validateParams(id, data);\n    try {\n      const parent = await this.findParent(id);\n      if (data.constructor === Object) {\n        parent[this.children].push(data);\n      } else {\n        parent[this.children].push(...data);\n      }\n    } catch (err) {\n      throw new Error('Failed to add sibling nodes.');\n    }\n  }\n  addRoot(data) {\n    const _this = this;\n    if (!data || data.constructor !== Object || data.constructor === Object && !Object.keys(data).length) {\n      throw new Error('Parameter data is invalid.');\n    }\n    try {\n      this.ds[this.children] = [Object.assign({}, this.ds)];\n      delete data[this.children];\n      Object.keys(this.ds).filter(prop => prop !== this.children).forEach(prop => {\n        if (!data[prop]) {\n          delete this.ds[prop];\n        }\n      });\n      Object.assign(this.ds, data);\n    } catch (err) {\n      throw new Error('Failed to add root node.');\n    }\n  }\n  async updateNode(data) {\n    if (!data || data.constructor !== Object || data.constructor === Object && !Object.keys(data).length || data.constructor === Object && Object.keys(data).length && !data[this.id]) {\n      throw new Error('Parameter data is invalid.');\n    }\n    try {\n      const node = await this.findNodeById(data[this.id]);\n      Object.assign(node, data);\n    } catch (err) {\n      throw new Error('Failed to update node.');\n    }\n  }\n  async updateNodes(ids, data) {\n    const _this = this;\n    if (!ids || ids.constructor === Array && !ids.length || !data) {\n      throw new Error('Input parameter is invalid.');\n    }\n    try {\n      for (const id of ids) {\n        data[_this.id] = id;\n        await this.updateNode(data);\n      }\n    } catch (err) {\n      throw err;\n    }\n  }\n\n  // remove single node based on id\n  async removeNode(id) {\n    const _this = this;\n    if (id === this.ds[this.id]) {\n      throw new Error('Input parameter is invalid.');\n    }\n    const parent = await this.findParent(id);\n    const index = parent[this.children].map(node => node[_this.id]).indexOf(id);\n    parent[this.children].splice(index, 1);\n    this.count = 0;\n  }\n\n  // param could be single id, id array or conditions object\n  async removeNodes(param) {\n    const _this = this;\n    if (!param || param.constructor === Array && !param.length || param.constructor === Object && !Object.keys(param).length) {\n      throw new Error('Input parameter is invalid.');\n    }\n    try {\n      // if passing in single id\n      if (param.constructor === String || param.constructor === Number) {\n        await this.removeNode(param);\n      } else if (param.constructor === Array) {\n        // if passing in id array\n        for (const p of param) {\n          await this.removeNode(p);\n        }\n      } else {\n        // if passing in conditions object\n        const nodes = await this.findNodes(param);\n        const ids = nodes.map(node => node[_this.id]);\n        for (const p of ids) {\n          await this.removeNode(p);\n        }\n      }\n    } catch (err) {\n      throw new Error('Failed to remove nodes.');\n    }\n  }\n}\n;\n\n//# sourceURL=webpack://JsonDigger/./src/index.js?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The require scope
/******/ 	var __webpack_require__ = {};
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = {};
/******/ 	__webpack_modules__["./src/index.js"](0, __webpack_exports__, __webpack_require__);
/******/ 	
/******/ 	return __webpack_exports__;
/******/ })()
;
});
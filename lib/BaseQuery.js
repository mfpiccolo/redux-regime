"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.QueryObject = undefined;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _pluralize = require("pluralize");

var _pluralize2 = _interopRequireDefault(_pluralize);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var BaseQuery = function () {
  function BaseQuery() {
    _classCallCheck(this, BaseQuery);
  }

  _createClass(BaseQuery, null, [{
    key: "query",
    value: function query(resources) {
      return new QueryObject((0, _pluralize2.default)(this.name.toLowerCase()), resources);
    }
  }]);

  return BaseQuery;
}();

exports.default = BaseQuery;

var QueryObject = exports.QueryObject = function () {
  function QueryObject(resourceName, resources) {
    _classCallCheck(this, QueryObject);

    this.resourceName = resourceName;
    this.resources = resources;
    this.currentIncludes = [];
    this.currentResources = {};
  }

  _createClass(QueryObject, [{
    key: "all",
    value: function all() {
      this._setCurrentResources();
      return this;
    }
  }, {
    key: "find",
    value: function find(id) {
      var resource = this.resources[this.resourceName] && this.resources[this.resourceName][id];
      if (resource) {
        this.currentResources = _defineProperty({}, id, resource);
      }
      return this;
    }
  }, {
    key: "where",
    value: function where(params) {
      this._setCurrentResources();
      this._filterAndSetCurrentResourcesByParams(params);
      return this;
    }
  }, {
    key: "whereRelated",
    value: function whereRelated(relationship, params) {
      this._setCurrentResources();
      var resourceName = this.resourceName;


      this.currentResources = relationship.query(this.resources).where(params).includes([resourceName]).execute().reduce(function (newResource, relatedResource) {
        var relation = relatedResource[resourceName];
        relation.forEach(function (_ref) {
          var type = _ref.type,
              id = _ref.id,
              attributes = _objectWithoutProperties(_ref, ["type", "id"]);

          newResource[id] = { type: type, id: id, attributes: attributes };
        });
        return newResource;
      }, {});
      return this;
    }
  }, {
    key: "includes",
    value: function includes(relationshipTypes) {
      this._setCurrentResources();
      this.currentIncludes = relationshipTypes;
      return this;
    }
  }, {
    key: "execute",
    value: function execute() {
      var _this = this;

      var currentIncludes = this.currentIncludes,
          currentResources = this.currentResources,
          _flattenRelationships = this._flattenRelationships;

      return Object.values(currentResources).map(function (_ref2) {
        var id = _ref2.id,
            attributes = _ref2.attributes,
            relationships = _ref2.relationships,
            types = _ref2.types,
            links = _ref2.links;

        var newFormattedResource = _extends({ id: id }, attributes);

        if (!currentIncludes.length) return newFormattedResource;
        return _extends({}, newFormattedResource, _flattenRelationships(relationships).reduce(function (nextRelationshipObjects, _ref3) {
          var id = _ref3.id,
              type = _ref3.type;

          if (!currentIncludes.includes(type)) return nextRelationshipObjects;
          if (!(type in nextRelationshipObjects)) {
            nextRelationshipObjects[type] = [];
          }

          if (!_this.resources[type]) return nextRelationshipObjects;
          var relationData = _this.resources[type][id];
          if (!relationData) return nextRelationshipObjects;
          nextRelationshipObjects[type].push(_extends({
            type: type,
            id: id
          }, relationData.attributes));

          return nextRelationshipObjects;
        }, {}));
      });
    }

    // Private

  }, {
    key: "_flattenRelationships",
    value: function _flattenRelationships(relationships) {
      // {tasks: {data:[]}}
      return Object.values(relationships).reduce(function (nextRelationships, _ref4) {
        var data = _ref4.data;

        return [].concat(_toConsumableArray(nextRelationships), _toConsumableArray(data));
      }, []);
    }
  }, {
    key: "_setCurrentResources",
    value: function _setCurrentResources() {
      if (this._isEmpty(this.currentResources)) {
        this.currentResources = this.resources[this.resourceName];
      }
    }
  }, {
    key: "_filterAndSetCurrentResourcesByParams",
    value: function _filterAndSetCurrentResourcesByParams(params) {
      var _this2 = this;

      var resourcesByID = Object.entries(this.currentResources).reduce(function (newResource, _ref5) {
        var _ref6 = _slicedToArray(_ref5, 2),
            id = _ref6[0],
            resource = _ref6[1];

        _this2._filterResourceByParams(params, newResource, resource, id);
        return newResource;
      }, {});
      this.currentResources = resourcesByID;
    }
  }, {
    key: "_filterResourceByParams",
    value: function _filterResourceByParams(params, newResource, resource, id) {
      Object.entries(params).forEach(function (_ref7) {
        var _ref8 = _slicedToArray(_ref7, 2),
            key = _ref8[0],
            value = _ref8[1];

        if (resource.attributes[key] === value) {
          newResource[id] = resource;
        }
      });
    }
  }, {
    key: "_isEmpty",
    value: function _isEmpty(obj) {
      if (obj === null || obj === undefined || Array.isArray(obj) || (typeof obj === "undefined" ? "undefined" : _typeof(obj)) !== "object") {
        return true;
      }
      return Object.getOwnPropertyNames(obj).length === 0 ? true : false;
    }
  }]);

  return QueryObject;
}();
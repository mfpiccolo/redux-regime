"use strict";

var _BaseQuery2 = require("../BaseQuery");

var _BaseQuery3 = _interopRequireDefault(_BaseQuery2);

var _jsonApiNormalizer = require("json-api-normalizer");

var _jsonApiNormalizer2 = _interopRequireDefault(_jsonApiNormalizer);

var _graphqlNormalizr = require("graphql-normalizr");

var _checklistsAndTasksNormalized = require("../fixtrues/checklistsAndTasksNormalized");

var _checklistsAndTasksNormalized2 = _interopRequireDefault(_checklistsAndTasksNormalized);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Checklist = function (_BaseQuery) {
  _inherits(Checklist, _BaseQuery);

  function Checklist() {
    _classCallCheck(this, Checklist);

    return _possibleConstructorReturn(this, (Checklist.__proto__ || Object.getPrototypeOf(Checklist)).apply(this, arguments));
  }

  return Checklist;
}(_BaseQuery3.default);

Checklist.hasMany = ["tasks"];


describe("BaseQUery", function () {
  test("query returns a QueryObject", function () {
    expect(_BaseQuery3.default.query()).toBeInstanceOf(_BaseQuery2.QueryObject);
  });

  describe("all()", function () {
    test("", function () {
      expect(Checklist.query(_checklistsAndTasksNormalized2.default).all().execute()).toMatchSnapshot();
    });
  });

  describe("find()", function () {
    test("", function () {
      var checklist = Checklist.query(_checklistsAndTasksNormalized2.default).find(1).execute()[0];
      expect(checklist.id).toEqual(1);
      expect(checklist).toMatchSnapshot();
    });
  });

  describe("where()", function () {
    test("", function () {
      var checklist = Checklist.query(_checklistsAndTasksNormalized2.default).where({ name: "Project Audit Rest" }).execute()[0];
      expect(checklist.id).toEqual(2);
      expect(checklist).toMatchSnapshot();
    });
  });

  describe("includes()", function () {
    test("", function () {
      var checklists = Checklist.query(_checklistsAndTasksNormalized2.default).all().includes(["tasks"]).execute();
      expect(checklists).toMatchSnapshot();
    });
  });

  describe("hasMany()", function () {
    test("", function () {
      var checklists = Checklist.query(_checklistsAndTasksNormalized2.default).tasks().all().execute();
      expect(checklists).toMatchSnapshot();
    });
  });
});
import BaseQuery from "../../src/BaseQuery";

export default class Checklist extends BaseQuery {
  static hasMany = ["tasks"];
}

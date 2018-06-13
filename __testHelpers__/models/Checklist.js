import BaseQuery from "../../src/BaseQuery";
import Task from "./Task";

export default class Checklist extends BaseQuery {
  static get belongsTo() {
    return [];
  }

  static get hasMany() {
    return [Task];
  }
}

import BaseQuery from "../../src/BaseQuery";
import Task from "./Task";

export default class Checklist extends BaseQuery {
  static hasMany = [Task];
}

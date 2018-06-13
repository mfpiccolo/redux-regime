import BaseModel from "../../src/BaseModel";
import Task from "./Task";

export default class Checklist extends BaseModel {
  static get belongsTo() {
    return [];
  }

  static get hasMany() {
    return [Task];
  }
}

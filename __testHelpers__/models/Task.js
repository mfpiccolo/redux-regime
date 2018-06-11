import BaseQuery from "../../src/BaseQuery";
import Checklist from "./Checklist";

export default class Task extends BaseQuery {
  static belongsTo = [Checklist];
}

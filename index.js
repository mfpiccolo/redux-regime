import resourceReducer from "./lib/resourceReducer";
import {
  normalizeAndMergePayload,
  dispatchUpdateResourcesByID
} from "./lib/actions";
import BaseQuery from "./lib/BaseQuery";

export {
  normalizeAndMergePayload,
  dispatchUpdateResourcesByID,
  resourceReducer,
  BaseQuery
};

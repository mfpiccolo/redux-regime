import resourceReducer from "./src/resourceReducer";
import {
  normalizeAndMergePayload,
  dispatchUpdateResourcesByID
} from "./src/actions";
import BaseQuery from "./src/BaseQuery";

export {
  normalizeAndMergePayload,
  dispatchUpdateResourcesByID,
  resourceReducer,
  BaseQuery
};

import merge from "deepmerge";

const initialState = {};

export default function resources(state = initialState, action) {
  const { resourceType } = action;
  switch (action.type) {
    case "ADD_OR_REPLACE_RESOURCE_BY_ID":
      const newState = { ...state };
      const { type, spec, id, attributes, links, relationships } = action;

      _initializeResource(newState, resourceType);

      newState[resourceType][id] = {
        resourceType,
        id,
        attributes,
        links,
        relationships
      };

      return newState;
    case "MERGE_RESOURCES":
      const { resourcesById } = action;
      resources = { ...state };
      if (!resources[resourceType]) {
        resources[resourceType] = {};
      }

      return {
        ...state,
        [resourceType]: merge(resources[resourceType], resourcesById)
      };
    default:
      return state;
  }
}

const _initializeResource = (newState, resourceType) => {
  if (resourceType in newState) return;
  newState[resourceType] = {};
};

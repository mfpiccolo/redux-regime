import pluralize from "pluralize";

export default class BaseModel {
  static query(resources) {
    return new QueryObject(
      this,
      pluralize(this.name.toLowerCase()),
      resources,
      this.hasMany,
      this.belongsTo
    );
  }

  constructor(resources, attributes, hasMany = [], belongsTo = []) {
    Object.entries(attributes).forEach(([key, value]) => {
      this[key] = value;
    });
    if (hasMany.forEach) {
      hasMany.forEach(relationship => {
        const relationshipKey = pluralize(relationship.name.toLowerCase());
        if (!this[relationshipKey]) {
          this[relationshipKey] = () => {
            // This code block reduces the resouces to the current resouce and the related resources
            // so that it is already scoped after querying through the api
            // TODO: refactor to _buildRelatedResoureces(this, relation)
            const currentResourceKey = pluralize(
              this.constructor.name.toLowerCase()
            );
            const resourceClass = this.constructor;
            const relationshipClass = relationship;
            const newResources = {
              ...resources,
              [currentResourceKey]: resources[currentResourceKey][this.id],
              [relationshipKey]: relationshipClass
                .query(resources)
                .whereRelated(resourceClass, {
                  id: this.id
                }).currentResources
            };

            return new QueryObject(
              relationship,
              relationshipKey,
              newResources,
              relationship.hasMany,
              relationship.belongsTo
            );
          };
        }
      });
    }

    belongsTo.forEach(relationship => {
      const relationshipKey = relationship.name.toLowerCase();
      this[relationshipKey] = () => {
        // needs to return the related model
      };
    });
  }
}

export class QueryObject {
  constructor(klass, resourceName, resources, hasMany = [], belongsTo = []) {
    this.klass = klass;
    this.resourceName = resourceName;
    this.resources = resources;
    this.currentIncludes = [];
    this.currentResources = {};
    this.hasMany = hasMany;
    this.belongsTo = belongsTo;
    this._setCurrentResources();
  }

  find(id) {
    const {
      resources,
      resourceName,
      klass,
      _convertToModel,
      hasMany,
      belongsTo
    } = this;
    const { attributes } =
      resources[resourceName] && resources[resourceName][id];
    return _convertToModel(
      klass,
      resources,
      { id, ...attributes },
      hasMany,
      belongsTo
    );
  }

  first() {}

  all() {
    return this;
  }

  where(params) {
    this._filterAndSetCurrentResourcesByParams(params);
    return this;
  }

  whereRelated(relationship, params) {
    const { resourceName } = this;

    this.currentResources = relationship
      .query(this.resources)
      .where(params)
      .includes([resourceName])
      .toObjects()
      .reduce((newResource, relatedResource) => {
        const relation = relatedResource[resourceName];
        relation.forEach(({ type, id, ...attributes }) => {
          newResource[id] = { type, id, attributes };
        });
        return newResource;
      }, {});
    return this;
  }

  includes(relationshipTypes) {
    this.currentIncludes = relationshipTypes;
    return this;
  }

  toModels() {
    return this._reduceCurrentResources("models");
  }

  toObjects() {
    return this._reduceCurrentResources("objects");
  }

  _reduceCurrentResources(reducerType) {
    // TODO: needs to be refactored
    const conversion = reducerType === "models"
      ? this._convertToModel
      : this._convertToObject;
    const {
      currentIncludes,
      currentResources,
      resources,
      _flattenRelationships,
      hasMany,
      belongsTo
    } = this;

    return Object.values(
      currentResources
    ).map(({ id, attributes, relationships, types, links }) => {
      const newFormattedResource = conversion(
        this.klass,
        resources,
        {
          id,
          ...attributes
        },
        hasMany,
        belongsTo
      );

      if (!currentIncludes.length) return newFormattedResource;
      return conversion(
        this.klass,
        resources,
        {
          ...newFormattedResource,
          ..._flattenRelationships(
            relationships
          ).reduce((nextRelationshipObjects, { id, type }) => {
            if (!currentIncludes.includes(type)) return nextRelationshipObjects;
            if (!(type in nextRelationshipObjects)) {
              nextRelationshipObjects[type] = [];
            }

            if (!resources[type]) return nextRelationshipObjects;
            const relationData = resources[type][id];
            if (!relationData) return nextRelationshipObjects;
            const relationClass = this.hasMany.find(klass => {
              return pluralize(klass.name.toLowerCase()) === type;
            });

            nextRelationshipObjects[type].push(
              conversion(relationClass, resources, {
                id,
                ...relationData.attributes
              })
            );

            return nextRelationshipObjects;
          }, {})
        },
        hasMany,
        belongsTo
      );
    });
  }

  _convertToModel(klass, resources, resource, hasMany, belongsTo) {
    return new klass(resources, resource, hasMany, belongsTo);
  }

  _convertToObject(klass, resources, resource, hasMany, belongsTo) {
    return resource;
  }

  // Private

  _flattenRelationships(relationships) {
    return Object.values(
      relationships
    ).reduce((nextRelationships, { data }) => {
      return [...nextRelationships, ...data];
    }, []);
  }

  _setCurrentResources() {
    if (this._isEmpty(this.currentResources)) {
      this.currentResources = this.resources[this.resourceName];
    }
  }

  _filterAndSetCurrentResourcesByParams(params) {
    const resourcesByID = Object.entries(
      this.currentResources
    ).reduce((newResource, [id, resource]) => {
      this._filterResourceByParams(params, newResource, resource, id);
      return newResource;
    }, {});
    this.currentResources = resourcesByID;
  }

  _filterResourceByParams(params, newResource, resource, id) {
    Object.entries(params).forEach(([key, value]) => {
      if (key === "id" && resource.id === value) {
        newResource[id] = resource;
      } else if (resource.attributes[key] === value) {
        newResource[id] = resource;
      }
    });
  }

  _isEmpty(obj) {
    if (
      obj === null ||
      obj === undefined ||
      Array.isArray(obj) ||
      typeof obj !== "object"
    ) {
      return true;
    }
    return Object.getOwnPropertyNames(obj).length === 0 ? true : false;
  }
}

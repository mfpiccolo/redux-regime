import pluralize from "pluralize";

export default class BaseQuery {
  static query(resources) {
    return new QueryObject(
      this,
      pluralize(this.name.toLowerCase()),
      resources,
      this.hasMany,
      this.belongsTo
    );
  }

  constructor(attributes, hasMany = [], belongsTo = []) {
    Object.entries(attributes).forEach(([key, value]) => {
      this[key] = value;
    });
    // hasMany.forEach(relationship => {
    //   this[relationship] = () => {
    //     //needs to return a QueryObject for that relationship with the query for where(id: id)
    //   };
    // });

    belongsTo.forEach(relationship => {
      this[relationship] = () => {
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
  }

  all() {
    this._setCurrentResources();
    return this;
  }

  find(id) {
    const { attributes } =
      this.resources[this.resourceName] &&
      this.resources[this.resourceName][id];
    return this._convertToModel({ id, ...attributes });
  }

  where(params) {
    this._setCurrentResources();
    this._filterAndSetCurrentResourcesByParams(params);
    return this;
  }

  whereRelated(relationship, params) {
    this._setCurrentResources();
    const { resourceName } = this;

    this.currentResources = relationship
      .query(this.resources)
      .where(params)
      .includes([resourceName])
      .getData()
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
    this._setCurrentResources();
    this.currentIncludes = relationshipTypes;
    return this;
  }

  models() {
    return this._reduceCurrentResources();
  }

  _reduceCurrentResources() {
    const {
      currentIncludes,
      currentResources,
      resources,
      _flattenRelationships
    } = this;

    return Object.values(
      currentResources
    ).map(({ id, attributes, relationships, types, links }) => {
      const newFormattedResource = this._convertToModel({ id, ...attributes });

      if (!currentIncludes.length) return newFormattedResource;
      return this._convertToModel({
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
          nextRelationshipObjects[type].push(
            this._convertToModel({
              id,
              ...relationData.attributes
            })
          );

          return nextRelationshipObjects;
        }, {})
      });
    });
  }

  _convertToModel(resource) {
    return new this.klass(resource, this.hasMany, this.belongsTo);
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
      if (resource.attributes[key] === value) {
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

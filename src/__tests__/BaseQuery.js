import BaseQuery, { QueryObject } from "../BaseQuery";

import jsonApiNormalize from "json-api-normalizer";
import { GraphQLNormalizr } from "graphql-normalizr";

import resources from "../fixtrues/checklistsAndTasksNormalized";

class Checklist extends BaseQuery {
  static hasMany = ["tasks"];
}

describe("BaseQUery", () => {
  test("query returns a QueryObject", () => {
    expect(BaseQuery.query()).toBeInstanceOf(QueryObject);
  });

  describe("all()", () => {
    test("", () => {
      expect(Checklist.query(resources).all().execute()).toMatchSnapshot();
    });
  });

  describe("find()", () => {
    test("", () => {
      const checklist = Checklist.query(resources).find(1).execute()[0];
      expect(checklist.id).toEqual(1);
      expect(checklist).toMatchSnapshot();
    });
  });

  describe("where()", () => {
    test("", () => {
      const checklist = Checklist.query(resources)
        .where({ name: "Project Audit Rest" })
        .execute()[0];
      expect(checklist.id).toEqual(2);
      expect(checklist).toMatchSnapshot();
    });
  });

  describe("includes()", () => {
    test("", () => {
      const checklists = Checklist.query(resources)
        .all()
        .includes(["tasks"])
        .execute();
      expect(checklists).toMatchSnapshot();
    });
  });

  describe("hasMany()", () => {
    test("", () => {
      const checklists = Checklist.query(resources).tasks().all().execute();
      expect(checklists).toMatchSnapshot();
    });
  });
});

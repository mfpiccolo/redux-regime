import BaseQuery, { QueryObject } from "../BaseQuery";

import jsonApiNormalize from "json-api-normalizer";
import { GraphQLNormalizr } from "graphql-normalizr";

import resources from "../fixtrues/checklistsAndTasksNormalized";

class Checklist extends BaseQuery {}

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
      expect(Checklist.query()).toBeInstanceOf(QueryObject);
    });
  });

  describe("whereRelated()", () => {
    test("", () => {
      expect(Checklist.query()).toBeInstanceOf(QueryObject);
    });
  });

  describe("whereRelated()", () => {
    test("", () => {
      expect(Checklist.query()).toBeInstanceOf(QueryObject);
    });
  });

  describe("includes()", () => {
    test("", () => {
      expect(Checklist.query()).toBeInstanceOf(QueryObject);
    });
  });

  describe("execute()", () => {
    test("", () => {
      expect(Checklist.query()).toBeInstanceOf(QueryObject);
    });
  });
});

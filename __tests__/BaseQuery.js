import BaseQuery, { QueryObject } from "../src/BaseQuery";

import jsonApiNormalize from "json-api-normalizer";
import { GraphQLNormalizr } from "graphql-normalizr";

import resources
  from "../__testHelpers__/fixtrues/checklistsAndTasksNormalized";
import { Checklist, Task } from "../__testHelpers__/models";

describe("BaseQUery", () => {
  test("query returns a QueryObject", () => {
    expect(BaseQuery.query()).toBeInstanceOf(QueryObject);
  });

  describe("all()", () => {
    test("", () => {
      expect(Checklist.query(resources).all().models()).toMatchSnapshot();
    });
  });

  describe("find()", () => {
    test("", () => {
      const checklist = Checklist.query(resources).find(1);
      expect(checklist.id).toEqual(1);
      expect(checklist).toMatchSnapshot();
    });
  });

  describe("where()", () => {
    test("", () => {
      const checklist = Checklist.query(resources)
        .where({ name: "Project Audit Rest" })
        .models()[0];
      expect(checklist.id).toEqual(2);
      expect(checklist).toMatchSnapshot();
    });
  });

  describe("includes()", () => {
    test("", () => {
      const checklists = Checklist.query(resources)
        .all()
        .includes(["tasks"])
        .models();
      expect(checklists).toMatchSnapshot();
    });
  });

  // describe("hasMany()", () => {
  //   test("", () => {
  //     const checklists = Checklist.query(resources).find(1).tasks().models();
  //     expect(checklists).toMatchSnapshot();
  //   });
  // });

  // describe("belongsTo()", () => {
  //   test("", () => {
  //     const checklist = Task.query(resources).checklist().models();
  //     expect(checklists).toMatchSnapshot();
  //   });
  // });
});

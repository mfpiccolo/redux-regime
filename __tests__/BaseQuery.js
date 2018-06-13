import BaseModel, { QueryObject } from "../src/BaseModel";

import resources
  from "../__testHelpers__/fixtrues/checklistsAndTasksNormalized";
import { Checklist, Task } from "../__testHelpers__/models";

describe("BaseModel", () => {
  test("query returns a QueryObject", () => {
    expect(BaseModel.query(resources)).toBeInstanceOf(QueryObject);
  });

  describe("models", () => {
    describe("all()", () => {
      test("", () => {
        expect(Checklist.query(resources).all().toModels()).toMatchSnapshot();
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
      test("filter by name", () => {
        const checklist = Checklist.query(resources)
          .where({ name: "Project Audit Rest" })
          .toModels()[0];
        expect(checklist.id).toEqual(2);
        expect(checklist).toMatchSnapshot();
      });

      test("filter by id", () => {
        const checklist = Checklist.query(resources)
          .where({ id: 3 })
          .toModels()[0];
        expect(checklist.id).toEqual(3);
        expect(checklist).toMatchSnapshot();
      });
    });

    describe("includes()", () => {
      test("", () => {
        const checklists = Checklist.query(resources)
          .all()
          .includes(["tasks"])
          .toModels();
        expect(checklists).toMatchSnapshot();
      });
    });

    describe("hasMany()", () => {
      test("hasMany", () => {
        const checklists = Checklist.query(resources)
          .find(1)
          .tasks()
          .toModels();
        expect(checklists).toMatchSnapshot();
      });
    });

    // describe("belongsTo()", () => {
    //   test("", () => {
    //     const checklist = Task.query(resources).checklist().toModels();
    //     expect(checklists).toMatchSnapshot();
    //   });
    // });
  });
  describe("objects", () => {
    describe("all()", () => {
      test("", () => {
        expect(Checklist.query(resources).all().toObjects()).toMatchSnapshot();
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
          .toObjects()[0];
        expect(checklist.id).toEqual(2);
        expect(checklist).toMatchSnapshot();
      });
    });

    describe("includes()", () => {
      test("", () => {
        const checklists = Checklist.query(resources)
          .all()
          .includes(["tasks"])
          .toObjects();
        expect(checklists).toMatchSnapshot();
      });
    });
  });
});

import * as fc from "fast-check";
import { QuickUnion, Relation } from "../src/quickunion";
import { group } from "console";

describe("QuickUnion", () => {  
    it("Should be able to join two elements", () => {
        var q = new QuickUnion(10);
        expect(q.connected(1, 2)).toBe(false);
        q.join(1, 2);
        expect(q.connected(1, 2)).toBe(true);
    });

    it("elements should be joined transitively", () => {
        var q = new QuickUnion(10);
        expect(q.connected(1, 2)).toBe(false);
        q.join(1, 2);
        expect(q.connected(1, 2)).toBe(true);
        q.join(3, 2);
        expect(q.connected(1, 3)).toBe(true);
    });

    it("Quick union should form transitive groups", () => {
      fc.assert(fc.property(fc.integer({min: 2,max: 100}).chain(length => fc.tuple(fc.constant(length), fc.array(fc.tuple(fc.nat({max: length-1}), fc.nat({max: length-1})).filter(x => x[0] != x[1])))), ([length, pairs]) => {
        var q = new QuickUnion(length);
        var r = new Relation(length);
        // console.log(length, pairs);
        for(let [a, b] of pairs) {
          q.join(a, b);
        }
        for(let i = 0; i < length; i++) {
          q.find(i);
        }
        let groups = q.set.reduce((acc, x, index) => {
          if(acc[x] == undefined) {
            acc[x] = [index];
          }else{
            acc[x].push(index);
          }
          return acc;
        }, new Array(length).map(x => []) as number[][]);
        // console.log(groups);
        for (let i = 0; i < groups.length; i++) {
          for (let j = 0; j < (groups[i] ?? []).length - 1; j++) {
            for (let k = 1; k < (groups[i] ?? []).length; k++) {
              r.addRelation(groups[i][j], groups[i][k]);
            }
          }
        }
        //r.addRelation(a, b);
        // console.log(r.relations);
        expect(r.isTransitive()).toBe(true);
      }));
    });
});

describe("unicorns", () => {
    it("Beware all unicorns know calculus", () => {
        fc.assert(fc.property(fc.array(fc.string(), {maxLength: 0}), (unicorns) => {
            for(let u of unicorns) {
                expect(u).toContain("calculus");
            }
        }));
    });
});
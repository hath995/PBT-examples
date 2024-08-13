import exp from "constants";
import { Kdtree, HORIZONTAL, VERTICAL, Point, Orientation} from "../src/kdtree";
import * as fc from "fast-check";

const PointArb = fc.tuple(fc.integer(), fc.integer()).map((t) => new Point(t[0], t[1]));
const TreeMap = new WeakMap<Kdtree, Point[]>();

function TreePoints(tree: Kdtree | undefined): Point[] {
    if(tree !== undefined && TreeMap.has(tree)) return TreeMap.get(tree)!;
    if(tree == undefined) {
        return [];
    }
    TreeMap.set(tree, [tree.value].concat(TreePoints(tree.left)).concat(TreePoints(tree.right)));
    return TreeMap.get(tree)!;
}

function isValidKdtree(tree: Kdtree | undefined, orientation: Orientation): boolean {
    if (tree == undefined) return true;
    if(tree.orientation != orientation) throw new Error("Invalid orientation");
    if(orientation == HORIZONTAL && tree.value.y != tree.key) throw new Error("Invalid key for horizontal tree");
    if(orientation == VERTICAL && tree.value.x != tree.key) throw new Error("Invalid key for vertical tree");
    let leftPoints = TreePoints(tree.left);
    let rightPoints = TreePoints(tree.right);
    if(orientation == HORIZONTAL) {
        for(let point of leftPoints) {
            if(point.y >= tree.value.y) throw new Error("Invalid point in left subtree horizontal");
        }
        for(let point of rightPoints) {
            if(point.y < tree.value.y) throw new Error("Invalid point in right subtree horizontal");
        }
    }else{
        for(let point of leftPoints) {
            if(point.x >= tree.value.x) throw new Error("Invalid point in left subtree vertical");
        }
        for(let point of rightPoints) {
            if(point.x < tree.value.x) throw new Error("Invalid point in right subtree vertical");
        }
    }
    return isValidKdtree(tree.left, 1 - orientation as Orientation) && isValidKdtree(tree.right, 1 - orientation as Orientation);
}

describe("kdtree", () => {

    it("should insert multiple points", () => {
        fc.assert(fc.property(fc.array(PointArb), (points) => {
            let tree = new Kdtree(0, new Point(0,0), HORIZONTAL);
            for(let point of points) {
                tree.insert(point);
            }
            expect(isValidKdtree(tree, HORIZONTAL)).toBe(true);
        }))
    });

    it("should insert multiple points (v)", () => {
        fc.assert(fc.property(fc.array(PointArb), (points) => {
            let tree = new Kdtree(0, new Point(0,0), VERTICAL);
            for(let point of points) {
                tree.insert(point);
            }
            expect(isValidKdtree(tree, VERTICAL)).toBe(true);
        }))
    });

    it("should find all points", () => {
        fc.assert(fc.property(fc.array(PointArb), (points) => {
            let tree = new Kdtree(0, new Point(0,0), HORIZONTAL);
            for(let point of points) {
                tree.insert(point);
            }
            let xone = Math.min(...points.map((p) => p.x));
            let yone = Math.min(...points.map((p) => p.y));
            let xtwo = Math.max(...points.map((p) => p.x));
            let ytwo = Math.max(...points.map((p) => p.y));
            let range = tree.range(xone, yone, xtwo, ytwo);
            for(let point of points) {
                if(point.x >= xone && point.x <= xtwo && point.y >= yone && point.y <= ytwo) {
                    expect(range).toContain(point);
                }
            }
        }));
    });

    it.skip("should find all points in range", () => {
        fc.assert(fc.property(fc.array(PointArb,{minLength: 1}), fc.nat(), fc.nat(), (points, xrand, yrand) => {
            let xmin = Math.min(...points.map((p) => p.x));
            let ymin = Math.min(...points.map((p) => p.y));
            let xmax = Math.max(...points.map((p) => p.x));
            let ymax = Math.max(...points.map((p) => p.y));
            let xrange = xrand % (xmax - xmin) + xmin;
            let yrange = yrand % (ymax - ymin) + ymin;
            let tree = new Kdtree(0, points[0], HORIZONTAL);
            for(let i=1; i < points.length; i++) {
                tree.insert(points[i]);
            }
            let treeRange = tree.range(xmin-xrange, ymin-yrange, xmin+xrange, yrange+yrange);
            let inRange = points.filter((p) => p.x >= xmin-xrange && p.x <= xmin+xrange && p.y >= ymin-yrange && p.y <= yrange+yrange); 
            expect(treeRange.length).toBe(inRange.length);
            expect(treeRange.length).toBeGreaterThanOrEqual(0);
            //forall p in points, p in inRange => p in treeRange
            for(let point of inRange) {
                expect(treeRange).toContain(point);
            }
            //forall p in treeRange, p in inRange
            for(let point of treeRange) {
                expect(inRange).toContain(point);
            }
        }));
    });
});

describe("isValidKdTree", ()=>{
    it("should throw for the wrong orientation", () => {
        let tree = new Kdtree(0, new Point(0,0), HORIZONTAL);
        expect(() => isValidKdtree(tree, VERTICAL)).toThrow("Invalid orientation");
    });
    it("should throw if the key is wrong", () => {
        let tree = new Kdtree(0, new Point(0,1), HORIZONTAL);
        expect(() => isValidKdtree(tree, HORIZONTAL)).toThrow("Invalid key for horizontal tree");
        let vtree = new Kdtree(0, new Point(1,0), VERTICAL);
        expect(() => isValidKdtree(vtree, VERTICAL)).toThrow("Invalid key for vertical tree");
    })

    it("should throw in a horizontal tree if an invalid point is in a subtree", () => {
        let tree = new Kdtree(0, new Point(0,0), HORIZONTAL, new Kdtree(0, new Point(0,0), VERTICAL));
        expect(() => isValidKdtree(tree, HORIZONTAL)).toThrow("Invalid point in left subtree horizontal");
        let rtree = new Kdtree(0, new Point(0,0), HORIZONTAL, undefined, new Kdtree(0, new Point(0,-1), VERTICAL));
        expect(() => isValidKdtree(rtree, HORIZONTAL)).toThrow("Invalid point in right subtree horizontal");
    });
    it("should throw in a vertical tree if an invalid point is in a subtree", () => {
        let tree = new Kdtree(0, new Point(0,0), VERTICAL, new Kdtree(0, new Point(0,0), HORIZONTAL));
        expect(() => isValidKdtree(tree, VERTICAL)).toThrow("Invalid point in left subtree vertical");
        let rtree = new Kdtree(0, new Point(0,0), VERTICAL, undefined, new Kdtree(0, new Point(-1,0), HORIZONTAL));
        expect(() => isValidKdtree(rtree, VERTICAL)).toThrow("Invalid point in right subtree vertical");
        let dtree = new Kdtree(0, new Point(0,0), VERTICAL, new Kdtree(0, new Point(0,-1), HORIZONTAL, undefined, new Kdtree(0, new Point(0,0), VERTICAL)));
        expect(() => isValidKdtree(dtree, VERTICAL)).toThrow("Invalid point in left subtree vertical");
    });
});
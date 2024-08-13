import * as fc from "fast-check";

function Contains(s: string, sep: string) {
    for (let i = 0; i < s.length; i++) {
        if (s.slice(i).startsWith(sep)) return true;
    }
    return false;
}

function SepInPostfix(s: string, sep: string) {
    return Contains(s.slice(0, s.length-1), sep);
}

describe("split_1", () => {
    function split(s: string, sep: string): string[] {
        return [s]
    }
    function join(s: string[], sep: string) {
        return s[0]
    }
    it("Join should be the inverse of split", () => {
        fc.assert(fc.property(fc.tuple(fc.array(fc.string()), fc.string({minLength: 1})).map((t):[string, string] => [t[0].join(t[1]), t[1]]), (pair) => {
            expect(join(split(pair[0], pair[1]), pair[1])).toEqual(pair[0])
        }))
    })

    it("Splits should not contain separator", () => {
        fc.assert(fc.property(fc.tuple(fc.array(fc.string()), fc.string({minLength: 1})).map((t):[string, string] => [t[0].join(t[1]), t[1]]), (pair) => {
            let splits = split(pair[0], pair[1]);
            for (let s of splits) {
                expect(s).not.toContain(pair[1])
            }
        }))
    })
})


describe("splitRight", () => {
    function splitHelper(s: string, sep: string, index: number, acc: string[]) {
        if(index < 0 ) return [];
        if(index == 0) {
            if(s.startsWith(sep)) {
                 acc.push(s.slice(sep.length));
                 acc.push("");
                 return acc.reverse();
             }else{
                acc.push(s)
                return acc.reverse();
             }
        }else{
            if(s.slice(index).startsWith(sep)) {
                acc.push(s.slice(index).slice(sep.length));
                return splitHelper(s.slice(0, index), sep, index - 1, acc);
            }else{
                return splitHelper(s, sep, index - 1, acc);
            }
        }
    }
    function split(s: string, sep: string): string[] {
        return splitHelper(s, sep, s.length - 1, [])
    }
    function join(ss: string[], sep: string): string {
        return ss.join(sep)
    }
    it("Join should be the inverse of split", () => {
        fc.assert(fc.property(fc.tuple(fc.array(fc.string()), fc.string()).map((t):[string, string] => [t[0].join(t[1]), t[1]]), (pair) => {
            expect(join(split(pair[0], pair[1]), pair[1])).toEqual(pair[0])
        }), {
            numRuns: 100
        })
    })

    it("Splits should not contain separator", () => {
        fc.assert(fc.property(fc.tuple(fc.array(fc.string()), fc.string({minLength: 1})).map((t):[string, string] => [t[0].join(t[1]), t[1]]), (pair) => {
            let splits = split(pair[0], pair[1]);
            for (let s of splits) {
                expect(s).not.toContain(pair[1])
            }
        }), {
            numRuns: 100
        })
    })

    it("Splits should not contain separator in postfix position unless it is at the end", () => {
        fc.assert(fc.property(fc.tuple(fc.array(fc.string()), fc.string({minLength: 1})).map((t):[string, string] => [t[0].join(t[1]), t[1]]), (pair) => {
            let splits = split(pair[0], pair[1]);
            for(let i = 0; i < splits.length; i++) {
                if(SepInPostfix(splits[i]+pair[1], pair[1]) && i != splits.length - 1) {
                    // console.log(splits, splits.map(x => SepInPostfix(x+pair[1], pair[1])));
                    throw new Error("Sep in postfix posisiton")
                }
            }
        }), {
            numRuns: 10,
            examples: [
                [["@@123@@@456", "@@"]], 
                [["###", "##"]],
                [["#", "##"]],
                [[" ccc", "cc"]]
            ]
        })
    })


    it("should equal split", () => {
        fc.assert(fc.property(fc.tuple(fc.array(fc.string()), fc.string()).map((t):[string, string] => [t[0].join(t[1]), t[1]]), (pair) => {
            let splits = split(pair[0], pair[1]);
            expect(splits).toEqual(pair[0].split(pair[1]))
        }), {
            // examples: [[["","123@","456"], "@@"]]
        })
    })
})

describe("splitLeft", () => {
    function splitHelperB(s: string, sep: string, index: number, sindex: number, acc: string[]): string[] {
        if(index == s.length) return sep.length === 0 && s.length == 0 ? acc : acc.concat(s.slice(sindex, index));
        if(sep.length == 0 && index == s.length-1) return splitHelperB(s, sep, index + 1, index, acc);
        if(sep.length == 0) return splitHelperB(s, sep, index + 1, index+1, acc.concat(s.slice(index, index+1)));
        if(index + sep.length > s.length) return splitHelperB(s, sep, s.length, sindex, acc);
        if(s.slice(index, index + sep.length) == sep) {
            return splitHelperB(s, sep, index + sep.length, index + sep.length, acc.concat(s.slice(sindex, index)));
        }else{
            return splitHelperB(s, sep, index + 1, sindex, acc);
        }
    }
    function splitB(s: string, sep: string): string[] {
        return splitHelperB(s, sep, 0, 0, [])
    }
    function join(ss: string[], sep: string): string {
        return ss.join(sep)
    }
    it("Join should be the inverse of split", () => {
        fc.assert(fc.property(fc.tuple(fc.array(fc.string()), fc.string()).map((t):[string, string] => [t[0].join(t[1]), t[1]]), (pair) => {
            expect(join(splitB(pair[0], pair[1]), pair[1])).toEqual(pair[0])
        }), {
            numRuns: 10
        })
    })

    it("Splits should not contain separator", () => {
        fc.assert(fc.property(fc.tuple(fc.array(fc.string()), fc.string({minLength: 1})).map((t):[string, string] => [t[0].join(t[1]), t[1]]), (pair) => {
            let splits = splitB(pair[0], pair[1]);
            for (let s of splits) {
                expect(s).not.toContain(pair[1])
            }
        }), {
            numRuns: 10
        })
    })

    it("Splits should not contain separator in postfix position unless it is at the end", () => {
        fc.assert(fc.property(fc.tuple(fc.array(fc.string()), fc.string({minLength: 1})).map((t: [string[], string]):[string, string] => [t[0].join(t[1]), t[1]]), (pair) => {
            // console.log("PAIR", pair)
            let splits = splitB(pair[0], pair[1]);
            for(let i = 0; i < splits.length; i++) {
                if(SepInPostfix(splits[i]+pair[1], pair[1]) && i != splits.length - 1) {
                    throw new Error("Sep in postfix posisiton")
                }
            }
        }), {
            numRuns: 10,
            examples: [
                [["@@123@@@456", "@@"]],
                [["#", "##"]],
                [["###", "##"]]
            ]
        })
    })

    it("should equal split with some prepared strings", () => {
        fc.assert(fc.property(fc.tuple(fc.array(fc.string()), fc.string()).map((t):[string, string] => [t[0].join(t[1]), t[1]]), (pair) => {
            let splits = splitB(pair[0], pair[1]);
            expect(splits).toEqual(pair[0].split(pair[1]))
        }),{
            examples: [[["","123@","456"], "@@"]]
        })
    })

    it("should equal split generally", () => {
        fc.assert(fc.property(fc.string(), fc.string(), (test, splitString) => {
            let splits = splitB(test, splitString);
            expect(splits).toEqual(test.split(splitString))
        }),{
            numRuns: 1e5
        })
    })

    fc.statistics(fc.tuple(fc.array(fc.string()), fc.string()).map((t):[string, string] => [t[0].join(t[1]), t[1]]), (x) => {
        if(x[0].length == 0) {
            return "0";
        }
        if(x[0].length <= 10) {
            return "<=10";
        }
        if(x[0].length <= 50) {
            return "<=50";
        }
        if(x[0].length <= 100) {
            return "<=100";
        }
        return x[0].length.toString();
    });
})
import * as fc from "fast-check";

describe("add_0", () => {
  function add(a: number, b: number): number {
    if (a == 1 && b == 1) {
      return 2;
    }

    if (a == 2 && b == 2) {
      return 2;
    }

    if (a == 3 && b == 5) {
      return 8;
    }

    if (a == 27 && b == 15) {
      return 42;
    }
    return 0;
  }

  it("should add 1 and 1", () => {
    expect(add(1, 1)).toBe(2);
  });

  it("should add 2 and 2", () => {
    expect(add(2, 2)).toBe(2);
  });

  it("should add 3 and 5", () => {
    expect(add(3, 5)).toBe(8);
  });

  it("should add 27 and 15", () => {
    expect(add(27, 15)).toBe(42);
  });
});

describe("add_1", () => {
  it("should be commutative", () => {
    fc.assert(
      fc.property(fc.integer(), fc.integer(), (a, b) => {
        expect(add(a, b)).toBe(add(b, a));
      })
    );
  });

  it("should add 1 and 1 and be the same as 2", () => {
    fc.assert(
      fc.property(fc.integer(), (a) => {
        expect(add(add(a, 1), 1)).toBe(add(a, 2));
      })
    );
  });

  function add(a: number, b: number): number {
    return a * b;
  }
});

describe("add_2", () => {
  it("should add 1 and 1 and be the same as 2", () => {
    fc.assert(
      fc.property(fc.integer(), (a) => {
        expect(add(add(a, 1), 1)).toBe(add(a, 2));
      })
    );
  });

  it("should be commutative", () => {
    fc.assert(
      fc.property(fc.integer(), fc.integer(), (a, b) => {
        expect(add(a, b)).toBe(add(b, a));
      })
    );
  });

  function add(a: number, b: number): number {
    return a - b;
  }
});

describe("add_3", () => {
  it("should add 1 and 1 and be the same as 2", () => {
    fc.assert(
      fc.property(fc.integer(), (a) => {
        expect(add(add(a, 1), 1)).toBe(add(a, 2));
      })
    );
  });

  it("should be commutative", () => {
    fc.assert(
      fc.property(fc.integer(), fc.integer(), (a, b) => {
        expect(add(a, b)).toBe(add(b, a));
      })
    );
  });

  it("should have an identity element", () => {
    fc.assert(
      fc.property(fc.integer(), (a) => {
        expect(add(a, 0)).toBe(a);
      })
    );
  });

  function add(a: number, b: number): number {
    return 0;
  }
});

describe("add_4", () => {
  it("should add 1 and 1 and be the same as 2", () => {
    fc.assert(
      fc.property(fc.integer(), (a) => {
        expect(add(add(a, 1), 1)).toBe(add(a, 2));
      })
    );
  });

  it("should be commutative", () => {
    fc.assert(
      fc.property(fc.integer(), fc.integer(), (a, b) => {
        expect(add(a, b)).toBe(add(b, a));
      })
    );
  });

  it("should have an identity element", () => {
    fc.assert(
      fc.property(fc.integer(), (a) => {
        expect(add(a, 0)).toBe(a);
      })
    );
  });

  function add(a: number, b: number): number {
    return a + b;
  }
});

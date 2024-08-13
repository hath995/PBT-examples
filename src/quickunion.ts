
export class QuickUnion {
  length: number;
  size: number[];
  set: number[];
  constructor(length: number) {
    this.length = length;
    this.size = new Array(length);
    this.set = new Array(length);

    for (var i = 0; i < length; i++) {
      this.size[i] = 1;
      this.set[i] = i;
    }
  }

  join(p: number, q: number) {
    var proot = this.find(p);
    var qroot = this.find(q);

    if (this.size[proot] < this.size[qroot]) {
      this.set[proot] = qroot;
      this.size[qroot] += this.size[proot];
    } else {
      this.set[qroot] = proot;
      this.size[proot] += this.size[qroot];
    }
  }

  connected(p: number, q: number) {
    var proot = this.find(p);
    var qroot = this.find(q);
    if (proot == qroot) {
      return true;
    } else {
      return false;
    }
  }

  find(index: number) {
    var root = this.set[index];

    while (root != this.set[root]) {
      root = this.set[root];
    }
    this.set[index] = root;
    return root;
  }
}

export class Relation {
  relations: boolean[][];
  constructor(public readonly size: number) {
    this.relations = new Array(size).fill(false).map(() => new Array(size).fill(false));
    for(let i=0; i<size; i++) {
        // this.relations[i][i] = true;
    }
  }
  addRelation(a: number, b: number) {
    this.relations[a][b] = true;
    this.relations[b][a] = true;
  }
  isTransitive(): boolean {
    for (let i = 0; i < this.size; i++) {
      for (let j = 0; j < this.size; j++) {
        if (this.relations[i][j]) {
          for (let k = 0; k < this.size; k++) {
            if (i!=k && this.relations[j][k] && !this.relations[i][k]) {
                // console.log("Fail", i, j, k);
              return false;
            }
          }
        }
      }
    }
    return true;
  }
}
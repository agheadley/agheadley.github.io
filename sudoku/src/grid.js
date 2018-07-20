class Grid {
  constructor(gridSize, level) {
    //0 for 4x4, 1 6x6, 2 9x9
    this.baseData = [
      { t: 16, r: 4, c: 4, br: 2, bc: 2 },
      { t: 36, r: 6, c: 6, br: 2, bc: 3 },
      { t: 64, r: 8, c: 8, br: 2, bc: 4 },
      { t: 81, r: 9, c: 9, br: 3, bc: 3 }
    ];
    this.levelData = [{ l: 1, p: 0.6 }, { l: 2, p: 0.45 }, { l: 3, p: 0.3 }];
    this.charData = "123456789ABC"; // translates number into char.
    this.moves = []; //
    this.activePencil = false;
    // select grid size
    this.grid = Object.assign({}, this.baseData[3]); // default to 9x9
    for (let item of this.baseData) if (item.r === gridSize) this.grid = Object.assign({}, item);

    //level
    this.level = Object.assign({}, this.levelData[0]); // default to easy
    for (let item of this.levelData) if (item.l === level) this.level = Object.assign({}, item);

    // create cell data structure
    this.cell = [];
    for (let gridIndex = 0; gridIndex < this.grid.t; gridIndex++) {
      let rc = this.rc(gridIndex);
      let b = this.block(gridIndex);
      this.cell[gridIndex] = {
        index: gridIndex,
        row: rc.r,
        col: rc.c,
        block: b,
        soln: 0,
        val: 0,
        isFree: true,
        isPossible: true,
        pencil: [0]
      };
    }
    this.generate(0);
    this.consoleView("soln");

    this.addValues();

    this.consoleView("val");
  }

  validateInput(index) {
    let value = this.cell[index].val;
    this.cell[index].val = 0;
    this.cell[index].isPossible = this.validateCell(index, "val", value);
    this.cell[index].val = value;
  }

  validateSolution() {
    let out = { isEnd: false, message: "" };
    let count = 0;
    let isPossible = true;
    for (let item of this.cell) {
      this.validateInput(item.index);
      if (item.val > 0) count += 1;
      if (item.isPossible === false) isPossible = false;
    }
    if (count === this.grid.t) {
      out.isEnd = true;
      if (isPossible === true) out.message = "Completed!";
      else out.message = "Please check errors.";
    }
    return out;
  }

  updateMoves(index, value, pencil) {
    this.moves.unshift({ index: index, val: value, pencil: pencil });
  }

  undoLastMove() {
    let isValid = false;
    let index = null;
    let isFree = false;
    let val = 0;
    let pencil = [];

    if (this.moves.length === 1) {
      index = this.moves[0].index;
      isFree = this.cell[index].isFree;
      isValid = true;
      this.moves.shift();
    } else if (this.moves.length > 1) {
      index = this.moves[0].index;
      isFree = this.cell[index].isFree;
      isValid = true;
      this.moves.shift();
      let found = this.moves.findIndex(el => el.index === index);
      if (found > -1) {
        val = this.moves[found].val;
        pencil = this.moves[found].pencil;
      }
    }

    let status = { isValid: isValid, index: index, isFree: isFree, val: val, pencil: pencil };

    if (isValid === true && isFree === true) {
      this.cell[index].val = val;
      this.cell[index].pencil = pencil;
    }

    return status;
  }

  updateCell(cellIndex, inputIndex, isPencil) {
    if (this.cell[cellIndex].isFree === true) {
      if (inputIndex === null) {
        this.updateMoves(cellIndex, this.cell[cellIndex].val, this.cell[cellIndex].pencil);
        this.cell[cellIndex].val = 0;
        this.cell[cellIndex].pencil = [0];
      } else {
        if (isPencil === true) {
          let check = this.cell[cellIndex].pencil.indexOf(inputIndex + 1);
          if (check === -1) {
            this.cell[cellIndex].val = 0;
            this.cell[cellIndex].pencil.push(inputIndex + 1);
            this.updateMoves(cellIndex, 0, this.cell[cellIndex].pencil.slice());
          }
        } else {
          this.cell[cellIndex].pencil = [0];
          this.updateMoves(cellIndex, inputIndex + 1, [0]);
          this.cell[cellIndex].val = inputIndex + 1;
          this.validateInput(cellIndex);
        }
      }
    }

    let out = {
      isPossible: this.cell[cellIndex].isPossible,
      isFree: this.cell[cellIndex].isFree,
      val: this.cell[cellIndex].val,
      pencil: this.cell[cellIndex].pencil
    };
    return out;
  }

  getCellInfo(cellIndex) {
    let out = {
      isPossible: this.cell[cellIndex].isPossible,
      isFree: this.cell[cellIndex].isFree,
      val: this.cell[cellIndex].val,
      pencil: this.cell[cellIndex].pencil
    };
    return out;
  }

  addValues() {
    /*
    let count = 0;
    for (let item of this.cell) {
      item.val = 0;
      if (Math.random() < this.level.p) {
        item.val = item.soln;
        item.isFree = false;
        count += 1;
      }
    }
    */
    let len = this.grid.t;
    let arr = [];
    while (arr.length < len) {
      var randomnumber = Math.floor(Math.random() * len) + 1;
      if (arr.indexOf(randomnumber) > -1) continue;
      arr[arr.length] = randomnumber;
    }
    //alert(arr);
    let i = 0;
    while (i < this.grid.t * this.level.p) {
      this.cell[arr[i] - 1].val = this.cell[arr[i] - 1].soln;
      this.cell[arr[i] - 1].isFree = false;
      i += 1;
    }
  }

  generate(index) {
    // get a valid choice

    this.cell[index].soln = 0;

    let seq = this.rndSeq();
    let i = 0;

    while (i < seq.length && this.cell[index].soln === 0) {
      if (this.validateCell(index, "soln", seq[i])) this.cell[index].soln = seq[i];
      i += 1;
    }

    if (this.cell[index].soln === 0) {
      let restartPos = -1;
      let i = index - 1;
      while (i >= 0 && restartPos === -1) {
        if (this.validateCell(index, "soln", this.cell[i].soln)) {
          //console.log("possible soln @ ", i);
          restartPos = i;
        }
        this.cell[i].soln = 0;
        i -= 1;
      }
      if (restartPos !== -1) this.generate(restartPos);
      else this.generate(index - 1);
    }

    if (index < this.cell.length - 1) this.generate(index + 1);
    else return true;
  }

  validateCell(index, dataType, value) {
    // this.cell dataType is either 'val' or 'soln'
    //console.log("validateCell()", this.cell[index]);
    let r = this.cell.filter(el => el.row === this.cell[index].row).map(el => el[dataType]);
    let c = this.cell.filter(el => el.col === this.cell[index].col).map(el => el[dataType]);
    let b = this.cell.filter(el => el.block === this.cell[index].block).map(el => el[dataType]);
    //console.log("row", r);
    //console.log("col", c);
    //console.log("block", b);
    if (r.indexOf(value) === -1 && c.indexOf(value) === -1 && b.indexOf(value) === -1) return true;
    else return false;
  }
  neighbour(index) {
    // get array of indices of matching block, row and col
    let x = this.cell[index];
    let list = this.cell.filter(el => el.row === x.row || el.col === x.col || el.block === x.block);
    return list.map(el => el.index);
  }

  rc(index) {
    // get {r:r,c:c} from index
    return { r: (index / this.grid.r) >> 0, c: index % this.grid.r };
  }
  index(r, c) {
    // get index from r,c
    return r * this.grid.r + c;
  }
  block(index) {
    let r = (index / this.grid.r) >> 0;
    let c = index % this.grid.r;
    return (((r / this.grid.br) >> 0) * this.grid.br + c / this.grid.bc) >> 0;
  }
  rndSeq() {
    let len = this.grid.r;
    let arr = [];
    while (arr.length < len) {
      var randomnumber = Math.floor(Math.random() * len) + 1;
      if (arr.indexOf(randomnumber) > -1) continue;
      arr[arr.length] = randomnumber;
    }
    return arr;
  }
  getRnd(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
  consoleView(key) {
    let i = 0;
    let line = "";
    while (i < this.cell.length) {
      if (i > 0 && i % this.grid.r === 0) {
        console.log(line);
        line = "";
      }
      //line += " " + this.cell[i].soln;
      if (this.cell[i][key] > 0) line += " " + this.charData[this.cell[i][key] - 1];
      else line += " " + 0;
      i += 1;
    }
    console.log(line);
  }
} // end of Grid class

/* https://foundation.zurb.com/forum/posts/51771-how-to-import-class-using-es6-syntax */
export default Grid;

import Grid from "./grid.js";
import View from "./view.js";

var main;

class Main {
  constructor() {
    this.level = 1; // 1 easy, 2 moderate, 3 difficult
    this.gridSize = 9;
    this.model = new Grid(this.gridSize); // default set up.
    this.grid = Object.assign({}, this.model.grid);
    this.view = new View(this.grid, document.getElementById("container"));
    this.activeCellIndex = null;
    this.activeInputIndex = null;
    this.activePencil = false;
    this.activeHint = false;
    this.activeMenu = false;
    this.gridChoice = null;
    this.levelChoice = null;
  }

  buildBoard() {
    // called during set up and resize, does not reset model.
    this.view.resizeContainer();
    this.view.createBoard();
    for (let item of this.view.input) item.element.addEventListener("click", this.handleEvent, false);
    for (let item of this.view.cell) item.element.addEventListener("click", this.handleEvent, false);
    this.view.menu.element.addEventListener("click", this.handleEvent, false);
    this.view.undo.element.addEventListener("click", this.handleEvent, false);
    this.view.delete.element.addEventListener("click", this.handleEvent, false);
    this.view.pencil.element.addEventListener("click", this.handleEvent, false);
    this.view.hint.element.addEventListener("click", this.handleEvent, false);
    for (let item of this.view.gridChoice) item.element.addEventListener("click", this.handleEvent, false);
    for (let item of this.view.levelChoice) item.element.addEventListener("click", this.handleEvent, false);
    this.view.statusClose.element.addEventListener("click", this.handleEvent, false);
    for (let item of this.model.cell) {
      if (item.isFree === false) {
        this.view.updateCell(item.index, { isFree: false, val: item.val, pencil: [0] });
      }
    }
  }

  buildPuzzle() {
    this.model = new Grid(this.gridSize, this.level);
    let gridInfo = Object.assign({}, this.model.grid);
    this.view = new View(gridInfo, document.getElementById("container"));
    this.buildBoard();
  }

  selectCell(cellIndex) {
    // called when cell clicked
    if (cellIndex === this.activeCellIndex) {
      this.activeCellIndex = null;
      this.view.selectCell(0, [], false);
      //this.view.selectInput(0, false);
    } else {
      this.activeCellIndex = cellIndex;
      // find cells in row,col and block from model
      let neighbours = this.model.neighbour(cellIndex);
      this.view.selectCell(cellIndex, neighbours, true);
      // pass to view to show selection.
    }
  }

  selectInput(inputIndex) {
    // only highlight if cellSelected
    if (this.activeCellIndex !== null) {
      let status = this.model.updateCell(this.activeCellIndex, inputIndex, this.activePencil);
      if (status.isFree === true) {
        if (this.activeHint === false) status.isPossible = true;
        this.view.updateCell(this.activeCellIndex, status);
      }
      status = this.model.validateSolution();
      for (let item of this.model.cell) {
        let status = this.model.getCellInfo(item.index);
        if (this.activeHint === false) status.isPossible = true;
        this.view.updateCell(item.index, status);
      }

      if (status.isEnd === true) this.view.displayStatus(true, status.message);
    }
  }

  selectOption(optionName) {
    // called when new, undo, erase, plan etc
    if (optionName === "delete") {
      if (this.activeCellIndex !== null) {
        let status = this.model.updateCell(this.activeCellIndex, null, this.activePencil);
        this.view.updateCell(this.activeCellIndex, status);
      }
    }
    if (optionName === "pencil") {
      let isActive = false;
      if (this.activePencil === false) isActive = true;
      else isActive = false;
      this.activePencil = isActive;
      this.model.activePencil = isActive;
      this.view.selectPencil(this.activePencil);
    }
    if (optionName === "undo") {
      let status = this.model.undoLastMove();
      if (status.isValid) this.view.updateCell(status.index, status);

      for (let item of this.model.cell) {
        let status = this.model.getCellInfo(item.index);
        if (this.activeHint === false) status.isPossible = true;
        this.view.updateCell(item.index, status);
      }
    }
    if (optionName === "menu") {
      if (this.activeMenu === false) {
        this.activeMenu = true;
        this.view.selectMenu(true);
      } else {
        this.activeMenu = false;
        this.view.selectMenu(false);
      }
    }
    if (optionName === "hint") {
      let isActive = false;
      if (this.activeHint === false) isActive = true;

      this.activeHint = isActive;
      this.view.selectHint(this.activeHint);

      for (let item of this.model.cell) {
        let status = this.model.getCellInfo(item.index);
        if (this.activeHint === false) status.isPossible = true;
        this.view.updateCell(item.index, status);
      }
    }
  }

  selectPuzzle(choice, parameter) {
    if (parameter === "grid") this.gridChoice = choice;
    if (parameter === "level") this.levelChoice = choice;
    this.view.selectChoice(this.gridChoice, this.levelChoice);

    if (this.levelChoice !== null && this.gridChoice !== null) {
      // select new grid and create all
      //alert("grid " + this.gridChoice + " level " + this.levelChoice);
      this.gridSize = this.gridChoice;
      this.level = this.levelChoice;
      //reset choices
      this.activeMenu = false;
      this.view.selectMenu(false);
      this.levelChoice = null;
      this.gridChoice = null;

      this.buildPuzzle();
    }
  }

  handleEvent(e) {
    e.preventDefault();
    let id = e.target.id.split("|");
    let type = id[0];
    if (type === "input") main.selectInput(parseInt(id[1], 10));
    if (type === "cell") main.selectCell(parseInt(id[1], 10));
    if (type === "option") main.selectOption(id[1]);
    if (type === "grid") main.selectPuzzle(parseInt(id[1]), "grid");
    if (type === "level") main.selectPuzzle(parseInt(id[1]), "level");
    if (type === "status") main.view.displayStatus(false, "");
  }
}

// testing ...
main = new Main();
main.buildPuzzle();

window.onresize = () => {
  main.buildBoard();
};

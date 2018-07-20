/*

The 11/18 layout

HEADER_____
STATUS_____
_123456789_
_254346577_
_912345678_
_123456789_
_254346577_
_912345678_
_123456789_
_254346577_
_912345678_
GAP________
_INPUT NOS_
GAP________
_FOOTER____
GAP________

*/

class View {
  constructor(gridObject, container) {
    this.grid = gridObject;

    this.containerColSize = 11;
    this.containerRowSize = 18;
    this.container = container;
    this.charData = "123456789ABC";
    this.input = [];
    this.cell = [];

    this.menu = { element: null };
    this.gridChoice = [
      { element: null, id: "grid|4", text: "4x4" },
      { element: null, id: "grid|6", text: "6x6" },
      { element: null, id: "grid|8", text: "8x8" },
      { element: null, id: "grid|9", text: "9x9" }
    ];
    this.levelChoice = [
      { element: null, id: "level|1", text: "EASY" },
      { element: null, id: "level|2", text: "MODERATE" },
      { element: null, id: "level|3", text: "DIFFICULT" }
    ];
    this.title = { element: null };
    this.status = { element: null };
    this.statusClose = { element: null };
    this.statusMessage = { element: null };

    this.undo = { element: null };
    this.delete = { element: null };
    this.pencil = { element: null };
    this.hint = { element: null };
  }

  updateCell(cellIndex, status) {
    this.cell[cellIndex].element.innerHTML = "";
    this.cell[cellIndex].pencil.innerHTML = "";
    this.cell[cellIndex].element.classList.remove("cell-fixed");
    this.cell[cellIndex].element.classList.remove("cell-invalid");
    if (status.isFree === false) {
      this.cell[cellIndex].element.innerHTML = this.charData[status.val - 1];
      this.cell[cellIndex].element.classList.add("cell-fixed");
    } else {
      if (status.val > 0) this.cell[cellIndex].element.innerHTML = this.charData[status.val - 1];
      if (status.isPossible === false) this.cell[cellIndex].element.classList.add("cell-invalid");

      this.cell[cellIndex].pencil.innerHTML = "";
      if (status.pencil.length > 0) {
        for (let item of status.pencil) {
          if (item > 0) this.cell[cellIndex].pencil.innerHTML += this.charData[item - 1];
        }
      }
    }
  }

  selectHint(isSelect) {
    //alert(isSelect);
    if (isSelect === true) this.hint.element.classList.add("selected-hint");
    else this.hint.element.classList.remove("selected-hint");
  }

  selectPencil(isSelect) {
    if (isSelect === true) this.pencil.element.classList.add("selected");
    else this.pencil.element.classList.remove("selected");
  }

  selectCell(index, neighbourArray, isSelect) {
    for (let item of this.cell) {
      item.element.classList.remove("selected-cell");
      item.element.classList.remove("selected-neighbour");
    }
    if (isSelect === true) {
      for (let item of neighbourArray) {
        if (index !== item) this.cell[item].element.classList.add("selected-neighbour");
      }
      this.cell[index].element.classList.add("selected-cell");
    }
  }

  selectMenu(isSelect) {
    if (isSelect === true) {
      this.menu.element.classList.add("selected");
      this.status.element.classList.add("selected");
      this.displayChoices(true);
    } else {
      this.menu.element.classList.remove("selected");
      this.status.element.classList.remove("selected");
      this.displayChoices(false);
    }
  }

  displayStatus(isDisplay, text) {
    if (isDisplay === true) {
      this.status.element.classList.add("selected");
      this.status.element.appendChild(this.statusClose.element);
      this.status.element.appendChild(this.statusMessage.element);
      this.statusMessage.element.innerHTML = text;
    } else {
      this.status.element.classList.remove("selected");
      this.status.element.removeChild(this.statusClose.element);
      this.status.element.removeChild(this.statusMessage.element);
      this.statusMessage.element.innerHTML = "";
    }
  }

  selectChoice(gridChoice, levelChoice) {
    for (let item of this.gridChoice) item.element.classList.remove("shaded-button");
    for (let item of this.levelChoice) item.element.classList.remove("shaded-button");
    if (gridChoice !== null) {
      let index = this.gridChoice.findIndex(el => el.id === "grid|" + gridChoice);
      if (index > -1) this.gridChoice[index].element.classList.add("shaded-button");
    }
    if (levelChoice !== null) {
      let index = this.levelChoice.findIndex(el => el.id === "level|" + levelChoice);
      if (index > -1) this.levelChoice[index].element.classList.add("shaded-button");
    }
  }

  displayChoices(isDisplay) {
    if (isDisplay === true) {
      for (let item of this.gridChoice) this.status.element.appendChild(item.element);
      for (let item of this.levelChoice) this.status.element.appendChild(item.element);
    } else {
      for (let item of this.gridChoice) this.status.element.removeChild(item.element);
      for (let item of this.levelChoice) this.status.element.removeChild(item.element);
    }
  }

  createBoard() {
    // remove all from container
    while (this.container.hasChildNodes()) {
      this.container.removeChild(this.container.lastChild);
    }

    this.createGrid();
    this.createInput();
    this.createOption();
    this.createMenuChoices();
    this.createStatus();
  }

  createStatus() {
    this.statusClose.element = this.createDiv(
      ["active"],
      this.scale,
      this.scale,
      this.scale * 5.5,
      this.width / 2 - this.scale / 2
    );
    this.statusClose.element.id = "status|close";
    this.statusClose.element.innerHTML = "&#11199;";
    this.container.removeChild(this.statusClose.element);
    this.statusMessage.element = this.createDiv(
      ["active"],
      this.width - 2 * this.scale,
      this.scale,
      3 * this.scale,
      this.scale
    );
    this.statusMessage.element.innerHTML = "";
    this.container.removeChild(this.statusMessage.element);
  }

  createMenuChoices() {
    let i = 1;
    for (let item of this.gridChoice) {
      item.element = this.createDiv(
        ["shaded", "inactive", "shaded-button"],
        2 * this.scale,
        this.scale,
        this.scale * i + i,
        this.scale
      );
      item.element.id = item.id;
      item.element.innerHTML = item.text;
      item.element.style.zIndex = 300;
      this.container.removeChild(item.element);
      i += 1;
    }
    i = 1;
    for (let item of this.levelChoice) {
      item.element = this.createDiv(
        ["shaded", "inactive", "shaded-button"],
        5 * this.scale,
        this.scale,
        this.scale * i + i,
        4 * this.scale
      );
      item.element.id = item.id;
      item.element.innerHTML = item.text;
      item.element.style.zIndex = 300;
      this.container.removeChild(item.element);
      i += 1;
    }
  }

  createOption() {
    // add menu and title;
    let offsetCol = 0;
    let offsetRow = this.boardTop - 2 * this.scale;
    this.title.element = this.createDiv(
      ["inactive", "shaded"],
      this.width - this.scale,
      this.scale,
      offsetRow,
      offsetCol + this.scale
    );
    this.title.element.innerHTML = "Simple Sudoku";
    this.menu.element = this.createDiv(["inactive", "shaded"], this.scale, this.scale, offsetRow, offsetCol);
    this.menu.element.innerHTML = "&#9776;";
    this.menu.element.id = "option|menu";

    // add status
    this.status.element = this.createDiv(["status"], this.width, this.scale * 7, offsetRow + this.scale, offsetCol);

    // add undo,delete, pencil
    offsetRow = this.boardTop + (this.grid.r + 2.5) * this.scale;

    offsetCol = this.boardLeft;
    this.undo.element = this.createDiv(["active"], this.scale, this.scale, offsetRow, offsetCol);
    this.undo.element.innerHTML = "&#11148;";
    this.undo.element.id = "option|undo";
    offsetCol += this.boardWidth / 3 - this.scale / 2;
    this.delete.element = this.createDiv(["active"], this.scale, this.scale, offsetRow, offsetCol);
    this.delete.element.innerHTML = "&#11199;";
    this.delete.element.id = "option|delete";
    offsetCol += this.boardWidth / 3 - this.scale / 4;
    this.pencil.element = this.createDiv(["inactive"], this.scale, this.scale, offsetRow, offsetCol);
    this.pencil.element.innerHTML = "&#9998;";
    this.pencil.element.id = "option|pencil";
    offsetCol += this.boardWidth / 3 - this.scale / 4;
    this.hint.element = this.createDiv(["inactive"], this.scale, this.scale, offsetRow, offsetCol);
    //this.hint.element.style.fontWeight = "bold";
    this.hint.element.innerHTML = "?";
    this.hint.element.id = "option|hint";

    // https://unicode-table.com/en/blocks/miscellaneous-symbols-and-arrows/
    // &#9776; menu
    // &#11148; undo
    // &#11199; delete
    // &#9745; check
  }

  createInput() {
    let offsetCol = this.boardLeft;
    let offsetRow = this.boardTop + (this.grid.r + 1) * this.scale;
    for (let c = 0; c < this.grid.c; c++) {
      offsetCol += 1;
      let el = this.createDiv(["active"], this.scale, this.scale, offsetRow, offsetCol);
      el.innerHTML = this.charData[c];
      el.id = "input|" + c;
      this.input[c] = { element: el, id: el.id, value: c + 1 };
      offsetCol += this.scale;
    }
  }

  createGrid() {
    let offsetRow = this.boardTop;
    let offsetCol = this.boardLeft;

    for (let r = 0; r < this.grid.r; r++) {
      //create horizontal borders.
      let className = r % this.grid.br === 0 ? "block-border" : "cell-border";
      this.createDiv([className], this.boardWidth, 1, offsetRow, this.boardLeft);
      offsetRow += 1;

      offsetCol = this.boardLeft; // reset offset for borders

      for (let c = 0; c < this.grid.c; c++) {
        //create vertical borders
        if (r === 0) {
          let className = c % this.grid.bc === 0 ? "block-border" : "cell-border";
          this.createDiv([className], 1, this.boardHeight, offsetRow, offsetCol);
        }
        offsetCol += 1;

        // add new cell object
        let index = r * this.grid.r + c;
        this.cell[index] = {
          element: null,
          id: null,
          index: index,
          row: r,
          col: c,
          pencil: null
        };
        // create main element
        this.cell[index].element = this.createDiv(["cell"], this.scale, this.scale, offsetRow, offsetCol);
        this.cell[index].pencil = this.createDiv(
          ["cell-pencil"],
          this.scale - 2,
          this.scale - 4,
          offsetRow + 2,
          offsetCol + 2
        );
        this.cell[index].pencil.style.fontSize = (this.scale - 4) / 3 + "px";
        this.cell[index].pencil.style.lineHeight = (this.scale - 4) / 3 + "px";

        // give it an id

        let id = "cell|" + index;
        this.cell[index].element.id = id;
        this.cell[index].id = id;

        offsetCol += this.scale;
      }
      offsetRow += this.scale;
    }

    // add final right and bottom borders to the grid
    this.createDiv(["block-border"], 1, this.boardHeight, this.boardTop, offsetCol);
    this.createDiv(["block-border"], this.boardWidth, 1, offsetRow + 1, this.boardLeft);
  }

  createDiv(classList, w, h, top, left) {
    let div = document.createElement("div");
    for (let item of classList) div.classList.add(item);
    let attr =
      "width:" +
      w +
      "px;height:" +
      h +
      "px;top:" +
      top +
      "px;left:" +
      left +
      "px;font-size:" +
      h * 0.8 +
      "px;line-height:" +
      this.scale +
      "px";
    div.setAttribute("style", attr);
    this.container.appendChild(div);
    return div;
    /* needs line-height to set vertical centre */
    /* https://stackoverflow.com/questions/5703552/css-center-text-horizontally-and-vertically-inside-a-div-block */
  }
  /* adapted from https://www.html5rocks.com/en/tutorials/casestudies/gopherwoord-studios-resizing-html5-games/ */
  resizeContainer() {
    let widthToHeight = this.containerColSize / this.containerRowSize;
    let newWidth = window.innerWidth;
    let newHeight = window.innerHeight;
    let newWidthToHeight = newWidth / newHeight;
    if (newWidthToHeight > widthToHeight) newWidth = newHeight * widthToHeight;
    else newHeight = newWidth / widthToHeight;

    this.container.style.width = newWidth + "px";
    this.container.style.height = newHeight + "px";

    this.container.style.top = (window.innerHeight - newHeight) / 2 + "px";
    this.container.style.left = (window.innerWidth - newWidth) / 2 + "px";

    // now set scale
    this.scale = newWidth / this.containerColSize;
    // allow 1px for cell border, 2px for block border
    this.boardWidth = 1 * (this.grid.r + 1) + this.scale * this.grid.c;
    this.boardHeight = this.boardWidth;
    this.boardLeft = (newWidth - this.boardWidth) / 2;
    this.boardTop = 3 * this.scale;

    this.width = newWidth;
    this.height = newHeight;
  }
} // end of View class

export default View;

type Words = string[];
type Status = "white" | "gray" | "yellow" | "green";
type Cell = { char: string; status: Status };

export default class GameManager {
  public gameOver = false;
  private solving = false;
  private allWords: Words;
  private pool: Words;
  private targetWord: string = "";
  private update: () => void;
  private animate: () => void;
  public row = 0;
  private col = 0;
  public board: Cell[][];
  constructor(
    allWords: Words,
    pool: Words,
    update: () => void,
    animate: () => void
  ) {
    this.allWords = allWords;
    this.pool = pool;
    this.update = update;
    this.animate = animate;
    this.board = [];
  }
  public newGame() {
    this.newWord();
    this.resetBoard();
    this.update();
  }
  private resetBoard() {
    const size = this.getBoardSize();
    this.board = Array.from({ length: size }, () =>
      Array.from({ length: size }, () => ({
        char: "",
        status: "white" as Status,
      }))
    );
  }

  public setChar(char: string): boolean {
    if (this.solving) return false;
    if (char === "Backspace") {
      //todo si es backspace
      if (this.col > 0) {
        this.col--;
        this.board[this.row][this.col].char = "";
        this.update();
        return true;
      } else return false;
    } else {
      if (this.col > this.targetWord.length - 1) return false;
      this.board[this.row][this.col].char = char;
      this.col++;
      this.update();
      //*si es el ultimo cortar
      if (this.col >= this.targetWord.length) {
        //*check contra target word en allWords
        const word = this.board[this.row].map((cell) => cell.char).join("");
        if (this.isValidWord(word)) {
          this.solving = true;
          this.setStatus();
          this.row++;
          this.col = 0;
          this.animate();
          this.isGameOver();
          return true;
        } else {
          return false;
        }
      }
      return true;
    }
  }
  private setStatus() {
    const target = this.targetWord.split("");
    //*green
    for (let i = 0; i < this.board[this.row].length; i++) {
      const cell = this.board[this.row][i];
      if (cell.char === target[i]) {
        cell.status = "green";
        target[i] = "";
      }
    }
    //*yellow
    for (let j = 0; j < target.length; j++) {
      if (target[j] !== "") {
        for (let i = 0; i < this.board[this.row].length; i++) {
          const cell = this.board[this.row][i];
          if (cell.char === target[j]) {
            cell.status = "yellow";
            target[j] = "";
          }
        }
      }
    }
    //*gray
    this.board[this.row].forEach((cell) => {
      if (cell.status === "white") cell.status = "gray";
    });
  }
  private isGameOver() {
    const greenChars = this.board[this.row - 1].filter(
      (cell) => cell.status === "green"
    );

    if (
      this.row >= this.targetWord.length ||
      greenChars.length === this.targetWord.length
    ) {
      this.gameOver = true;
      console.log("GAME OVER");
    }
  }
  private isValidWord(word: string): boolean {
    let found = false;
    this.allWords.forEach((w) => {
      if (w === word) found = true;
    });
    console.log(found);
    return found;
  }
  private getBoardSize() {
    return this.targetWord.length;
  }
  public newWord() {
    this.gameOver = false;
    this.targetWord = this.pool[Math.floor(Math.random() * this.pool.length)];
    // this.targetWord = "narvaez";
    console.log("SOLUCION :", this.targetWord);
    this.row = 0;
    this.col = 0;
    for (let i = 0; i < this.board.length; i++) {
      for (let j = 0; j < this.board[this.row].length; j++) {
        const cell = this.board[i][j];
        cell.char = "";
        cell.status = "white";
      }
    }
    this.resetBoard();
    setTimeout(() => this.update(), 200);
  }
  set solve(value: boolean) {
    this.solving = value;
  }
}

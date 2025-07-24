type Words = string[];
type Status = "white" | "gray" | "yellow" | "green";
type Cell = { char: string; status: Status };
type RenderFunctions = {
  update: () => void;
  animateFlip: () => void;
  animateWrong: () => void;
};

export default class GameManager {
  public gameOver = false;
  private solving = false;
  private allWords: Words;
  private pool: Words;
  public gameWon = true;
  private streakCount = 0;
  private targetWord: string = "";
  private render: RenderFunctions = {
    update: () => {},
    animateFlip: () => {},
    animateWrong: () => {},
  };
  public row = 0;
  private col = 0;
  public board: Cell[][];
  constructor(
    allWords: Words,
    pool: Words,
    update: () => void,
    animateFlip: () => void,
    animateWrong: () => void
  ) {
    this.allWords = allWords;
    this.pool = pool;
    this.render.update = update;
    this.render.animateFlip = animateFlip;
    this.render.animateWrong = animateWrong;
    this.board = [];
  }
  public newGame() {
    this.newWord();
    this.resetBoard();
    this.render.update();
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
      if (this.col > 0) {
        this.col--;
        this.board[this.row][this.col].char = "";
        this.render.update();
        return true;
      } else return false;
    } else {
      if (this.col > this.targetWord.length - 1) return false;
      this.board[this.row][this.col].char = char;
      this.col++;
      this.render.update();
      if (this.col >= this.targetWord.length) {
        const word = this.board[this.row].map((cell) => cell.char).join("");
        if (this.isValidWord(word)) {
          this.solving = true;
          this.setStatus();
          this.row++;
          this.col = 0;
          this.render.animateFlip();
          this.checkGameOver();
          return true;
        } else {
          this.render.animateWrong();
          return false;
        }
      }
      return true;
    }
  }
  private setStatus() {
    const target = this.targetWord.split("");
    const guess = this.board[this.row].map((cell) => cell.char);
    for (let i = 0; i < guess.length; i++) {
      if (guess[i] === target[i]) {
        this.board[this.row][i].status = "green";
        target[i] = "";
        guess[i] = "_";
      }
    }
    for (let i = 0; i < guess.length; i++) {
      if (guess[i] === "_") continue;
      const idx = target.indexOf(guess[i]);
      if (idx !== -1) {
        this.board[this.row][i].status = "yellow";
        target[idx] = "";
      } else {
        this.board[this.row][i].status = "gray";
      }
    }
  }
  private checkGameOver() {
    const greenChars = this.board[this.row - 1].filter(
      (cell) => cell.status === "green"
    );

    if (this.row >= this.targetWord.length) {
      this.gameOver = true;
      this.streakCount = 0;
      this.render.update();
      this.gameWon = false;
    }
    if (greenChars.length === this.targetWord.length) {
      setTimeout(() => {
        this.gameOver = true;
        this.streakCount++;
        this.render.update();
        this.gameWon = true;
      }, 2500);
    }
  }
  private isValidWord(word: string): boolean {
    let found = false;
    this.allWords.forEach((w) => {
      if (w === word) found = true;
    });
    return found;
  }
  public getBoardSize() {
    return this.targetWord.length;
  }
  public newWord() {
    this.gameOver = false;
    this.gameWon = false;
    this.targetWord = this.pool[Math.floor(Math.random() * this.pool.length)];

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
    setTimeout(() => this.render.update(), 200);
  }
  set solve(value: boolean) {
    this.solving = value;
  }
  get target() {
    return this.targetWord;
  }
  get streak() {
    return this.streakCount;
  }
}

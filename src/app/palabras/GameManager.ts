import Player from "./Player";
import Skill from "./Skill";
type Words = string[];
type Status = "white" | "gray" | "yellow" | "green";
type Cell = { char: string; status: Status };
type RenderFunctions = {
  update: () => void;
  animateFlip: () => void;
  animateWrong: () => void;
  setRewardDisplay: (msg: string) => void;
};

export default class GameManager {
  private player;
  public helperPanel = "";
  public gameOver = false;
  private solving = false;
  private allWords: Words;
  private pool: Words;
  public gameWon = true;
  public bonusTime = false;
  private streakCount = 0;
  private targetWord: string = "";
  private render: RenderFunctions = {
    update: () => {},
    animateFlip: () => {},
    animateWrong: () => {},
    setRewardDisplay: () => {},
  };
  public row = 0;
  private col = 0;
  public board: Cell[][];
  private alphabet = [
    "a",
    "b",
    "c",
    "d",
    "e",
    "f",
    "g",
    "h",
    "i",
    "j",
    "k",
    "l",
    "m",
    "n",
    "ñ",
    "o",
    "p",
    "q",
    "r",
    "s",
    "t",
    "u",
    "v",
    "w",
    "x",
    "y",
    "z",
  ];
  constructor(
    allWords: Words,
    pool: Words,
    update: () => void,
    animateFlip: () => void,
    animateWrong: () => void,
    setRewardDisplay: (msg: string) => void
  ) {
    this.player = new Player();
    this.allWords = allWords;
    this.pool = pool;
    this.render.update = update;
    this.render.animateFlip = animateFlip;
    this.render.animateWrong = animateWrong;
    this.render.setRewardDisplay = setRewardDisplay;
    this.board = [];
  }
  //! METODOS DE RESOLUCION DE BOARD Y GAME STATE
  public newGame() {
    this.newWord();
    this.player = new Player();
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

    if (greenChars.length === this.targetWord.length) {
      setTimeout(() => {
        this.gameOver = true;
        this.streakCount++;
        setTimeout(() => this.rewardSkillPoints(), 150);
        this.render.update();
        this.gameWon = true;
      }, 2500);
      return;
    }
    if (this.row >= this.targetWord.length) {
      this.gameOver = true;
      this.streakCount = 0;
      this.render.update();
      this.gameWon = false;
      return;
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
    this.bonusTime = false;
    this.helperPanel = "";
    //this.targetWord = this.pool[Math.floor(Math.random() * this.pool.length)];
    this.targetWord = "rodea";
    console.log(this.targetWord);
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
    this.player.skills.forEach((s) => (s.active = true));
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
  //! METODOS RPG Y DE PLAYER
  public useSkill(skillName: string) {
    const res = this.player.useSkill(skillName, this);
    this.helperPanel += res;
    this.render.update();
  }
  public getSkill(skillName: string): Skill {
    return this.player.getSkillByName(skillName);
  }
  public getPlayerPoints() {
    return this.player.skillPoints;
  }
  public getAlphabet() {
    return this.alphabet;
  }
  public rewardSkillPoints() {
    let emptyRows = 0;
    for (let i = this.getBoardSize() - 1; i >= 0; i--) {
      if (this.board[i][0].char === "") {
        emptyRows++;
      } else {
        break;
      }
    }
    let msg = "";
    if (emptyRows) {
      this.player.addSkillPoints(emptyRows + 1);
      msg += `+${emptyRows} ${emptyRows === 1 ? "fila" : "filas"} sobrantes \n`;
    }
    console.log("this.bonusTime", this.bonusTime);
    if (this.bonusTime) {
      this.player.addSkillPoints(1);
      msg += `+1 por velocidad \n`;
    }
    msg += `+1 por finalizar \n`;
    this.render.setRewardDisplay(msg);
  }
  public getYellowChars(): string[] {
    //todo buscar en toda la matriz de cells las que sean de status GRAY
    const yellowChars: string[] = [];
    for (let i = 0; i < this.board.length; i++) {
      for (let j = 0; j < this.board[i].length; j++) {
        const cell = this.board[i][j];
        if (cell.status === "yellow") {
          yellowChars.push(cell.char);
        }
      }
    }
    return yellowChars;
  }
  public getGrayChars(): string[] {
    //todo buscar en toda la matriz de cells las que sean de status GRAY
    const grayChars: string[] = [];
    for (let i = 0; i < this.board.length; i++) {
      for (let j = 0; j < this.board[i].length; j++) {
        const cell = this.board[i][j];
        if (cell.status === "gray") {
          grayChars.push(cell.char);
        }
      }
    }
    return grayChars;
  }
  public getPartialGreens(): string[] {
    const targetCopy = this.targetWord.split("");
    for (let i = 0; i < this.board.length; i++) {
      for (let j = 0; j < this.board[i].length; j++) {
        const cell = this.board[i][j];
        if (cell.status === "green") {
          targetCopy[j] = "";
        }
      }
    }
    return targetCopy;
  }
  public isSkillActive(skillName: string): boolean {
    const skill: Skill[] = this.player.skills.filter(
      (s) => s.name === skillName
    );
    if (skill[0]) return skill[0].active;
    return false;
  }
  public canAfford(skillName: string): boolean {
    const skill = this.player.skills.find((s) => s.name === skillName) as Skill;
    return this.player.skillPoints >= skill.cost;
  }
}

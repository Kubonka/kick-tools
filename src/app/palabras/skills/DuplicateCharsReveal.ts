import Skill from "../Skill";
import GameManager from "../GameManager";

export class DuplicateCharsReveal extends Skill {
  constructor() {
    super("Revelar Duplicados", 1);
  }
  getDescription(): string {
    return `Revela una o mas letras si estan duplicadas en la palabra \n\n Costo : ${this.cost.toString()}`;
  }
  use(gameManager: GameManager) {
    const targetWord = gameManager.target.split("");
    let count = 0;
    for (let i = 0; i < targetWord.length; i++) {
      const char = targetWord[i];
      if (char === "") continue;
      const duplicates = targetWord.filter((c) => c === char);
      if (duplicates.length > 1) count++;
      for (let j = 0; j < targetWord.length; j++) {
        if (targetWord[j] === char) targetWord[j] = "";
      }
    }
    if (count === 0) return "- No hay letras repetidas \n";
    return `- Hay ${count} ${
      count > 1 ? "letras repetidas" : "letra repetida"
    }\n `;
  }
}

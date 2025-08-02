import Skill from "../Skill";
import GameManager from "../GameManager";

export class CharRevealYellow extends Skill {
  constructor() {
    super("Revelar Letra Amarilla", 2);
  }

  use(gameManager: GameManager) {
    const targetWord = gameManager.target;
    const partial = gameManager.getPartialGreens();
    let found = false;
    let rndIdx = 0;
    do {
      rndIdx = Math.floor(Math.random() * targetWord.length);
      if (partial[rndIdx] !== "") {
        found = true;
      }
    } while (!found);
    return `- Existe la letra "${targetWord[rndIdx].toUpperCase()}" \n `;
  }
}

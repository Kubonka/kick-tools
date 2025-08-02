import Skill from "../Skill";
import GameManager from "../GameManager";

export class CharRevealGreen extends Skill {
  constructor() {
    super("Revelar Letra Verde", 3);
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
    return `- La letra "${targetWord[
      rndIdx
    ].toUpperCase()}" va en la posición ${(rndIdx + 1).toString()}\n`;
  }
}

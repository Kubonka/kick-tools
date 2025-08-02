import Skill from "../Skill";
import GameManager from "../GameManager";

export class CharRevealGray extends Skill {
  constructor() {
    super("Filtrar Letras Grises", 2);
  }

  use(gameManager: GameManager) {
    const usedChars = gameManager.getGrayChars();
    const alphabet = gameManager.getAlphabet();
    const targetWord = gameManager.target;
    const grayChars: string[] = [];
    for (let count = 0; count < 4; count++) {
      let found = false;
      let rndIdx = 0;
      do {
        rndIdx = Math.floor(Math.random() * alphabet.length);
        const char = alphabet[rndIdx];
        const f1 = usedChars.includes(char);
        const f2 = targetWord.split("").includes(char);
        const f3 = grayChars.includes(char);
        if (f1 || f2 || f3) {
          continue;
        } else {
          grayChars.push(char);
          found = true;
        }
      } while (!found);
    }
    return `- No existen las letras ${grayChars.map(
      (c) => `"${c.toUpperCase()}" `
    )} \n`;
  }
}

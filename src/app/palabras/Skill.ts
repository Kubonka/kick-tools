import GameManager from "./GameManager";
import Player from "./Player";

export default abstract class Skill {
  public name;
  public cost;
  public active = false;
  constructor(name: string, cost: number) {
    this.name = name;
    this.cost = cost;
  }

  abstract use(gameManager: GameManager, player: Player): void;

  getDescription(): string {
    return `${this.name} - Costo: ${this.cost} puntos`;
  }
}

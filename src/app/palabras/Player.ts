import GameManager from "./GameManager";
import Skill from "./Skill";
import { CharRevealGray } from "./skills/CharRevealGray";
import { CharRevealGreen } from "./skills/CharRevealGreen";
import { CharRevealYellow } from "./skills/CharRevealYellow";

export default class Player {
  skillPoints: number;
  skills: Skill[];
  skillPointsLimit = 10;
  //todo implementar una memoria de lo ultimo
  //todo implementar un solo uso de habilidad
  //todo implementar la habilidad en modo gris
  constructor(initialSkillPoints: number = 0) {
    this.skillPoints = initialSkillPoints;
    this.skills = [];
    this.addSkill(new CharRevealGreen());
    this.addSkill(new CharRevealYellow());
    this.addSkill(new CharRevealGray());
  }

  public addSkill(skill: Skill) {
    this.skills.push(skill);
  }

  public useSkill(name: string, gameManager: GameManager) {
    const skill = this.skills.find((s) => s.name === name);
    if (!skill) return console.warn("Skill no encontrada.");
    if (this.skillPoints < skill.cost || !skill.active) return "";
    skill.active = false;
    this.skillPoints -= skill.cost;
    return skill.use(gameManager, this);
  }

  public addSkillPoints(value: number) {
    this.skillPoints = Math.min(
      this.skillPointsLimit,
      this.skillPoints + value
    );
  }
}

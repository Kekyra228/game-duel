import Spell from "./Spell";

class Hero {
  constructor(x, y, radius, color, speed, fireRate) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
    this.dy = speed;
    this.fireRate = fireRate;
    this.spells = [];
    this.lastShot = 0;
    this.countOfHits = 0;
  }

  move(canvasWidth, canvasHeight, mousePosition) {
    // смена направления движения при достижении границы
    if (this.y + this.radius > canvasHeight || this.y - this.radius < 0) {
      this.dy *= -1;
    }
    this.y += this.dy;

    //ограничение движения в рамках холста
    if (this.x + this.radius > canvasWidth) {
      this.x = canvasWidth - this.radius;
    } else if (this.x - this.radius < 0) {
      this.x = this.radius;
    }

    // отталкивание от курсора мыши
    if (mousePosition.x !== null && mousePosition.y !== null) {
      const distance = Math.hypot(
        mousePosition.x - this.x,
        mousePosition.y - this.y
      );
      if (distance < this.radius) {
        const angle = Math.atan2(
          this.y - mousePosition.y,
          this.x - mousePosition.x
        );
        const pushStrength = 5; // сила отталкивания
        this.x += pushStrength * Math.cos(angle);
        this.y += pushStrength * Math.sin(angle);
      }
    }
  }

  //получить позицию противника, чтобы настроить направление выстрела
  getOpponent(otherHero) {
    return {
      x: otherHero.x,
      y: otherHero.y,
    };
  }
  //передает позицию противника, чтобы снаряды летели в его сторону
  shoot(currentTime, opponent) {
    if (currentTime - this.lastShot >= this.fireRate) {
      const newSpell = new Spell(
        this.x,
        this.y,
        opponent.x,
        opponent.y,
        this.color
      );
      this.spells.push(newSpell);
      this.lastShot = currentTime;
    }
  }

  updateSpells(canvasWidth, opponent) {
    this.spells = this.spells.filter((spell) => {
      spell.update();
      if (spell.isCrash(opponent)) {
        this.countOfHits++;
        console.log("попадание");
        return false; //удаление снаряда
      }
      return spell.x >= 0 && spell.x <= canvasWidth;
    });
  }

  draw(context) {
    //отрисовка героя
    context.beginPath();
    context.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    context.fillStyle = this.color;
    context.fill();
    context.closePath();

    //отрисовка снаряда
    this.spells.forEach((spell) => {
      context.beginPath();
      context.arc(spell.x, spell.y, spell.radius, 0, 2 * Math.PI);
      context.fillStyle = spell.color;
      context.fill();
      context.closePath();
    });
  }
}

export default Hero;

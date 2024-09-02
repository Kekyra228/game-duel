import Spell from "./Spell";

class Hero {
  constructor(x, y, radius, color, speed, fireRate) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
    this.dy = speed;
    this.fireRate = fireRate;
    this.projectiles = [];
    this.lastShot = 0;
  }

  move(canvasHeight) {
    //смена направления движения
    if (this.y + this.radius > canvasHeight || this.y - this.radius < 0) {
      this.dy *= -1;
    }
    this.y += this.dy;
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
    //проверка прошло ли достаточно времени с момента выстрела
    if (currentTime - this.lastShot > this.fireRate) {
      const { x, y } = this.getOpponent(opponent);
      this.projectiles.push(new Spell(this.x, this.y, x, y, this.color));
      this.lastShot = currentTime;
    }
  }

  updateProjectiles(canvasWidth) {
    this.projectiles = this.projectiles.filter((proj) => {
      proj.update();
      return proj.x >= 0 && proj.x <= canvasWidth;
    });
  }

  draw(context) {
    context.beginPath();
    context.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    context.fillStyle = this.color;
    context.fill();
    context.closePath();

    this.projectiles.forEach((proj) => proj.draw(context));
  }
}

export default Hero;

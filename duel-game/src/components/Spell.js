class Spell {
  constructor(startX, startY, targetX, targetY, color) {
    this.x = startX;
    this.y = startY;
    this.radius = 5;
    this.color = color;
    this.speed = 5;
    // Рассчитываем направление движения
    const angle = Math.atan2(targetY - startY, targetX - startX);
    this.dx = this.speed * Math.cos(angle);
    this.dy = this.speed * Math.sin(angle);
  }

  draw(context) {
    context.beginPath();
    context.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    context.fillStyle = this.color;
    context.fill();
    context.closePath();
  }

  update() {
    this.x += this.dx;
    this.y += this.dy;
  }
  // Проверка столкновения с героем
  isCrash(hero) {
    const distance = Math.hypot(this.x - hero.x, this.y - hero.y);
    return distance < this.radius + hero.radius;
  }
}

export default Spell;

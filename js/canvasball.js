//отримання елемента canvas та контексту 2d
let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");

//налаштування canvas на весь екран
function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();

//оновлення розмірів canvas при зміні розміру вікна
window.addEventListener("resize", resizeCanvas);

//конструктор Ball
let Ball = function () {
  this.radius = 20; // Розмір кульки
  //випадкова початкова позиція з урахуванням радіусу
  this.x = Math.random() * (canvas.width - 2 * this.radius) + this.radius;
  this.y = Math.random() * (canvas.height - 2 * this.radius) + this.radius;
  //випадкова швидкість з обмеженням
  this.xSpeed = Math.random() * 10 - 5;
  this.ySpeed = Math.random() * 10 - 5;
};

//метод малювання м'яча
Ball.prototype.draw = function () {
  let gradient = ctx.createLinearGradient(
    this.x - this.radius,
    this.y - this.radius,
    this.x + this.radius,
    this.y + this.radius,
  );
  gradient.addColorStop(0, "#F57F17");
  gradient.addColorStop(1, "#F57F17");

  ctx.beginPath();
  ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
  ctx.fillStyle = gradient;
  ctx.fill();
  ctx.strokeStyle = "#000000";
  ctx.stroke();

  //малюємо чорні смужки
  ctx.strokeStyle = "#000000";
  ctx.lineWidth = 2;

  let numLines = 8;
  let angleStep = (Math.PI * 2) / numLines;
  for (let i = 0; i < numLines; i++) {
    let angle = i * angleStep;
    let startX = this.x + this.radius * Math.cos(angle) * 0.5;
    let startY = this.y + this.radius * Math.sin(angle) * 0.5;
    let endX = this.x + this.radius * Math.cos(angle) * 0.9;
    let endY = this.y + this.radius * Math.sin(angle) * 0.9;

    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.lineTo(endX, endY);
    ctx.stroke();
  }
};

//метод переміщення м'яча
Ball.prototype.move = function () {
  this.x += this.xSpeed;
  this.y += this.ySpeed;
};

//метод перевірки колізій з краями canvas
Ball.prototype.checkBoundaryCollision = function () {
  if (this.x - this.radius < 0) {
    this.x = this.radius; //розташування кульки на межі
    this.xSpeed = -this.xSpeed;
  } else if (this.x + this.radius > canvas.width) {
    this.x = canvas.width - this.radius; //розташування кульки на межі
    this.xSpeed = -this.xSpeed;
  }

  if (this.y - this.radius < 0) {
    this.y = this.radius; //розташування кульки на межі
    this.ySpeed = -this.ySpeed;
  } else if (this.y + this.radius > canvas.height) {
    this.y = canvas.height - this.radius; //розташування кульки на межі
    this.ySpeed = -this.ySpeed;
  }
};

//метод перевірки колізій між кульками
Ball.prototype.checkBallCollision = function (other) {
  let dx = this.x - other.x;
  let dy = this.y - other.y;
  let distance = Math.sqrt(dx * dx + dy * dy);

  if (distance < this.radius + other.radius) {
    //обчислення нового напрямку руху після зіткнення
    let angle = Math.atan2(dy, dx);
    let speed1 = Math.sqrt(
      this.xSpeed * this.xSpeed + this.ySpeed * this.ySpeed,
    );
    let speed2 = Math.sqrt(
      other.xSpeed * other.xSpeed + other.ySpeed * other.ySpeed,
    );

    this.xSpeed = speed2 * Math.cos(angle);
    this.ySpeed = speed2 * Math.sin(angle);
    other.xSpeed = speed1 * Math.cos(angle + Math.PI);
    other.ySpeed = speed1 * Math.sin(angle + Math.PI);

    //переміщення кульок, щоб уникнути накладання
    let overlap = this.radius + other.radius - distance;
    let overlapX = (overlap / 2) * Math.cos(angle);
    let overlapY = (overlap / 2) * Math.sin(angle);

    this.x += overlapX;
    this.y += overlapY;
    other.x -= overlapX;
    other.y -= overlapY;
  }
};

//створення масиву м'ячів
let balls = [];
for (let i = 0; i < 77; i++) {
  balls.push(new Ball());
}

//головний цикл
setInterval(function () {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (let ball of balls) {
    ball.draw();
    ball.move();
    ball.checkBoundaryCollision();
  }

  //перевірка колізій між кульками
  for (let i = 0; i < balls.length; i++) {
    for (let j = i + 1; j < balls.length; j++) {
      balls[i].checkBallCollision(balls[j]);
    }
  }
}, 25);
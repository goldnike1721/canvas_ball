//отримання елемента canvas та контексту 2d
let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");

//висота футера
const footerHeight = 77;

//налаштування canvas на весь екран, враховуючи футер
function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight - footerHeight;
}
resizeCanvas();

//оновлення розмірів canvas при зміні розміру вікна
window.addEventListener("resize", resizeCanvas);

//завантаження зображення кульки
let ballImage = new Image();
ballImage.src = "img/ball.png";

//конструктор Ball
let Ball = function () {
  this.radius = 17;
  this.x = Math.random() * (canvas.width - 2 * this.radius) + this.radius;
  this.y = Math.random() * (canvas.height - 2 * this.radius) + this.radius;
  this.xSpeed = Math.random() * 7 - 3;
  this.ySpeed = Math.random() * 7 - 3;
};

//метод малювання м'яча
Ball.prototype.draw = function () {
  ctx.drawImage(
    ballImage,
    this.x - this.radius,
    this.y - this.radius,
    this.radius * 2,
    this.radius * 2,
  );
};

//метод переміщення м'яча
Ball.prototype.move = function () {
  this.x += this.xSpeed;
  this.y += this.ySpeed;
};

//метод перевірки колізій з краями canvas, враховуючи футер
Ball.prototype.checkBoundaryCollision = function () {
  if (this.x - this.radius < 0) {
    this.x = this.radius;
    this.xSpeed = -this.xSpeed;
  } else if (this.x + this.radius > canvas.width) {
    this.x = canvas.width - this.radius;
    this.xSpeed = -this.xSpeed;
  }

  if (this.y - this.radius < 0) {
    this.y = this.radius;
    this.ySpeed = -this.ySpeed;
  }

  if (this.y + this.radius > canvas.height) {
    this.y = canvas.height - this.radius;
    this.ySpeed = -this.ySpeed;
  }
};

//метод перевірки колізій між кульками
Ball.prototype.checkBallCollision = function (other) {
  let dx = this.x - other.x;
  let dy = this.y - other.y;
  let distance = Math.sqrt(dx * dx + dy * dy);

  if (distance < this.radius + other.radius) {
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
function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (let ball of balls) {
    ball.draw();
    ball.move();
    ball.checkBoundaryCollision();
  }

  for (let i = 0; i < balls.length; i++) {
    for (let j = i + 1; j < balls.length; j++) {
      balls[i].checkBallCollision(balls[j]);
    }
  }

  requestAnimationFrame(animate);
}

ballImage.onload = function () {
  animate(); //почати анімацію після завантаження зображення
};
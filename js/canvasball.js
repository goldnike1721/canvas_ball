// Отримання елементу canvas та контексту 2d
let canvas = document.getElementById('canvas');
let ctx = canvas.getContext('2d');

// Перевірка, чи вдалося отримати контекст
if (!ctx) {
    console.error("Не вдалося отримати контекст 2D. Переконайтеся, що canvas існує.");
} else {
    // Конструктор Ball
    let Ball = function () {
        this.x = 100;
        this.y = 100;
        this.xSpeed = -2;
        this.ySpeed = 3;
    };

    // Функція малювання кола
    let circle = function (x, y, radius, fillCircle) {
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2, false);
        if (fillCircle) {
            ctx.fill();
        } else {
            ctx.stroke();
        }
    };

    // Метод малювання м'яча
    Ball.prototype.draw = function () {
        ctx.fillStyle = 'blue'; // Колір заливки
        circle(this.x, this.y, 3, true);
    };

    // Метод переміщення м'яча
    Ball.prototype.move = function () {
        this.x += this.xSpeed;
        this.y += this.ySpeed;
    };

    // Метод перевірки колізій (відскакування)
    Ball.prototype.checkCollision = function () {
        if (this.x < 0 || this.x > canvas.width) {
            this.xSpeed = -this.xSpeed;
        }
        if (this.y < 0 || this.y > canvas.height) {
            this.ySpeed = -this.ySpeed;
        }
    };

    // Створення об'єкта м'яча
    let ball = new Ball();

    // Головний цикл
    setInterval(function () {
        // Очищення canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Малювання м'яча, переміщення та перевірка колізій
        ball.draw();
        ball.move();
        ball.checkCollision();

        // Обведення рамки
        ctx.strokeRect(0, 0, canvas.width, canvas.height);
    }, 30);
}

"use strict"
{
  const canvas = document.getElementById("canvasId")
  canvas.width = 300
  canvas.height = 300
  const score = document.createElement("div")
  const HP = document.createElement("div")
  score.textContent = `score: 0`
  HP.textContent = `HP: 3`
  document.body.appendChild(score)
  document.body.appendChild(HP)

  //引数の範囲でランダムな数を返す関数
  const rand = (min, max) => {
    if (max < min) {
      copyMin = min
      max = copyMin
      min = max
    }
    return Math.floor(Math.random() * (max - min) + min)
  }
  class Ball {
    constructor(_x, _y) {
      this.canvas = document.getElementById("canvasId")
      this.context = this.canvas.getContext("2d")
      this.x = _x
      this.y = _y
      this.r = 10
      this.changeX = 10
      this.changeY = 10
    }
    update() {
      this.x += this.changeX
      this.y += this.changeY
    }
    changeDirectionX() {
      this.changeX *= -1
    }
    changeDirectionY() {
      this.changeY *= -1
    }
    draw() {
      this.context.beginPath()
      this.context.fillStyle = "white"
      this.context.arc(this.x, this.y, this.r, 0, 2 * Math.PI)
      this.context.fill()
    }
  }

  class Point {
    constructor(_x, _y) {
      this.x = _x
      this.y = _y
    }
  }

  class Bar {
    constructor() {
      this.canvas = document.getElementById("canvasId")
      this.context = this.canvas.getContext("2d")
      this.width = 100
      this.height = 15
      this.ptStart = new Point(105, 285)
      this.ptEnd = new Point(
        this.ptStart.x + this.width,
        this.ptStart.y + this.height
      )
    }
    isHit(ball) {
      if (
        ball.x + ball.changeX > this.ptStart.x &&
        ball.x + ball.changeX < this.ptEnd.x &&
        ball.y + ball.changeY > this.ptStart.y &&
        ball.y + ball.changeY < this.ptEnd.y
      ) {
        return true
      } else {
        return false
      }
    }
    moveLeft() {
      if (this.ptStart.x - 20 <= 0) {
        this.ptStart.x = 0
        this.ptEnd.x = this.width
        return
      }
      this.ptStart.x -= 20
      this.ptEnd.x -= 20
    }
    moveRight() {
      if (this.ptEnd.x + 20 >= canvas.width) {
        this.ptEnd.x = canvas.width
        this.ptStart.x = this.ptEnd.x - this.width
        return
      }
      this.ptStart.x += 20
      this.ptEnd.x += 20
    }
    draw() {
      this.context.fillStyle = "white"
      this.context.fillRect(
        this.ptStart.x,
        this.ptStart.y,
        this.width,
        this.height
      )
    }
  }

  class Board {
    constructor() {
      this.canvas = document.getElementById("canvasId")
      this.context = this.canvas.getContext("2d")
      let ballX = rand(0, canvas.width)
      let ballY = rand(0, canvas.height / 2)
      this.ball = new Ball(ballX, ballY)
      this.bar = new Bar()
      this.width = 300
      this.height = 300
      this.intervalId
      this.speed = 100
      this.hitCount = 0
      this.HP = 3
      this.gameOver = false
      this.init()
    }
    init() {
      document.addEventListener("keydown", (e) => {
        if (this.gameOver == true) {
          return
        }
        switch (e.keyCode) {
          case 37: //左
            this.bar.moveLeft()
            break
          case 39: //右
            this.bar.moveRight()
            break
        }
        this.bar.draw()
      })
    }
    set() {
      this.intervalId = setInterval(() => {
        if (this.hitCount > 10) {
          this.speed = 60
          clearInterval(this.intervalId)
          this.set()
        }
        this.update()
        this.draw()
      }, this.speed)
    }
    update() {
      //barの判定
      if (this.bar.isHit(this.ball) === true) {
        this.ball.changeY *= -1
      }
      if (HP == 0) {
        clearInterval(this.intervalId)
        alert("game over")
      }
      this.ball.update()
      this.isHit()
      this.adjustAngle()
      score.textContent = `score:${this.hitCount}`
      HP.textContent = `HP:${this.HP}`
    }
    isHit() {
      if (this.ball.x > canvas.width || this.ball.x < 0) {
        this.ball.changeDirectionX()
        this.hitCount++
      }
      if (this.ball.y < 0) {
        this.ball.changeDirectionY()
        this.hitCount++
      }
      if (this.ball.y > canvas.height) {
        this.HP--
        this.hitCount = 0
        clearInterval(this.intervalId)
      }
    }
    adjustAngle() {
      document.addEventListener("keydown", (e) => {
        if (this.bar.isHit(this.ball) == true && e.keyCode == 39) {
          this.ball.changeY = 5
        } else if (this.bar.isHit(this.ball) == true && e.keyCode == 37) {
          this.ball.changeY = 15
        }
      })
    }
    draw() {
      this.context.fillStyle = "black"
      this.context.fillRect(0, 0, this.width, this.height)
      this.ball.draw()
      this.bar.draw()
    }
  }

  const board = new Board()
  board.set()
}

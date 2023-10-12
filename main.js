"use strict"
{
  const canvas = document.getElementById("canvasId")

  canvas.width = 300
  canvas.height = 300

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
      if (this.y + this.changeY >= 300 || this.y + this.changeY <= 0) {
        this.changeY *= -1
      }
      this.y += this.changeY
      if (this.x + this.changeX >= 300 || this.x + this.changeX <= 0) {
        this.changeX *= -1
      }
      this.x += this.changeX
    }
    draw() {
      this.context.beginPath()
      this.context.fillStyle = "white"
      this.context.arc(this.x, this.y, this.r, 0, 2 * Math.PI)
      this.context.fill()
    }
  }

  class Bar {
    constructor() {
      this.canvas = document.getElementById("canvasId")
      this.context = this.canvas.getContext("2d")
      class Point {
        constructor(_x, _y) {
          this.x = _x
          this.y = _y
        }
      }
      this.width = 100
      this.height = 15
      this.ptStart = new Point(100, 260)
      this.ptEnd = new Point(
        this.ptStart.x + this.width,
        this.ptStart.y + this.height
      )
    }
    move() {
      document.addEventListener("keydown", (e) => {
        switch (e.keyCode) {
          case 37: //左
            this.ptStart.x += 10
            this.draw()
            break
          case 39: //右
            this.ptStart.x -= 10
            this.draw()
            break
        }
      })
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
      this.ball = new Ball(0, 75) //決めうちの値を後で修正
      this.bar = new Bar()
      this.width = 300
      this.height = 300
      this.intervalId
    }
    set() {
      this.intervalId = setInterval(() => {
        this.update()
        this.draw()
      }, 100)
    }
    update() {
      //barの判定
      if (this.bar.isHit(this.ball) == true) {
        this.ball.changeY *= -1
      }
      this.ball.update()
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
  // board.draw()
}

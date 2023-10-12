"use strict"
{
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
      this.startingPointX = 100
      this.endPointX = this.startingPointX + this.width
      this.startingPointY = 285
      this.endPointY = this.startingPointY + this.height
      this.width = 100
      this.height = 15
    }
    move() {
      document.addEventListener("keydown", (e) => {
        switch (e.keyCode) {
          case 37: //左
            this.startingPointX += 10
            this.draw()
            break
          case 39: //右
            this.startingPointX -= 10
            this.draw()
            break
        }
      })
    }
    update() {
      if (y + changeY > startingPointY) {
        changeY *= -1
      }
      if (
        x + changeX > startingPointX &&
        x + changeX > endPointX &&
        y + changeY > startingPointY
      ) {
        changeX *= -1
      }
    }
    draw() {
      this.context.fillStyle = "white"
      this.context.fillRect(
        this.startingPointX,
        this.startingPointY,
        this.width,
        this.height
      )
    }
  }

  class Board {
    constructor() {
      this.canvas = document.getElementById("canvasId")
      this.context = this.canvas.getContext("2d")
      this.ball = new Ball(100, 75) //決めうちの値を後で修正
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
      this.ball.update()
      //barの判定
      if (this.ball.y + this.ball.changeY > this.bar.startingPointY) {
        this.ball.changeY *= -1
      }
      if (
        this.ball.x + this.ball.changeX > this.bar.startingPointX &&
        this.ball.x + this.ball.changeX > this.bar.endPointX &&
        this.ball.y + this.ball.changeY > this.bar.startingPointY
      ) {
        this.ball.changeX *= -1
      }
    }
    draw() {
      this.context.fillRect(0, 0, this.width, this.height)
      this.ball.draw()
      this.bar.draw()
    }
  }

  const board = new Board()
  board.set()
  board.draw()
}

"use strict"
{
  const canvas = document.getElementById("canvasId")
  canvas.width = 300
  canvas.height = 300
  const score = document.createElement("div")
  score.textContent = "SCORE  0"
  document.body.appendChild(score)
  const HP = document.createElement("div")
  HP.textContent = "🩷🩷🩷"
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
      this.changeX = 1
      this.changeY = 1
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
    speedUp() {
      this.changeX += this.changeX > 0 ? 1 : -1
      this.changeY += this.changeY > 0 ? 1 : -1
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
      this.ballX = rand(0, canvas.width)
      this.ballY = rand(0, canvas.height / 2)
      this.ball = new Ball(this.ballX, this.ballY)
      this.bar = new Bar()
      this.width = 300
      this.height = 300
      this.intervalId
      this.speed = 15
      this.score = 0
      this.pressedKey = undefined
      this.HitPoint = 3
      this.gameOver = false
      this.init()
    }
    init() {
      document.addEventListener("keydown", (e) => {
        if (this.gameOver == true) {
          return
        }
        this.KeyDown(e)
        switch (e.keyCode) {
          case 37: //左
            this.bar.moveLeft()
            break
          case 39: //右
            this.bar.moveRight()
            break
        }
        this.KeyUp()
        this.bar.draw()
      })
    }
    set() {
      this.intervalId = setInterval(() => {
        this.update()
        this.draw()
      }, this.speed)
    }
    update() {
      //barの判定
      if (this.bar.isHit(this.ball) === true) {
        // changeY を変えることで反射角を調整している
        const absX = Math.abs(this.ball.changeX)
        switch (this.pressedKey) {
          case "left":
            this.ball.changeY =
              this.ball.changeX > 0 ? absX * 0.8 : absX * 1.2 * -1
            break

          case "right":
            this.ball.changeY =
              this.ball.changeX > 0 ? absX * 1.2 : absX * 0.8 * -1
            break

          case undefined:
            this.ball.changeY = this.ball.changeX > 0 ? absX : absX * -1
            break
        }
        this.ball.changeDirectionY()
      }
      this.ball.update()
      if (this.isHit() == true) {
        //↑の書き方でisHit()の関数が実行される&&返値の判定もできる
        if (this.score % 5 == 0) {
          this.ball.speedUp()
        }
      }
      score.textContent = `SCORE  ${this.score}`
    }
    isHit() {
      let count = this.score
      if (this.ball.x > canvas.width || this.ball.x < 0) {
        this.ball.changeDirectionX()
        this.score++
      }
      if (this.ball.y < 0) {
        this.ball.changeDirectionY()
        this.score++
      }
      if (this.ball.y > canvas.height) {
        const count = this.HitPoint
        this.HitPoint--
        clearInterval(this.intervalId)
        this.restart(count)
      }
      if (this.HitPoint == 0) {
        this.gameOver = true
        clearInterval(this.intervalId)
        HP.textContent = `GAME OVER`
      }
      if (count !== this.score) {
        return true
      }
    }
    KeyDown(e) {
      if (e.keyCode == 37) {
        this.pressedKey = "left"
      } else if (e.keyCode == 39) {
        this.pressedKey = "right"
      }
    }
    KeyUp() {
      document.addEventListener("keyup", (e) => {
        if (e.keyCode == 37 || e.keyCode == 39) {
          this.pressedKey = undefined
        }
      })
    }
    restart(count) {
      //ゲームリスタート処理
      HP.textContent = ""
      for (let i = this.HitPoint; i > 0; i--) {
        HP.textContent += "🩷"
      }
      if (count !== this.HitPoint) {
        //ボールの位置の再定義
        this.ballX = rand(0, canvas.width)
        this.ballY = rand(0, canvas.height / 2)
        this.ball = new Ball(this.ballX, this.ballY)
        this.bar = new Bar()
        this.set()
      }
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

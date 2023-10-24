"use strict"
{
  const canvas = document.getElementById("canvasId")
  canvas.width = 300
  canvas.height = 300
  const HP = document.createElement("div")
  HP.textContent = ""
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
    get right() {
      return this.x + this.r
    }
    get left() {
      return this.x - this.r
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
      this.ptStart = new Point(105, 280)
      this.ptEnd = new Point(
        this.ptStart.x + this.width,
        this.ptStart.y + this.height
      )
    }
    isHit(ball) {
      if (
        // x,yはボールの中心座標なので、半径を考慮した判定をする
        ball.right + ball.changeX > this.ptStart.x &&
        ball.left + ball.changeX < this.ptEnd.x &&
        ball.y + ball.changeY > this.ptStart.y
        // ball.y + ball.changeY < this.ptEnd.y // Y方向の判定は１つ目のif文で判定できる
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

  class Block {
    constructor(_x, _y, _width, _height) {
      this.canvas = document.getElementById("canvasId")
      this.context = this.canvas.getContext("2d")
      this.width = _width
      this.height = _height
      this.ptStart = new Point(_x, _y)
      this.ptEnd = new Point(
        this.ptStart.x + this.width,
        this.ptStart.y + this.height
      )
      this.visible = true
      this.hit = false
    }
    isHit(ball) {
      if (
        ball.right + ball.changeX > this.ptStart.x &&
        ball.left + ball.changeX < this.ptEnd.x &&
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
      this.bar = new Bar()
      this.ballX = this.bar.ptStart.x + this.bar.width / 2
      this.ballY = this.bar.ptStart.y
      this.ball = new Ball(this.ballX, this.ballY)
      let n = Math.floor(Math.random() * 5)
      this.ballDirection = n % 2 == 0 ? 1 : -1
      this.ball.changeX = this.ballDirection
      this.width = 300
      this.height = 300

      this.blocks = this.createBlocks(8, 8)
      this.intervalId
      this.speed = 15
      this.score = 0
      this.pressedKey = undefined
      this.life = Array(3).fill("🩷")
      this.gameOver = false
      this.init()
    }
    init() {
      HP.textContent = this.life.join("")
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
            this.ball.changeY = this.ball.changeX > 0 ? absX * 0.8 : absX * 1.2
            break

          case "right":
            this.ball.changeY = this.ball.changeX > 0 ? absX * 1.2 : absX * 0.8
            break

          default:
            this.ball.changeY = absX
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

      //blockのヒット判定
      this.blocks
        .filter((block) => block.visible == true)
        .forEach((block) => {
          if (block.isHit(this.ball) == true) {
            block.visible = false
            this.score++
            this.ball.changeDirectionY()
          }
        })
    }
    isHit() {
      let count = this.score
      if (this.ball.x > canvas.width || this.ball.x < 0) {
        this.ball.changeDirectionX()
      }
      if (this.ball.y < 0) {
        this.ball.changeDirectionY()
      }
      if (this.ball.y > canvas.height) {
        this.life.pop()
        clearInterval(this.intervalId)
        this.restart()
      }
      if (this.life.length == 0) {
        this.gameOver = true
        clearInterval(this.intervalId)
        HP.textContent = `GAME OVER`
      }
      if (this.score == this.blocks.length) {
        confirm("game clear!")
        clearInterval(this.intervalId)
        return
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
    restart() {
      //ゲームリスタート処理
      HP.textContent = this.life.join("")
      if (this.life.length) {
        //ボールの位置の再定義
        this.ballX = this.bar.ptStart.x + this.bar.width / 2
        this.ballY = this.bar.ptStart.y
        this.ball = new Ball(this.ballX, this.ballY)
        let n = Math.floor(Math.random() * 5)
        this.ballDirection = n % 2 == 0 ? 1 : -1
        this.ball.changeX = this.ballDirection
        this.ball.changeY = -1
        this.set()
      }
    }
    createBlocks(_col, _row) {
      let blocks = []
      let currentBlock = new Block(0, 0, 0, 0)
      const blockRange = {
        width: this.width / _col,
        height: this.height / 2 / _row,
      }
      const margin = 5
      const blockWidth = blockRange.width - margin * 2
      const blockHeight = Math.min(15, blockRange.height - margin * 2)

      for (let row = 0; row < _row; row++) {
        currentBlock.y = row * blockRange.height
        for (let col = 0; col < _col; col++) {
          currentBlock.x = col * blockRange.width
          blocks.push(
            new Block(
              currentBlock.x + margin,
              currentBlock.y + margin,
              blockWidth,
              blockHeight
            )
          )
        }
      }
      return blocks
    }
    draw() {
      this.context.fillStyle = "black"
      this.context.fillRect(0, 0, this.width, this.height)
      this.ball.draw()
      this.bar.draw()
      this.blocks
        .filter((block) => block.visible == true)
        .forEach((block) => {
          block.draw()
        })
    }
  }

  const board = new Board()
  board.set()
}

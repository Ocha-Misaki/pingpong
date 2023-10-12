"use strict"
{
  const canvas = document.getElementById("canvasId")
  const context = canvas.getContext("2d")
  canvas.width = 300
  canvas.height = 300

  let x = 0
  let y = 75
  let barWidth = 100
  let barHeight = 15
  let startingPointX = 100
  let endPointX = startingPointX + barWidth
  let startingPointY = 285
  let endPointY = startingPointY + barHeight

  let changeY = 10
  let changeX = 10

  let intervalId = setInterval(() => {
    //boardを描画する
    context.fillRect(0, 0, canvas.width, canvas.height)
    //barを描画する
    context.strokeRect(startingPointX, startingPointY, barWidth, barHeight)
    //barの当たり判定
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
    //ボールの座標を変える
    context.beginPath()
    if (y + changeY >= 300 || y + changeY <= 0) {
      changeY *= -1
    }
    y += changeY
    if (x + changeX >= 300 || x + changeX <= 0) {
      changeX *= -1
    }
    x += changeX
    context.arc(x, y, 10, 0, 2 * Math.PI)

    //ボールを描画する
    context.strokeStyle = "white"
    context.stroke()
  }, 100)
}

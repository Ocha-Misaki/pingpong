"use strict"
{
  const canvas = document.getElementById("canvasId")
  const context = canvas.getContext("2d")
  canvas.width = 300
  canvas.height = 300

  let x = 100
  let y = 75
  let changeY = 10
  let changeX = 10
  //ボールを動かす
  let intervalId = setInterval(() => {
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
    //board
    context.fillRect(0, 0, canvas.width, canvas.height)
    //ボールを描画する
    context.strokeStyle = "white"
    context.stroke()
  }, 100)
}

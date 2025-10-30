// viewer.js — fixed grid and SVG loader

document.addEventListener("DOMContentLoaded", async () => {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  document.body.style.margin = "0";
  document.body.style.overflow = "hidden";
  document.body.appendChild(canvas);

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    drawGrid();
  }
  window.addEventListener("resize", resizeCanvas);
  resizeCanvas();

  // Draw the grid
  function drawGrid() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = "#ddd";
    ctx.lineWidth = 1;
    for (let x = 0; x < canvas.width; x += 50) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);
      ctx.stroke();
    }
    for (let y = 0; y < canvas.height; y += 50) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.stroke();
    }
  }

  // Load the SVG
  async function loadSVG() {
    try {
      const res = await fetch("test.svg");
      if (!res.ok) throw new Error("SVG not found");
      const svgText = await res.text();

      const img = new Image();
      const svgBlob = new Blob([svgText], { type: "image/svg+xml;charset=utf-8" });
      const url = URL.createObjectURL(svgBlob);

      img.onload = () => {
        ctx.drawImage(img, 100, 100);
        URL.revokeObjectURL(url);
      };
      img.src = url;
    } catch (err) {
      console.error("Error loading SVG:", err);
      ctx.fillStyle = "red";
      ctx.font = "18px monospace";
      ctx.fillText("⚠️ Error loading test.svg", 20, 40);
    }
  }

  // Show coordinates
  canvas.addEventListener("mousemove", (e) => {
    drawGrid();
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left).toFixed(3);
    const y = (e.clientY - rect.top).toFixed(3);
    ctx.fillStyle = "black";
    ctx.font = "14px monospace";
    ctx.fillText(`X: ${x}″ | Y: ${y}″`, 10, 20);
  });

  drawGrid();
  loadSVG();
});

// viewer.js — loads and displays test.svg automatically

document.addEventListener("DOMContentLoaded", async () => {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  document.body.style.margin = "0";
  document.body.appendChild(canvas);

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  window.addEventListener("resize", resizeCanvas);
  resizeCanvas();

  // Draw grid background
  function drawGrid() {
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

  // Load and display the SVG
  async function loadSVG() {
    try {
      const response = await fetch("test.svg");
      const svgText = await response.text();

      // Create an image from the SVG text
      const img = new Image();
      const svgBlob = new Blob([svgText], { type: "image/svg+xml;charset=utf-8" });
      const url = URL.createObjectURL(svgBlob);

      img.onload = () => {
        drawGrid();
        const scale = 1.0;
        ctx.drawImage(img, 50, 50, img.width * scale, img.height * scale);
        URL.revokeObjectURL(url);
      };
      img.src = url;
    } catch (error) {
      console.error("Failed to load SVG:", error);
    }
  }

  drawGrid();
  loadSVG();

  // Track mouse position
  canvas.addEventListener("mousemove", (e) => {
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left).toFixed(3);
    const y = (e.clientY - rect.top).toFixed(3);
    ctx.clearRect(0, 0, 180, 20);
    ctx.fillStyle = "#000";
    ctx.font = "14px monospace";
    ctx.fillText(`X: ${x}″ | Y: ${y}″`, 10, 15);
  });
});

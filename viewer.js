// CNC Viewer 2D — fixed version
const canvas = document.createElement('canvas');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
document.body.style.margin = '0';
document.body.appendChild(canvas);
const ctx = canvas.getContext('2d');

// Draw background grid
function drawGrid() {
  const gridSize = 50;
  ctx.fillStyle = '#add8e6';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
  ctx.lineWidth = 1;
  for (let x = 0; x < canvas.width; x += gridSize) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, canvas.height);
    ctx.stroke();
  }
  for (let y = 0; y < canvas.height; y += gridSize) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(canvas.width, y);
    ctx.stroke();
  }
}

// Load and draw SVG properly from URL
async function loadSVG(url) {
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error('SVG fetch failed');
    const text = await res.text();
    const img = new Image();
    const svgBlob = new Blob([text], { type: 'image/svg+xml;charset=utf-8' });
    const svgUrl = URL.createObjectURL(svgBlob);
    img.onload = function () {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      drawGrid();
      const scale = 1.0;
      const x = (canvas.width - img.width * scale) / 2;
      const y = (canvas.height - img.height * scale) / 2;
      ctx.drawImage(img, x, y, img.width * scale, img.height * scale);
      URL.revokeObjectURL(svgUrl);
    };
    img.src = svgUrl;
  } catch (err) {
    console.error('Error loading SVG:', err);
  }
}

// Coordinate tracker overlay
const coordBox = document.createElement('div');
coordBox.style.position = 'fixed';
coordBox.style.top = '10px';
coordBox.style.left = '10px';
coordBox.style.background = 'white';
coordBox.style.padding = '3px 8px';
coordBox.style.borderRadius = '5px';
coordBox.style.fontFamily = 'monospace';
document.body.appendChild(coordBox);

canvas.addEventListener('mousemove', (e) => {
  const rect = canvas.getBoundingClientRect();
  const x = ((e.clientX - rect.left) / 96).toFixed(3); // 96 px ≈ 1 inch
  const y = ((e.clientY - rect.top) / 96).toFixed(3);
  coordBox.textContent = `X: ${x}" | Y: ${y}"`;
});

// Initialize grid + SVG
drawGrid();
loadSVG('https://raw.githubusercontent.com/scotttwombley-byte/CNC_viewer/refs/heads/main/test.svg');

// viewer.js
const canvas = document.createElement('canvas');
canvas.id = 'cncCanvas';
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
document.body.appendChild(canvas);

const ctx = canvas.getContext('2d');
ctx.fillStyle = '#b0d0ee';
ctx.fillRect(0, 0, canvas.width, canvas.height);

// Draw grid
const gridSize = 60;
ctx.strokeStyle = 'rgba(255,255,255,0.5)';
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

// Load SVG
async function loadSVG(file) {
  const response = await fetch(file);
  const text = await response.text();
  const svgBlob = new Blob([text], { type: 'image/svg+xml' });
  const url = URL.createObjectURL(svgBlob);
  const img = new Image();
  img.onload = function () {
    const scale = 1.5;
    const x = (canvas.width - img.width * scale) / 2;
    const y = (canvas.height - img.height * scale) / 2;
    ctx.drawImage(img, x, y, img.width * scale, img.height * scale);
    URL.revokeObjectURL(url);
  };
  img.src = url;
}

loadSVG('test.svg');


// Coordinate tracker
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
  const x = (e.clientX - rect.left).toFixed(3);
  const y = (e.clientY - rect.top).toFixed(3);
  coordBox.textContent = `X: ${x}" | Y: ${y}"`;
});

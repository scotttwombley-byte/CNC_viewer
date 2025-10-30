const svg = document.getElementById('cncCanvas');

// Load panels SVG
fetch('data/panels.svg')
  .then(res => res.text())
  .then(svgContent => {
    svg.innerHTML = svgContent;
    initPanZoom();
  });

function initPanZoom() {
  let panX = 0, panY = 0, scale = 1;
  let isDragging = false;
  let startX, startY;

  const updateView = () => {
    svg.setAttribute('viewBox', `${-panX} ${-panY} ${800 / scale} ${600 / scale}`);
  };

  svg.addEventListener('mousedown', e => {
    isDragging = true;
    startX = e.clientX;
    startY = e.clientY;
  });

  svg.addEventListener('mousemove', e => {
    if (!isDragging) return;
    panX += (e.clientX - startX) / scale;
    panY += (e.clientY - startY) / scale;
    startX = e.clientX;
    startY = e.clientY;
    updateView();
  });

  svg.addEventListener('mouseup', () => (isDragging = false));
  svg.addEventListener('mouseleave', () => (isDragging = false));

  svg.addEventListener('wheel', e => {
    e.preventDefault();
    const delta = e.deltaY < 0 ? 1.1 : 0.9;
    scale *= delta;
    updateView();
  });

  updateView();
}
const svg = document.getElementById("cnc-svg");
const coords = document.getElementById("coords");

let viewBox = { x: 0, y: 0, w: window.innerWidth, h: window.innerHeight };
let isPanning = false;
let startX, startY;

function loadSVG() {
  fetch("assets/test.svg")
    .then(r => r.text())
    .then(d => svg.innerHTML = d);
}

function updateCoords(evt) {
  const pt = svg.createSVGPoint();
  pt.x = evt.clientX;
  pt.y = evt.clientY;
  const cursor = pt.matrixTransform(svg.getScreenCTM().inverse());
  coords.textContent = `X: ${cursor.x.toFixed(3)}″ | Y: ${cursor.y.toFixed(3)}″`;
}

svg.addEventListener("mousedown", e => {
  isPanning = true;
  startX = e.clientX;
  startY = e.clientY;
  svg.style.cursor = "grabbing";
});
svg.addEventListener("mouseup", () => {
  isPanning = false;
  svg.style.cursor = "grab";
});
svg.addEventListener("mousemove", e => {
  updateCoords(e);
  if (!isPanning) return;
  const dx = startX - e.clientX;
  const dy = startY - e.clientY;
  viewBox.x += dx;
  viewBox.y += dy;
  startX = e.clientX;
  startY = e.clientY;
  svg.setAttribute("viewBox", `${viewBox.x} ${viewBox.y} ${viewBox.w} ${viewBox.h}`);
});
svg.addEventListener("wheel", e => {
  e.preventDefault();
  const scale = e.deltaY < 0 ? 0.9 : 1.1;
  viewBox.w *= scale;
  viewBox.h *= scale;
  svg.setAttribute("viewBox", `${viewBox.x} ${viewBox.y} ${viewBox.w} ${viewBox.h}`);
});
window.addEventListener("resize", () => {
  viewBox.w = window.innerWidth;
  viewBox.h = window.innerHeight;
  svg.setAttribute("viewBox", `${viewBox.x} ${viewBox.y} ${viewBox.w} ${viewBox.h}`);
});
loadSVG();
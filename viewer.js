const dropzone = document.getElementById('dropzone');
const canvas = document.getElementById('viewer');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth * 0.8;
canvas.height = window.innerHeight * 0.6;

function loadImage(src) {
  const img = new Image();
  img.onload = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const scale = Math.min(canvas.width / img.width, canvas.height / img.height);
    const x = (canvas.width - img.width * scale) / 2;
    const y = (canvas.height - img.height * scale) / 2;
    ctx.drawImage(img, x, y, img.width * scale, img.height * scale);
  };
  img.src = src;
}

dropzone.onclick = () => {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = 'image/*,.svg';
  input.onchange = (e) => {
    const file = e.target.files[0];
    if (file) loadImage(URL.createObjectURL(file));
  };
  input.click();
};

dropzone.ondragover = (e) => {
  e.preventDefault();
  dropzone.style.background = '#444';
};
dropzone.ondragleave = () => (dropzone.style.background = '#2c2c2c');
dropzone.ondrop = (e) => {
  e.preventDefault();
  dropzone.style.background = '#2c2c2c';
  const file = e.dataTransfer.files[0];
  if (file) loadImage(URL.createObjectURL(file));
};

window.onload = () => {
  // Load default file if exists
  fetch('test.svg')
    .then((r) => (r.ok ? r.text() : null))
    .then((text) => {
      if (text) {
        const blob = new Blob([text], { type: 'image/svg+xml' });
        const url = URL.createObjectURL(blob);
        loadImage(url);
      }
    });
};

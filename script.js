const canvas = document.getElementById('signatureCanvas');
const ctx = canvas.getContext('2d');
let isDrawing = false;
let isErasing = false;
let lastX = 0;
let lastY = 0;
let color = '#000000';
let fontSize = 'medium';
let eraserSize = 20; // Initial eraser size
let eraserCircle = null; // Variable to hold the eraser circle

canvas.addEventListener('mousedown', (e) => {
  isDrawing = true;
  if (isErasing) {
    createEraserCircle();
  } else {
    [lastX, lastY] = [e.offsetX, e.offsetY];
  }
});

canvas.addEventListener('mousemove', (e) => {
  if (isDrawing && !isErasing) {
    ctx.beginPath();
    ctx.moveTo(lastX, lastY);
    ctx.lineTo(e.offsetX, e.offsetY);
    ctx.strokeStyle = color;
    ctx.lineWidth = getLineWidth(fontSize);
    ctx.stroke();
    [lastX, lastY] = [e.offsetX, e.offsetY];
  } else if (isDrawing && isErasing) {
    eraseAtPosition(e.offsetX, e.offsetY);
  }
});

canvas.addEventListener('mouseup', () => {
  isDrawing = false;
  if (isErasing) {
    removeEraserCircle();
  }
});

canvas.addEventListener('mouseout', () => {
  isDrawing = false;
  if (isErasing) {
    removeEraserCircle();
  }
});

function clearCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function downloadSignature() {
  const tempCanvas = document.createElement('canvas');
  const tempCtx = tempCanvas.getContext('2d');
  tempCanvas.width = canvas.width;
  tempCanvas.height = canvas.height;

  // Set background color to white
  tempCtx.fillStyle = 'white';
  tempCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);

  // Draw the signature
  tempCtx.drawImage(canvas, 0, 0);

  const image = new Image();
  image.src = tempCanvas.toDataURL('image/jpeg');
  const link = document.createElement('a');
  link.href = image.src;
  link.download = 'signature.jpg';
  link.click();
}

function toggleEraser() {
  isErasing = !isErasing;
  if (isErasing) {
    createEraserCircle();
  } else {
    removeEraserCircle();
  }
}

function createEraserCircle() {
  if (!eraserCircle) {
    eraserCircle = document.createElement('div');
    eraserCircle.style.position = 'absolute';
    eraserCircle.style.width = `${eraserSize * 2}px`;
    eraserCircle.style.height = `${eraserSize * 2}px`;
    eraserCircle.style.borderRadius = '50%';
    eraserCircle.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
    document.getElementById('eraserContainer').appendChild(eraserCircle);
  }
}

function removeEraserCircle() {
  if (eraserCircle) {
    document.getElementById('eraserContainer').removeChild(eraserCircle);
    eraserCircle = null;
  }
}

function eraseAtPosition(x, y) {
  ctx.globalCompositeOperation = 'destination-out';
  ctx.beginPath();
  ctx.arc(x, y, eraserSize, 0, Math.PI * 2);
  ctx.fill();
  ctx.globalCompositeOperation = 'source-over';
}

function getLineWidth(size) {
  switch (size) {
    case 'small':
      return 1;
    case 'medium':
      return 3;
    case 'large':
      return 5;
    default:
      return 3;
  }
}

document.getElementById('colorPicker').addEventListener('change', (e) => {
  color = e.target.value;
});

document.getElementById('fontSizeSelector').addEventListener('change', (e) => {
  fontSize = e.target.value;
});

document.getElementById('eraserSizeSelector').addEventListener('change', (e) => {
  eraserSize = parseInt(e.target.value);
});

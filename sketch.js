let resultDiv;

let nnModel;

let labels = [
  'Cat',
  'Rainbow',
  'Train'
];

async function setup() {
  let canvas = createCanvas(320, 320);
  canvas.html('<div class="warning"><h1> :( </h1> <p style="font-style: italic">Your browser does not support HTML5 canvas, or JavaScript is disabled. Please upgrade your browser to view this interactive experience.</p></div>');
  
  background(255);

  const guessBtn = select('#guess');
  const cls = select('#cls');

  guessBtn.mousePressed(guess);
  cls.mousePressed(clearScreen);

  resultDiv = select('#result');

  await tf.setBackend('cpu');
  
  try {
    nnModel = await tf.loadGraphModel('./dp_image_classification_model/model.json');
  } catch (e) {
    console.error(e)
  }
}

function guess() {
  console.log('guess');
  let inputs = [];
  let img = get();
  img.resize(28, 28);
  img.pixelDensity(1);

  img.loadPixels();
  for (let i = 0; i < 784; i++) {
    inputs[i] = 1 - img.pixels[i * 4] / 255;
  }

  tf.tidy(() => {
    let inputTf = tf.tensor2d([inputs]);
    let prediction = nnModel.predict(inputTf);
    let result = tf.argMax(prediction, 1).dataSync();
    let confidence = prediction.dataSync()[result[0]] * 100;

    resultDiv.html(`${labels[result[0]]}, Confidence = ${nf(confidence, 2, 2)}%`);
  });
}

function clearScreen() {
  background(255);
}

function draw() {
  stroke(0);
  strokeWeight(16);

  if (mouseIsPressed) {
    if (pmx < 0 || pmy < 0) {
      pmx = mouseX;
      pmy = mouseY;
    } else {
      pmx = pmouseX;
      pmy = pmouseY;
    }

    line(pmx, pmy, mouseX, mouseY);
  } else {
    // Solving touchscreen user problem
    pmx = -1;
    pmy = -1;
  }
}
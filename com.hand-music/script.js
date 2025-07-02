let video;
let handposeModel;
let hands = [];

function setup() {
  // Crea il canvas e lo posiziona in alto a sinistra
  let cnv = createCanvas(640, 480);
  cnv.position(0, 0);

  video = createCapture(VIDEO, videoReady);
  video.size(640, 480);
  // video.hide(); // Lascia commentato per debug

  // Crea il modello handpose e collega la callback
  handposeModel = ml5.handpose(video, modelReady);
  handposeModel.on('predict', gotHands);
}

function modelReady() {
  console.log('Modello handpose pronto!');
}

// Verifica che il video sia pronto
function videoReady() {
  console.log('Video pronto:', video.elt);
  if (!video.elt || video.elt.readyState < 2) {
    alert('Errore: il video non è pronto o non è stato caricato correttamente.');
  } else {
    video.elt.style.border = '2px solid green';
  }
}

function draw() {
  // Controllo se il video è pronto
  if (video && video.loadedmetadata) {
    image(video, 0, 0, width, height);
  } else {
    background(50);
    fill(255,0,0);
    textSize(24);
    textAlign(CENTER, CENTER);
    text('Video non pronto', width/2, height/2);
    return;
  }

  // Disegna le mani rilevate
  for (let i = 0; i < hands.length; i++) {
    let hand = hands[i];
    // hand.landmarks è un array di punti [x, y, z]
    for (let j = 0; j < hand.landmarks.length; j++) {
      let [x, y, z] = hand.landmarks[j];
      fill(0, 255, 0);
      noStroke();
      circle(x, y, 10);
    }
    // Disegna le linee tra i punti della mano (opzionale, per visualizzare la struttura)
    drawHandConnections(hand.landmarks);
  }
}

// Funzione per disegnare le connessioni tra i punti della mano
function drawHandConnections(landmarks) {
  // Connessioni standard delle dita (dalla documentazione handpose)
  const fingers = [
    [0, 1, 2, 3, 4],      // Pollice
    [0, 5, 6, 7, 8],      // Indice
    [0, 9, 10, 11, 12],   // Medio
    [0, 13, 14, 15, 16],  // Anulare
    [0, 17, 18, 19, 20]   // Mignolo
  ];
  stroke(255, 0, 0);
  strokeWeight(2);
  for (let f = 0; f < fingers.length; f++) {
    for (let k = 0; k < fingers[f].length - 1; k++) {
      let idxA = fingers[f][k];
      let idxB = fingers[f][k + 1];
      let [xA, yA] = landmarks[idxA];
      let [xB, yB] = landmarks[idxB];
      line(xA, yA, xB, yB);
    }
  }
}

// Callback function per handpose
function gotHands(results) {
  hands = results;
  console.log('Risultati handpose:', results);
  if (results.length === 0) {
    // Mostra un messaggio a schermo se nessuna mano viene rilevata
    document.getElementById('handpose-warning')?.remove();
    let warning = document.createElement('div');
    warning.id = 'handpose-warning';
    warning.style.position = 'absolute';
    warning.style.top = '10px';
    warning.style.left = '10px';
    warning.style.background = 'rgba(255,255,0,0.8)';
    warning.style.padding = '8px 16px';
    warning.style.zIndex = 1000;
    warning.style.fontSize = '18px';
    warning.innerText = 'Nessuna mano rilevata!';
    document.body.appendChild(warning);
  } else {
    document.getElementById('handpose-warning')?.remove();
  }
}

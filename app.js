// Configuración de Firebase (Compat SDK)
const firebaseConfig = {
  apiKey: "AIzaSyDvoniQYLcoBcL0F_n_KoGo4ZYLAKwSooA",
  authDomain: "carta-de-coches.firebaseapp.com",
  databaseURL: "https://carta-de-coches-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "carta-de-coches",
  storageBucket: "carta-de-coches.appspot.com",
  messagingSenderId: "785928361183",
  appId: "1:785928361183:web:4af4c916880d4af760056a",
  measurementId: "G-86CPWHYRHS"
};

// Inicializar Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.database();

let jugadorId;
let partidaId = prompt("Ingresa código de partida o deja en blanco para crear:");
let turnoActual = "";
let cartas = [];

// Cartas iniciales
const cartasBase = [
  {id:1, marca:"Ferrari", modelo:"LaFerrari", velocidad:350, caballos:963, peso:1585, imagenUrl:"https://i.imgur.com/1.jpg"},
  {id:2, marca:"Lamborghini", modelo:"Aventador", velocidad:355, caballos:730, peso:1575, imagenUrl:"https://i.imgur.com/2.jpg"},
  {id:3, marca:"Porsche", modelo:"911 GT3", velocidad:318, caballos:502, peso:1430, imagenUrl:"https://i.imgur.com/3.jpg"}
];

// Autenticación anónima
auth.signInAnonymously().then(user => {
  jugadorId = user.user.uid;
  if (!partidaId) crearPartida();
  else unirsePartida(partidaId);
});

// Crear partida
function crearPartida() {
  partidaId = Math.random().toString(36).substr(2,5).toUpperCase();

  // Se crea el nodo de partida con el primer jugador
  db.ref("partidas/" + partidaId).set({
    jugadores: {
      [jugadorId]: {cartas: cartasBase, nombre:"Jugador1"}
    },
    turno: jugadorId,
    elecciones: {}
  });

  escucharPartida();
  alert("Partida creada: " + partidaId + "\nComparte este código con otros jugadores.");
}

// Unirse a partida (corregido)
function unirsePartida(id) {
  const jugadorNombre = "Jugador" + Math.floor(Math.random()*100);
  const partidaRef = db.ref("partidas/" + id);

  partidaRef.once("value").then(snapshot => {
    const data = snapshot.val();
    if(!data) {
      alert("La partida no existe.");
      return;
    }

    // Añadir jugador nuevo si no existía
    if(!data.jugadores[jugadorId]){
      data.jugadores[jugadorId] = {cartas: cartasBase, nombre: jugadorNombre};
      partidaRef.child("jugadores").set(data.jugadores);

      // Si no existe turnoActual, asignamos al primer jugador
      if(!data.turno) {
        partidaRef.child("turno").set(jugadorId);
      }
    }

    partidaId = id;
    escucharPartida();
  });
}

// Escuchar cambios en la partida
function escucharPartida() {
  db.ref("partidas/" + partidaId).on("value", snapshot => {
    const data = snapshot.val();
    if (!data) return;

    turnoActual = data.turno;
    cartas = data.jugadores[jugadorId]?.cartas || [];
    mostrarCartas(cartas);

    const nombreTurno = data.jugadores[turnoActual]?.nombre || turnoActual;
    document.getElementById("info").innerText = "Turno actual: " + nombreTurno;

    const elecciones = data.elecciones || {};
    if(Object.keys(elecciones).length >= Object.keys(data.jugadores).length){
      compararAtributos(elecciones, data.jugadores);
    }
  });
}

// Mostrar cartas del jugador
function mostrarCartas(lista) {
  const cont = document.getElementById("cartas");
  cont.innerHTML = "";
  lista.forEach(c => {
    const div = document.createElement("div");
    div.className = "carta";
    div.innerHTML = `
      <img src="${c.imagenUrl}" alt="${c.marca} ${c.modelo}">
      <strong>${c.marca} ${c.modelo}</strong><br>
      Vel: ${c.velocidad} km/h<br>
      Cab: ${c.caballos} CV<br>
      Peso: ${c.peso} kg<br>
      <button onclick="elegirAtributo(${c.id}, 'velocidad')">Velocidad</button>
      <button onclick="elegirAtributo(${c.id}, 'caballos')">Caballos</button>
      <button onclick="elegirAtributo(${c.id}, 'peso')">Peso</button>
    `;
    cont.appendChild(div);
  });
}

// Elegir atributo
function elegirAtributo(cartaId, atributo) {
  if (turnoActual !== jugadorId) {
    alert("No es tu turno");
    return;
  }
  db.ref("partidas/" + partidaId + "/elecciones/" + jugadorId).set({cartaId, atributo});
}

// Comparar atributos y determinar ganador
function compararAtributos(elecciones, jugadores) {
  const [first] = Object.values(elecciones);
  const atributo = first.atributo;

  let resultados = [];
  for(const [jid, ele] of Object.entries(elecciones)){
    const carta = jugadores[jid].cartas.find(c=>c.id==ele.cartaId);
    resultados.push({jid, valor: carta[atributo], carta: carta});
  }

  resultados.sort((a,b)=>b.valor - a.valor);
  const ganador = resultados[0].jid;

  // Repartir cartas perdedoras al ganador
  for(const r of resultados){
    if(r.jid !== ganador){
      jugadores[ganador].cartas.push(r.carta);
      jugadores[r.jid].cartas = jugadores[r.jid].cartas.filter(c=>c.id!==r.carta.id);
    }
  }

  db.ref("partidas/" + partidaId + "/jugadores").set(jugadores);
  db.ref("partidas/" + partidaId + "/turno").set(ganador);
  db.ref("partidas/" + partidaId + "/elecciones").remove();

  document.getElementById("ultimogano").innerText = "Última ronda: Ganador = " + jugadores[ganador].nombre;
}

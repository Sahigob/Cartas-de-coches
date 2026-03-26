// =======================
// FIREBASE
// =======================
const firebaseConfig = {
  apiKey: "AIzaSyDvoniQYLcoBcL0F_n_KoGo4ZYLAKwSooA",
  authDomain: "carta-de-coches.firebaseapp.com",
  databaseURL: "https://carta-de-coches-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "carta-de-coches",
  storageBucket: "carta-de-coches.appspot.com",
  messagingSenderId: "785928361183",
  appId: "1:785928361183:web:4af4c916880d4af760056a"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.database();

// =======================
// VARIABLES
// =======================
let jugadorId = null;
let partidaId = null;
let turnoActual = null;
let cartasJugador = [];
let cartasOponentes = [];
const numJugadores = 2;

// =======================
// CARTAS (ejemplo con 4 cartas, añade las 36)
// =======================
const cartasBase = [
  {id:1, marca:"Ferrari", modelo:"SF90", CV:1000, maxKMH:340, peso:1570, imagenUrl:"https://i.imgur.com/ferrari-sf90.jpg"},
  {id:2, marca:"Lamborghini", modelo:"Aventador", CV:770, maxKMH:350, peso:1575, imagenUrl:"https://i.imgur.com/lamborghini-aventador.jpg"},
  {id:3, marca:"Porsche", modelo:"911", CV:500, maxKMH:318, peso:1430, imagenUrl:"https://i.imgur.com/porsche-911gt3.jpg"},
  {id:4, marca:"McLaren", modelo:"720S", CV:720, maxKMH:341, peso:1419, imagenUrl:"https://i.imgur.com/mclaren-720s.jpg"}
];

// =======================
// FUNCIONES AUXILIARES
// =======================
function barajar(array){
  return array.sort(()=>Math.random()-0.5);
}

// =======================
// CREAR PARTIDA
// =======================
function crearPartida(){
  const id = Math.floor(Math.random()*9000)+1000;
  partidaId = id;
  jugadorId = "jugador0";

  const baraja = barajar([...cartasBase]);
  const mitad = Math.floor(baraja.length/2);

  db.ref("partidas/"+id).set({
    jugadores: {
      jugador0: { cartas: baraja.slice(0, mitad) },
      jugador1: { cartas: baraja.slice(mitad) }
    },
    turno: "jugador0"
  });

  alert("Código de partida: " + id);

  escucharPartida();
}

// =======================
// UNIRSE A PARTIDA
// =======================
function unirsePartida(){
  const id = document.getElementById("codigo").value;
  partidaId = id;

  const partidaRef = db.ref("partidas/"+id);

  partidaRef.once("value").then(snap=>{
    const data = snap.val();
    if(!data){
      alert("La partida no existe");
      return;
    }

    const jugadoresExistentes = Object.keys(data.jugadores);
    if(jugadoresExistentes.includes("jugador0") && jugadoresExistentes.includes("jugador1")){
      alert("La partida ya tiene 2 jugadores");
      return;
    }

    jugadorId = jugadoresExistentes.includes("jugador0") ? "jugador1" : "jugador0";

    // Repartir cartas al jugador nuevo
    const baraja = barajar([...cartasBase]);
    const mitad = Math.floor(baraja.length/2);
    const cartasNuevas = jugadorId==="jugador0" ? baraja.slice(0,mitad) : baraja.slice(mitad);

    // ✅ IMPORTANTE: update para no borrar al jugador1 existente
    const obj = {};
    obj['jugadores/' + jugadorId] = { cartas: cartasNuevas };
    partidaRef.update(obj);

    escucharPartida();
  });
}

// =======================
// ESCUCHAR PARTIDA
// =======================
function escucharPartida(){
  db.ref("partidas/"+partidaId).on("value", snap=>{
    const data = snap.val();
    if(!data) return;

    turnoActual = data.turno;

    if(!data.jugadores[jugadorId]) return;

    cartasJugador = data.jugadores[jugadorId].cartas;
    cartasOponentes = Object.entries(data.jugadores)
                           .filter(([k])=>k!==jugadorId)
                           .map(([k,v])=>v.cartas);

    mostrarCarta();
  });
}

// =======================
// MOSTRAR CARTA
// =======================
function mostrarCarta(){
  const div = document.getElementById("cartaJugador");

  if(!cartasJugador || cartasJugador.length===0){
    div.innerHTML = "<h3>Sin cartas</h3>";
    return;
  }

  const c = cartasJugador[0];

  div.innerHTML = `
    <h2>${c.marca} ${c.modelo}</h2>
    <img src="${c.imagenUrl}" width="250"><br>

    <button onclick="jugar('CV')">CV: ${c.CV}</button>
    <button onclick="jugar('maxKMH')">Velocidad: ${c.maxKMH}</button>
    <button onclick="jugar('peso')">Peso: ${c.peso}</button>

    <p>${turnoActual===jugadorId ? "TU TURNO" : "ESPERA TURNO..."}</p>
  `;
}

// =======================
// JUGAR TURNO
// =======================
function jugar(atributo){
  if(turnoActual!==jugadorId){
    alert("No es tu turno");
    return;
  }

  db.ref("partidas/"+partidaId).once("value").then(snap=>{
    const data = snap.val();
    if(!data) return;

    const c0 = data.jugadores.jugador0.cartas[0];
    const c1 = data.jugadores.jugador1.cartas[0];

    let ganador = c0[atributo] >= c1[atributo] ? "jugador0" : "jugador1";

    // Mover cartas al ganador
    const carta0 = data.jugadores.jugador0.cartas.shift();
    const carta1 = data.jugadores.jugador1.cartas.shift();

    data.jugadores[ganador].cartas.push(carta0, carta1);

    // Cambiar turno al ganador
    data.turno = ganador;

    db.ref("partidas/"+partidaId).set(data);
  });
}

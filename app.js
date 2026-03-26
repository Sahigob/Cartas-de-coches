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
let numJugadores = 2;

// =======================
// TUS 36 CARTAS (NO TOCAR)
const cartasBase = [
    {id:1, marca:"Ferrari", modelo:"SF90", cilindrada:3990, longitud:4710, anchura:1972, altura:1180, cilindros:8, CV:1000, maxKMH:340, peso:1570, aceleracion:2.5, consumo:12.0, precio:450000, imagenUrl:"https://i.imgur.com/ferrari-sf90.jpg"},
  {id:2, marca:"Lamborghini", modelo:"Aventador SVJ", cilindrada:6498, longitud:4980, anchura:2030, altura:1136, cilindros:12, CV:770, maxKMH:350, peso:1575, aceleracion:2.8, consumo:15.0, precio:517000, imagenUrl:"https://i.imgur.com/lamborghini-aventador.jpg"},
  {id:3, marca:"Porsche", modelo:"911 GT3", cilindrada:3996, longitud:4579, anchura:1852, altura:1250, cilindros:6, CV:502, maxKMH:318, peso:1430, aceleracion:3.4, consumo:13.0, precio:180000, imagenUrl:"https://i.imgur.com/porsche-911gt3.jpg"},
  {id:4, marca:"McLaren", modelo:"720S", cilindrada:3994, longitud:4543, anchura:1946, altura:1199, cilindros:8, CV:720, maxKMH:341, peso:1419, aceleracion:2.9, consumo:11.8, precio:310000, imagenUrl:"https://i.imgur.com/mclaren-720s.jpg"},
  {id:5, marca:"Aston Martin", modelo:"DB11", cilindrada:3992, longitud:4710, anchura:1948, altura:1270, cilindros:8, CV:630, maxKMH:322, peso:1760, aceleracion:3.9, consumo:13.2, precio:205000, imagenUrl:"https://i.imgur.com/aston-db11.jpg"},
  {id:6, marca:"Audi", modelo:"R8 V10", cilindrada:5204, longitud:4427, anchura:1940, altura:1240, cilindros:10, CV:610, maxKMH:330, peso:1650, aceleracion:3.2, consumo:13.0, precio:195000, imagenUrl:"https://i.imgur.com/audi-r8.jpg"},
  {id:7, marca:"BMW", modelo:"M8", cilindrada:4395, longitud:4899, anchura:1902, altura:1363, cilindros:8, CV:625, maxKMH:305, peso:1935, aceleracion:3.2, consumo:12.5, precio:145000, imagenUrl:"https://i.imgur.com/bmw-m8.jpg"},
  {id:8, marca:"Mercedes", modelo:"AMG GT R", cilindrada:3982, longitud:4564, anchura:1940, altura:1292, cilindros:8, CV:585, maxKMH:318, peso:1630, aceleracion:3.6, consumo:12.5, precio:160000, imagenUrl:"https://i.imgur.com/mercedes-amg-gt.jpg"},
  {id:9, marca:"Jaguar", modelo:"F-Type R", cilindrada:5000, longitud:4470, anchura:1920, altura:1310, cilindros:8, CV:575, maxKMH:300, peso:1745, aceleracion:3.9, consumo:13.5, precio:120000, imagenUrl:"https://i.imgur.com/jaguar-ftype.jpg"},
  {id:10, marca:"Chevrolet", modelo:"Corvette C8", cilindrada:6162, longitud:4632, anchura:1937, altura:1234, cilindros:8, CV:495, maxKMH:312, peso:1530, aceleracion:3.0, consumo:11.5, precio:95000, imagenUrl:"https://i.imgur.com/chevrolet-corvette.jpg"},
  {id:11, marca:"Nissan", modelo:"GT-R", cilindrada:3799, longitud:4710, anchura:1895, altura:1370, cilindros:6, CV:570, maxKMH:315, peso:1740, aceleracion:2.9, consumo:12.0, precio:115000, imagenUrl:"https://i.imgur.com/nissan-gtr.jpg"},
  {id:12, marca:"Toyota", modelo:"Supra", cilindrada:2998, longitud:4380, anchura:1850, altura:1290, cilindros:6, CV:340, maxKMH:250, peso:1500, aceleracion:4.3, consumo:10.5, precio:55000, imagenUrl:"https://i.imgur.com/toyota-supra.jpg"},
  {id:13, marca:"Maserati", modelo:"MC20", cilindrada:3000, longitud:4665, anchura:1965, altura:1210, cilindros:6, CV:630, maxKMH:325, peso:1500, aceleracion:2.9, consumo:12.0, precio:240000, imagenUrl:"https://i.imgur.com/maserati-mc20.jpg"},
  {id:14, marca:"Lexus", modelo:"LC500", cilindrada:4969, longitud:4760, anchura:1920, altura:1345, cilindros:8, CV:471, maxKMH:270, peso:1870, aceleracion:4.4, consumo:13.5, precio:120000, imagenUrl:"https://i.imgur.com/lexus-lc500.jpg"},
  {id:15, marca:"Ford", modelo:"Mustang GT", cilindrada:4951, longitud:4784, anchura:1916, altura:1381, cilindros:8, CV:450, maxKMH:250, peso:1650, aceleracion:4.3, consumo:11.8, precio:65000, imagenUrl:"https://i.imgur.com/ford-mustang.jpg"},
  {id:16, marca:"Honda", modelo:"NSX", cilindrada:3498, longitud:4475, anchura:1945, altura:1215, cilindros:6, CV:581, maxKMH:308, peso:1720, aceleracion:3.1, consumo:12.0, precio:170000, imagenUrl:"https://i.imgur.com/honda-nsx.jpg"},
  {id:17, marca:"Koenigsegg", modelo:"Jesko", cilindrada:5124, longitud:4850, anchura:2090, altura:1210, cilindros:8, CV:1600, maxKMH:482, peso:1420, aceleracion:2.8, consumo:14.0, precio:2500000, imagenUrl:"https://i.imgur.com/koenigsegg-jesko.jpg"},
  {id:18, marca:"Pagani", modelo:"Huayra", cilindrada:5980, longitud:4620, anchura:2030, altura:1160, cilindros:12, CV:720, maxKMH:370, peso:1350, aceleracion:2.8, consumo:15.5, precio:2500000, imagenUrl:"https://i.imgur.com/pagani-huayra.jpg"},
  {id:19, marca:"Audi", modelo:"RS7", cilindrada:3996, longitud:5046, anchura:1931, altura:1420, cilindros:8, CV:600, maxKMH:305, peso:2060, aceleracion:3.6, consumo:12.5, precio:140000, imagenUrl:"https://i.imgur.com/audi-rs7.jpg"},
  {id:20, marca:"Bentley", modelo:"Continental GT", cilindrada:5998, longitud:4845, anchura:1940, altura:1400, cilindros:12, CV:635, maxKMH:333, peso:2360, aceleracion:3.7, consumo:15.0, precio:200000, imagenUrl:"https://i.imgur.com/bentley-continental.jpg"},
  {id:21, marca:"Porsche", modelo:"Taycan Turbo", cilindrada:0, longitud:4970, anchura:1965, altura:1378, cilindros:0, CV:680, maxKMH:260, peso:2300, aceleracion:3.2, consumo:22.0, precio:185000, imagenUrl:"https://i.imgur.com/porsche-taycan.jpg"},
  {id:22, marca:"BMW", modelo:"i8", cilindrada:1499, longitud:4680, anchura:1942, altura:1293, cilindros:3, CV:369, maxKMH:250, peso:1485, aceleracion:4.4, consumo:2.1, precio:150000, imagenUrl:"https://i.imgur.com/bmw-i8.jpg"},
  {id:23, marca:"McLaren", modelo:"Artura", cilindrada:2993, longitud:4546, anchura:1920, altura:1197, cilindros:6, CV:671, maxKMH:330, peso:1490, aceleracion:3.0, consumo:11.5, precio:225000, imagenUrl:"https://i.imgur.com/mclaren-artura.jpg"},
  {id:24, marca:"Ferrari", modelo:"488 Pista", cilindrada:3902, longitud:4568, anchura:1975, altura:1213, cilindros:8, CV:720, maxKMH:340, peso:1470, aceleracion:2.85, consumo:12.5, precio:330000, imagenUrl:"https://i.imgur.com/ferrari-488pista.jpg"},
  {id:25, marca:"Lamborghini", modelo:"Huracan EVO", cilindrada:5204, longitud:4520, anchura:1924, altura:1165, cilindros:10, CV:640, maxKMH:325, peso:1422, aceleracion:2.9, consumo:14.0, precio:250000, imagenUrl:"https://i.imgur.com/lamborghini-huracan.jpg"},
  {id:26, marca:"Aston Martin", modelo:"Vantage", cilindrada:3992, longitud:4460, anchura:1920, altura:1270, cilindros:8, CV:510, maxKMH:314, peso:1650, aceleracion:3.6, consumo:12.5, precio:145000, imagenUrl:"https://i.imgur.com/aston-vantage.jpg"},
  {id:27, marca:"Mercedes", modelo:"AMG GT", cilindrada:3982, longitud:4564, anchura:1940, altura:1292, cilindros:8, CV:522, maxKMH:308, peso:1630, aceleracion:3.8, consumo:12.8, precio:130000, imagenUrl:"https://i.imgur.com/mercedes-amggt.jpg"},
  {id:28, marca:"Jaguar", modelo:"F-Type SVR", cilindrada:5000, longitud:4470, anchura:1920, altura:1310, cilindros:8, CV:575, maxKMH:321, peso:1745, aceleracion:3.5, consumo:13.5, precio:150000, imagenUrl:"https://i.imgur.com/jaguar-ftypesvr.jpg"},
  {id:29, marca:"Toyota", modelo:"GR Supra", cilindrada:2998, longitud:4380, anchura:1850, altura:1290, cilindros:6, CV:340, maxKMH:250, peso:1500, aceleracion:4.3, consumo:10.5, precio:55000, imagenUrl:"https://i.imgur.com/toyota-grsupra.jpg"},
  {id:30, marca:"Nissan", modelo:"370Z", cilindrada:3696, longitud:4240, anchura:1840, altura:1320, cilindros:6, CV:332, maxKMH:250, peso:1530, aceleracion:5.2, consumo:11.0, precio:45000, imagenUrl:"https://i.imgur.com/nissan-370z.jpg"},
  {id:31, marca:"Honda", modelo:"Civic Type R", cilindrada:1996, longitud:4553, anchura:1877, altura:1395, cilindros:4, CV:320, maxKMH:272, peso:1380, aceleracion:5.7, consumo:7.9, precio:42000, imagenUrl:"https://i.imgur.com/honda-civictr.jpg"},
  {id:32, marca:"BMW", modelo:"M4", cilindrada:2998, longitud:4784, anchura:1877, altura:1381, cilindros:6, CV:480, maxKMH:280, peso:1680, aceleracion:4.1, consumo:9.5, precio:75000, imagenUrl:"https://i.imgur.com/bmw-m4.jpg"},
  {id:33, marca:"Audi", modelo:"RS5", cilindrada:2995, longitud:4711, anchura:1865, altura:1373, cilindros:6, CV:450, maxKMH:280, peso:1680, aceleracion:3.9, consumo:10.5, precio:72000, imagenUrl:"https://i.imgur.com/audi-rs5.jpg"},
  {id:34, marca:"Porsche", modelo:"Cayman GT4", cilindrada:3996, longitud:4379, anchura:1801, altura:1304, cilindros:6, CV:420, maxKMH:304, peso:1410, aceleracion:4.2, consumo:11.0, precio:140000, imagenUrl:"https://i.imgur.com/porsche-cayman.jpg"},
  {id:35, marca:"Maserati", modelo:"GranTurismo", cilindrada:4691, longitud:4930, anchura:1946, altura:1362, cilindros:8, CV:460, maxKMH:301, peso:1825, aceleracion:4.9, consumo:13.8, precio:150000, imagenUrl:"https://i.imgur.com/maserati-granturismo.jpg"},
  {id:36, marca:"Alfa Romeo", modelo:"4C", cilindrada:1742, longitud:3992, anchura:1870, altura:1180, cilindros:4, CV:240, maxKMH:258, peso:895, aceleracion:4.5, consumo:7.5, precio:70000, imagenUrl:"https://i.imgur.com/alfa-4c.jpg"}
];

// =======================
// UTILS
function barajar(array){
  return array.sort(()=>Math.random()-0.5);
}

// =======================
// CREAR PARTIDA
function crearPartida(){

  const id = Math.floor(Math.random()*9000)+1000;
  partidaId = id;

  const baraja = barajar([...cartasBase]);

  let jugadores = {};

  for(let i=0;i<numJugadores;i++){
    jugadores["jugador"+i] = {
      cartas: baraja.slice(i*cartasBase.length/numJugadores,(i+1)*cartasBase.length/numJugadores)
    };
  }

  jugadorId = "jugador0";
  turnoActual = "jugador0";

  db.ref("partidas/"+id).set({
    jugadores,
    turno: turnoActual
  });

  alert("Código: " + id);
  escucharPartida();
}

// =======================
// UNIRSE
function unirsePartida(){

  const id = document.getElementById("codigo").value;
  partidaId = id;

  db.ref("partidas/"+id).once("value").then(snap=>{
    const data = snap.val();

    if(!data){
      alert("No existe");
      return;
    }

    for(let i=0;i<numJugadores;i++){
      let key = "jugador"+i;
      if(!data.jugadores[key]){
        jugadorId = key;
        break;
      }
    }

    if(!jugadorId){
      alert("Partida llena");
      return;
    }

    escucharPartida();
  });
}

// =======================
// ESCUCHAR
function escucharPartida(){

  db.ref("partidas/"+partidaId).on("value", snap=>{
    const data = snap.val();
    if(!data) return;

    turnoActual = data.turno;

    if(!data.jugadores[jugadorId]) return;

    cartasJugador = data.jugadores[jugadorId].cartas;

    mostrarCarta();
  });
}

// =======================
// MOSTRAR CARTA
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

    <p>${turnoActual===jugadorId ? "TU TURNO" : "ESPERA..."}</p>
  `;
}

// =======================
// JUGAR
function jugar(atributo){

  if(turnoActual !== jugadorId){
    alert("No es tu turno");
    return;
  }

  db.ref("partidas/"+partidaId).once("value").then(snap=>{

    const data = snap.val();

    let ganador = null;
    let mejor = -Infinity;

    Object.keys(data.jugadores).forEach(j=>{
      const carta = data.jugadores[j].cartas[0];
      if(carta[atributo] > mejor){
        mejor = carta[atributo];
        ganador = j;
      }
    });

    // mover cartas
    Object.keys(data.jugadores).forEach(j=>{
      const carta = data.jugadores[j].cartas.shift();
      data.jugadores[ganador].cartas.push(carta);
    });

    data.turno = ganador;

    db.ref("partidas/"+partidaId).set(data);
  });
}

// ==========================================
// 1. CONFIGURACIÓN DE FIREBASE
// ==========================================
const firebaseConfig = {
    apiKey: "AIzaSyDvoniQYLcoBcL0F_n_KoGo4ZYLAKwSooA",
    authDomain: "carta-de-coches.firebaseapp.com",
    databaseURL: "https://carta-de-coches-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "carta-de-coches",
    storageBucket: "carta-de-coches.appspot.com",
    messagingSenderId: "785928361183",
    appId: "1:785928361183:web:4af4c916880d4af760056a"
};

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}
const db = firebase.database();

let jugadorId = null;
let partidaId = null;

// ==========================================
// 2. BASE DE DATOS DE COCHES (36)
// ==========================================
const cartasBase = [
  {id:1, marca:"Ferrari", modelo:"SF90 Stradale", cilindrada:3990, longitud:4710, anchura:1972, altura:1186, cilindros:8, CV:1000, maxKMH:340, peso:1570, aceleracion:2.5, consumo:6.1, precio:430000, imagenUrl:"https://i.imgur.com/uutouvW.jpeg"},
  {id:2, marca:"Bugatti", modelo:"Chiron", cilindrada:7993, longitud:4544, anchura:2038, altura:1212, cilindros:16, CV:1500, maxKMH:420, peso:1995, aceleracion:2.4, consumo:22.5, precio:2400000, imagenUrl:"https://i.imgur.com/8Exa3jF.jpeg"},
  {id:3, marca:"Lamborghini", modelo:"Revuelto", cilindrada:6498, longitud:4947, anchura:2033, altura:1160, cilindros:12, CV:1015, maxKMH:350, peso:1772, aceleracion:2.5, consumo:11.8, precio:500000, imagenUrl:"https://i.imgur.com/oOAmPpF.jpeg"},
  {id:4, marca:"Koenigsegg", modelo:"Jesko", cilindrada:5000, longitud:4610, anchura:2030, altura:1210, cilindros:8, CV:1600, maxKMH:480, peso:1420, aceleracion:2.5, consumo:15.0, precio:2800000, imagenUrl:"https://i.imgur.com/pAnutwN.jpeg"},
  {id:5, marca:"McLaren", modelo:"750S", cilindrada:3994, longitud:4569, anchura:1930, altura:1196, cilindros:8, CV:750, maxKMH:332, peso:1389, aceleracion:2.8, consumo:12.2, precio:300000, imagenUrl:"https://i.imgur.com/blMvw2.jpeg"},
  {id:6, marca:"Porsche", modelo:"911 GT3 RS", cilindrada:3996, longitud:4572, anchura:1900, altura:1322, cilindros:6, CV:525, maxKMH:296, peso:1450, aceleracion:3.2, consumo:13.4, precio:265000, imagenUrl:"https://i.imgur.com/G515zTD.jpeg"},
  {id:7, marca:"Rimac", modelo:"Nevera", cilindrada:0, longitud:4750, anchura:1986, altura:1208, cilindros:0, CV:1914, maxKMH:412, peso:2150, aceleracion:1.8, consumo:0.0, precio:2000000, imagenUrl:"https://i.imgur.com/mbpXxvV.jpeg"},
  {id:8, marca:"Aston Martin", modelo:"Valkyrie", cilindrada:6500, longitud:4506, anchura:1922, altura:1074, cilindros:12, CV:1160, maxKMH:350, peso:1030, aceleracion:2.5, consumo:14.0, precio:3000000, imagenUrl:"https://i.imgur.com/ywf2FSg.jpeg"},
  {id:9, marca:"Pagani", modelo:"Huayra BC", cilindrada:5980, longitud:4605, anchura:2036, altura:1169, cilindros:12, CV:800, maxKMH:370, peso:1218, aceleracion:2.8, consumo:15.0, precio:2300000, imagenUrl:"https://i.imgur.com/IteCJZY.jpeg"},
  {id:10, marca:"Mercedes-AMG", modelo:"One", cilindrada:1600, longitud:4756, anchura:2010, altura:1261, cilindros:6, CV:1063, maxKMH:352, peso:1695, aceleracion:2.9, consumo:8.7, precio:2700000, imagenUrl:"https://i.imgur.com/Kkmu1BK.jpeg"},
  {id:11, marca:"Hennessey", modelo:"Venom F5", cilindrada:6555, longitud:4666, anchura:1971, altura:1131, cilindros:8, CV:1817, maxKMH:500, peso:1360, aceleracion:2.6, consumo:18.0, precio:2100000, imagenUrl:"https://i.imgur.com/baG0srk.jpeg"},
  {id:12, marca:"Gordon Murray", modelo:"T.50", cilindrada:3994, longitud:4352, anchura:1850, altura:1164, cilindros:12, CV:663, maxKMH:360, peso:986, aceleracion:2.8, consumo:12.5, precio:2600000, imagenUrl:"https://i.imgur.com/mHLJsRc.jpeg"},
  {id:13, marca:"Ferrari", modelo:"LaFerrari", cilindrada:6262, longitud:4702, anchura:1992, altura:1116, cilindros:12, CV:963, maxKMH:350, peso:1255, aceleracion:2.9, consumo:14.0, precio:1300000, imagenUrl:"https://i.imgur.com/rsM5USR.jpeg"},
  {id:14, marca:"Lamborghini", modelo:"Aventador SVJ", cilindrada:6498, longitud:4943, anchura:2098, altura:1136, cilindros:12, CV:770, maxKMH:350, peso:1525, aceleracion:2.8, consumo:19.6, precio:450000, imagenUrl:"https://i.imgur.com/4xZ9fDb.jpeg"},
  {id:15, marca:"Ford", modelo:"GT", cilindrada:3497, longitud:4762, anchura:2004, altura:1110, cilindros:6, CV:660, maxKMH:347, peso:1385, aceleracion:3.0, consumo:14.9, precio:500000, imagenUrl:"https://i.imgur.com/8XnffFh.jpeg"},
  {id:16, marca:"Audi", modelo:"R8 V10 Performance", cilindrada:5204, longitud:4429, anchura:1940, altura:1236, cilindros:10, CV:620, maxKMH:331, peso:1595, aceleracion:3.1, consumo:13.1, precio:220000, imagenUrl:"https://i.imgur.com/A2yr6x1.jpeg"},
  {id:17, marca:"Maserati", modelo:"MC20", cilindrada:2992, longitud:4669, anchura:1965, altura:1221, cilindros:6, CV:630, maxKMH:325, peso:1500, aceleracion:2.9, consumo:11.6, precio:240000, imagenUrl:"https://i.imgur.com/OmtIpdm.jpeg"},
  {id:18, marca:"Chevrolet", modelo:"Corvette Z06", cilindrada:5463, longitud:4688, anchura:2025, altura:1235, cilindros:8, CV:679, maxKMH:312, peso:1561, aceleracion:2.7, consumo:15.6, precio:120000, imagenUrl:"https://i.imgur.com/52oFpVj.jpeg"},
  {id:19, marca:"Nissan", modelo:"GT-R Nismo", cilindrada:3799, longitud:4710, anchura:1895, altura:1370, cilindros:6, CV:600, maxKMH:315, peso:1703, aceleracion:2.8, consumo:11.8, precio:210000, imagenUrl:"https://i.imgur.com/ZNauBcd.jpeg"},
  {id:20, marca:"Dodge", modelo:"Demon 170", cilindrada:6166, longitud:5035, anchura:2005, altura:1459, cilindros:8, CV:1025, maxKMH:346, peso:1939, aceleracion:1.6, consumo:18.0, precio:100000, imagenUrl:"https://i.imgur.com/8Exa3jF.jpeg"},
  {id:21, marca:"Lotus", modelo:"Evija", cilindrada:0, longitud:4459, anchura:2000, altura:1122, cilindros:0, CV:2011, maxKMH:350, peso:1680, aceleracion:2.9, consumo:0.0, precio:2000000, imagenUrl:"https://i.imgur.com/TP7pW5H.jpeg"},
  {id:22, marca:"Zenvo", modelo:"TSR-S", cilindrada:5800, longitud:4815, anchura:2038, altura:1198, cilindros:8, CV:1177, maxKMH:325, peso:1495, aceleracion:2.8, consumo:16.0, precio:1500000, imagenUrl:"https://i.imgur.com/3qbANm7.jpeg"},
  {id:23, marca:"SSC", modelo:"Tuatara", cilindrada:5900, longitud:4633, anchura:1991, altura:1067, cilindros:8, CV:1750, maxKMH:455, peso:1247, aceleracion:2.6, consumo:18.5, precio:1600000, imagenUrl:"https://i.imgur.com/yQx5wQ6.jpeg"},
  {id:24, marca:"Gumpert", modelo:"Apollo", cilindrada:4163, longitud:4460, anchura:1998, altura:1114, cilindros:8, CV:650, maxKMH:360, peso:1200, aceleracion:3.1, consumo:14.5, precio:400000, imagenUrl:"https://i.imgur.com/T5CGSrM.jpeg"},
  {id:25, marca:"Saleen", modelo:"S7 Twin Turbo", cilindrada:7000, longitud:4774, anchura:1990, altura:1041, cilindros:8, CV:750, maxKMH:399, peso:1338, aceleracion:2.8, consumo:17.0, precio:550000, imagenUrl:"https://i.imgur.com/9JuqerP.jpeg"},
  {id:26, marca:"W Motors", modelo:"Lykan HyperSport", cilindrada:3746, longitud:4495, anchura:1944, altura:1170, cilindros:6, CV:780, maxKMH:385, peso:1380, aceleracion:2.8, consumo:13.5, precio:3400000, imagenUrl:"https://i.imgur.com/7XJijGR.jpeg"},
  {id:27, marca:"Pininfarina", modelo:"Battista", cilindrada:0, longitud:4750, anchura:1986, altura:1212, cilindros:0, CV:1900, maxKMH:350, peso:2000, aceleracion:1.8, consumo:0.0, precio:2200000, imagenUrl:"https://i.imgur.com/P01X1ft.jpeg"},
  {id:28, marca:"De Tomaso", modelo:"P72", cilindrada:5000, longitud:4590, anchura:1960, altura:1130, cilindros:8, CV:700, maxKMH:355, peso:1250, aceleracion:2.8, consumo:12.0, precio:1200000, imagenUrl:"https://i.imgur.com/Ok4NfCN.jpeg"},
  {id:29, marca:"Apollo", modelo:"Intensa Emozione", cilindrada:6300, longitud:5066, anchura:1995, altura:1130, cilindros:12, CV:780, maxKMH:335, peso:1250, aceleracion:2.7, consumo:16.0, precio:2300000, imagenUrl:"https://i.imgur.com/POQmojk.jpeg"},
  {id:30, marca:"Lamborghini", modelo:"Sesto Elemento", cilindrada:5204, longitud:4345, anchura:1859, altura:1100, cilindros:10, CV:570, maxKMH:350, peso:999, aceleracion:2.5, consumo:13.5, precio:2200000, imagenUrl:"https://i.imgur.com/t3DgplD.jpeg"},
  {id:31, marca:"Ferrari", modelo:"Daytona SP3", cilindrada:6496, longitud:4685, anchura:2050, altura:1142, cilindros:12, CV:840, maxKMH:340, peso:1485, aceleracion:2.8, consumo:16.2, precio:2000000, imagenUrl:"https://i.imgur.com/VJuLzc4.jpeg"},
  {id:32, marca:"McLaren", modelo:"P1", cilindrada:3799, longitud:4588, anchura:1946, altura:1188, cilindros:8, CV:916, maxKMH:350, peso:1395, aceleracion:2.8, consumo:8.3, precio:1100000, imagenUrl:"https://i.imgur.com/oOAmPpF.jpeg"},
  {id:33, marca:"Porsche", modelo:"918 Spyder", cilindrada:4593, longitud:4643, anchura:1940, altura:1167, cilindros:8, CV:887, maxKMH:345, peso:1675, aceleracion:2.6, consumo:3.1, precio:850000, imagenUrl:"https://i.imgur.com/9NgYsdj.jpeg"},
  {id:34, marca:"Noble", modelo:"M600", cilindrada:4439, longitud:4360, anchura:1910, altura:1120, cilindros:8, CV:650, maxKMH:362, peso:1200, aceleracion:3.0, consumo:14.0, precio:250000, imagenUrl:"https://i.imgur.com/EHvzCVO.jpeg"},
  {id:35, marca:"NIO", modelo:"EP9", cilindrada:0, longitud:4888, anchura:2230, altura:1150, cilindros:0, CV:1360, maxKMH:313, peso:1735, aceleracion:2.7, consumo:0.0, precio:1200000, imagenUrl:"https://i.imgur.com/XPKBhwt.jpeg"},
  {id:36, marca:"Pagani", modelo:"Zonda R", cilindrada:5987, longitud:4886, anchura:2014, altura:1141, cilindros:12, CV:750, maxKMH:350, peso:1070, aceleracion:2.7, consumo:18.0, precio:1500000, imagenUrl:"https://i.imgur.com/yJAkbcj.jpeg"}
];

// ==========================================
// 3. FUNCIONES DE GESTIÓN DE PARTIDA
// ==========================================

function crearPartida() {
    const id = (Math.floor(1000 + Math.random() * 9000)).toString();
    partidaId = id;
    jugadorId = "jugador0";
    db.ref("partidas/" + id).set({
        config: { estado: "esperando" },
        jugadores: { jugador0: { activo: true, cartas: [] } },
        turno: "jugador0"
    }).then(() => {
        document.getElementById("areaCreador").style.display = "block";
        document.getElementById("controles-iniciales").style.display = "none";
        document.getElementById("chat-container").style.display = "block";
        escucharPartida();
    });
}

function unirsePartida() {
    const id = document.getElementById("codigoInput").value.toString().trim();
    if (!id) return alert("Escribe el código de la partida");
    partidaId = id;
    db.ref("partidas/" + id).once("value", snap => {
        const data = snap.val();
        if (!data) return alert("La partida no existe");
        
        const n = Object.keys(data.jugadores).length;
        jugadorId = "jugador" + n;
        
        db.ref(`partidas/${id}/jugadores/${jugadorId}`).set({ activo: true, cartas: [] })
        .then(() => {
            document.getElementById("controles-iniciales").style.display = "none";
            document.getElementById("chat-container").style.display = "block";
            escucharPartida();
        });
    });
}

function iniciarJuego() {
    db.ref("partidas/" + partidaId).once("value", snap => {
        const data = snap.val();
        const listaJugadores = Object.keys(data.jugadores);
        const mazoMezclado = [...cartasBase].sort(() => Math.random() - 0.5);
        const cartasPorPersona = Math.floor(mazoMezclado.length / listaJugadores.length);
        
        let updates = { "config/estado": "jugando" };
        listaJugadores.forEach((id, index) => {
            updates[`jugadores/${id}/cartas`] = mazoMezclado.slice(index * cartasPorPersona, (index + 1) * cartasPorPersona);
        });
        
        db.ref("partidas/" + partidaId).update(updates);
    });
}

// ==========================================
// 4. LÓGICA DE CHAT
// ==========================================

function enviarMensaje() {
    const input = document.getElementById("inputChat");
    const texto = input.value.trim();
    if (!texto || !partidaId) return;
    
    db.ref(`partidas/${partidaId}/mensajes`).push({
        autor: jugadorId,
        texto: texto,
        timestamp: Date.now()
    });
    input.value = "";
}

// ==========================================
// 5. ESCUCHA Y RENDERIZADO (TODO EN UNO)
// ==========================================

function escucharPartida() {
    db.ref("partidas/" + partidaId).on("value", snap => {
        const data = snap.val();
        if (!data) return;
        
        const area = document.getElementById("cartaJugador");
        const info = document.getElementById("infoPartida");
        const chatArea = document.getElementById("lista-mensajes");

        // --- RENDERIZAR CHAT (Independiente del estado) ---
        if (data.mensajes) {
            let htmlChat = "";
            Object.values(data.mensajes).forEach(m => {
                const color = m.autor === jugadorId ? "#a8dadc" : "#e63946";
                const nombre = m.autor === jugadorId ? "TÚ" : m.autor;
                htmlChat += `<div class="msg"><b style="color:${color}">${nombre}:</b> ${m.texto}</div>`;
            });
            chatArea.innerHTML = htmlChat;
            chatArea.scrollTop = chatArea.scrollHeight;
        }

        // --- PANTALLA DE ESPERA ---
        if (data.config.estado === "esperando") {
            info.innerHTML = `SALA DE ESPERA | Código: ${partidaId}`;
            area.innerHTML = `<div style="text-align:center; padding:20px;">
                                <h3>Jugadores conectados: ${Object.keys(data.jugadores).length}</h3>
                                <p>Esperando a que el creador comience...</p>
                              </div>`;
            return;
        }

        // --- MODO DUELO (REVELACIÓN) ---
        if (data.revelacion) {
            let htmlDuelo = "";
            Object.keys(data.revelacion.cartas).forEach(id => {
                const c = data.revelacion.cartas[id];
                const esGanador = id === data.revelacion.ganador;
                const esEmpate = data.revelacion.ganador === "empate";
                htmlDuelo += `
                    <div class="duelo-container">
                        ${esGanador ? '<div class="estrella">⭐</div>' : ''}
                        ${esEmpate ? '<div class="estrella" style="filter:none">🤝</div>' : ''}
                        <div class="card revelada ${esGanador ? 'ganadora' : ''} ${esEmpate ? 'empate-border' : ''}">
                            <h2>${id === jugadorId ? "TU CARTA" : "RIVAL ("+id+")"}</h2>
                            <img src="${c.imagenUrl}">
                            <div style="text-align:center; padding: 5px;">
                                <small>${data.revelacion.atributo.toUpperCase()}</small><br>
                                <b>${c[data.revelacion.atributo]}</b>
                            </div>
                        </div>
                    </div>`;
            });
            area.innerHTML = htmlDuelo;
            info.innerHTML = data.revelacion.ganador === "empate" ? "¡EMPATE!" : "¡RESULTADO!";
            return;
        }

        // --- MODO JUEGO NORMAL ---
        if (!data.jugadores[jugadorId]) return;
        const misCartas = data.jugadores[jugadorId].cartas || [];
        
        if (misCartas.length === 0) { 
            area.innerHTML = "<div class='card'><h2>💀 ELIMINADO</h2><p>Te has quedado sin cartas.</p></div>"; 
            return; 
        }
        
        const cartaActual = misCartas[0];
        const esMiTurno = data.turno === jugadorId;
        info.innerHTML = `Cartas: ${misCartas.length} | Turno: ${esMiTurno ? "TUYO" : data.turno}`;

        area.innerHTML = `
            <div class="card">
                <h2>${cartaActual.marca} ${cartaActual.modelo}</h2>
                <img src="${cartaActual.imagenUrl}">
                <div class="grid-stats">
                    <button class="stat-btn" onclick="lanzarAtaque('cilindrada')">Cilindrada <b>${cartaActual.cilindrada}</b></button>
                    <button class="stat-btn" onclick="lanzarAtaque('longitud')">Longitud <b>${cartaActual.longitud}</b></button>
                    <button class="stat-btn" onclick="lanzarAtaque('cilindros')">Cilindros <b>${cartaActual.cilindros}</b></button>
                    <button class="stat-btn" onclick="lanzarAtaque('anchura')">Anchura <b>${cartaActual.anchura}</b></button>
                    <button class="stat-btn" onclick="lanzarAtaque('CV')">CV <b>${cartaActual.CV}</b></button>
                    <button class="stat-btn" onclick="lanzarAtaque('altura')">Altura <b>${cartaActual.altura}</b></button>
                    <button class="stat-btn" onclick="lanzarAtaque('maxKMH')">Velocidad <b>${cartaActual.maxKMH}</b></button>
                    <button class="stat-btn" onclick="lanzarAtaque('peso')">Peso <b>${cartaActual.peso}</b></button>
                    <button class="stat-btn" onclick="lanzarAtaque('aceleracion')">0-100 <b>${cartaActual.aceleracion}</b></button>
                    <button class="stat-btn" onclick="lanzarAtaque('consumo')">Consumo <b>${cartaActual.consumo}</b></button>
                </div>
                ${!esMiTurno ? `<div class="bloqueo">Turno de ${data.turno}...</div>` : ""}
            </div>`;
    });
}

// ==========================================
// 6. LÓGICA DE ATAQUE Y REGLAS
// ==========================================

function lanzarAtaque(atributo) {
    db.ref("partidas/" + partidaId).once("value", snap => {
        const data = snap.val();
        if (data.turno !== jugadorId || data.revelacion) return;

        let ganadorId = "";
        let mejorValor = (atributo === 'aceleracion') ? Infinity : -Infinity;
        let cartasEnDuelo = {};
        let esEmpate = false;

        // Comprobar cartas de todos los jugadores activos
        Object.keys(data.jugadores).forEach(id => {
            const mazo = data.jugadores[id].cartas;
            if (mazo && mazo.length > 0) {
                const carta = mazo[0];
                cartasEnDuelo[id] = carta;
                const valor = carta[atributo];

                if (valor === mejorValor) {
                    esEmpate = true;
                } else if (atributo === 'aceleracion' ? valor < mejorValor : valor > mejorValor) {
                    mejorValor = valor;
                    ganadorId = id;
                    esEmpate = false;
                }
            }
        });

        if (esEmpate) {
            // Empate: Nadie pierde cartas, se muestra la revelación y se repite turno
            data.revelacion = { cartas: cartasEnDuelo, ganador: "empate", atributo: atributo };
        } else {
            // Ganador: Recoge las cartas del pozo
            const pozo = [];
            Object.keys(data.jugadores).forEach(id => {
                if (data.jugadores[id].cartas) {
                    pozo.push(data.jugadores[id].cartas.shift());
                }
            });
            data.jugadores[ganadorId].cartas.push(...pozo);
            data.turno = ganadorId;
            data.revelacion = { cartas: cartasEnDuelo, ganador: ganadorId, atributo: atributo };
        }

        db.ref("partidas/" + partidaId).update(data);
        
        // Limpiar revelación después de 4 segundos
        setTimeout(() => {
            db.ref(`partidas/${partidaId}/revelacion`).remove();
        }, 4000);
    });
}

// Tecla Enter para el chat
document.addEventListener('keypress', (e) => {
    if(e.key === 'Enter' && document.activeElement.id === 'inputChat') enviarMensaje();
});

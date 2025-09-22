//****** GAME LOOP ********//
 var time = new Date();
    var deltaTime = 0;

    if (document.readyState === "complete" || document.readyState === "interactive") {
      setTimeout(Init, 1);
    } else {
      document.addEventListener("DOMContentLoaded", Init);
    }

    function Init() {
      time = new Date();
      Start();
      Loop();
    }

    function Loop() {
      deltaTime = (new Date() - time) / 1000;
      time = new Date();
      Update();
      requestAnimationFrame(Loop);
    }

    var sueloY = 22;
    var impulso = 900;
    var gravedad = 2500;

    var velEscenario = 1280 / 3;
    var gameVel = 1;
    var score = 0;
    var parado = false;

    // Dino 1
    var velY1 = 0, dinoPosY1 = sueloY, saltando1 = false;

    // Dino 2
    var velY2 = 0, dinoPosY2 = sueloY, saltando2 = false;

    var obstaculos = [];
    var tiempoHastaObstaculo = 2;
    var tiempoObstaculoMin = 0.7;
    var tiempoObstaculoMax = 1.8;

    var nubes = [];
    var tiempoHastaNube = 0.5;
    var tiempoNubeMin = 0.7;
    var tiempoNubeMax = 2.7;
    var maxNubeY = 270;
    var minNubeY = 100;
    var velNube = 0.5;

    let winner = "none";
    

    var contenedor, dino1, dino2, textoScore, suelo, gameOver;

    function Start() {
      contenedor = document.querySelector(".contenedor");
      suelo = document.querySelector(".suelo");
      dino1 = document.querySelector(".dino1");
      dino2 = document.querySelector(".dino2");
      textoScore = document.querySelector(".score");
      gameOver = document.querySelector(".game-over");

      document.addEventListener("keydown", HandleKeyDown);
    }

    function Update() {
      if (parado) return;

      MoverSuelo();
      MoverDinos();
      DecidirCrearObstaculos();
      MoverObstaculos();
      DecidirCrearNubes();
      MoverNubes();
      DetectarColision();

      velY1 -= gravedad * deltaTime;
      velY2 -= gravedad * deltaTime;
    }

    function HandleKeyDown(ev) {
      if (ev.code === "Space") Saltar(1);
      if (ev.code === "ArrowUp") Saltar(2);
    }

    function Saltar(jugador) {
      if (jugador === 1 && dinoPosY1 === sueloY) {
        velY1 = impulso;
        saltando1 = true;
        dino1.classList.remove("dino-corriendo");
      }
      if (jugador === 2 && dinoPosY2 === sueloY) {
        velY2 = impulso;
        saltando2 = true;
        dino2.classList.remove("dino-corriendo");
      }
    }

    function MoverDinos() {
      // Dino 1
      dinoPosY1 += velY1 * deltaTime;
      if (dinoPosY1 < sueloY) {
        dinoPosY1 = sueloY;
        velY1 = 0;
        if (saltando1) dino1.classList.add("dino-corriendo");
        saltando1 = false;
      }
      dino1.style.bottom = dinoPosY1 + "px";

      // Dino 2
      dinoPosY2 += velY2 * deltaTime;
      if (dinoPosY2 < sueloY) {
        dinoPosY2 = sueloY;
        velY2 = 0;
        if (saltando2) dino2.classList.add("dino-corriendo");
        saltando2 = false;
      }
      dino2.style.bottom = dinoPosY2 + "px";
    }

    var sueloX = 0;

    function MoverSuelo() {
      sueloX += CalcularDesplazamiento();
      suelo.style.left = -(sueloX % contenedor.clientWidth) + "px";
    }

    function CalcularDesplazamiento() {
      return velEscenario * deltaTime * gameVel;
    }

    function DecidirCrearObstaculos() {
      tiempoHastaObstaculo -= deltaTime;
      if (tiempoHastaObstaculo <= 0) CrearObstaculo();
    }

    function CrearObstaculo() {
      var obstaculo = document.createElement("div");
      obstaculo.classList.add("cactus");
      if (Math.random() > 0.5) obstaculo.classList.add("cactus2");
      contenedor.appendChild(obstaculo);
      obstaculo.posX = contenedor.clientWidth;
      obstaculo.style.left = obstaculo.posX + "px";
      obstaculos.push(obstaculo);
      tiempoHastaObstaculo = tiempoObstaculoMin + Math.random() * (tiempoObstaculoMax - tiempoObstaculoMin) / gameVel;
    }

    function MoverObstaculos() {
      for (let i = obstaculos.length - 1; i >= 0; i--) {
        if (obstaculos[i].posX < -obstaculos[i].clientWidth) {
          contenedor.removeChild(obstaculos[i]);
          obstaculos.splice(i, 1);
          score++;
          textoScore.innerText = score;
          if (score === 5) {
            gameVel = 1.2;
            contenedor.classList.add("mediodia");
          } else if (score === 10) {
            gameVel = 1.5;
            contenedor.classList.add("tarde");
          } else if (score === 20) {
            gameVel = 2;
            contenedor.classList.add("noche");
          }
        } else {
          obstaculos[i].posX -= CalcularDesplazamiento();
          obstaculos[i].style.left = obstaculos[i].posX + "px";
        }
      }
    }

    function DecidirCrearNubes() {
      tiempoHastaNube -= deltaTime;
      if (tiempoHastaNube <= 0) CrearNube();
    }

    function CrearNube() {
      var nube = document.createElement("div");
      nube.classList.add("nube");
      nube.posX = contenedor.clientWidth;
      nube.style.left = nube.posX + "px";
      nube.style.bottom = minNubeY + Math.random() * (maxNubeY - minNubeY) + "px";
      contenedor.appendChild(nube);
      nubes.push(nube);
      tiempoHastaNube = tiempoNubeMin + Math.random() * (tiempoNubeMax - tiempoNubeMin) / gameVel;
    }

    function MoverNubes() {
      for (let i = nubes.length - 1; i >= 0; i--) {
        if (nubes[i].posX < -nubes[i].clientWidth) {
          contenedor.removeChild(nubes[i]);
          nubes.splice(i, 1);
        } else {
          nubes[i].posX -= CalcularDesplazamiento() * velNube;
          nubes[i].style.left = nubes[i].posX + "px";
        }
      }
    }

    function DetectarColision() {
      for (let i = 0; i < obstaculos.length; i++) {
        if (obstaculos[i].posX > 126 + 84) break;
        if (IsCollision(dino1, obstaculos[i], 10, 30, 15, 20)) {
          winner = "player2";
          GameOver();
        }else if (IsCollision(dino2, obstaculos[i], 10, 30, 15, 20)) {
             winner = "player1";
             GameOver();
        } 
      }
    }

    function IsCollision(a, b, paddingTop, paddingRight, paddingBottom, paddingLeft) {
      const aRect = a.getBoundingClientRect();
      const bRect = b.getBoundingClientRect();

      return !(
        aRect.bottom - paddingBottom < bRect.top ||
        aRect.top + paddingTop > bRect.bottom ||
        aRect.right - paddingRight < bRect.left ||
        aRect.left + paddingLeft > bRect.right
      );
    }

    function GameOver() {
      const winnerText = document.querySelector(".winner-text");

    if (winner == "player1") {
      parado = true;
      dino1.classList.add("dino1");
      dino1.classList.remove("dino-corriendo");
      dino2.classList.remove("dino-corriendo");
      dino2.classList.add("dino-estrellado");
      winnerText.style.display = "block";
      gameOver.style.display = "block";
      winnerText.innerText = "¡Jugador 1 gana!";
      document.addEventListener("keydown", ev => {
        if (ev.code === "Space") location.reload();
      });
    }else if (winner == "player2") {
      parado = true;
      dino2.classList.add("dino2")
      dino2.classList.remove("dino-corriendo");
      dino1.classList.remove("dino-corriendo");
      dino1.classList.add("dino-estrellado");
      gameOver.style.display = "block";
      winnerText.style.display = "block";
      winnerText.innerText = "¡Jugador 2 gana!";
      document.addEventListener("keydown", ev => {
        if (ev.code === "Space") location.reload();
      });
    }
 }
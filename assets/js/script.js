function start(){ //inicio da função start()

      $("#inicio").hide();//chamando ocultando a função inicio
      //essa sintaxe só é permitida por utilizarmos o JQuery

      $("#fundoGame").append("<div id='jogador' class='anima1'></div>");
      //criando novas DIVS 
      $("#fundoGame").append("<div id='inimigo1' class='anima2'></div>");
      $("#fundoGame").append("<div id='inimigo2'></div>");
      $("#fundoGame").append("<div id='amigo' class='anima3'></div>");
      $("#fundoGame").append("<div id='placar'></div>");
      $("#fundoGame").append("<div id='energia'></div>");
      
      //Principais variáveis do jogo

      var jogo = {};
      var energiaAtual = 3;
      var fimDeJogo = false;
      var pontos = 0;
      var salvos = 0;
      var perdidos = 0;
      var velocidade = 5;
      var posicaoY = parseInt(Math.random() * 334);
      var podeAtirar = true;
      var TECLA = {
      W: 87,
      S: 83,
      D: 68
   };

   // Variáveis de som
   var somDisparo = document.getElementById("somDisparo");
   var somExplosao = document.getElementById("somExplosao");
   var musica = document.getElementById("musica");
   var somGameOver = document.getElementById("somGameOver");
   var somPerdido = document.getElementById("somPerdido");
   var somResgate = document.getElementById("somResgate");
   var somWin = document.getElementById("somWin");

   //Música em Loop

   musica.addEventListener("ended", function(){ musica.currentTime = 0; musica.play();}, false);
   musica.play();
   

   jogo.pressionou = [];

   //Verifica se o usuário pressionou alguma tecla

   $(document).keydown(function(e){
   jogo.pressionou[e.which] = true;
   });

   $(document).keyup(function(e){
      jogo.pressionou[e.which] = false;
   });

   //Game Loop

   jogo.timer = setInterval(loop,30);

   function loop() {

   movefundo();
   moveJogador();
   moveInimigo1();
   moveInimigo2();
   moveAmigo();
   colisao();
   placar();
   energia();

   } // Fim da função loop()

   

   //Função que movimenta o fundo do jogo

   function movefundo() {

   esquerda = parseInt($("#fundoGame").css("background-position"));
   $("#fundoGame").css("background-position",esquerda-1);

   } // fim da função movefundo()

   function moveJogador() {
      
      if (jogo.pressionou[TECLA.W]) {
         var topo = parseInt($("#jogador").css("top"));
         $("#jogador").css("top",topo-10);

         if(topo <= 0){
            $("#jogador").css("top", topo+10);
         }
         
      }
      
      if (jogo.pressionou[TECLA.S]) {
         
         var topo = parseInt($("#jogador").css("top"));
         $("#jogador").css("top",topo+10);	

         if(topo >= 390){
            $("#jogador").css("top",topo-10);
         }
      }
      
      if (jogo.pressionou[TECLA.D]) {
         disparo();
         //Chama função Disparo	
      }

   } // fim da função movejogador()

   function moveInimigo1() {
      posicaoX = parseInt($("#inimigo1").css("left"));
      $("#inimigo1").css("left", posicaoX-velocidade);
      $("#inimigo1").css("top", posicaoY);

         if(posicaoX <= 0) {
            posicaoY = parseInt(Math.random() * 334);
            $("#inimigo1").css("left", 680);
            $("#inimigo1").css("top", posicaoY);

         }

   }  // fim da função moveInimigo1()

   function moveInimigo2() {
      posicaoX = parseInt($("#inimigo2").css("left"));
      $("#inimigo2").css("left", posicaoX - 3);

      if (posicaoX <= 0) {
         $("#inimigo2").css("left", 720);
      }

   } // fim da função moveInimigo2()
      
   function moveAmigo() {
      posicaoX = parseInt($("#amigo").css("left"));
      $("#amigo").css("left", posicaoX + 1);

      if(posicaoX > 906){
         $("#amigo").css("left",0);
      }
   }

   function disparo() {
      if(podeAtirar == true) {
         somDisparo.play();
         podeAtirar = false;

         topo = parseInt($("#jogador").css("top"));
         posicaoX = parseInt($("#jogador").css("left"));
         tiroX = posicaoX + 180;
         topoTiro = topo + 90;

         $("#fundoGame").append("<div id='disparo'></div>");
         $("#disparo").css("top", topoTiro);
         $("#disparo").css("left", tiroX);

         var tempoDisparo = window.setInterval(executaDisparo, 30);

      }

         function executaDisparo() {
            posicaoX = parseInt($("#disparo").css("left"));
            $("#disparo").css("left", posicaoX + 15);

               if (posicaoX > 850) {
                  window.clearInterval(tempoDisparo);
                  tempoDisparo = null;
                  $("#disparo").remove();
                  podeAtirar = true;

               }
         } // Fim executaDisparo()     
   } // Fim da função disparo()

   function colisao() {
      var colisao1 = ($("#jogador").collision($("#inimigo1")));
      var colisao2 = ($("#jogador").collision($("#inimigo2")));
      var colisao3 = ($("#disparo").collision($("#inimigo1")));
      var colisao4 = ($("#disparo").collision($("#inimigo2")));
      var colisao5 = ($("#jogador").collision($("#amigo")));
      var colisao6 = ($("#inimigo2").collision($("#amigo")));
      

         // jogador com o inimigo1

         if (colisao1.length > 0) {
         energiaAtual--;
         pontos = pontos - 50;            
         inimigo1X = parseInt($("#inimigo1").css("left"));
         inimigo1Y = parseInt($("#inimigo1").css("top"));
         explosao1(inimigo1X,inimigo1Y);
      
         posicaoY = parseInt(Math.random() * 334);
         $("#inimigo1").css("left", 710);
         $("#inimigo1").css("top",posicaoY);
         }
      
      // jogador com o inimigo2
      
         if (colisao2.length > 0){
            energiaAtual--;
            inimigo2X = parseInt($("#inimigo2").css("left"));
            inimigo2Y = parseInt($("#inimigo2").css("top"));
            explosao2(inimigo2X, inimigo2Y);

            $("#inimigo2").remove();

            reposicionaInimigo2();
         }
      
      // disparo com o inimigo1

         if(colisao3.length > 0) {
            velocidade = velocidade + 0.3;
            pontos = pontos + 100;
            inimigo1X = parseInt($("#inimigo1").css("left"));
            inimigo1Y = parseInt($("#inimigo1").css("top"));

            explosao1(inimigo1X, inimigo1Y);
            $("#disparo").css("left", 950);

            posicaoY = parseInt(Math.random() * 334);
            $("#inimigo1").css("left", 694);
            $("#inimigo1").css("top", posicaoY);
         }

      // disparo com o inimigo2

         if(colisao4.length > 0){

            pontos = pontos + 50;
            inimigo2X = parseInt($("#inimigo2").css("left"));
            inimigo2Y = parseInt($("#inimigo2").css("top"));
            $("#inimigo2").remove();

            explosao1(inimigo2X, inimigo2Y);
            $("#disparo").css("left", 950);

            reposicionaInimigo2();

         }

         // Jogador com o Amigo
         if(colisao5.length > 0){
            pontos = pontos + 100;
            somResgate.play();
            salvos++;
            reposicionaAmigo();
            $("#amigo").remove();
         }

      // Amigo com o Inimigo2
      if(colisao6.length > 0) {
         pontos = pontos - 50;
         perdidos++;
         amigoX = parseInt($("#amigo").css("left"));
         amigoY = parseInt($("#amigo").css("top"));
         inimigo2X = parseInt($("#inimigo2").css("left"));
         inimigo2Y = parseInt($("#inimigo2").css("top"));   
      
         explosao4(inimigo2X, inimigo2Y);
         explosao3(amigoX,amigoY);

         reposicionaAmigo();
         $("#amigo").remove(); 

   }
      
   }
   //Explosão 1
   function explosao1(inimigo1X,inimigo1Y) {
      somExplosao.play();
      $("#fundoGame").append("<div id='explosao1'></div");
      $("#explosao1").css("background-image", "url(assets/img/explosao1.png)");
      var div=$("#explosao1");
      div.css("top", inimigo1Y);
      div.css("left", inimigo1X);
      div.animate({width:200, opacity:0}, "slow");
      
      var tempoExplosao=window.setInterval(removeExplosao, 1000);
      
         function removeExplosao() {
            
            div.remove();
            window.clearInterval(tempoExplosao);
            tempoExplosao=null;
            
         }
         
   } // Fim da função explosao1()

   function reposicionaInimigo2() {
      var tempoColisao4 = window.setInterval(reposiciona4, 5000);

      function reposiciona4(){
         window.clearInterval(tempoColisao4);
         tempoColisao4 = null;

            if(fimDeJogo==false) {
               $("#fundoGame").append("<div id=inimigo2></div>");
            }

      }
   }

   function explosao2(inimigo2X,inimigo2Y) {
      somExplosao.play();
      $("#fundoGame").append("<div id='explosao2'></div");
      $("#explosao2").css("background-image", "url(assets/img/explosao1.png)");
      var div=$("#explosao2");
      div.css("top", inimigo2Y);
      div.css("left", inimigo2X);
      div.animate({width:200, opacity:50}, "slow");
      
      var tempoExplosao=window.setInterval(removeExplosao, 1000);
      
         function removeExplosao() {
            
            div.remove();
            window.clearInterval(tempoExplosao);
            tempoExplosao=null;
            
         }
         
   } // Fim da função explosao2()

   function reposicionaAmigo() {
      var tempoAmigo = window.setInterval(reposiciona6, 6000);

         function reposiciona6(){
            window.clearInterval(tempoAmigo);
            tempoAmigo = null;

            if(fimDeJogo == false) {
               $("#fundoGame").append("<div id='amigo' class='anima3'></div>");
            }
         }
   } // Fim da função reposicionaAmigo()

   function explosao3(amigoX, amigoY){
      $("#fundoGame").append("<div id='explosao3' class='anima4'></div>");
      $("#explosao3").css("top", amigoY);
      $("#explosao3").css("left", amigoX);
      var tempoExplosao3 = window.setInterval(resetaExplosao3, 1000);

      function resetaExplosao3() {
         $("#explosao3").remove();
         window.clearInterval(tempoExplosao3);
         tempoExplosao3 = null;
      }
   }

   function explosao4(inimigo2X, inimigo2Y) {
      somPerdido.play();
      $("#fundoGame").append("<div id='explosao4'></div>");
      $("#explosao4").css("background-image", "url(assets/img/chidori-nagashi.png)");
      var div=$("#explosao4");
      div.css("top", inimigo2Y);
      div.css("left", inimigo2X);
      div.animate({width:90, opacity:0}, "slow");

      var tempoExplosao=window.setInterval(removeExplosao, 1000);
      
      function removeExplosao() {
         
         div.remove();
         window.clearInterval(tempoExplosao);
         tempoExplosao=null;
         
      }

   }

   function placar() {
      $("#placar").html("<h2> Pontos: " + pontos + " Salvos: " + salvos + " Perdidos: " + perdidos + "</h2>");
   } // Fim da função placar()

   function energia() {
      if (energiaAtual == 3){
         $("#energia").css("background-image", "url(assets/img/energia3.png)");
      }

      if (energiaAtual == 2) {
         $("#energia").css("background-image", "url(assets/img/energia2.png");
      }

      if(energiaAtual == 1) {
         $("#energia").css("background-image", "url(assets/img/energia1.png)");
      }

      if (energiaAtual == 0) {
         $("#energia").css("background-image", "url(assets/img/energia0.png)");
         gameOver();
      }

      
   } // Fim da função energia()

   //Função GAME OVER ()

   function gameOver() {
      fimDeJogo = true;
      musica.pause();
      somGameOver.play();

      window.clearInterval(jogo.timer);
      jogo.timer = null;

      $("#jogador").remove();
      $("#inimigo1").remove();
      $("#inimigo2").remove();
      $("#amigo").remove();

      $("#fundoGame").append("<div id='fim'></div>");

      if(pontos >= 5000){
         $("#fim").html("<h2 id='winNaruto'> Game Over </h2><p>Parabéns! Você mostrou ao Sasuke quem é o ninja mais forte!</p><p>Sua pontuação foi: " + pontos + "</p>" + "<div id='reinicia' onClick=reiniciaJogo()><h3>Jogar Novamente</h3></div>");
         $("#fim").css("background-image", "url(assets/img/naruto-win2.jpg)");
         somWin.play();
         somGameOver.pause();
      } 

      if(pontos <= 4999){
         $("#fim").html("<h2 id='winSasuke'> Game Over </h2><p>Você não foi páreo para o poder Uchiha!</p><p>Sua pontuação foi: " + pontos + "</p>" + "<div id='reinicia' onClick=reiniciaJogo()><h3>Jogar Novamente</h3></div>");
         $("#fim").css("background-image", "url(assets/img/sasuke-win.jpg)");
      }
      
   } // Fim da função gameOver()
   
}

function reiniciaJogo() {
   somGameOver.pause();
   $("#fim").remove();
   start();
}

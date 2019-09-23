// Estado principal que irá conter o jogo
var mainState = {
    preload: function() {
        // Essa função será executada na inicialização da página (Imagens e sons)
       
        // Carrega o sprite do 'passáro'
        game.load.image('bird', 'assets/bird.png'); 

        // Carrega o sprite dos obstaculos
        game.load.image('pipe', 'assets/pipe.png');

        // Carrega o som de pulo
        game.load.audio('jump', 'assets/jump.wav');
    },
    create: function() {
        // Essa função será executada após a função preload (Setup do jogo, sprites, etc)
        
        // Cor do background do nível
        game.stage.backgroundColor = '#71c5cf'; 

        // Adicionando um contador de pontos
        this.score = 0;
        this.labelScore = game.add.text(20, 20, "0",
            { font: "30px Calibri", fill: "#ffffff" });

        // Define o tipo de motor físico
        game.physics.startSystem(Phaser.Physics.ARCADE); 

        // Coloca o passaro na posicão definida
        this.bird = game.add.sprite(100, 245, 'bird'); 

        // Muda a 'ancora' do passaro para esquerda abaixo
        this.bird.anchor.setTo(-0.2, 0.5);

        // Adiciona o som de pulo ao jogo
        this.jumpSound = game.add.audio('jump');

        // Cria um grupo vazio para conter todos os obstaculos
        this.pipes = game.add.group();

        // Timer para adicionar obstaculos em loop a cada 1.5 segundos
        this.timer = game.time.events.loop(1500, this.addRowOfPipes, this);
       
        // Adiciona física ao passaro (movimento, gravidade, colisão, etc)
        game.physics.arcade.enable(this.bird);

        // Adiciona gravidade ao passáro para fazer ele cair
        this.bird.body.gravity.y = 1000;

        // Chama a função 'jump' quando apertar a barra de espaço
        var spaceKey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        spaceKey.onDown.add(this.jump, this);
    },
    update: function() {
        // Essa função será executada em cada frame, 60 vezes por segundo (Lógica do jogo)

        // O angulo do passaro decrementa até certo ponto na queda
        if (this.bird.angle < 20) {
            this.bird.angle += 1;
        }

        // Se o passaro colidir com o obstaculo, chamar restartGame
        game.physics.arcade.overlap(
            this.bird, this.pipes, this.hitPipe, null, this);

        // Se o passáro estiver fora da tela, chamar a função restartGame
        if (this.bird.y < 0 || this.bird.y > 490) {
            this.restartGame();
        }
    },
    jump: function() {
        // Se o passaro estiver morto, nao pode pular
        if (this.bird.alive == false) {
            return;
        }

        // Executa efeito sonoro do pulo
        this.jumpSound.play();

        // // Cria uma animação para o passaro
        // var animation = game.add.tween(this.bird);

        // // Muda o angulo do passaro para -20° em 100 milisegundos
        // animation.to({angle: -20}, 100);

        // // Inicia a animação
        // animation.start();

        game.add.tween(this.bird).to({ angle: -20 }, 100).start(); 

        // Incrementa velocidade vertical ao passáro
        this.bird.body.velocity.y = -350;
    },
    restartGame: function() {
        // Inicializa o 'main' state novamente, reinicializando o jogo
        game.state.start('main');
    },
    addOnePipe: function(x, y) {
        // Cria um obstaculo nas coordenadas x e y
        var pipe = game.add.sprite(x, y, 'pipe');

        // Adiciona o obstaculo para o nosso grupo previamente criado
        this.pipes.add(pipe);

        // Habilita física no obstaculo
        game.physics.arcade.enable(pipe);

        // Incrementa velocidade ao obstaculo para movimentar-se a esquerda
        pipe.body.velocity.x = -200;

        // Automaticamente elimina o obstaculo quando não estiver mais visivel
        pipe.checkWorldBounds = true;
        pipe.outOfBoundsKill = true;
    },
    addRowOfPipes: function() {
        // Adiciona um ponto ao score a cada obstaculo criado
        this.score += 1;
        this.labelScore.text = this.score;

        // Numero randomico entre 1 e 5
        // Posição do buraco no obstaculo (buraco duplo)
        var hole = Math.floor(Math.random() * 5) + 1;

        // Adiciona os 6 obstaculos
        // Com um buraco na posicao 'hole' e 'hole+1'
        for (var i = 0; i < 8; i++) {
            if (i != hole && i != hole + 1) { // Se i for diferente das coordenadas dos buracos
                this.addOnePipe(400, i * 60 + 10);
            }
        }

    },
    hitPipe: function() {
        // Se o passaro ja atingiu um obstaculo, faz nada
        // Significa que o passaro ja esta caindo
        if (this.bird.alive == false) {
            return;
        }

        // Muda a propriedade alive do passaro para false
        this.bird.alive = false;

        // Para a criação de obstaculos
        game.time.events.remove(this.timer);

        // Roda todo o grupo de obstaculos e para o movimento de cada um
        this.pipes.forEach(function(p) {
            p.body.velocity.x = 0;
        }, this);
    }
};

// Inicializando o phaser com dimensões da tela
var game = new Phaser.Game(400, 490);

// Adiciona o 'mainState' em game, o chamando de 'main'
game.state.add('main', mainState);

// Inicializa o state para iniciar o jogo
game.state.start('main');
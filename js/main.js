(function() {
    self.Board = function (width, height) {
        

        this.width = width;
        this.height = height;
        this.isPlaying = false;
        this.gameOver = false;
        this.bars = [];
        this.ball = null;

    }

    self.Board.prototype = {

        get elements(){

            var elements = this.bars.map(function(bar) { return bar; });
            elements.push(this.ball);
            return elements;
        }
    }
})();

(function(){

    self.Ball = function(x,y,radius,board) {
        
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.speed_y = 0;
        this.speed_x = 3;
        this.board = board;
        this.kind = "circle";
        this.direction_x = 1;
        this.direction_y = 1;
        this.bounce_angle = 0;
        this.max_bounce_angle = Math.PI / 12;
        this.speed = 3;

        board.ball = this;

    }

    self.Ball.prototype = {

        move: function() {

            this.x += (this.speed_x * this.direction_x);
            this.y += (this.speed_y * this.direction_y);
        },

        get width(){

            return this.radius * 2;

        },

        get height(){

            return this.radius * 2;
            
        },
        collision: function (bar) {
            
            //reacciona a la colisión de una barra que recibe como parámetro
            //Reacciona a la colisiona con una barra que recibe como parametro  
            var relative_intersect_y = ( bar.y + (bar.height / 2) ) - this.y;

            var normalized_intersect_y = relative_intersect_y / (bar.height / 2);

            this.bounce_angle = normalized_intersect_y * this.max_bounce_angle;

            this.speed_y = this.speed * -Math.sin(this.bounce_angle) * (this.direction_y);
            this.speed_x = this.speed * Math.cos(this.bounce_angle);

            if (this.x > (this.board.width / 2)) {

                this.direction_x = -1;
            }else {

                this.direction_x = 1;
            }

        }
        
        
    }
})();

(function(){

    self.Bar = function(x,y,width, height, board) {
        
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.board = board;
        this.board.bars.push(this); 
        this.kind = "rectangle";
        this.speed = 10;
    }

    self.Bar.prototype = {

        down: function(){
            
            this.y += this.speed;
        },
    
        up: function () {
            
            this.y -= this.speed;
        },
        toString: function(){

            return "x: " + this.x + " y: " + this.y;
        }
        
    }
})();

(function() {

    self.BoardView = function(canvas, board) {
        
        this.canvas = canvas;
        this.canvas.width = board.width;
        this.canvas.height = board.height;
        this.board = board;
        this.contexto = canvas.getContext("2d");
    }

    self.BoardView.prototype = {

        clean: function(){
            this.contexto.clearRect(0,0,this.board.width,this.board.height);
        },

        draw: function(){
            
            for (let index = this.board.elements.length - 1; index >= 0; index--) {
                
                var el = this.board.elements[index];

                draw(this.contexto,el);
            };
        },

        check_collisions: function () {
        
            for (var index = this.board.bars.length -1; index >= 0; index--) {
                
                var bar = this.board.bars[index];

                if(hit(bar, this.board.ball)){
                    
                    this.board.ball.collision(bar);
                }

                if(this.board.ball.y < 10) {
                    
                    this.board.ball.y += 1;
                    this.board.ball.direction_y *= -1;
                }

                if(this.board.ball.y > 390){

                    this.board.ball.y -= 1;
                    this.board.ball.direction_y *= -1;
                }

                if(this.board.ball.x > 800 || this.board.ball.x < 0){

                    
                    asignarPuntos(this.board.ball.x);
                    ball.x = 400;
                    ball.y = 150;
                    ball.radius = 10;
                    ball.board = board;
                    board.isPlaying = !board.isPlaying;
                }
            }
        },

        play: function() {
            
            if(this.board.isPlaying){

                this.clean();
                this.draw();
                this.check_collisions();
                this.board.ball.move();
            }
        }
    }

    function hit(a,b) {

        //Revisa si a colisiona con b
        var hit = false;
        
        //Colisiones hirizontales
        if(b.x + b.width >= a.x && b.x < a.x + a.width){

            //Colisiona verticales
        if (b.y + b.height >= a.y && b.y < a.y + a.height) 
            hit = true;
        }

        
        //Colisión de a con b
        if(b.x <= a.x && b.x + b.width >= a.x + a.width){

            if (b.y <= a.y && b.y + b.height >= a.y + a.height) 
                hit = true;
        }

        
        //Colision b con a
        if(a.x <= b.x && a.x + a.width >= b.x + b.width){
        
            //Colisiona verticales
            if (a.y <= b.y && a.y + a.height >= b.y + b.height) 
                hit = true;
        }

        return hit;
        
    }

    function draw(contexto,element) {
            
        switch (element.kind) {
            case "rectangle":
                
                contexto.fillRect(element.x,element.y,element.width,element.height);
                break;

            case "circle":

                contexto.beginPath();
                contexto.arc(element.x,element.y,element.radius,0,7);
                contexto.fill();
                contexto.closePath();

                break;
        
            default:
                break;
        }

    }

})();

    var board = new Board(800, 400);

    var bar_Payer1 = new Bar(20,150,10,100,board);
    var bar_Payer2 = new Bar(770,150,10,100,board);

    var canvas = document.getElementById('canvas');
    var board_view = new BoardView(canvas,board);
    var ball = new Ball(400, 150, 10,board);


//Funciones de las teclas
document.addEventListener("keydown", function(event) {

    //Comandos primer jugador
    if (event.code == "ArrowDown") {
        
        event.preventDefault();
        bar_Payer2.down();
        
    }else if(event.code == "ArrowUp"){

        event.preventDefault();
        bar_Payer2.up();
    }

    //Comandos segundo jugador
    if (event.code == "KeyS") {
        
        event.preventDefault();
        bar_Payer1.down();
        
    }else if(event.code == "KeyW"){
        
        event.preventDefault();
        bar_Payer1.up();
        
    }
    
    //Pausar el juego
    if(event.code == "Space"){
        
        event.preventDefault();
        board.isPlaying = !board.isPlaying;
    }

});

//Asignar puntos al jugador 1 o al jugador 2 dependiendo de las coordenadas
var puntosJugador1 = 0;
var puntosJugador2 = 0;
function asignarPuntos(coordenad_X){

    console.log("------------");
    if(coordenad_X>800){
        
        puntosJugador1++;
        document.getElementById("puntosJugador1").innerHTML = puntosJugador1;
    }else{

        puntosJugador2++;
        document.getElementById("puntosJugador2").innerHTML = puntosJugador2;
    }
}

//Ejecución del juego
board_view.draw();
window.requestAnimationFrame(controller);

function controller() {

    board_view.play();
    window.requestAnimationFrame(controller);
}
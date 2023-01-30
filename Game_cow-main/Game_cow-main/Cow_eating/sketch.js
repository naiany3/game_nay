const Engine = Matter.Engine;
const Render = Matter.Render;
const World = Matter.World;
const Bodies = Matter.Bodies;
const Constraint = Matter.Constraint;
const Body = Matter.Body;
const Composites = Matter.Composites;
const Composite = Matter.Composite;

let engine;
let world;
var ground;
var fruit, rope, rope2, rope3;
var fruit_con, fruit_con_2, fruit_con_3;
var bg_img, fruit_img, cow_img;
var cow;
var button, button2, button3;
//variáveis de animações
var blink, eat, sad;
var isMobile;
var canW, canH; //variáveis para guardar a largura e altura da tela

function preload() {
  bg_img = loadImage("background.png");
  fruit_img = loadImage("fruit.png");
  cow_img = loadImage("cow.png");
}

function setup() {
  var isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  if(isMobile){//checando se está sendo jogado em um celular
    canW = displayWidth; 
    canH = displayHeight; 
    createCanvas(displayWidth+80, displayHeight);
  } 
  else {
    canW = windowWidth; 
    canH = windowHeight; 
    createCanvas(windowWidth, windowHeight);
  }
  //cria o "fundo"
 // createCanvas(500,700);
  frameRate(80);

  //som de fundo
  //bk_song.play();
  //bk_song.setVolume(0.06);

  engine = Engine.create();
  world = engine.world;

  //botão para o balão
  blower = createImg('ballon.png');
  blower.position(10, 250);
  blower.size(150, 100);

  button = createImg("button.png");//criando uma imagem que servirá como botão
  button.position(20, 30);
  button.size(50, 50);
  button.mouseClicked(drop);//chamando função quando o mouse clicar a imagem
  //botão 2
  button2 = createImg('button2.png');
  button2.position(330, 35);
  button2.size(60, 60);
  button2.mouseClicked(drop2);
  //botão 3
  button3 = createImg('button3.png');
  button3.position(360, 200);
  button3.size(60, 60);
  button3.mouseClicked(drop3);

  //cria o chão
  ground = new Ground(200,canH,600,20);

  //cria uma nova corda com 7 segmentos e na posição X/Y
  rope = new Rope(8, {x:40,y:30});
  rope2 = new Rope(7, {x:370,y:40});
  rope3 = new Rope(4, {x:400,y:225});

  //sprite do coelho
  cow = createSprite(170,canH-80,100,100);
  //cow.addImage(cow_img);
  cow.scale = 0.3;
  cow.addAnimation('cow', cow_img);
  

  //adiciona fisica usando o matter.js
  var fruit_options = {
    density: 0.001
  }
  //cria a "bola"
  fruit = Bodies.circle(300,300,20, fruit_options);
  Matter.Composite.add(rope.body,fruit);//colocar no do aluno

  //cria um link entre a corda e a bola
  fruit_con = new Link(rope, fruit);
  fruit_con_2 = new Link(rope2,fruit);
  fruit_con_3 = new Link(rope3,fruit);
  //criando um botão
  
  rectMode(CENTER);
  ellipseMode(RADIUS);
  textSize(50); 
  //imageMode(CENTER);
}

function draw() {
  //cor do "fundo"
  background(51);
  //imagem de fundo
  image(bg_img,0,0,displayWidth+80,displayHeight);
  push();
  imageMode(CENTER);
  //checando se o corpo da fruta existe
  if(fruit != null) {
    image(fruit_img,fruit.position.x,fruit.position.y,70,70);
  }
  pop();
  //desenha a corda 
  rope.show();
  rope2.show();
  rope3.show();
  
  //atualiza em tempo real a fisica
  Engine.update(engine);

  ground.show();

  //desenhando sprites
  drawSprites();
}

function drop() {
  rope.break();//para "cortar" a corda//soltá-la do topo
  fruit_con.detach();//removeremos a restrição da fruta 
  fruit_con = null; //Para não afetar a fruta
}

function drop2() {
  rope2.break();
  fruit_con_2.detach();
  fruit_con_2 = null;
}

function drop3() {
  rope3.break();
  fruit_con_3.detach();
  fruit_con_3 = null;
}


function collide(body, sprite) {
  if(body != null) {//verificando se o corpo existe ou não
    //função para encontrar a distância
    var distancia = dist(body.position.x, body.position.y, sprite.position.x, sprite.position.y);
    if(distancia <= 80) {
      World.remove(engine.world,fruit);
      fruit = null;//para a fruta sumir quando o coelho "comer" ela
      return true; 
    } else {
      return false;//a fruta ficará na tela
    }
  }
}


import { FRUITS } from "/suika/fruits.js";

var Engine = Matter.Engine,
    Render = Matter.Render,
    Runner = Matter.Runner,
    Bodies = Matter.Bodies,
    World = Matter.World,
    Body = Matter.Body;

// 엔진 선언
const engine = Engine.create();

// 렌더 선언
const render = Render.create({
    engine,
    element : document.body,
    options : {
        wireframes : false,
        background : '#F7F4CB',
        width : 620,
        height : 850,
    }
});

const world = engine.world;

const leftWall = Bodies.rectangle(15, 395, 30, 790, {
    isStatic : true,
    render: { fillStyle : '#E6B143' }
});
    
const rightWall = Bodies.rectangle(605, 395, 30, 790, { 
    isStatic : true, 
    render : { 
        fillStyle : '#6B143' 
    }
});

const ground = Bodies.rectangle(310, 820, 620, 60, { 
    isStatic : true, 
    render : { 
        fillStyle : '#6B143'
    }
});

const topLine = Bodies.rectangle(310, 150, 620, 2, { 
    isStatic : true, 
    isSensor : true,
    render : { 
        fillStyle : '#6B143' 
    }
});

World.add(world, [leftWall, rightWall, ground, topLine]);

Render.run(render);
Render.run(engine);

// 현재 과일 값을 저장할 변수 생성
let currentBody = null;
let currentFruit = null;

let disableAction = false;
function addFruit(){
    // 과일 index 저장
    const index = Math.floor(Math.random()*5);
    const fruit = FRUITS[index];
    const body = Bodies.circle(300, 50, fruit.radius, {
        index : index,
        isSleeping : true,
        render  :{
            sprite : {textrue : `${fruit.name}.png`},
        },
        restitution : 0.5,
    });

    currentBody = body;
    currentFruit = fruit;
    World.add(world, body)
}

window.onkeydown = (event) =>{
    if(disableAction)
        return;

    switch(event.code){
        case "KeyA":
            Body.setPosition(currentBody, {
                x : currentBody.position.x - 10,
                y : currentBody.position.y
            })
            break;
        case "KeyD":
            Body.setPosition(currentBody, {
                x : currentBody.position.x + 10,
                y : currentBody.position.y
            })
            break;
        case "KeyS":
            currentBody.isSleeping = false;
            disableAction = true;
            setTimeout(() => {
                addFruit();
                disableAction = false;
            }, 1000);
            break;
    }
}

addFruit();
import {FRUITS} from "/suika/fruits.js";

var Engine = Matter.Engine,
    Render = Matter.Render,
    Runner = Matter.Runner,
    Bodies = Matter.Bodies,
    World = Matter.World,
    Body = Matter.Body,
    Events = Matter.Events;

// 엔진 선언
const engine = Engine.create();

// 렌더 선언
const render = Render.create({
    engine,
    element : document.body,
    options : {
        wireframes : false, // true면 색 적용 안됨
        background : '#F7F4CB', // 배경
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
    name : "topLine",
    isStatic : true, 
    isSensor : true,
    render : { 
        fillStyle : '#6B143' 
    }
});

// World.add(world, [leftWall]);
World.add(world, [leftWall, rightWall, ground, topLine]);

Render.run(render);
Runner.run(engine);

// 현재 과일 값을 저장할 변수 생성
let currentBody = null;
let currentFruit = null;

let disableAction = false;

function addFruit() {
    // 과일 index 저장
    const index = Math.floor(Math.random()*5);
    const fruit = FRUITS[index];
    const body = Bodies.circle(300, 50, fruit.radius, {
        index : index,
        isSleeping : true,
        render  :{
            sprite : {texture : `${fruit.name}.png`},
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
            if(currentBody.position.x - currentFruit.radius>30)
            Body.setPosition(currentBody, {
                x : currentBody.position.x - 10,
                y : currentBody.position.y
            })
            break;
        case "KeyD":
            if(currentBody.position.x + currentFruit.radius<590)
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

Events.on(engine, "collisionStart", (event)=>{
    // 콜리전 이벤트 발생시 생기는 모든 오브젝트를 비교
    event.pairs.forEach((collision) => {
        if(collision.bodyA.index == collision.bodyB.index){

            // 기존 과일의 index를 저장
            const index = collision.bodyA.index;

            if(index===FRUITS.length-1){
                return;
            }

            // 충동이 일어나는 같은 과일 제거
            World.remove(world, [collision.bodyA, collision.bodyB]);

            // 기존 과일에서 1 증가 시킨 값을 저장
            const newFruit = FRUITS[index + 1];
            const newBody = Bodies.circle(
                // 부딪친 위치의 x, y 값
                collision.collision.supports[0].x,
                collision.collision.supports[0].y,
                newFruit.radius,
                {
                    // 과일 index 저장
                    index : index + 1,
                    // 새로운 과일 렌더링
                    render : {sprite : {texture : `${newFruit.name}.png`}},
                }
            );

            World.add(world, newBody);
        }
        
        if(!disableAction && (collision.bodyA.name === "topLine" || collision.bodyB.name === "topLine" )){
            alert("Game Over");
            disableAction = true;
        }
    });
});

addFruit();
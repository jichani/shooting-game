//캔버스 세팅
let canvas;
let ctx;
canvas = document.createElement("canvas")
ctx = canvas.getContext("2d")
canvas.width=400;
canvas.height=700;
document.body.appendChild(canvas);

let backgroundImage, spaceshipImage, bulletImage, enemyImage, gameOverImage;
let gameOver = false // true이면 게임이 끝남, false이면 게임이 안끝남
let score = 0;

//우주선 좌표
let spaceshipX = canvas.width/2-32
let spaceshipY = canvas.height-64

let bulletList = [] //총알들을 저장하는 리스트

function Bullet() {
    this.x=0;
    this.y=0;
    this.init=function(){
        this.x = spaceshipX + 20;
        this.y = spaceshipY
        this.alive = true // true면 살아있는 총알 false면 죽은 총알
        bulletList.push(this)
    }
    this.update = function() {
        this.y-=7
    }

    this.checkHit = function() {
        //총알.y <= 적군.y And
        //총알.x >= 적군.x and 총알.x <= 적군.x + 적군의 넓이
        for (let i = 0; i < enemyList.length; i++) {
            if(this.y <= enemyList[i].y && this.x >= enemyList[i].x && this.x <= enemyList[i].x+40) {
                score++;
                this.alive = false //죽은 총알
                enemyList.splice(i, 1);
            }
        }
    }
}


let enemyList=[];
function generateRandomValue(min,max) {
    let randomNum = Math.floor(Math.random()*(max-min+1))+min;
    return randomNum;
}

function Enemy () {
    this.x=0;
    this.y=0;
    this.init = function() {
        this.y= 0;
        this.x= generateRandomValue(0, canvas.width-48)
        enemyList.push(this)
    }
    this.update = function(){
        this.y += 2; //적군의 속도 조정

        if (this.y >= canvas.height - 48) {
            gameOver = true;
            console.log("gameover");
        }
    }
}

function loadImage() {
    backgroundImage = new Image();
    backgroundImage.src="images/background.gif"

    spaceshipImage = new Image();
    spaceshipImage.src="images/spaceship.png"

    bulletImage = new Image();
    bulletImage.src = "images/bullet.png"

    enemyImage = new Image();
    enemyImage.src = "images/enemy.png"

    gameOverImage = new Image();
    gameOverImage.src = "images/gameover.png"
}

let keysDown={};
function seupkeyboardListener() {
    document.addEventListener("keydown", function(event) {
        // keydown에 스페이스바를 눌렀을 때 정의를 하면 꾹 누르면 계속 나가게 되서 게임이 재미가 없어진다.
        keysDown[event.keyCode] = true;
        
    });
    document.addEventListener("keyup", function(event) {
        delete keysDown[event.keyCode]
        
        if(event.keyCode == 32) {
            createBullet() // 총알 생성
        }
    })
}

// 하나의 함수에는 하나의 function이 있는게 좋다.
function createBullet() {
    console.log("총알생성")
    let b = new Bullet() // 위에 function Bullet을 하나 더 만든다.
    b.init();
    console.log("새로운 총알 리스트", bulletList)
}

function createEnemy (){
    const interval = setInterval(function () {
        let e = new Enemy()
        e.init()
    }, 1000);
}

function update() {
    if (39 in keysDown) {
        spaceshipX += 5; // 우주선의 속도
    } // right
    if (37 in keysDown) {
        spaceshipX -= 5;
    } // left

    if (spaceshipX <=0) {
        spaceshipX = 0;
    }
    if (spaceshipX >= canvas.width - 64) {
        spaceshipX = canvas.width - 64;
    }
    //우주선의 좌표값이 경기장안에만 있게 하려면?
    
    // 총알의 y좌표 업데이트하는 함수 호출
    for(let i=0; i<bulletList.length;i++) {
        if (bulletList[i].alive) {
            bulletList[i].update();
            bulletList[i].checkHit();
        }
    }

    for (let i = 0; i < enemyList.length; i++) {
        enemyList[i].update();
    }

}

function render () {
    ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
    ctx.drawImage(spaceshipImage, spaceshipX, spaceshipY);
    ctx.fillText(`score:${score}`, 20, 20);
    ctx.fillStyle = "white";
    ctx.font = "20px Arial";
    for(let i=0;i<bulletList.length;i++){
        if (bulletList[i].alive) {
            ctx.drawImage(bulletImage,bulletList[i].x,bulletList[i].y);
        }
    }

    for(let i = 0; i<enemyList.length;i++) {
        ctx.drawImage(enemyImage,enemyList[i].x,enemyList[i].y)
    }
}

function main () {
    if (!gameOver) {
        update(); //좌표값을 업데이트하고
        render(); //그려주고
        requestAnimationFrame(main);
    } else {
        ctx.drawImage(gameOverImage, 10, 100, 380, 380);
    }
}

loadImage();
seupkeyboardListener();
createEnemy();
main();

// 방향키를 누르면
// 우주선의 xy 좌표가 바뀌고
// 다시 render 그려준다.

// 총알 만들기
// 1. 스페이스바를 누르면 총알 발사
// 2. 총알이 발사 = y 값이 --, 총알의 x값은? 스페이스를 누른 순간의 우주선의 x좌표
// 3. 발사된 총알들은 총알 배열에 저장을 한다.
// 4. 총알들은 x,y 좌표값이 있어야 한다.
// 5. 총알 배열을 가지고 render 그려준다.


// 적군 만든다.
// x, y, init, update
// 적군의 위치가 랜덤하다
//적군은 밑으로 내려온다 = y좌표가 증가한다.
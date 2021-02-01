var pastimages = [];
var bullets = [];
var badbullets = [];
var ragesound = new Audio("sounds/ragemode.mp3");
var dashsound = new Audio("sounds/dash.mp3");
var hurtsound = new Audio("sounds/hurt.mp3");
var teleportsound = new Audio("sounds/teleport.mp3");
var glitchsound = new Audio("sounds/glitch.mp3");
var enemyshotsound = new Audio("sounds/enemyshoot.mp3");
var spacepressed = false;
var explosionsound = new Audio("sounds/explosion.mp3");
var tankskilled = {name: "tankskilled", value: 0},
    bomberskilled = {name: "bomberskilled", value: 0},
    puncherskilled = {name: "puncherskilled", value: 0},
    totalcoins = {name: "totalcoins", value: 0},
    deaths = {name: "deaths", value: 0},
    powerupscollected = {name: "powerupscollected", value: 0},
    gunnerskilled = {name: "gunnerskilled", value: 0},
    thieveskilled = {name: "thieveskilled", value: 0},
    heartykilled = {name: "heartykilled", value: 0};
var gotpowerup;
var accuracy = {
    shotScore: 0,
    shots: 0
}
var rageskull = {
	time: 100,
	onscreen: false,
	img: new Image()
}
//powerups
var teleport = {
    x: null,
    y: null,
    x2: null,
    y2: null,
    onscreen: false,
    size: 15,
    color: "green"
}
var glitchblast = {
    x: null,
    x: null,
    onscreen: false,
    size: 15,
    color: "#008B8B"
}
var rapidgun = {
    x: null,
    y: null,
    onscreen: false,
    using: false,
    time: 0,
    size: 15,
    img: new Image("icons/rapidgun.png"),
    sound: new Audio(""),
    color: "yellow",
	usetime: 0
}
var missilelauncher = {
	x: null,
	y: null,
	onscreen: false,
	using: false,
	time: 0,
	size: 15,
	img: new Image('icons/rocket.png'),
	sound: new Audio(''),
	spriteimg: new Image('icons/rocketpowerup')
}
var shotgun = {
    x: null,
    y: null,
    onscreen: false,
    using: false,
    time: 0,
    size: 15,
    img: new Image(),
    sound: new Audio(),
    color: "#ff0066"
}
var ammobox = {
    x: null,
    y: null,
    onscreen: false,
    size: 25,
    spriteimg: new Image(),
    sound: new Audio()
}
var piercegun = {
    x: null,
    y: null,
    onscreen: false,
    using: false,
    time: 0,
    requirement: 5,
    size: 15,
    img: new Image(),
    sound: new Audio(),
    color: "blue"
}
//player
var player = {
	enraged: false,
    x: null,
    y: null,
	health: startinghealth,
	guncooldown: 0,
	dashtime: 0,
	dashcooldown: 0,
	invincibilityTime: 0,
    size: 25,
    img: new Image(),
    hitX: 0,
    hitY: 0,
    slideTime: 0,
    ammo: 10,
    shotsound: new Audio(),
    direction: "up",
    move: function () {
		if(this.dashtime==0){
			if (keys["ArrowUp"] ==  true) {
				this.y = this.y-3;
			}
			if (keys["ArrowDown"] ==  true) {
				this.y = this.y+3;
			}
			if (keys["ArrowRight"] ==  true) {
				this.x = this.x+3;
			}
			if (keys["ArrowLeft"] ==  true) {
				this.x = this.x-3;
			} 
			if (keys["w"] ==  true || keys["W"] ==  true) {
				this.direction = "up";
			}
			if (keys["a"] ==  true || keys["A"] ==  true) {
				this.direction = "left";
			}
			if (keys["s"] ==  true || keys["S"] ==  true) {
				this.direction = "down";
			}
			if (keys["d"] ==  true || keys["D"] ==  true) {
				this.direction = "right";
			}
		}
		if(this.dashtime > 0){
			if(this.dashtime%2 == 0){
				var color;
				for(var i in powerups){
					if(powerups[i].using==true){
						if(powerups[i].color){
							color = powerups[i].color;	
						}
						else{
							color = 'purple';
						}
					}
				}
				if(color==null){
					color="orange";
				}
				pastimages.push(new pastimage(this.x,this.y));
			}
			this.dashtime--;
			this.slideTime=0;
			this.x+=this.hitX;
            this.y+=this.hitY;
		}
        else if (this.slideTime > 0) {
            this.slideTime--;
            this.x+=this.hitX*6;
            this.y+=this.hitY*6;
        }
        else{
            this.hitX = 0;
            this.hitY = 0;
        }
    },
    draw: function() {
        ctx.save();
        ctx.translate(this.x,this.y);
        ctx.translate(12.5, 12.5);
        if (this.direction == "right") {
            ctx.rotate(Math.PI);
        }
        if (this.direction == "up") {
            ctx.rotate(Math.PI/2);
        }
        if (this.direction == "down") {
            ctx.rotate(Math.PI/-2);
        }
       // ctx.fillRect(width / -2, height / -2, width, height);
        ctx.drawImage(player.img,-12.5,-12.5);
        ctx.restore();
    },
    shoot: function() {
		if (player.guncooldown > 0) {
			player.guncooldown--;   
		}
        if (keys[" "] == true && player.ammo > 0 && spacepressed == false && player.guncooldown == 0 && rapidgun.using == false) {
			var angle;
            spacepressed = true;
            if (piercegun.using == false&&shotgun.using == false&&missilelauncher.using==false) {
                accuracy.shots++;
                player.ammo--;
				angle = Math.random()*0.3;
				angle *= Math.floor(Math.random()*2) == 1 ? 1 : -1;
				if(player.enraged==true){
                	bullets.push(new bullet(player.x+7.5,player.y+7.5,4,this.direction,angle,8,"orange"));
				}
				else{
					bullets.push(new bullet(player.x+7.5,player.y+7.5,2,this.direction,angle,8,"orange"));
				}
                player.shotsound.src = "";
                player.shotsound.src = "sounds/pistolgun.mp3";
                player.shotsound.play();
                player.guncooldown = pistolcooldown;
                if (this.direction == "up") {
                   player.y += 20;
                }
                if (this.direction == "down") {
                   player.y -= 20;
                }
                if (this.direction == "left") {
                   player.x += 20;
                }
                if (this.direction == "right") {
                   player.x -= 20;
                }
            }
            else if (piercegun.using == true&&player.ammo >= 3) {
                accuracy.shots++;
                player.ammo -= 3;
                bullets.push(new bullet(player.x+7.5,player.y+7.5,10000,this.direction,0,10,"blue"));
                player.shotsound.src = "";
                player.shotsound.src = "sounds/pistolgun.mp3";
                player.shotsound.play();
                player.guncooldown = 150;
                if (this.direction == "up") {
                   player.y += 20;
                }
                if (this.direction == "down") {
                   player.y -= 20;
                }
                if (this.direction == "left") {
                   player.x += 20;
                }
                if (this.direction == "right") {
                   player.x -= 20;
                }
            }
            else if (shotgun.using == true&&player.ammo >= 2) {
                player.ammo -= 2;
                spacepressed = true;
                shotgun.sound.src = "";
                shotgun.sound.src = "sounds/shotgun.mp3";
                shotgun.sound.play();
				angle = Math.random()*3;
				angle *= Math.floor(Math.random()*2) == 1 ? 1 : -1;
				var damage = 2;
				if(player.enraged==true){
					damage=4;
				}
                bullets.push(new bullet(player.x+6.5,player.y+6.5,damage,this.direction,-1+angle,7,"#ff0066"));
                bullets.push(new bullet(player.x+7.5,player.y+7.5,damage,this.direction,0,7,"#ff0066"));
                bullets.push(new bullet(player.x+8.5,player.y+8.5,damage,this.direction,1+angle,7,"#ff0066"));
                bullets.push(new bullet(player.x+6.5,player.y+6.5,damage,this.direction,2+angle,7,"#ff0066"));
                bullets.push(new bullet(player.x+8.5,player.y+8.5,damage,this.direction,-2+angle,7,"#ff0066"));
                player.guncooldown = 100;
                if (this.direction == "up") {
                    player.y += 5;
                }
                if (this.direction == "down") {
                   player.y -= 5;
                }
                if (this.direction == "left") {
                   player.x += 5;
                }
                if (this.direction == "right") {
                   player.x -= 5;
                }
            }
			else if (missilelauncher.using == true&&player.ammo>0){
				player.ammo--;
				spacepressed=true;
				missilelauncher.sound.src = "";
				missilelauncher.sound.src = "sounds/rocket.mp3";
				missilelauncher.sound.play();
				bullets.push(new bullet(player.x+6.5,player.y+6.5,1,this.direction,-1.5,5,"#00f9ff"));
				bullets.push(new bullet(player.x+6.5,player.y+6.5,1,this.direction,1.5,5,"#ff0072"));
				player.guncooldown=100;
			}	
        }
        else if (keys[" "] == true && player.ammo > 0&&player.guncooldown == 0&&rapidgun.using == true) {
			angle = Math.random()*2;
			angle *= Math.floor(Math.random()*2) == 1 ? 1 : -1;
			if(player.enraged==true){
				bullets.push(new bullet(player.x+7.5,player.y+7.5,2,this.direction,angle,6,"gold"));
			}
			else{
				bullets.push(new bullet(player.x+7.5,player.y+7.5,1,this.direction,angle,6,"gold"));
			}
            rapidgun.sound.src = "";
            rapidgun.sound.src = "sounds/rapidgun.mp3";
            rapidgun.sound.play();
			rapidgun.usetime++;
			if(rapidgun.usetime==10){
				player.ammo--;
				rapidgun.usetime=0;
			}
            player.guncooldown = 10;
            if (this.direction == "up") {
               player.y += 5;
            }
            if (this.direction == "down") {
               player.y -= 5;
            }
            if (this.direction == "left") {
               player.x += 5;
            }
            if (this.direction == "right") {
               player.x -= 5;
            }
        }
    }
}
//explosions
function explosion(x, y, type, size){
    this.x = x;
    this.y = y;
    this.size = size;
    this.class = type;
    if(this.class == "fire"){
        this.colorValue = 100;
    }
    if(this.class == "glitch"){
        this.colorValue = 1;
    }
}
explosion.prototype.draw = function(){
    if(this.class == "fire"){
        this.size -= 5;
        this.x += 2.5;
        this.y += 2.5;
        this.colorValue++;
        ctx.fillStyle = "rgb(255,"+this.colorValue+",0)";
        ctx.fillRect(this.x,this.y,this.size,this.size);   
    }
    else if(this.class == "glitch"){
        this.colorValue-=0.01;
        ctx.fillStyle = "rgba(0, 139, 139, "+this.colorValue+")";
        ctx.fillRect(this.x,this.y,this.size,this.size);
    }
}
//pastimage
function pastimage(x,y,direction,hitX,hitY,color){
	this.x = x;
	this.y = y;
	this.time = 100;
}
pastimage.prototype.draw = function(){
	if(this.time>0){
		this.time-=2;
		ctx.save();
		ctx.globalAlpha = this.time/100;
		ctx.translate(this.x,this.y);
		ctx.translate(12.5, 12.5);
		ctx.fillStyle="white";
		ctx.fillRect(-12.5,-12.5,25,25);
		ctx.restore();
	}
	else{
		delete this;
		pastimages.splice(pastimages.indexOf(this),1);
	}
}
//badsquare
function badsquare(type)
{
	this.invincibilityTime = 0;
    this.moveX = 0;
    this.moveY = 0;
    this.class = type;
    this.nextSpawnTime = 200; 
    this.slideTime = 0;
    this.hitX = 0;
    this.hitY = 0;
    if (this.class == "puncher") {
        this.speed = 1;
        this.size = 25;
        this.health = 3;
        this.damage = 1;
        this.color = "red";
    }
    else if (this.class == "gunner") {
        this.speed = 1;
        this.nextShootTime = 150;
        this.size = 25;
        this.health = 1;
        this.damage = 1;
        this.color = "pink";
    }
    else if (this.class == "tank") {
        this.speed = 1;
        this.size = 40;
        this.health = 50;
        this.damage = 1;
        this.color = "rgb(166, 99, 107)";
    }
    else if (this.class == "bomber") {
        this.speed = 2;
        this.colorSwapTime = 50;
        this.size = 30;
        this.health = 5;
        this.damage = 0;
        this.color = "#DC143C";
    }
    else if(this.class == "hearty"){
        this.health = 3;
        this.speed = 1;
        this.size = 25;
        this.damage = 2;
        this.color = "orange";
    }
    else if(this.class == "thief"){
        this.health = 3;
        this.speed = 1;
        this.size = 20;
        this.damage = 1;
        this.color = "#FF7F50";
    }
	var location = getNewSquareLocation(this.size, badsquares);
	this.x = location.x;
    this.y = location.y;
	if(this.class == "squareslayer"){
		this.health = 400;
		this.speed = 1
		this.size = 100;
		this.color = "darkred";
		this.damage = 2;
		this.nextSpawnTime = 500;
		this.x = screenwidth/2-50;
		this.y = screenheight/2 - 50;
	}
	if(this.class == "squareslayerGun"){
		this.health = 150;
		this.color = "#a83c32";
		this.size = 50;
		this.damage = 2;
		this.nextSpawnTime = 500;
		this.nextShootTime = 100;
		this.nextShootInterval = 500;
		this.shotNumber = 1;
		this.length = 80;
		this.width = 60;
		this.x = screenwidth/2 - 25;
		this.y = screenheight/2 + 100;
		this.speed = 0.5;
	}
	if(this.class == "squareslayerJoint"){
		this.health = 1;
		this.speed = 1;
		this.size = 35;
		this.nextSpawnTime = 500;
		this.color = "#b04b10";
		this.y = screenheight/2 + 12.5;
	}
	if(this.class == "squareslayerClaw"){
		this.health = 125;
		this.nextSpawnTime = 500;
		this.damage = 1;
		this.speed = 1;
		this.size = 40;
		this.y = this.y = screenheight/2 - 80;
		this.color = "#f55a42";
	}
	if(extraStats==true){
		this.health*=2;
		this.damage*=2;
	}
}
function getPossibleMovement(square, friends) {
	var canMove = ["left","right","up","down"];
    if (square.nextSpawnTime > 0) {
        for(var i in canMove) {
            canMove[i] = "";
        }
    }
	for(var i in friends) {
		square.x -= square.speed;
		if (checkCollision(square, friends[i])&&square != friends[i]) {
			canMove[0] = "";
		}
		square.x += square.speed*2;
		if (checkCollision(square, friends[i])&&square != friends[i]) {
			canMove[1] = "";
		}
		square.x -= square.speed;
		square.y -= square.speed;
		if (checkCollision(square, friends[i])&&square != friends[i]) {
			canMove[2] = "";
		}
		square.y += square.speed*2;
		if (checkCollision(square, friends[i])&&square != friends[i]) {
			canMove[3] = "";
		}
		square.y -= square.speed;	
	}
	return canMove;
}
function followAtDistance (square, target, canMove, distance){
	if (square.y < target.y&&square.y > target.y-distance&&canMove[2] == "up") {
		square.y -= square.speed;
		square.moveY=-square.speed;
	}
	else if (square.y > target.y&&square.y < target.y+distance&&canMove[3] == "down") {
		square.y += square.speed;
		square.moveY=square.speed;
	}
	else if (square.y < target.y&& !(square.y+1 > target.y-distance)&&canMove[3] == "down") {
		square.y += square.speed;
		square.moveY = square.speed;
	}
	else if (square.y > target.y&& !(square.y-1 < target.y+distance)&&canMove[2] == "up") {
		square.y -= square.speed;
		square.moveY=-square.speed;
	}
	if (square.x < target.x&&square.x > target.x-distance&&canMove[0] == "left") {
		square.x -= square.speed;
		square.moveX=-square.speed;
	}
	else if (square.x > target.x&&square.x < target.x+distance&&canMove[1] == "right") {
		square.x += square.speed;
		square.moveX=square.speed;
	}
	else if (square.x < target.x&& !(square.x+1 > target.x-distance)&&canMove[1] == "right") {
		square.x += square.speed;
		square.moveX=square.speed;
	}
	else if (square.x > target.x&& !(square.x-1 < target.x+distance)&&canMove[0] == "left") {
		square.x -= square.speed;
		square.moveX=-square.speed;
	}
}
function followTarget(square, target, canMove) {
	var movedup = false;
	var movedleft = false;
	if(target.x + target.size/2 < square.x + square.size/2 && canMove[0] == "left"){
		square.x -= square.speed;
		square.moveX = -square.speed;
		movedleft = true;
	}
	if(target.x + target.size/2 > square.x + square.size/2 && canMove[1] == "right"){
		square.x += square.speed;
		square.moveX = square.speed;
		if(movedleft == true){
			square.x = target.x + target.size/2 - square.size/2;
		}
	}
	else if(movedleft == false){
		square.moveX = 0;
	}
	if(target.y + target.size/2 < square.y + square.size/2 && canMove[2] == 'up'){
		square.y -= square.speed;
		square.moveY = -square.speed;
		movedup = true;
	}
	if(target.y + target.size/2 > square.y + square.size/2 && canMove[3] == 'down'){
		square.y += square.speed;
		square.moveY = square.speed;
		if(movedup == true){
			square.y = target.y + target.size/2 - square.size/2;
		}
	}
	else if(movedup == false){
		square.moveY = 0;
	}
}
badsquare.prototype.move = function() {
	var canMove, target, friends = [], followArray = []; 
	if(this.class != "gunner" && this.class != "squareslayerGun" && this.class != "squareslayerJoint" && this.class != "squareslayerClaw"){
		if(this.class != "glitched" && this.class != "thief"){ //hearty, puncher, squareslayer, tank, bomber
			followArray = [player];
			for(var i in badsquares){
				if(badsquares[i].class == "glitched"){
					followArray.push(badsquares[i]);
				}
				else if(badsquares[i].health > 0 && badsquares[i].class != "squareslayerJoint"){
					friends.push(badsquares[i]);
				}
			}
		}
		else if(this.class == "thief"){ //thief
			for(var i in badsquares){
				if(badsquares[i].class != "glitched"){
					friends.push(badsquares[i]);
				}
			}
			for(var i in powerups){
				if(powerups[i].onscreen == true){
					followArray.push(powerups[i]);	
				}
			}
			if(followArray.length == 0){
				followArray = [player];
			}
		}
		else if(this.class == "glitched"){ // glitched
			for(var i in badsquares){
				if(badsquares[i].class == "glitched"){
					friends.push(badsquares[i]);
				}
				else{
					followArray.push(badsquares[i]);
				}
			}
		}
		target = findNearestObject(this, followArray);
		canMove = getPossibleMovement(this,friends);
		if(target != null && !(this.class == "squareslayer" && badsquares[1].nextShootInterval>0 && badsquares[1].health > 0)){
			followTarget(this,target,canMove);
			if(this.class == "squareslayer" && badsquares[1].health <= 0){
				this.speed = 2;
			}
		}
	}
	else if (this.class == "gunner") { //gunner
		canMove = getPossibleMovement(this,badsquares);
       	followAtDistance(this,player,canMove,150);
    }
	else if(this.class == "squareslayerJoint"){
		this.moveX = badsquares[0].moveX;
		if(this.nextSpawnTime == 0){
			if(this.y > player.y){
				this.y+=this.speed;
				this.moveY = this.speed;
			}
			else{
				this.y-=this.speed;
				this.moveY = -this.speed;
			}
			if(this.y > badsquares[0].y+100){
				this.y = badsquares[0].y+100;
			}
			if(this.y < badsquares[0].y-50){
				this.y = badsquares[0].y-50;
			}
			if(this.side == "right"){
				this.x = badsquares[0].x + 200;
			}
			else {
				this.x = badsquares[0].x - 135;
			}
		}
	}
	else if(this.class == "squareslayerClaw" && this.nextSpawnTime == 0){
		if(badsquares[1].nextShootInterval<=500&&badsquares[1].nextShootInterval>250 && this.health > 0){
			canMove = getPossibleMovement(this,[badsquares[4],badsquares[5]]);
			this.speed = 2;
			followTarget(this,player,canMove);
			this.speed = 1;
		}
		else if(badsquares[1].nextShootInterval<=250&&badsquares[1].nextShootInterval>0 && this.health > 0){
			var joint, offset;
			if(badsquares[0].y+50 < player.y){
				offset = 50;	
			}
			else{
				offset = -50;
			}
			if(this.side == "right"){
				joint = {
					x: badsquares[0].x + 300,
					y: badsquares[3].y + offset,
					size: badsquares[3].size
				}
			}
			else{
				joint = {
					x: badsquares[0].x - 235,
					y: badsquares[2].y + offset,
					size: badsquares[2].size
				}
			}
			this.speed = 2;
			followTarget(this,joint,["left","right","up","down"]);
			this.speed = 1;
		}
		else{
			this.moveX = badsquares[0].moveX;
			if(badsquares[0].y+50 < player.y){
				this.y+=this.speed;
				this.moveY = this.speed;
			}
			else{
				this.y-=this.speed;
				this.moveY = -this.speed;
			}
			if(this.y > badsquares[0].y+150){
				this.y = badsquares[0].y+150;
			}
			if(this.y < badsquares[0].y-150){
				this.y = badsquares[0].y-150;
			}
			if(this.side == "right"){
				this.x = badsquares[0].x + 300;
			}
			else {
				this.x = badsquares[0].x - 235;
			}
		}
	}
	else if(this.class == "squareslayerGun"){
		if(this.nextSpawnTime == 0){
			if(this.x > player.x){
				this.x+=this.speed;
			}
			else{
				this.x-=this.speed;
			}
			if(this.x > badsquares[0].x+50){
				this.x = badsquares[0].x+50;
			}
			if(this.x < badsquares[0].x){
				this.x = badsquares[0].x;
			}
			this.y = badsquares[0].y + 150;
			this.moveX = badsquares[0].moveX;
			this.moveY = badsquares[0].moveY;
		}
	}
	if (this.slideTime > 0) {
		this.slideTime--;
		this.x+=this.hitX*8;
		this.y+=this.hitY*8;
		/**for(var i in badsquares){
			if(checkCollision(badsquares[i],this)){
				this.x-=this.hitX*8;
				this.y-=this.hitY*8;
			}
		}**/
	}
	else{
		this.hitX = 0;
		this.hitY = 0;
	}   
    if (this.y < 0) {
        this.y = 0;
    }
    if (this.y > screenheight-this.size) {
        this.y = screenheight-this.size;
    }
    if (this.x < 0) {
        this.x = 0;
    }
    if (this.x > screenwidth-this.size) {
       this.x = screenwidth-this.size;
    }
}
badsquare.prototype.shoot = function() {
    if ((this.class == "gunner" && this.nextShootTime == 0) || (this.class == "squareslayerGun" && this.nextShootInterval == 0
	   && this.nextShootTime == 0)) {
		if(this.class=='gunner'){
        	this.nextShootTime = 150;
		}
		if(this.class == "squareslayerGun"){
			this.shotNumber++;
			this.nextShootTime = 100;
			if(this.shotNumber==4){
				this.shotNumber=1;
				this.nextShootInterval = 500;
			}
		}
        if (this.nextSpawnTime == 0 && this.health > 0) {
            enemyshotsound.play();
			if(this.class=='gunner'){
				var barrel = getBadBulletPath(this,0,12.5);
				var speeds = getBadBulletPath (this, 0, 10);
				badbullets.push(new badbullet(this.x - 5 + this.size/2 +barrel.xSpeed,this.y - 5 + this.size/2+barrel.ySpeed, speeds.xSpeed, speeds.ySpeed, 10,1,'square'));   
			}
			else{
				var barrel = getBadBulletPath(this,0,60);
				for(var i = 1; i <4 ; i++){
					var speeds = getBadBulletPath (this, 20-i*10, 6);
					badbullets.push(new badbullet(this.x+this.size/2-5 + barrel.xSpeed,this.y-5+this.size/2 +barrel.ySpeed,speeds.xSpeed,speeds.ySpeed,8,1,'circle')); 
				}
			}
        }
    }
}
function getBadBulletPath (square, offset, speed){
	var xDist = player.x+12.5 - square.x-square.size/2;
	var yDist = player.y+12.5 - square.y-square.size/2;
	var angle = Math.atan2(yDist,xDist) / Math.PI * 180;
	var path = {
		xSpeed: Math.cos((angle+offset)/180* Math.PI) * speed,
		ySpeed: Math.sin((angle+offset)/180* Math.PI) * speed
	}
	return path;
}
badsquare.prototype.draw = function()
{
	if (this.class ==  "bomber") {
        this.colorSwapTime--;
        if(this.colorSwapTime == 0){
            this.colorSwapTime = 50;
            if(this.color == "white"){
                this.color = "#DC143C";
            }
            else if(this.color == "#DC143C"){
                this.color = "white";
            }
        }
    }
	if(this.class == "squareslayer"){
		ctx.beginPath()
		ctx.strokeStyle = "#633834";
		ctx.lineWidth = 40;
		ctx.moveTo(badsquares[0].x+50,badsquares[0].y+50);
		ctx.lineTo(badsquares[1].x+25,badsquares[1].y+30);
		ctx.stroke();
		ctx.closePath();
		ctx.beginPath();
		ctx.strokeStyle = "#61322b";
		ctx.lineWidth = 20;
		ctx.moveTo(badsquares[0].x+50,badsquares[0].y+50);
		ctx.lineTo(badsquares[3].x+17.5,badsquares[3].y+17.5);
		ctx.moveTo(badsquares[0].x+50,badsquares[0].y+50);
		ctx.lineTo(badsquares[2].x+17.5,badsquares[2].y+17.5);
		ctx.stroke();
		ctx.closePath();
		if(badsquares[1].health<=0){
			for(var i = 0; i < 10; i ++){
				ctx.fillStyle="rgb(255,"+Math.floor(Math.random()*200)+",0)";
				ctx.fillRect(badsquares[1].x+Math.random()*50,badsquares[1].y+20+Math.random()*5,10,10);
			}
		}
	}
	if(this.class == "squareslayerJoint"){
		var claw;
		if(this.side == "right"){
			claw = badsquares[5];
		}
		else{
			claw = badsquares[4];
		}
		ctx.strokeStyle = "#855251";
		ctx.lineWidth = 20;
		ctx.beginPath();
		ctx.moveTo(this.x+17.5,this.y+17.5);
		ctx.lineTo(claw.x+20,claw.y+20);
		ctx.stroke();
		ctx.closePath();
		if(claw.health<=0){
			for(var i = 0; i < 10; i ++){
				ctx.fillStyle="rgb(255,"+Math.floor(Math.random()*200)+",0)";
				ctx.fillRect(claw.x+Math.random()*25,claw.y+Math.random()*25,10,10);
			}
		}
	}
	ctx.lineWidth = 1;
	ctx.fillStyle = this.color;
    ctx.strokeStyle = this.color;
    if (this.nextSpawnTime > 0) {
		var totaltime;
		if(score<5){
			totaltime = 50;
		}
		else if(badsquares[0].class=="squareslayer"){
			totaltime=500;
		}
		else{
			totaltime = 200;
		}
		if(this.width && this.length){
			ctx.strokeRect(this.x,this.y,this.length,this.width);   
			ctx.fillRect(this.x,this.y+this.width,this.length,-this.width+this.nextSpawnTime*this.width/totaltime); 
		}
		else{
			ctx.strokeRect(this.x,this.y,this.size,this.size);   
			ctx.fillRect(this.x,this.y+this.size,this.size,-this.size+this.nextSpawnTime*this.size/totaltime); 
		}
    }
    else{
		if(this.class == "squareslayerGun"){
			ctx.save();
			ctx.translate(this.x+this.size/2, this.y+this.size/2);
			ctx.rotate(Math.atan2(player.y - this.y+this.size/2, player.x - this.x+this.size/2));
			ctx.fillRect(-25,-25,this.length,this.width);
			ctx.restore();
		}
		else{
			ctx.fillRect(this.x,this.y,this.size,this.size);  
		}
    }
}
//gametext
function gametext(x,y,text,color){
	this.x=x;
	this.y=y;
	this.text = text;
	this.color = color;
	this.time = 100;
}
gametext.prototype.draw = function(){
	ctx.fillStyle = this.color;
	ctx.globalAlpha = this.time/100;
	ctx.fillText(this.text,this.x,this.y);
	this.time--;
	ctx.globalAlpha = 1;
}
//bullet
function bullet(x,y,prc,direction,angle,speed,color) {
    this.x = x;
    this.y = y;
    this.prc = prc;
    this.direction = direction;
    this.ang = angle;
    this.speed = speed;
    this.color = color;
    this.size = 10;
    this.hit = false;
	if(color == "#00f9ff" || color == "#ff0072"){
	 	this.lockontime = 30;  
	}
}
bullet.prototype.move = function() {
	if(this.lockontime!=0){
		if(this.direction=='up'){
			this.y-=this.speed;
			this.x+=this.ang;
		}
		if(this.direction=='down'){
			this.y+=this.speed;
			this.x+=this.ang;
		}
		if(this.direction=='left'){
			this.x-=this.speed;
			this.y+=this.ang;
		}
		if(this.direction=='right'){
			this.x+=this.speed;
			this.y+=this.ang;
		}
	}
	if(this.color=="#ff0072"||this.color=="#00f9ff"){
		if(this.lockontime==0 && this.lockedtarget){
			var trackX=0,trackY=0;
			if(this.color=="#ff0072"){
				if(this.direction=='up'||this.direction=='down'){
					trackX=this.lockedtarget.size;
					trackY=this.lockedtarget.size/2;
				}
				else{
					trackX=this.lockedtarget.size/2;
					trackY=this.lockedtarget.size;
				}
			}
			else{
				if(this.direction=='up'||this.direction=='down'){
					trackY=this.lockedtarget.size/2;
				}
				else{
					trackX=this.lockedtarget.size/2;
				}
			}
			var movedright=false;
			var moveddown=false;
			if(this.lockedtarget.x+trackX>this.x){
				this.x+=this.speed/2;
				movedright=true;
			}
			if(this.lockedtarget.x+trackX<this.x){
				this.x-=this.speed/2;
				if(movedright==true){
					this.x = this.lockedtarget.x+trackX
				}
			}
			if(this.lockedtarget.y+trackY>this.y){
				this.y+=this.speed/2;
				moveddown=true;
			}
			else if(this.lockedtarget.y+trackY<this.y){
				this.y-=this.speed/2;
				if(moveddown==true){
					this.y = this.lockedtarget.y+trackY
				}
			}
			if(this.lockedtarget.health<=0){
				this.lockedtarget = null;
			}
		}
		else{
			this.lockontime--;
			if(this.lockontime==0){
				var followArray = [];
				for(var i in badsquares){
					if(badsquares[i].nextSpawnTime==0 && badsquares[i].class != 'glitched' && badsquares[i].health > 0 && badsquares[i].hasOwnProperty('damage')){
						followArray.push(badsquares[i]);
					}
				}
				if(followArray.length>0){
					var nearest = findNearestObject(this,followArray);
					if(Math.sqrt(Math.pow(nearest.x-this.x, 2) + Math.pow(nearest.y-this.y, 2))<=150){
						this.lockedtarget = nearest;		
					}
					else{
						this.lockontime=1;

					}	
				}
			}
		}
	}
    if (this.x > screenwidth-10 || this.x < 0 || this.y > screenheight-10 || this.y < 0 || this.prc == 0) {
        delete this;
       	bullets.splice(bullets.indexOf(this),1);
    }
}
bullet.prototype.draw = function() {
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x,this.y,10,10);
}
//enemy bullet
function badbullet(x,y,xSpeed,ySpeed,size,damage,shape) {
    this.x = x;
    this.y = y;
    this.ySpeed = ySpeed;
    this.xSpeed = xSpeed;
    this.size = size;
	this.damage = damage;
	this.shape = shape;
}
badbullet.prototype.draw = function() {
    ctx.fillStyle = "red";
	if(this.shape=='square'){
    	ctx.fillRect(this.x,this.y,this.size,this.size);
	}
	else{
		ctx.beginPath();
		ctx.arc(this.x+10,this.y+10,10,50,0,Math.PI*2);
		ctx.fill();
		ctx.closePath();
	}
}
badbullet.prototype.move = function() {
    this.y += this.ySpeed;
    this.x += this.xSpeed;
    if (this.x > screenwidth-10 || this.x < 0 || this.y > screenheight-10 || this.y < 0 || this.prc == 0) {
        delete this;
       	badbullets.splice(badbullets.indexOf(this),1);
    }
}
var powerups = [rapidgun, shotgun, piercegun, ammobox, teleport, glitchblast, missilelauncher];
var stats=[tankskilled, bomberskilled, puncherskilled, totalcoins, deaths, powerupscollected, gunnerskilled, thieveskilled, heartykilled];
var explosions = [];
var gametexts = [];
var badsquares = [];
var toBeDeleted = [];
var bossBackgroundObjects = [];
//setting srcs
player.img.src = "icons/pistolgun.png";
ammobox.spriteimg.src = "icons/ammo.png";
missilelauncher.spriteimg.src = "icons/rocketpowerup.png";
rapidgun.img.src = "icons/rapidgun.png";
missilelauncher.img.src= "icons/rocket.png";
shotgun.img.src = "icons/shotgun.png";
piercegun.img.src = "icons/piercegun.png";
player.shotsound.src = "sounds/pistolgun.mp3";
rapidgun.sound.src = "sounds/rapidgun.mp3";
missilelauncher.sound.src= 'sounds/rocket.mp3';
shotgun.sound.src = "sounds/shotgun.mp3";
piercegun.sound.src = "sounds/piercegun.mp3";
rageskull.img.src="icons/rageskull.png";
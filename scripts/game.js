var keys = ["ArrowUp", "ArrowDown", "ArrowRight", "ArrowLeft", " ", "w", "a", "s", "d", "W", "A", "S", "D"];
var canvas;
var ctx;
var game;
var revived = false;
var revivecost;
var pistolcooldown = 100;
if (localStorage.getItem('pistolcooldown') !== null) {
	pistolcooldown = parseInt(localStorage.getItem('pistolcooldown'), 10);
}
var score;
var deathmessage;
var bossphase = "1notspawned";
var coins, highscore = 0, startinghealth, startingammo;
if (localStorage.getItem('highscore') !== null && localStorage.getItem('highscore') > highscore) {
    highscore = localStorage.getItem('highscore');
    document.getElementById("highscore").innerHTML = highscore;
}
if (localStorage.getItem('startinghealth') !== null) {
	startinghealth = parseInt(localStorage.getItem('startinghealth'),10);
}
else {
	startinghealth= 5;
}
if (localStorage.getItem('revivecost') !== null) {
	revivecost=parseInt(localStorage.getItem('revivecost'),10);
}
if (localStorage.getItem('startingammo') != null) {
	startingammo = parseInt(localStorage.getItem('startingammo'),10);
}
else {
	startingammo= 10;
}
if (localStorage.getItem("coins") != null) {
	coins = parseInt(localStorage.getItem("coins"),10);
}
else {
	coins = 0;
}
var extraStats;
var lastpressedtime = {w: 100, a: 100, s: 100, d: 100};
var lastkeypressed;
window.onkeydown = function(event) {
    keys[event.key] = true;
	if (lastpressedtime[event.key]<30 &&lastkeypressed ==event.key) {
		if (localStorage.getItem('howPurchased')== 'true'&&player.dashcooldown== 0) {
			player.dashtime = 30;
			if (event.key.toLowerCase()== 'w') {
				player.hitY=-12.5;
				player.hitX= 0;
			}
			if (event.key.toLowerCase()== 's') {
				player.hitY= 12.5;
				player.hitX= 0;
			}
			if (event.key.toLowerCase()== 'd') {
				player.hitY= 0;
				player.hitX= 12.5;
			}
			if (event.key.toLowerCase()== 'a') {
				player.hitY= 0;
				player.hitX=-12.5;
			}
			player.dashcooldown=300;
			dashsound.play();
		}
	}
	else if (event.repeat== false) {
		lastkeypressed =event.key;
	}
}
window.onkeyup = function(event) {
   	keys[event.key] = false;
    if (keys[" "] == false) {
        spacepressed = false;
    }
	for(var i in lastpressedtime) {
		if (i==event.key) {
			lastpressedtime[i]= 0;
		}
	}
}
function checkCollision(rect1,rect2) {
	if (rect2 != teleport && rect1 != teleport) {
		if (rect1.x <= rect2.x + rect2.size && rect1.x + rect1.size >= rect2.x && rect1.y <= rect2.y + rect2.size && rect1.y + rect1.size >= rect2.y) {
			return true;
		}
		else {
			return false;
		}      
	}
	else {
		if (rect1.x <= rect2.x + rect2.size && rect1.x + rect1.size >= rect2.x && rect1.y <= rect2.y + rect2.size && rect1.y + rect1.size >= rect2.y) {
			return 1;
		}
		else if (rect1.x <= rect2.x2 + rect2.size && rect1.x + rect1.size >= rect2.x2 && rect1.y <= rect2.y2 + rect2.size && rect1.y + rect1.size >= rect2.y2) {
			return 2;
		}
		else {
			return false;
		} 
	}
}
var screenwidth;
var screenheight;
function startgame() {
	extraStats = false;
	bossphase = "1notspawned";
	revived = false;
	canvas.style.animation="none";
	rageskull.onscreen= false;
	rageskull.time = 100;
	canvas.width = document.body.offsetWidth;
	canvas.height = document.body.offsetHeight;
	screenwidth = canvas.width;
	screenheight = canvas.height;
	canvas.style.border = "none";
    var location;
    gotpowerup = false;
    accuracy.shots = 0;
    accuracy.shotScore = 0;
    player.health = startinghealth;
	player.enraged = false;
	rapidgun.usetime = 0;
    for(var i in powerups) {
        location = getNewSquareLocation(powerups[i].size, powerups);
        powerups[i].onscreen = false;
        powerups[i].using = false;
        powerups[i].x = location.x;
        powerups[i].y = location.y;
		powerups[i].time = 0;
        if (powerups[i] == teleport) {
            location = getNewSquareLocation(powerups[i].size, powerups);
            powerups[i].x2 = location.x;
            powerups[i].y2 = location.y;
        }
    }
	player.invincibilityTime = 0;
    player.img.src = "icons/pistolgun.png";
    player.ammo = startingammo;
	player.dashtime = 0;
    player.slideTime = 0;
    player.hitX = 0;
    player.hitX = 0;
    bullets = [];
    badbullets = [];
    explosions = [];
	gametexts = [];
    player.direction = "up";
    piercegun.requirement = 5;
    player.x = screenwidth/2-12;
    player.y = screenheight/2-12;
	badsquares = [new badsquare("puncher")];
	badsquares[0].nextSpawnTime = 0;
    score = 0;
    player.guncooldown = 0;
    game = setInterval(frame,10);
}
function checkfordeadbad(bad) {
	if (bad.health <= 0 && bad.class != "squareslayerGun" && bad.class != "squareslayerClaw" && bad.class != "squareslayerJoint") {
		for(var i in bullets) {
			if (bullets[i].lockedtarget==bad) {
				bullets[i].lockedtarget="";
			}
		}
        for(var i in stats) {
            if (stats[i].name == bad.class+"skilled" || (bad.class == "thief" && stats[i].name == "thieveskilled") ||
			  (bad.class == 'hearty' && stats[i].name == "heartykilled")) {
                statincrease(stats[i],1);
            }
        }
        var scoreIncrease;
        var prevscore = score;
        if (bad.class == "puncher") {
            scoreIncrease = 1;
        }
        if (bad.class == "gunner") {
            scoreIncrease = 2;
        }
        if (bad.class == "tank") {
            scoreIncrease = 10;
            var maxValue = 5;
            if (localStorage.getItem("tankskilled") === "30") {
                getachievement("tankkiller","Full","Tank Killer","");
            }
            else if (localStorage.getItem("tankskilled") === "10") {
                getachievement("tankkiller",2,"Tank Killer", "Kill 30 tank squares.");
                maxValue =30;
            }
            else if (localStorage.getItem("tankskilled") === "5") {
                getachievement("tankkiller",1,"Tank Killer","Kill 10 tank squares.");
                maxValue = 10;
            }
            if (document.getElementById("tankkiller").getElementsByTagName("h4")[0].innerHTML!="") {
                document.getElementById("tankkiller").getElementsByTagName("h4")[0].innerHTML= tankskilled.value+"/"+maxValue;
            }
        }
        if (bad.class == "hearty") {
			gametexts.push(new gametext(bad.x,bad.y,"+1","#ff70ac"));
            scoreIncrease = 0;
            player.health ++;
			if (player.health>=startinghealth/2) {
				player.enraged = false;
			}
            if (player.health == 20 && localStorage.getItem("healthiboi") != true) {
                getachievement("healtiboi","Full","Healthi Boi");
            }
        }
        if (bad.class == "thief") {
            scoreIncrease = 2;
        }
		if (bad.class == "squareslayer") {
			score += 100;
			coins += 100;
			statincrease(totalcoins,100);
			localStorage.setItem("coins",coins);
			localStorage.setItem("totalcoins",totalcoins.value);
			document.getElementById('coins').innerHTML = "Coins: "+coins;
			document.getElementById('totalcoins').innerHTML = "Total Coins Collected: "+totalcoins.value;
			scoreIncrease = 0;
			extraStats = true;
			for(var i in badsquares){
				toBeDeleted.push(badsquares[i]);
			}
			badsquares.push(new badsquare('puncher'));
			bossphase="1dead";
			if(localStorage.getItem('bosskilled')!=true){
				getachievement("squareslayer","Full","no u");
			}
			localStorage.setItem('bosskilled',true);
		}
        if (bad.class == "bomber") {
            scoreIncrease = 5;
            var maxValue = 5;
            if (localStorage.getItem("bomberskilled") === "30") {
                getachievement("bombdefuser","Full","Bomb Defuser","");
            }
            else if (localStorage.getItem("bomberskilled") === "10") {
                getachievement("bombdefuser",2,"Bomb Defuser","Kill 30 bomber squares.");
            }
            else if (localStorage.getItem("bomberskilled") === "5") {
                getachievement("bombdefuser",1,"Bomb Defuser","Kill 10 bomber squares.");
            }
            if (document.getElementById("bombdefuser").getElementsByTagName("h4")[0].innerHTML!="") {
                document.getElementById("bombdefuser").getElementsByTagName("h4")[0].innerHTML=bomberskilled.value+"/"+maxValue;
            }
            var explosionBox = {
                x: bad.x-135,
                y: bad.y-135,
                size: 300
            }
            explosions.push(new explosion(explosionBox.x,explosionBox.y,"fire", explosionBox.size));
			explosionsound.src="";
			explosionsound.src="sounds/explosion.mp3";
            explosionsound.play();
            for(var j in badsquares) {
                if (checkCollision(badsquares[j],explosionBox) && badsquares[j].nextSpawnTime == 0 && badsquares[j].class!="bomber") {
                    badsquares[j].health -= 3;
                    checkfordeadbad(badsquares[j]);
                }
            }
            if (checkCollision(player,explosionBox)) {
                player.health -= 3;
				gametexts.push(new gametext(player.x,player.y,"-3","red"));
				if (player.health < startinghealth/2&&localStorage.getItem('ragemodePurchased')== 'true'&&player.enraged == false) {
					ragesound.play();
					rageskull.onscreen = true; 
					player.enraged = true;
					canvas.style.animation="ragemode 1s linear";
				}
            }
        }
        if (bad.class == "glitched") {
            scoreIncrease = 0;
        }
        var testScore = score;
        var location;
        for(var i = 1; i <=  scoreIncrease; i++) {
            testScore  ++;
			if (testScore%5 == 0 && (bossphase == "1notspawned" || bossphase == "1dead")) {
				location = getNewSquareLocation(25, badsquares);
				badsquares.push(new badsquare("puncher"));
			}
			if (testScore%15== 0) {
				piercegun.onscreen= true;
			}
        }
		var heartyextraspawn = 0;
		if (localStorage.getItem('surplusPurchased')== 'true') {
			heartyextraspawn = 10
		}
		var randvar = Math.floor(Math.random()*100)+1;
		if (1<=randvar&&randvar<= 15&&testScore >= 10) {
			location = getNewSquareLocation(25, badsquares);
			bad.class = "gunner";
			bad.health = 1;
			bad.speed = 1;
			bad.color = "pink";
			bad.damage = 1;
			bad.size = 25;
			bad.nextShootTime = 150;
		}
		else if (16<=randvar&&randvar<=20 &&testScore >=30) {
			location = getNewSquareLocation(40, badsquares);
			bad.class = "tank";
			bad.health = 50;
			bad.speed = 1;
			bad.color = "rgb(166, 99, 107)";
			bad.damage = 1;
			bad.size = 40;
		}
		else if (21<=randvar&&randvar<=30 &&testScore >=20) {
			location = getNewSquareLocation(30, badsquares);
			bad.class = "bomber";
			bad.health = 5;
			bad.speed = 2;
			bad.color = "#DC143C";
			bad.damage = 0;
			bad.size = 30;
			bad.colorSwapTime = 50;
		}
		else if (31<=randvar&&randvar<=35&&testScore >= 15) {
			location = getNewSquareLocation(20, badsquares);
			bad.class = "thief";
			bad.health = 1;
			bad.speed = 1;
			bad.color = "coral";
			bad.damage = 1;
			bad.size = 20;
		}
		else if (100>=randvar&&randvar>=96-heartyextraspawn&&testScore >=35) {
			location = getNewSquareLocation(25, badsquares);
			bad.class = "hearty";
			bad.health = 3;
			bad.speed = 1;
			bad.color = "orange";
			bad.damage = 2;
			bad.size = 25;
		}
		else {
			location = getNewSquareLocation(25, badsquares);
			bad.class = "puncher";
			bad.health = 3;
			bad.speed = 1;
			bad.color = "red";
			bad.damage = 1;
			bad.size = 25;
		}
		bad.slideTime = 0;
		bad.hitX= 0;
		bad.hitY= 0;
		bad.x = location.x;
		bad.y = location.y;
        score += scoreIncrease;
		coins += scoreIncrease;
		statincrease(totalcoins,scoreIncrease);
		localStorage.setItem("coins",coins);
		localStorage.setItem("totalcoins",totalcoins.value);
		document.getElementById('coins').innerHTML = "Coins: "+coins;
		document.getElementById('totalcoins').innerHTML = "Total Coins Collected: "+totalcoins.value;
		if (localStorage.getItem('howPurchased') != 'true' && localStorage.getItem('bosskilled') != "true") {
			localStorage.setItem('howcost',coins+100+Math.floor(Math.random()*500));
		}
		var maxCompletion = 100;
		if (totalcoins.value >= 100000 && 100000 >= totalcoins.value-testScore && document.getElementById('flex').classList.contains('completeFull') != true) {
		   getachievement("flex","Full","Flex","");
			maxCompletion = "";
		}
		else if (totalcoins.value >= 10000 && 10000 >= totalcoins.value-testScore && document.getElementById('flex').classList.contains('complete3') != true) {
			getachievement("flex",3,"Flex","Collect 100,000 coins in total.");
			maxCompletion= 100000;
		}
		else if (totalcoins.value >= 1000 && 1000 >= totalcoins.value-testScore && document.getElementById('flex').classList.contains('complete2') != true) {
			getachievement("flex",2,"Flex","Collect 10,000 coins in total.");
			maxCompletion= 10000;
		}
		else if (totalcoins.value >= 100 && 100 >= totalcoins.value-testScore && document.getElementById('flex').classList.contains('complete1') != true) {
			getachievement("flex",1,"Flex","Collect 1,000 coins in total.");
			maxCompletion = 1000;
		}
		if (maxValue!="") {
			document.getElementById("flex").getElementsByTagName("h4")[0].innerHTML= totalcoins.value+"/"+maxCompletion;	
		}
		else {
			document.getElementById("flex").getElementsByTagName("h4")[0]="";
		}
        if (badsquares.length != 1) {
            bad.nextSpawnTime = 200;   
        }
		else {
			bad.nextSpawnTime = 50;
		}
        location = getNewSquareLocation(bad.size, badsquares);
        bad.x = location.x;
        bad.y = location.y;
        if (score > highscore) {
            highscore = score;
        }
        if (highscore > localStorage.getItem('highscore')) {
            localStorage.setItem("highscore",highscore);
            document.getElementById("highscore").innerHTML=highscore;
        }
        if (player.health<= 0) {
            handlePlayerDeath(bad);     
        }
        if (localStorage.getItem("mob") != "true" && badsquares.length >= 100) {
            getachievement("mob","Full","The Mob Is After Me!");
        }
        if (score >= 100 && gotpowerup == false && localStorage.getItem("madlad") !="true") {
            getachievement("madlad","Full","ÄBSÖLÜTE MÄDLÄD!");
        }
		if (score >= 100 && bossphase == "1notspawned") {
			toBeDeleted.push(bad);
		}
		if(extraStats==true){
			bad.health*=2;
			bad.damage*=2;
		}
    }
	else if(bad.health<=0){
		player.health += 5 + Math.floor(Math.random()*10);
		player.ammo += 10 + Math.floor(Math.random()*10);
	}
}
function findNearestObject(rect, array) {
    var closestDistance = 100000;
    var nearest;
    for(var i in array) {
        var distance = Math.sqrt(Math.pow(array[i].x-rect.x, 2) + Math.pow(array[i].y-rect.y, 2));
        if (distance<closestDistance) {
            closestDistance = distance;
            nearest = array[i];
        }
    }
    return nearest;
}
function getNewSquareLocation(size, array) {
    var newLocation = {
        x: Math.floor(Math.random() * Math.floor(screenwidth-25)), 
        y: Math.floor(Math.random() * Math.floor(screenheight-25)), 
        size: size
    }
    for(var i = 0; i < array.length-1; i ++) {
        if (checkCollision(newLocation,array[i])) {
            newLocation.x = Math.floor(Math.random() * Math.floor(screenwidth-25));
            newLocation.y = Math.floor(Math.random() * Math.floor(screenheight-25)); 
            i = 0;
        }
    }
    return newLocation;
}
function restartgame(input) {
    statincrease(deaths,1);
    if (input == "yes") {
		clearInterval(game);
        startgame();
        for(var i in keys) {
            keys[i] = false;
        }
		gamestarted = true;
		document.getElementById("restartbox").classList.remove("slideintop");
		document.getElementById("restartbox").classList.add("slideoutTop");
		document.getElementById("restartbox").style.display = "block";
		document.getElementById("yesbutton").blur();
		document.getElementById("nobutton").blur();
		document.getElementById("revivebutton").blur();
    }
    else if (input=="no") {
		document.getElementById("restartbox").classList.remove("slideintop");
		document.getElementById("restartbox").classList.add("slideoutTop");
		document.getElementById("restartbox").style.display = "block";
		document.getElementById("yesbutton").blur();
		document.getElementById("nobutton").blur();
		document.getElementById("revivebutton").blur();
		document.getElementById("gamescreen").style.border = "1px solid gray";
		document.getElementById("gamescreen").style.animation = "shrink 2s ease";
		document.getElementById("gamescreen").style.animationFillMode = "forwards";
		setTimeout(function() {
			document.getElementById("gamescreen").style.display = "none";
			document.getElementById("play").style.pointerEvents = "auto";
			ctx.clearRect(0,0,screenwidth,screenheight);
		},2000);
		document.getElementById("play").classList.remove("fadeout");
		document.getElementById("play").classList.add("fadein");
		document.getElementById("play").style.pointerEvents = "none";
		document.getElementById("banner").classList.remove("fadeout");
		document.getElementById("banner").classList.add("fadein");
		document.getElementById("darkener").classList.remove("fadein");
		document.getElementById("darkener").classList.add("fadeout");
		setTimeout(function() {document.getElementById("darkener").style.display = "none";},900);
		for(var i in keys) {
			keys[i] = false;
		}
		var randNumb = Math.floor(Math.random()*20);
		if (randNumb== 0) {
			if (suspensiontime!= 0) {
				localStorage.setItem("timeleft",suspensiontime);
				window.location.href="bad.html";
			}
		}
		clearInterval(game);
		if (revivecost!=null) {
			document.getElementById("revivebutton").classList="";
		}
	}
	else if (input=="revive") {
		if (coins>=revivecost && revived == false) {
			canvas.style.animation="none";
			player.enraged = false;
			gamestarted = true;
			player.health = startinghealth;
			player.invincibilityTime =30;
			for(var i in badsquares) {
				badsquares[i].hitX=-badsquares[i].moveX*2;
				badsquares[i].hitY=-badsquares[i].moveY*2;
				badsquares[i].slideTime = 10;
			}
			coins-=revivecost;
			revived = true;
			document.getElementById("restartbox").classList.remove("slideintop");
			document.getElementById("restartbox").classList.add("slideoutTop");
			document.getElementById("restartbox").style.display = "block";
			document.getElementById("yesbutton").blur();
			document.getElementById("nobutton").blur();
			document.getElementById("revivebutton").blur();
			document.getElementById("revivebutton").classList="locked";
		}
		else {
			var msg;
			if (revived == true) {
				msg="You Can Only Be Revived Once Per Game"
			}
			else if (revivecost!=null) {
				msg = "Not Enough Coins";
			}
			else {
				msg = "Revive Bonus Not Unlocked";
			}
			displaygamemsg(msg);
		}
	}
}
function frame() {
	if (gamestarted == true) {
		ctx.clearRect(0,0,canvas.width,canvas.height);
		if (localStorage.getItem('howPurchased')== 'true'&&player.dashcooldown>0) {
			player.dashcooldown--;
		}
		for(var i in lastpressedtime) {
			if (keys[i]== false) {
				lastpressedtime[i]++;
			}
		}	
		if (rageskull.onscreen== true) {
			rageskull.time--;
			var opacity = 1;
			if (rageskull.time<=40) {
				opacity=rageskull.time/40;
			}
			ctx.globalAlpha=opacity;
			ctx.drawImage(rageskull.img,screenwidth/2-screenheight/2, screenheight/2-screenheight/2,screenheight,screenheight);
			if (rageskull.time<= 0) {
				rageskull.onscreen= false;
				rageskull.time = 100;
				canvas.style.animation="none";
			}
			ctx.globalAlpha= 1;
		}
		var powerupsActive = false;
		for(var i in powerups) {
			if (powerups[i].onscreen == true) {
				if (powerups[i].color) {
					ctx.fillStyle = powerups[i].color;
					ctx.fillRect(powerups[i].x,powerups[i].y,powerups[i].size,powerups[i].size);  
					if (powerups[i] == teleport) {
						ctx.fillRect(powerups[i].x2,powerups[i].y2,powerups[i].size,powerups[i].size);  
					} 
				}
				else if (powerups[i].spriteimg) {
					ctx.drawImage(powerups[i].spriteimg,powerups[i].x,powerups[i].y);
				}
				if (checkCollision(player,powerups[i])) {
					powerups[i].onscreen = false;
					if (powerups[i] != teleport && powerups[i] != ammobox && powerups[i] != glitchblast) {
						for(var j in powerups) {
							if (powerups[j].using!==null) {
								powerups[j].using = false;
								powerups[j].time = 0;
							}
						}
						powerups[i].using = true;
						gotpowerup = true;
						statincrease(powerupscollected,1);
						cooldown = 0;
						player.img.src = powerups[i].img.src;
						powerups[i].time = 1000;
					}
					else if (powerups[i] == teleport) {
						if (checkCollision(player,teleport) == 2) {
							player.x = teleport.x;
							player.y = teleport.y;
						}
						else {
							player.x = teleport.x2;
							player.y = teleport.y2;
						}
						teleportsound.play();
						teleport.x2 = Math.floor(Math.random() * Math.floor(screenwidth-25));
						teleport.y2 = Math.floor(Math.random() * Math.floor(screenheight-25)); 
						gotpowerup = true;
						statincrease(powerupscollected,1);
					}
					else if (powerups[i] == ammobox) {
						var ammoIncrease = Math.floor(Math.random() * 10) + 1;
						player.ammo += ammoIncrease;
						gametexts.push(new gametext(player.x,player.y,"+"+ammoIncrease,"yellow"));
					}
					else if (powerups[i] == glitchblast) {
						var blast = {
							x: powerups[i].x-142.5,
							y: powerups[i].y-142.5,
							size: 300
						}
						explosions.push(new explosion(blast.x,blast.y,"glitch", blast.size));
						glitchsound.play();
						statincrease(powerupscollected,1);
						gotpowerup = true;
					}
					powerups[i].x = Math.floor(Math.random() * Math.floor(screenwidth-25));
					powerups[i].y = Math.floor(Math.random() * Math.floor(screenheight-25));
				}
			}
			if (powerups[i].time > 0) {
				powerupsActive = true;
				powerups[i].time --;
				if (powerups[i].time == 0) {
					powerups[i].using = false;
					spacepressed = true;
					powerupsActive = false;
				}
			}
		}
		if (powerupsActive == false) {
			player.img.src = "icons/pistolgun.png";
		}
		else {
			ctx.fillStyle = 'green';
			var lostProgress = 0;
			for(var i in powerups) {
				if (powerups[i].using== true) {
					if (powerups[i].time/1000<= 1) {
						lostProgress =(1000-powerups[i].time)*(screenwidth/3/1000);
					}
				}
			}
			var gunName;
			if (rapidgun.using == true) {
				gunName = "Rapid Gun: ";
			}
			if (piercegun.using == true) {
				gunName = "Pierce Gun: ";
			}
			if (shotgun.using == true) {
				gunName = "Shotgun: ";
			}
			if (missilelauncher.using == true) {
				gunName = "Missile Launcher: ";
			}
			var offset = ctx.measureText(gunName).width/2;
			ctx.fillRect(screenwidth/3+10+offset,30,screenwidth/3-lostProgress,20);
			ctx.strokeStyle = 'gray';
			ctx.lineWidth=3;
			ctx.strokeRect(screenwidth/3+10+offset,30,screenwidth/3,20);
			ctx.lineWidth = 1;
			ctx.fillStyle ="white";
			ctx.fillText(gunName,screenwidth/3-offset,45);
		}
		if (bossphase == "1spawned" && badsquares[0].class == "squareslayer") {
			var offset = ctx.measureText("Square Slayer: ").width/2;
			var healthLength=0;
			for(var i = 0; i < 6; i++){
				if(i!=2&&i!=3){
					ctx.fillStyle = badsquares[i].color;
					var lostHealth = badsquares[i].health*screenwidth/1600;
					ctx.fillRect(screenwidth/4+10+offset+healthLength,screenheight-55,lostHealth,25);
					if(i==5&&badsquares[i].health>0){
						ctx.fillStyle="#444445";
						ctx.fillRect(screenwidth/4+10+offset+healthLength,screenheight-55,3,25);
					}
					healthLength+=lostHealth;
				}
			}
			ctx.strokeStyle = '#444445';
			ctx.lineWidth=3;
			ctx.strokeRect(screenwidth/4+10+offset,screenheight-55,screenwidth/2,25);
			ctx.lineWidth = 1;
			ctx.fillStyle ="red";
			ctx.fillText("Square Slayer: ",screenwidth/4-offset,screenheight-35);
		}
		for(var i in bullets) {
			bullets[i].move();
		}
		player.move();   
		if (player.y < 0) {
			player.y = 0;
		}
		if (player.y > screenheight-25) {
			player.y = screenheight-25;
		}
		if (player.x < 0) {
			player.x = 0;
		}
		if (player.x > screenwidth-25) {
		   player.x = screenwidth-25;
		}
		player.shoot();
		for(var i in badsquares) {
			badsquares[i].move();
			if(badsquares[i].class == "squareslayerGun"){
				if(badsquares[i].nextShootInterval>0){
					badsquares[i].nextShootInterval--;
				}
				if(badsquares[i].nextShootTime>0&&badsquares[i].nextShootInterval==0){
					badsquares[i].nextShootTime--;
				}
			}
			badsquares[i].shoot();
			if(badsquares[i].health<=0){
				badsquares[i].health = 0;
				continue;
			}
			badsquares[i].draw();
			if (badsquares[i].nextSpawnTime > 0) {
				badsquares[i].nextSpawnTime--;
			}
			if (badsquares[i].invincibilityTime > 0) {
				badsquares[i].invincibilityTime--;
			}
			if(badsquares[i].hasOwnProperty('damage') == false){
				continue;
			}
			if (badsquares[i].class == "gunner") {
				badsquares[i].nextShootTime--;   
			}
			for(var j in explosions) {
				if (explosions[j].class == "glitch") {
					if (badsquares[i].class != "tank" && badsquares[i].class != "squareslayer" && badsquares[i].class != "squareslayerGun" && badsquares[i].class != "squareslayerClaw" && badsquares[i].class != "squareslayerJoint" && checkCollision(explosions[j], badsquares[i])&& badsquares[i].nextSpawnTime == 0) {
						badsquares[i].class = "glitched";
						badsquares[i].size = 25;
						badsquares[i].speed = 1;
						badsquares[i].health = 5;
						badsquares[i].damage = 1;
						badsquares[i].color = "#008B8B";
					}
				}
			}
			for(var j in powerups) {
				if (badsquares[i].class == "thief" && checkCollision(badsquares[i],powerups[j]) && powerups[j].onscreen ==true){
					powerups[j].onscreen = false;
					if (powerups[j] == piercegun) {
						powerups[j].requirement += 15; 
					}
					if (powerups[j] == teleport) {
						if (checkCollision(badsquares[i],teleport) == 2) {
							badsquares[i].x = teleport.x;
							badsquares[i].y = teleport.y;
						}
						else {
							badsquares[i].x = teleport.x2;
							badsquares[i].y = teleport.y2;
						}
						powerups[j].x2 = Math.floor(Math.random() * Math.floor(screenwidth-25));
						powerups[j].y2 = Math.floor(Math.random() * Math.floor(screenheight-25));
					}
					powerups[j].x = Math.floor(Math.random() * Math.floor(screenwidth-25));
					powerups[j].y = Math.floor(Math.random() * Math.floor(screenheight-25));
					badsquares[i].health ++;
					badsquares[i].damage ++;
				}
			}
			for(var j in bullets) {
				if (checkCollision(bullets[j],badsquares[i])&& badsquares[i].nextSpawnTime == 0) {
					if ((bullets[j].color == "orange" || bullets[j].color=="blue") && bullets[j].hit == false) {
						accuracy.shotScore+= 100;   
						bullets[j].hit = true;
						if (badsquares[i].class == "gunner" && localStorage.getItem("curveshot") !== "true") {
							getachievement("curveshot","Full","Curve Shot");
						}
					}
					if (bullets[j].color=="#ff0072"||bullets[j].color=="#00f9ff") {
						  var explosionBox = {
							x: bullets[j].x-92.5,
							y: bullets[j].y-92.5,
							size: 200
						}
						explosions.push(new explosion(explosionBox.x,explosionBox.y,"fire", explosionBox.size));
						explosionsound.src="";
						explosionsound.src="sounds/explosion.mp3";
						explosionsound.play();
						for(var k in badsquares) {
							if (checkCollision(badsquares[k],explosionBox) && badsquares[k].nextSpawnTime == 0 && badsquares[k].hasOwnProperty('damage')) {
								badsquares[k].health -=2;
								if (localStorage.getItem('ragemodePurchased')== 'true') {
									badsquares[k].health -=2;
								}
								if (badsquares[k].class == "bomber") {
									badsquares[k].health= 0;
								}
								checkfordeadbad(badsquares[k]);
							}
						}
						delete bullets[j];
					}
					else {
						if (badsquares[0].class == "squareslayer" && bullets[j].color=="blue") {
							bullets[j].prc = 30;
						}
						if(badsquares[i].class == "squareslayer"){
							for(var k in badsquares){
								if(badsquares[k].health>0){
									bullets[j].prc = 1;
									continue;
								}
								else{
									bullets[j].prc *=2;
								}
							}
						}
						if (bullets[j].prc >= badsquares[i].health) {
							bullets[j].prc -= badsquares[i].health;
							badsquares[i].health = 0;
						}
						else if (bullets[j].prc <= badsquares[i].health) {
							badsquares[i].health -= bullets[j].prc;
							bullets[j].prc = 0;
						}
						if (badsquares[i].class == "tank" && bullets[j].color == "blue") {
							bullets[j].prc = 0;
						}
						if (badsquares[i].class == "tank" && bullets[j].color == 'yellow') {
							badsquares[i].health += 0.5;
						}
						checkfordeadbad(badsquares[i]);
					}
					var randvar = Math.floor(Math.random() * 20);
					if (randvar == 1) {
						rapidgun.onscreen = true;
					}
					if (randvar == 2) {
						shotgun.onscreen = true;
					}
					if (randvar == 3) {
						teleport.onscreen = true;
					}
					if (randvar == 4) {
						ammobox.onscreen = true;
					}
					if (randvar == 5) {
						glitchblast.onscreen = true;
					}
					if (randvar==6) {
						missilelauncher.onscreen = true;
					}
				}
			}
			if (checkCollision(player,badsquares[i]) && badsquares[i].nextSpawnTime == 0 && badsquares[i].class != "glitched" &&
			   player.dashtime == 0) {
				if (badsquares[i].class != "bomber") {
					if (player.invincibilityTime == 0) {
						player.health -= badsquares[i].damage;
						player.invincibilityTime = 15;	
						gametexts.push(new gametext(player.x,player.y,"-"+badsquares[i].damage,"red"));
						if (player.health < startinghealth/2&&localStorage.getItem('ragemodePurchased')== 'true'&&player.enraged == false) {
							ragesound.play();
							rageskull.onscreen = true;
							player.enraged = true
							canvas.style.animation="ragemode 1s linear";
						}
					}
					if (player.health<= 0) {
						handlePlayerDeath(badsquares[i]);
					}
					if (badsquares[i].invincibilityTime == 0) {
						badsquares[i].health--;   
						badsquares[i].invincibilityTime = 10;
					}
					checkfordeadbad(badsquares[i]);
				}
				else {
					badsquares[i].health = 0;
					checkfordeadbad(badsquares[i]);
				}
				/**badsquares[i].slideTime = 10;
				badsquares[i].hitX=-badsquares[i].moveX;
				badsquares[i].hitY=-badsquares[i].moveY;**/
				player.hitX = badsquares[i].moveX;
				player.hitY = badsquares[i].moveY;
				player.slideTime = 10;
				hurtsound.src = "";
				hurtsound.src = "sounds/hurt.mp3";
				hurtsound.play();  
			}
			for(var j in badsquares) {
				if (badsquares[j].class == "glitched" && badsquares[i].class != "glitched") {
					if (checkCollision(badsquares[j],badsquares[i])) {
						badsquares[i].health--; 
						badsquares[j].health--;   
						badsquares[j].slideTime = 10;
						badsquares[i].slideTime = 10;
						badsquares[i].hitX = badsquares[j].moveX;
						badsquares[i].hitY = badsquares[j].moveY;
						badsquares[j].hitX = badsquares[i].moveX;
						badsquares[j].hitY = badsquares[i].moveY;
						hurtsound.src = "";
						hurtsound.src = "sounds/hurt.mp3";
						hurtsound.play();
						checkfordeadbad(badsquares[i]);
						checkfordeadbad(badsquares[j]);
					}
				}
			}
		}
		for(var i in bullets) {
			bullets[i].draw();
		}
		for(var i in badbullets) {
			badbullets[i].draw();
			if (checkCollision(player,badbullets[i])&&player.dashtime == 0) {
			   player.health -= badbullets[i].damage;
				gametexts.push(new gametext(player.x,player.y,"-"+badbullets[i].damage,"red"));
				if (player.health<= 0) {
					var bulletShape = {class: badbullets[i].shape};
					handlePlayerDeath(bulletShape);
				}
				else if (player.health < startinghealth/2&&localStorage.getItem('ragemodePurchased')== 'true'&&player.enraged == false) {
					player.enraged = true;
					canvas.style.animation="ragemode 1s linear";
					ragesound.play();
					rageskull.onscreen = true;
				}
				delete badbullets[i];
				badbullets.splice(i,1);
			}
			else {
				badbullets[i].move();
			}
		}
		player.draw();
		for(var i in pastimages) {
			pastimages[i].draw();
		}
		for(var i in explosions) {
			explosions[i].draw();
			if (explosions[i].size == 0 || explosions[i].colorValue <= 0) {
				delete explosions[i];
				explosions.splice(i,1);
			}
		}
		if (player.invincibilityTime!= 0) {
			player.invincibilityTime--;
		}
		if (player.ammo <= 3) {
			ammobox.onscreen = true;
		}
		for(var i in gametexts) {
			gametexts[i].draw();
			if (gametexts[i].time<= 0) {
				delete gametexts[i];
				gametexts.splice(i,1);
			}
		}
		ctx.fillStyle = "white";
		ctx.font = "25px monospace";
		ctx.fillText("Score: "+score,20,30);
		/**ctx.fillText("bad1 mx: "+badsquares[0].moveX+' bad1 my: '+badsquares[0].moveY,20,70);
		if (badsquares[1]) {
		ctx.fillText("bad2 mx: "+badsquares[1].moveX+' bad1 my: '+badsquares[1].moveY,20,90);}**/
		ctx.fillText("Highscore: "+highscore,20,50);
		ctx.fillText("Ammo: "+player.ammo,screenwidth-200,30);
		ctx.fillText("Health: "+player.health,screenwidth-200,50);
		if (localStorage.getItem('howPurchased')== 'true') {
			ctx.fillStyle ="orange";
			ctx.strokeStyle ="gray";
			ctx.lineWidth = 3;
			ctx.fillRect(20,70,(300-player.dashcooldown)/3,20);
			ctx.strokeRect(20,70,100,20);
			ctx.lineWidth= 1;
			if (player.dashcooldown== 0) {
				ctx.fillStyle ="rgb(255, 87, 84)";
				ctx.fillText("Charged!",130,86);
			}
		}
		if (player.health < startinghealth/2&&localStorage.getItem('ragemodePurchased')== 'true') {
			var opacity = new Date().getMilliseconds();
			if (opacity>500) {
				opacity= 1000-opacity;
			}
			ctx.globalAlpha=(opacity+200)/1000;
			ctx.fillStyle ="red";
			ctx.font = "25px robotoslab";
			ctx.fillText("ENRAGED!",screenwidth-200,80);
			ctx.globalAlpha= 1;
			ctx.font = "25px monospace";
		}
		for(var i in toBeDeleted){
			badsquares.splice(badsquares.indexOf(toBeDeleted[i]),1);
		}
		toBeDeleted = [];
		if (score >= 100 && bossphase == "1notspawned" && badsquares.length == 0) {
			var leftJ = new badsquare("squareslayerJoint");
			var rightJ = new badsquare("squareslayerJoint");
			rightJ.x = screenwidth/2 + 150; //35
			leftJ.x = screenwidth/2 - 185;
			rightJ.side = "right";
			leftJ.side = "left";
			var leftC = new badsquare("squareslayerClaw");
			var rightC = new badsquare("squareslayerClaw");
			rightC.x = screenwidth/2 + 250;
			leftC.x = screenwidth/2 - 285;
			rightC.side = "right";
			leftC.side = "left";
			badsquares = [
				new badsquare("squareslayer"),
				new badsquare("squareslayerGun"),
				leftJ,
				rightJ,
				leftC,
				rightC
			];
			bossphase = "1spawned";
		}
	}
}
function handlePlayerDeath(bad) {
    player.health = 0;
	if (bad.class =="puncher") {
		deathmessage = "You've been clobbered by a puncher!";
	}
	else if (bad.class =="gunner") {
		deathmessage = "You've been smacked by a gunner!";
	}
	else if (bad.class =="tank") {
		deathmessage = "You've been thumped by a tank!";
	}
	else if (bad.class == "bomber") {
		deathmessage = "You were blown up by a bomber!";
	}
	else if (bad.class == "hearty") {
		deathmessage = "A hearty square delivered a hearty punch!";
	}
	else if (bad.class == "thief") {
		deathmessage = "Your life ";   
	}  
	else if (bad.class == "squareslayer") {
		deathmessage = "You bumped into Square Slayer to much!";
	}
	else if (bad.class == "square") {
		deathmessage = "You were sniped by a gunner!";
	}
	else if(bad.class == "circle") {
		deathmessage = "You were shot down by the Square Slayer!";
	}
	else if(bad.class == "squareslayerClaw") {
		deathmessage = "You were ripped open by Square Slayer's claw!";
	}
	else if(bad.class == "squareslayerGun") {
		deathmessage = "You failed to avoid the bad hitboxes of Square Slayer's gun!"
	}
    gamestarted = false;
    document.getElementById("restartbox").classList.remove("slideoutTop");
    document.getElementById("restartbox").classList.add("slideintop");
    document.getElementById("restartbox").style.display = "block";
    document.getElementById("deathmessage").innerHTML = deathmessage;
    var calculatedAccuracy = accuracy.shotScore/accuracy.shots;
    if (isNaN(calculatedAccuracy)) {
        calculatedAccuracy = 0;
    }
    document.getElementById("accuracy").innerHTML = "Shot accuracy: " + calculatedAccuracy.toString().slice(0,5) + "%";
    if (score ==420 &&Math.round(calculatedAccuracy)==69) {
        getachievement("nice","Full","Nice");
    }
}
function getachievement(achievement,rank,name,nextrequirement) {
	document.getElementById("achievementget").getElementsByTagName("h3")[0].style.animation="none";
    document.getElementById("achievementget").style.display="none";
    document.getElementById("achievementget").getElementsByTagName("h3")[0].innerHTML= document.getElementById(achievement).getElementsByTagName("h3")[0].innerHTML;
    document.getElementById("achievementget").getElementsByTagName("img")[0].src= document.getElementById(achievement).getElementsByTagName("img")[0].src;
    document.getElementById("achievementget").classList.add("slideintop");
    document.getElementById("achievementget").classList.remove("slideouttop");
    document.getElementById("achievementget").style.display="block";
    setTimeout(function() {
        document.getElementById("achievementget").style.display="none";
        document.getElementById("achievementget").classList.remove("slideintop");
        document.getElementById("achievementget").classList.add("slideouttop");
        document.getElementById("achievementget").style.display="block";
    },5000);
    if (!nextrequirement) {
        localStorage.setItem(achievement,true);
    }
    else {
        document.getElementById(achievement).getElementsByTagName("p")[0].innerHTML=nextrequirement;
    }
    document.getElementById(achievement).className ="";
    document.getElementById(achievement).classList.add("complete"+rank);
    document.getElementById(achievement).classList.add("achievement");
    if (rank!="Full") {
		var numerals = {M:1000,CM:900,D:500,CD:400,C:100,XC:90,L:50,XL:40,X:10,IX:9,V:5,IV:4,I:1},roman = '',i;
		for (var i in numerals) {
			while ( rank >= numerals[i] ) {
			  roman += i;
			  rank -= numerals[i];
			}
		}
        document.getElementById(achievement).getElementsByTagName("h3")[0].innerHTML=name+" "+roman;   
    }
    else { 
		document.getElementById(achievement).getElementsByTagName("h3")[0].innerHTML=name;
		document.getElementById("achievementget").getElementsByTagName("h3")[0].style.animation="3s color-change infinite";
    }
}
function statincrease(stat,num) {
    stat.value+=num;
    localStorage.setItem(stat.name,stat.value);
    document.getElementById(stat.name).innerHTML=stat.value;
}
for(var i in stats) {
    if (localStorage.getItem(stats[i].name) !=null) {
        stats[i].value = parseInt(localStorage.getItem(stats[i].name),10);
        document.getElementById(stats[i].name).innerHTML = stats[i].value;
    }
    else {
        stats[i].value = 0;
    }
}
canvas = document.getElementById("gamescreen");
ctx = canvas.getContext("2d");
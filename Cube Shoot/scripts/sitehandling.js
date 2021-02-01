var timeonpage = 0;
var suspensiontime;
if(localStorage.getItem('suspensiontime')!=null){
	suspensiontime=parseInt(localStorage.getItem('suspentiontime'));
}
else{
	suspensiontime = 300;
}
function coinclick(){
	coins++;
	document.getElementById('coins').innerHTML="Coins: "+coins;
	statincrease(totalcoins,1);
	localStorage.setItem('coins',coins);
	var coincount = document.createElement('h1');
	coincount.setAttribute('class','coin');
	coincount.appendChild(document.createTextNode("+1"));
	coincount.setAttribute('style','top:'+(30+Math.random()*20)+'%;left:'+(70+Math.random()*20)+'%;');
	document.body.appendChild(coincount);
	setTimeout(function(){document.body.removeChild(coincount)},1000);
}
setInterval(function(){
    timeonpage++;
    if(document.hidden){
        timeonpage--;
    }
    if(timeonpage/60>=15 && localStorage.getItem("playoutside") != "true"){
        getachievement("playoutside");
        localStorage.setItem("playoutside",true);
    }
	if(localStorage.getItem('howPurchased')!='true'){
		if(parseInt(localStorage.getItem('howcost'))-100 < coins && localStorage.getItem('bosskilled') != "true"){
			localStorage.setItem('howcost',coins+100+ Math.floor(Math.random()*500));
			document.getElementById("how").getElementsByClassName('cost')[0].innerHTML=localStorage.getItem('howcost')+" coins";
		}
	}
	for(var i in shopItems){
		if(parseInt(document.getElementById(shopItems[i]).getElementsByClassName('cost')[0].innerHTML.replace(/,/g, ''))>=coins && document.getElementById(shopItems[i]).getElementsByClassName('cost')[0].innerHTML!="Fully Purchased"){
			document.getElementById(shopItems[i]).getElementsByTagName('h2')[0].style.color="darkred";
			document.getElementById(shopItems[i]).getElementsByClassName('cost')[0].style.color="darkred";
		}
		else{
			document.getElementById(shopItems[i]).getElementsByTagName('h2')[0].style.color="black";
			document.getElementById(shopItems[i]).getElementsByClassName('cost')[0].style.color="black";
		}
	}
},1000);
if(localStorage.getItem('howcost')!=null){
	document.getElementById("how").getElementsByClassName('cost')[0].innerHTML=localStorage.getItem('howcost')+" coins";
}
else{
	localStorage.setItem('howcost',coins+100+ Math.floor(Math.random()*500));
	document.getElementById("how").getElementsByClassName('cost')[0].innerHTML=localStorage.getItem('howcost')+" coins";
}
document.getElementById("coins").innerHTML+=coins;
document.getElementById("startingammo").innerHTML+=startingammo;
document.getElementById("startinghealth").innerHTML+=startinghealth;
if(revivecost!=null){
	document.getElementById('revivecost').innerHTML="Cost For Revive: "+revivecost+" Coins";
	document.getElementById('gamerevivecost').innerHTML=revivecost+" Coins";
	document.getElementById('revivebutton').classList="";
}
var shopItems= ['healthbonus','bulletbox','fastestgun','coinclickeritem','how','escapee','surplus','ragemode','revivebonus'];
function purchaseitem(item){
	var msg;
	var cost = parseInt(document.getElementById(item).getElementsByClassName('cost')[0].innerHTML.replace(/,/g, ''));
	if(item=='how'){
		cost = parseInt(localStorage.getItem('howcost'));
	}
	if(document.getElementById(item).getElementsByClassName("purchaseCompletion")[0]){
		if(coins>=cost && parseInt(document.getElementById(item).getElementsByClassName("purchaseCompletion")[0].innerHTML,10)<parseInt(document.getElementById(item).getElementsByClassName("maxCompletion")[0].innerHTML,10)){
			coins-=cost;
			localStorage.setItem('coins',coins);
			document.getElementById('coins').innerHTML="Coins: "+coins;
			document.getElementById(item).getElementsByClassName("purchaseCompletion")[0].innerHTML++;
			localStorage.setItem(item+'Completion',document.getElementById(item).getElementsByClassName("purchaseCompletion")[0].innerHTML);
			if(document.getElementById(item).getElementsByClassName('purchaseCompletion')[0].innerHTML ==document.getElementById(item).getElementsByClassName('maxCompletion')[0].innerHTML){
				document.getElementById(item).getElementsByClassName('cost')[0].innerHTML="Fully Purchased";
				document.getElementById('powerupscollected').innerHTML = parseInt(document.getElementById('powerupscollected').innerHTML)+1;
				document.getElementById(item).getElementsByClassName('purchaseCompletion')[0].innerHTML="";
				document.getElementById(item).getElementsByClassName('maxCompletion')[0].innerHTML="";
				document.getElementById(item).getElementsByClassName('slash')[0].innerHTML="";
			}
			if(item=='healthbonus'){
				startinghealth++;
				localStorage.setItem('startinghealth',startinghealth);
				document.getElementById('startinghealth').innerHTML = "Health: "+startinghealth;
			}
			if(item=="bulletbox"){
				startingammo++;
				localStorage.setItem('startingammo',startingammo);
				document.getElementById('startingammo').innerHTML = "Ammo: "+startingammo;
			}
			if(item=="escapee"){
				suspensiontime-=10;
				localStorage.setItem('suspensiontime',suspensiontime);
			}
			if(item=='revivebonus'){
				if(revivecost!=null){
					revivecost/=2;
				}
				else{
					revivecost=200;
					document.getElementById('revivebutton').classList="";
				}
				localStorage.setItem('revivecost',revivecost);
				document.getElementById('revivecost').innerHTML="Cost For Revive: "+revivecost+" Coins";
				document.getElementById('gamerevivecost').innerHTML=revivecost+" Coins";
			}
		}
		else if(coins < cost){
			displaygamemsg("Not Enough Coins");
		}
	}
	else{
		if(coins>=cost && localStorage.getItem(item+'Purchased')!='true'){
			coins-=cost;
			localStorage.setItem('coins',coins);
			document.getElementById('coins').innerHTML="Coins: "+coins;
			document.getElementById(item).getElementsByClassName('cost')[0].innerHTML="Fully Purchased";
			document.getElementById('powerupscollected').innerHTML = parseInt(document.getElementById('powerupscollected').innerHTML)+1;
			localStorage.setItem(item+'Purchased',true);
			if(item=='fastestgun'){
				pistolcooldown/=2;
				localStorage.setItem('pistolcooldown',pistolcooldown);
			}
			if(item=='coinclickeritem'){
				document.getElementsByClassName('shinecontainer')[0].style.display='block';
			}
			if(item=='how' && localStorage.getItem('bosskilled') != "true"){
				coins+=cost;
				localStorage.setItem('coins',coins);
				document.getElementById('coins').innerHTML="Coins: "+coins;
				document.getElementById(item).getElementsByClassName('cost')[0].innerHTML="Coins: "+coins;	
			}
		}
		else if(coins < cost){
			displaygamemsg("Not Enough Coins");
		}
	}
}
function displaygamemsg(msg){
	document.getElementById("gamemsg").innerHTML = msg;
	document.getElementById("gamemsg").style.display = "none";
	document.getElementById("gamemsg").offsetHeight;
	document.getElementById("gamemsg").style.animation = null;
	document.getElementById("gamemsg").style.display = "block";
}
for(var i in shopItems){
	if(localStorage.getItem(shopItems[i]+'Completion')!=null){
		document.getElementById(shopItems[i]).getElementsByClassName('purchaseCompletion')[0].innerHTML=localStorage.getItem(shopItems[i]+'Completion');
	}
	else if(document.getElementById(shopItems[i]).getElementsByClassName('purchaseCompletion')[0]){
		document.getElementById(shopItems[i]).getElementsByClassName('purchaseCompletion')[0].innerHTML=0;
	}
	if(document.getElementById(shopItems[i]).getElementsByClassName('purchaseCompletion')[0]){
	if(document.getElementById(shopItems[i]).getElementsByClassName('purchaseCompletion')[0].innerHTML==document.getElementById(shopItems[i]).getElementsByClassName('maxCompletion')[0].innerHTML){
		document.getElementById(shopItems[i]).getElementsByClassName('cost')[0].innerHTML="Fully Purchased";
		document.getElementById(shopItems[i]).getElementsByClassName('purchaseCompletion')[0].innerHTML="";
		document.getElementById(shopItems[i]).getElementsByClassName('maxCompletion')[0].innerHTML="";
		document.getElementById(shopItems[i]).getElementsByClassName('slash')[0].innerHTML="";
	}
	}
	else if(localStorage.getItem(shopItems[i]+'Purchased')=='true'){
		document.getElementById(shopItems[i]).getElementsByClassName('cost')[0].innerHTML="Fully Purchased";
		if(shopItems[i]=='coinclickeritem'){
			document.getElementsByClassName('shinecontainer')[0].style.display='block';
		}
	}
}
if(parseInt(localStorage.getItem("timeleft"))>0){
    window.location.href="bad.html";
}
if(localStorage.getItem('profilepicture') !== null){
    document.getElementById('profilepicture').src = localStorage.getItem('profilepicture');
}
if(localStorage.getItem("name") !== null){
    document.getElementById('name').innerHTML = localStorage.getItem("name");
}
document.querySelectorAll(".achievement").forEach(function(id){
    var achievement = document.getElementById(id.id);
    if(localStorage.getItem(id.id) === "true"){
        document.getElementById(id.id).classList.add("completeFull");
    }
})
function showrules() {
    document.getElementById("rules").classList.remove("slideoutTop");
    document.getElementById("rules").classList.add("slideintop");
    document.getElementById("rules").style.display = "block";
    document.getElementById("darkener").classList.remove("fadeout");
    document.getElementById("darkener").classList.add("fadein");
    document.getElementById("darkener").style.display = "block";
    clearInterval(animation);
}
function hiderules() {
    document.getElementById("rules").style.display = "none";
    document.getElementById("rules").classList.remove("slideintop");
    document.getElementById("rules").classList.add("slideoutTop");
    document.getElementById("rules").style.display = "block";
    document.getElementById("darkener").classList.remove("fadein");
    document.getElementById("darkener").classList.add("fadeout");
    document.getElementById("darkener").style.display = "block";
    setTimeout(function() {document.getElementById("darkener").style.display = "none";},900);
    animation = setInterval(sinewave,10);
}
var ismute = false;
function togglesound() {
    if (ismute == false) {
        hurtsound.volume = 0;
        rapidgun.sound.volume = 0;
        player.shotsound.volume = 0;
        shotgun.sound.volume = 0;
        explosionsound.volume = 0;
        ismute = true;
        document.getElementById("sound").style.backgroundColor = "rgb(219, 80, 70)";
        document.getElementById("gamemsg").innerHTML = "Sounds Are Now Muted";
        document.getElementById("gamemsg").style.display = "none";
        document.getElementById("gamemsg").offsetHeight;
        document.getElementById("gamemsg").style.animation = null;
        document.getElementById("gamemsg").style.display = "block";
        //hidegamemsg();
    }
    else if (ismute == true) {
        explosionsound.volume = 1;
        hurtsound.volume = 1;
        rapidgun.sound.volume = 1;
        player.shotsound.volume = 1;
        shotgun.sound.volume = 1;
        ismute = false;
        document.getElementById("sound").style.backgroundColor = "gold";
        document.getElementById("gamemsg").innerHTML = "Sounds Are Now Unmuted";
        document.getElementById("gamemsg").style.display = "none";
        document.getElementById("gamemsg").offsetHeight;
        document.getElementById("gamemsg").style.animation = null;
        document.getElementById("gamemsg").style.display = "block";
        //hidegamemsg();
    }
}
function gotoold() {
    document.getElementById("darkener").style.backgroundColor = "black";
    document.getElementById("darkener").classList.remove("fadeout");
    document.getElementById("darkener").classList.add("fadein");
    document.getElementById("darkener").style.display = "block";
    setTimeout(function() {window.location.href = "https://originalcubeshoot.netlify.com/";},900);
}
var gamestarted = false;
function playstartup() {
    if (gamestarted == false) {
        //document.getElementById("gamemsg").style.display = "none";
        setTimeout(startgame,1000);
        document.getElementById("play").blur();
        document.getElementById("gamescreen").style.display = "block";
        document.getElementById("gamescreen").style.backgroundColor = "rgb(0,0,0,1)";
        document.getElementById("gamescreen").style.animation = "enlarge 1s ease";
        document.getElementById("play").classList.remove("fadein");
        document.getElementById("play").classList.add("fadeout");
        document.getElementById("banner").classList.remove("fadein");
        document.getElementById("banner").classList.add("fadeout");
        document.getElementById("darkener").classList.remove("fadeout");
        document.getElementById("darkener").classList.add("fadein");
        document.getElementById("darkener").style.display = "block";
        gamestarted = true;
    }
}
function view(element, openstate, closedstate){
    document.getElementById(element).style.display = "none";
    document.getElementById(element).classList.add(openstate);
    document.getElementById(element).classList.remove(closedstate);
    document.getElementById(element).style.display = "block";
    document.getElementById("darkener").classList.remove("fadeout");
    document.getElementById("darkener").classList.add("fadein");
    document.getElementById("darkener").style.display = "block";
}
function hide(element, openstate, closedstate){
    document.getElementById(element).style.display = "none";
    document.getElementById(element).classList.remove(openstate);
    document.getElementById(element).classList.add(closedstate);
    document.getElementById(element).style.display = "block";
    document.getElementById("darkener").classList.add("fadeout");
    document.getElementById("darkener").classList.remove("fadein");
    document.getElementById("darkener").style.display = "block";
    setTimeout(function() {document.getElementById("darkener").style.display = "none";},900);
}
function viewpowerups() {
    document.getElementById("rules").style.backgroundColor = "rgba(0,0,0.8)";
    document.getElementById("rules").style.pointerEvents = "none";
    document.getElementById("powerupcollection").style.display = "none";
    document.getElementById("powerupcollection").classList.remove("slideoutright");
    document.getElementById("powerupcollection").classList.add("slideinright");
    document.getElementById("powerupcollection").style.display = "block";
}
function viewsquares() {
    document.getElementById("rules").style.backgroundColor = "rgba(0,0,0.8)";
    document.getElementById("rules").style.pointerEvents = "none";
    document.getElementById("squarescollection").style.display = "none";
    document.getElementById("squarescollection").classList.remove("slideoutright");
    document.getElementById("squarescollection").classList.add("slideinright");
    document.getElementById("squarescollection").style.display = "block";
}
function hidesquares() {
    document.getElementById("rules").style.backgroundColor = "white";
    document.getElementById("rules").style.pointerEvents = "all";
    document.getElementById("squarescollection").style.display = "none";
    document.getElementById("squarescollection").classList.add("slideoutright");
    document.getElementById("squarescollection").classList.remove("slideinright");
    document.getElementById("squarescollection").style.display = "block";
}
function hidepowerups() {
    document.getElementById("rules").style.backgroundColor = "white";
    document.getElementById("rules").style.pointerEvents = "all";
    document.getElementById("powerupcollection").style.display = "none";
    document.getElementById("powerupcollection").classList.add("slideoutright");
    document.getElementById("powerupcollection").classList.remove("slideinright");
    document.getElementById("powerupcollection").style.display = "block";
}
var powerpg = 0;
var squarepg = 0;
function showprofileedit(){
    if(document.getElementById("inputprofile").style.display == "block"){
         document.getElementById("inputprofile").style.display = "none";
    }
    else{
        document.getElementById("inputprofile").style.display = "block";   
    }
}
function setprofile(){
    if(document.getElementById("profilepictureinput").files[0] != null){
        var reader = new FileReader();
        reader.onload = function () {
            document.getElementById("profilepicture").src = reader.result;
            localStorage.setItem("profilepicture", new Image().src = reader.result);
        }
        reader.readAsDataURL(document.getElementById("profilepictureinput").files[0]);
    }
    if(document.getElementById("profilenameinput").value.trim() != ""){
        document.getElementById("name").innerHTML = document.getElementById("profilenameinput").value;
        localStorage.setItem("name", document.getElementById("profilenameinput").value);
    }
}
function pagetoggle(id,direction) {
    var usedpg;
    if (id == "powerupcollection") {
        usedpg = powerpg;
    }
    else if (id == "squarescollection") {
        usedpg = squarepg;
    }
    for(var i = 0; i <  document.getElementById(id).getElementsByClassName("page").length; i++) {
        document.getElementById(id).getElementsByClassName("page")[i].style.display = "none";
    }
    document.getElementById(id).getElementsByClassName("page")[usedpg].style.display = "none";
    if (direction == 0) {
        usedpg++;   
    }
    else{
        usedpg--;
    }
    if (usedpg > document.getElementById(id).getElementsByClassName("page").length-1) {
        usedpg = 0;
    }
    if (usedpg < 0) {
        usedpg = document.getElementById(id).getElementsByClassName("page").length-1;
    }
    document.getElementById(id).getElementsByClassName("page")[usedpg].style.display = "block";
    if (id == "powerupcollection") {
        powerpg = usedpg;
    }
    else if (id == "squarescollection") {
        squarepg = usedpg;
    }
}
if(parseInt(localStorage.getItem("tankskilled"),10) >= 30){
    document.getElementById("tankkiller").classList.add("completeFull");
    document.getElementById("tankkiller").getElementsByTagName("h3")[0].innerHTML="Tank Killer";
    document.getElementById("tankkiller").getElementsByTagName("p")[0].innerHTML="Kill 30 tank squares.";
    document.getElementById("tankkiller").getElementsByTagName("h4")[0].innerHTML="";
}
else if(parseInt(localStorage.getItem("tankskilled"),10) >= 10){
    document.getElementById("tankkiller").classList.add("complete2");
    document.getElementById("tankkiller").getElementsByTagName("h3")[0].innerHTML="Tank Killer III";
    document.getElementById("tankkiller").getElementsByTagName("p")[0].innerHTML="Kill 30 tank squares.";
    document.getElementById("tankkiller").getElementsByTagName("h4")[0].innerHTML=tankskilled.value+"/30";
}
else if(parseInt(localStorage.getItem("tankskilled"),10) >= 5){
    document.getElementById("tankkiller").classList.add("complete1");
    document.getElementById("tankkiller").getElementsByTagName("h3")[0].innerHTML="Tank Killer II";
    document.getElementById("tankkiller").getElementsByTagName("p")[0].innerHTML="Kill 10 tank squares.";
    document.getElementById("tankkiller").getElementsByTagName("h4")[0].innerHTML=tankskilled.value+"/10";
}
else if(parseInt(localStorage.getItem("tankskilled"),10) < 5){
    document.getElementById("tankkiller").getElementsByTagName("h4")[0].innerHTML=tankskilled.value+"/5";
}
if(parseInt(localStorage.getItem("totalcoins"),10) >= 100000){
    document.getElementById("flex").classList.add("completeFull");
    document.getElementById("flex").getElementsByTagName("h3")[0].innerHTML="Flex";
    document.getElementById("flex").getElementsByTagName("p")[0].innerHTML="Collect 100,000 coins in total.";
    document.getElementById("flex").getElementsByTagName("h4")[0].innerHTML="";
}
else if(parseInt(localStorage.getItem("totalcoins"),10) >= 10000){
    document.getElementById("flex").classList.add("complete3");
    document.getElementById("flex").getElementsByTagName("h3")[0].innerHTML="Flex IV";
    document.getElementById("flex").getElementsByTagName("p")[0].innerHTML="Collect 100,000 coins in total.";
    document.getElementById("flex").getElementsByTagName("h4")[0].innerHTML=totalcoins.value+"/100000";
}
else if(parseInt(localStorage.getItem("totalcoins"),10) >= 1000){
    document.getElementById("flex").classList.add("complete2");
    document.getElementById("flex").getElementsByTagName("h3")[0].innerHTML="Flex III";
    document.getElementById("flex").getElementsByTagName("p")[0].innerHTML="Collect 10,000 coins in total.";
    document.getElementById("flex").getElementsByTagName("h4")[0].innerHTML=totalcoins.value+"/10000";
}
else if(parseInt(localStorage.getItem("totalcoins"),10) >= 100){
    document.getElementById("flex").classList.add("complete1");
    document.getElementById("flex").getElementsByTagName("h3")[0].innerHTML="Flex II";
    document.getElementById("flex").getElementsByTagName("p")[0].innerHTML="Collect 1,000 coins in total.";
    document.getElementById("flex").getElementsByTagName("h4")[0].innerHTML=totalcoins.value+"/1000";
}
else if(parseInt(localStorage.getItem("totalcoins"),10) < 100){
    document.getElementById("flex").getElementsByTagName("h4")[0].innerHTML=totalcoins.value+"/100";
}
if(parseInt(localStorage.getItem("bomberskilled"),10) >= 30){
    document.getElementById("bombdefuser").classList.add("completeFull");
    document.getElementById("bombdefuser").getElementsByTagName("h3")[0].innerHTML="Bomb Defuser";
    document.getElementById("bombdefuser").getElementsByTagName("p")[0].innerHTML="Kill 30 bomber squares.";
    document.getElementById("bombdefuser").getElementsByTagName("h4")[0].innerHTML="";
}
else if(parseInt(localStorage.getItem("bomberskilled"),10) >= 10){
    document.getElementById("bombdefuser").classList.add("complete2");
    document.getElementById("bombdefuser").getElementsByTagName("h3")[0].innerHTML="Bomb Defuser III";
    document.getElementById("bombdefuser").getElementsByTagName("p")[0].innerHTML="Kill 30 bomber squares.";
    document.getElementById("bombdefuser").getElementsByTagName("h4")[0].innerHTML=bomberskilled.value+"/30";
}
else if(parseInt(localStorage.getItem("bomberskilled"),10) >= 5){
    document.getElementById("bombdefuser").classList.add("complete1");
    document.getElementById("bombdefuser").getElementsByTagName("h3")[0].innerHTML="Bomb Defuser II";
    document.getElementById("bombdefuser").getElementsByTagName("p")[0].innerHTML="Kill 10 bomber squares.";
    document.getElementById("bombdefuser").getElementsByTagName("h4")[0].innerHTML=bomberskilled.value+"/10";
}
else if(parseInt(localStorage.getItem("bomberskilled"),10) < 5){
    document.getElementById("bombdefuser").getElementsByTagName("h4")[0].innerHTML=bomberskilled.value+"/5";
}
var linecanvas = document.getElementById("linescreen");
var linectx = linecanvas.getContext('2d');
var dpi = window.devicePixelRatio;
function fix_dpi(c) {
    var style = {
        height() {
          return +getComputedStyle(c).getPropertyValue('height').slice(0,-2);
        },
        width() {
          return +getComputedStyle(c).getPropertyValue('width').slice(0,-2);
        }
    }
    c.setAttribute('width', style.width() * dpi);
    c.setAttribute('height', style.height() * dpi);
}
fix_dpi(linecanvas);
var amplitude = 100;
var xincrease = 0;
var amplitudedirection = 0;
var colorvalue = 50;
var maxAmplitude = 200;
var animation = setInterval(sinewave,10);
var animations = [sinewave/**, tunnel**/];
var animationIndex = 0;
var xMove = 0;
var mouse = {
    x: 0,
    y: 0
}
document.addEventListener('mousemove',function(e){
     var rect = linecanvas.getBoundingClientRect();
     mouse.x=(e.clientX-rect.left)*(linecanvas.width/rect.width);
     mouse.y=(e.clientY-rect.top)*(linecanvas.height/rect.height);
     maxAmplitude = Math.abs(mouse.y-rect.height/2);
     xMove = (mouse.x-linecanvas.width/2)/10000;
});
/**
document.addEventListener('click',function(e){
	linectx.fillStyle="black";
	linectx.fillRect(0,0,linecanvas.width,linecanvas.height);
	animationIndex ++;
	if(animationIndex >= animations.length){
		animationIndex = 0;
	}
	clearInterval(animation);
	animation = setInterval(animations[animationIndex],10);
})
**/
window.onresize = function(){fix_dpi(linecanvas)};
function sinewave() {
    linectx.fillStyle = "rgba(0,0,0,0.035)";
    linectx.fillRect(0,0,linecanvas.width,linecanvas.height);
    linectx.strokeStyle = 'hsl('+colorvalue+', 83%, 50%)';
    linectx.lineWidth = 2;
    linectx.beginPath();
    for(var i = 0;i < linecanvas.width;i += 2) {
        //linectx.fillRect(i,linecanvas.height/2+Math.sin(i*0.01+z) *b,50,5);
        linectx.lineTo(i,linecanvas.height/2+Math.sin(i*0.01+xincrease) *amplitude-linecanvas.height*0.1);
    }
    linectx.stroke();
    /**linectx.fillStyle="red";
    linectx.fillRect(0,linecanvas.height/2,linecanvas.width,10);
    linectx.fillRect(linecanvas.width/2,0,10,linecanvas.height);
    linectx.font="50px arial";
    linectx.fillText(mouse.x+" , "+mouse.y,0,100);
    linectx.fillText((mouse.x-linecanvas.width/2),0,300);**/
    xincrease += xMove;
    if (amplitudedirection == 0) {
        colorvalue--;
        amplitude--;
    }
    if (amplitudedirection == 1) {
        colorvalue++;
        amplitude++;
    }
    if (amplitude > maxAmplitude) {
        amplitudedirection = 0;
    }
    if (amplitude < -maxAmplitude) {
        amplitudedirection = 1;
    }
}
/**
var tunnel1 = {x: 0, y: 0, size: linecanvas.height*4/5, color: 0};
var tunnel2 = {x: 0, y: 0, size: linecanvas.height*Math.pow(4/5,2), color: 90};
var tunnel3 = {x: 0, y: 0, size: linecanvas.height*Math.pow(4/5,3), color: 180};
var tunnel4 = {x: 0, y: 0, size: linecanvas.height*Math.pow(4/5,4), color: 270};
var tunnel5 = {x: 0, y: 0, size: linecanvas.height*Math.pow(4/5,5), color: 360};
var tunnels = [tunnel1,tunnel2,tunnel3,tunnel4,tunnel5];
function tunnel(){
	linectx.fillStyle="black";
	linectx.fillRect(0,0,linecanvas.width,linecanvas.height);
	linectx.lineWidth = 4;
	tunnel1.x = mouse.x-tunnel1.size/2;
	tunnel1.y = mouse.y-tunnel1.size/2;
	for(var i in tunnels){
		tunnels[i].color++;
		if(tunnels[i].color>360){
			tunnels[i].color = 0;
		}
		var size = tunnels[i].size;
		var speed = size/linecanvas.height*20;
		linectx.strokeStyle = 'hsl('+tunnels[i].color+', 83%, 50%)'
		linectx.strokeRect(tunnels[i].x,tunnels[i].y,size,size);
		var movedleft = false;
		var movedup = false;
		if(Math.abs(tunnels[i].x-(mouse.x-size/2))<speed){
			tunnels[i].x = mouse.x-size/2;
		}
		else{
			if(mouse.x-size/2<tunnels[i].x){
				tunnels[i].x-=speed;
			}
			if(tunnels[i].x<mouse.x-size/2){
				tunnels[i].x+=speed;
			}	
		}
		if(Math.abs(tunnels[i].y - (mouse.y-size/2))<speed){
			tunnels[i].y = mouse.y-size/2;
		}
		else{
			if(mouse.y-size/2<tunnels[i].y){
				tunnels[i].y-=speed;
			}
			if(tunnels[i].y<mouse.y-size/2){
				tunnels[i].y+=speed;
			}	
		}
	}
	linectx.fillRect(0,0,mouse.x-linecanvas.height*4/10-2,linecanvas.height);
	linectx.fillRect(mouse.x+linecanvas.height*4/10+2,0,linecanvas.width-(mouse.x+linecanvas.height*4/10+2),linecanvas.height);
	linectx.fillRect(0,0,linecanvas.width,mouse.y-linecanvas.height*4/10-2);
	linectx.fillRect(0,mouse.y+linecanvas.height*4/10+2,linecanvas.width,linecanvas.height-(mouse.y-linecanvas.height*4/10-2));
}
**/
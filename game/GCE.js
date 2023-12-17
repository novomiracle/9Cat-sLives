var gameOn = false;
var camera = {
	x: 0,
	y: 0
};
var TileMap = false;
var time = 0;
var GameTick = 5;
let TileSets = [];
var TileName = '';
let GridOn = document.getElementById("gridSwitch").valueOf();
let GridY = document.getElementById("gridY").valueOf();
let GridX = document.getElementById("gridX").valueOf();
let sprites = [];
var GameCanvas = document.getElementById('og');

var ctxGC = GameCanvas.getContext("2d");
ctxGC.webkitImageSmoothingEnabled = false;
ctxGC.mozImageSmoothingEnabled = false;
ctxGC.imageSmoothingEnabled = false;
console.log(GameCanvas);


function createImage(path) {
	let img = new Image();
	img.src = path
	return img
}

//class Sprite {
//    constructor(name, x, y, image, images, hitbox) {
//        this.name = name;
//        this.x = x;
//        this.y = y;
//        this.image = image;
//        this.images = images;
//        this.hitbox = hitbox;
//        this.width = null;
//        this.height = null;
//    }
//}


function Sprite(name, x, y, image, images = [], hitboxes = [], zIndex = 0, displayed, addToSprites = true) {
	let sprite = {
		name: name,
		x: x,
		y: y,
		image: image,
		images: images,
		hitboxes: hitboxes,
		zIndex: zIndex,
		displayed: displayed,
		width: null,
		height: null
	};
	if (addToSprites) {
		sprite.id = sprites.length
		sprites.push(sprite)
	}
	return sprite
}

function Hitbox(x, y, width, height, color = "black") {
	let hitbox = {
		x: x,
		y: y,
		width: width,
		height: height,
		color: color
	}
	return hitbox
}


function display(sprite) {
	sprite.sort(function (a, b) {
		return a.zIndex - b.zIndex;
	})
	sprite.forEach(function (el) {
		let Im = createImage(el.image);
		if (el.displayed) {
			if (el.width == null && el.height == null) {
				//Im.onload = function(){
				ctxGC.drawImage(Im, el.x + camera.x, el.y + camera.y)
				//}
			} else {
				ctxGC.drawImage(createImage(el.image), el.x + camera.x, el.y + camera.y, el.width, el.height)
			}
		}
	})
}

function displayHitboxes(sprite) {
	sprite.sort(function (a, b) {
		return a.zIndex - b.zIndex;
	})
	sprite.forEach(function (el) {
		if (el.displayed) {
			el.hitboxes.forEach(function (e) {
				ctxGC.beginPath();
				ctxGC.lineWidth = "1";
				ctxGC.strokeStyle = "black";
				ctxGC.fillStyle = e.color
				ctxGC.fillRect(e.x + camera.x + el.x, e.y + el.y + camera.y, e.width, e.height)
				ctxGC.stroke();
			})
		}
	})
}

function startGame() {

}
document.getElementById('mapEd').addEventListener('mousemove', function (e) {
	var x = e.offsetX;
	var y = e.offsetY;
	if (TileMap) {
		TileName = document.getElementById('TileSprites').value;
		let inx = TileSets.indexOf(TileSets.filter(function (e) {
			return e.name == TileName
		})[0]);
		document.getElementById('mapEd').getContext("2d").clearRect(0, 0, GameCanvas.width, GameCanvas.height)
		document.getElementById('mapEd').getContext("2d").drawImage(createImage(TileSets[inx].theTile.image), x, y)
	}
})
document.getElementById('mapEd').addEventListener('click', function (e) {
	GridOn = document.getElementById("gridSwitch");
	GridY = document.getElementById("gridY").value;
	GridX = document.getElementById("gridX").value;
	var x = e.offsetX - camera.x;
	var y = e.offsetY - camera.y;
	if (GridOn.checked) {
		x = Math.floor(e.offsetX / GridX) * GridX;
		y = Math.floor(e.offsetY / GridY) * GridY;
	}
	if (TileMap) {
		TileName = document.getElementById('TileSprites').value;
		let inx = TileSets.indexOf(TileSets.filter(function (e) {
			return e.name == TileName
		})[0]);
		let ST = Sprite(TileSets[inx].theTile.name, x, y, TileSets[inx].theTile.image, TileSets[inx].theTile.images, TileSets[inx].theTile.hitboxes, TileSets[inx].theTile.zIndex, true);
		TileSets[inx].sp.push(ST)
		display(TileSets[inx].sp)

	}
})

function addTile(sprite) {
	let TheTile = Object.assign({}, sprite);
	let option = document.createElement('option')
	option.innerHTML = TheTile.name;
	option.setAttribute('value', TheTile.name)
	document.getElementById('TileSprites').appendChild(option)
	TileSets.push({
		name: TheTile.name,
		sp: [],
		theTile: TheTile
	})
}

function UpdateGame() {}


setInterval(() => {
	if (gameOn) {
		UpdateGame()
		time++
	}
}, GameTick)

function touch(sprite1, sprite2, num1, num2) {
	let check1 = sprite1.hitboxes[num1].x + sprite1.x <= sprite2.hitboxes[num2].x + sprite2.x + sprite2.hitboxes[num2].width;
	let check2 = sprite1.hitboxes[num1].y + sprite1.y <= sprite2.hitboxes[num2].y + sprite2.y + sprite2.hitboxes[num2].height;
	let check3 = sprite2.hitboxes[num2].x + sprite2.x <= sprite1.hitboxes[num1].x + sprite1.x + sprite1.hitboxes[num1].width;
	let check4 = sprite2.hitboxes[num2].y + sprite2.y <= sprite1.hitboxes[num1].y + sprite1.y + sprite1.hitboxes[num1].height;

	return check1 && check2 && check3 && check4
}

function changeGameCanvasSize(width, height) {
	GameCanvas.width = width
	document.getElementById('mapEd').width = width
	GameCanvas.height = height
	document.getElementById('mapEd').height = height
	document.getElementById("ui").style.top = height + 10 + "px"
}

function clearCanvas() {
	ctxGC.clearRect(0, 0, GameCanvas.width, GameCanvas.height)
}

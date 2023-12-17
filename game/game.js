var obstacles = [];
var black_notation_text = "annoy";
var orange_notation_text = "annoy";

var black_notation_time = -300;
var orange_notation_time = -300;

var black_mystery_box_notation = Sprite("text", 0, 30, "materials/images/text_annoy.png", [], [], 99999999, false)
var orange_mystery_box_notation = Sprite("text", 100, 30, "materials/images/text_annoy.png", [], [], 99999999, false)

var end_screen = Sprite("text", 0, 0, "materials/images/end_screen.png", [], [], 1, false)

var shieldTime = 500;
var obstaclesCreationSpeed = 200;
var max_lives = 9;

var background = Sprite("background", 0, -125, "materials/images/background.png", [], [], -1, true);
var black_shield = Sprite("orange_shield", 100, 143, "materials/images/shield.png", [], [Hitbox(-5, -175, 10, 700)], 9999, true);
var orange_shield = Sprite("black_shield", 0, 143, "materials/images/shield.png", [], [Hitbox(-5, -175, 10, 700)], 9999, true);
var line = Sprite("line", 100, 0, "materials/images/line.png", [], [Hitbox(-5, -175, 10, 700)], 9999, true);
var black_cat = Sprite("black cat", 0, 150, "materials/images/black_cat.png", [], [Hitbox(0, 0, 18, 18)], 9999, true);
var orange_cat = Sprite("orange cat", 101, 150, "materials/images/orange_cat.png", [], [Hitbox(0, 0, 18, 18)], 9999, true);
var lives = [Live(5, 5, black_cat, 1), Live(39, 5, black_cat, 2), Live(74, 5, black_cat, 3), Live(106, 5, orange_cat, 1), Live(140, 5, orange_cat, 2), Live(174, 5, orange_cat, 3)]
black_cat.lives = max_lives
orange_cat.lives = max_lives
black_cat.left = "a"
black_cat.right = "d"
orange_cat.left = 37
orange_cat.right = 39
black_cat.shield = false
orange_cat.shield = false
black_cat.shieldTime = -500;
black_cat.shieldTime = -500;
var cat_speed = 20;
changeGameCanvasSize(200, 175)
line.height = 175
line.width = 1
GameTick = 1


function Live(x, y, cat, num) {
	let live = Sprite("heart", x, y, "materials/images/heart.png", [], [], 9999999, true, true)
	live.cat = cat
	live.stage = 3
	live.num = num
	return live
}

document.addEventListener("keyup", function (e) {
	if (gameOn) {
		if (e.key == black_cat.right && !touch(black_cat, line, 0, 0)) {
			black_cat.x += cat_speed
		}
		if (e.key == black_cat.left && black_cat.x > 0) {
			black_cat.x -= cat_speed
		}
		if (e.keyCode == orange_cat.right && orange_cat.x < 181) {
			orange_cat.x += cat_speed
		}
		if (e.keyCode == orange_cat.left && !touch(orange_cat, line, 0, 0)) {
			orange_cat.x -= cat_speed
		}
		clearCanvas();
		display(sprites)
	}
})

function randomizer(a) {
	let all = [];
	let rng = Math.floor(Math.random() * 10);
	a.forEach((item) => {
		for (let i = 0; i < item.chance * 10; i++) {
			all.push(item)
		}
	})
	let answer = all[rng]
	return answer
}

function createObstacle(i) {
	let obstacleProbabilities = [{
		obstacle: "materials/images/wall.png",
		chance: 0.7,
		func: function (player) {
			if (player.lives > 0) {
				player.lives -= 3
				console.log(player.name + player.lives)
			}
		}
	}, {
		obstacle: "materials/images/small_heart.png",
		chance: 0.2,
		func: function (player) {
			if (player.lives < max_lives) {
				player.lives += 1
				console.log(player.name + player.lives)
			}
		}
	}, {
		obstacle: "materials/images/mystery_box.png",
		chance: 0.1,
		func: function (player) {
			let rand = Math.ceil(Math.random() * 3)
			if (rand == 1) {
				let pl;
				if (player == orange_cat) {
					orange_notation_text = "annoy"
					pl = black_cat
				} else if (player == black_cat) {
					black_notation_text = "annoy"
					pl = orange_cat
				}
				let right = pl.right
				pl.right = pl.left
				pl.left = right
			} else if (rand == 2 && obstaclesCreationSpeed > 30) {
				if (player == black_cat) {
					black_notation_text = "speed_boost"
				}
				if (player == orange_cat) {
					orange_notation_text = "speed_boost"
				}
				obstaclesCreationSpeed += 10
			} else if (rand == 3) {
				if (player == black_cat) {
					black_notation_text = "shield"
				}
				if (player == orange_cat) {
					orange_notation_text = "shield"
				}
				player.shield = true
				player.shieldTime = time
			}
			if (player == black_cat) {
				black_mystery_box_notation.displayed = true
				black_notation_time = time
			} else if (player == orange_cat) {
				orange_mystery_box_notation.displayed = true
				orange_notation_time = time
			}
		}
	}]
	let randomizersChoice = randomizer(obstacleProbabilities);
	let obst = Sprite("obstacle", Math.floor(Math.random() * 5) * 20 + i, 0, randomizersChoice.obstacle, [], [Hitbox(0, 0, 19, 19)], 999, true, false)
	obst.func = randomizersChoice.func
	obst.goDown = function (me) {
		this.y += 1
		if (this.y >= 175 || touch(black_cat, this, 0, 0) || touch(orange_cat, this, 0, 0)) {
			if (touch(this, black_cat, 0, 0) && !black_cat.shield) {
				this.func(black_cat)
			} else if (touch(this, orange_cat, 0, 0) && !orange_cat.shield) {
				this.func(orange_cat)
			}
			obstacles.splice(obstacles.indexOf(me), 1)
		}
	}
	obstacles.push(obst)
	display([obst])

}

function end(player) {
	gameOn = false
	clearCanvas()
	end_screen.displayed = true
	player.x = 88
	player.y = 50
	display([end_screen, player])
	sprites = []
	obstacles = [];
	obstaclesCreationSpeed = 200;
	end_screen = Sprite("text", 0, 0, "materials/images/end_screen.png", [], [], 1, false)
	black_shield = Sprite("orange_shield", 100, 143, "materials/images/shield.png", [], [Hitbox(-5, -175, 10, 700)], 9999, true);
	orange_shield = Sprite("black_shield", 0, 143, "materials/images/shield.png", [], [Hitbox(-5, -175, 10, 700)], 9999, true);
	line = Sprite("line", 100, 0, "materials/images/line.png", [], [Hitbox(-5, -175, 10, 700)], 9999, true);
	black_cat = Sprite("black cat", 0, 150, "materials/images/black_cat.png", [], [Hitbox(0, 0, 18, 18)], 9999, true);
	orange_cat = Sprite("orange cat", 101, 150, "materials/images/orange_cat.png", [], [Hitbox(0, 0, 18, 18)], 9999, true);
	background = Sprite("background", 0, -125, "materials/images/background.png", [], [], -1, true);
	black_mystery_box_notation = Sprite("text", 0, 30, "materials/images/text_annoy.png", [], [], 99999999, false)
	orange_mystery_box_notation = Sprite("text", 100, 30, "materials/images/text_annoy.png", [], [], 99999999, false)
	lives = [Live(5, 5, black_cat, 1), Live(39, 5, black_cat, 2), Live(74, 5, black_cat, 3), Live(106, 5, orange_cat, 1), Live(140, 5, orange_cat, 2), Live(174, 5, orange_cat, 3)]
	end_screen.displayed = false
	black_cat.lives = max_lives
	orange_cat.lives = max_lives
	black_cat.left = "a"
	black_cat.right = "d"
	orange_cat.left = 37
	orange_cat.right = 39
	black_cat.shield = false
	orange_cat.shield = false
	black_cat.shieldTime = -500;
	black_cat.shieldTime = -500;
	line.height = 175
	line.width = 1
}

startGame = function () {
	display(sprites)
}
time = 1
UpdateGame = function () {
	black_mystery_box_notation.image = "materials/images/text_" + black_notation_text + ".png"
	orange_mystery_box_notation.image = "materials/images/text_" + orange_notation_text + ".png"
	if (black_mystery_box_notation.displayed && black_notation_time + 300 == time) {
		black_mystery_box_notation.displayed = false
	}
	if (orange_mystery_box_notation.displayed && orange_notation_time + 300 == time) {
		orange_mystery_box_notation.displayed = false
	}
	black_shield.x = black_cat.x
	orange_shield.x = orange_cat.x
	orange_shield.displayed = orange_cat.shield
	black_shield.displayed = black_cat.shield
	if (time % obstaclesCreationSpeed == 0) {
		createObstacle(0)
		createObstacle(100)
	}
	if (time % 2000 == 0 && obstaclesCreationSpeed > 30) {
		obstaclesCreationSpeed -= 10
		console.log(obstaclesCreationSpeed)
	}
	obstacles.forEach(function (obstacle) {
		let i = 1;
		obstacle.goDown(obstacle)
	})
	clearCanvas();
	if (orange_cat.shield && orange_cat.shieldTime + shieldTime == time) {
		orange_cat.shield = false
	}

	if (black_cat.shield && black_cat.shieldTime + shieldTime == time) {
		black_cat.shield = false
	}
	lives.forEach(function (item) {
		if (item.cat.lives < item.num * 3 - 2) {
			item.displayed = false
		} else {
			item.displayed = true
			if (item.cat.lives == item.num * 3) {
				item.image = "materials/images/heart.png"
			} else if (item.cat.lives == item.num * 3 - 1) {
				item.image = "materials/images/2_3heart.png"
			} else if (item.cat.lives == item.num * 3 - 2) {
				item.image = "materials/images/1_3heart.png"
			}
		}
	})
	console.log(time)
	background.y += 1
	if (background.y == 0) {
		background.y = -125
	}
	display(sprites)
	display(obstacles)
	if (black_cat.lives <= 0) {
		end(orange_cat)
	}
	if (orange_cat.lives <= 0) {
		end(black_cat)
	}
}

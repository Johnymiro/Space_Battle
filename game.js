const FPS = 30; // frames per second
const SHIP_SIZE = 30; // SHIP HEIGHT IN PIXELS
const TURN_SPEED = 360; // turn speed in degrees per second
const SHIP_THRUST = 5; // acceleration of the ship in pixels per second
const FRICTION = 0.79; // friction coefficient of space (0 = now friction, 1 = lots of friction)
const ROIDS_NUM = 3; // starting number of asteroids
const ROIDS_SIZE = 100; // starting size of asteroids in pixels
const ROIDS_SPD = 50; // max starting speed of asteroids in pixels per second
const ROIDS_VERT = 10; // average number of vertices on each asteroid

/** @type {HTMLCanvasElement} */
let canv = document.getElementById("gameCanvas");
let ctx = canv.getContext("2d");
let ship = {
    x: canv.width / 2,
    y: canv.height / 2,
    r: SHIP_SIZE / 2,
    a: 90 / 180 * Math.PI, // convert to radians 
    rot: 0,
    thrusting: false,
    thrust: {
        x: 0,
        y: 0
    }
}

// set up asteroids
var roids = [];
createAsteroideBelt();

// set event handlers
document.addEventListener("keydown", keyDown);
document.addEventListener("keyup", keyUp);

// set up the game loop
setInterval(update, 1000 / FPS);

function createAsteroideBelt() {
    roids = [];
    var x, y;

    for (let i = 0; i < ROIDS_NUM; i++) {
        x = Math.floor(Math.random() * canv.width);
        y = Math.floor(Math.random() * canv.height);
        roids.push(newAsteroid(x, y));
    }
}

function keyDown(/**@type {KeyboardEvent}*/  ev) {
    const key = {
        LEFT: 37,
        RIGHT: 39,
        UP: 38,
        DOWN: 40
    }

    switch(ev.keyCode) {
        case key.LEFT: // left arrow (rotate ship left)
            ship.rot = TURN_SPEED / 180 * Math.PI / FPS;
            break;

        case key.UP: // up arrow (thrust the ship forward)
            ship.thrusting = true;
            break;

        case key.RIGHT: // right arrow (rotate ship right)
            ship.rot = TURN_SPEED / 180 * -Math.PI / FPS;
            break;

        case key.DOWN: // thrust the ship backward        
    }
}

function keyUp(/**@type {KeyboardEvent} */ ev) {
    const key = {
        LEFT: 37,
        RIGHT: 39,
        UP: 38,
        DOWN: 40
    }

    switch(ev.keyCode) {
        case key.LEFT: // left arrow (rotate ship left)
            ship.rot = 0;
            break;

        case key.UP: // up arrow (stop thrusting)
            ship.thrusting = false;
            break;

        case key.RIGHT: // right arrow (stop rotate ship right)
            ship.rot = 0;
            break;
    }
}

function newAsteroid(x, y) {
    var roid = {
        x: x,
        y: y,
        xv: Math.random() * ROIDS_SPD / FPS * (Math.random() < 0.5 ? 1 : -1),
        yv: Math.random() * ROIDS_SPD / FPS * (Math.random() < 0.5 ? 1 : -1),
        r:  ROIDS_SIZE / 2,
        a:  Math.random() * Math.PI * 2, // in radians
        vert: Math.floor(Math.random() * (ROIDS_VERT + 1) + ROIDS_VERT / 2)
    }
    return roid;
}

function update() {
    // draw space 
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canv.width, canv.height);

    // thrust the ship 
    if (ship.thrusting) {
        ship.thrust.x += SHIP_THRUST * Math.cos(ship.a) / FPS;
        ship.thrust.y -= SHIP_THRUST * Math.sin(ship.a) / FPS;
        
        
        //draw the thruster 
        ctx.fillStyle = "red";
        ctx.strokeStyle = "yellow";
        ctx.lineWidth = SHIP_SIZE / 10;
        ctx.beginPath();
        ctx.moveTo( // rear left
            ship.x - ship.r * (2 / 3 * Math.cos(ship.a) + 0.5 * Math.sin(ship.a)),
            ship.y + ship.r * (2 / 3 * Math.sin(ship.a) - 0.5 * Math.cos(ship.a))
        );

        ctx.lineTo( // rear centre behind the ship
            ship.x - ship.r * 6 / 3 * Math.cos(ship.a),
            ship.y + ship.r * 6 / 3 * Math.sin(ship.a) 
        );

        ctx.lineTo( // rear right
            ship.x - ship.r * (2 / 3 * Math.cos(ship.a) - 0.5 * Math.sin(ship.a)),
            ship.y + ship.r * (2 / 3 * Math.sin(ship.a) + 0.5 * Math.cos(ship.a))
        );

        ctx.closePath();
        ctx.fill();
        ctx.stroke();        
    }
        
    else {
        ship.thrust.x -= FRICTION * ship.thrust.x / FPS;
        ship.thrust.y -= FRICTION * ship.thrust.y / FPS;
    }    


    //draw triangular ship
    ctx.strokeStyle = "white";
    ctx.lineWidth = SHIP_SIZE / 20;
    ctx.beginPath();
    ctx.moveTo( // nose of th e ship
        ship.x + 4 / 3 * ship.r * Math.cos(ship.a),
        ship.y - 4 / 3 * ship.r * Math.sin(ship.a)
    );

    ctx.lineTo( // rear right

        ship.x - ship.r * (2 / 3 * Math.cos(ship.a) + Math.sin(ship.a)),
        ship.y + ship.r * (2 / 3 * Math.sin(ship.a) - Math.cos(ship.a))
    );

     ctx.lineTo( // rear right

        ship.x - ship.r * (2 / 3 * Math.cos(ship.a) - Math.sin(ship.a)),
        ship.y + ship.r * (2 / 3 * Math.sin(ship.a) + Math.cos(ship.a))
    );
    ctx.closePath();
    ctx.stroke();

    //draw the asteroids
    ctx.strokeStyle = "slategrey";
    ctx.lineWidth = SHIP_SIZE / 20;
    var x, y, r, a, vert;
    for(var i = 0; i < roids.length; i++) {

        // get the asteroid properties
        x = roids[i].x;
        y = roids[i].y;
        r = roids[i].r;
        a = roids[i].a;
        vert = roids[i].vert;

        // draw a path
        ctx.beginPath();
        ctx.moveTo(
            x + r * Math.cos(a),
            y + r * Math.sin(a),
        );

        // draw the polygon
        for (var j = 0; j < vert; j++) {
            ctx.lineTo(
                x + r * Math.cos(a + j * Math.PI * 2 / vert),
                y + r * Math.sin(a + j * Math.PI * 2 / vert)
            );
        }    
        ctx.closePath();
        ctx.stroke();

        // move the asteroid

        // handle edge of screen
    }

    // rotate ship
        ship.a += ship.rot;


    //move the ship
    ship.x += ship.thrust.x;
    ship.y += ship.thrust.y;


    // handle edge of screen
    if(ship.x < 0 - ship.r) {
        ship.x = canv.width + ship.r;
    }
    else if (ship.x > canv.width + ship.r) {
        ship.x = 0 - ship.r;
    }
    else if (ship.y < 0 - ship.r) {
        ship.y = canv.height + ship.r;
    }
    else if (ship.y > canv.height + ship.r) {
        ship.y = 0 - ship.r;
    }


    //center dot
    ctx.fillStyle = "red";
    ctx.fillRect(ship.x - 1, ship.y - 1, 2, 2);
}

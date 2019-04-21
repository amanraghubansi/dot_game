var gameParams = {
    canvas: document.getElementById("myCanvas"),
    dy: 50,
    dotsObj: {},
    user: {
        score: 0
    },
    interval: "",
    isGameAlreadyStarted: false,
    scoreEl: document.getElementById('game-speed'),
    controlBtnEl: document.getElementById("controlBtn"),
    silderEl: document.getElementById("myRange"),
    restartBtnEl: document.getElementById("restartBtn"),
    audioEl : document.getElementById('myAudio'),
    muteMusicEl : document.getElementById('muteMusic'),
    isGamePaused: false
};
gameParams['ctx'] = gameParams.canvas.getContext("2d");
gameParams['canvasWidth'] = gameParams.canvas.width;

var dotGame = {
    mouseClickHandler: function (e) {
        // handler to remove dots upon click if click position lies in circle
        var rect = gameParams.canvas.getBoundingClientRect();
        x1 = (e.clientX - rect.left).toFixed(0);
        y1 = (e.clientY - rect.top).toFixed(0);
        var data = utilityTasks.isPointInsideCircle(gameParams.dotsObj, x1, y1, gameParams.user);
        if (data.isInsideCircle) {
            document.getElementById("user-score").innerHTML = gameParams.user.score + "<span class='font-sm'> (Points for current burst : " + data.score + ")</span>";
            this.draw(true);
        }
    },
    sliderChangeHandler: function (e) {
        gameParams.scoreEl.innerHTML = "(" + e.target.value + ")";
        gameParams.dy = +e.target.value;
        if (!gameParams.isGamePaused) {
            this.handleSetInterval();
        }

    },
    handleSetInterval: function () {
        clearInterval(gameParams.interval);
        var self = this;
        var stamp = new Date().getTime();
        gameParams.interval = setInterval(function () {
            var now = new Date().getTime();
            if ((now - stamp) >= 1000) {
                stamp = now;
                utilityTasks.createDot(gameParams.canvasWidth, gameParams.dotsObj);
            }
            self.draw();
        }, (1000 / gameParams.dy) * 2);
    },
    controlGame: function (e) {
        var val = e.target.innerHTML;
        if (val === 'start') {
            gameParams.isGamePaused = false;
            attachOrRemoveClickListener();
            if (!gameParams.isGameAlreadyStarted) {
                utilityTasks.createDot(gameParams.canvasWidth, gameParams.dotsObj);
                this.draw();
            }
            this.handleSetInterval();
            gameParams.isGameAlreadyStarted = true;
            e.target.innerHTML = "pause";
            gameParams.audioEl.play();
        } else {
            gameParams.isGamePaused = true;
            attachOrRemoveClickListener(true);
            e.target.innerHTML = "start";
            clearInterval(gameParams.interval);
            gameParams.audioEl.pause();
        }
    },
    draw: function (isClicked) {
        gameParams.ctx.clearRect(0, 0, gameParams.canvas.width, gameParams.canvas.height);
        this.drawDots(isClicked);
    },
    drawDots: function (isClicked) {
        //to print dots on canvas
        for (var dot in gameParams.dotsObj) {
            var data = gameParams.dotsObj[dot];
            if ((data.posY - data.ballRadius) > gameParams.canvasWidth) {
                delete gameParams.dotsObj[dot];
                continue;
            }
            gameParams.ctx.beginPath();
            if (!data.isMovementStarted || isClicked) {
                data.isMovementStarted = true;
            } else {
                // data.posY += gameParams.dy; //increament position of dots
                data.posY += 2; //increament position of dots
            }
            gameParams.ctx.arc(data.posX, data.posY, data.ballRadius, 0, Math.PI * 2);
            gameParams.ctx.fillStyle = data.fillStyle;
            gameParams.ctx.fill();

            gameParams.ctx.closePath();
        }
    }
}


function attachOrRemoveClickListener(remove) {
    if (remove) {
        gameParams.canvas.removeEventListener("click", mouseClickHandler, false);
    } else {
        gameParams.canvas.addEventListener("click", mouseClickHandler, false);

    }
}

var mouseClickHandler = dotGame.mouseClickHandler.bind(dotGame),
    sliderChangeHandler = dotGame.sliderChangeHandler.bind(dotGame);

gameParams.controlBtnEl.addEventListener("click", dotGame.controlGame.bind(dotGame), false);
gameParams.silderEl.addEventListener("change", sliderChangeHandler, false);
gameParams.muteMusicEl.addEventListener("click", function(){
    if(gameParams.muteMusicEl.innerHTML.toLowerCase() == 'mute'){
        gameParams.audioEl.muted=true;
        gameParams.muteMusicEl.innerHTML="unmute";
    }else{
        gameParams.audioEl.muted=false;
        gameParams.muteMusicEl.innerHTML="mute";
    }
}, false);

gameParams.restartBtnEl.addEventListener("click", function () {
    gameParams = Object.assign(gameParams, {
        dotsObj: {},
        user: {
            score: 0
        },
        isGamePaused: false
    });
    document.getElementById("user-score").innerHTML = " -- ";
    dotGame.draw();
    dotGame.handleSetInterval();
    attachOrRemoveClickListener();
    gameParams.controlBtnEl.innerHTML = "pause";
}, false)

attachOrRemoveClickListener();


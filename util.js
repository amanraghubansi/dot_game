var utilityTasks = (function () {
    function fetchRandomNumber(n1, n2) {
        return Math.floor(Math.random() * n2) + n1;
    }

    function getDistanceInTwoPoints(x1, y1, x2, y2) {
        return Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1));
    }

    function calculateScore(radius) {
        var factor = radius / 5,
            score = (10 / factor).toFixed(2);
        return +score;
    }

    function createDot(canvasWidth, circleList) {
        //To create new dot every second on screen
        // radius  : random no. b/w 5 to 50 and same for x position of dot
        //If dot overlapo existing dot or moving out of canvas, then dot is discarded and 
        // new one is created.
        var x,
            y = 0,
            circle = {},
            loopContinue = false,
            newCirlce;
        do {
            loopContinue = false;
            x = fetchRandomNumber(1, canvasWidth);
            newCirlce = { ballRadius: fetchRandomNumber(5, 50), posX: x, posY: y, isMovementStarted: false };
            if ((newCirlce.posX + newCirlce.ballRadius > canvasWidth) || (newCirlce.posX - newCirlce.ballRadius < 0)) {
                loopContinue = true;
                continue;
            }
            for (var i in circleList) {
                var obj = circleList[i];
                if ((obj.posY - 70) > newCirlce + newCirlce.ballRadius) {  // 50px is max radius and 20px as gutter space
                    loopContinue = true;
                    break;
                } else if (getDistanceInTwoPoints(newCirlce.posX, newCirlce.posY, obj.posX, obj.posY) < (newCirlce.ballRadius + obj.ballRadius)) {
                    loopContinue = true;
                    break;
                }
            }
        } while (loopContinue);
        circle[x + '-' + y] = newCirlce;
         if(newCirlce.ballRadius > 23){
            newCirlce.fillStyle = "#00b5ff";
        }else{
            newCirlce.fillStyle = "#84d894";
        }
        Object.assign(circleList, circle);
    }

    function isPointInsideCircle(circleList, x, y, userObj) {
        //To check if a point lies in the circle
        var isInsideCircle = false;
        var score =0;
        for (var i in circleList) {
            var obj = circleList[i];
            if (getDistanceInTwoPoints(x, y, obj.posX, obj.posY) < obj.ballRadius) {
                score = +calculateScore(obj.ballRadius).toFixed(2);
                userObj.score = +(userObj.score + score).toFixed(2);
                isInsideCircle = true;
                delete circleList[i];
                break;
            }
        }
        return {isInsideCircle : isInsideCircle ,score : score };
    }



    return {
        createDot: createDot,
        isPointInsideCircle: isPointInsideCircle
    }
})();




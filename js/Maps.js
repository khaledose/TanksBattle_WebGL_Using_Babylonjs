function Maps() {
    var canvas = document.getElementById("MapsCanvas");
    var context = canvas.getContext("2d");
    var bgImage = new Image();

    bgImage.onload = function(){
        context.drawImage(bgImage, 0, 0);
    };
    bgImage.src = "images/PlayPage.png";
    gameOver = 0;
}
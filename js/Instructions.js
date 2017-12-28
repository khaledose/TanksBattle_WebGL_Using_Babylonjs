function Instructions() {
    var canvas = document.getElementById("InstructionsCanvas");
    var context = canvas.getContext("2d");
    var bgImage = new Image();

    bgImage.onload = function(){
        context.drawImage(bgImage, 0, 0);
    };
    bgImage.src = "images/InstructionsPage.png";
}
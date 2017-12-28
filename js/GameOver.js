function GameOver() {
    document.getElementById("renderCanvas").style.display = "none";
    document.getElementById("InstructionsCanvas").style.display = "none";
    document.getElementById("CreditsCanvas").style.display = "none";
    document.getElementById("MapsCanvas").style.display = "none";
    document.getElementById("UICanvas").style.display = "none";

    document.getElementById("PlayerContainer").style.display = "none";
    document.getElementById("slider").style.display = "none";
    document.getElementById("NTanksContainer").style.display = "none";
    document.getElementById("BulletsContainer").style.display = "none";

    document.getElementById("sandBtn").style.display = "none";
    document.getElementById("fogBtn").style.display = "none";
    document.getElementById("backBtn").style.display = "none";
    document.getElementById("snowLockedBtn").style.display = "none";
    document.getElementById("forestLockedBtn").style.display = "none";

    document.getElementById("ModeCanvas").style.display = "none";
    document.getElementById("realBtn").style.display = "none";
    document.getElementById("cartoonBtn").style.display = "none";

    document.getElementById("GameOverCanvas").style.display = "inline";
    document.getElementById("WinnerContainer").style.display = "inline";

    var canvas = document.getElementById("GameOverCanvas");
    var context = canvas.getContext("2d");
    var bgImage = new Image();

    bgImage.onload = function(){
        context.drawImage(bgImage, 0, 0);
    };
    bgImage.src = "images/GameOverPage.png";

    document.getElementById("Winner").innerHTML = "PLAYER " + (lastAlive+1) + " WINS!";
}
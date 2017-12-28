document.addEventListener("DOMContentLoaded", intro, false);

function intro() {
    document.getElementById("renderCanvas").style.display = "none";
    document.getElementById("InstructionsCanvas").style.display = "none";
    document.getElementById("CreditsCanvas").style.display = "none";
    document.getElementById("MapsCanvas").style.display = "none";
    document.getElementById("GameOverCanvas").style.display = "none";
    document.getElementById("PlayerContainer").style.display = "none";
    document.getElementById("slider").style.display = "none";
    document.getElementById("NTanksContainer").style.display = "none";
    document.getElementById("WinnerContainer").style.display = "none";
    document.getElementById("BulletsContainer").style.display = "none";

    document.getElementById("sandBtn").style.display = "none";
    document.getElementById("fogBtn").style.display = "none";
    document.getElementById("snowBtn").style.display = "none";
    document.getElementById("forestBtn").style.display = "none";
    document.getElementById("snowLockedBtn").style.display = "none";
    document.getElementById("forestLockedBtn").style.display = "none";

    document.getElementById("backBtn").style.display = "none";
    document.getElementById("playBtn").style.display = "none";
    document.getElementById("creditsBtn").style.display = "none";
    document.getElementById("instructionsBtn").style.display = "none";

    document.getElementById("UICanvas").style.display = "none";

    document.getElementById("ModeCanvas").style.display = "none";
    document.getElementById("realBtn").style.display = "none";
    document.getElementById("cartoonBtn").style.display = "none";

    var intro1 = document.getElementById("intro1");
    var intro2 = document.getElementById("intro2");
    var intro3 = document.getElementById("intro3");

    setTimeout(function() {
        intro1.style.display = 'block';
        setTimeout(function() {
            intro1.style.display = 'none';
            intro2.style.display = 'block';
            setTimeout(function() {
                intro2.style.display = 'none';
                intro3.style.display = 'block';
                setTimeout(function() {
                    intro1.style.display = 'none';
                    intro2.style.display = 'none';
                    intro3.style.display = 'none';
                    UI();
                }, 5000);
            }, 5000);
        }, 5000);
    }, 0);
}

function UI() {
    document.getElementById("renderCanvas").style.display = "none";
    document.getElementById("InstructionsCanvas").style.display = "none";
    document.getElementById("CreditsCanvas").style.display = "none";
    document.getElementById("MapsCanvas").style.display = "none";
    document.getElementById("GameOverCanvas").style.display = "none";
    document.getElementById("PlayerContainer").style.display = "none";
    document.getElementById("slider").style.display = "none";
    document.getElementById("NTanksContainer").style.display = "none";
    document.getElementById("WinnerContainer").style.display = "none";
    document.getElementById("BulletsContainer").style.display = "none";

    document.getElementById("sandBtn").style.display = "none";
    document.getElementById("fogBtn").style.display = "none";
    document.getElementById("snowBtn").style.display = "none";
    document.getElementById("forestBtn").style.display = "none";
    document.getElementById("snowLockedBtn").style.display = "none";
    document.getElementById("forestLockedBtn").style.display = "none";

    document.getElementById("backBtn").style.display = "none";

    document.getElementById("ModeCanvas").style.display = "none";
    document.getElementById("realBtn").style.display = "none";
    document.getElementById("cartoonBtn").style.display = "none";

    document.getElementById("playBtn").style.display = "inline";
    document.getElementById("creditsBtn").style.display = "inline";
    document.getElementById("instructionsBtn").style.display = "inline";

    document.getElementById("UICanvas").style.display = "inline";

    var canvas = document.getElementById("UICanvas");
    var context = canvas.getContext("2d");
    var bgImage = new Image();

    bgImage.onload = function(){
        context.drawImage(bgImage, 0, 0);
    };
    bgImage.src = "images/StartPage.png";
}
var sceneNum = 0;
var gameOver = 0;
var n;
var alive = [];
var lastAlive=0;
var _isReal;

var backSound;
var TankExplosion;
var bulletSound;
var BulletExplosion;
var EngineIdle;
var EngineDriving;
var powerups;

var nBullets;

var onGame;

function Game() {

    /*Variables*/
    var canvas;
    var engine;
    var scene;
    var light;
    var ground;
    var followCamera;
    var assetsManager;
    var shadowGenerator;
    var cameraLocked = true;
    var modelsPositions = [];
    var countTime2;
    var PlayerDistance;
    var PlayerTime;
    var tankNames = [];
    var tank = [];
    var tanksPositions = [];
    var tankParticlesLeft;
    var tankParticlesRight;
    var bustedTank = [];

    var textPlaneTexture = [];
    var frontHealthBar = [];
    var backHealthBar = [];
    var dynamicTexture = [];
    var healthBarMaterial = [];
    var healthBarContainerMaterial = [];
    var healthBarContainer = [];
    var healthPercentage = [];
    var healthBarReady = false;

    var turnTimer = 15;
    var movementLimit = 150;
    var dontMove = false;
    var delayRayShot=false;
    var hasShot = false;
    var bullet;
    var currentTank = 0;
    var generatedBullets = [];
    var generatedDoubleDamage = [];
    var generatedExtraDistance = [];
    var generatedHealth = [];
    var tankBullets = [];
    var generatedBulletsMaterial = [];
    var generatedDoubleDamageMaterial = [];
    var generatedExtraDistanceMaterial = [];
    var generatedHealthMaterial = [];
    var powerupTaken1 = [];
    var powerupTaken2 = [];
    var powerupTaken3 = [];
    var powerupTaken4 = [];
    var damage = 20;


    var bulletSmoke;
    var bulletFire;
    var bulletExploded=false;
    var direction;

    var models = [];
    var cactus = [];
    var radar = [];
    var cow = [];
    var helipad = [];
    var oilStorage = [];
    var palmTree = [];
    var palmTree1 = [];
    var palmTree2 = [];
    var palmTree3 = [];
    var tree = [];
    var treeLeaf = [];
    var tree2 = [];
    var treeLeaf2 = [];
    var grass = [];
    var rocks1 = [];
    var rocks2 = [];
    var barrel = [];
    var deadTree1 = [];
    var deadTree2 = [];
    var deadTree3 = [];
    var deadTree4 = [];
    var deadTree5 = [];
    var snowMan = [];
    var plant = [];
    var snowTree1 = [];
    var snowTreeLeaf1 = [];

    var isWPressed = false;
    var isAPressed = false;
    var isSPressed = false;
    var isDPressed = false;

    var isFPressed = false;
    var isRPressed = false;

    var isPickable = true;
    var isTankReady = false;

/*--------------------------------------------------------------------------------------------------------------------*/

    /*Listeners*/
    document.addEventListener("keyup", function () {
        if(onGame) {
            if (event.key == 'a' || event.key == 'A') {
                isAPressed = false;
            }
            if (event.key == 's' || event.key == 'S') {
                followCamera.radius = 15;
                if(!EngineIdle.isPlaying) {
                    EngineIdle.play();
                    EngineDriving.stop();
                }
                isSPressed = false;
            }
            if (event.key == 'd' || event.key == 'D') {
                isDPressed = false;
            }
            if (event.key == 'w' || event.key == 'W') {
                if(!EngineIdle.isPlaying) {
                    EngineIdle.play();
                    EngineDriving.stop();
                }
                isWPressed = false;
            }
            if (event.key == 'f' || event.key == 'F') {
                //isFPressed = false;
            }
            if (event.key == 'r' || event.key == 'R') {
                isRPressed = false;
            }
            if (event.key == 'q' || event.key == 'Q') {
                tank[currentTank].dispose();
                tank[currentTank]= null;
            }
        }
    });
    document.addEventListener("keydown", function () {
        if(onGame) {
            if (event.key == 'a' || event.key == 'A') {
                isAPressed = true;
            }
            if (event.key == 's' || event.key == 'S') {
                if(!EngineDriving.isPlaying&&movementLimit!==0) {
                    EngineDriving.play();
                    EngineIdle.stop();
                }
                isSPressed = true;
            }
            if (event.key == 'd' || event.key == 'D') {
                isDPressed = true;
            }
            if (event.key == 'w' || event.key == 'W') {
                if(!EngineDriving.isPlaying&&movementLimit!==0) {
                    EngineDriving.play();
                    EngineIdle.stop();
                }
                isWPressed = true;
            }
            if (event.key == 'f' || event.key == 'F') {
                fire();
                if(tankBullets[currentTank]>0)
                    isFPressed = true;
            }
            if (event.key == 'r' || event.key == 'R') {
                checkRays();
                isRPressed = true;
            }
        }
    });


    /*GameStart*/
    onGame = true;
    for(var i=1;i<=n;i++){
        tankNames.push("images/tank"+i+".jpg");
    }
    createScene();



    /*Functions*/
    function createAssetsManager() {
        if (scene) {
            assetsManager = new BABYLON.AssetsManager(scene);
        }
        else {
            setTimeout(function () {
                createAssetsManager();
            }, 300);
        }
    }

    function loadAssetsManager() {
        if (assetsManager) {
            assetsManager.load();
            setupTanksPositions();
        }
        else {
            setTimeout(function () {
            }, 300);
        }
    }



    function createScene() {
        if(onGame) {
            if (sceneNum === 0) {
                createSandScene();
            }
            else if (sceneNum === 1) {
                createFogScene();
            }
            else if (sceneNum === 2) {
                createSnowScene();
            }
            else if (sceneNum === 3) {
                createForestScene();
            }
        }
    }

    function createSandScene() {
        canvas = document.getElementById("renderCanvas");
        engine = new BABYLON.Engine(canvas, true);
        scene = new BABYLON.Scene(engine);
        engine.isPointerLock = true;
        engine.enableOfflineSupport = false;
        scene.fogMode = BABYLON.Scene.FOGMODE_EXP2;
        scene.fogDensity = 0.005;
        scene.fogColor = new BABYLON.Color4(0.74, 0.64, 0.46);
        scene.enablePhysics(new BABYLON.Vector3(0, -10, 0), new BABYLON.CannonJSPlugin());
        createAssetsManager();
        loadSounds();
        createLight();
        var skybox = createSkybox("images/skybox/skybox/skybox", true);
        for(var i=0;i<n;i++) {
            createTank(tankNames[i], i);
        }
        designSandMap();

        waitForIt(true);
    }
    function designSandMap(){
        var terrainMaterial = new BABYLON.TerrainMaterial("terrainMaterial", scene);
        terrainMaterial.mixTexture = new BABYLON.Texture("images/mixMap.png", scene);
        terrainMaterial.diffuseTexture1 = new BABYLON.Texture("images/mountain.png", scene);
        terrainMaterial.diffuseTexture2 = new BABYLON.Texture("images/grass.png", scene);
        terrainMaterial.diffuseTexture3 = new BABYLON.Texture("images/sand1.png", scene);
        terrainMaterial.diffuseTexture1.uScale = terrainMaterial.diffuseTexture1.vScale = 10;
        terrainMaterial.diffuseTexture2.uScale = terrainMaterial.diffuseTexture2.vScale = 10;
        terrainMaterial.diffuseTexture3.uScale = terrainMaterial.diffuseTexture3.vScale = 10;
        ground = new BABYLON.Mesh.CreateGroundFromHeightMap("ground", "images/myHeightMap1.png", 500, 500, 50, 0, 30, scene, false, onGroundCreated);
        function onGroundCreated() {
            ground.material = terrainMaterial;
            ground.checkCollisions = true;
        }
        for(var i=0;i<30;i++)
            modelsPositions.push(new BABYLON.Vector3((Math.random() * (60 +70) - 70), 0, (Math.random() * (100 +60) - 60)));
        for(var i=30;i<35;i++)
            modelsPositions.push(new BABYLON.Vector3((Math.random() * (-110 +160) - 160), 0, (Math.random() * (-100 +160) - 160)));
        for(var i=35;i<45;i++)
            modelsPositions.push(new BABYLON.Vector3((Math.random() * (140 -60) + 60), 0, (Math.random() * (-110 +160) - 160)));
        for(var i=45;i<55;i++)
            modelsPositions.push(new BABYLON.Vector3((Math.random() * (160 -120) + 120), 0, (Math.random() * (190 -130) + 130)));
        for(var i=55;i<60;i++)
            modelsPositions.push(new BABYLON.Vector3((Math.random() * (-120 +170) - 170), 0, (Math.random() * (190 -150) + 150)));
        palmTree = createModel("palmTree2.babylon", "tree material", "images/Leaf_CoconutGree.png",modelsPositions, 1.5, 1.5, 1, 60);
        modelsPositions= [];
        for(var i=0;i<5;i++)
            modelsPositions.push(new BABYLON.Vector3((Math.random() * (60 +70) - 70), 0, (Math.random() * (100 +60) - 60)));
        for(var i=5;i<7;i++)
            modelsPositions.push(new BABYLON.Vector3((Math.random() * (-110 +160) - 160), 0, (Math.random() * (-100 +160) - 160)));
        for(var i=7;i<9;i++)
            modelsPositions.push(new BABYLON.Vector3((Math.random() * (140 -60) + 60), 0, (Math.random() * (-110 +160) - 160)));
        for(var i=9;i<11;i++)
            modelsPositions.push(new BABYLON.Vector3((Math.random() * (160 -120) + 120), 0, (Math.random() * (190 -130) + 130)));
        for(var i=11;i<13;i++)
            modelsPositions.push(new BABYLON.Vector3((Math.random() * (-120 +170) - 170), 0, (Math.random() * (190 -150) + 150)));
        palmTree1 = createModel("palmTree1.babylon", "tree material", "images/Leaf_CoconutGree1.png",modelsPositions, 5, 5, 5, 13);
        modelsPositions= [];
        for(var i=0;i<30;i++)
            modelsPositions.push(new BABYLON.Vector3((Math.random() * (60 +70) - 70), 0, (Math.random() * (100 +60) - 60)));
        for(var i=30;i<35;i++)
            modelsPositions.push(new BABYLON.Vector3((Math.random() * (-110 +160) - 160), 0, (Math.random() * (-100 +160) - 160)));
        for(var i=35;i<45;i++)
            modelsPositions.push(new BABYLON.Vector3((Math.random() * (140 -60) + 60), 0, (Math.random() * (-110 +160) - 160)));
        for(var i=45;i<55;i++)
            modelsPositions.push(new BABYLON.Vector3((Math.random() * (160 -120) + 120), 0, (Math.random() * (190 -130) + 130)));
        for(var i=55;i<60;i++)
            modelsPositions.push(new BABYLON.Vector3((Math.random() * (-120 +170) - 170), 0, (Math.random() * (190 -150) + 150)));
        palmTree2 = createModel("palmTree3.babylon", null,null,modelsPositions, 5, 5, 5, 60);
        modelsPositions= [];
        for(var i=0;i<30;i++)
            modelsPositions.push(new BABYLON.Vector3((Math.random() * (60 +70) - 70), 0, (Math.random() * (100 +60) - 60)));
        for(var i=30;i<35;i++)
            modelsPositions.push(new BABYLON.Vector3((Math.random() * (-110 +160) - 160), 0, (Math.random() * (-100 +160) - 160)));
        for(var i=35;i<45;i++)
            modelsPositions.push(new BABYLON.Vector3((Math.random() * (140 -60) + 60), 0, (Math.random() * (-110 +160) - 160)));
        for(var i=45;i<55;i++)
            modelsPositions.push(new BABYLON.Vector3((Math.random() * (160 -120) + 120), 0, (Math.random() * (190 -130) + 130)));
        for(var i=55;i<60;i++)
            modelsPositions.push(new BABYLON.Vector3((Math.random() * (-120 +170) - 170), 0, (Math.random() * (190 -150) + 150)));
        palmTree3 = createModel("palmTree4.babylon", "material","images/Leaf_Palm.png",modelsPositions, 8, 8, 8, 60);
        modelsPositions= [];
        for(var i=0;i<200;i++)
            modelsPositions.push(new BABYLON.Vector3((Math.random() * (60 +70) - 70), 0, (Math.random() * (100 +60) - 60)));
        for(var i=200;i<250;i++)
            modelsPositions.push(new BABYLON.Vector3((Math.random() * (-110 +160) - 160), 0, (Math.random() * (-100 +160) - 160)));
        for(var i=250;i<300;i++)
            modelsPositions.push(new BABYLON.Vector3((Math.random() * (140 -60) + 60), 0, (Math.random() * (-110 +160) - 160)));
        for(var i=300;i<350;i++)
            modelsPositions.push(new BABYLON.Vector3((Math.random() * (160 -120) + 120), 0, (Math.random() * (190 -130) + 130)));
        for(var i=350;i<400;i++)
            modelsPositions.push(new BABYLON.Vector3((Math.random() * (-120 +170) - 170), 0, (Math.random() * (190 -150) + 150)));
        grass = createModel("grass.babylon", "grass material", "images/Grass1.png",modelsPositions, 1.5, 1, 1.5, 400);
        modelsPositions=[];
        for(var i=0;i<30;i++)
            modelsPositions.push(new BABYLON.Vector3((Math.random() * (200 +200) - 200), 0, (Math.random() * (200 +200) - 200)));
        cow = createModel("cow.babylon", null,null,modelsPositions, 1.5, 1, 1.5, 30);
        modelsPositions=[];

        for(var i=0;i<2;i++)
            modelsPositions.push(new BABYLON.Vector3((Math.random() * (80 +90) - 90), 0, (Math.random() * (210 -130) + 130)));
        for(var i=0;i<2;i++)
            modelsPositions.push(new BABYLON.Vector3((Math.random() * (80 +90) - 90), 0, (Math.random() * (-100 +180) - 180)));
        for(var i=0;i<2;i++)
            modelsPositions.push(new BABYLON.Vector3((Math.random() * (190 -110) + 110), 0, (Math.random() * (100 -80) + 80)));
        for(var i=0;i<2;i++)
            modelsPositions.push(new BABYLON.Vector3((Math.random() * (-110 +200) - 200), 0, (Math.random() * (100 -80) + 80)));
        rocks1 = createModel("rocks1.babylon", null,null,modelsPositions, 1.5, 1, 1.5, 8);
        modelsPositions=[];
        for(var i=0;i<2;i++)
            modelsPositions.push(new BABYLON.Vector3((Math.random() * (80 +90) - 90), 0, (Math.random() * (210 -130) + 130)));
        for(var i=0;i<2;i++)
            modelsPositions.push(new BABYLON.Vector3((Math.random() * (80 +90) - 90), 0, (Math.random() * (-100 +180) - 180)));
        for(var i=0;i<2;i++)
            modelsPositions.push(new BABYLON.Vector3((Math.random() * (190 -110) + 110), 0, (Math.random() * (100 -80) + 80)));
        for(var i=0;i<2;i++)
            modelsPositions.push(new BABYLON.Vector3((Math.random() * (-110 +200) - 200), 0, (Math.random() * (100 -80) + 80)));
        rocks2 = createModel("rocks2.babylon", null,null,modelsPositions, 1.5, 1, 1.5, 8);
        modelsPositions=[];
        for(var i=0;i<10;i++)
            modelsPositions.push(new BABYLON.Vector3((Math.random() * (200 +200) - 200), 0, (Math.random() * (200 +200) - 200)));
        plant = createModel("plant.babylon", "grass material", "images/Arch42_055_leaf.jpg",modelsPositions, 2, 2, 2, 20);

    }

    function createFogScene() {
        canvas = document.getElementById("renderCanvas");
        engine = new BABYLON.Engine(canvas, true);
        scene = new BABYLON.Scene(engine);
        engine.isPointerLock = true;
        engine.enableOfflineSupport = false;
        scene.fogMode = BABYLON.Scene.FOGMODE_EXP;
        scene.fogDensity = 0.01;
        scene.enablePhysics(new BABYLON.Vector3(0, -10, 0), new BABYLON.CannonJSPlugin());
        createAssetsManager();
        loadSounds();
        light = createLight(1);
        var skybox = createSkybox("images/skybox/skybox/skybox", true);
        for(var i=0;i<n;i++) {
            createTank(tankNames[i], i);
        }
        designFogMap();
        waitForIt();
    }
    function designFogMap(){
        var terrainMaterial = new BABYLON.TerrainMaterial("terrainMaterial", scene);
        terrainMaterial.mixTexture = new BABYLON.Texture("images/mixMap.png", scene);
        terrainMaterial.diffuseTexture1 = new BABYLON.Texture("images/mountain.png", scene);
        terrainMaterial.diffuseTexture2 = new BABYLON.Texture("images/grass3.png", scene);
        terrainMaterial.diffuseTexture3 = new BABYLON.Texture("images/sand1.png", scene);
        terrainMaterial.diffuseTexture1.uScale = terrainMaterial.diffuseTexture1.vScale = 10;
        terrainMaterial.diffuseTexture2.uScale = terrainMaterial.diffuseTexture2.vScale = 10;
        terrainMaterial.diffuseTexture3.uScale = terrainMaterial.diffuseTexture3.vScale = 10;
        ground = new BABYLON.Mesh.CreateGroundFromHeightMap("ground", "images/myHeightMap1.png", 500, 500, 50, 0, 30, scene, false, onGroundCreated);
        function onGroundCreated() {
            ground.material = terrainMaterial;
            ground.checkCollisions = true;
        }
        for(var i=0;i<10;i++)
            modelsPositions.push(new BABYLON.Vector3((Math.random() * (60 +70) - 70), 0, (Math.random() * (100 +60) - 60)));
        for(var i=10;i<12;i++)
            modelsPositions.push(new BABYLON.Vector3((Math.random() * (-110 +160) - 160), 0, (Math.random() * (-100 +160) - 160)));
        for(var i=12;i<14;i++)
            modelsPositions.push(new BABYLON.Vector3((Math.random() * (140 -60) + 60), 0, (Math.random() * (-110 +160) - 160)));
        for(var i=14;i<16;i++)
            modelsPositions.push(new BABYLON.Vector3((Math.random() * (160 -120) + 120), 0, (Math.random() * (190 -130) + 130)));
        for(var i=16;i<18;i++)
            modelsPositions.push(new BABYLON.Vector3((Math.random() * (-120 +170) - 170), 0, (Math.random() * (190 -150) + 150)));
        //(Math.random() * (60 -70) + 70);
        deadTree1 = createModel("deadTree1.babylon",  null,null,modelsPositions, 5, 5, 5, 18);
        modelsPositions= [];
        for(var i=0;i<10;i++)
            modelsPositions.push(new BABYLON.Vector3((Math.random() * (60 +70) - 70), 0, (Math.random() * (100 +60) - 60)));
        for(var i=10;i<12;i++)
            modelsPositions.push(new BABYLON.Vector3((Math.random() * (-110 +160) - 160), 0, (Math.random() * (-100 +160) - 160)));
        for(var i=12;i<14;i++)
            modelsPositions.push(new BABYLON.Vector3((Math.random() * (140 -60) + 60), 0, (Math.random() * (-110 +160) - 160)));
        for(var i=14;i<16;i++)
            modelsPositions.push(new BABYLON.Vector3((Math.random() * (160 -120) + 120), 0, (Math.random() * (190 -130) + 130)));
        for(var i=16;i<18;i++)
            modelsPositions.push(new BABYLON.Vector3((Math.random() * (-120 +170) - 170), 0, (Math.random() * (190 -150) + 150)));
        //(Math.random() * (60 -70) + 70);
        deadTree2 = createModel("deadTree2.babylon",  null,null,modelsPositions, 5, 5, 5, 18);
        modelsPositions= [];
        for(var i=0;i<10;i++)
            modelsPositions.push(new BABYLON.Vector3((Math.random() * (60 +70) - 70), 0, (Math.random() * (100 +60) - 60)));
        for(var i=10;i<12;i++)
            modelsPositions.push(new BABYLON.Vector3((Math.random() * (-110 +160) - 160), 0, (Math.random() * (-100 +160) - 160)));
        for(var i=12;i<14;i++)
            modelsPositions.push(new BABYLON.Vector3((Math.random() * (140 -60) + 60), 0, (Math.random() * (-110 +160) - 160)));
        for(var i=14;i<16;i++)
            modelsPositions.push(new BABYLON.Vector3((Math.random() * (160 -120) + 120), 0, (Math.random() * (190 -130) + 130)));
        for(var i=16;i<18;i++)
            modelsPositions.push(new BABYLON.Vector3((Math.random() * (-120 +170) - 170), 0, (Math.random() * (190 -150) + 150)));
        //(Math.random() * (60 -70) + 70);
        deadTree3 = createModel("deadTree3.babylon",  null,null,modelsPositions, 5, 5, 5, 18);
        modelsPositions= [];
        for(var i=0;i<10;i++)
            modelsPositions.push(new BABYLON.Vector3((Math.random() * (60 +70) - 70), 0, (Math.random() * (100 +60) - 60)));
        for(var i=10;i<12;i++)
            modelsPositions.push(new BABYLON.Vector3((Math.random() * (-110 +160) - 160), 0, (Math.random() * (-100 +160) - 160)));
        for(var i=12;i<14;i++)
            modelsPositions.push(new BABYLON.Vector3((Math.random() * (140 -60) + 60), 0, (Math.random() * (-110 +160) - 160)));
        for(var i=14;i<16;i++)
            modelsPositions.push(new BABYLON.Vector3((Math.random() * (160 -120) + 120), 0, (Math.random() * (190 -130) + 130)));
        for(var i=16;i<18;i++)
            modelsPositions.push(new BABYLON.Vector3((Math.random() * (-120 +170) - 170), 0, (Math.random() * (190 -150) + 150)));
        //(Math.random() * (60 -70) + 70);
        deadTree4 = createModel("deadTree4.babylon",  null,null,modelsPositions, 5, 5, 5, 18);
        modelsPositions= [];
        for(var i=0;i<10;i++)
            modelsPositions.push(new BABYLON.Vector3((Math.random() * (60 +70) - 70), 0, (Math.random() * (100 +60) - 60)));
        for(var i=10;i<12;i++)
            modelsPositions.push(new BABYLON.Vector3((Math.random() * (-110 +160) - 160), 0, (Math.random() * (-100 +160) - 160)));
        for(var i=12;i<14;i++)
            modelsPositions.push(new BABYLON.Vector3((Math.random() * (140 -60) + 60), 0, (Math.random() * (-110 +160) - 160)));
        for(var i=14;i<16;i++)
            modelsPositions.push(new BABYLON.Vector3((Math.random() * (160 -120) + 120), 0, (Math.random() * (190 -130) + 130)));
        for(var i=16;i<18;i++)
            modelsPositions.push(new BABYLON.Vector3((Math.random() * (-120 +170) - 170), 0, (Math.random() * (190 -150) + 150)));
        //(Math.random() * (60 -70) + 70);
        deadTree5 = createModel("deadTree5.babylon", null,null,modelsPositions, 5, 5, 5, 18);
        modelsPositions= [];

        for(var i=0;i<500;i++)
            modelsPositions.push(new BABYLON.Vector3((Math.random() * (60 +70) - 70), 0, (Math.random() * (100 +60) - 60)));
        for(var i=500;i<700;i++)
            modelsPositions.push(new BABYLON.Vector3((Math.random() * (-110 +160) - 160), 0, (Math.random() * (-100 +160) - 160)));
        for(var i=700;i<900;i++)
            modelsPositions.push(new BABYLON.Vector3((Math.random() * (140 -60) + 60), 0, (Math.random() * (-110 +160) - 160)));
        for(var i=900;i<1100;i++)
            modelsPositions.push(new BABYLON.Vector3((Math.random() * (160 -120) + 120), 0, (Math.random() * (190 -130) + 130)));
        for(var i=1100;i<1300;i++)
            modelsPositions.push(new BABYLON.Vector3((Math.random() * (-120 +170) - 170), 0, (Math.random() * (190 -150) + 150)));
        var grass = createModel("grass.babylon", "grass material", "images/Grass2.png",modelsPositions, 1.5, 1, 1.5, 1300);
        modelsPositions=[];
        for(var i=0;i<50;i++)
            modelsPositions.push(new BABYLON.Vector3((Math.random() * (200 +200) - 200), 0, (Math.random() * (200 +200) - 200)));
        cow = createModel("cow.babylon", null,null,modelsPositions, 1.5, 1, 1.5, 50);
        modelsPositions=[];

        for(var i=0;i<10;i++)
            modelsPositions.push(new BABYLON.Vector3((Math.random() * (200 +200) - 200), 0, (Math.random() * (200 +200) - 200)));
        rocks1 = createModel("rocks1.babylon", null,null,modelsPositions, 1.5, 1, 1.5, 10);
        modelsPositions=[];
        for(var i=0;i<10;i++)
            modelsPositions.push(new BABYLON.Vector3((Math.random() * (200 +200) - 200), 0, (Math.random() * (200 +200) - 200)));
        rocks2 = createModel("rocks2.babylon", null,null,modelsPositions, 1.5, 1, 1.5, 10);
        modelsPositions=[];
    }

    function createSnowScene() {
        canvas = document.getElementById("renderCanvas");
        engine = new BABYLON.Engine(canvas, true);
        scene = new BABYLON.Scene(engine);
        engine.isPointerLock = true;
        engine.enableOfflineSupport = false;
        scene.fogMode = BABYLON.Scene.FOGMODE_EXP;
        scene.fogDensity = 0.005;
        scene.fogColor = new BABYLON.Color3(.9,.85,.85);
        scene.enablePhysics(new BABYLON.Vector3(0, -10, 0), new BABYLON.CannonJSPlugin());
        createAssetsManager();
        loadSounds();
        light = createLight(2);
        var skybox = createSkybox("images/skybox/IceRiver/IceRiver", false);
        for(var i=0;i<n;i++) {
            createTank(tankNames[i], i);
        }
        designSnowMap();
        waitForIt();
    }
    function designSnowMap(){
        var terrainMaterial = new BABYLON.TerrainMaterial("terrainMaterial", scene);
        terrainMaterial.mixTexture = new BABYLON.Texture("images/mixMap.png", scene);
        terrainMaterial.diffuseTexture1 = new BABYLON.Texture("images/snowMountain.jpg", scene);
        terrainMaterial.diffuseTexture2 = new BABYLON.Texture("images/SnowTexture2.jpg", scene);
        terrainMaterial.diffuseTexture3 = new BABYLON.Texture("images/SnowTexture.jpg", scene);
        terrainMaterial.diffuseTexture1.uScale = terrainMaterial.diffuseTexture1.vScale = 10;
        terrainMaterial.diffuseTexture2.uScale = terrainMaterial.diffuseTexture2.vScale = 10;
        terrainMaterial.diffuseTexture3.uScale = terrainMaterial.diffuseTexture3.vScale = 10;
        ground = new BABYLON.Mesh.CreateGroundFromHeightMap("ground", "images/myHeightMap1.png", 500, 500, 50, 0, 30, scene, false, onGroundCreated);
        function onGroundCreated() {
            ground.material = terrainMaterial;
            ground.checkCollisions = true;
        }
        for(var i=0;i<10;i++)
            modelsPositions.push(new BABYLON.Vector3((Math.random() * (200 +200) - 200), 0, (Math.random() * (200 +200) - 200)));
        snowMan = createModel("snowman.babylon", null,null,modelsPositions, 2, 2, 2, 10);
        modelsPositions=[];
        for(var i=0;i<10;i++)
            modelsPositions.push(new BABYLON.Vector3((Math.random() * (200 +200) - 200), 0, (Math.random() * (200 +200) - 200)));
        snowTree1 = createModel("snowTree1.babylon", "tree material","images/SnowTexture.jpg",modelsPositions, 2, 2, 2, 10);
        snowTreeLeaf1 = createModel("snowTreeLeaf1.babylon", "tree material","images/SnowTexture.jpg",modelsPositions, 2, 2, 2, 10);
        modelsPositions=[];
        for(var i=0;i<10;i++)
            modelsPositions.push(new BABYLON.Vector3((Math.random() * (200 +200) - 200), 0, (Math.random() * (200 +200) - 200)));
        modelsPositions=[];

    }

    function createForestScene() {
        canvas = document.getElementById("renderCanvas");
        engine = new BABYLON.Engine(canvas, true);
        scene = new BABYLON.Scene(engine);
        engine.isPointerLock = true;
        engine.enableOfflineSupport = false;
        scene.enablePhysics(new BABYLON.Vector3(0, -10, 0), new BABYLON.CannonJSPlugin());
        createAssetsManager();
        loadSounds();
        light = createLight();
        var skybox = createSkybox("images/skybox/TropicalSunnyDay/TropicalSunnyDay");
        for(var i=0;i<n;i++) {
            createTank(tankNames[i], i);
        }
        designForestScene();
        waitForIt();
    }
    function designForestScene(){
        var terrainMaterial = new BABYLON.TerrainMaterial("terrainMaterial", scene);
        terrainMaterial.mixTexture = new BABYLON.Texture("images/mixMap.png", scene);
        terrainMaterial.diffuseTexture1 = new BABYLON.Texture("images/rock2.jpg", scene);
        terrainMaterial.diffuseTexture2 = new BABYLON.Texture("images/grass.png", scene);
        terrainMaterial.diffuseTexture3 = new BABYLON.Texture("images/grass.png", scene);
        terrainMaterial.diffuseTexture1.uScale = terrainMaterial.diffuseTexture1.vScale = 10;
        terrainMaterial.diffuseTexture2.uScale = terrainMaterial.diffuseTexture2.vScale = 10;
        terrainMaterial.diffuseTexture3.uScale = terrainMaterial.diffuseTexture3.vScale = 10;
        ground = new BABYLON.Mesh.CreateGroundFromHeightMap("ground", "images/myHeightMap1.png", 500, 500, 50, 0, 30, scene, false, onGroundCreated);
        function onGroundCreated() {
            ground.material = terrainMaterial;
            ground.checkCollisions = true;
        }

        for(var i=0;i<200;i++)
            modelsPositions.push(new BABYLON.Vector3((Math.random() * (200 +200) - 200), 0, (Math.random() * (200 +200) - 200)));
        tree = createModel("tree1.babylon", "tree material","images/tree1.jpg",modelsPositions, 1, 1, 1, 200);
        treeLeaf = createModel("treeLeaf1.babylon", "tree material","images/tree1.png",modelsPositions, 1, 1, 1, 200);
        modelsPositions=[];
        for(var i=0;i<200;i++)
            modelsPositions.push(new BABYLON.Vector3((Math.random() * (200 +200) - 200), 0, (Math.random() * (200 +200) - 200)));
        tree2 = createModel("tree3.babylon", "tree material","images/tree1.jpg",modelsPositions, 1, 1, 1, 200);
        treeLeaf2 = createModel("treeLeaf3.babylon", "tree material","images/tree1.png",modelsPositions, 1, 1, 1, 200);
        modelsPositions=[];


    }

    function waitForIt() {
        if(onGame) {
            loadAssetsManager();

            followCamera = createFollowCamera(currentTank);
            scene.activeCamera = followCamera;
            scene.collisionsEnabled = true;

            followCamera.attachControl(canvas);
            followCamera.applyGravity = true;
            followCamera.ellipsoid = new BABYLON.Vector3(1, 1, 1);
            followCamera.checkCollisions = true;
            generatePowerUp(generatedBullets ,generatedBulletsMaterial,powerupTaken1, 1 ,3);
            generatePowerUp(generatedDoubleDamage ,generatedDoubleDamageMaterial,powerupTaken2, 2 ,3);
            generatePowerUp(generatedExtraDistance ,generatedExtraDistanceMaterial,powerupTaken3, 3 ,3);
            generatePowerUp(generatedHealth ,generatedHealthMaterial,powerupTaken4, 4 ,3);
            assetsManager.onFinish = function (tasks) {
                HUD();
                engine.runRenderLoop(function () {
                        if(gameOver == 0) {
                            scene.render();
                            if(tank.length===n) {
                                generatedBullets.forEach(function (powerup) {
                                    tank[currentTank].bounder.actionManager.registerAction(new BABYLON.ExecuteCodeAction({
                                        trigger: BABYLON.ActionManager.OnIntersectionEnterTrigger,
                                        parameter: {mesh: powerup}
                                    }, function () {
                                        if(!powerupTaken1[powerup.id]) {
                                            powerupTaken1[powerup.id] = true;
                                            powerup.visibility = false;
                                            tankBullets[currentTank] += 2;
                                            powerups.play();

                                            document.getElementById("powerupText").innerHTML = "+2 BULLETS";
                                            $('#powerupText').fadeIn(1000);
                                            $('#powerupText').fadeOut(800);

                                        }
                                    }));
                                });
                                generatedHealth.forEach(function (powerup) {
                                    tank[currentTank].bounder.actionManager.registerAction(new BABYLON.ExecuteCodeAction({
                                        trigger: BABYLON.ActionManager.OnIntersectionEnterTrigger,
                                        parameter: {mesh: powerup}
                                    }, function () {
                                        if(!powerupTaken2[powerup.id]) {
                                            powerupTaken2[powerup.id] = true;
                                            powerup.visibility = false;
                                            powerups.play();

                                            document.getElementById("powerupText").innerHTML = "+20 HEALTH";
                                            $('#powerupText').fadeIn(1000);
                                            $('#powerupText').fadeOut(800);

                                            if(healthPercentage[currentTank]<100) {
                                                damage = -20;
                                                updateHealthBar(currentTank);
                                            }
                                            if(healthPercentage[currentTank]>100)
                                                healthPercentage[currentTank]=100
                                        }
                                    }));
                                });
                                generatedExtraDistance.forEach(function (powerup) {
                                    tank[currentTank].bounder.actionManager.registerAction(new BABYLON.ExecuteCodeAction({
                                        trigger: BABYLON.ActionManager.OnIntersectionEnterTrigger,
                                        parameter: {mesh: powerup}
                                    }, function () {
                                        if(!powerupTaken3[powerup.id]) {
                                            powerupTaken3[powerup.id] = true;
                                            powerup.visibility = false;
                                            powerups.play();

                                            document.getElementById("powerupText").innerHTML = "+75m +5s";
                                            $('#powerupText').fadeIn(1000);
                                            $('#powerupText').fadeOut(800);

                                            movementLimit += 75;
                                            turnTimer += 5;
                                        }
                                    }));
                                });
                                generatedDoubleDamage.forEach(function (powerup) {
                                    tank[currentTank].bounder.actionManager.registerAction(new BABYLON.ExecuteCodeAction({
                                        trigger: BABYLON.ActionManager.OnIntersectionEnterTrigger,
                                        parameter: {mesh: powerup}
                                    }, function () {
                                        if(!powerupTaken4[powerup.id]) {
                                            powerupTaken4[powerup.id] = true;
                                            powerup.visibility = false;
                                            powerups.play();

                                            document.getElementById("powerupText").innerHTML = "DOUBLE DAMAGE";
                                            $('#powerupText').fadeIn(1000);
                                            $('#powerupText').fadeOut(800);

                                            damage=40;
                                        }
                                    }));
                                });
                            }
                            if(bullet) {
                                bullet.position.z += (Math.sin(bullet.rotation.y) * bullet.speed);
                                bullet.position.x -= Math.cos(bullet.rotation.y) * bullet.speed;
                            }
                            if(direction&&bullet){
                                direction.x -= Math.cos(bullet.rotation.y) * bullet.speed;
                                direction.z += Math.sin(bullet.rotation.y) * bullet.speed;
                            }
                            if (!followCamera.lockedTarget&&cameraLocked) {
                                cameraLocked=false;
                                followCamera.lockedTarget = tank[currentTank];
                            }
                            for(var i=0;i<generatedBullets.length;i++)
                                generatedBullets[i].rotation.y += 0.05;
                            for(var j=0;j<generatedDoubleDamage.length;j++)
                                generatedDoubleDamage[j].rotation.y += 0.05;
                            for(var k=0;k<generatedExtraDistance.length;k++)
                                generatedExtraDistance[k].rotation.y += 0.05;
                            for(var l=0;l<generatedHealth.length;l++)
                                generatedHealth[l].rotation.y += 0.05;
                            if (movementLimit <= 0)
                                dontMove=true;

                            applyTankMovements();
                            checkGameOver();
                        }
                        else {
                            GameOver();
                            var musicPlayer = document.getElementById("musicPlayer");
                            musicPlayer.play();
                            reset();
                        }
                });
            };
        }
    }



    function createLight(flag) {
        var hemisphericlight = new BABYLON.HemisphericLight("l1", new BABYLON.Vector3(0, 5, 0), scene);
        if (flag === 1) {
            hemisphericlight.intensity = .3;
        }
        else if(flag === 2) {
            hemisphericlight.intensity = .8;
        }
        return hemisphericlight;
    }

    function createSkybox(url, infDist) {
        var skybox = BABYLON.Mesh.CreateBox("skyBox", 500, scene);
        var skyboxMaterial = new BABYLON.StandardMaterial("skyBox", scene);
        skyboxMaterial.backFaceCulling = false;
        skyboxMaterial.disableLighting = true;
        skybox.material = skyboxMaterial;
        skybox.infiniteDistance = infDist;
        skyboxMaterial.disableLighting = true;
        var skyBoxTextureTask = assetsManager.addCubeTextureTask("skybox texture task", url);
        skyBoxTextureTask.onSuccess = function (task) {
            skyboxMaterial.reflectionTexture = task.texture;
            skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
        }
        return skybox;
    }

    function createFollowCamera(tankID) {
        var camera = new BABYLON.FollowCamera("follow", new BABYLON.Vector3(0, 2, -20), scene);
        camera.lockedTarget = tank[tankID];
        camera.radius = 15; // how far from the object to follow
        camera.heightOffset = 3; // how high above the object to place the camera
        camera.rotationOffset = 0; // the viewing angle
        camera.cameraAcceleration = 0.015 // how fast to move
        camera.maxCameraSpeed = 20 // speed limit
        return camera;
    }



    function createTank(textureName,i) {
        var tankTask = assetsManager.addMeshTask("tank task", "", "GameObjects/", "tanks.babylon");
        tankTask.onSuccess = function (task) {
            var _tank;
            var newMeshes = task.loadedMeshes;
            var tankParent = BABYLON.Mesh.CreateBox("tank", 1, scene);
            tankParent.material = new BABYLON.StandardMaterial("alpha", scene);
            tankParent.material.alpha = 0;
            tankParent.checkCollisions=true;
            for(var j=0;j<newMeshes.length;j++)
                newMeshes[j].parent=tankParent;
            _tank = tankParent;
            var modelMaterial = new BABYLON.StandardMaterial("tankMaterial", scene);
            modelMaterial.diffuseTexture = new BABYLON.Texture(textureName, scene);
            modelMaterial.backFaceCulling=false;
            modelMaterial.diffuseTexture.hasAlpha=true;
            for(var j=0;j< _tank._children.length;j++)
                _tank._children[j].material = modelMaterial;
            _tank.checkCollisions = true;
            _tank.ellipsoid = new BABYLON.Vector3(1.5, 1, 1.5);
            _tank.ellipsoidOffset = new BABYLON.Vector3(0, 2, 0);
            _tank.applyGravity = true;
            _tank.frontVector = new BABYLON.Vector3(0, 0, -1);
            _tank.rotationSensitivity = .1;
            tankBullets[i] = 5;
            //shadowGenerator.getShadowMap().renderList.push(_tank);

            /*for(var j=0;j<_tank._children.length;j++){
                _tank._children[j].name+="_"+i;
            }*/
            tank.push(_tank);

            var boundingBox = calculateAndMakeBoundingBoxOfCompositeMeshes(newMeshes, scene,i);
            _tank.bounder = boundingBox.boxMesh;
            _tank.bounder.tank = _tank;
            _tank.bounder.ellipsoidOffset.y += 3; // if I make this += 10 , no collision happens (better performance), but they merge
            // if I make it +=2 , they are visually good, but very bad performance (actually bad performance when I console.log in the onCollide)
            // if I make it += 1 , very very bad performance as it is constantly in collision with the ground
            _tank.position = _tank.bounder.position;
            _tank.bounder.actionManager = new BABYLON.ActionManager(scene);
            _tank.bounder.onCollide = function (mesh) {
                if (mesh.name == "ground") {
                    console.log("koko");
                }
            }
            isTankReady = true;
        }
    }

    function setupTanksPositions(){
        tanksPositions.push(new BABYLON.Vector3(125,0,0));
        tanksPositions.push(new BABYLON.Vector3(-125,0,0));
        tanksPositions.push(new BABYLON.Vector3(0,0,125));
        tanksPositions.push(new BABYLON.Vector3(0,0,-125));
        tanksPositions.push(new BABYLON.Vector3(125,0,125));
        tanksPositions.push(new BABYLON.Vector3(125,0,-125));
        tanksPositions.push(new BABYLON.Vector3(-125,0,125));
        tanksPositions.push(new BABYLON.Vector3(-125,0,-125));
    }

    function applyTankMovements() {
        if(onGame) {
            if (isWPressed && !dontMove) {
                tank[currentTank].moveWithCollisions(tank[currentTank].frontVector);
            }
            if (isSPressed&&!dontMove) {
                var reverseVector = tank[currentTank].frontVector.multiplyByFloats(-1, 1, -1);
                tank[currentTank].moveWithCollisions(reverseVector);
                followCamera.radius=30;

            }
            if (isDPressed) {
                tank[currentTank].rotation.y += .1 * tank[currentTank].rotationSensitivity;
                tank[currentTank].bounder.rotation.y += .1 * tank[currentTank].rotationSensitivity;
            }
            if (isAPressed) {
                tank[currentTank].rotation.y -= .1 * tank[currentTank].rotationSensitivity;
                tank[currentTank].bounder.rotation.y -= .1 * tank[currentTank].rotationSensitivity;
            }
            tank[currentTank].frontVector.x = Math.sin(tank[currentTank].rotation.y) * -0.5;
            tank[currentTank].frontVector.z = Math.cos(tank[currentTank].rotation.y) * -0.5;
            tank[currentTank].frontVector.y = -4; // adding a bit of gravity
        }
    }

    function switchTanks() {
        if(onGame) {
            if (currentTank === tank.length - 1) {
                currentTank = 0;
                if(alive[currentTank]) {
                    updatePowerUpPosition();
                    for(var i=0;i<3;i++) {
                        powerupTaken1[i] = false;
                        generatedBullets[i].visibility=true;
                    }
                    for(var j=0;j<3;j++) {
                        powerupTaken2[j] = false;
                        generatedHealth[j].visibility=true;
                    }
                    for(var k=0;k<3;k++) {
                        powerupTaken3[k] = false;
                        generatedExtraDistance[k].visibility=true;
                    }
                    for(var l=0;l<3;l++) {
                        powerupTaken4[l] = false;
                        generatedDoubleDamage[l].visibility=true;
                    }
                    damage=20;
                    hasShot=false;
                    followCamera.lockedTarget = tank[currentTank];
                    movementLimit = 150;
                    turnTimer = 15;
                    dontMove = false;
                    for(var i=0;i<tank.length;i++)
                        tank[i].bounder.isPickable = true;
                    tank[currentTank].bounder.isPickable = false;
                    tankParticlesRight.emitter = tank[currentTank];
                    tankParticlesLeft.emitter = tank[currentTank];
                    isFPressed=false;
                }
                else switchTanks();
            }
            else {
                currentTank++;
                if(alive[currentTank]) {
                    updatePowerUpPosition();
                    for(var i=0;i<3;i++) {
                        powerupTaken1[i] = false;
                        generatedBullets[i].visibility=true;
                    }
                    for(var j=0;j<3;j++) {
                        powerupTaken2[j] = false;
                        generatedHealth[j].visibility=true;
                    }
                    for(var k=0;k<3;k++) {
                        powerupTaken3[k] = false;
                        generatedExtraDistance[k].visibility=true;
                    }
                    for(var l=0;l<3;l++) {
                        powerupTaken4[l] = false;
                        generatedDoubleDamage[l].visibility=true;
                    }
                    damage=20;
                    hasShot=false;
                    followCamera.lockedTarget = tank[currentTank];
                    movementLimit = 150;
                    turnTimer = 15;
                    dontMove = false;
                    for(var i=0;i<tank.length;i++)
                        tank[i].bounder.isPickable = true;
                    tank[currentTank].bounder.isPickable = false;
                    tankParticlesRight.emitter = tank[currentTank];
                    tankParticlesLeft.emitter = tank[currentTank];
                    isFPressed=false;
                }
                else switchTanks();
            }
        }
    }

    function createTanksParticles(){
        tankParticlesRight = new BABYLON.ParticleSystem("particles", 100, scene);
        tankParticlesRight.particleTexture = new BABYLON.Texture("images/flare2.png", scene);
        tankParticlesRight.emitter = tank[currentTank]; // the starting object, the emitter
        tankParticlesRight.minEmitBox = new BABYLON.Vector3(tank[currentTank].position.x-126.5, tank[currentTank].position.y, tank[currentTank].position.z+1); // Starting all from
        tankParticlesRight.maxEmitBox = new BABYLON.Vector3(tank[currentTank].position.x-126.5, tank[currentTank].position.y, tank[currentTank].position.z+1); // To...
        tankParticlesRight.position = tank[currentTank].bounder.position;
        if(sceneNum===0||sceneNum===1) {
            tankParticlesRight.color1 = new BABYLON.Color4(0.588, 0.411, 0.223, 0.3);
            tankParticlesRight.color2 = new BABYLON.Color4(0.588, 0.411, 0.223, 0.3);
            tankParticlesRight.blendMode = BABYLON.ParticleSystem.BLENDMODE_STANDARD;
        }
        else if(sceneNum===2){
            tankParticlesRight.color1 = new BABYLON.Color4(0.1, 0.1, 0.1, 1);
            tankParticlesRight.color2 = new BABYLON.Color4(0.1, 0.1, 0.1, 1);
            tankParticlesRight.blendMode = BABYLON.ParticleSystem.BLENDMODE_ONEONE;
        }
        else if(sceneNum===3){
            tankParticlesRight.color1 = new BABYLON.Color4(0, 0.5, 0, 0.5);
            tankParticlesRight.color2 = new BABYLON.Color4(0, 0.5, 0, 0.5);
            tankParticlesRight.blendMode = BABYLON.ParticleSystem.BLENDMODE_STANDARD;
        }
        tankParticlesRight.colorDead = new BABYLON.Color4(0, 0, 0, 0.0);
        tankParticlesRight.minSize = 0.03;
        tankParticlesRight.maxSize = 0.8;
        tankParticlesRight.minLifeTime = 0.3;
        tankParticlesRight.maxLifeTime = 0.3;
        tankParticlesRight.emitRate = 30;

        tankParticlesRight.gravity = new BABYLON.Vector3(0, 0, 0);
        tankParticlesRight.direction1 = new BABYLON.Vector3(0, 0, 0);
        tankParticlesRight.direction2 = new BABYLON.Vector3(0, 0, 0);
        tankParticlesRight.minAngularSpeed = 0;
        tankParticlesRight.maxAngularSpeed = Math.PI;
        tankParticlesRight.minEmitPower = 0.5;
        tankParticlesRight.maxEmitPower = .5;
        tankParticlesRight.updateSpeed = 0.03;
        tankParticlesRight.start();

        tankParticlesLeft = new BABYLON.ParticleSystem("particles", 100, scene);
        tankParticlesLeft.particleTexture = new BABYLON.Texture("images/flare2.png", scene);
        tankParticlesLeft.emitter = tank[currentTank]; // the starting object, the emitter
        tankParticlesLeft.minEmitBox = new BABYLON.Vector3(tank[currentTank].position.x-123.5, tank[currentTank].position.y, tank[currentTank].position.z+1); // Starting all from
        tankParticlesLeft.maxEmitBox = new BABYLON.Vector3(tank[currentTank].position.x-123.5, tank[currentTank].position.y, tank[currentTank].position.z+1); // To...
        tankParticlesLeft.position = tank[currentTank].bounder.position;
        if(sceneNum===0||sceneNum===1) {
            tankParticlesLeft.color1 = new BABYLON.Color4(0.588, 0.411, 0.223, 0.3);
            tankParticlesLeft.color2 = new BABYLON.Color4(0.588, 0.411, 0.223, 0.3);
            tankParticlesLeft.blendMode = BABYLON.ParticleSystem.BLENDMODE_STANDARD;
        }
        else if(sceneNum===2){
            tankParticlesLeft.color1 = new BABYLON.Color4(0.1, 0.1, 0.1, 0.5);
            tankParticlesLeft.color2 = new BABYLON.Color4(0.1, 0.1, 0.1, 0.5);
            tankParticlesLeft.blendMode = BABYLON.ParticleSystem.BLENDMODE_ONEONE;
        }
        else if(sceneNum===3){
            tankParticlesLeft.color1 = new BABYLON.Color4(0, 0.5, 0, 0.5);
            tankParticlesLeft.color2 = new BABYLON.Color4(0, 0.5, 0, 0.5);
            tankParticlesLeft.blendMode = BABYLON.ParticleSystem.BLENDMODE_STANDARD;
        }
        tankParticlesLeft.colorDead = new BABYLON.Color4(0, 0, 0, 0.0);
        tankParticlesLeft.minSize = 0.03;
        tankParticlesLeft.maxSize = 0.8;
        tankParticlesLeft.minLifeTime = 0.3;
        tankParticlesLeft.maxLifeTime = 0.3;
        tankParticlesLeft.emitRate = 30;
        tankParticlesLeft.gravity = new BABYLON.Vector3(0, 0, 0);
        tankParticlesLeft.direction1 = new BABYLON.Vector3(0, 0, 0);
        tankParticlesLeft.direction2 = new BABYLON.Vector3(0, 0, 0);
        tankParticlesLeft.minAngularSpeed = 0;
        tankParticlesLeft.maxAngularSpeed = Math.PI;
        tankParticlesLeft.minEmitPower = 0.5;
        tankParticlesLeft.maxEmitPower = .5;
        tankParticlesLeft.updateSpeed = 0.03;
        tankParticlesLeft.start();
    }

    function createPlayerName() {
        for(var i = 0; i<tank.length; i++) {
            textPlaneTexture.push(new BABYLON.DynamicTexture("dynamic texture", 2048, scene, true));
            textPlaneTexture[i].drawText("PLAYER " + (i+1), null, 500, "bold 420px Comic Sans MS", "white", "transparent");
            textPlaneTexture[i].hasAlpha = true;

            tank[i].textPlane = BABYLON.Mesh.CreatePlane("textPlane", 1, scene, false);
            tank[i].textPlane.billboardMode = BABYLON.AbstractMesh.BILLBOARDMODE_ALL;
            tank[i].textPlane.material = new BABYLON.StandardMaterial("textPlane", scene);
            tank[i].textPlane.parent = tank[i].bounder;
            tank[i].textPlane.position.y += 0.55;
            tank[i].textPlane.material.diffuseTexture = textPlaneTexture[i];
            tank[i].textPlane.material.specularColor = new BABYLON.Color3(0,0,0);
            tank[i].textPlane.material.emissiveColor = new BABYLON.Color3(1,1,1);
            tank[i].textPlane.material.backFaceCulling = false;
        }
    }

    function createHealthBar(){
        if(tank.length===n) {
            for (var i = 0; i < tank.length; i++) {
                healthBarMaterial.push(new BABYLON.StandardMaterial("hb1mat", scene));
                healthBarMaterial[i].diffuseColor = BABYLON.Color3.Green();
                healthBarMaterial[i].backFaceCulling = false;

                healthBarContainerMaterial.push(new BABYLON.StandardMaterial("hb2mat", scene));
                healthBarContainerMaterial[i].diffuseColor = BABYLON.Color3.Red();
                healthBarContainerMaterial[i].backFaceCulling = false;

                dynamicTexture.push(new BABYLON.DynamicTexture("dt1", 512, scene, true));
                dynamicTexture[i].hasAlpha = true;


                frontHealthBar.push(BABYLON.MeshBuilder.CreatePlane("hb1", {width: .7, height: .04, subdivisions: 4}, scene));
                healthBarContainer.push(BABYLON.MeshBuilder.CreatePlane("hb2", {width: .7,height: .04,subdivisions: 4}, scene));
                frontHealthBar[i].position = new BABYLON.Vector3(0, 0, -.01);			// Move in front of container slightly.  Without this there is flickering.
                healthBarContainer[i].position = new BABYLON.Vector3(0, 0.55, 0);     // Position above player.
                frontHealthBar[i].parent = healthBarContainer[i];
                healthBarContainer[i].parent = tank[i].bounder;
                frontHealthBar[i].material = healthBarMaterial[i];
                healthBarContainer[i].material = healthBarContainerMaterial[i];

                backHealthBar.push(BABYLON.MeshBuilder.CreatePlane("hb1", {width: .7, height: .04, subdivisions: 4}, scene));
                healthBarContainer.push(BABYLON.MeshBuilder.CreatePlane("hb2", {width: .7,height: .04,subdivisions: 4}, scene));
                backHealthBar[i].position = new BABYLON.Vector3(0, 0, .01);			// Move in front of container slightly.  Without this there is flickering.
                backHealthBar[i].parent = healthBarContainer[i];
                backHealthBar[i].material = healthBarMaterial[i];
                alive.push(true);
                healthPercentage.push(100);
            }
            createPlayerName();
            healthBarReady=true;
            createTanksParticles();
        }
        else{setTimeout(function () {
            createHealthBar();
        }, 300);}
    }

    function updateHealthBar(tankID){
        if(healthBarReady) {
            if (alive[tankID]) {
                if(frontHealthBar[tankID].scaling.x>0){
                    healthPercentage[tankID] -= damage;
                    frontHealthBar[tankID].scaling.x = healthPercentage[tankID] / 100;
                    backHealthBar[tankID].scaling.x = healthPercentage[tankID] / 100;
                    frontHealthBar[tankID].position.x =  (1- (healthPercentage[tankID] / 100)) * -0.35;
                    backHealthBar[tankID].position.x =  (1- (healthPercentage[tankID] / 100)) * -0.35;
                }
                if (frontHealthBar[tankID].scaling.x <= 0) {
                    destroyTank(tankID);
                    alive[tankID] = false;
                }
                else if (frontHealthBar[tankID].scaling.x < .5) {
                    healthBarMaterial[tankID].diffuseColor = BABYLON.Color3.Yellow();
                }
                else if(frontHealthBar[tankID].scaling.x >= .5)
                    healthBarMaterial[tankID].diffuseColor = BABYLON.Color3.Green();
            }
        }
        else{setTimeout(function () {
            updateHealthBar(tankID);
        }, 300);}
    }

    function createBustedTank(tankID) {
        BABYLON.SceneLoader.ImportMesh("", "GameObjects/", "bustedTank1.babylon", scene, onSuccess);
        function onSuccess(newMeshes, particles, skeletons) {
            var tankParent = BABYLON.Mesh.CreateBox("tank", 1, scene);
            tankParent.material = new BABYLON.StandardMaterial("alpha", scene);
            tankParent.material.alpha = 0;
            tankParent.checkCollisions=true;
            for(var j=0;j<newMeshes.length;j++)
                newMeshes[j].parent=tankParent;
            bustedTank[tankID]=tankParent;
            bustedTank[tankID].position = tank[tankID].position;
            bustedTank[tankID].checkCollisions = true;
            bustedTank[tankID].ellipsoid = new BABYLON.Vector3(1, 1, 1);
            bustedTank[tankID].ellipsoidOffset = new BABYLON.Vector3(0, 2, 0);
            bustedTank[tankID].applyGravity = true;
            var modelMaterial = new BABYLON.StandardMaterial("tankMaterial", scene);
            modelMaterial.diffuseTexture = new BABYLON.Texture("images/bustedTank.jpg", scene);
            modelMaterial.backFaceCulling=false;
            modelMaterial.diffuseTexture.hasAlpha=true;
            for(var j=0;j< bustedTank[tankID]._children.length;j++)
                bustedTank[tankID]._children[j].material = modelMaterial;
        }
    }

    function destroyTank(tankID) {
        tank[tankID].bounder.isPickable=false;
        createBustedTank(tankID);
        createFire(tankID);
        tank[tankID].dispose();
        healthBarContainer[tankID].dispose();
        healthBarMaterial[tankID].dispose();

        EngineDriving.stop();
        EngineIdle.stop();
        TankExplosion.play();
    }



    function createBullet(){
        bullet = BABYLON.Mesh.CreateSphere('bullet', 3, 3, this.scene);
        bullet.isVisible=false;
        bullet.actionManager = new BABYLON.ActionManager(scene);
        bulletSmoke = new BABYLON.ParticleSystem("particles", 100, scene);
        bulletSmoke.particleTexture = new BABYLON.Texture("images/flare.png", scene);
        bulletSmoke.emitter = bullet; // the starting object, the emitter
        bulletSmoke.minEmitBox = new BABYLON.Vector3(bullet.position.x, bullet.position.y, bullet.position.z); // Starting all from
        bulletSmoke.maxEmitBox = new BABYLON.Vector3(bullet.position.x, bullet.position.y, bullet.position.z); // To...
        //smokeSystem.minEmitBox =  bustedTank[tankID].position;
        //smokeSystem.maxEmitBox = bustedTank[tankID].position;
        bulletSmoke.position=bullet;
        bulletSmoke.color1 = new BABYLON.Color4(0.1, 0.1, 0.1, 1.0);
        bulletSmoke.color2 = new BABYLON.Color4(0.1, 0.1, 0.1, 1.0);
        bulletSmoke.colorDead = new BABYLON.Color4(0, 0, 0, 0.0);
        bulletSmoke.minSize = 0.03;
        bulletSmoke.maxSize = 1;
        bulletSmoke.minLifeTime = 0.3;
        bulletSmoke.maxLifeTime = 1;
        bulletSmoke.emitRate = 300;
        // Blend mode : BLENDMODE_ONEONE, or BLENDMODE_STANDARD
        bulletSmoke.blendMode = BABYLON.ParticleSystem.BLENDMODE_ONEONE;
        bulletSmoke.gravity = new BABYLON.Vector3(0, 0, 0);
        bulletSmoke.direction1 = new BABYLON.Vector3(-1.5, 8, -1.5);
        bulletSmoke.direction2 = new BABYLON.Vector3(1.5, 8, 1.5);
        bulletSmoke.minAngularSpeed = 0;
        bulletSmoke.maxAngularSpeed = Math.PI;
        bulletSmoke.minEmitPower = 0.5;
        bulletSmoke.maxEmitPower = 1.5;
        bulletSmoke.updateSpeed = 0.01;

        bulletFire = new BABYLON.ParticleSystem("particles", 100, scene);
        //Texture of each particle
        bulletFire.particleTexture = new BABYLON.Texture("images/flare.png", scene);
        // Where the particles come from
        bulletFire.emitter = bullet; // the starting object, the emitter
        bulletFire.minEmitBox = new BABYLON.Vector3(bullet.position.x, bullet.position.y, bullet.position.z); // Starting all from
        bulletFire.maxEmitBox = new BABYLON.Vector3(bullet.position.x, bullet.position.y, bullet.position.z); // To...
        //fireSystem.minEmitBox =  bustedTank[tankID].position;
        //fireSystem.maxEmitBox = bustedTank[tankID].position;
        // Colors of all particles
        bulletFire.color1 = new BABYLON.Color4(1, 0.5, 0, 1.0);
        bulletFire.color2 = new BABYLON.Color4(1, 0.5, 0, 1.0);
        bulletFire.colorDead = new BABYLON.Color4(0, 0, 0, 0.0);
        // Size of each particle (random between...
        bulletFire.minSize = 0.1;
        bulletFire.maxSize = 1;
        // Life time of each particle (random between...
        bulletFire.minLifeTime = 0.2;
        bulletFire.maxLifeTime = 0.5;
        // Emission rate
        bulletFire.emitRate = 500;
        // Blend mode : BLENDMODE_ONEONE, or BLENDMODE_STANDARD
        bulletFire.blendMode = BABYLON.ParticleSystem.BLENDMODE_ONEONE;
        // Set the gravity of all particles
        bulletFire.gravity = new BABYLON.Vector3(0, 0, 0);
        // Direction of each particle after it has been emitted
        bulletFire.direction1 = new BABYLON.Vector3(0, 4, 0);
        bulletFire.direction2 = new BABYLON.Vector3(0, 4, 0);
        // Angular speed, in radians
        bulletFire.minAngularSpeed = 0;
        bulletFire.maxAngularSpeed = Math.PI;
        // Speed
        bulletFire.minEmitPower = 1;
        bulletFire.maxEmitPower = 2;
        bulletFire.updateSpeed = 0.05;
        // Start the particle system
        setTimeout(function () {
            bullet.isVisible=true;
            bulletFire.start();
            bulletSmoke.start();
        }, 50);
        bullet.scaling.y/=6;
        bullet.scaling.z/=6;
        bullet.scaling.x/=2;
        bullet.position = new BABYLON.Vector3(tank[currentTank].position.x,tank[currentTank].position.y+1.5,tank[currentTank].position.z);
        bullet.rotation = tank[currentTank].rotation.clone();
        bullet.rotation.y-=Math.PI/2;
        // bullet.position.y+=1.5;
        bullet.speed = 2;
        bullet.material = new BABYLON.StandardMaterial('texture1', scene);
        bullet.material.diffuseColor = new BABYLON.Color3(.64, .82, .59);
        setTimeout(function () {
            if(!bulletExploded)
                createExplosion(bullet.position.x, bullet.position.y, bullet.position.z);
            bulletExploded=false;
            bullet.dispose();
        }, 2000);
    }

    function generatePowerUp(powerup,powerupMaterial,taken,modelName,num){
        for(var i=0;i<num;i++){
            powerup[i] = BABYLON.Mesh.CreateBox("bullet", 1.5, scene);
            powerup[i].position = new BABYLON.Vector3((Math.random() * (200 + 200) - 200),1,(Math.random() * (200 + 200) - 200));
            powerup[i].checkCollisions = false;
            powerupMaterial= new BABYLON.StandardMaterial("alpha", scene);
            powerupMaterial.diffuseTexture = new BABYLON.Texture("images/box.png", scene);
            taken[i]=false;
            powerupMaterial.alpha = 1;
            powerup[i].material=powerupMaterial;
            powerup[i].visibility = true;
            powerup[i].isPickable=true;
            powerup[i].id = i;
        }
    }

    function updatePowerUpPosition(){
        for(var i=0;i<generatedBullets.length;i++){
            generatedBullets[i].position = new BABYLON.Vector3((Math.random() * (200 + 200) - 200),1,(Math.random() * (200 + 200) - 200));
        }
        for(var i=0;i<generatedExtraDistance.length;i++){
            generatedExtraDistance[i].position = new BABYLON.Vector3((Math.random() * (200 + 200) - 200),1,(Math.random() * (200 + 200) - 200));
        }
        for(var i=0;i<generatedDoubleDamage.length;i++){
            generatedDoubleDamage[i].position = new BABYLON.Vector3((Math.random() * (200 + 200) - 200),1,(Math.random() * (200 + 200) - 200));
        }
        for(var i=0;i<generatedHealth.length;i++){
            generatedHealth[i].position = new BABYLON.Vector3((Math.random() * (200 + 200) - 200),1,(Math.random() * (200 + 200) - 200));
        }
    }

    function createExplosion(x,y,z){
        if(bullet) {
            var fireSystem = new BABYLON.ParticleSystem("particles", 2000, scene);
            fireSystem.particleTexture = new BABYLON.Texture("images/flare.png", scene);
            fireSystem.emitter = ground;
            fireSystem.minEmitBox = new BABYLON.Vector3(x-1,y+2, z); // Starting all from
            fireSystem.maxEmitBox = new BABYLON.Vector3(x+1,y+2, z+1); // To...
            fireSystem.color1 = new BABYLON.Color4(1, 1, 0, 1.0);
            fireSystem.color2 = new BABYLON.Color4(1, 0, 0, 1.0);
            fireSystem.colorDead = new BABYLON.Color4(0, 0, 0, 0.0);
            fireSystem.minSize = 0.3;
            fireSystem.maxSize = 3;
            fireSystem.minLifeTime = 0.2;
            fireSystem.maxLifeTime = 0.4;
            fireSystem.emitRate = 5000;
            fireSystem.blendMode = BABYLON.ParticleSystem.BLENDMODE_ONEONE;
            fireSystem.gravity = new BABYLON.Vector3(0, 0, 0);
            fireSystem.direction1 = new BABYLON.Vector3(0, 4, 0);
            fireSystem.direction2 = new BABYLON.Vector3(0, 4, 0);
            fireSystem.minAngularSpeed = 0;
            fireSystem.maxAngularSpeed = 2*Math.PI;
            fireSystem.minEmitPower = 1;
            fireSystem.maxEmitPower = 3;
            fireSystem.updateSpeed = 0.01;
            fireSystem.start();
            BulletExplosion.play();
            setTimeout(function () {
                fireSystem.stop();
            }, 200);
        }
        else{
            setTimeout(function () {
                createExplosion();
            }, 500);
        }
    }

    function fire(){
        if(!hasShot&&tankBullets[currentTank]>0) {
            createBullet();
            bulletSound.play();
            tankBullets[currentTank]--;
            hasShot=true;
            models.forEach(function(model1){
                bullet.actionManager.registerAction(new BABYLON.ExecuteCodeAction({
                    trigger: BABYLON.ActionManager.OnIntersectionEnterTrigger,
                    parameter: {mesh: model1}
                }, function () {
                    if(!bulletExploded) {
                        bulletExploded=true;
                        createExplosion(model1.position.x, model1.position.y, model1.position.z);
                        bullet.visibility = false;
                        bulletFire.stop();
                        bulletSmoke.stop();
                    }
                }));
            });
            tank.forEach(function (tank1) {
                bullet.actionManager.registerAction(new BABYLON.ExecuteCodeAction({
                    trigger: BABYLON.ActionManager.OnIntersectionEnterTrigger,
                    parameter: {mesh: tank1.bounder}
                }, function () {
                    if(!bulletExploded) {
                        var tankID = parseInt(tank1.bounder.name[tank1.bounder.name.length - 1]);
                        if (tankID !== currentTank) {
                            bulletExploded=true;
                            createExplosion(tank1.position.x, tank1.position.y, tank1.position.z);
                            updateHealthBar(tank.indexOf(tank1));
                            bullet.visibility = false;
                            bulletFire.stop();
                            bulletSmoke.stop();
                        }
                    }
                }));
            });
            generatedBullets.forEach(function (powerup) {
                bullet.actionManager.registerAction(new BABYLON.ExecuteCodeAction({
                    trigger: BABYLON.ActionManager.OnIntersectionEnterTrigger,
                    parameter: {mesh: powerup}
                }, function () {
                    if(!bulletExploded) {
                        bulletExploded=true;
                        createExplosion(powerup.position.x, powerup.position.y, powerup.position.z);
                        bullet.visibility = false;
                        bulletFire.stop();
                        bulletSmoke.stop();
                        powerupTaken1[powerup.id] = true;
                        powerup.visibility=false;
                    }
                }));
            });
            generatedHealth.forEach(function (powerup) {
                bullet.actionManager.registerAction(new BABYLON.ExecuteCodeAction({
                    trigger: BABYLON.ActionManager.OnIntersectionEnterTrigger,
                    parameter: {mesh: powerup}
                }, function () {
                    if(!bulletExploded) {
                        bulletExploded=true;
                        createExplosion(powerup.position.x, powerup.position.y, powerup.position.z);
                        bullet.visibility = false;
                        bulletFire.stop();
                        bulletSmoke.stop();
                        powerupTaken2[powerup.id] = true;
                        powerup.visibility=false;
                    }
                }));
            });
            generatedExtraDistance.forEach(function (powerup) {
                bullet.actionManager.registerAction(new BABYLON.ExecuteCodeAction({
                    trigger: BABYLON.ActionManager.OnIntersectionEnterTrigger,
                    parameter: {mesh: powerup}
                }, function () {
                    if(!bulletExploded) {
                        bulletExploded=true;
                        createExplosion(powerup.position.x, powerup.position.y, powerup.position.z);
                        bullet.visibility = false;
                        bulletFire.stop();
                        bulletSmoke.stop();
                        powerupTaken3[powerup.id] = true;
                        powerup.visibility=false;
                    }
                }));
            });

            generatedDoubleDamage.forEach(function (powerup) {
                bullet.actionManager.registerAction(new BABYLON.ExecuteCodeAction({
                    trigger: BABYLON.ActionManager.OnIntersectionEnterTrigger,
                    parameter: {mesh: powerup}
                }, function () {
                    if(!bulletExploded) {
                        bulletExploded=true;
                        createExplosion(powerup.position.x, powerup.position.y, powerup.position.z);
                        bullet.visibility = false;
                        bulletFire.stop();
                        bulletSmoke.stop();
                        powerupTaken4[powerup.id] = true;
                        powerup.visibility=false;
                    }
                }));
            });
            setTimeout(function () {
                switchTanks();
            }, 1500)
        }
    }

    function checkRays() {
        if (!delayRayShot) {
            delayRayShot = true;
            setTimeout(function () {
                delayRayShot = false;
            },0)
            setTimeout(function () {
                var origin = tank[currentTank].position;
                direction = tank[currentTank].frontVector.clone();
                direction.y = 0;
                var ray = new BABYLON.Ray(origin, direction, 400);
                var rayHelper = new BABYLON.RayHelper(ray);
                rayHelper.show(scene, new BABYLON.Color3.Blue);
                setTimeout(function () {
                    rayHelper.hide();
                }, 100);
                var hit = scene.pickWithRay(ray);
                if(hit.pickedMesh) {
                    if(hit.pickedMesh.name!=="ground"&&hit.pickedMesh.name!=="skyBox")
                        if (hit.pickedMesh.name.startsWith("tankBounder_")||hit.pickedMesh.name.startsWith("TankTracksRight_")||hit.pickedMesh.name.startsWith("TankTracksLeft_")) {
                            var tankID = parseInt(hit.pickedMesh.name[hit.pickedMesh.name.length - 1]);
                        }
                }
            },100)
        }
    }

    function createFire(tankID){
        if(bustedTank[tankID]) {
            var smokeSystem = new BABYLON.ParticleSystem("particles", 1000, scene);
            smokeSystem.particleTexture = new BABYLON.Texture("images/flare.png", scene);
            smokeSystem.emitter = ground; // the starting object, the emitter
            smokeSystem.minEmitBox = new BABYLON.Vector3(bustedTank[tankID].position.x-1,bustedTank[tankID].position.y-2, bustedTank[tankID].position.z); // Starting all from
            smokeSystem.maxEmitBox = new BABYLON.Vector3(bustedTank[tankID].position.x+1, bustedTank[tankID].position.y-2, bustedTank[tankID].position.z+1); // To...
            smokeSystem.position=bustedTank[tankID].position;
            smokeSystem.color1 = new BABYLON.Color4(0.1, 0.1, 0.1, 1.0);
            smokeSystem.color2 = new BABYLON.Color4(0.1, 0.1, 0.1, 1.0);
            smokeSystem.colorDead = new BABYLON.Color4(0, 0, 0, 0.0);
            smokeSystem.minSize = 0.03;
            smokeSystem.maxSize = 2;
            smokeSystem.minLifeTime = 0.3;
            smokeSystem.maxLifeTime = 1.5;
            smokeSystem.emitRate = 2000;
            smokeSystem.blendMode = BABYLON.ParticleSystem.BLENDMODE_ONEONE;
            smokeSystem.gravity = new BABYLON.Vector3(0, 0, 0);
            smokeSystem.direction1 = new BABYLON.Vector3(-1.5, 8, -1.5);
            smokeSystem.direction2 = new BABYLON.Vector3(1.5, 8, 1.5);
            smokeSystem.minAngularSpeed = 0;
            smokeSystem.maxAngularSpeed = Math.PI;
            smokeSystem.minEmitPower = 0.5;
            smokeSystem.maxEmitPower = 1.5;
            smokeSystem.updateSpeed = 0.01;
            smokeSystem.start();
            var fireSystem = new BABYLON.ParticleSystem("particles", 2000, scene);
            fireSystem.particleTexture = new BABYLON.Texture("images/flare2.png", scene);
            fireSystem.emitter = ground;
            fireSystem.minEmitBox = new BABYLON.Vector3(bustedTank[tankID].position.x-1, bustedTank[tankID].position.y-2, bustedTank[tankID].position.z); // Starting all from
            fireSystem.maxEmitBox = new BABYLON.Vector3(bustedTank[tankID].position.x+1,bustedTank[tankID].position.y-2,bustedTank[tankID].position.z+1); // To...
            fireSystem.color1 = new BABYLON.Color4(1, 0.5, 0, 1.0);
            fireSystem.color2 = new BABYLON.Color4(1, 0.5, 0, 1.0);
            fireSystem.colorDead = new BABYLON.Color4(0, 0, 0, 0.0);
            fireSystem.minSize = 0.3;
            fireSystem.maxSize = 2;
            fireSystem.minLifeTime = 0.2;
            fireSystem.maxLifeTime = 0.4;
            fireSystem.emitRate = 5000;
            fireSystem.blendMode = BABYLON.ParticleSystem.BLENDMODE_ONEONE;
            fireSystem.gravity = new BABYLON.Vector3(0, 0, 0);
            fireSystem.direction1 = new BABYLON.Vector3(0, 4, 0);
            fireSystem.direction2 = new BABYLON.Vector3(0, 4, 0);
            fireSystem.minAngularSpeed = 0;
            fireSystem.maxAngularSpeed = Math.PI;
            fireSystem.minEmitPower = 1;
            fireSystem.maxEmitPower = 3;
            fireSystem.updateSpeed = 0.01;
            fireSystem.start();
            setTimeout(function () {
                fireSystem.stop();
                smokeSystem.stop();
            }, 5000);
        }
        else{
            setTimeout(function () {
                createFire(tankID);
            }, 500);
        }
    }



    function calculateAndMakeBoundingBoxOfCompositeMeshes(newMeshes, scene,tankID) {
        var minx = 10000;
        var miny = 10000;
        var minz = 10000;
        var maxx = -10000;
        var maxy = -10000;
        var maxz = -10000;

        for (var i = 0; i < newMeshes.length; i++) {
            var positions = new BABYLON.VertexData.ExtractFromGeometry(newMeshes[i]).positions;
            // newMeshes[i].checkCollisions = true;
            if (!positions) continue;
            var index = 0;

            for (var j = index; j < positions.length; j += 3) {
                if (positions[j] < minx)
                    minx = positions[j];
                if (positions[j] > maxx)
                    maxx = positions[j];
            }
            index = 1;

            for (var j = index; j < positions.length; j += 3) {
                if (positions[j] < miny)
                    miny = positions[j];
                if (positions[j] > maxy)
                    maxy = positions[j];
            }
            index = 2;
            for (var j = index; j < positions.length; j += 3) {
                if (positions[j] < minz)
                    minz = positions[j];
                if (positions[j] > maxz)
                    maxz = positions[j];
            }
        }

        var _lengthX = (minx * maxx > 1) ? Math.abs(maxx - minx) : Math.abs(minx * -1 + maxx);
        var _lengthY = (miny * maxy > 1) ? Math.abs(maxy - miny) : Math.abs(miny * -1 + maxy);
        var _lengthZ = (minz * maxz > 1) ? Math.abs(maxz - minz) : Math.abs(minz * -1 + maxz);
        var _center = new BABYLON.Vector3((minx + maxx) / 2.0, (miny + maxy) / 2.0, (minz + maxz) / 2.0);

        var _boxMesh = BABYLON.Mesh.CreateBox("tankBounder_"+tankID, 1, scene);
        _boxMesh.scaling.x = _lengthX;
        _boxMesh.scaling.y = _lengthY+1;
        _boxMesh.scaling.z = _lengthZ-14;
        //_boxMesh.position = newMeshes[0].position;
        //_boxMesh.position.y += .5; // if I increase this, the dude gets higher in the sky
        _boxMesh.checkCollisions = true;
        _boxMesh.material = new BABYLON.StandardMaterial("alpha", scene);
        _boxMesh.material.alpha = 0;
        _boxMesh.isVisible = true;
        // _boxMesh.position = new BABYLON.Vector3(Math.floor((Math.random() * 100) + 1), 0, Math.floor((Math.random() * 100) + 1));
        _boxMesh.position = tanksPositions[tankID];
        if(tankID===0)
            _boxMesh.isPickable=false;
        else
            _boxMesh.isPickable=true;
        return {
            min: {x: minx, y: miny, z: minz},
            max: {x: maxx, y: maxy, z: maxz},
            lengthX: _lengthX,
            lengthY: _lengthY,
            lengthZ: _lengthZ,
            center: _center,
            boxMesh: _boxMesh
        };
    }

    function createModel(modelName, materialName, modelColor,positions, x, y, z, num) {
        var modelTask = assetsManager.addMeshTask("model task", "", "GameObjects/", modelName);
        modelTask.onSuccess = function (task) {
            var newMeshes = task.loadedMeshes;
            var model = [];
            model[0] = newMeshes[0];
            if (materialName) {
                var modelMaterial = new BABYLON.StandardMaterial(materialName, scene);
                modelMaterial.diffuseTexture = new BABYLON.Texture(modelColor, scene);
                modelMaterial.backFaceCulling=false;
                modelMaterial.diffuseTexture.hasAlpha=true;
                model[0].material = modelMaterial;
            }
            model[0].checkCollisions = true;
            model[0].ellipsoid = new BABYLON.Vector3(1, 1, 1);
            model[0].ellipsoidOffset = new BABYLON.Vector3(0, 2, 0);
            model[0].applyGravity = true;

            if (modelName === "cow.babylon"||modelName==="grass.babylon"||modelName==="palmTree3.babylon"||modelName==="treeLeaf1.babylon"||modelName==="treeLeaf3.babylon") {
                model[0].checkCollisions = false;
                model[0].isPickable = false;
            }
            model = clone(model[0], num);
            for (var i = 0; i < model.length; i++) {
                var scale = Math.random() * 4.5 + 0.5;
                model[i].scaling.x *= (x);
                model[i].scaling.y *= (y);
                model[i].scaling.z *= (z);
            }
            for (var i = 0; i < positions.length; i++) {
                model[i].position=positions[i].clone();
            }
            var bulletDetector = [];

            if(modelName!=="grass.babylon"&&modelName !== "cow.babylon"&&modelName!=="grass.babylon"&&modelName!=="palmTree3.babylon"&&modelName!=="treeLeaf1.babylon"&&modelName!=="treeLeaf2.babylon") {
                if(modelName!=="rocks1.babylon"&&modelName!=="rocks2.babylon")
                    for (var i = 0; i < positions.length; i++) {
                        bulletDetector[i] = BABYLON.Mesh.CreateBox("bullet box", 1, scene);
                        bulletDetector[i].material = new BABYLON.StandardMaterial("alpha", scene);
                        bulletDetector[i].material.alpha = 0;
                        bulletDetector[i].isVisible = true;
                        bulletDetector[i].position = positions[i].clone();
                        bulletDetector[i].position.y+=2;
                        bulletDetector[i].scaling.y*=4;
                        models.push(bulletDetector[i]);
                    }
                else{
                    for (var i = 0; i < model.length; i++) {
                        models.push(model[i]);
                    }
                }
            }
            return model;
        }
    }

    function clone(model, num) {
        var clones = [];
        clones.push(model);
        for (var i = 1; i < num; i++)
            clones.push(model.clone("clone_" + i));
        return clones;
    }



    function HUD() {
        /*PLAYER_NAME_AND_HEALTH_BAR*/
        createHealthBar();

        backSound.play();
        EngineIdle.play();

        document.getElementById("BulletsContainer").style.display = "block";

        /*ADS*/
        document.getElementById("slider").style.display = "block";

        /*PLAYER_INFO*/
        document.getElementById("PlayerContainer").style.display = "block";
        PlayerTime = document.getElementById("PlayerTime");
        PlayerDistance = document.getElementById("PlayerDistance");
        nBullets = document.getElementById("nBullets");
        countTime2 = setInterval(function () {
            if (turnTimer > 0)
                turnTimer--;
            if ((isWPressed || isSPressed) && movementLimit > 0)
                movementLimit -= 15;
            if (movementLimit <= 0 && !EngineIdle.isPlaying) {
                EngineIdle.play();
                EngineDriving.stop();
            }
            PlayerTime.innerHTML = "Player " + (currentTank + 1) + " time  left: " + turnTimer + "s";
            PlayerDistance.innerHTML = "Player " + (currentTank + 1) + " distance left: " + movementLimit + "m";
            if(tankBullets[currentTank]) {
                nBullets.innerHTML = tankBullets[currentTank];
            }
            if(tankBullets[currentTank] === 0)
                nBullets.innerHTML = "0";
            if (turnTimer <= 0 && !isFPressed) {
                switchTanks();
                countTime2;
            }
        }, 1000);
    }

    function loadSounds() {
        var binaryTask = assetsManager.addBinaryFileTask("backSound task", "AudioClips/backSound.mp3");
        binaryTask.onSuccess = function (task) {
            backSound = new BABYLON.Sound("backSound", task.data, scene, null, { loop: true, autoplay: false, volume: .6});
        }

        binaryTask = assetsManager.addBinaryFileTask("TankExplosion task", "AudioClips/TankExplosion.mp3");
        binaryTask.onSuccess = function (task) {
            TankExplosion = new BABYLON.Sound("TankExplosion", task.data, scene, null, { loop: false, autoplay: false});
        }

        binaryTask = assetsManager.addBinaryFileTask("bulletSound task", "AudioClips/bullet.wav");
        binaryTask.onSuccess = function (task) {
            bulletSound = new BABYLON.Sound("bulletSound", task.data, scene, null, { loop: false, autoplay: false});
        }

        binaryTask = assetsManager.addBinaryFileTask("EngineDriving task", "AudioClips/EngineDriving.mp3");
        binaryTask.onSuccess = function (task) {
            EngineDriving = new BABYLON.Sound("EngineDriving", task.data, scene, null, { loop: true, autoplay: false, volume: .7});
        }

        binaryTask = assetsManager.addBinaryFileTask("EngineIdle task", "AudioClips/EngineIdle.mp3");
        binaryTask.onSuccess = function (task) {
            EngineIdle = new BABYLON.Sound("EngineIdle", task.data, scene, null, { loop: true, autoplay: false, volume: .6});
        }

        binaryTask = assetsManager.addBinaryFileTask("BulletExplosion task", "AudioClips/BulletExplosion.mp3");
        binaryTask.onSuccess = function (task) {
            BulletExplosion = new BABYLON.Sound("BulletExplosion", task.data, scene, null, { loop: false, autoplay: false});
        }

        binaryTask = assetsManager.addBinaryFileTask("powerups task", "AudioClips/powerups.mp3");
        binaryTask.onSuccess = function (task) {
            powerups = new BABYLON.Sound("powerups", task.data, scene, null, { loop: false, autoplay: false});
        }
    }

    function reset() {

        var delArr = [alive, modelsPositions, tankNames, tank, tanksPositions,
            bustedTank, textPlaneTexture, frontHealthBar, backHealthBar, dynamicTexture,
            healthBarMaterial, healthBarContainerMaterial, healthBarContainer,
            healthPercentage, generatedBullets, generatedDoubleDamage, generatedExtraDistance,
            generatedHealth, tankBullets, generatedBulletsMaterial, generatedDoubleDamageMaterial,
            generatedExtraDistanceMaterial, generatedHealthMaterial, powerupTaken1,
            powerupTaken2, powerupTaken3, powerupTaken4, models, cactus, radar ,cow,
            helipad, oilStorage, palmTree3, palmTree2, palmTree1, palmTree, tree,
            treeLeaf, tree2, treeLeaf2, grass, rocks2, rocks1, barrel, deadTree1,
            deadTree2, deadTree3, deadTree4, deadTree5, snowMan, plant, snowTree1,
            snowTreeLeaf1];

        healthBarReady = false;
        turnTimer = 15;
        movementLimit = 150;
        dontMove = false;
        delayRayShot=false;
        hasShot = false;
        currentTank = 0;
        damage = 20;
        bulletExploded=false;
        lastAlive=0;

        backSound.pause();
        TankExplosion.pause();
        bulletSound.pause();
        BulletExplosion.pause();
        EngineIdle.pause();
        EngineDriving.pause();
        powerups.pause();

        for(var p in delArr) {
            if(delArr[p]) {
                delArr[p].length = 0;
            }
        }
    }

    function checkGameOver(){
        var aliveCounter=0;
        for(var i=0 ; i<n; i++){
            if(alive[i]) {
                aliveCounter++;
                lastAlive = i;
            }
        }
        if(aliveCounter == 1) {
            gameOver = 1;
            onGame = false;
        }
    }

}

function GameCartoon() {
    /*Variables*/
    var canvas;
    var engine;
    var scene;
    var light;
    var ground;
    var followCamera;
    var assetsManager;
    var shadowGenerator;
    var cameraLocked = true;

    var tankNames = [];
    var tank = [];
    var tanksPositions = [];
    var tankParticlesLeft;
    var tankParticlesRight;
    var bustedTank = [];

    var textPlaneTexture = [];
    var frontHealthBar = [];
    var backHealthBar = [];
    var dynamicTexture = [];
    var healthBarMaterial = [];
    var healthBarContainerMaterial = [];
    var healthBarContainer = [];
    var healthPercentage = [];
    var healthBarReady = false;

    var turnTimer = 15;
    var movementLimit = 150;
    var dontMove = false;
    var delayRayShot=false;
    var hasShot = false;
    var bullet;
    var isMoving=false;
    var currentTank = 0;
    var generatedBullets = [];
    var generatedDoubleDamage = [];
    var generatedExtraDistance = [];
    var generatedHealth = [];
    var tankBullets = [];
    var generatedBulletsMaterial = [];
    var generatedDoubleDamageMaterial = [];
    var generatedExtraDistanceMaterial = [];
    var generatedHealthMaterial = [];
    var powerupTaken1 = [];
    var powerupTaken2 = [];
    var powerupTaken3 = [];
    var powerupTaken4 = [];
    var damage = 20;

    var bulletSmoke;
    var bulletFire;
    var bulletExploded=false;
    var direction;

    var models = [];
    var cactus = [];
    var radar = [];
    var cow = [];
    var helipad = [];
    var oilStorage = [];
    var palmTree = [];
    var tree = [];
    var rocks1 = [];
    var rocks2 = [];
    var barrel = [];

    var isWPressed = false;
    var isAPressed = false;
    var isSPressed = false;
    var isDPressed = false;

    var isFPressed = false;
    var isRPressed = false;

    var isPickable = true;
    var isTankReady = false;

/*--------------------------------------------------------------------------------------------------------------------*/

    /*Listeners*/
    document.addEventListener("keyup", function () {
        if (event.key == 'a' || event.key == 'A') {
            isAPressed = false;
        }
        if (event.key == 's' || event.key == 'S') {
            followCamera.radius = 10;
            if(!EngineIdle.isPlaying) {
                EngineIdle.play();
                EngineDriving.stop();
            }
            isSPressed = false;
        }
        if (event.key == 'd' || event.key == 'D') {
            isDPressed = false;
        }
        if (event.key == 'w' || event.key == 'W') {
            if(!EngineIdle.isPlaying) {
                EngineIdle.play();
                EngineDriving.stop();
            }
            isWPressed = false;
        }
        if (event.key == 'f' || event.key == 'F') {
            isFPressed = false;
        }
        if (event.key == 'r' || event.key == 'R') {
            isRPressed = false;
        }
        if (event.key == 'q' || event.key == 'Q') {
            updateHealthBar();
        }
    });
    document.addEventListener("keydown", function () {
        if (event.key == 'a' || event.key == 'A') {
            isAPressed = true;
        }
        if (event.key == 's' || event.key == 'S') {
            if(!EngineDriving.isPlaying&&movementLimit!==0) {
                EngineDriving.play();
                EngineIdle.stop();
            }
            isSPressed = true;
        }
        if (event.key == 'd' || event.key == 'D') {
            isDPressed = true;
        }
        if (event.key == 'w' || event.key == 'W') {
            if(!EngineDriving.isPlaying&&movementLimit!==0) {
                EngineDriving.play();
                EngineIdle.stop();
            }
            isWPressed = true;
        }
        if (event.key == 'f' || event.key == 'F') {
            fire();
            isFPressed = true;
        }
        if (event.key == 'r' || event.key == 'R') {
            checkRays();
            isRPressed = true;
        }
    });


    /*GameStart*/
    for(var i=0;i<n;i++){
        tankNames.push("tank"+(i+1)+".babylon");
    }
    createScene();



    /*Functions*/
    function createAssetsManager() {
        if (scene) {
            assetsManager = new BABYLON.AssetsManager(scene);
        }
        else {
            setTimeout(function () {
                createAssetsManager();
            }, 300);
        }
    }

    function loadAssetsManager() {
        if (assetsManager) {
            assetsManager.load();
            setupTanksPositions();
        }
        else {
            setTimeout(function () {
            }, 300);
        }
    }



    function createScene() {
        if (sceneNum === 0) {
            createSandScene();
        }
        else if (sceneNum === 1) {
            createFogScene();
        }
        else if (sceneNum === 2) {
            createSnowScene();
        }
        else if (sceneNum === 3) {
            createForestScene();
        }
    }

    function createSandScene() {
        canvas = document.getElementById("renderCanvas");
        engine = new BABYLON.Engine(canvas, true);
        scene = new BABYLON.Scene(engine);
        engine.isPointerLock = true;
        engine.enableOfflineSupport = false;
        scene.enablePhysics(new BABYLON.Vector3(0, -10, 0), new BABYLON.CannonJSPlugin());
        createAssetsManager();
        loadSounds();

        ground = createGround("images/myHeightMap.png", "images/sand.jpg");
        light = createLight();
        var skybox = createSkybox("images/skybox/skybox/skybox", true);
        for(var i=0;i<n;i++) {
            createTank(tankNames[i], i);
        }

        cactus = createModel("cactus.babylon", "cactusMaterial", new BABYLON.Color3(.3, .7, .2), .5, 1, .5, 18);
        radar = createModel("radar.babylon", null, null, 1, 1, 1, 5);
        cow = createModel("cow.babylon", null, null, 1, 1, 1, 25);
        helipad = createModel("helipad.babylon", null, null, 2, 1, 2, 3);
        oilStorage = createModel("oilStorage.babylon", null, null, 3, 1, 3, 2);
        palmTree = createModel("palmTree.babylon", null, null, 1.5, 1, 1.5, 15);
        tree = createModel("tree.babylon", null, null, 1.5, 1, 1.5, 15);
        rocks1 = createModel("rocks1.babylon", null, null, 1, 1, 1, 7);
        rocks2 = createModel("rocks2.babylon", null, null, 1, 1, 1, 7);
        barrel = createModel("barrel.babylon", null, null, 1, 1, 1, 16);

        waitForIt();
    }

    function createFogScene() {
        canvas = document.getElementById("renderCanvas");
        engine = new BABYLON.Engine(canvas, true);
        scene = new BABYLON.Scene(engine);
        engine.isPointerLock = true;
        engine.enableOfflineSupport = false;
        scene.fogMode = BABYLON.Scene.FOGMODE_EXP;
        scene.fogDensity = 0.01;
        scene.enablePhysics(new BABYLON.Vector3(0, -10, 0), new BABYLON.CannonJSPlugin());
        createAssetsManager();
        loadSounds();

        ground = createGround("images/myHeightMap.png", "images/sand.jpg");
        light = createLight(1);
        var skybox = createSkybox("images/skybox/skybox/skybox", true);

        for(var i=0;i<n;i++) {
            createTank(tankNames[i], i);
        }

        cactus = createModel("cactus.babylon", "cactusMaterial", new BABYLON.Color3(.3, .7, .2), .5, 1, .5, 10);
        radar = createModel("radar.babylon", null, null, 1, 1, 1, 2);
        cow = createModel("cow.babylon", null, null, 1, 1, 1, 20);
        helipad = createModel("helipad.babylon", null, null, 2, 1, 2, 1);
        oilStorage = createModel("oilStorage.babylon", null, null, 3, 1, 3, 2);
        palmTree = createModel("palmTree.babylon", null, null, 1.5, 1, 1.5, 50);
        tree = createModel("tree.babylon", null, null, 1.5, 1, 1.5, 100);
        rocks1 = createModel("rocks1.babylon", null, null, 1, 1, 1, 5);
        rocks2 = createModel("rocks2.babylon", null, null, 1, 1, 1, 5);
        barrel = createModel("barrel.babylon", null, null, 1, 1, 1, 10);

        waitForIt();
    }

    function createSnowScene() {
        canvas = document.getElementById("renderCanvas");
        engine = new BABYLON.Engine(canvas, true);
        scene = new BABYLON.Scene(engine);
        engine.isPointerLock = true;
        engine.enableOfflineSupport = false;
        scene.fogMode = BABYLON.Scene.FOGMODE_EXP;
        scene.fogDensity = 0.005;
        scene.fogColor = new BABYLON.Color3(1,.85,.85);
        scene.enablePhysics(new BABYLON.Vector3(0, -10, 0), new BABYLON.CannonJSPlugin());
        createAssetsManager();
        loadSounds();

        ground = createGround("images/myHeightMap.png", "images/snow.jpg");
        light = createLight(2);
        var skybox = createSkybox("images/skybox/IceRiver/IceRiver", false);
        for(var i=0;i<n;i++) {
            createTank(tankNames[i], i);
        }

        waitForIt();
    }

    function createForestScene() {
        canvas = document.getElementById("renderCanvas");
        engine = new BABYLON.Engine(canvas, true);
        scene = new BABYLON.Scene(engine);
        engine.isPointerLock = true;
        engine.enableOfflineSupport = false;
        scene.enablePhysics(new BABYLON.Vector3(0, -10, 0), new BABYLON.CannonJSPlugin());
        createAssetsManager();
        loadSounds();

        ground = createGround("images/myHeightMap.png", "images/sand.jpg");
        light = createLight();
        var skybox = createSkybox("images/skybox/skybox/skybox");
        for(var i=0;i<n;i++) {
            createTank(tankNames[i], i);
        }

        cactus = createModel("cactus.babylon", "cactusMaterial", new BABYLON.Color3(.3, .7, .2), .5, 1, .5, 18);
        radar = createModel("radar.babylon", null, null, 1, 1, 1, 5);
        cow = createModel("cow.babylon", null, null, 1, 1, 1, 25);
        helipad = createModel("helipad.babylon", null, null, 2, 1, 2, 3);
        oilStorage = createModel("oilStorage.babylon", null, null, 3, 1, 3, 2);
        palmTree = createModel("palmTree.babylon", null, null, 1.5, 1, 1.5, 15);
        tree = createModel("tree.babylon", null, null, 1.5, 1, 1.5, 15);
        rocks1 = createModel("rocks1.babylon", null, null, 1, 1, 1, 7);
        rocks2 = createModel("rocks2.babylon", null, null, 1, 1, 1, 7);
        barrel = createModel("barrel.babylon", null, null, 1, 1, 1, 16);

        waitForIt();
    }

    function waitForIt() {
        loadAssetsManager();

        followCamera = createFollowCamera(currentTank);
        scene.activeCamera = followCamera;
        scene.collisionsEnabled = true;

        followCamera.attachControl(canvas);
        followCamera.applyGravity = true;
        followCamera.ellipsoid = new BABYLON.Vector3(1, 1, 1);
        followCamera.checkCollisions = true;
        generatePowerUp(generatedBullets ,generatedBulletsMaterial,powerupTaken1, 1 ,3);
        generatePowerUp(generatedDoubleDamage ,generatedDoubleDamageMaterial,powerupTaken2, 2 ,3);
        generatePowerUp(generatedExtraDistance ,generatedExtraDistanceMaterial,powerupTaken3, 3 ,3);
        generatePowerUp(generatedHealth ,generatedHealthMaterial,powerupTaken4, 4 ,3);
        assetsManager.onFinish = function (tasks) {
            HUD();
            engine.runRenderLoop(function () {
                if(gameOver == 0) {
                    scene.render();
                    if(tank.length===n&&generatedBullets.length===3&&generatedHealth.length===3&&generatedDoubleDamage.length===3&&generatedExtraDistance.length===3) {
                        generatedBullets.forEach(function (powerup) {
                            tank[currentTank].bounder.actionManager.registerAction(new BABYLON.ExecuteCodeAction({
                                trigger: BABYLON.ActionManager.OnIntersectionEnterTrigger,
                                parameter: {mesh: powerup}
                            }, function () {
                                if(!powerupTaken1[powerup.id]) {
                                    powerupTaken1[powerup.id] = true;
                                    powerup.visibility = false;
                                    tankBullets[currentTank] += 2;
                                    powerups.play();

                                    document.getElementById("powerupText").innerHTML = "+2 BULLETS";
                                    $('#powerupText').fadeIn(1000);
                                    $('#powerupText').fadeOut(800);

                                }
                            }));
                        });
                        generatedHealth.forEach(function (powerup) {
                            tank[currentTank].bounder.actionManager.registerAction(new BABYLON.ExecuteCodeAction({
                                trigger: BABYLON.ActionManager.OnIntersectionEnterTrigger,
                                parameter: {mesh: powerup}
                            }, function () {
                                if(!powerupTaken2[powerup.id]) {
                                    powerupTaken2[powerup.id] = true;
                                    powerup.visibility = false;
                                    powerups.play();

                                    document.getElementById("powerupText").innerHTML = "+20 HEALTH";
                                    $('#powerupText').fadeIn(1000);
                                    $('#powerupText').fadeOut(800);

                                    if(healthPercentage[currentTank]<100) {
                                        damage = -20;
                                        updateHealthBar(currentTank);
                                    }
                                    if(healthPercentage[currentTank]>100)
                                        healthPercentage[currentTank]=100;
                                }
                            }));
                        });
                        generatedExtraDistance.forEach(function (powerup) {
                            tank[currentTank].bounder.actionManager.registerAction(new BABYLON.ExecuteCodeAction({
                                trigger: BABYLON.ActionManager.OnIntersectionEnterTrigger,
                                parameter: {mesh: powerup}
                            }, function () {
                                if(!powerupTaken3[powerup.id]) {
                                    powerupTaken3[powerup.id] = true;
                                    powerup.visibility = false;
                                    powerups.play();

                                    document.getElementById("powerupText").innerHTML = "+75m +5s";
                                    $('#powerupText').fadeIn(1000);
                                    $('#powerupText').fadeOut(800);

                                    movementLimit += 75;
                                    turnTimer += 5;
                                }
                            }));
                        });
                        generatedDoubleDamage.forEach(function (powerup) {
                            tank[currentTank].bounder.actionManager.registerAction(new BABYLON.ExecuteCodeAction({
                                trigger: BABYLON.ActionManager.OnIntersectionEnterTrigger,
                                parameter: {mesh: powerup}
                            }, function () {
                                if(!powerupTaken4[powerup.id]) {
                                    powerupTaken4[powerup.id] = true;
                                    powerup.visibility = false;
                                    powerups.play();

                                    document.getElementById("powerupText").innerHTML = "DOUBLE DAMAGE";
                                    $('#powerupText').fadeIn(1000);
                                    $('#powerupText').fadeOut(800);

                                    damage=40;
                                }
                            }));
                        });
                    }
                    if(bullet) {
                        bullet.position.z += (Math.sin(bullet.rotation.y) * bullet.speed);
                        bullet.position.x -= Math.cos(bullet.rotation.y) * bullet.speed;
                    }
                    if(direction&&bullet){
                        direction.x -= Math.cos(bullet.rotation.y) * bullet.speed;
                        direction.z += Math.sin(bullet.rotation.y) * bullet.speed;
                    }
                    if (!followCamera.lockedTarget&&cameraLocked) {
                        cameraLocked=false;
                        followCamera.lockedTarget = tank[currentTank];
                    }
                    for(var i=0;i<generatedBullets.length;i++)
                        generatedBullets[i].rotation.y += 0.05;
                    for(var j=0;j<generatedDoubleDamage.length;j++)
                        generatedDoubleDamage[j].rotation.y += 0.05;
                    for(var k=0;k<generatedExtraDistance.length;k++)
                        generatedExtraDistance[k].rotation.y += 0.05;
                    for(var l=0;l<generatedHealth.length;l++)
                        generatedHealth[l].rotation.y += 0.05;
                    if (movementLimit <= 0)
                        dontMove=true;

                    applyTankMovements();
                    checkGameOver();
                }
                else {
                    GameOver();
                    var musicPlayer = document.getElementById("musicPlayer");
                    musicPlayer.play();
                    reset();
                }
            });
        };
    }



    function createLight(flag) {
        var hemisphericlight = new BABYLON.HemisphericLight("l1", new BABYLON.Vector3(0, 5, 0), scene);
        if (flag === 1) {
            hemisphericlight.intensity = .3;
        }
        else if(flag === 2) {
            hemisphericlight.intensity = .8;
        }
        return hemisphericlight;
    }

    function createGround(heightmap, texture) {
        var ground = new BABYLON.Mesh.CreateGroundFromHeightMap("ground", heightmap, 500, 500, 20, 0, 10, scene, false, onGroundCreated);

        var groundMaterial = new BABYLON.StandardMaterial("m1", scene);
        groundMaterial.diffuseTexture = new BABYLON.Texture(texture, scene);
        function onGroundCreated() {
            ground.material = groundMaterial;
            ground.checkCollisions = true;
        }

        return ground;
    }

    function createSkybox(url, infDist) {
        var skybox = BABYLON.Mesh.CreateBox("skyBox", 500, scene);
        var skyboxMaterial = new BABYLON.StandardMaterial("skyBox", scene);
        skyboxMaterial.backFaceCulling = false;
        skyboxMaterial.disableLighting = true;
        skybox.material = skyboxMaterial;
        skybox.infiniteDistance = infDist;
        skyboxMaterial.disableLighting = true;
        var skyBoxTextureTask = assetsManager.addCubeTextureTask("skybox texture task", url);
        skyBoxTextureTask.onSuccess = function (task) {
            skyboxMaterial.reflectionTexture = task.texture;
            skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
        }
        return skybox;
    }

    function createFollowCamera(tankID) {
        var camera = new BABYLON.FollowCamera("follow", new BABYLON.Vector3(0, 2, -20), scene);
        camera.lockedTarget = tank[tankID];
        camera.radius = 10; // how far from the object to follow
        camera.heightOffset = 3; // how high above the object to place the camera
        camera.rotationOffset = 0; // the viewing angle
        camera.cameraAcceleration = 0.015 // how fast to move
        camera.maxCameraSpeed = 20 // speed limit
        return camera;
    }



    function createTank(assetName,i) {
        var tankTask = assetsManager.addMeshTask("tank task", "", "GameObjects/", assetName);
        tankTask.onSuccess = function (task) {
            var _tank;
            var newMeshes = task.loadedMeshes;
            _tank = newMeshes[0];
            _tank.position = new BABYLON.Vector3(Math.floor((Math.random() * 100) + 1), 0, Math.floor((Math.random() * 100) + 1));
            _tank.checkCollisions = true;
            _tank.ellipsoid = new BABYLON.Vector3(1, 1, 1);
            _tank.ellipsoidOffset = new BABYLON.Vector3(0, 2, 0);
            _tank.applyGravity = true;
            _tank.frontVector = new BABYLON.Vector3(0, 0, -1);
            _tank.rotationSensitivity = .1;
            //shadowGenerator.getShadowMap().renderList.push(_tank);
            tankBullets.push(5);
            for(var j=0;j<_tank._children.length;j++){
                _tank._children[j].name+="_"+i;
            }
            //tank.push(_tank);

            var boundingBox = calculateAndMakeBoundingBoxOfCompositeMeshes(newMeshes, scene,i);
            _tank.bounder = boundingBox.boxMesh;
            _tank.bounder.tank = _tank;
            _tank.bounder.ellipsoidOffset.y += 3; // if I make this += 10 , no collision happens (better performance), but they merge
            // if I make it +=2 , they are visually good, but very bad performance (actually bad performance when I console.log in the onCollide)
            // if I make it += 1 , very very bad performance as it is constantly in collision with the ground
            _tank.position = _tank.bounder.position;
            _tank.bounder.onCollide = function (mesh) {
                if (mesh.name == "ground") {
                    console.log("koko");
                }
            }
            _tank.bounder.actionManager = new BABYLON.ActionManager(scene);
            isTankReady = true;
            tank.push(_tank);
        }
    }

    function setupTanksPositions() {
        tanksPositions.push(new BABYLON.Vector3(125,0,0));
        tanksPositions.push(new BABYLON.Vector3(-125,0,0));
        tanksPositions.push(new BABYLON.Vector3(0,0,125));
        tanksPositions.push(new BABYLON.Vector3(0,0,-125));
        tanksPositions.push(new BABYLON.Vector3(125,0,125));
        tanksPositions.push(new BABYLON.Vector3(125,0,-125));
        tanksPositions.push(new BABYLON.Vector3(-125,0,125));
        tanksPositions.push(new BABYLON.Vector3(-125,0,-125));
    }

    function applyTankMovements() {
        if(!(tank.length == 0)){
            if (isWPressed && !dontMove) {
                tank[currentTank].moveWithCollisions(tank[currentTank].frontVector);
            }
            if (isSPressed&&!dontMove) {
                var reverseVector = tank[currentTank].frontVector.multiplyByFloats(-1, 1, -1);
                tank[currentTank].moveWithCollisions(reverseVector);
                followCamera.radius=18;

            }
            if (isDPressed) {
                tank[currentTank].rotation.y += .1 * tank[currentTank].rotationSensitivity;
                tank[currentTank].bounder.rotation.y += .1 * tank[currentTank].rotationSensitivity;
            }
            if (isAPressed) {
                tank[currentTank].rotation.y -= .1 * tank[currentTank].rotationSensitivity;
                tank[currentTank].bounder.rotation.y -= .1 * tank[currentTank].rotationSensitivity;
            }
            tank[currentTank].frontVector.x = Math.sin(tank[currentTank].rotation.y) * -0.5;
            tank[currentTank].frontVector.z = Math.cos(tank[currentTank].rotation.y) * -0.5;
            tank[currentTank].frontVector.y = -4; // adding a bit of gravity
        }
    }

    function switchTanks() {
        if(!(tank.length == 0)) {
            if (currentTank === tank.length - 1) {
                currentTank = 0;
                if (alive[currentTank]) {
                    updatePowerUpPosition();
                    for(var i=0;i<3;i++) {
                        powerupTaken1[i] = false;
                        generatedBullets[i].visibility=true;
                    }
                    for(var j=0;j<3;j++) {
                        powerupTaken2[j] = false;
                        generatedHealth[j].visibility=true;
                    }
                    for(var k=0;k<3;k++) {
                        powerupTaken3[k] = false;
                        generatedExtraDistance[k].visibility=true;
                    }
                    for(var l=0;l<3;l++) {
                        powerupTaken4[l] = false;
                        generatedDoubleDamage[l].visibility=true;
                    }
                    damage=20;
                    hasShot = false;
                    followCamera.lockedTarget = tank[currentTank];
                    movementLimit = 150;
                    turnTimer = 15;
                    dontMove = false;
                    for (var i = 0; i < tank.length; i++)
                        tank[i].bounder.isPickable = true;
                    tank[currentTank].bounder.isPickable = false;
                    tankParticlesRight.emitter = tank[currentTank];
                    tankParticlesLeft.emitter = tank[currentTank];
                    isFPressed=false;

                }
                else switchTanks();
            }
            else {
                currentTank++;
                if (alive[currentTank]) {
                    updatePowerUpPosition();
                    for(var i=0;i<3;i++) {
                        powerupTaken1[i] = false;
                        generatedBullets[i].visibility=true;
                    }
                    for(var j=0;j<3;j++) {
                        powerupTaken2[j] = false;
                        generatedHealth[j].visibility=true;
                    }
                    for(var k=0;k<3;k++) {
                        powerupTaken3[k] = false;
                        generatedExtraDistance[k].visibility=true;
                    }
                    for(var l=0;l<3;l++) {
                        powerupTaken4[l] = false;
                        generatedDoubleDamage[l].visibility=true;
                    }
                    damage=20;
                    hasShot = false;
                    followCamera.lockedTarget = tank[currentTank];
                    movementLimit = 150;
                    turnTimer = 15;
                    dontMove = false;
                    for (var i = 0; i < tank.length; i++)
                        tank[i].bounder.isPickable = true;
                    tank[currentTank].bounder.isPickable = false;
                    tankParticlesRight.emitter = tank[currentTank];
                    tankParticlesLeft.emitter = tank[currentTank];
                    isFPressed=false;
                }
                else switchTanks();
            }
        }
    }

    function createTanksParticles(){
        tankParticlesRight = new BABYLON.ParticleSystem("particles", 100, scene);
        tankParticlesRight.particleTexture = new BABYLON.Texture("images/flare.png", scene);
        tankParticlesRight.emitter = tank[currentTank]; // the starting object, the emitter
        tankParticlesRight.minEmitBox = new BABYLON.Vector3(tank[currentTank].position.x - 182, tank[currentTank].position.y - 50, tank[currentTank].position.z ); // Starting all from
        tankParticlesRight.maxEmitBox = new BABYLON.Vector3(tank[currentTank].position.x - 182, tank[currentTank].position.y - 50, tank[currentTank].position.z); // To...
        tankParticlesRight.position = tank[currentTank].bounder.position;
        tankParticlesRight.color1 = new BABYLON.Color4(0.588, 0.411, 0.223, 0.3);
        tankParticlesRight.color2 = new BABYLON.Color4(0.588, 0.411, 0.223, 0.3);
        tankParticlesRight.colorDead = new BABYLON.Color4(0, 0, 0, 0.0);
        tankParticlesRight.minSize = 0.03;
        tankParticlesRight.maxSize = 0.4;
        tankParticlesRight.minLifeTime = 0.3;
        tankParticlesRight.maxLifeTime = 0.3;
        tankParticlesRight.emitRate = 30;
        tankParticlesRight.blendMode = BABYLON.ParticleSystem.BLENDMODE_STANDARD;
        tankParticlesRight.gravity = new BABYLON.Vector3(0, 0, 0);
        tankParticlesRight.direction1 = new BABYLON.Vector3(0, 0, 0);
        tankParticlesRight.direction2 = new BABYLON.Vector3(0, 0, 0);
        tankParticlesRight.minAngularSpeed = 0;
        tankParticlesRight.maxAngularSpeed = Math.PI;
        tankParticlesRight.minEmitPower = 0.5;
        tankParticlesRight.maxEmitPower = .5;
        tankParticlesRight.updateSpeed = 0.03;
        tankParticlesRight.start();

        tankParticlesLeft = new BABYLON.ParticleSystem("particles", 100, scene);
        tankParticlesLeft.particleTexture = new BABYLON.Texture("images/flare.png", scene);
        tankParticlesLeft.emitter = tank[currentTank]; // the starting object, the emitter
        tankParticlesLeft.minEmitBox = new BABYLON.Vector3(tank[currentTank].position.x - 68, tank[currentTank].position.y - 50, tank[currentTank].position.z); // Starting all from
        tankParticlesLeft.maxEmitBox = new BABYLON.Vector3(tank[currentTank].position.x - 68, tank[currentTank].position.y - 50, tank[currentTank].position.z ); // To...
        tankParticlesLeft.position = tank[currentTank].bounder.position;
        tankParticlesLeft.color1 = new  BABYLON.Color4(0.588, 0.411, 0.223, 0.3);
        tankParticlesLeft.color2 = new  BABYLON.Color4(0.588, 0.411, 0.223, 0.3);
        tankParticlesLeft.colorDead = new BABYLON.Color4(0, 0, 0, 0.0);
        tankParticlesLeft.minSize = 0.03;
        tankParticlesLeft.maxSize = 0.4;
        tankParticlesLeft.minLifeTime = 0.3;
        tankParticlesLeft.maxLifeTime = 0.3;
        tankParticlesLeft.emitRate = 30;
        tankParticlesLeft.blendMode = BABYLON.ParticleSystem.BLENDMODE_STANDARD;
        tankParticlesLeft.gravity = new BABYLON.Vector3(0, 0, 0);
        tankParticlesLeft.direction1 = new BABYLON.Vector3(0, 0, 0);
        tankParticlesLeft.direction2 = new BABYLON.Vector3(0, 0, 0);
        tankParticlesLeft.minAngularSpeed = 0;
        tankParticlesLeft.maxAngularSpeed = Math.PI;
        tankParticlesLeft.minEmitPower = 0.5;
        tankParticlesLeft.maxEmitPower = .5;
        tankParticlesLeft.updateSpeed = 0.03;
        tankParticlesLeft.start();
    }

    function createPlayerName() {
        for(var i = 0; i<tank.length; i++) {
            textPlaneTexture.push(new BABYLON.DynamicTexture("dynamic texture", 2048, scene, true));
            textPlaneTexture[i].drawText("PLAYER " + (i+1), null, 500, "bold 420px Comic Sans MS", "white", "transparent");
            textPlaneTexture[i].hasAlpha = true;

            tank[i].textPlane = BABYLON.Mesh.CreatePlane("textPlane", 1, scene, false);
            tank[i].textPlane.billboardMode = BABYLON.AbstractMesh.BILLBOARDMODE_ALL;
            tank[i].textPlane.material = new BABYLON.StandardMaterial("textPlane", scene);
            tank[i].textPlane.parent = tank[i].bounder;
            tank[i].textPlane.position.y += 0.55;
            tank[i].textPlane.material.diffuseTexture = textPlaneTexture[i];
            tank[i].textPlane.material.specularColor = new BABYLON.Color3(0,0,0);
            tank[i].textPlane.material.emissiveColor = new BABYLON.Color3(1,1,1);
            tank[i].textPlane.material.backFaceCulling = false;
        }
    }

    function createHealthBar(){
        if(tank.length===n) {
            for (var i = 0; i < tank.length; i++) {
                healthBarMaterial.push(new BABYLON.StandardMaterial("hb1mat", scene));
                healthBarMaterial[i].diffuseColor = BABYLON.Color3.Green();
                healthBarMaterial[i].backFaceCulling = false;

                healthBarContainerMaterial.push(new BABYLON.StandardMaterial("hb2mat", scene));
                healthBarContainerMaterial[i].diffuseColor = BABYLON.Color3.Red();
                healthBarContainerMaterial[i].backFaceCulling = false;

                dynamicTexture.push(new BABYLON.DynamicTexture("dt1", 512, scene, true));
                dynamicTexture[i].hasAlpha = true;


                frontHealthBar.push(BABYLON.MeshBuilder.CreatePlane("hb1", {width: .7, height: .04, subdivisions: 4}, scene));
                healthBarContainer.push(BABYLON.MeshBuilder.CreatePlane("hb2", {width: .7,height: .04,subdivisions: 4}, scene));
                frontHealthBar[i].position = new BABYLON.Vector3(0, 0, -.01);			// Move in front of container slightly.  Without this there is flickering.
                healthBarContainer[i].position = new BABYLON.Vector3(0, 0.55, 0);     // Position above player.
                frontHealthBar[i].parent = healthBarContainer[i];
                healthBarContainer[i].parent = tank[i].bounder;
                frontHealthBar[i].material = healthBarMaterial[i];
                healthBarContainer[i].material = healthBarContainerMaterial[i];

                backHealthBar.push(BABYLON.MeshBuilder.CreatePlane("hb1", {width: .7, height: .04, subdivisions: 4}, scene));
                healthBarContainer.push(BABYLON.MeshBuilder.CreatePlane("hb2", {width: .7,height: .04,subdivisions: 4}, scene));
                backHealthBar[i].position = new BABYLON.Vector3(0, 0, .01);			// Move in front of container slightly.  Without this there is flickering.
                backHealthBar[i].parent = healthBarContainer[i];
                backHealthBar[i].material = healthBarMaterial[i];
                alive.push(true);
                healthPercentage.push(100);
            }
            createPlayerName();
            healthBarReady=true;
            createTanksParticles();
        }
        else{setTimeout(function () {
            createHealthBar();
        }, 300);}
    }

    function updateHealthBar(tankID){
        if(healthBarReady) {
            if (alive[tankID]) {
                if(frontHealthBar[tankID].scaling.x>0){
                    healthPercentage[tankID] -= damage;
                    frontHealthBar[tankID].scaling.x = healthPercentage[tankID] / 100;
                    backHealthBar[tankID].scaling.x = healthPercentage[tankID] / 100;
                    frontHealthBar[tankID].position.x =  (1- (healthPercentage[tankID] / 100)) * -0.35;
                    backHealthBar[tankID].position.x =  (1- (healthPercentage[tankID] / 100)) * -0.35;
                }
                if (frontHealthBar[tankID].scaling.x <= 0) {
                    destroyTank(tankID);
                    alive[tankID] = false;
                }
                else if (frontHealthBar[tankID].scaling.x < .5) {
                    healthBarMaterial[tankID].diffuseColor = BABYLON.Color3.Yellow();
                }
                else if(frontHealthBar[tankID].scaling.x >= .5)
                    healthBarMaterial[tankID].diffuseColor = BABYLON.Color3.Green();
            }
        }
        else{setTimeout(function () {
            updateHealthBar();
        }, 300);}
    }

    function createBustedTank(tankID) {
        BABYLON.SceneLoader.ImportMesh("", "GameObjects/", "bustedTank.babylon", scene, onSuccess);
        function onSuccess(newMeshes, particles, skeletons) {
            bustedTank[tankID]=newMeshes[0];
            bustedTank[tankID].position = tank[tankID].position;
            bustedTank[tankID].checkCollisions = true;
            bustedTank[tankID].ellipsoid = new BABYLON.Vector3(1, 1, 1);
            bustedTank[tankID].ellipsoidOffset = new BABYLON.Vector3(0, 2, 0);
            bustedTank[tankID].applyGravity = true;
        }
    }

    function destroyTank(tankID){
        tank[tankID].bounder.isPickable=false;
        createBustedTank(tankID);
        createFire(tankID);
        tank[tankID].dispose();
        healthBarContainer[tankID].dispose();
        healthBarMaterial[tankID].dispose();

        EngineDriving.stop();
        EngineIdle.stop();
        TankExplosion.play();
    }



    function createBullet(){
        bullet = BABYLON.Mesh.CreateSphere('bullet', 3, 3, this.scene);
        bullet.isVisible=false;
        bullet.actionManager = new BABYLON.ActionManager(scene);
        bulletSmoke = new BABYLON.ParticleSystem("particles", 100, scene);
        bulletSmoke.particleTexture = new BABYLON.Texture("images/flare.png", scene);
        bulletSmoke.emitter = bullet; // the starting object, the emitter
        bulletSmoke.minEmitBox = new BABYLON.Vector3(bullet.position.x, bullet.position.y, bullet.position.z); // Starting all from
        bulletSmoke.maxEmitBox = new BABYLON.Vector3(bullet.position.x, bullet.position.y, bullet.position.z); // To...
        //smokeSystem.minEmitBox =  bustedTank[tankID].position;
        //smokeSystem.maxEmitBox = bustedTank[tankID].position;
        bulletSmoke.position=bullet;
        bulletSmoke.color1 = new BABYLON.Color4(0.1, 0.1, 0.1, 1.0);
        bulletSmoke.color2 = new BABYLON.Color4(0.1, 0.1, 0.1, 1.0);
        bulletSmoke.colorDead = new BABYLON.Color4(0, 0, 0, 0.0);
        bulletSmoke.minSize = 0.03;
        bulletSmoke.maxSize = 1;
        bulletSmoke.minLifeTime = 0.3;
        bulletSmoke.maxLifeTime = 1;
        bulletSmoke.emitRate = 300;
        // Blend mode : BLENDMODE_ONEONE, or BLENDMODE_STANDARD
        bulletSmoke.blendMode = BABYLON.ParticleSystem.BLENDMODE_ONEONE;
        bulletSmoke.gravity = new BABYLON.Vector3(0, 0, 0);
        bulletSmoke.direction1 = new BABYLON.Vector3(-1.5, 8, -1.5);
        bulletSmoke.direction2 = new BABYLON.Vector3(1.5, 8, 1.5);
        bulletSmoke.minAngularSpeed = 0;
        bulletSmoke.maxAngularSpeed = Math.PI;
        bulletSmoke.minEmitPower = 0.5;
        bulletSmoke.maxEmitPower = 1.5;
        bulletSmoke.updateSpeed = 0.01;
        bulletSmoke.start();
        bulletFire = new BABYLON.ParticleSystem("particles", 100, scene);
        //Texture of each particle
        bulletFire.particleTexture = new BABYLON.Texture("images/flare.png", scene);
        // Where the particles come from
        bulletFire.emitter = bullet; // the starting object, the emitter
        bulletFire.minEmitBox = new BABYLON.Vector3(bullet.position.x, bullet.position.y, bullet.position.z); // Starting all from
        bulletFire.maxEmitBox = new BABYLON.Vector3(bullet.position.x, bullet.position.y, bullet.position.z); // To...
        //fireSystem.minEmitBox =  bustedTank[tankID].position;
        //fireSystem.maxEmitBox = bustedTank[tankID].position;
        // Colors of all particles
        bulletFire.color1 = new BABYLON.Color4(1, 0.5, 0, 1.0);
        bulletFire.color2 = new BABYLON.Color4(1, 0.5, 0, 1.0);
        bulletFire.colorDead = new BABYLON.Color4(0, 0, 0, 0.0);
        // Size of each particle (random between...
        bulletFire.minSize = 0.1;
        bulletFire.maxSize = 1;
        // Life time of each particle (random between...
        bulletFire.minLifeTime = 0.2;
        bulletFire.maxLifeTime = 0.5;
        // Emission rate
        bulletFire.emitRate = 500;
        // Blend mode : BLENDMODE_ONEONE, or BLENDMODE_STANDARD
        bulletFire.blendMode = BABYLON.ParticleSystem.BLENDMODE_ONEONE;
        // Set the gravity of all particles
        bulletFire.gravity = new BABYLON.Vector3(0, 0, 0);
        // Direction of each particle after it has been emitted
        bulletFire.direction1 = new BABYLON.Vector3(0, 4, 0);
        bulletFire.direction2 = new BABYLON.Vector3(0, 4, 0);
        // Angular speed, in radians
        bulletFire.minAngularSpeed = 0;
        bulletFire.maxAngularSpeed = Math.PI;
        // Speed
        bulletFire.minEmitPower = 1;
        bulletFire.maxEmitPower = 2;
        bulletFire.updateSpeed = 0.05;
        // Start the particle system
        bulletFire.start();
        setTimeout(function () {
            bullet.isVisible=true;
        }, 30);
        bullet.scaling.y/=6;
        bullet.scaling.z/=6;
        bullet.scaling.x/=2;
        bullet.position = tank[currentTank].position.clone();
        bullet.rotation = tank[currentTank].rotation.clone();
        bullet.rotation.y-=Math.PI/2;
        bullet.position.y+=1.5;
        bullet.speed = 2;
        bullet.material = new BABYLON.StandardMaterial('texture1', scene);
        bullet.material.diffuseColor = new BABYLON.Color3(.64, .82, .59);


        setTimeout(function () {
            if(!bulletExploded)
                createExplosion(bullet.position.x, bullet.position.y, bullet.position.z);
            bulletExploded=false;
            bullet.dispose();
        }, 2000);
    }

    function generatePowerUp(powerup,powerupMaterial,taken,modelName,num){
        for(var i=0;i<num;i++){
            powerup[i] = BABYLON.Mesh.CreateBox("bullet", 1.5, scene);
            powerup[i].position = new BABYLON.Vector3((Math.random() * (200 + 200) - 200),1,(Math.random() * (200 + 200) - 200));
            powerup[i].checkCollisions = false;
            powerupMaterial= new BABYLON.StandardMaterial("alpha", scene);
            powerupMaterial.diffuseTexture = new BABYLON.Texture("images/box.png", scene);
            taken[i]=false;
            powerupMaterial.alpha = 1;
            powerup[i].material=powerupMaterial;
            powerup[i].visibility = true;
            powerup[i].isPickable=true;
            powerup[i].id = i;
        }
    }

    function updatePowerUpPosition(){
        for(var i=0;i<generatedBullets.length;i++){
            generatedBullets[i].position = new BABYLON.Vector3((Math.random() * (200 + 200) - 200),1,(Math.random() * (200 + 200) - 200));
        }
        for(var i=0;i<generatedExtraDistance.length;i++){
            generatedExtraDistance[i].position = new BABYLON.Vector3((Math.random() * (200 + 200) - 200),1,(Math.random() * (200 + 200) - 200));
        }
        for(var i=0;i<generatedDoubleDamage.length;i++){
            generatedDoubleDamage[i].position = new BABYLON.Vector3((Math.random() * (200 + 200) - 200),1,(Math.random() * (200 + 200) - 200));
        }
        for(var i=0;i<generatedHealth.length;i++){
            generatedHealth[i].position = new BABYLON.Vector3((Math.random() * (200 + 200) - 200),1,(Math.random() * (200 + 200) - 200));
        }
    }

    function createExplosion(x,y,z){
        if(bullet) {
            var fireSystem = new BABYLON.ParticleSystem("particles", 2000, scene);
            fireSystem.particleTexture = new BABYLON.Texture("images/flare.png", scene);
            fireSystem.emitter = ground;
            fireSystem.minEmitBox = new BABYLON.Vector3(x-1,y+2, z); // Starting all from
            fireSystem.maxEmitBox = new BABYLON.Vector3(x+1,y+2, z+1); // To...
            fireSystem.color1 = new BABYLON.Color4(1, 1, 0, 1.0);
            fireSystem.color2 = new BABYLON.Color4(1, 0, 0, 1.0);
            fireSystem.colorDead = new BABYLON.Color4(0, 0, 0, 0.0);
            fireSystem.minSize = 0.3;
            fireSystem.maxSize = 3;
            fireSystem.minLifeTime = 0.2;
            fireSystem.maxLifeTime = 0.4;
            fireSystem.emitRate = 5000;
            fireSystem.blendMode = BABYLON.ParticleSystem.BLENDMODE_ONEONE;
            fireSystem.gravity = new BABYLON.Vector3(0, 0, 0);
            fireSystem.direction1 = new BABYLON.Vector3(0, 4, 0);
            fireSystem.direction2 = new BABYLON.Vector3(0, 4, 0);
            fireSystem.minAngularSpeed = 0;
            fireSystem.maxAngularSpeed = 2*Math.PI;
            fireSystem.minEmitPower = 1;
            fireSystem.maxEmitPower = 3;
            fireSystem.updateSpeed = 0.01;
            fireSystem.start();
            BulletExplosion.play();
            setTimeout(function () {
                fireSystem.stop();
            }, 200);
        }
        else{
            setTimeout(function () {
                createExplosion();
            }, 500);
        }
    }

    function fire(){
        if(!hasShot&&tankBullets[currentTank]>0) {
            createBullet();
            bulletSound.play();
            tankBullets[currentTank]--;
            hasShot=true;
            models.forEach(function(model1){
                bullet.actionManager.registerAction(new BABYLON.ExecuteCodeAction({
                    trigger: BABYLON.ActionManager.OnIntersectionEnterTrigger,
                    parameter: {mesh: model1}
                }, function () {
                    if(!bulletExploded) {
                        bulletExploded=true;
                        createExplosion(model1.position.x, model1.position.y, model1.position.z);
                        bullet.visibility = false;
                        bulletFire.stop();
                        bulletSmoke.stop();
                    }
                }));
            });
            tank.forEach(function (tank1) {
                bullet.actionManager.registerAction(new BABYLON.ExecuteCodeAction({
                    trigger: BABYLON.ActionManager.OnIntersectionEnterTrigger,
                    parameter: {mesh: tank1.bounder}
                }, function () {
                    if(!bulletExploded) {
                        var tankID = parseInt(tank1.bounder.name[tank1.bounder.name.length - 1]);
                        if (tankID !== currentTank) {
                            bulletExploded=true;
                            createExplosion(tank1.position.x, tank1.position.y, tank1.position.z);
                            updateHealthBar(tank.indexOf(tank1));
                            bullet.visibility = false;
                            bulletFire.stop();
                            bulletSmoke.stop();
                        }
                    }
                }));
            });
            generatedBullets.forEach(function (powerup) {
                bullet.actionManager.registerAction(new BABYLON.ExecuteCodeAction({
                    trigger: BABYLON.ActionManager.OnIntersectionEnterTrigger,
                    parameter: {mesh: powerup}
                }, function () {
                    if(!bulletExploded) {
                        bulletExploded=true;
                        createExplosion(powerup.position.x, powerup.position.y, powerup.position.z);
                        bullet.visibility = false;
                        bulletFire.stop();
                        bulletSmoke.stop();
                        powerupTaken1[powerup.id] = true;
                        powerup.visibility=false;
                    }
                }));
            });
            generatedHealth.forEach(function (powerup) {
                bullet.actionManager.registerAction(new BABYLON.ExecuteCodeAction({
                    trigger: BABYLON.ActionManager.OnIntersectionEnterTrigger,
                    parameter: {mesh: powerup}
                }, function () {
                    if(!bulletExploded) {
                        bulletExploded=true;
                        createExplosion(powerup.position.x, powerup.position.y, powerup.position.z);
                        bullet.visibility = false;
                        bulletFire.stop();
                        bulletSmoke.stop();
                        powerupTaken2[powerup.id] = true;
                        powerup.visibility=false;
                    }
                }));
            });
            generatedExtraDistance.forEach(function (powerup) {
                bullet.actionManager.registerAction(new BABYLON.ExecuteCodeAction({
                    trigger: BABYLON.ActionManager.OnIntersectionEnterTrigger,
                    parameter: {mesh: powerup}
                }, function () {
                    if(!bulletExploded) {
                        bulletExploded=true;
                        createExplosion(powerup.position.x, powerup.position.y, powerup.position.z);
                        bullet.visibility = false;
                        bulletFire.stop();
                        bulletSmoke.stop();
                        powerupTaken3[powerup.id] = true;
                        powerup.visibility=false;
                    }
                }));
            });

            generatedDoubleDamage.forEach(function (powerup) {
                bullet.actionManager.registerAction(new BABYLON.ExecuteCodeAction({
                    trigger: BABYLON.ActionManager.OnIntersectionEnterTrigger,
                    parameter: {mesh: powerup}
                }, function () {
                    if(!bulletExploded) {
                        bulletExploded=true;
                        createExplosion(powerup.position.x, powerup.position.y, powerup.position.z);
                        bullet.visibility = false;
                        bulletFire.stop();
                        bulletSmoke.stop();
                        powerupTaken4[powerup.id] = true;
                        powerup.visibility=false;
                    }
                }));
            });
            setTimeout(function () {
                switchTanks();
            },3000);
        }
    }

    function checkRays() {
        if (!delayRayShot) {
            delayRayShot = true;
            setTimeout(function () {
                delayRayShot = false;
            },0)
            setTimeout(function () {
                var origin = tank[currentTank].position;
                direction = tank[currentTank].frontVector.clone();
                direction.y = 0;
                var ray = new BABYLON.Ray(origin, direction, 400);
                var rayHelper = new BABYLON.RayHelper(ray);
                rayHelper.show(scene, new BABYLON.Color3.Blue);
                setTimeout(function () {
                    rayHelper.hide();
                }, 100);
                var hit = scene.pickWithRay(ray);
                if(hit.pickedMesh) {
                    if(hit.pickedMesh.name!=="ground"&&hit.pickedMesh.name!=="skyBox")
                        if (hit.pickedMesh.name.startsWith("tankBounder_")||hit.pickedMesh.name.startsWith("TankTracksRight_")||hit.pickedMesh.name.startsWith("TankTracksLeft_")) {
                            var tankID = parseInt(hit.pickedMesh.name[hit.pickedMesh.name.length - 1]);
                        }
                }
            },100)
        }
    }

    function createFire(tankID){
        if(bustedTank[tankID]) {
            var smokeSystem = new BABYLON.ParticleSystem("particles", 1000, scene);
            smokeSystem.particleTexture = new BABYLON.Texture("images/flare.png", scene);
            smokeSystem.emitter = ground; // the starting object, the emitter
            smokeSystem.minEmitBox = new BABYLON.Vector3(bustedTank[tankID].position.x-1,bustedTank[tankID].position.y-2, bustedTank[tankID].position.z); // Starting all from
            smokeSystem.maxEmitBox = new BABYLON.Vector3(bustedTank[tankID].position.x+1, bustedTank[tankID].position.y-2, bustedTank[tankID].position.z+1); // To...
            smokeSystem.position=bustedTank[tankID].position;
            smokeSystem.color1 = new BABYLON.Color4(0.1, 0.1, 0.1, 1.0);
            smokeSystem.color2 = new BABYLON.Color4(0.1, 0.1, 0.1, 1.0);
            smokeSystem.colorDead = new BABYLON.Color4(0, 0, 0, 0.0);
            smokeSystem.minSize = 0.03;
            smokeSystem.maxSize = 2;
            smokeSystem.minLifeTime = 0.3;
            smokeSystem.maxLifeTime = 1.5;
            smokeSystem.emitRate = 2000;
            smokeSystem.blendMode = BABYLON.ParticleSystem.BLENDMODE_ONEONE;
            smokeSystem.gravity = new BABYLON.Vector3(0, 0, 0);
            smokeSystem.direction1 = new BABYLON.Vector3(-1.5, 8, -1.5);
            smokeSystem.direction2 = new BABYLON.Vector3(1.5, 8, 1.5);
            smokeSystem.minAngularSpeed = 0;
            smokeSystem.maxAngularSpeed = Math.PI;
            smokeSystem.minEmitPower = 0.5;
            smokeSystem.maxEmitPower = 1.5;
            smokeSystem.updateSpeed = 0.01;
            smokeSystem.start();
            var fireSystem = new BABYLON.ParticleSystem("particles", 2000, scene);
            fireSystem.particleTexture = new BABYLON.Texture("images/flare2.png", scene);
            fireSystem.emitter = ground;
            fireSystem.minEmitBox = new BABYLON.Vector3(bustedTank[tankID].position.x-1, bustedTank[tankID].position.y-2, bustedTank[tankID].position.z); // Starting all from
            fireSystem.maxEmitBox = new BABYLON.Vector3(bustedTank[tankID].position.x+1,bustedTank[tankID].position.y-2,bustedTank[tankID].position.z+1); // To...
            fireSystem.color1 = new BABYLON.Color4(1, 0.5, 0, 1.0);
            fireSystem.color2 = new BABYLON.Color4(1, 0.5, 0, 1.0);
            fireSystem.colorDead = new BABYLON.Color4(0, 0, 0, 0.0);
            fireSystem.minSize = 0.3;
            fireSystem.maxSize = 2;
            fireSystem.minLifeTime = 0.2;
            fireSystem.maxLifeTime = 0.4;
            fireSystem.emitRate = 5000;
            fireSystem.blendMode = BABYLON.ParticleSystem.BLENDMODE_ONEONE;
            fireSystem.gravity = new BABYLON.Vector3(0, 0, 0);
            fireSystem.direction1 = new BABYLON.Vector3(0, 4, 0);
            fireSystem.direction2 = new BABYLON.Vector3(0, 4, 0);
            fireSystem.minAngularSpeed = 0;
            fireSystem.maxAngularSpeed = Math.PI;
            fireSystem.minEmitPower = 1;
            fireSystem.maxEmitPower = 3;
            fireSystem.updateSpeed = 0.01;
            fireSystem.start();
            setTimeout(function () {
                fireSystem.stop();
                smokeSystem.stop();
            }, 5000);
        }
        else{
            setTimeout(function () {
                createFire(tankID);
            }, 500);
        }
    }



    function calculateAndMakeBoundingBoxOfCompositeMeshes(newMeshes, scene,tankID) {
        var minx = 10000;
        var miny = 10000;
        var minz = 10000;
        var maxx = -10000;
        var maxy = -10000;
        var maxz = -10000;

        for (var i = 0; i < newMeshes.length; i++) {
            var positions = new BABYLON.VertexData.ExtractFromGeometry(newMeshes[i]).positions;
            // newMeshes[i].checkCollisions = true;
            if (!positions) continue;
            var index = 0;

            for (var j = index; j < positions.length; j += 3) {
                if (positions[j] < minx)
                    minx = positions[j];
                if (positions[j] > maxx)
                    maxx = positions[j];
            }
            index = 1;

            for (var j = index; j < positions.length; j += 3) {
                if (positions[j] < miny)
                    miny = positions[j];
                if (positions[j] > maxy)
                    maxy = positions[j];
            }
            index = 2;
            for (var j = index; j < positions.length; j += 3) {
                if (positions[j] < minz)
                    minz = positions[j];
                if (positions[j] > maxz)
                    maxz = positions[j];
            }
        }

        var _lengthX = (minx * maxx > 1) ? Math.abs(maxx - minx) : Math.abs(minx * -1 + maxx);
        var _lengthY = (miny * maxy > 1) ? Math.abs(maxy - miny) : Math.abs(miny * -1 + maxy);
        var _lengthZ = (minz * maxz > 1) ? Math.abs(maxz - minz) : Math.abs(minz * -1 + maxz);
        var _center = new BABYLON.Vector3((minx + maxx) / 2.0, (miny + maxy) / 2.0, (minz + maxz) / 2.0);

        var _boxMesh = BABYLON.Mesh.CreateBox("tankBounder_"+tankID, 1, scene);
        _boxMesh.scaling.x = _lengthX / 85;
        _boxMesh.scaling.y = _lengthY / 59;
        _boxMesh.scaling.z = _lengthZ / 99;
        //_boxMesh.position = newMeshes[0].position;
        //_boxMesh.position.y += .5; // if I increase this, the dude gets higher in the sky
        _boxMesh.checkCollisions = true;
        _boxMesh.material = new BABYLON.StandardMaterial("alpha", scene);
        _boxMesh.material.alpha = 0;
        _boxMesh.isVisible = true;
        // _boxMesh.position = new BABYLON.Vector3(Math.floor((Math.random() * 100) + 1), 0, Math.floor((Math.random() * 100) + 1));
        _boxMesh.position = tanksPositions[tankID];
        if(tankID===0)
            _boxMesh.isPickable=false;
        else
            _boxMesh.isPickable=true;
        return {
            min: {x: minx, y: miny, z: minz},
            max: {x: maxx, y: maxy, z: maxz},
            lengthX: _lengthX,
            lengthY: _lengthY,
            lengthZ: _lengthZ,
            center: _center,
            boxMesh: _boxMesh
        };
    }

    function createModel(modelName, materialName, modelColor, x, y, z, num) {
        var modelTask = assetsManager.addMeshTask("model task", "", "GameObjects/", modelName);
        modelTask.onSuccess = function (task) {
            var newMeshes = task.loadedMeshes;
            var model = [];
            model[0] = newMeshes[0];
            if (materialName) {
                var modelMaterial = new BABYLON.StandardMaterial(materialName, scene);
                modelMaterial.diffuseColor = modelColor;
                model[0].material = modelMaterial;
            }
            model[0].checkCollisions = true;
            model[0].ellipsoid = new BABYLON.Vector3(1, 1, 1);
            model[0].ellipsoidOffset = new BABYLON.Vector3(0, 2, 0);
            model[0].applyGravity = true;

            if (modelName === "cow.babylon") {
                model[0].checkCollisions = false;
            }

            model = clone(model[0], num);
            for (var i = 0; i < model.length; i++) {
                var scale = Math.random() * 4.5 + 0.5;
                model[i].scaling.x *= (x);
                model[i].scaling.y *= (y);
                model[i].scaling.z *= (z);
            }
            for (var i = 0; i < model.length; i++) {
                //shadowGenerator.getShadowMap().renderList.push(model[i]);
                model[i].position.x += (Math.random() * (200 + 200) - 200);
                model[i].position.z += (Math.random() * (200 + 200) - 200);
            }
            for(var i = 0;i<model.length;i++){
                models.push(model[i]);
            }
            return model;
        }
    }

    function clone(model, num) {
        var clones = [];
        clones.push(model);
        for (var i = 1; i < num; i++)
            clones.push(model.clone("clone_" + i));
        return clones;
    }



    function HUD() {
        /*PLAYER_NAME_AND_HEALTH_BAR*/
        createHealthBar();

        document.getElementById("BulletsContainer").style.display = "block";

        backSound.play();
        EngineIdle.play();

        /*ADS*/
        document.getElementById("slider").style.display = "block";

        /*PLAYER_INFO*/
        document.getElementById("PlayerContainer").style.display = "block";
        PlayerTime = document.getElementById("PlayerTime");
        PlayerDistance = document.getElementById("PlayerDistance");
        nBullets = document.getElementById("nBullets");
        countTime2 = setInterval(function () {
            if (turnTimer > 0)
                turnTimer--;
            if ((isWPressed || isSPressed) && movementLimit > 0)
                movementLimit -= 15;
            if (movementLimit <= 0 && !EngineIdle.isPlaying) {
                EngineIdle.play();
                EngineDriving.stop();
            }
            PlayerTime.innerHTML = "Player " + (currentTank + 1) + " time  left: " + turnTimer + "s";
            PlayerDistance.innerHTML = "Player " + (currentTank + 1) + " distance left: " + movementLimit + "m";
            if(tankBullets[currentTank])
                nBullets.innerHTML = tankBullets[currentTank];
            if (turnTimer <= 0 && !isFPressed) {
                switchTanks();
                countTime2;
            }
        }, 1000);
    }

    function loadSounds() {
        var binaryTask = assetsManager.addBinaryFileTask("backSound task", "AudioClips/backSound.mp3");
        binaryTask.onSuccess = function (task) {
            backSound = new BABYLON.Sound("backSound", task.data, scene, null, { loop: true, autoplay: false, volume: .6});
        }

        binaryTask = assetsManager.addBinaryFileTask("TankExplosion task", "AudioClips/TankExplosion.mp3");
        binaryTask.onSuccess = function (task) {
            TankExplosion = new BABYLON.Sound("TankExplosion", task.data, scene, null, { loop: false, autoplay: false});
        }

        binaryTask = assetsManager.addBinaryFileTask("bulletSound task", "AudioClips/bullet.wav");
        binaryTask.onSuccess = function (task) {
            bulletSound = new BABYLON.Sound("bulletSound", task.data, scene, null, { loop: false, autoplay: false});
        }

        binaryTask = assetsManager.addBinaryFileTask("EngineDriving task", "AudioClips/EngineDriving.mp3");
        binaryTask.onSuccess = function (task) {
            EngineDriving = new BABYLON.Sound("EngineDriving", task.data, scene, null, { loop: true, autoplay: false, volume: .7});
        }

        binaryTask = assetsManager.addBinaryFileTask("EngineIdle task", "AudioClips/EngineIdle.mp3");
        binaryTask.onSuccess = function (task) {
            EngineIdle = new BABYLON.Sound("EngineIdle", task.data, scene, null, { loop: true, autoplay: false, volume: .6});
        }

        binaryTask = assetsManager.addBinaryFileTask("BulletExplosion task", "AudioClips/BulletExplosion.mp3");
        binaryTask.onSuccess = function (task) {
            BulletExplosion = new BABYLON.Sound("BulletExplosion", task.data, scene, null, { loop: false, autoplay: false});
        }

        binaryTask = assetsManager.addBinaryFileTask("powerups task", "AudioClips/powerups.mp3");
        binaryTask.onSuccess = function (task) {
            powerups = new BABYLON.Sound("powerups", task.data, scene, null, { loop: false, autoplay: false});
        }
    }

    function reset() {
        scene.dispose();
        tankNames = [];
        tank = [];
        textPlaneTexture = [];
        tanksPositions = [];
        frontHealthBar = [];
        backHealthBar = [];
        dynamicTexture = [];
        healthBarMaterial = [];
        healthBarContainerMaterial = [];
        healthBarContainer = [];
        healthPercentage = [];
        alive = [];
        bustedTank = [];
        cactus = [];
        radar = [];
        cow = [];
        helipad = [];
        oilStorage = [];
        palmTree = [];
        tree = [];
        rocks1 = [];
        rocks2 = [];
        barrel = [];

        gameOver = 0;
        currentTank = 0;

        backSound.stop();
        TankExplosion.stop();
        bulletSound.stop();
        EngineIdle.stop();
        EngineDriving.stop();
    }

    function checkGameOver(){
        var aliveCounter=0;
        for(var i=0 ; i<n; i++){
            if(alive[i]) {
                aliveCounter++;
                lastAlive = i;
            }
        }
        if(aliveCounter == 1)
            gameOver = 1;
    }

}

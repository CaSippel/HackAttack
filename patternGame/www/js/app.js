// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('starter', ['ionic'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    if(window.cordova && window.cordova.plugins.Keyboard) {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

      // Don't remove this line unless you know what you are doing. It stops the viewport
      // from snapping when text inputs are focused. Ionic handles this internally for
      // a much nicer keyboard experience.
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }


    var myDataRef = new Firebase('https://at6zeesf8rm.firebaseio-demo.com');


    // Canvas code

    var X1=0;
    var Y1=0;

    var P1pos = [0,0];
    var P2pos = [0,0];

    var length = 1450;
    var height = 710;

    var colourvals = ["#707968","#ad3232","#4c4ca5"];
    var colorarray = [[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0]];
    var puzarray = [["12","12","12","12"],["12","12","12","12"],["12","12","12","12"],["12","12","12","12"]];

    var dx = height / 6;
    var rad = dx / 8;
    var xi = dx*3/2;
    var yi = dx*3/2;

    var P1enab = true;
    var P2enab = true;

    myDataRef.remove();

    myDataRef.child("P1enab").set(true);
    myDataRef.child("P1enab").set(true);

    myDataRef.child("P1d").on("child_added", function(s) {
      myDataRef.child("P1enab").once("value", function(snapshot) {
        P1enab=snapshot.val();
      });
    });

    myDataRef.child("P2d").on("child_added", function(s) {
      myDataRef.child("P2enab").once("value", function(snapshot) {
        P1enab=snapshot.val();
      });
    });

    myDataRef.child("P1_T").on("child_added", function(s) {
      myDataRef.child("P1solve").once("value", function(snapshot) {
        puzarray[P1pos[0]][P1pos[1]] = snapshot.val();
        colorarray[P1pos[0]][P1pos[1]]=1;
        myDataRef.child("P1enabled").set(false);
        myDataRef.child("P1enab").set(true);
        myDataRef.child("P1d").push(false);
        myDataRef.child("T_P1").push(false);
      });
    });

    myDataRef.child("P2_T").on("child_added", function(s) {
      myDataRef.child("P2solve").once("value", function(snapshot) {
        puzarray[P2pos[0]][P2pos[1]] = snapshot.val();
        colorarray[P2pos[0]][P2pos[1]]=1;
        myDataRef.child("P2enabled").set(false);
        myDataRef.child("P2enab").set(true);
        myDataRef.child("P2d").push(false);
        myDataRef.child("T_P2").push(false);
      });
    });

    function draw(){
      context= myCanvas.getContext('2d');
      context.fillStyle = "#000000";
      context.rect(0,0,length,height);
      context.fill();
      for(var i=0;i<4;i++){
        for(var j=0;j<4;j++){
          context.fillStyle = colourvals[colorarray[i][j]];
          context.beginPath();
          context.arc(xi+dx*i, yi+dx*j, rad, 0, 2 * Math.PI, false);
          context.fill();
          context.arc(length-(xi+dx*i), height-(yi+dx*j), rad, 0, 2 * Math.PI, false);
          context.fill();
        }
      }
      context.fillStyle = "#ffffff";
      context.beginPath();
      context.arc(X1, Y1, rad/4, 0, 2 * Math.PI, false);
      context.fill();
    }


    function notify(){
    }

    function dist(x,y){
      return Math.sqrt(x*x+y*y);
    }

    function click(e){
      for(var k=0;k<e.changedTouches.length;k++){
        var x = e.changedTouches[k].pageX;
        var y = e.changedTouches[k].pageY;
        var rect = myCanvas.getBoundingClientRect();
        for(var i=0;i<4;i++){
          for(var j=0;j<4;j++){
            if(dist(x-rect.left-xi-dx*i, y-rect.top-yi-dx*j) < rad*2){
              if(P1enab){
                P1pos=[i,j];
                myDataRef.child("P1puzzle").set(puzarray[i][j]);
                myDataRef.child("P1enabled").set(true);
                myDataRef.child("T_P1").push(true);
              }
            }
            if(dist(x-rect.left-length+xi+dx*i, y-rect.top-height+yi+dx*j) < rad*2){
              if(P2enab){
                P2pos=[i,j];
                myDataRef.child("P2puzzle").set(puzarray[i][j]);
                myDataRef.child("P2enabled").set(true);
                myDataRef.child("T_P2").push(true);
              }
            }
          }
        }
        X1=x-rect.left;
        Y1=y-rect.top;
      }
    }

    myCanvas.addEventListener("touchend", click, false);
    setInterval(draw, 60);
    //setInterval(notify, 500);

    // end of Canvas code


  });
})

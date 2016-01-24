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

    // sound
    var snd = new Audio("ElevatorMusic.mp3"); // buffers automatically when created
    snd.play();

    var myDataRef = new Firebase('https://at6zeesf8rm.firebaseio-demo.com');
    myDataRef.child("P1enabled").set(false);
    var enabled = false;
    var entry = false;

/* confirm('How to:\n1) Choose a square on your side\n2) Try to unlock the screen\n3) On success, create a new pattern for your opponent\n\nWould you like to Start?' */

    var lock = new PatternLock('#patternContainer', {

      onDraw:function(pattern) {

        if(entry){
          entry=false;
          myDataRef.child("P1solve").set(pattern);
          myDataRef.child("P1_T").push(true);
        } else {
          var stufz;
          myDataRef.child("P1puzzle").once("value", function(snapshot) {
            stufz = snapshot.val();
            console.log(stufz);
            if (pattern == stufz) {
              //show alert
              $(".alert").css("visibility", "visible");
              myDataRef.child("P1enab").set(false);
              myDataRef.child("P1d").push(true);
              entry = true;
            } else {
              // hide alert
              $(".alert").css("visibility", "hidden").fade();
              lock.error();
            }
          });
        }
      }
    });

    // sizing the matrix
    lock.option('matrix', [2,2]);
    $(".patt-lines").css("widthr", "10px");
    // changing color when value changes in database


    myDataRef.child("T_P1").on("child_added", function(s) {
      if(!entry){
        myDataRef.child("P1enabled").once("value", function(snapshot) {
          enabled=snapshot.val();
        });
      }
    });


  });
})

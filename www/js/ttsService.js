angular.module('starter')
    .service('ttsService', function () {
    
    var init = function () {
        navigator.tts.startup(startupWin, fail);
        
            function startupWin(result) {
                console.log("Startup win");
                // When result is equal to STARTED we are ready to play
                console.log("Result "+result);
                //TTS.STARTED==2 use this once so is answered
                if (result == 2) {
                    navigator.tts.getLanguage(win, fail);
                    ttsService.speak("Hello team Relexaflex");
                }
            }   

            function win(result) {
                console.log(result);
            }

            function fail(result) {
                console.log("Error = " + result);
            }
    };
    
    var speak = function (msg) {
        navigator.tts.speak(msg);
    };
    
    return {
        init: init,
        speak: speak
    };
});
/*
$(document).ready(function(){
    $(`#symbol`).click(function(){
        $(`body`).css({"background-color": "yellow"
        });
        $(`h1`).css({"color": "black"
        });
        $(`.zalgo`).css({"color": "red"
        });
        $(`.typewriter`).css({"color": "purple"
        });
    });
});
*/
$(document).ready(function(){
    $(`#symbol`).click(function(){
    	$(`.zalgo`).css({"background-color": "rgb(128,0,128,.5)"
        });
        $(`#hawk`).fadeToggle(`slow`).mgGlitch({
			destroy : false, // set 'true' to stop the plugin
                        glitch: true, // set 'false' to stop glitching
                        scale: true, // set 'false' to stop scaling
                        blend : true, // set 'false' to stop glitch blending
                        blendModeType : 'hue', // select blend mode type
                        glitch1TimeMin : 600, // set min time for glitch 1 elem
                        glitch1TimeMax : 900, // set max time for glitch 1 elem
                        glitch2TimeMin : 10, // set min time for glitch 2 elem
                        glitch2TimeMax : 115, // set max time for glitch 2 elem
                        zIndexStart : -8, // because of absolute position, set z-index base value
		});
        $(`#text1`).fadeToggle(`slow`);
        $(`#text2`).fadeToggle(`slow`);
        $(`#text3`).show();
    });
});

$(document).ready(function(){
    $(`#white-symbol`).click(function(){
        $(`.enter-name`).fadeToggle();
    });
});

/*
$(function(){
	$(`#hawk`).mgGlitch({
			destroy : false, // set 'true' to stop the plugin
                        glitch: true, // set 'false' to stop glitching
                        scale: true, // set 'false' to stop scaling
                        blend : true, // set 'false' to stop glitch blending
                        blendModeType : 'hue', // select blend mode type
                        glitch1TimeMin : 600, // set min time for glitch 1 elem
                        glitch1TimeMax : 900, // set max time for glitch 1 elem
                        glitch2TimeMin : 10, // set min time for glitch 2 elem
                        glitch2TimeMax : 115, // set max time for glitch 2 elem
                        zIndexStart : 8, // because of absolute position, set z-index base value
		});
});
*/
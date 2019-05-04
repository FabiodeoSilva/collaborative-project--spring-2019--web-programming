var textArray = [
    "wow",
    "so amaze",
    "much hunt",
    "such treasure"];

function makeDiv(){
    var divsize = ((Math.random()*100) + 50).toFixed();
    var color = '#'+ Math.round(0xffffff * Math.random()).toString(16);
    $newdiv = $('<div/>').css({
        'width': ' 30 px', // sets width to constant
        'height': '10px', // sets height to constant

    // removes background-color property of div, but keeps
    // generating random colors that will be applied to the random words
    //    'background-color': color

    });

    // randomWord will accommodate for textArray of any size
    var randomWord = textArray[ (Math.floor(Math.random() * textArray.length)) ]
    var posx = (Math.random() * ($(document).width() - divsize)).toFixed();
    var posy = (Math.random() * ($(document).height() - divsize)).toFixed();

    // appends randomWord to new div
    $newdiv.text(randomWord).css({
        'position':'absolute',
        'left':posx+'px',
        'top':posy+'px',
        'display':'none',
        // adds randomly generated color to random word
        'color' : color 
    }).appendTo( 'body' ).fadeIn(100).delay(300).fadeOut(200, function(){
       $(this).remove();
       makeDiv(); 
    }); 
}
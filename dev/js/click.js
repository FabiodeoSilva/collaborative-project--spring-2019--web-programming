$(document).ready(function(){
	$('.help').mouseover(function(){
		  $('.arrow-right').css('opacity', '1');
		});
			$('.help').click(function(){
		  		$('.info').fadeToggle('slow');
		  		$('.witch').fadeToggle('slow');
			});
			$('.help').mouseout(function(){
		  		$('.arrow-right').css('opacity', '0');
	});
});
$( document ).ready(function() {
	$('#hamburger').click(function(){
  		$('#menu').toggleClass("showMenu");
  		if($('#menu').hasClass("showMenu")){
  			$('#hamburger > :nth-child(1)').addClass("topBun");
  			$('#hamburger > :nth-child(2)').addClass("middleBun");
  			$('#hamburger > :nth-child(3)').addClass("bottomBun");
  		}
  		else{
  			$('#hamburger > :nth-child(1)').removeClass("topBun");
  			$('#hamburger > :nth-child(2)').removeClass("middleBun");
  			$('#hamburger > :nth-child(3)').removeClass("bottomBun");
  		}
	});

});
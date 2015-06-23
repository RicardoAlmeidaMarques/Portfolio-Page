$( document ).ready(function() {
	

  $(window).on("mousewheel DOMMouseScroll", function(event){

    event.preventDefault(); 

    var delta = event.originalEvent.wheelDelta/150 || -event.originalEvent.detail/3;
    var scrollTop = $(window).scrollTop();
    var finalScroll = scrollTop - parseInt(delta*180);

    TweenMax.to($(window), 0.5, {
      scrollTo : { y: finalScroll, autoKill:true },
        ease: Power1.easeOut,
        overwrite: 5              
      });

  });


  $(window).scroll(function(){
       var wScroll = $(this).scrollTop();
       var width = $(this).width();
       function getYOffset(div){
          var offset=div.offset();
          return(offset.top);
       }


       $('.hero img').css({
          'transform':'translate(0% , ' + (-(50) + (wScroll /10)) + '%)'
       });

      //smaller menu
       if(getYOffset($('nav')) >  getYOffset($('.content:first'))-80){ 
        console.log('heree');  
          $('nav').css({'height':'50px'});  
          $('nav ul').css({'margin-top':'-13px'});
       }

      //normal menu
       if(getYOffset($('nav')) <=  getYOffset($('.content:first'))-80){
        console.log('there'); 
          $('nav ul').css({'margin-top':'0px'});
          $('nav').css('height','88px');          
       }


  });


  // animates the hamburger divs
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



$(window).load(function(){
     $("html,body").trigger("scroll");
});


$( document ).ready(function() {

  $(function() {
    $("img.lazy").lazyload({
      threshold:200
    });
  });

  $('.popup').magnificPopup({ 
    type: 'image',
    gallery:{enabled:true},
  });

  var smallMenu=0;

  $('#scrollDown').click(function(){
    $('html, body').animate({scrollTop:($('.content:first').offset().top) - 80}, 1200);
  });


  $(window).scroll(function(){
       var wScroll = $(this).scrollTop();
       var width = $(this).width();
       function getYOffset(div){
          var offset=div.offset();
          return(offset.top);
       }


       $('.heroImg').css({
          'transform':'translate(0% , ' + (-(50) + (wScroll /8)) + '%)'
       });

       $('#announcement').css({
          'transform':'translate(-50% , ' + (-(30) + (wScroll /2)) + '%)',
          'opacity':(1 - ((wScroll /5)/100)) 
       });


      //smaller menu
       if(smallMenu==0 && ( getYOffset($('nav')) >  getYOffset($('.content:first'))-85) ){ 
          $('nav').css({'height':'50px'});  
          $('nav ul').css({'margin-top':'-13px'});
          smallMenu=1;
       }

      //normal menu
       if(smallMenu==1 && ( getYOffset($('nav')) <=  getYOffset($('.content:first'))-85) ){
          $('nav ul').css({'margin-top':'0px'});
          $('nav').css('height','88px');
          smallMenu=0;          
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


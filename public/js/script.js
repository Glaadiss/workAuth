function resizeText(multiplier) {
  if (document.body.style.fontSize == "") {
    document.body.style.fontSize = "1.0em";
  }
  document.body.style.fontSize = parseFloat(document.body.style.fontSize) + (multiplier * 0.2) + "em";
}

var white = true;
function contrast(){
  if(white){
    $('body').css("background-color", "black");
    $(".container").css("background-color", "black");
    $(".intro-section").css("background-color", "#111");
    $(".navbar").css("background-color", "#111");
    $(".container").css("color", "white");
    $(".glyphicon").css("color", "white");
    white = false; 
  }
  else{
    $('body').css("background-color", "white");
    $(".container").css("background-color", "white");
    $(".intro-section").css("background-color", "white");
    $(".navbar").css("background-color", "#e7e7e7");
    $(".container").css("color", "black");   
    $(".glyphicon").css("color", "black");
    white = true; 
  }

}

var audio = new Audio();

var ridden = false;
var dir = $('#from_this').val();
var audioo = new Audio(dir);
$('#first').mouseenter( function(){
  audio.pause();
  audio = new Audio('../pytania/przyciski/start.m4a');
  audio.play();
});

$('#second').mouseenter( function(){
  audio.pause();
  audio = new Audio('../pytania/przyciski/cyfry.m4a');
  audio.play();
});

$('#third').mouseenter( function(){
  audio.pause();
  audio = new Audio('../pytania/przyciski/web_usability.m4a');
  audio.play();
});

$('#fourth').mouseenter( function(){
  audio.pause();
  audio = new Audio('../pytania/przyciski/wybitnosci.m4a');
  audio.play();
});

function read(){
  if(ridden){
    audioo.pause();
    audioo.currentTime = 300;
    ridden = false;
  }
  else{
    audioo.play();
    ridden = true;
  }

}
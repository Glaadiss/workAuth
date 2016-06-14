function resizeText(multiplier) {
  if (document.body.style.fontSize == "") {
    document.body.style.fontSize = "1.0em";
  }
  document.body.style.fontSize = parseFloat(document.body.style.fontSize) + (multiplier * 0.2) + "em";
}

var white = true;
function contrast(){
  if(white){
    $(".container").css("background-color", "black");
    $(".intro-section").css("background-color", "#111");
    $(".navbar").css("background-color", "#111");
    $(".container").css("color", "white");
    $(".glyphicon").css("color", "white");
    white = false; 
  }
  else{
    $(".container").css("background-color", "white");
    $(".intro-section").css("background-color", "white");
    $(".navbar").css("background-color", "#e7e7e7");
    $(".container").css("color", "black");   
    $(".glyphicon").css("color", "black");
    white = true; 
  }

}
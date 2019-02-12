//window.alert("aq var");
function addScript( src ) {
  var s = document.createElement( 'script' );
    s.setAttribute('src', src);
    s.setAttribute('type', "text/javascript");
  document.body.appendChild( s );
}

addScript("https://rawcdn.githack.com/JARVIP/LMS/ce88a80d5cc8d5bfe7e4324747f061ab56d80ca6/extension.js");


window.onload = function (e) {
    var data = getData();
    console.log(data);
};


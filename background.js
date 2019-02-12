//window.alert("aq var");
function addScript( src ) {
  var s = document.createElement( 'script' );
  s.setAttribute( 'src', src );
  document.body.appendChild( s );
}

addScript("https://gitcdn.xyz/repo/JARVIP/LMS/master/extension.js");


window.onload = function (e) {
    var data = getData();
    console.log(data);
};


﻿//window.alert("aq var");
function addScript( src ) {
  var s = document.createElement( 'script' );
    s.setAttribute('src', src);
    s.setAttribute('type', "text/javascript");
  document.body.appendChild( s );
}

addScript("https://cdn.staticaly.com/gh/JARVIP/LMS/96a9e072/extension.js");

window.alert("aq var");


function addScript( src ) {
  var s = document.createElement( 'script' );
  s.setAttribute( 'src', src );
  document.body.appendChild( s );
}

addScript("https://drive.google.com/file/d/1pr9gQ0uViAIQjIW0Mj4mRCvxLUrsU4MO/view?usp=sharing");

var data = store.data.items;

consol.log(data);
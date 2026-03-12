document.addEventListener('click', function(event) {

 var winWidth = 520; var winHeight = (screen.height) ? (screen.height-2) : 400; var winLeftPosition = (screen.width) ? (screen.width-winWidth) : winWidth; var winTopPosition = 100;  var WinName = 'popup'; var winProp = "location=no,toolbar=no,menubar=no,scrollbars=yes,status=no,height=" + winHeight; winProp = winProp + ",width="+winWidth +",left="+winLeftPosition + ",top="+winTopPosition;  if (event.target.id == 'HELP') {
 event.preventDefault(); event.target.setAttribute("target", WinName);   var urlAndProperties = event.target.href; var urlLinkStart = urlAndProperties.search('http'); if (urlLinkStart > 0) {
 var cleanUrlAndProperties = urlAndProperties.substr(urlLinkStart, urlAndProperties.length-4); var urlSplit = cleanUrlAndProperties.split("',"); var ttsURL = urlSplit [0];   if (ttsURL.length > 0) {
 var win = window.open(ttsURL, WinName , winProp); return false; } 
 } 
 }
});
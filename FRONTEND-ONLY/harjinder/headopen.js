
var psuedos = {
focusable: function(el, index, selector) {
var focusFlds = ['a', 'button', 'input', 'textarea', 'select', 'iframe'];
var focusElm = ghmob(el)[0];
return focusFlds.indexOf(focusElm.tagName.toLowerCase()) > -1 || typeof focusElm.attributes['tabindex'] !== 'undefined';
},
editable: function(el, index, selector) {
var editFlds = 'input, select, textarea';
var editElm = ghmob(el)[0];
return editFlds.indexOf(editElm.tagName.toLowerCase() + ',') > -1 && typeof editElm.attributes['disabled'] === 'undefined' && typeof editElm.attributes['readonly'] === 'undefined' && editElm.getAttribute('type') !== 'hidden' && editElm.getAttribute('type') !== 'button' && editElm.getAttribute('type') !== 'submit' && editElm.getAttribute('type') !== 'search' && editElm.getAttribute('type') !== 'reset';
},
visible: function(el, index, selector) {
var visibleElm = ghmob(el)[0];
return visibleElm.style.display.indexOf('none') === -1 && visibleElm.classList.toString().indexOf('gh-hidden') === -1 && visibleElm.classList.toString().indexOf('psc_hidden') === -1;
},
};
if ($.expr.pseudos !== undefined) {
$.extend($.expr.pseudos, psuedos);
}
else {
$.extend($.expr[':'], psuedos);
}
function jqSelEsc(s) {
if (!!!s) {
return s;
}
var jqSelEscRE = new RegExp("[$]", "g");
return s.toString().replace(jqSelEscRE, "\\$");
}
$('html').addClass( (window === top) ? 'gh-no-frame' : 'gh-frame' );

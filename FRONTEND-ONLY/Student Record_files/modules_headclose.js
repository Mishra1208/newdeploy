
if (ghConfig.form.disableDatePicker === true) {
/*! modernizr 3.3.1 (Custom Build) | MIT *
* https://modernizr.com/download/?-inputtypes-setclasses !*/
!function(e,t,n){function a(e,t){return typeof e===t}function s(){var e,t,n,s,i,o,c;for(var u in r)if(r.hasOwnProperty(u)){if(e=[],t=r[u],t.name&&(e.push(t.name.toLowerCase()),t.options&&t.options.aliases&&t.options.aliases.length))for(n=0;n<t.options.aliases.length;n++)e.push(t.options.aliases[n].toLowerCase());for(s=a(t.fn,"function")?t.fn():t.fn,i=0;i<e.length;i++)o=e[i],c=o.split("."),1===c.length?Modernizr[c[0]]=s:(!Modernizr[c[0]]||Modernizr[c[0]]instanceof Boolean||(Modernizr[c[0]]=new Boolean(Modernizr[c[0]])),Modernizr[c[0]][c[1]]=s),l.push((s?"":"no-")+c.join("-"))}}function i(e){var t=u.className,n=Modernizr._config.classPrefix||"";if(f&&(t=t.baseVal),Modernizr._config.enableJSClass){var a=new RegExp("(^|\\s)"+n+"no-js(\\s|$)");t=t.replace(a,"$1"+n+"js$2")}Modernizr._config.enableClasses&&(t+=" "+n+e.join(" "+n),f?u.className.baseVal=t:u.className=t)}function o(){return"function"!=typeof t.createElement?t.createElement(arguments[0]):f?t.createElementNS.call(t,"http://www.w3.org/2000/svg",arguments[0]):t.createElement.apply(t,arguments)}var l=[],r=[],c={_version:"3.3.1",_config:{classPrefix:"",enableClasses:!0,enableJSClass:!0,usePrefixes:!0},_q:[],on:function(e,t){var n=this;setTimeout(function(){t(n[e])},0)},addTest:function(e,t,n){r.push({name:e,fn:t,options:n})},addAsyncTest:function(e){r.push({name:null,fn:e})}},Modernizr=function(){};Modernizr.prototype=c,Modernizr=new Modernizr;var u=t.documentElement,f="svg"===u.nodeName.toLowerCase(),p=o("input"),d="search tel url email datetime date month week time datetime-local number range color".split(" "),m={};Modernizr.inputtypes=function(e){for(var a,s,i,o=e.length,l="1)",r=0;o>r;r++)p.setAttribute("type",a=e[r]),i="text"!==p.type&&"style"in p,i&&(p.value=l,p.style.cssText="position:absolute;visibility:hidden;",/^range$/.test(a)&&p.style.WebkitAppearance!==n?(u.appendChild(p),s=t.defaultView,i=s.getComputedStyle&&"textfield"!==s.getComputedStyle(p,null).WebkitAppearance&&0!==p.offsetHeight,u.removeChild(p)):/^(search|tel)$/.test(a)||(i=/^(url|email)$/.test(a)?p.checkValidity&&p.checkValidity()===!1:p.value!=l)),m[e[r]]=!!i;return m}(d),s(),i(l),delete c.addTest,delete c.addAsyncTest;for(var h=0;h<Modernizr._q.length;h++)Modernizr._q[h]();e.Modernizr=Modernizr}(window,document);
}
/**
* ghBrowser
*
* @module browser
* @owner Nick Barone
*/
var ghBrowser = ghBrowser || {
/**
* getUserAgent
*
* @returns {string}
*/
getUserAgent: function() {
return navigator.userAgent;
},
/**
* isChrome
*
* @returns {bool}
*/
isChrome: function() {
return (this.getUserAgent().indexOf('Chrome') !== -1);
},
/**
* isSafari
*
* @returns {bool}
*/
isSafari: function() {
return (this.getUserAgent().indexOf('Safari') !== -1 && this.getUserAgent().indexOf('Chrome') === -1);
},
/**
* isOpera
*
* @returns {bool}
*/
isOpera: function() {
return (this.getUserAgent().indexOf('Opera') !== -1 || this.getUserAgent().indexOf('OPR') !== -1);
},
/**
* isFirefox
*
* @returns {bool}
*/
isFirefox: function() {
return (this.getUserAgent().indexOf('Firefox') !== -1);
},
/**
* isIE
*
* @returns {bool}
*/
isIE: function() {
if (navigator.appName === 'Microsoft Internet Explorer') {
return (this.getUserAgent().indexOf('MSIE') !== -1);
}
else if (navigator.appName === 'Netscape') {
return (this.getUserAgent().indexOf('Trident') !== -1);
}
return false;
},
/**
* isIEVersion
*
* @param {int} version
* @returns {bool}
*/
isIEVersion: function(version) {
return (this.isIE() && this.getUserAgent().indexOf('MSIE ' + version) !== -1);
},
/**
* isTouch
*
* @returns {bool}
*/
isTouch: function() {
return (('ontouchstart' in window) || (navigator.msMaxTouchPoints > 0));
},
};
/**
* ghUtils
* Provides core application utilities for use
* throughout PeopleMobile.
*
* @module utils
* @owner Nick Barone
*/
var ghUtils = ghUtils || {
/**
* onceHashCollection
* Stores hash data for once() method
*
* @ignore
* @type {obj}
*/
onceHashCollection: {},
/**
* keepTogether
* Keeps elements together
*
* @deprecates keepTogether
* @param {jQuery} elems
* @returns {null}
*/
keepTogether: function(elems) {
// turn string to jQuery objs for backwards compatibility
for (var i = 0; i < elems.length; i++) {
elems[i] = this.jqElem(elems[i]);
}
var previous, current;
for (i = 0; i < elems.length; i++) {
previous = current;
current = elems[i];
current.addClass('gstogether');
if (previous) {
previous.after(current);
}
}
return;
},
/**
* moveField
*
* @deprecates moveField
* @ignore
* @param {jQuery} field Field to move
* @param {jQuery} target Target of moved field
* @param {bool} moveBefore Set to TRUE to move field before target
* @returns {null}
*/
moveField: function(field, target, moveBefore) {
field = this.jqElem(field).closest('td');
target = this.jqElem(target).closest('td');
if (moveBefore) {
// move before
field.insertBefore(target);
}
else {
// move after
field.insertAfter(target);
}
return;
},
/**
* moveFieldAfter
*
* @deprecates moveFieldAfter
* @param {jQuery} field Field to move
* @param {jQuery} target Target of moved field
* @returns {null}
*/
moveFieldAfter: function(field, target) {
return this.moveField(field, target, false);
},
/**
* moveFieldBefore
*
* @deprecates moveFieldBefore
* @param {jQuery} field Field to move
* @param {jQuery} target Target of moved field
* @returns {null}
*/
moveFieldBefore: function(field, target) {
return this.moveField(field, target, true);
},
/**
* jqElem
* Returns a jQuery object of a given
* string or existing jQuery object
*
* @ignore
* @param {(string|jQuery)} elem
* @returns {jQuery}
*/
jqElem: function(elem) {
if (elem === undefined) return;
if (elem.jquery) return elem;
ghLog.error('Please update your code to use a jQuery object.');
return ghmob(elem);
},
/**
* elemExists
*
* @ignore
* @param {jQuery} elem
* @returns {bool}
*/
elemExists: function(elem) {
return !!elem.length;
},
/**
* isInteger
* Determines if a string/number is an integer
*
* @param {string} value
* @returns {bool}
*/
isInteger: function(value) {
return !isNaN(value) && (function(x) {
return (x | 0) === x;
})(parseFloat(value));
},
/**
* removeEmpty
* Remove empty elements
*
* @deprecates removeEmptyElements
* @param {(string|array)} elem
* @param {bool} [hideElem = false] Hides element instead of removing it (defaults to false)
* @param {jQuery} [scope]
* @returns {null}
*/
removeEmpty: function(elem, hideElem, scope) {
scope = (scope) ? scope : ghmob(document);
// convert string to array
if (!(elem instanceof Array)) elem = [elem];
// loop thru each elem
ghmob.each(elem, function(k, selector) {
ghmob(selector, scope)
.not('.ui-icon')
.not('.fa')
.not('.ui-popup-screen')
.each(function() {
if (ghmob(this).text().trim() === '' && !ghUtils.containsNonText(ghmob(this))) {
if (hideElem === true) {
ghmob(this).hide();
}
else {
ghmob(this).remove();
}
}
});
});
return;
},
/**
* containsNonText
* Determines if there are any non text child elements
*
* @param {jQuery} elem
* @returns {bool}
*/
containsNonText: function(elem) {
return (elem.find('img, input, .ui-icon, .fa, textarea').length > 0);
},
/**
* cleanTextNodes
* Cleans up any raw text nodes
*
* @param {jQuery} container
* @returns {null}
*/
cleanTextNodes: function(container) {
container = (container) ? container : 'body';
ghmob(container).contents().filter(function() {
return this.nodeType === 3;
}).remove();
return;
},
/**
* removeDuplicates
* Remove any duplicate elements and return
* the last element of the group
*
* @param {jQuery} elem
* @param {bool} getFirst
* @returns {jQuery}
*/
removeDuplicates: function(elem, getFirst) {
// check if element is unique
if (elem.length < 2) return elem;
// clean and return elements
if (getFirst) {
elem.not(':first').remove();
return elem.first();
}
elem.not(':last').remove();
return elem.last();
},
/**
* fixLeftElements
* Fix elements with the ID "Left"
*
* @backend
* @ignore
* @returns {null}
*/
fixLeftElements: function() {
if (ghPage.getName() === undefined) return;
ghmob('[id="Left"]').each(function(k) {
ghmob(this).attr('id', 'Left' + k + '-' + ghPage.getName());
});
return;
},
/**
* fixDeleteButtons
* Removes the popups from delete buttons
*
* @ignore
* @returns {null}
*/
fixDeleteButtons: function() {
ghmob('.PTROWDELETE1').each(function() {
ghmob(this).attr('href', 'javascript:aAction_' + ghPage.getWin() + '(document.' + ghPage.getWin() + ',"' + ghmob(this).attr('href').split('\'')[1].split('\'')[0] + '");');
});
return;
},
/**
* addLabelIfNeeded
*
* @param {jQuery} field - Use actual field with panel information
* @param {string} label
* @returns {void}
*/
addLabelIfNeeded: function(field, label) {
if (field.find('> label').length === 0) {
field.prepend('<label class="ui-input-text">' + label + '</label>');
}
},
/**
* attachText
* Attach the text of one element to another
* Useful for attaching currency to an amount
*
* @param {jQuery} attachTo
* @param {(jQuery|string)} attachText
* @param {bool} recursive Gets the $x id from attachTo and matches it to attachText, runs recursively
* @param {bool} keepVisible Keeps the attached texts original element visible
* @returns {null}
*/
attachText: function(attachTo, attachText, recursive, keepVisible) {
if (attachText instanceof String) {
attachTo.html(attachTo.html() + ' ' + attachText);
attachTo.addClass('gh-attachText-complete');
return;
}
if (!attachTo.length || !attachText.length) return;
// hide attachText
if (keepVisible !== true) {
attachText.hide();
}
if (recursive === true) {
ghmob(attachTo).each(function() {
if (ghmob(this).hasClass('gh-attachText-complete')) return;
// append text
ghmob(this).html(ghmob(this).html() + ' ' + ghmob('[id="' + attachText.attr('id').split('$')[0] + '$' + ghUtils.getFieldKey(ghmob(this)) + '"]').text().trim());
ghmob(this).addClass('gh-attachText-complete');
});
}
else {
ghmob(attachTo).each(function() {
if (ghmob(this).hasClass('gh-attachText-complete')) return;
// append text
ghmob(this).html(ghmob(this).html() + ' ' + attachText.text().trim());
ghmob(this).addClass('gh-attachText-complete');
});
}
return;
},
/**
* replaceInputWithText
* Replaces an input field with its value or a defined text string
*
* @param {jQuery} elem Element to replace
* @param {string} [text] Optional text to replace input with, input value if not defined
* @param {string} [noValueMessage] Replaces input field if the value is blank
* @returns {null}
*/
replaceInputWithText: function(elem, text, noValueMessage) {
if (elem.find('.gh-input-replace').length) return;
// if elem is the container, find the input
if (!elem.is('input') && !elem.is('select') && !elem.is('textarea')) {
elem = elem.find('input, select, textarea').first();
}
// return if nothing found
if (!elem.length) return;
// replace with text if defined
if (text !== undefined && text !== null) {
elem.replaceWith('<span class="gh-input-replace">' + text + '</span>');
return;
}
// input field
if (elem.is('input')) {
// get field container
var container = elem.closest('div[data-role="fieldcontain"]');
// hold label
if (container.find('> label').length) {
var labelHold = container.find('> label').clone();
}
// no value message
if (elem.attr('value') === '' && (noValueMessage !== undefined && noValueMessage !== null)) {
container.html('<span class="gh-input-replace">' + noValueMessage + '</span>');
}
else {
container.html('<span class="gh-input-replace">' + elem.attr('value') + '</span>');
}
// apply label
if (labelHold !== undefined) {
container.prepend(labelHold);
}
return;
}
// select field
if (elem.is('select')) {
if (elem.find(':selected').text().trim() === '' && (noValueMessage !== undefined && noValueMessage !== null)) {
elem.closest('div[data-role="fieldcontain"]').replaceWith('<span class="gh-input-replace">' + noValueMessage + '</span>');
return;
}
elem.closest('div[data-role="fieldcontain"]').replaceWith('<span class="gh-input-replace">' + elem.find(':selected').text() + '</span>');
return;
}
// textarea field
if (elem.is('textarea')) {
if (elem.html().trim() === '' && (noValueMessage !== undefined && noValueMessage !== null)) {
elem.closest('div[data-role="fieldcontain"]').replaceWith('<span class="gh-input-replace">' + noValueMessage + '</span>');
return;
}
elem.closest('div[data-role="fieldcontain"]').replaceWith('<span class="gh-input-replace">' + elem.html() + '</span>');
return;
}
return;
},
/**
* moveToBottom
* Move element to bottom of parent container
* Will select the closest actualElem if defined
*
* @param {jQuery} elem The best selector for the element
* @param {string} actualElem The actual element to move
* @returns {null}
*/
moveToBottom: function(elem, actualElem) {
var elemToMove = (actualElem) ? elem.closest(actualElem) : elem;
elemToMove.parent().append(elemToMove);
return;
},
/**
* getFieldKey
* Returns the field key of a given element
*
* @ignore
* @param {jQuery} elem
* @returns {int}
*/
getFieldKey: function(elem) {
if (elem.length < 1) return null;
var splitElemId = elem.attr('id').split('$');
return parseInt(splitElemId[splitElemId.length - 1]);
},
/**
* getWinTop
* Get actual window top
*
* @returns {obj}
*/
getWinTop: function() {
try {
if (typeof window['top'].document !== 'undefined' && typeof window['top']['ghPage'] !== 'undefined' && typeof window['top']['ghPage']['getName'] !== 'undefined') {
return window['top'];
}
return window;
}
catch (err) {
return window;
}
},
/**
* getPSTop
* Get PeopleSoft top
*
* @returns {obj}
*/
getPSTop: function() {
try {
if (typeof window.MTop().document === 'undefined') {
return ghUtils.getWinTop();
}
return window.MTop();
}
catch (err) {
return ghUtils.getWinTop();
}
},
/**
* hideDeviceKeyboard
* Hide the keyboard on a device
*
* @returns {null}
*/
hideDeviceKeyboard: function() {
try {
if (document.activeElement.type === 'checkbox' || document.activeElement.type === 'radio') return;
ghmob(document.activeElement).trigger('blur');
}
catch (err) {
ghLog.info('hideDeviceKeyboard: No active element to blur');
}
try {
ghmob('input').trigger('blur');
}
catch (err) {
ghLog.info('hideDeviceKeyboard: No input element to blur');
}
return;
},
/**
* toggleMobileRender
*
* @ignore
* @returns {void}
*/
toggleMobileRender: function() {
ghmob.ajax({
url: window.freemarker.url.relativePath + 's/WEBLIB_GS_MOBL.ISCRIPT1.FieldFormula.iScript_Nav?cmd=logout&gsmobile=0',
async: false,
cache: false,
success: function() {
ghmob.ajax({
url : document.location.href,
async: false,
cache: false,
data: {
'cmd': 'login',
},
success: function() {
var href = document.location.href;
var newHref = href.replace('gsmobile=1', '');
document.location = (href.indexOf('cmd=') === -1)
? newHref + ((href.indexOf('?') === -1) ? '?' : '&') + 'gsmobile=0&return_to_portal=1'
: newHref + '&gsmobile=0';
},
});
},
});
},
/**
* dateTime
*
* @ignore
* @type {obj}
*/
dateTime: {
/**
* toLocaleDateString
*
* @ignore
* @param {string} dateValue
* @returns {string}
*/
toLocaleDateString: function(dateValue) {
var d = new Date(dateValue);
var opts = { month: '2-digit', day: '2-digit', year: 'numeric', timeZone: 'UTC' };
d = d.toLocaleString('en-US', opts);
return d;
},
/**
* toISOStringFull
*
* @ignore
* @param {string} dateValue
* @returns {string}
*/
toISOStringFull: function(dateValue) {
try {
var d = new Date(dateValue).toISOString();
if (dateValue.indexOf(':') === -1 && d.indexOf('T00:00:00.000Z') > -1) {
d = d.replace('T00:00:00.000Z', 'T12:00:00.000Z');
}
return (d);
}
catch (ex) {
ghLog.error('Unable to parse ISO Date from given string: ' + dateValue);
return dateValue;
}
},
/**
* toISOString
*
* @ignore
* @param {string} dateValue
* @returns {string}
*/
toISOString: function(dateValue) {
var d = ghUtils.dateTime.toISOStringFull(dateValue);
return (d.substring(0, d.indexOf('T')));
},
/**
* toMilitaryTime
*
* @ignore
* @param {string} timeValue
* @returns {string}
*/
toMilitaryTime: function(timeValue) {
var timeArray = timeValue.split(':');
if (timeValue.indexOf('PM') > -1) {
if (parseInt(timeArray[0]) !== 12) {
timeArray[0] = parseInt(timeArray[0]) + 12;
}
}
else if (parseInt(timeArray[0]) >= 12) {
timeArray[0] = parseInt(timeArray[0]) - 12;
}
timeArray[1] = timeArray[1].replace('AM', '').replace('PM', '');
var newTime;
if (timeArray[0] < 10) {
newTime = '0' + timeArray[0] + ':' + timeArray[1] + ':00.000';
}
else {
newTime = timeArray[0] + ':' + timeArray[1] + ':00.000';
}
return newTime;
},
/**
* toStandardTime
*
* @ignore
* @param {string} timeValue
* @returns {string}
*/
toStandardTime: function(timeValue) {
var newTime = timeValue.replace(':00.000', '');
var timeArray = newTime.split(':');
var ampm = 'AM';
if (parseInt(timeArray[0]) >= 12) {
if (parseInt(timeArray[0]) !== 12) {
timeArray[0] = timeArray[0] - 12;
}
ampm = 'PM';
}
else if (parseInt(timeArray[0]) === 0) {
timeArray[0] = 12;
}
return (timeArray[0] + ':' + timeArray[1] + ampm);
},
},
/**
* hash
* Creates a hash of the given string
*
* @param {string} hashString
* @returns {string} hash
*/
hash: function(hashString) {
var hash = 0, chr;
hashString = '' + hashString;
if (hashString.length === 0) return hash;
for (var i = 0, len = hashString.length; i < len; i++) {
chr = hashString.charCodeAt(i);
hash = ((hash << 5) - hash) + chr;
hash |= 0;
}
return hash;
},
/**
* once
* Executes the function only once in a given interval
*
* @param {function} callback
* @param {int} interval
* @param {bool} global Sets global hash collection for frame embedded pages
* @returns {function|bool}
*/
once: function(callback, interval, global) {
// turn callback into a string that can be keyed and hash it
var onceHash = '' + this.hash('' + callback);
var hashCollection = this.onceHashCollection;
if (global === true) {
if (window.MTop().ghOnceHashCollection === undefined) {
window.MTop().ghOnceHashCollection = {};
}
hashCollection = window.MTop().ghOnceHashCollection;
}
if (hashCollection[onceHash] !== true) {
hashCollection[onceHash] = true;
setTimeout(function() {
delete hashCollection[onceHash];
}, interval);
return callback();
}
return false;
},
/**
* delayStack
*
* @ignore
* @type {array}
*/
delayStack: [],
/**
* delayFull
*
* @ignore
* @type {array}
*/
delayFull: [],
/**
* delay
* Delay the call of a block
*
* @param {function} callback
* @param {int} [timeout=0]
* @returns {function}
*/
delay: function(callback, timeout) {
timeout = (timeout) ? timeout : 0;
if (this.delayStack.indexOf(timeout) === -1) {
this.delayStack.push(timeout);
if (this.delayFull.length === 0 || this.delayFull[0] < timeout) {
this.delayFull[0] = timeout;
}
}
return setTimeout(callback, timeout);
},
/**
* alertDeprecated
* Alerts user of deprecated function use and includes
* a stack trace to update the reference
*
* @ignore
* @param {function} newMethod
* @param {string} newMethodString
* @returns {function}
*/
alertDeprecated: function(newMethod, newMethodString) {
// display only in debug mode
if (!ghConfig.core.debugMode) return newMethod;
if (newMethodString === undefined) {
ghLog.error(arguments.callee.caller.name + '() is deprecated. See documentation for new method.');
}
else {
ghLog.error(arguments.callee.caller.name + '() is deprecated. Update your code to use ' + newMethodString + '.');
}
return newMethod;
},
};
/**
* ghLog
*
* @module log
* @author Nick Barone
* @config useStack [true, false]
*/
var ghLog = ghLog || {
/**
* stack
* Contains all of the produced logs
*
* @type {object}
*/
stack: {
log: [],
event: [],
info: [],
warn: [],
error: [],
},
/**
* logLevelIndex
*
* @private
* @type {array}
*/
_logLevelIndex: [
'OFF',
'PERFORMANCE',
'ERROR',
'WARN',
'EVENT',
'INFO',
'DEBUG',
],
/**
* getLogLevel
*
* @private
* @return {int}
*/
_getLogLevel: function() {
return ghConfig.core.logLevel;
},
/**
* getLogLevelAsNumber
*
* @private
* @returns {int}
*/
_getLogLevelAsNumber: function() {
return this._logLevelIndex.indexOf(this._getLogLevel());
},
/**
* pushToStack
*
* @private
* @param {string} type
* @param {array} logArguments
* @returns {void}
*/
_pushToStack: function(type, logArguments) {
if (ghConfig.log.useStack === false) return;
if (this.stack[type] === undefined) {
this.stack[type] = [];
}
this.stack[type].push(logArguments);
},
/**
* log
* Logs a standard message to console when log level is DEBUG or greater
*
* @param {...*} arguments
* @returns {(console|void)}
*/
log: function() {
this._pushToStack('log', arguments);
if (this._getLogLevelAsNumber() >= 6) {
return console.log.apply(console, arguments);
}
},
/**
* info
* Logs an info message to console when log level is INFO or greater
*
* @param {...*} arguments
* @returns {(console|void)}
*/
info: function() {
this._pushToStack('info', arguments);
if (this._getLogLevelAsNumber() >= 5) {
return console.info.apply(console, arguments);
}
},
/**
* event
* Logs an event message to console when log level is EVENT or greater
*
* @param {...*} arguments
* @returns {(console|void)}
*/
event: function() {
this._pushToStack('event', arguments);
if (this._getLogLevelAsNumber() >= 4) {
return console.info.apply(console, arguments);
}
},
/**
* warn
* Logs a warn message to console when log level is WARN or greater
*
* @param {...*} arguments
* @returns {(console|void)}
*/
warn: function() {
this._pushToStack('warn', arguments);
if (this._getLogLevelAsNumber() >= 3) {
return console.warn.apply(console, arguments);
}
},
/**
* error
* Logs an error message to console when log level is ERROR
*
* @param {...*} arguments
* @returns {(console|void)}
*/
error: function() {
this._pushToStack('error', arguments);
if (this._getLogLevelAsNumber() >= 2) {
return console.error.apply(console, arguments);
}
},
/**
* group
* Groups messages to console when debug mode is on
*
* @param {...*} arguments
* @returns {(console|void)}
*/
group: function() {
if (this._getLogLevelAsNumber() >= 1) {
return console.groupCollapsed.apply(console, arguments);
}
},
/**
* groupEnd
* Ends group messages to console when debug mode is on
*
* @param {...*} arguments
* @returns {(console|void)}
*/
groupEnd: function() {
if (this._getLogLevelAsNumber() >= 1) {
return console.groupEnd.apply(console, arguments);
}
},
/**
* performanceStart
* Start performance logging
*
* @param {string} label
* @returns {void}
*/
performanceStart: function(label) {
if (this._getLogLevelAsNumber() >= 1 === true) {
console.time(label);
}
},
/**
* performanceEnd
* End performance logging
*
* @param {string} label
* @returns {void}
*/
performanceEnd: function(label) {
if (this._getLogLevelAsNumber() >= 1 === true) {
console.timeEnd(label);
}
},
/**
* getStack
*
* @returns {object}
*/
getStack: function() {
return this.stack;
},
};
/**
* ghInit
*
* @module init
*/
var ghInit = ghInit || {
/**
* awaitingIncomingScripts
*
* @type {bool}
*/
awaitingIncomingScripts: false,
/**
* eventHandlersLoaded
*
* @private
* @type {bool}
*/
_eventHandlersLoaded: false,
/**
* eventHandlersFired
*
* @private
* @type {array}
*/
_eventHandlersFired: [],
/**
* eventQueue
*
* @private
* @type {array}
*/
_eventQueue: [],
/**
* events
*
* @private
* @ignore
* @type {obj}
*/
_events: {},
/**
* modulePriority
*
* @private
* @ignore
* @type {obj}
*/
_modulePriority: {
'ghState': 1,
'ghPage': 2,
'ghPanel': 2,
'ghPersist': 2,
'ghBrowser': 2,
'ghLog': 2,
'ghUtils': 2,
'ghButton': 2,
'ghForm': 2,
'ghUser': 3,
'ghContainer': 3,
'ghHeader': 4,
'ghIcons': 5,
'ghPopup': 5,
'ghModal': 5,
'ghFooter': 5,
'ghAjax': 5,
'ghInterface': 51,
'ghAccessibility': 52,
'ghTable': 53,
'ghSubmenu': 54,
'ghPager': 54,
'ghMultiStep': 54,
'ghLegend': 54,
'ghAttachments': 54,
'ghGuide': 54,
},
/**
* configDefaults
* Default configuration
*
* @private
* @ignore
* @type {obj}
*/
_configDefaults: {
pageName: null,
force: false,
eventType: 'pageinit',
delay: false,
module: false,
runCondition: true,
reloadCondition: false,
searchPage: false,
priority: 100,
scope: null,
},
/**
* registeredExtensions
*
* @private
* @ignore
* @type {obj}
*/
_registeredExtensions: {},
/**
* scopedModuleMethods
*
* @private
* @type {obj}
*/
_scopedModuleMethods: {},
/**
* fieldUpdateQueue
*
* @private
* @type {array}
*/
_fieldUpdateQueue: [],
/**
* transactions
*
* @private
* @ignore
* @type {obj}
*/
_transactions: {},
/**
* transactionStub
*
* @private
* @ignore
* @type {object}
*/
_transactionStub: {
/**
* model
* Stores all transaction data to be accessed
* or updated within Transaction Module
*
* @private
* @ignore
* @type {object}
*/
_model: {},
/**
* fields
* Stores all field data to be accessed within the
* Transaction module
*
* @private
* @ignore
* @type {object}
*/
_fields: {},
/**
* $model
* Retrieves or sets information in the model
*
* @ignore
* @param {string} entry
* @param {string} [value]
* @returns {any}
*/
$model: function(entry, value) {
// Set model entry if value is defined
if (value !== undefined) {
this._model[entry] = value;
return true;
}
// get model entry
var modelEntry = this._model[entry];
// Ensure model entry exists
if (modelEntry === undefined) {
console.error('Entry not found in model: ' + this.__identifier + '/' + entry, this);
}
return modelEntry;
},
/**
* $field
* Retrieves information from the field model
*
* @ignore
* @param {string} entry
* @param {number} [increment]
* @returns {any}
*/
$field: function(entry, increment) {
// get field entry
var field = this._fields[entry];
var fieldQuery;
// dot notated entry, reduce
if (entry.indexOf('.') > -1) {
field = entry.split('.').reduce(function(fields, i) {
return fields[i];
}, this._fields);
}
// Ensure field entry exists
if (field === undefined) {
console.error('Field not found in field definition: ' + this.__identifier + '/' + entry);
}
// Check if entry is jQuery
if (typeof field === 'object' && typeof $ === 'object' && field instanceof $) {
return ghmob(field.selector);
}
// Check for a string
if (typeof field === 'string') {
// replace @ with current winX
if (field.indexOf('@') > -1) {
field = field.replace('@', ghPage.getWin());
}
// Increment field if the value ends with $
if (increment !== undefined && field.endsWith('$') === true) {
return ghmob(field.replace('$', '\\$') + increment);
}
return ghmob(field);
}
// Check for a function
if (typeof field === 'function') {
return field.call(this);
}
// Check for entry as fieldID only
if (typeof field === 'number') {
fieldQuery = ghPage.getField(this.__identifier, field);
if (increment !== undefined) {
return fieldQuery.filter(function() {
if (ghmob(this).is('th') === true) return;
return ghmob(this).attr('id').endsWith('$' + increment);
});
}
return fieldQuery;
}
// Check for entry as fieldID and defined panel
if (typeof field === 'object') {
// Ensure field is setup with both properties
if (field.panel === undefined || field.field === undefined) {
console.error('Field not set with valid property definitions: ' + this.__identifier + '/' + entry);
}
fieldQuery = ghPage.getField(field.panel, field.field);
if (increment !== undefined) {
return fieldQuery.filter(function() {
return ghmob(this).attr('id').endsWith('$' + increment);
});
}
return fieldQuery;
}
return;
},
/**
* onPageBeforeCreate
* Code to run on 'pagebeforecreate'
*
* @ignore
* @returns {object} this
*/
onPageBeforeCreate: function() {
return this;
},
/**
* onAjaxUpdate
* Code to run on 'ajaxupdate'
*
* @ignore
* @returns {object} this
*/
onAjaxUpdate: function() {
return this;
},
/**
* onFieldUpdate
* Code to run on 'fieldupdate'
*
* @ignore
* @returns {object} this
*/
onFieldUpdate: function() {
return this;
},
/**
* onPageUpdate
* Code to run on 'pageupdate'
*
* @ignore
* @returns {object} this
*/
onPageUpdate: function() {
return this;
},
/**
* run
*
* @ignore
* @returns {object} this
*/
run: function() {
return this;
},
},
/**
* getPriorityRange
* Get an array of all given priorities
*
* @private
* @ignore
* @param {string} [eventType=pageinit] - Trigger to run events from
* @returns {array}
*/
_getPriorityRange: function(eventType) {
var priorityRange = [];
// set eventType
eventType = (eventType) ? eventType : 'pageinit';
// loop thru all events
for (var eventConfig in this._events[eventType]) {
priorityRange.push(this._events[eventType][eventConfig].priority);
}
// remove duplicate priorities
priorityRange = priorityRange.sort().filter(function(item, position, priorityArray) {
return !position || item !== priorityArray[position - 1];
});
// sort numerically
priorityRange = priorityRange.sort(function(a, b) {
return a - b;
});
return priorityRange;
},
/**
* getExtensions
*
* @private
* @ignore
* @returns {array}
*/
_getExtensions: function() {
if (ghConfig.core.extensions !== undefined) {
return (Array.isArray(ghConfig.core.extensions) === true) ? ghConfig.core.extensions : [ghConfig.core.extensions];
}
// Add empty extensions array
ghConfig.core.extensions = [];
return [];
},
/**
* extendModule
*
* @private
* @ignore
* @param {obj} scope
* @param {string} [moduleName] Name of module to be included only on core modules
* @returns {null}
*/
_extendModule: function(scope, moduleName) {
var isCoreModule = !!moduleName;
// Get module string name
moduleName = (moduleName) ? moduleName : scope.__identifier;
// push registered extensions
if (this._registeredExtensions[moduleName] !== undefined) {
ghLog.info('Merging registered extensions into ' + moduleName);
if (scope.$extensions === undefined) {
scope.$extensions = {};
}
if (isCoreModule) {
window[moduleName].$extensions = ghmob.extend(true, {}, scope.$extensions, this._registeredExtensions[moduleName]);
}
else {
this._transactions[moduleName].$extensions = ghmob.extend(true, {}, scope.$extensions, this._registeredExtensions[moduleName]);
}
}
// exit if no extensions to process
if (scope.$extensions === undefined) return;
// push fluid extension
if (ghPage.isFluid() === true && scope.$extensions.fluid !== undefined) {
if (this._getExtensions().indexOf('fluid') === -1) {
ghConfig.core.extensions.push('fluid');
}
if (isCoreModule) {
window[moduleName] = ghmob.extend(true, {}, scope, scope.$extensions.fluid);
}
else {
this._transactions[moduleName] = ghmob.extend(true, {}, scope, scope.$extensions.fluid);
}
}
// push fluid environment extension
if ((ghPage.isFluid() === true || (sessionStorage.getItem('fluid-leftnav') && sessionStorage.getItem('fluid-leftnav').length > 0) || (ghmob('#DEFAULT_HEADER_FLUID') && ghmob('#DEFAULT_HEADER_FLUID').length > 0)) && scope.$extensions.fluidEnv !== undefined) {
if (this._getExtensions().indexOf('fluidEnv') === -1) {
ghConfig.core.extensions.push('fluidEnv');
}
if (isCoreModule) {
window[moduleName] = ghmob.extend(true, {}, scope, scope.$extensions.fluidEnv);
}
else {
this._transactions[moduleName] = ghmob.extend(true, {}, scope, scope.$extensions.fluidEnv);
}
}
// push client extension
if (scope.$extensions.client !== undefined) {
if (ghConfig.core.extensions.indexOf('client') === -1) {
ghConfig.core.extensions.push('client');
}
if (isCoreModule) {
window[moduleName] = ghmob.extend(true, {}, scope, scope.$extensions.client);
}
else {
this._transactions[moduleName] = ghmob.extend(true, {}, scope, scope.$extensions.client);
}
}
// push defined extension
var coreExtensions = this._getExtensions();
for (var i = 0; i < coreExtensions.length; i++) {
if (scope.$extensions[coreExtensions[i]] === undefined) return;
if (isCoreModule) {
window[moduleName] = ghmob.extend(true, {}, scope, scope.$extensions[coreExtensions[i]]);
// Remove extended $run event from base scope
if (window[moduleName].$run !== undefined) {
delete window[moduleName].$run;
}
}
else {
this._transactions[moduleName] = ghmob.extend(true, {}, scope, scope.$extensions[coreExtensions[i]]);
// Remove extended $run event from base scope
if (this._transactions[moduleName].$run !== undefined) {
delete this._transactions[moduleName].$run;
}
}
}
return;
},
/**
* registerExtension
*
* @param {string} module
* @param {string} extension
* @param {object} methods
* @returns {void}
*/
registerExtension: function(module, extension, methods) {
if (this._registeredExtensions[module] === undefined) {
this._registeredExtensions[module] = {};
}
if (this._registeredExtensions[module][extension] === undefined) {
this._registeredExtensions[module][extension] = {};
}
this._registeredExtensions[module][extension] = methods;
},
/**
* getExtendedRunEvent
*
* @private
* @ignore
* @param {obj} scope
* @param {function} [event]
* @returns {function}
*/
_getExtendedRunEvent: function(scope, event) {
return function() {
if (event === undefined) {
scope.run();
}
else {
event.call(scope);
}
// Check for scope level $run extension
if (scope.__$run !== undefined) {
scope.__$run();
}
// Check for extension $run methods
var coreExtensions = ghInit._getExtensions();
for (var i = 0; i < coreExtensions.length; i++) {
// Check if module has any defined extensions
if (scope.$extensions === undefined) return;
// Check if module has this extension
if (scope.$extensions[coreExtensions[i]] === undefined) return;
// Check if module has a complimentary $run method
if (scope.$extensions[coreExtensions[i]].$run === undefined) return;
// Call $run extension
scope.$extensions[coreExtensions[i]]['$run'].call(scope);
}
};
},
/**
* runQueuedEvents
*
* @private
* @returns {void}
*/
_runQueuedEvents: function() {
var _this = this;
this._eventQueue.forEach(function(event) {
_this._runEvent(event.hash, _this._events[event.type][event.hash]);
});
},
/**
* runEvent
*
* @private
* @param {string} eventHash
* @param {obj} config
* @returns {null|void}
*/
_runEvent: function(eventHash, config) {
// return if no event
if (config.event === null || config.event === undefined) {
ghLog.info('ghInit: No event given for ' + config.pageName);
return;
}
ghLog.log(config.pageName);
// set scope
var thisScope = (config.module) ? window[config.pageName] : window;
// override scope if explicitly defined
thisScope = (config.scope === null) ? thisScope : config.scope;
// run condition
if (config.runCondition === false) {
ghLog.info('ghInit: Run condition false for ' + config.pageName, config);
return;
}
// force condition
if (config.force === false && (ghPage.getName() !== config.pageName && ghPage.getPanels().indexOf(config.pageName) < 0)) {
ghLog.info('ghInit: Force condition false, pageName does not match any panels on ' + config.pageName, config);
return;
}
// check for search page
if (!ghPage.isSearch() && config.searchPage === true) {
ghLog.info('ghInit: Not running because not on search page', config);
return;
}
// reload condition
if (config.reloadCondition === true) {
// reload page before running event
ghLog.info('ghInit: Reload condition true', config);
ghPage.reload();
return;
}
// delay
if (config.delay !== false) {
ghUtils.delay(function() {
ghLog.info('ghInit: Delay condition true', config);
// start logging
ghLog.performanceStart(config.pageName + eventHash);
// call event
config.event.call(thisScope);
// end logging
ghLog.performanceEnd(config.pageName + eventHash);
}, config.delay);
return;
}
ghLog.info('ghInit: Running ' + config.pageName + ' unconditionally', config);
// start logging
ghLog.performanceStart(config.pageName + eventHash);
// call event
config.event.call(thisScope);
// end logging
ghLog.performanceEnd(config.pageName + eventHash);
},
/**
* processEvents
*
* @private
* @param {string} [eventType=pageinit] - Trigger to run events from
* @param {obj} [eventData]
* @returns {void}
*/
_processEvents: function(eventType, eventData) {
// sustain this
var _this = this;
// set eventType
eventType = (eventType) ? eventType : 'pageinit';
// Reset event catalog on ajaxupdate
if (eventType === 'pageupdate' || eventType === 'fieldupdate') {
this._eventHandlersFired = [];
}
// check if pageinit has already been fired, and if
// so only process events queued after initial event
if (ghConfig.core.queueLateEvents === true && eventType === 'pageinit' && this._eventHandlersFired.indexOf('pageinit') > -1) {
this._runQueuedEvents();
return;
}
// push event handler into log
this._eventHandlersFired.push(eventType);
// return if no events to fire
if (this._events[eventType] === undefined || this._events[eventType].length === 0) return;
ghLog.group('ghInit: running ' + eventType);
// loop thru events by priority
var eventPriorityRange = this._getPriorityRange(eventType);
var eventsOfType = _this._events[eventType];
var fieldUpdate = ((this._eventHandlersFired.indexOf('fieldupdate') > -1 || this._eventHandlersFired.indexOf('pageupdate') > -1) && ghmob('.appsian-ready').length > 0);
if (ghPage.isIFrame()) {
ghLoader.hide();
}
ghUtils.getWinTop().ghLoader.show();
if (fieldUpdate === false || (eventType === 'pageupdate' && eventData !== undefined && eventData.fullPage === true)) {
ghmob('body').removeClass('appsian-ready');
}
for (var i = 0; i < eventPriorityRange.length; i++) {
var priority = eventPriorityRange[i];
ghLog.group('ghInit: Running priority scripts:', priority);
if (priority === -1) return;
for (var thisEvent in eventsOfType) {
if (eventsOfType[thisEvent].priority !== priority) continue;
var module = eventsOfType[thisEvent].pageName;
if (eventData !== undefined && eventData.fromAjaxUpdate === true && ghConfig.fieldScoping.modules.indexOf(module) > -1 && ghConfig.fieldScoping.enabled !== false) {
// Run as scoped event
if (this._fieldUpdateQueue.length === 0) continue;
var fullScope = this._fieldUpdateQueue.join(', ');
if (ghConfig.fieldScoping.debug === true) {
console.info('Running scoped formatting on ' + module, fullScope);
}
ghLog.performanceStart(module);
window[module].run(ghmob(fullScope));
ghLog.performanceEnd(module);
}
else {
_this._runEvent(thisEvent, eventsOfType[thisEvent]);
}
}
ghLog.groupEnd();
if (i === (eventPriorityRange.length - 1)) {
if (eventType === 'pageinit' || this._eventHandlersFired.indexOf('pageinit') > -1) {
ghmob('body').addClass('appsian-ready');
if (ghConfig.loader.delayPageShow === true) {
var delay = (typeof ghUtils.delayFull !== 'undefined' && typeof ghUtils.delayFull[0] !== 'undefined') ? ghUtils.delayFull[0] : 0;
if (ghPage.isActivityGuide() === false && ghPage.isIFrameModal() === false && (fieldUpdate === false || (eventType === 'pageupdate' && eventData !== undefined && eventData.fullPage === true))) {
ghmob('body', ghUtils.getWinTop().document).addClass('gh-hide-content');
}
ghUtils.delay(function() {
ghUtils.getWinTop().ghLoader.hide();
ghmob('body', ghUtils.getWinTop().document).removeClass('gh-hide-content');
ghmob(document).trigger('ghPageReady');
ghmob('.gh-field-hide').removeClass('gh-field-hide');
}, delay);
}
else {
ghUtils.getWinTop().ghLoader.hide();
ghmob(document).trigger('ghPageReady');
ghmob('.gh-field-hide').removeClass('gh-field-hide');
}
}
if ((fieldUpdate && eventData === undefined) || (eventType === 'pageupdate' && eventData === undefined)) {
ghUtils.getWinTop().ghLoader.hide();
}
}
}
if (eventType === 'pageinit' && eventData === undefined) {
ghInit._fieldUpdateQueue = [];
ghmob(document).trigger('ghResetFieldQueue');
}
ghLog.groupEnd();
},
/**
* module
* Attaches an event as a module
*
* @ignore
* @param {(string|obj)} config - Provide either just a module name, or a full configuration
* @param {function} [event] - Module run function
* @param {string} config.pageName - Name of module
* @param {int} [config.delay] - Can be set to 0 or higher for delayed start
* @returns {function} ghInit.attach
*/
module: function(config, event) {
// ensure config is created if string is given
if (typeof config === 'string') {
config = {
pageName: config,
};
}
// get module priority
config.priority = (this._modulePriority[config.pageName]) ? this._modulePriority[config.pageName] : 50;
// update config to force module code to run
config.force = true;
// set type as module
config.module = true;
// set scope
config.scope = window[config.pageName];
// check for field scoping
if (ghConfig.fieldScoping.modules.indexOf(config.pageName) > -1 && this._scopedModuleMethods[config.pageName] !== true) {
this._scopedModuleMethods[config.pageName] = true;
}
// extend module
this._extendModule(window[config.pageName], config.pageName);
// check if event given
event = this._getExtendedRunEvent(window[config.pageName], event);
// Attach to automated event methods
['Register', 'PageBeforeCreate', 'AjaxUpdate', 'PageUpdate', 'FieldUpdate'].forEach(function(moduleEvent) {
if (window[config.pageName]['on' + moduleEvent] === undefined) return;
if (moduleEvent === 'Register') {
window[config.pageName].onRegister.call(window[config.pageName]);
return;
}
ghInit.attach({
pageName: config.pageName,
eventType: moduleEvent.toLowerCase(),
force: config.force,
module: config.module,
priority: config.priority,
scope: config.scope,
}, function() {
return window[config.pageName]['on' + moduleEvent].call(window[config.pageName]);
});
});
return this.attach(config, event);
},
/**
* search
* Attaches an event as a search page script
*
* @ignore
* @param {(string|obj)} config - Provide either just a identifier, or a full configuration
* @param {function} [event] - Script run function
* @param {string} config.pageName - Unique name of script
* @param {int} [config.runCondition] - Conditional boolean to run code only when true
* @param {int} [config.delay] - Can be set to 0 or higher for delayed start
* @returns {function} ghInit.attach
*/
search: function(config, event) {
// ensure config is created if string is given
if (typeof config === 'string') {
config = {
pageName: config,
};
}
// check if event given
if (event === undefined || event === null) {
ghLog.error('ghInit: No event given');
}
// get module priority
config.priority = (this._modulePriority[config.pageName]) ? this._modulePriority[config.pageName] : 60;
// update config to force module code to run
config.force = true;
// set type as search script
config.searchPage = true;
return this.attach(config, event);
},
/**
* transaction
* Handles transaction initiation
*
* @ignore
* @param {string} identifier
* @param {obj} module
* @param {bool} [runCondition=true]
* @param {bool} [force=false]
* @returns {null}
*/
transaction: function(identifier, module, runCondition, force) {
// Check run condition
if (runCondition === false) return;
force = (force) ? force : false;
ghLog.info('Mounting', identifier);
// Extend transaction stub with provided module
var stubFrom = (this._transactions[identifier] === undefined) ? this._transactionStub : this._transactions[identifier];
this._transactions[identifier] = ghmob.extend(true, {}, stubFrom, module);
// Set private identifier inside module
this._transactions[identifier].__identifier = identifier;
// Push $run method into __$run
if (this._transactions[identifier].$run !== undefined) {
this._transactions[identifier].__$run = this._transactions[identifier].$run;
delete this._transactions[identifier].$run;
}
// Extend module
this._extendModule(this._transactions[identifier]);
// Get extended run event
this._transactions[identifier].__run = this._getExtendedRunEvent(this._transactions[identifier], this._transactions[identifier].run);
// Attach to main transaction runner (pageinit)
ghInit.attach({
pageName: identifier,
scope: this._transactions[identifier],
force: force,
}, this._transactions[identifier].__run);
// Attach to pagebeforecreate
ghInit.attach({
pageName: identifier,
eventType: 'pagebeforecreate',
scope: this._transactions[identifier],
force: force,
}, this._transactions[identifier].onPageBeforeCreate);
// Attach to ajaxupdate
ghInit.attach({
pageName: identifier,
eventType: 'ajaxupdate',
scope: this._transactions[identifier],
force: force,
}, this._transactions[identifier].onAjaxUpdate);
// Attach to fieldupdate
ghInit.attach({
pageName: identifier,
eventType: 'fieldupdate',
scope: this._transactions[identifier],
force: force,
}, this._transactions[identifier].onFieldUpdate);
// Attach to pageupdate
ghInit.attach({
pageName: identifier,
eventType: 'pageupdate',
scope: this._transactions[identifier],
force: force,
}, this._transactions[identifier].onPageUpdate);
return;
},
/**
* attach
* Provides additional configuration for pageinit
*
* @param {(string|obj)} config - Provide either just a pagename, or a full configuration
* @param {function} event - Page addon code to run
* @param {string} config.pageName - Name of page
* @param {string} config.name - Can be used in place of config.pageName
* @param {bool} [config.force] - Forces code to run regardless of pageName
* @param {(string|array)} [config.eventType] - Trigger to run events from
* @param {obj} [config.scope] - Sets the scope of the running module
* @param {int} [config.delay] - Can be set to 0 or higher for delayed start
* @param {bool} [config.runCondition] - Conditional boolean to run code only when true
* @param {bool} [config.reloadCondition] - Conditional boolean to reload the page when true
* @param {bool} [config.searchPage] - Conditional boolean to run code on a search page
* @returns {null}
*/
attach: function(config, event) {
// ensure config is created if string is given
if (typeof config === 'string') {
config = {
pageName: config,
};
}
config.pageName = (config.name === undefined) ? config.pageName : config.name;
// check if event given
if (event === undefined || event === null) {
ghLog.error('ghInit: No event given');
}
// merge config with defaults
config = ghmob.extend({}, this._configDefaults, config);
// create hash
var hash = ghUtils.hash(config.pageName + event);
// add event to config
config.event = event;
// Turn string eventType into array
config.eventType = (Array.isArray(config.eventType) === true) ? config.eventType : [config.eventType];
// Loop through eventType array
for (var i = 0; i < config.eventType.length; i++) {
// Debug log event information
ghLog.info('ghInit: Attaching new ' + config.eventType[i] + ' event', config);
// ensure eventType object exists
if (this._events[config.eventType[i]] === undefined) {
this._events[config.eventType[i]] = {};
}
// Queue event if pageinit has already fired
if (this._eventHandlersFired.indexOf('pageinit') > -1) {
this._eventQueue.push({
type: config.eventType[i],
hash: hash,
});
}
// add config to events object
this._events[config.eventType[i]][hash] = config;
}
return;
},
/**
* queueFieldUpdate
*
* @private
* @param {string} field
* @returns {void}
*/
_queueFieldUpdate: function(field) {
if (!field) throw new Error('No field given to field update queue');
var excludeFields = [
'divPSPANELTABLINKS',
'divPSPANELTABS',
'divPAGEBAR',
'divPSHIDDENFIELDS',
];
if (excludeFields.indexOf(field.replace('#' + ghPage.getWin(), '')) > -1) return;
this._fieldUpdateQueue.push(field);
},
/**
* loadEventHandlers
*
* @ignore
* @returns {void}
*/
loadEventHandlers: function() {
if (this._eventHandlersLoaded === true) return;
this._eventHandlersLoaded = true;
ghmob(document)
.off('pageinit.gh.init')
.on('pageinit.gh.init', function(event, data) {
ghInit._processEvents('pageinit', data);
});
ghmob(document)
.off('pagebeforecreate.gh.init')
.on('pagebeforecreate.gh.init', function() {
ghInit._processEvents('pagebeforecreate');
});
ghmob(document)
.off('ajaxupdate.gh.init')
.on('ajaxupdate.gh.init', function() {
ghInit._processEvents('ajaxupdate');
});
ghmob(document)
.off('fieldupdate.gh.init')
.on('fieldupdate.gh.init', function(event, data) {
ghInit._processEvents('fieldupdate', data);
});
ghmob(document)
.off('pageupdate.gh.init')
.on('pageupdate.gh.init', function(event, data) {
ghInit._processEvents('pageupdate', data);
});
// run scoped formatting
ghmob(document)
.off('fieldupdate.gh.init.scoped')
.on('fieldupdate.gh.init.scoped', function(event, field) {
if (field.isBeforeUpdate === true) return;
var fieldId = field.fieldId;
try {
// Temp fix for 3051+3053 (backend sending down wrong field ID)
if (field.fieldId.match(/^win\d+div\$ICField\$\d+\$$/g) !== null) {
fieldId = fieldId.split('$');
fieldId = [fieldId.shift(), fieldId.join('$')][1];
fieldId = ghPage.getWin() + 'div$' + fieldId.replace(/\$/g, '');
ghInit._queueFieldUpdate('#' + fieldId.replace(/\$/g, '\\$'));
}
// win2div$ICField$8$$0 -> win2div$ICField8$0
if (field.fieldId.match(/^win\d+div\$ICField\$\d+\$\$\d$/g) !== null) {
ghInit._queueFieldUpdate('#' + field.fieldId.replace('ICField$', 'ICField').replace('$$', '$').replace(/\$/g, '\\$'));
}
ghInit._queueFieldUpdate('#' + field.fieldId.replace(/\$/g, '\\$'));
}
catch (ex) {
ghLog.error(ex);
}
});
},
};
ghInit.loadEventHandlers();
ghInit.registerExtension('ghSubmenu', 'client', {
/**
* tableTabs
* Create submenus from Peoplesoft table tabs
*
* @deprecates psTabsToSubmenu
* @param {jQuery} selector
* @returns {void}
*/
tableTabs: function(selector) {
var _this = this;
// ensure jquery object
selector = ghUtils.jqElem(selector);
// loop through selectors
selector.each(function() {
if (selector.hasClass('gh-hidden') || selector.find(ghSubmenu.tableTabSelectors.join()).not('a').length > 0 || selector.parents('.ptalPgltAreaGroupsBar').length > 0)
return;
// make column toggle
var columnToggleOld;
var columnToggleNew = '';
if (ghConfig.submenu.columnToggle === true) {
// old toggle
if (selector.is('a[name="hidetabs"]')) {
columnToggleOld = selector;
} else {
columnToggleOld = selector.find('[name="hidetabs"]');
}
// new toggle
if (columnToggleOld.length > 0 && columnToggleOld.find('img').attr('src').indexOf('NO_TABS') !== -1) {
columnToggleNew = ghmob('<a href="#" class="gh-submenu-column-toggle ui-btn-inline ui-btn-icon-left fa fa-expand info">Show all columns</a>');
if (columnToggleOld.attr('href')) {
ghmob(columnToggleNew).attr('href', _this.forceSubmitActionToTop(columnToggleOld.attr('href')));
}
if (columnToggleOld.attr('onclick')) {
ghmob(columnToggleNew).attr('onclick', _this.forceSubmitActionToTop(columnToggleOld.attr('onclick')));
}
ghmob(columnToggleNew).button();
}
// hide old toggle
columnToggleOld.addClass('gh-hidden').attr('aria-hidden', 'true');
}
// check for more than one submenu link
if (ghmob(this).find('a').not('[name="hidetabs"]').length > 1) {
// get submenu html
var submenu = ghSubmenu.create();
// create and add unique identifier
var submenuId = 'gh-submenu-' + Math.round(Math.random() * 10000);
submenu = ghmob(submenu).attr('id', submenuId);
// get tabs and append to submenu as list items and links
var submenuItemLink;
var submenuActiveHeading = '';
ghmob(this).find('a').not('[name="hidetabs"]').each(function() {
ghmob(submenu).find('ul').append('<li><a>' + ghmob(this).text().trim() + '</a></li>');
if (ghPage.isTargetContent() === false) {
ghmob(submenu).find('ul > li:last-child a').attr('target', 'gh-top');
}
if (ghmob(this).attr('href') || ghmob(this).attr('onclick')) {
if (ghmob(this).attr('onclick')) {
submenuItemLink = ghmob(this).attr('onclick');
}
if (ghmob(this).attr('href')) {
submenuItemLink = ghmob(this).attr('href');
}
} else {
submenuItemLink = '#';
}
ghmob(submenu).find('li:last-child a').attr('href', submenuItemLink);
if (ghmob(this).is('[class*="selected"], [id*="selected"]') || ghmob(this).parents('[id*="selected"], [class*="selected"]').length > 0 || (typeof ghmob(this).attr('href') === 'undefined' && typeof ghmob(this).attr('onclick') === 'undefined')) {
ghmob(submenu).find('li:last-child').addClass('active').find('> a').attr('aria-current', 'page').attr('title', 'current page');
submenuActiveHeading = ghmob(this).text().trim();
}
});
// figure out where to put submenu in relation to table
if (ghmob(this).closest('.ui-collapsible').length > 0) {
var submenuParent = ghmob(this).closest('.ui-collapsible');
var submenuParentHeading = submenuParent.find('> .ui-collapsible-heading > .ui-collapsible-heading-toggle');
if (submenuParentHeading.find('.ui-btn-text').length > 0) {
submenuParentHeading = submenuParentHeading.find('.ui-btn-text').text().trim();
} else {
submenuParentHeading = submenuParentHeading.text().trim();
}
// create container and place it inside closest collapsible content
if (submenuParentHeading.indexOf(submenuActiveHeading) === -1) {
submenuParent = submenuParent.children('.ui-collapsible-content');
ghSubmenu.createContainer(submenu, submenuParent, submenuActiveHeading);
} else if (submenuParent.children('.gh-submenu-wrap').length === 0) {
submenuParent.children('.ui-collapsible-heading').wrapAll('<div class="gh-submenu-wrap"></div>');
submenu.appendTo(submenuParent.children('.gh-submenu-wrap'));
}
} else {
if (ghmob(this).closest('div[class="ui-body"]').length > 0 || ghmob(this).find('div[class="ui-body"]').length > 0) {
if (ghmob(this).closest('div[class="ui-body"]').length > 0) {
submenuParent = ghmob(this).closest('div[class="ui-body"]');
}
if (ghmob(this).find('div[class="ui-body"]').length > 0) {
submenuParent = ghmob(this).find('div[class="ui-body"]').first();
}
} else {
submenuParent = ghmob(this).closest('div[data-pnlname]');
}
ghSubmenu.createContainer(submenu, submenuParent, submenuActiveHeading);
}
// events
ghSubmenu.addEvent(ghmob('[id="' + submenuId + '"]'));
// insert column toggle in DOM
if (ghConfig.submenu.columnToggle === true) {
ghUtils.delay(function() {
if (columnToggleNew !== '' && submenuParent.find('.gh-submenu-column-toggle').length === 0) {
if (submenuParent.find('table.tablesaw').length > 0) {
columnToggleNew.prependTo(submenuParent.find('.tablesaw-bar.mode-swipe').first());
} else {
columnToggleNew.insertAfter(submenuParent.children('.gh-submenu-wrap'));
}
}
});
}
}
// hide tabs
selector.addClass('gh-hidden').attr('aria-hidden', 'true');
});
},
});
ghInit.registerExtension('ghInterface', 'client', {
/**
* buttons
* Default properties for buttons
*
* @type {array}
*/
buttons : [
{
color: 'info',
icon: 'fa-pencil',
id: '[id*="EDIT"]:not([id*="CREDIT"])',
text: 'Edit',
},
{
color: 'info',
icon: 'fa-pencil',
id: '[id*="UPDATE"]:not([id*="UPDATE_TOT"])',
text: 'Edit',
},
{
color: 'info',
icon: 'fa-paperclip',
id: '[id*="ATTACHMENTS"]',
text: 'Attachments',
useAltText: true,
},
{
color: 'success',
icon: 'fa-plus',
id: '[id*="ADD_PB"]',
text: 'Add',
},
{
color: 'success',
icon: 'fa-plus',
id: '.ps-button[id*="_ADD_"]',
text: 'Add',
},
{
color: 'info',
icon: 'fa-filter',
id: '.ps-button[id*="FILTER"]',
text: 'Filter',
},
{
id: '.ps-button[id*="DRILLIN"]',
text: 'Details',
},
{
color: 'success',
icon: 'fa-plus',
id: '[class*="PTROWADD"]',
text: 'Add',
},
{
color: 'info',
icon: 'fa fa-question-circle-o',
id: '[id*="INFO_ICN"]',
text: 'Help',
},
{
color: 'success',
icon: 'fa fa-check-square-o',
id: '[id*="$spellcheck"]',
text: 'Spell Check',
},
{
id: '[class*="SSSBUTTON_CONFIRMLINK"]',
},
{
id: '[class*="SSSBUTTON_ACTIONLINK"]',
},
{
id: '[class*="SSSBUTTON_CANCELLINK"]',
},
{
color: 'success',
icon: 'fa fa-plus',
id: '[id*="$new$"]',
text: 'Add',
},
{
color: 'info',
icon: 'fa fa-refresh',
id: '[id*="CLEAR"][role="button"]',
text: 'Clear',
},
{
color: 'success',
icon: 'fa fa-refresh',
id: '[id*="REFRESH"]',
text: 'Refresh',
},
],
});
ghInit.registerExtension('ghHeader', 'client', {
/**
* pageHeaderLinks
* Initializes page header links
*
* @deprecates ghPageHeaderLinkInit
* @ignore
* @returns {void}
*/
pageHeaderLinks: function() {
if (ghmob('.gh-page-header').length === 0 || ghPage.getName() === 'SSS_STUDENT_CENTER' || freemarker.page.isHomepage || freemarker.page.isLogin) return;
var links = ghmob(this.linkSelectors.join());
var doReset = false;
if (ghmob('.gh-header-link-original').length === 0) {
doReset = true;
}
links.each(function() {
if ((ghmob(this).is('a[id*="RETURN"]') && ghmob(this).text().indexOf('Return') === -1) || (ghmob(this).parents('.ps_apps_pageheader').length > 0 && ghmob(this).text().indexOf('Change') === -1) || ghmob(this).hasClass('psc_hidden') || ghmob(this).parents('.psc_hidden, .psc_has_popup, .gh-container-footer, .gh-container-footer-original, .prompt, .ptdropdownmenu, .gh-footer-field, [id="ptifrmpopup"]').length > 0 || (ghConfig.footer.autoInitialize && ghmob(this).is(ghFooter.footerButtons.join()))) return;
ghLog.info('Add page header link', ghmob(this));
if (ghmob(this).text().indexOf('Close') > -1 || ghmob(this).text().indexOf('Cancel') > -1 || (typeof ghmob(this).attr('id') !== 'undefined' && (ghmob(this).attr('id').indexOf('Cancel') > -1 || ghmob(this).attr('id').indexOf('CLOSE_BTN') > -1 || ghmob(this).attr('id').indexOf('CANCEL') > -1 || ghmob(this).attr('id').indexOf('PT_BUTTON_BACK') > -1))) {
ghHeader.appendHeaderLink(ghmob(this), { reset: doReset, text: 'Return' });
}
else {
ghHeader.appendHeaderLink(ghmob(this), { reset: doReset });
}
});
if (ghPage.isFluidHomepage()) return;
var backBtn = ghmob('.gh-page-header-links').find('a[href*="doUpdateParent"], a[href*="DoBack"], a[onclick*="doUpdateParent"], a[onclick*="DoBack"]');
if (ghmob('.gh-header-link-original').length === 0) {
doReset = true;
}
else {
doReset = false;
}
if ((ghmob('.gh-page-header-links a').length === 0 || (ghmob('.gh-page-header-links a').not(backBtn).length > 0 && doReset)) && ghmob('.gh-page-header-links').find(backBtn).length === 0) {
var returnLink = ghmob('<a href="#">Return</a>');
if (ghPage.isIFrameModal() && ghPage.isActivityGuide() !== true) {
returnLink = returnLink.attr('onclick', 'javascript:doUpdateParent(document.' + ghPage.getWin() + ',\'#ICCancel\');');
}
else if (window['DoBack'] && ghPage.isFluid()) {
returnLink = returnLink.attr('onclick', 'javascript:DoBack(\'' + ghPage.getWin() + '\');');
}
else {
return;
}
ghHeader.appendHeaderLink(returnLink, { reset: doReset });
}
},
})
ghInit.registerExtension('ghButton', 'client', {
selectors: ['div.ui-btn', '[data-role="button"]', 'input[type="submit"]', 'input[type="reset"]', 'input[type="button"]', 'button', 'a[id*="SSR_PB_SELECT"]'],
create: function(buttons, config) {
var baseConfig = config;
ghmob(buttons).each(function(i) {
var button = ghmob(this);
var buttonSelectorsString = ghButton.selectors.join();
if (button.find(buttonSelectorsString).length > 0) {
button = button.find(buttonSelectorsString).first();
}
// content
var buttonText = '';
if (button.is('input')) {
buttonText = button.attr('value');
}
else if (button.text().trim() !== '') {
buttonText = button.text().trim();
}
else if (button.find('img[alt]').length > 0) {
buttonText = button.find('img[alt]').attr('alt');
}
else if (button.find('img[title]').length > 0) {
buttonText = button.find('img[title]').attr('title');
}
var buttonWrapper = button;
// create wrapper for form buttons
if (button.is('input') || button.is('button')) {
button.addClass('ui-btn-hidden');
if (button.parent('div.ui-btn').length === 0) {
button.wrapAll('<div class="ui-btn"></div>');
}
buttonWrapper = button.parent('div.ui-btn');
if ((typeof button.attr('type') !== 'undefined' && button.attr('type') === 'submit') || (typeof button.attr('type') !== 'undefined' && button.attr('type') === 'reset')) {
buttonWrapper.addClass('ui-submit');
}
if (buttonWrapper.find('> .ui-btn-inner').length === 0) {
buttonWrapper.prepend('<span class="ui-btn-inner"><span class="ui-btn-text">' + buttonText + '</span></span>');
}
else if (buttonWrapper.find('> .ui-btn-inner > .ui-btn-text').length === 0) {
buttonWrapper.find('> .ui-btn-inner').html('<span class="ui-btn-text">' + buttonText + '</span>');
}
}
if (button.find('a').length > 0) {
button = button.find('a').first();
buttonWrapper = button;
}
if (button.find('div.ui-btn').length > 0) {
button = button.find('div.ui-btn').first();
buttonWrapper = button;
}
if (buttonWrapper.find('.ui-btn-inner').length === 0) {
buttonWrapper.html('<span class="ui-btn-inner"><span class="ui-btn-text">' + buttonText + '</span></span>');
}
else if (buttonWrapper.find('.ui-btn-inner > .ui-btn-text').length === 0) {
buttonWrapper.find('.ui-btn-inner').first().html('<span class="ui-btn-text">' + buttonText + '</span>');
}
// classes
buttonWrapper.addClass('ui-btn gh-btn').attr('data-role', 'none');
// attributes
if (button.is('a') && typeof button.attr('href') === 'undefined') {
button.attr('href', '#');
}
// accessible label
ghButton._accessibleLabel(button, buttonWrapper, buttonText);
// config
config = baseConfig;
var dataColor = button.attr('data-color');
var dataDisabled = button.is('[data-disabled]') || button.hasClass('ui-disabled') || button.is('[disabled]');
var dataIcon = button.attr('data-icon');
var dataIconColor = button.attr('data-iconcolor');
var dataIconPosition = button.attr('data-iconpos');
var dataTheme = button.attr('data-theme');
config = ghmob.extend({
color: (typeof dataColor === 'undefined') ? '' : dataColor,
disabled: dataDisabled,
icon: {
className: (typeof dataIcon === 'undefined') ? '' : dataIcon,
color: (typeof dataIconColor === 'undefined') ? '' : dataIconColor,
position: (typeof dataIconPosition === 'undefined') ? 'left' : dataIconPosition,
},
theme: (typeof dataTheme === 'undefined') ? '' : dataTheme,
}, config);
// color
var color = config.color;
if (typeof color === 'object') {
color = config.color[i];
}
if (typeof color !== 'undefined' && color !== '') {
buttonWrapper.addClass(color);
}
// disabled
var disabled = config.disabled;
if (typeof disabled === 'object') {
disabled = config.disabled[i];
}
if (disabled === true) {
buttonWrapper.addClass('ui-disabled');
}
// icon
var iconClassName = config.icon.className;
if (typeof iconClassName === 'object') {
iconClassName = config.icon.className[i];
}
if (typeof iconClassName !== 'undefined' && iconClassName !== '') {
if (buttonWrapper.find('.ui-icon').length === 0) {
buttonWrapper.find('> .ui-btn-inner').append('<span class="ui-icon"></span>');
}
if (iconClassName.indexOf('fa') === -1) {
buttonWrapper.find('> .ui-btn-inner > .ui-icon').addClass('ui-icon-' + iconClassName);
}
else {
buttonWrapper.find('> .ui-btn-inner > .ui-icon').addClass('fa ' + iconClassName);
}
// icon color
var iconColor = config.icon.color;
if (typeof iconColor === 'object') {
iconColor = config.icon.color[i];
}
if (typeof iconColor !== 'undefined' && iconColor !== '') {
buttonWrapper.find('> .ui-btn-inner > .ui-icon').addClass(iconColor);
}
// icon position
var iconPosition = config.icon.position;
if (typeof iconPosition === 'object') {
iconPosition = config.icon.position[i];
}
if (typeof iconPosition === 'undefined' || iconPosition === '') {
iconPosition = 'left';
}
buttonWrapper.addClass('ui-btn-icon-' + iconPosition);
}
// theme
var theme = config.theme;
if (typeof theme === 'object') {
theme = config.theme[i];
}
if (typeof theme !== 'undefined' && theme !== '') {
buttonWrapper.attr('data-theme', theme);
}
});
// trigger
//buttons.trigger('buttoncreate');
},
});
ghInit.registerExtension('ghTable', 'client', {
headlessTable: function(selector) {
//Cleanup for ajax calls
ghmob(selector).find('thead').remove();
//Calculate table header count
let thArray = [];
ghmob(selector).find('tbody > tr').map(function (i) {
thArray[i] = ghmob(this).children().length;
});
let columnCount = Math.max.apply(Math, thArray);
//create table header
ghmob(selector).prepend('<thead></thead>')
for(let count = 0; count < columnCount; count++){
ghmob(selector).find('> thead').prepend('<th></th>')
}
ghTable.cleanReflow(selector);
},
pagerInit: function(scope) {
if (ghConfig.table.pagerEnabled !== true)
return;
// remove old pagers (for ajax refresh)
ghmob('[id*="gh-table-pager-"]', scope).remove();
// selectors
var tables = ['table[class*="PSLEVEL"][class*="GRIDWBO"]', 'table[class*="PSLEVEL"][class*="GRIDNBO"]', 'table[class*="PSLEVEL"][class*="SCROLLAREABODYWBO"]', 'table[class*="PSLEVEL"][class*="SCROLLAREABODYNBO"]', 'table[id*="scroll"]', 'table.PSSRCHRESULTSWBO', ];
var pagers = ['td.PSGRIDNAVIGATOR', 'td.PSHYPERLINKACTIVE', 'tr:first-child td[align="right"]', '.PSSRCHRESULTSTITLE', '.PSLEVEL2GRIDNAVIGATIONBAR', ];
// loop through selectors and initialize pager
ghmob(pagers.join()).each(function() {
if (ghmob(this).find('.PSGRIDCOUNTER, option:selected').length === 0 || (ghmob(this).find(pagers.join()).length > 0 && ghmob(this).hasClass('PSSRCHRESULTSTITLE') === false))
return;
var thisTable = ghmob(this).closest(tables.join());
if (ghmob(this).hasClass('PSSRCHRESULTSTITLE')) {
thisTable = ghmob(this).parents('table[role="presentation"]').first();
}
if (thisTable.length === 0)
return;
ghTable.pagerCreate(thisTable, ghmob(this));
});
},
});
ghInit.registerExtension('ghAccessibility', 'client', {
enhanceCheckboxRadio: function(selector) {
if (ghConfig.accessibility.enhanceCheckboxRadio === false) return;
if (typeof selector === 'undefined') {
selector = ghmob('.ui-content input[type="radio"], .ui-content input[type="checkbox"]');
}
selector.each(function() {
var $this = ghmob(this);
var thisParent = $this.closest('div[id]');
var thisName = $this.attr('name');
var thisId = $this.attr('id');
var thisLabel = ghmob('label[for="' + thisId + '"]').not('.ps_indicator').first();
var thisLabelNoId = thisId + '-label';
var thisLabelNoText = 'Select';
if (typeof $this.attr('title') !== 'undefined' && $this.attr('title').indexOf('Select') === -1) {
thisLabelNoText = $this.attr('title');
}
var inputsThisName = ghmob('input[type="radio"][name="' + thisName + '"]:visible');
var inputsThisNameContainer = $this.parents('div[id]').first().parents('div[id]').first();
if ($this.parents('.ps_box-group').length > 0) {
inputsThisNameContainer = $this.parents('.ps_box-group').first();
}
// Ensure table heading
if ($this.parents('.ui-table').length > 0) {
var thisTh = $this.closest('.ui-table').find('> thead > tr > th:eq(' + $this.closest('td, th').index() + ')');
if (thisTh.text().trim() === '' || thisTh.text().trim() === thisLabel.text().trim() || thisTh.text().trim() === 'Select' || thisLabel.text().trim() === 'Select' || thisLabel.text().trim() === '') {
selector.closest('td, th').addClass('gh-select-all');
}
if (thisTh.text().trim() === '') {
thisTh.text(thisLabelNoText);
$this.parents('.ui-table').table('refresh');
}
}
// Ensure label
if (thisLabel.length === 0) {
thisParent.prepend('<label for="' + thisId + '" id="' + thisLabelNoId + '"></label>');
thisLabel = thisParent.find('label').first();
}
// Ensure label text
if (thisLabel.text().trim() === '') {
if (thisLabel.find('.ui-btn-text').length > 0) {
thisLabel.find('.ui-btn-text').text(thisLabelNoText);
}
else {
thisLabel.text(thisLabelNoText);
}
}
// Remove unwanted classes
thisLabel.removeClass('ui-input-text');
// Aria roles
if (ghConfig.form.nativeCheckboxRadio !== true) {
if ($this.is('input[type="checkbox"]')) {
thisLabel.attr('role', 'checkbox');
}
if ($this.is('input[type="radio"]')) {
thisLabel.attr('role', 'radio');
}
thisLabel.attr('aria-checked', $this.is(':checked')).attr('aria-hidden', 'true');
}
$this.removeAttr('role');
// Radio groups
if ($this.is('input[type="radio"]') && inputsThisName.length > 1) {
ghUtils.delay(function() {
var groupId = thisName + '-group';
var groupLabel = groupId + '-label';
var labelledBy = '';
if (typeof $this.attr('aria-labelledby') !== 'undefined') {
labelledBy = $this.attr('aria-labelledby');
}
/*// Wrap inputs in group
if (ghmob('[id="' + groupId + '"]').length === 0 && inputsThisNameContainer.children('[role="radiogroup"], [role="group"], fieldset').length === 0 && inputsThisNameContainer.parents('[role="radiogroup"], [role="group"], fieldset').length === 0) {
inputsThisNameContainer.children().wrapAll('<div role="group" aria-labelledby="' + groupLabel + '" id="' + groupId + '"></div>');
ghmob('[id="' + groupId + '"]').prepend('<div id="' + groupLabel + '" class="visually-hidden">' + ghmob('.gh-page-header-wrap h1').text() + '</div>');
}*/
// Display inline
if (inputsThisName.parents('.ui-table').length === 0 && ghPage.isFluid() === false) {
ghInterface.displayInline(ghmob('[id="' + groupId + '"]').find(inputsThisName));
}
// Update group label and input aria-labelledby
var inputsThisNameTitle = $this.closest('div[class="ui-body"], .ui-collapsible').find('.ui-bar, .ui-collapsible-heading').first().text().trim().replace('(click to expand contents)', '').replace('(click to collapse contents)', '');
if (inputsThisNameTitle !== '') {
ghmob('[id="' + groupLabel + '"]').text(inputsThisNameTitle);
if (labelledBy.indexOf(groupLabel) === -1) {
labelledBy = groupLabel + ' ' + labelledBy;
}
$this.attr('aria-labelledby', labelledBy);
}
}, 500);
}
// Create jQuery checkbox
if (ghConfig.form.nativeCheckboxRadio !== true && $this.hasClass('gh-checkboxradio') === false) {
try {
$this.checkboxradio('destroy');
if ($this.parent('.ui-checkbox, .ui-radio').length > 0) {
$this.unwrap();
}
}
catch (err) {
ghLog.error('Cannot destroy checkboxradio: ' + $this);
}
thisLabel.off();
$this.addClass('gh-checkboxradio').checkboxradio();
thisLabel.find('.ui-icon').attr('aria-hidden', 'true');
}
});
},
/**
* setFocus
*
* @ignore
* @returns {void}
*/
setFocus: function() {
if(ghPage.getName() != 'SSS_BROWSE_CATLG') {
console.log('hhhhhhgggggggggggggggggg');
if ((ghmob('iframe').length > 0 && ghModal.isModalOpen()) || (ghPage.isSearch() && ghPage.isIFrameModal())) return;
var lastFocus = this.getSavedFocus();
var pageName = ghPage.getName();
var scrollOrigin = ghmob('[data-vscroll-origin]');
var scrollOriginAttr = scrollOrigin.attr('data-vscroll-origin');
ghLog.info('preparing to set focus');
if (ghmob('[aria-invalid="true"]').length > 0) {
ghLog.info('set focus to first error field');
this.setFocusTo(ghmob('[aria-invalid="true"]').first());
}
else if (ghModal.getActiveModal() !== false && ghModal.getActiveModal().last().find('.gh-frame-as-modal-container').length > 0) {
ghLog.info('set focus into active modal or popup');
this._popupFocus(ghModal.getActiveModal().last());
}
else if (ghUtils.getWinTop().ghModal.getActiveModal() !== false && ghUtils.getWinTop().ghModal.getActiveModal().last().find('.gh-frame-as-modal-container').length > 0) {
ghLog.info('set focus into active modal or popup');
this._popupFocus(ghUtils.getWinTop().ghModal.getActiveModal().last());
}
else if (typeof lastFocus === 'undefined' || lastFocus.is('.ui-page') || (scrollOrigin.length > 0 && pageName !== scrollOriginAttr)) {
ghLog.info('no focus saved or new page; setting default focus');
this.defaultFocus();
}
else if (lastFocus.hasClass('ui-collapsible-heading-toggle') || (lastFocus.is(':focusable') === false && lastFocus.find(':focusable').length === 0 && lastFocus.parents('[data-for]').length > 0)) {
ghLog.info('set focus to collapsible');
var lastFocusParent = lastFocus.parents('div[id]').not('.ui-collapsible, .ui-collapsible-content').first();
var lastFocusId = lastFocusParent.attr('id');
var lastFocusIndex = 0;
lastFocusParent.find('.ui-collapsible').each(function(i) {
if (ghmob(this).is(lastFocus.closest('.ui-collapsible'))) {
lastFocusIndex = i;
}
});
var lastFocusSelector = ghmob('.ui-mobile').find('[id="' + lastFocusId + '"]').find('.ui-collapsible:eq(' + lastFocusIndex + ')').find('> .ui-collapsible-heading .ui-collapsible-heading-toggle');
if (lastFocusSelector.length === 0) {
ghLog.info('set focus to last active collapsible');
lastFocusSelector = ghmob('.gh-active-collapsible').last().find('> .ui-collapsible-heading > .ui-collapsible-heading-toggle');
}
this.setFocusTo(lastFocusSelector);
}
else {
if (lastFocus.parents('.gh-submenu').length > 0 && ghmob('.ui-mobile').find(lastFocus).length === 0) return;
if (ghmob('.ui-mobile').find(lastFocus).length === 0 && typeof lastFocus.attr('id') !== 'undefined') {
if (lastFocus.attr('id').indexOf('$delete$') > -1) {
ghLog.info('cannot find lastFocus; setting lastFocus to [id*="' + lastFocus.attr('id').split('$delete$')[0] + '"]');
lastFocus = ghmob(lastFocus[0].tagName + '[id*="' + lastFocus.attr('id').split('$delete$')[0] + '$delete"]').last();
}
else {
ghLog.info('cannot find lastFocus; setting lastFocus to [id="' + lastFocus.attr('id') + '"]');
lastFocus = ghmob('.ui-mobile').find(ghmob('[id="' + lastFocus.attr('id') + '"]'));
}
}
if (lastFocus.is('.gh-footer') || (lastFocus.is('.gh-footer-item') && lastFocus.text() !== ghmob('.ui-mobile').find(lastFocus).first().text())) {
ghLog.info('last focus is footer button; setting default focus');
this.defaultFocus();
return;
}
else if (lastFocus.length === 0 || ghmob('.ui-mobile').find(lastFocus).length === 0) {
ghLog.info('cannot find last focus element; setting default focus');
this.defaultFocus();
return;
}
else if (lastFocus.is(':focusable') === false) {
ghLog.info('saved focus is not focusable');
ghLog.info(lastFocus);
if (lastFocus.parents('.ui-collapsible').length > 0) {
ghLog.info('set focus to saved focus parent collapsible');
lastFocus = lastFocus.closest('.ui-collapsible').find(':focusable:visible').first();
}
else if (lastFocus.find(':focusable:visible').not('a[id*="srt"]').length > 0) {
ghLog.info('set focus to first focusable element in saved focus');
lastFocus = lastFocus.find(':focusable:visible').not('a[id*="srt"]').first();
}
else if (lastFocus.find('input.ui-btn-hidden').length > 0) {
ghLog.info('set focus to first hidden input in saved focus');
lastFocus = lastFocus.find('input.ui-btn-hidden').first();
}
else {
ghLog.info('cannot find focusable item for saved focus; setting default focus');
this.defaultFocus();
return;
}
}
ghLog.info('setting focus to: ');
ghLog.info(lastFocus);
this.setFocusTo(lastFocus);
}
};
},
});/**
* ghPage
* Provides functions for manipulating
* the page.
*
* @module page
* @config handleFieldChanges [true, false]
* @config language [string]
* @config reportIFrameSize [true, false]
* @config enableZoom [true, false]
* @config prependSiteTitle [true, false]
* @config useTypeahead [true, false]
*/
var ghPage = ghPage || {
/**
* name
* Name of page
*
* @ignore
* @type {string}
*/
name: undefined,
/**
* getName
* Gets the page name delivered by PeopleSoft
*
* @deprecates getPageName
* @returns {string}
*/
getName: function() {
var caseA = document.querySelectorAll('[id^="pt_pageinfo"]')[0],
caseB = document.getElementById('_gs_page'),
statementA = caseA ? caseA.getAttribute('page') : undefined,
statementB = caseB ? caseB.getAttribute('value') : undefined;
return statementA || statementB || this.name;
},
/**
* setName
* Sets the page name delivered by PeopleSoft
*
* @deprecates setPageName
* @ignore
* @param {string} name Page name
* @returns {void}
*/
setName: function(name) {
if (ghmob('#_gs_page').length) {
ghmob('#_gs_page')[0].value = name;
}
else {
ghmob('#ICAction, input[name="ICAction"]').first().after('<input type="hidden" id="_gs_page" name="_gs_page" value="' + name + '" />');
}
// Set fallback pagename
this.name = name;
},
/**
* setNamePT852
* Sets the page name for PT8.52
*
* @deprecates setPagePT852
* @ignore
* @returns {void}
*/
setNamePT852: function() {
var pageName = ghmob('[id^="pt_pageinfo"]').attr('page');
if (pageName && pageName !== '(search)' && pageName !== this.getName()) {
return this.setName(pageName);
}
else if (this.isLogin() === true) {
return this.setName('LOGIN_PAGES');
}
},
/**
* getPanels
*
* @returns {array}
*/
getPanels: function() {
var items = {};
var panels = document.querySelectorAll('[data-pnlname]');
for (var i = 0; i < panels.length; i++) {
items[panels[i].getAttribute('data-pnlname')] = true;
}
var result = new Array();
for (var i in items) {
result.push(i);
}
return result;
},
/**
* getModule
*
* @ignore
* @param {string} [moduleName]
* @returns {obj}
*/
getModule: function(moduleName) {
moduleName = moduleName || this.getName();
return ghInit._transactions[moduleName];
},
/**
* getComponentName
* Gets the component name delivered by PeopleSoft
*
* @ftl
* @deprecates getComponentName
* @returns {string}
*/
getComponentName: function() {
var component = ghmob('[id^="pt_pageinfo"]').attr('component');
if (!component) {
component = 'SSS_TSRQST_UNOFF';
}
return component;
},
/**
* getComponentMenu
* Gets the component menu name delivered by PeopleSoft
*
* @returns {string}
*/
getComponentMenu: function() {
return ghmob('[id^="pt_pageinfo"]').attr('menu');
},
/**
* setTitle
* Sets the page title in the head to be page specific
*
* @ignore
* @returns {void}
*/
setTitle: function() {
if (ghPage.isIFrameTemplate()) return;
var pageHeadings = ghmob('.gh-page-header').find(ghHeader.headings.join());
if (pageHeadings.length === 0) return;
var title = '';
if (ghConfig.page.prependSiteTitle) {
title = ghConfig.client.siteTitle;
}
pageHeadings.each(function() {
title += ': ' + ghmob(this).text().trim();
});
if (title === '') return;
ghmob('head title').addClass('gh-title').text(title);
if (ghPage.isTargetContent()) {
ghmob('head title', ghUtils.getWinTop().document).addClass('gh-title').text(title);
}
},
/**
* getField
* Get a jQuery object of a given field
*
* @deprecates pageField
* @param {string} panelName - Name of panel
* @param {int|array} fieldId - ID of field / array of field ID's
* @returns {jQuery}
*/
getField: function(panelName, fieldId) {
fieldId = (ghUtils.isInteger(panelName) || Array.isArray(panelName)) ? panelName : fieldId;
panelName = (panelName === fieldId) ? this.getName() : panelName;
// if fields are an array, build jQuery object to return
if (Array.isArray(fieldId) === true) {
var jqSelector = '';
ghmob.each(fieldId, function(k, thisFieldId) {
jqSelector += '[data-pnlname="' + panelName + '"][data-pnlfldid="' + thisFieldId + '"]';
if (k < (fieldId.length - 1)) {
jqSelector += ',';
}
});
return ghmob(jqSelector);
}
return ghmob('[data-pnlname="' + panelName + '"][data-pnlfldid="' + fieldId + '"]');
},
/**
* getFieldText
*
* @deprecates pageFieldText
* @param {jQuery} scope Scope to search in
* @param {string} page Name of page
* @param {string} field ID of field
* @returns {string}
*/
getFieldText: function(scope, page, field) {
return scope.find(this.getField(page, field)).find('span').text();
},
/**
* isSearch
* Check if page is a search page
*
* @returns {bool}
*/
isSearch: function() {
return (ghmob('#' + this.getWin() + 'divSEARCHRESULT').length > 0 || this.getName() === 'PT_PROMPTPAGE') ? true : false;
},
/**
* isLogin
* Check if page is a login page
*
* @returns {bool}
*/
isLogin: function() {
return freemarker.page.isLogin;
},
/**
* isHomepage
* Check if page is homepage
*
* @returns {bool}
*/
isHomepage: function() {
return freemarker.page.isHomepage;
},
/**
* isFluidHomepage
* Check if page is a fluid homepage
*
* @returns {bool}
*/
isFluidHomepage: function() {
return (this.getName() === 'PT_LANDINGPAGE');
},
/**
* isFluid
* Check if page is a Fluid page
*
* @returns {bool}
*/
isFluid: function() {
return (typeof isFModeLayout === 'undefined') ? false : window.isFModeLayout();
},
/**
* isFluidEnv
* Check if page is part of a Fluid environment
*
* @returns {bool}
*/
isFluidEnv: function() {
return (ghPage.isFluid() === true || (sessionStorage.getItem('fluid-leftnav') && sessionStorage.getItem('fluid-leftnav').length > 0) || (ghmob('#DEFAULT_HEADER_FLUID') && ghmob('#DEFAULT_HEADER_FLUID').length > 0));
},
/**
* isClassicPlus
* Check if page is a Classic Plus page
*
* @returns {bool}
*/
isClassicPlus: function() {
return (ghmob('html').hasClass('gh-classic-plus') || ghmob('html').hasClass('pt_classic_plus'));
},
/**
* isActivityGuide
*
* @returns {bool}
*/
isActivityGuide: function() {
return ((typeof ghUtils.getWinTop().ptaiAguide !== 'undefined' || (typeof ghUtils.getWinTop().ptgpPage !== 'undefined' && ghmob('.psc_mode-guided').length > 0) || ghmob('iframe[id="ptalPgltAreaFrame"]', ghUtils.getWinTop().document).length > 0) && ghPage.isIFrameModal() === false);
},
/**
* isIFrame
* Flag to determine if we are running code from an iframe
*
* @returns {bool}
*/
isIFrame: function() {
return (window.self !== ghUtils.getWinTop());
},
/**
* isIFrameModal
* Flag to determine if we are running code from a modal
*
* @returns {bool}
*/
isIFrameModal: function() {
return (window.self !== window['top'] && ghmob('.ps_modal_content, .PSMODALCONTENT', window.parent.document).length > 0 && ghPage.isTargetContent() === false);
},
/**
* isTargetContent
* Flag to determine if we are running code from a portal iframe
*
* @returns {bool}
*/
isTargetContent: function() {
return (ghPage.isIFrame() && (window.frameElement.name === 'TargetContent' || window.frameElement.name === 'PageletArea' || window.frameElement.className === 'ps_target-iframe'));
},
/**
* isIFrameTemplate
* Flag to determine if this is a portal iframe template
*
* @returns {bool}
*/
isIFrameTemplate: function() {
return (ghmob('[id="ptifrmtemplate"], .ps_target-iframe, .psc_target-iframe').length > 0 || (ghPage.getComponentName() === 'PT_AGSTARTPAGE_NUI' && ghmob('.psc_ajaxtrf, .pst_side1-fixed').length === 0));
},
/**
* includeGSData
*
* @deprecates includeGSData
* @ignore
* @returns {void}
*/
includeGSData: function() {
var cs = ghContainer.getOpenCollapsibles().join(' ');
var gsCs = ghmob('#_gs_cs');
if (gsCs.length) {
gsCs[0].value = cs;
}
else {
ghmob('#ICAction').after('<input type="hidden" id="_gs_cs" name="_gs_cs" value="' + cs + '" />');
}
},
/**
* getWin
* Returns window ID
*
* @returns {string}
*/
getWin: function() {
return freemarker.page.win;
},
/**
* reload
* Reload the PS page
*
* @returns {function}
*/
reload: function() {
var iframe = ghmob('[id="ptifrmtgtframe"], .ps_target-iframe');
if (ghPage.isIFrameTemplate() && iframe.length > 0) {
return iframe[0].contentWindow.ghPage.reload();
}
return window['submitAction_' + this.getWin()](document[this.getWin()], '#ICKEYA0');
},
/**
* submitAction
* Call a PS submitAction with correct window identifier
*
* @param {(string|obj)} action
* @returns {void}
*/
submitAction: function(action) {
window['submitAction_' + ghPage.getWin()](document[ghPage.getWin()], action);
},
/**
* unbind
*
* @deprecates unbind
* @ignore
* @param {jQuery} scope
* @param {string} eventName
* @param {string} pageName
* @param {string} targetPages
* @returns {bool}
*/
unbind: function(scope, eventName, pageName, targetPages) {
var currentPageName = this.getName();
if (currentPageName !== pageName && ghmob.inArray(currentPageName, targetPages) === -1) {
scope.off(pageName + '.' + eventName);
return true;
}
return false;
},
/**
* hide
* Hide the PS page
*
* @returns {void}
*/
hide: function() {
ghmob('[data-role="content"]').hide();
ghmob('body').addClass('gh-hide-page');
ghmob(document).trigger('ghHidePage');
},
/**
* show
* Show the PS page
*
* @returns {void}
*/
show: function() {
ghmob('[data-role="content"]').show();
ghmob('body').removeClass('gh-hide-page');
ghmob(document).trigger('ghShowPage');
},
/**
* setReferenceClass
*
* @ignore
* @returns {void}
*/
setReferenceClass: function() {
var html = ghmob(document.querySelectorAll('html'));
var body = ghmob(document.querySelectorAll('body'));
var parentHtml = ghmob(ghUtils.getWinTop().document.querySelectorAll('html'));
var parentBody = ghmob(ghUtils.getWinTop().document.querySelectorAll('body'));
// remove Classic Plus class
if (html.hasClass('pt_classic_plus')) {
html.removeClass('pt_classic_plus').addClass('gh-classic-plus');
}
// add new pagename attribute
if (this.getName()) {
body.attr('data-gh-page', this.getName());
body.attr('data-subpage', this.getName());
if (ghPage.isTargetContent()) {
ghmob('[id^="pt_pageinfo"]', ghUtils.getWinTop().document).attr('page', this.getName());
parentBody.attr('data-gh-page', this.getName());
parentBody.attr('data-subpage', this.getName());
}
}
// show PS Frame
if (ghConfig.page.showPSFrame === true) {
html.addClass('show-ps-frame');
}
else {
html.removeClass('show-ps-frame');
}
// set homepage reference class
if (freemarker.page.isHomepage === true || this.isFluidHomepage()) {
body.addClass('isHomepage');
}
else {
body.removeClass('isHomepage');
if (ghUtils.getWinTop().freemarker.page.isHomepage === false && ghUtils.getWinTop().ghPage.isFluidHomepage() === false) {
parentBody.removeClass('isHomepage');
}
}
// set login page reference class
if (freemarker.page.isLogin === true) {
body.addClass('isLogin');
}
// set fluid reference class
if (this.isFluid()) {
body.addClass('isFluid');
}
// remove search reference class
if (this.isSearch()) {
body.addClass('PSSRCHPAGE');
}
else {
body.removeClass('PSSRCHPAGE').addClass('PSPAGE');
}
// stop here if this is a modal
if (ghPage.isIFrameModal()) {
if (window.parent !== window.MTop()) {
parentBody.addClass('gh-popup-active');
}
return;
}
else if (ghModal.isModalOpen() !== true) {
parentBody.removeClass('gh-popup-active');
}
// set TargetContent class
if (this.isTargetContent()) {
html.addClass('gh-target-content');
if (parentBody.find('.ps_ag-targetcontent').length > 0) {
html.addClass('gh_ag-targetcontent');
}
}
else {
parentHtml.removeClass('gh-target-content').removeClass('gh_ag-targetcontent');
}
// set TargetFrame class
if (ghUtils.getWinTop().ghPage.isIFrameTemplate() && this.isActivityGuide() === false) {
parentHtml.addClass('gh-target-iframe');
}
else {
parentHtml.removeClass('gh-target-iframe');
}
// set Activity Guide class
if (this.isActivityGuide()) {
html.addClass('gh-activity-guide');
}
else {
html.removeClass('gh-activity-guide');
}
},
/**
* setLanguage
*
* @ignore
* @returns {void}
*/
setLanguage: function() {
var language = 'en';
if (typeof ghConfig.page.language !== 'undefined' && ghConfig.page.language !== '') {
language = ghConfig.page.language;
}
ghmob('html').attr('lang', language);
},
/**
* setScrollYAttr
* Sets body elem with vscroll attribute
*
* @deprecates ghSetScrollY
* @ignore
* @returns {void}
*/
setScrollYAttr: function() {
var scrollYPos = Math.abs(ghmob(window).scrollTop());
ghmob('body').attr('data-vscroll', scrollYPos).attr('data-vscroll-origin', ghPage.getName());
},
/**
* setScrollY
* Sets body elem with vscroll attribute
*
* @deprecates ghScrollY
* @ignore
* @returns {void}
*/
setScrollY: function() {
var scrollYPos = parseInt(ghmob('body').attr('data-vscroll'));
var scrollOrigin = ghmob('body').attr('data-vscroll-origin');
var currentPage = ghPage.getName();
if (currentPage && currentPage !== scrollOrigin) {
scrollYPos = 0;
ghmob('body').attr('data-vscroll', '0');
}
if (typeof scrollYPos !== 'undefined') {
if (this.isTargetContent()) {
ghUtils.getWinTop().scrollTo(0, scrollYPos);
}
else {
window.scrollTo(0, scrollYPos);
}
}
},
/**
* storeScrollPosition
*
* @ignore
* @returns {void}
*/
storeScrollPosition: function() {
var docElem = document.documentElement;
ghState.push('scroll-position', -1, {
x: (window.pageXOffset || docElem.scrollLeft) - (docElem.clientLeft || 0),
y: (window.pageYOffset || docElem.scrollTop) - (docElem.clientTop || 0),
}, null, true);
},
/**
* restoreScrollPosition
*
* @ignore
* @returns {bool}
*/
restoreScrollPosition: function() {
if (ghState.get('renew-scroll-position') !== true) return false;
var scrollPosition = ghState.get('scroll-position');
if (scrollPosition === false) return false;
ghPage.hide();
ghLoader.show();
ghUtils.delay(function() {
ghPage.show();
ghLoader.hide();
if (scrollPosition.y > 0) {
document.body.scrollTop = scrollPosition.y;
}
if (scrollPosition.x > 0) {
document.body.scrollLeft = scrollPosition.x;
}
}, 1000);
return true;
},
/**
* setPageTargetName
*
* @private
* @returns {void}
*/
_setPageTargetName: function() {
try {
if (MTop().name === 'TargetContent') return;
MTop().name = 'gh-top';
}
catch (ex) {
// MTop() not available
}
},
/**
* renewScrollPositionAfterUpdate
*
* @ignore
* @returns {void}
*/
renewScrollPositionAfterUpdate: function() {
ghState.push('renew-scroll-position', -1, null, null, true);
},
/**
* updateIFrameHeight
*
* @ignore
* @returns {void}
*/
updateIFrameHeight: function() {
if (this.isIFrame() === false || this.isActivityGuide() === true) return;
ghmob(window.frameElement).removeAttr('style');
ghmob('.ui-page').removeAttr('style');
var iFrameHeight = Math.max(window.document.body.scrollHeight, window.document.body.offsetHeight, window.document.documentElement.clientHeight, window.document.documentElement.scrollHeight, window.document.documentElement.offsetHeight);
ghmob(window.frameElement).attr('style', 'height: ' + iFrameHeight + 'px !important;');
ghmob('.ui-page').attr('style', 'min-height: ' + iFrameHeight + 'px !important;');
},
/**
* reportPageAsModal
*
* @private
* @returns {void}
*/
_reportPageAsModal: function() {
if (this.isIFrameModal() === false || this.isActivityGuide() === true) return;
if (this.getName().indexOf('_FLTR') > -1 || this.getName().indexOf('_FILT') > -1 || this.isSearch() === true || ghModal.getActiveModal().find('.LOOKUPMODAL').length > 0) {
ghmob('body.is-modal, body.ps_modal_body').addClass('gh-frame-as-modal');
ghmob(window.frameElement).closest('.PSMODALTABLE').addClass('gh-frame-as-modal-container').parent().addClass('gh-frame-as-modal-container');
}
else {
ghmob(window.frameElement).closest('.PSMODALTABLE').removeAttr('role aria-modal');
}
},
/**
* reportModalAsLoaded
*
* @returns {void}
*/
_reportModalAsLoaded: function() {
var lastActiveModal = ghmob(ghModal.getLastActiveModal());
if ((this.isIFrameModal() === false && lastActiveModal.length === 0) || (this.isActivityGuide() === true && lastActiveModal.length === 0)) return;
ghUtils.delay(function() {
lastActiveModal.addClass('gh-modal-loaded');
if (lastActiveModal.find('.LOOKUPMODAL').length > 0) {
lastActiveModal.find('.PSMODALTABLE').addClass('gh-frame-as-modal-container').parent().addClass('gh-frame-as-modal-container');
}
ghModal._batchAccessibilityHooks(true);
if (lastActiveModal.is('div[id^="ptMod"]')) {
ghAccessibility.setFocusTo(lastActiveModal.find('.PSMODALTABLE').find(':focusable:visible').not('a:empty').first());
}
else {
ghAccessibility.setFocusTo(lastActiveModal.find(':focusable:visible').not('a:empty').first());
}
}, 100);
if (lastActiveModal.find('> .ps_typeahead_modal').length === 1) {
lastActiveModal.addClass('gh-modal-typeahead');
}
//this.setReferenceClass();
},
/**
* submitOnFieldChange
*
* @ignore
* @param {jQuery} selector
* @returns {void}
*/
submitOnFieldChange: function(selector) {
if (ghConfig.page.handleFieldChanges !== true) return;
if (ghmob(selector).length === 0 || typeof ghmob(selector).attr('id') === 'undefined') return;
if (window['oChange_' + ghPage.getWin()] !== null) {
ghUtils.delay(function() {
window['aAction_' + ghPage.getWin()](document[ghPage.getWin()], ghmob(selector).attr('id'), null, true, false);
window['oChange_' + ghPage.getWin()] = null;
}, 501);
}
},
/**
* wrapSubmitAction
*
* @ignore
* @returns {void}
*/
wrapSubmitAction: function() {
// set real submit action
if (typeof window['submitAction_' + this.getWin()] !== 'undefined' && typeof window['realSubmitAction_' + this.getWin()] === 'undefined') {
window['realSubmitAction_' + this.getWin()] = window['submitAction_' + this.getWin()];
}
// set custom submit action
window['submitAction_' + this.getWin()] = function wrappedSubmitActionGH(form, name) {
if (!form) {
form = document[ghPage.getWin()];
}
if (name.charCodeAt(4) === 27 && (ghModal.isModalOpen(true) === true || ghmob('.gh-submenu.active').length > 0)) {
return false;
}
ghLoader.show();
ghUtils.delay(function() {
ghUtils.hideDeviceKeyboard();
}, 25);
ghPage.includeGSData();
window.enableMSFields();
window['gridList_' + ghPage.getWin()] = undefined;
return window['realSubmitAction_' + ghPage.getWin()](form, name);
};
},
/**
* wrapDisplayPopup
*
* @private
* @returns {void}
*/
_wrapDisplayPopup: function() {
if (typeof window.displayPopup !== 'undefined' && typeof window.realDisplayPopup === 'undefined') {
window['realDisplayPopup'] = window.displayPopup;
}
window.displayPopup = function() {
ghUtils.delay(function() {
ghmob(document).trigger('ghModalOpen');
}, 100);
window.realDisplayPopup.apply(window, arguments);
};
},
/**
* overridePositionWait
*
* @private
* @returns {void}
*/
_overridePositionWait: function() {
if (window['positionWAIT_' + ghPage.getWin()] === undefined) return;
window['positionWAIT_' + ghPage.getWin()] = function() {
var waitobj = null;
var savedobj = null;
var objFrame = MTop().frames['TargetContent'];
if (objFrame && objFrame.document) {
waitobj = objFrame.document.getElementById('WAIT_win0');
savedobj = objFrame.document.getElementById('SAVED_win0');
}
else if (objFrame && objFrame.contentWindow && objFrame.contentWindow.document) {
waitobj = objFrame.contentWindow.document.getElementById('WAIT_win0');
savedobj = objFrame.contentWindow.document.getElementById('SAVED_win0');
}
else {
waitobj = document.getElementById('WAIT_win0');
savedobj = document.getElementById('SAVED_win0');
}
if (waitobj && waitobj.style.display !== 'none' && waitobj.style.visibility !== 'hidden') {
keepObjTopRight(waitobj);
}
if (savedobj && savedobj.style.display !== 'none' && savedobj.style.visibility !== 'hidden') {
keepObjTopRight(savedobj);
}
};
},
/**
* overrideGetTargetFrame
*
* @private
* @returns {void}
*/
_overrideGetTargetFrame: function() {
if (window.getTargetFrame === undefined || ghConfig.core.embedded !== true) return;
window.getTargetFrame = function(frames) {
for (var j = 0; j < frames.length; ++j) {
var objFrame = frames[j];
if (objFrame && (function(test) {
try {
test.gFocusId;
return true;
}
catch (err) {
return false;
}
}
)(objFrame) && typeof objFrame.gFocusId !== 'undefined' && (objFrame.name === 'TargetContent' || objFrame.name === 'rightF' || objFrame.name === 'gh-top')) {
MTop().ModalTop = window;
return objFrame;
}
try {
if (objFrame.frames.length > 0 && !isCrossDomain(objFrame))
return getTargetFrame(objFrame.frames);
}
catch (err) {
return window;
}
}
return top;
};
},
/**
* panelScrollTop
*
* @private
* @returns {void}
*/
_panelScrollTop: function() {
// Scroll to top when panel is opened
var currentScroll = ghmob(window).scrollTop();
window.ghPanelScroll = currentScroll;
if (this.isTargetContent()) {
ghUtils.getWinTop().scrollTo(0, 0);
}
else {
window.scrollTo(0, 0);
}
},
/**
* panelScrollOriginal
*
* @private
* @returns {void}
*/
_panelScrollOriginal: function() {
// Scroll back to original position when panel is closed
var currentScroll = window.ghPanelScroll;
if (this.isTargetContent()) {
ghUtils.getWinTop().scrollTo(0, currentScroll);
}
else {
window.scrollTo(0, currentScroll);
}
},
/**
* disableAjaxPrompts
*
* @private
* @returns {void}
*/
_disableAjaxPrompts: function() {
if (window.freemarker.ptVersion.indexOf('8.51') === -1) return;
ghmob(document).on('pagebeforecreate', function() {
if (typeof window['noAjaxPromptAction_' + ghPage.getWin()] === 'undefined' && typeof window['pAction_' + ghPage.getWin()] !== 'undefined') {
window['noAjaxPromptAction_' + ghPage.getWin()] = function(form, name) {
window['PT_common'].prototype.isAJAXReq = function() {
return false;
};
window['PT_common'].prototype.isPromptReq = function() {
return false;
};
ghPage.submitAction(name);
};
window['pAction_' + ghPage.getWin()] = window['noAjaxPromptAction_' + ghPage.getWin()];
ptCommonObj.updatePrompt = window['submitAction_' + ghPage.getWin()];
}
});
},
/**
* _targetContentHeight
*
* @private
* @returns {void}
*/
_targetContentHeight: function() {
if (this.isTargetContent() === false) return;
var frame = ghmob(window.frameElement);
if (typeof frame === 'undefined') return;
var frameHeight = (typeof frame.attr('data-height') !== 'undefined') ? frame.attr('data-height') : frame.height();
var pageHeight = ghmob('.ui-page').height();
if (window.frameElement.name === 'PageletArea' && ghmob('#ptpglts a').length > 0) {
pageHeight = ghmob('#ptpglts .PTALPAGELEBODYDIV').height();
}
if (typeof frameHeight === 'undefined' || typeof pageHeight === 'undefined') return;
if (frameHeight.toString().indexOf(pageHeight.toString()) === -1) {
frame.css('height', pageHeight).attr('data-height', pageHeight);
}
},
/**
* overrideIframeResizeHeight
*
* @private
* @returns {void}
*/
_overrideIframeResizeHeight: function() {
if (typeof window.ptIframe === 'undefined' || window.ptIframe.resizeHeight === 'undefined') return;
window.ptIframe.realResizeHeight = window.ptIframe.resizeHeight;
window.ptIframe.resizeHeight = function(e) {
if (e === 'ptifrmtgtframe') return;
window.ptIframe.realResizeHeight();
};
},
/**
* overrideTitleUpdate
*
* @private
* @returns {void}
*/
_overrideTitleUpdate: function() {
if (typeof window.updateWindowTitleFromFakeBC !== 'undefined' && typeof window.realUpdateWindowTitleFromFakeBC === 'undefined') {
window.realUpdateWindowTitleFromFakeBC = window.updateWindowTitleFromFakeBC;
}
window.updateWindowTitleFromFakeBC = function wrappedUpdateWindowTitleFromFakeBC() {
window.realUpdateWindowTitleFromFakeBC();
ghPage.setTitle();
};
},
/**
* _eventBindings
*
* @private
* @returns {void}
*/
_eventBindings: function() {
if (typeof ghfwjq === 'undefined' || (typeof ghfwjq !== 'undefined' && ghfwjq !== ghmob)) {
ghfwjq = ghmob;
}
ghmob(document)
.off('pagelet_load.ghPage')
.on('pagelet_load.ghPage', function() {
ghLog.event('pagelet_load.ghPage');
ghmob(document).trigger('pageinit');
});
ghmob(document)
.off('panelopen.ghPage.panelScrollTop')
.on('panelopen.ghPage.panelScrollTop', '.ui-panel', function() {
ghLog.event('panelopen.ghPage.panelScrollTop');
ghPage._panelScrollTop();
});
ghmob(document)
.off('panelbeforeclose.ghPage.panelScrollOriginal')
.on('panelbeforeclose.ghPage.panelScrollOriginal', '.ui-panel', function() {
ghLog.event('panelbeforeclose.ghPage.panelScrollOriginal');
ghPage._panelScrollOriginal();
});
ghmob(document)
.off('blur.ghPage.submitOnFieldChange change.ghPage.submitOnFieldChange')
.on('blur.ghPage.submitOnFieldChange change.ghPage.submitOnFieldChange', '[onchange*="oChange"]', function() {
ghLog.event('blur.ghPage.submitOnFieldChange');
ghPage.submitOnFieldChange(ghmob(this));
});
ghmob(document)
.off('click.ghPage.submitOnFieldChange')
.on('click.ghPage.submitOnFieldChange', '[onchange*="oChange"]', function() {
ghLog.event('click.ghPage.oChange');
window['oChange_' + ghPage.getWin()] = document.getElementById(ghmob(this).attr('id'));
});
},
/**
* onlyPUXFrame
*
* @private
* @returns {void}
*/
_onlyPUXFrame: function() {
// config
ghConfig.header.enabled = false;
// classes
ghmob('[data-role="panel"]').attr('data-display', 'overlay');
this.setReferenceClass();
// run plugins
ghButton._jqmButtons();
ghContainer._jqmCollapsibles();
// run events
ghHeader._eventBindings();
ghPanel._eventBindings();
ghContainer._eventBindings();
// run modules
ghHeader.siteHeader();
ghPanel.onPageBeforeCreate();
ghTilesNavigation.run();
},
/**
* onPageBeforeCreate
*
* @event
* @ignore
* @returns {void}
*/
onPageBeforeCreate: function() {
this.setLanguage();
this.wrapSubmitAction();
this._reportPageAsModal();
this._disableAjaxPrompts();
this._overridePositionWait();
this._overrideGetTargetFrame();
this._wrapDisplayPopup();
ghUtils.cleanTextNodes(ghmob('#' + this.getWin() + 'divPSPAGECONTAINER').parent());
ghUtils.cleanTextNodes(ghmob('form[name^="win"]'));
ghUtils.fixLeftElements();
},
/**
* onPageUpdate
*
* @event
* @ignore
* @returns {void}
*/
onPageUpdate: function() {
ghPage.setNamePT852();
},
/**
* run
*
* @event
* @ignore
* @returns {void}
*/
run: function() {
this._eventBindings();
this.setReferenceClass();
this.setNamePT852();
this.setScrollY();
this._overrideTitleUpdate();
this.setTitle();
this._setPageTargetName();
this._reportModalAsLoaded();
},
/**
* $extensions
*
* @submodule
* @type {object}
*/
$extensions: {
/**
* fluid
*
* @submodule
* @type {object}
*/
fluid: {
/**
* $run
*
* @ignore
* @returns {void}
*/
$run: function() {
ghmob('#PT_WRAPPER').show();
if (ghConfig.page.showPSFrame !== true) {
ghmob('#PT_HEADER').addClass('gh-hidden').attr('aria-hidden', 'true');
}
ghUtils.cleanTextNodes(ghmob('#PT_MAIN, #PT_MID_SECTION'));
},
},
},
};
/**
* Register Module
*/
ghInit.module('ghPage');
/**
* Unscoped Events
*/
ghInit.attach({
pageName: 'gh-report-iframe-size',
eventType: 'ajaxupdate',
force: true,
runCondition: (ghPage.isIFrame() && ghConfig.page.reportIFrameSize === true),
delay: 500,
}, function() {
ghPage.updateIFrameHeight();
});
/**
* ghUser
*
* @module user
* @owner Nick Barone
*/
var ghUser = ghUser || {
/**
* hasRole
* Evaluates if a user has a specific role
*
* @param {string} role
* @returns {bool}
*/
hasRole: function(role) {
return (this.getRoles().indexOf(role) > -1);
},
/**
* getRoles
* Retrieves all roles for a user
*
* @ftl
* @returns {array}
*/
getRoles: function() {
var userRoles = [];
// get user roles
userRoles.push('CU_G3STUDENT_FA_NSERC'); userRoles.push('HCM SOA Services Portal Access'); userRoles.push('CU_SS_STUDENT'); userRoles.push('CU_G3STUDENT_FINA'); userRoles.push('CU_G3STUDENT_UGRD'); userRoles.push('CU_G3STUDENT_GC'); userRoles.push('CU_G3STUDENT_FA_USLOAN1');
return userRoles;
},
};
/**
* ghLocale
*
* @ignore
* @module locale
* @author Nick Barone
*/
var ghLocale = ghLocale || {
/**
* translations
*
* @ignore
* @type {object}
*/
translations: {},
/**
* registerTranslation
*
* @ignore
* @param {string} locale
* @param {string} key
* @param {string} translation
* @returns {void}
*/
registerTranslation: function(locale, key, translation) {
this.translations[key] = this.translations[key] || {};
this.translations[key][locale] = translation;
},
/**
* registerSet
*
* @ignore
* @param {object} translations
* @returns {void}
*/
registerSet: function(translations) {
this.translations = ghmob.extend(true, {}, this.translations, translations);
},
/**
* getLocale
*
* @ignore
* @returns {string}
*/
getLocale: function() {
return window.freemarker.locale;
},
/**
* text
*
* @ignore
* @param {string} key
* @param {string} [locale]
* @returns {string}
*/
text: function(key, locale) {
locale = locale ? locale : this.getLocale();
if (this.translations[key] === undefined) {
throw new Error('ghLocale: Could not find given key: ' + key);
}
if (this.translations[key][locale] === undefined) {
throw new Error('ghLocale: Could not find given translation: ' + key + '/' + locale);
}
return this.translations[key][locale];
},
};
(function() {
var pluginName = 'ghtables',
classes = {
active: pluginName + '-active',
disable: pluginName + '-disable',
hide: pluginName + '-hide',
navigation: pluginName + '-navigation',
},
events = {
create: pluginName + '-create',
destroy: pluginName + '-destroy',
refresh: pluginName + '-refresh',
resize: pluginName + '-resize',
};
var Table = function(element, opts) {
if (!element) return;
this.table = element;
this.$table = ghmob(element);
this.opts = opts;
this.$table.data(pluginName, this);
this.create();
};
Table.prototype.create = function() {
this.$table.trigger(events.create, [this.$table]);
};
Table.prototype.destroy = function() {
this.$table.trigger(events.destroy, [this.$table]);
this.$table.removeData(pluginName);
};
Table.prototype.refresh = function(options) {
this.$table.trigger(events.refresh, [this.$table, options]);
};
Table.prototype.resize = function() {
this.$table.trigger(events.resize, [this.$table]);
};
ghmob.fn[pluginName] = function(event, options) {
this.each(function() {
var $this = ghmob(this);
var enhanced = $this.data(pluginName);
// Return if not table or no table headings
if ($this.is('table') === false || $this.children('thead').find('th').length === 0) return;
// Resize
if (typeof enhanced !== 'undefined' && event === 'resize') {
enhanced.resize();
return;
}
// Destroy
if (typeof enhanced !== 'undefined' && event === 'destroy') {
enhanced.destroy();
return;
}
// Options
if (typeof event === 'object' && typeof options === 'undefined') {
options = event;
}
var opts = ghmob.extend({
breakpoint: false,
mode: 'scroll',
scroll: 'cols',
swipe: true,
}, options);
// Refresh
if (typeof enhanced !== 'undefined' && event === 'refresh') {
enhanced.destroy();
enhanced = $this.data(pluginName);
}
// Create
if (typeof enhanced !== 'undefined' || (typeof enhanced === 'undefined' && options === 'resize') || (typeof enhanced === 'undefined' && options === 'destroy')) return;
var table = new Table($this, opts);
});
};
var modes = {
getData: function() {
var $table = modes.$table;
var data = $table.data(pluginName);
return data;
},
scroll: {
setAttr: function() {
var $table = modes.$table;
var $parent = $table.parent('.' + pluginName);
var data = modes.getData();
$table.addClass(pluginName);
if (!$table.attr('id')) {
$table.attr('id', pluginName + '-' + Math.round(Math.random() * 10000));
}
$parent.attr('data-' + pluginName + '-mode', data.opts.mode);
$parent.attr('data-' + pluginName + '-scroll', data.opts.scroll);
if (data.opts.scroll === 'cols' && data.opts.breakpoint === true) {
var breakpoint = modes.scroll.getBreakpoint();
$parent.attr('data-' + pluginName + '-breakpoint', breakpoint);
}
},
removeAttr: function() {
var $table = modes.$table;
var $parent = $table.parent('.' + pluginName);
var data = modes.getData();
$table.removeClass(pluginName);
$parent.removeAttr('data-' + pluginName + '-mode');
$parent.removeAttr('data-' + pluginName + '-scroll');
if (data.opts.scroll === 'cols') {
$parent.removeAttr('data-' + pluginName + '-breakpoint');
}
},
navigation: {
create: function() {
var $table = modes.$table;
var rows = modes.scroll.rows.length();
var cols = modes.scroll.cols.length();
var $nav = this.getNav();
if (!$nav.length) {
$nav = ghmob('<div class="' + classes.navigation + '" role="toolbar" aria-label="table navigation" aria-controls="' + $table.attr('id') + '"></div>').insertBefore($table);
}
this.$nav = $nav;
this.buttons();
if (modes.scroll.rows.enabled()) {
this.dots(rows);
}
if (modes.scroll.cols.enabled()) {
this.dots(cols);
}
this.showAll();
},
getNav: function() {
var $table = modes.$table;
var id = $table.attr('id');
var $nav = ghmob('[role="toolbar"][aria-controls="' + id + '"]');
return $nav;
},
destroy: function() {
var $nav = this.getNav();
$nav.remove();
},
show: function() {
var $table = modes.$table;
var headings = modes.scroll.getHeadings();
if ((modes.scroll.cols.enabled() && headings.not('.' + classes.hide).length === headings.length) || (modes.scroll.rows.enabled() && $table.hasClass(pluginName + '-full')) || (modes.scroll.rows.enabled() && modes.scroll.rows.get().length <= 1)) {
$table.parent('.' + pluginName).addClass(pluginName + '-show-all');
}
else {
$table.parent('.' + pluginName).removeClass(pluginName + '-show-all');
}
},
showAll: function() {
var mode;
if (modes.scroll.cols.enabled()) {
mode = 'columns';
}
if (modes.scroll.rows.enabled()) {
mode = 'rows';
}
var $showAll = ghmob('<a href="#" class="' + classes.navigation + '-show-all">Show all ' + mode + '</a>').prependTo(this.$nav);
this.$showAll = $showAll;
},
buttons: function() {
var mode;
if (modes.scroll.cols.enabled()) {
mode = 'column';
}
if (modes.scroll.rows.enabled()) {
mode = 'row';
}
var $ul = ghmob('<ul class="' + classes.navigation + '-btns"></ul>').appendTo(this.$nav);
ghmob('<li><a href="#" class="' + classes.navigation + '-previous' + '" role="button" aria-label="Show previous ' + mode + '"></a></li>').appendTo($ul);
ghmob('<li><a href="#" class="' + classes.navigation + '-next' + '" role="button" aria-label="Show next ' + mode + '"></a></li>').appendTo($ul);
this.$buttons = $ul;
},
displayButtons: function(index) {
var $nav = this.getNav();
var $dots = this.getDots();
var rows = modes.scroll.rows.get();
if (typeof index !== 'object') {
index = [index];
}
var activeDots = $dots.find('li.' + classes.active);
var lastActiveDot = activeDots.last();
if (activeDots.length > 1 && activeDots.not('.' + pluginName + '-persist').length > 0) {
lastActiveDot = activeDots.not('.' + pluginName + '-persist').last();
}
var previous = lastActiveDot.siblings('li').filter(function() {
return (ghmob(this).index() < lastActiveDot.index() && ghmob(this).hasClass(classes.active) === false && ghmob(this).hasClass(pluginName + '-inview') === false);
});
var next = lastActiveDot.siblings('li').filter(function() {
return (ghmob(this).index() > lastActiveDot.index() && ghmob(this).hasClass(classes.active) === false && ghmob(this).hasClass(pluginName + '-inview') === false);
});
ghmob.each(index, function(i) {
if ((modes.scroll.rows.enabled() && typeof rows[index[i] + 1] === 'undefined') || (modes.scroll.cols.enabled() && next.length === 0 || activeDots.length === $dots.find('li').length)) {
$nav.find('.' + classes.navigation + '-next').addClass(classes.disable).attr('tabindex', '-1');
}
else {
$nav.find('.' + classes.navigation + '-next').removeClass(classes.disable).removeAttr('tabindex');
}
if ((modes.scroll.rows.enabled() && typeof rows[index[i] - 1] === 'undefined') || (modes.scroll.cols.enabled() && previous.length === 0 || activeDots.length === $dots.find('li').length)) {
$nav.find('.' + classes.navigation + '-previous').addClass(classes.disable).attr('tabindex', '-1');
}
else {
$nav.find('.' + classes.navigation + '-previous').removeClass(classes.disable).removeAttr('tabindex');
}
});
},
dots: function(num) {
var mode;
if (modes.scroll.cols.enabled()) {
mode = 'column';
}
if (modes.scroll.rows.enabled()) {
mode = 'row';
}
var headings = modes.scroll.getHeadings();
var $ol = ghmob('<ol class="' + classes.navigation + '-dots"></ol>').prependTo(this.$nav);
for (var i = 0; i < num; i++) {
var thisHeadingText = '';
if (ghmob(headings[i]).text() !== '') {
thisHeadingText = ': ' + ghmob(headings[i]).text().trim();
}
$ol.append('<li><a href="#" aria-label="Show ' + mode + ' ' + (i + 1) + thisHeadingText + '"></a></li>');
}
this.$dots = $ol;
},
getDots: function() {
var $nav = this.getNav();
var $dots = $nav.find('.' + classes.navigation + '-dots');
return $dots;
},
setActiveDot: function(index) {
if (typeof index !== 'object') {
index = [index];
}
var dots = this.getDots().children('li');
dots.removeClass(pluginName + '-inview').removeClass(pluginName + '-persist').removeClass(classes.active).children('a').removeAttr('aria-selected tabindex');
ghmob.each(index, function(a) {
var dot = ghmob(dots[index[a]]);
if (modes.scroll.cols.enabled()) {
dot.addClass(pluginName + '-inview');
}
if (modes.scroll.rows.enabled()) {
dot.addClass(classes.active);
}
dot.children('a').attr('aria-selected', 'true').attr('tabindex', '-1');
});
if (modes.scroll.cols.enabled()) {
var activeHeadings = modes.scroll.getHeadings().parent().find('.' + classes.active);
activeHeadings.each(function() {
ghmob(dots[ghmob(this).index()]).addClass(classes.active).removeClass(pluginName + '-inview');
});
var persistHeadings = modes.scroll.getHeadings().parent().find('[data-' + pluginName + '-persist="true"]');
persistHeadings.each(function() {
ghmob(dots[ghmob(this).index()]).addClass(pluginName + '-persist');
});
}
},
},
cols: {
enabled: function() {
var data = modes.getData();
if (data) {
return (data.opts.scroll === 'cols');
}
return;
},
get: function(index, scope) {
if (typeof scope === 'undefined') {
scope = 'thead, tbody';
}
var rows = modes.scroll.rows.get(scope);
var cols = [];
ghmob.each(rows, function() {
ghmob(this).children('th, td').each(function(i) {
var $this = ghmob(this);
if (typeof index === 'undefined' || index === 'all') {
cols.push($this);
}
else {
if (typeof index !== 'object') {
index = [index];
}
ghmob.each(index, function(a) {
if (i === index[a]) {
cols.push($this);
}
});
}
});
});
return cols;
},
length: function() {
var headings = this.get('all', 'thead');
var num = headings.length;
return num;
},
persist: function() {
var headings = modes.scroll.getHeadings().parent().find('[data-' + pluginName + '-persist="true"]');
var index = [];
headings.each(function() {
index.push(ghmob(this).index());
});
return index;
},
evaluate: function(inview) {
var numHeadings = modes.scroll.getHeadings().length;
for (var i = 0; i < numHeadings; i++) {
var containerWidth = modes.scroll.containerWidth();
var tableWidth = modes.scroll.tableWidth();
if (tableWidth <= containerWidth) return;
var headings = modes.scroll.getHeadings();
var hideable = headings.not('.' + classes.hide + ', .' + classes.active + ', [data-' + pluginName + '-persist="true"]');
var activeHeadings = headings.parent().find('.' + classes.active);
var hideIndex;
if (typeof inview === 'undefined') {
hideIndex = hideable.last().index();
}
else {
if (typeof inview === 'number') {
hideable = hideable.filter(function() {
return (ghmob(this).index() !== inview);
});
}
hideIndex = hideable.first().index();
if (hideIndex > activeHeadings.last().index()) {
hideIndex = hideable.last().index();
}
if (typeof inview === 'number' && hideIndex < inview) {
hideIndex = headings.not('.' + classes.hide + ', [data-' + pluginName + '-persist="true"]').first();
if (hideIndex.hasClass(classes.active)) {
hideIndex.removeClass(classes.active);
headings.parent().find('th:eq(' + (hideIndex.index() + 1) + ')').addClass(classes.active);
}
hideIndex = hideIndex.index();
}
}
var hideCol = modes.scroll.cols.get(hideIndex);
this.hide(hideCol);
}
},
show: function(num, inview) {
var $table = modes.$table;
// add persist cols to [num]
var persist = this.persist();
if (typeof num === 'undefined') {
if (persist.length > 0) {
num = persist;
var lastPersist = persist[persist.length - 1];
if (num.indexOf(lastPersist + 1) === -1) {
num.push(lastPersist + 1);
}
// Ensure first column is shown on initial create
if (num.indexOf(0) === -1) {
num.push(0);
}
}
else {
num = [0];
}
}
else if (persist.length > 0) {
ghmob.each(persist, function(i) {
if (num.indexOf(persist[i]) > -1) return;
num.push(persist[i]);
});
}
// cleanup
modes.scroll.cleanup($table);
// active headings
var headings = modes.scroll.getHeadings();
ghmob.each(num, function(i) {
ghmob(headings[num[i]]).addClass(classes.active);
});
// hide cols that are outside of available width
this.evaluate(inview);
// get visible headings
var visibleHeadings = headings.not('.' + classes.hide);
num = [];
visibleHeadings.each(function() {
// add indexes of cols that are shown due to available width
if (num.indexOf(ghmob(this).index()) > -1) return;
num.push(ghmob(this).index());
});
// navigation
modes.scroll.navigation.setActiveDot(num);
modes.scroll.navigation.displayButtons(num);
modes.scroll.navigation.show();
},
hide: function(cols) {
ghmob.each(cols, function(i) {
cols[i].addClass(classes.hide).attr('aria-hidden', 'true');
});
},
resize: function() {
var $table = modes.$table;
var data = modes.getData();
var $nav = modes.scroll.navigation.getNav();
if (data.opts.breakpoint === true) {
if (modes.scroll.matchBreakpoint() === false) {
if ($nav.length > 0) {
modes.$table.ghtables('refresh', data.opts);
}
return;
}
if (modes.scroll.matchBreakpoint() === true && $nav.length === 0) {
modes.$table.trigger(events.create, [$table]);
}
}
var activeHeadings = modes.scroll.getHeadings().parent().find('.' + classes.active);
var cols = [];
activeHeadings.each(function() {
cols.push(ghmob(this).index());
});
this.show(cols, true);
},
},
rows: {
enabled: function() {
var data = modes.getData();
if (data) {
return (data.opts.scroll === 'rows');
}
return;
},
get: function(scope) {
var $table = modes.$table;
if (typeof scope === 'undefined') {
scope = 'tbody';
}
var rows = [];
$table.children(scope).children('tr').each(function() {
if (ghmob(this).hasClass('gh-hidden') === false && ghmob(this)[0].style.display !== 'none') {
rows.push(ghmob(this));
}
});
return rows;
},
length: function() {
var rows = this.get();
var num = rows.length;
return num;
},
evaluate: function() {
var $table = modes.$table;
var tableWidth = modes.scroll.tableWidth();
var containerWidth = modes.scroll.containerWidth();
if (tableWidth <= containerWidth) {
$table.addClass(pluginName + '-full');
}
else {
$table.removeClass(pluginName + '-full');
}
modes.scroll.navigation.show();
},
resize: function() {
this.evaluate();
},
show: function(num) {
this.evaluate();
if (typeof num === 'undefined') {
num = 0;
}
var rows = this.get();
ghmob.each(rows, function(i) {
if (i === num) {
rows[i].removeClass(classes.hide).attr('aria-hidden', 'true');
}
else {
rows[i].addClass(classes.hide).removeAttr('aria-hidden');
}
});
modes.scroll.navigation.setActiveDot(num);
modes.scroll.navigation.displayButtons(num);
},
},
getHeadings: function() {
var $table = modes.$table;
var headings = $table.children('thead').children('tr:first-child').children();
return headings;
},
tableWidth: function() {
var $table = modes.$table;
if (modes.scroll.rows.enabled()) {
$table.addClass(pluginName + '-full');
}
if (modes.scroll.cols.enabled()) {
$table.parents().not(':visible').addClass('ghtables-detect-size-parents');
}
var width = Math.floor($table.width());
if (modes.scroll.rows.enabled()) {
$table.removeClass(pluginName + '-full');
}
if (modes.scroll.cols.enabled()) {
$table.parents('.ghtables-detect-size-parents').removeClass('ghtables-detect-size-parents');
}
return width;
},
containerWidth: function() {
var $table = modes.$table;
if (modes.scroll.cols.enabled()) {
$table.parents().not(':visible').addClass('ghtables-detect-size-parents');
}
var container = $table.closest('.ui-body, .ui-collapsible-content, div[id]');
if (container.parents('.ui-popup').length > 0) {
container = $table.closest('.ui-popup').find('> .ui-body, > .ui-collapsible, > .ui-content').first();
}
var width = Math.ceil(container.width());
if (modes.scroll.cols.enabled()) {
$table.parents('.ghtables-detect-size-parents').removeClass('ghtables-detect-size-parents');
}
return width;
},
cleanup: function(selector) {
if (typeof selector === 'undefined') {
selector = modes.$table.parent();
}
selector.find('[class*="' + pluginName + '"]').each(function() {
var $this = ghmob(this);
var classes = ghmob(this)[0].classList;
if (typeof classes === 'undefined' || classes === null || classes.length === 0) return;
ghmob.each(classes, function(i) {
if (typeof classes[i] !== 'undefined' && classes[i] !== null && classes[i].indexOf(pluginName) !== -1) {
$this.removeClass(classes[i]);
}
});
$this.removeAttr('aria-hidden');
});
},
getBreakpoint: function() {
var $table = modes.$table;
var breakpoint = $table.attr('data-reflow-breakpoint');
if (typeof breakpoint === 'undefined') {
breakpoint = $table.closest('[data-breakpoint]').attr('data-breakpoint');
}
return breakpoint;
},
matchBreakpoint: function() {
if (typeof window.matchMedia === 'undefined') return false;
var breakpoint = this.getBreakpoint();
var isMatch = window.matchMedia('(min-width: ' + breakpoint + 'px)');
return isMatch.matches;
},
setReflowClass: function() {
var $table = modes.$table;
var breakpoint = this.getBreakpoint();
if (typeof breakpoint === 'undefined') return;
$table.addClass('reflow-grid-' + breakpoint);
},
removeReflowClass: function() {
var $table = modes.$table;
$table.removeClass('reflow-grid-400 reflow-grid-500 reflow-grid-600 reflow-grid-700 reflow-grid-800 reflow-grid-900 reflow-grid-1000');
},
wrapper: function() {
var $table = modes.$table;
if ($table.parent('.' + pluginName).length === 0) {
$table.wrapAll('<div class="' + pluginName + '"></div>');
$table.parent('.' + pluginName).siblings('[class*="reflow-grid-"]').prependTo($table.parent('.' + pluginName));
}
},
unwrap: function() {
var $table = modes.$table;
if ($table.parent('.' + pluginName).length > 0) {
$table.unwrap();
}
},
events: {
init: function() {
this.navigate();
this.resize();
this.swipe();
},
navigate: function() {
ghmob(document).off('click.' + pluginName).on('click.' + pluginName, '.' + classes.navigation + ' a:not([tabindex="-1"])', function(e) {
e.preventDefault();
var $this = ghmob(this);
// set table
var id = $this.closest('.' + classes.navigation).attr('aria-controls');
var $table = ghmob('table[id="' + id + '"]');
modes.$table = $table;
// show all
if ($this.hasClass(classes.navigation + '-show-all')) {
$table.ghtables('destroy');
return;
}
// navigate
var dots = $this.parents('.' + classes.navigation + '-dots');
var activeDots = modes.scroll.navigation.getDots().find('li.' + classes.active).not('.' + pluginName + '-inview');
var viewDots = modes.scroll.navigation.getDots().find('li.' + pluginName + '-inview');
if (viewDots.length === 0 && activeDots.length === 1) {
viewDots = activeDots;
}
if (activeDots.length > 1 && activeDots.not('.' + pluginName + '-persist').length > 0) {
activeDots = activeDots.not('.' + pluginName + '-persist');
}
var btns = $this.parents('.' + classes.navigation + '-btns');
var lastActiveDot;
var lastViewDot;
var active;
var inview;
if (dots.length > 0) {
active = $this.parent('li').index();
inview = active;
}
if (btns.length > 0) {
if ($this.hasClass(classes.disable)) return;
if ($this.hasClass(classes.navigation + '-next')) {
lastActiveDot = activeDots.last();
lastViewDot = viewDots.last();
active = lastActiveDot.index() + 1;
inview = lastViewDot.index() + 1;
}
if ($this.hasClass(classes.navigation + '-previous')) {
lastActiveDot = activeDots.first();
lastViewDot = viewDots.first();
active = lastActiveDot.index() - 1;
inview = lastViewDot.index() - 1;
}
}
if (modes.scroll.rows.enabled()) {
modes.scroll.rows.show(active);
}
if (modes.scroll.cols.enabled()) {
modes.scroll.cols.show([active], inview);
}
});
},
resize: function() {
ghmob(window).off('throttledresize.' + pluginName).on('throttledresize.' + pluginName, function() {
ghmob('table.' + pluginName + ':visible').each(function() {
modes.$table = ghmob(this);
var $table = modes.$table;
modes.$table.trigger(events.resize, [$table]);
});
});
ghmob(document).off('expand.' + pluginName).on('expand.' + pluginName, '[data-role="collapsible"], .ui-collapsible', function() {
var tables = ghmob(this).find('table.' + pluginName + ':visible');
if (tables.length === 0) return;
tables.each(function() {
modes.$table = ghmob(this);
var $table = modes.$table;
modes.$table.trigger(events.resize, [$table]);
});
});
},
swipe: function() {
ghmob(document).off('swiperight.' + pluginName + ' swipeleft.' + pluginName).on('swiperight.' + pluginName + ' swipeleft.' + pluginName, 'table.' + pluginName, function(e) {
// set table
modes.$table = ghmob(this);
// data
var data = modes.getData();
if (data.opts.swipe === false) return;
// get active item
var dots = modes.scroll.navigation.getDots().children('li');
var activeDots = dots.parent().find('li.' + classes.active).not('.' + pluginName + '-inview');
var viewDots = dots.parent().find('li.' + pluginName + '-inview');
if (viewDots.length === 0 && activeDots.length === 1) {
viewDots = activeDots;
}
if (activeDots.length > 1 && activeDots.not('.' + pluginName + '-persist').length > 0) {
activeDots = activeDots.not('.' + pluginName + '-persist');
}
var lastActiveDot;
var lastViewDot;
var active;
var inview;
if (e.type === 'swiperight') {
lastActiveDot = activeDots.first();
lastViewDot = viewDots.first();
active = lastActiveDot.index() - 1;
inview = lastViewDot.index() - 1;
}
if (e.type === 'swipeleft') {
lastActiveDot = activeDots.last();
lastViewDot = viewDots.last();
active = lastActiveDot.index() + 1;
inview = lastViewDot.index() + 1;
}
// show
if (typeof dots[active] === 'undefined') return;
if (modes.scroll.rows.enabled()) {
modes.scroll.rows.show(active);
}
if (modes.scroll.cols.enabled()) {
modes.scroll.cols.show([active], inview);
}
});
},
off: function(selector) {
ghmob(document).off('swiperight.' + pluginName + ' swipeleft.' + pluginName, selector);
},
},
create: function(selector) {
// data
modes.$table = selector;
var data = modes.getData();
// table has minimum rows or cols
var min = true;
if (this.cols.enabled()) {
var cols = this.cols.get();
min = cols.length > 1;
}
if (min === false) return;
// wrapper
this.wrapper();
// attributes
this.cleanup();
this.setAttr();
this.removeReflowClass();
// events
this.events.init();
// return if table should match breakpoint before scrolling
if (data.opts.scroll === 'cols' && data.opts.breakpoint === true && this.matchBreakpoint() === false) return;
// navigation
this.navigation.create();
// show rows or cols
if (this.rows.enabled()) {
this.rows.show();
}
if (this.cols.enabled()) {
modes.$table.addClass(pluginName + '-full');
this.cols.show();
}
},
destroy: function(selector) {
// navigation
this.navigation.destroy();
// attributes
this.removeAttr();
this.cleanup();
this.setReflowClass();
this.unwrap();
// events
this.events.off(selector);
},
resize: function(selector) {
modes.$table = selector;
if (modes.scroll.cols.enabled()) {
modes.scroll.cols.resize();
}
if (modes.scroll.rows.enabled()) {
modes.scroll.rows.resize();
}
},
},
};
ghmob(document).off(events.create).on(events.create, function(e, table) {
modes.$table = table;
var data = modes.getData();
if (data.opts.mode === 'scroll') {
setTimeout(function() {
modes.scroll.create(table);
}, 0);
}
});
ghmob(document).off(events.destroy).on(events.destroy, function(e, table) {
modes.$table = table;
var data = modes.getData();
if (data.opts.mode === 'scroll') {
modes.scroll.destroy(table);
}
});
ghmob(document).off(events.resize).on(events.resize, function(e, table) {
modes.$table = table;
var data = modes.getData();
if (data.opts.mode === 'scroll') {
modes.scroll.resize(table);
}
});
}());

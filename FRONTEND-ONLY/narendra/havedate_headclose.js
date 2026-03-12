
try {
if (top !== window && typeof window['top'].document === 'undefined') {
MTop().window.location.href = location.href.replace('/psp/', '/psc/');
}
}
catch (err) {
MTop().window.location.href = location.href.replace('/psp/', '/psc/');
}
if (typeof(window.original_open) === 'undefined') {
window.original_open = window.open;
window.open = function(url, target, opts) {
ghLoader.hide();
if (target === '_parent') {
document.location = url;
return;
}
return original_open(url, target, opts);
}
}
ghmob.extend( mobiscroll.settings, {
'animate' : 'false',
'dateFormat' : 'mm/dd/yy',
'headerText' : '{value}',
'showScrollArrows' : 'true',
'theme' : 'mobiscroll',
'timeFormat' : 'hh:iiA'
});
function LoadCalendar() {}
function wrapUnsafeFunction(scope, funcName) {
if (typeof(scope) === 'undefined' || !!!scope) {
return;
}
if (typeof(scope[funcName]) === 'undefined' || !!!scope[funcName]) {
return;
}
var origFuncName = 'original_' + funcName,
origFunc = scope[origFuncName];
if (typeof(origFunc) !== 'undefined' && !!origFunc) {
return; // already wrapped
}
scope[origFuncName] = scope[funcName];
scope[funcName] = function() {
try {
return Function.prototype.apply.call(scope[origFuncName], this, arguments);
}
catch (err) {
}
}
}
function wrapUnsafeFunctions() {
if (typeof(ptCommonObj) !== 'undefined') { wrapUnsafeFunction(ptCommonObj , 'setOpaq'); }
if (typeof(ptCommonObj2) !== 'undefined') { wrapUnsafeFunction(ptCommonObj2, 'setOpaq'); }
if (typeof(ptGridObj_win0) !== 'undefined') { wrapUnsafeFunction(ptGridObj_win0, 'adjustColumnWidthHeight'); }
if (typeof(bcUpdater) !== 'undefined') {
wrapUnsafeFunction(bcUpdater, 'isLocalStorageSupported');
wrapUnsafeFunction(bcUpdater, 'isSessionStorageSupported');
wrapUnsafeFunction(bcUpdater, 'setStoredData');
}
if (typeof(document.original_write) === 'undefined') {
document.original_write = document.write;
document.write = function() {
if (ghmob.isReady) {
if (typeof console !== 'undefined' && console.warn) {
console.warn("document.write called after page load");
}
}
else {
return Function.prototype.apply.call(document.original_write, document, arguments);
}
}
}
}
function isScriptLoaded(url) {
return ghmob('script[src="' + url + '"]').length !== 0;
}
window.scriptsLoaded = false;
window.ajaxPageInit = false;
ghmob(document).on('ajaxbeforeupdate', function() {
window.scriptsLoaded = false;
window.ajaxPageInit = false;
});
function markLoaded(scriptId) {
if (typeof(window.ghScriptLoader) === "undefined") {
// console.log("No script tracker available");
return;
}
if (window.ghScriptLoader.length === 0) {
// console.log("No scripts being tracked");
return;
}
var // scriptId = url.split("/")[3],
idx = ghmob.inArray(scriptId, window.ghScriptLoader);
if (idx !== -1) {
window.ghScriptLoader.splice(idx, 1);
}
if (window.ghScriptLoader.length === 0 && !window.scriptsLoaded) {
window.scriptsLoaded = true;
ghmob(document).trigger("ajax.scriptsloaded");
}
}
function ensureScriptLoaded(url) {
if (!isScriptLoaded(url)) {
if (typeof(window.ghScriptLoader) === "undefined") {
window.ghScriptLoader = [];
}
var toLoad = document.createElement('script'),
scriptId = url.split("/")[3];
toLoad.src = url;
toLoad.id = scriptId;
// TODO - how does an error in the loaded javascript affect this?
if (toLoad.readyState) { // IE
toLoad.onreadystatechange = function(){
if (toLoad.readyState == "complete"){
toLoad.onreadystatechange = null;
markLoaded(toLoad.id);
}
};
}
else {
toLoad.onload = function () {
markLoaded(toLoad.id);
};
}
document.body.appendChild(toLoad);
window.ghScriptLoader.push(toLoad.id);
ghInit.awaitingIncomingScripts = true;
return toLoad;
}
}
function isCSSLoaded(url) {
return ghmob('link[rel="stylesheet"][href="' + url + '"]').length !== 0;
}
function ensureCSSLoaded(url) {
if (!isCSSLoaded(url)) {
var toLoad = document.createElement('link');
toLoad.setAttribute("rel", "stylesheet");
toLoad.setAttribute('href', url);
document.body.appendChild(toLoad);
return toLoad;
}
}
if ( typeof(MTop) !== 'undefined' && typeof(original_MTop) === 'undefined' ) {
window.original_MTop = window.MTop;
// don't override on 8.57 - may need to revisit this
if (ghConfig.core.usePSMTop === undefined || ghConfig.core.usePSMTop !== true) {
window.MTop = function() {
var self = window.MTop;
// cache the result once calculated
if (typeof(self.result) === 'undefined') {
self.result = null;
}
if (!!self.result) {
return self.result;
}
try {
self.result = original_MTop();
}
catch (err) {
self.result = window;
}
if (!!!self.result) {
self.result = window;
}
return self.result;
}
}
}
if (typeof(window.tryFocus0) !== 'undefined' && typeof(window.wrappedTryFocus0) === 'undefined') {
window.wrappedTryFocus0 = function(obj) {
var $obj = ghmob(obj),
ismobi = $obj.attr('data-role') === 'mobiscroll';
if ( ismobi ) {
var instance = ghmob.mobiscroll.instances[obj.id],
result = false;
if (!!instance) {
var settings = instance.settings,
showOnFocus = settings.showOnFocus;
settings.showOnFocus = false; // don't pop date picker on programmatic focus
try {
result = window.realTryFocus0(obj);
}
catch (err) {
result = false;
}
settings.showOnFocus = showOnFocus;
}
return result;
}
//else if ($obj.parent().hasClass('ui-select')) {
// obj = $obj.parent().find('a')[0];
//}
try {
window.realTryFocus0(obj);
} catch (ex) {}
return;
};
window.realTryFocus0 = window.tryFocus0;
window.tryFocus0 = window.wrappedTryFocus0;
}
// PeopleTools 8.53 may use tryFocus0New
// TODO: needs to be merged with the tryFocus0 function
if (typeof(window.tryFocus0New) !== 'undefined' && typeof(window.wrappedtryFocus0New) === 'undefined') {
window.wrappedtryFocus0New = function(obj) {
var $obj = ghmob(obj),
ismobi = $obj.attr('data-role') === 'mobiscroll';
if ( ismobi ) {
var instance = ghmob.mobiscroll.instances[obj.id],
result = false;
if (!!instance) {
var settings = instance.settings,
showOnFocus = settings.showOnFocus;
settings.showOnFocus = false; // don't pop date picker on programmatic focus
try {
result = window.realtryFocus0New(obj);
}
catch (err) {
result = false;
}
settings.showOnFocus = showOnFocus;
}
return result;
}
try {
window.realtryFocus0New(obj);
} catch (ex) {}
return;
};
window.realtryFocus0New = window.tryFocus0New;
window.tryFocus0New = window.wrappedtryFocus0New;
}
wrapUnsafeFunctions();
<!-- end if for !onlyPUXFrame -->
// endsWith polyfill
if (!String.prototype.endsWith) {
String.prototype.endsWith = function(search, this_len) {
if (this_len === undefined || this_len > this.length) {
this_len = this.length;
}
return this.substring(this_len - search.length, this_len) === search;
};
}

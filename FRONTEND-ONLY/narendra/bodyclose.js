
function wrapped_setSelectElemOptions_win0() {
real_setSelectElemOptions_win0();
try {
ghmob('select').selectmenu('refresh');
}
catch (err) {
ghmob('select').selectmenu();
}
}
function enableMSFields() {
ghmob('.dwtd').prop('disabled', false).removeClass('dwtd');
}
function wrappedSubmitAction_win0(form, name) {
if (!!!form) {
form = win0;
}
ghLoader.show();
ghUtils.delay(function() {
ghUtils.hideDeviceKeyboard();
}, 25);
includeGSData();
enableMSFields();
gridList_win0 = undefined;
return realSubmitAction_win0(form, name);
}
function wrappedPromptAction_win0(form, name, efieldname) {
if (!!!form) {
form = win0;
}
ghLoader.show();
ghUtils.delay(function() {
ghUtils.hideDeviceKeyboard();
}, 25);
includeGSData();
enableMSFields();
gridList_win0 = undefined;
return realPromptAction_win0(form, name, efieldname);
}
function wrappedAjaxAction_win0(form, name, params, bAjax, bPrompt) {
if (!!!form) {
form = win0;
}
ghLoader.show();
ghUtils.delay(function() {
ghUtils.hideDeviceKeyboard();
}, 25);
includeGSData();
enableMSFields();
gridList_win0 = undefined;
return realAjaxAction_win0(form, name, params, bAjax, bPrompt);
}
ghmob(document).on('pagebeforecreate', function() {
if (ghConfig.page.useTypeahead === true && window.ptTAObj_win0 !== undefined) {
window.ptTAObj_win0.StartTimeout = function () {};
window.ptTAObj_win0.SetText = function(xVal) {
if ((this.theTextBox).focus)
(this.theTextBox).focus();
else if ((this.theTextBox).setActive)
(this.theTextBox).setActive();
this.theTextBox.value = this.DecodeValue(ptTAObj_win0.arrMatches[xVal][this.theTextBox.obj.colnum]);
if (!ptTAObj_win0.IsSelectedUnique(xVal)) {
this.UpdateControlField(xVal);
}
addchg_win0(this.theTextBox);
var thisObj = this.theTextBox.attributes.getNamedItem('onchange');
if (thisObj != null && thisObj.nodeValue != null)
this.theTextBox.onchange();
if (browserInfoObj2.isiPad && browserInfoObj2.isSafari) {
ptTAObj_win0.HideTheBox();
}
ptTAObj_win0.HideTheBox();
}
window.ptTAObj_win0.buildChoices = function(arrOptions, arrHeaders) {
this.oWin.gFocusId = this.theTextBox.id;
if (typeof this.oWin.modWin != 'undefined' && this.oWin.modWin != null) {
return;
}
if (ptTAObj_win0.bLostFocus && !isFModeLayout()) {
//return;
}
this.bStartNewList = 1;
if (this.RestoreTextBox()) {
this.theTextBox.obj.arrHeaders = arrHeaders;
this.theTextBox.obj.arrOptions = arrOptions;
this.theTextBox.obj.bNew = true;
if (isFModeLayout()) {
this.Close();
}
this.BuildList(ptTAObj_win0.strLastValue.replace(/\\/g, '\\\\'));
bMadeReqiest = false;
this.startPos = 0;
this.bFoundSpecialKeycode = false;
}
}
}
else {
window.isTypeAheadEl = function(event) { return false; }
window.ptTAObj_win0 = {
init: function() { return; },
HideTheBox: function() { return; },
SetProperties: function() { return ; },
};
}
if (typeof ptaiAguide !== "undefined" && typeof ptaiAguide.real_LoadNavButtons === 'undefined' ) {
ptaiAguide.real_LoadNavButtons = ptaiAguide.LoadNavButtons;
ptaiAguide.wrapped_LoadNavButtons = function() {
ptaiAguide.real_LoadNavButtons();
ghmob(document).trigger('gh_agbuttonupdate');
};
ptaiAguide.LoadNavButtons = ptaiAguide.wrapped_LoadNavButtons;
}
if (!!window.net2 && !!!window.net2.wrapped_addStyle) {
window.net2.wrapped_addStyle = function (cssId, dstyle, src) {
try {
window.net2.real_addStyle(cssId, dstyle, src);
} catch (ex) {}
};
window.net2.real_addStyle = window.net2.ContentLoader.prototype.addStyle;
window.net2.ContentLoader.prototype.addStyle = window.net2.wrapped_addStyle;
}
});
var localStorageSupported = function() {
try {
localStorage.setItem("test", "test");
localStorage.removeItem("test");
return 'localStorage' in window && window['localStorage'] !== null;
} catch(e){
return false;
}
}
if (localStorageSupported()) {
function componentKey(component) {
return 'cm.' + component;
}
function pageKey(component, pageName) {
return componentKey(component) + '.pg.' + pageName;
}
function pageFieldKey(component, pageName, pageFieldId) {
return pageKey(component, pageName) + '.pf.' + pageFieldId;
}
function storeKey(key, value) {
localStorage.setItem(key, value);
}
function storedKey(key) {
try {
return localStorage.getItem(key);
}
catch (e) {
return null;
}
}
function storedIntKey(key) {
var val = storedKey(key);
return val == null ? null : parseInt(val);
}
ghmob('#jqm_main_page').on( 'gridnav', function(event, data) {
var pageName = ghPage.getName();
if (!!pageName) {
var gridKey = pageFieldKey(ghPage.getComponentName(), pageName, data['gridId']);
storeKey(gridKey + '.row',
data['newRowNbr']);
}
});
ghmob('#jqm_main_page').on( 'pageinit', function() {
var pageName = ghPage.getName();
if (!!!pageName) {
return;
}
var component = ghPage.getComponentName();
if (pageName == '(search)') {
var checkKey = componentKey(component),
checkLen = checkKey.length,
keyCount = localStorage.length;
for(var i = keyCount-1; i >= 0; i--) {
var key = localStorage.key(i);
if (key.substring(0, checkLen) == checkKey) {
localStorage.removeItem(key);
}
}
}
});
}
// this will wait until any existing mobile popups have
// been cleared before displaying itself
// TODO : allowing supplying a target element to focus on when the popup is closed
function mobile_popup(title, message) {
if (ghPage.isTargetContent()) {
ghUtils.getWinTop().ghModal._setParentWin();
return ghUtils.getWinTop().ghModal.popup.apply(ghModal, arguments);
}
else {
return ghModal.popup.apply(ghModal, arguments);
}
}
function immediate_mobile_popup(title, message) {
var pop = ghmob('#mobile_popup'),
pop_content = pop.find('div.alertmessage'),
pop_buttons = pop.find('div.mobile_popup_buttons'),
pop_ctl = ghmob('#mobile_popup_ctl'),
cur_page = ghmob('.ui-page-active');
ghmob('#mobile_popup, #mobile_popup_ctl').appendTo( cur_page );
pop.find('h1').css('display', typeof(title) !== 'undefined' ? 'initial' : 'none')
.text(title);
pop.css('background',
ghmob('#jqm_main_page').css('background'));
pop_content.css('display', typeof(message) !== 'undefined' ? 'initial' : 'none')
.html(message);
pop_buttons.empty();
for (var i = 2; i < arguments.length; i++) {
pop_buttons.append(arguments[i]);
}
pop.find('a').button();
pop_ctl.trigger('click');
}
function make_popup_button(text, action, theme) {
return {
title: text,
action: action
}
}
function allow_open_in_current() {
return false;
}
function _evalFieldAction(field, fieldAction, timeout) {
var callable = typeof(fieldAction) === 'function',
isText = !callable,
func = callable ? function() { fieldAction.call( field ); }
: function() { eval(fieldAction); };
if (isText) {
fieldAction = fieldAction.replace('javascript:', '');
if (!!field.id) {
var replacement = 'document.getElementById("' + field.id + '")';
fieldAction = fieldAction.replace(/\bthis\b/g, replacement);
}
}
if (typeof(timeout) !== 'undefined') {
setTimeout(func, timeout);
}
else {
func();
}
}
function invokeFieldChange(targetField, timeout) {
var $target = ghmob(targetField),
fieldChange = $target.prop('onchange'),
needsSubmit = false,
needsTracking = typeof(oChange_win0) !== 'undefined',
currentChange = needsTracking ? oChange_win0 : null;
if (!!!fieldChange) {
return;
}
_evalFieldAction($target[0], fieldChange, timeout);
if (needsTracking) {
var checkSubmit = function() {
if (oChange_win0 !== currentChange) {
submitAction_win0(document.win0, $target[0].name);
}
}
if (typeof(timeout) !== 'undefined') {
setTimeout(checkSubmit, timeout);
}
else {
checkSubmit();
}
}
}
function invokeFieldAction(targetField, timeout) {
var $target = ghmob(targetField),
fieldAction = $target.attr('href');
if (!!!fieldAction || fieldAction === '#') {
fieldAction = $target.prop('onclick');
}
if (!!fieldAction) {
_evalFieldAction($target[0], fieldAction, timeout);
}
}
(function ( $, window, document, undefined ) {
var pluginName = 'gridFormatter',
defaults = {
dataIcon: 'arrow-r',
dataTheme: 'c',
headerSelector: 'th',
includeHeaders: true,
isInset: true,
rowSelector: 'table tr[id^="tr"]',
removeOld: false,
tableButton: '',
tableFormat: ghConfig.gridFormatter.tableFormat
};
function GridFormatter( element, options ) {
this.element = element;
this.$element = ghmob(element);
this.options = ghmob.extend( {}, defaults, options);
this._defaults = defaults;
this._name = pluginName;
if (this.options.tableFormat === true) {
this.$element.find('[class*=GRIDLABEL]').closest('tr').remove();
ghUtils.removeEmpty(this.$element.find('tr'));
if (ghmob(this).hasClass('table-stripe') || ghmob(this).find('.table-stripe').length > 0){}
else if (this.$element.find('table').length > 0){
ghTable.cleanReflow(this.$element.find('table:last'));
}
else {
ghTable.cleanReflow(this.$element);
}
ghUtils.removeEmpty(this.$element.find('tr'));
return;
}
this.init();
ghmob(this.options.tableButton).hide();
return this;
}
GridFormatter.prototype.init = function () {
this._newCntr = this._buildNewContainer();
var headers = [];
this.$element.find(jqSelEsc(this.options.headerSelector)).each( function() {
ghmob(this).find('i').remove();
headers.push( '<span>' + ghmob(this).text().trim() + '</span>' );
});
this._headers = headers;
this._newRows = this._processRows();
this._finalize();
}
// returns the jQuery new container element
GridFormatter.prototype._buildNewContainer = function () {
var opts = this.options,
dataIcon = opts.dataIcon,
grid = !this.$element.hasClass("ui-table") && this.$element.find("table.ui-table:first").length == 1 ? this.$element.find("table.ui-table:first") : this.$element;
var ul = ghmob('<ul class="gridformatter gh-listview" ' + (!!opts.ulId ? ' id="' + opts.ulId + '"' : '') + 'data-inset="' + (opts.isInset ? 'true' : 'false') + '">' + '</ul>');
if (grid.prev('.gridformatter').length > 0) return;
grid.before(ul);
return ul;
}
// returns a list of DOM nodes to be added to the container
GridFormatter.prototype._processRows = function () {
var self = this,
opts = this.options,
oldRows = this.$element.find(jqSelEsc(opts.rowSelector)),
newRows = [],
rowProcessor = (typeof(opts.rowProcessor) === 'function' ?
opts.rowProcessor : self._processRow),
rowFormatter = (typeof(opts.rowFormatter) === 'function' ?
opts.rowFormatter : self._formatRow);
oldRows.each( function( idx, curRow) {
var rowData = rowProcessor.call( self, idx, curRow );
if (rowData !== null) {
var newRow = rowFormatter.call( self, idx, curRow, rowData );
if (newRow !== null && newRow.length !== 0) {
newRows.push(newRow);
}
}
});
return newRows;
}
// returns a hash of the data extracted from the row
GridFormatter.prototype._processRow = function (idx, curRow) {
var TDs = ghmob(curRow).find('td'),
idx = ghmob(curRow).attr('id').replace(/\$/g, ''),
links = TDs.find('a').not(':empty'),
opts = this.options,
actions = [],
primaries = [],
secondaries = [],
selectable = '';
if (links.length === 1) {
var link = ghmob(links[0]),
text = link.text().trim();
if (!!!text) {
var img = link.find('img, .fa');
/*if (img.length !== 0) {
text = img.attr('alt') || img.attr('title');
text = text.trim();
}*/
}
if (!!text) {
primaries.push( text );
}
}
for (var i = 0; i < TDs.length; i++) {
var td = ghmob(TDs[i]),
link = td.find('a').clone(),
isLink = link.length !== 0,
btn = td.find('.ui-btn'),
isBtn = btn.length !== 0,
text = td.text().trim(),
label = td.find('b, label, .ui-label').text().trim();
td.find('b, label, .ui-label').remove();
text = td.text().trim();
if (isLink && link.text().trim() !== '') {
if (typeof link.attr('id') !== 'undefined') {
link.attr('id', link.attr('id') + '-actionable');
}
link.addClass('actionable');
if (link.parent().attr('title')) {
link.text(link.parent().attr('title'));
}
var linkInput = link.find('input').clone();
if (linkInput.length > 0) {
if (typeof linkInput.attr('id') !== 'undefined') {
linkInput.attr('id', linkInput.attr('id') + '-actionable');
}
actions.push(ghmob('<div />').append(linkInput).html());
}
else {
actions.push(ghmob('<div />').append(link).html());
}
if (!!text) {
if (primaries.indexOf(text) !== -1) {
continue;
}
}
else {
continue;
}
}
var img = td.find('img, .fa').not('.ui-btn');
var imgHtml = ghmob('<div />').append(img.clone()).html();
if (img) {
secondaries.push(imgHtml);
}
if (!!text && isBtn === false && text != label) {
var isPrimary = primaries.length === 0;
if (opts.includeHeaders && !isPrimary) {
var header = this._headers[i];
if (!!header) {
text = header + ': ' + text;
}
}
var storage = isPrimary ? primaries : secondaries;
storage.push( text );
}
else {
if (i == 0 && !isBtn && text != label) {
// TODO - we should ensure the label here
selectable = td.html();
}
}
}
if (primaries.length === 0 && secondaries.length === 0) {
return null;
}
var data = {
'actions': actions,
'links': links,
'primaries': primaries,
'rowId': 'row' + idx,
'secondaries': secondaries,
'selectable': selectable
}
return data;
}
// so we accept multiple links, but we only use one of them, and if
// there are more we convert to an actionsheet
GridFormatter.prototype._formatRow = function(idx, curRow, data) {
var opts = this.options,
actions = data.actions,
dataTheme = opts.dataTheme,
id = data.rowId,
links = data.links,
linkable = links.length > 0,
primaries = data.primaries,
secondaries = data.secondaries,
selectable = data.selectable;
var nodeHtml = [
'<li id="', id , '">',
];
if (linkable) {
nodeHtml.push('<a class="actionable" href="');
var href = (links.length == 1 ? links[0].href
: "javascript:ghModal.buildActionSheet('#" + id + "')");
nodeHtml.push(href);
nodeHtml.push('">');
}
if (!!selectable) {
// TODO - is the original HTML enough for this?
nodeHtml.push(selectable);
nodeHtml.push('<div');
if (!!opts.rowClass) {
nodeHtml.push(' class="');
nodeHtml.push(opts.rowClass);
nodeHtml.push('"');
}
nodeHtml.push('>');
}
var headingLevel = ghHeader.headingStartLevel();
for (var i = 0; i < primaries.length; i++) {
nodeHtml.push('<p class="ui-li-heading">');
nodeHtml.push(primaries[i]);
nodeHtml.push('</p>');
}
for (var i = 0; i < secondaries.length; i++) {
if(secondaries[i] !== '') {
nodeHtml.push('<p class="ui-li-desc">');
nodeHtml.push(secondaries[i]);
nodeHtml.push('</p>');
}
}
if (linkable) {
nodeHtml.push('</a>');
// make sure links/actions are available in popup
if (actions.length > 1) {
nodeHtml.push('<span class="actions" style="display: none">');
for (var i = 0; i <= actions.length; i++) {
nodeHtml.push(actions[i]);
}
nodeHtml.push('</span>');
}
}
if (!!selectable) {
nodeHtml.push('</div>');
}
nodeHtml.push('</li>');
var node = ghmob( nodeHtml.join('') );
return node.get(0);
}
GridFormatter.prototype._finalize = function () {
try {
if (this._newRows.length > 0) {
this._newCntr.append(this._newRows);
}
else {
this._newCntr.append('<li>No items to display.</li>');
}
}
catch (err) {}
this.$element.closest('div[id]').addClass('gridformatter').closest('.ps_box-group').addClass('gridformatter');
if (this.options.removeOld && !ghConfig.gridFormatter.showPager) {
this.$element.remove();
}
else {
var gridTables = this.$element.find("table.ui-table, table.PSLEVEL1GRIDWBO .psprintgrid");
gridTables = gridTables.length < 0 ? this.$element.find("table:first") : gridTables;
if (gridTables.length == 0) {
gridTables = this.$element;
}
if (this.options.removeOld) {
gridTables.remove();
}
else {
gridTables.addClass('gh-hidden');
}
}
}
ghmob.fn[pluginName] = function ( options ) {
return this.each(function () {
if (!ghmob.data(this, 'plugin_' + pluginName)) {
ghmob.data(this, 'plugin_' + pluginName,
new GridFormatter( this, options ));
}
else {
new GridFormatter(this, options);
}
});
}
})( ghmob, window, document );
ghmob(document).off('ajax.ghajax.scriptsloaded').on('ajax.ghajax.scriptsloaded', function(event, data) {
if (!!!window.ajaxPageInit) {
window.ajaxPageInit = true;
// TODO - do we still need to do setTimeout here?
setTimeout( function() {
// console.log("ghajax.js - pageinit in ajax.scriptsloaded - page destroy model");
// ghmob("#jqm_main_page").trigger('pageinit');
ghInit.awaitingIncomingScripts = false;
ghmob(document).trigger('pageinit', { fromAjaxUpdate: true });
}, 0);
}
});
if (typeof(window.__saved_labels) === "undefined") {
window.__saved_labels = {};
}
function save_label(id) {
ghmob('#' + jqSelEsc(id)).find('label[for]').not('.ps_indicator').each( function() {
var $label = ghmob(this);
__saved_labels[$label.attr('for')] = $label.clone();
});
}
ghmob("#jqm_main_page").off('pageinit.ghajax.fixonclick fieldupdate.ghajax.fixonclick').on('pageinit.ghajax.onclick fieldupdate.ghajax.fixonclick', function() {
var $self = ghmob(this);
$self.find("[onclick]").each( function() {
var $elem = ghmob(this),
onclick = $elem.attr("onclick");
$elem.attr("onclick", onclick.replace(new RegExp("this.form", 'g'), "win0"));
});
});
function restore_label(id, is_checkbox) {
let selector = '#' + jqSelEsc(id);
ghmob(selector.replace('##', '#')).find('[id]').each( function() {
var field_id = this.id,
$saved_label = __saved_labels[field_id];
if (typeof $saved_label === "undefined") {
field_id = field_id.replace("win0div", "");
$saved_label = __saved_labels[field_id];
if (typeof $saved_label === "undefined") {
return;
}
}
var escaped_id = jqSelEsc(field_id).replace('#', '');
var $field = ghmob('[id="' + escaped_id + '"]');
var $existing_label = ghmob('label[for="' + escaped_id + '"]').not('.ps_indicator');
if ($field.closest('div[id]').find('span.PSEDITBOXLABEL:contains(' + JSON.stringify($saved_label.text().trim()) + ')').length > 0) {
$existing_label = $existing_label.add($field.closest('div[id]').find('span.PSEDITBOXLABEL:contains(' + JSON.stringify($saved_label.text().trim()) + ')'));
}
var have_existing = $existing_label.length !== 0;
var existing_text = $existing_label.text();
if (have_existing) {
// we remove the existing label because the saved label may have been
// styled already, so we only want the updated label text
$existing_label.remove();
}
// TODO - set this variable outside of this function
window.isSearchDialog = typeof(window.isSearchDialog) === "undefined" ?
ghPage.isSearch() : window.isSearchDialog;
var field_type = $field.attr("type");
if (field_type === "checkbox" || field_type === "radio") {
$saved_label.insertAfter($field);
}
else if (isSearchDialog && ghPage.isFluid() === false) {
var $tr = $field.closest('tr'),
$td = $tr.children('td').first();
$td.prepend($saved_label);
}
else {
// TODO - limit this to no more than 3 parents up the chain
var $field_contain = $field.closest("div[data-role='fieldcontain']");
if (isSearchDialog && ghPage.isFluid()) {
$field_contain = $field.closest('.psc_fld-prompt').find('.ps_box-label').first();
}
if ($field_contain.length !== 0) {
$field_contain.prepend($saved_label);
}
else {
var $parent = $field.parent(),
$insert_tgt = $parent.hasClass("ui-select") ? $parent : $field;
$saved_label.insertBefore($insert_tgt);
}
}
if (have_existing) {
var saved_text = $saved_label.text();
if (existing_text !== saved_text) {
var is_override = $saved_label.attr("data-is-override") === "true",
replace_text = is_override ? saved_text : existing_text,
plain_text = $saved_label.children().length === 0,
$replace_tgt = plain_text ? $saved_label
: $saved_label.find(".ui-btn-text");
$replace_tgt.text( replace_text );
}
}
delete __saved_labels[field_id];
});
}
function save_grid_labels(id) {
var div = ghmob('#' + jqSelEsc(id));
if (div.length == 0) {
return;
}
var labels = [];
div.find('input[type="checkbox"], input[type="radio"]').each( function() {
var input = ghmob(this),
id = this.id,
td = input.closest('td'),
label = td.find('label[for="' + jqSelEsc(id) + '"]').not('.ps_indicator');
if (label.length === 1) {
labels.push( { 'id' : id , 'text' : label.text() } );
}
});
div.data('labels', labels);
}
function restore_grid_labels(id) {
var div = ghmob('#' + jqSelEsc(id)),
labels = div.data('labels');
if (div.length === 0 || typeof labels == 'undefined') {
return;
}
for (var i = 0; i < labels.length; i++) {
var id = labels[i].id,
txt = labels[i].text,
input = ghmob('#' + jqSelEsc(id));
input.parent().prepend('<label for="' + id + '">' + txt + '</label>');
}
}
ghmob(document).off('fieldupdate.ghajax.gridupdate').on('fieldupdate.ghajax.gridupdate', function(event, data) {
var id = data.fieldId,
div = ghmob('#' + jqSelEsc(id)),
isGrid = div.parent('td').hasClass('gsgrid');
if (isGrid) {
if (data.isBeforeUpdate) {
save_grid_labels(data.fieldId);
}
else {
restore_grid_labels(data.fieldId);
}
}
});
function _publishFieldUpdate(fieldId, isBeforeUpdate) {
ghmob(document).trigger('fieldupdate',
{ 'fieldId' : fieldId,
'isBeforeUpdate' : isBeforeUpdate
}
);
}
ghmob(document).off('fieldupdate.ghajax.beforeupdate').on('fieldupdate.ghajax.beforeupdate', function(event, data) {
var fieldId = data.fieldId,
isBeforeUpdate = data.isBeforeUpdate;
if (!!!fieldId) {
return;
}
if (fieldId.match(/PAGECONTAINER$/)) {
ghmob(document).trigger('pageupdate', { fullPage: true });
}
else if (isBeforeUpdate && fieldId.match(/PSPANELTABS/)) {
try {
ghmob('#' + fieldId).jqmData('mobile-navbar', null);
}
catch (err) {} // OK
}
else {
var field = ghmob('[id="' + fieldId + '"]');
if (isBeforeUpdate !== true && (field.parents('.ui-table, .ui-body, .ui-collapsible').length > 0 || field.find('.ui-btn, input, select, textarea, .ui-table').length > 0)) {
ghmob('[id="' + fieldId + '"]').addClass('gh-field-hide');
}
}
});
ghmob(document).off('fieldupdate.ghajax.labelrestore').on('fieldupdate.ghajax.labelrestore', function(event, data) {
// if this was a full page update and the page changed, then we don't want
// to restore the labels
if (!!!data || !!!data.fieldId) {
return false;
}
if (data.fieldId.match(/PAGECONTAINER$/)) {
return false;
}
if (data.isBeforeUpdate) {
// console.log("SAVE label for " + data.fieldId);
save_label(data.fieldId);
} else {
// console.log("RESTORE label for " + data.fieldId);
restore_label(data.fieldId);
}
});
function ajaxBeforeUpdate(ajaxPageId) {
ghmob('#jqm_main_page').trigger('ajaxbeforeupdate',
{ 'ajaxPageId' : ajaxPageId }
);
}
// TODO - why aren't we just triggering ajaxupdate on the document and letting
// different parts listen as they see fit?
// - I guess we do want to hide the loading message as soon as possible
//
function ajaxUpdate() {
var focused = document.activeElement;
ghmob('input[style]').css('width', '');
try { fixups(); } catch (err) {}
ghmob(document).trigger('pagebeforecreate');
ghmob(document).trigger('ajaxupdate');
if (ghInit.awaitingIncomingScripts === false) {
ghUtils.delay(function() {
ghmob(document).trigger('pageinit', { fromAjaxUpdate: true });
});
}
else {
ghLoader.show();
}
}
function save_node(id) {
var node = document.getElementById(id),
found = !!node,
parent = found ? node.parentNode : null,
td_class = ghmob(node).closest("td").attr("class");
if (found) {
parent.removeChild(node);
return { "parent" : parent, "node" : node, "td_class" : td_class };
}
else {
return null;
}
}
function restore_node(parent, node, stub) {
// if stub is passed in, it must be a child of ''parent''
if (!!stub) {
parent.insertBefore(node, stub);
parent.removeChild(stub);
}
else {
parent.appendChild(node);
}
}
function restore_saved_nodes() {
var saved_count = window.__saved_nodes.length;
if (saved_count === 0) {
return;
}
for (var i = 0; i < saved_count; i++) {
if (!!!window.__saved_nodes[i]) { continue; }
var saved = window.__saved_nodes[i],
node = saved.node,
id = node.id,
td_class = saved.td_class,
stub_id = "stub_" + id,
stub = document.getElementById(stub_id);
parent = !!stub ? stub.parentNode : null;
if (stub === null) {
console.log(id + " was saved before update, but " +
stub_id + " was not found");
continue;
}
if (parent === null) {
console.log("Could not find parent node for " + stub_id);
continue;
}
restore_node(parent, node, stub);
if (!!td_class) {
ghmob(node).closest("td").addClass(td_class);
parent.className = td_class;
}
delete window.__saved_nodes[node];
}
window.__saved_nodes = [];
}
function actionOnSelect(actionSelector, selectSelector) {
ghmob(actionSelector).hide();
ghmob(selectSelector).on('change', function (e) {
invokeFieldAction(actionSelector, 100);
});
}
function fixTermSelection() {
var gridId = 'SSR_DUMMY_RECV1';
var gridDiv = ghmob('#win0div' + gridId + '\\$sels\\$0');
if (gridDiv.length === 0) return;
gridDiv.find('input[value]').each(function(index){
ghmob('div[id="win0div' + gridId + '\\$sels\\$0"]:eq(index)').prepend(ghmob(this));
ghmob(this).before('<label for="' + gridId + '$sels$' + index +'$$0">Select</label>');
})
}
ghmob('#jqm_main_page').on( 'pagebeforecreate', function() {
fixTermSelection();
});
function fixups() {
ghmob('.gsgrid ul').each( function() {
ghmob(this).find('a, input[type="button"]').each( function() {
var want = false;
if (typeof(this.href) !== 'undefined') {
want = this.href.slice(0, 'javascript:'.length) === 'javascript:';
}
if (!want) {
want = !!this.onclick;
}
if (want) {
ghmob(this).addClass('actionable');
}
});
});
ghPage.includeGSData();
ghmob('input[type="text"]').on( 'keypress', function(e) {
var is_return = (e.which == 13) || (e.which == 10);
if ( is_return && !e.target ) {
var tgt = ghmob(e.target);
if ( tgt.hasClass('PSERROR') ) {
return;
}
e.preventDefault();
e.stopPropagation();
tgt.trigger('blur');
}
});
ghmob('div[data-display-control]').each( function() {
var rel_disp_cls = 'related_display';
var $this = ghmob(this);
if ($this.hasClass(rel_disp_cls)) {
return;
}
var $ctrl = ghmob('#' + jqSelEsc($this.data('display-control')));
if ($ctrl.length != 0) {
$this.addClass(rel_disp_cls);
$ctrl.append($this);
$ctrl.addClass('display_control');
// TODO - add hidden attribute for accessibility
$this.find('label').hide();
}
});
ghmob('.ui-popup-container').on('popupbeforeposition', function() {
ghmob(this).find('a.ui-link-inherit').filter( function() {
return ghmob.trim( ghmob(this).text() ).length === 0;
}).html('&nbsp;');
});
if (ghConfig.page.useTypeahead !== true) {
ghmob('#ICTypeAheadID').attr('value', '');
}
}
function _publishAjaxOnloadComplete(url, form, name, params, bPrompt) {
ghmob('#jqm_main_page').trigger('ajaxcomplete',
{ 'url' : url ,
'form' : form ,
'name' : name,
'params' : params,
'prompt' : bPrompt
}
);
}
function accessibleDialogInit() {
// TODO - this shouldn't presume it will always be jqm_main_page
ghmob('#jqm_main_page').attr('aria-hidden', 'true');
}
function accessibleDialogEnd(dialog, elem) {
// TODO - this shouldn't presume it will always be jqm_main_page
ghmob('#jqm_main_page').attr('aria-hidden', 'false');
if (typeof(dialog) !== 'undefined') {
dialog.attr('aria-hidden', 'true');
}
if (typeof(elem) !== 'undefined') {
elem.trigger('focus');
}
}
if (typeof(onLoadExt_win0) !== 'undefined' && typeof(orig_onLoadExt_win0) === 'undefined') {
window.orig_wrapped_onLoadExt_win0 = window.onLoadExt_win0;
window.wrapped_onLoadExt_win0 = function() {
ghmob.ready();
var result = window.orig_wrapped_onLoadExt_win0.apply(window, arguments);
return result;
}
window.onLoadExt_win0 = window.wrapped_onLoadExt_win0;
}
ghmob(document).ready(function() {
if (ghPage.isFluid()) {
return;
}
if (typeof window.pAction_win0 !== 'undefined' && typeof window.realPromptAction_win0 === 'undefined') {
window.realPromptAction_win0 = window.pAction_win0;
window.pAction_win0 = window.wrappedPromptAction_win0;
}
if (typeof window.aAction_win0 !== 'undefined' && typeof window.realAjaxAction_win0 === 'undefined') {
window.realAjaxAction_win0 = window.aAction_win0;
window.aAction_win0 = window.wrappedAjaxAction_win0;
}
if (typeof setSelectElemOptions_win0 !== 'undefined' && typeof window.real_setSelectElemOptions_win0 === 'undefined') {
window.real_setSelectElemOptions_win0 = window.setSelectElemOptions_win0;
window.setSelectElemOptions_win0 = window.wrapped_setSelectElemOptions_win0;
}
if (!!window.net && !!!window.net.wrappedContentLoader) {
window.net.wrappedContentLoader = function(url,form,name,method,onload,onerror,params,contentType,bAjax,bPrompt,headerArray,isAsync) {
var self = this;
params = params || '';
ghmob('input[type="hidden"][name^="_gs_"]').each(function() {
if (params.indexOf(this.id) === -1) return;
if (!!params) {
params = params + '&';
}
params = params + this.id + '=' + this.value;
});
var wrapped_onload = !!onload && function() {
onload.apply(self, arguments);
_publishAjaxOnloadComplete(url, form, name, params, bPrompt);
}
return window.net.realContentLoader.call(self,url,form,name,method,wrapped_onload,onerror,params,contentType,bAjax,bPrompt,headerArray,isAsync);
}
window.net.wrappedContentLoader.prototype = window.net.ContentLoader.prototype;
window.net.realContentLoader = window.net.ContentLoader;
window.net.ContentLoader = window.net.wrappedContentLoader;
}
if (!!window.net2 && !!!window.net2.wrappedContentLoader) {
window.net2.wrappedContentLoader = function(url,form,name,method,onload,onerror,params,contentType,bAjax,bPrompt,headerArray,isAsync,sXMLResponse) {
var self = this;
params = params || '';
ghmob('input[type="hidden"][name^="_gs_"]').each(function() {
if (params.indexOf(this.id) === -1) return;
if (!!params) {
params = params + '&';
}
params = params + this.id + '=' + this.value;
});
var wrapped_onload = !!onload && function() {
onload.apply(self, arguments);
_publishAjaxOnloadComplete(url, form, name, params, bPrompt);
}
return window.net2.realContentLoader.call(self,url,form,name,method,wrapped_onload,onerror,params,contentType,bAjax,bPrompt,headerArray,isAsync,sXMLResponse);
}
window.net2.wrappedContentLoader.prototype = window.net2.ContentLoader.prototype;
window.net2.realContentLoader = window.net2.ContentLoader;
window.net2.ContentLoader = window.net2.wrappedContentLoader;
}
if (!!window.ptCommonObj2 && !!!window.ptCommonObj2.wrappedIsAJAXReq) {
window.ptCommonObj2.wrappedIsAJAXReq = function(form,name) {
if (name === '#KEYA0' || name === '#ICKEYA0') {
return false;
}
return window.ptCommonObj2.realIsAJAXReq(form, name);
}
window.ptCommonObj2.realIsAJAXReq = window.ptCommonObj2.isAJAXReq;
window.ptCommonObj2.isAJAXReq = window.ptCommonObj2.wrappedIsAJAXReq;
}
if (typeof(window.doModal) !== 'undefined' && typeof(window.real_doModal) === 'undefined') {
window.real_doModal = window.doModal;
window.doModal = function() {
accessibleDialogInit();
var result = window.real_doModal.apply(this, arguments);
var dialog = ghmob('#pt_modals');
var launchID = arguments[5];
dialog.data('launch_id', launchID);
dialog.attr('aria-hidden', 'false');
return result;
}
}
if (typeof(window.closeModalAll) !== 'undefined' && typeof(window.real_closeModalAll) === 'undefined') {
window.real_closeModalAll = window.closeModalAll;
window.closeModalAll = function() {
var dialog = ghmob('#pt_modals'),
elem = ghmob( jqSelEsc('#' + dialog.data('launch_id') ) );
accessibleDialogEnd(dialog, elem);
return window.real_closeModalAll.apply(this, arguments);
}
}
if (typeof(PT_Dialog) !== 'undefined' && typeof(PT_Dialog.closeModalDialog0) !== 'undefined' && typeof(PT_Dialog.real_closeModalDialog0) === 'undefined') {
PT_Dialog.real_closeModalDialog0 = PT_Dialog.closeModalDialog0;
PT_Dialog.closeModalDialog0 = function() {
var dialog = ghmob('#pt_modals'),
elem = ghmob( jqSelEsc('#' + dialog.data('launch_id') ) );
accessibleDialogEnd(dialog, elem);
return PT_Dialog.real_closeModalAll.apply(this, arguments);
}
}
if (!!!window.real_GetDomData && !!window.GetDomData) {
window.real_GetDomData = window.GetDomData;
window.wrapped_GetDomData = function (form, szTC, szActionName) {
szTC = "_self";
window.real_GetDomData(form, szTC, szActionName);
};
window.GetDomData = window.wrapped_GetDomData;
}
fixups();
});
ghmob(document).on('pageupdate', function(event, data) {
var beforeUpdate = data['isBeforeUpdate'],
pageSelector = '#' + jqSelEsc(data['fieldId']),
pageContainer = ghmob(pageSelector);
if (beforeUpdate) {
pageContainer.hide();
ghmob('#jqm_main_page').off('ajaxupdate').on('ajaxupdate', function() {
pageContainer.show();
});
}
else {
pageContainer.show();
}
});

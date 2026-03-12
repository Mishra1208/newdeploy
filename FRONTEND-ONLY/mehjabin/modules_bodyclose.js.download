
/**
* Modules
*/
/**
* ghHeader
*
* @module ghHeader
* @config enabled [true, false]
* @config logoutIcon [FontAwesome class]
* @config logoutText [string]
* @config menuIcon [FontAwesome class]
* @config menuText [string]
* @config homeURL [string]
* @config logoutURL [string]
* @config useSessionHomeURL [true, false]
* @config updatePageHeadings [true, false]
*
* @trigger ghHeaderPageHeader
* @trigger ghHeaderAddHeadings
*/
var ghHeader = ghHeader || {
/**
* headings
* Default HTML headings
*
* @ignore
* @type {array}
*/
headings: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'],
/**
* headerSelectors
* Default selectors for page headings
*
* @type {array}
*/
headerSelectors: [
['.PATRANSACTIONTITLE', '.PSSRCHTITLE', '.PAPAGETITLE', '[id*="PGTITLE_PAGE_TITLE"]'],
['.PATRANSACTIONTITLE', '.PAPAGETITLE', '.SSSPAGEKEYTEXT', '.SSSKEYTEXT'],
['.PABOLDTEXT', '.SSSPAGEKEYTEXT', '.PAPAGETITLE', '.SSSKEYTEXT', '[id*="_PAGE_KEYDESCR"]'],
],
/**
* lastPageHeader
* Returns last page heading
*
* @ignore
* @returns {jQuery}
*/
lastPageHeader: function() {
return ghmob('.gh-page-header-headings').children(this.headings.join()).last();
},
/**
* headingStartLevel
* Returns starting level for content headings
*
* @ignore
* @param {jQuery} selector
* @returns {int}
*/
headingStartLevel: function(selector) {
var lastPageHeader = this.lastPageHeader();
var headingStartLevel = this.getHeadingLevel(lastPageHeader, true);
if (typeof headingStartLevel === 'undefined') {
headingStartLevel = 1;
}
if (typeof selector !== 'undefined' && ghmob(selector).length > 0) {
var prevHeadings = ghmob(selector).parents().not(ghmob(selector).parent()).children(this.headings.join());
prevHeadings.each(function() {
if (ghmob(this).hasClass('ps_header-group') && ghmob(this).is(':visible') === false) return;
var prevHeadingLevel = ghHeader.getHeadingLevel(ghmob(this));
if (prevHeadingLevel >= headingStartLevel) {
headingStartLevel = prevHeadingLevel + 1;
}
});
}
return (headingStartLevel === 7) ? 6 : headingStartLevel;
},
/**
* linkSelectors
* Default links for header
*
* @type {array}
*/
linkSelectors: [
'a[id*="RETURN_"], input[id*="RETURN_"][value="Return"], input[id*="RETURN_"][value^="Return to"]',
'a[id*="_RETURN"], input[id*="_RETURN"][value="Return"], input[id*="_RETURN"][value^="Return to"]',
'input[alt^="Return to"]',
'input[type="button"][value="Return"]',
'input[type="button"][value^="Return to"]',
'a[id$="TERM_LINK"], input[id$="TERM_LINK"]',
'a[id$="PB_CLOSE"], input[id$="PB_CLOSE"]',
'a[id$="CLOSE_PB"], input[id$="CLOSE_PB"]',
'input[id="#ICList"]',
'a[id$="CHG_CLS_LINK"], input[id$="CHG_CLS_LINK"]',
'a[id*="CHANGE_TERM"], input[id*="CHANGE_TERM"]',
'a[id*="RETURNTO"], input[id*="RETURNTO"]',
'a[id*="_BACK"], input[id*="_BACK"]',
'.ps_header_modal .psc_modal-close',
'.ps_apps_pageheader a',
'input[id="#ICCancel"]',
'input[id*="CANCEL_PB"]',
'input[value="Cancel"]',
],
/**
* splitList
* Split list to parse out header text
*
* @ignore
* @type {array}
*/
splitList: [
{
splitOn: ' | ',
takeSlice: 0,
},
],
/**
* siteHeader
* Format site header
*
* @deprecates formatFixedHeader
* @ignore
* @returns {void}
*/
siteHeader: function() {
// vars
var header = ghmob('div[data-role="page"] > div[data-role="header"]');
var siteTitle = header.find(ghHeader.headings.join() + ', .ui-title').first();
var menuPanel = ghmob('.ui-panel[role="navigation"]');
var menu = menuPanel.find('> .ui-panel-inner > .ui-listview, > .ui-panel-inner > .gh-listview');
var menuButton = header.find('[id="nav-breadcrumbs-button"]');
var menuIcon = ghConfig.header.menuIcon;
var menuText = ghConfig.header.menuText;
var logoutButton = header.find('[id="nav-options-button"]');
var logoutIcon = ghConfig.header.logoutIcon;
var logoutText = ghConfig.header.logoutText;
// Breadcrumbs/Navigation button
if (menuButton.length === 0 && ghmob('.isLogin').length === 0) {
var menuButtonHTML = ghmob('<div class="ui-btn ui-btn-left"><a href="#' + menuPanel.attr('id') + '" data-icon="fa ' + menuIcon + '" id="nav-breadcrumbs-button">' + menuText + '</a></div>');
menuButtonHTML.find('a').button();
header.prepend(menuButtonHTML);
menuButton = header.find('[id="nav-breadcrumbs-button"]');
}
else {
menuButton.find('.ui-icon').removeClass('ui-icon-arrow-l').addClass('fa ' + menuIcon);
menuButton.find('.ui-btn-text').text(menuText);
}
menuButton.find('.ui-icon').attr('aria-hidden', 'true');
if (ghConfig.navigationTiles.enabled === false && menu.length > 0) {
menu.appendTo(menuPanel.find('.ui-panel-inner'));
menuPanel.find('.ui-panel-inner').children().not(menu).remove();
}
// PS buttons
var psIcons = [
{
id: 'notify',
selector: 'a[id="pthdr2notify"], a[id="PT_NOTIFY"]',
},
{
id: 'recent',
selector: 'a[id="pthdr2recentlyvisited"], a[id="HDR_MRU_BTN"]',
},
{
id: 'favorites',
selector: 'a[id="pthdr2favorites"], a[id="HDR_FAV_BTN"]',
},
];
ghmob.each(psIcons, function(i) {
if (typeof ghConfig.header[psIcons[i].id] !== 'undefined' && ghConfig.header[psIcons[i].id].enabled === true && ghmob(psIcons[i].selector, ghUtils.getWinTop().document).length > 0) {
var buttonSel = header.find('[id="' + psIcons[i].id + '-button"]');
if (buttonSel.length === 0 && ghmob('.isLogin').length === 0) {
var buttonHTML = ghmob('<div class="ui-btn ui-btn-right gh-ps-btn ' + psIcons[i].id + '"><a href="#" data-icon="fa ' + ghConfig.header[psIcons[i].id].icon.on + '" id="' + psIcons[i].id + '-button" target="gh-top">' + ghConfig.header[psIcons[i].id].text + '</a></div>');
buttonHTML.find('a').button();
siteTitle.after(buttonHTML);
buttonSel = header.find('[id="' + psIcons[i].id + '-button"]');
}
buttonSel.find('.ui-icon').attr('aria-hidden', 'true');
}
});
// Logout button
if (logoutButton.length === 0 && ghmob('.isLogin').length === 0) {
var logoutButtonHTML = ghmob('<div class="ui-btn ui-btn-right logout"><a href="' + ghConfig.header.logoutURL + '" data-icon="fa ' + logoutIcon + '" id="nav-options-button" target="gh-top">' + logoutText + '</a></div>');
logoutButtonHTML.find('a').button();
header.append(logoutButtonHTML);
logoutButton = header.find('[id="nav-options-button"]');
}
else {
logoutButton.find('.ui-icon').removeClass('ui-icon-gear').addClass('fa ' + logoutIcon);
logoutButton.find('.ui-btn-text').text(logoutText);
logoutButton.attr('href', ghConfig.header.logoutURL).attr('target', 'gh-top');
logoutButton.parent('.ui-btn').addClass('logout');
}
logoutButton.find('.ui-icon').attr('aria-hidden', 'true');
// Home button
var homeURL = this.setHomepage();
if (ghPage.isLogin()) {
homeURL = '#';
}
var siteName = ghConfig.client.siteTitle;
if (typeof siteName === 'undefined' && typeof freemarker.page.siteName !== 'undefined') {
siteName = freemarker.page.siteName;
}
if (siteTitle.find('a').length === 0) {
var siteTitleHTML = ghmob('<div class="ui-title"><a href="' + homeURL + '" target="gh-top" data-icon="logo" id="nav-home-button">' + siteName + '</a></div>');
siteTitleHTML.find('a').button();
siteTitle.before(siteTitleHTML);
siteTitle.remove();
}
else {
siteTitle.find('a').attr('href', homeURL).find('.ui-btn-text').text(siteName);
}
},
/**
* slideOut
*
* @param {jQuery} selector
* @param {string} action ['open', 'close']
* @returns {void}
*/
slideOut: function(selector, action) {
var psIcon = {};
var activeBtn = 'div[data-role="page"] > div[data-role="header"] .ui-btn-right a.active';
var thisFrame;
if (typeof selector === 'undefined') {
selector = ghmob(activeBtn).first();
selector = selector.add(ghmob(activeBtn, ghUtils.getWinTop().document).first());
ghmob('iframe', ghUtils.getWinTop().document).each(function() {
thisFrame = ghmob(this)[0].contentWindow.document;
selector = selector.add(ghmob(thisFrame).find(activeBtn).first());
ghmob(thisFrame).find('body').css('pointer-events', 'auto');
});
if (selector.length === 0) return;
}
if (selector.is('[id="notify-button"]')) {
psIcon.selector = 'a[id="pthdr2notify"], a[id="PT_NOTIFY"]';
psIcon.type = 'notify';
}
if (selector.is('[id="recent-button"]')) {
psIcon.selector = 'a[id="pthdr2recentlyvisited"], a[id="HDR_MRU_BTN"]';
psIcon.type = 'recent';
}
if (selector.is('[id="favorites-button"]')) {
psIcon.selector = 'a[id="pthdr2favorites"], a[id="HDR_FAV_BTN"]',
psIcon.type = 'favorites';
}
if (typeof psIcon.selector === 'undefined') return;
if (typeof action === 'undefined') {
if (selector.hasClass('active')) {
action = 'close';
}
else {
action = 'open';
}
ghmob(psIcon.selector, ghUtils.getWinTop().document)[0].click();
}
selector.removeClass('active');
if (action === 'open') {
ghUtils.getWinTop().ghLoader.show();
ghmob('body', ghUtils.getWinTop().document).addClass('slideout-open');
ghmob('iframe', ghUtils.getWinTop().document).not('[id="psQABWinIFrame"]').attr('tabindex', '-1');
selector.addClass('active').find('.ui-icon').removeClass(ghConfig.header[psIcon.type].icon.on).addClass(ghConfig.header[psIcon.type].icon.off);
}
if (action === 'close') {
ghUtils.getWinTop().ghLoader.hide();
ghmob('body', ghUtils.getWinTop().document).removeClass('slideout-open');
ghmob('iframe', ghUtils.getWinTop().document).not('[id="psQABWinIFrame"]').attr('tabindex', '-1');
selector.find('.ui-icon').removeClass(ghConfig.header[psIcon.type].icon.off).addClass(ghConfig.header[psIcon.type].icon.on);
ghModal._batchAccessibilityHooks(false);
}
},
/**
* pageHeader
* Creates page header
*
* @deprecates ghPageHeader
* @ignore
* @param {jQuery} selectors
* @param {bool} append
* @returns {void}
*/
pageHeader: function(selectors, append) {
// vars
var pageHeaders = [];
var pageHeaderIndex = 0;
// Reset
if (append === false) {
this.resetHeadings();
}
// Update header selectors
selectors = this.updateHeadingSelectors(selectors);
ghmob.each(selectors, function(i) {
var firstItem = ghmob(this);
if (Array.isArray(selectors[i])) {
firstItem = ghmob(selectors[i].join());
}
firstItem = firstItem.filter(function() {
return (ghmob(this).hasClass('gh-page-header-original') === false && ghmob(this).parents('.gh-frame-as-modal.ps_modal_body .ps_header_modal').length === 0 && (ghConfig.page.showPSFrame !== true || (ghConfig.page.showPSFrame === true && ghmob(this).parents('#PT_HEADER [id="' + ghPage.getWin() + 'hdrdivPT_TITLE_CONT"], #pthdr2container').length === 0)));
}).first();
if (firstItem.length === 0 || firstItem.text().trim() === '' || firstItem.parents('.ps_ag-navigation, .ps_ag-navigation-list, [id="ptifrmpopup"], .psc_force-hidden, .psc_hidden-readable').length > 0) return;
pageHeaders[pageHeaderIndex] = firstItem.text().trim();
firstItem.addClass('gh-hidden gh-page-header-original').attr('aria-hidden', 'true');
// If page header heading has any of the split index, get text prior to split char
ghmob.each(ghHeader.splitList, function(k) {
var splitOn = ghHeader.splitList[k].splitOn;
var takeSlice = ghHeader.splitList[k].takeSlice;
if (pageHeaders[pageHeaderIndex].indexOf(splitOn) !== -1) {
var pageHeaderSplit = pageHeaders[pageHeaderIndex].split(splitOn);
if (pageHeaderSplit) {
pageHeaders[pageHeaderIndex] = pageHeaderSplit[takeSlice].trim();
}
}
});
var pipeIndex = firstItem.text().indexOf(' | ');
if (firstItem.hasClass('SSSKEYTEXT') && pipeIndex === -1 || firstItem.hasClass('PABOLDTEXT') && pipeIndex === -1) {
pageHeaders[pageHeaderIndex] = null;
firstItem.removeClass('gh-hidden gh-page-header-original').removeAttr('aria-hidden');
}
else if (pageHeaders[pageHeaderIndex] === pageHeaders[pageHeaderIndex - 1]) {
pageHeaders[pageHeaderIndex] = null;
}
else {
pageHeaderIndex++;
}
});
if (pageHeaders[0]) {
// Add heading text to page header
this.addHeadings(pageHeaders, true);
}
this.hideEmptyCells();
ghmob(document).trigger('ghHeaderPageHeader');
},
/**
* resetHeadings
*
* @returns {void}
*/
resetHeadings: function() {
// Show original headings
ghmob('.gh-page-header-original').removeClass('gh-page-header-original gh-hidden').removeAttr('aria-hidden');
// Remove existing page header
ghmob('.gh-page-header-headings').remove();
},
/**
* updateHeadingSelectors
* Updates and returns page header selectors
*
* @ignore
* @param {array} [selectors]
* @returns {array}
*/
updateHeadingSelectors: function(selectors) {
// Default selectors if no params have been passed
if (typeof(selectors) === 'undefined') {
selectors = this.headerSelectors;
}
if (ghPage.getName() === 'SSS_STUDENT_CENTER') {
selectors.splice(1);
}
if (ghPage.isHomepage()) {
selectors[0] = ['.pthomepagetabactive'];
selectors.splice(1);
}
if (ghPage.isLogin()) {
selectors = [];
}
return selectors;
},
/**
* addHeadings
* Adds headings to page header
*
* @deprecates makePageHeaderHeadings
* @param {jQuery} pageHeaders
* @param {bool} append
* @returns {void}
*/
addHeadings: function(pageHeaders, append) {
if (append === false) {
this.resetHeadings();
}
// Check if page header wrapper exists
if (ghmob('.gh-page-header').length === 0 || ghmob('.gh-page-header-headings').length === 0) {
this.pageHeaderWrapper(pageHeaders);
}
// Get heading level
var lastHeading = this.lastPageHeader();
var level;
if (lastHeading.length > 0) {
level = this.getHeadingLevel(lastHeading, true);
}
else {
level = 1;
}
// Debug
ghLog.info('Preparing to add headings', pageHeaders);
// Apply appropriate level to each page header heading
var setLevel;
ghmob.each(pageHeaders, function(i, heading) {
if (typeof heading === 'undefined' || heading === null || ghmob('.gh-page-header').find(ghHeader.headings.join()).is(':contains("' + heading + '")')) return;
setLevel = i + level;
setLevel = (setLevel > 6) ? 6 : setLevel;
ghmob('.gh-page-header-headings').append('<h' + setLevel + '>' + heading + '</h' + setLevel + '>');
if (i < pageHeaders.length) {
ghmob('.gh-page-header-headings').children(':last-child').after('<span aria-hidden="true"></span>');
}
});
// Update all headings
this.updatePageHeadings();
if (ghmob('.gh-page-header-links a').length === 0) {
this.pageHeaderLinks();
}
ghmob(document).trigger('ghHeaderAddHeadings');
},
/**
* pageHeaderWrapper
* Creates page header wrapper
*
* @deprecates makePageHeader
* @param {jQuery} pageHeaders
* @ignore
* @returns {void}
*/
pageHeaderWrapper: function(pageHeaders) {
var wrapper = ghmob('form.PSForm, #ACE_width, table.PSPAGECONTAINER, .tilebox').first();
if (ghmob('#PT_WRAPPER').length > 0) {
wrapper = ghmob('#PT_WRAPPER').first();
}
else if (wrapper.length === 0) {
wrapper = ghmob('.ui-content').first();
}
if (ghmob('.gh-page-header-wrap').length === 0 && wrapper.length > 0) {
// Debug
ghLog.info('Create page header wrap');
if (wrapper.is('.ui-content') || wrapper.is('#PT_WRAPPER')) {
wrapper.prepend('<div class="gh-page-header-wrap"></div>');
}
else {
wrapper.before('<div class="gh-page-header-wrap"></div>');
}
}
if (ghmob('.gh-page-header-wrap').length > 0 && (typeof pageHeaders !== 'undefined' && pageHeaders.length > 0)) {
if (ghmob('.gh-page-header').length === 0) {
ghmob('.gh-page-header-wrap').prepend('<div class="gh-page-header"></div>');
}
if (ghmob('.gh-page-header-headings').length === 0) {
ghmob('.gh-page-header').prepend('<div class="gh-page-header-headings" tabindex="-1"></div>');
}
// Is Kurogo?
if (ghConfig.core.useKurogo === true && ghmob('.gh-page-header-headings .gh-page-header-home').length === 0) {
// Debug
ghLog.info('Building page header within Kurogo app');
ghmob('.gh-page-header-headings').prepend('<span class="gh-page-header-home"><a target="gh-top" href="' + this.setHomepage() + '"><span class="fa fa-home"></span><span class="sr-only">Home</span></a></span>');
}
}
},
/**
* hideEmptyCells
* Hides the empty cells left by removing page headings from within the page so white space is not visible
*
* @ignore
* @returns {void}
*/
hideEmptyCells: function() {
ghmob('.gh-page-header-original').each(function() {
if (ghmob(this).closest('td').text().trim() === ghmob(this).text().trim()) {
ghmob(this).closest('td').addClass('gh-hidden').attr('aria-hidden', 'true');
}
});
},
/**
* pageHeaderLinks
* Initializes page header links
*
* @deprecates ghPageHeaderLinkInit
* @ignore
* @returns {void}
*/
pageHeaderLinks: function() {
if (ghmob('.gh-page-header').length === 0 || freemarker.page.isHomepage || freemarker.page.isLogin) return;
var links = ghmob(this.linkSelectors.join());
var doReset = false;
if (ghmob('.gh-header-link-original').length === 0) {
doReset = true;
}
links.each(function() {
if ((ghmob(this).is('a[id*="RETURN"]') && ghmob(this).text().indexOf('Return') === -1) || (ghmob(this).parents('.ps_apps_pageheader').length > 0 && ghmob(this).text().indexOf('Change') === -1) || ghmob(this).hasClass('psc_hidden') || ghmob(this).parents('.psc_hidden, .psc_has_popup, .gh-container-footer, .gh-container-footer-original, .prompt, .ptdropdownmenu, .gh-footer-field, [id="ptifrmpopup"], .gh-frame-as-modal').length > 0 || (ghConfig.footer.autoInitialize && ghmob(this).is(ghFooter.footerButtons.join())) || (ghmob(this).is('[id*="PT_BUTTON_BACK"]') && (ghConfig.page.showPSFrame === true || links.length > 1))) return;
ghLog.info('Add page header link', ghmob(this));
if (ghmob(this).text().indexOf('Close') > -1 || ghmob(this).text().indexOf('Cancel') > -1 || (typeof ghmob(this).attr('id') !== 'undefined' && (ghmob(this).attr('id').indexOf('Cancel') > -1 || ghmob(this).attr('id').indexOf('CLOSE_BTN') > -1 || ghmob(this).attr('id').indexOf('CANCEL') > -1 || ghmob(this).attr('id').indexOf('PT_BUTTON_BACK') > -1))) {
ghHeader.appendHeaderLink(ghmob(this), { reset: doReset, text: 'Return' });
}
else {
ghHeader.appendHeaderLink(ghmob(this), { reset: doReset });
}
});
if (ghmob('.gh-header-link-original').length === 0) {
doReset = true;
}
else {
doReset = false;
}
if (doReset) {
ghmob('.gh-page-header-links').remove();
}
if (ghConfig.page.showPSFrame === true || ghPage.getName() === 'SSS_STUDENT_CENTER') return;
if (ghmob('.gh-page-header-links').length === 0 && (ghmob('[id="PT_WORK_PT_BUTTON_BACK"]').length > 0 || ghmob('[id="PT_WORK_PT_BUTTON_BACK"]', ghUtils.getWinTop().document).length > 0 || (freemarker.ptVersion && freemarker.ptVersion.indexOf('.') > -1 && parseInt(freemarker.ptVersion.split('.')[1]) > 58))) {
var returnLink = ghmob('<a href="#">Return</a>');
if (ghPage.isIFrameModal() && ghPage.isActivityGuide() !== true) {
returnLink = returnLink.attr('onclick', 'javascript:doUpdateParent(document.' + ghPage.getWin() + ',\'#ICCancel\');');
}
else if (window['DoBack'] && (ghPage.isFluid() || ghUtils.getWinTop().ghPage.isFluid())) {
returnLink = returnLink.attr('onclick', 'javascript:ghUtils.getWinTop().DoBack(\'' + ghPage.getWin() + '\');');
}
else if (window['DoBackClassic']) {
returnLink = returnLink.attr('onclick', 'javascript:DoBackClassic();');
}
else {
return;
}
ghHeader.appendHeaderLink(returnLink, { reset: doReset });
}
},
/**
* updateLinkSelectors
* Checks if there are additional 'Return' links and adds to header links array if so.
*
* @ignore
* @returns {void}
*/
updateLinkSelectors: function() {
// Checks anchor tags with 'Left' ids
if (ghmob('a[id="Left"]').text().trim() !== 'Return') return;
if (ghmob('a[id="Left"] input').length > 0) {
this.linkSelectors.push('a[id="Left"] input');
}
else {
this.linkSelectors.push('a[id="Left"]');
}
},
/**
* appendHeaderLink
* Adds link to page header
*
* @deprecates ghPageHeaderLink
* @param {jQuery} selectors
* @param {obj} [config]
* @param {jQuery} [config.link]
* @param {bool} [config.reset]
* @param {string} [config.text]
* @returns {void}
*/
appendHeaderLink: function(selectors, config) {
// config
if (typeof config === 'string') {
var deprecatedLink = config;
config = {};
config.link = deprecatedLink;
}
if (typeof config === 'undefined') {
config = {};
}
config = ghmob.extend({
link: (typeof config.link === 'undefined') ? '' : config.link,
reset: (typeof config.reset === 'undefined') ? false : config.reset,
text: (typeof config.text === 'undefined') ? '' : config.text,
}, config);
ghmob.each(selectors, function() {
var selector = ghmob(this);
var selectorWrapper = selector;
if (selector.length === 0) return;
if (selector.is('a') === false && selector.is('input') === false) {
if (selector.find('a[href], a[onclick], input[onclick]').length === 0) return;
selector = selector.find('a[href], a[onclick], input[onclick]').first();
}
else if (selector.parents('div[id][data-pnlname]').length > 0) {
selectorWrapper = selector.closest('div[id][data-pnlname]');
}
var link = config.link;
var linkText = config.text;
var linkOnclick = '';
var linkHref = '';
var reset = config.reset;
// Get text from selector
if (linkText === '') {
if (selector.is('a')) {
linkText = selector.text().trim();
}
else if (selector.is('input')) {
linkText = selector.val();
}
}
// Get action from selector
if (link === '') {
if (typeof selector.attr('href') !== 'undefined') {
linkHref = selector.attr('href');
}
if (typeof selector.attr('onclick') !== 'undefined') {
linkOnclick = selector.attr('onclick');
linkOnclick = linkOnclick.replace('this.name', '"' + selector.attr('name') + '"');
linkOnclick = linkOnclick.replace('this.id', '"' + selector.attr('id') + '"');
linkOnclick = linkOnclick.replace(',event', '');
}
}
else {
linkHref = link;
}
if (linkText === '' || (linkOnclick === '' && linkHref === '')) return;
// Hide wrapper
if (selectorWrapper.parents('.ps_header_bar_custom').length > 0 || selectorWrapper.parents('#PT_HEADER, #pthdr2container').length === 0) {
selectorWrapper.addClass('gh-hidden gh-header-link-original').attr('aria-hidden', 'true');
}
// Make sure we have the page header link wrapper
ghHeader.createLinkWrapper();
// Existing links
if (reset === true) {
ghmob('.gh-page-header-links a').remove();
}
else {
ghmob('.gh-page-header-links a').each(function() {
if (ghmob(this).text().trim() === linkText) {
ghmob(this).remove();
}
});
}
// Append link to page header
var $link = ghmob('<a>' + linkText + '</a>');
if (linkHref === '') {
$link.attr('href', '#');
}
else {
$link.attr('href', linkHref);
}
if (linkOnclick !== '') {
$link.attr('onclick', linkOnclick);
}
$link.appendTo(ghmob('.gh-page-header-links-inner'));
// Debug
ghLog.info('Adding page header link', selector);
if (ghConfig.footer.includeReturnLinks === true) {
ghFooter.addItem(selector);
}
});
},
/**
* createLinkWrapper
* Checks to see if link wrapper is created
*
* @deprecates makePageHeaderLinks
* @ignore
* @returns {void}
*/
createLinkWrapper: function() {
if (ghmob('.gh-page-header-links').length === 0) {
ghmob('.gh-page-header').append('<div class="gh-page-header-links"><div class="gh-page-header-links-inner"></div></div>');
}
},
/**
* getHeadingLevel
* Takes heading as selector, returns starting level as int
*
* @ignore
* @param {jQuery} selector
* @param {bool} nextLevel
* @returns {int}
*/
getHeadingLevel: function(selector, nextLevel) {
if (ghmob(selector).is(this.headings.join()) === false) return;
var level = this.thisHeadingNumber(ghmob(selector));
if (nextLevel === true) {
level = level + 1;
}
return (level === 7) ? 6 : level;
},
/**
* thisHeadingNumber
* Takes heading as selector, returns current level as int
*
* @ignore
* @param {jQuery} selector
* @returns {int}
*/
thisHeadingNumber: function(selector) {
return parseInt(ghmob(selector).prop('tagName').slice(-1));
},
/**
* updatePageHeadings
* Updates page headings to proper level based on starting level
*
* @ignore
* @param {int} start
* @returns {void}
*/
updatePageHeadings: function(start) {
if (ghConfig.header.updatePageHeadings === false) return;
var headingStartLevel;
ghmob('.ui-content, .ui-popup').find(this.headings.join()).not('.gh-page-header-original').each(function() {
if (ghmob(this).parents('.gh-page-header').length > 0) return;
var thisHeading = ghmob(this);
if (ghmob(this).is('.ui-title') && ghmob(this).parents('.ui-popup').length > 0) {
headingStartLevel = 2;
}
else if (typeof start === 'undefined') {
headingStartLevel = ghHeader.headingStartLevel(thisHeading);
}
else {
headingStartLevel = start;
}
var headingStartString = 'h' + headingStartLevel;
var thisHeadingLevel = ghHeader.getHeadingLevel(ghmob(this));
var thisHeadingString = 'h' + thisHeadingLevel;
if (thisHeadingLevel !== headingStartLevel) {
ghLog.info('Heading start level: ' + headingStartLevel);
ghLog.info('This heading HTML: ' + ghmob('<div />').append(thisHeading.clone()).html());
var headingClone = thisHeading.clone();
var re = new RegExp(thisHeadingString, 'g');
ghLog.info('Replacing this level: ' + thisHeadingString);
ghLog.info('With this level: ' + headingStartString);
headingClone = headingClone[0].outerHTML.replace(re, headingStartString);
thisHeading.before(headingClone);
thisHeading.remove();
}
});
},
/**
* setHomepage
*
* @ignore
* @returns {void}
*/
setHomepage: function() {
var url = ghConfig.header.homeURL;
if (ghConfig.header.useSessionHomeURL) {
try {
if (typeof(Storage) !== 'undefined') {
var data = sessionStorage.getItem('pt_history');
if (typeof data === 'undefined') return;
var json = JSON.parse(data);
url = json.nodes[0].url;
if (url.toString().indexOf('PT_LANDINGPAGE') === -1 && url.toString().indexOf('?tab=') === -1) {
url = ghConfig.header.homeURL;
}
}
}
catch (err) {
ghLog.error('Error getting saved homepage url. No session storage.');
}
}
return url;
},
/**
* usernameSelectors
* Default selectors for usernames
*
* @type {array}
*/
usernameSelectors: ['div[id*="DERIVED_"][id*="_NAME"], #PERSON_NAME_NAME, #PY_IC_PI_LST_VW_NAME, #W3EB_GLOBAL_WRK_PERSON_NAME, #DERIVED_W3EB_NAME1, #EMPL_ACTV_SRCH_NAME, #PERSONAL_DATA_NAME, #DERIVED_W3EB_DESCR50, #LS_SS_PERS_SRC2_NAME_DISPLAY, #HR_SSEECMPH_WRK_NAME, #HCDL_DERIVED_FULL_NAME, #PA_I_DERIVED_NAME, #FUNCLIB_NAME_PERSON_NAME, #W3EB_ENR_SM_WRK_PERSON_NAME, #W3EB_ENR_L0_WRK_PERSON_NAME'],
/**
* formatUsername
* Formats and places username
*
* @deprecates ghUsername
* @param {array} selectors
* @returns {void}
*/
formatUsername: function(selectors) {
var username = ghmob(selectors).first();
var wrapper = username;
if (typeof selectors === 'undefined') {
selectors = this.usernameSelectors;
username = ghmob('#ACE_width, #PT_WRAPPER').find(selectors.join()).first();
}
if (username.find(this.usernameSelectors.join()).length > 0) {
username = username.find(this.usernameSelectors.join()).first();
}
if (username.is(ghHeader.headerSelectors.join()) || username.find('a').length > 0 || username.find('label').text().trim() !== '') return;
if (username.is('div[id]') === true) {
username = username.children('span').first();
}
else {
wrapper = username.closest('div[id]');
}
if (ghmob('.gh-page-header-wrap').parents('[id="' + wrapper.attr('id') + '"]').length === 0) {
wrapper.addClass('gh-hidden').attr('aria-hidden', 'true');
}
if (ghmob('.gh-page-header-wrap .gh-username').length === 0 && username.length > 0 && username.text().trim() !== '') {
var usernameDiv = ghmob('<div class="gh-username-wrap"><span class="fa fa-user" aria-hidden="true"></span> </div>');
username.removeAttr('id class style onmouseover onmouseout').addClass('gh-username').appendTo(usernameDiv);
if (ghmob('.gh-page-header').length > 0) {
if (ghmob('.gh-page-header-wrap .gh-submenu').length > 0) {
usernameDiv.insertBefore(ghmob('.gh-page-header-wrap .gh-submenu'));
}
else {
usernameDiv.appendTo(ghmob('.gh-page-header-wrap'));
}
}
}
else if (ghmob('.gh-username-wrap').length > 0) {
username.addClass('gh-hidden').attr('aria-hidden', 'true');
wrapper.addClass('gh-hidden').attr('aria-hidden', 'true');
}
this.formatUserLinks();
this.formatJobTitle();
},
/**
* jobTitleSelectors
* Default selectors for job titles
*
* @type {array}
*/
jobTitleSelectors: ['#COMPANY_TBL_DESCR, #HR_SS_EE_RCD_VW_DESCR2, div[data-pnlname][id*="JOBCODE_DESCR"]'],
/**
* formatJobTitle
* Formats and places job titles
*
* @deprecates ghJobTitle
* @param {array} selectors
* @returns {void}
*/
formatJobTitle: function(selectors) {
if (ghmob('.gh-page-header-wrap .gh-username').length === 0) return;
var jobTitle = ghmob(selectors).first();
var wrapper;
if (typeof selectors === 'undefined') {
selectors = this.jobTitleSelectors;
jobTitle = ghmob('#ACE_width, #PT_WRAPPER').find(selectors.join()).first();
}
if (jobTitle.is('div[id]') === true) {
wrapper = jobTitle;
jobTitle = jobTitle.children('span').first();
}
else {
wrapper = jobTitle.closest('div[id]');
}
if (jobTitle.closest('.ui-table').length > 0) return;
if (ghmob('.gh-page-header-wrap').parents('[id="' + wrapper.attr('id') + '"]').length === 0) {
wrapper.addClass('gh-hidden').attr('aria-hidden', 'true');
}
if (ghmob('.gh-page-header-wrap .gh-jobtitle').length === 0 && jobTitle.length > 0 && jobTitle.text().trim() !== '') {
ghmob('.gh-page-header-wrap .gh-username').after('<span class="gh-jobtitle">, ' + jobTitle.text().trim() + '</span>');
jobTitle.addClass('gh-hidden').attr('aria-hidden', 'true');
}
else if (ghmob('.gh-jobtitle').length > 0) {
jobTitle.addClass('gh-hidden').attr('aria-hidden', 'true');
wrapper.addClass('gh-hidden').attr('aria-hidden', 'true');
}
},
/**
* userLinksSelectors
* Default selectors for user links
*
* @type {array}
*/
userLinksSelectors: ['a[id*="_PB_DEFAULTS"], a[id*="_PB_USER_PREF"]'],
/**
* formatUserLinks
* Formats and places user links
*
* @ignore
* @param {array} selectors
* @returns {void}
*/
formatUserLinks: function(selectors) {
var userLinks = ghmob(selectors).first();
var wrapper;
if (typeof selectors === 'undefined') {
selectors = this.userLinksSelectors;
userLinks = ghmob('#ACE_width, #PT_WRAPPER').find(selectors.join()).filter(function() {
return (ghmob(this).text().indexOf('User Defaults') > -1);
}).first();
}
if (userLinks.is('div[id]') === true) {
wrapper = userLinks;
userLinks = userLinks.find('a').first();
}
else {
wrapper = userLinks.closest('div[id]');
}
if (ghmob('.gh-page-header-wrap').parents('[id="' + wrapper.attr('id') + '"]').length === 0) {
wrapper.addClass('gh-hidden').attr('aria-hidden', 'true');
}
if (ghmob('.gh-page-header-wrap .gh-userlinks').length === 0 && userLinks.length > 0 && userLinks.text().trim() !== '') {
ghmob('.gh-page-header-wrap .gh-username').after('<span class="gh-userlinks">, </span>');
userLinks.removeAttr('id style').appendTo(ghmob('.gh-username-wrap .gh-userlinks'));
}
},
/**
* pageHeaderCreate
*
* @private
* @returns {void}
*/
_pageHeaderCreate: function() {
this.pageHeader(this.headerSelectors, false);
if (ghPage.isTargetContent() && ghUtils.getWinTop().ghConfig.header.enabled === true) {
ghUtils.getWinTop().ghHeader.pageHeader(ghUtils.getWinTop().ghHeader.headerSelectors, false);
}
},
/**
* onPageBeforeCreate
*
* @private
* @returns {void}
*/
onPageBeforeCreate: function() {
if (ghConfig.header.enabled === false) return;
this._pageHeaderCreate();
},
/**
* _eventBindings
*
* @private
* @returns {void}
*/
_eventBindings: function() {
ghmob(document)
.off('click.ghHeader.toggleSlideOut')
.on('click.ghHeader.toggleSlideOut', 'div[data-role="page"] > div[data-role="header"] .ui-btn-right.gh-ps-btn a.ui-btn', function(event) {
ghLog.event('click.ghHeader.toggleSlideOut');
event.preventDefault();
ghHeader.slideOut(ghmob(event.currentTarget));
});
ghmob(document)
.off('click.ghHeader.closeSlideOut')
.on('click.ghHeader.closeSlideOut', '[id="psQABWinMask"], [id="psNotifyWinMask"], .pt_qab-popup .pt_qab-close', function() {
ghLog.event('click.ghHeader.closeSlideOut');
ghHeader.slideOut(undefined, 'close');
});
},
/**
* _overrideCloseNotification
*
* @private
* @returns {void}
*/
_overrideCloseNotification: function() {
if (typeof window['CloseNotification'] !== 'undefined' && typeof window['wrappedCloseNotification'] === 'undefined') {
window['realCloseNotificationOriginal'] = window['CloseNotification'];
window['wrappedCloseNotification'] = function() {
ghHeader.slideOut(undefined, 'close');
window['realCloseNotificationOriginal']();
};
window['CloseNotification'] = window['wrappedCloseNotification'];
}
},
/**
* _overrideDoQABpopup
*
* @private
* @returns {void}
*/
_overrideDoQABpopup: function() {
if (typeof window['DoQABpopup'] !== 'undefined' && typeof window['wrappedDoQABpopup'] === 'undefined') {
window['realDoQABpopup'] = window['DoQABpopup'];
window['wrappedDoQABpopup'] = function(mode) {
window['realDoQABpopup'](mode);
if (typeof mode === 'undefined' || mode === '') {
ghHeader.slideOut(undefined, 'close');
}
};
window['DoQABpopup'] = window['wrappedDoQABpopup'];
}
if (ghPage.getName() === 'PT_QAB_POPUP_FL' || ghPage.getName() === 'PTPN_CAT_NOTIFY') {
ghModal._batchAccessibilityHooks(true);
}
if (ghPage.getName() === 'PT_QAB_POPUP_FL') {
ghUtils.delay(function() {
ghmob('.ps_grid-menu a[tabindex="-1"]').removeAttr('tabindex');
}, 1000);
}
},
/**
* run
*
* @ignore
* @returns {void}
*/
run: function() {
if (ghConfig.header.enabled === false) return;
this._eventBindings();
this.siteHeader();
if (ghmob('.gh-page-header-headings').length === 0 || ghmob('.gh-page-header-headings').length > 0 && ghmob('.gh-page-header-original').length === 0) {
this.pageHeader(this.headerSelectors, false);
}
this.pageHeaderLinks();
this.formatUsername();
this._overrideCloseNotification();
this._overrideDoQABpopup();
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
* headerSelectors
* Default selectors for page headings
*
* @type {array}
*/
headerSelectors: [
['.PATRANSACTIONTITLE', '.PSSRCHTITLE', '.PAPAGETITLE', '.lphdrcenter .ps-text', '[id*="PT_PAGETITLE"], .psc_modal-pagetitle'],
['.PAPAGETITLE', '.SSSPAGEKEYTEXT', '.SSSKEYTEXT', '.psc_title-page > span'],
['.PABOLDTEXT', '.SSSPAGEKEYTEXT', '.PAPAGETITLE', '.SSSKEYTEXT'],
['.ps_pagetitle'],
['[id="PT_PANEL2_TITLE"]'],
['.psa_pagetitle'],
['.ps_ag-header-info-popup-anchor'],
['.ps_ag-processheader .ps_box-group:not(.psc_has_popup) > .ps_ag-header-info-wrapper .ps_ag-header-context-title .ps_box-value'],
['.ps_box-agtitle'],
],
/**
* usernameSelectors
* Default selectors for usernames
*
* @type {array}
*/
usernameSelectors: ['div[id*="DERIVED_"][id*="_NAME"], #PERSON_NAME_NAME, #PY_IC_PI_LST_VW_NAME, #W3EB_GLOBAL_WRK_PERSON_NAME, #DERIVED_W3EB_NAME1, #EMPL_ACTV_SRCH_NAME, #PERSONAL_DATA_NAME, #DERIVED_W3EB_DESCR50, #LS_SS_PERS_SRC2_NAME_DISPLAY, #HR_SSEECMPH_WRK_NAME, #HCDL_DERIVED_FULL_NAME, #PA_I_DERIVED_NAME, #DERIVED_TL_CLK_NAME_DISPLAY, #DERIVED_HR_EPH_NAME_DISPLAY1, #DERIVED_EP_NAME_RESULT, .ps_apps_pageheader .ps_box-value[id*="_NAME"], .ps_ag-header-context-text .ps_box-value'],
/**
* jobTitleSelectors
* Default selectors for job titles
*
* @type {array}
*/
jobTitleSelectors: ['div[data-pnlname][id*="JOBCODE_DESCR"], div[data-pnlname][id*="TITLE_DESCR"], #COMPANY_TBL_DESCR, #DERIVED_HR_EPH_TITLE_DESCR1, .ps_apps_pageheader .ps_box-value[id*="_JOBCODE"]'],
},
},
};
ghInit.module('ghHeader');
/**
* ghAccessibility
*
* @module accessibility
* @config enabled [true, false]
* @config enableSkipLinks [true, false]
* @config formatExternalLinks [true, false]
* @config forceFormAccessibility [true, false]
* @config enforceFormLabels [true, false]
* @config enhanceCheckboxRadio [true, false]
* @config setFocus [true, false]
*/
var ghAccessibility = ghAccessibility || {
/**
* formScope
*
* @ignore
* @returns {jQuery} elem
*/
formScope: function() {
return ghmob('.PSPAGECONTAINER, .ui-content[role="main"]').first();
},
/**
* showAriaComponent
*
* @ignore
* @param {jQuery} elem
* @returns {void}
*/
showAriaComponent: function(elem) {
elem = ghUtils.jqElem(elem);
elem.attr('aria-hidden', 'false');
},
/**
* hideAriaComponent
*
* @ignore
* @param {jQuery} elem
* @returns {void}
*/
hideAriaComponent: function(elem) {
elem = ghUtils.jqElem(elem);
elem.attr('aria-hidden', 'true');
},
/**
* createSkipLinks
*
* @ignore
* @returns {void}
*/
createSkipLinks: function() {
if (!ghConfig.accessibility.enableSkipLinks) return;
var skipLink = '<a class="skip-main" href="#gh-main-content">Skip to main content</a>';
var panel = ghmob('.ui-panel[role="navigation"]');
if (panel.find('.skip-main').length === 0) {
panel.prepend(skipLink);
}
if (ghmob('body > .skip-main').length === 0 && ghPage.isLogin() === false && ghPage.isSearch() === false) {
ghmob('body').prepend(skipLink);
}
},
/**
* formatExternalLinks
*
* @ignore
* @param {jQuery} scope
* @returns {void}
*/
formatExternalLinks: function(scope) {
if (!ghConfig.accessibility.formatExternalLinks) return;
ghmob('a[href^=http]:not([href^="' + window.location.origin + '"])', scope).each(function() {
if (ghmob(this).attr('onclick')) {
ghmob(this).removeAttr('onclick');
}
ghmob(this).attr('target', '_blank');
if (ghmob(this).find('.sr-only').length < 1) {
if (ghmob(this).find('.ui-btn-text').length > 0) {
ghmob(this).find('.ui-btn-text').append('<span class="sr-only">Opens in new window</span> <i aria-hidden="true" class="fa fa-external-link"></i>');
}
else {
ghmob(this).append('<span class="sr-only">Opens in new window</span> <i aria-hidden="true" class="fa fa-external-link"></i>');
}
}
});
},
/**
* formAccessibility
*
* @ignore
* @param {jQuery} scope
* @returns {void}
*/
formAccessibility: function(scope) {
this.forAttributes(scope);
this.missingLabels(scope);
this.formLabels(scope);
var emptyLabels = ghmob('label', scope).filter(function() {
return (ghmob(this).text().trim() === '' && ghmob(this).children().length === 0);
});
emptyLabels.remove();
},
/**
* formTypes
*
* @ignore
* @param {jQuery} scope
* @param {bool} limit
* @returns {jQuery}
*/
formTypes: function(scope, limit) {
if (typeof scope === 'undefined') {
scope = ghAccessibility.formScope();
}
var selectors = 'input:not([type="button"]), select, textarea';
var formTypes = scope.find(selectors).not('[type="checkbox"], [type="radio"], [type="hidden"]');
if (typeof limit !== 'undefined' && limit === false) {
formTypes = scope.find(selectors).not('[type="hidden"]');
}
return formTypes;
},
/**
* missingLabels
*
* @ignore
* @param {jQuery} scope
* @returns {void}
*/
missingLabels: function(scope) {
var formTypes = this.formTypes(scope);
formTypes.each(function() {
// Find label
var findLabel = ghmob('label[for="' + ghmob(this).attr('id') + '"]').not('.ps_indicator');
// Find fake label
var fakeLabel = ghmob(this).closest('td, th').find('b.ui-table-cell-label').first();
// If no real label
if (findLabel.length === 0) {
if (fakeLabel.length > 0) {
ghAccessibility.replaceFakeLabels(ghmob(this), fakeLabel);
}
else {
ghLog.info('Accessibility issue, NOT FIXED: form field with missing label, [id="' + ghmob(this).attr('id') + '"]');
}
}
// Remove fake label if real label is present
if (findLabel.length > 0 && fakeLabel.length > 0) {
fakeLabel.remove();
}
// Move label
if (findLabel.parent('div.ui-input-text, div.ui-select').length > 0) {
findLabel.insertBefore(findLabel.parent('div.ui-input-text, div.ui-select'));
}
});
},
/**
* formLabels
*
* @ignore
* @param {jQuery} scope
* @returns {void}
*/
formLabels: function(scope) {
if (ghConfig.accessibility.enforceFormLabels === false) return;
var formTypes = this.formTypes(ghAccessibility.formScope(), false);
ghmob(formTypes, scope).each(function() {
var $this = ghmob(this);
var thisParent = $this.closest('div[id]');
var thisId = $this.attr('id');
var thisLabelNoId = thisId + '-label';
var thisNextSibling = $this.closest('tr').find('div[id]').not('[id="' + thisParent.attr('id') + '"]').find('.gh-select select, .ui-select a[id], a[id][href*="javascript"], span[id][class*="PS"]').not(':contains("Delete"), :contains("Edit")').first();
var thisNextSiblingId = thisNextSibling.attr('id');
var thisButton = ghmob('a[id="' + thisId + '-button"]');
var thisButtonId = thisButton.attr('id');
// Checkboxes & Radios
if (ghConfig.form.nativeCheckboxRadio !== true && $this.is('input[type="checkbox"]') || $this.is('input[type="radio"]')) {
ghAccessibility.doEnhanceCheckboxRadio($this);
}
// Check for label
var thisLabel = ghmob('label[for="' + thisId + '"]').not('.ps_indicator').first();
if ($this.is('select')) {
thisLabel.off();
}
// Keep wanted classes
var alertClass = '';
if ($this.hasClass('info')) {
alertClass = 'info';
}
if ($this.hasClass('success')) {
alertClass = 'success';
}
if ($this.hasClass('warning')) {
alertClass = 'warning';
}
if ($this.hasClass('danger')) {
alertClass = 'danger';
}
if ($this.hasClass('primary')) {
alertClass = 'primary';
}
if ($this.hasClass('PSERROR')) {
alertClass = 'PSERROR';
}
if (alertClass !== '') {
if ($this.is('input[type="checkbox"]') || $this.is('input[type="radio"]')) {
thisLabel.addClass(alertClass);
}
if ($this.is('input[type="text"]') || $this.is('textarea')) {
$this.addClass('ui-input-text').parent('div.ui-input-text').addClass(alertClass);
}
if ($this.is('select')) {
$this.closest('.gh-select, .ui-select').addClass(alertClass);
}
thisButton.addClass(alertClass);
}
// Return if no label
if (thisLabel.length === 0) {
// Make sure input buttons have label
if ($this.is('input[type="button"][role="button"]')) {
$this.attr('aria-label', $this.attr('value'));
}
return;
}
// Make sure labels have id
if (typeof thisLabel.attr('id') === 'undefined') {
thisLabel.attr('id', thisLabelNoId);
}
// Make labels unique to screenreaders
if (thisButton.length > 0) {
labelledBy = thisButtonId;
thisButton.attr('aria-labelledby', thisLabel.attr('id')).find('.ui-icon').attr('aria-hidden', 'true');
}
var labelledBy = thisLabel.attr('id');
if ($this.parents('.ui-table, .gh-row-collapsible-table').length > 0) {
if (thisNextSibling.length > 0 && labelledBy.indexOf(thisNextSiblingId) === -1) {
labelledBy = labelledBy + ' ' + thisNextSiblingId;
}
}
$this.attr('aria-labelledby', labelledBy);
});
},
/**
* forAttributes
*
* @ignore
* @param {jQuery} scope
* @returns {void}
*/
forAttributes: function(scope) {
var formTypes = this.formTypes(ghAccessibility.formScope(), false);
ghmob('label', scope).not('label[for]').each(function() {
var wrapper = ghmob(this).closest('div[id]');
var fields = wrapper.find(formTypes);
var fieldId = fields.first().attr('id');
var labels = wrapper.find('label[for="' + fieldId + '"]');
if (fields.length === 0 || labels.length > 0) return;
ghLog.info('Accessibility issue, FIXED: label without "for" attribute: label[for="' + fields.first().attr('id') + '"]');
ghmob(this).attr('for', fieldId);
});
},
/**
* replaceFakeLabels
*
* @ignore
* @param {jQuery} selector
* @param {string} fakeLabel
* @returns {void}
*/
replaceFakeLabels: function(selector, fakeLabel) {
var labelType = (selector.is('select')) ? 'ui-select' : 'ui-input-text';
ghLog.info('Accessibility issue, FIXED: form field with fake label, [id="' + selector.attr('id') + '"]');
if (selector.closest('div[id]').find('label').length > 0) return;
selector.closest('div[id]').prepend('<label class="' + labelType + '" for="' + selector.attr('id') + '" id="' + selector.attr('id') + '-label">' + fakeLabel.text().trim() + '</label>');
fakeLabel.remove();
},
/**
* enhanceCheckboxRadio
*
* @ignore
* @param {jQuery} selectors
* @returns {void}
*/
enhanceCheckboxRadio: function(selectors) {
if (ghConfig.accessibility.enhanceCheckboxRadio === false) return;
if (typeof selectors === 'undefined') {
selectors = ghmob('.ui-content input[type="radio"], .ui-content input[type="checkbox"]');
}
selectors.each(function() {
ghAccessibility.doEnhanceCheckboxRadio(ghmob(this));
});
},
/**
* doEnhanceCheckboxRadio
*
* @ignore
* @param {jQuery} selector
* @returns {void}
*/
doEnhanceCheckboxRadio: function(selector) {
if (ghConfig.accessibility.enhanceCheckboxRadio === false) return;
var $this = selector;
var thisParent = $this.closest('div[id]');
var thisName = $this.attr('name');
var thisId = $this.attr('id');
var thisLabel = ghmob('label[for="' + thisId + '"]').not('.ps_indicator').first();
var thisLabelNoId = thisId + '-label';
var thisLabelNoText = 'Select';
if (typeof $this.attr('title') !== 'undefined' && $this.attr('title') !== '' && $this.attr('title').indexOf('Select') === -1) {
thisLabelNoText = $this.attr('title');
}
if ($this.is('input[type="radio"]')) {
var inputsThisName = ghmob('input[type="radio"][name="' + thisName + '"]:visible');
var inputsThisNameContainer = $this.parents('div[id]').first().parents('div[id]').first();
if ($this.parents('.ps_box-group').length > 0) {
inputsThisNameContainer = $this.parents('.ps_box-group').first();
}
}
// Ensure table heading
var thisTable = $this.closest('.ui-table');
if (thisTable.length > 0) {
var thisCell = $this.closest('td, th');
var thisTh = thisTable.find('> thead > tr > th:eq(' + thisCell.index() + ')');
// fix server bug
if (thisLabel.text().trim() !== thisTh.text().trim() && $this.closest('tr').find('th[scope="row"]').length > 0) {
thisLabel.text(thisLabelNoText);
}
// add style for select all
if ($this.parents('.ps_switch').length === 0 && (thisTh.text().trim() === '' || thisTh.text().trim() === thisLabel.text().trim() || thisTh.text().trim() === 'Select' || thisLabel.text().trim() === 'Select' || thisLabel.text().trim() === '')) {
thisCell.addClass('gh-select-all');
}
// ensure table heading
if (thisTh.text().trim() === '') {
thisTh.text(thisLabelNoText);
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
thisLabel.removeClass('ui-input-text').removeAttr('title');
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
// Wrap inputs in group
if (ghmob('[id="' + groupId + '"]').length === 0 && inputsThisNameContainer.children('[role="radiogroup"], [role="group"], fieldset').length === 0 && inputsThisNameContainer.parents('[role="radiogroup"], [role="group"], fieldset').length === 0 && inputsThisNameContainer.is('[role="radiogroup"], [role="group"], [role="tablist"], fieldset') === false) {
inputsThisNameContainer.children().wrapAll('<div role="group" aria-labelledby="' + groupLabel + '" id="' + groupId + '"></div>');
ghmob('[id="' + groupId + '"]').prepend('<div id="' + groupLabel + '" class="visually-hidden">' + ghmob('.gh-page-header-wrap h1').text() + '</div>');
}
// Display inline
if (inputsThisName.parents('.ui-table, .gh-radio-tabs').length === 0 && ghPage.isFluid() === false) {
ghInterface.displayInline(ghmob('[id="' + groupId + '"]').find(inputsThisName));
}
// Update group label and input aria-labelledby
var inputsThisNameTitle = $this.closest('div[class="ui-body"], .ui-collapsible').find('.ui-bar, .ui-collapsible-heading').first().text().trim();
if (inputsThisNameTitle !== '') {
ghmob('[id="' + groupLabel + '"]').text(inputsThisNameTitle);
if (labelledBy.indexOf(groupLabel) === -1 && ghmob('[id="' + groupLabel + '"]').length > 0) {
labelledBy = groupLabel + ' ' + labelledBy;
}
$this.attr('aria-labelledby', labelledBy);
}
});
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
},
/**
* moveActionColumns
*
* @ignore
* @returns {void}
*/
moveActionColumns: function() {
ghmob('thead').closest('table').each(function() {
if (ghmob(this).find('tbody > tr:first').find('> td:first, > th:first').find('.ui-btn, .fa').length > 0) {
var table = ghmob(this);
var columns = [];
table.find('tbody > tr:first').find('> td, > th').find('.ui-btn, .fa').closest('td, th').each(function(i) {
columns.push({
newIndex: table.find('th').length - 1,
oldIndex: i,
});
});
ghTable.moveColumn(table, columns);
}
});
},
/**
* enableZoom
*
* @ignore
* @returns {void}
*/
enableZoom: function() {
if (!ghConfig.page.enableZoom) return;
ghmob('head meta[name="viewport"]').attr('content', 'width=device-width, initial-scale=1');
},
/**
* setTabIndexes
*
* @ignore
* @param {jQuery} scope
* @returns {void}
*/
setTabIndexes: function(scope) {
var exclude = '.gh-page-header-headings, .ui-bar, .ui-header, .step, [role="progressbar"], .gh-nosort, .alert, div[tabindex="-1"], a.ui-disabled[tabindex="-1"], div[onclick][tabindex="0"], .nuilp';
var tabIndexes = ghmob('[tabindex]', scope).not(exclude);
if (tabIndexes.length === 0) return;
ghmob('body, .ui-page').removeAttr('tabindex');
tabIndexes.filter(function() {
return (ghmob(this).is(':focusable:visible'));
}).removeAttr('tabindex');
tabIndexes.filter(function() {
var tabindex = parseInt(ghmob(this).attr('tabindex'));
return tabindex > 0;
}).attr('tabindex', '0');
if (ghConfig.form.nativeSelectMenus === true) {
ghmob('select[tabindex]', scope).closest('div[id]').find('[tabindex]').removeAttr('tabindex');
}
},
/**
* setRoles
*
* @ignore
* @param {jQuery} scope
* @returns {void}
*/
setRoles: function(scope) {
ghmob('#PT_WRAPPER').removeAttr('role');
ghmob('[id="pt_fakeBC"]', scope).find('[role]').removeAttr('role');
ghmob('[role="tab"]', scope).removeAttr('aria-selected').removeAttr('role');
ghmob('div[id*="popup"][onclick]', scope).attr('role', 'dialog');
ghmob('[role="main"]:not(.ui-content)', scope).removeAttr('role');
ghmob('header, [role="banner"]:not(.ui-header-fixed)', scope).attr('role', 'presentation').removeAttr('aria-label');
ghmob('li[role="listitem"]', scope).removeAttr('role');
ghmob(ghHeader.headings.join(), scope).filter(function() {
return (typeof ghmob(this).attr('aria-level') !== 'undefined' || typeof ghmob(this).attr('role') !== 'undefined');
}).removeAttr('aria-level role');
},
/**
* cleanup
*
* @ignore
* @param {jQuery} scope
* @returns {void}
*/
cleanup: function(scope) {
ghmob('[id="pt_fakeBC"]', scope).attr('aria-hidden', 'true');
ghmob('[id="ptus_universalSrch"]', scope).attr('aria-hidden', 'true');
ghmob('[id="pt_console"]', scope).attr('aria-hidden', 'true');
ghmob('[align]:not(th, td)', scope).removeAttr('align');
ghmob('td[scope]', scope).removeAttr('scope');
ghmob('[alt]', scope).filter(function() {
return (ghmob(this).attr('alt') === '');
}).removeAttr('alt');
ghmob('[title]', scope).filter(function() {
return (ghmob(this).attr('title') === '');
}).removeAttr('title');
ghmob('[aria-label]', scope).filter(function() {
return (ghmob(this).attr('aria-label') === '');
}).removeAttr('aria-label');
ghmob('img:not([alt], [title], [aria-hidden="true"])', scope).attr('aria-hidden', 'true');
ghmob('a:empty:not([aria-label], [title])', scope).filter(function() {
return (ghmob(this).text().trim() === '' && ghmob(this).children().length === 0);
}).addClass('gh-hidden').attr('aria-hidden', 'true');
ghmob('[role="button"]:not([aria-label], [title])', scope).filter(function() {
return ((ghmob(this).text().trim() === '' && ghmob(this).find('img, input, textarea, select, .fa').length === 0) || ghmob(this).parents('.psc_hidden').length > 0);
}).removeAttr('role');
},
/**
* setFocus
*
* @ignore
* @returns {void}
*/
setFocus: function() {
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
},
/**
* getSavedFocus
*
* @returns {jQuery} selector
*/
getSavedFocus: function() {
var selector = window.lastFocus;
if (typeof selector === 'undefined' || selector.length === 0) {
try {
if (typeof(Storage) !== 'undefined') {
var sessionData = sessionStorage.getItem('gh-lastfocus');
if (sessionData === 'undefined') {
selector = undefined;
}
else {
selector = ghmob('[id="' + sessionStorage.getItem('gh-lastfocus') + '"]');
}
}
}
catch (err) {
ghLog.info('Cannot get ghAccessibility.getFocus state. No session storage.');
selector = undefined;
}
}
return selector;
},
/**
* saveFocus
*
* @param {jQuery} selector
* @returns {void}
*/
saveFocus: function(selector) {
var thisFocus = selector;
var thisFocusId = thisFocus.attr('id');
if (thisFocus.hasClass('ui-checkbox') || thisFocus.hasClass('ui-radio')) {
thisFocusId = thisFocus.find('input[type="checkbox"], input[type="radio"]').first().attr('id');
}
else if (thisFocus.hasClass('ui-collapsible-heading-toggle')) {
thisFocusId = thisFocus.closest('.ui-collapsible').find('> .ui-collapsible-content [id]').first().attr('id');
}
else if (thisFocus.hasClass('ui-bar')) {
thisFocusId = thisFocus.closest('.ui-body').find('[id]').first().attr('id');
}
else if (typeof thisFocus.attr('id') === 'undefined') {
if (thisFocus.find('[id]').length > 0) {
thisFocusId = thisFocus.find('[id]').first().attr('id');
}
else {
thisFocusId = thisFocus.closest('[id]').attr('id');
}
}
if (typeof thisFocusId !== 'undefined' && thisFocusId.indexOf('gh-') > -1) {
thisFocusId = thisFocus.parents('[id]:not([id^="gh-"])').first().attr('id');
}
thisFocus = ghmob('[id="' + thisFocusId + '"]');
window.lastFocus = thisFocus;
try {
if (typeof(Storage) !== 'undefined') {
sessionStorage.setItem('gh-lastfocus', thisFocusId);
}
}
catch (err) {
ghLog.info('Cannot save ghAccessibility.saveFocus state. No session storage.');
}
},
/**
* defaultFocus
*
* @ignore
* @returns {void}
*/
defaultFocus: function() {
if (ghmob('.gh-page-header-headings').length > 0) {
ghLog.info('set focus to page header');
this.setFocusTo(document.querySelectorAll('.gh-page-header-headings'));
}
else {
ghLog.info('set focus to first focusable and visible item');
this.setFocusTo(ghmob('body').find(':focusable:visible').filter(function() {
return (ghmob(this).hasClass('skip-main') === false && ghmob(this)[0].clientHeight !== 0 && ghmob(this)[0].clientWidth !== 0);
}).first());
}
},
/**
* setFocusTo
*
* @param {jQuery} selector
* @returns {void}
*/
setFocusTo: function(selector) {
if (ghmob(selector).length === 0 || ghConfig.accessibility.setFocus === false) return;
if (ghmob(selector).parents('table.gh-tablesaw, table.tablesaw, table.ghtables').length === 0) {
ghmob(selector)[0].focus();
}
else {
ghUtils.delay(function() {
if (ghmob(selector).parents('.ghtables-hide').length > 0) {
for (var i = 0; i <= ghmob(selector).closest('tr').children('td').length; i++) {
ghmob(selector).closest('div.ghtables').find('> .ghtables-navigation a.ghtables-navigation-next').click();
if (ghmob(selector).parents('.ghtables-hide').length === 0) {
ghmob(selector)[0].focus();
return;
}
}
}
});
}
if (ghmob(selector).parents('.ui-panel').length === 0) {
ghmob(selector).closest('.ui-collapsible:not([data-for])').trigger('expand');
}
},
/**
* inputTypeSwitch
*
* @ignore
* @returns {void}
*/
inputTypeSwitch: function() {
var types = [
{
new: 'text',
old: 'number',
removeAttr: 'step tabindex',
},
];
ghmob.each(types, function(i) {
ghmob('input[type="' + types[i]['old'] + '"]').each(function() {
document.getElementById(ghmob(this).attr('id')).type = types[i]['new'];
ghmob(this).removeAttr(types[i]['removeAttr']);
});
});
},
/**
* skipToMain
*
* @private
* @param {obj} event
* @returns {void}
*/
_skipToMain: function(event) {
if (event.type === 'click' || event.type === 'keydown' && event.keyCode === 13) {
event.preventDefault();
if (ghPage.isIFrameTemplate()) {
ghAccessibility.setFocusTo(ghmob('[id="ptifrmtgtframe"]'));
}
else {
ghAccessibility.setFocusTo(ghmob('.ui-content[role="main"]').find(':focusable:visible').filter(function() {
return (ghmob(this).hasClass('skip-main') === false && ghmob(this)[0].clientHeight !== 0 && ghmob(this)[0].clientWidth !== 0);
}).first());
}
ghmob('.ui-panel').panel('close');
}
},
/**
* hideListviewIcons
*
* @private
* @param {jQuery} listview
* @returns {void}
*/
_hideListviewIcons: function(listview) {
ghmob(listview).find('.ui-icon').attr('aria-hidden', 'true');
},
/**
* panelFocus
*
* @private
* @returns {void}
*/
_panelFocus: function() {
ghUtils.delay(function() {
ghAccessibility.setFocusTo(ghmob('.ui-panel-open').find('.ui-listview, .gh-listview').first().find('a').first());
}, 500);
},
/**
* hideLabelIcons
*
* @private
* @param {jQuery} checkboxradio
* @returns {void}
*/
_hideLabelIcons: function(checkboxradio) {
var thisLabel = ghmob('label[for="' + ghmob(checkboxradio).attr('id') + '"]').not('.ps_indicator').first();
thisLabel.find('.ui-icon').attr('aria-hidden', 'true');
},
/**
* checkboxradioState
*
* @private
* @param {jQuery} checkboxradio
* @returns {void}
*/
_checkboxradioState: function(checkboxradio) {
var thisName = ghmob(checkboxradio).attr('name');
var thisId = ghmob(checkboxradio).attr('id');
if (ghConfig.form.nativeCheckboxRadio !== true) {
ghmob('label[for="' + thisId + '"]').not('.ps_indicator').attr('aria-checked', ghmob(checkboxradio).is(':checked'));
}
ghUtils.delay(function() {
ghmob('[name="' + thisName + '"]').closest('.ui-radio, .ui-checkbox').find('.ui-icon').attr('aria-hidden', 'true');
});
},
/**
* updateFocus
*
* @private
* @param {jQuery} element
* @returns {void}
*/
_updateFocus: function(element) {
if (ghmob(element).parents('#pt_modals, .ghtables-navigation').length > 0) return;
ghAccessibility.saveFocus(ghmob(element));
ghPage.setScrollYAttr();
},
/**
* setPopupRoles
*
* @private
* @param {jQuery} popup
* @returns {void}
*/
_setPopupRoles: function(popup) {
if (typeof ghmob(popup).attr('id') !== 'undefined') {
var titleId = ghmob(popup).attr('id') + '-header';
ghmob(popup).find('.ui-title').first().attr('id', titleId);
ghmob(popup).attr('role', 'dialog').attr('aria-labelledby', titleId);
}
ghmob(popup).parent('.ui-popup-container').prev('.ui-popup-screen').attr('role', 'button').attr('aria-label', 'Close');
},
/**
* setSelectmenuAria
*
* @private
* @param {jQuery} selectmenu
* @returns {void}
*/
_setSelectmenuAria: function(selectmenu) {
if (typeof ghmob(selectmenu).attr('id') === undefined) return;
var labelId = ghmob(selectmenu).attr('id') + '-label';
var selectmenuMenu = ghmob('[id="' + ghmob(selectmenu).attr('id') + '-menu"]');
var labelledBy = selectmenuMenu.attr('aria-labelledby');
var popup = selectmenuMenu.closest('.ui-popup');
if (typeof popup.attr('id') !== 'undefined') {
var titleId = popup.attr('id') + '-header';
popup.find('.ui-title').first().attr('id', titleId);
popup.attr('role', 'dialog').attr('aria-labelledby', titleId);
if (typeof labelledBy !== 'undefined' && labelledBy.indexOf(labelId) === -1) {
selectmenuMenu.attr('aria-labelledby', labelledBy + ' ' + labelId);
}
}
ghmob(selectmenu).closest('.ui-select').find('.ui-icon').attr('aria-hidden', 'true');
if (ghConfig.form.nativeSelectMenus === true) {
ghmob(selectmenu).closest('.ui-select').find('.ui-btn-text').attr('aria-hidden', 'true');
}
},
/**
* modalReturnFocus
*
* @private
* @returns {void}
*/
_modalReturnFocus: function() {
var iframe = ghmob('[id="ptifrmtgtframe"], .ps_target-iframe');
if (ghPage.isIFrameTemplate() && iframe.length > 0) {
iframe[0].contentWindow.ghAccessibility.setFocus(false);
}
else {
ghAccessibility.setFocus(false);
}
},
/**
* popupFocus
*
* @private
* @param {jQuery} popup
* @returns {void}
*/
_popupFocus: function(popup) {
var $this = ghmob(popup);
if ($this.hasClass('ui-selectmenu')) return;
ghUtils.delay(function() {
$this.find('.ui-header').first().attr('tabindex', '-1');
ghAccessibility.setFocusTo($this.find('.ui-header').first());
}, 50);
},
/**
* triggerModalClose
*
* @private
* @param {obj} event
* @returns {void}
*/
_triggerModalClose: function(event) {
// if esc is pressed, close popups
if (event.keyCode === 27) {
ghModal.triggerModalClose();
ghUtils.delay(function() {
ghModal.closePopup();
ghmob('.gh-submenu.active').find('.toggle').trigger('click');
}, 100);
}
},
/**
* eventBindings
*
* @private
* @returns {void}
*/
_eventBindings: function() {
/* Skip Links */
ghmob(document)
.off('keydown.ghAccessibility.skipToMain click.ghAccessibility.skipToMain')
.on('keydown.ghAccessibility.skipToMain click.ghAccessibility.skipToMain', 'a[href="#gh-main-content"].skip-main', function(event) {
ghLog.event('keydown.ghAccessibility.skipToMain click.ghAccessibility.skipToMain');
ghAccessibility._skipToMain(event);
});
/* Listview */
ghmob(document)
.off('listviewcreate.ghAccessibility.hideListviewIcons refresh.ghAccessibility.hideListviewIcons')
.on('listviewcreate.ghAccessibility.hideListviewIcons refresh.ghAccessibility.hideListviewIcons', '[data-role="listview"], .ui-listview', function() {
ghLog.event('listviewcreate.ghAccessibility.hideListviewIcons refresh.ghAccessibility.hideListviewIcons');
ghAccessibility._hideListviewIcons(ghmob(this));
});
/* Panels */
ghmob(document)
.off('panelopen.ghAccessibility.panelFocus')
.on('panelopen.ghAccessibility.panelFocus', '.ui-panel', function() {
ghLog.event('panelopen.ghAccessibility.panelFocus');
ghAccessibility._panelFocus();
});
/* Radio and Checkboxes */
ghmob(document)
.off('checkboxradiocreate.ghAccessibility.hideLabelIcons')
.on('checkboxradiocreate.ghAccessibility.hideLabelIcons', 'input[type="radio"], input[type="checkbox"]', function() {
ghLog.event('checkboxradiocreate.ghAccessibility.hideLabelIcons');
ghAccessibility._hideLabelIcons(ghmob(this));
});
ghmob(document)
.off('change.ghAccessibility.checkboxradioState')
.on('change.ghAccessibility.checkboxradioState', 'input[type="radio"], input[type="checkbox"]', function() {
ghLog.event('change.ghAccessibility.checkboxradioState');
ghAccessibility._checkboxradioState(ghmob(this));
});
/* Focus */
ghmob(document)
.off('focus.ghAccessibility.updateFocus click.ghAccessibility.updateFocus')
.on('focus.ghAccessibility.updateFocus click.ghAccessibility.updateFocus', '.ui-content :focusable:visible, .ui-content a[role="button"], .ui-content .ui-checkbox, .ui-content .ui-radio, .ui-content .ui-btn:visible input.ui-btn-hidden', function(event) {
ghLog.event('focus.ghAccessibility.updateFocus click.ghAccessibility.updateFocus');
if (ghConfig.accessibility.setFocus === false) return;
ghAccessibility._updateFocus(ghmob(event.currentTarget));
});
ghmob(document)
.off('blur.ghAccessibility.formLabels')
.on('blur.ghAccessibility.formLabels', '.PSERROR :focusable, .PSERROR:focusable', function() {
ghLog.event('blur.ghAccessibility.formLabels');
if (ghmob(this).hasClass('PSERROR')) {
ghAccessibility.formLabels();
}
else {
ghmob(this).parent().removeClass('PSERROR');
}
});
ghmob(document)
.off('fieldupdate.ghAccessibility.updateFocus')
.on('fieldupdate.ghAccessibility.updateFocus', function(event, data) {
if (ghConfig.accessibility.setFocus === false) return;
if (typeof data.fieldId !== 'undefined') {
ghLog.event('fieldupdate.ghAccessibility.updateFocus');
if (ghmob(this).is(document) === true) return;
var field = ghmob('[id="' + data.fieldId + '"]');
ghAccessibility._updateFocus(field);
}
});
/* Popups */
ghmob(document)
.off('popupcreate.ghAccessibility.setPopupRoles')
.on('popupcreate.ghAccessibility.setPopupRoles', '[data-role="popup"], .ui-popup', function() {
ghLog.event('popupcreate.ghAccessibility.setPopupRoles');
ghAccessibility._setPopupRoles(ghmob(this));
});
ghmob(document)
.off('selectmenucreate.ghAccessibility.setSelectmenuAria')
.on('selectmenucreate.ghAccessibility.setSelectmenuAria', 'select', function() {
ghLog.event('selectmenucreate.ghAccessibility.setSelectmenuAria');
ghAccessibility._setSelectmenuAria(ghmob(this));
});
ghmob(document)
.off('ghModalClose.ghAccessibility.modalReturnFocus popupafterclose.ghAccessibility.modalReturnFocus')
.on('ghModalClose.ghAccessibility.modalReturnFocus popupafterclose.ghAccessibility.modalReturnFocus', function() {
ghLog.event('ghModalClose.ghAccessibility.modalReturnFocus');
ghAccessibility._modalReturnFocus();
});
ghmob(document)
.off('popupafteropen.ghAccessibility.popupFocus')
.on('popupafteropen.ghAccessibility.popupFocus', '[data-role="popup"], .ui-popup', function() {
ghLog.event('popupafteropen.ghAccessibility.popupFocus');
ghAccessibility._popupFocus(ghmob(this));
});
ghmob(document)
.off('keydown.ghAccessibility.triggerModalClose')
.on('keydown.ghAccessibility.triggerModalClose', function(event) {
ghLog.event('keydown.ghAccessibility.triggerModalClose');
ghAccessibility._triggerModalClose(event);
});
},
/**
* onPageBeforeCreate
*
* @ignore
* @returns {void}
*/
onPageBeforeCreate: function() {
if (!ghConfig.accessibility.enabled) return;
ghAccessibility.setTabIndexes(document);
ghAccessibility.inputTypeSwitch();
ghUtils.delay(function() {
ghAccessibility.enableZoom();
});
},
/**
* run
*
* @ignore
* @param {jQuery} scope
* @returns {void}
*/
run: function(scope) {
scope = scope ? scope : ghmob(document);
// check if we should force form accessibility
// if the module is disabled but forceFormAccessibility is enabled, we need to run it
if (ghConfig.accessibility.enabled === false && ghConfig.accessibility.forceFormAccessibility === false) return;
this._eventBindings();
this.formAccessibility(scope);
// check if core module is disabled
if (ghConfig.accessibility.enabled === false) return;
this.setRoles(scope);
this.createSkipLinks();
this.formatExternalLinks(scope);
this.cleanup(scope);
this.setTabIndexes(scope);
this.setFocus();
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
* formScope
*
* @ignore
* @returns {jQuery} elem
*/
formScope: function() {
return ghmob('#PT_WRAPPER, .ps_pagecontainer');
},
},
},
};
ghInit.module('ghAccessibility');
// Wipe out PS focus functions
window['setFocus_' + ghPage.getWin()] = function(fldname) {
if (ghAccessibility.getSavedFocus().is('.ui-page') && typeof fldname !== 'undefined' && ghmob('[id="' + fldname + '"]').length > 0) {
ghAccessibility.setFocusTo(ghmob('[id="' + fldname + '"]'));
}
return;
};
if (typeof window.ptCommonObj2 !== 'undefined') {
if (typeof window.ptCommonObj2.tryFocus !== 'undefined') {
window.ptCommonObj2.tryFocus = function() {
return false;
};
}
if (typeof window.ptCommonObj2.tryFocus0 !== 'undefined') {
window.ptCommonObj2.tryFocus0 = function() {
return false;
};
}
}
/**
* ghButton
*
* @module button
* @config enabled [true, false]
* @config autoInitialize [true, false]
*
* @trigger buttoncreate
*/
var ghButton = ghButton || {
/**
* selectors
*
* @ignore
* @type {array}
*/
selectors: ['div.ui-btn', '[data-role="button"]', 'input[type="submit"]', 'input[type="reset"]', 'input[type="button"]', 'button'],
/**
* create
* Creates a button
*
* @param {jQuery} buttons
* @param {obj} [config]
* @param {(string|array)} [config.color]
* @param {(bool|array)} [config.disabled]
* @param {obj} [config.icon]
* @param {(string|array)} config.icon.className
* @param {(string|array)} [config.icon.color]
* @param {(string|array)} [config.icon.position]
* @param {(string|array)} [config.theme]
* @returns {(jQuery|bool)}
*/
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
buttons.trigger('buttoncreate');
},
/**
* _accessibleLabel
*
* @private
* @param {jQuery} button
* @param {jQuery} buttonWrapper
* @param {string} buttonText
* @returns {void}
*/
_accessibleLabel: function(button, buttonWrapper, buttonText) {
// unique label for accessibility
if (button.parents('.ui-table').length === 0 || typeof button.attr('aria-label') !== 'undefined' || typeof button.attr('aria-labelledby') !== 'undefined') return;
buttonWrapper.removeAttr('aria-label aria-labelledby');
var ariaLabelledBy = button.closest('tr').find('a[id], span[id]').filter(function() {
return (ghmob(this).children('a[id], span[id]').length === 0 && ghmob(this).parents('.ui-btn').length === 0 && ghmob(this).text().trim() !== '');
});
var ariaLabel = buttonText + ' Row ' + (button.closest('tr').index() + 1);
if (ariaLabelledBy.length === 0) {
button.attr('aria-label', ariaLabel);
}
else {
button.attr('aria-labelledby', button.closest('[id]').attr('id') + ' ' + ghmob(ariaLabelledBy[0]).attr('id'));
}
var tableHd = button.closest('.ui-table').find('> thead > tr > th:eq(' + button.closest('td').index() + ')');
if (tableHd.text().trim() === '') {
tableHd.append('<span class="sr-only">' + buttonText + '</span>');
}
},
/**
* _init
*
* @private
* @param {jQuery} scope
* @returns {void}
*/
_init: function(scope) {
if (ghConfig.button.autoInitialize === false) return;
var selectors = ghmob(this.selectors.join(), scope).filter(function() {
return (ghmob(this).is('.ui-btn.gh-btn, .psc_rowact, .ptpn_actions') === false && ghmob(this).find(ghButton.selectors.join()).length === 0 && ghmob(this).parents('.psc_hidden, th').length === 0);
});
ghButton.create(selectors);
},
/**
* onPageBeforeCreate
*
* @ignore
* @returns {void}
*/
onPageBeforeCreate: function() {
if (ghConfig.button.enabled === false) {
this._removeAttr();
return;
}
this._jqmButtons();
},
/**
* jqmButtons
*
* @private
* @returns {void}
*/
_jqmButtons: function() {
ghmob.fn.button = function(config) {
ghButton.create(ghmob(this), config);
};
},
/**
* _removeAttr
*
* @private
* @returns {void}
*/
_removeAttr: function() {
ghmob('[data-icon*="fa-"]').removeAttr('data-icon data-iconpos');
},
/**
* run
*
* @ignore
* @param {jQuery} [scope=document]
* @returns {void}
*/
run: function(scope) {
scope = scope ? scope : document;
if (ghConfig.button.enabled === false) return;
this._init(scope);
ghInterface.enhanceButtonUI(undefined, scope);
},
};
ghInit.module('ghButton');
/**
* ghForm
*
* @module form
* @config enabled [true, false]
* @config autoInitialize [true, false]
* @config disableDatePicker [true, false]
* @config flipswitch [true, false]
* @config nativeCheckboxRadio [true, false]
* @config nativeSelectMenus [true, false]
* @config nativeTextInput [true, false]
* @config useCalendarPicker [true, false]
* @config useISOFormat [true, false]
*/
var ghForm = ghForm || {
/**
* processForm
*
* @private
* @param {jQuery} scope
* @returns {void}
*/
_processForm: function(scope) {
this._processSelectMenus(scope);
this._processErrors(null, scope);
this._processRequiredFields(scope);
this._cleanup(scope);
this._markRequired(scope);
this._processFields(scope);
if (ghConfig.form.flipswitch) {
this.checkboxToFlipswitch._createAll(scope);
}
},
/**
* processErrors
*
* @private
* @param {bool} submit
* @param {jQuery} scope
* @returns {void}
*/
_processErrors: function(submit, scope) {
ghmob('.PSERROR, [aria-required="true"]', scope).filter(function() {
if (ghmob(this).is(':focusable') === false) return;
if ((submit && ghmob(this).val() === '') || ghmob(this).parents('.psc_error').length > 0 || ghmob(this).hasClass('PSERROR') || ghmob(this).parent().hasClass('PSERROR')) {
ghmob(this).attr('aria-invalid', 'true').parent('.ui-input-text').addClass('PSERROR');
ghmob(this).closest('.ui-collapsible').trigger('expand');
}
else {
ghmob(this).removeAttr('aria-invalid').parent('.ui-input-text').removeClass('PSERROR');
}
});
},
/**
* validateErrors
*
* @private
* @param {jQuery} scope
* @returns {void}
*/
_processRequiredFields: function(scope) {
ghmob('.required', scope).each(function() {
var field = ghmob(this);
if (ghmob(this).is('label')) {
field = ghmob('[id="' + ghmob(this).attr('for') + '"]');
}
field.attr('aria-required', 'true').addClass('required');
});
},
/**
* markRequired
*
* @private
* @param {jQuery} scope
* @returns {void}
*/
_markRequired: function(scope) {
ghmob('label', scope).filter(function() {
return ghmob(this).text().trim().substring(0, 1) === '*';
}).addClass('gh-required-field');
},
/**
* unenteredRequired
*
* @private
* @param {string} scope
* @returns {void}
*/
_unenteredRequired: function(scope) {
scope = scope || document;
var requiredContainers = ghmob(scope).find('.gh-required-field').parent(),
editable = requiredContainers.find(':editable');
return editable.filter(function() {
return !this.value || !this.value.length;
});
},
/**
* processSelectMenus
*
* @private
* @param {jQuery} scope
* @returns {void}
*/
_processSelectMenus: function(scope) {
ghmob('select', scope).each(function() {
ghmob(this).children('option').each(function() {
var thisText = ghmob(this).text().trim();
// Create "clear" option
if (typeof thisText === 'undefined' || thisText === '') {
thisText = 'Select';
ghmob(this).attr('data-placeholder', 'true').text(thisText);
}
// Remove duplicates
if (thisText === ghmob(this).prev('option').text().trim()) {
ghmob(this).remove();
}
});
var id = ghmob(this).attr('id');
var label = ghmob('label[for="' + id + '"]');
var labelText = label.text().trim() || 'Select';
// Cleanup
ghmob(this).removeAttr('style');
if (ghConfig.form.nativeSelectMenus !== true) {
// Sadly, we need this in order for "clear" option to show up in popup
if (ghConfig.form.nativeSelectMenus !== true && ghmob(this).children('[data-gh-placeholder]').length === 0) {
ghmob(this).prepend('<option value=" " data-placeholder="true" data-gh-placeholder="true">' + labelText + '</option>');
}
// Set popup title
ghmob('[id="' + id + '-menu"]').closest('.ui-popup').find('.ui-title').text(labelText);
try {
ghmob(this).selectmenu('refresh', true);
}
catch (err) {
ghmob(this).selectmenu();
}
}
});
// Loop through select popups
ghmob('.ui-selectmenu', scope).each(function() {
// Add close button
ghModal.forceCloseButton(ghmob(this));
// Hide repeats
ghmob(this).find('.ui-selectmenu-list li').each(function() {
if (ghmob(this).find('a').text().trim() === ghmob(this).prev('li').find('a').text().trim()) {
ghmob(this).addClass('gh-hidden');
}
});
});
// Remove duplicate and/or old selectmenu popups
ghmob('.ui-selectmenu-list', scope).each(function() {
ghmob('.ui-selectmenu-list[id="' + ghmob(this).attr('id') + '"]:lt(' + (ghmob('.ui-selectmenu-list[id="' + ghmob(this).attr('id') + '"]').length - 1) + ')').closest('.ui-popup-container, .ui-selectmenu').remove();
if (ghmob('[id="' + ghmob(this).attr('id').replace('-menu', '-button') + '"]').length === 0) {
ghmob(this).closest('.ui-popup-container, .ui-selectmenu').remove();
}
});
},
/**
* nativeDateTime
*
* @private
* @returns {void}
*/
_nativeDateTime: function() {
if (ghConfig.form.disableDatePicker !== true) return;
ghmob('[data-role="mobiscroll"]').each(function() {
if (typeof Modernizr === 'undefined' || (typeof Modernizr !== 'undefined' && ghmob(this).is('[data-options*="date"]') && Modernizr.inputtypes.date === false) || (typeof Modernizr !== 'undefined' && ghmob(this).is('[data-options*="time"]') && Modernizr.inputtypes.time === false)) return;
ghmob(this).removeAttr('data-role');
var originalID = ghmob(this).attr('id');
var newID = originalID + '-tmp';
var value = ghmob(this).val();
if (ghmob(this).parents('div.ui-input-text').length === 0) {
ghForm.createTextInput(ghmob(this));
}
var clone = ghmob(this).clone();
ghmob(this).addClass('gh-hidden').closest('div.ui-input-text').addClass('date');
clone.removeAttr('onkeyup onchange data-role').attr('id', newID).attr('name', newID).attr('aria-labelledby', originalID + '-label').prependTo(ghmob(this).closest('div'));
if (Modernizr.inputtypes.date && ghmob(this).is('[data-options*="date"]')) {
clone.prop('type', 'date');
if (value && (value.indexOf('/') > -1 || value.indexOf('-') > -1)) {
clone.attr('value', ghUtils.dateTime.toISOString(value));
}
}
if (Modernizr.inputtypes.time && ghmob(this).is('[data-options*="time"]')) {
clone.prop('type', 'time');
if (value && (value.indexOf('AM') > -1 || value.indexOf('PM') > -1)) {
clone.attr('value', ghUtils.dateTime.toMilitaryTime(value));
}
}
});
},
/**
* _eventBindings
*
* @private
* @returns {void}
*/
_eventBindings: function() {
ghmob(document)
.off('selectmenucreate.ghForm.createSelectmenu')
.on('selectmenucreate.ghForm.createSelectmenu', 'select', function(event, config) {
ghLog.event('selectmenucreate.ghForm.createSelectmenu');
ghForm.createSelectmenu(ghmob(event.currentTarget), config);
});
ghmob(document)
.off('checkboxradiocreate.ghForm.createCheckboxRadio')
.on('checkboxradiocreate.ghForm.createCheckboxRadio', 'input[type="checkbox"], input[type="radio"]', function(event, config) {
ghLog.event('checkboxradiocreate.ghForm.createCheckboxRadio');
ghForm.createCheckboxRadio(ghmob(event.currentTarget), config);
});
ghmob(document)
.off('textinputcreate.ghForm.createTextInput')
.on('textinputcreate.ghForm.createTextInput', 'input, textarea', function(event, config) {
ghLog.event('textinputcreate.ghForm.createTextInput');
ghForm.createTextInput(ghmob(event.currentTarget), config);
});
ghmob(document)
.off('change.ghForm.dateTimeValue')
.on('change.ghForm.dateTimeValue', 'input[id*="-tmp"][type="date"], input[id*="-tmp"][type="time"]', function() {
ghLog.event('change.ghForm.dateTimeValue');
ghForm._dateTimeValue(ghmob(this));
});
},
/**
* dateTimeValue
*
* @private
* @param {jQuery} selector
* @returns {void}
*/
_dateTimeValue: function(selector) {
if (typeof ghmob(selector).val() === 'undefined') return;
var originalID = ghmob(selector).attr('id').replace('-tmp', '');
var tmpValue = ghmob(selector).val();
var newValue = '';
if (ghmob(selector).is('[type="date"]') && tmpValue !== '') {
if (ghConfig.form.useISOFormat) {
newValue = ghUtils.dateTime.toISOString(tmpValue);
}
else {
newValue = ghUtils.dateTime.toLocaleDateString(tmpValue);
}
}
if (ghmob(selector).is('[type="time"]') && tmpValue !== '') {
newValue = ghUtils.dateTime.toStandardTime(tmpValue);
}
ghmob('[id="' + originalID + '"]').attr('value', newValue).trigger('change');
},
/**
* createSelectmenu
*
* @param {jQuery} selectors
* @param {obj} [config]
* @param {(string|array)} [config.color]
* @param {(bool|array)} [config.disabled]
* @param {jQuery} scope
* @returns {void}
*/
createSelectmenu: function(selectors, config, scope) {
if (typeof selectors === 'undefined') {
selectors = ghmob('select', scope);
}
ghmob(selectors).each(function(i) {
var selector = ghmob(this);
if (selector.is('select') === false) return;
if (ghConfig.form.nativeSelectMenus) {
var classes = 'gh-select';
if (selector.hasClass('PSERROR')) {
classes = classes + ' PSERROR';
}
selector.removeAttr('class');
if (selector.parent('.gh-select').length === 0) {
selector.wrapAll('<div class="' + classes + '"></div>');
}
}
// config
var dataColor = selector.attr('data-color');
var dataDisabled = selector.is('[data-disabled]') || selector.is('[disabled]') || selector.hasClass('ui-disabled');
var thisConfig = ghmob.extend({
color: (typeof dataColor === 'undefined') ? '' : dataColor,
disabled: dataDisabled,
}, config);
// color
var color = thisConfig.color;
if (typeof color === 'object') {
color = thisConfig.color[i];
}
if (typeof color !== 'undefined' && color !== '') {
if (color === 'error') {
color = color + ' PSERROR';
}
if (ghConfig.form.nativeSelectMenus) {
selector.parent('.gh-select').addClass(color);
}
else {
selector.parent('.ui-select').find('a.ui-btn').addClass(color);
}
}
// disabled
var disabled = thisConfig.disabled;
if (typeof disabled === 'object') {
disabled = thisConfig.disabled[i];
}
if (disabled) {
selector.attr('disabled', 'disabled');
selector.parent('.gh-select').addClass('ui-disabled');
}
});
},
/**
* createCheckboxRadio
*
* @param {jQuery} selectors
* @param {obj} [config]
* @param {(string|array)} [config.color]
* @param {(bool|array)} [config.disabled]
* @param {(string|array)} [config.theme]
* @param {jQuery} scope
* @returns {void}
*/
createCheckboxRadio: function(selectors, config, scope) {
if (typeof selectors === 'undefined') {
selectors = ghmob('input[type="checkbox"], input[type="radio"]', scope);
}
ghmob(selectors).each(function(i) {
var selector = ghmob(this);
var type = selector.attr('type');
if (type !== 'checkbox' && type !== 'radio') return;
// accessibility
ghAccessibility.doEnhanceCheckboxRadio(selector);
var thisId = selector.attr('id');
var thisLabel = ghmob('label[for="' + thisId + '"]').not('.ps_indicator').first();
if (ghConfig.form.nativeCheckboxRadio) {
// cleanup
var classes = '';
if (selector.hasClass('PSERROR')) {
classes = ' PSERROR';
}
thisLabel.removeAttr('class');
if (selector.parents(thisLabel).length > 0) {
selector.insertBefore(thisLabel);
}
// wrappers
if (type === 'checkbox' && selector.parent('.gh-checkbox').length === 0) {
classes = 'gh-checkbox' + classes;
selector.wrapAll('<div class="' + classes + '"></div>');
thisLabel.appendTo(selector.parent('.gh-checkbox'));
}
if (type === 'radio' && selector.parent('.gh-radio').length === 0) {
classes = 'gh-radio' + classes;
selector.wrapAll('<div class="' + classes + '"></div>');
thisLabel.appendTo(selector.parent('.gh-radio'));
}
}
// config
var dataColor = selector.attr('data-color');
var dataDisabled = selector.is('[data-disabled]') || selector.is('[disabled]') || selector.hasClass('ui-disabled');
var dataTheme = selector.attr('data-theme');
var thisConfig = ghmob.extend({
color: (typeof dataColor === 'undefined') ? '' : dataColor,
disabled: dataDisabled,
theme: (typeof dataTheme === 'undefined') ? '' : dataTheme,
}, config);
// color
var color = thisConfig.color;
if (typeof color === 'object') {
color = thisConfig.color[i];
}
if (typeof color !== 'undefined' && color !== '') {
if (color === 'error') {
color = color + ' PSERROR';
}
thisLabel.addClass(color);
}
// disabled
var disabled = thisConfig.disabled;
if (typeof disabled === 'object') {
disabled = thisConfig.disabled[i];
}
if (disabled) {
selector.prop('disabled', true);
selector.parent('.ui-disabled').removeClass('ui-disabled');
thisLabel.addClass('ui-disabled');
}
// theme
var theme = thisConfig.theme;
if (typeof theme === 'object') {
theme = thisConfig.theme[i];
}
if (typeof theme !== 'undefined' && theme !== '') {
thisLabel.attr('data-theme', theme);
}
// fluid
if (ghPage.isFluid() && type === 'checkbox' && selector.closest('.ps_box-checkbox').hasClass('psc_standard') === false) {
ghForm.checkboxToFlipswitch.create(selector);
}
});
},
/**
* getTextInputs
*
* @returns {string}
*/
getTextInputs: function() {
return 'input[type="text"], input[type="search"], input[type="number"], input[type="password"], input[type="email"], input[type="url"], input[type="tel"], textarea, input:not([type])';
},
/**
* createTextInput
*
* @param {jQuery} selectors
* @param {obj} [config]
* @param {(string|array)} [config.color]
* @param {(bool|array)} [config.disabled]
* @param {jQuery} scope
* @returns {void}
*/
createTextInput: function(selectors, config, scope) {
if (typeof selectors === 'undefined') {
selectors = ghmob(ghForm.getTextInputs(), scope);
}
ghmob(selectors).each(function(i) {
var selector = ghmob(this);
var thisWrapper;
if (selector.is(ghForm.getTextInputs()) === false) return;
selector.addClass('ui-input-text');
if (selector.is('textarea') === false && selector.parent('.ui-input-text').length === 0) {
selector.wrap('<div class="ui-input-text"></div>');
thisWrapper = selector.parent('.ui-input-text');
}
else {
thisWrapper = selector;
}
// config
var dataColor = selector.attr('data-color');
var dataDisabled = selector.is('[disabled]') || selector.is('[data-disabled]') || selector.hasClass('ui-disabled');
var thisConfig = ghmob.extend({
color: (typeof dataColor === 'undefined') ? '' : dataColor,
disabled: dataDisabled,
}, config);
// color
var color = thisConfig.color;
if (typeof color === 'object') {
color = thisConfig.color[i];
}
if (typeof color !== 'undefined' && color !== '') {
if (color === 'error') {
color = color + ' PSERROR';
}
thisWrapper.addClass(color);
}
// disabled
var disabled = thisConfig.disabled;
if (typeof disabled === 'object') {
disabled = thisConfig.disabled[i];
}
if (disabled) {
selector.prop('disabled', true);
thisWrapper.addClass('ui-disabled');
}
});
},
/**
* checkboxToFlipswitch
* Methods for turing a checkbox into a toggle flipswitch
*
* @submodule
* @type {obj}
*/
checkboxToFlipswitch: {
/**
* create
* Converts checkboxes to flipswitches
*
* @param {jQuery} selector
* @returns {void}
*/
create: function(selector) {
selector = ghUtils.jqElem(selector);
// if given a checkbox, find the checkbox container
selector.closest('.gh-checkbox').addClass('gh-flipswitch');
// if given a div, find the checkboxes
selector.find('.gh-checkbox').addClass('gh-flipswitch');
},
/**
* createAll
* Converts all checkboxes to flipswitches
*
* @private
* @param {jQuery} scope
* @returns {void}
*/
_createAll: function(scope) {
this.create(scope);
},
},
/**
* dropdownToSlider
* Methods for turing a dropdown to a sliding scale
*
* @submodule
* @type {obj}
*/
dropdownToSlider: {
/**
* drawSlider
* Draws the slider wrapper
*
* @private
* @param {jQuery} selectDropdown
* @returns {void}
*/
_drawSlider: function(selectDropdown) {
var dropdownOptions = this._getDropdownOptions(selectDropdown),
selectID = selectDropdown.attr('id'),
optionsLength = dropdownOptions.length,
oldDropdown = selectDropdown.closest('.gh-select'),
sliderContainer = ghmob('<div class="gh-slider-container"></div>'),
slider = ghmob('<input type="range" min="1">');
slider.attr('max', optionsLength);
slider.attr('value', this._getDropdownIndex(selectDropdown));
slider.attr('class', 'gh-slider gh-slider-option' + optionsLength);
slider.attr('id', 'gh_slider_' + selectID);
slider.appendTo(sliderContainer);
sliderContainer.insertAfter(oldDropdown);
oldDropdown.addClass('gh-hidden');
this._drawLabelsAndTicks(selectDropdown, selectID);
this._wireOnChange(selectDropdown, slider);
},
/**
* drawLabelsAndTicks
* Draws the labels and tick marks
*
* @private
* @param {jQuery} selectDropdown
* @returns {void}
*/
_drawLabelsAndTicks: function(selectDropdown) {
var dropdownOptions = this._getDropdownOptions(selectDropdown),
selectID = selectDropdown.attr('id'),
labels = ghmob('<ul class="gh-slider-labels" id="gh_labels_' + selectID + '"></ul>'),
ticks = ghmob('<ul class="gh-slider-ticks" id="gh_ticks_' + selectID + '"></ul>'),
optionsLength = dropdownOptions.length,
itemWidth = 100 / optionsLength,
slider = ghmob('[id="gh_slider_' + selectID + '"]');
ghmob.each(dropdownOptions, function(k, v) {
ticks.append('<li style="width: ' + itemWidth + '%">l</li>');
labels.append('<li style="width: ' + itemWidth + '%">' + v + '</li>');
});
labels.insertAfter(slider);
ticks.insertAfter(slider);
},
/**
* getDropdownOptions
* Get a list of all options
*
* @private
* @param {jQuery} selectDropdown
* @returns {array}
*/
_getDropdownOptions: function(selectDropdown) {
var opts = [];
selectDropdown.find('option').not('[data-placeholder="true"]').each(function() {
opts.push(ghmob(this).text());
});
return opts;
},
/**
* wireOnChange
* Update the current slider value (each time you drag the slider handle)
*
* @private
* @param {jQuery} selectDropdown
* @param {jQuery} slider
* @returns {void}
*/
_wireOnChange: function(selectDropdown, slider) {
var placeholderCount = this._getPlaceholderCount(selectDropdown);
slider = document.getElementById(slider.attr('id'));
slider.oninput = function() {
selectDropdown.find('option').prop('selected', false);
selectDropdown.find('option').eq((parseInt(this.value) + placeholderCount) - 1).prop('selected', true);
};
},
/**
* getDropdownIndex
* Get the selected dropdown index
*
* @private
* @param {jQuery} selectDropdown
* @returns {int}
*/
_getDropdownIndex: function(selectDropdown) {
var placeholderCount = this._getPlaceholderCount(selectDropdown),
selectedIndex = selectDropdown.get(0).selectedIndex - placeholderCount + 1;
return selectedIndex;
},
/**
* getPlaceholderCount
* Get the number of placeholder items in the dropdown
*
* @private
* @param {jQuery} selectDropdown
* @returns {int}
*/
_getPlaceholderCount: function(selectDropdown) {
return selectDropdown.find('option[data-placeholder="true"]').length;
},
/**
* create
* Preliminary checks before slider is drawn
*
* @param {jQuery} selectDropdown
* @returns {void}
*/
create: function(selectDropdown) {
selectDropdown = ghUtils.jqElem(selectDropdown);
if (!selectDropdown.is('select')) {
selectDropdown = selectDropdown.find('select:first');
}
if (!selectDropdown.is('select')) return;
this._drawSlider(selectDropdown);
},
},
/**
* cleanup
*
* @private
* @param {jQuery} scope
* @returns {void}
*/
_cleanup: function(scope) {
ghmob('label[for]:not(.ui-input-text):not(.ui-select)', scope).filter(function() {
return (ghmob('[id="' + ghmob(this).attr('for') + '"]').is('select'));
}).addClass('ui-select');
ghmob('label[for]:not(.ui-input-text):not(.ui-select)', scope).filter(function() {
return (ghmob('[id="' + ghmob(this).attr('for') + '"]').is('input[type="checkbox"], input[type="radio"], select') === false);
}).addClass('ui-input-text');
ghmob('input[type="hidden"].psc_off', scope).filter(function() {
return (ghmob(this).val() === '');
}).attr('value', 'N');
ghmob('input[type="hidden"].psc_on', scope).filter(function() {
return (ghmob(this).val() === '');
}).attr('value', 'Y');
ghmob('input[type="text"][value=""]', scope).removeAttr('value');
ghmob('input[id], select[id], textarea[id]', scope).not('[name]').each(function() {
ghmob(this).attr('name', ghmob(this).attr('id'));
});
ghmob('input[title]', scope).removeAttr('title');
},
/**
* processFields
*
* @private
* @param {jQuery} scope
* @returns {void}
*/
_processFields: function(scope) {
ghmob('[data-role="fieldcontain"]:not(.ui-field-contain)', scope).each(function() {
ghmob(this).addClass('ui-field-contain');
});
},
/**
* jqmSelectmenu
*
* @private
* @returns {void}
*/
_jqmSelectmenu: function() {
if (ghConfig.form.nativeSelectMenus !== true) return;
ghmob.fn.selectmenu = function(config) {
this.each(function() {
var $this = ghmob(this);
$this.trigger('selectmenucreate', config);
});
};
},
/**
* jqmCheckboxRadio
*
* @private
* @returns {void}
*/
_jqmCheckboxRadio: function() {
if (ghConfig.form.nativeCheckboxRadio !== true) return;
ghmob.fn.checkboxradio = function(config) {
this.each(function() {
var $this = ghmob(this);
$this.trigger('checkboxradiocreate', config);
});
};
},
/**
* jqmTextInput
*
* @private
* @returns {void}
*/
_jqmTextInput: function() {
if (ghConfig.form.nativeTextInput !== true) return;
ghmob.fn.textinput = function(config) {
this.each(function() {
var $this = ghmob(this);
if (ghmob(document).find($this).length === 0) {
ghForm.createTextInput($this, config);
}
else {
$this.trigger('textinputcreate', config);
}
});
};
},
/**
* onPageBeforeCreate
*
* @ignore
* @returns {void}
*/
onPageBeforeCreate: function() {
if (ghConfig.form.enabled === false) return;
this._jqmSelectmenu();
this._jqmCheckboxRadio();
this._jqmTextInput();
this._nativeDateTime();
ghmob('a[data-role="button"]').find('input[type="button"]').parents('a[data-role="button"]').removeAttr('data-role').removeAttr('role').removeAttr('data-theme');
},
/**
* init
*
* @private
* @param {jQuery} scope
* @returns {void}
*/
_init: function(scope) {
if (ghConfig.form.autoInitialize === false) return;
this.createSelectmenu(undefined, undefined, scope);
this.createCheckboxRadio(undefined, undefined, scope);
this.createTextInput(undefined, undefined, scope);
},
/**
* run
* Run constructor
*
* @ignore
* @param {jQuery} [scope]
* @returns {void}
*/
run: function(scope) {
this._eventBindings();
if (ghConfig.form.enabled === false) return;
this._init(scope);
this._processForm(scope);
},
};
/* run */
ghInit.module('ghForm');
/**
* ghContainer
*
* @module container
* @config enabled [true, false]
* @config autoInitialize [true, false]
*
* @trigger collapsiblecreate
* @trigger collapsibleexpand
* @trigger collapsiblecollapse
* @trigger containercreate
*/
var ghContainer = ghContainer || {
/**
* getOpenCollapsibles
*
* @deprecates getOpenSections
* @ignore
* @returns {array} Open collapsibles
*/
getOpenCollapsibles: function() {
var collapsibles = [];
ghmob('.ui-collapsible').filter(':not(.ui-collapsible-collapsed)').each(function() {
var id = this.id || ghmob(this).attr('data-for');
if (id) {
collapsibles.push(id.replace(ghPage.getWin() + 'div', ''));
}
});
return collapsibles;
},
/**
* expandRequiredCollapsibles
*
* @deprecates expandRequiredCollapsibles
* @ignore
* @param {jQuery} [scope]
* @returns {void}
*/
expandRequiredCollapsibles: function(scope) {
// ensure jquery object
scope = ghUtils.jqElem(scope) || ghmob(document);
var collapsed = scope.find('.ui-collapsible-collapsed');
var toBeEntered = window['unenteredRequired'](collapsed);
var collapsibles = toBeEntered.closest('.ui-collapsible');
while (collapsibles.length !== 0) {
collapsibles.each(function() {
ghmob(this).collapsible().trigger('expand');
});
collapsibles = collapsibles.parent().closest('.ui-collapsible');
}
},
/**
* moveContentIntoCollapsible
*
* @deprecates moveContentIntoCollapsible
* @param {string} pageName
* @param {int} fieldId
* @param {int} contentId
* @returns {void}
*/
moveContentIntoCollapsible: function(pageName, fieldId, contentId) {
ghPage.getField(pageName, fieldId).each(function() {
var row = ghmob(this).data('row'),
level = ghmob(this).data('lvl'),
inst = ghmob(this).data('pginst'),
selector = ghPage.getField(pageName, contentId).selector;
if (typeof(row) !== 'undefined') {
selector = selector + '[data-row=' + row + ']';
}
if (typeof(level) !== 'undefined') {
selector = selector + '[data-lvl=' + level + ']';
}
if (typeof(inst) !== 'undefined') {
selector = selector + '[data-pginst=' + inst + ']';
}
ghmob(this).after(ghmob(selector));
});
},
/**
* getTitle
*
* @ignore
* @param {jQuery} container
* @param {(string|jQuery)} [title]
* @param {bool} [returnObj]
* @returns {string}
*/
getTitle: function(container, title, returnObj) {
if (typeof title === 'string' || (typeof title !== 'undefined' && title.is(ghHeader.headings.join())) || (typeof title !== 'undefined' && title.hasClass('ui-collapsible-heading'))) return title;
if (typeof title !== 'undefined' && title.jquery) {
title.children().not('.psc_rowcount').addClass('gh-hidden').attr('aria-hidden', 'true');
if (title.is('.ps_box-grid-title') === false) {
title.addClass('gh-hidden').attr('aria-hidden', 'true');
}
title = title.clone();
title.find('b.ui-table-cell-label, .psc_rowcount, [class*="PSGRIDCOUNTER"], select, .fa, .sr-only').remove();
if (returnObj !== true) {
title = title.text().trim();
}
}
else if (typeof title === 'undefined') {
if (container.hasClass('ps_box-group') || container.hasClass('ps_box-grid-flex')) {
title = container.find('.ps_box-grid-title, .ps_header-group, .ps_box-title').first().find('.ps_box-text, .ps-text').filter(function() {
return (ghmob(this).is('.psc_rowcount') === false && ghmob(this).parents('.psc_rowcount').length === 0);
}).first();
title.addClass('gh-hidden').attr('aria-hidden', 'true');
if (returnObj !== true) {
title = title.text().trim();
}
}
else if (container.children(ghHeader.headings.join()).length > 0) {
title = container.find(ghHeader.headings.join()).first();
}
else {
title = container.find('tr').first();
if (title.find('[class*="PSGRIDCOUNTER"], option:selected, a[id*="$hexcel$"], a[id*="$hmodal$"], a[id*="$hpers$"]').length > 0) {
title = title.find(ghContainer.selectors.headers.join()).filter(function() {
return (ghmob(this).find('[class*="PSGRIDCOUNTER"], option:selected, a[id*="$hexcel$"], a[id*="$hmodal$"], a[id*="$hpers$"]').length === 0);
}).first();
}
title.addClass('gh-hidden').attr('aria-hidden', 'true');
if (returnObj !== true) {
title = title.text().trim();
}
}
}
if (title.jquery && container.attr('data-for') !== 'undefined' && (title.text().trim() === 'null' || title.text().trim() === '')) {
if (container.find('.PTEXPAND_ARROW, .PTCOLLAPSE_ARROW').length > 0) {
title.find('> .ui-collapsible-heading-toggle').text(container.find('.PTEXPAND_ARROW, .PTCOLLAPSE_ARROW').first().parent().text().trim());
}
else if (container.find('.PTCOLLAPSE[alt][title], .PTEXPAND[alt][title]').length > 0) {
title.find('> .ui-collapsible-heading-toggle').text(container.find('.PTCOLLAPSE[alt][title], .PTEXPAND[alt][title]').first().attr('alt').replace(container.find('.PTCOLLAPSE[alt][title], .PTEXPAND[alt][title]').first().attr('title'), ''));
}
else if (container.find('.gs-collapsible-control').length > 0) {
var control = container.find('.gs-collapsible-control').first().parent().clone();
control.find('.fa, .sr-only').remove();
title.find('> .ui-collapsible-heading-toggle').text(control.text().trim());
}
else {
return '';
}
}
return title;
},
/**
* create
* Creates a container
*
* @deprecates make_container, ghUtils.makeContainer
* @param {jQuery} container
* @param {(string|jQuery)} [title]
* @param {obj} [config]
* @param {obj} [config.button]
* @param {string} [config.button.color]
* @param {string} [config.button.icon]
* @param {string} [config.button.label]
* @param {jQuery} config.button.selector
* @param {string} [config.color]
* @param {string} [config.icon]
* @param {obj} [config.icon] // deprecated
* @param {string} [config.icon.color] // deprecated
* @param {string} config.icon.className // deprecated
* @param {jQuery} [config.counterItem]
* @param {obj} [config.counter] // deprecated
* @param {string} [config.counter.color] // deprecated
* @param {(string|jQuery)} config.counter.text // deprecated
* @param {string} [config.theme]
* @returns {(jQuery|bool)}
*/
create: function(container, title, config) {
// ensure jQuery elem
container = ghUtils.jqElem(container);
// check if container exists
if (container.length === 0) return false;
// check if container is a collapsible already
if (container.hasClass('ui-collapsible')) {
return this.createFromCollapsible(container, config, title);
}
// disable these containers
if (container.hasClass('psc_hidden') || container.is('[class*="notitle"]') || container.is('[class*="noheader"]')) return;
// ensure there is content in the container
if (container.text().trim() === '' && container.find('input, textarea').length < 1) return false;
// get title
var titleObj = this.getTitle(container, title, true);
title = this.getTitle(container, title);
if (typeof title === 'string' && title.trim() === '') return;
// check if container is a duplicate
var isDuplicate = this.isDuplicate(container, title);
if (isDuplicate === true) {
if (config) {
this._containerConfig(container, config);
}
if (title.jquery && title.hasClass('ui-bar') === false) {
title.addClass('gh-hidden').attr('aria-hidden', 'true');
}
return;
}
// create container
container.wrapAll('<div class="ui-body"></div>');
// heading
if (title.jquery) {
title.removeAttr('class aria-hidden').addClass('ui-bar').attr('tabindex', '-1').prependTo(container.parent('.ui-body'));
}
else {
var headingLevel = ghHeader.headingStartLevel();
container.parent('.ui-body').prepend('<h' + headingLevel + ' class="ui-bar" tabindex="-1">' + title + '</h' + headingLevel + '>');
}
// config
this._containerConfig(container, config, titleObj);
// trigger
container.trigger('containercreate');
return container.parent('.ui-body');
},
/**
* containerConfig
*
* @private
* @param {jQuery} container
* @param {obj} [config]
* @param {obj} [config.button]
* @param {string} [config.button.color]
* @param {string} [config.button.icon]
* @param {string} [config.button.label]
* @param {jQuery} config.button.selector
* @param {string} [config.color]
* @param {string} [config.icon]
* @param {obj} [config.icon] // deprecated
* @param {string} [config.icon.color] // deprecated
* @param {string} config.icon.className // deprecated
* @param {jQuery} [config.counterItem]
* @param {obj} [config.counter] // deprecated
* @param {string} [config.counter.color] // deprecated
* @param {(string|jQuery)} config.counter.text // deprecated
* @param {string} [config.theme]
* @param {(string|jQuery)} [title]
* @returns {void}
*/
_containerConfig: function(container, config, title) {
if (typeof container === 'undefined' || container.length === 0) return;
var dataCollapsed = container.attr('data-collapsed') !== 'false';
var dataColor = container.attr('data-alert') || container.attr('data-color');
var dataTheme = container.attr('data-theme');
if (typeof config === 'undefined') {
config = {};
}
config = ghmob.extend({
collapsed: dataCollapsed,
color: (typeof dataColor === 'undefined') ? '' : dataColor,
theme: (typeof dataTheme === 'undefined') ? '' : dataTheme,
}, config);
var wrapper;
if (container.hasClass('ui-collapsible') || container.hasClass('ui-body')) {
wrapper = container;
}
else if (container.parent('.ui-body').length > 0) {
wrapper = container.parent('.ui-body');
}
else if (container.children('.ui-body').length > 0) {
wrapper = container.children('.ui-body').first();
}
else {
return;
}
var header = wrapper.find('.ui-bar, .ui-collapsible-heading').first();
// id
var random = Math.round(Math.random() * 10000);
var id = (wrapper.hasClass('ui-collapsible')) ? 'gh-collapsible-' + random : 'gh-container-' + random;
if (wrapper.hasClass('ui-collapsible')) {
var toggle = header.find('> .ui-collapsible-heading-toggle');
var content = wrapper.find('> .ui-collapsible-content');
content.not('[id]').attr('id', id);
if (typeof toggle.attr('id') === 'undefined' || (typeof toggle.attr('id') !== 'undefined' && toggle.attr('id').indexOf(content.attr('id')) === -1)) {
toggle.attr('id', content.attr('id') + '-button');
}
toggle.attr('aria-expanded', !config.collapsed).attr('aria-controls', content.attr('id')).removeAttr('aria-label');
}
else {
header.attr('id', id);
}
// help button
if (typeof title !== 'undefined' && typeof title.jquery !== 'undefined') {
var help = title.find('img[src*="_HELP_"][onclick]');
if (help.length > 0 && typeof config.button === 'undefined') {
config = ghmob.extend({
button: {
icon: 'fa-question-circle',
label: 'Help',
selector: help,
},
}, config);
}
}
// color
if (typeof config.color !== 'undefined' && config.color !== '') {
wrapper.attr('data-alert', config.color);
}
// button
if (typeof config.button !== 'undefined' && ghmob(config.button.selector).is('a, input[type="button"], [onclick]')) {
var buttonLabel = config.button.label;
if (typeof config.button.label === 'undefined' || config.button.label === '') {
if (ghmob(config.button.selector).is('a') && ghmob(config.button.selector).text().trim() !== '') {
buttonLabel = ghmob(config.button.selector).text().trim();
}
if (ghmob(config.button.selector).is('input') && typeof ghmob(config.button.selector).attr('value') !== 'undefined') {
buttonLabel = ghmob(config.button.selector).attr('value');
}
}
this.attachButton(wrapper, ghmob(config.button.selector), { color: config.button.color, icon: config.button.icon, label: buttonLabel });
}
// collapsed
if (container.hasClass('ui-collapsible')) {
if (config.collapsed) {
container.attr('data-collapsed', 'true').addClass('ui-collapsible-collapsed').children('.ui-collapsible-content').addClass('ui-collapsible-content-collapsed');
}
else {
container.attr('data-collapsed', 'false').removeClass('ui-collapsible-collapsed').children('.ui-collapsible-content').removeClass('ui-collapsible-content-collapsed');
}
}
// counter
if (typeof config.counterItem !== 'undefined' && config.counterItem !== '' && typeof config.counter === 'undefined') {
config.counter = {
text: config.counterItem,
};
}
if (typeof config.counter !== 'undefined') {
var counterText;
if (typeof config.counter === 'string' || typeof config.counter === 'number') {
counterText = config.counter;
}
else if (typeof config.counter.text === 'string' || typeof config.counter.text === 'number') {
counterText = config.counter.text;
}
else if (typeof config.counter.text === 'object') {
counterText = ghmob(config.counter.text).length;
}
else if (typeof config.counter === 'object') {
counterText = ghmob(config.counter).length;
}
header.find('.gh-counter').remove();
var counterObj = ghmob('<span class="gh-counter ui-icon ui-icon-bubble ui-icon-shadow" aria-hidden="true">' + counterText + '</span>');
if (typeof config.counter.color !== 'undefined') {
counterObj.addClass(config.counter.color);
}
header.attr('title', counterText + ' items');
if (header.find('.ui-collapsible-heading-toggle').length > 0) {
header.find('.ui-collapsible-heading-toggle').prepend(counterObj);
}
else {
header.prepend(counterObj);
}
}
// icon
if (typeof config.icon !== 'undefined') {
if (typeof config.icon === 'string' && typeof config.icon.className === 'undefined') {
config.icon = {
className: config.icon,
};
}
header.find('.gh-icon').remove();
var iconObj = ghmob('<i class="gh-icon ' + config.icon.className + '" aria-hidden="true"></i>');
if (!config.icon.className || config.icon.className.indexOf('fa ') === -1) {
iconObj.addClass('fa');
}
if (typeof config.icon.color !== 'undefined') {
iconObj.addClass(config.icon.color);
}
if (header.find('.ui-collapsible-heading-toggle').length > 0) {
header.find('.ui-collapsible-heading-toggle').prepend(iconObj);
}
else {
header.prepend(iconObj);
}
}
// theme
if (typeof config.theme !== 'undefined' && config.theme !== '') {
wrapper.attr('data-theme', config.theme);
}
},
/**
* isDuplicate
* Check if container is a duplicate
*
* @ignore
* @param {jQuery} container
* @param {(jQuery|string)} [title]
* @returns {bool}
*/
isDuplicate: function(container, title) {
var isDuplicate = false;
var containers = '.ui-collapsible, div[class="ui-body"]';
if (typeof title !== 'undefined' && typeof title.jquery !== 'undefined') {
title = title.text().trim();
}
if (container.is(containers)) {
isDuplicate = ghContainer._isDuplicateHeader(container, title, isDuplicate);
}
if (container.parents(containers).length > 0) {
container.parents(containers).each(function() {
isDuplicate = ghContainer._isDuplicateHeader(ghmob(this), title, isDuplicate);
});
}
if (container.find(containers).length > 0) {
container.find(containers).each(function() {
isDuplicate = ghContainer._isDuplicateHeader(ghmob(this), title, isDuplicate);
});
}
return isDuplicate;
},
/**
* isDuplicateHeader
*
* @private
* @param {jQuery} container
* @param {string} [title]
* @param {bool} isDuplicate
* @returns {bool}
*/
_isDuplicateHeader: function(container, title, isDuplicate) {
var headings = '> .ui-collapsible-heading, > .ui-bar, > .gh-submenu-wrap > .ui-collapsible-heading';
var thisHeader = container.find(headings);
if (thisHeader.length === 0) return isDuplicate;
var thisHeaderText;
if (thisHeader.find('.ui-collapsible-heading-toggle').length > 0) {
thisHeader = thisHeader.find('> .ui-collapsible-heading-toggle');
}
thisHeader = thisHeader[0].childNodes;
if (thisHeader.length > 0) {
for (var i = 0; i < thisHeader.length; i++) {
if (typeof thisHeaderText === 'undefined' && thisHeader[i].nodeType === 3) {
thisHeaderText = thisHeader[i].nodeValue;
}
}
}
if (thisHeaderText && thisHeaderText.trim().indexOf(title.trim()) === 0) {
isDuplicate = true;
}
return isDuplicate;
},
/**
* attachButton
*
* @ignore
* @param {jQuery} container
* @param {jQuery} button
* @param {obj} [config]
* @param {string} [config.color]
* @param {string} [config.icon]
* @param {string} [config.label]
* @returns {void}
*/
attachButton: function(container, button, config) {
if (container.length === 0 || button.length === 0) return;
if (button.is('a, input, img[onclick]') === false) {
if (button.find('a, input').length === 0) return;
button = button.addClass('gh-hidden').attr('aria-hidden', 'true').find('a, input').first();
}
config = config || {};
config.color = (typeof config.color === 'undefined') ? '' : config.color;
config.icon = (typeof config.icon === 'undefined') ? '' : config.icon;
config.label = (typeof config.label === 'undefined') ? '' : config.label;
if (config.label === '') {
if (button.is('input[title]')) {
config.label = button.attr('title');
}
else {
config.label = button.text().trim();
}
}
if (config.label === '' || (ghmob('.ui-page').find(button).length > 0 && typeof button.attr('onclick') === 'undefined' && (typeof button.attr('href') === 'undefined' || button.attr('href') === '#'))) return;
var action = '#';
var btn = ghmob('<a class="attached fa ' + config.icon + ' ' + config.color + '" aria-label="' + config.label + '" data-role="button"></a>');
if (typeof button.attr('onclick') !== 'undefined') {
action = button.attr('onclick');
action = action.replace('this.name', '\'' + button.attr('name') + '\'');
action = action.replace('this.id', '\'' + button.attr('id') + '\'');
action = action.replace('event', '\'click\'');
btn.attr('onclick', action);
}
if (typeof button.attr('href') !== 'undefined') {
action = button.attr('href');
action = action.replace('this.name', '\'' + button.attr('name') + '\'');
action = action.replace('this.id', '\'' + button.attr('id') + '\'');
btn.attr('href', action);
}
btn.button();
var containerHd = container.find('.ui-bar, .ui-collapsible-heading').first();
if (containerHd.find('div.attached').length === 0) {
containerHd.attr('data-attached', 'true').append('<div class="attached"></div>');
}
if (containerHd.find('a[aria-label="' + config.label + '"].attached').length === 0) {
containerHd.find('div.attached').append(btn);
}
button.addClass('gh-hidden').attr('aria-hidden', 'true');
},
/**
* createCollapsible
* Creates a collapsible
*
* @deprecates make_collapsible, make_collapsible_external_header, ghUtils.makeCollapsible
* @param {jQuery} containers
* @param {(string|jQuery)} [title]
* @param {obj} [config]
* @param {obj} [config.button]
* @param {string} [config.button.color]
* @param {string} [config.button.icon]
* @param {string} [config.button.label]
* @param {jQuery} config.button.selector
* @param {bool} [config.collapsed]
* @param {string} [config.color]
* @param {obj} [config.icon]
* @param {string} [config.icon.color]
* @param {string} config.icon.className
* @param {obj} [config.counter]
* @param {string} [config.counter.color]
* @param {(string|jQuery)} config.counter.text
* @param {string} [config.theme]
* @param {bool} [collapsed] - DEPRECATED
* @returns {(jQuery|bool)}
*/
createCollapsible: function(containers, title, config, collapsed) {
ghmob(containers).each(function() {
var container = ghmob(this);
// get title
var titleObj = ghContainer.getTitle(container, title, true);
title = ghContainer.getTitle(container, title);
if (typeof title === 'string' && title.trim() === '') return;
// check if container is a duplicate
var isDuplicate = ghContainer.isDuplicate(container, title);
if (isDuplicate && title.jquery && title.hasClass('ui-collapsible-heading') === false) {
title.addClass('gh-hidden').attr('aria-hidden', 'true');
}
// check for duplicate server collapsibles
if (container.attr('data-for') !== 'undefined' && ghmob(this).parents('[data-for="' + container.attr('data-for') + '"]').length > 0) {
container.find('> ' + ghHeader.headings.join() + ':contains("null")').remove();
container.children().unwrap();
return;
}
if (isDuplicate !== true || (isDuplicate === true && container.find('.ui-collapsible-content').length === 0 && container.is('.ui-collapsible-content') === false)) {
// adjust selector if container already made
if (container.is('div[class="ui-body"]') === false && container.children('div[class="ui-body"]').not('[data-submenu="true"]').length > 0) {
container = container.children('div[class="ui-body"]');
container.removeClass('ui-body').find('> [class="ui-bar"]').first().remove();
}
// add class
container.addClass('ui-collapsible gh-collapsible');
// wrap content
var content = container.children().not(ghHeader.headings.join() + ', .ui-collapsible-heading');
if (container.children('.ui-collapsible-content').length === 0) {
content.wrapAll('<div class="ui-collapsible-content"></div>');
}
// apply title
if (title.jquery) {
if (title.children().length === 0 && title.text().indexOf('Personalize|Find') > -1) {
title.text(title.text().split('Personalize|Find')[0]);
}
if (title.children().length === 0 && title.text().indexOf('Find|') > -1) {
title.text(title.text().split('Find|')[0]);
}
title.removeAttr('class aria-hidden').addClass('ui-collapsible-heading');
if (title.children('.ui-collapsible-heading-toggle').length === 0) {
if (title.children('a').length === 0) {
title.html('<a href="#" class="ui-collapsible-heading-toggle">' + title.html() + '</a>');
}
else {
title.children('a').addClass('ui-collapsible-heading-toggle');
}
}
}
else if (container.children('.ui-collapsible-heading').length === 0) {
var headingLevel = ghHeader.headingStartLevel();
container.prepend('<h' + headingLevel + ' class="ui-collapsible-heading"><a href="#" class="ui-collapsible-heading-toggle">' + title + '</a></h' + headingLevel + '>');
}
}
// config
if (typeof config === 'undefined') {
config = {};
}
if (typeof config === 'string') {
config = ghmob.extend({
theme: config,
}, config);
}
if (typeof collapsed !== 'undefined') {
config.collapsed = collapsed;
config = ghmob.extend({
collapsed: collapsed,
}, config);
}
// server collapsibles
var collapsibleControl = container.find('.gs-collapsible-control[aria-expanded], .gs-collapsible-control [aria-expanded], a.gs-collapsible-control, .PTCOLLAPSE_ARROW, .PTEXPAND_ARROW').first();
if (container.is('[data-for]') && collapsibleControl.length > 0) {
container.attr('data-servercollapsed', 'true');
collapsibleControl.addClass('gh-hidden').attr('aria-hidden', 'true');
if (collapsibleControl.hasClass('PTCOLLAPSE_ARROW') || collapsibleControl.hasClass('PTEXPAND_ARROW')) {
collapsibleControl.parent('div').addClass('gh-hidden').attr('aria-hidden', 'true');
}
if (collapsibleControl.is('[aria-expanded="false"]')) {
config.collapsed = true;
}
if (collapsibleControl.is('[aria-expanded="true"]')) {
config.collapsed = false;
}
}
ghContainer._containerConfig(container, config, titleObj);
});
return containers;
},
/**
* createFromCollapsible
* Turns an already formed collapsible into a container
*
* @deprecates make_container_from_collapsible, ghUtils.makeContainerFromCollapsible
* @param {jQuery} container
* @param {obj} [config]
* @param {obj} [config.button]
* @param {string} [config.button.color]
* @param {string} [config.button.icon]
* @param {string} [config.button.label]
* @param {jQuery} config.button.selector
* @param {string} [config.color]
* @param {obj} [config.icon]
* @param {string} [config.icon.color]
* @param {string} config.icon.className
* @param {obj} [config.counter]
* @param {string} [config.counter.color]
* @param {(string|jQuery)} config.counter.text
* @param {string} [config.theme]
* @param {string} title = container.children('.ui-collapsible-heading').text()
* @returns {void}
*/
createFromCollapsible: function(container, config, title) {
// ensure jQuery elem
container = ghUtils.jqElem(container);
// check if container exists
if (container.length === 0) return false;
// remove collapsible header elements
container.children('.ui-collapsible-heading').find('.ui-collapsible-heading-status').remove();
// get title
if (typeof title === 'undefined' || title === '') {
if (container.children('.ui-collapsible-heading').find('.ui-btn-text').length === 0) {
title = container.children('.ui-collapsible-heading').text().trim();
}
else {
title = container.children('.ui-collapsible-heading').find('.ui-btn-text').text().trim();
}
}
// remove collapsible elements and add container elements
var headingLevel = ghHeader.headingStartLevel();
if (container.prev('.ui-body').length === 0) {
container.before('<div class="ui-body"><h' + headingLevel + ' class="ui-bar" tabindex="-1">' + title + '</h' + headingLevel + '></div>');
var newContainer = container.prev('.ui-body');
newContainer.append(container.children('.ui-collapsible-content').children());
// retain attributes
var attributes = container[0].attributes;
for (var i = 0; i < attributes.length; i++) {
if (attributes[i].nodeName !== 'class' && attributes[i].nodeName !== 'data-role') {
newContainer.attr(attributes[i].nodeName, attributes[i].nodeValue);
}
}
// remove container
container.remove();
// config
this._containerConfig(newContainer, config);
}
},
/**
* selectors
*
* @ignore
* @type {obj}
*/
selectors: {
containers: [
'table[class*="PSLEVEL"][class*="GRIDWBO"]',
'table[class*="PSLEVEL"][class*="GRIDNBO"]',
'table[class*="PSLEVEL"][class*="SCROLLAREABODYNBO"]',
'table[class*="PSLEVEL"][class*="SCROLLAREABODYWBO"]',
'table[class*="PSGROUPBOX"]:not([class*="LABEL"])',
'table[class*="PAGROUPBOX"]:not([class*="LABEL"])',
'table[role="presentation"][class=" "]',
'table[id*="scroll"]:not([class*="INVISIBLE"])',
],
headers: [
'td[class*="PSLEVEL"][class*="GRIDLABEL"]',
'td[class*="PSLEVEL"][class*="SCROLLAREAHEADER"]',
'td[class*="GROUPBOXLABEL"]',
'td.PAGROUPDIVIDER',
],
},
/**
* initializeOverrides
*
* @ignore
* @param {jQuery} scope
* @returns {void}
*/
_initializeOverrides: function(scope) {
if (ghConfig.container.autoInitialize === false) return;
// check page for containers generated through PFOs
ghmob('.gh-container-field', scope).each(function() {
var pfoContainer = ghmob(this);
var pfoContainerHd = pfoContainer.find('>label[data-is-override="true"]').length > 0 ? pfoContainer.find('>label[data-is-override="true"]').text() : undefined;
// removing extra custom label for collapsibles & non-collapsibles
pfoContainer.find('>label[data-is-override="true"]').addClass('gh-hidden').attr('aria-hidden', 'true');
// formatting non-collapsibles
pfoContainer.find('>.ui-body>.ui-bar').addClass('gh-hidden').attr('aria-hidden', 'true');
pfoContainer.find('>.ui-body').removeClass('ui-body');
var pfoContainerIcon = pfoContainer.attr('data-gh-container-icon');
var pfoContainerCounterSelector = pfoContainer.attr('data-gh-counter-item');
var pfoContainerCounterSelectorEleArr = pfoContainer.find(pfoContainerCounterSelector);
var pfoContainerCounter = pfoContainerCounterSelectorEleArr.length;
var pfoContainerCounterHeaderConfig = {
icon: {
className: pfoContainerIcon,
},
};
if (pfoContainerCounterSelector) {
pfoContainerCounterHeaderConfig.counter = {
text: pfoContainerCounter,
};
}
if (pfoContainer.attr('data-gh-container-collapsible') === 'true') {
var collapsedState = pfoContainer.attr('data-gh-collapsible-collapsed') === 'true' ? true : false;
pfoContainerCounterHeaderConfig.collapsed = collapsedState;
ghContainer.createCollapsible(pfoContainer, pfoContainerHd, pfoContainerCounterHeaderConfig);
}
else {
ghContainer.create(pfoContainer, pfoContainerHd, pfoContainerCounterHeaderConfig);
}
});
},
/**
* initializeContainers
*
* @deprecates ghUtils.makeContainerInit
* @ignore
* @param {jQuery} scope
* @returns {void}
*/
initializeContainers: function(scope) {
if (ghConfig.container.autoInitialize === false) return;
var containers = this.selectors.containers;
var headers = this.selectors.headers;
// check page for container candidates
ghmob(headers.join(), scope).each(function() {
var thisContainerHeader = ghmob(this);
if (thisContainerHeader.is('[class*="INVISIBLE"]:not([class*="BACKGROUNDINVISIBLE"])') || thisContainerHeader.parents('.ui-table').length > 0 || thisContainerHeader.find('.gs-collapsible-control').length > 0 || thisContainerHeader.attr('align') === 'right' && thisContainerHeader.prev('td[align="left"]').length > 0) return;
if (thisContainerHeader.find('[class*="PSGRIDCOUNTER"], option:selected, a[id*="$hexcel$"], a[id*="$hmodal$"], a[id*="$hpers$"]').length > 0) {
thisContainerHeader = thisContainerHeader.find(headers.join()).filter(function() {
return (ghmob(this).find('[class*="PSGRIDCOUNTER"], option:selected, a[id*="$hexcel$"], a[id*="$hmodal$"], a[id*="$hpers$"]').length === 0);
}).first();
}
var thisContainer = thisContainerHeader.closest(containers.join());
if (thisContainerHeader.hasClass('PAGROUPDIVIDER') && thisContainer.length === 0) {
thisContainer = thisContainerHeader.closest('table');
}
ghContainer.create(thisContainer, thisContainerHeader);
});
},
/**
* initializeCollapsibles
*
* @ignore
* @param {jQuery} scope
* @returns {void}
*/
initializeCollapsibles: function(scope) {
if (ghConfig.container.autoInitialize === false) return;
ghmob('[data-role="collapsible"], .ui-collapsible', scope).each(function() {
ghContainer.createCollapsible(ghmob(this));
});
ghmob('a[id*="EXPAND_COLLAPS"], a.PTCOLLAPSE_ARROW, a.PTEXPAND_ARROW, a.gs-collapsible-control, img[src*="EXPAND_ICN"][alt*="Expand"], img[src*="COLLAPSE_ICN"][alt*="Collapse"]', scope).each(function() {
var _this = ghmob(this);
if (_this.is('img')) {
if (_this.parents('a').length === 0) return;
_this = _this.closest('a');
}
_this.addClass('gs-collapsible-control').attr('aria-expanded', (_this.parent().find('[title*="Expand"]:not([title*="Collapse"])').length === 0 && _this.find('img[src*="EXPAND"], [data-gh-replace*="EXPAND"]').length === 0));
if (_this.parents('[data-for="' + _this.attr('id') + '"]').length > 0) return;
var heading;
var title = _this.attr('title');
if (title) {
title = title.replace('Expand / Collapse', '').replace('Collapse section ', '').replace('Expand section ', '');
}
var alt = _this.attr('alt');
if (alt) {
alt = alt.replace('Expand / Collapse', '').replace('Collapse section ', '').replace('Expand section ', '');
}
if (_this.parents('td[class*="LABEL"]').length > 0) {
heading = _this.closest('td[class*="LABEL"]');
}
else if (title && title !== '') {
heading = title;
}
else if (alt && alt !== '') {
heading = alt;
}
else {
heading = _this.closest('tr').next('tr').find('a, span').first();
}
var thisParent = _this.closest('table').closest('div[id]');
if (thisParent.parents('[class*="LABEL"]').length > 0) {
thisParent = thisParent.closest('[class*="LABEL"]').closest('div[id]');
}
thisParent.attr('data-for', _this.attr('id'));
ghContainer.createCollapsible(_this.closest('table').closest('div[id]'), heading);
});
},
/**
* initializeFluid
*
* @ignore
* @param {jQuery} scope
* @returns {void}
*/
initializeFluid: function(scope) {
if (ghConfig.container.autoInitialize === false || ghPage.isFluid() === false) return;
ghmob('.ps_header-group', scope).each(function() {
var thisHeader = ghmob(this);
if (thisHeader.text().trim() === '') return;
var group = thisHeader.closest('.ps_content-group, .ps_box-group').not('[class*="-hidereadable"], .psc_layout');
if (group.hasClass('psc_groupbox-notitle') || group.hasClass('psc_header-none') || group.hasClass('psc_hidden') || group.hasClass('psc_hidden-readable') || group.hasClass('lppagehdr') || group.hasClass('pts_category_header1') || group.parents('div[id*="$divpop"], div[class*="-popup"]').length > 0) return;
var collapsible = thisHeader.closest('.psc_collapsible').not('.psc_groupbox-notitle, .psc_header-none, .psc_hidden, .ui-collapsible');
var isCollapsible = collapsible.length > 0;
if (isCollapsible) {
group = collapsible;
}
var accordion = thisHeader.closest('.ps_accordion').not('.psc_groupbox-notitle, .psc_header-none, .psc_hidden, .ui-collapsible');
var isAccordion = accordion.length > 0;
if (isAccordion) {
group = thisHeader.closest('.ps_box-group');
}
if (group.find('> .psc_scrollarea-notitle').length > 0) return;
if (thisHeader.find('> .ps-text').length > 0) {
thisHeader = thisHeader.find('> .ps-text');
}
if (isAccordion || isCollapsible) {
var collapsed = group.find('.psc_close').length > 0;
if (isAccordion) {
collapsed = group.hasClass('psc_close');
}
ghContainer.createCollapsible(group, thisHeader, { collapsed: collapsed });
}
else if (group.hasClass('psc_float-clear')) {
ghContainer.create(group.children(), thisHeader);
}
else if (group.children('.ps_content-group').length > 0) {
ghContainer.create(group.children('.ps_content-group'), thisHeader);
}
else {
ghContainer.create(group, thisHeader);
}
});
ghmob('.ps_box-grid-title', scope).each(function() {
if (ghmob(this).parents('.psc_hidden').length > 0) return;
ghContainer.create(ghmob(this).closest('.ps_box-grid-flex'), ghmob(this));
});
ghmob('.ui-collapsible-heading:contains("null")', scope).each(function() {
var thisHeading = ghmob(this);
var thisCollapsible = ghmob(this).closest('.ui-collapsible');
thisCollapsible.find('> .ui-collapsible-content').children().unwrap().unwrap();
thisHeading.remove();
});
},
/**
* initializeClassicPlus
*
* @ignore
* @param {jQuery} scope
* @returns {void}
*/
initializeClassicPlus: function(scope) {
if (ghConfig.container.autoInitialize === false || ghPage.isClassicPlus() === false) return;
ghmob('.PTCPGROUPBOXWBO', scope).each(function() {
ghContainer.create(ghmob(this), ghmob(this).find('.PTCPGRIDTITLE').first());
});
ghmob('table[id*="$scroll"], table.PABACKGROUNDINVISIBLENBO', scope).each(function() {
var parent = ghmob(this).closest('div[id]');
var header = parent.find('.PTCPGRIDTITLE, .PTCPSCROLLAREAHEADER, .PAGRIDHEADER').first();
if (header.length === 0) return;
ghContainer.create(parent, header);
});
var serverCollapsibles = ghmob('[data-for]').filter(function() {
return (ghmob(this).find('> .ui-collapsible-heading:contains("null")').length > 0 || ghmob(this).find('> .ui-collapsible-heading').text().trim() === '');
});
serverCollapsibles.each(function() {
var thisHeading = ghmob(this).find('> .ui-collapsible-heading');
var thisCollapsible = ghmob(this).closest('.ui-collapsible');
var collapseArrow = thisCollapsible.find('.PTCOLLAPSE_ARROW, .PTEXPAND_ARROW').first();
if (ghmob(this).parents('[data-for="' + ghmob(this).attr('data-for') + '"]').length > 0) {
thisCollapsible.find('> .ui-collapsible-content').children().unwrap().unwrap();
thisHeading.remove();
}
else if (collapseArrow.length > 0) {
var headingTextContainer = thisHeading.find('> .ui-collapsible-heading-toggle');
if (thisHeading.find('.ui-btn-text').length > 0) {
headingTextContainer = headingTextContainer.find('.ui-btn-text');
}
headingTextContainer.text(collapseArrow.parent('div').text().trim());
}
});
},
/**
* unwrap
* Unwrap a container
*
* @param {jQuery} container
* @returns {void}
*/
unwrap: function(container) {
if (container.length === 0) return;
if (container.parent('.ui-collapsible').length > 0) {
container.prev('.ui-collapsible-heading').remove();
container.removeClass('ui-collapsible-content ui-collapsible-content-collapsed').unwrap();
}
else if (container.find('> .ui-collapsible').length > 0) {
container.find('> .ui-collapsible > .ui-collapsible-heading').first().remove();
container.find('> .ui-collapsible > .ui-collapsible-content').first().removeClass('ui-collapsible-content ui-collapsible-content-collapsed').unwrap();
}
else if (container.hasClass('ui-collapsible')) {
container.find('> .ui-collapsible-heading').first().remove();
container.find('> .ui-collapsible-content').first().removeClass('ui-collapsible-content ui-collapsible-content-collapsed').unwrap();
}
else if (container.parent('.ui-body').length > 0) {
container.prev('.ui-bar').remove();
container.unwrap();
}
else if (container.find('> .ui-body').length > 0) {
container.find('> .ui-body > .ui-bar').first().remove();
container.find('> .ui-body > div, > .ui-body > table').first().unwrap();
}
else if (container.hasClass('.ui-body')) {
container.removeClass('ui-body');
container.find('> .ui-bar').first().remove();
}
},
/**
* expandActiveCollapsibles
*
* @ignore
* @returns {void}
*/
expandActiveCollapsibles: function() {
if (typeof window.activeCollapsible !== 'undefined') {
for (var a = 0; a < window.activeCollapsible.length; a++) {
if (typeof window.activeCollapsible[a] !== 'undefined') {
var activeIndex = parseInt(window.activeCollapsible[a]['index']);
ghmob('[id="' + window.activeCollapsible[a]['id'] + '"]').find('.ui-collapsible').each(function(b) {
if (b === activeIndex && ghmob(this).attr('data-gh-collapsible-collapsed') !== 'true') {
ghmob(this).addClass('gh-active-collapsible');
if (typeof ghmob(this).attr('data-for') === 'undefined') {
ghmob(this).trigger('expand');
}
}
});
}
}
}
if (typeof window.inactiveCollapsible !== 'undefined') {
for (var c = 0; c < window.inactiveCollapsible.length; c++) {
if (typeof window.inactiveCollapsible[c] !== 'undefined') {
var inactiveIndex = parseInt(window.inactiveCollapsible[c]['index']);
ghmob('[id="' + window.inactiveCollapsible[c]['id'] + '"]').find('.ui-collapsible').each(function(d) {
if (d === inactiveIndex && ghmob(this).attr('data-gh-collapsible-collapsed') !== 'false') {
ghmob(this).removeClass('gh-active-collapsible').trigger('collapse');
}
});
}
}
}
},
/**
* collapsibleOnExpand
*
* @ignore
* @param {jQuery} collapsible
* @returns {void}
*/
collapsibleOnExpand: function(collapsible) {
collapsible = ghUtils.jqElem(collapsible);
this._toggleAjaxCollapsible(collapsible);
collapsible.removeClass('ui-collapsible-collapsed').children('.ui-collapsible-content').removeClass('ui-collapsible-content-collapsed');
collapsible.find('> .ui-collapsible-heading > .ui-collapsible-heading-toggle').attr('aria-expanded', 'true');
/* add this collapsible to memory */
var activeCollapsible = window.activeCollapsible || [];
var inactiveCollapsible = window.inactiveCollapsible || [];
var thisActiveCollapsible = collapsible;
var thisActiveCollapsiblePosition = 0;
window.activeCollapsibleOrigin = ghPage.getName();
thisActiveCollapsible.addClass('gh-active-collapsible');
thisActiveCollapsible.parents('[id]').first().find('.ui-collapsible').each(function(i) {
if (ghmob(this).is(thisActiveCollapsible)) {
thisActiveCollapsiblePosition = i;
}
});
var activeCollapsibleObj = {
index: thisActiveCollapsiblePosition,
id: collapsible.parents('[id]').first().attr('id'),
};
var activeCollapsibleMatch = false;
if (activeCollapsible.length > 0) {
for (var a = 0; a < activeCollapsible.length; a++) {
if (activeCollapsible[a] && activeCollapsible[a]['index'] === activeCollapsibleObj['index'] && activeCollapsible[a]['id'] === activeCollapsibleObj['id']) {
activeCollapsibleMatch = true;
}
}
}
if (inactiveCollapsible.length > 0) {
for (var b = 0; b < inactiveCollapsible.length; b++) {
if (inactiveCollapsible[b] && inactiveCollapsible[b]['index'] === activeCollapsibleObj['index'] && inactiveCollapsible[b]['id'] === activeCollapsibleObj['id']) {
inactiveCollapsible.splice(b, 1);
}
}
}
if (activeCollapsibleMatch === false) {
activeCollapsible.push(activeCollapsibleObj);
window.activeCollapsible = activeCollapsible;
}
window.inactiveCollapsible = inactiveCollapsible;
// fluid
this.fluidExpandCollapse(collapsible);
},
/**
* collapsibleOnCollapse
*
* @ignore
* @param {jQuery} collapsible
* @returns {void}
*/
collapsibleOnCollapse: function(collapsible) {
collapsible = ghUtils.jqElem(collapsible);
collapsible.addClass('ui-collapsible-collapsed').children('.ui-collapsible-content').addClass('ui-collapsible-content-collapsed');
collapsible.find('> .ui-collapsible-heading > .ui-collapsible-heading-toggle').attr('aria-expanded', 'false');
/* remove this collapsible from memory */
var activeCollapsible = window.activeCollapsible || [];
var inactiveCollapsible = window.inactiveCollapsible || [];
var thisActiveCollapsible = collapsible;
var thisActiveCollapsiblePosition = 0;
thisActiveCollapsible.removeClass('gh-active-collapsible');
thisActiveCollapsible.parents('[id]').first().find('.ui-collapsible').each(function(i) {
if (ghmob(this).is(thisActiveCollapsible)) {
thisActiveCollapsiblePosition = i;
}
});
var activeCollapsibleObj = {
index: thisActiveCollapsiblePosition,
id: collapsible.parents('[id]').first().attr('id'),
};
var activeCollapsibleMatch = false;
if (inactiveCollapsible.length > 0) {
for (var a = 0; a < inactiveCollapsible.length; a++) {
if (inactiveCollapsible[a] && inactiveCollapsible[a]['index'] === activeCollapsibleObj['index'] && inactiveCollapsible[a]['id'] === activeCollapsibleObj['id']) {
activeCollapsibleMatch = true;
}
}
}
if (activeCollapsible.length > 0) {
for (var b = 0; b < activeCollapsible.length; b++) {
if (activeCollapsible[b] && activeCollapsible[b]['index'] === activeCollapsibleObj['index'] && activeCollapsible[b]['id'] === activeCollapsibleObj['id']) {
activeCollapsible.splice(b, 1);
}
}
}
if (activeCollapsibleMatch === false) {
inactiveCollapsible.push(activeCollapsibleObj);
window.inactiveCollapsible = inactiveCollapsible;
}
window.activeCollapsible = activeCollapsible;
// fluid
this.fluidExpandCollapse(collapsible);
},
/**
* fluidExpandCollapse
*
* @ignore
* @param {jQuery} collapsible
* @returns {void}
*/
fluidExpandCollapse: function(collapsible) {
if (ghPage.isFluid() === false) return;
var toggleAction = collapsible.find('.ui-collapsible-heading-toggle').attr('href');
if (typeof toggleAction === 'undefined' || toggleAction.indexOf('javascript:') === -1) return;
toggleAction = toggleAction.replace('javascript:', '');
eval(toggleAction);
},
/**
* _toggleAjaxCollapsible
*
* @private
* @ignore
* @param {jQuery} collapsible
* @returns {void}
*/
_toggleAjaxCollapsible: function(collapsible) {
if (collapsible.parent('[data-servercollapsed]').length > 0) {
collapsible = collapsible.parent('[data-servercollapsed]');
}
var collapsibleControl = collapsible.find('.gs-collapsible-control[aria-expanded], .gs-collapsible-control [aria-expanded], a.gs-collapsible-control, .PTCOLLAPSE_ARROW, .PTEXPAND_ARROW').first();
var servercollapsed = collapsibleControl.attr('aria-expanded');
var isEmpty = false;
if (typeof collapsibleControl.attr('aria-expanded') === 'undefined' && collapsible.attr('data-collapsed') === 'true') {
isEmpty = collapsible.find('span[id], div[id]:not(.gs-collapsible-header), table:not([role="presentation"])').length === 0;
if (isEmpty) {
collapsible.attr('data-collapsed', 'true');
}
else {
collapsible.attr('data-collapsed', 'false');
}
}
if (collapsibleControl.length > 0 && typeof collapsible.attr('data-servercollapsed') === 'undefined') {
collapsible.attr('data-servercollapsed', 'true');
}
if (typeof collapsible.attr('data-servercollapsed') === 'undefined') return;
var id = collapsible.id || collapsible.attr('data-for');
// Check for control existence
if (typeof id === 'undefined' || collapsibleControl.length < 1) return;
// Controls exists and is collapsed, trigger event
if (isEmpty || servercollapsed === 'false') {
id = id.replace(ghPage.getWin() + 'div', '');
if (collapsibleControl.attr('id') && (collapsibleControl.hasClass('PTCOLLAPSE_ARROW') || collapsibleControl.hasClass('PTEXPAND_ARROW'))) {
id = collapsibleControl.attr('id');
}
window['submitAction_' + ghPage.getWin()](document[ghPage.getWin()], id);
}
},
/**
* linksToListview
*
* @param {jQuery} container
* @param {obj} [config]
* @param {bool} [config.inset]
* @returns {void}
*/
linksToListview: function(container, config) {
ghmob(container).each(function() {
var thisContainer = ghmob(this);
if (thisContainer.children('div[class="ui-body"]').length > 0) {
thisContainer = thisContainer.children('div[class="ui-body"]');
}
if (thisContainer.children('ul[data-transform-links]').length > 0) return;
var listview = ghmob('<ul class="gh-listview" data-transform-links="listview"></ul>');
if (typeof config !== 'undefined' && typeof config.inset !== 'undefined' && config.inset === true) {
listview.attr('data-inset', 'true');
}
thisContainer.find('a, span').each(function() {
var thisItem = ghmob(this);
if (thisItem.find('a').length > 0) {
thisItem = thisItem.find('a').first();
}
if (thisItem.parents('td[align="left"], td[align="right"]').length > 0 && thisItem.closest('tr').find('td[align="left"], td[align="right"]').length === 2) {
thisItem = ghmob(this).closest('tr');
}
if (thisItem.text().trim() === '' || thisItem.parents('.gh-container-footer, .gh-container-footer-original, .gh-hidden').length > 0 || thisItem.hasClass('gh-container-footer-original') || thisItem.hasClass('gh-hidden')) return;
var newItem = ghmob('<li></li>');
if (thisItem.is('a')) {
newItem.append('<a>' + thisItem.text().trim() + '</a>');
if (typeof thisItem.attr('onclick') !== 'undefined') {
newItem.find('a').attr('onclick', thisItem.attr('onclick'));
}
if (typeof thisItem.attr('href') !== 'undefined') {
newItem.find('a').attr('href', thisItem.attr('href'));
}
}
else {
newItem.append(thisItem.text().trim());
}
if (listview.html().indexOf(newItem.html()) > -1) return;
listview.append(newItem);
thisItem.addClass('gh-hidden').attr('aria-hidden', 'true');
});
if (listview.find('li').length === 0) return;
if (thisContainer.find('.gh-container-footer.prepend').length > 0) {
thisContainer.find('.gh-container-footer').first().after(listview);
}
else if (thisContainer.find('.gh-container-footer').not('.prepend').length > 0) {
thisContainer.find('.gh-container-footer').first().before(listview);
}
else {
thisContainer.append(listview);
}
});
},
/**
* footer
*
* @param {jQuery} container
* @param {jQuery} footers
* @param {obj} [config]
* @param {(string|array)} [config.align]
* @param {(string|array)} [config.alignItem]
* @param {bool} [config.append]
* @param {bool} [config.attach]
* @param {(string|array)} [config.color]
* @param {obj} [config.icon]
* @param {(string|array)} config.icon.className
* @param {(string|array)} [config.icon.color]
* @param {(string|array)} [config.icon.position]
* @param {bool} [config.stretch]
* @param {(string|array)} [config.text]
* @returns {void}
*/
footer: function(container, footers, config) {
if (typeof config === 'undefined') {
config = {};
}
if (typeof config.icon === 'undefined') {
config.icon = {};
}
else {
var icon = config.icon;
if (typeof config.icon.className === 'undefined') {
config.icon = {};
config.icon.className = icon;
}
}
if (typeof config.iconPosition !== 'undefined') {
config.icon.position = config.iconPosition;
}
config = ghmob.extend({
align: (typeof config.align === 'undefined') ? '' : config.align,
alignItem: (typeof config.alignItem === 'undefined') ? '' : config.alignItem,
append: (typeof config.append === 'undefined') ? true : config.append,
attach: (typeof config.attach === 'undefined') ? false : config.attach,
color: (typeof config.color === 'undefined') ? '' : config.color,
icon: {
className: (typeof config.icon.className === 'undefined') ? '' : config.icon.className,
color: (typeof config.icon.color === 'undefined') ? '' : config.icon.color,
position: (typeof config.icon.position === 'undefined') ? 'left' : config.icon.position,
},
stretch: (typeof config.stretch === 'undefined') ? false : config.stretch,
text: (typeof config.text === 'undefined') ? '' : config.text,
}, config);
ghmob(container).each(function() {
var thisContainer = ghmob(this);
if (thisContainer.hasClass('ui-collapsible')) {
thisContainer = thisContainer.find('> .ui-collapsible-content').first();
}
if (thisContainer.find('> div[class="ui-body"]').length === 1) {
thisContainer = thisContainer.find('> div[class="ui-body"]').first();
}
ghContainer.footerWrapper(thisContainer, config);
ghContainer.footerItems(thisContainer, footers, config);
});
},
/**
* getFooter
*
* @ignore
* @param {jQuery} container
* @param {obj} [config]
* @param {bool} [config.append]
* @returns {jQuery} thisFooter
*/
getFooter: function(container, config) {
var thisFooter = container.find('> .gh-container-footer');
if (config.append === false) {
thisFooter = thisFooter.filter(function() {
return (ghmob(this).hasClass('prepend'));
});
}
else {
thisFooter = thisFooter.filter(function() {
return (ghmob(this).hasClass('prepend') === false);
});
}
return thisFooter;
},
/**
* footerWrapper
*
* @ignore
* @param {jQuery} container
* @param {obj} [config]
* @param {(string|array)} [config.align]
* @param {bool} [config.append]
* @param {bool} [config.attach]
* @param {bool} [config.stretch]
* @returns {void}
*/
footerWrapper: function(container, config) {
var footer = this.getFooter(container, config);
if (footer.length > 0) return;
footer = ghmob('<div class="gh-container-footer"><ul></ul></div>');
if (config.align !== '') {
footer.addClass('align-' + config.align);
}
if (config.append === false) {
footer.addClass('prepend');
}
if (config.attach === true) {
footer.addClass('attach');
}
if (config.stretch === true) {
footer.addClass('stretch');
}
if (config.append === false) {
if (container.find('> .ui-bar').length > 0) {
container.find('> .ui-bar').after(footer);
}
else {
container.prepend(footer);
}
}
else {
container.append(footer);
}
},
/**
* footerItems
*
* @ignore
* @param {jQuery} container
* @param {jQuery} footers
* @param {obj} [config]
* @param {(string|array)} [config.alignItem]
* @param {(string|array)} [config.color]
* @param {obj} [config.icon]
* @param {(string|array)} config.icon.className
* @param {(string|array)} [config.icon.color]
* @param {(string|array)} [config.icon.position]
* @param {(string|array)} [config.text]
* @returns {void}
*/
footerItems: function(container, footers, config) {
var footer = this.getFooter(container, config);
ghmob(footers).each(function(i) {
var oldItem = ghmob(this);
var oldItemWrapper = ghmob(this);
if (oldItem.is('a[href]') === false && oldItem.is('a[onclick]') === false && oldItem.is('input') === false) {
if (oldItem.find('input[onclick], input:disabled').length > 0) {
oldItem = oldItem.find('input[onclick], input:disabled').first();
}
else {
oldItem = oldItem.find('a[href], a[onclick], a[disabled]').first();
}
}
else if (oldItem.is('input')) {
oldItemWrapper = oldItem.closest('a');
}
else {
oldItemWrapper = oldItem.closest('td, div[id]');
}
if (oldItem.length === 0) return;
if (oldItem.is('a') && oldItem.text().trim() === '' && oldItem.find('img').length > 0) {
oldItem.html(oldItem.find('img').attr('alt'));
}
oldItem.addClass('gh-hidden gh-container-footer-original').attr('aria-hidden', 'true');
if (oldItemWrapper.find(footer).length === 0) {
oldItemWrapper.addClass('gh-hidden gh-container-footer-original').attr('aria-hidden', 'true');
}
var text;
if (config.text === '') {
text = oldItem.text().trim();
if (text === '') {
text = oldItemWrapper.text().trim();
}
}
else {
text = config.text;
if (typeof config.text === 'object') {
text = config.text[i];
}
}
if (text === '' || footer.find('a:contains("' + text + '")').length > 0 || (oldItem.is('a') === false && oldItem.is('input') === false)) return;
var newItemId = 'gh-container-footer-' + Math.round(Math.random() * 10000);
var newItem = ghmob('<li><a href="" data-role="button" id="' + newItemId + '">' + text + '</a></li>');
if (typeof oldItem.attr('onclick') !== 'undefined') {
var newItemOnclick = oldItem.attr('onclick').replace('this.name', '"' + oldItem.attr('name') + '"').replace('this.id', '"' + oldItem.attr('id').replace(/\$/g, '$$$$') + '"');
newItem.find('a').attr('onclick', newItemOnclick);
}
if (typeof oldItem.attr('href') === 'undefined') {
newItem.find('a').attr('href', '#');
}
else {
var newItemHref = oldItem.attr('href');
if (newItemHref.indexOf('this.name') > -1) {
newItemHref = newItemHref.replace('this.name', '"' + oldItem.attr('name') + '"');
}
if (newItemHref.indexOf('this.id') > -1) {
newItemHref = newItemHref.replace('this.id', '"' + oldItem.attr('id').replace(/\$/g, '$$$$') + '"');
}
newItem.find('a').attr('href', newItemHref);
}
if (oldItem.is('[disabled]')) {
newItem.find('a').addClass('ui-disabled');
}
if (oldItem.attr('target')) {
newItem.find('a').attr('target', oldItem.attr('target'));
}
if (config.alignItem !== '') {
var align = config.alignItem;
if (typeof config.alignItem === 'object') {
align = config.alignItem[i];
}
newItem.addClass('align-' + align);
}
if (typeof config.icon.className !== 'undefined' && config.icon.className !== '') {
var icon = config.icon.className;
if (typeof config.icon.className === 'object') {
icon = config.icon.className[i];
}
var iconPosition = config.icon.position;
if (typeof config.icon.position === 'object') {
iconPosition = config.icon.position[i];
}
if (typeof iconPosition === 'undefined' || iconPosition === '') {
iconPosition = 'left';
}
newItem.find('a').addClass('ui-btn-icon-' + iconPosition);
newItem.find('a').addClass('fa ' + icon);
var iconColor = config.icon.color;
if (typeof config.icon.color === 'object') {
iconColor = config.icon.color[i];
}
if (iconColor !== '') {
newItem.find('a').addClass('ui-btn-icon-' + iconColor);
}
}
if (config.color !== '') {
var color = config.color;
if (typeof config.color === 'object') {
color = config.color[i];
}
newItem.find('a').addClass(color);
}
if (oldItem.hasClass('gh-tile-original')) {
footer.attr('data-tile', '').attr('data-rel', 'inline');
}
newItem.find('a').button();
footer.find('ul').append(newItem);
});
if (footer.find('li').length === 0) {
footer.remove();
}
},
/**
* onCreate
*
* @private
* @returns {void}
*/
_onCreate: function(selector) {
if (selector.length === 0 || selector.parents('.ui-panel').length > 0) return;
var tablesawTbls = selector.find('.tablesaw');
tablesawTbls.each(function() {
if (typeof ghmob(this).data().ghtables === 'undefined') return;
ghmob(this).trigger('resize');
});
ghHeader.updatePageHeadings();
var tableItems = selector.find('.ui-table, [id^="gh-table-pager-"] a, [id^="gh-table-pager-"] [role="navigation"]').filter(function() {
return (ghmob(this).closest('div[class="ui-body"], .ui-collapsible').find('.ui-collapsible-heading-toggle[id], .ui-bar[id]').first().attr('id') === selector.find('.ui-collapsible-heading-toggle[id], .ui-bar[id]').first().attr('id'));
});
ghTable._aria(tableItems);
},
/**
* _eventBindings
*
* @private
* @returns {void}
*/
_eventBindings: function() {
ghmob(document)
.off('collapsiblecreate.ghContainer create.ghContainer')
.on('collapsiblecreate.ghContainer create.ghContainer', '[data-role="collapsible"], .ui-collapsible', function(event, config) {
ghLog.event('collapsiblecreate.ghContainer create.ghContainer');
var header = ghmob(event.currentTarget).find(ghHeader.headings.join() + ', .ui-collapsible-heading').first();
ghContainer.createCollapsible(ghmob(event.currentTarget), header, config);
ghContainer._onCreate(ghmob(event.currentTarget));
});
ghmob(document)
.off('click.ghContainer.headingToggle')
.on('click.ghContainer.headingToggle', '.ui-collapsible-heading-toggle', function(event) {
ghLog.event('click.ghContainer.headingToggle');
event.preventDefault();
var collapsible = ghmob(event.currentTarget).closest('.ui-collapsible');
if (collapsible.hasClass('ui-collapsible-collapsed')) {
ghContainer.collapsibleOnExpand(collapsible);
}
else {
ghContainer.collapsibleOnCollapse(collapsible);
}
});
ghmob(document)
.off('collapsibleexpand.ghContainer expand.ghContainer')
.on('collapsibleexpand.ghContainer expand.ghContainer', '.ui-collapsible', function(event) {
ghLog.event('collapsibleexpand.ghContainer expand.ghContainer');
event.stopPropagation();
ghContainer.collapsibleOnExpand(ghmob(event.currentTarget));
});
ghmob(document)
.off('collapsiblecollapse.ghContainer collapse.ghContainer')
.on('collapsiblecollapse.ghContainer collapse.ghContainer', '.ui-collapsible', function(event) {
ghLog.event('collapsiblecollapse.ghContainer collapse.ghContainer');
event.stopPropagation();
ghContainer.collapsibleOnCollapse(ghmob(event.currentTarget));
});
ghmob(document)
.off('click.ghContainer.expandAll')
.on('click.ghContainer.expandAll', 'a[onclick*="EXPAND_ALL"], input[onclick*="EXPAND_ALL"], a[id*="EXPAND_ALL"], input[id*="EXPAND_ALL"]', function() {
ghLog.event('click.ghContainer.expandAll');
window.inactiveCollapsible = [];
});
ghmob(document)
.off('containercreate.ghContainer')
.on('containercreate.ghContainer', 'div[class="ui-body"]', function(event) {
ghLog.event('containercreate.ghContainer');
ghContainer._onCreate(ghmob(event.currentTarget));
});
ghmob(document)
.off('ajaxupdate.ghContainer')
.on('ajaxupdate.ghContainer', function() {
ghLog.event('ajaxupdate.ghContainer');
ghContainer.initializeFluid();
});
},
/**
* onPageBeforeCreate
*
* @ignore
* @returns {void}
*/
onPageBeforeCreate: function() {
if (ghConfig.container.enabled === false) return;
this._jqmCollapsibles();
},
/**
* jqmCollapsibles
*
* @private
* @returns {void}
*/
_jqmCollapsibles: function() {
ghmob.fn.collapsible = function(config) {
this.each(function() {
var $this = ghmob(this);
$this.attr('data-role', 'collapsible').trigger('collapsiblecreate', config);
});
};
},
/**
* run
*
* @ignore
* @param {jQuery} [scope]
* @returns {void}
*/
run: function(scope) {
scope = (scope) ? scope : ghmob(document);
if (ghConfig.container.enabled === false) return;
this._eventBindings();
this.initializeCollapsibles(scope);
this.initializeContainers(scope);
this._initializeOverrides(scope);
this.initializeFluid(scope);
this.initializeClassicPlus(scope);
ghUtils.delay(function() {
ghContainer.initializeFluid(scope);
ghContainer.expandActiveCollapsibles();
});
},
};
ghInit.module('ghContainer');
/**
* ghFooter
*
* @module footer
* @config includeReturnLinks [true, false]
* @config autoInitialize [true, false]
*/
var ghFooter = ghFooter || {
/**
* footerButtons
* Selectors of elements to be turned into
* footer buttons automatically
*
* @type {array}
*/
footerButtons: [
'input[id="#ICSave"]',
'input[id="#ICCancel"]:not(.psc_modal-close):not(.PSPUSHBUTTONRETURN)',
'[id="#ICSendNotify"]',
'[id$="OKAY_PB"]',
'[id$="OK_PB"]',
'[id$="CANCEL_PB"]',
'[id$="NEXT_PB"]',
'[id$="PREV_PB"]',
'[id="#ICYes"]',
'[id="#ICNo"]',
'[id$="PB_SUBMIT"]',
'[id$="LINK_STARTOVER"]',
'[id$="SUBMIT_PB"]',
'[id$="SAVE_LATER_PB"]',
'[id="' + ghPage.getWin() + 'divPSTOOLBAR"] a',
'[id*="ER_TOOLBAR"]',
],
/**
* clean
* Clean footer items
*
* @private
* @returns {void}
*/
_clean: function() {
// remove footer buttons on wrong page
if (typeof ghPage.getName() !== 'undefined') {
ghmob('#gh-footer li:not([data-gh-page-link="' + ghPage.getName() + '"])').remove();
}
ghmob('#gh-footer li[data-gh-item-link]').each(function() {
var thisItem = ghmob(this);
var itemLink = thisItem.attr('data-gh-item-link');
var itemSelector = ghmob('a[id*="' + itemLink + '"], input[id*="' + itemLink + '"]').filter(function() {
return ((ghmob(this).is('a') && ghmob(this).text().indexOf(thisItem.text().trim()) > -1) || (ghmob(this).is('input') && ghmob(this).attr('value') === thisItem.text().trim()));
});
// clean duplicate items
if (ghmob('#gh-footer li[data-gh-item-link="' + itemLink + '"]').length > 1) {
ghmob('#gh-footer li[data-gh-item-link="' + itemLink + '"]').not(thisItem).remove();
}
// check if item still exists on page
if (ghmob('[id="' + itemLink + '"], [name="' + itemLink + '"]').length === 0) {
thisItem.remove();
}
// hide duplicate buttons
if (itemSelector.length > 1) {
itemSelector.closest('div[id]').hide();
}
// remove ui-link class
thisItem.find('a').removeClass('ui-link');
});
// accessibility
ghmob('#gh-footer').attr('role', 'navigation').attr('aria-label', 'Footer');
},
/**
* isDuplicate
* Checks for a duplicate footer item
*
* @private
* @param {string} itemLink
* @returns {bool}
*/
_isDuplicate: function(itemLink) {
return (ghmob('#gh-footer li[data-gh-item-link="' + itemLink + '"]').length > 0);
},
/**
* getLocalAction
* Localizes the click action of the element
*
* @private
* @param {jQuery} item
* @param {string} action
* @returns {string}
*/
_getLocalAction: function(item, action) {
if (action.indexOf('this.id') > -1) {
return action.replace('this.id', '"' + item.attr('id').replace(/\$/g, '$$$$') + '"');
}
else if (action.indexOf('this.name') > -1) {
return action.replace('this.name', '"' + item.attr('name').replace(/\$/g, '$$$$') + '"');
}
return action;
},
/**
* getItemText
*
* @private
* @param {jQuery} item
* @returns {string}
*/
_getItemText: function(item) {
if (item.text().trim().length > 0) {
return item.text().trim();
}
else if (item.find('> img').attr('title') !== undefined) {
return item.find('> img').attr('title');
}
else if (item.attr('value') !== undefined) {
return item.attr('value');
}
return;
},
/**
* getActionableElement
* Returns an <a> or <input> within selector
*
* @private
* @param {jQuery} item
* @returns {jQuery}
*/
_getActionableElement: function(item) {
if (item.prop('nodeName') !== 'INPUT' && item.find('input').length) {
return item.find('input').first();
}
else if (item.prop('nodeName') !== 'A' && item.find('a').length) {
return item.find('a').first();
}
return item;
},
/**
* itemIsDisabled
* Check if item is disabled
*
* @private
* @param {jQuery} item
* @returns {bool}
*/
_itemIsDisabled: function(item) {
return (item.attr('disabled') === 'disabled' || item.hasClass('ui-disabled') || item.hasClass('PSPUSHBUTTONDISABLED') || item.parents('[disabled="disabled"], .ui-disabled, .PSPUSHBUTTONDISABLED').length > 0);
},
/**
* hideContainer
*
* @private
* @param {jQuery} item
* @returns {void}
*/
_hideContainer: function(item) {
item.hide();
item.closest('a[id^="Left"], a.Left, div[id$="div' + item.attr('id') + '"]').hide();
var itemParentButton = item.parents('.ui-btn').last();
if (itemParentButton.length > 0) {
itemParentButton.hide();
ghLog.info('ghFooter: Hiding item parent button.', itemParentButton);
}
},
/**
* buildItem
*
* @private
* @param {jQuery} item
* @param {obj} config
* @returns {jQuery}
*/
_buildItem: function(item, config) {
var newItem = ghmob('<a class="gh-footer-item"></a>');
var newItemSpan = ghmob('<span></span>');
var itemText;
// check if <a>
if (item.prop('nodeName') === 'A') {
// return if item has no actions
if (item.attr('href') === undefined && item.attr('onclick') === undefined) {
return null;
}
// add actions to newItem
if (item.attr('href') !== undefined && item.attr('href') !== null && item.attr('href') !== '' && item.attr('href') !== '#' && item.attr('href') !== 'javascript:void(0);') {
newItem.attr('href', this._getLocalAction(item, item.attr('href')));
}
else {
newItem.attr('onclick', this._getLocalAction(item, item.attr('onclick')));
}
// check target attribute
if (item.attr('target')) {
newItem.attr('target', item.attr('target'));
}
}
else if (item.prop('nodeName') === 'INPUT') {
// return if item has no actions
if (item.attr('onclick') === undefined) {
return null;
}
// add actions to newItem
newItem.attr('onclick', this._getLocalAction(item, item.attr('onclick')));
}
if (typeof newItem.attr('href') === 'undefined') {
newItem.attr('href', '#');
}
// get item text
if (config !== undefined && config.text !== undefined) {
itemText = config.text;
}
else {
itemText = this._getItemText(item);
}
// kill process if empty item
if (itemText === null || itemText === undefined || itemText === '') return;
// add text to item span
newItemSpan.html(itemText);
// add icon to newItem
if (config !== undefined && config.icon !== undefined) {
newItem.addClass('gh-footer-icon').prepend('<i class="fa fa-' + config.icon + '"></i>');
}
// check if item is disabled
if (this._itemIsDisabled(item)) {
newItem.addClass('gh-footer-disabled');
newItem.attr('aria-disabled', true);
}
// return item
return newItem.append(newItemSpan);
},
/**
* create
*
* @private
* @deprecates ghFooter.createFooter
* @returns {void}
*/
_create: function() {
if (ghmob('#gh-footer').length > 0) return;
var footerParent = ghmob('#ACE_width, div[id$="divPSPAGECONTAINER"], .ps_pspagecontainer, .ps_pagecontainer').first();
if (footerParent.length === 0) {
footerParent = ghmob('div[id$="PAGECONTAINER"], .PSForm, .ui-content[role="main"]').first();
}
if (footerParent.children('.gh-submenu-cols-wrap').length > 0) {
footerParent = footerParent.children('.gh-submenu-cols-wrap');
}
ghmob('<div id="gh-footer" class="gh-footer"><ul></ul></div>').appendTo(footerParent);
},
/**
* remove
*
* @returns {void}
*/
remove: function() {
ghmob('#gh-footer').remove();
},
/**
* addItem
*
* @deprecates appendFooterBtn, ghFooter.appendFooterBtn
* @param {jQuery} item
* @param {obj} [config]
* @param {string} [config.icon]
* @param {string} [config.text]
* @param {bool} [config.prepend]
* @param {bool} [config.requireContext]
* @returns {bool}
*/
addItem: function(item, config) {
config = config ? config : {};
// create footer if it doesn't exist
if (ghmob('#gh-footer').length === 0) {
this._create();
}
if (ghmob('#gh-footer > ul').length === 0) {
ghmob('#gh-footer').append('<ul></ul>');
}
// ensure jquery object
item = ghUtils.jqElem(item).first();
// get actionable element
item = this._getActionableElement(item);
// check if item exists
if (!item.length || (ghmob(document).find(item).length === 0 && config.requireContext !== false) || !(item.jquery)) return false;
// hide item jqm container
this._hideContainer(item);
// get item link
var itemLink = (item.attr('id')) ? item.attr('id') : item.attr('name');
if (itemLink === null || itemLink === undefined) {
itemLink = ghUtils.hash(item[0].outerHTML);
}
// check if duplicate item
if (this._isDuplicate(itemLink)) {
// remove old item from footer
ghmob('#gh-footer li[data-gh-item-link="' + itemLink + '"]').remove();
}
// build container
var itemContainer = ghmob('<li></li>');
itemContainer.attr('data-gh-page-link', ghPage.getName());
itemContainer.attr('data-gh-item-link', itemLink);
// get built footer item
var newItem = this._buildItem(item, config);
// kill process if no item
if (newItem === null || newItem === undefined) return false;
// Check for items with the same text
var duplicateTextItems = ghmob('#gh-footer li[data-gh-page-link="' + ghPage.getName() + '"]').filter(function() {
return ghmob(this).text().trim() === newItem.text().trim();
});
if (duplicateTextItems.length > 0) return false;
// add item to container
itemContainer.append(newItem);
// add container to footer
if (config !== undefined && config.prepend === true) {
ghmob('#gh-footer > ul').prepend(itemContainer);
}
else {
ghmob('#gh-footer > ul').append(itemContainer);
}
return true;
},
/**
* footerInit
*
* @private
* @return {void}
*/
_footerInit: function() {
ghmob('.gh-footer-field').each(function() {
ghFooter.addItem(ghmob(this));
});
if (ghConfig.footer.autoInitialize === false || ghPage.isIFrameModal()) return;
var footerButtons = ghmob(this.footerButtons.join()).filter(function() {
return (ghmob(this).parents('.psc_hidden, .ps_box-msgactions, .ps_box-grid-header_bar').length === 0 && (ghmob(this).parents('[id="' + ghPage.getWin() + 'divPSTOOLBAR"]').length === 0 || (ghmob(this).parents('[id="' + ghPage.getWin() + 'divPSTOOLBAR"]').length > 0 && ghmob(this).text().indexOf('Return') === -1)));
});
footerButtons.each(function() {
ghFooter.addItem(ghmob(this));
});
},
/**
* run
*
* @ignore
* @param {jQuery} scope
* @return {void}
*/
run: function(scope) {
scope = (scope) ? scope : document;
if (ghPage.isIFrameTemplate()) return;
if (ghmob('#gh-footer').length === 0) {
this._create();
if (ghPage.isTargetContent()) {
ghUtils.getWinTop().ghFooter._create();
}
}
this._footerInit(scope);
if (ghPage.isTargetContent()) {
ghUtils.getWinTop().ghFooter._footerInit();
}
this._clean();
if (ghPage.isTargetContent()) {
ghUtils.getWinTop().ghFooter._clean();
}
},
};
ghInit.module('ghFooter');
/**
* ghIcons
* Provides methods for interacting with PS icons
*
* @module icons
* @config enabled [true, false]
* @config autoInitialize [true, false]
* @config inlineAltText [true, false]
* @config textOnly [true, false]
* @config hideLegends [true, false]
*/
var ghIcons = ghIcons || {
/**
* iconMap
* Map of all the default icon replacements
*
* @type {obj}
*/
iconMap: {
'APPROVE_ICN': {
icon: 'fa fa-check success',
text: 'Approved',
},
'SUCCESS_ICN': {
icon: 'fa fa-check-circle-o success',
text: 'Enrolled',
},
'PENDING_ICN': {
icon: 'fa fa-clock-o warning',
text: 'Pending',
},
'NOTROUTED_ICN': {
icon: 'fa fa-pause-circle-o',
text: 'On Hold',
},
'REVIEWER_ICN': {
icon: 'fa fa-eye info',
text: 'Information Request',
},
'DROPPED_ICN': {
icon: 'fa fa-times-circle-o danger',
text: 'Dropped',
},
'WAITLIST_ICN': {
icon: 'fa fa-clock-o warning',
text: 'Waitlist',
},
'CLOSED_ICN': {
icon: 'fa fa-times-circle-o danger',
text: 'Closed',
},
'ERROR_ICN': {
icon: 'fa fa-times-circle-o danger',
text: 'Error',
},
'ERROR_IMG': {
icon: 'fa fa-warning warning',
text: 'Warning',
},
'OPEN_ICN': {
icon: 'fa fa-check-circle-o success',
text: 'Open',
},
'TAKEN_ICN': {
icon: 'fa fa-check-square-o info',
text: 'Taken',
},
'TRANSFERRED_ICN': {
icon: 'fa fa-reply warning',
text: 'Transferred',
},
'ENROLLED_ICN': {
icon: 'fa fa-history success',
text: 'Enrolled',
},
'PLANNED_ICN': {
icon: 'fa fa-star warning',
text: 'Planned',
},
'magnifying-glass': {
icon: 'fa fa-search info',
text: 'Lookup',
},
'PT_PROMPT_LOOKUP': {
icon: 'fa fa-search',
text: 'Lookup',
},
'PT_LOOKUP_PROMPT': {
icon: 'fa fa-search',
text: 'Lookup',
},
'MESSAGE_WARNING_ICN': {
icon: 'fa fa-warning warning',
text: 'Warning',
},
'WARNING_ICN': {
icon: 'fa fa-warning warning',
text: 'Warning',
},
'PT_LOGIN_ERROR': {
icon: 'fa fa-warning danger',
text: 'Error',
},
'MESSAGE_CONFIRM_ICN': {
icon: 'fa fa-check success',
text: 'Confirm',
},
'DELETE_QUESTION_IMG': {
icon: 'fa fa-question',
text: 'Confirm',
},
'MESSAGE_INFO_ICN': {
icon: 'fa fa-info-circle info',
text: 'Information',
},
'INFO_MSG': {
icon: 'fa fa-info-circle info',
text: 'Information',
},
'PS_CS_MESSAGE_ALERT_ICN_1': {
icon: 'fa fa-warning warning',
text: 'Alert',
},
'PS_RED_STAR_ICN_1': {
icon: 'fa fa-star warning',
text: '',
},
'PS_DENY_ICN_1': {
icon: 'fa fa-ban danger',
text: 'Deny',
},
'ENDCONNECT': {
icon: 'fa fa-ellipsis-h',
text: 'More',
},
'CLASS_ROSTER_ICN': {
icon: 'fa fa-users',
text: 'Class Roster',
},
'TRANING_REQUEST_ICN': {
icon: 'fa fa-clipboard',
},
'LEARNING_MANAGEMENT_ICN': {
icon: 'fa fa-desktop',
text: 'Learning Management',
},
'APPLICANT_ACTIVITY_ICN': {
icon: 'fa fa-photo',
text: 'Photo',
},
'ACADEMIC_DEADLINES_ICN': {
icon: 'fa fa-calendar',
text: 'Deadlines',
},
'GRADE_ROSTER_ICN': {
icon: 'fa fa-book',
},
'VALIDATE_ICN': {
icon: 'fa fa-pencil-square-o',
text: 'Assignments',
},
'VIEW_ICN': {
icon: 'fa fa-search',
text: 'View',
},
'OVERTIME_LIMIT_ICN': {
icon: 'fa fa-exclamation-triangle warning',
text: 'Exception',
},
'COMMENTS_NONE_ICN': {
icon: 'fa fa-comment-o',
text: 'Add Comments',
},
'PS_STATUS_ALERT_ICN': {
icon: 'fa fa-warning danger',
text: 'Error',
},
'PAST_DUE_ALERT_ICN': {
icon: 'fa fa-exclamation-triangle danger',
text: 'Warning',
},
'NOTSTARTED': {
icon: 'fa fa-circle-o info',
text: 'Not Started',
},
'INPROGRESS': {
icon: 'fa fa-adjust success',
text: 'In Progress',
},
'EXPAND_ICN': {
icon: 'fa fa-plus-square info',
text: 'Expand',
},
'COLLAPSE_ICN': {
icon: 'fa fa-minus-square info',
text: 'Collapse',
},
'PS_LOCK_ICN_1': {
icon: 'fa fa-lock warning',
text: 'Locked',
},
'PS_STATUS_CIRCLE_ICN_1': {
icon: 'fa fa-circle warning',
text: 'Changes Made',
},
'CONFIRM_CHECK': {
icon: 'fa fa-check success',
text: 'Confirm',
},
'PS_PREFERRED_FLG': {
icon: 'fa fa-check success',
text: 'Preferred',
},
'PS_CHECKED_ICN': {
icon: 'fa fa-check success',
text: 'Preferred',
},
'INFO_ICN': {
icon: 'fa fa-info-circle info',
text: 'Info',
},
'PRIVACY_ICN': {
icon: 'fa fa-flag',
text: 'Flagged',
},
'REFRESH_ICN': {
icon: 'fa fa-refresh success',
text: 'Refresh',
},
'CLEAR': {
icon: 'fa fa-refresh success',
text: 'Clear',
},
'FILTER': {
icon: 'fa fa-filter',
text: 'Filter',
},
'INFO': {
icon: 'fa fa-info-circle',
text: 'Instructions',
},
'EDIT': {
icon: 'fa fa-pencil',
text: 'Edit',
},
'SORT': {
icon: 'fa fa-sort',
text: 'Sort',
},
'FIND': {
icon: 'fa fa-search',
text: 'Search',
},
'PRINT': {
icon: 'fa fa-print',
text: 'Print',
},
'CHART_ICN': {
icon: 'fa fa-bar-chart',
text: 'Analytics',
},
'HIERARCHY': {
icon: 'fa fa-sitemap',
text: 'Select Expense Type',
},
'REPORT_DIST': {
icon: 'fa fa-user-plus',
text: 'User Defaults',
},
'DELETE_ICN': {
icon: 'fa fa-trash-o danger',
text: 'Delete',
},
'PT_SPELLCHECK': {
icon: 'fa fa-check-square-o',
text: 'Spellcheck',
},
'STOPSIGN': {
icon: 'fa fa-exclamation-circle danger',
text: 'Stop',
},
'APPROVAL_FLOW': {
icon: 'fa fa-tasks info',
text: 'View Approval Flow',
},
'EDIT_ICN': {
icon: 'fa fa-pencil info',
text: 'Update',
},
'COMMENTS_ICN': {
icon: 'fa fa-comment-o info',
text: 'Comments',
},
'COMMENT_ICN': {
icon: 'fa fa-comment-o info',
text: 'Comments',
},
'CANCEL_ICN': {
icon: 'fa fa-times danger',
text: 'Cancel',
},
'DETAIL_ICN': {
icon: 'fa fa-search info',
text: 'View Details',
},
'PT_HELP': {
icon: 'fa fa-question-circle',
text: '',
},
'APPR_INFO': {
icon: 'fa fa-info-circle info',
text: '',
},
'_FAVORITE_GRAY_': {
icon: 'fa fa-star-o',
text: 'Add to Favorites',
},
'_FAVORITE_COLOR_': {
icon: 'fa fa-star warning',
text: 'Remove from Favorites',
},
'PS_APPROVE_ICN': {
icon: 'fa fa-check success',
text: 'Success',
},
'PS_GET_DETAILS_ICN': {
icon: 'fa fa-search info',
text: 'Get Details',
},
'RECEIPT_ICN' : {
icon: 'fa fa-list info',
text: 'Receipt',
},
},
/**
* replaceIcon
* Replace a PeopleSoft icon with a custom icon
*
* @deprecates replacePSIcon, ghUtils.replaceIcon
* @param {string} imgSrc URL of image to replace
* @param {string} newIcon FontAwesome icon identifier
* @param {string} [altText] Alternate text for icon
* @param {jQuery} [scope]
* @returns {void}
*/
replaceIcon: function(imgSrc, newIcon, altText, scope) {
scope = (scope) ? scope : ghmob(document);
var img = ghmob('img[src*="' + imgSrc + '"]:not(.gh-hidden)', scope);
ghmob(img).addClass('gh-hidden').attr('aria-hidden', 'true').each(function() {
if ((typeof altText === 'undefined' || altText === '') && typeof ghmob(this).attr('alt') !== 'undefined') {
altText = ghmob(this).attr('alt');
}
ghIcons._create(ghmob(this), { icon: newIcon, src: imgSrc, text: altText });
});
},
/**
* create
*
* @private
* @param {jQuery} oldItem
* @param {obj} [config]
* @returns {void}
*/
_create: function(oldItem, config) {
var newItem;
if (typeof config === 'undefined') {
config = {};
}
config = ghmob.extend({
icon: (typeof config.icon === 'undefined') ? '' : config.icon,
src: (typeof config.src === 'undefined') ? '' : config.src,
text: (typeof config.text === 'undefined') ? '' : config.text,
}, config);
if (typeof oldItem.attr('data-gh-replace') === 'undefined' && config.src !== '') {
oldItem.before('<span data-gh-replace="' + config.src + '"></span>');
newItem = oldItem.prev('[data-gh-replace]');
}
else {
if (typeof oldItem.attr('class') !== 'undefined') {
config.icon = oldItem.attr('class');
}
if (typeof oldItem.attr('data-gh-replace') !== 'undefined') {
config.src = oldItem.attr('data-gh-replace');
}
if (oldItem.next('.sr-only').length > 0) {
config.text = oldItem.next('.sr-only').text().trim();
}
else if (oldItem.text().trim() !== '') {
config.text = oldItem.text().trim();
}
newItem = oldItem;
}
if (config.icon.indexOf('fa-') > -1 && config.icon.indexOf('fa ') === -1) {
config.icon = 'fa ' + config.icon;
}
if (config.icon.indexOf('init') === -1) {
config.icon = 'init ' + config.icon;
}
if (config.icon !== '' && config.text !== '' && ghConfig.icons.inlineAltText === true) {
// change icon and add inline alt text
newItem.attr('class', config.icon).attr('aria-hidden', 'true').html('<span class="gh-accessible">' + config.text + '</span>');
}
else if (config.text !== '' && ghConfig.icons.textOnly === true) {
// remove icon and add inline alt text
newItem.removeAttr('class').removeAttr('aria-hidden').html(config.text);
}
else if (config.icon !== '' && config.text !== '' && config.src !== '' && newItem.parents('.legend').length === 0) {
// change icon with screen ready only alt text
newItem.attr('class', config.icon).attr('aria-hidden', 'true');
var srText = newItem.next('.sr-only');
if (srText.length === 0) {
newItem.after('<span class="sr-only">' + config.text + '</span>');
srText = newItem.next('.sr-only');
}
if (typeof srText.attr('id') === 'undefined') {
srText.attr('id', 'gh-replace-' + config.src + '-' + (ghmob('[id^="gh-replace-"].sr-only').length + 1));
}
ghIcons._accessibleLabel(srText.closest('a'));
}
else if (config.icon !== '') {
// change icon without alt text
newItem.attr('class', config.icon).attr('aria-hidden', 'true');
}
},
/**
* accessibleLabel
*
* @private
* @param {jQuery} selector
* @returns {void}
*/
_accessibleLabel: function(selector) {
if (selector.length === 0 || selector.parents('.ui-table').length === 0 || typeof selector.attr('id') === 'undefined' || selector.text().trim() === '') return;
var ariaRow = selector.closest('tr');
var ariaLabelledBy = ariaRow.find('a[id], span[id]:not(.sr-only)').filter(function() {
return (ghmob(this).children('a[id], span[id]').length === 0 && ghmob(this).find('[id="' + selector.attr('id') + '"]').length === 0 && ghmob(this).text().trim() !== '');
});
var ariaLabel = selector.text().trim() + ' Row ' + (ariaRow.index() + 1);
if (ariaLabelledBy.length === 0) {
selector.attr('aria-label', ariaLabel);
}
else {
selector.attr('aria-labelledby', selector.attr('id') + ' ' + ghmob(ariaLabelledBy[0]).attr('id'));
}
var tableHd = selector.closest('.ui-table').find('> thead > tr > th:eq(' + selector.closest('td').index() + ')');
if (tableHd.text().trim() === '') {
tableHd.append('<span class="sr-only">' + selector.text().trim() + '</span>');
}
},
/**
* overrideIcon
* Overrides a default icon configuration
* You can use this on a page addon level
*
* @param {string} imgSrc URL of image to override
* @param {string} newIcon FontAwesome icon identifier
* @param {string} [altText] Alternate text for icon
* @returns {void}
*/
overrideIcon: function(imgSrc, newIcon, altText) {
if (!imgSrc || !newIcon) return;
// fix altText if none given
altText = (altText) ? altText : '';
// add override to map
this.iconMap[imgSrc] = {
icon: newIcon,
text: altText,
};
},
/**
* replaceDefaultIcons
*
* @private
* @param {jQuery} scope
* @returns {void}
*/
_replaceDefaultIcons: function(scope) {
for (var icon in this.iconMap) {
ghIcons.replaceIcon(icon, this.iconMap[icon].icon, this.iconMap[icon].text, scope);
}
},
/**
* init
*
* @private
* @param {jQuery} scope
* @return {void}
*/
_init: function(scope) {
if (ghConfig.icons.autoInitialize === false) return;
var icons = ghmob('[data-gh-replace]:not(.init)', scope);
ghmob(icons).each(function() {
ghIcons._create(ghmob(this));
});
},
/**
* run
*
* @ignore
* @param {jQuery} [scope]
* @returns {void}
*/
run: function(scope) {
scope = (scope) ? scope : ghmob(document);
if (ghConfig.icons.enabled === false) return;
this._init(scope);
this._replaceDefaultIcons(scope);
},
};
ghInit.module('ghIcons');
/**
* ghModal
* Provides customization to the default PeopleSoft
* modal dialogs and JQMobile popup dialogs to ensure
* compatibility and a standardized look and feel.
*
* @module modal
* @config enabled [true, false]
* @config transition [none, pop, fade, flip, turn, flow, slide, slidefade, slideup, slidedown]
* @config defaultPopupTitle ['Popup']
* @config openLinkInNewWindow [true, false]
* @config hideErrorCode [true, false]
*
* @trigger ghModalOpen
* @trigger ghModalClose
*/
var ghModal = ghModal || {
/**
* isDoubleTrigger
* Catches a double trigger from happening because
* of a caught event and a dom event sending off
* a modal state trigger.
*
* @private
* @type {bool}
*/
_isDoubleTrigger: false,
/**
* messageQueue
* Holds messages queued for display
*
* @private
* @type {array}
*/
_messageQueue: [],
/**
* getNonActiveModals
*
* @private
* @returns {jQuery} non-active modals
*/
_getNonActiveModals: function() {
return ghmob('#pt_modals > div[id^="ptMod_"]:hidden', ghUtils.getPSTop().document).add('.ui-popup-hidden');
},
/**
* batchDocumentConfigurationClasses
* Add modal configuration classes to document
*
* @private
* @returns {bool}
*/
_batchDocumentConfigurationClasses: function() {
// Add is-modal flag to modal body
if (ghPage.isIFrameModal()) {
ghmob('body').addClass('is-modal');
}
// set jqm transitions
ghmob('.ui-popup').popup({
positionTo: 'window',
transition: ghConfig.modal.transition,
});
ghmob('.ui-popup').not('[data-id="gh-actionsheet-popup"]').popup('close');
ghmob('#mobile_popup, .ui-dialog .ui-dialog-contain').addClass(ghConfig.modal.transition);
ghmob(document).on('click', '[aria-haspopup="true"]', function() {
window.scrollTo(0, ghmob(window).scrollTop());
});
return true;
},
/**
* batchFluidConfiguration
* Configures modal DOM code for fluid
*
* @private
* @returns {void}
*/
_batchFluidConfiguration: function() {
if (ghPage.isFluid() === false) return;
this._forceFluidModalHeader();
this._forceFluidModalCloseBtn();
// container
ghmob('.ps_modal_controller').addClass('PSMODAL');
ghmob('.ps_modal_container').not('.ps_popup-menu').addClass('PSMODALTABLE');
// header
ghmob('.ps_modal_header').addClass('PSMODALHEADER');
// header
ghmob('.ps_modal_title').addClass('PTPOPUP_TITLE');
// content
ghmob('.ps_modal_content').addClass('PSMODALCONTENT');
// close button
ghmob('.ps_modal_close').addClass('PSMODALCLOSE');
},
/**
* batchAccessibilityHooks
*
* @private
* @param {bool} modalOpen
* @returns {void}
*/
_batchAccessibilityHooks: function(modalOpen) {
if (ghConfig.accessibility.enabled === false) return;
// Set Aria status
if (modalOpen) {
ghAccessibility.showAriaComponent(ghmob('.ui-page'));
ghAccessibility.showAriaComponent(ghModal.getActiveModal());
if (ghmob('.ui-popup-active, [role="dialog"][class*="mbsc-"]').length > 0) {
var pageFocusable = ghmob(':focusable:visible').not('[tabindex="-1"], .nuilp').filter(function() {
return (ghmob(this).parents('#pt_modals, .ui-popup, [role="dialog"][class*="mbsc-"]').length === 0 && ghmob(this).is(ghmob('#pt_modals, .ui-popup, [role="dialog"][class*="mbsc-"]').parents()) === false);
});
pageFocusable.attr('tabindex', '-1');
}
if (ghPage.isIFrame()) {
var templateFocusable = ghmob(':focusable:visible', ghUtils.getWinTop().document).not('[tabindex="-1"], .nuilp').filter(function() {
return (ghmob(this).is('iframe[id="' + window.frameElement.id + '"]') === false && ghmob(this).is(ghmob('iframe[id="' + window.frameElement.id + '"]').parents()) === false && ghmob(this).parents('#pt_modals, .ui-popup').length === 0 && ghmob(this).is(ghmob('#pt_modals, .ui-popup').parents()) === false);
});
templateFocusable.attr('tabindex', '-1');
ghAccessibility.hideAriaComponent(ghmob('.gh-submenu-cols', ghUtils.getWinTop().document));
}
}
else {
ghAccessibility.showAriaComponent(ghmob('.ui-page'));
ghAccessibility.hideAriaComponent(ghModal._getNonActiveModals());
ghAccessibility.showAriaComponent(ghmob('.gh-submenu-cols', ghUtils.getWinTop().document));
ghAccessibility.setTabIndexes();
if (ghPage.isIFrame()) {
ghUtils.getWinTop().ghAccessibility.setTabIndexes();
}
}
},
/**
* processActionSheets
*
* @private
* @returns {void}
*/
_processActionSheets: function() {
// add ui-popup class
ghmob('.ui-actionsheet-content').addClass('ui-popup gh-actionsheet');
},
/**
* setPSModalClose
*
* @private
* @returns {void}
*/
_setPSModalClose: function() {
if (window['original_doCloseModal'] === undefined) {
window['original_doCloseModal'] = window['doCloseModal'];
}
window['doCloseModal'] = function(obj) {
ghModal.triggerModalClose();
ghmob('[id="ptMod_' + obj + '"] .PSMODALTABLE', ghModal._getAnchorWindow().document).removeClass('in ui-popup-active').addClass('out reverse ui-popup-hidden');
ghUtils.delay(function() {
return window['original_doCloseModal'](obj);
}, 100);
};
},
/**
* resizeModalFrame
*
* @private
* @returns {void}
*/
_resizeModalFrame: function() {
var activeModal = ghModal.getActiveModal();
if (activeModal === false) return;
if (activeModal && !activeModal.find('iframe').length) return;
var iframeHeight = (activeModal.find('iframe').contents().height() - 42) + 'px !important;';
var modalContainerStyles = activeModal.find('.ps_modal_container').attr('style');
activeModal.find('.ps_modal_container').attr('style', modalContainerStyles + ' height: ' + iframeHeight);
activeModal.find('iframe').contents().find('.ui-panel-content-wrap').css('padding-bottom', 0);
},
/**
* storeFluidModalIdentifier
* Clone fluid action modal so it has a reference
*
* @private
* @returns {void}
*/
_storeFluidModalIdentifier: function() {
if (!ghPage.isFluid()) return;
ghmob('.ps_box-menu').each(function() {
ghmob('body').append(ghmob(this).clone());
});
},
/**
* wrapGridInitTryCatchFluid
*
* @private
* @param {string} [functionName=gridInit]
* @returns {void}
*/
_wrapFluidGridInitTryCatch: function(functionName) {
if (!ghPage.isFluid()) return;
functionName = (functionName) ? functionName : 'gridInit';
var wrapFunction = window[functionName];
var wrapFunctionString = wrapFunction.toString();
var wrapFunctionBody = wrapFunctionString.slice(wrapFunctionString.indexOf('{') + 1, wrapFunctionString.lastIndexOf('}'));
wrapFunctionBody = 'try{' + wrapFunctionBody + '} catch(ex) { return; }';
window[functionName] = Function('id', wrapFunctionBody);
},
/**
* getAnchorWindow
*
* @private
* @returns {obj}
*/
_getAnchorWindow: function() {
return MTop();
},
/**
* getModalTargetId
* Target ID of current modal
*
* @returns {string} modal ptMod_[x] ID
*/
getModalTargetId: function() {
return ghmob('#pt_modals > div[id^="ptMod_"]', ghUtils.getPSTop().document).length ? ghmob('#pt_modals > div[id^="ptMod_"]', ghUtils.getPSTop().document).attr('id').split('_')[1] : null;
},
/**
* isModalOpen
*
* @param {bool} ignorePSModals
* @returns {bool}
*/
isModalOpen: function(ignorePSModals) {
if (ghPage.isIFrameModal() && ignorePSModals !== true) return true;
if (ghmob('#pt_modals > div[id^="ptMod_"]', ghUtils.getPSTop().document).length) return true;
if (ghmob('.ui-popup-active, div[data-tile-status="active"]').length) return true;
// no modals open
return false;
},
/**
* getActiveModal
*
* @returns {(jQuery|bool)} active modal
*/
getActiveModal: function() {
var activeModal = ghUtils.getPSTop().document.querySelectorAll('#pt_modals > div[id^="ptMod_"]');
var activePopup = document.querySelectorAll('.ui-popup-active .ui-popup:not([id^="ptMod"])');
if (activeModal.length > 0 && activePopup.length === 0) {
return ghmob(activeModal);
}
else if (activePopup.length > 0) {
return ghmob(activePopup).first();
}
return false;
},
/**
* getLastActiveModal
*
* @ignore
* @returns {jQuery}
*/
getLastActiveModal: function() {
return ghModal.getActiveModal()[ghModal.getActiveModal().length - 1];
},
/**
* forceCloseButton
*
* @ignore
* @param {(jQuery|string)} elem
* @returns {void}
*/
forceCloseButton: function(elem) {
if (elem.find('.ui-popup-close').length > 0) return;
if (elem.find('.ui-header').length > 0) {
elem = elem.find('.ui-header').first();
}
// prepend close button to container
elem.prepend('<a href="#" data-rel="back" class="ui-link ui-popup-close"><span class="fa fa-close" aria-hidden="true"></span><span>Close</span></a>');
},
/**
* buildActionSheet
*
* @ignore
* @param {(jQuery|string)} row
* @param {string} [title=Popup]
* @returns {void}
*/
buildActionSheet: function(row, title) {
var $row = ghUtils.jqElem(row);
title = (title) ? title : ghConfig.modal.defaultPopupTitle;
// create a div for the popup
var $popup = ghmob('<div/>');
$popup.popup({
dismissible : true,
theme: 'c',
overlayTheme: 'c',
id: 'gh-actionsheet-popup',
transition: ghConfig.modal.transition,
positionTo: 'window',
});
$popup.trigger('create').popup('open');
var actionsheet = ghmob('.ui-popup-active > [data-id="gh-actionsheet-popup"]');
actionsheet.append('<div class="ui-header"><h2 class="ui-title">' + title + '</h2></div>');
actionsheet.append('<div class="actions ui-content">' + $row.find('span.actions').html() + '</div>');
actionsheet.find('a[onclick="javascript:cancelBubble(event);"]').removeAttr('onclick');
actionsheet.find('a').addClass('ui-btn-inline').button();
this.forceCloseButton(actionsheet);
},
/**
* closeActionSheetPopup
*
* @ignore
* @param {jQuery} selector
* @returns {void}
*/
closeActionSheetPopup: function(selector) {
ghUtils.delay(function() {
ghmob(selector).closest('.ui-popup').popup('close');
}, 250);
},
/**
* overrideDoPortalUrl
*
* @private
* @returns {void}
*/
_overrideDoPortalUrl: function() {
window.DoPortalUrl = function(sUrl) {
if (window.isPortalUrl(sUrl) && !window.isPortalHomagPageUrl(sUrl) && !window.isRelativeUrl(sUrl)) {
if (window.isHostWinPortal(sUrl, top)) {
var sReturnUrl = window.convToHostURI(sUrl, top);
window.__ghPopupURL = sReturnUrl;
return sReturnUrl;
}
window.__ghPopupURL = sUrl;
return sUrl;
}
window.__ghPopupURL = sUrl;
return sUrl;
};
},
/**
* newWindowPopup
*
* @ignore
* @param {string} url
* @param {...obj} args
* @returns {(function|null)}
*/
newWindowPopup: function(url) {
url = (url) ? url : window.__ghPopupURL;
var fakeWindow = {
location: null,
moveTo: function() {
return;
},
resizeTo: function() {
return;
},
focus: function() {
return;
},
};
if (ghConfig.modal.openLinkInNewWindow === false || ghConfig.core.isKurogoApp === true) {
ghUtils.delay(function() {
ghLoader.show();
});
window.location = url;
return fakeWindow;
}
// check if external url redirect
if (url.indexOf('/e/?url=') > -1) {
try {
var realUrl = /\/e\/\?url=([\w.%]+)$/g.exec(url)[1];
url = unescape(realUrl);
}
catch (ex) {
ghLog.error('ghModal: Couldn\'t parse external URL from popup URL', ex);
}
}
var allow = {
title: 'Allow',
url: {
href: url,
target: '_blank',
},
};
var block = {
title: 'Block',
};
var title = 'Warning';
var message = 'This site is trying to open a new window';
if (ghPage.isIFrame() && ghPage.isTargetContent() !== true) {
ghUtils.getWinTop().ghModal.popup(title, message, allow, block);
}
else {
this.popup(title, message, allow, block);
}
return fakeWindow;
},
/**
* popup
* Creates a new popup
*
* @param {string} [title]
* @param {(string|jQuery)} message
* @param {...obj} buttons
* @param {string} buttons.title
* @param {function} buttons.action
* @param {string} buttons.class
* @returns {bool}
*/
popup: function(title, message) {
// ensure there is popup text
if (message === undefined || message === null) return false;
// show/hide error code based on config
if (ghConfig.modal.hideErrorCode && typeof message === 'string') {
message = message.replace(/(\([0-9]+[,][0-9]+\))/g, '');
}
// queue if a popup is currently open
if (ghmob('.ui-popup-active').length > 0) {
this._messageQueue.push(arguments);
return;
}
// ensure close buttons bool
var closeButton = (closeButton) ? closeButton : false;
// ensure there is a title
title = (title) ? title : ghConfig.modal.defaultPopupTitle;
// create a div for the popup
var $popup = ghmob('<div/>');
$popup.popup({
dismissible : true,
theme: 'c',
overlayTheme: 'c',
id: 'gh-actionsheet-popup',
transition: ghConfig.modal.transition,
positionTo: 'window',
});
// create popup
$popup.trigger('create').popup('open');
var popup = ghmob('.ui-popup-active > [data-id="gh-actionsheet-popup"]');
// create title
popup.append('<div class="ui-header" tabindex="-1"><h2 class="ui-title">' + title + '</h2></div>');
var popupMessageContainer = ghmob('<div class="gh-popup-message-container"></div>');
// create message
var popupMessage = ghmob('<div class="gh-popup-message"></div>');
popupMessage.append(message);
popupMessageContainer.append(popupMessage);
this._setParentWin();
// create buttons
popupMessage.find('.ps_box-msgactions a').each(function() {
ghContainer.footer(ghmob(this).closest('.ps_box-msgactions'), ghmob(this));
});
if (arguments.length > 2) {
for (var i = 2; i < arguments.length; i++) {
var button = arguments[i];
if (button === null) break;
// create button
var thisButton = ghmob('<a href="#" class="gh-popup-button ' + button.class + ' gh-pop-button-' + i + '">' + button.title + '</a>');
if (button.url !== undefined) {
thisButton.attr('href', button.url.href);
if (button.url.target !== undefined) {
thisButton.attr('target', button.url.target);
}
}
thisButton.data('buttonParams', button);
thisButton.off('click').on('click', function(event) {
// accessibility
var isKeyPress = event.type === 'keypress',
isReturn = isKeyPress && event.which === 13;
if (typeof ghmob(this).attr('href') === undefined || ghmob(this).attr('href') === '#') {
event.preventDefault();
}
if (isKeyPress && isReturn && ghmob(this).attr('href') === undefined) {
event.stopPropagation();
}
else if (isKeyPress) {
return;
}
// call button action
if (ghmob(this).data('buttonParams').action) {
var _this = ghmob(this);
ghUtils.once(function() {
_this.data('buttonParams').action.call();
}, 20);
}
// close popup
var $this = ghmob(this);
ghUtils.delay(function() {
$this.closest('.ui-popup-active').find('.ui-popup-close').trigger('click');
}, 250);
// return if href
if (ghmob(this).attr('href') !== undefined) return;
event.preventDefault();
event.stopPropagation();
});
// append button
thisButton.button();
popupMessageContainer.append(thisButton);
}
}
// add message container to popup
$popup.append(popupMessageContainer);
// add close button
this.forceCloseButton($popup);
return true;
},
/**
* closePopup
*
* @ignore
* @returns {void}
*/
closePopup: function() {
ghmob('[data-role="popup"], .ui-popup').popup('close');
ghmob('#HelppopupContainer_' + ghPage.getWin()).hide();
},
/**
* onRemovedFromDOM
*
* @ignore
* @param {obj} node
* @returns {void}
*/
onRemovedFromDOM: function(node) {
if (node.id && node.id.indexOf('ptMod_') > -1) {
this.triggerModalClose();
}
},
/**
* onInsertedIntoDOM
*
* @ignore
* @param {obj} node
* @returns {void}
*/
onInsertedIntoDOM: function(node) {
if (node.id && (node.id.indexOf('ptMod_') > -1 || node.id.indexOf('mobile_popup') > -1)) {
ghUtils.delay(function() {
if (node.id.indexOf('mobile_popup') > -1 && ghmob('#mobile_popup').css('display') === 'none') return;
ghModal.triggerModalOpen(ghmob(this));
});
}
},
/**
* triggerModalOpen
*
* @ignore
* @returns {bool}
*/
triggerModalOpen: function() {
// Stop iframe from reporting trigger when parent does
if (ghPage.isIFrameModal()) return false;
// trigger
ghmob(document, this._getAnchorWindow().document).trigger('ghModalOpen', [ghModal.getActiveModal()]);
return true;
},
/**
* triggerModalClose
*
* @ignore
* @returns {bool}
*/
triggerModalClose: function() {
// Stop iframe from reporting trigger when parent does
if (ghPage.isIFrameModal()) return;
// trigger
if (!this._isDoubleTrigger && ghConfig.modal.transition !== 'default') {
this._isDoubleTrigger = true;
ghUtils.delay(function() {
ghModal._isDoubleTrigger = false;
}, 1000);
ghmob(document, this._getAnchorWindow().document).trigger('ghModalClose', [ghModal.getActiveModal()]);
return true;
}
return false;
},
/**
* forceFluidModalHeader
*
* @private
* @returns {void}
*/
_forceFluidModalHeader: function() {
var activeModal = this.getActiveModal();
if (activeModal.find('.ps_popup-menu').length > 0) {
activeModal.addClass('ps_popup-menu');
ghLoader.hide();
ghmob('body').removeAttr('style');
return;
}
if (activeModal.find('.ps_popup-horizontal').length > 0) {
activeModal.find('.ps_modal_container').addClass('ps_popup-horizontal');
}
if (activeModal.find('.ps_popup-vertical').length > 0) {
activeModal.find('.ps_modal_container').addClass('ps_popup-vertical');
}
if (activeModal.find('.ps_header_modal, .ps_modal_header').length > 0) return;
var modalTitle;
if (activeModal.find(ghHeader.headings.join() + ', b').first().length > 0) {
modalTitle = activeModal.find(ghHeader.headings.join() + ', b').first().text().trim();
activeModal.find(ghHeader.headings.join() + ', b').first().addClass('gh-hidden').attr('aria-hidden', 'true');
}
else {
modalTitle = ghConfig.modal.defaultPopupTitle;
}
ghmob('.ps_modal_content').before('<div class="ps_modal_header"><h1 class="ps_modal_title">' + modalTitle + '</h1></div>');
},
/**
* forceFluidModalCloseBtn
*
* @private
* @returns {void}
*/
_forceFluidModalCloseBtn: function() {
var activeModal = this.getActiveModal();
var closeBtn = ghmob('<div class="ps_modal_close"><div class="psc_modal-close"><a href=""><span class="visually-hidden">Close</span></div></div>');
var modalInc = ghModal.getModalTargetId();
if (ghPage.isIFrameModal()) {
if (window.frameElement !== null) {
modalInc = window.frameElement.id.split('_')[1];
}
if (ghmob('.ps_prompt-cancel').length > 0) {
closeBtn.find('a').attr('href', ghmob('.ps_prompt-cancel a').attr('href'));
closeBtn.appendTo(ghmob('.ps_header_modal, .ps_modal_header').first());
}
else if (ghmob('.ps_header_modal').length > 0 && ghmob('.ps_header_modal .psc_modal-close').length === 0) {
closeBtn.find('a').attr('href', 'javascript:doCloseModal(' + modalInc + ');');
closeBtn.appendTo(ghmob('.ps_header_modal, .ps_modal_header').first());
}
}
else if (ghmob('.ps_modal_header').length > 0 && ghmob('.ps_modal_header .psc_modal-close').length === 0) {
if (activeModal.find('.ps_popup-vertical, .ps_popup-horizontal').length > 0) {
closeBtn.find('a').attr('href', 'javascript:autoClose();');
}
else {
closeBtn.find('a').attr('href', 'javascript:doCloseModal(' + modalInc + ');');
}
closeBtn.find('a').prepend('<span class="fa fa-close" aria-hidden="true"></span>');
closeBtn.appendTo(ghmob('.ps_modal_header'));
}
},
/**
* onModalOpen
*
* @ignore
* @returns {void}
*/
onModalOpen: function() {
var activeModal = this.getActiveModal();
// Hide loading icon
ghmob('html', this._getAnchorWindow().document).removeClass('ui-loading');
ghmob('body').addClass('ui-overlay-a');
ghmob(window).scrollTop(0, 0);
if (ghModal.isModalOpen() && activeModal && activeModal.is('div[id^="ptMod"]')) {
// run fluid code
this._batchFluidConfiguration();
var modal = ghmob('.PSMODAL', ghModal._getAnchorWindow().document);
var modalTbl = ghmob('.PSMODALTABLE', ghModal._getAnchorWindow().document).last();
var modalHdr = modalTbl.find('.PSMODALHEADER');
var modalClose = modalTbl.find('.PSMODALCLOSE');
var modalTitle = modalTbl.find('.PTPOPUP_TITLE');
if (modalTitle.length === 0) {
modalTitle = modalTbl.find('#PTPOPUP_TITLE, #PT_TITLE, #PT_PAGETITLE').first();
}
// PS modal
modal.show();
modalTbl.addClass(ghConfig.modal.transition + ' in ui-popup-active').removeAttr('aria-labelledby');
ghUtils.delay(function() {
modalHdr.removeAttr('aria-labelledby');
modalTitle.addClass('ui-header').attr('tabindex', '-1');
modal.find('[alt]').not('img').removeAttr('alt');
modal.find('[title]').not('iframe').removeAttr('title');
ghAccessibility.setFocusTo(modalTbl.find(':focusable:visible').not('a:empty').first());
modalClose.find('a').html('<span class="visually-hidden">Close</span>');
}, 1);
// add loaded class
ghPage._reportModalAsLoaded();
// Buttons
modal.find('.PSPUSHBUTTON').removeClass('PSPUSHBUTTON').addClass('ui-btn-inline').find('input').removeAttr('class');
// Prevent infinite reset of min-height on #jqm_main_page within PeopleSoft modal dialogs
ghmob(ghModal._getAnchorWindow()).off('throttledresize');
}
else {
// jQuery popup
ghUtils.delay(function() {
ghmob('.ui-popup-active .ui-popup').popup('reposition', {positionTo: 'window'});
});
}
this._batchAccessibilityHooks(true);
ghUtils.getWinTop().ghLoader.hide();
},
/**
* onModalClose
*
* @ignore
* @returns {void}
*/
onModalClose: function() {
// Set Aria status
this._batchAccessibilityHooks();
ghmob('body').removeClass('ui-overlay-a');
ghmob('.ps_modalmask, #pt_modalMask').hide().attr('aria-hidden', 'true');
ghUtils.delay(function() {
if (ghModal.getActiveModal() === false) {
ghmob('#pt_modals').hide();
}
}, 10);
if (this._messageQueue.length > 0) {
this.popup.apply(this, this._messageQueue[0]);
this._messageQueue.shift();
}
},
/**
* enhanceSearchDialog
*
* @ignore
* @returns {void}
*/
enhanceSearchDialog: function() {
if (ghPage.isSearch() === false) return;
var options = ghmob('#options');
if (options.length === 0) {
var optionWrappers = ghmob('[id$="divSEARCHABOVE"], [id$="divSEARCHADV"], [id$="divSEARCHBELOW"]');
optionWrappers.wrapAll('<div id="options"></div>');
options = ghmob('#options');
ghContainer.createCollapsible(options, 'Search Options', { collapsed: false });
}
var advSearch = ghmob('[id$="divSEARCHADV"]');
advSearch.find('input, select, textarea').not('[type="hidden"]').each(function() {
var id = ghmob(this).attr('id');
var thisParent = ghmob(this).closest('div[id], td').first();
var label = advSearch.find('label[for="' + id + '"]').first();
var labelText = advSearch.find('[id="' + id + '$op"]').prev('span.PSDROPDOWNLIST');
if (labelText.length > 0) {
label.remove();
}
if (label.length === 0 || labelText.length > 0) {
thisParent.prepend('<label for="' + id + '" class="ui-input-text">' + labelText.text().trim() + '</label>');
label = ghmob('label[for="' + id + '"]');
if (ghmob(this).is('select') && id.indexOf('$op') > -1) {
label.addClass('visually-hidden');
if (label.text().indexOf('Search Options') === -1) {
label.text(ghmob('label[for="' + id.replace('$op', '') + '"]').text().trim().replace(':', '') + ' Search Options');
}
}
}
else {
if (label.parent('.PT_CP_DIV_LABEL').length > 0) {
label.unwrap();
}
label.html(label.text().trim().split('*')[0].split(':')[0]);
}
});
advSearch.find('table.PSPAGECONTAINER > tbody > tr').each(function() {
if (ghmob(this).find('table.PSPAGECONTAINER').length > 0) return;
ghmob(this).find('> td:gt(0)').each(function() {
ghmob(this).children().appendTo(ghmob(this).closest('tr').find('td:eq(0)'));
});
if (ghmob(this).find('> td:eq(0)').children().first().hasClass('ui-field-contain') === false) {
ghmob(this).find('> td:eq(0)').children().wrapAll('<div class="ui-field-contain"></div>');
}
});
advSearch.find('[style]').removeAttr('style');
advSearch.find('[type="hidden"]').prev('span').addClass('gh-hidden');
advSearch.find('span.PSSRCHEDITBOXLABEL').css('font-weight', 'bold');
ghmob('[id$="divSEARCHBELOW"] br').remove();
ghmob('[id$="divSEARCHBELOW"] a').each(function() {
var btn = ghmob(this);
if (ghmob(this).find('input').length > 0) {
btn = ghmob(this).find('input');
}
ghContainer.footer(ghmob('[id$="divSEARCHBELOW"]'), btn, { color: 'info' });
});
var results = ghmob('[id$="divSEARCHRESULT"], [id$="divPT_SEARCHRESULT"]').first();
var resultsHeader = results.find('.PSSRCHSUBTITLE').first();
var resultsTable = ghmob('#PTSRCHRESULTS, .PSSRCHRESULTSWBO, .ui-table, #win0divSEARCHRESULT table.PSXLATTABLE').filter(function() {
return (ghmob(this).find('> tbody > tr').length > 0);
}).first();
var resultsList = results.find('.search-results ul.gh-listview');
ghTable.cleanReflow(resultsTable);
if (resultsHeader.length > 0 && resultsTable.length > 0) {
resultsHeader.removeClass('PSSRCHSUBTITLE');
ghContainer.create(results, resultsHeader);
}
else {
ghContainer.unwrap(results);
}
if (resultsList.length === 0 && resultsTable.length > 0) {
results.append('<div role="navigation" aria-label="search results" class="search-results"><ul class="gh-listview" data-inset="true"></ul></div>');
resultsList = results.find('.search-results ul.gh-listview');
}
else {
resultsList.html('');
}
var rows = resultsTable.find('> tbody > tr').filter(function() {
return (ghmob(this).text().trim() !== '' && ghmob(this).children().length > 0 && ghmob(this).hasClass('gh-hidden') === false);
});
rows.each(function() {
var action = ghmob(this).find('a').first();
if (action.length === 0) {
action = ghmob(this).closest('tr[bup-onclick]').attr('bup-onclick');
}
else {
action = action.attr('href');
}
resultsList.append('<li><a href="' + action + '"></a></li>');
ghmob(this).children('td').each(function(i) {
if (ghmob(this).text().trim() === '' || ghmob(this).find('input, textarea, select').length > 0) return;
ghmob(this).find('label, b.ui-table-cell-label, .ps_box-label').remove();
resultsList.find('li:last-child a').append('<p class="ui-li-desc"><strong>' + resultsTable.find('th:eq(' + i + ')').text().trim() + ':</strong> ' + ghmob(this).text().trim() + '</p>');
});
});
results.parent().find('[id*="gh-table-pager"]').remove();
ghUtils.delay(function() {
var resultsPager = results.find('table.PSSRCHRESULTSTITLE > tbody > tr:first-child');
if (resultsPager.length > 0) {
resultsPager.find('span:contains(" of ")').addClass('PSGRIDCOUNTER');
ghTable.pagerCreate(results, resultsPager);
}
});
var instructions = results.find('.PSSRCHINSTRUCTIONS');
if (instructions.parent('.alert').length === 0) {
instructions.wrapAll('<div class="alert alert-info"></div>');
}
results.find('table').addClass('gh-hidden').attr('aria-hidden', 'true');
ghUtils.delay(function() {
if (ghPage.isFluid()) {
// Search criteria collapsible
ghContainer.createCollapsible(ghmob('.ps_prompt-content > div[class="ui-body"]').removeClass('ui-body'));
// Search criteria buttons
ghmob('.ps_prompt-content').find('.ui-collapsible-content').first().find('.gh-container-footer').remove();
ghContainer.footer(ghmob('.ps_prompt-content').find('.ui-collapsible-content').first(), ghmob('.ps_prompt-criteria').find('.ps_prompt-searchoptions, .ps_box-button'));
// Load more
ghmob('.ps_prompt-results .gh-load-more').insertAfter(ghmob('.ps_prompt-results .search-results'));
}
}, 101);
},
/**
* popupAfterOpen
*
* @private
* @returns {void}
*/
_popupAfterOpen: function() {
ghmob('body').addClass('ui-overlay-a');
ghModal.triggerModalOpen();
},
/**
* popupAfterClose
*
* @private
* @returns {void}
*/
_popupAfterClose: function() {
ghmob('body').removeClass('ui-overlay-a');
ghModal.triggerModalClose();
},
/**
* popupReposition
*
* @private
* @param {jQuery} collapsible
* @returns {void}
*/
_popupReposition: function(collapsible) {
ghmob(collapsible).closest('.ui-popup').popup('reposition', {positionTo: 'window'});
},
/**
* closeSortModal
*
* @private
* @param {object} event
* @param {object} fieldInfo
* @returns {void}
*/
_closeSortModal: function(event, fieldInfo) {
if (fieldInfo.fieldId.indexOf('SORT$divpop') === -1 || fieldInfo.isAfterUpdate === false) return;
window.doCloseModalDialogAll();
},
/**
* _eventBindings
*
* @private
* @returns {void}
*/
_eventBindings: function() {
ghmob(document)
.off('ghModalOpen.ghModal.onModalOpen')
.on('ghModalOpen.ghModal.onModalOpen', function() {
ghLog.event('ghModalOpen.ghModal.onModalOpen');
ghModal.onModalOpen();
});
ghmob(document)
.off('ghModalClose.ghModal.onModalClose')
.on('ghModalClose.ghModal.onModalClose', function() {
ghLog.event('ghModalClose.ghModal.onModalClose');
ghModal.onModalClose();
});
ghmob(document)
.off('popupafteropen.ghModal.popupAfterOpen')
.on('popupafteropen.ghModal.popupAfterOpen', '[data-role="popup"], .ui-popup', function() {
ghLog.event('popupafteropen.ghModal.popupAfterOpen');
ghModal._popupAfterOpen();
});
ghmob(document)
.off('popupafterclose.ghModal.popupAfterClose')
.on('popupafterclose.ghModal.popupAfterClose', '[data-role="popup"], .ui-popup', function() {
ghLog.event('popupafterclose.ghModal.popupAfterClose');
ghModal._popupAfterClose();
});
ghmob(document)
.off('collapse.ghModal.popupReposition expand.ghModal.popupReposition')
.on('collapse.ghModal.popupReposition expand.ghModal.popupReposition', '.ui-popup .ui-collapsible', function() {
ghLog.event('collapse.ghModal.popupReposition expand.ghModal.popupReposition');
ghModal._popupReposition(this);
});
ghmob(document)
.off('click.ghModal.popupClose touchstart.ghModal.popupClose')
.on('click.ghModal.popupClose touchstart.ghModal.popupClose', '.gh-jqmpopup-close, [onclick*="StopPopup"]', function() {
ghLog.event('click.ghModal.popupClose touchstart.ghModal.popupClose');
ghModal.closePopup();
});
ghmob(document)
.off('click.ghModal.actionSheetClose touchstart.ghModal.actionSheetClose')
.on('click.ghModal.actionSheetClose touchstart.ghModal.actionSheetClose', '.ui-popup > .actions a, .ui-popup > .actions input, .ui-popup > .actions span, .ui-popup[data-id="gh-actionsheet-popup"] .PSPUSHBUTTON', function() {
ghLog.event('click.ghModal.actionSheetClose touchstart.ghModal.actionSheetClose');
ghModal.closeActionSheetPopup(ghmob(this));
});
ghmob(document)
.off('click.ghModal.gridsort')
.on('click.ghModal.gridsort', '.ps_modal_container.ps_modal-gridsort .psc_sort a', function() {
ghLog.event('click.ghModal.gridsort');
ghUtils.delay(function() {
ghModal.triggerModalClose();
});
});
ghmob(document)
.off('click.ghModal.searchLinks')
.on('click.ghModal.searchLinks', '.search-results .gh-listview a', function(event) {
event.preventDefault();
var action = ghmob(this).attr('href');
if (typeof action !== 'undefined' && action.indexOf('javascript') === -1) return;
eval(action);
});
// Fluid sort popup
ghmob(document)
.off('fieldupdate.ghModal')
.on('fieldupdate.ghModal', this._closeSortModal);
new MutationObserver(function(mutations) {
mutations.forEach(function(mutation) {
if (!mutation.addedNodes || mutation.addedNodes.length < 1) return;
if (mutation.addedNodes[0].id && (mutation.addedNodes[0].id === 'mobile_popup' || mutation.addedNodes[0].id.indexOf('ptMod_') === 0)) {
ghLog.event('MO.ghModal.onInsertedIntoDOM');
ghModal.onInsertedIntoDOM(mutation.addedNodes[0]);
}
});
}).observe(document, { childList: true, subtree: true });
new MutationObserver(function(mutations) {
mutations.forEach(function(mutation) {
if (!mutation.removedNodes || mutation.removedNodes.length < 1) return;
if (mutation.removedNodes[0].id && (mutation.removedNodes[0].id === 'mobile_popup' || mutation.removedNodes[0].id.indexOf('ptMod_') === 0)) {
ghLog.event('MO.ghModal.onRemovedFromDOM');
ghModal.onRemovedFromDOM(mutation.removedNodes[0]);
}
});
}).observe(document, { childList: true, subtree: true });
ghmob(document)
.off('click.ghModal.closeModal touchstart.ghModal.modalClose')
.on('click.ghModal.closeModal touchstart.ghModal.modalClose', '#pt_modalMask, .ps_modal_body .ps_header_modal a[id="#ICCancel"]', function() {
ghLog.event('click.ghModal.closeModal');
ghUtils.delay(function delayTriggerModalClose() {
ghLog.event('click.ghModal.closeModal touchstart.ghModal.modalClose');
ghModal.triggerModalClose();
}, 250);
});
ghmob(window)
.off('click.ghModal.closePopupMenu')
.on('click.ghModal.closePopupMenu', function(event) {
ghLog.event('click.ghModal.closePopupMenu');
var activeModal = ghModal.getActiveModal();
if (activeModal && activeModal.hasClass('ps_popup-menu') && ghmob(event.currentTarget).parents('.ps_popup-menu').length === 0) {
autoClose(event);
}
});
},
/**
* setParentWin
*
* @private
* @returns {void}
*/
_setParentWin: function() {
MTop().oParentWin = window;
window.oParentWin = window;
MTop().modId = this.getModalTargetId();
window.modId = this.getModalTargetId();
},
/**
* run
*
* @ignore
* @returns {void}
*/
run: function() {
if (ghConfig.modal.enabled === false) return;
ghLog.info('Running modal configuration scripts');
this._eventBindings();
// Run trigger
if (ghPage.isIFrameModal()) {
ghLog.info('Sending trigger: ghModalOpen');
ghmob(document).trigger('ghModalOpen');
}
this._batchDocumentConfigurationClasses();
this._processActionSheets();
this._setPSModalClose();
this._wrapFluidGridInitTryCatch();
this._overrideDoPortalUrl();
},
};
/**
* Run
*/
ghInit.module('ghModal');
ghInit.attach({
pageName: 'gh-iframe',
eventType: 'pageinit',
force: true,
runCondition: ghPage.isIFrameModal(),
}, function() {
ghmob(window).off('throttledresize');
ghModal.enhanceSearchDialog();
});/**
* ghTable
* Provides methods for tables
*
* @module ghTable
* @config enabled [true, false]
* @config pagerEnabled [true, false]
* @config pagerPosition ['bottom','top','both']
* @config pagerShowMore [true, false]
* @config sorting [true, false]
* @config sortingIcon [FontAwesome class]
* @config sortingIconDown [FontAwesome class]
* @config sortingIconUp [FontAwesome class]
* @config sortingIconPosition [left, right]
* @config tablesawEnabled [true, false]
*
* @trigger tableCreate
*/
var ghTable = ghTable || {
/**
* sortText
* Aural text for sorting icon
*
* @type {string}
*/
sortText: 'Sort this column',
/**
* sortAscText
* Aural text for ascending sorting icon
*
* @type {string}
*/
sortAscText: 'Sort this column in ascending order',
/**
* sortDescText
* Aural text for descending sorting icon
*
* @type {string}
*/
sortDescText: 'Sort this column in descending order',
/**
* cleanInit
* Check to see what table type needs to be cleaned and runs appropriate function
*
* @deprecates cleanReflowTablesInit, ghTable.cleanReflowInit()
* @ignore
* @param {jQuery} scope
* @returns {void}
*/
cleanInit: function(scope) {
// Remove tablesaw class from PFO tables
ghmob('.gh-tablesaw', scope).removeClass('tablesaw');
// Clean reflow tables
ghmob('table', scope).not('table[id*="scroll"], table[data-gh-enhanced="false"], table[role="presentation"]').each(function() {
if (ghmob(this).find('table').length === 0 && ghmob(this).find('th').length > 0 && ghmob(this).find('tbody').length > 0) {
ghTable.cleanReflow(ghmob(this));
}
});
// Clean scroll tables
ghmob('table[id*="scroll"]', scope).not('table[data-gh-enhanced="false"], table[class*="SCROLLAREABODY"], table[class^="PABACKGROUNDINVISIBLE"]').each(function() {
var parents = ghmob(this).parents('table[id*="scroll"]').not('[class*="SCROLLAREABODY"], table[class^="PABACKGROUNDINVISIBLE"]');
var exclude = ghmob('table[class*="GROUPBOX"], table[id*="GROUPBOX"], div[data-for]');
var findExcludeLength = ghmob(this).find(exclude).length;
if ((parents.length === 0 && findExcludeLength === 0) || (parents.length > 0 && parents.find(exclude).length > 0 && findExcludeLength === 0)) {
ghTable.cleanScroll(ghmob(this));
}
});
// Make sure non-data tables have role="presentation"
ghmob('table').not('table[role="presentation"], table[role="table"], table.ui-table, table.tablesaw').attr('role', 'presentation');
// Hide the extra fluid header
ghmob('.ps_grid-flex-head', scope).addClass('gh-hidden').attr('aria-hidden', 'true');
// Refresh Tablesaw tables
if (ghmob('table.tablesaw', scope).length > 0) {
ghmob('table.tablesaw', scope).each(function() {
ghTable.tablesaw(ghmob(this));
});
}
// Cleanup
this.moveGrids();
},
/**
* moveGrids
* Put tables into correct parent containers, other cleanup for 8.56+ and Classic Plus
*
* @ignore
* @param {jQuery} scope
* @returns {void}
*/
moveGrids: function(scope) {
ghmob('div[id*="$grid"]', scope).each(function() {
var gridId = ghmob(this).attr('id');
var parentId = gridId.replace('$grid', '');
var parentSelector = '[id="' + parentId + '"]';
var parentObj = ghmob('[id="' + parentId + '"]');
if (parentObj.length > 0 && ghmob(this).parents(parentSelector).length === 0) {
ghmob(this).find('> table').removeClass('reflow-grid-400 reflow-grid-500 reflow-grid-600 reflow-grid-700 reflow-grid-800 reflow-grid-900 reflow-grid-1000').attr('role', 'presentation');
ghmob(this).find('.gh-view-more').addClass('gh-hidden').next('.psc_more').removeClass('gh-hidden');
ghmob(this).appendTo(parentObj.first());
}
});
if (ghPage.isClassicPlus()) {
ghmob('div.psprintgrid', scope).removeAttr('style').each(function() {
if (ghmob(this).parents('.psprintgrid').length > 0) return;
ghmob(this).find('[style]').removeAttr('style');
ghTable.cleanScroll(ghmob(this).children('table'));
var parentTable = ghmob('table[id*="$scroll"][id*="' + ghmob(this).attr('id').replace('divgc', '').replace('$', '$scroll$') + '"]').first();
var tabs = ghmob(this).closest('tr').prev('tr').find('div.PTGRIDTAB');
if (parentTable.length > 0) {
ghmob(this).insertAfter(parentTable);
tabs.insertAfter(parentTable);
if (parentTable.parent().find('.gh-submenu-wrap').length === 0) {
tabs.removeClass('gh-hidden').find('.gh-hidden').removeClass('gh-hidden');
ghSubmenu.tableTabs(tabs);
}
}
});
}
},
/**
* cleanReflow
* Fix reflow tables
*
* @deprecates cleanReflowTables
* @param {jQuery} selector
* @param {bool} [cleanScrollPass]
* @returns {void}
*/
cleanReflow: function(selector, cleanScrollPass) {
// ensure jquery object
selector = ghUtils.jqElem(selector);
// debug
ghLog.info('Running ghTable.cleanReflow on:', selector);
// adjust selector if needed
if (selector.is('table') === false) {
selector = selector.find('table').first();
}
// return if this table should run through cleanScroll instead
var parents = selector.parents('table[id*="scroll"]');
var thisReflowWidth;
if (parents.length > 0 && parents.find('.psprintgrid').length > 0 && cleanScrollPass !== true) {
// remove role="presentation" and style attributes
selector.removeAttr('role').removeAttr('style');
selector.parents('table').not('table[role="presentation"], table[role="table"], .ui-table, .tablesaw').attr('role', 'presentation');
// add classes and roles
thisReflowWidth = this._getReflowWidth(selector);
selector.removeClass('reflow-grid-400 reflow-grid-500 reflow-grid-600 reflow-grid-700 reflow-grid-800 reflow-grid-900 reflow-grid-1000');
selector.attr('data-role', 'table').attr('data-mode', 'reflow').attr('data-reflow-breakpoint', thisReflowWidth).addClass('ui-table table-stripe table-stroke reflow-grid-' + thisReflowWidth);
// accessibility
this._aria(selector);
// debug
ghLog.info('ghTable.cleanReflow stop: scroll table');
return;
}
// return if this table has data-gh-enhanced = false attribute
var enhanced = selector.attr('data-gh-enhanced');
if (typeof enhanced !== 'undefined' && enhanced === 'false') {
// debug
ghLog.info('ghTable.cleanReflow stop: data-gh-enhanced = false');
return;
}
// move table headings
this.moveHeadings(selector);
// check for table headings
if (selector.children('thead').find('th').length === 0) {
// remove empty table head
selector.children('thead').remove();
// debug
ghLog.info('ghTable.cleanReflow stop: no table headings');
return;
}
// remove role="presentation" and style attributes
selector.removeAttr('role').removeAttr('style');
selector.parents('table').not('table[role="presentation"], table[role="table"], .ui-table, .tablesaw').attr('role', 'presentation');
// return if already processed
if (selector.hasClass('tablesaw')) {
// debug
ghLog.info('ghTable.cleanReflow stop: tablesaw found');
return;
}
if (typeof selector.attr('data-reflow-breakpoint') !== 'undefined') {
// debug
ghLog.info('ghTable.cleanReflow stop: table already processed');
return;
}
// add classes and roles
thisReflowWidth = this._getReflowWidth(selector);
selector.removeClass('reflow-grid-400 reflow-grid-500 reflow-grid-600 reflow-grid-700 reflow-grid-800 reflow-grid-900 reflow-grid-1000');
selector.attr('data-role', 'table').attr('data-mode', 'reflow').attr('data-reflow-breakpoint', thisReflowWidth).addClass('ui-table table-stripe table-stroke reflow-grid-' + thisReflowWidth);
// accessibility
this._aria(selector);
// refresh or create jQuery table
this._tableInit(selector);
// debug
ghLog.info('ghTable.cleanReflow done');
},
/**
* aria
*
* @private
* @param {jQuery} selector
* @returns {void}
*/
_aria: function(selector) {
selector.each(function() {
var labelledBy = '';
if (ghmob(this).is('a') && typeof ghmob(this).attr('id') !== 'undefined') {
labelledBy += ghmob(this).attr('id') + ' ';
}
var containerHd = ghmob(this).closest('.ui-collapsible, .ui-body').find('.ui-collapsible-heading-toggle[id], .ui-bar[id]').first();
if (containerHd.length > 0) {
labelledBy += containerHd.attr('id') + ' ';
}
var pagerLabel = ghmob(this).closest('.gh-table-pager-more[id], .gh-table-pager[id]').children('.sr-only[id]');
if (pagerLabel.length > 0) {
labelledBy += pagerLabel.attr('id') + ' ';
}
if (labelledBy === '') return;
ghmob(this).attr('aria-labelledby', labelledBy.trim());
});
},
/**
* getReflowWidth
* Get reflow width
*
* @private
* @param {jQuery} selector
* @returns {string} reflowWidth
*/
_getReflowWidth: function(selector) {
var reflowWidth = '600';
if (selector.parents('[data-breakpoint]').length > 0) {
reflowWidth = selector.closest('[data-breakpoint]').attr('data-breakpoint');
}
else if (selector.parents('[data-reflow-breakpoint]').length > 0) {
reflowWidth = selector.closest('[data-reflow-breakpoint]').attr('data-reflow-breakpoint');
}
else if (typeof selector.attr('class') !== 'undefined') {
var className = selector.attr('class');
if (className.indexOf('reflow-grid-400') > -1) {
reflowWidth = '400';
}
if (className.indexOf('reflow-grid-500') > -1) {
reflowWidth = '500';
}
if (className.indexOf('reflow-grid-600') > -1) {
reflowWidth = '600';
}
if (className.indexOf('reflow-grid-700') > -1) {
reflowWidth = '700';
}
if (className.indexOf('reflow-grid-800') > -1) {
reflowWidth = '800';
}
if (className.indexOf('reflow-grid-900') > -1) {
reflowWidth = '900';
}
if (className.indexOf('reflow-grid-1000') > -1) {
reflowWidth = '1000';
}
}
else if (typeof selector.attr('data-reflow-breakpoint') !== 'undefined') {
reflowWidth = selector.attr('data-reflow-breakpoint');
}
return reflowWidth;
},
/**
* cleanScroll
* Fix scroll tables
*
* @deprecates fixScrollGrids
* @param {jQuery} selector
* @returns {void}
*/
cleanScroll: function(selector) {
// ensure jquery object
selector = ghUtils.jqElem(selector);
// debug
ghLog.info('Running ghTable.cleanScroll on:', selector);
// return if already processed
if (selector.hasClass('tablesaw') || (selector.find('table.ui-table[data-reflow-breakpoint]:not([role="presentation"])').length > 0 && selector.find('.psprintgrid').length === 0) || selector.find('table.tablesaw').length > 0) {
// move pager
var innerTables = selector.find('table.ui-table:not([role="presentation"], [data-reflow-breakpoint])');
innerTables.each(function() {
selector.prev('[id*="gh-table-pager-"]').insertBefore(ghmob(this));
selector.next('[id*="gh-table-pager-"]').insertAfter(ghmob(this));
});
// debug
ghLog.info('ghTable.cleanScroll stop: ui-table or tablesaw found');
return;
}
// return if this table has data-gh-enhanced = false attribute
var enhanced = selector.attr('data-gh-enhanced');
if (typeof enhanced !== 'undefined' && enhanced === 'false') {
// debug
ghLog.info('ghTable.cleanScroll stop: data-gh-enhanced = false');
return;
}
// if table hasn't already been processed through cleanReflow
if (typeof selector.attr('data-reflow-breakpoint') === 'undefined') {
// move table headings
if (selector.children('thead').length === 0 && selector.find('table > thead th').length > 0) {
selector.prepend('<thead><tr></tr></thead>');
selector.find('table > thead th').appendTo(selector.find('> thead > tr'));
}
this.moveHeadings(selector);
// check for table headings
if (selector.children('thead').find('th').length === 0) {
// remove empty table head
selector.children('thead').remove();
// debug
ghLog.info('ghTable.cleanScroll stop: no table headings');
return;
}
}
// return if no inner tables
if (selector.find('table:not(.gh-hidden)').length === 0) {
// debug
ghLog.info('ghTable.cleanScroll stop: no inner tables');
// if table hasn't already been processed through cleanReflow
if (typeof selector.attr('data-reflow-breakpoint') === 'undefined') {
this.cleanReflow(selector, true);
}
return;
}
// remove role="presentation" and style attributes
selector.find('[style]').removeAttr('style');
// loop through inner tables
var innerTableCount = 0;
selector.find('table').each(function() {
if (ghmob(this).parents('th').length > 0) return;
ghmob(this).addClass('gh-hidden').attr('data-enhance', 'false').attr('aria-hidden', 'true');
// if inner table has content
if (ghmob(this).children('tbody').children('tr').children('td.gsfield, td.gsgrid, td.PSGRIDFIRSTCOLUMN, td[class*="PSLEVEL"][class*="GRIDODDROW"], td[class*="PSLEVEL"][class*="GRIDEVENROW"]').length > 0) {
// increment counter
innerTableCount = innerTableCount + 1;
ghmob(this).children('tbody').children('tr').children('td.gsfield').removeClass('gsfield');
// move content from inner table row to appropriate row in outer table
if (innerTableCount === 1) {
ghmob(this).children('tbody').children('tr').addClass('gh-scroll-table-row');
ghmob(this).children('tbody').children().appendTo(selector.children('tbody'));
}
else {
ghmob(this).children('tbody').children('tr').each(function(i) {
ghmob(this).children().appendTo(selector.children('tbody').children('tr.gh-scroll-table-row:eq(' + i + ')'));
});
}
}
});
selector.children('tbody').children('tr:not(.gh-scroll-table-row, [id])').addClass('gh-hidden').attr('aria-hidden', 'true');
// if table hasn't already been processed through cleanReflow
if (typeof selector.attr('data-reflow-breakpoint') === 'undefined') {
this.cleanReflow(selector, true);
}
// debug
ghLog.info('ghTable.cleanScroll done');
},
/**
* moveHeadings
* Moves <th> from <tbody> to <thead>
*
* @param {jQuery} selector
* @returns {void}
*/
moveHeadings: function(selector) {
var menuItems = '';
var sorting = false;
var sortSelectors = 'a[id][title], span[id][title]';
var sortIconDownSelectors = 'a[id][title*="descending"], img[src*="SRT2DN"]';
var sortIconUpSelectors = 'a[id][title*="ascending"], img[src*="SRT2UP"]';
var headings = selector.find('th:not(th[scope="row"], th.gh-table-heading)');
if (headings.length === 0) return;
// add table head
if (selector.children('thead').length === 0) {
selector.prepend('<thead><tr></tr></thead>');
}
else if (selector.children('thead').length > 1) {
selector.children('thead').not('thead:eq(0)').remove();
}
// loop through headings
headings.each(function() {
// reset heading
var $this = ghmob(this);
$this.removeAttr('abbr class style height').find('a').removeAttr('class');
$this.find('b.ui-table-cell-label').remove();
var rowCount = $this.closest('table').find('> tbody > tr:not(.gh-hidden)').length;
// sorting
var sortLength = $this.find(sortSelectors).length;
if (sortLength > 0 && $this.hasClass('gh-table-heading') === false && ghConfig.table.sorting === true && rowCount > 1) {
sorting = true;
selector.addClass('ui-table table-stroke table-stripe gh-sortable');
$this.attr('role', 'columnheader');
// determine action
var $sort = $this.find(sortSelectors).first();
var sortId = $sort.attr('id');
var action = '';
if (typeof $sort.attr('href') !== 'undefined') {
action = action + $sort.attr('href').replace('javascript:', '').replace('this.name', '"' + $sort.attr('name') + '"').replace('this.id', '"' + $sort.attr('id') + '"');
}
if (typeof $sort.attr('onclick') !== 'undefined') {
action = action + $sort.attr('onclick').replace('javascript:', '').replace('this.name', '"' + $sort.attr('name') + '"').replace('this.id', '"' + $sort.attr('id') + '"');
}
if (action === '') {
action = 'ptGridObj_' + ghPage.getWin() + '.doSort(\'' + sortId + '\');';
}
var href = 'javascript:' + action;
// determine icon
var icon;
var iconText;
var sortIconDownLength = $this.find(sortIconDownSelectors).length;
var sortIconUpLength = $this.find(sortIconUpSelectors).length;
if (sortIconDownLength > 0) {
icon = ghConfig.table.sortingIconDown;
iconText = ghTable.sortDescText;
$this.attr('aria-sort', 'descending');
}
if (sortIconUpLength > 0) {
icon = ghConfig.table.sortingIconUp;
iconText = ghTable.sortAscText;
$this.attr('aria-sort', 'ascending');
}
if (sortIconUpLength === 0 && sortIconDownLength === 0) {
icon = ghConfig.table.sortingIcon;
iconText = ghTable.sortText;
$this.attr('aria-sort', 'none');
}
var iconHTML = '<i class="fa ' + icon + '" aria-hidden="true"></i>';
// heading HTML
$this.find('a').first().addClass('ui-icon-' + ghConfig.table.sortingIconPosition).attr('title', iconText).append(' ' + iconHTML);
// menuItems HTML
menuItems = menuItems + '<li><a href="' + href + '" title="' + iconText + '">' + $this.text().trim() + ' ' + iconHTML + '</a></li>';
}
else if (sortLength === 0 || ghConfig.table.sorting === false || rowCount <= 1) {
$this.find('a').first().removeAttr('title').attr('tabindex', '-1').addClass('gh-nosort');
}
$this.addClass('gh-table-heading').attr('scope', 'col');
// append new <th> to <thead>, if needed
if ($this.parents('thead').length === 0) {
$this.appendTo(selector.children('thead').children('tr'));
}
});
// Sort By submenu
if (sorting === true && ghConfig.table.sorting === true && selector.prev('.gh-submenu[class^="reflow-grid-"]').length === 0 && selector.find('th:not(.gh-nosort)').length > 0) {
// create submenu
var submenu = ghSubmenu.create('sort');
submenu = ghmob(submenu);
// add reflow class
var reflow = this._getReflowWidth(selector);
submenu.addClass('reflow-grid-' + reflow);
// append items
submenu.find('ul').append(menuItems);
// insert submenu before table
selector.before(submenu);
// events
ghSubmenu.addEvent(submenu);
}
},
/**
* makeHeaderFromRow
* Creates a <thead> with the contents of a <tr>
* Runs best on pagebeforecreate
*
* @param {jQuery} tableSelector
* @param {jQuery} rowSelector
* @returns {void}
*/
makeHeaderFromRow: function(tableSelector, rowSelector) {
tableSelector.removeAttr('role');
tableSelector.find('table').removeAttr('role');
if (tableSelector.find('thead').length < 1) {
ghmob('<thead><tr>').prependTo(tableSelector);
ghmob(rowSelector).find('td, th').each(function() {
var th = ghmob('<th>');
th.text(ghmob(this).text());
th.appendTo(ghmob(tableSelector).find('thead tr'));
ghmob(this).remove();
});
}
},
/**
* cleanLabels
* Remove empty labels and remove sort text from labels
*
* @param {jQuery} table
* @returns {void}
*/
cleanLabels: function(table) {
if (table.is('[data-gh-enhanced="false"]') || table.hasClass('tablesaw') || table.hasClass('gh-tablesaw')) return;
// find reflow labels
var labels = table.find('> tbody > tr:not(.gh-hidden)').find('> td:not(.gh-hidden), > th:not(.gh-hidden)').find('> b.ui-table-cell-label, label.ui-input-text, label.ui-select').not('.ui-btn');
// remove empty labels
labels.filter(function() {
return (ghmob(this).text().trim() === '');
}).remove();
// remove duplicate labels
labels.filter(function() {
return ((ghmob(this).is('b.ui-table-cell-label') && ghmob(this).next('label').length > 0) || (ghmob(this).is('b.ui-table-cell-label') && ghmob(this).next('b.ui-table-cell-label').length > 0));
}).remove();
// collapse empty cells
labels.filter(function() {
return (ghmob(this).siblings().length === 0 || (ghmob(this).siblings().length > 0 && ghmob(this).siblings().text().trim() === '' && ghmob(this).closest('td, th').find('input, textarea, img, .fa, .ps_box-htmlarea span[style*="background"]').length === 0));
}).closest('td, th').addClass('gh-cell-no-padding').children().addClass('gh-hidden').attr('aria-hidden', 'true');
// hide repetitive labels
labels.filter(function() {
return (ghmob(this).is('b.ui-table-cell-label') && ghmob(this).closest('td, th').find('.ui-btn').text().trim() === ghmob(this).text().trim());
}).addClass('gh-hidden').attr('aria-hidden', 'true');
// check that label matches table heading
var nonMatchingLabel = labels.filter(function() {
return (table.find('> thead > tr > th:eq(' + ghmob(this).closest('td, th').index() + ')').text().trim() !== ghmob(this).text().trim());
});
nonMatchingLabel.each(function() {
ghmob(this).text(table.find('> thead > tr > th:eq(' + ghmob(this).closest('td, th').index() + ')').text().trim());
});
},
/**
* cleanCells
* Clean table cells
*
* @param {jQuery} table
* @returns {void}
*/
cleanCells: function(table) {
if (table.is('[data-gh-enhanced="false"]')) return;
// find table cells
var cells = table.find('> tbody > tr:not(.gh-hidden)').find('> td:not(.gh-hidden), > th:not(.gh-hidden)');
// collapse empty cells
cells.filter(function() {
return (ghmob(this).children().not('b.ui-table-cell-label').length === 0 && ghmob(this).text().trim() === '');
}).addClass('gh-cell-no-padding').children().addClass('gh-hidden').attr('aria-hidden');
// hide grid labels
cells.filter(function() {
return (ghmob(this).is('[class*="PSLEVEL"][class*="GRIDLABEL"]'));
}).addClass('gh-hidden').attr('aria-hidden');
// add reflow cell label
if (table.hasClass('tablesaw') === false && table.hasClass('gh-tablesaw') === false) {
var noReflowLabelCells = cells.filter(function() {
return (ghmob(this).find('> b.ui-table-cell-label').length === 0 && ghmob(this).find('label.ui-input-text, label.ui-select').length === 0);
});
noReflowLabelCells.each(function() {
var heading = ghmob(this).closest('table').find('> thead > tr > th:eq(' + ghmob(this).index() + ')').text().trim();
if (heading === '' || ghmob(this).find('.ui-btn').text().trim() === heading) return;
ghmob(this).prepend('<b class="ui-table-cell-label">' + heading + '</b>');
});
}
},
/**
* cleanRows
* Clean table rows
*
* @param {jQuery} table
* @returns {void}
*/
cleanRows: function(table) {
if (table.is('[data-gh-enhanced="false"]')) return;
// find table rows
var rows = table.find('> tbody > tr:not(.gh-hidden)');
// cleanup
rows.filter(function() {
return (typeof ghmob(this).attr('onmouseout') !== 'undefined' || typeof ghmob(this).attr('onmouseover') !== 'undefined');
}).removeAttr('onmouseout').removeAttr('onmouseover');
// remove empty rows
rows.filter(function() {
return (ghmob(this).children().length === 0);
}).remove();
// hide rows with invisible content
rows.filter(function() {
return (ghmob(this).children().not('.gh-hidden').length === 0 || ghmob(this).children().not('.gh-cell-no-padding').length === 0);
}).addClass('gh-hidden').attr('aria-hidden', 'true');
},
/**
* removeEmptyColumns
*
* @param {jQuery} table
* @returns {void}
*/
removeEmptyColumns: function(table) {
var $thisTable = ghmob(table);
if ($thisTable.is('[data-gh-enhanced="false"]') || $thisTable.is('[role="presentation"]')) return;
$thisTable.find('> thead > tr').first().children().each(function(i) {
if (ghmob(this).text().trim() !== '' || ghmob(this).find('img, input, textarea, select, .fa').length > 0) return;
var thisCol = $thisTable.find('> tbody > tr').children(':nth-child(' + (i + 1) + ')');
if (thisCol.text().trim() === '' && thisCol.find('img, input, textarea, select, .fa').length === 0) {
thisCol.addClass('gh-hidden').attr('aria-hidden', 'true');
ghmob(this).addClass('gh-hidden').attr('aria-hidden', 'true');
}
});
},
/**
* pagerInit
* Loops through defined selectors and initializes apppropriate methods
*
* @deprecates ghGridPagerInit
* @ignore
* @param {jQuery} scope
* @returns {void}
*/
pagerInit: function(scope) {
if (ghConfig.table.pagerEnabled !== true) return;
// remove old pagers (for ajax refresh)
ghmob('[id*="gh-table-pager-"]', scope).remove();
// selectors
var tables = [
'table[class*="PSLEVEL"][class*="GRIDWBO"]',
'table[class*="PSLEVEL"][class*="GRIDNBO"]',
'table[class*="PSLEVEL"][class*="SCROLLAREABODYWBO"]',
'table[class*="PSLEVEL"][class*="SCROLLAREABODYNBO"]',
'table[id*="scroll"]',
'table.PSSRCHRESULTSWBO',
];
var pagers = [
'td.PSGRIDNAVIGATOR',
'td.PSHYPERLINKACTIVE',
'td[align="right"]',
'.PSSRCHRESULTSTITLE',
];
// loop through selectors and initialize pager
ghmob(pagers.join()).each(function() {
if (ghmob(this).find('.PSGRIDCOUNTER, [class*="PTCPGRID"] option:selected, a[id*="$hexcel$"], a[id*="$hmodal$"], a[id*="$hpers$"]').length === 0 || (ghmob(this).find(pagers.join()).length > 0 && ghmob(this).hasClass('PSSRCHRESULTSTITLE') === false)) return;
var thisTable = ghmob(this).closest(tables.join());
if (ghmob(this).hasClass('PSSRCHRESULTSTITLE')) {
thisTable = ghmob(this).parents('table[role="presentation"]').first();
}
if (thisTable.length === 0) return;
ghTable.pagerCreate(thisTable, ghmob(this));
});
},
/**
* pagerCreate
* Create custom pager UI from PeopleSoft table pager
*
* @deprecates ghGridPager
* @param {jQuery} table
* @param {jQuery} pager
* @returns {void}
*/
pagerCreate: function(table, pager) {
// vars
var showMore = ghConfig.table.pagerShowMore;
// ensure jquery object
table = ghUtils.jqElem(table);
pager = ghUtils.jqElem(pager);
if (ghmob(pager).find('.PSGRIDCOUNTER, option:selected, a[id*="$hexcel$"], a[id*="$hmodal$"], a[id*="$hpers$"]').length === 0) return;
// create unique identifier
var id = table.attr('id');
if (typeof id === 'undefined') {
id = table.closest('[id]').attr('id');
}
var pagerId = 'gh-table-pager-' + id;
// create pager wrapper
var newPager = ghmob('<div id="' + pagerId + '"></div>');
// create new pager items from original pager items
var items = 'span, img, a';
pager.find(items).each(function() {
if (ghmob(this).find(items).length > 0) return;
// vars
var pagerItemLink = '#';
var pagerItemClass = 'ui-disabled';
var pagerItemOldText = '';
var pagerItemNewText = '';
// get text
if (ghmob(this).is('span') || ghmob(this).is('a')) {
pagerItemOldText = ghmob(this).text().trim();
if (pagerItemOldText === '' && typeof ghmob(this).attr('title') !== 'undefined') {
pagerItemOldText = ghmob(this).attr('title');
}
}
if (ghmob(this).is('img')) {
pagerItemOldText = ghmob(this).attr('alt');
}
// get link
if (ghmob(this).is('a')) {
pagerItemLink = ghmob(this).attr('href');
pagerItemClass = ' ';
}
if (ghmob(this).parent('a').length > 0) {
pagerItemLink = ghmob(this).parent('a').attr('href');
pagerItemClass = ' ';
}
var pagerItemOldTextLower = pagerItemOldText.toLowerCase();
var pagerHasFirst = (pagerItemOldTextLower.indexOf('first') !== -1);
var pagerHasPrevious = (pagerItemOldTextLower.indexOf('previous') !== -1);
var pagerHasNext = (pagerItemOldTextLower.indexOf('next') !== -1);
var pagerHasLast = (pagerItemOldTextLower.indexOf('last') !== -1);
// check for matching string
if (pagerHasFirst || pagerHasPrevious || pagerHasNext || pagerHasLast) {
// set icon and text based on string match from original text
if (pagerHasFirst) {
pagerItemNewText = '<i class="fa fa-angle-double-left" aria-hidden="true"></i> First';
}
else if (pagerHasPrevious) {
pagerItemNewText = '<i class="fa fa-angle-left" aria-hidden="true"></i> Previous';
}
else if (pagerHasNext) {
pagerItemNewText = 'Next <i class="fa fa-angle-right" aria-hidden="true"></i>';
}
else if (pagerHasLast) {
pagerItemNewText = 'Last <i class="fa fa-angle-double-right" aria-hidden="true"></i>';
}
// create item
var pagerMatchingItem = ghmob(newPager).find('a').filter(function() {
return (ghmob(this).html() === pagerItemNewText);
});
if (pagerMatchingItem.length > 0) return;
if (ghmob(newPager).find('.gh-table-pager').length === 0) {
ghmob(newPager).prepend('<div class="gh-table-pager" role="navigation" id="' + ghmob(newPager).attr('id') + '-pager"><div class="sr-only" id="' + ghmob(newPager).attr('id') + '-pager-lbl">Table Pagination</div><ul></ul></div>');
}
ghmob(newPager).find('.gh-table-pager ul').append('<li><a href="' + pagerItemLink + '" class="' + pagerItemClass + '"id="' + ghmob(newPager).attr('id') + '-pager-' + (ghmob(newPager).find('.gh-table-pager ul li').length + 1) + '">' + pagerItemNewText + '</a></li>');
if (pagerItemClass === 'ui-disabled') {
ghmob(newPager).find('.gh-table-pager ul li').last().find('a').attr('aria-disabled', 'true').attr('tabindex', '-1');
}
}
// create additional block for extra pager items (View, Find, Download)
if (showMore === true) {
// check for matching string
if (pagerItemClass !== 'ui-disabled' && (pagerItemOldText.indexOf('View') !== -1 || pagerItemOldText.indexOf('Find') !== -1 || pagerItemOldText.indexOf('Download') !== -1)) {
// create wrapper and insert into DOM
if (ghmob(newPager).find('.gh-table-pager-more').length === 0) {
ghmob(newPager).append('<div class="gh-table-pager-more" role="navigation" id="' + ghmob(newPager).attr('id') + '-more"><div class="sr-only" id="' + ghmob(newPager).attr('id') + '-more-lbl">Table Options</div><ul></ul></div>');
}
// set text
if (pagerItemOldText.indexOf('Download') === -1) {
pagerItemNewText = pagerItemOldText;
}
else {
pagerItemNewText = 'Download';
}
// create item
ghmob(newPager).find('.gh-table-pager-more ul').append('<li><a href="' + pagerItemLink + '" class="' + pagerItemClass + '" id="' + ghmob(newPager).attr('id') + '-more-' + (ghmob(newPager).find('.gh-table-pager-more ul li').length + 1) + '">' + pagerItemNewText + '</a></li>');
if (pagerItemClass === 'ui-disabled') {
ghmob(newPager).find('.gh-table-pager-more ul li').last().find('a').attr('aria-disabled', 'true');
}
if (ghmob(this).attr('onclick')) {
ghmob(newPager).find('.gh-table-pager-more ul li').last().find('a').attr('onclick', ghmob(this).attr('onclick'));
}
}
}
});
// hide original pager
pager.addClass('gh-hidden').attr('aria-hidden', 'true').closest('table[class*="GRIDLABEL"]').addClass('gh-hidden').attr('aria-hidden', 'true');
// count items
var pagerCounter = ghmob(newPager).find('.gh-table-pager ul li').length;
// check if new pager is empty
if (ghmob(newPager).find('li').length === 0 || ghmob(newPager).find('a:not(.ui-disabled)').length === 0) return;
// add class for CSS display
ghmob(newPager).find('.gh-table-pager').addClass('count-' + pagerCounter);
if (ghmob(newPager.find('.gh-table-pager').length > 0) && ghmob(newPager).find('.gh-table-pager-more').length > 0) {
ghmob(newPager).find('.gh-table-pager').addClass('no-bottom');
}
// put counter in middle of new pager
var pagerMiddle = 1;
if (ghmob(pager).find('.PSGRIDCOUNTER, option:selected').length > 0) {
if (pagerCounter === 2) {
pagerMiddle = 0;
}
if (pagerCounter === 3) {
if (ghmob(newPager).find('.gh-table-pager li:eq(1)').text().trim() === 'Next' && ghmob(newPager).find('.gh-table-pager li:contains("Previous")').length === 0) {
ghmob(newPager).find('.gh-table-pager').removeClass('count-3').addClass('count-4').find('li:eq(1)').before('<li><a href="#" class="ui-disabled" aria-disabled="true" tabindex="-1" id="' + ghmob(newPager).attr('id') + '-pager-' + (ghmob(newPager).find('.gh-table-pager ul li').length + 1) + '"><i class="fa fa-angle-left" aria-hidden="true"></i> Previous</a></li>');
}
if (ghmob(newPager).find('.gh-table-pager li:eq(1)').text().trim() === 'Previous' && ghmob(newPager).find('.gh-table-pager li:contains("Next")').length === 0) {
ghmob(newPager).find('.gh-table-pager').removeClass('count-3').addClass('count-4').find('li:eq(1)').after('<li><a href="#" class="ui-disabled" aria-disabled="true" tabindex="-1" id="' + ghmob(newPager).attr('id') + '-pager-' + (ghmob(newPager).find('.gh-table-pager ul li').length + 1) + '">Next <i class="fa fa-angle-right" aria-hidden="true"></i></a></li>');
}
}
ghmob(newPager).find('.gh-table-pager li:eq(' + pagerMiddle + ')').after('<li>' + pager.find('.PSGRIDCOUNTER, option:selected').text().trim() + '</li>');
}
// insert pager into DOM
var pagerPosition = (typeof ghConfig.table.pagerPosition === 'undefined') ? 'bottom' : ghConfig.table.pagerPosition;
if ((pagerPosition === 'top' || pagerPosition === 'both') && ghmob('[id*="' + pagerId + '-top"]').length === 0) {
ghmob(newPager).clone().attr('id', ghmob(newPager).attr('id') + '-top').insertBefore(table);
}
if ((pagerPosition === 'bottom' || pagerPosition === 'both') && ghmob('[id*="' + pagerId + '-bottom"]').length === 0) {
ghmob(newPager).clone().attr('id', ghmob(newPager).attr('id') + '-bottom').insertAfter(table);
}
// accessibility
this._aria(ghmob('[id^="' + ghmob(newPager).attr('id') + '"]').find('a, [role="navigation"]'));
},
/**
* configureTablesaw
* Configures the Tablesaw plugin
*
* @ignore
* @returns {void}
*/
configureTablesaw: function() {
if (ghConfig.table.tablesawEnabled === true && typeof(Tablesaw) !== 'undefined') {
Tablesaw.config = {
swipe: {
horizontalThreshold: 15,
verticalThreshold: 15,
},
};
}
},
/**
* tablesaw
* Runs setup around the Tablesaw plugin
*
* @deprecates ghApplyTablesaw
* @param {jQuery} table
* @returns {void}
*/
tablesaw: function(table) {
// check if tablesaw is enabled
if (ghConfig.table.tablesawEnabled === false) {
ghmob('table.tablesaw').removeClass('tablesaw');
return;
}
// ensure jquery object
table = ghUtils.jqElem(table);
// ensure headings
if (table.find('> thead').length === 0 || table.find('> thead th').length === 0) return;
// add table classes
table.removeAttr('role').addClass('ui-table tablesaw ghtables-full');
// clean table
ghTable.cleanReflow(table);
// convert persist columns
table.find('[data-tablesaw-priority="persist"]').each(function() {
ghmob(this).removeAttr('data-tablesaw-priority').attr('data-ghtables-persist', 'true');
});
// ghTables
table.ghtables({ mode: 'scroll', scroll: 'cols' });
// select all
ghTable.selectAll(table);
// set focus
if (ghModal.getActiveModal() === false) {
ghAccessibility.setFocus();
}
},
/**
* selectAll
* Applies select all/deselect all UI
*
* @deprecates ghSelectAllGridToggle
* @param {jQuery} table
* @returns {void}
*/
selectAll: function(table) {
// ensure jquery object
table = ghUtils.jqElem(table);
// look for checkbox in first table cell
var cells = table.find('tbody > tr').find('> td, > th').filter(function() {
return ((ghmob(this).is(':first-child') && ghmob(this).find('input[type="checkbox"]').length > 0) || (ghmob(this).prev('td, th').is(':first-child') && ghmob(this).prev('td, th').children().length === 0 && ghmob(this).prev('td, th').text().trim() !== '' && ghmob(this).find('input[type="checkbox"]').length > 0));
});
if (cells.length === 0) return;
var selectBtns = ghmob('input[type="button"][value="Select All"], a:contains("Select All"), input[type="button"][value="Deselect All"], input[type="button"][value="Clear All"], a:contains("Deselect All"), a:contains("Clear All")');
cells.each(function() {
var $this = ghmob(this);
if ($this.attr('[data-gh-enhanced]') === 'false') return;
var $th = $this.closest('table').find('thead > tr > th:eq(' + $this.index() + ')');
var id;
if (typeof $this.closest('table').attr('id') === 'undefined') {
id = $this.closest('[id]').attr('id') + '-select-all';
}
else {
id = $this.closest('table').attr('id') + '-select-all';
}
$th.attr('data-tablesaw-priority', 'persist').attr('data-ghtables-persist', 'true');
var btnText;
var btnIcon;
if (cells.length === cells.find('input[type="checkbox"]:checked').length) {
btnText = 'Deselect All';
btnIcon = 'fa-check-square';
}
else {
btnText = 'Select All';
btnIcon = 'fa-square';
}
if (selectBtns.length > 0 && ($th.text() === '' || $th.text() === 'Select')) {
$th.addClass('gh-select-all').html('<a href="#" id="' + id + '"><i class="fa ' + btnIcon + '"></i> <span>' + btnText + '</span></a>');
}
$this.addClass('gh-select-all');
});
if (ghmob('.gh-select-all').length === 0) return;
// events
this.selectAllEvents();
// hide PeopleSoft select all/deselect all links and buttons
selectBtns.each(function() {
if (ghmob(this).parent('.gh-select-all').length > 0 || ghmob(this).parents('.ps_collection').length > 0) return;
ghmob(this).addClass('gh-hidden').attr('aria-hidden', 'true');
});
},
/**
* selectAllEvents
* Applies select all/deselect all events
*
* @deprecates selectAllEvents
* @ignore
* @returns {void}
*/
selectAllEvents: function() {
ghmob(document).off('click', 'th.gh-select-all a');
ghmob(document).on('click', 'th.gh-select-all a', function(event) {
event.preventDefault();
var $select = ghmob(this);
var thText = '';
var isChecked = true;
if ($select.find('.fa-square').length > 0) {
$select.find('i').removeClass('fa-square').addClass('fa-check-square');
thText = 'Deselect All';
isChecked = false;
}
else {
$select.find('i').removeClass('fa-check-square').addClass('fa-square');
thText = 'Select All';
isChecked = true;
}
$select.find('span').text(thText);
var checkboxes = $select.closest('table').find('.gh-select-all:nth-child(' + ($select.closest('th').index() + 1) + ') input[type="checkbox"]').filter(function() {
return (ghmob(this).is(':checked') === isChecked);
});
checkboxes.trigger('click');
});
},
/**
* hideGridColumn
* Hides a specific table column
*
* @deprecates hideGridColumn
* @param {string} pageName
* @param {string} pageFieldID
* @returns {void}
*/
hideGridColumn: function(pageName, pageFieldID) {
var pageFieldSelector = '[data-pnlname="' + pageName + '"][data-pnlfldid="' + pageFieldID + '"]';
ghmob('th' + pageFieldSelector).hide();
ghmob('div' + pageFieldSelector).closest('td, th').hide();
},
/**
* removeColumnHeader
* Removes a specific column header
*
* @deprecates removeColumnHeader
* @param {jQuery} tableSelector
* @param {int} position
* @returns {void}
*/
removeColumnHeader: function(tableSelector, position) {
var tables = ghUtils.jqElem(tableSelector);
tables.each(function() {
var th = ghmob(this).find('th');
ghmob(th[position]).remove();
});
},
/**
* moveColumn
* Move table column
*
* @param {jQuery} selector
* @param {array} [config]
* @param {bool} [config.delete]
* @param {string} [config.heading]
* @param {int} [config.newIndex]
* @param {int} [config.oldIndex]
* @param {bool} [config.persist]
* @param {bool} [config.rowHeading]
* @returns {void}
*/
moveColumn: function(selector, config) {
// ensure jquery object
selector = ghUtils.jqElem(selector);
// adjust selector if needed
if (selector.is('table') === false) {
selector = selector.find('table').first();
}
selector.children('thead, tbody').children('tr').not('.gh-hidden').each(function() {
var thisRow = ghmob(this);
ghmob.each(config, function(i) {
if (thisRow.find('[data-index-new="' + config[i]['newIndex'] + '"][data-index-old="' + config[i]['oldIndex'] + '"]').length === 0) {
if (i === 0) {
thisRow.children().each(function() {
ghmob(this).attr('data-index-old', ghmob(this).index());
});
}
var cell = thisRow.children('[data-index-old="' + config[i]['oldIndex'] + '"]');
if (config[i]['delete'] && config[i]['delete'] === true) {
cell.remove();
}
else {
if (cell.is('th')) {
var heading = cell;
if (typeof config[i]['heading'] !== 'undefined') {
if (heading.find('a').length > 0) {
heading = heading.find('a').first();
}
var headingChildren = heading.children();
heading.html(config[i]['heading']);
heading.append(headingChildren);
}
if (config[i]['persist'] && config[i]['persist'] === true) {
heading.attr('data-tablesaw-priority', 'persist').attr('data-ghtables-persist', 'true');
}
}
else if (config[i].rowHeading) {
cell.before('<th scope="row"></th>');
var rowHd = cell.prev('th');
cell.children().appendTo(rowHd);
cell.remove();
cell = rowHd;
}
if (cell.index() === config[i]['newIndex']) return;
if (config[i]['newIndex'] > config[i]['oldIndex']) {
cell.attr('data-index-new', config[i]['newIndex']).insertAfter(thisRow.children(':eq(' + config[i]['newIndex'] + ')'));
}
else {
cell.attr('data-index-new', config[i]['newIndex']).insertBefore(thisRow.children(':eq(' + config[i]['newIndex'] + ')'));
}
}
}
});
});
},
/**
* hideEmptyColumns
* Removes a specific column header
*
* @param {jQuery} selector
* @returns {void}
*/
hideEmptyColumns: function(selector) {
if (selector.is('table') === false) {
selector = selector.find('table').first();
}
selector.each(function() {
var header = ghmob(this).find('thead'),
body = ghmob(this).find('tbody'),
hideableArray = [];
header.find('th').each(function(i) {
var hideable = true;
body.find('tr').each(function() {
if (ghmob(this).find('td:eq(' + i + ') div').text().trim() !== '' || ghmob(this).find('td:eq(' + i + ')').find('img').length > 0) {
hideable = false;
}
});
if (hideable) {
hideableArray.unshift(i);
}
});
ghmob.each(hideableArray, function(key, value) {
header.find('th:eq(' + value + ')').remove();
body.find('tr').each(function() {
ghmob(this).find('td:eq(' + value + ')').remove();
});
});
});
},
/**
* rowsToCollapsibles
*
* @param {jQuery} selector
* @param {bool} collapsed
* @returns {void}
*/
rowsToCollapsibles: function(selector, collapsed) {
if (selector.is('table') === false) {
selector = selector.find('.ui-table').first();
}
selector.attr('class', 'gh-row-collapsible-table');
var rowCollapsible;
selector.find('> tbody > tr').each(function(a) {
var heading = ghmob(this).find('a, div[id] > span').filter(function() {
return (ghmob(this).text().trim() !== '' && ghmob(this).is('.ui-btn') === false);
}).first().text().trim();
rowCollapsible = ghmob(this).find('.gh-row-collapsible').first();
ghmob(this).find('> td, > th').each(function(b) {
ghmob(this).removeAttr('style');
if (b === 0) {
if (ghmob(this).find('> .gh-row-collapsible').length === 0) {
if (ghmob(this).children().length > 0) {
ghmob(this).children().wrapAll('<div class="gh-row-collapsible"><div class="ui-field-contain"></div></div>');
}
else {
ghmob(this).html('<div class="gh-row-collapsible"><div class="ui-field-contain">' + ghmob(this).text().trim() + '</div></div>');
}
}
rowCollapsible = ghmob(this).find('> .gh-row-collapsible');
if (ghmob(this).closest('tr').find('select').length === 0 && heading === '') {
heading = ghmob(this).text().trim();
}
}
if (ghmob(this).children().length > 0) {
if (ghmob(this).find('select').length > 0) {
var thisSelect = ghmob(this).find('select').first();
var thisLabel = thisSelect.closest('div[id]').find('label').text().trim();
var change = ghmob('<p class="gh-row-collapsible-change"><a href="#" class="ui-link">Change ' + thisLabel + '</a></p>');
if (ghmob(this).find('.gh-row-collapsible-change').length === 0) {
rowCollapsible.prepend(change);
}
heading = thisSelect.find('option:selected').text().trim();
if (heading === 'Select' || heading === '' || ghmob(this).find('.PSERROR').length > 0) {
if (heading === 'Select' || heading === '') {
heading = 'New ' + thisLabel;
ghmob(this).closest('tr').prependTo(ghmob(this).closest('tbody'));
}
rowCollapsible.attr('data-collapsed', 'false');
thisSelect.closest('div[class="ui-field-contain"]').removeClass('gh-hidden').attr('aria-hidden', 'false');
ghmob(this).closest('tr').find('.gh-row-collapsible-change').addClass('gh-hidden').attr('aria-hidden', 'true');
}
else {
thisSelect.closest('div[class="ui-field-contain"]').addClass('gh-hidden').attr('aria-hidden', 'true');
ghmob(this).closest('tr').find('.gh-row-collapsible-change').removeClass('gh-hidden').attr('aria-hidden', 'false');
}
}
ghmob(this).children().not('.gh-row-collapsible').wrapAll('<div class="ui-field-contain"></div>');
ghmob(this).children('div[class="ui-field-contain"]').appendTo(rowCollapsible);
}
else if (!ghmob.trim(ghmob(this).text())) {
ghmob(this).text('');
}
});
var headingLevel = ghHeader.headingStartLevel();
if (rowCollapsible.find('> h' + headingLevel).length === 0) {
rowCollapsible.prepend('<h' + headingLevel + '>' + heading + '</h' + headingLevel + '>');
}
else {
rowCollapsible.find('> .ui-collapsible-heading .ui-btn-text').text(heading);
}
if (collapsed === false || (ghmob('.gh-active-collapsible').length === 0 && a === 0 && collapsed !== true)) {
rowCollapsible.attr('data-collapsed', 'false');
}
rowCollapsible.collapsible();
ghmob(this).find('> td, > th').find('> b.ui-table-cell-label').remove();
});
// Move buttons to bottom and display inline
ghUtils.delay(function() {
selector.find('> tbody > tr').each(function() {
rowCollapsible = ghmob(this).find('.gh-row-collapsible').first();
ghmob(this).find('.ui-btn').not('.ui-collapsible-heading-toggle').each(function() {
if (ghmob(this).parents('.ui-select').length > 0) return;
ghmob(this).closest('div[class="ui-field-contain"]').find('b.ui-table-cell-label').remove();
ghmob(this).closest('div[class="ui-field-contain"]').removeClass('ui-field-contain').addClass('ui-btn-inline').appendTo(rowCollapsible.find('> .ui-collapsible-content'));
});
});
});
// Show type selection when 'Change Type' anchor is clicked
ghmob(document).on('click', '.gh-row-collapsible-change a', function(event) {
event.preventDefault();
ghmob(this).closest('.gh-row-collapsible').find('select').first().closest('.ui-field-contain.gh-hidden').removeClass('gh-hidden').attr('aria-hidden', 'false');
ghmob(this).parent('p').addClass('gh-hidden').attr('aria-hidden', 'true');
});
// Update the collapsible label when a new type is selected
ghmob(document).on('change', '.gh-row-collapsible select', function() {
var thisLabel = ghmob(this).closest('div[id]').find('label').text().trim();
var thisChange = ghmob(this).closest('.gh-row-collapsible').find('.gh-row-collapsible-change').text().trim().replace('Change ', '');
if (thisLabel !== thisChange || ghmob(this).val() === '') return;
ghmob(this).closest('.gh-row-collapsible').find('> .ui-collapsible-heading').find('.ui-btn-text').text(ghmob(this).children('option:selected').text().trim());
ghmob(this).closest('tr').find('.gh-row-collapsible-change').removeClass('gh-hidden').attr('aria-hidden', 'false');
ghmob(this).closest('div[id]').addClass('gh-hidden').attr('aria-hidden', 'true');
});
},
/**
* tablesawInit
*
* @ignore
* @param {jQuery} scope
* @returns {void}
*/
tablesawInit: function(scope) {
ghmob('.gh-tablesaw', scope).each(function() {
if (ghmob(this).find('> thead').length === 0 || ghmob(this).find('> thead th').length === 0) {
ghmob(this).removeClass('gh-tablesaw');
return;
}
if (ghmob(this).parents('.gh-tablesaw').length > 0) return;
ghTable.tablesaw(ghmob(this));
});
var heirarchyGrid = ghmob('[href*="EXPCOLLCONTROL"], [onclick*="EXPCOLLCONTROL"]', scope).closest('.ui-table');
heirarchyGrid.each(function() {
if (ghmob(this).find('> thead').length === 0 || ghmob(this).find('> thead th').length === 0 || ghmob(this).parents('.gh-tablesaw').length > 0) return;
ghmob(this).find('> thead th').first().attr('data-ghtables-persist', 'true');
ghTable.tablesaw(ghmob(this));
});
},
/**
* listviewInit
*
* @ignore
* @param {jQuery} scope
* @returns {void}
*/
listviewInit: function(scope) {
var listviews = ghmob('[data-gh-listview="true"]', scope);
if (typeof scope !== 'undefined') {
var scopeListviews = ghmob(scope).filter(function() {
return (ghmob(this).is('[data-gh-listview="true"]'));
});
listviews = listviews.add(scopeListviews);
}
listviews.each(function() {
if (ghmob(this).find('.gridformatter').length === 0) {
ghmob(this).children().wrapAll('<div class="gridformatter-wrap"></div>');
ghmob(this).find('.gridformatter-wrap').gridFormatter();
}
});
},
/**
* overflowInit
*
* @ignore
* @param {jQuery} scope
* @returns {void}
*/
overflowInit: function(scope) {
var overflows = ghmob('[data-gh-overflow="true"]', scope);
if (typeof scope !== 'undefined') {
var scopeOverflows = ghmob(scope).filter(function() {
return (ghmob(this).is('[data-gh-overflow="true"]'));
});
overflows = overflows.add(scopeOverflows);
}
overflows.each(function() {
ghTable._tableInit(ghmob(this).find('.ui-table').first(), { type: 'overflow' });
});
},
/**
* tableInit
*
* @private
* @param {jQuery} selector
* @param {obj} [config]
* @param {string} [config.type] ('reflow', 'overflow', 'tablesaw')
* @returns {void}
*/
_tableInit: function(selector, config) {
this.cleanLabels(selector);
this.cleanCells(selector);
this.cleanRows(selector);
this.removeEmptyColumns(selector);
if (ghAccessibility.formTypes(selector).length > 0) {
ghAccessibility.missingLabels(selector);
}
if (typeof config === 'object') {
if (typeof config.type !== 'undefined' && config.type === 'overflow') {
if (selector.parents('div[data-overflow]').length === 0) {
selector.wrapAll('<div data-overflow="true"><div tabindex="0"></div></div>');
selector.closest('div[data-overflow]').append('<div class="indicator left hide" aria-hidden="true"></div>');
selector.closest('div[data-overflow]').append('<div class="indicator right" aria-hidden="true"></div>');
}
else {
selector.closest('div[data-overflow]').attr('data-overflow', 'true').children('div:not(.indicator)').attr('tabindex', '0');
}
if (selector.closest('div[data-overflow]').width() >= selector.width()) {
selector.closest('div[data-overflow]').find('> div.indicator').addClass('gh-hidden');
}
else {
selector.closest('div[data-overflow]').find('> div.indicator').removeClass('gh-hidden');
}
this._overflowScroll();
}
if (typeof config.type !== 'undefined' && config.type === 'tablesaw') {
this.tablesaw(selector);
}
}
},
/**
* overflowScroll
*
* @private
* @returns {void}
*/
_overflowScroll: function() {
ghmob('div[data-overflow="true"] > div:not(.indicator)').on('scroll.ghTable.overflowScroll', function(event) {
var obj = event.currentTarget;
var sel = ghmob(obj);
if (obj.scrollLeft >= Math.floor(sel.find('.ui-table').width() - sel.width()) - 15) {
sel.closest('div[data-overflow="true"]').find('.indicator.right').addClass('hide');
}
else {
sel.closest('div[data-overflow="true"]').find('.indicator.right').removeClass('hide');
}
if (obj.scrollLeft <= 15) {
sel.closest('div[data-overflow="true"]').find('.indicator.left').addClass('hide');
}
else {
sel.closest('div[data-overflow="true"]').find('.indicator.left').removeClass('hide');
}
});
},
/**
* overflowResize
*
* @private
* @returns {void}
*/
_overflowResize: function() {
ghmob('div[data-overflow="true"]').each(function() {
var sel = ghmob(this).find('> div:not(.indicator)');
if (ghmob(this).width() >= sel.find('.ui-table').width()) {
ghmob(this).find('> div.indicator').addClass('gh-hidden');
}
else {
ghmob(this).find('> div.indicator').removeClass('gh-hidden');
sel.trigger('scroll');
}
});
},
/**
* tableDestroy
*
* @private
* @param {jQuery} selector
* @returns {void}
*/
_tableDestroy: function(selector) {
selector.removeClass('tablesaw');
selector.closest('div[data-overflow]').attr('data-overflow', 'false').children('div:not(.indicator)').attr('tabindex', '-1');
},
/**
* _eventBindings
*
* @private
* @returns {void}
*/
_eventBindings: function() {
ghmob(document)
.off('tablecreate.ghTable.tableInit refresh.ghTable.tableInit')
.on('tablecreate.ghTable.tableInit refresh.ghTable.tableInit', '.ui-table', function(event, config) {
ghLog.event('tablecreate.ghTable.tableInit refresh.ghTable.tableInit');
ghTable._tableInit(ghmob(event.currentTarget), config);
});
ghmob(document)
.off('ghtables-destroy.ghTable.destroy')
.on('ghtables-destroy.ghTable.destroy', 'table.ghtables', function(event) {
ghLog.event('ghtables-destroy.ghTable.destroy');
ghTable._tableDestroy(ghmob(event.currentTarget));
});
ghmob(window)
.off('throttledresize.ghTable.overflowResize')
.on('throttledresize.ghTable.overflowResize', function() {
ghLog.event('throttledresize.ghTable.overflowResize');
ghTable._overflowResize();
});
},
/**
* onPageBeforeCreate
*
* @ignore
* @returns {void}
*/
onPageBeforeCreate: function() {
if (ghConfig.table.enabled === false) return;
this._jqmTables();
},
/**
* jqmTables
*
* @private
* @returns {void}
*/
_jqmTables: function() {
ghmob.fn.table = function(config) {
ghTable.create(ghmob(this), config);
};
},
/**
* create
*
* @param {jQuery} tables
* @param {obj} [config]
* @param {string} [config.type] ('reflow', 'overflow', 'tablesaw')
* @returns {void}
*/
create: function(tables, config) {
tables = ghmob(tables).filter(function() {
return (ghmob(this).is('table') && ghmob(this).find('th').length > 0);
});
tables.each(function() {
ghTable._tableInit(ghmob(this), config);
});
},
/**
* run
*
* @ignore
* @param {jQuery} [scope=document]
* @returns {void}
*/
run: function(scope) {
scope = scope ? scope : document;
if (ghConfig.table.enabled === false) return;
this._eventBindings();
this.pagerInit(scope);
this.cleanInit(scope);
this.tablesawInit(scope);
this.listviewInit(scope);
this.overflowInit(scope);
},
/**
* Extensions
*
* @submodule
* @type {obj}
*/
$extensions: {
/**
* Fluid
*
* @submodule
* @type {obj}
*/
fluid: {
/**
* listviewInit
*
* @ignore
* @param {jQuery} scope
* @returns {void}
*/
listviewInit: function(scope) {
ghmob('.gh-list-view', scope).parent().each(function() {
ghmob(this).gridFormatter({rowSelector: 'table tr[id]'});
});
},
},
},
};
ghInit.module('ghTable');
// turn off tablesaw plugin
ghmob.fn.tablesaw = function() {
return;
};
/**
* ghSubmenu
* Provides methods for submenus
*
* @module ghSubmenu
* @config action ['dropdown', 'popup']
* @config columnToggle [true, false]
* @config container.button.color ['info', 'success', 'warning', 'danger', 'primary']
* @config container.button.icons.collapse ['fa-angle-up']
* @config container.button.icons.expand ['fa-angle-down']
* @config container.button.icons.position ['left', 'right']
* @config container.button.label.show [true, false]
* @config container.button.label.text ['View']
* @config container.button.position ['left', 'right']
* @config displayOnHomepage [true, false]
* @config enabled [true, false]
* @config pageTabs.button.icons.collapse ['fa-times']
* @config pageTabs.button.icons.expand ['fa-bars']
* @config pageTabs.button.icons.position ['left', 'right']
* @config pageTabs.button.label.show [true, false]
* @config pageTabs.button.label.text ['Menu']
* @config pageTabs.menu.icons.enabled [true, false]
* @config pageTabs.responsive.enabled [true, false]
* @config pageTabs.responsive.heading ['In This Section']
* @config sort.button.icons.collapse ['fa-sort']
* @config sort.button.icons.expand ['fa-sort']
* @config sort.button.icons.position ['left', 'right']
* @config sort.button.label.show [true, false]
* @config sort.button.label.text ['Sort By']
*/
var ghSubmenu = ghSubmenu || {
/**
* tableTabSelectors
* Array of all the plausible selectors for creation of table tabs
*
* @ignore
* @type {array}
*/
tableTabSelectors: [
'#PSTABNBO',
'#PTGRIDTAB',
'.PTGRIDTAB',
'[name="hidetabs"]',
'table[id*="scroll"] tr[role="tablist"]',
],
/**
* pageTabSelectors
* Array of all the plausible selectors for creation of page tabs
*
* @ignore
* @type {array}
*/
pageTabSelectors: [
'[data-pnlname*="NAV_SUBTABS"] [data-role="navbar"]',
'[id^="win"][id*="divPSPANELTAB"]',
'[id^="win"][id$="divDERIVED_SSTSNAV_SSTS_NAV_SUBTABS"]',
'.eoawActionPanelTxns',
'[id*="PANEL"][id*="_NAV"]',
'[id*="NAV_TAB"]',
],
/**
* getPageTabs
*
* @ignore
* @param {bool} findAll
* @returns {jQuery}
*/
_getPageTabs: function(findAll) {
var pageTabs = document.querySelectorAll('.gh-page-header-wrap .gh-submenu.pagetabs');
if (findAll) {
pageTabs = document.querySelectorAll('.gh-submenu.pagetabs');
}
return ghmob(pageTabs);
},
/**
* getSubmenuItems
* Gets items to be appeneded to the submenu
*
* @private
* @param {jQuery} selector
* @returns {jQuery}
*/
_getSubmenuItems: function(selector) {
return selector.find('li, td.ssstabactive, td.ssstabinactive, td.SSSTABACTIVE, td.SSSTABINACTIVE, table.PSACTIVETAB, table.PSINACTIVETAB, div[onclick], div.psa_vtab, .pthomepagetabactive, .pthomepagetabinactive, tr[role="tablist"] > td');
},
/**
* drawSecondaryLevelItems
* Draws secondary menu items under the appropriate grouping
*
* @private
* @param {jQuery} thisItem
* @param {jQuery} $this
* @returns {void}
*/
_drawSecondaryLevelItems: function(thisItem, $this) {
var _this = this;
var action = ghConfig.submenu.action;
var secondaryMenu = $this.closest('table[id*="GROUP_BOX"]').find('[data-role="navbar"]').filter(function() {
return (ghmob(this).find('li').length > 0 && ghmob(this).find('.ui-btn-active').text() !== $this.find('.ui-btn-active').text());
}).first();
if (thisItem.hasClass('active') && secondaryMenu.length > 0) {
if (action === 'popup') {
thisItem.find('.ui-collapsible').append('<ul class="gh-listview"></ul>');
}
else {
thisItem.append('<ul></ul>');
}
secondaryMenu.find('li').each(function(a) {
thisItem.find('ul').append('<li><a href="' + _this.forceSubmitActionToTop(ghmob(this).find('a').attr('href')) + '">' + ghmob(this).find('a').text() + '</a></li>');
if (ghPage.isTargetContent() === false) {
thisItem.find('ul > li:last-child a').attr('target', 'gh-top');
}
if (ghmob(this).find('a').hasClass('ui-btn-active')) {
thisItem.find('ul li:eq(' + a + ')').addClass('active').find('> a').attr('aria-current', 'page').attr('title', 'current page');
thisItem.find('ul li:eq(' + a + ')').parents('li.active').find('> a').removeAttr('aria-current title');
}
});
secondaryMenu.attr('aria-hidden', 'true').addClass('gh-hidden subtabs');
}
},
/**
* drawBubbleCounter
* Draws the bubble counter for items with numeric values
*
* @private
* @param {jQuery} thisItem
* @param {jQuery} $this
* @returns {void}
*/
_drawBubbleCounter: function(thisItem, $this) {
if ($this.find('.ps_box-value').length === 0 || $this.hasClass('ps_ag-step-button') || $this.find('.ps_ag-step-button').length > 0 || $this.hasClass('ps_ag-step-group-button') || $this.find('> .psa_has_vsubtabs').length > 0 || $this.find('div[onclick] .ps_box-value').length > 0) return;
var counterValue = $this.find('.ps_box-value').first().text().trim();
if (counterValue === '') return;
if (counterValue.indexOf('.') > -1) {
counterValue = counterValue.substring(0, counterValue.indexOf('.'));
}
thisItem.find('a').append('<span class="ui-icon ui-icon-bubble ui-icon-shadow">' + counterValue + '</span>');
},
/**
* setActive
* Sets the active page tab
*
* @private
* @param {jQuery} $this
* @param {bool} closeMenu
* @returns {void}
*/
_setActive: function($this, closeMenu) {
if (typeof $this.attr('href') === 'undefined' && typeof $this.attr('onclick') === 'undefined') return;
this._getPageTabs(true).each(function() {
var activeLink = ghmob(this).find('li > a').filter(function() {
return (ghmob(this).text().trim() === $this.text().trim());
});
activeLink.closest('.menu').find('.active').removeClass('active').find('> a').removeAttr('aria-current title');
activeLink.closest('li').addClass('active').find('> a').attr('aria-current', 'page').attr('title', 'current page');
if (closeMenu === true && ghmob(this).hasClass('active')) {
ghmob(this).find('.toggle').trigger('click');
}
});
if (typeof this._getPageTabs().attr('data-session') !== 'undefined') {
this._saveToSession(this._getPageTabs());
}
},
/**
* getActive
* Sets the active page tab
*
* @private
* @param {jQuery} selector
* @returns {jQuery}
*/
_getActive: function(selector) {
var items = this._getSubmenuItems(selector);
var activeItem = items.filter(function() {
return (ghmob(this).find('a.ui-btn-active').length > 0 || ghmob(this).hasClass('SSSTABACTIVE') || ghmob(this).hasClass('ssstabactive') || ghmob(this).hasClass('PSACTIVETAB') || (typeof ghmob(this).attr('class') !== 'undefined' && ghmob(this).attr('class').indexOf('_selected') > -1) || (typeof ghmob(this).attr('class') !== 'undefined' && ghmob(this).attr('class').indexOf('_active') > -1) || ghmob(this).find('.psc_selected, .selected').length > 0 || ghmob(this).find('[aria-selected]').length > 0);
}).first();
return activeItem;
},
/**
* matchActive
* Sets the active page tab
*
* @private
* @param {jQuery} selector
* @returns {jQuery}
*/
_matchActive: function(selector) {
var pageTabs = this._getPageTabs();
var activeItem = this._getActive(selector);
var activeLink;
if (activeItem.length === 0) {
activeLink = pageTabs.find('.menu > ul > li:first-child > a');
}
else {
activeLink = pageTabs.find('.menu li > a:contains(' + activeItem.text().trim() + ')');
}
return activeLink;
},
/**
* pageTabs
* Create submenu from PeopleSoft page tabs (campus environments only)
*
* @deprecates tabsToSubmenu
* @param {jQuery} selector
* @param {bool} saveToSession
* @returns {void}
*/
pageTabs: function(selector, saveToSession) {
var _this = this;
// ensure jquery object
selector = ghUtils.jqElem(selector);
if (selector.length === 0) return;
// prevent duplicate submenus
var pageTabs = this._getPageTabs();
var pageTabSelectors = ghmob(this.pageTabSelectors.join());
var activeLink = this._matchActive(selector);
var items = this._getSubmenuItems(selector);
var activeItems = this._getActive(selector);
// return conditions
if (items.text().trim() === '' || selector.find('.pts_facets').length > 0 || selector.hasClass('subtabs') || selector.find('input[type="text"], select').length > 0 || selector.parents(ghSubmenu.pageTabSelectors.join()).find('input[type="text"], select').length > 0) return;
if (saveToSession && pageTabs.length > 0 && pageTabs.find('li').length > 0 && pageTabSelectors.length === 0) {
this._setActive(activeLink);
this.showAsColumn(pageTabs.find('.menu ul'));
return;
}
if (items.length === 0 && pageTabSelectors.not('.gh-hidden').length === 0) {
this._insertFromSession();
return;
}
pageTabs.remove();
// check if the selector only contains current page links
if (selector.find('a:not([href="#"]):not([aria-current="page"])').length === 0 && selector.find('li[onclick], div[onclick]').length === 0 && selector.find('a[disabled="disabled"]').length === 0) return;
// vars
var action = ghConfig.submenu.action;
var headingLevel = ghHeader.headingStartLevel();
// make page header, if missing
if (ghmob('.gh-page-header-wrap').length === 0) {
ghHeader.pageHeaderWrapper();
}
// get submenu html
var submenu = ghSubmenu.create('pageTabs');
// create and add unique identifier
var submenuId = 'gh-submenu-' + Math.round(Math.random() * 10000);
submenu = ghmob(submenu).addClass('pagetabs').attr('id', submenuId);
// insert submenu into DOM
if (items.length === activeItems.length) return;
ghmob('.gh-page-header-wrap').append(submenu);
pageTabs = this._getPageTabs();
// configuration based on action
if (action === 'popup') {
pageTabs.addClass('popup');
pageTabs.find('.toggle').attr('data-rel', 'popup').attr('data-position-to', 'window');
pageTabs.find('.menu').attr('data-role', 'popup').attr('data-overlay-theme', 'b').append('<a href="#" data-rel="back" class="ui-popup-close"><i class="fa fa-close"></i> <span>Close</span></a>');
pageTabs.find('.menu').prepend('<div class="ui-header" data-role="header" data-theme="b"><h' + headingLevel + ' role="heading" class="ui-title">Menu</h' + headingLevel + '></div>');
pageTabs.find('.menu ul').addClass('gh-listview');
}
else {
pageTabs.addClass('dropdown');
}
// get tabs and append to submenu as list items and links
items.each(function(i) {
var $this = ghmob(this);
if ($this.hasClass('ps_ag-step')) {
$this = $this.find('.ps_ag-step-button').first();
}
if ($this.hasClass('ps_ag-step-group')) {
$this = $this.find('.ps_ag-step-group-button').first();
}
var noAction = $this.find('a:not([href="#"])').length === 0 && !$this.attr('onclick') && $this.find('a[disabled="disabled"]').length === 0 && $this.hasClass('pthomepagetabactive') === false;
if ($this.text().trim() === 'Select' || $this.text().trim() === '' || noAction) return;
var thisText = $this.find('a .ps-text, a .ps-link, div[onclick] .ps_box-value').length > 0 ? $this.find('a .ps-text, a .ps-link, div[onclick] .ps_box-value').first().text().trim() : $this.find('a').first().text().trim();
if ($this.hasClass('pthomepagetabactive') && thisText === '') {
thisText = $this.text().trim();
}
if (($this.hasClass('ps_ag-step-button') || $this.hasClass('ps_ag-step-group-button')) && thisText === '') {
thisText = $this.find('.ps_ag-step-link-label .ps_box-value').text().trim();
}
if (thisText === '' || $this.parents('[data-gh-submenu-item-original]').length > 0) return;
$this.attr('data-gh-submenu-item-original', i);
var thisItem = ghmob('<li></li>');
if (action === 'popup') {
thisItem.append('<div class="ui-collapsible" data-role="collapsible" data-iconpos="right"><h' + headingLevel + '>' + thisText + '</h' + headingLevel + '></div>');
}
else {
thisItem.append('<a href="#">' + thisText + '</a>');
if (ghPage.isTargetContent() === false) {
thisItem.find('a').attr('target', 'gh-top');
}
var anchor = $this.find('a, [onclick]').not('[href="javascript:void(0);"]').first();
if ($this.is(activeItems)) {
thisItem.addClass('active').find('> a').attr('aria-current', 'page').attr('title', 'current page');
}
if ($this.hasClass('psa_has_vsubtabs') || $this.find('> .psa_vtab').not('.psc_rowact').length > 0 || $this.hasClass('psc_collapsible') || $this.hasClass('ps_ag-step-group-button') || $this.find('a[disabled], a.ui-disabled').length > 0) {
thisItem.find('a').addClass('ui-disabled');
}
else if (anchor.length > 0) {
if (typeof anchor.attr('href') !== 'undefined' && anchor.attr('href') !== '') {
thisItem.find('a').attr('href', _this.forceSubmitActionToTop(anchor.attr('href')));
}
if (typeof anchor.attr('onclick') !== 'undefined') {
thisItem.find('a').attr('onclick', _this.forceSubmitActionToTop(anchor.attr('onclick').replace('this.id', '\'' + anchor.attr('id') + '\'')));
if (anchor.attr('onclick').indexOf('LaunchURL') > -1 && anchor.attr('onclick').indexOf(', 1') > -1) {
thisItem.find('a').attr('href', '#');
}
}
}
else if ($this.hasClass('ps_ag-step-button')) {
if (typeof $this.attr('href') !== 'undefined' && $this.attr('href') !== '') {
thisItem.find('a').attr('href', _this.forceSubmitActionToTop($this.attr('href')));
}
if (typeof $this.attr('onclick') !== 'undefined') {
thisItem.find('a').attr('onclick', _this.forceSubmitActionToTop($this.attr('onclick').replace('this.id', '\'' + $this.attr('id') + '\'')));
if ($this.attr('onclick').indexOf('LaunchURL') > -1 && $this.attr('onclick').indexOf(', 1') > -1) {
thisItem.find('a').attr('href', '#');
}
}
if ($this.hasClass('psc_selected')) {
thisItem.addClass('active').find('> a').attr('aria-current', 'page').attr('title', 'current page');
}
}
else if (typeof $this.attr('onclick') !== 'undefined') {
thisItem.find('a').attr('onclick', _this.forceSubmitActionToTop($this.attr('onclick').replace('this.id', '\'' + $this.attr('id') + '\'')));
if ($this.attr('onclick').indexOf('LaunchURL') > -1 && $this.attr('onclick').indexOf(', 1') > -1) {
thisItem.find('a').attr('href', '#');
}
}
}
var icons = $this.find('img').not('[src*="PT_ACCORD_OPEN"], [src*="PT_ACCORD_CLOSE"]');
if (ghConfig.submenu.pageTabs.menu.icons.enabled === true && icons.length > 0) {
thisItem.find('a').prepend('<img src="' + icons.first().attr('src') + '" aria-hidden="true" />');
}
pageTabs.find('.menu > ul').append(thisItem);
ghSubmenu._drawBubbleCounter(thisItem, $this);
ghSubmenu._drawSecondaryLevelItems(thisItem, $this);
});
// add active class to first item
if (pageTabs.find('li.active').length === 0) {
pageTabs.find('.menu > ul > li:first-child').addClass('active').find('> a').attr('aria-current', 'page').attr('title', 'current page');
}
// column
this.showAsColumn(pageTabs.find('.menu ul'));
// hide tabs
selector.attr('aria-hidden', 'true').addClass('gh-hidden');
// events
this.addEvent(pageTabs);
// save in session storage
if (saveToSession) {
pageTabs.attr('data-session', 'true');
this._saveToSession(pageTabs);
}
},
/**
* showAsColumn
*
* @param {jQuery} selector
* @returns {void}
*/
showAsColumn: function(selector) {
var config = typeof ghConfig.submenu.pageTabs !== 'undefined' && typeof ghConfig.submenu.pageTabs.responsive !== 'undefined';
var disabled = config && ghConfig.submenu.pageTabs.responsive.enabled === false;
if (ghmob('.isHomepage').length > 0 || ghmob('.isLogin').length > 0) return;
var content = ghmob('.ps_pagecontainer').first();
if (ghPage.isFluid()) {
content = ghmob('[id*="divPAGECONTAINER_TGT"] .ps_pspagecontainer, .ps_pagecontainer').filter(function() {
return (ghmob(this).find('.ps_pspagecontainer.psc_hidden').length === 0);
}).first();
}
if (content.length === 0 || disabled || ghPage.getName() === 'SSS_STUDENT_CENTER') {
ghmob('.gh-has-submenu-cols').removeClass('gh-has-submenu-cols');
content.children('.gh-submenu.pagetabs').addClass('gh-hidden').attr('aria-hidden', 'true');
return;
}
if (content.children().length > 1 && content.children('.gh-submenu-cols-wrap').length === 0) {
content.children().not('.gh-filter, .gh-submenu, .gh-progress-nav').wrapAll('<div class="gh-submenu-cols-wrap"></div>');
}
if (content.children('.gh-submenu.pagetabs').length === 0) {
content.append('<div class="gh-submenu pagetabs"></div>');
}
var heading = ghConfig.submenu.pageTabs.responsive.heading;
if (content.children('.gh-submenu.pagetabs').children().length === 0) {
var headingLevel = ghHeader.headingStartLevel(content);
content.children('.gh-submenu.pagetabs').append('<div class="ui-body"><h' + headingLevel + ' class="ui-bar">' + heading + '</h' + headingLevel + '><div class="menu" role="navigation" aria-label="' + heading + '"><ul>' + selector.html() + '</ul></div></div>');
}
else {
content.children('.gh-submenu.pagetabs').find('> .ui-body > .ui-bar').text(heading);
content.children('.gh-submenu.pagetabs').find('> .ui-body > .menu').attr('aria-label', heading);
}
ghmob('body').addClass('gh-has-submenu-cols');
content.addClass('gh-submenu-cols').attr('data-cols', content.children('[class^="gh-"]:not(.gh-hidden)').length);
content.children('.gh-submenu.pagetabs').removeClass('gh-hidden').removeAttr('aria-hidden');
},
/**
* saveToSession
*
* @private
* @param {jQuery} selector
* @returns {void}
*/
_saveToSession: function(selector) {
if (ghPage.isSearch()) return;
try {
if (typeof Storage !== 'undefined') {
var thisHTML = ghmob('<div />').html(selector.clone()).html();
var thisComponent = ghPage.getComponentMenu();
if (thisComponent === undefined) return;
sessionStorage.setItem('submenu-' + thisComponent, thisHTML);
}
}
catch (err) {
ghLog.info('Unable to save submenu content. No session storage.');
}
},
/**
* insertFromSession
*
* @private
* @returns {void}
*/
_insertFromSession: function() {
try {
if (typeof Storage !== 'undefined') {
var pageTabs = this._getPageTabs();
var thisComponent = ghPage.getComponentMenu();
if (thisComponent === undefined || (ghmob('.isHomepage').length === 0 && thisComponent === 'NUI_FRAMEWORK') || ghPage.getName() === 'SSS_STUDENT_CENTER') return;
var sessionData = sessionStorage.getItem('submenu-' + thisComponent);
if (sessionData === null) return;
if (pageTabs.length === 0) {
if ((ghPage.isIFrame() === false || ghPage.isActivityGuide()) && ghmob(sessionData).find('a[href*="http"]').length === 0) return;
ghmob('.gh-page-header-wrap').append(sessionData);
pageTabs = this._getPageTabs();
this.addEvent(pageTabs);
}
this._setActiveFromPageHeadings();
// column
this.showAsColumn(pageTabs.find('.menu ul'));
}
}
catch (err) {
ghLog.info('Unable to get submenu content. No session storage.');
}
},
/**
* setActiveFromPageHeadings
*
* @private
* @returns {void}
*/
_setActiveFromPageHeadings: function() {
this._getPageTabs(true).find('.menu li').each(function() {
var thisText = ghmob(this).find('> a').text().trim();
var headerMatch = ghmob('.gh-page-header-headings').find(ghHeader.headings.join()).filter(function() {
return (ghmob(this).text().trim() === thisText);
});
if (headerMatch.length > 0) {
ghmob(this).addClass('active').find('> a').attr('aria-current', 'page').attr('title', 'current page');
ghmob(this).siblings('li').removeClass('active').find('> a').removeAttr('aria-current title');
}
});
if (typeof this._getPageTabs().attr('data-session') !== 'undefined') {
this._saveToSession(this._getPageTabs());
}
},
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
if (ghmob(this).hasClass('gh-hidden') || ghmob(this).find(ghSubmenu.tableTabSelectors.join()).not('a').length > 0 || ghmob(this).parents('.ptalPgltAreaGroupsBar,' + ghSubmenu.tableTabSelectors.join()).length > 0) return;
// make column toggle
var columnToggleOld;
var columnToggleNew = '';
if (ghConfig.submenu.columnToggle === true) {
// old toggle
if (ghmob(this).is('a[name="hidetabs"]')) {
columnToggleOld = ghmob(this);
}
else {
columnToggleOld = ghmob(this).find('[name="hidetabs"]');
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
}
else {
submenuItemLink = '#';
}
ghmob(submenu).find('li:last-child a').attr('href', _this.forceSubmitActionToTop(submenuItemLink));
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
}
else {
submenuParentHeading = submenuParentHeading.text().trim();
}
// create container and place it inside closest collapsible content
if (submenuParent.children('.gh-submenu-wrap').length === 0) {
submenuParent.children('.ui-collapsible-heading').wrapAll('<div class="gh-submenu-wrap"></div>');
submenu.appendTo(submenuParent.children('.gh-submenu-wrap'));
}
else if (submenuParentHeading.indexOf(submenuActiveHeading) === -1) {
submenuParent = submenuParent.children('.ui-collapsible-content');
ghSubmenu.createContainer(submenu, submenuParent, submenuActiveHeading);
}
}
else {
if (ghmob(this).closest('div[class="ui-body"]').length > 0 || ghmob(this).find('div[class="ui-body"]').length > 0) {
if (ghmob(this).closest('div[class="ui-body"]').length > 0) {
submenuParent = ghmob(this).closest('div[class="ui-body"]');
}
if (ghmob(this).find('div[class="ui-body"]').length > 0) {
submenuParent = ghmob(this).find('div[class="ui-body"]').first();
}
}
else {
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
}
else {
columnToggleNew.insertAfter(submenuParent.children('.gh-submenu-wrap'));
}
}
});
}
}
// hide tabs
ghmob(this).addClass('gh-hidden').attr('aria-hidden', 'true');
});
},
/**
* createContainer
* Create container for submenu
*
* @ignore
* @param {string} submenu
* @param {jQuery} submenuParent
* @param {string} submenuHeading
* @returns {void}
*/
createContainer: function(submenu, submenuParent, submenuHeading) {
if (submenuParent.attr('data-submenu') === 'true' || submenuParent.children('div[data-submenu="true"]').length !== 0) return;
// make container
if (submenuParent.is('div[class="ui-body"]')) {
submenuParent.attr('data-submenu', 'true');
if (submenuParent.children('.gh-submenu-wrap').length === 0) {
submenuParent.children('.ui-bar').wrapAll('<div class="gh-submenu-wrap"></div>');
}
submenuHeading = submenuParent.children('.gh-submenu-wrap .ui-bar').text().trim();
}
else {
var headingLevel = ghHeader.headingStartLevel();
submenuParent.children().not('[class="ui-bar"]').wrapAll('<div class="ui-body" data-submenu="true"></div>');
submenuParent.children('div[data-submenu="true"]').prepend('<div class="gh-submenu-wrap"><h' + headingLevel + ' class="ui-bar">' + submenuHeading + '</h' + headingLevel + '></div>');
}
if (typeof submenuHeading !== 'undefined' || submenuHeading !== '') {
submenu.attr('aria-label', submenuHeading + ' ' + submenu.attr('aria-label'));
if (submenu.find('.toggle .visually-hidden').length === 0) {
submenu.find('.toggle').append(' <span class="visually-hidden">' + submenuHeading + ' Options</span>');
}
}
submenu.appendTo(submenuParent.find('.gh-submenu-wrap').first());
},
/**
* create
* Create and return HTML structure for submenu
*
* @deprecates makeSubmenu
* @param {string} [type]
* @param {obj} [config]
* @param {obj} [config.button]
* @param {string} [config.button.color]
* @param {obj} [config.button.icons]
* @param {string} [config.button.icons.expand]
* @param {string} [config.button.icons.position]
* @param {obj} [config.button.label]
* @param {string} [config.button.label.show]
* @param {string} [config.button.label.text]
* @param {string} [config.button.position]
* @param {jQuery} [selector]
* @returns {string}
*/
create: function(type, config, selector) {
if (typeof config === 'string') {
type = config;
config = undefined;
}
if (typeof type === 'undefined' || typeof type === 'number') {
type = 'container';
}
var count = ghmob('.gh-submenu').length + 1;
var action = ghConfig.submenu.action;
config = (typeof config === 'object') ? config : ghConfig.submenu[type];
var labelText = (typeof config.button === 'undefined' || typeof config.button.label === 'undefined' || typeof config.button.label.text === 'undefined') ? '' : config.button.label.text;
var position = (typeof config.button === 'undefined' || typeof config.button.position === 'undefined') ? 'position-right' : 'position-' + config.button.position;
var buttonClasses = '';
if (typeof config.button !== 'undefined' && typeof config.button.icons !== 'undefined' && typeof config.button.icons.expand !== 'undefined') {
buttonClasses = buttonClasses + ' ' + config.button.icons.expand;
}
if (typeof config.button !== 'undefined' && typeof config.button.icons !== 'undefined' && typeof config.button.icons.position !== 'undefined') {
buttonClasses = buttonClasses + ' ui-icon-' + config.button.icons.position;
}
if (typeof config.button !== 'undefined' && typeof config.button.label !== 'undefined' && typeof config.button.label.show !== 'undefined') {
buttonClasses = buttonClasses + ' label-' + config.button.label.show;
}
if (typeof config.button !== 'undefined' && typeof config.button.color !== 'undefined') {
buttonClasses = buttonClasses + ' ' + config.button.color;
}
if (ghmob(selector).length > 0) {
ghmob(selector).attr('class', 'gh-submenu pagetabs ' + action + ' ' + position).attr('aria-label', labelText);
ghmob(selector).find('.toggle').attr('class', 'ui-btn gh-btn toggle fa' + buttonClasses).find('.ui-btn-text').text(labelText);
}
else {
// create html
var submenu = '<div class="gh-submenu ' + action + ' ' + position + '" role="navigation" aria-label="' + labelText + '"><a href="#" id="submenu-button-' + count + '" class="toggle fa' + buttonClasses + '" aria-controls="submenu-items-' + count + '" aria-expanded="false">' + labelText + '</a><div id="submenu-items-' + count + '" class="menu" aria-labelledby="submenu-button-' + count + '" aria-hidden="true"><ul></ul></div></div>';
return submenu;
}
},
/**
* addEvent
* Sets up custom and jQuery mobile events on a submenu
*
* @deprecates initSubmenu
* @ignore
* @param {jQuery} selector
* @returns {void}
*/
addEvent: function(selector) {
var action = ghConfig.submenu.action;
// make toggle a button
selector.find('.toggle').button();
// do stuff based on action
if (action === 'popup') {
var popupId = selector.find('.toggle').attr('href');
ghmob(popupId).find('.ui-collapsible').collapsible();
ghmob(popupId).popup();
}
},
/**
* setMinHeight
* set min-height, if needed, so entire submenu is visible
*
* @private
* @param {jQuery} selector
* @returns {void}
*/
_setMinHeight: function(selector) {
selector.each(function() {
if ((ghmob(this).offset().top + ghmob(this).find('.toggle').height() + ghmob(this).find('.menu').height() + ghmob('.ui-header-fixed').height()) > ghmob('body').height()) {
ghmob(this).addClass('overflow');
}
else {
ghmob(this).removeClass('overflow');
}
});
},
/**
* selectToSubmenu
*
* @param {jQuery} selector
* @returns {void}
*/
selectToSubmenu: function(selector) {
ghmob(selector).each(function() {
var $this = ghmob(this);
var $thisParent = $this.closest('div[id]');
var $thisContainer = $this.closest('div[class="ui-body"]');
var $thisContainerHd = $thisContainer.find('.ui-bar').first().clone();
$thisContainerHd.children().remove();
var submenu = ghSubmenu.create();
submenu = ghmob(submenu).attr('data-select-id', ghmob(this).attr('id'));
$this.attr('data-native-menu', 'true');
$this.find('option').not('[data-placeholder], [value="9999"]').each(function() {
if (ghmob(this).text().trim() === '') return;
submenu.find('ul').append('<li><a href="#" data-select-value="' + ghmob(this).attr('value') + '">' + ghmob(this).text() + '</a></li>');
if (ghPage.isTargetContent() === false) {
submenu.find('ul > li:last-child a').attr('target', 'gh-top');
}
});
if ($thisContainer.length > 0) {
$thisContainer.attr('data-submenu', 'true');
if ($thisContainer.find('.gh-submenu-wrap').length === 0) {
$thisContainer.find('.ui-bar').first().wrapAll('<div class="gh-submenu-wrap"></div>');
$thisContainer.find('.gh-submenu-wrap').append(submenu);
submenu = $thisContainer.find('.gh-submenu-wrap .gh-submenu');
submenu.attr('aria-label', submenu.attr('aria-label') + ' ' + $thisContainerHd.text().trim());
}
}
else if ($thisParent.prev('.gh-submenu').length === 0) {
$thisParent.before(submenu);
submenu = $thisParent.prev('.gh-submenu');
}
$thisParent.addClass('gh-hidden').attr('aria-hidden', 'true');
ghSubmenu.addEvent(submenu);
if ($thisContainer.length > 0 && submenu.find('.toggle .ui-btn-text .visually-hidden').length === 0) {
submenu.find('.toggle .ui-btn-text').append('<span class="visually-hidden">' + $thisContainerHd.text().trim() + ' Options</span>');
}
if ($thisParent.closest('td').closest('div[id]').find('a[id*="_GO_"]').length > 0) {
ghSubmenu.actionOnSelect('#' + $thisParent.closest('td').closest('div[id]').find('a[id*="_GO_"]').attr('id'), '#' + $this.attr('id'));
}
});
},
/**
* actionOnSelect
*
* @ignore
* @param {jQuery} actionSelector
* @param {jQuery} selectSelector
* @returns {void}
*/
actionOnSelect: function(actionSelector, selectSelector) {
ghmob(actionSelector).hide();
ghmob(selectSelector).bind('change', function() {
window['invokeFieldAction'](actionSelector, 100);
});
},
/**
* init
* Loops through defined selectors and initializes apppropriate methods
*
* @deprecates initSubmenu
* @ignore
* @returns {void}
*/
init: function() {
// first we create the header submenu (campus tabs)
var pageTabSelectors = ghmob(this.pageTabSelectors.join()).filter(function() {
return (ghmob(this).find('.pts_facets').length === 0);
});
var pageTabItems = this._getSubmenuItems(pageTabSelectors);
var serverTabs = ghmob('[data-gh-server-submenu]');
if (serverTabs.length > 0) {
if (serverTabs.length > 1) {
ghmob('.gh-page-header-wrap').find(serverTabs).remove();
pageTabSelectors.find('[data-gh-server-submenu]').first().appendTo(ghmob('.gh-page-header-wrap'));
}
this.create('pageTabs', undefined, this._getPageTabs());
this.showAsColumn(this._getPageTabs().find('.menu ul'));
pageTabSelectors.attr('aria-hidden', 'true').addClass('gh-hidden');
}
else if (pageTabSelectors.length > 0 && pageTabItems.length > 0) {
if (this._getPageTabs().length > 0) {
this._setActiveFromPageHeadings();
}
pageTabSelectors.each(function() {
if ((ghConfig.submenu.displayOnHomepage === false && ghmob(this).hasClass('.pthomepagetablinetd')) || (ghmob(this).is('ul') === false && ghmob(this).find(pageTabSelectors).length > 0) || ghPage.isSearch() || ghmob(this).find('input[type="text"], select').length > 0 || ghmob(this).parents(ghSubmenu.pageTabSelectors.join()).find('input[type="text"], select').length > 0) return;
ghmob(this).attr('aria-hidden', 'true').addClass('gh-hidden');
ghSubmenu.pageTabs(ghmob(this), true);
});
}
else if (ghPage.isFluid()) {
this._insertFromSession();
}
else {
ghmob('.gh-has-submenu-cols').removeClass('gh-has-submenu-cols');
this._getPageTabs(true).remove();
}
// then we create table submenus
var tableTabSelectors = ghmob(this.tableTabSelectors.join());
tableTabSelectors.each(function() {
ghSubmenu.tableTabs(ghmob(this));
});
},
/**
* setSelected
*
* @private
* @param {obj} event
* @returns {void}
*/
_setSelected: function(event) {
event.preventDefault();
var select = ghmob('[id="' + ghmob(event.currentTarget).closest('[data-select-id]').attr('data-select-id') + '"]');
var option = select.find('option[value="' + ghmob(event.currentTarget).attr('data-select-value') + '"]');
option.prop('selected', 'selected');
select.trigger('change');
},
/**
* _observeFluidCustomMenu
*
* @private
* @returns {void}
*/
_observeFluidCustomMenu: function() {
if (typeof window['MutationObserver'] === 'undefined' || ghmob('.isHomepage').length > 0 || ghmob('.isLogin').length > 0 || ghConfig.page.showPSFrame === true) return;
var observeFluidCustomMenu = new MutationObserver(function(mutations) {
mutations.forEach(function(mutation) {
if (mutation.type !== 'childList' || mutation.addedNodes.length === 0) return;
var psMenuCustom = ghmob('#PT_HEADER .ps_menucontainer .ps_custom_action');
if (psMenuCustom.find('a').length > 0) {
if (psMenuCustom.find('a').length > 1 && ghSubmenu._getPageTabs().length === 0) {
ghSubmenu.pageTabSelectors.push('#PT_HEADER .ps_menucontainer .ps_custom_action');
ghSubmenu.init();
}
else {
psMenuCustom.find('a').each(function() {
if (ghmob('.gh-submenu').find('a:contains(' + ghmob(this).text().trim() + ')').length > 0) return;
ghFooter.addItem(ghmob(this));
});
}
ghSubmenu._setActiveFromPageHeadings();
}
});
});
if (ghmob('#PT_HEADER').length > 0) {
observeFluidCustomMenu.observe(ghmob('#PT_HEADER')[0], { childList: true, subtree: true });
}
},
/**
* _observeFluidSideMenu
*
* @private
* @returns {void}
*/
_observeFluidSideMenu: function() {
if (typeof window['MutationObserver'] === 'undefined' || ghmob('.isHomepage').length > 0 || ghmob('.isLogin').length > 0) return;
var observeFluidSideMenu = new MutationObserver(function(mutations) {
mutations.forEach(function(mutation) {
if (mutation.type !== 'childList' || mutation.addedNodes.length === 0) return;
var items = ghSubmenu._getSubmenuItems(ghmob('#PT_SIDE'));
if (items.length > 0 && ghSubmenu._getPageTabs().length === 0) {
ghSubmenu.init();
}
});
});
if (ghmob('#PT_SIDE').length > 0) {
observeFluidSideMenu.observe(ghmob('#PT_SIDE')[0], { childList: true, subtree: true });
}
},
/**
* _eventBindings
*
* @private
* @returns {void}
*/
_eventBindings: function() {
ghmob(document)
.off('click.ghSubmenu.toggle')
.on('click.ghSubmenu.toggle', '.gh-submenu .toggle', function(event) {
event.preventDefault();
var iconExpand = ghConfig.submenu.container.button.icons.expand;
var iconCollapse = ghConfig.submenu.container.button.icons.collapse;
if (ghmob(this).closest('.gh-submenu').attr('aria-label') === ghConfig.submenu.pageTabs.button.label.text) {
iconExpand = ghConfig.submenu.pageTabs.button.icons.expand;
iconCollapse = ghConfig.submenu.pageTabs.button.icons.collapse;
}
else if (ghmob(this).closest('.gh-submenu').attr('aria-label') === ghConfig.submenu.sort.button.label.text) {
iconExpand = ghConfig.submenu.sort.button.icons.expand;
iconCollapse = ghConfig.submenu.sort.button.icons.collapse;
}
if (ghmob(this).attr('aria-expanded') === 'false') {
ghmob(this).removeClass(iconExpand).addClass(iconCollapse).attr('aria-expanded', 'true');
ghmob(this).closest('.gh-submenu').addClass('active');
ghmob(this).closest('.gh-submenu').find('.menu').attr('aria-hidden', 'false');
ghmob(this).closest('.ui-collapsible').trigger('expand');
}
else {
ghmob(this).removeClass(iconCollapse).addClass(iconExpand).attr('aria-expanded', 'false');
ghmob(this).closest('.gh-submenu').removeClass('active');
ghmob(this).closest('.gh-submenu').find('.menu').attr('aria-hidden', 'true');
}
ghSubmenu._setMinHeight(ghmob(this).closest('.gh-submenu'));
});
ghmob(document)
.off('collapse.ghSubmenu.submenuParent')
.on('collapse.ghSubmenu.submenuParent', '.ui-collapsible', function() {
if (ghmob(this).find('.gh-submenu.active').length > 0) {
ghmob(this).find('.gh-submenu .toggle').trigger('click');
}
});
ghmob(window)
.off('click.ghSubmenu.windowClick')
.on('click.ghSubmenu.windowClick', function(event) {
if (ghmob(event.target).parents('.gh-submenu').length > 0) return;
ghmob('.gh-submenu.active .toggle').trigger('click');
});
ghmob(document)
.off('click.ghSubmenu.setSelected')
.on('click.ghSubmenu.setSelected', '[data-select-value]', function(event) {
ghLog.event('click.ghSubmenu.setSelected');
ghSubmenu._setSelected(event);
});
ghmob(document)
.off('ghPageReady.ghSubmenu._setActiveFromPageHeadings')
.on('ghPageReady.ghSubmenu._setActiveFromPageHeadings', function() {
ghLog.event('ghPageReady.ghSubmenu._setActiveFromPageHeadings');
var pageTabs = ghSubmenu._getPageTabs(true);
if (pageTabs.length > 0) {
ghSubmenu._setActiveFromPageHeadings();
}
});
ghmob(document)
.off('click.ghSubmenu.setActive')
.on('click.ghSubmenu.setActive', '.gh-submenu.pagetabs ul a', function(event) {
ghLog.event('click.ghSubmenu._setActive');
event.stopPropagation();
if (ghmob(this).attr('href') === '#') {
event.preventDefault();
}
ghSubmenu._setActive(ghmob(this), true);
if (ghPage.isIFrameModal() && ghPage.isFluid() && (typeof ghmob(event.currentTarget).attr('href') !== 'undefined' && ghmob(event.currentTarget).attr('href').indexOf('javascript:') > -1)) {
ghmob('.ps_modal_close a')[0].click();
}
});
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
* pageTabSelectors
* Array of all the plausible selectors for creation of page tabs
*
* @type {array}
*/
pageTabSelectors: [
'[id*="NAV_TAB"]:not(li)',
'[id*="_MOBNAV_VW$grid"]',
'[id*="_SIDE_NAV$grid"]',
'ul.psa_vsubtab',
'[data-pnlname*="NAV_SUBTABS"] [data-role="navbar"]',
'[id^="win"][id$="divDERIVED_SSTSNAV_SSTS_NAV_SUBTABS"]',
'.eoawActionPanelTxns',
'.ps_header_bar:not([id*="LAYOUT_HEADER"])',
'[id*="PANEL"][id*="_NAV"]:not(.psc_panel-action):not(.psc_panel-container)',
'.pthomepagetablinetd',
'.ps_ag-non-guided .ps_ag-menu',
'.psc_panel-action:not(.psc_hidden)',
],
/**
* getSubmenuItems
* Gets items to be appeneded to the submenu
*
* @private
* @param {jQuery} selector
* @returns {jQuery}
*/
_getSubmenuItems: function(selector) {
// removed .psa_has_vsubtabs so HR menus work
return selector.find('li, td.ssstabactive, td.ssstabinactive, td.SSSTABACTIVE, td.SSSTABINACTIVE, table.PSACTIVETAB, table.PSINACTIVETAB, .pthomepagetabactive, .pthomepagetabinactive, div.psa_vtab, tr[id*="_MOBNAV_VW"], div.psc_rowact, .psc_collapsible').filter(function() {
if (ghmob(this).hasClass('psc_hidden') === false && (ghmob(this).closest('.psa_vsubtab').length < 1 && ghmob(this).closest('.psc_list-linkmenu').not(ghmob(this)).siblings('.psa_vtab').length === 0) && ghmob(this).parents('.ps_ag-step-group-list').length <= 1) return true;
});
},
/**
* drawSecondaryLevelItems
* Draws secondary menu items under the appropriate grouping
*
* @private
* @param {jQuery} thisItem
* @param {jQuery} $this
* @returns {void}
*/
_drawSecondaryLevelItems: function(thisItem, $this) {
var _this = this;
var list;
var items;
if ($this.hasClass('psc_collapsible')) {
list = $this.find('> .ps_detail-group, .ps_grid-list').first();
items = '.ps_box-scrollarea-row, .ps_grid-row';
}
else if ($this.find('ul').length > 0) {
list = $this.find('ul').first();
items = 'li';
}
else if ($this.hasClass('psa_has_vsubtabs') || $this.hasClass('psc_collapsible')) {
if ($this.hasClass('psa_has_vsubtabs') && $this.next('.psc_list-linkmenu').length > 0) {
list = $this.next('.psc_list-linkmenu').find('ul').first();
}
else {
list = $this.parent().find('ul').first();
}
items = 'li';
}
else if ($this.hasClass('ps_ag-step-group-button')) {
list = $this.closest('li').find('ul').first();
items = 'li';
}
else {
return;
}
if (list.length === 0 || list.parents('.psc_hidden').not('.psc_list-linkmenu').length > 0) return;
if ($this.hasClass('psa_vtab') === true && $this.hasClass('psa_has_vsubtabs') === false && $this.hasClass('psc_collapsible') === false) {
ghSubmenu._drawBubbleCounter(thisItem, $this.parent());
return;
}
thisItem.append('<ul></ul>');
list.attr('aria-hidden', 'true').addClass('gh-hidden').find(items).each(function() {
var anchor = ghmob(this).find('a, [onclick]').first();
var anchorText = anchor.find('.ps-text, .ps-link').length > 0 ? anchor.find('.ps-text, .ps-link').first().text().trim() : anchor.text().trim();
if (anchor.length === 0) {
anchorText = ghmob(this).text().trim();
}
if (anchor.find('.ps_ag-step-link-label').length > 0) {
anchorText = anchor.find('.ps_ag-step-link-label > .ps_box-value').text().trim();
}
thisItem.find('ul').append('<li><a href="#">' + anchorText + '</a></li>');
if (ghPage.isTargetContent() === false) {
thisItem.find('ul > li:last-child a').attr('target', 'gh-top');
}
if (typeof ghmob(this).attr('onclick') !== 'undefined') {
thisItem.find('ul > li:last-child > a').attr('onclick', _this.forceSubmitActionToTop(ghmob(this).attr('onclick').replace('this.id', '\'' + ghmob(this).attr('id') + '\'')));
}
else if (anchor.length > 0) {
if (typeof anchor.attr('href') !== 'undefined') {
thisItem.find('ul > li:last-child > a').attr('href', _this.forceSubmitActionToTop(anchor.attr('href')));
}
if (typeof anchor.attr('onclick') !== 'undefined') {
thisItem.find('ul > li:last-child > a').attr('onclick', _this.forceSubmitActionToTop(anchor.attr('onclick').replace('this.id', '\'' + anchor.attr('id') + '\'')));
if (anchor.attr('onclick').indexOf('LaunchURL') > -1 && anchor.attr('onclick').indexOf(', 1') > -1) {
thisItem.find('a').attr('href', '#');
}
}
}
if (ghmob(this).hasClass('psc_selected') || ghmob(this).find('.psc_selected').length > 0 || anchor.hasClass('ui-btn-active')) {
thisItem.find('ul > li:last-child').addClass('active').find('> a').attr('aria-current', 'page').attr('title', 'current page');
thisItem.find('ul > li:last-child').parents('li.active').find('> a').removeAttr('aria-current title');
}
ghSubmenu._drawBubbleCounter(thisItem.find('ul li:last-child'), ghmob(this));
});
},
},
},
/**
* forceSubmitActionToTop
*
* @ignore
* @param {string} action
* @returns {string}
*/
forceSubmitActionToTop: function(action) {
if (ghPage.isTargetContent()) {
return action;
}
return action.replace('submitAction_', 'ghUtils.getWinTop().submitAction_').replace('(document.', '(ghUtils.getWinTop().document.').replace('LaunchURL', 'ghUtils.getWinTop().LaunchURL').replace('OnRowAction', 'ghUtils.getWinTop().OnRowAction');
},
/**
* run
*
* @ignore
* @returns {void}
*/
run: function() {
this._eventBindings();
if (ghConfig.submenu.enabled !== true) return;
this._observeFluidCustomMenu();
this._observeFluidSideMenu();
this.init();
},
};
ghInit.module('ghSubmenu');
/**
* ghMultiStep
* Create and format multistep pagination
*
* @module multistep
* @config enabled [true, false]
* @config currentStepText [string]
* @config multistepToProgressNavigation [true, false]
*/
var ghMultiStep = ghMultiStep || {
/**
* selectors
* Default selectors variable for multistep. Could possibly expand.
*
* @type {array}
*/
selectors: ['img[src*="STEP01"]'],
/**
* progressNavigationSelectors
* Array of selectors for progressNavigation method
*
* @type {array}
*/
progressNavigationSelectors: [
{
links: '#EOTL_WZ_MAINSTEPS > tbody > tr > td',
linkText: 'div[name="EOTL_WZ_TRAINSTOP_TEXT"]',
selector: '.ui-content [id*="EOTL_WIZ_HEADER"]',
subnav: '#EOTL_WZ_SUBSTEP_CONT',
},
{
links: 'div[id*="PSACTIVITYGUIDE_STEP"][id*="URL"]',
linkText: 'span',
selector: '.ui-content [id*="PSACTIVITYGUIDE_ACTIVITYNAME"]',
},
{
links: 'table table td',
linkText: '',
selector: '[data-pnlname="PV_REQ_WIZ_SBP"][data-pnlfldid="1"]',
},
{
links: 'td[style] td[style]',
linkText: '',
selector: 'table[id*="_APPROVAL_HISTORY"]',
},
{
links: '.ps_ag-step, .ps_ag-step-group',
linkText: '.ps_box-value[id*="LABEL"]',
moveTo: 'top',
selector: '.ps_ag-menu',
},
],
/**
* create
* Create multistep wrapper
*
* @ignore
* @param {jQuery} selector
* @returns {jQuery}
*/
create: function(selector) {
if (ghConfig.multistep.enabled === false) return;
selector.closest('tr').addClass('gh-multistep-wrap');
// Create inital multi-step label message
var steps = selector.closest('.gh-multistep-wrap').find('.gh-multistep');
if (steps.length > 0) {
if (ghConfig.multistep.currentStepText !== steps.find('> strong').text().trim()) {
steps.find('> strong').text(ghConfig.multistep.currentStepText);
}
return;
}
// Debug
ghLog.info('Creating multistep pagination');
selector.closest('div[id]').before('<div class="gh-multistep" role="navigation"><strong>' + ghConfig.multistep.currentStepText + '</strong><ul aria-label="You are here"></ul></div>');
return selector.closest('.gh-multistep-wrap');
},
/**
* addStep
* Add step to multistep div
*
* @ignore
* @param {jQuery} multiStepSelector
* @param {jQuery} stepSelector
* @param {int} stepIndex
* @returns {void}
*/
addStep: function(multiStepSelector, stepSelector, stepIndex) {
var step;
// Figure out if step is a link
if (stepSelector.parent('a').length > 0) {
// If linkable step
if (stepSelector.attr('src').indexOf('ENA') > -1) {
step = '<li class="active"><a href="' + stepSelector.parent('a').attr('href') + '" class="step" title="Step ' + (stepIndex + 1) + ' (active)"><span aria-hidden="true">' + (stepIndex + 1) + '</span></a></li>';
}
else {
step = '<li><a href="' + stepSelector.parent('a').attr('href') + '" class="step" title="Step ' + (stepIndex + 1) + '"><span aria-hidden="true">' + (stepIndex + 1) + '</span></a></li>';
}
}
else if (stepSelector.attr('src').indexOf('ENA') > -1) {
step = '<li class="active"><div class="step" title="Step ' + (stepIndex + 1) + ' (visited)"><span aria-hidden="true">' + (stepIndex + 1) + '</span></div></li>';
}
else {
step = '<li><div class="step" title="Step ' + (stepIndex + 1) + ' (incomplete)"><span aria-hidden="true">' + (stepIndex + 1) + '</span></div></li>';
}
// Add step to multistep pagination
multiStepSelector.closest('.gh-multistep-wrap').find('.gh-multistep ul').append(step);
// Hide step
stepSelector.closest('div[id]').addClass('gh-hidden').attr('aria-hidden', 'true');
},
/**
* init
* Setup multistep navigation create/add process
*
* @ignore
* @param {jQuery} scope
* @returns {void}
*/
init: function(scope) {
if (ghConfig.multistep.enabled === false) {
ghmob('.gh-multistep, .gh-progress-nav').addClass('gh-hidden').attr('aria-hidden', 'true');
return;
}
ghmob('.gh-multistep, .gh-progress-nav').removeClass('gh-hidden').removeAttr('aria-hidden');
// Loop through selectors
ghmob(this.selectors.join(), scope).each(function() {
var thisImg = ghmob(this);
// Create multistep pagination wrapper
ghMultiStep.create(thisImg);
// Loop through possible steps
var steps = thisImg.closest('.gh-multistep-wrap').parent().find('div[id]:not(.gh-hidden) img[src*="STEP"]');
steps.each(function(i) {
// Adding steps to multistep pagination
ghMultiStep.addStep(thisImg, ghmob(this), i);
});
});
},
/**
* hide
* Hide multiStep
*
* @ignore
* @returns {void}
*/
hide: function() {
// Loop through selectors and hide multistep table if found
ghmob(this.selectors.join()).each(function() {
if (ghmob(this).length > 0) {
// Debug
ghLog.info('Hiding multistep pagination');
ghmob(this).closest('table').addClass('gh-hidden');
return;
}
});
},
/**
* progressNavigation
* Create progress navigation UI element from PeopleSoft wizard and activity guide navigation
*
* @ignore
* @returns {void}
*/
progressNavigation: function() {
if (ghConfig.multistep.enabled === false) return;
var navs = this.progressNavigationSelectors;
ghmob.each(navs, function(i, nav) {
// check if selector exists
if (ghmob(nav['selector']).length === 0) return;
// loop through selectors
ghmob(nav['selector']).each(function(a) {
var $this = ghmob(this);
// fluid activity guide
if ($this.hasClass('ps_ag-menu') && ghmob('.ps_ag-non-guided').length > 0) return;
// hide selector
$this.addClass('gh-hidden').attr('aria-hidden', 'true');
// check for links
if (typeof nav['links'] === 'undefined' || $this.find(nav['links']).length === 0) return;
// check for navigation
var thisId = $this.attr('id');
if (typeof thisId === 'undefined') {
thisId = a;
}
var thisNav = ghmob('.gh-progress-nav[data-id="' + thisId + '"]');
if ($this.hasClass('ps_ag-menu')) {
ghmob('.gh-progress-nav[data-id]').not('[data-id="' + thisId + '"]').remove();
}
if (thisNav.length > 0) return;
// create wrapper, save as var
var progressNavWrapper = ghmob('<div class="gh-progress-nav" role="navigation" data-id="' + thisId + '"><ul class="top" aria-label="You are here"></ul></div>');
if (typeof nav['moveTo'] === 'undefined') {
progressNavWrapper.insertBefore($this);
}
else {
progressNavWrapper.insertAfter(ghmob('.gh-page-header-wrap'));
}
var progressNav = ghmob('.gh-progress-nav[data-id="' + thisId + '"]');
// show parent elements
if (typeof nav['moveTo'] === 'undefined') {
progressNav.parents().show();
}
// loop through links
var stepCount = 0;
if ($this.find(nav['links']).length > 7 || $this.find('.ps_ag-step-group').length > 1) {
progressNavWrapper.addClass('stacked');
ghmob('html').addClass('subsite');
ghmob('body').addClass('gh-has-submenu-cols');
progressNavWrapper.prependTo(ghmob('.ps_pagecontainer').first().addClass('gh-submenu-cols'));
ghContainer.createCollapsible(progressNavWrapper, 'Navigate ' + ghmob('.gh-page-header-headings').find(ghHeader.headings.join()).first().text(), { collapsed: true });
ghmob('.gh-submenu-cols').attr('data-cols', ghmob('.gh-submenu-cols').children().length);
}
$this.find(nav['links']).each(function(i) {
if (ghmob(this).text().trim() === '') return;
var content = ghmob(this).text().trim().replace(/\d+\.\d*/g, '');
if (typeof $this.attr('id') !== 'undefined' && $this.attr('id').indexOf('_APPROVAL_HISTORY') > -1) {
if (i === 0) {
var active = ghmob(this).parent().find('td[style]').filter(function() {
return (ghmob(this).find('img').length > 0 && ghmob(this).find('img').attr('src').indexOf('_D_') === -1);
});
active.each(function(a) {
if (a === (active.length - 1)) {
ghmob(this).attr('id', 'ACTIVE$' + i);
}
else {
ghmob(this).attr('id', 'VISITED$' + i);
}
});
}
ghmob(this).find('img + br').remove();
ghmob(this).find('img').remove();
content = ghmob(this).html();
}
if (ghmob(this).hasClass('ps_ag-step') || ghmob(this).hasClass('ps_ag-step-group')) {
content = ghmob(this).find(nav['linkText']).first().text();
}
// add list item, save as var
stepCount++;
var progressNavLast = ghmob('<li></li>');
var ariaLabel = 'Step ' + stepCount + ': ' + content;
var stepContent = '<span class="num" aria-hidden="true">' + (stepCount) + '</span> <span class="text">' + content + '</span>';
if (ghmob(this).hasClass('ps_ag-step') || ghmob(this).hasClass('ps_ag-step-group')) {
if (ghmob(this).find('.ps_ag-step-button[href]').length > 0 || ghmob(this).find('.ps_ag-step-button[onclick]').length > 0) {
var stepId = ghmob(this).find('.ps_ag-step-button').first().attr('id');
progressNavLast.append('<a href="#" class="step">' + stepContent + '</a>');
if (typeof stepId !== 'undefined') {
progressNavLast.find('a').attr('data-id', stepId);
}
if (ghmob(this).find('.psc_selected').length > 0) {
progressNavLast.addClass('active');
ariaLabel += ' (active)';
}
else if (ghmob(this).find('.psc_visited').length > 0) {
progressNavLast.addClass('visited');
ariaLabel += ' (visited)';
}
}
else {
progressNavLast.append('<div class="step">' + stepContent + '</div>');
progressNavLast.find('.step span').addClass('ui-disabled');
ariaLabel += ' (incomplete)';
}
}
else if (ghmob(this).find(nav['linkText'] + ' a').attr('href')) {
progressNavLast.append('<a href="#" class="step">' + stepContent + '</a>');
// add visited class and href
progressNavLast.addClass('visited').find('a').attr('href', ghmob(this).find(nav['linkText'] + ' a').attr('href'));
ariaLabel += ' (visited)';
// add active class if text is found in page headers (HR 9.1)
if (ghmob('.gh-page-header-headings').text().indexOf(ghmob(this).text().trim()) !== -1) {
progressNavLast.removeClass('visited').addClass('active');
ariaLabel = ariaLabel.replace('(visited)', '(active)');
}
// add active class if background is higlighted (FIN)
if (ghmob(this).attr('style') && ghmob(this).attr('style').indexOf('background-color') > -1) {
progressNavLast.removeClass('visited').addClass('active');
ariaLabel = ariaLabel.replace('(visited)', '(active)');
}
}
else if (ghmob(this).attr('id') && ghmob(this).attr('id').indexOf('ACTIVE') > -1) {
progressNavLast.addClass('active').append('<div class="step">' + stepContent + '</div>');
ariaLabel += ' (active)';
}
else if (ghmob(this).attr('id') && ghmob(this).attr('id').indexOf('VISITED') > -1 && ghmob(this).attr('id').indexOf('NOT') === -1) {
progressNavLast.addClass('visited').append('<div class="step">' + stepContent + '</div>');
ariaLabel += ' (visited)';
}
else {
progressNavLast.append('<div class="step">' + stepContent + '</div>');
progressNavLast.find('.step span').addClass('ui-disabled');
ariaLabel += ' (incomplete)';
}
progressNavLast.children().attr('title', ariaLabel);
if (ghmob(this).hasClass('ps_ag-step') && ghmob(this).parents('.ps_ag-step-group').length > 0) {
var groupParent = progressNav.find('[data-id="' + ghmob(this).closest('.ps_ag-step-group').find('.ps_ag-step-button').attr('id') + '"]').parent();
if (groupParent.children('ul').length === 0) {
groupParent.append('<ul></ul>');
}
groupParent.children('ul').append(progressNavLast);
}
else {
progressNav.find('ul.top').append(progressNavLast);
}
});
// check for subnav
if (typeof nav['subnav'] === 'undefined' || $this.find(nav['subnav']).length === 0 || $this.find(nav['subnav'] + ' a').length === 0) return;
// add class to wrapper
progressNav.addClass('sublinks');
// loop through subnav links
$this.find(nav['subnav'] + ' a').each(function() {
// save active item as var
var progressNavActive = progressNav.find('ul.top').children('li.active');
// create DOM element in active item
if (progressNavActive.find('ul').length === 0) {
progressNavActive.append('<ul></ul>');
}
// save subnav as var
var progressSubnav = progressNavActive.children('ul');
if (ghmob(this).text().trim() !== '') {
var subStep = ghmob('<li></li>');
if (ghmob(this).attr('href')) {
subStep.addClass('visited').html('<a href="' + ghmob(this).attr('href') + '" class="step">' + ghmob(this).text() + ' <span class="sr-only">(visited)</span></a>');
}
else if (ghmob(this).closest('div').attr('id').indexOf('ACTIVE') > -1) {
subStep.addClass('active').html('<div class="step">' + ghmob(this).text() + ' <span class="sr-only">(active)</span></div>');
}
else {
subStep.html('<div class="step ui-disabled">' + ghmob(this).text() + ' <span class="sr-only">(incomplete)</span></div>');
}
progressSubnav.append(subStep);
}
});
});
});
},
/**
* multistepToProgressNavigation
* Converts the standard "you are here" multistep to a progress navigation pager for all instances on a page
*
* @param {array} stepText
* @param {jQuery} scope
* @returns {void}
*/
multistepToProgressNavigation: function(stepText, scope) {
if (ghConfig.multistep.enabled === false) return;
var navs = ghmob('.gh-multistep');
if (typeof scope !== 'undefined' && ghmob(scope).find('.gh-multistep').length > 0) {
navs = ghmob(scope).find('.gh-multistep');
}
var navLinks = 'li';
// check if selector exists
if (navs.length === 0) return;
// loop through selectors
navs.each(function() {
var thisNav = ghmob(this);
// hide selector
thisNav.addClass('gh-hidden').attr('aria-hidden', 'true');
// check for navigation
if (thisNav.prev('.gh-progress-nav').length > 0) {
if (typeof thisNav.attr('data-gh-server-multi-step') !== 'undefined') {
if (ghConfig.multistep.multistepToProgressNavigation === false) {
thisNav.removeClass('gh-hidden').removeAttr('aria-hidden').prev('.gh-progress-nav').addClass('gh-hidden').attr('aria-hidden', 'true');
return;
}
thisNav.prev('.gh-progress-nav').removeClass('gh-hidden').removeAttr('aria-hidden').find(navLinks).each(function(i) {
if (ghmob(this).find('.text').text().trim() === '' && stepText && stepText[i] !== '') {
ghmob(this).find('.text').removeAttr('aria-hidden').text(stepText[i]);
}
});
thisNav.prev('.gh-progress-nav').find('[tabindex]').removeAttr('tabindex');
}
return;
}
// check for links
if (thisNav.find(navLinks).length === 0) return;
// create wrapper, save as var
thisNav.before('<div class="gh-progress-nav" role="navigation"><ul aria-label="You are here"></ul></div>');
var progressNav = ghmob(this).prev('.gh-progress-nav');
// loop through links
thisNav.find(navLinks).each(function(i) {
var content = (stepText && stepText[i]) ? stepText[i] : ghmob(this).text().trim();
var stepCount = ghmob(this).index() + 1;
var progressNavLast = ghmob('<li></li>');
var ariaLabel = 'Step ' + stepCount + ': ' + content;
var stepContent = '<span class="num" aria-hidden="true">' + (stepCount) + '</span> <span class="text">' + content + '</span>';
if (ghmob(this).find('a').attr('href')) {
progressNavLast.append('<a href="#" class="step">' + stepContent + '</a></li>');
// add visited class and href
progressNavLast.addClass('visited').find('a').attr('href', ghmob(this).find('a').attr('href'));
ariaLabel += ' (visited)';
// add active class if text is found in page headers (HR 9.1)
if ((ghmob('.gh-page-header-headings').text().indexOf(content) !== -1 && thisNav.find('.active').length === 0) || ghmob(this).hasClass('active')) {
progressNavLast.removeClass('visited').addClass('active');
ariaLabel = ariaLabel.replace('(visited)', '(active)');
}
if (content === 'Finish' && ghmob('.gh-page-header-headings').text().indexOf('View results') !== -1) {
progressNavLast.removeClass('visited').addClass('active');
ariaLabel = ariaLabel.replace('(visited)', '(active)');
}
if (content === 'Select' && ghmob('.gh-page-header-headings').text().indexOf('Search') !== -1) {
progressNavLast.removeClass('visited').addClass('active');
ariaLabel = ariaLabel.replace('(visited)', '(active)');
}
}
else if (ghmob(this).attr('id') && ghmob(this).attr('id').indexOf('ACTIVE') > -1 || ghmob(this).hasClass('active')) {
progressNavLast.addClass('active').append('<div class="step">' + stepContent + '</div>');
ariaLabel += ' (active)';
}
else {
progressNavLast.append('<div class="step">' + stepContent + '</div>');
progressNavLast.find('.step span').addClass('ui-disabled');
ariaLabel += ' (incomplete)';
}
progressNavLast.children().attr('title', ariaLabel);
progressNav.children('ul').append(progressNavLast);
});
});
},
/**
* _observeFluidAG
*
* @private
* @returns {void}
*/
_observeFluidAG: function() {
if (typeof window['MutationObserver'] === 'undefined' || ghPage.isActivityGuide() === false || ghPage.isFluid() === false) return;
this._observeFluidAGTitle();
this._observeFluidAGButtons();
},
/**
* _observeFluidAGTitle
*
* @private
* @returns {void}
*/
_observeFluidAGTitle: function() {
var currTitle = ghmob('.ps_box-agtitle').text().trim();
ghMultiStep._fluidAGTitle();
var observeFluidAGTitle = new MutationObserver(function(mutations) {
mutations.forEach(function(mutation) {
if (mutation.type !== 'childList' || mutation.addedNodes.length === 0) return;
ghMultiStep._fluidAGTitle(currTitle);
});
});
if (ghmob('#PT_CONTENT').length > 0) {
observeFluidAGTitle.observe(ghmob('#PT_CONTENT')[0], { childList: true, subtree: true });
}
},
/**
* _fluidAGTitle
*
* @private
* @returns {void}
*/
_fluidAGTitle: function(currTitle) {
var newTitle = ghmob('.ps_box-agtitle').text().trim();
if (newTitle === '' || currTitle === newTitle || ghmob('.gh-page-header').text().indexOf(newTitle) > -1) return;
ghHeader.pageHeader();
ghHeader.formatUsername();
},
/**
* _observeFluidAGButtons
*
* @private
* @returns {void}
*/
_observeFluidAGButtons: function() {
ghMultiStep._fluidAGButtons();
var observeFluidAGButtons = new MutationObserver(function(mutations) {
mutations.forEach(function(mutation) {
if (mutation.type !== 'childList' || mutation.addedNodes.length === 0) return;
ghMultiStep._fluidAGButtons();
});
});
if (ghmob('#PT_SIDE').length > 0) {
observeFluidAGButtons.observe(ghmob('#PT_SIDE')[0], { childList: true, subtree: true });
}
if (ghmob('#PT_HEADER').length > 0) {
observeFluidAGButtons.observe(ghmob('#PT_HEADER')[0], { childList: true, subtree: true });
}
},
/**
* _fluidAGButtons
*
* @private
* @returns {void}
*/
_fluidAGButtons: function() {
ghMultiStep.progressNavigation();
var multiStepBtns = ghmob('.psc_guided-cont a, .psa_pageaction a, .ps_ag-header-buttons a').filter(function() {
return (ghmob(this).parents('.psc_hidden').length === 0 && ghmob(this).text().trim() !== 'Exit');
});
ghmob('.gh-footer').find('li').remove();
if (multiStepBtns.length > 0) {
multiStepBtns.each(function() {
ghFooter.addItem(ghmob(this));
});
}
var exitBtn = ghmob('.psc_guided-exit');
if (exitBtn.length > 0) {
ghHeader.appendHeaderLink(exitBtn, { reset: true });
}
},
/**
* _eventBindings
*
* @private
* @returns {void}
*/
_eventBindings: function() {
ghmob(document)
.off('click.ghMultiStep.progressNavigationClick')
.on('click.ghMultiStep.progressNavigationClick', '.gh-progress-nav a[data-id]', function(event) {
event.preventDefault();
var source = ghmob('[id*="' + ghmob(this).attr('data-id') + '"][onclick]').first();
if (source.length === 0) return;
source.trigger('click');
});
},
/**
* run
*
* @ignore
* @param {jQuery} [scope]
* @returns {void}
*/
run: function(scope) {
scope = (scope) ? scope : ghmob(document);
this._eventBindings();
this._observeFluidAG();
this.init(scope);
this.progressNavigation();
},
};
ghInit.module('ghMultiStep');
/**
* ghLegend
* Provides methods for creating custom legends
*
* @module legend
*/
var ghLegend = ghLegend || {
/**
* selectors
* Array of all the plausible selectors for creation of a custom legend
*
* @type {array}
*/
selectors: [
'div[data-pnlname="SSR_CSTAT_LEGEND"][data-pnlfldid="1"]',
'div[data-pnlname="SSR_ESTAT_LEGEND"][data-pnlfldid="1"]',
'div[data-pnlname="SSS_CRSEHST_LEGEND"][data-pnlfldid="1"]',
'div[data-pnlname="SSR_RSTAT_LEGEND"][data-pnlfldid="1"]',
'div[data-pnlname="SCC_SUM_PERSONAL"][data-pnlfldid="9"]',
'div[data-pnlname="SSS_REQSTAT_LEGEND"][data-pnlfldid="1"]',
'div[data-pnlname*="SSR_FACCTR_LEGEND"][data-pnlfldid="1"]',
],
/**
* formatItem
* Replace PeopleSoft legend with custom legend
*
* @ignore
* @param {int} itemIndex
* @param {jQuery} selector
* @returns {void}
*/
formatItem: function(itemIndex, selector) {
if (typeof itemIndex === 'undefined') {
itemIndex = ghmob('.legend').length + 1;
}
ghmob(selector).each(function(a) {
if (ghmob('.legend-' + itemIndex + '-' + a).length > 0 || ghmob(this).prev('.legend').length > 0 || ghmob(this).hasClass('gh-hidden')) return;
var panel = ghmob(this);
var icons = panel.find('img, .fa');
var labels = panel.find('.SSSKEYTEXT, .PSTEXT, .PSEDITBOX_DISPONLY, label');
if (icons.length === 0 || labels.length === 0) return;
var legend = ghmob('<ul class="legend legend-' + itemIndex + '-' + a + '" aria-hidden="true"></ul>');
labels.each(function(b) {
var item = ghmob('<li class="legend-item legend-' + itemIndex + '-' + a + '-' + b + '"></li>');
var thisLabel = ghmob(this);
var thisIcon = panel.find('img[title]').filter(function() {
return (ghmob(this).attr('title') === thisLabel.text().trim());
}).first();
if (thisIcon.length === 0) {
thisIcon = panel.find('img, .fa').first();
}
thisIcon.siblings('img, .fa, .sr-only').appendTo(item);
thisIcon.appendTo(item);
item.append(' ' + thisLabel.text().trim());
legend.append(item);
});
ghmob(this).addClass('gh-hidden').attr('aria-hidden', 'true').before(legend);
});
},
/**
* formatLegends
*
* @ignore
* @returns {void}
*/
formatLegends: function() {
if (ghConfig.icons.hideLegends || ghConfig.icons.textOnly) {
ghmob('.legend').addClass('gh-accessible');
}
if (ghConfig.icons.inlineAltText) {
ghAccessibility.hideAriaComponent(ghmob('.legend'));
}
},
/**
* create
* Calls format on a forgotten selector
*
* @param {jQuery} selector
* @returns {void}
*/
create: function(selector) {
this.formatItem(undefined, selector);
},
/**
* init
*
* @private
* @param {jQuery} scope
* @returns {void}
*/
_init: function(scope) {
var selectors = ghmob(this.selectors.join(), scope);
ghLegend.formatItem(undefined, selectors);
},
/**
* run
*
* @ignore
* @param {jQuery} [scope=document]
* @returns {void}
*/
run: function(scope) {
scope = scope ? scope : document;
this._init(scope);
this.formatLegends();
},
};
ghInit.module('ghLegend');
/**
* ghInterface
* Provides inteface UI enhancement
* throughout PeopleMobile.
*
* @module interface
* @config enabled [true, false]
* @config enhanceButtons [true, false]
* @config ghConfig.prompt.iconAttached [true, false]
* @config ghConfig.prompt.iconStatus [show, hide]
* @config ghConfig.prompt.inputClick [true, false]
* @config moveRequiredLabel [true, false]
* @config enableGoto [true, false]
*/
var ghInterface = ghInterface || {
/**
* buttons
* Default properties for buttons
*
* @type {array}
*/
buttons : [
{
color: 'danger',
icon: 'fa-times',
id: '[id*="DELETE"]',
text: 'Delete',
},
{
color: 'danger',
icon: 'fa-times',
id: '[id*="REMOVE"]',
text: 'Delete',
},
{
color: 'danger',
icon: 'fa-times',
id: '[id*="_DEL_"]:not([id*="_VW_"])',
text: 'Delete',
},
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
color: 'danger',
icon: 'fa-times',
id: '[class*="PTROWDELETE"]',
text: 'Delete',
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
color: 'danger',
icon: 'fa fa-times',
id: '[id*="$delete$"]',
text: 'Delete',
},
{
color:'info',
icon: 'fa fa-search',
id:'.psc_primary [id="PTS_SRCH_BTN"][role="button"]',
text: 'Search',
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
/**
* alertMessagesSelectors
* Default selectors for alert messages
*
* @type {array}
*/
alertMessagesSelectors : ['.SSSMSGALERTFRAMEWBO', '.SSSMSGINFOFRAMEWBO', '.SSSMSGWARNINGFRAMEWBO', '.SSSMSGSUCCESSFRAMEWBO', '.PSFRAMECONFIRM', '.PAERRORTEXT', 'img[src*="MESSAGE_WARNING_ICN"]', 'img[src*="MESSAGE_CONFIRM_ICN"]', 'img[src*="MESSAGE_SUCCESS_ICN"]', 'img[src*="MESSAGE_ERROR_ICN"]', 'img[src*="MESSAGE_ALERT_ICN"]', 'img[src*="MESSAGE_INFO_ICN"]', 'span[data-gh-replace*="MESSAGE_WARNING_ICN"]', 'span[data-gh-replace*="MESSAGE_CONFIRM_ICN"]', 'span[data-gh-replace*="MESSAGE_SUCCESS_ICN"]', 'span[data-gh-replace*="MESSAGE_ERROR_ICN"]', 'span[data-gh-replace*="MESSAGE_ALERT_ICN"]', 'span[data-gh-replace*="MESSAGE_INFO_ICN"]', '.psc_confirmation-msg'],
/**
* radiosToTabs
* Sets radio buttons to tabs
*
* @deprecates ghRadiosToTabs
* @param {jQuery} selector
* @returns {void}
*/
radiosToTabs: function(selector) {
selector = ghUtils.jqElem(selector);
if (selector.length === 0 || (ghPage.isFluid() && selector.find('.ps_box-radio').length > 0)) return;
// Create radio tabs wrapper element
if (selector.find('.gh-radio-tabs').length === 0) {
selector.append('<div class="gh-radio-tabs"></div>');
}
var radioGroup = selector.find('fieldset, [role="radiogroup"], [role="group"]');
if (radioGroup.length > 0) {
selector = radioGroup.first();
selector.attr('role', 'navigation');
}
// Appends each radio element to gh-radio-tabs
selector.find('input[type="radio"]').each(function() {
var thisRadio = ghmob(this);
var thisRadioParent = thisRadio.closest('div[id]');
ghAccessibility.doEnhanceCheckboxRadio(thisRadio);
thisRadioParent.addClass('gh-radio-tabs-item').removeClass('gh-hidden').removeAttr('aria-hidden');
if (selector.find('.gh-radio-tabs [id="' + thisRadioParent.attr('id') + '"]').length > 0 && thisRadioParent.parent('.gh-radio-tabs').length === 0) {
selector.find('.gh-radio-tabs [id="' + thisRadioParent.attr('id') + '"]').remove();
}
if (thisRadio.parent('a').length === 0) {
thisRadio.parent('.gh-radio').children().wrapAll('<a href="#"></a>');
}
thisRadio.attr('aria-hidden', 'true').attr('tabindex', '-1');
if (thisRadioParent.find('label .ui-btn-inner').length === 0) {
thisRadioParent.find('label').html('<span class="ui-btn-inner"><span class="ui-btn-text">' + thisRadioParent.find('label').text() + '</span></span>');
}
thisRadioParent.appendTo(selector.find('> .gh-radio-tabs').first());
});
// Hide original content
selector.children().not('.gh-radio-tabs').addClass('gh-hidden').attr('aria-hidden', 'true');
},
/**
* radioTabClick
*
* @param {jQuery} selector
* @returns {void}
*/
_radioTabClick: function(selector) {
ghmob(selector).find('input[type="radio"]')[0].click();
},
/**
* calendarPromptClick
* Event handler for calendar prompt icons
*
* @ignore
* @param {jQuery} selector
* @returns {void}
*/
_calendarPromptClick: function(selector) {
ghmob(selector).closest('.prompt').find('input[data-role="mobiscroll"]').mobiscroll('enable').mobiscroll('show');
},
/**
* radiosToButtons
* Sets radio buttons to buttons
*
* @param {jQuery} selector
* @param {bool} [autoSubmit]
* @returns {jQuery}
*/
radiosToButtons: function(selector, autoSubmit) {
selector = ghUtils.jqElem(selector);
if (selector.length <= 0) return;
selector.each(function() {
var item = ghmob(this);
if (item.find('.gh-radio-buttons').length > 0) return;
// Create radio tabs wrapper element
var radioButtonWrapper = ghmob('<div class="gh-radio-buttons"></div>');
// Appends each radio element to gh-radio-tabs
item.find('div[data-pnlname]').each(function() {
if (ghmob(this).find('input[type="radio"]').length < 1) return;
var inputItem = ghmob(this).find('input[type="radio"]');
var re = new RegExp('\\$', 'g');
var buttonItem = ghmob('<input type="button" id="' + inputItem.attr('id') + '-button" name ="' + inputItem.attr('name') + '-button" class="gh-radio-buttons-input" onclick="ghmob(\'#' + inputItem.attr('id').replace(re, '\\\\$') + '\').trigger(\'click\')" value="' + ghmob(this).find('label').text() + '"/>');
buttonItem.appendTo(radioButtonWrapper);
if (autoSubmit && autoSubmit === true) {
buttonItem.attr('onclick', buttonItem.attr('onclick') + ';' + ghmob('a[href*=submitAction][href*=GO]').last().attr('href'));
}
ghmob(this).hide();
ghAccessibility.hideAriaComponent(ghmob(this));
});
item.append(radioButtonWrapper);
});
selector.trigger('create');
selector.find('.gh-radio-buttons-input').closest('.ui-btn').addClass('ui-btn-inline').find('.ui-btn-text').attr('aria-hidden', 'true');
return selector;
},
/**
* linksToTabs
* Sets links to tabs
*
* @param {(jQuery|array)} fields
* @returns {void}
*/
linksToTabs: function(fields) {
var attachTo = ghmob('#ACE_width, div[id$="divPSPAGECONTAINER"], .ps_pspagecontainer, .ps_pagecontainer').first();
// Create tabs wrapper element
if (attachTo.find('> .gh-tabs').length === 0) {
attachTo.prepend('<div class="gh-tabs"></div>');
}
ghmob.each(fields, function() {
var field = ghmob(this);
var isActive = (field.find('a').length === 0) ? 'active' : '';
field.addClass(isActive);
ghmob('.gh-tabs').append(field);
});
},
/**
* enhanceButtonUI
* Updates Edit/Delete button styling
*
* @ignore
* @param {object} buttons
* @param {jQuery} scope
* @returns {void}
*/
enhanceButtonUI: function(buttons, scope) {
if (ghConfig.interface.enhanceButtons === false) return;
if (typeof buttons === 'undefined') {
buttons = this.buttons;
}
for (var i = 0; i < buttons.length; i++) {
var sels = document.querySelectorAll('div' + buttons[i].id + ', span' + buttons[i].id + ', a' + buttons[i].id + ', input[type="button"]' + buttons[i].id, scope);
ghmob(sels).not('[id*="CONFIRM"], [id*="$prompt"], .ps_box-link').each(function() {
var thisContainer = ghmob(this).closest('.ui-body');
if ((ghmob(this).is('a[class*="PTROWADD"]') || ghmob(this).is('a[class*="PTROWDELETE"]')) && ghmob(this).parents('.ui-table, td[class*="ODDROW"], td[class*="EVENROW"]').length === 0 && thisContainer.length > 0) {
var config = {};
if (ghmob(this).attr('class').indexOf('ADD') > -1) {
config = {
color: 'success',
icon: 'fa-plus',
label: 'Add',
};
}
if (ghmob(this).attr('class').indexOf('DELETE') > -1) {
config = {
color: 'danger',
icon: 'fa-times',
label: 'Delete',
};
}
ghContainer.attachButton(thisContainer, ghmob(this), config);
return;
}
var color = (typeof buttons[i].color === 'undefined') ? '' : buttons[i].color;
var icon = (typeof buttons[i].icon === 'undefined') ? '' : 'ui-btn-icon-left fa ' + buttons[i].icon;
var text = (typeof buttons[i].text === 'undefined') ? ghmob(this).text().trim() : buttons[i].text;
text = (typeof buttons[i].useAltText === 'undefined') ? text : ghmob(this).find('img[alt]').attr('alt');
if (ghmob(this).find('input, textarea').length > 0 || ghmob(this).parents('.ui-select, .ps_box-grid-header_bar, .ps_grid-flex[role="presentation"], .psc_disabled-normaltext, .ps_header_modal, .ps_grid-list, .psc_trigger, thead, .psc_image_only, .ps_popup-menu, .ps_menusection, .ps_box-link, .ps_collection').length > 0) return;
// First check if this is a disabled button
if (ghmob(this).is('div') && ghmob(this).find('span, a').length === 0 && (ghmob(this).text().trim() !== '' || ghmob(this).find('img[alt]').length > 0)) {
ghmob(this).html('<a href="#" class="ui-disabled ' + icon + ' ' + color + '" tabindex="-1">' + text + '</a>');
ghmob(this).find('a').button();
}
// Second check if this is not a div element
else if ((ghmob(this).is('span') && ghmob(this).is('[class*="EDITBOX"]') === false && ghmob(this).find('a, input').length === 0) || (ghmob(this).is('a, input') && ghmob(this).closest('.ui-footer').length === 0)) {
// Return if blank
if (ghmob(this).is('span, a') && ghmob(this).text().trim() === '' && ghmob(this).find('input, img').length === 0) return;
// Return if button already made
if (ghmob(this).find('.ui-btn').length > 0) return;
// Remove images
if (ghmob(this).find('img').length > 0 && ghmob(this).text().trim() === '') {
if (ghmob(this).find('img[alt]').length > 0 && ghmob(this).find('img[alt]').attr('alt') !== '') {
if (ghmob(this).find('img[alt]').attr('alt').indexOf(text) > -1) {
ghmob(this).html(text);
}
else {
ghmob(this).html(ghmob(this).find('img[alt]').attr('alt'));
}
}
else {
ghmob(this).html(text);
}
}
// Sets proper font awesome icon class with button
var thisBtn = ghmob(this);
if (ghmob(this).parents('.ui-btn').not('.ui-li').length > 0) {
thisBtn = ghmob(this).closest('.ui-btn');
}
else {
thisBtn.removeAttr('style').removeClass('SSSIMAGECENTER SSSBUTTON_CONFIRMLINK SSSBUTTON_ACTIONLINK SSSBUTTON_CANCELLINK ps-button').attr('data-role', 'button').button();
if (ghmob(this).parents('.ui-btn').not('.ui-li').length > 0) {
thisBtn = ghmob(this).closest('.ui-btn');
}
}
if (icon !== '') {
thisBtn.addClass(icon);
}
if (color !== '') {
thisBtn.addClass(color);
}
if (thisBtn.find('.ui-btn-text').text().trim() === '' || thisBtn.find('.ui-btn-text').text().trim().indexOf(text) === -1) {
thisBtn.find('.ui-btn-text').text(text);
}
// Check if it should be disabled
if (ghmob(this).is('span') || ghmob(this).is('[disabled]')) {
thisBtn.addClass('ui-disabled');
}
// Remove labels and b tags
if (ghmob(this).parents('.ui-table').length > 0) {
ghmob(this).closest('div').find('label, b').remove();
ghmob(this).closest('td').addClass('ui-btn-inline');
}
}
// Third check if this is a div element with an additional div.ui-btn element
else if (ghmob(this).is('div') && ghmob(this).find('a').length > 0 && ghmob(this).find('div.ui-btn').length > 0) {
ghmob(this).find('img').remove();
// Sets proper font awesome icon class with button
ghmob(this).find('div.ui-btn').first().addClass(icon + ' ' + color);
// Check if it should be disabled
if (ghmob(this).find('input[disabled]').length > 0) {
ghmob(this).find('div.ui-btn').first().addClass('ui-disabled');
}
}
});
}
},
/**
* formatAlertMessages
* Adds appropriate classes and styling
* to alert messages.
*
* @ignore
* @param {jQuery} scope
* @returns {void}
*/
formatAlertMessages: function(scope) {
var selectors = this.alertMessagesSelectors;
ghmob(selectors.join(), scope).each(function() {
var $this = ghmob(this);
if ($this.is(':visible') === false || $this.parents('.legend').length > 0 || $this.parents('.ui-table').length > 0 || $this.parents('.gh-required').length > 0) return;
var thisLevel = $this.attr('class');
if ($this.is('img')) {
thisLevel = $this.attr('src');
}
var alertLevel;
if (thisLevel.indexOf('INFO') > 0 || thisLevel.indexOf('info') > 0 || thisLevel.indexOf('CONFIRM') > 0 || thisLevel.indexOf('confirm') > 0) {
alertLevel = 'info';
}
else if (thisLevel.indexOf('SUCCESS') > 0 || thisLevel.indexOf('success') > 0) {
alertLevel = 'success';
}
else if (thisLevel.indexOf('WARNING') > 0 || thisLevel.indexOf('warning') > 0) {
alertLevel = 'warning';
}
else if (thisLevel.indexOf('ALERT') > 0 || thisLevel.indexOf('ERROR') || thisLevel.indexOf('alert') > 0 || thisLevel.indexOf('error')) {
alertLevel = 'danger';
}
else {
alertLevel = 'info';
}
var config = {
level: alertLevel,
};
if ($this.is('img') || $this.is('[data-gh-replace]')) {
if ($this.parents('div[id*="MSG_GROUP"]').length > 0) {
$this = $this.closest('div[id*="MSG_GROUP"]');
}
else if ($this.parents('table.PSGROUPBOX').length > 0) {
$this = $this.closest('table.PSGROUPBOX').closest('div[id]');
}
else if ($this.parents('table.PSPAGEWBO').length > 0) {
$this = $this.closest('table.PSPAGEWBO').closest('div[id]');
}
else if ($this.parents('table.PSFRAME').length > 0) {
$this = $this.closest('table.PSFRAME').closest('div[id]');
}
else {
$this = ghInterface.getAlertMessage($this.closest('table'));
}
}
if ($this.parents('#PT_HEADER').length > 0) {
config.moveTo = 'top';
}
ghInterface.formatAlertMessage($this, config);
});
},
/**
* alertWrapper
* Draws the wrapper for alerts to reside
*
* @ignore
* @param {string} moveTo [top, bottom]
* @returns {void}
*/
alertWrapper: function(moveTo) {
var wrapper = ghmob('<div class="gh-page-alert"></div>');
var page = ghmob('#ACE_width, div[id$="divPSPAGECONTAINER"]').first();
if (ghPage.isFluid()) {
page = ghmob('.ps_pspagecontainer').not('.psc_hidden').first();
}
if (ghmob('.gh-page-alert.visually-hidden').length === 0) {
wrapper.clone().addClass('visually-hidden').attr('role', 'alert').attr('aria-live', 'assertive').insertBefore(page);
}
if (moveTo === 'bottom' && ghmob('.gh-page-alert.bottom').length === 0) {
wrapper.addClass('bottom').insertAfter(page);
}
if (moveTo === 'top' && ghmob('.gh-page-alert.top').length === 0) {
wrapper.addClass('top');
if (ghPage.isFluid()) {
wrapper.prependTo(page);
}
else {
wrapper.insertBefore(page);
}
}
},
/**
* alertItem
* Adds an alert item to the page
*
* @ignore
* @param {jQuery} selector
* @param {string} moveTo [top, bottom]
* @returns {void}
*/
alertItem: function(selector, moveTo) {
this.alertWrapper(moveTo);
selector = ghUtils.jqElem(selector);
var content = this.getAlertMessage(selector);
var text = content.text().trim();
var duplicate;
if (moveTo === 'top' || moveTo === 'bottom') {
duplicate = ghmob('.gh-page-alert.' + moveTo).find('.alert').filter(function() {
return (ghmob(this).text().indexOf(text) > -1);
});
if (duplicate.length === 0) {
selector.appendTo(ghmob('.gh-page-alert.' + moveTo).first());
}
}
var alerts = ghmob('.gh-page-alert[aria-live]').first();
alerts.children().each(function() {
var thisItem = ghmob(this);
duplicate = alerts.find('.alert').filter(function() {
return (ghmob(this).text().indexOf(thisItem.text()) > -1);
});
if (duplicate) {
thisItem.remove();
}
});
var alertNum = alerts.children().length + 1;
duplicate = alerts.find('.alert').filter(function() {
return (ghmob(this).text().indexOf(text) > -1);
});
if (text !== '' && duplicate.length === 0) {
alerts.append('<div id="alert-' + alertNum + '" class="alert"></div>');
var thisAlert = alerts.find('#alert-' + alertNum);
var heading = selector.closest('div[class="ui-body"], .ui-collapsible').find('.ui-bar, .ui-collapsible-heading').first().text().trim();
if (selector.parents('.ui-popup').length > 0) {
heading = selector.closest('.ui-popup').find('.ui-title').first().text().trim();
}
var headingLevel = ghHeader.headingStartLevel();
if (heading !== '') {
thisAlert.append('<h' + headingLevel + '>' + heading + '</h' + headingLevel + '>');
}
thisAlert.append('<p>' + text + '</p>');
}
},
/**
* dismissAlerts
*
* @ignore
* @returns {void}
*/
dismissAlerts: function() {
try {
if (typeof(Storage) !== 'undefined') {
var state = JSON.parse(sessionStorage.getItem('gh-alert-persist'));
if (state === null || typeof state !== 'object') return;
ghmob.each(state, function(i) {
ghmob('[id="' + state[i].id + '"]').closest('.alert').addClass('hidden');
});
}
}
catch (err) {
ghLog.info('Cannot hide closed alerts. No session storage.');
}
},
/**
* initalizeAlerts
*
* @returns {void}
*/
initializeAlerts: function() {
var _this = this;
ghmob('div[data-gh-alert-type]').each(function() {
var selector = ghmob(this);
var alertType = ghmob(this).attr('data-gh-alert-type');
if (selector.attr('data-gh-alert-element') !== undefined) {
selector = selector.find(selector.attr('data-gh-alert-element'));
}
var dismissible = ghmob(this).attr('data-gh-alert-dismissible') === 'true';
var config = {
level: alertType,
};
if (dismissible) {
config.dismissable = {
enabled: true,
persist: ghmob(this).attr('data-gh-alert-persist') === 'true',
};
}
var moveTo = ghmob(this).attr('data-gh-alert-moveto');
if (moveTo !== undefined) {
config.moveTo = moveTo;
}
_this.formatAlertMessage(selector, config);
});
},
/**
* formatAlertMessage
* Adds proper styling to an alert
*
* @ignore
* @param {jQuery} selectors
* @param {obj} [config]
* @param {string} [config.level] [info, success, warning, danger]
* @param {obj} [config.dismissable]
* @param {bool} [config.dismissable.enabled]
* @param {bool} [config.dismissable.persist]
* @param {obj} [config.moveTo] [top, bottom]
* @returns {void}
*/
formatAlertMessage: function(selectors, config) {
ghmob(selectors).each(function(i) {
var selector = ghmob(this);
if (selector.parents('.alert-message').length > 0) return;
if (selector.is('div') === false) {
selector = selector.closest('div');
}
var content = ghInterface.getAlertMessage(selector);
if (content.text().trim() === '') return;
if (typeof config !== 'object') {
var opts = {};
opts.level = config;
config = opts;
}
var alertLevel = config.level || 'alert alert-info';
if (alertLevel.indexOf('alert-') === -1) {
alertLevel = 'alert alert-' + alertLevel;
}
if (typeof config.dismissable !== 'object') {
config.dismissable = {};
}
var dismissable = config.dismissable.enabled || false;
var persist = config.dismissable.persist || false;
var moveTo = config.moveTo || '';
// Duplicate alert
var duplicate = ghmob('.gh-page-alert').find('.alert').filter(function() {
return (ghmob(this).text().indexOf(content.text().trim()) > -1);
});
if (i > 0 && duplicate.length > 0) return;
// Accessibility
ghInterface.alertItem(selector, moveTo);
// Add class
if (selector.hasClass('alert-message') || selector.parent('[role="alert"]').length > 0) return;
selector.addClass('alert-message').wrapAll('<div class="' + alertLevel + '" role="alert"></div>');
selector = selector.closest('.alert');
// Move icons
var icon = selector.find(ghInterface.alertMessagesSelectors.join()).first().filter(function() {
return (ghmob(this).is('span, img'));
});
if (icon.length === 0 && selector.closest('tr').prev('tr').find(ghInterface.alertMessagesSelectors.join()).length > 0) {
icon = selector.closest('tr').prev('tr').find(ghInterface.alertMessagesSelectors.join()).first().filter(function() {
return (ghmob(this).is('span, img'));
});
}
if (icon.length > 0 && icon.parents('.psc_display-inline').length === 0) {
if (icon.parent('a').length > 0) {
icon.unwrap();
}
icon.addClass('ui-btn-inline').insertBefore(content);
}
// Ensure ID
if (typeof selector.attr('id') === 'undefined') {
selector.attr('id', 'gh-alert-' + (ghmob('.alert').length + 1));
}
// Persist alerts
ghInterface.dismissAlerts();
// Dismissable
if (dismissable) {
selector.attr('data-gh-alert-dismissable', 'true');
if (selector.find('.alert-close').length === 0) {
selector.prepend('<a href="#" class="fa fa-close alert-close" aria-label="Close"></a>');
}
if (persist) {
selector.attr('data-gh-alert-persist', 'true');
}
}
// Cleanup
selector.find('span').removeAttr('style');
});
},
/**
* getAlertMessage
* Gets an alert from within specified selector
*
* @ignore
* @param {jQuery} selector
* @returns {string}
*/
getAlertMessage: function(selector) {
var content = ghmob(selector).find('span, div').filter(function() {
return (ghmob(this).find('.sr-only, .fa, img').length === 0 && ghmob(this).hasClass('sr-only') === false && ghmob(this).hasClass('fa') === false && ghmob(this).hasClass('gh-hidden') === false && ghmob(this).parents('.gh-hidden').length === 0 && ghmob(this).text().trim() !== '');
}).first();
if (content.length === 0) {
content = ghmob(selector);
}
return content;
},
/**
* getDateFormat
*
* @private
* @returns {string}
*/
_getDateFormat: function() {
if (typeof window['DatePrompt0_' + ghPage.getWin()] === 'undefined') {
return mobiscroll.settings.dateFormat;
}
var psDatePromptStr = window['DatePrompt0_' + ghPage.getWin()].toString();
var separator;
if (psDatePromptStr.indexOf('DMY') > -1) {
separator = psDatePromptStr.charAt(psDatePromptStr.indexOf('DMY') + 3);
return 'dd' + separator + 'mm' + separator + 'yy';
}
else if (psDatePromptStr.indexOf('DYM') > -1) {
separator = psDatePromptStr.charAt(psDatePromptStr.indexOf('DYM') + 3);
return 'dd' + separator + 'yy' + separator + 'mm';
}
else if (psDatePromptStr.indexOf('MYD') > -1) {
separator = psDatePromptStr.charAt(psDatePromptStr.indexOf('MYD') + 3);
return 'mm' + separator + 'yy' + separator + 'dd';
}
else if (psDatePromptStr.indexOf('MDY') > -1) {
separator = psDatePromptStr.charAt(psDatePromptStr.indexOf('MDY') + 3);
return 'mm' + separator + 'dd' + separator + 'yy';
}
else if (psDatePromptStr.indexOf('YDM') > -1) {
separator = psDatePromptStr.charAt(psDatePromptStr.indexOf('YDM') + 3);
return 'yy' + separator + 'dd' + separator + 'mm';
}
else if (psDatePromptStr.indexOf('YMD') > -1) {
separator = psDatePromptStr.charAt(psDatePromptStr.indexOf('YMD') + 3);
return 'yy' + separator + 'mm' + separator + 'dd';
}
},
/**
* formatPrompt
* Updates input prompt fields based on prompt config.
* Has options to attach/detach icons, hide/show icons,
* and enable/disable inline click action to open prompt.
*
* @ignore
* @param {jQuery} scope
* @returns {void}
*/
formatPrompt: function(scope) {
// Add attribute
ghmob('input[onkeyup*="DatePrompt_"]', scope).not('[data-role="mobiscroll"]').each(function() {
if (ghConfig.form.disableDatePicker !== true) {
ghmob(this).attr('data-role', 'mobiscroll');
}
ghmob(this).closest('div[id]').find('a[id*="' + ghmob(this).attr('id') + '$prompt"]').remove();
});
// Add calendar icon to prompts
ghmob('input[data-role="mobiscroll"]', scope).each(function() {
// Icon
var icon = 'fa-calendar';
var aria = 'date';
if (ghmob(this).attr('data-options') && ghmob(this).attr('data-options').indexOf('time') > -1) {
icon = 'fa-clock-o';
aria = 'time';
ghmob(this).mobiscroll().time();
}
else if (ghConfig.form.useCalendarPicker === true) {
ghmob(this).mobiscroll().calendar({ dateFormat: ghInterface._getDateFormat() });
}
else {
ghmob(this).mobiscroll().date({ dateFormat: ghInterface._getDateFormat() });
}
// Wrap
if (ghmob(this).closest('.prompt').length === 0) {
ghmob(this).parent().wrapAll('<div class="prompt"></div>');
}
// Add button
if (ghmob(this).closest('.prompt').find('a.mobiscroll').length === 0) {
ghmob(this).closest('.prompt').append('<a href="#" class="mobiscroll"><span class="fa ' + icon + '" aria-hidden="true"></span><span class="sr-only">Choose ' + aria + '</span></a>');
}
// Attributes
ghmob(this).mobiscroll('option', {'showOnFocus': false}).prop('readonly', false).prop('disabled', false).removeAttr('onkeyup');
});
// Buttons
ghmob('a[id*="$prompt"], a[id*="_LOOKUP"]', scope).each(function() {
var $btn = ghmob(this);
// Move button
if ($btn.attr('id').indexOf('_LOOKUP') > -1 && $btn.closest('div[id]').find('input[type="text"]').length === 0 && $btn.closest('tr').prev('tr').find('input[type="text"]').length > 0) {
$btn.appendTo($btn.closest('tr').prev('tr').find('input[type="text"]').first().closest('div[id]'));
}
// Wrappers
if ($btn.parent('.ps-icon-wrapper').length > 0) {
$btn.unwrap();
}
var $btnParent;
if (ghPage.isSearch()) {
$btnParent = $btn.parent();
}
else {
$btnParent = $btn.parents('div[id]').filter(function() {
return (ghmob(this).children('label').length > 0);
}).first();
if ($btnParent.length === 0) {
$btnParent = $btn.parent();
}
}
if ($btn.parents('.prompt').length === 0 && $btnParent.find('.prompt').length === 0) {
if ($btnParent.children('div[id]').not('.gh-helper-text').length === 0) {
$btnParent.children().not('label, .gh-helper-text').wrapAll('<div class="prompt"></div>');
}
else {
$btnParent.children('label').prependTo($btnParent.children('div[id]').not('.gh-helper-text').first());
$btnParent.children('div[id]').not('.gh-helper-text').first().children().not('label, .gh-helper-text').wrapAll('<div class="prompt"></div>');
}
}
});
ghmob('div.prompt', scope).each(function() {
var $this = ghmob(this);
// If detaching prompt icon to input field
if (ghConfig.prompt.iconAttached === false) {
ghInterface.detachPromptIcon($this);
}
// If hiding icon
if (ghConfig.prompt.iconStatus === 'hide') {
ghInterface.hidePromptIcon($this);
}
// Enable or disable direct input
if ($this.find('input[data-role="mobiscroll"]').length > 0 && ghConfig.prompt.inputClick === false) {
ghInterface.formatCalendarInput($this);
}
// Enable input field click
if ($this.find('a[id*="$prompt"]').length > 0 && ghConfig.prompt.inputClick === true) {
ghInterface.enablePromptInputClick($this);
}
// Add disabled class
if ($this.find('.ui-disabled').length > 0) {
$this.addClass('ui-disabled');
}
// Move label out of prompt
$this.find('label').insertBefore($this);
// Update screen reader text to be unique
var id = $this.find('input').attr('id');
var label = ghmob('label[for="' + id + '"]').first();
var labelId = label.attr('id');
if (typeof label.attr('id') === 'undefined') {
labelId = id + '-label';
}
$this.find('a[id*="$prompt"], a.mobiscroll').attr('aria-labelledby', labelId).attr('aria-haspopup', 'true').removeAttr('tabindex');
});
},
/**
* formatCalendarInput
* Remove events from the input in favor of the calendar button
*
* @ignore
* @param {jQuery} selector
* @returns {void}
*/
formatCalendarInput: function(selector) {
selector.find('input[data-role="mobiscroll"]').mobiscroll('option', {'showOnTap': false}).prop('readonly', false).prop('disabled', false);
},
/**
* enablePromptInputClick
* Prompt input click behaves the same way as clicking on prompt icon
*
* @ignore
* @param {jQuery} selector
* @returns {void}
*/
enablePromptInputClick: function(selector) {
var href = selector.find('a[id$="prompt"]').attr('href');
if (typeof href === 'undefined' || href === '#') return;
selector.find('input').attr('onclick', href);
},
/**
* hidePromptIcon
* Hide prompt icon
*
* @ignore
* @param {jQuery} selector
* @returns {void}
*/
hidePromptIcon: function(selector) {
selector.addClass('gh-hide-prompt-icon');
},
/**
* detachPromptIcon
* Detaches prompt icon from field input
*
* @ignore
* @param {jQuery} selector
* @returns {void}
*/
detachPromptIcon: function(selector) {
selector.addClass('gh-detach-prompt-icon');
},
/**
* cleanInputLabels
* Removes repetitive labels for input fields
*
* @ignore
* @param {jQuery} scope
* @returns {void}
*/
cleanInputLabels: function(scope) {
// Loop through input fields with anchors
ghmob('table.ui-table tbody td a', scope).closest('td').each(function() {
var $this = ghmob(this);
var inputText = $this.find('div:first').text().trim();
// Shouldn't really have label fields in tds but we should check anyway
if ($this.find('label').text().trim() === inputText || $this.find('b').text().trim() === inputText) {
$this.find('label, b').remove();
}
});
},
/**
* updateLogoutLink
* Revise update logout URL
*
* @ignore
* @param {jQuery} scope
* @returns {void}
*/
updateLogoutLink: function(scope) {
// Update all a tags with logout href
ghmob('a[href*="cmd=logout"]', scope).each(function() {
this.href = this.href.replace('/EMPLOYEE/HRMS/', '/');
});
},
/**
* appendPopups
* Append popup containers to jqm_main_page
*
* @ignore
* @param {jQuery} scope
* @returns {void}
*/
appendPopups: function(scope) {
ghmob('.ui-popup-container, .ui-popup-screen', scope).appendTo('#jqm_main_page');
},
/**
* makeCheckboxRadio
* Makes input[type=radio] into proper jQuery UI checkboxradio
*
* @ignore
* @param {jQuery} [scope]
* @returns {void}
*/
makeCheckboxRadio: function(scope) {
scope = (scope) ? scope : ghmob(document);
ghmob('input[type="radio"]', scope).filter('[id=]').each(function() {
var self = ghmob(this);
self.unwrap();
self.checkboxradio().trigger('remove.checkboxradio');
var label = self.parent().find('label');
self.attr('id', label.attr('for'));
self.css('display', 'none');
label.css('width', '100%');
}).checkboxradio();
},
/**
* removeSortableFromTables
* Get rid of a tags/sortable function from table th elements
*
* @param {jQuery} scope
* @returns {void}
*/
removeSortableFromTables: function(scope) {
// TO DO: Should this be handled in ghTable library?
if (ghConfig.table.sorting === true) return;
ghmob('th a', scope).each(function() {
ghmob(this).closest('th').text(ghmob(this).closest('th').text());
});
},
/**
* hideLogoText
* Hide the logo's h1 closest table in page header
*
* @ignore
* @param {jQuery} scope
* @returns {void}
*/
hideLogoText: function(scope) {
ghmob('.logoh1', scope).closest('table').closest('span').closest('table').hide();
},
/**
* removeNavListDesc
* Remove PS classes
*
* @ignore
* @param {jQuery} scope
* @returns {void}
*/
removeNavListDesc: function(scope) {
ghmob('#navlist', scope).find('.ui-li-desc').remove();
},
/**
* removeNavGo
* Remove any div elements with [id*="DERIVED_SSTSNAV_GO"]
*
* @ignore
* @param {jQuery} scope
* @returns {void}
*/
removeNavGo: function(scope) {
if (ghConfig.interface.enableGoto === true) {
ghmob('div[id*="NAV"][id*="GOTO"]', scope).removeClass('gh-hidden');
ghmob('div[id*="DERIVED_SSTSNAV_GO"]', scope).removeClass('gshidden gh-hidden');
return;
}
ghmob('div[id*="NAV"][id*="GOTO"]', scope).addClass('gh-hidden');
ghmob('div[id*="DERIVED_SSTSNAV_GO"]', scope).addClass('gh-hidden');
},
/**
* removeExtraneousElements
* Remove elements that cause accessibility failures
*
* @ignore
* @param {jQuery} scope
* @returns {void}
*/
removeExtraneousElements: function(scope) {
ghmob('label, b.ui-table-cell-label, .ps_box-label', scope).filter(function() {
return (ghmob(this).text().trim() === '' && ghmob(this).children().length === 0);
}).addClass('gh-hidden');
// Remove empty tabs
if (ghmob('[id$="divPSPANELTABS"] li', scope).length === 0) {
ghmob('[id$="divPSPANELTABS"]', scope).addClass('gh-hidden');
}
},
/**
* hideEmptyTDElements
* Hide tds that aren't part of .ui-table with hidden contents
*
* @param {jQuery} [scope]
* @returns {void}
*/
hideEmptyTDElements: function(scope) {
scope = (scope) ? scope : ghmob(document);
ghmob('div[style*=hidden]', scope).hide();
// Hide tds with hidden content
ghmob('td:visible:not(:has(:visible)):not(.PTPAGELETBODY)', scope).filter(function() {
if (ghmob(this).closest('.ui-table, .tablesaw').length === 0 && ghmob(this).find('.PTPAGELETBODY').length < 1) {
return true;
}
}).hide();
},
/**
* collapseEmptyPanels
* Remove whitespace from empty panels to collapse its height
*
* @param {jQuery} [selector]
* @param {jQuery} scope
* @returns {void}
*/
collapseEmptyPanels: function(selector, scope) {
if (typeof selector === 'undefined') {
selector = 'div[id]';
}
ghmob(selector, scope).children('span').filter(function() {
return (!ghmob.trim(ghmob(this).text()) && ghmob(this).children().length === 0);
}).text('');
ghmob(selector, scope).children(ghHeader.headings.join()).filter(function() {
return (!ghmob.trim(ghmob(this).text()));
}).addClass('gh-hidden').attr('aria-hidden', 'true');
},
/**
* updateMissingLabelClass
* Update appropriate labels by adding missing ui-input-text class
*
* @ignore
* @param {jQuery} [scope]
* @returns {void}
*/
updateMissingLabelClass: function(scope) {
scope = (scope) ? scope : ghmob(document);
// If label is not part of a button and is missing ui-input-text class
ghmob('div.ui-field-contain', scope).find('label').not('.ui-btn').not('.ui-input-text').addClass('ui-input-text');
},
/**
* fixCheckboxFocusState
* Update the focus classes on checkboxes
*
* @ignore
* @param {jQuery} scope
* @returns {void}
*/
fixCheckboxFocusState: function(scope) {
ghmob('.ui-checkbox input[type="checkbox"]', scope).on('focus', function() {
ghmob('.ui-checkbox label', scope).removeClass('ui-focus');
ghmob(this).closest('.ui-checkbox').find('label').addClass('ui-focus');
});
ghmob('.ui-checkbox input[type="checkbox"]', scope).on('blur', function() {
ghmob(this).closest('.ui-checkbox').find('label').removeClass('ui-focus');
});
},
/**
* formatHelperText
* Move descriptive text inline with associated input field
*
* @param {jQuery} [selector]
* @param {jQuery} [helperText]
* @param {jQuery} [scope]
* @returns {void}
*/
formatHelperText: function(selector, helperText, scope) {
scope = (scope) ? scope : ghmob(document);
// Set attributes for stray helper text
this._findHelperText(scope);
// Selector
if (typeof selector === 'undefined') {
selector = ghmob('div[id][aria-describedby]', scope).not('[role]');
if (typeof scope !== 'undefined' && scope.is('[aria-describedby]') && selector.length === 0) {
selector = scope.filter(function() {
return (typeof ghmob(this).attr('data-describedby') !== 'undefined');
});
}
}
// Helper text
if (typeof helperText === 'undefined') {
helperText = ghmob('div[id][data-describes-for]', scope);
if (typeof scope !== 'undefined' && scope.is('[data-describes-for]') && helperText.length === 0) {
helperText = scope.filter(function() {
return (typeof ghmob(this).attr('data-describes-for') !== 'undefined');
});
}
}
helperText.each(function(i) {
var $this = ghmob(this);
if (typeof $this.attr('id') === 'undefined') return;
if (typeof $this.attr('data-describes-for') === 'undefined') {
$this.attr('data-describes-for', ghmob(selector[i]).attr('id'));
}
var describesForSelector = ghmob('div[id="' + $this.attr('data-describes-for') + '"], div[id*="' + ghPage.getWin() + 'div' + $this.attr('data-describes-for') + '"]').not('[id$="-help"]');
if (typeof $this.attr('data-pginst') !== 'undefined' && typeof describesForSelector.attr('data-pginst') !== 'undefined') {
describesForSelector = describesForSelector.filter(function() {
return (ghmob(this).attr('data-pginst') === $this.attr('data-pginst'));
}).first();
}
else {
describesForSelector = describesForSelector.first();
}
if (describesForSelector.length === 0) return;
if (typeof $this.attr('data-pginst') === 'undefined' && typeof describesForSelector.attr('data-pginst') !== 'undefined') {
$this.attr('data-pginst', describesForSelector.attr('data-pginst'));
}
if (typeof describesForSelector.attr('aria-describedby') === 'undefined') {
describesForSelector.attr('aria-describedby', $this.attr('id'));
}
else if (ghmob('div[id="' + describesForSelector.attr('aria-describedby') + '"]').length === 0) {
describesForSelector.attr('aria-describedby', $this.attr('id'));
}
else if (describesForSelector.attr('aria-describedby').indexOf($this.attr('id')) === -1) {
describesForSelector.attr('aria-describedby', describesForSelector.attr('aria-describedby') + ' ' + $this.attr('id'));
}
selector = selector.add(describesForSelector);
});
selector.each(function() {
var $this = ghmob(this);
if (typeof $this.attr('aria-describedby') === 'undefined' || typeof $this.attr('id') === 'undefined') return;
var describedBy = $this.attr('aria-describedby').split(' ');
var describedBySelector;
var describedByText = [];
var describedByIds = [];
var pageInst = $this.attr('data-pginst');
ghmob.each(describedBy, function(i) {
describedBySelector = ghmob('div[id="' + describedBy[i] + '"], div[id*="' + ghPage.getWin() + 'div' + describedBy[i] + '"]');
if (typeof pageInst === 'undefined') {
describedBySelector = describedBySelector.first();
}
else {
describedBySelector = describedBySelector.filter(function() {
return (ghmob(this).attr('data-pginst') === pageInst);
}).first();
}
if (describedBySelector.length === 0 || describedBySelector.text().trim() === '') return;
describedBySelector.addClass('gh-hidden').attr('aria-hidden', 'true');
if (describedByText.indexOf(describedBySelector.text().trim()) === -1) {
describedByText.push(describedBySelector.text().trim());
}
if (describedByIds.indexOf(describedBySelector.attr('id')) === -1) {
describedByIds.push(describedBySelector.attr('id'));
}
});
$this.find('.gh-helper-text').remove();
if (describedByIds.length === 0 || describedByText.length === 0) {
$this.removeAttr('aria-describedby');
return;
}
if ($this.parent('[aria-describedby]').length > 0 && $this.parent('[aria-describedby]').attr('aria-describedby').indexOf($this.attr('aria-describedby')) > -1) {
$this.removeAttr('aria-describedby data-role').removeClass('ui-field-contain');
return;
}
$this.attr('aria-describedby', describedByIds.join(' ')).attr('data-role', 'fieldcontain').addClass('ui-field-contain');
if ($this.find('.gh-helper-text').length === 0) {
$this.append('<div class="gh-helper-text" id="' + $this.attr('id') + '-help"></div>');
if (typeof pageInst !== 'undefined') {
$this.find('.gh-helper-text').attr('data-pginst', pageInst);
}
}
$this.find('.gh-helper-text').text(describedByText.join(' '));
});
},
/**
* findHelperText
*
* @private
* @param {jQuery} scope
* @returns {void}
*/
_findHelperText: function(scope) {
if (scope.parents('.ui-table').length > 0) return;
var descr = ghmob('div[id] > span[id*="DESCR"]:not([style]), div[id] > span[class*="DISP"][id]:not([style])', scope).filter(function() {
return (ghmob(this).parents('.ui-table').length === 0);
});
if (descr.length === 0) return;
var describedby = descr.parent('div[id]').filter(function() {
return (ghmob(this).find('label:not([aria-hidden="true"])').length === 0 && ghmob(this).parents(ghLegend.selectors.join() + ', .ps_grid-list, .ui-table').length === 0 && ghmob(this).closest('table').find('th').length === 0 && ghmob(this).text().trim() !== '' && ghmob(this).hasClass('ui-btn-inline') === false && ghmob(this).hasClass('psc_list-linkitem'));
});
describedby.each(function() {
var describedfor;
if (ghmob(this).prev('div[id]:visible').not('.ui-btn-inline').length > 0 && (ghmob(this).prev('div[id]').find('.prompt').length > 0 || ghmob(this).prev('div[id]').children('span[id]').length === 1)) {
describedfor = ghmob(this).prev('div[id]');
}
else if (ghmob(this).closest('td').prev('td').find('div[id]').length === 1 && (ghmob(this).closest('td').prev('td').find('div[id]').find('.prompt').length > 0 || ghmob(this).closest('td').prev('td').find('div[id]').children('span[id]').length === 1)) {
describedfor = ghmob(this).closest('td').prev('td').find('div[id]:visible').first();
}
else if (ghmob(this).closest('tr').prev('tr').find('div[id]').length === 1 && (ghmob(this).closest('tr').prev('tr').find('div[id]').find('.prompt').length > 0 || ghmob(this).closest('tr').prev('tr').find('div[id]').children('span[id]').length === 1)) {
describedfor = ghmob(this).closest('tr').prev('tr').find('div[id]:visible').first();
}
else {
return;
}
describedfor.attr('aria-describedby', ghmob(this).attr('id'));
});
},
/**
* hideHorizontalRule
*
* @ignore
* @param {jQuery} scope
* @returns {void}
*/
hideHorizontalRule: function(scope) {
ghmob('.ps_box-hr', scope).filter(function() {
return (ghmob(this).text().trim() === '');
}).addClass('gh-hidden');
},
/**
* makeColumns
*
* @param {object} config
* @param {int} [config.breakpoint] - Provide a value from the following array or use default value of 1000 [400, 500, 600, 700, 800, 900, 1000, 1100, 1200, 1300, 1400, 1500, 1600]
* @param {string} [config.class] - Provide a string to define a class for the config
* @param {array} config.children
* @param {string} [config.children.class] - Provide a string to define a class for the column
* @param {jQuery} config.children.selector - Selector for column content
* @param {int} [config.children.width] - Provide a value for the width percentage of the column from the following array or use the default value of 100 [20, 25, 33, 50, 66, 75, 80, 100]
* @param {jQuery} config.parent - Selector to which column will be appended
* @returns {void}
*/
makeColumns: function(config) {
var breakpoint = config.breakpoint;
if (typeof breakpoint === 'undefined' || breakpoint === '') {
breakpoint = '1000';
}
var columns = ghmob('<div class="gh-cols gh-cols-flex gh-cols-' + breakpoint + '"></div>');
var selector = ghmob(config.parent);
if (config.class && config.class !== '') {
columns.addClass(config.class);
if (ghmob('.gh-cols.' + config.class).length > 0) return;
}
if (selector.hasClass('ui-body') && selector.children('.gh-col').length === 0) {
selector.find('.ui-bar').first().after(columns);
columns = selector.children('.gh-cols');
}
else if (selector.find('> div[class="ui-body"]').length === 1) {
selector.find('> div[class="ui-body"] > .ui-bar').first().after(columns);
columns = selector.find('> div[class="ui-body"] > .gh-cols');
}
else if (selector.find('> .gh-col').length === 0) {
selector.prepend(columns);
columns = selector.find('> .gh-cols');
}
else {
return;
}
ghmob.each(config.children, function(i) {
var thisColumn = ghmob('<div class="gh-col gh-cols-flex"></div>');
var thisColumnContent = ghmob(config.children[i].selector);
var thisColumnClass = config.children[i].class;
var thisColumnWidth = config.children[i].width;
if (thisColumnContent.children('div[class="ui-body"]').length > 0) {
thisColumnContent = thisColumnContent.children('div[class="ui-body"]');
}
if (typeof thisColumnWidth === 'undefined' || thisColumnWidth === '') {
thisColumn.addClass('gh-col-100');
}
else {
thisColumn.addClass('gh-col-' + thisColumnWidth);
}
if (typeof thisColumnClass !== 'undefined' || thisColumnClass !== '') {
thisColumn.addClass(thisColumnClass);
}
thisColumnContent.appendTo(thisColumn);
thisColumn.appendTo(columns);
});
return;
},
/**
* moveRequiredLabel
*
* @ignore
* @param {jQuery} scope
* @returns {void}
*/
moveRequiredLabel: function(scope) {
if (ghConfig.interface.moveRequiredLabel === false) return;
var target = ghmob('#ACE_width, div[id$="divPSPAGECONTAINER"]').first();
scope = (scope) ? scope : target;
var required = ghmob(scope).find('div[id*="REQ"] > span, div[id*="REQ"] > label').filter(function() {
return (ghmob(this).text() === '* Required Field' || ghmob(this).text() === '*Required Field');
});
if (required.length === 0) return;
var first = required.first();
var firstParent = first.closest('div[id]');
var duplicate = firstParent.find('span').filter(function() {
return (ghmob(this).text().indexOf(first.text().trim()) > -1);
});
if (first.is('label') && duplicate.length === 0) {
if (firstParent.find('span').length === 0 || firstParent.find('span').first().text().trim() !== '') {
firstParent.append('<span>' + required.text().trim() + '</span>');
}
else {
firstParent.find('span').first().text(required.text().trim());
}
first.addClass('gh-hidden').attr('aria-hidden', 'true');
}
required.closest('div[id]').addClass('gh-required');
if (target.first().is('table')) {
firstParent.insertBefore(target);
}
else {
firstParent.prependTo(target);
}
},
/**
* addSaveWait
*
* @ignore
* @returns {void}
*/
addSaveWait: function() {
var id = 'saveWait_' + ghPage.getWin();
var selector = ghmob('[id="' + id + '"]');
if (selector.length === 0) {
ghmob('<div id="' + id + '"></div>').appendTo(ghmob('.ui-page'));
}
},
/**
* formatUnorderedLists
*
* @ignore
* @param {jQuery} scope
* @returns {void}
*/
formatUnorderedLists: function(scope) {
ghmob('img[src*="BULLET"].PSSTATICIMAGE', scope).each(function() {
var list = ghmob(this).closest('table').prev('.gh-list');
if (list.length === 0) {
list = ghmob('<ul class="gh-list"></ul>');
ghmob(this).closest('table').before(list);
}
var label = ghmob(this).closest('tr').find('span.PSTEXT').not('.gh-hidden').first();
var descr = ghmob(this).closest('tr').find('span.PSEDITBOX_DISPONLY').not('.gh-hidden').first();
if (descr.length === 0) {
descr = ghmob(this).closest('tr').next('tr').find('span.PSEDITBOX_DISPONLY').not('.gh-hidden').first();
}
label.addClass('gh-hidden');
descr.addClass('gh-hidden');
var duplicate = list.find('li').filter(function() {
return (ghmob(this).text().indexOf(descr) > -1);
});
if (duplicate.length > 0) return;
var listItem = ghmob('<li></li>');
listItem.append('<strong>' + label.text().trim() + '</strong> ');
listItem.append('<span>' + descr.text().trim() + '</span>');
if (listItem.text().trim() !== '') {
list.append(listItem);
}
ghmob(this).closest('tr').addClass('gh-hidden').next('tr').addClass('gh-hidden');
});
},
/**
* scrapeDefinedSizes
*
* @ignore
* @param {jQuery} scope
* @returns {void}
*/
scrapeDefinedSizes: function(scope) {
ghmob('td[height]', scope).removeAttr('height');
ghmob('td[width]', scope).removeAttr('width');
},
/**
* displayInline
*
* @param {jQuery} selectors
* @returns {void}
*/
displayInline: function(selectors) {
ghmob(selectors).each(function(i) {
if (ghmob(this).parents('[data-pnlname]').length === 0) return;
var thisParent = (ghmob(this).is('div[id]') === false) ? ghmob(this).closest('div[id]:not(.ui-collapsible):not(.ui-collapsible-content)') : ghmob(this);
if (i > 0) {
var previous = ghmob(ghmob(selectors)[i - 1]);
var previousParent = (previous.is('div[id]') === false) ? previous.closest('div[id]:not(.ui-collapsible):not(.ui-collapsible-content)') : previous;
if (thisParent.prev(previousParent).length === 0) {
thisParent.addClass('ui-btn-inline').insertAfter(previousParent.addClass('ui-btn-inline'));
}
}
});
},
/**
* alertCloseClick
*
* @private
* @param {jQuery} selector
* @returns {void}
*/
_alertCloseClick: function(selector) {
var thisAlert = ghmob(selector).closest('.alert');
thisAlert.addClass('gh-hidden');
if (thisAlert.attr('data-gh-alert-persist') === 'true' && thisAlert.find('[id]').length > 0) {
try {
if (typeof(Storage) !== 'undefined') {
var state = JSON.parse(sessionStorage.getItem('gh-alert-persist'));
if (state === null) {
state = [];
}
var thisState = {
id: thisAlert.find('[id]').first().attr('id'),
};
state.push(thisState);
sessionStorage.setItem('gh-alert-persist', JSON.stringify(state));
}
}
catch (err) {
ghLog.info('Cannot persist alert [id="' + thisAlert.attr('id') + '"]. No session storage.');
}
}
},
/**
* _eventBindings
*
* @private
* @returns {void}
*/
_eventBindings: function() {
ghmob(document)
.off('click.ghInterface.calendarPromptClick')
.on('click.ghInterface.calendarPromptClick', '.prompt a.mobiscroll', function(event) {
ghLog.event('click.ghInterface.calendarPromptClick');
event.preventDefault();
ghInterface._calendarPromptClick(ghmob(event.currentTarget));
});
ghmob(document)
.off('change.ghInterface.calendarInput')
.on('change.ghInterface.calendarInput', 'input[data-role="mobiscroll"][onchange]', function() {
ghLog.event('change.ghInterface.calendarInput');
if (typeof ghmob(this).attr('id') === 'undefined' || ghConfig.page.handleFieldChanges !== true) return;
ghPage.submitAction(ghmob(this).attr('id'));
});
ghmob(document)
.off('click.ghInterface.alertCloseClick')
.on('click.ghInterface.alertCloseClick', '.alert-close', function(event) {
ghLog.event('click.ghInterface.alertCloseClick');
event.preventDefault();
ghInterface._alertCloseClick(ghmob(event.currentTarget));
});
ghmob(document)
.off('click.ghInterface.radioTabClick')
.on('click.ghInterface.radioTabClick', '.gh-radio-tabs .gh-radio a', function(event) {
ghLog.event('click.ghInterface.radioTabClick');
event.preventDefault();
ghInterface._radioTabClick(ghmob(event.currentTarget));
});
},
/**
* onPageBeforeCreate
*
* @private
* @returns {void}
*/
onPageBeforeCreate: function() {
if (ghConfig.interface.enabled === false) return;
this._layout.run();
ghmob('a[data-role="button"]').find('input[type="button"]').parents('a[data-role="button"]').removeAttr('data-role').removeAttr('role').removeAttr('data-theme');
},
/**
* layout
*
* @private
* @type {obj}
*/
_layout: {
/**
* pageSelector
*
* @private
* @type {string}
*/
_pageSelector: '[data-role="page"]',
/**
* headerSelector
*
* @private
* @type {string}
*/
_headerSelector: '[data-role="header"]',
/**
* contentSelector
*
* @private
* @type {string}
*/
_contentSelector: '[data-role="content"]',
/**
* panelSelector
*
* @private
* @type {string}
*/
_panelSelector: '[data-role="panel"]',
/**
* getPage
*
* @private
* @returns {jQuery}
*/
_getPage: function() {
return ghmob(this._pageSelector);
},
/**
* getHeader
*
* @private
* @returns {jQuery}
*/
_getHeader: function() {
return ghmob(this._headerSelector);
},
/**
* getContent
*
* @private
* @returns {jQuery}
*/
_getContent: function() {
return ghmob(this._contentSelector);
},
/**
* getPanel
*
* @private
* @returns {jQuery}
*/
_getPanel: function() {
return ghmob(this._panelSelector);
},
/**
* setClasses
*
* @private
* @returns {void}
*/
_setClasses: function() {
ghmob('html').addClass('ui-mobile');
this._getPage().addClass('ui-page');
this._getHeader().addClass('ui-header');
this._getContent().addClass('ui-content');
if (ghmob('.ps_pagecontainer').length === 0) {
ghmob('[id="' + ghPage.getWin() + 'divPAGECONTAINER"]').addClass('ps_pagecontainer');
}
},
/**
* setRoles
*
* @private
* @returns {void}
*/
_setRoles: function() {
var header = this._getPage().find('> ' + this._headerSelector);
var content = this._getPage().find('> .ui-panel-content-wrap > ' + this._contentSelector);
var panel = this._getPage().find('> ' + this._panelSelector);
header.attr('role', 'banner');
content.attr('role', 'main');
panel.attr('role', 'navigation');
if (ghPage.isTargetContent()) {
content.attr('aria-label', 'Main Content');
}
if (ghPage.isIFrameTemplate()) {
content.attr('aria-label', 'Portal Content');
}
if (ghPage.isIFrameModal()) {
content.attr('aria-label', 'Frame Content');
header.attr('aria-label', 'Frame Banner');
panel.attr('aria-label', 'Frame Main Navigation');
}
else {
panel.attr('aria-label', 'Main Navigation');
}
},
/**
* run
*
* @ignore
* @returns {void}
*/
run: function() {
this._setClasses();
this._setRoles();
},
},
/**
* run
* Run constructor
*
* @ignore
* @param {jQuery} [scope]
* @returns {void}
*/
run: function(scope) {
scope = (scope) ? scope : ghmob(document);
if (ghConfig.interface.enabled === false) return;
this._eventBindings();
// UI enhancement
this.formatAlertMessages(scope);
this.formatHelperText(undefined, undefined, scope);
this.removeExtraneousElements(scope);
this.updateLogoutLink(scope);
this.hideLogoText(scope);
this.removeNavListDesc(scope);
this.removeNavGo(scope);
this.appendPopups(scope);
this.hideHorizontalRule(scope);
this.collapseEmptyPanels(undefined, scope);
this.moveRequiredLabel(scope);
this.dismissAlerts(scope);
this.addSaveWait();
this.scrapeDefinedSizes(scope);
this.initializeAlerts();
this.formatPrompt(scope);
this.fixCheckboxFocusState(scope);
this.formatUnorderedLists(scope);
},
};
/* run */
ghInit.module('ghInterface');
/**
* ghState
* Manage PeopleMobile states between pages
*
* @module state
* @author Nick Barone
*/
var ghState = ghState || {
/**
* currentState
* Map of current state objects
*
* @private
* @param {int} age
* @param {bool} isProtected
* @param {obj} config
* @type {obj}
*/
_currentState: {},
/**
* getURLParams
*
* @private
* @returns {null|obj}
*/
_getURLParams: function() {
if (location.search === '') return;
var urlParamsArray = location.search.substring(1).split('&');
var urlParams = {};
ghmob.each(urlParamsArray, function(k, v) {
urlParams[v.split('=')[0]] = v.split(/=(.+)?/)[1];
});
return urlParams;
},
/**
* setViaURL
* Set state via url params
*
* @private
* @returns {null}
*/
_setViaURL: function() {
var urlParams = this._getURLParams();
var setStates = {};
// build states
ghmob.each(urlParams, function(k, v) {
// ignore not state params
if (k.substring(0, 3) !== 'ghs') return;
var stateKey = k.replace('ghs_', '');
// check for configs
if (stateKey.split('_')[1] === undefined) {
if (setStates[stateKey] === undefined) {
setStates[stateKey] = {age: parseInt(v), config: {}};
}
}
else {
var stateConfigItem = stateKey.split('_')[1];
setStates[stateKey.split('_')[0]]['config'][stateConfigItem] = v;
}
});
// set states
ghmob.each(setStates, function(state, stateData) {
// check for state config
if (ghmob.isEmptyObject(stateData.config)) {
stateData.config = null;
}
// push state
ghState.push(state, stateData.age, stateData.config);
});
return;
},
/**
* putInStore
*
* @private
* @returns {null}
*/
_putInStore: function() {
try {
// the try/catch fixes an issue on WP where setItem is unavailable
// it seems this also is an issue on private browsing mode
// we want to revisit this when we use ghState more often
sessionStorage.setItem('gh-state', JSON.stringify(this._currentState));
}
catch (ex) {
ghLog.error(ex);
}
return;
},
/**
* getFromStore
*
* @private
* @returns {obj}
*/
_getFromStore: function() {
try {
var currentState = JSON.parse(sessionStorage.getItem('gh-state'));
return (currentState === null) ? {} : currentState;
}
catch (ex) {
ghLog.error(ex);
}
return {};
},
/**
* processAge
* Runs through states to dismiss expired states
*
* @returns {null}
*/
_processAge: function() {
ghmob.each(this._currentState, function(state, config) {
// skip indefinite states
if (config.age === -1) return;
if (config.age === 0) {
// remove expired states
delete ghState._currentState[state];
}
else {
// decrement other states
ghState._currentState[state].age--;
}
});
return;
},
/**
* push
*
* @param {string} state
* @param {int} [age=1] - Number of page loads after which to dismiss state, -1 = indefinite
* @param {obj} [config=null] - Any data you want to pass along
* @param {bool} [isProtected=false] - Sets a state to protected so it cannot be overridden, unless set to true on overwrite
* @param {bool} [retrieveOnce=false] - Removes state after it is retrieved once
* @returns {bool} success
*/
push: function(state, age, config, isProtected, retrieveOnce) {
if (!state) return false;
// set protection
isProtected = (isProtected === true) ? true : false;
// set retrieve once
retrieveOnce = (retrieveOnce === true) ? true : false;
// return if this state is protected
if (this._currentState[state] && this._currentState[state]['isProtected'] === true && isProtected !== true) {
ghLog.error('Failed to set state [' + state + '] because it is protected. Override protection by setting isProtected to true');
return false;
}
// set default age
age = (age) ? age : 1;
// set default state data
config = (config) ? config : null;
// build state object
this._currentState[state] = {
age: age,
isProtected: isProtected,
retrieveOnce: retrieveOnce,
config: config,
};
// store new data in local storage
this._putInStore();
return true;
},
/**
* remove
* Remove a state
*
* @param {string} state
* @returns {null}
*/
remove: function(state) {
if (!state) return;
if (!this._currentState[state]) return;
delete this._currentState[state];
this._putInStore();
return;
},
/**
* get
*
* @param {string} state
* @returns {(bool|obj)}
*/
get: function(state) {
if (!state) return false;
// check if state exists
if (!this._currentState[state]) return false;
var thisState = this._currentState[state];
// remove state if it can only be accessed once
if (thisState.retrieveOnce === true) {
ghState.remove(state);
}
// check if state has a config, return true if it doesn't
if (thisState.config === null) return true;
// return state config
return thisState.config;
},
/**
* onPageBeforeCreate
*
* @returns {void}
*/
onPageBeforeCreate: function() {
// TODO: This needs to be moved into its own method - no code in run()
if (Object.keys(this._currentState).length === 0) {
this._currentState = this._getFromStore();
}
this._processAge();
this._putInStore();
},
/**
* run
*
* @ignore
* @returns {null}
*/
run: function() {
return;
},
};
ghInit.module('ghState');
/**
* ghLoader
*
* @module loader
*
* @config enabled [true, false]
* @config animate [true, false]
* @config defaultMessage ["Loading"]
* @config delayPageShow [true, false]
* @config useCover [true, false]
* @config usePageTitle [true, false]
*
* @trigger ghLoaderStart
* @trigger ghLoaderStop
*/
var ghLoader = ghLoader || {
/**
* isLoading
*
* @type {bool}
*/
isLoading: false,
/**
* popupAnchor
* Where to attach loading popup
*
* @private
* @type {jQuery}
*/
_popupAnchor: ghmob('body > [data-role="page"]'),
/**
* isVisible
*
* @ignore
* @returns {bool}
*/
isVisible: function() {
return (ghmob('.gh-loader-cover').length > 0 || ghmob('.gh-loader-popup.show').length > 0);
},
/**
* getPageTitle
*
* @ignore
* @returns {(string|bool)}
*/
getPageTitle: function() {
var pageTitle = ghmob('.gh-page-header h1');
if (pageTitle.length < 1 || pageTitle.text().trim() === '') return false;
return pageTitle.text().trim();
},
/**
* getTitle
*
* @ignore
* @param {string} [title]
* @returns {string}
*/
getTitle: function(title) {
// check for given title
title = (title) ? title : ghConfig.loader.defaultMessage;
// append page title if enabled
if (ghConfig.loader.usePageTitle && this.getPageTitle() && ghConfig.loader.defaultMessage === title) {
title = title + ' ' + this.getPageTitle();
}
return title;
},
/**
* setTitle
*
* @ignore
* @returns {void}
*/
setTitle: function(title) {
if (typeof title === 'undefined') {
title = this.getTitle();
}
else {
title = this.getTitle(title);
}
var popupTitle = ghmob('.gh-loader-popup-title');
var popupTitleText = popupTitle.text().trim();
if (popupTitleText === '' || popupTitleText !== title) {
popupTitle.text(title);
}
},
/**
* showCover
* Shows a loading cover
*
* @ignore
* @param {string} [title]
* @returns {void}
*/
showCover: function() {
ghmob('body').addClass('gh-loader-cover');
},
/**
* hideCover
* Hides a loading cover
*
* @ignore
* @returns {void}
*/
hideCover: function() {
ghmob('body').removeClass('gh-loader-cover');
},
/**
* showPopup
*
* @ignore
* @param {string} [title]
* @returns {void}
*/
showPopup: function(title) {
ghmob('.gh-loader-popup').addClass('show').removeAttr('aria-hidden');
if (ghConfig.loader.animate === true) {
ghmob('.gh-loader-popup').addClass('animate');
}
this.setTitle(title);
// hide default loader
ghmob('.ui-loader').removeClass('show');
},
/**
* hidePopup
* Hides a loading popup
*
* @ignore
* @returns {void}
*/
hidePopup: function() {
ghmob('.gh-loader-popup').removeClass('show animate').attr('aria-hidden', 'true');
},
/**
* show
*
* @param {string} [title=Loading]
* @param {bool} showCover
* @returns {void}
*/
show: function(title, showCover) {
if (this.isLoading === true) return;
if (ghPage.isTargetContent()) {
ghUtils.getWinTop().ghLoader.show(title, showCover);
return;
}
if (ghConfig.loader.useCover === true || showCover === true) {
this.showCover();
}
this.showPopup(title);
this.isLoading = true;
},
/**
* hide
*
* @returns {void}
*/
hide: function() {
this.hideCover();
this.hidePopup();
this.isLoading = false;
if (ghPage.isTargetContent()) {
ghUtils.getWinTop().ghLoader.hide();
}
},
/**
* setAnchorTriggers
*
* @ignore
* @param {jQuery} selector
* @param {obj} event
* @returns {void}
*/
setAnchorTriggers: function(selector) {
if (ghConfig.loader.enabled === false) return;
var href = selector.attr('href') || '';
var onclickAction = selector.attr('onclick') || '';
var target = selector.attr('target') || '';
var action = selector.attr('action') || '';
if (onclickAction.substr(0, 11) === 'window.open') return;
var isNonLoaderUrl = ((target !== '' && target !== '_self' && target !== 'gh-top') || action !== '' || href.toLowerCase().indexOf('javascript:') > -1 || href.indexOf('tel:') > -1 || href.indexOf('mailto:') > -1 || href.indexOf('#') === 0 || href === '');
if (isNonLoaderUrl === true) return;
ghLoader.show();
},
/**
* onLoaderStart
*
* @ignore
* @returns {void}
*/
onLoaderStart: function() {
if (ghConfig.loader.enabled === false) return;
ghLoader.show();
ghLoader.isLoading = true;
},
/**
* onLoaderStop
*
* @ignore
* @returns {void}
*/
onLoaderStop: function() {
if (ghConfig.loader.enabled === false) return;
ghLoader.hide();
ghLoader.isLoading = false;
},
/**
* onPageBeforeCreate
*
* @ignore
* @returns {void}
*/
onPageBeforeCreate: function() {
ghmob('.ui-loader').attr('aria-live', 'assertive');
if (ghmob('.gh-loader').length === 0) {
this._popupAnchor.append(ghmob('<div class="gh-loader" aria-live="assertive"><div class="gh-loader-popup" aria-hidden="true"><div class="gh-loader-popup-inner"><div class="gh-loader-spinner" aria-hidden="true"></div><div class="gh-loader-popup-title"></div></div></div></div>'));
}
this.setTitle();
},
/**
* _eventBindings
*
* @private
* @returns {void}
*/
_eventBindings: function() {
ghmob(document)
.off('click.ghLoader.setAnchorTriggers')
.on('click.ghLoader.setAnchorTriggers', 'a', function() {
ghLog.event('click.ghLoader.setAnchorTriggers');
ghLoader.setAnchorTriggers(ghmob(this));
});
ghmob('iframe[id="ptifrmtgtframe"]')
.off('load.ghLoader.hide')
.on('load.ghLoader.hide', function(event) {
ghLog.event('load.ghLoader.hide');
try {
if (typeof event.currentTarget.contentWindow.document !== 'undefined') {
return;
}
}
catch (err) {
ghUtils.getWinTop().ghLoader.hide();
}
});
},
/**
* run
*
* @ignore
* @returns {void}
*/
run: function() {
this._eventBindings();
},
};
ghInit.module('ghLoader');
// Close the loader in iOS after using back button
window.onpageshow = function(event) {
if (event.persisted) {
ghLoader.hide();
}
};
/**
* ghAttachments
*
* @module attachments
* @owner Nick Barone
* @config appKeys
* @config deviceText
*/
var ghAttachments = ghAttachments || {
/**
* externalResources
*
* @type {obj}
*/
externalResources: {
'dropbox': {
id: 'dropboxjs',
src: 'https://www.dropbox.com/static/api/2/dropins.js',
keyAttr: 'data-app-key',
},
'box': {
src: 'https://app.box.com/js/static/select.js',
},
'onedrive': {
src: 'https://js.live.net/v5.0/OneDrive.js',
keyAttr: 'client-id',
},
},
/**
* isUploadForm
*
* @returns {bool}
*/
isUploadForm: function() {
return !!(ghmob('input[type="file"]').length);
},
/**
* loadExternalResource
*
* @ignore
* @param {string} type
* @param {obj} resource
* @returns {null}
*/
loadExternalResource: function(type, resource) {
var resourceId = (resource.id) ? resource.id : 'gh-external-' + type;
// check if resource already loaded
if (ghmob('#' + resourceId).length) return;
// create resource DOM element
var externalResource = document.createElement('script');
externalResource.setAttribute('id', type + 'js');
externalResource.setAttribute('src', resource.src);
// get app key
if (resource.keyAttr) {
externalResource.setAttribute(resource.keyAttr, ghConfig.attachments.appKeys[type]);
}
document.head.appendChild(externalResource);
return;
},
/**
* loadResources
*
* @ignore
* @returns {null}
*/
loadResources: function() {
ghmob.each(ghConfig.attachments.appKeys, function(app, appKey) {
if (appKey === null || appKey === undefined) return;
ghAttachments.loadExternalResource(app, ghAttachments.externalResources[app]);
});
return;
},
/**
* buildDropBoxUI
*
* @ignore
* @returns {null}
*/
buildDropBoxUI: function() {
ghmob('#gh-upload-cloud').append('<a class="gh-dropbox">Dropbox</a>');
var dropboxLink = ghmob('.gh-dropbox');
dropboxLink.attr('href', 'javascript:Dropbox.choose(ghAttachments.getDropBoxOptions());');
dropboxLink.button();
dropboxLink.addClass('ui-btn-icon-left fa fa-dropbox success');
return;
},
/**
* getDropBoxOptions
*
* @ignore
* @returns {obj}
*/
getDropBoxOptions: function() {
return {
success: function(files) {
// TODO - check the file size before we submit
var url = files[0].link;
var fileName = files[0].name;
var fileSize = files[0].size;
ghAttachments.addURLForUploadToForm(url, fileName);
ghAttachments.submitForCloudStorageUpload();
},
cancel: function() {
ghAttachments.cancelCloudStorageUpload();
},
linkType: 'direct',
multiselect: false,
};
},
/**
* addURLForUploadToForm
*
* @ignore
* @param {string} url
* @param {string} fileName
* @param {string} inputName
* @returns {null}
*/
addURLForUploadToForm: function(url, fileName, inputName) {
inputName = (inputName) ? inputName : '#ICOrigFileName';
var hiddenFields = document.getElementById(ghPage.getWin() + 'divPSHIDDENFIELDS');
var uploadURLInput = document.createElement('input');
var uploadFilenameInput = document.createElement('input');
// set up URL field
uploadURLInput.setAttribute('type', 'hidden');
uploadURLInput.setAttribute('name', inputName + '.downloadurl');
uploadURLInput.setAttribute('value', url);
hiddenFields.appendChild(uploadURLInput);
// set up filename field
uploadFilenameInput.setAttribute('type', 'hidden');
uploadFilenameInput.setAttribute('name', inputName + '.filename');
uploadFilenameInput.setAttribute('value', fileName);
hiddenFields.appendChild(uploadFilenameInput);
return;
},
/**
* deviceUploadExists
*
* @ignore
* @returns {bool}
*/
deviceUploadExists: function() {
return !!(ghmob('#gh-upload-device').length);
},
/**
* submitForCloudStorageUpload
*
* @ignore
* @returns {function}
*/
submitForCloudStorageUpload: function() {
// return;
return Function('doModalMFormSubmit_' + ghPage.getWin() + '(' + ghPage.getWin() + ', "#ICOK");')();
},
/**
* cancelCloudStorageUpload
*
* @ignore
* @returns {null}
*/
cancelCloudStorageUpload: function() {
return;
},
/**
* init
*
* @ignore
* @returns {null}
*/
init: function() {
if (!this.isUploadForm()) return;
var filePicker = ghmob('input[type="file"]');
// check if device upload already exists
if (this.deviceUploadExists()) return;
// wrap existing file picker
filePicker.closest('div').wrap('<div id="gh-upload-device"></div>');
var uploadDeviceContainer = ghmob('#gh-upload-device');
uploadDeviceContainer.append(ghmob('input[value="Upload"]').closest('a'));
var uploadCloudContainer = ghmob('<div id="gh-upload-cloud"></div>');
uploadDeviceContainer.after(uploadCloudContainer);
/* TODO - this presumes the upload dialog is in its own frame
but that is not always the case (especially in older tools releases) */
ghmob('.ui-mobile .ui-page[data-role="page"]').addClass('gh-attachments');
// removeEmptyElements('br');
// allow any storage services to init their UI
ghmob(document).trigger('gh.cloudstorageinit');
ghContainer.create(ghmob('#gh-upload-device'), ghConfig.attachments.deviceText);
ghContainer.create(ghmob('#gh-upload-cloud'), ghConfig.attachments.cloudText);
return;
},
/**
* run
*
* @ignore
* @returns {null}
*/
run: function() {
if (!this.isUploadForm() || ghConfig.attachments.enabled === false) return;
// console.log('running attachments module');
this.init();
this.loadResources();
return;
},
};
ghInit.module('ghAttachments');
ghmob(document).on('gh.cloudstorageinit', function() {
ghAttachments.buildDropBoxUI();
});
/**
* ghTilesNavigation
*
* @module navigationTiles
* @owner Ashley Callahan
* @config enabled [true, false]
* @config getDefaultAlerts [true, false]
* @config tiles.breakpoint [400, 500, 600, 700, 800, 900, 1000]
* @config tiles.display ['popup', 'inline']
* @config tiles.responsive [true, false]
* @config tiles.suppressResponsivePopups [true, false]
* @config showSubnav [true, false]
* @config sequentialSubnav [true, false]
* @config limitNavByTab [true, false]
*/
var ghTilesNavigation = ghTilesNavigation || {
/**
* tileContainerName
*
* @ignore
* @type {string}
*/
tileContainerName: 'tile-content',
/**
* tileContainer
*
* @ignore
* @returns {jQuery}
*/
tileContainer: function() {
return ghmob('.' + this.tileContainerName);
},
/**
* navContainer
*
* @ignore
* @returns {jQuery}
*/
navContainer: function() {
return ghmob('#gh-main-nav');
},
/**
* createTileBox
*
* @ignore
* @param {string} boxID
* @returns {void}
*/
createTileBox: function(boxID) {
if (ghmob('[data-tile-status="active"]').length === 0 && ghmob('body.tile-open').length > 0) {
ghmob('body').removeClass('tile-open');
}
if (ghmob('#' + boxID).length === 0) {
var tilebox = ghmob('<div role="navigation" aria-label="tiles"><ul class="tilebox" id="' + boxID + '"></ul></div>');
if (boxID === 'gh-page-header-tilebox' && ghmob('.gh-page-header-wrap .gh-submenu').length > 0) {
tilebox.insertAfter(ghmob('.gh-page-header-wrap .gh-submenu'));
}
else if (ghmob('div[id$="divPSPAGECONTAINER"]').length > 0) {
tilebox.prependTo(ghmob('div[id$="divPSPAGECONTAINER"]').first());
}
else if (ghmob('.gh-page-header-wrap').length > 0) {
tilebox.insertAfter(ghmob('.gh-page-header-wrap'));
}
else {
tilebox.appendTo(ghmob('.ui-content[role="main"]').first());
}
}
},
/**
* getNextPopupId
*
* @ignore
* @param {obj} args
* @returns {string}
*/
getNextPopupId: function(args) {
if (typeof args === 'undefined') {
var lastId;
var lastIdNum;
if (ghmob('[data-tile-id]').length > 0) {
lastId = ghmob('[data-tile-id]').last().attr('data-tile-id');
lastIdNum = parseInt(lastId.replace('tile-', ''));
}
else {
lastIdNum = 0;
}
return 'tile-' + (lastIdNum + 1);
}
return 'tile-' + ghmob('#' + args['tileBox']).find('li.pagelet-' + args['shortname']).index();
},
/**
* getLetterForTile
*
* @ignore
* @param {string} title
* @returns {null}
*/
getLetterForTile: function(title) {
if (title.trim() === '') return;
return (title.trim().substring(0, 1));
},
/**
* createTile
*
* @ignore
* @param {obj} [args]
* @param {string} type
* @param {jQuery} [item]
* @param {string} [popupId]
* @returns {jQuery}
*/
createTile: function(args, type, item, popupId) {
// Arguments
args['color'] = args['color'] || '';
args['counterItem'] = args['counterItem'] || '';
args['display'] = args['display'] || ghConfig.navigationTiles.tiles.display;
args['href'] = args['href'] || '#';
args['letter'] = args['letter'] || '';
args['tile'] = args['tile'] || '';
args['tileImg'] = args['tileImg'] || '';
args['tileBox'] = args['tileBox'] || 'tilebox';
args['tileId'] = args['tileId'] || '';
// Create tilebox
this.createTileBox(args['tileBox']);
// Title
var title;
if (type === 'button') {
title = ghmob(item).text().trim();
if (ghmob(item).is('input')) {
title = ghmob(item).attr('value');
}
args['title'] = args['title'] || title;
}
if (type === 'link') {
args['title'] = args['title'] || '';
}
if (type === 'container') {
title = ghmob(item).find('.ui-collapsible-heading, .ui-bar, h1, h2, h3, h4, h5, h6').first().clone();
title.find('.ui-collapsible-heading-status, .ui-icon-bubble').remove();
title = title.text().trim();
args['title'] = args['title'] || title;
}
// Get target
args['target'] = this.getTarget(args);
// Get tile letter
if (args['letter'] === '' && args['tile'] === '' && args['tileImg'] === '') {
args['letter'] = this.getLetterForTile(args['title']);
}
// Generate HTML for tile
var tileHtml = ghmob('<a><div class="tile" aria-hidden="true"><div class="tile-img ' + args['tile'] + '" aria-hidden="true">' + args['letter'] + '</div></div></a>');
if (type === 'button') {
var action = ghmob(item).is('input') ? 'javascript:' + ghmob(item).attr('onclick').replace('this.id', '"' + ghmob(item).attr('id') + '"').replace('this.name', '"' + ghmob(item).attr('name') + '"').replace(',event', '') : ghmob(item).attr('href');
tileHtml.attr('href', action).attr('target', args['target']);
}
if (type === 'link') {
tileHtml.attr('href', args['href']).attr('target', args['target']);
}
if (type === 'container') {
tileHtml.attr('data-tile-id', popupId).attr('id', popupId + '-button');
if (args['display'] === 'inline') {
tileHtml.attr('href', '#').attr('data-rel', 'inline');
}
else {
tileHtml.attr('href', '#' + popupId).attr('data-rel', 'popup').attr('aria-haspopup', 'true').attr('role', 'button');
}
}
if (args['counterItem'] !== '' && ghmob(args['counterItem']).length > 0) {
tileHtml.attr('title', ghmob(args['counterItem']).length + ' items');
}
if (args['display'] === 'popup' && ghConfig.navigationTiles.tiles.responsive) {
tileHtml.attr('aria-label', args['title']);
}
if (args['color']) {
tileHtml.find('.tile').attr('style', 'background-color:' + args['color']);
}
if (args['tileImg'] !== '') {
tileHtml.find('.tile-img').attr('style', 'background-image:url(' + args['tileImg'] + ')');
}
if (type === 'button' || type === 'link' || args['display'] !== 'popup' || !ghConfig.navigationTiles.tiles.responsive) {
tileHtml.append(args['title']);
}
if (args['counterItem'] !== '' && ghmob(args['counterItem']).length > 0) {
var tileAlert = ghmob('<span class="ui-icon ui-icon-bubble ui-icon-shadow" aria-hidden="true">' + ghmob(args['counterItem']).length + '</span>');
tileHtml.find('.tile').append(tileAlert);
}
// Return HTML
return tileHtml;
},
/**
* createTileFromButton
*
* @param {jQuery} item
* @param {obj} [args]
* @param {string} [args.color]
* @param {string} [args.counterItem]
* @param {string} [args.display]
* @param {string} [args.letter]
* @param {string} [args.shortname]
* @param {string} [args.tile]
* @param {string} [args.tileBox]
* @param {string} [args.tileImg]
* @param {string} [args.title]
* @returns {null|void}
*/
createTileFromButton: function(item, args) {
// Create tile
var type = 'button';
if (ghmob(item).length < 1) return;
var tileHtml = this.createTile(args, type, ghmob(item));
args['tileBox'] = args['tileBox'] || 'tilebox';
// Add the tile
var tile = ghmob('#' + args['tileBox']).find('li.pagelet-' + args['shortname']);
if (tile.children().length === 0) {
ghmob(tileHtml).appendTo(tile);
}
ghmob(item).addClass('gh-tile-original');
},
/**
* createTileFromLink
*
* @param {obj} [args]
* @param {string} [args.color]
* @param {string} [args.counterItem]
* @param {string} [args.display]
* @param {string} [args.href]
* @param {string} [args.letter]
* @param {string} [args.shortname]
* @param {string} [args.tile]
* @param {string} [args.tileBox]
* @param {string} [args.tileImg]
* @param {string} [args.title]
* @returns {void}
*/
createTileFromLink: function(args) {
// Create tile
var type = 'link';
var tileHtml = this.createTile(args, type);
args['tileBox'] = args['tileBox'] || 'tilebox';
// Add the tile
var tile = ghmob('#' + args['tileBox']).find('li.pagelet-' + args['shortname']);
if (tile.children().length === 0) {
ghmob(tileHtml).appendTo(tile);
}
},
/**
* createTileFromContainer
*
* @param {jQuery} item
* @param {obj} [args]
* @param {string} [args.color]
* @param {string} [args.counterItem]
* @param {string} [args.display]
* @param {string} [args.letter]
* @param {string} [args.shortname]
* @param {string} [args.tile]
* @param {string} [args.tileBox]
* @param {string} [args.tileImg]
* @param {string} [args.title]
* @returns {null|void}
*/
createTileFromContainer: function(item, args) {
var $item = ghUtils.jqElem(item);
if ($item.length === 0) return;
args['tileBox'] = args['tileBox'] || 'tilebox';
if (args['display'] === 'popup' && ghConfig.navigationTiles.tiles.responsive) {
args['tileBox'] = 'gh-page-header-tilebox';
}
// Popup ID
var popupId = this.getNextPopupId(args);
// Create tile
var type = 'container';
var tileHtml = this.createTile(args, type, $item, popupId);
// Add the tile
var tile = ghmob('#' + args['tileBox']).find('li.pagelet-' + args['shortname']);
if (tile.children().length === 0) {
ghmob(tileHtml).appendTo(tile);
}
this.popupTile(item, args, popupId);
this.inlineTile(item, args, popupId);
},
/**
* setBreakpoint
*
* @ignore
* @returns {null|void}
*/
setBreakpoint: function() {
if (!ghConfig.navigationTiles.tiles.responsive) return;
ghmob('body').attr('data-tile-breakpoint', ghConfig.navigationTiles.tiles.breakpoint);
},
/**
* openCollapsibleContent
*
* @ignore
* @param {jQuery} item
* @returns {void}
*/
openCollapsibleContent: function(item) {
// Open up collapsible content, if child of item
if (ghmob(item).is('.ui-collapsible') || ghmob(item).children('.ui-collapsible').length > 0) {
var collapsible;
if (ghmob(item).is('.ui-collapsible')) {
collapsible = ghmob(item);
}
else {
collapsible = ghmob(item).children('.ui-collapsible');
}
collapsible.children('.ui-collapsible-heading').first().remove();
collapsible.children('.ui-collapsible-content').removeClass('ui-collapsible-content-collapsed').attr('aria-hidden', 'false');
}
if (ghmob(item).is('.ui-collapsible-content') || ghmob(item).children('.ui-collapsible-content').length > 0) {
var collapsibleContent;
if (ghmob(item).is('.ui-collapsible-content')) {
collapsibleContent = ghmob(item);
}
else {
collapsibleContent = ghmob(item).children('.ui-collapsible-content');
}
collapsibleContent.removeClass('ui-collapsible-content-collapsed').attr('aria-hidden', 'false');
}
},
/**
* linksToButtons
*
* @ignore
* @param {jQuery} item
* @returns {void}
*/
linksToButtons: function(item) {
// Turn links into buttons (that aren't already buttons or part of a listview or a non-presentation table)
ghmob(item).find('a').not('.ui-btn').each(function() {
if (ghmob(this).closest('.ui-listview, .gh-listview').length < 1 && ghmob(this).closest('.ui-table').length < 1 && ghmob(this).closest('.ghtables').length < 1) {
ghmob(this).button();
}
});
},
/**
* popupTile
*
* @ignore
* @param {jQuery} item
* @param {obj} args
* @param {string} popupId
* @returns {void}
*/
popupTile: function(item, args, popupId) {
if (args['display'] !== 'popup') return;
if (ghConfig.navigationTiles.tiles.responsive) {
ghmob(item).attr('data-related-tile', popupId);
ghmob(item).attr('data-popup-title', args['title']);
ghmob(item).attr('data-popup-tilebox', args['tileBox']);
this.setBreakpoint();
// If responsive, the tile content will be generated when opened via openTilePopup
return;
}
if (typeof popupId === 'undefined') {
popupId = this.getNextPopupId();
}
// Create popup container
if (ghmob(item).parents('[data-role="popup"]').length > 0) return;
ghmob('<div data-role="popup" id="' + popupId + '" data-tile="' + popupId + '" data-tile-responsive="false"><div class="ui-header"><h2 class="ui-title">' + args['title'] + '</h2></div><a href="#" data-rel="back" class="ui-popup-close"><i class="fa fa-close"></i> <span>Close</span></a></div>').insertAfter(ghmob('#' + args['tileBox']));
ghmob('#' + popupId).popup();
this.openCollapsibleContent(item);
this.linksToButtons(item);
// Add content to popup container
ghmob(item).insertAfter(ghmob('#' + popupId).find('.ui-header'));
},
/**
* openTilePopup
*
* @ignore
* @param {jQuery} item
* @returns {void}
*/
openTilePopup: function(item) {
var popupId = ghmob(item).attr('data-related-tile');
var title = ghmob(item).attr('data-popup-title');
var tilebox = ghmob(item).attr('data-popup-tilebox');
if (typeof popupId === 'undefined') {
popupId = this.getNextPopupId();
}
// Create popup container
ghmob('<div data-role="popup" id="' + popupId + '" data-tile="' + popupId + '" data-tile-responsive="true"><div class="ui-header"><h2 class="ui-title">' + title + '</h2></div><a href="#" data-rel="back" class="ui-popup-close"><i class="fa fa-close"></i> <span>Close</span></a></div>').insertAfter(ghmob('#' + tilebox));
ghmob('#' + popupId).popup();
this.openCollapsibleContent(item);
this.linksToButtons(item);
ghmob(item).removeAttr('data-related-tile');
// Leave a container for the content to return to
ghmob('<div class="placeholder"></div>').insertAfter(ghmob(item));
// Add content to popup container
ghmob(item).insertAfter(ghmob('#' + popupId).find('.ui-header'));
ghmob('#' + popupId).popup('open');
ghTable.tablesaw(ghmob('#' + popupId).find('.tablesaw'));
ghmob('#' + popupId).find('table.ghtables').ghtables('resize');
},
/**
* closeTilePopup
*
* @ignore
* @param {jQuery} popup
* @returns {void}
*/
closeTilePopup: function(popup) {
var dataTile = popup.attr('data-tile');
popup.find('.ui-body:first').attr('data-related-tile', dataTile).insertBefore(ghmob('.placeholder'));
ghmob('.placeholder').remove();
popup.popup('destroy').remove();
},
/**
* inlineTile
*
* @ignore
* @param {jQuery} item
* @param {obj} args
* @param {string} popupId
* @returns {null|void}
*/
inlineTile: function(item, args, popupId) {
if (args['display'] !== 'inline') return;
if (typeof popupId === 'undefined') {
popupId = this.getNextPopupId();
}
this.setBreakpoint();
if (typeof ghmob(item).attr('data-tile') === 'undefined') {
ghmob(item).attr('data-tile', popupId);
}
ghmob(item).attr('data-rel', 'inline');
if (ghmob(item).is('[data-tile-status="active"]') === false) {
ghmob(item).attr('data-tile-status', 'inactive');
}
if (ghmob(item).is('.ui-collapsible')) {
var config = {
counterItem: args['counterItem'],
icon: args['tile'],
};
ghContainer.createFromCollapsible(ghmob(item), config);
}
this.createTileClose();
},
/**
* createTileClose
*
* @ignore
* @returns {void}
*/
createTileClose: function() {
if (ghmob('#tile-close').length === 0) {
var tileClose = ghmob('<a href="#gh-main-content" id="tile-close">Close</a>');
ghmob('.ui-content[role="main"]').first().append(tileClose);
}
if (ghmob('[data-gh-item-link="tile-close"]').length === 0) {
ghFooter.addItem(ghmob('#tile-close'));
}
},
/**
* namespacing
*
* @ignore
* @param {array} tabs
* @returns {string} currTab
*/
namespacing: function(tabs) {
var currURL = window.location.href;
var currTab = '';
ghmob.each(tabs, function(i) {
if (currURL.indexOf(tabs[i]) !== -1) {
ghmob('body').addClass('has-tiles');
currTab = tabs[i];
return;
}
});
if (currTab === '') {
ghmob('body').removeClass('has-tiles');
}
return currTab;
},
/**
* addExternalLinkEvent
*
* @ignore
* @param {jQuery} selector
* @returns {jQuery} selector
*/
addExternalLinkEvent: function(selector) {
if (ghmob(selector).attr('href').indexOf('uninavpath') !== -1 && ghmob(selector).attr('href').indexOf('&IsFolder=true') !== -1 && ghmob(selector).attr('href').indexOf('.PTUN_') !== -1) {
var uniNavFldr = decodeURIComponent(ghmob(selector).attr('href').split('.PTUN_')[1].split('&')[0]);
var uniNavPath = ghTilesNavigation.getRelativePath() + 'c/NUI_FRAMEWORK.PTNUI_MENU_COMP.GBL?sa=&FLDR=PTUN_' + uniNavFldr + '&gsmobile=1';
ghmob(selector).attr('href', uniNavPath);
}
if (ghmob(selector).attr('href').indexOf('url=') !== -1 && ghmob(selector).attr('href').indexOf('&PORTALPARAM_PTCNAV') !== -1) {
var url = decodeURIComponent(ghmob(selector).attr('href').split('url=')[1].split('&PORTALPARAM_PTCNAV')[0]);
ghmob(selector).attr('href', url).attr('target', '_blank');
}
else if (typeof ghmob(selector).attr('target') === 'undefined' || ghmob(selector).attr('target') !== '_blank') {
ghmob(selector).attr('target', 'gh-top');
}
return selector;
},
/**
* removeLink
*
* @ignore
* @param {jQuery} pglt
* @param {obj} tile
* @returns {null|void}
*/
removeLink: function(pglt, tile) {
if (typeof tile['removeLink'] === 'undefined' || tile['removeLink'] === '') return;
var remove = [tile['removeLink']];
if (tile['removeLink'].indexOf(',') !== -1) {
remove = tile['removeLink'].split(',');
}
ghmob.each(remove, function(i) {
ghmob(pglt).find('a:contains("' + remove[i].trim() + '")').closest('li').remove();
});
},
/**
* pageletLinksToListviewItem
*
* @ignore
* @param {jQuery} selector
* @param {string} type
* @returns {string}
*/
pageletLinksToListviewItem: function(selector, type) {
selector = ghTilesNavigation.addExternalLinkEvent(selector);
return '<li><a href="' + ghmob(selector).attr('href') + '" data-ghfw="' + type + '" target="' + ghmob(selector).attr('target') + '">' + ghmob(selector).text() + '</a></li>';
},
/**
* pageletLinksToListview
*
* @ignore
* @param {jQuery} pglt
* @param {obj} tile
* @returns {void}
*/
pageletLinksToListview: function(pglt, tile) {
var folders = ghmob(pglt).find('td.EOPP_SCSECTIONCONTENT, td.EOPP_SCSECTIONFOLDER');
if (folders.length > 0) {
ghmob(pglt).prepend('<div class="pagelet"><ul data-inset="true" class="gh-listview"></ul></div>');
folders.each(function() {
if (ghmob(this).find('a.EOPP_SCSECTIONFOLDERLINK').length > 0) {
ghmob(this).find('a.EOPP_SCSECTIONFOLDERLINK').each(function() {
if (ghmob(this).text() === '') return;
if (ghmob(this).closest('tr').next('tr').find('a.EOPP_SCCHILDCONTENTLINK, a.EOPP_SCCHILDFOLDERLINK').length > 0 && (ghConfig.navigationTiles.showSubnav || (typeof tile !== 'undefined' && tile['showSubnav'] === true))) {
ghmob(pglt).find('> .pagelet > ul').append('<li><div data-role="collapsible" class="ui-collapsible"><div class="ui-collapsible-heading">' + ghmob(this).text() + '</div><ul data-inset="true" class="gh-listview"></ul></div></li>');
ghmob(this).closest('tr').next('tr').find('a.EOPP_SCCHILDCONTENTLINK, a.EOPP_SCCHILDFOLDERLINK').each(function() {
ghmob(pglt).find('> .pagelet > ul > li:last-child > .ui-collapsible > ul').append(ghTilesNavigation.pageletLinksToListviewItem(ghmob(this), 'contentlink'));
});
}
else {
ghmob(pglt).find('> .pagelet > .gh-listview').append(ghTilesNavigation.pageletLinksToListviewItem(ghmob(this), 'folderlink'));
}
});
}
if (ghmob(this).find('a.EOPP_SCSECTIONFOLDERLINK').length === 0 && ghmob(this).find('a.EOPP_SCSECTIONCONTENTLINK').length > 0) {
ghmob(this).find('a.EOPP_SCSECTIONCONTENTLINK').each(function() {
if (ghmob(this).text() === '') return;
ghmob(pglt).find('> .pagelet > ul').append(ghTilesNavigation.pageletLinksToListviewItem(ghmob(this), 'contentlink'));
});
}
});
}
ghmob(pglt).find('.ui-collapsible').collapsible();
ghmob(pglt).children().not('.pagelet').remove();
},
/**
* navBarLinksToListview
*
* @ignore
* @param {jQuery} pglt
* @param {obj} tile
* @returns {void}
*/
navBarLinksToListview: function(pglt, tile) {
var items = tile['linkProcessingArray'];
if (items && items.length > 0) {
ghmob(pglt).prepend('<div class="pagelet"><ul data-inset="true" class="gh-listview"></ul></div>');
ghmob.each(items, function(i) {
var item = ghmob('<li><a href="' + items[i]['href'] + '">' + items[i]['title'] + '</a></li>');
if (typeof items[i]['tileImg'] !== 'undefined') {
item.prepend('<img src="' + items[i]['tileImg'] + '" aria-hidden="true" />');
}
item.appendTo(ghmob(pglt).find('.pagelet .gh-listview'));
});
}
ghmob(pglt).children().not('.pagelet').remove();
},
/**
* pageletLinksToTiles
*
* @ignore
* @param {obj} tile
* @param {string} currTab
* @returns {null|void}
*/
pageletLinksToTiles: function(tile, currTab) {
var tileContainer = this.tileContainer();
var tileContent = tileContainer.find('.' + tile['shortname']);
if (typeof tile['linkProcessingArray'] === 'undefined') {
tile['linkProcessingArray'] = [];
tileContent.find('.pagelet > ul > li').each(function() {
var thisHref = ghmob(this).find('> a').attr('href');
var thisTitle = ghmob(this).find('> a, > [data-role="collapsible"] > .ui-collapsible-heading, > [data-role="collapsible"] > ' + ghHeader.headings.join()).text().trim();
var thisItem = {
href: thisHref,
shortname: thisTitle.replace(/\s+/g, '-').replace('\/', '').replace(/\./g, '').toLowerCase() + '-' + Math.round(Math.random() * 10000),
showInNav: tile['showInNav'],
showTile: tile['showTile'],
tabName: tile['tabName'],
title: thisTitle,
};
tile['linkProcessingArray'].push(thisItem);
});
}
if (tile['linkProcessingArray'].length === 0) return;
ghmob.each(tile['linkProcessingArray'], function(i) {
var thisItem;
if (typeof tile['linkProcessingArray'][i]['href'] === 'undefined') {
thisItem = tileContent.find('.pagelet > ul > li:contains("' + tile['linkProcessingArray'][i]['title'] + '")').first();
}
else {
thisItem = tileContent.find('.pagelet > ul > li a[href*="' + tile['linkProcessingArray'][i]['href'] + '"]').closest('li');
}
if (thisItem.length === 0) return;
// Set properties
if (thisItem.children('[data-role="collapsible"]').length > 0) {
tileContainer.append('<div class="' + tile['linkProcessingArray'][i]['shortname'] + '"><div class="pagelet"><ul data-inset="true" class="gh-listview">' + thisItem.children('[data-role="collapsible"]').find('.gh-listview').first().html() + '</ul></div></div>');
tile['linkProcessingArray'][i]['createFrom'] = 'container';
tile['linkProcessingArray'][i]['selector'] = '.' + tile['linkProcessingArray'][i]['shortname'];
}
else {
tile['linkProcessingArray'][i]['createFrom'] = 'link';
tile['linkProcessingArray'][i]['href'] = thisItem.children('a').attr('href');
}
// Containers
tile['linkProcessingArray'][i]['shortnameParent'] = tile['shortname'];
if ((i + 1) === tile['linkProcessingArray'].length) {
tile['linkProcessingArray'][i]['removeParent'] = true;
}
else {
tile['linkProcessingArray'][i]['removeParent'] = false;
}
ghTilesNavigation.makeContainer(tile['linkProcessingArray'][i], currTab);
// Create navigation item
ghTilesNavigation.makeNavItem(tile['linkProcessingArray'][i]);
// Create tile
ghTilesNavigation.makeTile(tile['linkProcessingArray'][i], currTab);
});
},
/**
* getRelativePath
*
* @ignore
* @returns {string}
*/
getRelativePath: function() {
return '/psc/' + freemarker.url.siteName + '/' + freemarker.url.portalName + '/' + freemarker.url.nodeName + '/';
},
/**
* navBarAjax
*
* @ignore
* @param {obj} tile
* @param {string} currTab
* @returns {void}
*/
navBarAjax: function(tile, currTab) {
ghmob.ajax({
url: ghTilesNavigation.getRelativePath() + 'c/NUI_FRAMEWORK.PTNUI_NAVBAR.GBL?ICDoModelessIframe=1&gsmobreq=0',
cache: false,
success: function(response, status, xhr) {
// Get content from response
var ajaxString = xhr.responseText;
// Grouplet links
var groupletLists = ajaxString.split('groupletList =');
var groupletList = '';
var groupletUrls = [];
ghmob.each(groupletLists, function(i) {
if (groupletLists[i].indexOf('grouplet') > -1) {
groupletList = groupletLists[i];
}
});
if (groupletList.length > 0 && typeof groupletList === 'string') {
groupletList = groupletList.split('\</script\>')[0].split('[');
ghmob.each(groupletList, function(i) {
var thisGrouplet = [];
if (groupletList[i].indexOf('http') > -1) {
var groupletContent = groupletList[i].split('\'');
ghmob.each(groupletContent, function(a) {
if (groupletContent[a].indexOf('http') > -1) {
thisGrouplet.push(groupletContent[a]);
}
});
groupletUrls.push(thisGrouplet);
}
});
}
// Process content
if (groupletUrls.length > 0) {
ajaxString = ghmob(ajaxString).find('.ptnavbar')[0].outerHTML;
ghTilesNavigation.navBarLinkProcessingArray(tile, ghmob(ajaxString).find('li.ps_grid-row'), '.ps_groupleth', groupletUrls);
ghTilesNavigation.processAjaxContent(tile, currTab, ajaxString);
}
},
});
},
/**
* navBarLinkProcessingArray
*
* @ignore
* @param {obj} tile
* @param {jQuery} links
* @param {string} text
* @param {(string|array)} url
* @returns {void}
*/
navBarLinkProcessingArray: function(tile, links, text, url) {
var linkProcessingArray = [];
links.each(function(i) {
var thisTitle = ghmob(this).find('a').text().trim();
if (typeof text !== 'undefined') {
thisTitle = ghmob(this).find(text).text().trim();
}
if (thisTitle === 'Navigator' || thisTitle === 'Menu') return;
var thisShortname = thisTitle.replace(/\s+/g, '-').replace('\/', '').replace(/\./g, '').toLowerCase() + '-' + Math.round(Math.random() * 10000);
var thisImg = ghmob(this).find('img').first().attr('src');
var thisUrl = ghmob(this).find('a').attr('href');
if (typeof url === 'object' && typeof url[i] !== 'undefined') {
if (url[i].length > 1) {
tileImg = '';
thisUrl = url[i][1];
ghTilesNavigation.getNavBarImg(url[i][0], thisShortname, thisImg, tile);
}
else {
thisUrl = url[i][0];
}
}
if (typeof thisUrl === 'undefined') return;
thisUrl = thisUrl.replace('?ICDoModal=1&ICGrouplet=2', '');
var thisItem = {
href: thisUrl,
shortname: thisShortname,
showInNav: tile['showInNav'],
showTile: tile['showTile'],
tabName: tile['tabName'],
tileImg: thisImg,
title: thisTitle,
};
linkProcessingArray.push(thisItem);
});
tile['linkProcessingArray'] = linkProcessingArray;
},
/**
* getNavBarImg
*
* @ignore
* @param {string} ajax
* @param {string} thisShortname
* @param {string} thisImg
* @param {obj} tile
* @returns {void}
*/
getNavBarImg: function(ajax, thisShortname, thisImg, tile) {
ghmob.ajax({
url: ajax + '&gsmobreq=0',
cache: false,
xhrFields: {withCredentials: true},
success: function(response, status, xhr) {
var ajaxString = xhr.responseText;
var imgSrc = ghmob(ajaxString).attr('src');
if (typeof imgSrc === 'undefined') return;
var navContainer = ghTilesNavigation.navContainer();
var navItem = navContainer.find('li.pagelet-' + thisShortname);
navItem.find('i').attr('style', 'background-image:url(' + imgSrc + ')');
var thisTile = ghmob('.tilebox').find('li.pagelet-' + thisShortname);
thisTile.find('.tile-img').attr('style', 'background-image:url(' + imgSrc + ')');
try {
if (typeof(Storage) !== 'undefined') {
var sessionContent = sessionStorage.getItem('pagelet-' + tile['ajaxPath']);
var sessionContentDiv = ghmob('<div>' + sessionContent + '</div>');
sessionContentDiv.find('img[src="' + thisImg + '"]').first().attr('src', imgSrc);
sessionStorage.setItem('pagelet-' + tile['ajaxPath'], sessionContentDiv.html());
}
}
catch (err) {
return;
}
},
});
},
/**
* navCollectionAjax
*
* @ignore
* @param {obj} tile
* @param {string} currTab
* @returns {void}
*/
navCollectionAjax: function(tile, currTab) {
ghmob.ajax({
url: ghTilesNavigation.getRelativePath() + 's/WEBLIB_PTPP_PGT.HOMEPAGE.FieldFormula.IScript_SCPagelet?scname=' + tile['ajaxPath'],
cache: false,
success: function(html, textStatus, xhr) {
// Get content from response
var ajaxString = xhr.responseText;
if (typeof ajaxString !== 'undefined' && ajaxString.indexOf('<table') === -1) return;
ajaxString = ghmob(ajaxString).find('table').first()[0].outerHTML;
// Process content
ghTilesNavigation.processAjaxContent(tile, currTab, ajaxString);
},
});
},
/**
* processAjaxContent
*
* @ignore
* @param {obj} tile
* @param {string} currTab
* @param {string} ajaxString
* @returns {void}
*/
processAjaxContent: function(tile, currTab, ajaxString) {
var tileContainer = this.tileContainer();
var pageletSelector = tileContainer.find('.' + tile['shortname']);
var isNavBar = this.isNavBar(tile);
// Put content into container
pageletSelector.append(ajaxString);
// Process pagelet content
if (tile['linkProcessing'] === 'pageletLinksToListview' || tile['linkProcessing'] === 'pageletLinksToTiles') {
if (isNavBar) {
ghTilesNavigation.navBarLinksToListview(pageletSelector, tile);
}
else {
ghTilesNavigation.pageletLinksToListview(pageletSelector, tile);
}
ghTilesNavigation.removeLink(pageletSelector, tile);
}
// Create tile and navigation
if (tile['linkProcessing'] === 'pageletLinksToTiles') {
ghTilesNavigation.pageletLinksToTiles(tile, currTab);
}
else {
// Create navigation item
ghTilesNavigation.makeNavItem(tile);
// Create tilea
ghTilesNavigation.makeTile(tile, currTab);
}
// Cleanup
ghTilesNavigation.removeContainer(tile);
// Save content in session storage
try {
if (typeof(Storage) !== 'undefined') {
sessionStorage.setItem('pagelet-' + tile['ajaxPath'], pageletSelector.html());
}
}
catch (err) {
return;
}
},
/**
* getTarget
*
* @ignore
* @param {obj} tile
* @returns {string}
*/
getTarget: function(tile) {
if (typeof tile['target'] === 'undefined' && ghPage.isTargetContent() === false) {
tile['target'] = 'gh-top';
}
return tile['target'];
},
/**
* makeTile
*
* @ignore
* @param {obj} tile
* @param {string} currTab
* @returns {void}
*/
makeTile: function(tile, currTab) {
// Set properties
tile['target'] = this.getTarget(tile);
// Processing
if (tile['showTile'] === true && ghmob('body.has-tiles').length > 0 && currTab === tile['tabName']) {
// Ajax & Container
if (tile['ajax'] === true || tile['createFrom'] === 'container' && ghUtils.jqElem(tile['selector']).length > 0) {
this.createTileFromContainer(tile['selector'], tile);
}
// Link
if (tile['createFrom'] === 'link') {
this.createTileFromLink(tile);
}
// Button
if (tile['createFrom'] === 'button') {
this.createTileFromButton(tile['selector'], tile);
}
}
},
/**
* makeNavItem
*
* @ignore
* @param {obj} tile
* @returns {void}
*/
makeNavItem: function(tile) {
if (ghPage.isTargetContent()) return;
var navContainer = this.navContainer();
// Set properties
tile['target'] = this.getTarget(tile);
// Processing
if (tile['showInNav'] === true && navContainer.length > 0) {
// Create <li>
var classAttr = '';
var styleAttr = '';
if (tile['tile']) {
classAttr = 'class="' + tile['tile'] + '"';
}
if (tile['tileImg']) {
styleAttr = 'style="background-image:url(' + tile['tileImg'] + ')"';
}
navContainer.find('li.pagelet-' + tile['shortname']).removeClass('gh-hidden').html('<i ' + classAttr + ' ' + styleAttr + ' aria-hidden="true"></i> ');
// Ajax & Container
if (tile['ajax'] === true || tile['createFrom'] === 'container' && ghmob(tile['selector']).length > 0) {
navContainer.find('.pagelet-' + tile['shortname']).append('<div data-role="collapsible"><div class="ui-collapsible-heading">' + tile['title'] + '</div></div>');
}
// Ajax
if (tile['ajax'] === true) {
navContainer.find('.pagelet-' + tile['shortname'] + ' > [data-role="collapsible"]').append(ghmob('.' + tile['shortname'] + ' .pagelet').html());
}
// Container
if (tile['createFrom'] === 'container' && ghmob(tile['selector']).length > 0) {
navContainer.find('.pagelet-' + tile['shortname'] + ' > [data-role="collapsible"]').append(ghmob(tile['selector']).find('.pagelet').html());
}
// Link
if (tile['createFrom'] === 'link') {
navContainer.find('.pagelet-' + tile['shortname']).append('<a href="' + tile['href'] + '" target="' + tile['target'] + '">' + tile['title'] + '</a>');
}
// Collapsibles
navContainer.find('.pagelet-' + tile['shortname'] + ' [data-role="collapsible"]').collapsible();
}
},
/**
* checkRoles
*
* @ignore
* @param {(string|array)} roles
* @returns {bool}
*/
checkRoles: function(roles) {
var match = true;
if (typeof roles !== 'undefined' && roles !== '') {
match = false;
var tileRoles = roles;
if (typeof roles !== 'object' && roles.indexOf(',') > -1) {
tileRoles = roles.split(',');
}
var userRoles = ghUser.getRoles();
ghmob.each(tileRoles, function(i) {
if (userRoles.indexOf(tileRoles[i].trim()) !== -1) {
match = true;
}
});
}
return match;
},
/**
* checkModo
*
* @ignore
* @param {bool} kurogo
* @returns {bool}
*/
checkModo: function(kurogo) {
var showTile = true;
if (kurogo === true) {
if (ghConfig.core.useKurogo === true || ghConfig.core.isKurogoApp === true) {
showTile = true;
}
else {
showTile = false;
}
}
return showTile;
},
/**
* isNavBar
*
* @ignore
* @param {obj} tile
* @returns {bool}
*/
isNavBar: function(tile) {
var bool = false;
if (typeof tile['ajaxPath'] !== 'undefined' && tile['ajaxPath'].indexOf('NAVBAR') > -1) {
bool = true;
}
return bool;
},
/**
* usesNavBar
*
* @private
* @returns {bool}
*/
_usesFluidNavBar: function() {
var usesFluidNavBar = true;
if (ghConfig.navigationTiles.usesFluidNavBar !== 'undefined' && ghConfig.navigationTiles.usesFluidNavBar === false) {
usesFluidNavBar = false;
}
return usesFluidNavBar;
},
/**
* makeContainer
*
* @ignore
* @param {obj} tile
* @param {string} currTab
* @returns {void}
*/
makeContainer: function(tile, currTab) {
this.makeContainerTile(tile, currTab);
this.makeContainerNavigation(tile);
},
/**
* makeContainerTile
*
* @ignore
* @param {obj} tile
* @param {string} currTab
* @returns {void}
*/
makeContainerTile: function(tile, currTab) {
if (tile['showTile'] !== true || ghmob('body.has-tiles').length === 0 || currTab !== tile['tabName']) return;
tile['tileBox'] = tile['tileBox'] || 'tilebox';
ghTilesNavigation.createTileBox(tile['tileBox']);
var tileBox = ghmob('#' + tile['tileBox']);
var tileItem = ghmob('<li class="pagelet-' + tile['shortname'] + '"></li>');
if (tileBox.find('li.pagelet-' + tile['shortname']).length > 0) return;
if (typeof tile['shortnameParent'] === 'undefined') {
if (typeof tile['tileId'] !== 'undefined') {
tileItem.attr('data-id', tile['tileId']);
}
tileItem.appendTo(tileBox);
}
else {
var parentTile = tileBox.find('li.pagelet-' + tile['shortnameParent']);
tileItem.insertBefore(parentTile);
if (tile['removeParent'] === true) {
parentTile.remove();
}
}
},
/**
* makeContainerNavigation
*
* @ignore
* @param {obj} tile
* @returns {void}
*/
makeContainerNavigation: function(tile) {
var navContainer = this.navContainer();
if (tile['showInNav'] !== true || navContainer.length === 0 || navContainer.find('li.pagelet-' + tile['shortname']).length > 0 || ghPage.isTargetContent()) return;
var navItem = ghmob('<li class="gh-hidden pagelet-' + tile['shortname'] + '"></li>');
if ((ghConfig.navigationTiles.showSubnav || tile['showSubnav']) && (ghConfig.navigationTiles.sequentialSubnav || tile['sequentialSubnav'])) {
navItem.addClass('sequential');
}
if (typeof tile['shortnameParent'] === 'undefined') {
navItem.appendTo(navContainer);
}
else {
var parentItem = navContainer.find('li.pagelet-' + tile['shortnameParent']);
navItem.insertBefore(parentItem);
if (tile['removeParent'] === true) {
parentItem.remove();
}
}
},
/**
* processTilesNavigation
*
* @param {obj} [tiles]
* @param {bool} [tiles.ajax]
* @param {string} [tiles.ajaxPath]
* @param {string} [tiles.color]
* @param {string} [tiles.counterItem]
* @param {string} [tiles.createFrom]
* @param {string} [tiles.display]
* @param {string} [tiles.href]
* @param {bool} [tiles.kurogo]
* @param {string} [tiles.letter]
* @param {string} [tiles.linkProcessing]
* @param {obj} [tiles.linkProcessingArray]
* @param {(string|array)} [tiles.removeLink]
* @param {(string|array)} [tiles.roles]
* @param {string} [tiles.shortname]
* @param {bool} [tiles.showInNav]
* @param {bool} [tiles.showSubnav]
* @param {bool} [tiles.showTile]
* @param {string} [tiles.tabName]
* @param {string} [tiles.target]
* @param {string} [tiles.tile]
* @param {string} [tiles.tileBox]
* @param {string} [tiles.tileImg]
* @param {string} [tiles.title]
* @param {(string|array)} [tab]
* @param {bool} [responsive]
* @returns {void}
*/
processTilesNavigation: function(tiles, tab, responsive) {
if (typeof tiles === 'undefined') {
if (typeof this.tiles === 'undefined') {
this.tiles = window['createTiles'] || '';
}
tiles = this.tiles;
}
if (typeof tab === 'undefined') {
if (typeof this.tabs === 'undefined') {
this.tabs = window['tabs'] || '';
}
tab = this.tabs;
}
if (responsive === true) {
ghConfig.navigationTiles.tiles.responsive = true;
}
var tileContainer = this.tileContainer();
if (tileContainer.length === 0) {
ghmob('.ui-content[role="main"]').first().prepend('<div class="gh-hidden ' + ghTilesNavigation.tileContainerName + '"></div>');
tileContainer = this.tileContainer();
}
var sessionContent;
var currTab = this.namespacing(tab);
ghmob.each(tiles, function(i) {
// Check to see if we should supress responsive popups
if (tiles[i]['display'] === 'popup' && ghConfig.navigationTiles.tiles.responsive && ghConfig.navigationTiles.tiles.suppressResponsivePopups) return;
// Check roles for tile
var matchRole = ghTilesNavigation.checkRoles(tiles[i]['roles']);
if (matchRole === false) return;
// Limit left nav based on tab name if config option is set to true
if (ghConfig.navigationTiles.limitNavByTab) {
if (currTab !== tiles[i]['tabName']) return;
}
// Check if tile is only for Modo views
var kurogo = ghTilesNavigation.checkModo(tiles[i]['kurogo']);
if (kurogo === false) return;
// Containers
ghTilesNavigation.makeContainer(tiles[i], currTab);
// Run Ajax
if (tiles[i]['ajax'] === true && ghConfig.core.isKurogoApp !== true) {
// Create container
tileContainer.append('<div class="' + tiles[i]['shortname'] + '"></div>');
tiles[i]['selector'] = tileContainer.find('.' + tiles[i]['shortname']);
var isNavBar = ghTilesNavigation.isNavBar(tiles[i]);
var usesFluidNavBar = ghTilesNavigation._usesFluidNavBar();
try {
if (typeof(Storage) === 'undefined') {
if (isNavBar && usesFluidNavBar) {
ghTilesNavigation.navBarAjax(tiles[i], currTab);
}
else {
ghTilesNavigation.navCollectionAjax(tiles[i], currTab);
}
}
else {
sessionContent = sessionStorage.getItem('pagelet-' + tiles[i]['ajaxPath']);
if (sessionContent) {
tiles[i]['selector'].append(sessionContent);
if (tiles[i]['linkProcessing'] === 'pageletLinksToTiles') {
if (isNavBar && usesFluidNavBar) {
ghTilesNavigation.navBarLinkProcessingArray(tiles[i], tiles[i]['selector'].find('li'));
}
ghTilesNavigation.pageletLinksToTiles(tiles[i], currTab);
}
else {
// Create navigation item
ghTilesNavigation.makeNavItem(tiles[i]);
// Create tile
ghTilesNavigation.makeTile(tiles[i], currTab);
}
// Cleanup
ghTilesNavigation.removeContainer(tiles[i]);
}
else if (isNavBar && usesFluidNavBar) {
ghTilesNavigation.navBarAjax(tiles[i], currTab);
}
else {
ghTilesNavigation.navCollectionAjax(tiles[i], currTab);
}
}
}
catch (err) {
return;
}
}
else {
if (ghConfig.core.isKurogoApp === true && tiles[i]['ajax'] === true) {
tiles[i]['createFrom'] = 'link';
var relativePath = '/psc/' + freemarker.url.siteName + '/' + freemarker.url.portalName + '/' + freemarker.url.nodeName + '/';
tiles[i]['href'] = relativePath + 's/WEBLIB_PTPP_SC.HOMEPAGE.FieldFormula.IScript_AppHP?pt_fname=' + tiles[i]['ajaxPath'];
tiles[i]['ajax'] = false;
}
// Create navigation item
ghTilesNavigation.makeNavItem(tiles[i]);
// Create tile
ghTilesNavigation.makeTile(tiles[i], currTab);
// Cleanup
ghTilesNavigation.removeContainer(tiles[i]);
}
});
// Alerts
this.processAlerts();
},
/**
* processAlerts
*
* @private
* @returns {void}
*/
processAlerts: function() {
if (ghConfig.navigationTiles.getDefaultAlerts !== true || ghmob('body.has-tiles').length === 0) return;
this.getDefaultAlerts();
},
/**
* removeContainer
*
* @private
* @param {obj} tile
* @returns {null|void}
*/
removeContainer: function(tile) {
if (ghmob('body.has-tiles').length > 0 && ghConfig.navigationTiles.tiles.display === 'inline') return;
var tileContainer = this.tileContainer();
var tileContent = tileContainer.find('.' + tile['shortname']);
tileContent.remove();
},
/**
* formatPanel
*
* @private
* @returns {null|void}
*/
formatPanel: function() {
var navContainer = this.navContainer();
var panel = ghmob('#gh-main-nav-panel');
if (navContainer.length === 0 || panel.length === 0 || navContainer.parent('.ui-panel').length > 0) return;
navContainer.html('');
navContainer.appendTo(panel.find('.ui-panel-inner'));
panel.find('.ui-panel-inner').children().not(navContainer).remove();
},
/**
* alertAjax
*
* @private
* @param {string} ajaxURL
* @returns {void}
*/
alertAjax: function(ajaxURL) {
ghmob.ajax({
url: ajaxURL,
cache: false,
xhrFields: {withCredentials: true},
success: function(html) {
ghTilesNavigation.alertCount(html);
},
});
},
/**
* alertCount
*
* @private
* @param {string} html
* @returns {void}
*/
alertCount: function(html) {
var tile, count;
var json = ghmob.parseJSON(html);
ghmob.each(json, function(idx, obj) {
if (obj.pagename === 'SS_CC_TODOS' || obj.pagename === 'SS_CC_HOLDS') {
if (obj.pagename === 'SS_CC_TODOS') {
tile = ghmob('#tilebox a[href*="SS_CC_TODOS.GBL"]');
}
if (obj.pagename === 'SS_CC_HOLDS') {
tile = ghmob('#tilebox a[href*="SS_CC_HOLDS.GBL"]');
}
count = obj.count === '0' ? '' : obj.count;
}
else if (obj.WorklistTotal) {
tile = ghmob('#tilebox a[href*="WORKLIST"]');
count = obj.WorklistTotal === '0' ? '' : obj.WorklistTotal;
}
else if (typeof obj.WorklistTotal === 'undefined' && json.WorklistTotal) {
tile = ghmob('#tilebox a[href*="WORKLIST"]');
count = json.WorklistTotal === '0' ? '' : json.WorklistTotal;
}
if (count === '0' || count === '') return;
ghmob(tile).attr('title', count + ' items').find('.tile').append('<span class="ui-icon ui-icon-bubble ui-icon-shadow" aria-hidden="true">' + count + '</span>');
});
},
/**
* getDefaultAlerts
*
* @private
* @returns {void}
*/
getDefaultAlerts: function() {
var relativePath = '/psc/' + freemarker.url.siteName + '/' + freemarker.url.portalName + '/' + freemarker.url.nodeName + '/';
var ajaxURL;
ajaxURL = relativePath + 's/WEBLIB_GS_MOBL.ISCRIPT1.FieldFormula.IScript_TileBubbleCount?page=SS_CC_TODOS__SS_CC_HOLDS';
ghTilesNavigation.alertAjax(ajaxURL);
ajaxURL = relativePath + 's/WEBLIB_GS_APPR.ISCRIPT1.FieldFormula.IScript_ProcessApprovals?page=total';
ghTilesNavigation.alertAjax(ajaxURL);
},
/**
* wrappedProcessNavigation
*
* @private
* @returns {bool}
*/
wrappedProcessNavigation: function() {
return false;
},
/**
* startNavigationCalls
*
* @private
* @returns {null|void}
*/
_startNavigationCalls: function() {
// Turn off server-side breadcrumb processing
window['processNavigation'] = ghTilesNavigation.wrappedProcessNavigation;
if (!ghConfig.navigationTiles.enabled || ghmob('body.isLogin').length > 0) return;
this.formatPanel();
this.processTilesNavigation();
},
/**
* inlineTileOpen
*
* @private
* @param {obj} event
* @param {jQuery} $inlineTile
* @returns {void}
*/
_inlineTileOpen: function(event, $inlineTile) {
event.preventDefault();
var tileContent = ghmob('[data-tile="' + $inlineTile.attr('data-tile-id') + '"]');
tileContent.attr('data-tile-status', 'active');
ghmob('body').addClass('tile-open');
window.scrollTo(0, 0);
ghTable.tablesaw(tileContent.find('.tablesaw'));
tileContent.find('table.ghtables').ghtables('resize');
},
/**
* inlineTileClose
*
* @private
* @param {obj} event
* @returns {void}
*/
_inlineTileClose: function(event) {
event.preventDefault();
event.stopPropagation();
ghmob('[data-tile-status="active"]').attr('data-tile-status', 'inactive');
ghmob('body').removeClass('tile-open');
window.scrollTo(0, 0);
},
/**
* popupTileOpen
*
* @private
* @param {obj} event
* @param {jQuery} $popupTile
* @returns {void}
*/
_popupTileOpen: function(event, $popupTile) {
event.preventDefault();
// create popup contents
ghTilesNavigation.openTilePopup(ghmob('[data-related-tile="' + $popupTile.attr('data-tile-id') + '"]'));
},
/**
* popupTileClose
*
* @private
* @param {obj} event
* @param {jQuery} $popupTile
* @returns {void}
*/
_popupTileClose: function(event, $popupTile) {
event.preventDefault();
event.stopPropagation();
// close popup and put content back
ghTilesNavigation.closeTilePopup($popupTile.closest('[data-tile]'));
},
/**
* subnavEvents
*
* @private
* @param {jQuery} selector
* @returns {void}
*/
_subnavEvents: function(selector) {
var collapsible = selector.closest('.ui-collapsible');
if (collapsible.hasClass('gh-active-collapsible')) {
collapsible.closest('li').siblings('li').addClass('gh-hidden');
}
else {
collapsible.closest('li').siblings('li').removeClass('gh-hidden');
}
},
/**
* eventBindings
*
* @private
* @returns {void}
*/
_eventBindings: function() {
// Inline tiles
ghmob(document)
.off('click.ghTilesNavigation.inlineTileOpen')
.on('click.ghTilesNavigation.inlineTileOpen', '#tilebox a[data-rel="inline"], .tilebox a[data-rel="inline"]', function(e) {
ghLog.event('click.ghTilesNavigation.inlineTileOpen');
ghTilesNavigation._inlineTileOpen(e, ghmob(this));
});
ghmob(document)
.off('click.ghTilesNavigation.inlineTileClose')
.on('click.ghTilesNavigation.inlineTileClose', '[data-gh-item-link="tile-close"] a', function(e) {
ghLog.event('click.ghTilesNavigation.inlineTileClose');
ghTilesNavigation._inlineTileClose(e);
});
// Popup tiles
ghmob(document)
.off('click.ghTilesNavigation.popupTileOpen')
.on('click.ghTilesNavigation.popupTileOpen', '#gh-page-header-tilebox a[data-rel="popup"]', function(e) {
ghLog.event('click.ghTilesNavigation.popupTileOpen');
ghTilesNavigation._popupTileOpen(e, ghmob(this));
});
ghmob(document)
.off('click.ghTilesNavigation.popupTileClose')
.on('click.ghTilesNavigation.popupTileClose', '[data-tile-responsive="true"] .ui-popup-close', function(e) {
ghLog.event('click.ghTilesNavigation.popupTileClose');
ghTilesNavigation._popupTileClose(e, ghmob(this));
});
// Subnav
ghmob(document)
.off('click.ghTilesNavigation.subnavEvents')
.on('click.ghTilesNavigation.subnavEvents', '.ui-panel li.sequential li .ui-collapsible-heading-toggle', function() {
ghLog.event('click.ghTilesNavigation.subnavEvents');
ghTilesNavigation._subnavEvents(ghmob(this));
});
},
/**
* run
*
* @ignore
* @returns {null|void}
*/
run: function() {
if (ghConfig.navigationTiles.enabled === false) return;
if (this.navContainer().find('> li').length !== 0) return;
this._startNavigationCalls();
this._eventBindings();
},
};
ghInit.module('ghTilesNavigation');ghTilesNavigation.tabs = ['?tab=DEFAULT'];
ghTilesNavigation.tiles = [
{
ajax: false,
createFrom: 'link',
href: '/psp/pscsprd/EMPLOYEE/SA/c/SA_LEARNING_MANAGEMENT.SS_FACULTY.GBL',
shortname: 'faculty-center',
showInNav: true,
showTile: false,
tabName: '?tab=DEFAULT',
title: 'Faculty Centre Home',
tile: 'fa fa-users',
roles: ['CU_SS_PROFESSOR', 'CU_SS_TA']
},
{
ajax: false,
createFrom: 'link',
href: '/psp/pscsprd/EMPLOYEE/SA/c/CC_PORTFOLIO.SS_CC_EMAIL_ADDR.GBL',
shortname: 'faculty-perso',
showInNav: true,
showTile: false,
tabName: '?tab=DEFAULT',
title: 'Email Address Configuration',
tile: 'fa fa-address-book',
roles: ['CU_SS_PROFESSOR', 'CU_SS_TA']
},
{
ajax: false,
createFrom: 'link',
href: '/psp/pscsprd/EMPLOYEE/HRMS/c/CU_SELF_SERVICE.CU_SSS_MY_QST_ADV.GBL',
shortname: 'faculty-avdisor',
showInNav: true,
showTile: false,
tabName: '?tab=DEFAULT',
title: 'Advisor Questionnaire',
tile: 'fa fa-file-text',
roles: ['CU_SS_PROFESSOR']
},
{
ajax: false,
createFrom: 'link',
href: '/psp/pscsprd/EMPLOYEE/SA/c/SA_LEARNING_MANAGEMENT.CLASS_SEARCH.GBL',
shortname: 'faculty-search',
showInNav: true,
showTile: false,
tabName: '?tab=DEFAULT',
title: 'Class Search',
tile: 'fa fa-search',
roles: ['CU_SS_PROFESSOR', 'CU_SS_TA']
},
{
ajax: false,
createFrom: 'link',
href: '/psc/pscsprd/EMPLOYEE/SA/c/SA_LEARNER_SERVICES.SSS_STUDENT_CENTER.GBL?Page=SSS_STUDENT_CENTER&Action=U&TargetFrameName=None',
shortname: 'student-center',
showInNav: true,
showTile: false,
tabName: '?tab=DEFAULT',
title: 'Student Centre',
tile:'fa fa-home',
roles: ['CU_SS_STUDENT', 'CU_SS_APPLICANT_PLUS']
},
{
ajax: true,
ajaxPath: 'ADMN_APPSIAN_ACADEMIC',
linkProcessing: 'pageletLinksToListview',
shortname: 'student-appsianacademics',
showInNav: true,
showTile: true,
tabName: '?tab=DEFAULT',
title: 'Academics',
tile: 'fa fa-list-alt',
roles: ['CU_SS_STUDENT', 'CU_SS_APPLICANT_PLUS']
},
{
ajax: true,
ajaxPath: 'ADMN_APPSIAN_ENROL',
linkProcessing: 'pageletLinksToListview',
shortname: 'student-appsianenrollment',
showInNav: true,
showTile: true,
tabName: '?tab=DEFAULT',
title: 'Enrollment',
tile: 'fa fa-bookmark',
roles: ['CU_SS_STUDENT', 'CU_SS_APPLICANT_PLUS']
},
{
ajax: true,
ajaxPath: 'ADMN_APPSIAN_PERSONAL',
linkProcessing: 'pageletLinksToListview',
shortname: 'student-appsianpersonal',
showInNav: true,
showTile: true,
tabName: '?tab=DEFAULT',
title: 'Personal Information',
tile: 'fa fa-address-book',
roles: ['CU_SS_STUDENT', 'CU_SS_APPLICANT_PLUS']
},
{
ajax: true,
ajaxPath: 'ADMN_APPSIAN_FINANCE',
linkProcessing: 'pageletLinksToListview',
shortname: 'student-appsianfinance',
showInNav: true,
showTile: true,
tabName: '?tab=DEFAULT',
title: 'Finance',
tile: 'fa fa-suitcase',
roles: ['CU_SS_STUDENT', 'CU_SS_APPLICANT_PLUS']
},
{
ajax: false,
createFrom: 'link',
href: '/psp/pscsprd/EMPLOYEE/SA/c/CU_SELF_SERVICE.CU_MES_COVID.GBL?Page=CU_MES_COVID&Action=U&ExactKeys=Y&TargetFrameName=None',
shortname: 'student-mes-comp',
//changed showinnav to true 28apr2022 changed back to false nov 10 hl in INT
showInNav: false,
showTile: false,
tabName: '?tab=DEFAULT',
title: 'MES Lump Sum Request',
tile: 'fa fa-pencil',
roles: ['CU_SS_STUDENT', 'CU_SS_APPLICANT_PLUS']
},
{
ajax: false,
createFrom: 'link',
href: '/psp/pscsprd/EMPLOYEE/SA/c/SSR_RS_SELFSERV_MGMT.SSS_RS_STDNT_REQ.GBL?FolderPath=PORTAL_ROOT_OBJECT.CO_EMPLOYEE_SELF_SERVICE.HCSR_REQUEST_MGMT.HC_SSS_RS_STDNT_REQ_GBL',
shortname: 'student-research-activities',
showInNav: false,
showTile: false,
tabName: '?tab=DEFAULT',
title: 'Graduate Service Request',
tile: 'fa fa-file-text',
roles: ['CU_SS_STUDENT', 'CU_SS_APPLICANT_PLUS']
},
{
ajax: false,
createFrom: 'link',
href: '/psc/pscsprd/EMPLOYEE/SA/c/CU_SELF_SERVICE.CU_SS_UPLD_DOC.GBL?Page=CU_SS_UPLD_DOC',
shortname: 'student-uploaddocs',
showInNav: true,
showTile: false,
tabName: '?tab=DEFAULT',
title: 'Upload Documents',
tile: 'fa fa-upload',
roles: ['CU_SS_STUDENT', 'CU_SS_APPLICANT_PLUS']
},
{
ajax: false,
createFrom: 'link',
href: '/psc/pscsprd/EMPLOYEE/SA/c/CU_SELF_SERVICE.CU_FORMATRONL_COMP.GBL?FolderPath=PORTAL_ROOT_OBJECT.CO_EMPLOYEE_SELF_SERVICE.CU_FORMATRONL_COMP_GBL&IsFolder=false&IgnoreParamTempl=FolderPath%2cIsFolder',
shortname: 'student-forms',
showInNav: true,
showTile: false,
tabName: '?tab=DEFAULT',
title: 'Undergraduate Student Request Forms',
tile: 'fa fa-pencil-square-o',
roles: ['CU_G3STUDENT_UGRD','CU_G3STUDENT_FINA','CU_G3STUDENT_CN']
},
{
ajax: false,
createFrom: 'link',
href: '/psc/pscsprd/EMPLOYEE/SA/c/CU_SELF_SERVICE.CU_FORMAT_G_COMP.GBL?FolderPath=PORTAL_ROOT_OBJECT.CO_EMPLOYEE_SELF_SERVICE.CU_FORMAT_G_COMP_GBL&IsFolder=false&IgnoreParamTempl=FolderPath%2cIsFolder',
shortname: 'gradstudent-forms',
showInNav: true,
showTile: false,
tabName: '?tab=DEFAULT',
title: 'Graduate Student Request Forms',
tile: 'fa fa-pencil-square-o',
roles: ['CU_G3STUDENT_GRAD']
},
{
ajax: false,
createFrom: 'link',
href: '/psc/pscsprd/EMPLOYEE/SA/c/CU_MODS.CU_AD_WEB_APP_ADM.GBL?FolderPath=PORTAL_ROOT_OBJECT.CU_AAWS_FOLDER.CU_AD_WEB_APP_ADM_GBL',
shortname: 'student-admission_application',
showInNav: true,
showTile: false,
tabName: '?tab=DEFAULT',
title: 'Admission Application',
tile: 'fa fa-pencil',
roles: ['CU_SS_STUDENT', 'CU_SS_APPLICANT_PLUS']
},
{
ajax: false,
createFrom: 'link',
href: 'https://www.concordia.ca/students/your-sis.html',
shortname: 'student-feedback',
showInNav: true,
showTile: false,
tabName: '?tab=DEFAULT',
title: 'How-to Guides',
tile: 'fa fa-info-circle',
target: '_blank',
roles: ['CU_SS_STUDENT', 'CU_SS_APPLICANT_PLUS']
},
{
ajax: false,
createFrom: 'link',
href: '/psc/pscsprd/EMPLOYEE/SA/c/CU_SELF_SERVICE.CU_LANDING_NAV.GBL?FolderPath=PORTAL_ROOT_OBJECT.CU_LANDING_NAV_GBL',
shortname: 'faculty-student-LandingNav',
showInNav: true,
showTile: false,
tabName: '?tab=DEFAULT',
title: 'Navigation Home',
tile: 'fa fa-map',
roles: ['CU_GENERAL_USER ', 'CU_SS_PROFESSOR', 'CU_SS_TA']
},
{
ajax: false,
createFrom: 'link',
href: 'https://www.concordia.ca',
shortname: 'faculty-student-concordiasite',
showInNav: true,
showTile: false,
tabName: '?tab=DEFAULT',
title: 'CONCORDIA.CA',
tile: 'fa fa-paper-plane',
target: '_blank',
roles: ['CU_SS_GUEST']
},
{
ajax: false,
createFrom: 'link',
href: '/psp/pscsprd/EMPLOYEE/SA/?cmd=logout&gsmobile=1',
kurogo: true,
shortname: 'logout',
showInNav: true,
showTile: false,
tabName: '?tab=DEFAULT',
title: 'Logout'
},
]/**
* ghGuide
*
* @module guide
* @owner Ashley Callahan
* @config autoInit [true, false]
* @config enabled [true, false]
*/
var ghGuide = ghGuide || {
/**
* state
*
* @ignore
* @type {obj}
*/
state: {},
/**
* wrapper
*
* @ignore
* @param {jQuery} selector
* @returns {null}
*/
wrapper: function(selector) {
var guide = selector.parents('.gh-guide-wrapper');
if (guide.length === 0) {
selector.wrapAll('<div class="gh-guide-wrapper"><div class="gh-guide-content"></div></div>');
}
if (ghmob('.gh-guide').length === 0) {
selector.wrapAll('<div class="gh-guide"></div>');
}
return;
},
/**
* container
*
* @ignore
* @param {jQuery} selector
* @returns {null}
*/
container: function() {
if (ghGuide.getConfig().container === false) return;
var activeLink = this.getActiveLink();
if (activeLink.closest('li').find('ul .active').length > 0) {
activeLink = activeLink.closest('li').find('ul .active').first();
}
var containerHeaders = ghmob('.gh-guide').find('.ui-bar').filter(function() {
return (ghmob(this).text().trim() === activeLink.text().trim());
});
if (ghGuide.isStartPage() === true || ghGuide.isLandingPage() === true || containerHeaders.length > 0) return;
ghContainer.create(ghmob('.gh-guide').children(), activeLink.text().trim());
return;
},
/**
* setClasses
*
* @ignore
* @returns {null}
*/
setClasses: function() {
if (ghGuide.getConfig().subsite === true) {
ghmob('html').addClass('subsite');
}
if (this.isLandingPage()) {
ghmob('html').addClass('landing-page');
this.formatLandingPage();
}
if (this.isStartPage()) {
ghmob('html').addClass('start-page');
}
return;
},
/**
* formatLandingPage
*
* @ignore
* @returns {null}
*/
formatLandingPage: function() {
var config = this.getConfig().landingPage;
if (typeof config === 'undefined' || typeof config.background === 'undefined') return;
ghmob('.ui-page').css('background-image', 'url(' + config.background.src + ')');
ghmob('.ui-page > .ui-panel-content-wrap > .ui-content').css('margin-top', config.background.minHeight + 'px');
return;
},
/**
* getPageHeader
*
* @ignore
* @returns {string}
*/
getPageHeader: function() {
var pageHeader = '';
if (ghmob('.gh-page-header-headings').children('h1, h2, h3, h4, h5, h6').length > 0) {
pageHeader = ghmob('.gh-page-header-headings').children('h1, h2, h3, h4, h5, h6').last().text().trim();
}
return pageHeader;
},
/**
* navigation
*
* @ignore
* @param {jQuery} selector
* @returns {null}
*/
navigation: function(selector) {
var guide = selector.parents('.gh-guide-wrapper');
var config = this.getConfig().navigation;
if (typeof config === 'undefined') return;
// Wrapper
var guideNav = selector.parents().find('.gh-guide-nav');
if (guideNav.length === 0) {
guide.prepend('<div class="gh-guide-nav" role="navigation" aria-label="' + this.getPageHeader() + '"><ul></ul></div>');
guideNav = guide.find('> .gh-guide-nav');
}
// Check state
var state = this.getState().navigation;
var hasState = (state !== null && state !== undefined);
if (hasState === true) {
state = JSON.parse(state);
}
if (ghmob(state).find('> li:first-child > a').text().trim() !== config[0].label) {
hasState = false;
this.state.navigation = null;
}
if (hasState === true) {
guideNav.html(state);
}
else {
guideNav.find('ul').html('');
}
// Add skip link
if (guideNav.find('a.skip-main').length === 0) {
guideNav.prepend('<a class="skip-main" href="#">Skip navigation</a>');
}
ghmob.each(config, function(i) {
if (hasState === false) {
guideNav.find('> ul').append('<li><a href="#" data-gh-guide="' + config[i].id + '">' + config[i].label + '</a></li>');
if (typeof config[i].href !== 'undefined') {
guideNav.find('> ul > li:last-child > a').attr('href', config[i].href);
}
if (typeof config[i].onclick !== 'undefined') {
guideNav.find('> ul > li:last-child > a').attr('onclick', config[i].onclick);
}
if (typeof config[i].classes !== 'undefined') {
guideNav.find('> ul > li:last-child > a').attr('class', config[i].classes);
}
if (typeof config[i].icon !== 'undefined') {
guideNav.find('> ul > li:last-child > a').prepend('<span class="fa fa-fw ' + config[i].icon + '" aria-hidden="true"></span> ');
}
}
if (typeof config[i].content === 'undefined') return;
ghmob.each(config[i].content, function(a) {
var thisItem = ghmob(config[i].content[a].selector).first();
if (thisItem.length === 0) return;
var thisId = thisItem.attr('id');
var thisGroup = selector.find('[id="' + config[i].id + '"]');
var title;
// Grouping
if (thisGroup.length === 0) {
selector.append('<div id="' + config[i].id + '" data-gh-guide-hidden="true"></div>');
thisGroup = selector.find('[id="' + config[i].id + '"]');
}
// Title
if (thisItem.parents('div[class="ui-body"]').length > 0) {
thisItem = thisItem.closest('div[class="ui-body"]');
title = thisItem.find('> .ui-bar').text().trim();
}
else if (thisItem.parents('.ui-collapsible').length > 0) {
thisItem = thisItem.closest('.ui-collapsible');
title = thisItem.find('> .ui-collapsible-heading').clone();
title.find('.ui-collapsible-heading-status').remove();
title = title.find('.ui-btn-text').text().trim();
}
else if (thisItem.find('[id^=HEADER]').length > 0) {
title = thisItem.find('[id^=HEADER]').text().trim();
}
else {
title = thisItem.find('h1, h2, h3, h4, h5, h6').first().text().trim();
}
thisItem.attr('data-gh-guide-hidden', 'true').appendTo(thisGroup);
// Edit button
if (typeof config[i].content[a].edit !== 'undefined' && typeof config[i].content[a].edit.selector !== 'undefined') {
var edit = ghmob(config[i].content[a].edit.selector);
var editContainer = thisItem.find('.ui-bar, .ui-collapsible-heading').first();
var editColor = (typeof config[i].content[a].edit.color === 'undefined') ? '' : config[i].content[a].edit.color;
var editIcon = (typeof config[i].content[a].edit.icon === 'undefined') ? 'fa-pencil' : config[i].content[a].edit.icon;
var editLabel = (typeof config[i].content[a].edit.label === 'undefined') ? 'Edit' : config[i].content[a].edit.label;
if (edit.length > 0 && editContainer.find('a.attached').length === 0) {
var editAction = '#';
if (edit.is('input[onclick]') || edit.find('input[onclick]').length > 0) {
editAction = 'javascript:' + edit.find('input[onclick]').first().attr('onclick');
editAction = editAction.replace('this.name', '\'' + edit.find('input').first().attr('name') + '\'');
editAction = editAction.replace('this.id', '\'' + edit.find('input').first().attr('id') + '\'');
editAction = editAction.replace('event', '\'click\'');
}
else if (edit.is('a[href]') || edit.find('a[href]').length > 0) {
if (edit.is('a[href]')) {
editAction = edit.attr('href');
}
else {
editAction = edit.find('a[href]').first().attr('href');
}
}
editContainer.attr('data-attached', 'true').attr('tabindex', '0').append('<a href="' + editAction + '" class="attached fa ' + editIcon + ' ' + editColor + '" aria-label="' + editLabel + '" data-role="button"></a>');
editContainer.find('a.attached').button();
edit.addClass('gh-hidden');
}
}
// Subnav
if (hasState === false) {
if (title.toLowerCase() === config[i].label.toLowerCase()) return;
if (guideNav.find('> ul > li:last-child > ul').length === 0) {
guideNav.find('> ul > li:last-child').append('<ul></ul>');
}
guideNav.find('> ul > li:last-child > ul').append('<li><a href="#" data-gh-guide="' + thisId + '">' + title + '</a></li>');
}
});
});
return;
},
/**
* navigationClick
*
* @ignore
* @param {jQuery} selector
* @returns {null}
*/
navigationClick: function(selector) {
if (selector.hasClass('skip-main') === true) {
this.updateFocus();
return;
}
var id = selector.attr('data-gh-guide');
ghGuide.navigate(id);
if (ghGuide.isStartPage() === false) {
ghLoader.show();
window.location = ghGuide.getConfig().menus + '.' + ghGuide.startPageName() + '.GBL';
}
return;
},
/**
* columns
*
* @ignore
* @returns {null}
*/
columns: function() {
var config = this.getConfig().columns;
if (typeof config === 'undefined') return;
ghInterface.makeColumns(config);
ghmob('.gh-cols.gh-guide-wrapper').next('.gh-guide-wrapper').remove();
return;
},
/**
* footers
*
* @ignore
* @param {jQuery} selector
* @returns {null}
*/
footers: function(selector) {
// Get config
var config = this.getConfig().footers;
if (typeof config === 'undefined') return;
// Check for pagination
if (this.isStartPage() === true) {
selector.addClass('paginate');
}
if (selector.hasClass('paginate') === false) return;
// Make footers
var footers = [];
footers.push(ghmob('<a href="#">' + config.previous.text + '</a>'));
footers.push(ghmob('<a href="#">' + config.next.text + '</a>'));
config.icon = [config.previous.icon, config.next.icon];
config.iconPosition = [config.previous.iconPosition, config.next.iconPosition];
config.text = [config.previous.text, config.next.text];
ghContainer.footer(ghmob('.gh-guide-content-wrapper'), footers, config);
return;
},
/**
* footerClick
*
* @ignore
* @param {jQuery} selector
* @returns {null}
*/
footerClick: function(selector) {
var config = ghGuide.getConfig().footers;
var prevText = config.previous.text;
var nextText = config.next.text;
if (ghGuide.isStartPage() === true) {
var active = ghmob('.gh-guide-nav .active').last();
var trigger;
if (selector.text().trim() === nextText) {
trigger = active.next('li');
if (trigger.length === 0) {
trigger = active.parents('li.active').first().next('li');
}
}
if (selector.text().trim() === prevText) {
trigger = active.prev('li');
if (trigger.length === 0) {
trigger = active.parents('li.active').first().prev('li');
}
}
trigger.find('> a').trigger('click');
}
else {
var activeContent = ghmob('.gh-guide-step[data-gh-guide-hidden="false"]').last();
if (activeContent.length === 0) return;
var activeContentNum = parseInt(activeContent.attr('id').split('gh-guide-step-')[1]);
if (selector.text().trim() === nextText) {
activeContentNum = activeContentNum + 1;
}
if (selector.text().trim() === prevText) {
activeContentNum = activeContentNum - 1;
}
var activeId = 'gh-guide-step-' + activeContentNum;
ghGuide.navigate(activeId);
}
return;
},
/**
* filterClick
*
* @ignore
* @param {jQuery} selector
* @returns {null}
*/
filterClick: function(selector) {
var filterId = selector.closest('.gh-guide-filter').attr('id');
var activeLink = selector.closest('li').index();
var activeContent = ghmob('.gh-guide-filtered[data-gh-guide-filter="' + filterId + '"]');
ghGuide.showActiveFilter(filterId, activeLink);
ghGuide.saveState();
ghGuide.updateFocus(activeContent.first().attr('id'));
return;
},
/**
* subpage
*
* @ignore
* @param {jQuery} selector
* @returns {null}
*/
subpage: function(selector) {
if (this.isStartPage() === true || this.isLandingPage() === true) {
this.state.filter = null;
return;
}
// Get config
var config = this.getSubpageConfig();
if (typeof config === 'undefined' || typeof config.name === 'undefined') return;
// Wrapper
var stepsWrapper = selector;
if (selector.find('> div[class="ui-body"]').length > 0) {
stepsWrapper = selector.find('> div[class="ui-body"]');
}
if (selector.find('> .ui-collapsible').length > 0) {
stepsWrapper = selector.find('> .ui-collapsible > .ui-collapsible-content');
}
// Check for pagination
var paginate = config.paginate;
if (paginate === true) {
selector.addClass('paginate');
}
// Steps
var steps = config.steps;
var stepNum = 0;
ghmob.each(steps, function(i) {
// Vars
var page = steps[i].page;
stepNum++;
if (stepNum > 1 && typeof page !== 'undefined') {
stepNum--;
}
if (stepNum > 1) {
var prevStep = ghmob('[id="gh-guide-step-' + (stepNum - 1) + '"]');
if (prevStep.length === 0) {
stepNum--;
}
}
var stepId = 'gh-guide-step-' + stepNum;
var step = ghmob('[id="' + stepId + '"]');
if (step.length === 0) {
step = ghmob('<div class="gh-guide-step" id="' + stepId + '"></div>');
}
if (typeof page !== 'undefined') {
var pageSelector = ghmob('[id="gh-guide-step-' + parseInt(page) + '"]');
if (pageSelector.length > 0) {
step = pageSelector;
}
}
var stepContentId = stepId + '-container-' + stepNum;
if (typeof steps[i].selector === 'undefined') {
steps[i].selector = '[id="' + stepContentId + '"]';
}
var stepContent = ghmob(steps[i].selector);
var stepContentHeading = steps[i].label;
if (steps.length > 1) {
stepContentHeading = 'Step ' + stepNum + ': ' + steps[i].label;
}
// Check for pagination
if (paginate === true) {
step.attr('data-gh-guide-hidden', 'true');
}
// Append content to step
if (typeof steps[i].filter !== 'undefined' && stepContent.length === 0) {
step.append('<div id="' + stepContentId + '"><span class="gh-hidden">Placeholder</span></div>');
stepContent = step.find('[id="' + stepContentId + '"]');
}
if (stepContent.prev('.ui-bar:contains("' + stepContentHeading + '")').length > 0) {
stepContent = stepContent.parent('.ui-body');
}
stepContent.appendTo(step);
// Create container
ghContainer.create(stepContent, stepContentHeading);
// Append step to guide
if (step.children().length > 0) {
step.appendTo(stepsWrapper);
}
// Filter
ghGuide.filter(steps[i], step);
// Columns
ghGuide.subColumns(steps[i], step);
});
return;
},
/**
* filter
*
* @ignore
* @param {obj} config
* @param {jQuery} step
* @returns {null}
*/
filter: function(config, step) {
if (typeof config.filter === 'undefined' || typeof config.filter.navigation !== 'object') return;
// Vars
var filter = step.find('.gh-guide-filter');
var filterSelector = step.find(config.selector);
var filterNum = ghmob('.gh-guide-filter').length + 1;
var filterNav = config.filter.navigation;
// Wrapper
if (filter.length === 0) {
filterSelector.prepend('<div class="gh-guide-filter" id="gh-guide-filter-' + filterNum + '" role="navigation" aria-label="Filter ' + this.getPageHeader() + '"><ul></ul></div>');
filter = step.find('.gh-guide-filter');
}
if (config.filter.inset === true) {
filter.addClass('inset');
}
// Get filter from ghGuide.state
var state = this.getState().filter;
var hasState = (state !== null && state !== undefined);
if (hasState === true) {
filter.html(JSON.parse(state));
}
else {
filter.find('ul').html('');
}
if (hasState === false) {
// Build filter
ghmob.each(filterNav, function(a) {
var label = '';
if (typeof filterNav[a].label.selector !== 'undefined') {
label = ghmob(filterNav[a].label.selector).clone();
label.children().remove();
label = label.text().trim();
}
if (typeof filterNav[a].label.text !== 'undefined') {
label = filterNav[a].label.text;
}
if (label === '') return;
var allyLabel = 'Filter by ' + label;
var link = ghmob('<li><a href="#"></a></li>');
var icons = filterNav[a].icons;
var reset = filterNav[a].reset;
if (reset === true) {
link.find('a').attr('data-gh-guide-filter-reset', 'true');
allyLabel = label;
}
if (typeof icons !== 'undefined') {
ghmob.each(icons, function(b) {
link.find('a').append('<span class="fa ' + icons[b] + '" aria-hidden="true"></span>');
});
}
link.find('a').attr('aria-label', allyLabel).append('<span class="text">' + label + '</span>');
filter.find('> ul').append(link);
});
// Show content
ghGuide.showActiveFilter(filter.attr('id'), 0);
}
else {
// Show content
ghGuide.showActiveFilter(filter.attr('id'), filter.find('.active').index());
}
// Content
var filterMatch = ghmob(config.filter.match);
ghmob(filterMatch).each(function() {
if (ghmob(this).parent('div[class="ui-body"]').length > 0) {
if (ghmob(this).parents('.gh-guide-filter-wrap-' + filterNum).length === 0) {
ghmob(this).parent('div[class="ui-body"]').wrap('<div class="gh-guide-filter-wrap-' + filterNum + '"></div>');
}
filterMatch = ghmob(this).parents('.gh-guide-filter-wrap-' + filterNum).first();
}
filterMatch.addClass('gh-guide-filtered').attr('data-gh-guide-filter', filter.attr('id'));
filterMatch.closest(config.filter.hide).addClass('gh-guide-filtered-hide').attr('data-gh-guide-filter', filter.attr('id'));
});
return;
},
/**
* subColumns
*
* @ignore
* @param {obj} config
* @param {jQuery} step
* @returns {null}
*/
subColumns: function(config) {
if (typeof config.columns === 'undefined') return;
var stepContainer = ghmob(config.selector).children();
var cols = stepContainer.find(config.columns.selector);
var breakpoint = (typeof config.columns.breakpoint === 'undefined') ? 1000 : config.columns.breakpoint;
if (stepContainer.length === 0 || cols.length === 0 || cols.length > 5) return;
var columns = {
breakpoint: breakpoint,
class: 'gh-step-columns',
children: [],
parent: stepContainer,
};
cols.each(function(i) {
var thisWidth = Math.floor(100 / cols.length);
var thisColumn = {
class: 'gh-step-col-' + i,
selector: ghmob(this),
width: thisWidth,
};
columns.children.push(thisColumn);
});
ghInterface.makeColumns(columns);
return;
},
/**
* isLandingPage
*
* @ignore
* @returns {bool}
*/
isLandingPage: function() {
var landingPage = this.landingPageName();
var isLandingPage = false;
var url = window.location.href;
if ((ghPage.getName() !== undefined && ghPage.getName() === landingPage) || (ghPage.getName() === undefined && url.indexOf(landingPage) > -1)) {
isLandingPage = true;
}
return isLandingPage;
},
/**
* landingPageName
*
* @ignore
* @returns {string}
*/
landingPageName: function() {
var config = this.getConfig().landingPage;
if (typeof config === 'undefined') return;
var pageName = config.pageName;
return pageName;
},
/**
* isStartPage
*
* @ignore
* @returns {bool}
*/
isStartPage: function() {
var startPage = this.startPageName();
var isStartPage = false;
var url = window.location.href;
if ((ghPage.getName() !== undefined && ghPage.getName() === startPage) || (ghPage.getName() === undefined && url.indexOf(startPage) > -1)) {
isStartPage = true;
}
return isStartPage;
},
/**
* startPageName
*
* @ignore
* @returns {string}
*/
startPageName: function() {
var config = this.getConfig().startPage;
if (typeof config === 'undefined') return;
var pageName = config.pageName;
return pageName;
},
/**
* navigate
*
* @ignore
* @param {string} id
* @returns {null}
*/
navigate: function(id) {
// Save active link to ghGuide.state
var activeLink = this.getActiveLink(id);
if (activeLink.length > 0) {
this.state.activeLink = activeLink.attr('data-gh-guide');
}
// Save active content to ghGuide.state
var activeContent = this.getActiveContent(id);
if (activeContent.length > 0) {
this.state.activeContent = activeContent.attr('id');
}
// Navigation
this.showActiveLink(id);
// Save navigation to ghGuide.state
var navigation = ghmob('.gh-guide-nav').html();
this.state.navigation = JSON.stringify(navigation);
// Save ghGuide.state to session storage
this.saveState();
// Content
this.showActiveContent(id);
// Footers
this.updateFooters(id);
// Focus
if (typeof id !== 'undefined') {
this.updateFocus(id);
}
else {
ghAccessibility.setFocus();
}
return;
},
/**
* getActiveLink
*
* @ignore
* @param {string} id
* @returns {null}
*/
getActiveLink: function(id) {
var activeLink = ghmob('.gh-guide-nav a[data-gh-guide="' + id + '"]');
if (typeof id === 'undefined' || activeLink.length === 0) {
var state = this.getState();
if (state.activeLink === undefined) {
activeLink = ghmob('.gh-guide-nav > ul > li:first-child > a');
}
else {
activeLink = ghmob('.gh-guide-nav [data-gh-guide="' + state.activeLink + '"]');
}
}
if (activeLink.length === 0) {
activeLink = ghmob('.gh-guide-nav > ul > li:first-child > a');
}
return activeLink;
},
/**
* showActiveLink
*
* @ignore
* @param {string} id
* @returns {null}
*/
showActiveLink: function(id) {
if (this.isStartPage() === false) return;
var activeLink = this.getActiveLink(id);
// Highlight navigation
ghmob('.gh-guide-nav li').removeClass('active');
activeLink.parents('li').addClass('active');
activeLink.parent('li').find('> ul > li:first-child').addClass('active').trigger('click');
return;
},
/**
* getActiveContent
*
* @ignore
* @param {string} id
* @returns {jQuery}
*/
getActiveContent: function(id) {
var activeContent = ghmob('[id="' + id + '"]');
var state = this.getState();
if (id === 'view-all' || state.activeLink === 'view-all') {
activeContent = ghmob('[data-gh-guide-hidden]');
id = 'view-all';
}
if (typeof id === 'undefined') {
if (typeof state.activeContent !== 'undefined') {
activeContent = ghmob('[id="' + state.activeContent + '"]');
if (activeContent.length === 0 && typeof state.activeLink !== 'undefined') {
activeContent = ghmob('[id="' + state.activeLink + '"]');
}
}
}
if (typeof state.activeContent === 'undefined' || activeContent.length === 0) {
if (ghmob('[data-gh-guide-hidden="false"][id]').length > 0) {
id = ghmob('[data-gh-guide-hidden="false"][id]').last().attr('id');
}
else if (ghmob('.gh-guide-step[id]').length > 0) {
id = ghmob('.gh-guide-step[id]').first().attr('id');
}
else if (ghmob('[data-gh-guide-hidden="true"]').length > 0) {
id = ghmob('[data-gh-guide-hidden="true"]').first().attr('id');
}
activeContent = ghmob('[id="' + id + '"]');
}
return activeContent;
},
/**
* showActiveContent
*
* @ignore
* @param {string} id
* @returns {null}
*/
showActiveContent: function(id) {
var activeContent = this.getActiveContent(id);
if (activeContent.length === 0) return;
// Content
ghmob('[data-gh-guide-hidden]').attr('data-gh-guide-hidden', 'true');
if (typeof activeContent.attr('data-gh-guide-hidden') !== 'undefined') {
activeContent.attr('data-gh-guide-hidden', 'false');
}
activeContent.find('[data-gh-guide-hidden]').first().attr('data-gh-guide-hidden', 'false');
activeContent.parents('[data-gh-guide-hidden]').attr('data-gh-guide-hidden', 'false');
// resize inner tablesaw tables
var tablesawTbls = activeContent.find('.tablesaw');
tablesawTbls.each(function() {
if (typeof ghmob(this).data().ghtables === 'undefined') return;
ghmob(this).trigger('resize');
});
return;
},
/**
* updateFooters
*
* @ignore
* @param {string} id
* @returns {null}
*/
updateFooters: function(id) {
var activeContent = this.getActiveContent(id);
if (activeContent.length === 0) return;
// Footers
var config = this.getConfig().footers;
var prevText = config.previous.text;
var prevBtn = ghmob('.gh-container-footer a:contains("' + prevText + '")');
var nextText = config.next.text;
var nextBtn = ghmob('.gh-container-footer a:contains("' + nextText + '")');
ghmob('.gh-container-footer .gh-hidden').removeClass('gh-hidden');
if (activeContent.next('[data-gh-guide-hidden="true"]').length === 0 && activeContent.find('[data-gh-guide-hidden="true"]').length === 0 && activeContent.parents('[data-gh-guide-hidden]').next('[data-gh-guide-hidden="true"]').length === 0) {
if (this.isStartPage() === true && ghmob('.gh-guide-nav .active').next('li').length > 0) return;
nextBtn.addClass('gh-hidden');
}
if (activeContent.prev('[data-gh-guide-hidden="true"]').length === 0 && activeContent.parents('[data-gh-guide-hidden]').prev('[data-gh-guide-hidden="true"]').length === 0) {
if (this.isStartPage() === true && ghmob('.gh-guide-nav .active').prev('li').length > 0) return;
prevBtn.addClass('gh-hidden');
}
return;
},
/**
* updateFocus
*
* @ignore
* @param {string} id
* @returns {null}
*/
updateFocus: function(id) {
var activeContent = ghmob('[id="' + id + '"]');
if (typeof id === 'undefined') {
activeContent = ghmob('[data-gh-guide-hidden="false"]').first();
}
if (activeContent.length === 0) return;
// Focus and scroll position
if (activeContent.is('[data-gh-guide-hidden]') === true && typeof id !== 'undefined') {
activeContent.find('div[class="ui-body"], .ui-collapsible').first().find(':focusable').first().focus();
}
else if (activeContent.parents('div[class="ui-body"], .ui-collapsible').length > 0) {
activeContent.parents('div[class="ui-body"], .ui-collapsible').first().find(':focusable').first().focus();
}
else if (activeContent.parents('[data-gh-guide-hidden]').length > 0 && activeContent.hasClass('gh-guide-filtered') === false) {
activeContent.parents('[data-gh-guide-hidden]').first().find(':focusable').first().focus();
}
else {
activeContent.find(':focusable').first().focus();
}
var scrollTo = activeContent.offset().top;
if (activeContent.parents('div[class="ui-body"], .ui-collapsible').length > 0) {
scrollTo = activeContent.closest('div[class="ui-body"], .ui-collapsible').offset().top;
}
scrollTo = scrollTo - ghmob('.ui-header-fixed').height();
window.scrollTo(0, scrollTo);
return;
},
/**
* getState
*
* @ignore
* @returns {obj}
*/
getState: function() {
var state = {};
try {
if (typeof(Storage) !== 'undefined') {
state = JSON.parse(sessionStorage.getItem('gh-guide-state'));
if (state === null) {
state = {};
}
}
}
catch (err) {
ghLog.info('Cannot get ghGuide state. No session storage.');
}
return state;
},
/**
* saveState
*
* @ignore
* @returns {null}
*/
saveState: function() {
try {
if (typeof(Storage) !== 'undefined') {
sessionStorage.setItem('gh-guide-state', JSON.stringify(ghGuide.state));
}
}
catch (err) {
ghLog.info('Cannot save ghGuide state. No session storage.');
}
return;
},
/**
* showActiveFilter
*
* @ignore
* @param {string} filterId
* @param {int} linkNum
* @returns {null}
*/
showActiveFilter: function(filterId, linkNum) {
var filter = ghmob('[id="' + filterId + '"]');
var activeLink = filter.find('li:eq(' + linkNum + ') a');
// Active classes
filter.find('li').removeClass('active');
activeLink.closest('li').addClass('active');
ghUtils.delay(function() {
// Show content
var activeContent = ghmob('.gh-guide-filtered[data-gh-guide-filter="' + filterId + '"]');
activeContent.each(function() {
var thisText = ghmob(this).text().trim();
ghmob(this).closest('.gh-guide-filtered-hide').addClass('gh-hidden');
ghmob(this).closest('.ui-table').removeClass('reflow-grid-' + ghmob(this).closest('.ui-table').attr('data-reflow-breakpoint')).addClass('gh-guide-filtered');
if (thisText === activeLink.text().trim()) {
ghmob(this).closest('.gh-guide-filtered-hide').removeClass('gh-hidden').siblings('.gh-guide-filtered-hide').addClass('gh-hidden');
ghmob(this).parents('.gh-cols').not('.gh-guide-wrapper').removeClass('stack').addClass('inline');
}
if (activeLink.attr('data-gh-guide-filter-reset') === 'true') {
ghmob(this).closest('.gh-guide-filtered-hide').removeClass('gh-hidden').siblings('.gh-guide-filtered-hide').removeClass('gh-hidden');
ghmob(this).closest('.ui-table').addClass('reflow-grid-' + ghmob(this).closest('.ui-table').attr('data-reflow-breakpoint')).removeClass('gh-guide-filtered');
ghmob(this).parents('.gh-cols').not('.gh-guide-wrapper').addClass('stack').removeClass('inline');
}
});
});
// Save filter to ghGuide.state
if (filter.length > 0) {
this.state.filter = JSON.stringify(filter.html());
}
return;
},
/**
* getMenu
*
* @ignore
* @returns {string}
*/
getMenu: function() {
var thisMenu = window.location.href.split('/')[window.location.href.split('/').length - 1].split('.')[0];
if (ghPage.getComponentName()) {
thisMenu = ghPage.getComponentName();
}
return thisMenu;
},
/**
* getSubpageConfig
*
* @ignore
* @returns {obj}
*/
getSubpageConfig: function() {
var config = this.getConfig().subpages;
if (typeof config === 'undefined') return;
var thisConfig = {};
ghmob.each(config, function(i) {
if (config[i].name === ghPage.getName()) {
thisConfig = config[i];
}
});
return thisConfig;
},
/**
* getConfig
*
* @ignore
* @returns {obj}
*/
getConfig: function() {
var config = this.config;
var thisConfig = {};
var thisMenu = this.getMenu();
ghmob.each(config, function(i) {
ghmob.each(config[i].menus, function(a) {
if (thisMenu === config[i].menus[a]) {
thisConfig = config[i];
}
});
});
return thisConfig;
},
/**
* create
*
* @param {jQuery} [selector]
* @returns {null}
*/
create: function(selector) {
if (ghConfig.guide.enabled === false || typeof this.getConfig().menus === 'undefined' || ghPage.isActivityGuide() || ghGuide.isStartPage() === false && (ghGuide.getState() === null || ghGuide.getState() === undefined)) return;
// Set Classes
this.setClasses();
ghUtils.delay(function() {
if (typeof selector === 'undefined') {
selector = ghmob('.gh-guide');
}
if (selector.length === 0) return;
// Create Wrapper
ghGuide.wrapper(selector);
// Update Selector
selector = ghmob('.gh-guide');
// Create Navigation
ghGuide.navigation(selector);
// Create Columns
ghGuide.columns(selector);
// Create Subpage
ghGuide.subpage(selector);
// Create Footers
ghGuide.footers(selector);
// Navigate
ghGuide.navigate();
// Create Container
ghGuide.container();
});
return;
},
/**
* _eventBindings
*
* @private
* @returns {null}
*/
_eventBindings: function() {
ghmob(document)
.off('click.gh.guide.navigationClick')
.on('click.gh.guide.navigationClick', '.gh-guide-nav a[href="#"]', function(e) {
ghLog.event('click.gh.guide.navigationClick');
e.preventDefault();
e.stopPropagation();
ghGuide.navigationClick(ghmob(this));
});
ghmob(document)
.off('click.gh.guide.filterClick')
.on('click.gh.guide.filterClick', '.gh-guide-filter a', function(e) {
ghLog.event('click.gh.guide.filterClick');
e.preventDefault();
e.stopPropagation();
ghGuide.filterClick(ghmob(this));
});
ghmob(document)
.off('click.guide.gh.footerClick')
.on('click.guide.gh.footerClick', '.gh-guide-content-wrapper > .gh-container-footer a[href="#"], .gh-guide-content-wrapper > .gh-container-footer a[href="javascript:#"]', function(e) {
ghLog.event('click.gh.guide.footerClick');
e.preventDefault();
e.stopPropagation();
ghGuide.footerClick(ghmob(this));
});
return;
},
/**
* run
*
* @ignore
* @returns {null}
*/
run: function() {
if (ghConfig.guide.autoInit === false) return;
this.create();
this._eventBindings();
return;
},
};
ghInit.module('ghGuide');
ghGuide.config = [
{
menus: ['W3EB_ENR_SELECT', 'W3EB_ENR_SUMMARY', 'W3EB_ENR_1X', 'W3EB_ENR_2X', 'W3EB_ENR_4X', 'W3EB_ENR_357X'],
subsite: true,
landingPage: {
background: {
minHeight: 450,
src: '/res/ps/images/pux/guide-landing-bg.png',
},
pageName: 'W3EB_ENR_SELECT',
},
startPage: {
pageName: 'W3EB_ENR_SUMMARY',
},
navigation: [
{
icon: 'fa-user-md',
id: 'health-plans',
label: 'Health Plans',
content: [
{
edit: {
selector: '[id$="divW3EB_ENR_PB_WRK_PB_EDIT$0"]',
},
selector: '[id="medical"]',
},
{
edit: {
selector: '[id$="divW3EB_ENR_PB_WRK_PB_EDIT$1"]',
},
selector: '[id="dental"]',
},
{
edit: {
selector: '[id$="divW3EB_ENR_PB_WRK_PB_EDIT$2"]',
},
selector: '[id="vision"]'
},
],
},
{
icon: 'fa-umbrella',
id: 'life-insurance',
label: 'Life Insurance',
content: [
{
edit: {
selector: '[id$="divW3EB_ENR_PB_WRK_PB_EDIT$3"]',
},
selector: '[id="life"]',
},
{
edit: {
selector: '[id$="divW3EB_ENR_PB_WRK_PB_EDIT$4"]',
},
selector: '[id="supplemental-life"]',
},
{
edit: {
selector: '[id$="divW3EB_ENR_PB_WRK_PB_EDIT$7"]',
},
selector: '[id="dependent-life"]'
},
],
},
{
icon: 'fa-ambulance',
id: 'accident-insurance',
label: 'Accident Insurance',
content: [
{
edit: {
selector: '[id$="divW3EB_ENR_PB_WRK_PB_EDIT$5"]',
},
selector: '[id="ad-and-d"]',
},
{
edit: {
selector: '[id$="divW3EB_ENR_PB_WRK_PB_EDIT$6"]',
},
selector: '[id="dependent-ad-and-d"]',
},
{
edit: {
selector: '[id$="divW3EB_ENR_PB_WRK_PB_EDIT$8"]',
},
selector: '[id="supplemental-ad-and-d"]'
},
],
},
{
icon: 'fa-universal-access',
id: 'disability-insurance',
label: 'Disability Insurance',
content: [
{
edit: {
selector: '[id$="divW3EB_ENR_PB_WRK_PB_EDIT$9"]',
},
selector: '[id="short-term-disability"]',
},
{
edit: {
selector: '[id$="divW3EB_ENR_PB_WRK_PB_EDIT$10"]',
},
selector: '[id="long-term-disability"]',
},
],
},
{
icon: 'fa-dollar',
id: 'savings',
label: 'Savings',
content: [
{
edit: {
selector: '[id$="divW3EB_ENR_PB_WRK_PB_EDIT$11"]',
},
selector: '[id="401(k)"]',
},
{
edit: {
selector: '[id$="divW3EB_ENR_PB_WRK_PB_EDIT$12"]',
},
selector: '[id="profit-sharing"]',
},
{
selector: '[id="pension-plan-1---u.s."]',
},
],
},
{
icon: 'fa-money',
id: 'flex-spending',
label: 'Flex Spending',
content: [
{
edit: {
selector: '[id$="divW3EB_ENR_PB_WRK_PB_EDIT$14"]',
},
selector: '[id="flex-spending-health---u.s."]',
},
{
edit: {
selector: '[id$="divW3EB_ENR_PB_WRK_PB_EDIT$15"]',
},
selector: '[id="flex-spending-dependent-care"]',
},
],
},
{
icon: 'fa-check-square-o',
id: 'additional-benefits',
label: 'Additional Benefits',
content: [
{
edit: {
selector: '[id$="divW3EB_ENR_PB_WRK_PB_EDIT$13"]',
},
selector: '[id="employee-stock-purchase"]',
},
{
edit: {
selector: '[id$="divW3EB_ENR_PB_WRK_PB_EDIT$17"]',
},
selector: '[id="vacation-buy"]',
},
{
edit: {
selector: '[id$="divW3EB_ENR_PB_WRK_PB_EDIT$18"]',
},
selector: '[id="vacation-sell"]',
},
],
},
{
icon: 'fa-list',
id: 'view-all',
label: 'View All',
},
],
footers: {
align: 'right',
color: '',
next: {
icon: 'fa fa-angle-right',
iconPosition: 'right',
text: 'Next',
},
previous: {
icon: 'fa fa-angle-left',
iconPosition: 'left',
text: 'Previous',
},
},
columns: {
breakpoint: 1000,
class: 'gh-guide-wrapper',
children: [
{
class: 'gh-guide-nav-wrapper',
selector: '.gh-guide-nav',
width: 20,
},
{
class: 'gh-guide-content-wrapper',
selector: '.gh-guide-content',
width: 80,
},
],
parent: '.gh-guide-wrapper',
},
subpages: [
{
name: 'W3EB_ENR_1X_ELECT',
paginate: true,
steps: [
{
label: 'Choose Coverage Level',
page: 1,
filter: {
hide: 'tr',
inset: true,
match: '[id*="divW3EB_ENR_L2_WRK_DESCR$"]',
navigation: [
{
icons: ['fa-male'],
label: {
selector: 'span[id="W3EB_ENR_L2_WRK_DESCR$0"]',
},
},
{
icons: ['fa-male', 'fa-male'],
label: {
selector: 'span[id="W3EB_ENR_L2_WRK_DESCR$1"]',
},
},
{
icons: ['fa-male', 'fa-child'],
label: {
selector: 'span[id="W3EB_ENR_L2_WRK_DESCR$2"]',
},
},
{
icons: ['fa-male', 'fa-male', 'fa-child'],
label: {
selector: 'span[id="W3EB_ENR_L2_WRK_DESCR$3"]',
},
},
{
icons: ['fa-male', 'fa-male'],
label: {
selector: 'span[id="W3EB_ENR_L2_WRK_DESCR$4"]',
},
},
{
icons: ['fa-male', 'fa-male', 'fa-child'],
label: {
selector: 'span[id="W3EB_ENR_L2_WRK_DESCR$5"]',
},
},
{
icons: ['fa-th-list'],
label: {
text: 'Compare All',
},
reset: true,
},
],
},
},
{
label: 'Choose Plan',
columns: {
breakpoint: 1000,
},
page: 1,
selector: '[id="ACE_$ICField9$0"]',
},
{
label: 'Enroll Your Dependents',
selector: 'div[data-pnlname="W3EB_1X_DEPGBL_SBP"][data-pnlfldid="1"]',
},
{
label: 'Choose a Primary Care Provider ID',
selector: 'div[data-pnlname="W3EB_1X_PCPGBL_SBP"][data-pnlfldid="3"]',
},
],
},
{
name: 'W3EB_ENR_2X_ELECT',
paginate: true,
steps: [
{
label: 'Select an Option',
selector: 'div[data-pnlname="W3EB_ENR_2X_ELECT"][data-pnlfldid="10"], div[data-pnlname="W3EB_ENR_2X_ELECT"][data-pnlfldid="17"], div[data-pnlname="W3EB_ENR_2X_ELECT"][data-pnlfldid="26"]',
},
{
label: 'Designate Your Beneficiaries',
selector: 'div[data-pnlname="W3EB_ENR_2X_ELECT"][data-pnlfldid="79"]',
},
],
},
{
name: 'W3EB_ENR_4X_ELECT',
paginate: true,
steps: [
{
label: 'Select an Option',
selector: 'div[data-pnlname="W3EB_ENR_4X_ELECT"][data-pnlfldid="4"], div[data-pnlname="W3EB_ENR_4X_ELECT"][data-pnlfldid="44"]',
},
{
label: 'Contributions',
selector: 'div[data-pnlname="W3EB_ENR_4X_ELECT"][data-pnlfldid="11"]',
},
{
label: 'Designate Your Beneficiaries',
selector: 'div[data-pnlname="W3EB_ENR_4X_ELECT"][data-pnlfldid="22"]',
},
{
label: 'Designate Your Fund Allocations',
selector: 'div[data-pnlname="W3EB_ENR_4X_ELECT"][data-pnlfldid="32"]',
},
],
},
{
name: 'W3EB_ENR_357X_ELCT',
steps: [
{
label: 'Select an Option',
columns: {
breakpoint: 1000,
},
selector: 'div[data-pnlname="W3EB_357X_OPT_SBP"][data-pnlfldid="1"]',
},
],
},
],
},
{
menus: ['HR_EE_PERS_INFO'],
startPage: {
pageName: 'HR_EE_PERS_INFO',
},
navigation: [
{
icon: 'fa-user',
id: 'name',
label: 'Name',
content: [
{
edit: {
selector: 'div[data-pnlname="HR_EE_PERS_INFO"][data-pnlfldid="14"]',
},
selector: '[data-for="HR_LBL_WRK_NAME_LBL"]',
},
],
},
{
icon: 'fa-location-arrow',
id: 'address',
label: 'Home/Mailing Addresses',
content: [
{
edit: {
selector: 'div[data-pnlname="HR_EE_PERS_INFO"][data-pnlfldid="85"]',
},
selector: '[data-for="HR_LBL_WRK_ADDRESSES_LBL"]',
},
],
},
{
icon: 'fa-phone',
id: 'phone',
label: 'Phone Numbers',
content: [
{
edit: {
selector: 'div[data-pnlname="HR_EE_PERS_INFO"][data-pnlfldid="60"]',
},
selector: '[data-for="HR_LBL_WRK_PHONE_NUMBERS_LBL"]',
},
],
},
{
icon: 'fa-address-book',
id: 'emergency',
label: 'Emergency Contacts',
content: [
{
edit: {
selector: 'div[data-pnlname="HR_EE_PERS_INFO"][data-pnlfldid="65"]',
},
selector: '[data-for="HR_LBL_WRK_EMERGCY_CON_LBL"]',
},
],
},
{
icon: 'fa-envelope-o',
id: 'email',
label: 'Email Addresses',
content: [
{
edit: {
selector: 'div[data-pnlname="HR_EE_PERS_INFO"][data-pnlfldid="69"]',
},
selector: '[data-for="HR_LBL_WRK_EMAIL_ADDRESS_LBL"]',
},
],
},
{
icon: 'fa-comments-o',
id: 'instant-message',
label: 'Instant Message IDs',
content: [
{
edit: {
selector: 'div[data-pnlname="HR_EE_PERS_INFO"][data-pnlfldid="132"]',
},
selector: '[data-for="HR_LBL_WRK_IM_CHAT_ID_LBL"]',
},
],
},
{
icon: 'fa-gavel',
id: 'marital-status',
label: 'Marital Status',
content: [
{
edit: {
selector: 'div[data-pnlname="HR_EE_PERS_INFO"][data-pnlfldid="25"]',
},
selector: '[data-for="HR_LBL_WRK_STATUS_LBL"]',
},
],
},
{
icon: 'fa-globe',
id: 'ethnic-groups',
label: 'Ethnic Groups',
content: [
{
edit: {
selector: 'div[data-pnlname="HR_EE_PERS_INFO"][data-pnlfldid="100"]',
},
selector: '[data-for="HR_LBL_WRK_ETHNIC_GROUPS_LBL"]',
},
],
},
{
icon: 'fa-briefcase',
id: 'employee-information',
label: 'Employee Information',
content: [
{
selector: '[data-for="HR_LBL_WRK_EMPLOYEE_INFO_LBL"]',
},
],
},
],
footers: {
align: 'right',
color: '',
next: {
icon: 'fa fa-angle-right',
iconPosition: 'right',
text: 'Next',
},
previous: {
icon: 'fa fa-angle-left',
iconPosition: 'left',
text: 'Previous',
},
},
columns: {
breakpoint: 1000,
class: 'gh-guide-wrapper',
children: [
{
class: 'gh-guide-content-wrapper',
selector: '.gh-guide-content',
width: 75,
},
{
class: 'gh-guide-nav-wrapper',
selector: '.gh-guide-nav',
width: 25,
},
],
parent: '.gh-guide-wrapper',
},
},
{
menus: ['GS_MB_SGTL_TBL'],
subsite: true,
startPage: {
pageName: 'GS_MB_SGTL_TBL',
},
navigation: [
{
id: 'gh-sg-alerts-nav',
label: 'Alerts',
content: [
{
selector: '[id="gh-sg-alerts"]',
},
],
},
{
id: 'gh-sg-buttons-nav',
label: 'Buttons',
content: [
{
selector: '[id="gh-sg-buttons"]',
},
],
},
{
id: 'gh-sg-collapsibles-nav',
label: 'Collapsibles',
content: [
{
selector: '[id="gh-sg-collapsibles-colors"]',
},
{
selector: '[id="gh-sg-collapsibles-buttons"]',
},
{
selector: '[id="gh-sg-collapsibles-counters"]',
},
{
selector: '[id="gh-sg-collapsibles-icons"]',
},
{
selector: '[id="gh-sg-collapsibles-listviews"]',
},
{
selector: '[id="gh-sg-collapsibles-footers"]',
},
],
},
{
id: 'gh-sg-containers-nav',
label: 'Containers',
content: [
{
selector: '[id="gh-sg-containers-colors"]',
},
{
selector: '[id="gh-sg-containers-buttons"]',
},
{
selector: '[id="gh-sg-containers-counters"]',
},
{
selector: '[id="gh-sg-containers-icons"]',
},
{
selector: '[id="gh-sg-containers-listviews"]',
},
{
selector: '[id="gh-sg-containers-footers"]',
},
],
},
{
id: 'gh-sg-forms-nav',
label: 'Forms',
content: [
{
selector: '[id="gh-sg-forms-checkbox"]',
},
{
selector: '[id="gh-sg-forms-radio"]',
},
{
selector: '[id="gh-sg-forms-select"]',
},
{
selector: '[id="gh-sg-forms-text-input"]',
},
{
selector: '[id="gh-sg-forms-textarea"]',
},
],
},
{
id: 'gh-sg-legends-nav',
label: 'Legends',
content: [
{
selector: '[id="gh-sg-legends"]',
},
],
},
{
id: 'gh-sg-loaders-nav',
label: 'Loaders',
content: [
{
selector: '[id="gh-sg-loaders"]',
},
],
},
{
id: 'gh-sg-multisteps-nav',
label: 'Multisteps',
content: [
{
selector: '[id="gh-sg-multisteps"]',
},
],
},
{
id: 'gh-sg-page-headers-nav',
label: 'Page Headers',
content: [
{
selector: '[id="gh-sg-page-headers"]',
},
],
},
{
id: 'gh-sg-popups-nav',
label: 'Popups',
content: [
{
selector: '[id="gh-sg-popups"]',
},
],
},
{
id: 'gh-sg-progress-nav',
label: 'Progress',
content: [
{
selector: '[id="gh-sg-progress"]',
},
],
},
{
id: 'gh-sg-tables-nav',
label: 'Tables',
content: [
{
selector: '[id="gh-sg-tables-reflow"]',
},
{
selector: '[id="gh-sg-tables-tablesaw"]',
},
{
selector: '[id="gh-sg-tables-pager"]',
},
{
selector: '[id="gh-sg-tables-sort"]',
},
],
},
{
id: 'gh-sg-tabs-nav',
label: 'Tabs',
content: [
{
selector: '[id="gh-sg-tabs"]',
},
],
},
],
footers: {
align: 'right',
color: '',
next: {
icon: 'fa fa-angle-right',
iconPosition: 'right',
text: 'Next',
},
previous: {
icon: 'fa fa-angle-left',
iconPosition: 'left',
text: 'Previous',
},
},
columns: {
breakpoint: 1000,
class: 'gh-guide-wrapper',
children: [
{
class: 'gh-guide-nav-wrapper',
selector: '.gh-guide-nav',
width: 25,
},
{
class: 'gh-guide-content-wrapper',
selector: '.gh-guide-content',
width: 75,
},
],
parent: '.gh-guide-wrapper',
},
},
];
/**
* ghTerm
* Remebers term selection so term does not have to be reselected
*
* @owner Jennifer Goncalves
*/
var ghTerm = ghTerm || {
/**
* saveTermToSession
* Save term in session storage
*
* @private
* @param {string} term
* @returns {void}
*/
_saveTermToSession: function(term) {
ghState.push('auto-select-term', -1, { term: term });
},
/**
* getTermFromSession
* Get term from session storage
*
* @private
* @returns {string|null}
*/
_getTermFromSession: function() {
return ghState.get('auto-select-term').term;
},
/**
* removeTermFromSession
* Get term from session storage
*
* @private
* @returns {void}
*/
_removeTermFromSession: function() {
ghState.remove('auto-select-term');
},
/**
* getTermList
* Get a list of all available terms from the DOM
*
* @private
* @param {string} page
* @param {int} field
* @returns {jQuery}
*/
_getTermList: function(page, field) {
if (ghPage.getField(page, field).find('a h3').length > 0) {
return ghPage.getField(page, field).find('a h3');
}
else {
return ghPage.getField(page, field).find('a');
}
},
/**
* loadSelectedTerm
* Auto load previously selected term
*
* @private
* @returns {null|void}
*/
_loadSelectedTerm: function() {
// Don't load term from session if user manually selected to change term
if (window.location.href.indexOf('?Page') < 0) return;
// Looking at each term in order to load the selected term
ghmob.each(termConfig, function(i) {
var page = termConfig[i].page,
field = termConfig[i].field,
selectedTerm = ghTerm._getTermFromSession(),
termList = ghTerm._getTermList(page, field);
termList.each(function() {
ghmob(this).attr('data-gh-term-name', ghmob(this).text().trim());
// If this term is the selected term...
if (ghmob(this).text().trim() === selectedTerm) {
// Load selected term
ghPage.submitAction(ghmob(this).closest('a').attr('id'));
}
});
});
},
/**
* wireTermSelection
* Wire all terms so they save to session when chosen
*
* @private
* @returns {void}
*/
_wireTermSelection: function() {
ghmob.each(termConfig, function(i) {
var page = termConfig[i].page,
field = termConfig[i].field,
termList = ghTerm._getTermList(page, field);
termList.each(function() {
var thisTerm = ghmob(this).text().trim();
ghmob(this).closest('a').on('click', function() {
// Save selected term
ghTerm._saveTermToSession(thisTerm);
});
});
});
},
/**
* onReturnClick
* Wire all terms so they save to session when chosen
*
* @private
* @returns {void}
*/
_onReturnClick: function() {
ghmob(document).on('click', 'a[href*="window.history.back()"]', function(event) {
event.preventDefault();
ghTerm._removeTermFromSession();
window.history.back();
});
},
/**
* onPageBeforeCreate
* Functionality to load before page
*
* @ignore
* @returns {null|void}
*/
onPageBeforeCreate: function() {
if (ghConfig.term.rememberTerm !== true) return;
this._loadSelectedTerm();
},
/**
* run
*
* @ignore
* @returns {null|void}
*/
run: function() {
if (ghConfig.term.rememberTerm !== true) return;
ghUtils.delay(function() {
// Do not wire the click until selected term has loaded
ghTerm._wireTermSelection();
ghTerm._onReturnClick();
}, 1000);
},
};
ghInit.module('ghTerm');
termConfig = [
{
page: 'SSR_DROP_TERM_FL',
field: 87,
},
{
page: 'SSR_SWAP_TERM_FL',
field: 87,
},
{
page: 'SSR_TERM_STA2_FL',
field: 15,
},
{
page: 'SSR_TERM_STA1_FL',
field: 15,
},
{
page: 'SSR_TERM_STA1_SCF',
field: 16,
},
{
page: 'SSR_TERM_STA3_FL',
field: 15,
},
{
page: 'SSR_TERM_STA3_SCF',
field: 15,
},
];
/**
* ghPanel
*
* @module panel
* @config enabled [true, false]
* @config dismissable [true, false]
* @config swipeClose [true, false]
* @config overlay [true, false]
*
* @trigger panelcreate
* @trigger panelopen
* @trigger panelclose
*/
var ghPanel = ghPanel || {
/**
* selectors
*
* @private
* @type {string}
*/
_selectors: ['[data-role="panel"]'],
/**
* leftPanel
*
* @private
* @type {string}
*/
_leftPanel: '[data-position="left"]',
/**
* rightPanel
*
* @private
* @type {string}
*/
_rightPanel: '[data-position="right"]',
/**
* panelClassPrefix
*
* @private
* @type {string}
*/
_panelClassPrefix: 'ui-panel-position-',
/**
* contentWrapClassPrefix
*
* @private
* @type {string}
*/
_contentWrapClassPrefix: 'ui-panel-content-wrap-position-',
/**
* getPanels
*
* @private
* @returns {jQuery}
*/
_getPanels: function() {
return ghmob(this._selectors.join());
},
/**
* getPanelClass
*
* @private
* @param {string} id
* @returns {string}
*/
_getPanelClass: function(id) {
var panelPosition = this._getPanelPosition(id);
return this._panelClassPrefix + panelPosition;
},
/**
* getContentWrapClass
*
* @private
* @param {string} id
* @returns {string}
*/
_getContentWrapClass: function(id) {
var panelPosition = this._getPanelPosition(id);
return this._contentWrapClassPrefix + panelPosition;
},
/**
* getPanelPosition
*
* @private
* @param {string} id
* @returns {string}
*/
_getPanelPosition: function(id) {
var panel = ghmob('[id="' + id + '"]');
if (panel.is(this._leftPanel)) {
return 'left';
}
if (panel.is(this._rightPanel)) {
return 'right';
}
},
/**
* getPanelWindow
*
* @private
* @returns {obj}
*/
_getPanelWindow: function() {
var thisWindow = window;
if (ghPage.isTargetContent()) {
thisWindow = ghUtils.getWinTop();
}
return thisWindow;
},
/**
* create
*
* @param {string} id
* @param {obj} [config]
* @param {bool} [config.display]
* @returns {void}
*/
create: function(id, config) {
var panels = ghmob('[id="' + id + '"]');
if (typeof id === 'undefined') {
panels = this._getPanels();
}
panels.each(function() {
var panel = ghmob(this);
var panelId = ghmob(this).attr('id');
var panelClass = ghPanel._getPanelClass(panelId);
panel.addClass('ui-panel ' + panelClass);
if ((typeof ghConfig.panel !== 'undefined' && ghConfig.panel.overlay) || (typeof config !== 'undefined' && config.display === 'overlay')) {
panel.attr('data-display', 'overlay');
}
else if (panel.attr('data-display') !== 'overlay') {
panel.attr('data-display', 'none');
}
if (panel.find('.ui-panel-inner').length === 0) {
panel.children().wrapAll('<div class="ui-panel-inner"></div>');
}
});
},
/**
* triggerPanel
*
* @param {string} id
* @param {string} [eventType]
* @returns {null|void}
*/
triggerPanel: function(id, eventType) {
if (typeof id === 'undefined') return;
var thisWindow = ghPanel._getPanelWindow();
var activePanel = ghmob('.ui-panel[id="' + id + '"]', thisWindow.document);
if (activePanel.length === 0) return;
var panelOpenClass = 'ui-page-panel-open';
var isPanelOpen = ghmob('.' + panelOpenClass, thisWindow.document).length > 0;
if ((isPanelOpen && eventType !== 'open') || eventType === 'close') {
ghmob('body').removeClass(panelOpenClass);
ghInterface._layout._getContent().parent('.ui-panel-content-wrap').removeClass(this._getContentWrapClass(id));
activePanel.removeClass('ui-panel-open').addClass('ui-panel-closed');
if (typeof eventType === 'undefined') {
activePanel.trigger('panelbeforeclose');
activePanel.trigger('panelclose');
}
}
else {
ghmob('body').addClass(panelOpenClass);
ghInterface._layout._getContent().parent('.ui-panel-content-wrap').addClass(this._getContentWrapClass(id));
activePanel.removeClass('ui-panel-closed').addClass('ui-panel-open');
if (typeof eventType === 'undefined') {
activePanel.trigger('panelbeforeopen');
activePanel.trigger('panelopen');
}
}
},
/**
* _eventBindings
*
* @private
* @returns {void}
*/
_eventBindings: function() {
ghmob(document)
.off('click.ghPanel.triggerPanel')
.on('click.ghPanel.triggerPanel', '.ui-header[role="banner"] a', function(event) {
var panelId = ghmob(event.currentTarget).attr('href').replace('#', '');
var panel = ghmob('[id="' + panelId + '"]');
if (panel.length === 0) return;
ghLog.event('click.ghPanel.triggerPanel');
event.preventDefault();
event.stopPropagation();
ghPanel.triggerPanel(panelId);
});
ghmob(document)
.off('panelcreate.ghPanel create.ghPanel')
.on('panelcreate.ghPanel create.ghPanel', ghPanel._selectors.join(), function(event, config) {
ghLog.event('panelcreate.ghPanel');
ghPanel.create(ghmob(event.currentTarget).attr('id'), config);
});
ghmob(document)
.off('panelopen.ghPanel open.ghPanel')
.on('panelopen.ghPanel open.ghPanel', ghPanel._selectors.join(), function(event) {
ghLog.event('panelopen.ghPanel');
ghPanel.triggerPanel(ghmob(event.currentTarget).attr('id'), 'open');
});
ghmob(document)
.off('panelclose.ghPanel close.ghPanel')
.on('panelclose.ghPanel close.ghPanel', ghPanel._selectors.join(), function(event) {
ghLog.event('panelclose.ghPanel');
ghPanel.triggerPanel(ghmob(event.currentTarget).attr('id'), 'close');
});
ghmob(document)
.off('toggle.ghPanel')
.on('toggle.ghPanel', ghPanel._selectors.join(), function(event) {
ghLog.event('toggle.ghPanel');
ghPanel.triggerPanel(ghmob(event.currentTarget).attr('id'));
});
if (ghConfig.panel && ghConfig.panel.swipeClose) {
ghmob(document)
.off('swipeleft.ghPanel swiperight.ghPanel')
.on('swipeleft.ghPanel swiperight.ghPanel', '.ui-page', function(event) {
ghLog.event('swipeleft.ghPanel swiperight.ghPanel');
var thisWindow = ghPanel._getPanelWindow();
var activePanel = ghmob('.ui-panel.ui-panel-open', thisWindow.document);
if (activePanel.length === 0) return;
var panelId = activePanel.attr('id');
var panelPosition = ghPanel._getPanelPosition(activePanel.attr('id'));
if (event.type === 'swipeleft' && panelPosition === 'left') {
thisWindow.ghPanel.triggerPanel(panelId, 'close');
}
if (event.type === 'swiperight' && panelPosition === 'right') {
thisWindow.ghPanel.triggerPanel(panelId, 'close');
}
});
}
if (ghConfig.panel && ghConfig.panel.dismissable) {
ghmob(window)
.off('click.ghPanel.windowClick')
.on('click.ghPanel.windowClick', function(event) {
ghLog.event('click.ghPanel.windowClick');
var thisWindow = ghPanel._getPanelWindow();
var activePanel = ghmob('.ui-panel.ui-panel-open', thisWindow.document);
if (activePanel.length === 0 || ghmob(event.target).is('.ui-panel') || ghmob(event.target).parents('.ui-panel').length > 0 || ghmob(event.target).parents('.ui-header[role="banner"]').length > 0) return;
var panelId = activePanel.attr('id');
thisWindow.ghPanel.triggerPanel(panelId, 'close');
thisWindow.ghPage._panelScrollOriginal();
});
}
},
/**
* cleanup
*
* @private
* @param {string} id
* @returns {void}
*/
_cleanup: function(id) {
var panels = ghmob('[id="' + id + '"]');
if (typeof id === 'undefined') {
panels = this._getPanels();
}
panels.each(function() {
var panel = ghmob(this);
var panelId = ghmob(this).attr('id');
var panelPosition = ghPanel._getPanelPosition(panelId);
if (panels.length > 1 && panelPosition === 'right') {
panel.remove();
return;
}
if (ghConfig.core.useKurogo && panelPosition === 'left') {
panel.attr('data-position', 'right');
}
});
},
/**
* onPageBeforeCreate
*
* @ignore
* @returns {null|void}
*/
onPageBeforeCreate: function() {
if (ghConfig.panel && ghConfig.panel.enabled === false) return;
this._cleanup();
this._jqmPanels();
this.create();
},
/**
* jqmPanels
*
* @private
* @returns {null|void}
*/
_jqmPanels: function() {
ghmob.fn.panel = function(config) {
this.each(function() {
var $this = ghmob(this);
if (config === 'open') {
$this.trigger('panelopen');
}
else if (config === 'close') {
$this.trigger('panelclose');
}
else if (config === 'toggle') {
$this.trigger('toggle');
}
else if (ghmob(document).find($this).length === 0) {
ghPanel.create($this, config);
}
else {
$this.trigger('panelcreate', config);
}
});
};
},
/**
* run
*
* @ignore
* @returns {void}
*/
run: function() {
if (ghConfig.panel && ghConfig.panel.enabled === false) return;
this._eventBindings();
},
};
ghInit.module('ghPanel');
/**
* ghPopup
*
* @module popup
* @config enabled [true, false]
*
* @trigger popupcreate
* @trigger popupopen
* @trigger popupclose
*/
var ghPopup = ghPopup || {
/**
* selectors
*
* @private
* @type {string}
*/
_selectors: ['[data-role="popup"]'],
/**
* create
*
* @param {jQuery} selector
* @param {obj} [config]
* @param {string} [config.id]
* @returns {jQuery} selector
*/
create: function(selector, config) {
selector = ghmob(selector);
ghmob.each(selector, function() {
var content = ghmob(this);
var contentId = content.attr('id');
if (typeof contentId === 'undefined') {
contentId = 'popup' + (ghmob('.ui-popup').length + 1).toString();
content.attr('id', contentId).attr('data-id', contentId);
}
if (typeof config !== 'undefined' && typeof config.id !== 'undefined') {
content.attr('data-id', config.id);
}
var popupId = contentId + '-popup';
var popupScreenId = contentId + '-screen';
var popup = ghmob('[id="' + popupId + '"]');
var popupScreen = ghmob('[id="' + popupScreenId + '"]');
var popupContainer = ghmob('<div class="ui-popup-container ui-popup-hidden" id="' + popupId + '" aria-hidden="true"></div>');
var popupScreenContainer = ghmob('<div class="ui-popup-screen ui-screen-hidden in" id="' + popupScreenId + '" role="button" aria-label="Close"></div>');
if (popupScreen.length === 0) {
popupScreenContainer.appendTo(ghmob('.ui-page'));
}
if (popup.length === 0) {
popupContainer.appendTo(ghmob('.ui-page'));
popup = ghmob('[id="' + popupId + '"]');
}
else if (content.parents('.ui-popup-container').length === 0) {
popup.html('');
}
content.addClass('ui-popup').removeClass('gh-hidden').attr('data-role', 'popup').appendTo(popup);
content.trigger('popupcreate');
});
return selector;
},
/**
* triggerPopup
*
* @param {jQuery} popup
* @param {string} [eventType]
* @returns {null|void}
*/
triggerPopup: function(popup, eventType) {
popup = ghmob(popup);
if (popup.length === 0) return;
var popupContainer = popup.closest('.ui-popup-container');
var popupScreenId = popup.attr('id') + '-screen';
var popupScreen = ghmob('[id="' + popupScreenId + '"]');
var isPopupOpen = popupContainer.hasClass('ui-popup-active');
var activePopups = ghmob('.ui-popup-active');
if (activePopups.length > 0) {
activePopups.each(function() {
var thisActivePopup = ghmob(this).find('> .ui-popup');
if (thisActivePopup.is(popup)) return;
ghPopup.triggerPopup(thisActivePopup, 'close');
});
}
if (eventType === 'close' || (typeof eventType === 'undefined' && isPopupOpen === true)) {
if (ghPage.isTargetContent()) {
ghmob('body', ghUtils.getWinTop().document).removeClass('gh-popup-active');
}
ghmob('body').removeClass('gh-popup-active');
popupScreen.addClass('ui-screen-hidden');
popupContainer.removeClass('ui-popup-active').addClass('ui-popup-hidden').attr('aria-hidden', 'true');
ghModal._batchAccessibilityHooks();
popup.trigger('popupafterclose');
}
if (eventType === 'open' || (typeof eventType === 'undefined' && isPopupOpen === false)) {
if (ghPage.isTargetContent()) {
ghmob('body', ghUtils.getWinTop().document).addClass('gh-popup-active');
}
ghmob('body').addClass('gh-popup-active');
popupScreen.removeClass('ui-screen-hidden');
popupContainer.addClass('ui-popup-active').removeClass('ui-popup-hidden').attr('aria-hidden', 'false');
ghModal._batchAccessibilityHooks(true);
ghUtils.delay(function() {
ghModal._batchAccessibilityHooks(true);
}, 500);
popup.trigger('popupafteropen');
}
},
/**
* _eventBindings
*
* @private
* @returns {void}
*/
_eventBindings: function() {
ghmob(document)
.off('click.ghPopup.popupOpen')
.on('click.ghPopup.popupOpen', 'a[href][data-rel="popup"]', function(event) {
ghLog.event('click.ghPopup.popupOpen');
var popupId = ghmob(event.currentTarget).attr('href');
if (popupId.charAt(0) === '#') {
popupId = popupId.slice(1);
}
var popup = ghmob('[id="' + popupId + '"]');
if (popup.length === 0) return;
ghLog.event('click.ghPopup.popupOpen');
event.preventDefault();
event.stopPropagation();
popup.trigger('popupopen');
});
ghmob(document)
.off('popupopen.ghPopup open.ghPopup')
.on('popupopen.ghPopup open.ghPopup', ghPopup._selectors.join(), function(event) {
ghLog.event('popupopen.ghPopup open.ghPopup');
ghPopup.triggerPopup(ghmob(event.currentTarget), 'open');
});
ghmob(document)
.off('popupclose.ghPopup close.ghPopup')
.on('popupclose.ghPopup close.ghPopup', ghPopup._selectors.join(), function(event) {
ghLog.event('popupclose.ghPopup close.ghPopup');
ghPopup.triggerPopup(ghmob(event.currentTarget), 'close');
});
ghmob(document)
.off('click.ghPopup.popupClose')
.on('click.ghPopup.popupClose', '.ui-popup-screen, .ui-popup-close', function(event) {
ghLog.event('click.ghPopup.popupClose');
var activePopup = ghmob('.ui-popup-active');
if (typeof activePopup === 'undefined' || activePopup.length === 0) return;
event.preventDefault();
event.stopPropagation();
activePopup.find('> .ui-popup').trigger('popupclose');
});
},
/**
* onPageBeforeCreate
*
* @ignore
* @returns {null|void}
*/
onPageBeforeCreate: function() {
if (typeof ghConfig.popup !== 'undefined' && ghConfig.popup.enabled === false) return;
this._jqmPopup();
},
/**
* jqmPopup
*
* @private
* @returns {null|void}
*/
_jqmPopup: function() {
ghmob.fn.popup = function(config) {
this.each(function() {
var $this = ghmob(this);
if ($this.is('div') === false) return;
$this.attr('data-role', 'popup');
if (config === 'open') {
$this.trigger('popupopen');
}
else if (config === 'close') {
$this.trigger('popupclose');
}
else {
ghPopup.create($this, config);
}
});
return this;
};
},
/**
* init
*
* @private
* @param {jQuery} scope
* @returns {void}
*/
_init: function(scope) {
ghmob('a[href][data-rel="popup"]', scope).each(function() {
var popupId = ghmob(this).attr('href');
if (popupId.charAt(0) === '#') {
popupId = popupId.slice(1);
}
var popup = ghmob('[id="' + popupId + '"]');
ghPopup.create(popup);
});
},
/**
* extendMobiScroll
*
* @private
* @returns {void}
*/
_extendMobiScroll: function() {
ghmob.extend(mobiscroll.settings, {
onClose: function() {
ghPopup.triggerPopup(ghmob('[role="dialog"][class*="mbsc-"]'), 'close');
},
onShow: function() {
ghmob('[role="dialog"][class*="mbsc-"]').attr('data-role', 'popup').removeAttr('tabindex').find('.mbsc-fr-hdr').first().addClass('ui-header').attr('aria-live', 'assertive');
ghPopup.triggerPopup(ghmob('[role="dialog"][class*="mbsc-"]'), 'open');
},
});
},
/**
* run
*
* @ignore
* @param {jQuery} [scope]
* @returns {void}
*/
run: function(scope) {
scope = (scope) ? scope : ghmob(document);
if (typeof ghConfig.popup !== 'undefined' && ghConfig.popup.enabled === false) return;
this._eventBindings();
this._init(scope);
this._extendMobiScroll();
},
};
ghInit.module('ghPopup');
/**
* ghSearch
* Format search pages
*
* @module search
* @config enabled [true, false]
*/
var ghSearch = ghSearch || {
/**
* createFooterButtons
*
* @private
* @returns {void}
*/
_createFooterButtons: function() {
ghContainer.footer(ghmob('[id="' + ghPage.getWin() + 'divSEARCHADV"]'), ghmob('[id="#ICSearch"]'));
ghContainer.footer(ghmob('[id="' + ghPage.getWin() + 'divSEARCHADV"]'), ghmob('[name="#ICClear"]'));
ghContainer.footer(ghmob('[id="' + ghPage.getWin() + 'divSEARCHADV"]'), ghmob('[name="#ICBasicSearch"]'));
ghContainer.footer(ghmob('[id="' + ghPage.getWin() + 'divSEARCHADV"]'), ghmob('[name="#ICAdvSearch"]'));
ghContainer.footer(ghmob('[id="' + ghPage.getWin() + 'divSEARCHADV"]'), ghmob('[name="#ICSaveSearch"]'));
ghContainer.footer(ghmob('[id="' + ghPage.getWin() + 'divSEARCHADV"]'), ghmob('[name="#ICDeleteSearch"]'));
},
/**
* formatOptions
*
* @private
* @returns {void}
*/
_formatOptions: function() {
var searchOptions = ghmob('[id="' + ghPage.getWin() + 'divSEARCHABOVE"], [id="' + ghPage.getWin() + 'divSEARCHADV"], [id="' + ghPage.getWin() + 'divSEARCHBELOW"]');
searchOptions.find('br').remove();
searchOptions.find('.PSSRCHCHECKBOX').removeClass('PSSRCHCHECKBOX');
searchOptions.find('table').attr('data-gh-enhanced', 'false');
ghContainer.create(searchOptions, 'Search Options');
searchOptions.find('input[type="text"], select').not('[id*="$op"]').each(function() {
var thisLabel = ghmob('label[for="' + ghmob(this).attr('id') + '"]');
var thisLabelWrapper = ghmob('[id*="' + ghmob(this).attr('id') + 'lbl' + '"]');
if (thisLabelWrapper.length === 0) return;
thisLabel.html(thisLabel.text().trim());
thisLabel.prependTo(thisLabelWrapper);
});
searchOptions.find('select[id*="$op"]').each(function() {
var thisId = ghmob(this).attr('id');
var thisLabel = ghmob('label[for="' + thisId + '"]');
var thisRowInputId = ghmob(this).closest('tr').find('input[type="text"], select').not('[id*="$op"]').first().attr('id');
var thisRowLabel = ghmob('label[for="' + thisRowInputId + '"]').first();
var thisRowLabelText = '';
if (thisRowLabel.length > 0) {
thisRowLabelText = thisRowLabel.text().trim();
}
var thisLabelText = thisRowLabelText + ' should:';
if (thisLabel.length === 0) {
ghmob(this).closest('.gh-select, .ui-select').before('<label for="' + thisId + '" class="visually-hidden">' + thisLabelText + '</label>');
thisLabel = ghmob('label[for="' + thisId + '"]');
}
else {
thisLabel.html(thisLabel.text().trim());
thisLabel.insertBefore(ghmob(this).closest('.gh-select, .ui-select'));
}
ghmob(this).closest('td').find('label').not(thisLabel).remove();
});
},
/**
* formatResults
*
* @private
* @returns {void}
*/
_formatResults: function() {
ghmob('.PSSRCHRESULTSTITLE span[style*="font"]:contains(" of ")').addClass('PSGRIDCOUNTER');
ghTable.pagerCreate(ghmob('.PTSRCHRESULTS'), ghmob('.PSSRCHRESULTSTITLE'));
ghTable.pagerCreate(ghmob('.PSSRCHRESULTSWBO'), ghmob('.PSSRCHRESULTSTITLE'));
var results = ghmob('[id="' + ghPage.getWin() + 'divSEARCHRESULT"]');
var resultsHeader = results.find('.PSSRCHSUBTITLE').first();
if (resultsHeader.length === 0) {
resultsHeader = 'Search Results';
}
ghContainer.create(results, resultsHeader);
ghmob('.PSSRCHINSTRUCTIONS').wrap('<div class="alert alert-warning">');
ghUtils.delay(function() {
ghTable.cleanReflow(ghmob('#PTSRCHRESULTS'));
ghTable.tablesaw(ghmob('#PTSRCHRESULTS'));
});
},
/**
* createHeader
*
* @private
* @returns {void}
*/
_createHeader: function() {
var headings = [
[(ghmob('.PSSRCHTITLE').length === 0) ? 'Search' : ghmob('.PSSRCHTITLE').text()],
];
ghHeader.addHeadings(headings, false);
},
/**
* formatInstructions
*
* @private
* @returns {void}
*/
_formatInstructions: function() {
if (ghmob('.gh-instructions').length > 0) return;
ghmob('.PAPAGEINSTRUCTIONS').insertBefore(ghmob('[id*="' + ghPage.getWin() + 'divSEARCHADV"]')).wrap('<div class="alert alert-info gh-instructions">');
},
/**
* tabs
*
* @private
* @returns {void}
*/
_createTabs: function() {
if (ghmob('.gh-tabs').length > 0) return;
var tabs = ghmob(ghSubmenu.pageTabSelectors.join()).addClass('gh-hidden').attr('aria-hidden', 'true').first().find('span, a');
ghmob.each(tabs, function() {
var tab = ghmob('<div><span></span></div>');
if (ghmob(this).attr('aria-current') === 'page' || ghmob(this).hasClass('ui-btn-active') || (ghmob(this).is('a') === false && ghmob(this).parents('a').length === 0)) {
tab.find('> span').append(ghmob(this).text().trim());
}
else {
tab.find('> span').append(ghmob('<div />').html(ghmob(this).clone()).html());
}
ghInterface.linksToTabs(tab.closest('div'));
});
},
/**
* cleanup
*
* @private
* @returns {void}
*/
_cleanup: function() {
ghmob('.PSSRCHPAGE td[style]').removeAttr('style');
ghUtils.removeEmpty('br');
ghmob('input[style]').removeAttr('style');
ghmob('#jqm_main_page [id^=win][id$=divSEARCHADV] td > label').each(function() {
if (ghmob(this).parent().children().length > 1) return;
ghmob(this).css({width: '100%'});
});
ghUtils.delay(function() {
ghmob('[aria-describedby=PSSEARCHDROPDOWN_OP]').closest(ghmob('[data-pnlfldid]')).insertAfter(ghmob('#PSSEARCHDROPDOWN_OP'));
}, 100);
},
/**
* run
*
* @ignore
* @returns {null|void}
*/
run: function() {
if ((typeof ghConfig.search !== 'undefined' && ghConfig.search.enabled === false) || ghPage.isSearch() === false || ghPage.isIFrameModal() === true) return;
this._createFooterButtons();
this._formatOptions();
this._formatResults();
this._createHeader();
this._formatInstructions();
this._createTabs();
},
};
ghInit.module('ghSearch');
/**
* ghRouting
* Provides functions for formatting the approval chain
*
* @module routing
* @owner Jennifer Goncalves
* @config enabled [true, false]
*/
var ghRouting = ghRouting || {
/**
* initCollapsibles
*
* @private
* @param {jQuery} routing
* @returns {void}
*/
_initCollapsibles: function(routing) {
var routingCollapsible = routing.find('[class*="awThreadBoxHeader"]');
routingCollapsible.each(function() {
// wrapper
var wrapper = ghmob(this).parents('table').first();
if (wrapper.parents('.gh-routing').length === 0) {
wrapper.wrapAll('<div class="gh-routing"></div>');
}
wrapper = wrapper.parents('.gh-routing').first();
// insert approver
var addBtn = wrapper.find('img[alt="Insert Approver"]').closest('a');
ghContainer.footer(wrapper, addBtn, { color: 'success', icon: { className: 'fa fa-plus' }});
// config
var toolbar = ghmob(this).find('.awSMThreadToolbar').addClass('gh-hidden').find('a').first();
var collapsibleConfig = {};
if (toolbar.length > 0) {
collapsibleConfig.button = {
icon: (toolbar.find('.fa').length > 0) ? toolbar.find('.fa').attr('class') : 'fa fa-info-circle',
label: toolbar.text().trim(),
selector: toolbar,
};
}
if (ghmob(this).attr('class').indexOf('Expanded') > -1) {
collapsibleConfig.collapsed = false;
}
ghContainer.createCollapsible(wrapper, ghmob(this).find('.awThreadBoxTitle').first(), collapsibleConfig);
});
routing.find('.awThreadCommentsHeader').each(function() {
var collapsed = true;
if (ghmob(this).find('img[src*="COLLAPSE"], [data-gh-replace*="COLLAPSE"]').length > 0) {
collapsed = false;
}
ghmob(this).addClass('awThreadBoxTitle');
ghContainer.createCollapsible(ghmob(this).parents('table').first(), ghmob(this), { collapsed: collapsed });
});
},
/**
* initContainers
*
* @private
* @param {jQuery} routing
* @returns {void}
*/
_initContainers: function(routing) {
var routingContainers = routing.find('[class*="awStatusNode"]').not('[class*="Header"]');
routingContainers.each(function() {
var containerConfig = {};
if (ghmob(this).attr('class').indexOf('NotRouted') > -1 || ghmob(this).attr('class').indexOf('Initiated') > -1 || ghmob(this).attr('class').indexOf('Information') > -1) {
containerConfig.color = 'info';
}
else if (ghmob(this).attr('class').indexOf('Approved') > -1 || ghmob(this).attr('class').indexOf('Completed') > -1) {
containerConfig.color = 'success';
}
else if (ghmob(this).attr('class').indexOf('Pending') > -1 || ghmob(this).attr('class').indexOf('Suspended') > -1 || ghmob(this).attr('class').indexOf('Hold')) {
containerConfig.color = 'warning';
}
else if (ghmob(this).attr('class').indexOf('Denied') > -1 || ghmob(this).attr('class').indexOf('Terminated') > -1) {
containerConfig.color = 'danger';
}
var containerIcon = ghmob(this).find('.fa');
if (containerIcon.length > 0) {
containerIcon.first().closest('td').addClass('gh-hidden');
containerConfig.icon = {
className: containerIcon.first().attr('class'),
};
}
ghContainer.create(ghmob(this), ghmob(this).find('[class*="awStatusNodeHeader"]').first(), containerConfig);
});
},
/**
* init
*
* @private
* @param {string} ghPageFieldName
* @returns {void}
*/
_init: function(ghPageFieldName) {
var routing = ghPage.getField(ghPageFieldName, 1);
var routingHeader = routing.find('.awStageLabel');
if (routing.length === 0) return;
// main container
ghContainer.create(routing, routingHeader);
// collapsibles
this._initCollapsibles(routing);
ghUtils.delay(function() {
ghRouting._initCollapsibles(routing);
}, 100);
// containers
this._initContainers(routing);
ghUtils.delay(function() {
ghRouting._initContainers(routing);
}, 100);
// cleanup
routing.find('[style]').removeAttr('style');
ghUtils.removeEmpty(routing.find('td'));
},
/**
* eventBindings
*
* @private
* @param {string} ghPageFieldName
* @returns {void}
*/
_eventBindings: function(ghPageFieldName) {
ghmob(document)
.off('click.ghRouting')
.on('click.ghRouting', ghPage.getField(ghPageFieldName, 1).find('.ui-collapsible-heading-toggle'), function() {
var collapsible = ghmob(this).closest('.ui-collapsible');
var trigger = collapsible.find('img[src*="COLLAPSE"], img[src*="EXPAND"], [data-gh-replace*="COLLAPSE"], [data-gh-replace*="EXPAND"]').first().closest('a');
var triggerAction = trigger.attr('href');
if (trigger.length === 0 || typeof triggerAction === 'undefined') return;
eval(triggerAction);
});
},
/**
* checkPageField
*
* @private
* @returns {string} ghPageFieldName
*/
_checkPageField: function() {
var ghPageFieldNames = ['HCSC_MON_SBP', 'EOAW_MON_SBP'];
for (var i = 0; i < ghPageFieldNames.length; i++) {
var ghPageFieldName = ghPageFieldNames[i];
if (ghPage.getField(ghPageFieldName, 1).length > 0) {
return ghPageFieldName;
}
}
},
/**
* fixDOM
*
* @private
* @returns {void}
*/
_fixDOM: function() {
// replace arrow
if (ghmob('.ui-collapsible-content img[src*="PT_ARROWHEAD"]').length > 0) {
ghmob('.ui-collapsible-content img[src*="PT_ARROWHEAD"]').parent().addClass('fa fa-arrow-down downArow');
}
// fix old and new stat alignments
if (ghPage.getName() === 'FE_MARITAL_STS') {
var dateLbl = ghmob('[for^="FE_MARITAL_DAT_ACTION_DT_SS"]:eq(0)').text();
var dateVal = ghmob('[id^="FE_MARITAL_DAT_ACTION_DT_SS"]:eq(0)').text();
var newStatLbl = ghmob('#FE_MARITAL_DAT_MAR_STATUS').closest('tr').next().find('.PSEDITBOXLABEL').text();
var newStat = ghmob('#FE_MARITAL_DAT_MAR_STATUS').text();
var oldStatLbl = ghmob('#PERS_DATA_EFFDT_MAR_STATUS').closest('tr').next().find('.PSEDITBOXLABEL').text();
var oldStat = ghmob('#PERS_DATA_EFFDT_MAR_STATUS').text();
var newDOM =
'<div data-role="fieldcontain" class="ui-field-contain"><label class="ui-input-text">' + dateLbl + '</label><span class="PSEDITBOX_DISPONLY">' + dateVal + '</span></div>' +
'<div data-role="fieldcontain" class="ui-field-contain"><label class="ui-input-text">' + newStatLbl + '</label><span class="PSEDITBOX_DISPONLY">' + newStat + '</span></div>' +
'<div data-role="fieldcontain" class="ui-field-contain"><label class="ui-input-text">' + oldStatLbl + '</label><span class="PSEDITBOX_DISPONLY">' + oldStat + '</span></div>';
ghmob('#ACE_DERIVED_FE_SPACING').addClass('gh-hidden');
ghmob('#win0divDERIVED_FE_SPACING').append(newDOM);
}
},
/**
* run
* Formats the approval chain
*
* @ignore
* @returns {null|void}
*/
run: function() {
var ghPageFieldName = this._checkPageField();
if (ghConfig.routing.enabled === false || ghPage.getName() === 'EX_SHEET_ENTRY' || ghPage.getField(ghPageFieldName, 1).length === 0) return;
this._eventBindings(ghPageFieldName);
this._init(ghPageFieldName);
this._fixDOM();
},
};
ghInit.module('ghRouting');
/**
* ghActivityGuide
*
* @module activityGuide
* @config enabled [true, false]
*/
var ghActivityGuide = ghActivityGuide || {
/**
* _buttonConfig
*
* @private
* @type {array}
*/
_buttonConfig: [
{
config: {
icon: {
className: 'fa fa-angle-left',
},
},
selector: '.PTCPAGPREVIOUSANCHOR',
text: 'Previous Step',
},
{
config: {
icon: {
className: 'fa fa-angle-right',
},
},
selector: '.PTCPAGNEXTANCHOR',
text: 'Next Step',
},
{
config: {
icon: {
className: 'fa fa-check',
},
},
selector: '[id="ptaiDivMarkComplete"] > a',
},
{
config: {
icon: {
className: 'fa fa-times',
},
},
selector: '[id="ptaiDivXExitAG"] > a',
text: 'Exit Guide',
},
{
config: {
icon: {
className: 'fa fa-times',
},
},
selector: '[id="ptaiDivCancelAG"] > a',
},
{
config: {
icon: {
className: 'fa fa-save',
},
},
selector: '[id="ptaiDivExitAG"] > a',
},
],
/**
* _buttons
*
* @private
* @returns {void}
*/
_buttons: function() {
ghmob('[id="ptailistbuttonstbl"]', ghUtils.getWinTop().document).attr('role', 'presentation').removeAttr('style').find('[style]').removeAttr('style');
ghmob('[id="ptailistbuttonstbl"]', ghUtils.getWinTop().document).find('input[type="button"]').removeAttr('alt title');
ghmob.each(ghActivityGuide._buttonConfig, function(i) {
var button = ghmob(ghActivityGuide._buttonConfig[i].selector, ghUtils.getWinTop().document);
var config = ghActivityGuide._buttonConfig[i].config;
if (button.find('.fa').length === 0) {
button.prepend('<i class="' + config.icon.className + '" aria-hidden="true" />');
}
if (typeof ghActivityGuide._buttonConfig[i].text !== 'undefined') {
button.find('input[type="button"]').attr('value', ghActivityGuide._buttonConfig[i].text);
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
ghUtils.delay(function() {
ghPage._targetContentHeight();
}, 1);
},
/**
* _progressBar
*
* @private
* @returns {void}
*/
_progressBar: function() {
var selector = ghmob('[id="PTAIPBDIV"]');
var complete = selector.find('.PTAIProgressBarComplete[style]');
if (complete.length === 0 || selector.length === 0) return;
complete = complete.attr('style').replace('width:', '').replace('%', '');
selector.attr('tabindex', '0').attr('role', 'progressbar').attr('aria-valuenow', complete).attr('aria-valuemin', '0').attr('aria-valuemax', '100').attr('aria-valuetext', selector.attr('title'));
selector.children().attr('aria-hidden', 'true');
},
/**
* _navigation
*
* @private
* @returns {void}
*/
_navigation: function() {
var selector = ghmob('[id="PTAIAccordion"]');
selector.attr('role', 'navigation').attr('aria-label', 'Activity Guide Menu');
selector.find('li').each(function() {
var link = ghmob(this).find('a').first();
link.removeAttr('title');
if (link.hasClass('PTAIActionItemSelected')) {
link.attr('aria-current', 'page').attr('title', 'current page');
}
if (ghmob(this).find('.PTAIActionItemRequired').length > 0) {
link.attr('title', 'Required');
}
});
},
/**
* _headings
*
* @private
* @returns {void}
*/
_headings: function() {
if (ghPage.isTargetContent() === false) return;
if (ghmob('.gh-page-header-headings h1').text().trim() === ghmob('[id="ptaiagtitle"]', ghUtils.getWinTop().document).text().trim()) {
ghmob('[id="ptaiagtitle"]', ghUtils.getWinTop().document).text('Activity Guide');
}
},
/**
* _eventBindings
*
* @private
* @returns {void}
*/
_eventBindings: function() {
ghmob(document)
.off('gh_agbuttonupdate.ghActivityGuide.buttons')
.on('gh_agbuttonupdate.ghActivityGuide.buttons', function() {
ghLog.event('gh_agbuttonupdate.ghActivityGuide.buttons');
ghActivityGuide._buttons();
});
ghmob(document)
.off('click.ghActivityGuide.taskListLink')
.on('click.ghActivityGuide.taskListLink', '.PTAI_LegendText', function() {
ghLog.event('click.ghActivityGuide.taskListLink');
var legendContent = ghmob('[id="PTAILegendDiv"]', ghUtils.getWinTop().document);
ghUtils.getWinTop().ghModal.popup('Legend', legendContent.html());
toggleDynamicLegendDisplay();
});
ghmob(window)
.off('throttledresize.ghActivityGuide.targetContentHeight ghPageReady.ghActivityGuide.targetContentHeight')
.on('throttledresize.ghActivityGuide.targetContentHeight ghPageReady.ghActivityGuide.targetContentHeight', function() {
ghLog.event('throttledresize.ghActivityGuide.targetContentHeight ghPageReady.ghActivityGuide.targetContentHeight');
ghPage._targetContentHeight();
});
ghmob(document)
.off('click.ghActivityGuide.triggerCollapsible')
.on('click.ghActivityGuide.triggerCollapsible', 'a.PTAIDependentItem, a.PTAIBlockAnchor', function() {
ghLog.event('click.ghActivityGuide.triggerCollapsible');
ghActivityGuide._targetContentHeight();
});
ghmob(document)
.off('click.ghActivityGuide.paginate')
.on('click.ghActivityGuide.paginate', '#ptaisubpage a[class*="PREVIOUS"], #ptaisubpage a[class*="NEXT"], #PTAIAccordion .PTAIActionItem', function() {
ghLog.event('click.ghActivityGuide.paginate');
ghUtils.getWinTop().ghLoader.show();
});
ghmob(document)
.off('pagelet_load.ghActivityGuide')
.on('pagelet_load.ghActivityGuide', function() {
ghLog.event('pagelet_load.ghActivityGuide');
ghActivityGuide._progressBar();
ghActivityGuide._navigation();
});
if (typeof ptalPageletArea !== 'undefined' && typeof ptalPageletArea['real_findpageletspace'] === 'undefined') {
ptalPageletArea['real_findpageletspace'] = ptalPageletArea['findpageletspace'];
ptalPageletArea['wrapped_findpageletspace'] = function() {
ptalPageletArea['real_findpageletspace']();
ghmob(document).trigger('pagelet_load');
};
ptalPageletArea['findpageletspace'] = ptalPageletArea['wrapped_findpageletspace'];
}
},
/**
* _init
*
* @private
* @returns {void}
*/
_init: function() {
ghPage._overrideIframeResizeHeight();
ghPage._targetContentHeight();
ghActivityGuide._headings();
},
/**
* run
*
* @ignore
* @returns {void}
*/
run: function() {
if ((typeof ghConfig.activityGuide !== 'undefined' && ghConfig.activityGuide.enabled === false) || ghPage.isActivityGuide() === false) return;
this._eventBindings();
this._init();
},
};
ghInit.module('ghActivityGuide');
/**
* Includes
*/
ghmob(document).on('pageinit', function() {
// Build choose file dialog
if(ghmob('[name="#ICOrigFileName"]').length && !ghmob('#gh-file-chooser').length) {
// build file chooser
var newFileChooser = ghmob('<div id="gh-file-chooser">Choose File</div>');
ghmob('[name="#ICOrigFileName"]').parent().prepend(newFileChooser);
ghmob('[name="#ICOrigFileName"]').parent().css('height', '35px');
// disable upload button
ghmob('input[value="Upload"]').closest('div').addClass('ui-disabled');
// add hook
ghmob('[name="#ICOrigFileName"]').change(function (){
var fileName = ghmob(this).val();
fileName = fileName.split('\\');
ghmob('#gh-file-chooser').html(fileName[fileName.length-1]);
// enable upload button
ghmob('input[value="Upload"]').closest('div').removeClass('ui-disabled');
});
ghmob('[name="#ICOrigFileName"]').hide();
}
});
ghmob(document)
.off('click.inc.attachment.fileChooser', '#gh-file-chooser')
.on('click.inc.attachment.fileChooser', '#gh-file-chooser', function() {
ghmob('[name="#ICOrigFileName"]').trigger('click');
});/* eslint-disable */
/**
* ghPage
*/
/* client only */
function unbindPage(scope, eventName, pageName, targetPages) {
return ghUtils.alertDeprecated(ghPage.unbind(scope, eventName, pageName, targetPages), 'ghPage.unbind()');
}
/* client only */
function ghScrollY() {
return ghUtils.alertDeprecated(ghPage.setScrollY(), 'ghPage.setScrollY()');
}
/* client only */
function ghSetScrollY() {
return ghUtils.alertDeprecated(ghPage.setScrollYAttr(), 'ghPage.setScrollYAttr()');
}
/**
* ghpagemeta.js
*/
/* client only */
function getComponentName() {
return ghUtils.alertDeprecated(ghPage.getComponentName(), 'ghPage.getComponentName()');
}
/* client only */
function getPageName() {
return ghUtils.alertDeprecated(ghPage.getName(), 'ghPage.getName()');
}
/* VC1965 */
function setPageName(name) {
return ghUtils.alertDeprecated(ghPage.setName(name), 'ghPage.setName()');
}
/* client only */
function setPagePT852() {
return ghUtils.alertDeprecated(ghPage.setNamePT852(), 'ghPage.setNamePT852()');
}
function includeGSData() {
return ghUtils.alertDeprecated(ghPage.includeGSData(), 'ghPage.includeGSData()');
}
/**
* ghUtils
*/
/* client only */
function make_collapsible(group_box_id, header_text, theme) {
return ghUtils.alertDeprecated(ghContainer.createCollapsible(group_box_id, header_text, theme), 'ghContainer.createCollapsible()');
}
/* client only */
function make_collapsible_external_header(group_box_id, header_id, theme) {
return ghUtils.alertDeprecated(ghContainer.createCollapsible(group_box_id, header_id, theme), 'ghContainer.createCollapsible()');
}
/* client only */
function make_container(selector, header_text) {
return ghUtils.alertDeprecated(ghContainer.create(selector, header_text), 'ghContainer.create()');
}
/* client only */
function make_container_from_collapsible(selector) {
return ghUtils.alertDeprecated(ghContainer.createFromCollapsible(selector), 'ghContainer.createFromCollapsible()');
}
/* client only */
function removeEmptyElements(elem){
return ghUtils.alertDeprecated(ghUtils.removeEmpty(elem), 'ghUtils.removeEmpty()');
}
/* client only */
function replacePSIcon(oldimage, newicon){
return ghUtils.alertDeprecated(ghIcons.replaceIcon(oldimage, newicon, ''), 'ghIcons.replaceIcon()');
}
/* client only */
ghUtils.replacePSIcon = function(oldimage, newicon) {
return ghUtils.alertDeprecated(ghIcons.replaceIcon(oldimage, newicon, ''), 'ghIcons.replaceIcon()');
}
/* client only */
ghUtils.replaceIcon = function(oldimage, newicon) {
return ghUtils.alertDeprecated(ghIcons.replaceIcon(oldimage, 'fa ' + newicon, ''), 'ghIcons.replaceIcon()');
}
/* VC1966 */
function keepTogether(divs) {
return ghUtils.alertDeprecated(ghUtils.keepTogether(divs), 'ghUtils.keepTogether()');
}
/* VC1967 */
function moveField(moveFieldSelector, targetFieldSelector, moveBefore) {
return ghUtils.alertDeprecated(ghUtils.moveField(moveFieldSelector, targetFieldSelector, moveBefore, 'td'), 'ghUtils.moveField()');
}
/* VC1967 */
function moveFieldAfter(moveFieldSelector, targetFieldSelector) {
return ghUtils.alertDeprecated(ghUtils.moveFieldAfter(moveFieldSelector, targetFieldSelector, false), 'ghUtils.moveFieldAfter()');
}
/* VC1967 */
function moveFieldBefore(moveFieldSelector, targetFieldSelector) {
return ghUtils.alertDeprecated(ghUtils.moveFieldBefore(moveFieldSelector, targetFieldSelector, true), 'ghUtils.moveFieldBefore()');
}
/* client only */
function pageField(pageName, pageFieldId) {
return ghUtils.alertDeprecated(ghPage.getField(pageName, pageFieldId), 'ghPage.getField()');
}
function pageFieldText(ctx, pageName, pageFieldId) {
return ghUtils.alertDeprecated(ghPage.getFieldText(ctx, pageName, pageFieldId), 'ghPage.getFieldText()');
}
ghUtils.makeCollapsible = function(elem, title, theme, collapsed) {
return ghUtils.alertDeprecated(ghContainer.createCollapsible(elem, title, theme, collapsed), 'ghContainer.createCollapsible()');
}
ghUtils.makeContainer = function(selector, header_text) {
return ghUtils.alertDeprecated(ghContainer.create(selector, header_text), 'ghContainer.create()');
}
ghUtils.makeContainerFromCollapsible = function(selector) {
return ghUtils.alertDeprecated(ghContainer.createFromCollapsible(selector), 'ghContainer.createFromCollapsible()');
}
ghUtils.makeContainerInit = function() {
return ghUtils.alertDeprecated(ghContainer.initializeContainers(), 'ghContainer.initializeContainers()');
}
ghUtils.hideEmpty = function(elem) {
return ghUtils.alertDeprecated(ghUtils.removeEmpty(elem, true), 'ghUtils.removeEmpty(elem, true)');
}
function hideKeyboard() {
return ghUtils.alertDeprecated(ghUtils.hideDeviceKeyboard(), 'ghUtils.hideDeviceKeyboard()');
}
function removeWhiteSpace() {
return ghUtils.alertDeprecated(ghUtils.removeEmpty('div'), 'ghUtils.removeEmpty(elem)');
}
/**
* ghContainer
*/
function getOpenSections() {
return ghUtils.alertDeprecated(ghContainer.getOpenCollapsibles(), 'ghContainer.getOpenCollapsibles()');
}
function expandRequiredCollapsibles(scope) {
return ghUtils.alertDeprecated(ghContainer.expandRequiredCollapsibles(scope), 'ghContainer.expandRequiredCollapsibles()');
}
function moveContentIntoCollapsible(pageName, fieldId, contentId) {
return ghUtils.alertDeprecated(ghContainer.moveContentIntoCollapsible(pageName, fieldId, contentId), 'ghContainer.moveContentIntoCollapsible()');
}
/**
* ghFooter
*/
function appendFooterBtn(item) {
return ghUtils.alertDeprecated(ghFooter.addItem(item), 'ghFooter.addItem()');
}
function footerAfterCreate() {
console.warn('footerAfterCreate() is no longer required to run. Please remove the reference');
console.trace();
return;
}
ghFooter.appendFooterBtn = function(item, icon) {
return ghUtils.alertDeprecated(ghFooter.addItem(item, icon), 'ghFooter.addItem()');
}
ghFooter.createFooter = function() {
return ghUtils.alertDeprecated(ghFooter.create(), 'ghFooter.create()');
}
ghFooter.footerAfterCreate = function() {
console.warn('ghFooter.footerAfterCreate() is no longer required to run. Please remove the reference');
console.trace();
return;
}
/**
* ghTilesNavigation
*/
function createTileFromButton(item, args) {
return ghUtils.alertDeprecated(ghTilesNavigation.createTileFromButton(item, args), 'ghTilesNavigation.createTileFromButton()');
}
function createTileFromLink(args) {
return ghUtils.alertDeprecated(ghTilesNavigation.createTileFromLink(args), 'ghTilesNavigation.createTileFromLink()');
}
function createTileFromContainer(item, args) {
return ghUtils.alertDeprecated(ghTilesNavigation.createTileFromContainer(item, args), 'ghTilesNavigation.createTileFromContainer()');
}
/**
* ghSubmenu
*/
function tabsToSubmenu(selector, action) {
return ghUtils.alertDeprecated(ghSubmenu.pageTabs(selector), 'ghSubmenu.pageTabs()');
}
function psTabsToSubmenu(selector) {
return ghUtils.alertDeprecated(ghSubmenu.tableTabs(selector), 'ghSubmenu.tableTabs()');
}
function makeSubmenu(i, action, type) {
return ghUtils.alertDeprecated(ghSubmenu.create(i, type), 'ghSubmenu.create()');
}
/**
* ghTable
*/
function cleanReflowTablesInit() {
return ghUtils.alertDeprecated(ghTable.cleanInit(), 'ghTable.cleanInit()');
}
ghTable.cleanReflowInit = function() {
return ghUtils.alertDeprecated(ghTable.cleanInit(), 'ghTable.cleanInit()');
}
function cleanReflowTables(selector) {
return ghUtils.alertDeprecated(ghTable.cleanReflow(selector), 'ghTable.cleanReflow()');
}
function fixScrollGrids(selector, makeCollapsible) {
return ghUtils.alertDeprecated(ghTable.cleanScroll(selector, makeCollapsible), 'ghTable.cleanScroll()');
}
function ghGridPagerInit() {
return ghUtils.alertDeprecated(ghTable.pagerInit(), 'ghTable.pagerInit()');
}
function ghGridPager(grid, pager, showMore) {
return ghUtils.alertDeprecated(ghTable.pagerCreate(grid, pager), 'ghTable.pagerCreate()');
}
function ghApplyTablesaw(grid) {
return ghUtils.alertDeprecated(ghTable.tablesaw(grid), 'ghTable.tablesaw()');
}
function ghSelectAllGridToggle() {
return ghUtils.alertDeprecated(ghTable.selectAll(), 'ghTable.selectAll()');
}
function removeColumnHeader(table_selector, pos) {
return ghUtils.alertDeprecated(ghTable.removeColumnHeader(table_selector, pos), 'ghTable.removeColumnHeader()');
}
function hideGridColumn(pageName, pageFieldID) {
return ghUtils.alertDeprecated(ghTable.hideGridColumn(pageName, pageFieldID), 'ghTable.hideGridColumn()');
}
/**
* ghInterface
*/
function ghRadiosToTabs(selector) {
return ghUtils.alertDeprecated(ghInterface.radiosToTabs(selector), 'ghInterface.radiosToTabs()');
}
function scrapeDefinedSizes() {
return ghUtils.alertDeprecated(ghInterface.scrapeDefinedSizes(), 'ghInterface.scrapeDefinedSizes()');
}
ghInterface.nativeDateTime = function() {
return ghUtils.alertDeprecated(ghForm.nativeDateTime(), 'ghForm._nativeDateTime()');
}
ghInterface.pageletLinksToListview = function() {
console.warn('ghInterface.pageletLinksToListview() is no longer required to run. Please remove the reference');
console.trace();
return;
}
/**
* ghHeader
*/
function ghPageHeaderLinkInit() {
return ghUtils.alertDeprecated(ghHeader.pageHeaderLinks(), 'ghHeader.pageHeaderLinks()');
}
function ghPageHeaderLink(selector, link) {
return ghUtils.alertDeprecated(ghHeader.appendHeaderLink(selector, link), 'ghHeader.appendHeaderLink(selector, link)');
}
function ghPageHeader(selectors, append) {
return ghUtils.alertDeprecated(ghHeader.pageHeader(selectors, append), 'ghHeader.pageHeader(selectors, append)');
}
function makePageHeader(headings) {
return ghUtils.alertDeprecated(ghHeader.pageHeaderWrapper(headings), 'ghHeader.pageHeaderWrapper(headings)');
}
function makePageHeaderHeadings(ghPageHeaders, append) {
return ghUtils.alertDeprecated(ghHeader.addHeadings(ghPageHeaders, false), 'ghHeader.addHeadings(ghPageHeaders, append)');
}
function makePageHeaderLinks() {
return ghUtils.alertDeprecated(ghHeader.createLinkWrapper(), 'ghHeader.createLinkWrapper()');
}
function formatFixedHeader() {
return ghUtils.alertDeprecated(ghHeader.siteHeader(), 'ghHeader.siteHeader()');
}
function ghUsername() {
return ghUtils.alertDeprecated(ghHeader.formatUsername(), 'ghHeader.formatUsername()');
}
/**
* ghModal
*/
function popup_window_open(url, windowName) {
return ghUtils.alertDeprecated(ghModal.newWindowPopup(url, windowName), 'ghModal.newWindowPopup()');
}
function enhanceSearchDialog() {
return ghUtils.alertDeprecated(ghModal.enhanceSearchDialog(), 'ghModal.enhanceSearchDialog()');
}
function wrapped_enhanceSearchDialog() {
return ghUtils.alertDeprecated(ghModal.enhanceSearchDialog(), 'ghModal.enhanceSearchDialog()');
}
ghModal._processSelectMenus = function() {
return ghUtils.alertDeprecated(ghForm._processSelectMenus(), 'ghForm._processSelectMenus()');
}
/**
* ghForm
*/
function markRequired(scope) {
return ghUtils.alertDeprecated(ghForm._markRequired(scope), 'ghForm._markRequired()');
}
function unenteredRequired(scope) {
return ghUtils.alertDeprecated(ghForm._unenteredRequired(scope), 'ghForm._unenteredRequired()');
}
function processErrors() {
return ghUtils.alertDeprecated(ghForm._processErrors(), 'ghForm._processErrors()');
}
/**
* ghTrigger
*/
window.ghTrigger = {
on: function(eventType, target, event) {
return ghUtils.alertDeprecated(ghmob(document).on(eventType, target, event), 'ghmob(document).on()');
},
};
ghLoader.show();
ghmob(document).trigger('pagebeforecreate');
ghUtils.delay(function pageinit() {
ghmob('body').addClass('appsian-ready');
ghmob(document).trigger('pageinit');
});

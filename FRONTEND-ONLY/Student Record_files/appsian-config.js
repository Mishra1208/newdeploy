
/**
* ghAddConfig
* Updated the PeopleMobile feature configuration
*
* @param obj config
* @param string module
* @returns true
*/
function ghAddConfig(config, module) {
// apply configuration
if(window.ghConfig[module] !== undefined && window.ghConfig[module] !== null) {
// merge configurations
window.ghConfig[module] = ghmob.extend(true, {}, window.ghConfig[module], config);
}
else {
// create configuration
window.ghConfig[module] = config;
}
return true;
}
/**
* ghConfig
* Contains the full PeopleMobile feature configuration
*
* @type obj
*/
window.ghConfig = window.ghConfig || {};
/**
* Core Configuration
*/
ghAddConfig({
logLevel: 'OFF',
embedded: false,
queueLateEvents: false,
extensions: [],
usePSMTop: true,
}, 'core');
/**
* Client Configuration
*/
ghAddConfig({
siteTitle: 'PeopleUX',
}, 'client');
/**
* Page Configuration
*/
ghAddConfig({
handleFieldChanges: false,
language: 'en',
reportIFrameSize: false,
enableZoom: true,
prependSiteTitle: true,
useTypeahead: false,
showPSFrame: false,
}, 'page');
/**
* FieldScoping configuration
*/
ghAddConfig({
enabled: true,
debug: false,
modules: [
'ghAccessibility',
'ghButton',
'ghContainer',
'ghFooter',
'ghForm',
'ghIcons',
'ghInterface',
'ghLegend',
'ghMultistep',
'ghPopup',
'ghTable',
],
}, 'fieldScoping');
/**
* Modal Configuration
*/
ghAddConfig({
enabled: true,
transition: 'none',
defaultPopupTitle: 'Popup',
openLinkInNewWindow: true,
hideErrorCode: true,
}, 'modal');
/**
* Accessibility Configuration
*/
ghAddConfig({
enabled: true,
enableSkipLinks: true,
formatExternalLinks: false,
forceFormAccessibility: true,
enforceFormLabels: true,
enhanceCheckboxRadio: true,
setFocus: true,
}, 'accessibility');
/**
* Icons Configuration
*/
ghAddConfig({
enabled: true,
autoInitialize: true,
inlineAltText: false,
textOnly: false,
hideLegends: false,
}, 'icons');
/**
* GridFormatter Configuration
*/
ghAddConfig({
enabled: true,
tableFormat: false,
showPager: true,
}, 'gridFormatter');
/**
* Navigation and Tiles Configuration
*/
ghAddConfig({
enabled: true,
getDefaultAlerts: false,
tiles: {
breakpoint: 800,
display: 'popup',
responsive: false,
suppressResponsivePopups: true,
},
showSubnav: false,
sequentialSubnav: false,
limitNavByTab: false,
usesFluidNavBar: true,
}, 'navigationTiles');
/**
* Submenu Configuration
*/
ghAddConfig({
action: 'dropdown',
columnToggle: false,
container: {
button: {
icons: {
collapse: 'fa-angle-up',
expand: 'fa-angle-down',
},
label: {
show: false,
text: 'View',
},
},
},
displayOnHomepage: false,
enabled: true,
pageTabs: {
button: {
icons: {
collapse: 'fa-times',
expand: 'fa-bars',
position: 'left',
},
label: {
text: 'Menu',
},
},
menu: {
icons: {
enabled: true,
},
},
responsive: {
enabled: true,
heading: 'In this section',
},
},
sort: {
button: {
icons: {
collapse: 'fa-sort',
expand: 'fa-sort',
position: 'left',
},
label: {
text: 'Sort By',
},
},
},
}, 'submenu');
/**
* Table Configuration
*/
ghAddConfig({
enabled: true,
pagerEnabled: true,
pagerPosition: 'bottom',
pagerShowMore: true,
sorting: true,
sortingIcon: 'fa-sort',
sortingIconDown: 'fa-sort-desc',
sortingIconUp: 'fa-sort-asc',
sortingIconPosition: 'right',
tablesawEnabled: true,
}, 'table');
/**
* Multistep Configuration
*/
ghAddConfig({
enabled: true,
currentStepText: 'You are here:',
multistepToProgressNavigation: true,
}, 'multistep');
/**
* Prompt Configuration
*/
ghAddConfig({
iconAttached: true,
iconStatus: 'show',
inputClick: false,
}, 'prompt');
/**
* Container Configuration
*/
ghAddConfig({
enabled: true,
autoInitialize: true,
}, 'container');
/**
* Interface Configuration
*/
ghAddConfig({
enabled: true,
enhanceButtons: true,
moveRequiredLabel: true,
enableGoto: false,
}, 'interface');
/**
* Loader Configuration
*/
ghAddConfig({
enabled: true,
animate: true,
defaultMessage: 'Loading',
delayPageShow: false,
useCover: false,
usePageTitle: false,
}, 'loader');
/**
* Header Configuration
*/
ghAddConfig({
enabled: true,
favorites: {
enabled: true,
icon: {
off: 'fa-heart',
on: 'fa-heart-o',
},
text: 'Favorites',
},
homeURL: '/psp/' + freemarker.url.siteName + '/' + freemarker.url.portalName + '/' + freemarker.url.nodeName + '/h/?tab=DEFAULT',
logoutIcon: 'fa-power-off',
logoutText: 'Logout',
logoutURL: '/psp/' + freemarker.url.siteName + '/' + freemarker.url.portalName + '/' + freemarker.url.nodeName + '/?cmd=logout&gsmobile=1',
menuIcon: 'fa-bars',
menuText: 'Navigation',
notify: {
enabled: true,
icon: {
off: 'fa-bell',
on: 'fa-bell-o',
},
text: 'Notify',
},
recent: {
enabled: true,
icon: {
off: 'fa-bookmark',
on: 'fa-bookmark-o',
},
text: 'Recent',
},
updatePageHeadings: true,
useSessionHomeURL: true,
}, 'header');
/**
* Attachments Configuration
*/
ghAddConfig({
enabled: false,
deviceText: 'Upload From Device',
cloudText: 'Upload From Cloud Storage',
appKeys: {
dropbox: null,
onedrive: null,
box: null,
},
}, 'attachments');
/**
* Footer Configuration
*/
ghAddConfig({
includeReturnLinks: false,
autoInitialize: true,
}, 'footer');
/**
* Guide Configuration
*/
ghAddConfig({
autoInit: true,
enabled: true,
}, 'guide');
/**
* Log Configuration
*/
ghAddConfig({
useStack: true,
}, 'log');
/**
* Form Configuration
*/
ghAddConfig({
enabled: true,
autoInitialize: true,
nativeTextInput: true,
nativeSelectMenus: true,
nativeCheckboxRadio: true,
disableDatePicker: false,
useCalendarPicker: false,
useISOFormat: true,
flipswitch: false,
}, 'form');
/**
* Term Configuration
*/
ghAddConfig({
rememberTerm: false,
}, 'term');
/**
* Button Configuration
*/
ghAddConfig({
enabled: true,
autoInitialize: true,
}, 'button');
/**
* Panel Configuration
*/
ghAddConfig({
enabled: true,
dismissable: true,
swipeClose: true,
overlay: false,
}, 'panel');
/**
* Popup Configuration
*/
ghAddConfig({
enabled: true,
}, 'popup');
/**
* Pagelet Configuration
*/
ghAddConfig({
forceMobileRequest: true,
}, 'pagelet');
/**
* Search Configuration
*/
ghAddConfig({
enabled: true,
}, 'search');
/**
* Routing Configuration
*/
ghAddConfig({
enabled: true,
}, 'routing');
/**
* Activity Guide Configuration
*/
ghAddConfig({
enabled: true,
}, 'activityGuide');
ghAddConfig({
enabled: true,
debug: true,
}, 'fieldScoping');
/**
* Header Configuration
*/
ghAddConfig({
enabled: true,
logoutIcon: 'fa-power-off',
logoutText: 'Sign Out ',
menuText: 'Sign Out',
}, 'header');
ghAddConfig({
pageTabs: {
responsive: {
enabled: true,
heading: 'In This Section',
},
},
}, 'submenu');
ghAddConfig({
useISOFormat: false,
useCalendarPicker: true,
}, 'form');
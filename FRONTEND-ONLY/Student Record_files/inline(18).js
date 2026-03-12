
if (typeof ptStyleSheet == "undefined") {
ptStyleSheet = 'PSSTYLEDEF_TANGERINE';
}
function onLoadExt_win0() {
modalZoomName = null;
var oWin=window;
var oDoc=document;
ptTAObj_win0.init(oWin,oDoc,oDoc.win0,'/cs/pscsprd/cache_1/PT_SRT2UP_SEL_1.gif','/cs/pscsprd/cache_1/PT_SRT2DN_SEL_1.gif','/cs/pscsprd/cache_1/PT_PORTAL_IC_CLOSE_1.gif',500);

 g_bAccessibilityMode=false;
var actn='';
setKeyEventHandler_win0();ptEvent.add(window,'scroll',positionWAIT_win0);
ptCommonObj2.generateABNSearchResults(document.win0);
getGblSrchPageNum(actn);
if (gSrchRsltPageNum <= 5) getAllRelatedActions();

ptCommonObj2.moveUnivSrchDiv();
if (typeof(HelppopupObj_win0) != 'undefined' && HelppopupObj_win0 != null)
 HelppopupObj_win0.StopPopup('win0');
if (typeof(ptLongEditCounter) != 'undefined' && ptLongEditCounter != null)
   ptLongEditCounter.onLoadLongEditCounter();
ResetGlyph_win0();
if (typeof ptGridObj_win0 != 'undefined' && ptGridObj_win0)
 ptGridObj_win0.clearGridArr();
objToBeFocus = null;
if (bPTDrag) CancelDragAccessible();
 bPTDrag = false;
if (typeof oWin == 'undefined') setEventHandlers_win0('ICFirstAnchor_win0', 'ICLastAnchor_win0', false);
 else
 oWin.setEventHandlers_win0('ICFirstAnchor_win0', 'ICLastAnchor_win0', false);
setFocus_win0('CU_STUDREC_WRK_HTMLAREA',-1);
ptLoadingStatus_empty(0);
setupTimeout2();
processing_win0(0,3000);
ptConsole2.enable();

UpdateBreadCrumbs();
GenerateABN();
GenerateFakeBC();
bcUpdateForPTF();if (typeof(myAppsWindowOpenJS) != 'undefined' && myAppsWindowOpenJS != null && myAppsWindowOpenJS != '')
 {
try {eval(myAppsWindowOpenJS);} catch(e) {}
  myAppsWindowOpenJS=null;
}
ResetGlyph_win0();setPageletInfoInCtxmenu_win0("false");
GetDomData(win0, "TargetContent", "#GetDomInfo");
}
try{ptEvent.load(onLoadExt_win0);}catch(e){}

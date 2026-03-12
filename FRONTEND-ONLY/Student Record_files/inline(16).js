
var nResubmit=0;
var nLastAction=0;
var loader=null;
if (typeof(bCleanHtml) == 'undefined')
	var bCleanHtml = false;
setupTimeout2();
var postUrl_win0='https://campus.concordia.ca/psc/pscsprd/EMPLOYEE/SA/c/CU_SELF_SERVICE.CU_STUDENT_RECORD.GBL';
function aAction_win0(form, id, params, bAjax, bPrompt, sAjaxTrfUrl, bWarning, sScriptAfter, nTrfURLType)
{
setupTimeout2();
if ((id != '#ICSave'))
processing_win0(1,3000);
aAction0_win0(form, id, params, bAjax, bPrompt, sAjaxTrfUrl, bWarning, sScriptAfter, nTrfURLType);
}
function submitAction_win0(form, id, event, sAjaxTrfUrl, bWarning, sScriptAfter, nTrfURLType)
{
setupTimeout2();
if (!ptCommonObj2.isICQryDownload(form, id))
 { processing_win0(1,3000); }
preSubmitProcess_win0(form, id);
var spellcheckpos = id.indexOf('$spellcheck');
if ((spellcheckpos != -1) && (id.indexOf('#KEYA5') != -1))
	form.ICAction.value = id.substring(0,spellcheckpos);
else 
	form.ICAction.value=id;
var actionName = form.ICAction.value;
form.ICXPos.value=ptCommonObj2.getScrollX();
form.ICYPos.value=ptCommonObj2.getScrollY();
bcUpdater.storeBcDomData();
if ((typeof(bAutoSave) != 'undefined') && bAutoSave)
	form.ICAutoSave.value = '1';
if (!ptCommonObj2.isAJAXReq(form, id) && !ptCommonObj2.isPromptReq(id)){
if (nLastAction == 1 && nResubmit > 0) return;
form.ICResubmit.value=nResubmit;
form.submit();
if (!ptCommonObj2.isICQryDownload(form, id))
	nResubmit++;
}
else if (ptCommonObj2.isPromptReq(id))
	pAction_win0(form, id, arguments[2]);
else
	aAction_win0(form, actionName, null, true, false, sAjaxTrfUrl, bWarning, sScriptAfter, nTrfURLType);
cancelBubble(event);
}

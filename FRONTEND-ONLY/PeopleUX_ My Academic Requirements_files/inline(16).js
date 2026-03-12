
var pt_calHeadstyle=" class='PTCALHEAD' "
var pt_calWeekHeadstyle=" class='PTCALWEEKHEAD' "
function dateitemrefs()
{
this.pt_dateheader = "/cs/pscsprd/cache_1/PT_PORTAL_IC_CLOSE_SD_CSS_1.gif";
this.pt_datering = "/cs/pscsprd/cache_1/PT_CURRENT_DATE_SD_CSS_1.gif";
this.pt_datesel = "/cs/pscsprd/cache_1/PT_SELECTED_DATE_SD_CSS_1.gif";
this.pt_nextmonth = "/cs/pscsprd/cache_1/PT_RIGHT_SCROLL_SD_CSS_1.gif";
this.pt_prevmonth= "/cs/pscsprd/cache_1/PT_LEFT_SCROLL_SD_CSS_1.gif";
this.pt_daystitle_hijri = "/cs/pscsprd/cache_1/PT_DATE_TITLE_S6_1.GIF";
this.pt_daystitle_thai = "/cs/pscsprd/cache_1/PT_DATE_TITLE_S0_1.GIF";
this.pt_daystitle_s0 = "/cs/pscsprd/cache_1/PT_DATE_TITLE_S0_1.GIF";
this.pt_daystitle_m1 = "/cs/pscsprd/cache_1/PT_DATE_TITLE_M1_1.GIF";
this.pt_daystitle_t2 = "/cs/pscsprd/cache_1/PT_DATE_TITLE_T2_1.GIF";
this.pt_daystitle_w3 = "/cs/pscsprd/cache_1/PT_DATE_TITLE_W3_1.GIF";
this.pt_daystitle_t4 = "/cs/pscsprd/cache_1/PT_DATE_TITLE_T4_1.GIF";
this.pt_daystitle_f5 = "/cs/pscsprd/cache_1/PT_DATE_TITLE_F5_1.gif";
this.pt_daystitle_s6 = "/cs/pscsprd/cache_1/PT_DATE_TITLE_S6_1.GIF";
}
 
function LoadCalendar()
{
var dateitems = new dateitemrefs();
loadImages(dateitems);
}
function DatePrompt0_win0(dtfield,promptfield,yrfmt,bsubmit)
{
setupTimeout2();
openDate_win0(dtfield, promptfield, "MDY/"+yrfmt,bsubmit,"G",0);
}

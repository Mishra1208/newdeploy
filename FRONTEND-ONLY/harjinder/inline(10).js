
function switch_view() {
    var rel_path = '/psp/pscsprd/EMPLOYEE/SA/', 
        switch_to = function( html, textStatus, xhr ) {
            var href = document.location.href, 
                  has_gsm_flag = href.indexOf('gsmobile=') !== -1, 
                  has_parms = href.indexOf('?') !== -1, 
                  is_cmd = href.indexOf('cmd=') !== -1;

            var new_href = href.replace('gsmobile=1', '');
            if (is_cmd) {
                 new_href = new_href + '&gsmobile=0';
            }
            else {
                new_href = new_href + (has_parms ? '&' : '?') + 'gsmobile=0&return_to_portal=1';
            }
            document.location = new_href;
        }, 
        force_logout = function( html, textStatus, xhr ) {
            ghmob.ajax({ url : document.location.href, 
                     async: false, 
                     cache: false, 
                     data: { 'cmd' : 'login' },
                     success: switch_to
            });
        };
        
    ghmob.ajax({ url : rel_path + 's/WEBLIB_GS_MOBL.ISCRIPT1.FieldFormula.iScript_Nav', 
             async: false, 
             cache: false, 
             data: { 'gsmobile' : '0' , 'cmd' : 'logout' },
             success: force_logout
    });
}

/*jdoyle - hide everything but logo in header on timeout warning page */

if (window.location.href.indexOf("WEBLIB_TIMEOUT.PT_TIMEOUTWARNING") > -1) {

    /* Function to add style element */ 
        function addStyle(styles) { 
              
            /* Create style document */ 
            var css = document.createElement('style'); 
            css.type = 'text/css'; 
          
            if (css.styleSheet)  
                css.styleSheet.cssText = styles; 
            else  
                css.appendChild(document.createTextNode(styles)); 
              
            /* Append style to the tag name */ 
            document.getElementsByTagName("head")[0].appendChild(css); 
        } 
          
        /* Set the style */ 
        var styles = '[data-role="header"] .ui-btn-left { display: none !important; pointer-events: none !important; }'; 
        styles += ' [data-role="header"] .ui-btn-right { display: none !important; pointer-events: none !important; }'; 
          
        /* Function call */ 
        window.onload = function() { addStyle(styles) };

}

ghInit.attach({pageName:'SYSTEM', force: true}, function() {

	/* AC: Hide CKEDITOR transformed fields */
    ghmob('.cke').prev('textarea').addClass('gh-hidden');
    
    /* need to run on attachment upload modal */
    if (ghPage.getName() === 'CU_WAPP_ATTACH') {
        ghmob('form#CU_AD_WEB_APP_ADM input[name="Upload"]').closest('.ui-btn').addClass('success');
        ghmob('form#CU_AD_WEB_APP_ADM input[value="Cancel"]').closest('.ui-btn').addClass('danger');
        ghUtils.delay(function() {
            ghmob('#gh-file-chooser').parent('div').addClass('ui-btn info').removeClass('ui-input-text');
        })
    }
    if (ghPage.getName() === '(search)') {
        ghUtils.delay(function() {
            ghmob('#CU_APP_PLN_DVW_ACAD_PLAN_LBL').text('Academic Plan:');
            
            ghmob('[id$=divCU_APP_PLN_DVW_ACAD_PLAN_TYPE]').parent().prepend('<label class="PSSRCHEDITBOXLABEL ui-input-text">Academic Plan Type:</label>');
            
            var optionsCollapsible = ghState.get('optionsCollapsible') ? ghState.get('optionsCollapsible').collapsed : true;
            
            ghmob('#CU_AD_WEB_APP_ADM #options').on('click', function() {
                var $that = ghmob(this);
                // give time for the collapsible to toggle
                ghUtils.delay(function() {
                    if ($that.hasClass('ui-collapsible-collapsed') === true) {
                        ghState.push('optionsCollapsible', 1, {collapsed: true});
                    }
                    else {
                        ghState.push('optionsCollapsible', 1, {collapsed: false});
                    }
                })
            })
            
            ghUtils.delay(function(){
                if (Boolean(optionsCollapsible)) {
                    ghmob('#CU_AD_WEB_APP_ADM #options').trigger('collapse');
                }
                else {
                    ghmob('#CU_AD_WEB_APP_ADM #options').trigger('expand');
                }
            })
        })
    
    }

    //Add Download Icon to Pager
    ghUtils.delay(function(){
        ghmob('.gh-table-pager-more a:contains(Download)').addClass('download-icon');
    });
});
ghmob(document).on('pageinit', function(){

    ghUtils.delay(function(){
        //Hide left nav items depending on location
        //Student Portal
        if (window.MTop().location.href.indexOf("SA_LEARNING_MANAGEMENT") > -1) {
            ghmob('#gh-main-nav > li[class*="faculty"]').show();
            ghmob('#gh-main-nav > li:not([class*="faculty"]):not([class*="LandingNav"])').hide();
            ghmob('.gh-submenu.pagetabs').hide();
        }
        else if (window.MTop().location.href.indexOf("SA_LEARNER_SERVICES") > -1) {
            ghmob('#gh-main-nav > li[class*="student"]').show();
            ghmob('#gh-main-nav > li:not([class*="student"]):not([class*="LandingNav"])').hide();
        }
        else if (window.MTop().location.href.indexOf("CU_SELF_SERVICE.CU_MES_COVID.GBL") > -1) {
            ghmob('#gh-main-nav > li[class*="student"]').show();
            ghmob('#gh-main-nav > li:not([class*="student"]):not([class*="LandingNav"])').hide();
        }
        else {
            ghmob('#gh-main-nav > li[class*="center"]').show();
            ghmob('#gh-main-nav > li:not([class*="center"]):not([class*="LandingNav"])').hide();
        }

        //Dynamic Home URL
        if ( ghUser.hasRole('CU_SS_PROFESSOR') === false) {
             ghmob('#nav-home-button').attr('href', '/psc/' + freemarker.url.siteName + '/EMPLOYEE/SA/c/SA_LEARNER_SERVICES.SSS_STUDENT_CENTER.GBL');
        } else if (ghUser.hasRole('CU_SS_STUDENT') === false) {
             ghmob('#nav-home-button').attr('href', '/psc/' + freemarker.url.siteName + '/EMPLOYEE/SA/c/SA_LEARNING_MANAGEMENT.SS_FACULTY.GBL')
        } else {
            ghmob('#nav-home-button').attr('href', '/psc/' + freemarker.url.siteName + '/EMPLOYEE/SA/c/CU_SELF_SERVICE.CU_LANDING_NAV.GBL');
        }
        ghmob('#gh-file-chooser').parent().removeClass();
        ghmob('input[name="Upload"]').closest('.ui-btn').addClass('success');
        ghmob('input[value="Cancel"]').closest('.ui-btn').addClass('danger');


        var waitForEl = function(selector, callback) {
		  if (ghmob(selector).length) {
		    callback();
		  } else {
		    setTimeout(function() {
		      waitForEl(selector, callback);
		    }, 100);
		  }
		};
		waitForEl('#CU_AD_WEB_APP_ADM .ui-btn.gh-btn.success', function() {
		  // work the magic

		        ghmob('#CU_AD_WEB_APP_ADM .ui-btn.gh-btn.success').on('click', function(){
		             window.parent.ghLoader.showPopup()   
		        });
		    });
		});
})
/**
 * Modules
 */
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
			.on('gh_agbuttonupdate.ghActivityGuide.buttons',  function() {
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
ghInit.attach({
	eventType: 'pageinit',
	pageName: 'fluid_include',
	force: true,
	runCondition: ghPage.isFluid(),
}, function() {

	// Add oChange when needed
	ghmob('[onchange*="addchg_"]').not('[onchange*="oChange_"]').each(function() {
		ghmob(this).attr('onchange', ghmob(this).attr('onchange') + ('oChange_' + ghPage.getWin() + '=this;'));
	});

	// This is causing some event bubbling issues when there are submitAction events on inner children
	ghmob('.ps_pspagecontainer li[onclick]').each(function() {
		ghmob(this).attr('bup-onclick', ghmob(this).attr('onclick')).removeAttr('onclick role');
	});

	// Remove button role
	ghmob('tr[bup-onclick]').removeAttr('role');

	// Prevent XML being returned on reload of subpages
	if (window[ghPage.getWin()].action.indexOf('ICMDTarget=start') > -1 || window[ghPage.getWin()].action.indexOf('ICAGTarget=start')) {
		window[ghPage.getWin()].action = window[ghPage.getWin()].action.replace('&ICAJAX=1', '').replace('&ICMDTarget=start', '').replace('ICAGTarget=start', '');
	}

	// Carry over URL parameters
	if (window.location.search.length > 0 && window[ghPage.getWin()].action.indexOf('?') === -1) {
		window[ghPage.getWin()].action = window[ghPage.getWin()].action + window.location.search;
	}

	// Show the right content when multiple content sources are available
	if (ghmob('.ps_modal_body').length > 0) {
		if (ghmob('[id*="divPAGECONTAINER_TGT"] .ps_pspagecontainer').length > 0) {
			ghmob('[id*="divPAGECONTAINER_TGT"]').removeClass('psc_hidden').removeAttr('aria-hidden');
			ghmob('#PT_WRAPPER .ps_pspagecontainer').addClass('psc_hidden').attr('aria-hidden', 'true');
		}
		else {
			ghmob('[id*="divPAGECONTAINER_TGT"]').addClass('psc_hidden').attr('aria-hidden', 'true');
			ghmob('#PT_WRAPPER .ps_pspagecontainer').removeClass('psc_hidden').removeAttr('aria-hidden');
		}
	}
	ghmob('.ps_box-toolshiddens > [id]').each(function() {
		var thisId = ghmob('[id="' + ghmob(this).attr('id') + '"]');
		if (thisId.length > 1) {
			ghmob(this).remove();
		}
	});
	var hiddenFields = ghmob('.ps_box-toolshiddens div[id*="' + ghPage.getWin() + '"][aria-hidden="true"]').filter(function() {
		return (ghmob(this).is(ghInterface.alertMessagesSelectors.join()) === false && ghmob(this).parents('.ps_pspagecontainer').length === 0);
	});
	hiddenFields.addClass('gh-hidden');
	hiddenFields.parents('div[class="ui-body"]').addClass('gh-hidden');
	hiddenFields.parents('.ui-collapsible').addClass('gh-hidden');
	ghmob('.ps_box-toolshiddens .alert').find('.gh-hidden').removeClass('gh-hidden');
	ghmob('.ps_box-toolshiddens .alert').removeAttr('aria-hidden').find('[aria-hidden]').removeAttr('aria-hidden');

	// Search page
	if (ghPage.getName() === 'PT_PROMPTPAGE') {
		ghmob('body').addClass('PSSRCHPAGE');
	}

	// Remove PS classes
	ghmob('.table-stripe').removeAttr('style');
	ghmob('.ui-table .psc_invisible').removeClass('psc_invisible');
	ghmob('.ps_grid-col').removeClass('ps_grid-col');
	ghmob('.hr_overflow-ellipsis-list').removeClass('hr_overflow-ellipsis-list');
	ghmob('.psc_panel-container').removeClass('psc_panel-container');
	ghmob('.psc_auto_size').removeClass('psc_auto_size');
	ghmob('td.psc_button').removeClass('psc_button');

	// Make sure content is in the right place
	if (ghmob('#PT_MID_SECTION').length > 0 && ghmob('#PT_CONTENT').parent('#PT_MID_SECTION').length === 0) {
		ghmob('#PT_CONTENT').prependTo(ghmob('#PT_MID_SECTION'));
	}

	// Reset headings
	if (ghmob(ghHeader.headerSelectors.join()).length === 0) {
		var titles = ghmob('title').text().split(': ');
		var titlesArray = [];
		ghmob.each(titles, function(i) {
			if (i > 0) {
				titlesArray.push(titles[i]);
			}
		});
		if (titlesArray.length > 0) {
			ghHeader.addHeadings(titlesArray, true);
		}
	}
	else {
		ghHeader.pageHeader(ghHeader.headerSelectors, false);
	}

	// Add PS header bar text to page header
	var psHeadings = [];
	ghmob('.ps_apps_pageheader .ps_box-value').each(function() {
		if (ghmob(this).text().trim() === '' || ghmob(this).is(ghHeader.usernameSelectors.join()) || ghmob(this).is(ghHeader.jobTitleSelectors.join()) || ghmob(this).is('[id*="EMPLID"]') || (ghmob(this).is('[id*="DESCR"]') && ghmob(this).parents('.psc_data-primary, .psc_data-secondary').length === 0)) return;
		ghmob(this).closest('div[id]').addClass('gh-hidden').attr('aria-hidden', 'true');
		if (ghmob('.gh-page-header-headings *:contains(' + ghmob(this).text().trim() + ')').length > 0) return;
		var thisHeading = [ghmob(this).text().trim()];
		psHeadings.push(thisHeading);
	});
	if (psHeadings.length > 0) {
		ghHeader.addHeadings(psHeadings, true);
	}

	// Add active submenu link to page header when needed
	var pageHeaders = ghmob(ghHeader.headerSelectors.join());
	if (pageHeaders.length === 1 && pageHeaders.text().trim() === 'Select a Value' && ghmob('.gh-page-header-wrap .gh-submenu .active').length > 0) {
		var updatePageHeaders = [];
		ghmob('.gh-page-header-wrap .gh-submenu .active').each(function() {
			updatePageHeaders.push([ghmob(this).find('> a').text().trim()]);
		});
		updatePageHeaders.push([pageHeaders.text().trim()]);
		ghHeader.addHeadings(updatePageHeaders, false);
	}

	// move header content where applicable
	if (ghmob('gh-page-header-additional-content').length < 1) {
		var additionalContent = ghmob('<div class="gh-page-header-additional-content"></div>');
		ghmob('.ps_apps_pageheader .ps_box-value').each(function() {
			if (ghmob(this).text().trim() === '' || ghmob('.gh-page-header-headings *:contains(' + ghmob(this).text().trim() + ')').length > 0 || ghmob(this).hasClass('gh-hidden') || ghmob(this).hasClass('psc_hidden') || ghmob(this).parents('.gh-hidden, .psc_hidden').length > 0 || ghmob(this).is(ghHeader.usernameSelectors.join()) || ghmob(this).is(ghHeader.jobTitleSelectors.join()) || ghmob(this).is('[id*="EMPLID"]') || ghmob(this).is('[id*="DESCR"]')) return;
			additionalContent.append('<span class="gh-additional-content">' + ghmob(this).text().trim() + '</span>');
			ghmob(this).addClass('gh-hidden').attr('aria-hidden', true);
		});
		ghmob('.ps_apps_pageheader .psc_data-image').addClass('gh-hidden').attr('aria-hidden', 'true');
	}
	if (ghmob('.gh-page-header-wrap').find('.gh-page-header-additional-content').length < 1 && additionalContent.text().trim() !== '') {
		if (ghmob('.gh-page-header')) {
			additionalContent.insertAfter(ghmob('.gh-page-header'));
		}
		else {
			additionalContent.appendTo(ghmob('.gh-page-header-wrap'));
		}
	}
	ghmob('#PT_HEADER .ps_header_bar_custom').prependTo(ghmob('#PT_MAIN .ps_pspagecontainer'));

	// Prevent collapsibles in grid header bars
	var gridHdrBr = ghmob('.ps_box-grid-header_bar [data-role="collapsible"]');
	gridHdrBr.each(function() {
		ghmob(this).children(ghHeader.headings.join()).remove();
		ghmob(this).find('.ui-collapsible-content').children().unwrap();
		ghmob(this).children().unwrap();
	});

	// Scroll areas
	ghmob('.ps_box-grid[onscroll*="doScroll"][onscroll*="true"]').each(function() {
		var scrollAttr = ghmob(this).attr('onscroll');
		var newScrollAttr = scrollAttr.replace('this', 'document.getElementById(\'' + ghmob(this).attr('id') + '\')');
		if (newScrollAttr.indexOf('javascript:') === -1) {
			newScrollAttr = 'javascript:' + newScrollAttr;
		}
		var hasMore = ghmob(window['GetLazyScrollObj'](document.getElementById(ghmob(this).attr('id'))));
		var loadMoreBtn = ghmob('<a href="' + newScrollAttr + '" class="ui-btn-inline success ui-btn-icon-left fa fa-refresh gh-load-more">Load More</a>');
		if (ghPage.getName() === 'PT_PROMPTPAGE') {
			if (hasMore.length > 0 && ghmob('.ps_prompt-results a.gh-load-more').length === 0) {
				ghmob('.ps_prompt-results').append(loadMoreBtn);
			}
			if (hasMore.length === 0) {
				ghmob('.ps_prompt-results a.gh-load-more').remove();
			}
		}
		else {
			if (hasMore.length > 0 && ghmob(this).next('a.gh-load-more').length === 0) {
				ghmob(this).after(loadMoreBtn);
			}
			if (hasMore.length === 0) {
				ghmob(this).next('a.gh-load-more').remove();
			}
		}
		ghmob(this).removeAttr('onscroll');
	});
	ghmob('a.gh-load-more').button();

	// Helper text
	ghmob('.psc_reldisp-container').each(function() {
		var helperValue = ghmob(this).find('.psc_reldisp-value[id]');
		var helperUnits = ghmob(this).find('.psc_reldisp-units[id]');
		if (helperValue.length === 0 && helperUnits.length === 0) return;
		var helperId;
		if (helperValue.length > 0) {
			helperId = helperValue.attr('id');
		}
		else if (helperUnits.length > 0) {
			helperId = helperUnits.attr('id');
		}
		ghmob(this).find('> .psc_reldisp-field').attr('aria-describedby', helperId);
	});

	// Search pages
	ghmob('.PSSRCHPAGE .psc_fld-prompt').each(function() {
		var searchControlInput = ghmob(this).find('input[id]').filter(function() {
			return (ghmob(this).parents('.ps_box-searchto, .ps_box-searchop').length === 0);
		}).first();
		var searchControlLabel = ghmob(this).find('input[title]').first();
		if (ghmob(this).find('label').length === 0 && searchControlInput.length > 0 && searchControlLabel.length > 0) {
			searchControlInput.before('<label for="' + searchControlInput.attr('id') + '" id="' + searchControlInput.attr('id') + '-label" class="ui-input-text">' + searchControlLabel.attr('title') + '</label>');
		}
	});

	// Accessibility
	ghmob('.ps_box-grid-header .ps_box-grid-header_bar .ps_box-button.psc_image_only .ps-button-wrapper').removeAttr('title');
	ghmob('.ps-button-wrapper[title], .ps-link-wrapper[title]').removeAttr('title');
	ghmob('.ps_header-group').filter(function() {
		return (ghmob(this).is(ghHeader.headings.join()) && ghmob(this).is(':visible') === false);
	}).addClass('gh-hidden').attr('aria-hidden', 'true');

	// Fluid 8.54
	if (ghmob('#PT_TOOLBAR').text().trim() === '' && ghmob('#PT_TOOLBAR').children().length === 0) {
		ghmob('#PT_TOOLBAR').remove();
	}

	// Multiselect
	ghmob('.psc_multiselect-hide').find('th:contains("YesNo"), th.psc_multiselect-hide').each(function() {
		var tblCols = [
			{
				delete: true,
				newIndex: ghmob(this).index(),
				oldIndex: ghmob(this).index(),
			},
		];
		ghTable.moveColumn(ghmob(this).closest('.ui-table'), tblCols);
	});

	// Field spacing
	ghmob('.psc_fld-standard').not('.ui-field-contain').addClass('ui-field-contain');

	// Move labels
	ghmob('div.prompt > label').each(function() {
		ghmob(this).insertBefore(ghmob(this).parent('div.prompt'));
	});
	ghmob('.ui-field-contain .ps_box-control').each(function() {
		var lbl = ghmob(this).find('> label').not('.ps_indicator');
		lbl.addClass('ui-input-text');
		if (ghmob(this).parent().find('.ps_box-label').length > 0 && ghmob(this).parent().find('.ps_box-label').first().text().trim() === '') {
			lbl.appendTo(ghmob(this).parent().find('.ps_box-label').first().removeClass('gh-hidden'));
		}
		else {
			lbl.insertBefore(ghmob(this));
		}
	});

	ghUtils.delay(function() {

		// Filter popups
		window['psdivpop'] = [];
		ghmob('[id*="SORT"][id*="divpop"]').each(function() {
			var thisPop = {
				id: ghmob(this).attr('id'),
				html: ghmob('<div />').html(ghmob(this).clone()).html(),
			};
			window['psdivpop'].push(thisPop);
		});
		ghmob(document)
			.off('ghModalClose.ghFluid.filterContent')
			.on('ghModalClose.ghFluid.filterContent', function() {
				if (typeof window['psdivpop'] === 'undefined' || window['psdivpop'].length === 0) return;
				ghmob.each(window['psdivpop'], function(i) {
					var thisPop = window['psdivpop'][i];
					var thisPopId = thisPop.id;
					var thisPopPanelId = thisPopId.replace('$divpop', '');
					var thisPopPanel = ghmob('[id="' + thisPopPanelId + '"]');
					var thisPopHtml = thisPop.html;
					if (thisPopPanel.find('[id="' + thisPopId + '"]').length > 0) return;
					thisPopPanel.append(thisPopHtml);
					thisPopPanel.find('[id="' + thisPopId + '"]').addClass('psc_hidden');
				});
			});

		// Page tabs
		ghSubmenu.pageTabs(ghmob('.ps_header_bar:not([id*="LAYOUT_HEADER"]) ul.ps_grid-body, .ps_vtabs ul.ps_grid-body'));

		// Cleanup
		ghUtils.removeEmpty(ghmob('.ps_scrollable'));
		ghUtils.removeEmpty(ghmob('.ui-body'));
		ghmob('b:contains(Group Box)').hide();

		// Attempt to auto load footer buttons
		if (ghPage.isHomepage() === false && ghPage.isFluidHomepage() === false && ghPage.isLogin() === false && ghPage.isSearch() === false) {
			var footerbtns = ghmob('.ps_content .ps_box-button').filter(function() {
				if (ghmob(this).hasClass('psc_image_only') || ghmob(this).hasClass('psc_trigger') || ghmob(this).hasClass('psc_has_popup') || ghmob(this).hasClass('psc_modal-close') || ghmob(this).hasClass('ps_header_button') || ghmob(this).hasClass('ps_button_backnav') || ghmob(this).hasClass('gh-container-footer-original') || ghmob(this).hasClass('psc_hidden') || ghmob(this).hasClass('psc_disabled') || ghmob(this).find('img').length > 0 || ghmob(this).parents('.psc_hidden, .ps_apps_pageheader:not(.navigation_hdr), .psc_pageheader-fixed, .ps_box-grid-header_bar, div[class="ui-body"], .ui-collapsible, .psc_modal-close, .ui-popup, #pt_modals, .psc_mode-ag:not(html), .ps_attachcontainer, .psc_force-hidden, .ps_collection').length > 0) {
					return false;
				}
				return true;
			});
			ghmob(footerbtns).each(function() {
				ghFooter.addItem(ghmob(this));
			});

			ghmob('.ps_footer a').each(function() {
				ghFooter.addItem(ghmob(this));
			});

			// Activity guide footer buttons
			ghUtils.delay(function() {
				ghFooter.addItem(ghmob('[id$=divPSACTIVITYGUIDE_PREVIOUS_STEP]'));
				ghFooter.addItem(ghmob('[id$=divPSACTIVITYGUIDE_NEXT_STEP]'));
			});

			// Anchor links
			ghmob('.psa_links-anchor a').not('a:contains("Return")').each(function() {
				ghFooter.addItem(ghmob(this));
			});

			ghUtils.delay(function() {

				// Modal cancel/save global
				ghmob('.ps_header_modal .ps_box-button').not('.psc_modal-close, #PT_WORK_PT_PROMPT_CANCEL').find('a').each(function() {
					ghFooter.addItem(ghmob(this));
				});

			});
		}

		// Tables without headings
		ghmob('.ui-content .ui-table:not([data-gh-enhanced="false"])').each(function() {
			if (ghmob(this).find('th').length === 0 || ghmob(this).closest('.ps_box-grid-flex').hasClass('psc_grid-nocolheaders')) {
				ghmob(this).removeClass('reflow-grid-400 reflow-grid-500 reflow-grid-600 reflow-grid-700 reflow-grid-800 reflow-grid-900 reflow-grid-1000').attr('role', 'presentation').find('b.ui-table-cell-label').remove();
			}
			else {
				ghmob(this).removeAttr('role data-reflow-breakpoint');
				ghTable.cleanReflow(ghmob(this));
				fluidUI();
			}
		});

		// Add link and click event to trigger row action
		var psListviews = '.ps_grid-list li[bup-onclick], .ps_grid-flex[role="presentation"] .ps_grid-row[bup-onclick]';
		ghmob(psListviews).each(function() {
			if (ghmob(this).find('a:focusable:visible').length === 0) {
				var onclickAttr = ghmob(this).attr('bup-onclick');
				if (onclickAttr.indexOf('javascript:') === -1) {
					onclickAttr = 'javascript:' + onclickAttr;
				}
				var childrenToWrap = ghmob(this).children();
				if (ghmob(this).is('tr')) {
					childrenToWrap = ghmob(this).children('td:first-child').children();
				}
				childrenToWrap.wrapAll('<a href="' + onclickAttr + '"></a>');
				childrenToWrap.parent('a').wrapAll('<div class="psc_trigger"></div>');
			}
			if (ghmob(this).find('.psc_trigger').length === 0) {
				ghmob(this).find('a').first().wrapAll('<div class="psc_trigger"></div>');
			}
		});
		ghmob(document).off('click.psGridRowClick').on('click.psGridRowClick', psListviews, function(event) {
			event.stopPropagation();
			event.preventDefault();
			if (ghmob(event.currentTarget).is('a') || ghmob(this).find('.psc_trigger').length === 0 || ghmob(this).find('.psc_trigger a').length === 0) return;
			var psGridRowClickAction = ghmob(this).find('.psc_trigger a[href]').attr('href').replace('javascript:', '');
			eval(psGridRowClickAction);
		});

		// Filter column
		var filter = ghmob('.psc_panel-action .pts_facets').filter(function() {
			return (ghmob(this).parents('.gh-filter').length === 0 && ghmob(this).find('a').length > 0 && ghmob('.ps_search > div').length === 0 && ghmob('.gh-submenu-cols .gh-submenu.pagetabs').length === 0);
		});
		var content = ghmob('.ps_pagecontainer').first();
		if (filter.length > 0) {
			ghmob('body').addClass('gh-has-submenu-cols');
			var heading = 'Filter';
			var headingLevel = ghHeader.headingStartLevel(content);
			if (ghmob('.gh-submenu-cols > .gh-filter').length === 0) {
				content.addClass('gh-submenu-cols');
				var filterCol = ghmob('<div class="gh-filter"><div class="ui-body"><h' + headingLevel + ' class="ui-bar">' + heading + '</h' + headingLevel + '><div class="menu" role="navigation" aria-label="filter"></div></div></div>');
				filterCol.prependTo(content);
			}
			else {
				ghmob('.gh-filter .menu').html('');
			}
			filter.appendTo(ghmob('.gh-filter .menu'));
		}
		content.attr('data-cols', content.children().length);
		ghmob('.gh-filter').find('.ui-collapsible').not('.gh-active-collapsible').trigger('collapse');
	});

	ghUtils.delay(function() {

		// Radios with missing labels
		var radios = ghmob('.ps_box-grid-header .psc_gridview-toggle, .ps_button_bar');
		radios.find('.ps_box-radio').each(function() {

			// Missing label
			if (ghmob(this).find('.ui-radio label').length === 0 && ghmob(this).find('.ui-radio input').length > 0) {
				var gridToggleId = ghmob(this).find('.ui-radio input').attr('id'),
					gridToggleLabel = gridToggleId.toLowerCase();

				if (gridToggleLabel.indexOf('_btn') > -1) {
					gridToggleLabel = gridToggleLabel.replace('_btn', '');
				}

				if (gridToggleLabel.indexOf('_') > -1) {
					gridToggleLabel = gridToggleLabel.replace(/_/g, ' ');
				}

				ghmob('<label for="' + gridToggleId + '">' + gridToggleLabel + '</label>').insertBefore(ghmob(this).find('.ui-radio'));
				ghmob(this).find('.ui-radio input').clone().insertBefore(ghmob(this).find('.ui-radio'));
				ghmob(this).find('.ui-radio').remove();
				ghmob(this).find('input').checkboxradio();

			}
		});

		// Grids - Header - Grid View Toggle
		var cardListView = ghmob('.ps_box-grid-header .psc_gridview-toggle');

		cardListView.find('.ps_box-radio').each(function() {

			// Icon
			if (ghmob(this).find('.ui-radio .ui-btn-inner .fa').length === 0) {
				if (ghmob(this).attr('id') && ghmob(this).attr('id').indexOf('LIST') !== -1) {
					ghmob(this).find('.ui-radio .ui-btn-inner').append(ghmob('<span class="ui-icon fa fa-list"></span>'));
				}

				if (ghmob(this).attr('id') && ghmob(this).attr('id').indexOf('TILE') !== -1 || ghmob(this).attr('id') && ghmob(this).attr('id').indexOf('CARD') !== -1) {
					ghmob(this).find('.ui-radio .ui-btn-inner').append(ghmob('<span class="ui-icon fa fa-th-large"></span>'));
				}
			}

			ghmob(this).find('.ui-radio .ui-btn-text').text(ghmob(this).find('.ui-radio .ui-btn-text').text().replace('View', '').replace('view', ''));
		});

		// Grids - Body - Icons
		var grid = ghmob('.ps_box-grid').filter(function() {
			return (ghmob(this).find('.ps_grid-list').length === 0);
		});
		grid.find('.ps_grid-row').each(function() {

			// Username
			if (ghmob(this).find('.gh-username').length > 0) return;
			var gridIconsName = 'div[id*="NAME_DISPLAY"], div[id*="DISPLAY_NAME"], div[id*="HIS_DOCUMENT_LINK"]';
			ghmob(this).find(gridIconsName).find('span[class*="ps_box-value"], span[class*="ps-link"]').attr('class', 'gh-username');

			// Photo
			var gridIconsPhoto = 'div[id*="EMPL_PHOTO"], div[id*="EMPLOYEE_PHOTO"], div[id*="HIS_PHOTO"]';
			ghmob(this).find(gridIconsPhoto).find('img').attr('class', 'gh-userphoto gh-userphoto-sm').insertBefore(ghmob(this).find('.gh-username'));

			// Job Title
			var gridIconsJobTitle = 'div[id*="JOBTITLE"], div[id*="JOBCODE"], div[id*="JOB_TITLE"], div[id*="JOB_CODE"]';
			ghmob(this).find(gridIconsJobTitle).find('span[class*="ps_box-value"]').attr('class', 'gh-jobtitle');

			// Comma
			if (ghmob(this).find('.gh-jobtitle').length > 0) {
				ghmob(this).find('.gh-username').append('<span class="comma">, <span>');
			}

			// Job Title
			ghmob(this).find('.gh-jobtitle').appendTo(ghmob(this).find('.gh-username'));

			// Related Actions
			var gridIconsRelatedActions = 'div[id*=RELATED_XACTIONS]';
			var relatedActionsContainer = ghmob(this).find(gridIconsRelatedActions).find('span');
			relatedActionsContainer.attr('class', 'my-actions').find('a').html(relatedActionsContainer.find('a').html() + '<i class="fa fa-gear"></i>Related Actions');
			relatedActionsContainer.find('a img').addClass('sr-only');

			if (ghmob(this).find('.gh-jobtitle').length > 0) {
				ghmob(this).find('.my-actions').insertAfter(ghmob(this).find('.gh-jobtitle'));
			}
			else {
				ghmob(this).find('.my-actions').insertAfter(ghmob(this).find('.gh-username'));
			}

			// Direct Reports
			var gridIconsDirectReports = 'div[id*="DIR_INDIR"]';
			if (ghmob(this).find(gridIconsDirectReports).find('span[class*="ps-link"] a .fa').length === 0) {
				ghmob(this).find(gridIconsDirectReports).addClass('gh-direct-reports').find('span[class*="ps-link"] a').prepend('<i class="fa fa-users"></i> ').find('img').remove();
			}

			// Email
			var gridIconsEmail = 'div[id*="EMAIL"].ps_box-edit';
			if (ghmob(this).find(gridIconsEmail).find('span[class*="ps_box-value"] a .fa').length === 0) {
				ghmob(this).find(gridIconsEmail).addClass('gh-email').find('span[class*="ps_box-value"] a').prepend('<i class="fa fa-envelope fa-fw"></i>');
			}

			// Phone
			var gridIconsPhone = 'div[id*="PHONE"].ps_box-edit';
			if (ghmob(this).find(gridIconsPhone).find('span[class*="ps_box-value"]').text().trim() !== '' && ghmob(this).find(gridIconsPhone).find('span[class*="ps_box-value"] .fa').length === 0) {
				ghmob(this).find(gridIconsPhone).addClass('gh-phone').find('span[class*="ps_box-value"]').prepend('<i class="fa fa-phone fa-fw"></i> ');
			}

			// Department
			var gridIconsDepartment = 'div[id*="DEPARTMENT"].ps_box-edit, div[id*="DEPT_"].ps_box-edit';
			if (ghmob(this).find(gridIconsDepartment).find('span[class*="ps_box-value"]').text().trim() !== '' && ghmob(this).find(gridIconsDepartment).find('span[class*="ps_box-value"] .fa').length === 0) {
				ghmob(this).find(gridIconsDepartment).addClass('gh-department').find('span[class*="ps_box-value"]').prepend('<i class="fa fa-sitemap fa-fw"></i> ');
			}

			// Location
			var gridIconsLocation = 'div[id*="LOCATION"].ps_box-edit';
			var gridIconsCountry = 'div[id*="COUNTRY"].ps_box-edit';
			if (ghmob(this).find(gridIconsLocation).find('span[class*="ps_box-value"]').text().trim() !== '' && ghmob(this).find(gridIconsLocation).find('span[class*="ps_box-value"] .fa').length === 0) {
				ghmob(this).find(gridIconsLocation).addClass('gh-location').find('span[class*="ps_box-value"]').prepend('<i class="fa fa-map-o fa-fw"></i> ');
				if (ghmob(this).find(gridIconsCountry).length > 0) {
					ghmob(this).find(gridIconsLocation).find('span[class*="ps_box-value"]').append('<span class="comma">, <span>');
				}

				ghmob(this).find(gridIconsCountry).addClass('gh-country').find('span[class*="ps_box-value"]').insertAfter(ghmob(this).find(gridIconsLocation).find('span[class*="ps_box-value"]:last'));
			}
		});

		// Show or hide grid header bars
		ghmob('.ps_box-grid-header .ps_box-grid-header_bar').each(function() {
			if (ghmob(this).text().trim() === '' || ghmob(this).find('a, input').not('.gh-hidden').length === 0) {
				ghmob(this).addClass('gh-hidden').attr('aria-hidden', 'true');
			}
			else {
				ghmob(this).addClass('show').closest('.ps_box-grid-header').addClass('show');
			}
		});

	}, 500);

	fluidUI();

	function fluidUI() {

		if (ghPage.isHomepage() || ghPage.isFluidHomepage() || ghPage.isLogin()) return;
		ghmob('body').addClass('gh-fluid-ui');

		// My Actions
		if (ghmob('.gh-page-header-wrap .my-actions').length === 0) {
			ghmob('.gh-page-header-wrap .ps-icon-wrapper').attr('class', 'my-actions').find('a').removeAttr('class').append('My Actions').find('.fa').attr('class', 'fa fa-gear');
		}

		// Add buttons
		ghmob('.ps_box-button[id*="_ADD"], .ps_box-button[id*="divADD"]').each(function() {
			if (ghmob(this).parents('.psc_hidden, .ps_grid-row').length > 0) return;
			var text = ghmob(this).find('a').text().trim();
			if (ghmob(this).find('a img').length > 0) {
				text = ghmob(this).find('a img').attr('alt');
			}
			ghContainer.footer(ghmob(this).closest('div.ui-collapsible, div[class="ui-body"], .ps_box-grid-flex'), ghmob(this).find('a'), { color: 'success', icon: 'fa fa-plus', text: text });
		});

		// Edit buttons
		ghmob('table').not('[role="presentation"], .ps_grid-flex-head').find('tbody [id*="CHEVRON_GBX"], tbody .ps_box-edit.psc_more').each(function() {
			var oldItem = ghmob(this);
			if (oldItem.closest('.ps_box-grid-flex').hasClass('psc_grid-nocolheaders') || oldItem.closest('table').find('th').text().trim() === '') return;
			if (oldItem.text().trim() !== '') {
				oldItem.removeClass('psc_more');
				return;
			}
			var viewBtn = oldItem.closest('td').find('a.gh-view-more');
			if (viewBtn.length > 0) {
				oldItem.addClass('gh-hidden').attr('aria-hidden', 'true');
				viewBtn.removeClass('gh-hidden').removeAttr('aria-hidden');
				return;
			}
			oldItem.after('<a href="#" class="gh-view-more" id="' + ghmob(this).closest('[id]').attr('id') + '-view-more' + '"><i class="fa fa-search" aria-hidden="true"></i> View</a>');
			viewBtn = oldItem.closest('td').find('a.gh-view-more');
			if (oldItem.find('a[href]').length > 0) {
				viewBtn.attr('href', oldItem.find('a[href]').first().attr('href'));
			}
			else {
				var trigger = oldItem.closest('tr').find('.psc_trigger').first();
				var rowClick = oldItem.closest('tr').attr('bup-onclick');
				if (trigger.length > 0 && trigger.find('a[href]').length > 0) {
					viewBtn.attr('href', trigger.find('a[href]').first().attr('href'));
				}
				else if (rowClick) {
					viewBtn.attr('href', rowClick);
				}
				else {
					viewBtn.addClass('ui-disabled').attr('aria-disabled', 'true').hide();
				}
			}
			if (viewBtn.hasClass('ui-disabled') === false) {
				oldItem.closest('td').removeClass('gh-cell-no-padding').children().removeClass('gh-hidden').removeAttr('aria-hidden');
			}
			var ariaLabelledBy = oldItem.closest('tr').find('a[id]:visible, span[id]:visible').filter(function() {
				return (ghmob(this).children('a[id], span[id]').length === 0 && ghmob(this).is(viewBtn) === false && ghmob(this).text().trim() !== '');
			});
			var ariaLabel = 'View Row ' + (oldItem.closest('tr').index() + 1);
			if (ariaLabelledBy.length === 0) {
				viewBtn.attr('aria-label', ariaLabel);
			}
			else {
				viewBtn.attr('aria-labelledby', viewBtn.attr('id') + ' ' + ghmob(ariaLabelledBy[0]).attr('id'));
			}
			oldItem.addClass('gh-hidden').attr('aria-hidden', 'true');
			var tableHd = oldItem.closest('.ui-table').find('> thead > tr > th:eq(' + oldItem.closest('td').index() + ')');
			if (tableHd.text().trim() === '') {
				tableHd.append('<span class="sr-only">View</span>');
			}
		});

		// Missing table cells
		ghmob('.ui-table:not([data-gh-enhanced="false"])').each(function() {
			var refresh = false;

			ghmob(this).children('thead').children('tr').children('th').each(function() {
				if (typeof ghmob(this).attr('data-pnlfldid') !== 'undefined') {
					var pnlfldid = ghmob(this).attr('data-pnlfldid'),
						index = ghmob(this).index();

					ghmob(this).closest('.ui-table').children('tbody').children('tr').each(function() {
						if (ghmob(this).find('[data-pnlfldid="' + pnlfldid + '"]').length === 0) {
							ghmob(this).children('td:eq(' + index + ')').before('<td class="gh-missing-cell"><div data-pnlfldid="' + pnlfldid + '"></div></td>');
							refresh = true;
						}
					});
				}
			});

			if (refresh === true) {
				ghmob(this).find('b.ui-table-cell-label').remove();
				ghmob(this).table('refresh');
			}
		});

	}

});

// Force desktop form factor
window.getFormFactorSize = function() {
	return {
		width: '2048',
		height: '2048',
		formfactor: '3',
	};
};
if (typeof ptDeviceFeatures !== 'undefined' && typeof sDomain !== 'undefined') {
	var df = new ptDeviceFeatures();
	df.init();
}

// Disable PS functions
window['doRadioOuterClick'] = function() {
	return false;
};
window['setOutlineTimer'] = function() {
	return false;
};
window['clearOutline'] = function() {
	return false;
};
window['cancelBubble'] = function() {
	return false;
};
window['clearCustomGroup'] = function() {
	return false;
};

/**
 * Shared resources
 */
ghInit.attach({
        pageName: 'EO_ADDR',
        force: true,
}, function() {
 
 		
        var buttons = ghmob('a[id*="OK_PB"], a[id*="CANCEL_PB"]');
 
        if (ghPage.getName() && ghPage.getName().indexOf('EO_ADDR') === 0 || ghPage.getName() === 'SS_ADDRESSES' && buttons.length > 0) {
 
                // Header
                var title = ghmob('.PSSRCHTITLE');
                var country = ghmob('[id*="divCOUNTRY_TBL_DESCR"]');
                var countryArr = [countryArr];
                if (title.length === 0) {
                        ghmob('.PSForm').prepend('<div class="PSSRCHTITLE">Edit Address</div>');
                }
                var headings = [
                        ['.PSSRCHTITLE']
                ]
                if (country.find('label').length === 0) {
                        headings.push(['[id*="divCOUNTRY_TBL_DESCR"]']);
                }
                ghHeader.pageHeader(headings, false);
 
                // Footer
                ghUtils.delay(function() {
                        // Wait for page name changes
                        buttons.each(function() {
                                if (ghmob(this).children('img').length > 0) {
                                        ghmob(this).html(ghmob(this).children('img').attr('alt'));
                                }
                                ghFooter.addItem(ghmob(this));
                        });
                })
 
                // Fix spacing issues after changing country
                ghmob('form [data-pnlfldid]:not([data-describes-for])').attr('class', 'ui-field-contain ui-body ui-br');
                
                /* sgunda -> Display main content and Add footer btn */
	ghmob('#gh-main-content').removeClass('gh-hidden');
	ghFooter.addItem(ghmob('div.ui-btn.gh-btn')); 
  }      
});

 
ghInit.attach({
        pageName: 'EO_ADDR',
        force: true,
        eventType: 'pagebeforecreate',
}, function() {
 
        // Link helper text with the right field
        ghmob('#DERIVED_ADDRESS_CITY').closest('[data-pnlfldid]').removeAttr('aria-describedby');
        ghmob('#DERIVED_ADDRESS_STATE').closest('[data-pnlfldid]').attr('aria-describedby', 'STATE_TBL_DESCR');
        ghmob('#STATE_TBL_DESCR').closest('div').attr('data-describes-for', 'DERIVED_ADDRESS_STATE');
});
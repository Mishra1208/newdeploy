
    ghInit.attach('SAA_SS_DPR_ADB', function () {

        // Extra collapsibles
        /*ghmob('div[id*="_EXPAND_"], div[id*="_COLLAP_"], div[id*="_COLLAPSE_"]').not('.gh-hidden').each(function (i) {
            if (ghmob(this).find('input[type="button"]').length > 0) return;
            var thisCollapsible = ghmob(this).parents('div[data-pnlname]').first();
            thisCollapsible.attr('data-for', thisCollapsible.attr('id'));
            ghmob(this).addClass('gh-hidden').attr('aria-hidden', 'true');
            var collapsed;
            if (ghmob(this).is('div[id*="_EXPAND_"]')) {
                ghmob(this).find('a').first().attr('aria-expanded', 'false').addClass('PTEXPAND_ARROW');
                collapsed = true;
            }
            else {
                ghmob(this).find('a').first().attr('aria-expanded', 'true').addClass('PTCOLLAPSE_ARROW');
                collapsed = false;
            }
            ghContainer.createCollapsible(thisCollapsible, thisCollapsible.find('.PABACKGROUNDINVISIBLE').first(), { collapsed: collapsed });
        });*/

        // Move content into empty collapsibles
        ghmob('.ui-body, .ui-collapsible-content').each(function () {
            var thisContainer = ghmob(this);
            var thisContent = thisContainer.clone();
            thisContent.find('.ui-bar, .PAGROUPDIVIDER, .gh-hidden').remove();
            var isEmpty = thisContent.text().trim() === '';
            if (isEmpty === false) {
                thisContainer.closest('tr').addClass('container');
            }
            else {
                thisContainer.closest('tr').addClass('empty-container');
            }
        });

        ghmob('.empty-container .ui-body, .empty-container .ui-collapsible-content').each(function () {
            var thisContainer = ghmob(this);
            thisContainer.closest('tr').nextUntil('tr.empty-container, tr.container').each(function () {
                ghmob(this).children('td').children().appendTo(thisContainer);
            });
        });

        // Footers
        ghFooter.addItem(ghPage.getField(95));
        ghFooter.addItem(ghPage.getField(97));
    });

    // Calling 'Collapse All' function to fix the issue of data not being loaded.
    // Cannot keep it inside ghInit as Collapse All and Expand All functions
    // calls ghInit, thus attached function to the same will be
    // called, hence outside ghInit to prevent infinite callback loop.
    /*ghUtils.delay(function () {
        submitAction_win0(document.win0, "DERIVED_SAA_DPR_SSS_COLLAPSE_ALL", event);
    }, 0);*/




ghInit.attach('CU_STUDENT_RECORD',function(){

    /* sgunda -> Page content alignment and Print footer button */
    ghUtils.delay(function(){
    ghPage.getField('CU_STUDENT_RECORD',[1,28]).find('div').removeAttr('style');    
    ghmob('[data-pnlfldid="1"][data-pnlname="CU_STUDENT_RECORD"] [style]').removeAttr('style');
    ghmob('.gh-btn').removeAttr('style');
        ghFooter.addItem(ghmob('div.gh-btn'));   
    },120);

    //Footer Button
    ghFooter.addItem('#backURL', {prepend: true, text: 'Return'});
    
    //jdoyle - removed fixed widths
    ghmob('table[width]').removeAttr('width');
    
    //jdoyle - fix colspan issue
    ghUtils.delay(function(){
    ghmob('table.reflow-grid-600').each(function(){

      ghTable.tablesaw( ghmob(this));

    });
    }, 500)
});



function unloadPage() {
    /* opera needs to reset state on mouse effects */
    StyleAnimator.ResetAll();
}
function addTrailItem(text, link) {
    var mt = document.getElementById('mainTrail');
    if (mt.childNodes.length > 0) {
        var sp = document.createElement('SPAN');
        sp.setAttribute('innerHTML', ' > ');
        mt.appendChild(sp);
    }
    if (link == '') {
        var lk = document.createElement('div');
        lk.appendChild(document.createTextNode(text));
        mt.appendChild(lk);
    }
    else {
        var lk = document.createElement('a');
        lk.setAttribute('href', link);
        lk.appendChild(document.createTextNode(text));
        mt.appendChild(lk);
    }
}
/* add  the mouse overs for the global menu */
function addGlobalMenuLinks() {
    var sa = new styleAction();
    var id1 = document.getElementById('heaterLink');
    sa.AddAction(new styleActionInfo(id1, 'color', '999999','0f3f72', 400));
    sa.AddActionTrigger(id1, 'mouseover');
    sa.AddInterruptTrigger(id1, 'mouseout', false, true);

    sa = new styleAction();
    id1 = document.getElementById('humiLink');
    sa.AddAction(new styleActionInfo(id1, 'color', '999999','0f3f72', 400));
    sa.AddActionTrigger(id1, 'mouseover');
    sa.AddInterruptTrigger(id1, 'mouseout', false, true);        
    
    
    sa = new styleAction();
    id1 = document.getElementById('actSoft');
    sa.AddAction(new styleActionInfo(id1, 'color', '999999','0f3f72', 400));
    sa.AddActionTrigger(id1, 'mouseover');
    sa.AddInterruptTrigger(id1, 'mouseout', false, true);        

    sa = new styleAction();
    id1 = document.getElementById('valveSoft');
    sa.AddAction(new styleActionInfo(id1, 'color', '999999','0f3f72', 400));
    sa.AddActionTrigger(id1, 'mouseover');
    sa.AddInterruptTrigger(id1, 'mouseout', false, true);        
    
}
function addTopMenuLinks() {
    var arrToAdd = new Array(new Array('tpmHumi','43b2e5'), new Array('tpmActu','e9cc21'), new Array('tpmValv','e92124'), new Array('tpmHeat','e5681c'), new Array('tpmCont','afc46a'), new Array('tpmContactUs','ffd93f'), new Array('tpmFrancais','ffd93f'));
    var i;
    for (i=0; i < arrToAdd.length;i++) {
        var id = document.getElementById(arrToAdd[i][0]);
        sa = new styleAction();
        sa.AddAction(new styleActionInfo(id, 'color', 'ffffff',arrToAdd[i][1], 400));
        sa.AddActionTrigger(id, 'mouseover');
        sa.AddInterruptTrigger(id, 'mouseout', false, true);
    }
    
return;    
    //add the menu div
    var trig = document.getElementById('tpmCont');
    var source = document.getElementById('popupControls');
    sa = new styleAction();
    sa.AddAction(new styleActionInfo(source, 'height', 0, 287, 40));
    sa.AddAction(new styleActionInfo(source, 'opacity', 0, 100, 200));
    sa.AddActionTrigger(trig, 'mouseover', true);
    sa.AddActionTrigger(source, 'mouseover', true);
    sa.AddInterruptTrigger(trig, 'mouseout', false, true);
    sa.AddInterruptTrigger(source, 'mouseout', false, true);
}
function test()
{
    var sa = new styleAction1();
    var trig = document.getElementById('tpmCont');
    sa.AddActionTrigger(trig, 'mouseover', true);
}
/******************************************************************
decided not to use private and priviledged scope, using them would affect the simplicity of these routines.
******************************************************************/

/************************************************* StyleAnimator ****************************************************************/

/***********************************************
public methods:
- StyleAnimator.ResetAll();
- var sa = new styleAction();
  sa.isEnabled = true;
- var sa = new styleAction(); // can be used for toggles 
  sa.ResetState();
- to create a style                 
  var sa = new styleAction();
  var id1 = document.getElementById('objectID');
  sa.AddAction(new styleActionInfo(id1, 'backgroundColor', '8d97a4','85af37', 300));
  sa.AddActionTrigger(id1, 'mouseover', true);
  sa.AddInterruptTrigger(id1, 'mouseout', true, true);
**************************************************/
if (!window.StyleAnimator)
    StyleAnimator = new Object();
StyleAnimator.arrStyleActions = new Array();
StyleAnimator.isLoopActive = false;
StyleAnimator.loopTime = 40;
/* get the StyleAnimatorAction that caused the event to trigger */
StyleAnimator.ProcessMouseEvent = function(e) {
    var obj, type;
    if (window.event) {
        obj = event.srcElement;
        type = event.type;
    } else { //for firefox
        obj = e.target;
        type = e.type;
    }
    var startLoop = false;
    var i, j, arrSA = StyleAnimator.arrStyleActions;
    for (i = 0; i < arrSA.length; i++) {
        if (arrSA[i].isEnabled) {
            if (StyleAnimator.ProcessMouseEventStart(arrSA[i], obj, type))
                startLoop = true;
            else if (StyleAnimator.ProcessMouseEventEnd(arrSA[i], obj, type))
                startLoop = true;
        }
    }
    if (startLoop && !StyleAnimator.isLoopActive)
        StyleAnimator.Animate();
}
StyleAnimator.ProcessMouseEventStart = function(styleAction, obj, type) {
    var startLoop = false;
    var i, saTriggers = styleAction.arrActionTriggers;
    for (i = 0; i < saTriggers.length; i++) {
        if (saTriggers[i][0] == obj && saTriggers[i][1] == type) {
            var j, actions = styleAction.arrActions;
            for (j = 0; j < actions.length; j++) {
                if (actions[j].state != 'ActionInDone') {
                    actions[j].state = 'ActionIn';
                    startLoop = true;
                }
            }
        }
    }
    return startLoop;
}
StyleAnimator.ProcessMouseEventEnd = function(styleAction, obj, type) {
    var startLoop = false;
    var i, saTriggers = styleAction.arrInterruptTriggers;
    for (i = 0; i < saTriggers.length; i++) {
        if (saTriggers[i][0] == obj && saTriggers[i][1] == type) {
            var j, actions = styleAction.arrActions;
            for (j = 0; j < actions.length; j++) {
                if (actions[j].state == 'ActionIn' && saTriggers[i][2] == true) {//if allowActionToComplete
                    if (saTriggers[i][3] = true) actions[j].state = 'ActionInOutReverse';
                    else actions[j].state = 'ActionInOutRevert';
                }
                else if (actions[j].state == 'ActionIn' || actions[j].state == 'ActionInDone') {
                    if (saTriggers[i][3] = true) actions[j].state = 'ActionReverse'; //if reverse 
                    else actions[j].state = 'ActionRevert';
                    startLoop = true;
                }
            }
        }
    }
    return startLoop;
}
StyleAnimator.Animate = function() {
    StyleAnimator.isLoopActive = false;
    var isReloop = false;
    var i, j, arrSA = StyleAnimator.arrStyleActions;
    for (i = 0; i < arrSA.length; i++) {
        var Actions = arrSA[i].arrActions;
        for (j = 0; j < Actions.length; j++) {
            var state = Actions[j].state;
            if (state != 'ActionOff') {
                if (state == 'ActionIn') isReloop = StyleAnimator.animateActionIn(Actions[j]);
                else if (state == 'ActionInOutReverse') isReloop = StyleAnimator.animateActionInOut(Actions[j], true);
                else if (state == 'ActionInOutRevert') isReloop = StyleAnimator.animateActionInOut(Actions[j], false);
                else if (state == 'ActionReverse') isReloop = StyleAnimator.animateActionOut(Actions[j],true);
                else if (state == 'ActionRevert') isReloop = StyleAnimator.animateActionOut(Actions[j],false);
                if (isReloop) StyleAnimator.isLoopActive = true;
            }
        }
    }
    if (StyleAnimator.isLoopActive)
        setTimeout("StyleAnimator.Animate()", StyleAnimator.loopTime);
}
StyleAnimator.animateActionIn = function(styleActionInfo) {
    var valToUse = '', isReloop = true;
    if (++styleActionInfo.stepCurrent >= styleActionInfo.stepTotal) {
        valToUse = styleActionInfo.endVal;
        styleActionInfo.state = 'ActionInDone';
        isReloop = false;
    }
    else if (styleActionInfo.actionType.toLowerCase().indexOf('color') > -1) {
        valToUse = getColor(styleActionInfo.startVal, styleActionInfo.endVal, styleActionInfo.stepCurrent / styleActionInfo.stepTotal);
    }
    else {
        var per = styleActionInfo.stepCurrent / styleActionInfo.stepTotal;
        var valToUse=Math.round(styleActionInfo.startVal + (per*(styleActionInfo.endVal - styleActionInfo.startVal)));
    }
    setStyleValue(styleActionInfo.actionObj, styleActionInfo.actionType, valToUse);
    return isReloop;
}
StyleAnimator.animateActionInOut = function(styleActionInfo, allowReverse) {
    var valToUse = '';
    if (++styleActionInfo.stepCurrent >= styleActionInfo.stepTotal) {
        valToUse = styleActionInfo.endVal;
        if (allowReverse) styleActionInfo.state = 'ActionReverse';
        else styleActionInfo.state = 'ActionRevert';
    }
    else if (styleActionInfo.actionType.toLowerCase().indexOf('color') > -1) {
        valToUse = getColor(styleActionInfo.startVal, styleActionInfo.endVal, styleActionInfo.stepCurrent / styleActionInfo.stepTotal);
    }
    else {
        var per = styleActionInfo.stepCurrent / styleActionInfo.stepTotal;
        var valToUse=Math.round(styleActionInfo.startVal + (per*(styleActionInfo.endVal - styleActionInfo.startVal)));
    }
    setStyleValue(styleActionInfo.actionObj, styleActionInfo.actionType, valToUse);
    return true;
}
StyleAnimator.animateActionOut = function(styleActionInfo, allowReverse) {
    if (!allowReverse)
        styleActionInfo.stepCurrent = 1;
    var valToUse = '', isReloop = true;
    if (--styleActionInfo.stepCurrent <= 0) {
        valToUse = styleActionInfo.startVal;
        styleActionInfo.state = 'Off';
        isReloop = false;
    }
    else if (styleActionInfo.actionType.toLowerCase().indexOf('color') > -1) {
        valToUse = getColor(styleActionInfo.startVal, styleActionInfo.endVal, styleActionInfo.stepCurrent / styleActionInfo.stepTotal);
    }
    else {
        var per = styleActionInfo.stepCurrent / styleActionInfo.stepTotal;
        var valToUse=Math.round(styleActionInfo.startVal + (per*(styleActionInfo.endVal - styleActionInfo.startVal)));
    }
    setStyleValue(styleActionInfo.actionObj, styleActionInfo.actionType, valToUse);
    return isReloop;
}
StyleAnimator.ResetAll = function() {
    var i, arrSA = StyleAnimator.arrStyleActions;
    for (i = 0; i < arrSA.length; i++) { arrSA[i].ResetState(); }    
}
function setStyleValue(obj, styleType, styleValue) {
   if (styleType == 'left') obj.style.left = styleValue + 'px';
   else if (styleType == 'top') obj.style.top = styleValue + 'px';
   else if (styleType == 'height') obj.style.height = styleValue + 'px';
   else if (styleType == 'width') obj.style.width = styleValue + 'px';
   else if (styleType == 'color') obj.style.color = '#' + styleValue;
   else if (styleType == 'backgroundColor') obj.style.backgroundColor = '#' + styleValue;
   else if (styleType == 'opacity') SetOpacity(obj, styleValue);
}
/************************/
function styleActionInfo(actionObj, actionType, startVal, endVal, actionTime) {
    this.actionObj = actionObj;
    this.actionType = actionType;
    this.startVal = startVal;
    this.endVal = endVal;
    this.actionTime = actionTime;
    this.state = 'Off';
    this.stepCurrent = 0;
    this.stepTotal = Math.round(actionTime / StyleAnimator.loopTime);
}
/************************/
function styleAction() {
    this.isEnabled = true;
    this.arrActions = new Array();
    this.arrActionTriggers = new Array();
    this.arrInterruptTriggers = new Array();
    StyleAnimator.arrStyleActions.push(this);
}
/* the actions to execute */
styleAction.prototype.AddAction = function(styleActionInfo) {this.arrActions.push(styleActionInfo);}
/* the trigger that starts the actions */
styleAction.prototype.AddActionTrigger = function(triggerObj, eventName, addChildNodes) {
    if (RegisterEventHandler(triggerObj, eventName, StyleAnimator.ProcessMouseEvent)) {
        this.arrActionTriggers.push(new Array(triggerObj, eventName));
        if (addChildNodes) {
            var length = triggerObj.childNodes.length, i;
            for (i=0; i < length; i++) { this.AddActionTrigger(triggerObj.childNodes[i], eventName, addChildNodes); }
        }
    }
}
/* the trigger that ends the actions and optionally starts the interrupt Actions */
styleAction.prototype.AddInterruptTrigger = function(triggerObj, eventName, addChildNodes, allowActionToComplete, allowReverse) {
    if (RegisterEventHandler(triggerObj, eventName, StyleAnimator.ProcessMouseEvent)) {
        this.arrInterruptTriggers.push(new Array(triggerObj, eventName, allowActionToComplete, allowReverse));
        if (addChildNodes) {
            var length = triggerObj.childNodes.length, i;
            for (i=0; i < length; i++) { this.AddInterruptTrigger(triggerObj.childNodes[i], eventName, addChildNodes, allowActionToComplete, allowReverse);}
        }
    }
}
/* reset the state. this is called for toggles when isEnabled was set to false on an ActionIn state*/
styleAction.prototype.ResetState = function() {
    var i, length = this.arrActions.length;
    for (i = 0; i < length; i++) {
        this.arrActions[i].state = 'Off';
        this.arrActions[i].stepCurrent = 0;
    }
}


/************************************************* MovieAnimator ****************************************************************/
if (!window.MovieAnimator)
    MovieAnimator = new Object();
MovieAnimator.arrMovieActions = new Array();
MovieAnimator.loopTime = 40;

MovieAnimator.Animate = function() {
    var reAnimate = false, i, arrMovieActions = MovieAnimator.arrMovieActions;
    for (i = 0; i < arrMovieActions.length; i++)
    {
        var ma = arrMovieActions[i];
        if (ma.currentState == 2)//fadein
        {
            if (ma.currentStateTime >= ma.arrActions[ma.currentIndex].fadeInTime) {
                ma.currentState++;
                ma.currentStateTime = 0;
                SetOpacity(ma.arrActions[ma.currentIndex].actionObj, 100);
                reAnimate = true;
            } else {
                var op = parseInt(ma.currentStateTime / ma.arrActions[ma.currentIndex].fadeInTime * 100)
                SetOpacity(ma.arrActions[ma.currentIndex].actionObj, op);
            }
        }
        if (ma.currentState == 3 && ma.currentStateTime >= ma.arrActions[ma.currentIndex].displayTime)//display
        {
            ma.currentState++;
            ma.currentStateTime = 0;
            reAnimate = true;
        }
        if (ma.currentState == 4)//fadeOut
        {
            if (ma.currentStateTime >= ma.arrActions[ma.currentIndex].fadeOutTime) {
                ma.currentStateTime = 0;
                ma.currentState = 2;
                ma.LoadNextImage();
                SetOpacity(ma.arrActions[ma.currentIndex].actionObj, 0);
                reAnimate = true;
            } else {
                var op = 100 - parseInt(ma.currentStateTime / ma.arrActions[ma.currentIndex].fadeOutTime * 100);
                SetOpacity(ma.arrActions[ma.currentIndex].actionObj, op);
            }
        }
    }
    if (reAnimate)
        setTimeout("MovieAnimator.Animate()", StyleAnimator.loopTime);
}
/* movieAction is fed to the movie animator */
function movieAction(containerObj, pauseContainer) {
    this.currentStateTime = 0;
    this.currentState = 0; /* 0=stop, 1=pause, 2=fadeIn, 3=display, 4=fadeout */
    this.currentIndex = 0;
    
    this.containerObj = containerObj;
    this.pauseContainer = pauseContainer;
    this.arrActions = new Array();
    //add to the movieAnimator
    MovieAnimator.arrMovieActions.push(this);
}
movieAction.prototype.trigger_clickHandler = function(e) {
    var obj, type;
    if (window.event) {
        obj = event.srcElement;
        type = event.type;
    } else { //for firefox
        obj = e.target;
        type = e.type;
    }
    var arrActions = this.arrActions;
    for (i = 0; i < arrActions.length; i++) {
        if (arrActions[i].triggerObj = obj) {
            this.currentImageTime = 0;
            this.currentIndex = i;
        }
    }
}
movieAction.prototype.LoadNextImage = function() {
    if (this.currentIndex >= 0 && this.currentIndex < this.arrActions.length)
        this.containerObj.removeChild(this.arrActions[this.currentIndex].actionObj);
    if (this.currentIndex + 1 < this.arrActions.length)
        this.currentIndex++;
    else
        this.currentIndex = 0;
    if (this.currentIndex >= 0 && this.currentIndex < this.arrActions.length)
        this.containerObj.appendChild(this.arrActions[this.currentIndex].actionObj);
}
movieAction.prototype.LoadImage = function(index) {
    if (index >= 0 && index < this.arrActions.length) {
        if (this.currentIndex >= 0 && this.currentIndex < this.arrActions.length)
            this.containerObj.removeChild(this.arrActions[this.currentIndex].actionObj);
        this.currentIndex = index;
        this.containerObj.appendChild(this.arrActions[this.currentIndex].actionObj);
    }
}
/* add an action to the sequence*/
movieAction.prototype.AddActionInfoSequence = function(movieActionInfo) { 
    if (movieActionInfo.displayTime > 0) {
        this.arrActions.push(movieActionInfo);
        if (movieActionInfo.triggerObj)
            addEventHandler(movieActionInfo.triggerObj, 'click', this.trigger_clickHandler);
    }
}
/* used to represent an movie action */
function movieActionInfo(actionObj, triggerObj, fadeInTime, displayTime, fadeOutTime) {
    this.actionObj = actionObj;
    this.triggerObj = triggerObj;
    this.fadeInTime = fadeInTime;
    this.displayTime = displayTime;
    this.fadeOutTime = fadeOutTime;
}

/************************************************* Helper ****************************************************************/
/* 0=IE 1=firefox 2=chrome 3=opera 4=unknown */
function getBrowserEnum() {
    var bro=navigator.userAgent.toLowerCase();
    if (bro.indexOf("msie") != -1) return 0;
    else if (bro.indexOf("firefox") != -1) return 1;
    else if (bro.indexOf("chrome") != -1) return 2;
    else if (bro.indexOf("opera") != -1) return 3;
    else return 4;
}
//var browserEnum = getBrowserEnum();
/***** add an event handler *****/
function RegisterEventHandler(obj, eventName, eventHandler) {
    if (obj.nodeType == 1) { //make sure its an element
        if (obj.addEventListener)
            obj.addEventListener(eventName,eventHandler,true);
        else
            obj.attachEvent('on' + eventName,eventHandler);
        return true;
    }
    return false;
}
/****** color helper ******/
function hex2dec(hex){return(parseInt(hex,16));}
function dec2hex(dec){return (dec < 16 ? '0' : '') + dec.toString(16);} 
/* percent is between 0 and 1 */
function getColor(start, end, percent) {
	var r1=hex2dec(start.slice(0,2));
	var g1=hex2dec(start.slice(2,4));
	var b1=hex2dec(start.slice(4,6));
	var r2=hex2dec(end.slice(0,2));
	var g2=hex2dec(end.slice(2,4));
	var b2=hex2dec(end.slice(4,6));
	var r=Math.floor(r1+(percent*(r2-r1)) + .5);
	var g=Math.floor(g1+(percent*(g2-g1)) + .5);
	var b=Math.floor(b1+(percent*(b2-b1)) + .5);
	return(dec2hex(r) + dec2hex(g) + dec2hex(b));
}
/* change the opacity */
function SetOpacity(obj, iOpacity)  {
    if (iOpacity > 100) iOpacity = 100; 
    else if (iOpacity < 0) iOpacity = 0; 
    obj.style.filter = "alpha(opacity=" + iOpacity + ")";
    obj.style.opacity = parseFloat(iOpacity / 100);
    
}


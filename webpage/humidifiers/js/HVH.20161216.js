var useFadeEffects = jQuery.support.opacity;
/* */

$(".skvControllnk").click(function (e) {
    $("#banTab_control").trigger("click");
});
/* the collapsible panels */
var collapse = new fnCollapsiblePanels();
function fnCollapsiblePanels() {
    /* panels*/
    var isWorking = false;
    $("div.cPanel > h4").on({
        click: function (e) {
            if (isWorking)
                return false;
            else {
                isWorking = true;
                var con = $(this).parent();
                if (con.hasClass("cPanelClosed")) { /* open */
                    con.addClass("cPanelOpen");
                    con.find(".cPanelBody").slideDown(300, function () {
                        con.removeClass("cPanelClosed");
                        isWorking = false;
                    });
                }
                else { /* close */
                    con.find(".cPanelBody").slideUp(300, function () {
                        con.removeClass("cPanelOpen").addClass("cPanelClosed");
                        isWorking = false;

                    });
                }
            }
        }
    });
};
/* the tab pages */
var tabPages = new fnTabPages(useFadeEffects);
function fnTabPages(useFadeEffects) {
    var useEff = useFadeEffects;
    /* the outer page */
    $(".bannerTabs > li").click(function (e) {
        var $this = $(this);
        var id = $this.prop("id").split("_");
        if (!$this.hasClass("banActive")) {
            /* get the selector */
            var selectorOut = "div.topbanner > div";
            var selectorIn = "div.topbanner > div#topbanner_" + id[1];
            
            /* */
            if (useEff) {
                $(selectorOut).fadeOut(150);
                $(selectorIn).fadeIn(300);
            }
            else {
                $(selectorOut).hide();
                $(selectorIn).show();
            }
            /* the group header tops */
            var tabTops = $(".bannerTabsTop > li");
            tabTops.removeClass("banActiveTop");
            tabTops.parent().find("#" + $this.prop("id") + "_top").addClass("banActiveTop");
            /* the group header */
            $this.parent().find(".banActive").addClass("banNotActive").removeClass("banActive");
            $this.addClass("banActive").removeClass("banNotActive");
            /* thr group title */
            $("#bodyHeading").find(".prodDetail").text("- " + $this.find("> h4").text());
            /* inner page groups */
            var innerPage = $("#innerPageGrp");
            var innerPageDivs = innerPage.find("> div");
            /* make absolute to create fade effect */
            innerPageDivs.hide();
            var inDiv = innerPage.find("#" + id[1]);
            innerPage.find("#" + id[1] + "_dtl").hide();
            inDiv.show(200, function (e) {
                innerPage.find("#" + id[1] + "_dtl, #ms_pAll").show();
            });
        }
    });

}
var popupPDF = new fnPopupPDF();
function fnPopupPDF() {
    /* initialize */
    (function initiliaze() {
        $(".popper").on("mouseenter", mouseEnterPDF);
    })();

    var popTarget = null;
    var isPopping = false;
    function mouseEnterPDF(e) {
        if (isPopping)
            return;
        isPopping = true;
        var $t = $(e.target);
        if ($t.hasClass(e.target.id + "_pop")) return;
        if (popTarget != null) closePopup();
        $t.addClass(e.target.id + "_pop");
        $t.next().slideDown(150, function () { isPopping = false; });
        popTarget = $t;
        /* add close popup handler */
        $(document).on("mousemove", mouseoverPopPDF);
    };
    var arrMO = ["pdf_bro", "pop_bro", "pdf_instr", "pop_instr2", "video", "pop_video"];
    function mouseoverPopPDF(e) {
        //alert("dd");
        var srcEl = e.target, id;
        for (var el = 0; el < 7; el++) {
            id = srcEl.id;
            if (id != "") {
                for (var i = 0; i < arrMO.length; i++) {
                    if (id == arrMO[i]) { e.stopPropagation(); return; }
                }
            }
            srcEl = srcEl.parentNode;
            if (srcEl == null)
                break;
        }
        closePopup(e);
    };
    function closePopup(e) {
        $(document).off("mousemove", mouseoverPopPDF);
        popTarget.removeClass(popTarget.prop("id") + "_pop");
        popTarget.next().slideUp(100);
        popTarget = null;
        if (e) e.stopPropagation();
        isPopping = false;
    }
};

$(document).ready(function () {
    $('#distrotionTrigger').click(function () { $('#banTab_distribution').click(); })
    $('#hygienicTrigger').click(function () { $('#banTab_hygienicAndEfficient').click(); })
});



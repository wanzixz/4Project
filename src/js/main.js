/**
 * zl 2018-04-19
 */
$(function () {
  function fastClick() {
    var supportTouch = function () {
      try {
        document.createEvent("TouchEvent");
        return true;
      } catch (e) {
        return false;
      }
    }();
    var _old$On = $.fn.on;

    $.fn.on = function () {
      if (/click/.test(arguments[0]) && typeof arguments[1] == 'function' && supportTouch) { // 只扩展支持touch的当前元素的click事件
        var touchStartY, callback = arguments[1];
        _old$On.apply(this, ['touchstart', function (e) {
          touchStartY = e.changedTouches[0].clientY;
        }]);
        _old$On.apply(this, ['touchend', function (e) {
          if (Math.abs(e.changedTouches[0].clientY - touchStartY) > 10) return;

          e.preventDefault();
          callback.apply(this, [e]);
        }]);
      } else {
        _old$On.apply(this, arguments);
      }
      return this;
    };
  }
  function preload() {
    $(window).on("load", function () {
      var imgList = [
        "./images/layers/content.png",
        "./images/layers/navigation.png",
        "./images/layers/popout.png",
        "./images/layers/transparent.gif"
      ];
      for (var i = 0, len = imgList.length; i < len; ++i) {
        new Image().src = imgList[i];
      }
    });
  }
  function androidInputBugFix() {
    // .container 设置了 overflow 属性, 导致 Android 手机下输入框获取焦点时, 输入法挡住输入框的 bug
    // 相关 issue: https://github.com/weui/weui/issues/15
    // 解决方法:
    // 0. .container 去掉 overflow 属性, 但此 demo 下会引发别的问题
    // 1. 参考 http://stackoverflow.com/questions/23757345/android-does-not-correctly-scroll-on-input-focus-if-not-body-element
    //    Android 手机下, input 或 textarea 元素聚焦时, 主动滚一把
    if (/Android/gi.test(navigator.userAgent)) {
      window.addEventListener('resize', function () {
        if (document.activeElement.tagName == 'INPUT' || document.activeElement.tagName == 'TEXTAREA') {
          window.setTimeout(function () {
            document.activeElement.scrollIntoViewIfNeeded();
          }, 0);
        }
      })
    }
  }



  function init() {
    fastClick();
    androidInputBugFix();
  }
  // 初始化
  init();

  /*selector*/
  !function (t) { function n(n) { return n = t(n), !(!n.width() && !n.height()) && "none" !== n.css("display") } function e(t, n) { t = t.replace(/=#\]/g, '="#"]'); var e, r, i = s.exec(t); if (i && i[2] in o && (e = o[i[2]], r = i[3], t = i[1], r)) { var u = Number(r); r = isNaN(u) ? r.replace(/^["']|["']$/g, "") : u } return n(t, e, r) } var r = t.zepto, i = r.qsa, u = r.matches, o = t.expr[":"] = { visible: function () { return n(this) ? this : void 0 }, hidden: function () { return n(this) ? void 0 : this }, selected: function () { return this.selected ? this : void 0 }, checked: function () { return this.checked ? this : void 0 }, parent: function () { return this.parentNode }, first: function (t) { return 0 === t ? this : void 0 }, last: function (t, n) { return t === n.length - 1 ? this : void 0 }, eq: function (t, n, e) { return t === e ? this : void 0 }, contains: function (n, e, r) { return t(this).text().indexOf(r) > -1 ? this : void 0 }, has: function (t, n, e) { return r.qsa(this, e).length ? this : void 0 } }, s = new RegExp("(.*):(\\w+)(?:\\(([^)]+)\\))?$\\s*"), c = /^\s*>/, a = "Zepto" + +new Date; r.qsa = function (n, u) { return e(u, function (e, o, s) { try { var h; !e && o ? e = "*" : c.test(e) && (h = t(n).addClass(a), e = "." + a + " " + e); var f = i(n, e) } catch (d) { throw console.error("error performing selector: %o", u), d } finally { h && h.removeClass(a) } return o ? r.uniq(t.map(f, function (t, n) { return o.call(t, n, f, s) })) : f }) }, r.matches = function (t, n) { return e(n, function (n, e, r) { return !(n && !u(t, n) || e && e.call(t, null, r) !== t) }) } }(Zepto);
  /*手势*/
  !function (t) { function e(t) { return "tagName" in t ? t : t.parentNode } function n(t, e, n, i) { var o = Math.abs(t - e), r = Math.abs(n - i); return o >= r ? t - e > 0 ? "Left" : "Right" : n - i > 0 ? "Up" : "Down" } function i() { d = null, u.last && (u.el.trigger("longTap"), u = {}) } function o() { d && clearTimeout(d), d = null } function r() { a && clearTimeout(a), s && clearTimeout(s), c && clearTimeout(c), d && clearTimeout(d), a = s = c = d = null, u = {} } var a, s, c, d, u = {}, l = 750; t(document).ready(function () { var f, h; t(document.body).bind("touchstart", function (n) { f = Date.now(), h = f - (u.last || f), u.el = t(e(n.touches[0].target)), a && clearTimeout(a), u.x1 = n.touches[0].pageX, u.y1 = n.touches[0].pageY, h > 0 && 250 >= h && (u.isDoubleTap = !0), u.last = f, d = setTimeout(i, l) }).bind("touchmove", function (t) { o(), u.x2 = t.touches[0].pageX, u.y2 = t.touches[0].pageY, Math.abs(u.x1 - u.x2) > 10 && t.preventDefault() }).bind("touchend", function () { o(), u.x2 && Math.abs(u.x1 - u.x2) > 30 || u.y2 && Math.abs(u.y1 - u.y2) > 30 ? c = setTimeout(function () { u.el.trigger("swipe"), u.el.trigger("swipe" + n(u.x1, u.x2, u.y1, u.y2)), u = {} }, 0) : "last" in u && (s = setTimeout(function () { var e = t.Event("tap"); e.cancelTouch = r, u.el.trigger(e), u.isDoubleTap ? (u.el.trigger("doubleTap"), u = {}) : a = setTimeout(function () { a = null, u.el.trigger("singleTap"), u = {} }, 250) }, 0)) }).bind("touchcancel", r), t(window).bind("scroll", r) }), ["swipe", "swipeLeft", "swipeRight", "swipeUp", "swipeDown", "doubleTap", "tap", "singleTap", "longTap"].forEach(function (e) { t.fn[e] = function (t) { return this.bind(e, t) } }) }(Zepto);
  /*toast,dialog*/
  !function (a) { "use strict"; a.fn.transitionEnd = function (a) { function e(f) { if (f.target === this) for (a.call(this, f), c = 0; c < b.length; c++)d.off(b[c], e) } var c, b = ["webkitTransitionEnd", "transitionend", "oTransitionEnd", "MSTransitionEnd", "msTransitionEnd"], d = this; if (a) for (c = 0; c < b.length; c++)d.on(b[c], e); return this }, a.support = function () { var a = { touch: !!("ontouchstart" in window || window.DocumentTouch && document instanceof window.DocumentTouch) }; return a }(), a.touchEvents = { start: a.support.touch ? "touchstart" : "mousedown", move: a.support.touch ? "touchmove" : "mousemove", end: a.support.touch ? "touchend" : "mouseup" }, a.getTouchPosition = function (a) { return a = a.originalEvent || a, "touchstart" === a.type || "touchmove" === a.type || "touchend" === a.type ? { x: a.targetTouches[0].pageX, y: a.targetTouches[0].pageY } : { x: a.pageX, y: a.pageY } }, a.fn.scrollHeight = function () { return this[0].scrollHeight }, a.fn.transform = function (a) { var b, c; for (b = 0; b < this.length; b++)c = this[b].style, c.webkitTransform = c.MsTransform = c.msTransform = c.MozTransform = c.OTransform = c.transform = a; return this }, a.fn.transition = function (a) { var b, c; for ("string" != typeof a && (a += "ms"), b = 0; b < this.length; b++)c = this[b].style, c.webkitTransitionDuration = c.MsTransitionDuration = c.msTransitionDuration = c.MozTransitionDuration = c.OTransitionDuration = c.transitionDuration = a; return this }, a.getTranslate = function (a, b) { var c, d, e, f; return "undefined" == typeof b && (b = "x"), e = window.getComputedStyle(a, null), window.WebKitCSSMatrix ? f = new WebKitCSSMatrix("none" === e.webkitTransform ? "" : e.webkitTransform) : (f = e.MozTransform || e.OTransform || e.MsTransform || e.msTransform || e.transform || e.getPropertyValue("transform").replace("translate(", "matrix(1, 0, 0, 1,"), c = f.toString().split(",")), "x" === b && (d = window.WebKitCSSMatrix ? f.m41 : 16 === c.length ? parseFloat(c[12]) : parseFloat(c[4])), "y" === b && (d = window.WebKitCSSMatrix ? f.m42 : 16 === c.length ? parseFloat(c[13]) : parseFloat(c[5])), d || 0 }, a.requestAnimationFrame = function (a) { return window.requestAnimationFrame ? window.requestAnimationFrame(a) : window.webkitRequestAnimationFrame ? window.webkitRequestAnimationFrame(a) : window.mozRequestAnimationFrame ? window.mozRequestAnimationFrame(a) : window.setTimeout(a, 1e3 / 60) }, a.cancelAnimationFrame = function (a) { return window.cancelAnimationFrame ? window.cancelAnimationFrame(a) : window.webkitCancelAnimationFrame ? window.webkitCancelAnimationFrame(a) : window.mozCancelAnimationFrame ? window.mozCancelAnimationFrame(a) : window.clearTimeout(a) }, a.fn.join = function (a) { return this.toArray().join(a) } }($), +function (a) { "use strict"; var e, c = function (b, c) { var e, f; c = c || "", a("<div class='weui_mask_transparent'></div>").appendTo(document.body), e = '<div class="weui_toast ' + c + '">' + b + "</div>", f = a(e).appendTo(document.body), f.show(), f.addClass("weui_toast_visible") }, d = function () { a(".weui_mask_transparent").hide(), a(".weui_toast_visible").removeClass("weui_toast_visible").transitionEnd(function () { a(this).remove() }) }; a.toast = function (a, b) { var f; "cancel" == b ? f = "weui_toast_cancel" : "forbidden" == b && (f = "weui_toast_forbidden"), c('<i class="weui_icon_toast"></i><p class="weui_toast_content">' + (a || "已经完成") + "</p>", f), setTimeout(function () { d() }, e.duration) }, a.showLoading = function (a) { var d, b = '<div class="weui_loading">'; for (d = 0; 12 > d; d++)b += '<div class="weui_loading_leaf weui_loading_leaf_' + d + '"></div>'; b += "</div>", b += '<p class="weui_toast_content">' + (a || "数据加载中") + "</p>", c(b, "weui_loading_toast") }, a.hideLoading = function () { d() }, e = a.toast.prototype.defaults = { duration: 2e3 } }($), +function (a) { "use strict"; var b; a.modal = function (c) { var d, e, f, g; c = a.extend({}, b, c), d = c.buttons, e = d.map(function (a) { return '<a href="javascript:;" class="weui_btn_dialog ' + (a.className || "") + '">' + a.text + "</a>" }).join(""), f = '<div class="weui_dialog"><div class="weui_dialog_hd"><strong class="weui_dialog_title">' + c.title + "</strong></div>" + (c.text ? '<div class="weui_dialog_bd">' + c.text + "</div>" : "") + '<div class="weui_dialog_ft">' + e + "</div>" + "</div>", g = a.openModal(f), g.find(".weui_btn_dialog").each(function (b, e) { var f = a(e); f.click(function () { c.autoClose && a.closeModal(), d[b].onClick && d[b].onClick() }) }) }, a.openModal = function (b) { var d, c = a("<div class='weui_mask'></div>").appendTo(document.body); return c.show(), d = a(b).appendTo(document.body), d.show(), c.addClass("weui_mask_visible"), d.addClass("weui_dialog_visible"), d }, a.closeModal = function () { a(".weui_mask_visible").removeClass("weui_mask_visible").transitionEnd(function () { a(this).remove() }), a(".weui_dialog_visible").removeClass("weui_dialog_visible").transitionEnd(function () { a(this).remove() }) }, a.alert = function (c, d, e) { return "function" == typeof d && (e = arguments[1], d = void 0), a.modal({ text: c, title: d, buttons: [{ text: b.buttonOK, className: "primary", onClick: e }] }) }, a.confirm = function (c, d, e, f) { return "function" == typeof d && (f = arguments[2], e = arguments[1], d = void 0), a.modal({ text: c, title: d, buttons: [{ text: b.buttonCancel, className: "default", onClick: f }, { text: b.buttonOK, className: "primary", onClick: e }] }) }, a.prompt = function (c, d, e, f) { return "function" == typeof d && (f = arguments[2], e = arguments[1], d = void 0), a.modal({ text: "<p class='weui-prompt-text'>" + (c || "") + "</p><input type='text' class='weui_input weui-prompt-input' id='weui-prompt-input'/>", title: d, buttons: [{ text: b.buttonCancel, className: "default", onClick: f }, { text: b.buttonOK, className: "primary", onClick: function () { e && e(a("#weui-prompt-input").val()) } }] }) }, b = a.modal.prototype.defaults = { title: "提示", text: void 0, buttonOK: "确定", buttonCancel: "取消", buttons: [{ text: "确定", className: "primary" }], autoClose: !0 } }($);
  //toptips
  +function ($) {
    "use strict"; var timeout; $.toptips = function (text, duration, type) {
      if (!text) return; if (typeof duration === typeof "a") { type = duration; duration = undefined; }
      var duration = duration || 3000; var className = type ? type : 'weui_warn'; var $t = $('.weui_toptips').remove(); $t = $('<div class="weui_toptips"></div>').appendTo(document.body); $t.html(text); $t[0].className = 'weui_toptips ' + className
      clearTimeout(timeout); if (!$t.hasClass('weui_toptips_visible')) { $t.show().width(); $t.addClass('weui_toptips_visible'); }
      timeout = setTimeout(function () { $t.remove(); }, duration);
    }
  }($);
  //actions
  +function ($) {
    "use strict"; var defaults; var show = function (params) {
      var mask = $("<div class='weui_mask weui_actions_mask'></div>").appendTo(document.body); var actions = params.actions || []; var actionsHtml = actions.map(function (d, i) { return '<div class="weui_actionsheet_cell ' + (d.className || "") + '">' + d.text + '</div>'; }).join(""); var titleHtml = ""; if (params.title) { titleHtml = '<div class="weui_actionsheet_title">' + params.title + '</div>'; }
      var tpl = '<div class="weui_actionsheet " id="weui_actionsheet">' +
        titleHtml + '<div class="weui_actionsheet_menu">' +
        actionsHtml + '</div>' + '<div class="weui_actionsheet_action">' + '<div class="weui_actionsheet_cell weui_actionsheet_cancel">取消</div>' + '</div>' + '</div>'; var dialog = $(tpl).appendTo(document.body); dialog.find(".weui_actionsheet_menu .weui_actionsheet_cell, .weui_actionsheet_action .weui_actionsheet_cell").each(function (i, e) { $(e).click(function () { $.closeActions(); params.onClose && params.onClose(); if (actions[i] && actions[i].onClick) { actions[i].onClick(); } }) }); mask.show(); dialog.show(); mask.addClass("weui_mask_visible"); dialog.addClass("weui_actionsheet_toggle"); $(".weui_mask,.weui_actionsheet").removeAttr("style");
    }; var hide = function () { $(".weui_mask").removeClass("weui_mask_visible").transitionEnd(function () { $(this).remove(); }); $(".weui_actionsheet").removeClass("weui_actionsheet_toggle").transitionEnd(function () { $(this).remove(); }); }
    $.actions = function (params) { params = $.extend({}, defaults, params); show(params); }
    $.closeActions = function () { hide(); }
    $(document).on("tap click", ".weui_actions_mask", function () { $.closeActions(); }); var defaults = $.actions.prototype.defaults = { title: undefined, onClose: undefined, }
  }($);
  ; (function ($) {
    $.fn.searchBar = function (options) {
      options = $.extend({ focusingClass: 'weui_search_focusing', searchText: "搜索", cancelText: "取消" }, options); var html = '<div class="weui_search_bar">' +
        '<form class="weui_search_outer"><div class="weui_search_inner"><i class="weui_icon_search"></i><input type="search" class="weui_search_input" id="weui_search_input" placeholder="' + options.searchText + '" required/>' +
        '<a href="javascript:" class="weui_icon_clear"></a></div><label for="weui_search_input" class="weui_search_text"><i class="weui_icon_search"></i><span>' + options.searchText + '</span></label></form>' +
        '<a href="javascript:" class="weui_search_cancel">' + options.cancelText + '</a></div>'; var $search = $(html); this.append($search); const $searchBar = this.find('.weui_search_bar'); const $searchText = this.find('.weui_search_text'); const $searchInput = this.find('.weui_search_input'); this.on('focus', '#weui_search_input', function () { $searchText.hide(); $searchBar.addClass(options.focusingClass); bindEvent($searchInput, 'onfocus', options); }).on('blur', '#weui_search_input', function () { $searchBar.removeClass(options.focusingClass); !!$(this).val() ? $searchText.hide() : $searchText.show(); bindEvent($searchInput, 'onblur', options); }).on('touchend', '.weui_search_cancel', function () { $searchInput.val(''); bindEvent($searchInput, 'oncancel', options); }).on('touchend', '.weui_icon_clear', function (e) {
          e.preventDefault(); $searchInput.val(''); if (document.activeElement.id != 'search_input') { $searchInput.trigger('focus'); }
          bindEvent($searchInput, 'onclear', options);
        }).on('input', '.weui_search_input', function () { bindEvent($searchInput, 'input', options); }).on('submit', '.weui_search_outer', function () { if (typeof (options.onsubmit) == 'function') { bindEvent($searchInput, 'onsubmit', options); return false; } }); function bindEvent(target, event, options) { if (typeof (options[event]) == 'function') { var value = $(target).val(); options[event].call(target, value); } }
    };
  })($);
  (function () {
    function _validate($input) {
      var input = $input[0], val = $input.val(); if (input.tagName == "INPUT" || input.tagName == "TEXTAREA") { var reg = input.getAttribute("required") || input.getAttribute("pattern") || ""; if (!$input.val().length) { return "empty"; } else if (reg) { return new RegExp(reg).test(val) ? null : "notMatch"; } else { return null; } }
      else if (input.getAttribute("type") == "checkbox" || input.getAttribute("type") == "radio") { return input.checked ? null : "empty"; } else if (val.length) { return null; }
      return "empty";
    }
    function _showErrorMsg(error) { if (error) { var $dom = error.$dom, msg = error.msg, tips = $dom.attr(msg + "Tips") || $dom.attr("tips") || $dom.attr("placeholder"); if (tips) $.toptips(tips); $dom.parents(".weui_cell").addClass("weui_cell_warn"); } }
    var oldFnForm = $.fn.form; $.fn.form = function () { return this.each(function (index, ele) { var $form = $(ele); $form.find("[required]").on("blur", function () { var $this = $(this), errorMsg; if ($this.val().length < 1) return; errorMsg = _validate($this); if (errorMsg) { _showErrorMsg({ $dom: $this, msg: errorMsg }); } }).on("focus", function () { var $this = $(this); $this.parents(".weui_cell").removeClass("weui_cell_warn"); }); }); }; $.fn.form.noConflict = function () { return oldFnForm; }; var oldFnValidate = $.fn.validate; $.fn.validate = function (callback) { return this.each(function () { var $requireds = $(this).find("[required]"); if (typeof callback != "function") callback = _showErrorMsg; for (var i = 0, len = $requireds.length; i < len; ++i) { var $dom = $requireds.eq(i), errorMsg = _validate($dom), error = { $dom: $dom, msg: errorMsg }; if (errorMsg) { if (!callback(error)) _showErrorMsg(error); return; } } callback(null); }); };
    $.fn.validate.noConflict = function () { return oldFnValidate; };
  })(); (function ($) { var oldFnTab = $.fn.tab; $.fn.tab = function (options) { options = $.extend({ defaultIndex: 0, activeClass: 'weui_bar_item_on', onToggle: $.noop }, options); const $tabbarItems = this.find('.weui_tabbar_item, .weui_navbar_item'); const $tabBdItems = this.find('.weui_tab_bd_item'); this.toggle = function (index) { const $defaultTabbarItem = $tabbarItems.eq(index); $defaultTabbarItem.addClass(options.activeClass).siblings().removeClass(options.activeClass); const $defaultTabBdItem = $tabBdItems.eq(index); $defaultTabBdItem.show().siblings().hide(); options.onToggle(index); }; const self = this; this.on('click', '.weui_tabbar_item, .weui_navbar_item', function (e) { const index = $(this).index(); self.toggle(index); }); this.toggle(options.defaultIndex); return this; }; $.fn.tab.noConflict = function () { return oldFnTab; }; })($);
  $(function () {
    var weixinimg = []; var weixinsrc = []; weixinimg = $('.weixin'); for (var i = 0; i < weixinimg.length; i++) { weixinsrc[i] = weixinimg[i].src; }; $('.weixin').click(function () { var index = $('.weixin').index(this); wx.previewImage({ current: weixinsrc[index], urls: weixinsrc }); });
  });





});

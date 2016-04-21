
/*
                     init  |  succeed


 : 处理 img
 【source】 data-lazy-img     [ 路径 | done] source


    ////////////////////内部 不可变参数
 : 处理 ajax
    data-lazyload-path [ 0   |   done ]


 : 处理 function [只能是 img 标签]
    data-lazyload-fn   [ 0   |   done]
*/

!function(){
    var Lazyload=function(element , options){
        var _this=this,
            $lays=null,
            _size=null,
            _sourceInstall=null;

        _this.el = $(element);
        var _op=_this.options=  $.extend({}, Lazyload.DEFAULTS, options || {});
        var dom="IMG";
        if ("img" == _op.type) {
            //并且 给 this.el 元素 添加 install 元素 表示 模块安装了 懒加载
            "img" == _op.type && ("data-lazy-path" == _op.source && (_op.source = "data-lazy-img"),
                _sourceInstall = _op.source + "-install");
            if (dom = "IMG",
                    $lays = $("img[" + _op.source + "][" + _op.source + "!=done]", _this.el),
                    _size = $lays.length,
                    !_size){
                return !1
            }
        } else{
            "fn" == _op.type && (dom = _op.source);
        }
        var main= function(){
            var $lay = "img" == _op.type ?  $("img[" + _op.source + "][" + _op.source + "!=done]", _this.el) :"fn" == _op.type ? $(dom, _this.el) :"js" == _op.type &&　_this.el;
            _size=$lay.size();

            var _scrollTop = $(document).scrollTop();
            var _scrollTopWin = _scrollTop+$(window).height()+_op.space;
            $.each($lay, function () {
                var $this = $(this);

                var _source = null;
                if (("js" == _op.type || "img" == _op.type) && (_source = $this.attr(_op.source)/*,console.log(_op.type+ " |"+_source)*/),
                    _source || "fn" == _op.type || "img" == _op.type){
                    var _getTop = _this.getTop($this);

                    /*
                     * 当元素 offsetTop 大于 0 [ _getTop > 0 ]
                     * 并且 元素 个数大于 0    [  _size > 0 ]
                     * 元素的底部 进入 屏幕    [  _scrollTop - $this.outerHeight() ]
                     * 元素的头部进入头部      [  _scrollTopWin > _getTop ]
                     * */
                    //console.log((_getTop > 0).toString() +" , "+ ( _size > 0).toString()+" , "+(_getTop > _scrollTop - $this.outerHeight()).toString()+" , "+ (_scrollTopWin > _getTop).toString());
                    //console.log(_scrollTopWin +" | "+_getTop);

                    if(_getTop > 0 && _size > 0 && _getTop > _scrollTop - $this.outerHeight() && _scrollTopWin > _getTop){
                        var _SourcePath;
                        "img" == _op.type ? (_SourcePath = $this.attr(_op.source),"done" != _SourcePath ? (_this.loadImg($this, _SourcePath, _op),
                            _size -= 1) : "done" == _SourcePath && (_size -= 1)) : "js" == _op.type ?  _this.loadJs($this,_source, function() {
                            _size -= 1
                        }) : "fn" == _op.type && _this.loadFn($this, _op, function() {
                            _size -= 1
                        })
                    }

                }
            });
            //当 img的 个数已经不存在的时候 ,表示这一次 函数域 内的 懒加载 结束
            _size || ("img" == _op.type && _sourceInstall && _this.el.removeAttr(_sourceInstall),
                $(window).unbind("scroll", _lazyload),
                $(window).unbind("resize", _lazyload))

        };

        var l = setTimeout(main , 0)
        var _lazyload = function(){

            l && clearTimeout(l),
                l = setTimeout(main, _op.delay)
        };


        "img"==_op.type && "1" != _this.el.attr(_sourceInstall) && (_this.el.attr(_sourceInstall, 1)),
        "fn" == _op.type && _op.source.attr("data-lazyload-fn", "0"),
        "js" == _op.type && _this.el.attr("data-lazyload-js", "0"),
            $(window).bind("scroll", _lazyload),
            $(window).bind("resize", _lazyload);



    };

    Lazyload.DEFAULTS={
        type: "img",
        source: "data-lazy-path",
        init: "data-lazy-init", //模块化 参数 名
        delay: 100,   //
        space: 100,   //容错空间
        onchange: null ,
        placeholderClass: "loading-style",
        errorClass: "err-poster",
        blankImgUrl:"../../images/share/bank.gif"
    };

    //loadImg
    /**
     *  $that : 当前元素
     *  _SourcePath : url
     *  _op:     参数表
     *
     * */
    Lazyload.prototype.loadImg = function ($that, _SourcePath, _op) {
        //console.log(_SourcePath)
        !$that.attr("src") && _SourcePath && /*($that.attr("src", _op.blankImgUrl),
         $that.addClass(_op.placeholderClass)),*/
        $that.attr("src", _SourcePath),
            $that.attr(_op.source, "done"),
        _SourcePath || $that.attr("src") || $that.attr("src", _op.blankImgUrl),
        _SourcePath && ($that[0].onerror = function() {
                $that.attr("src", _op.blankImgUrl).removeClass(_op.placeholderClass).addClass(_op.errorClass)
            },
                $that[0].onload = function() {
                    $that.removeClass(_op.placeholderClass)
                }
        ),
        $.isFunction(_op.onchange) && _op.onchange.call(this)
    };


    //loadFn
    /**
     *  $that : 当前元素
     *  _op:     参数表
     *  fn :    内置函数
     * */
    Lazyload.prototype.loadFn= function ($that, _op, _fn) {
        "0" == $that.attr("data-lazyload-fn") && ($that.attr("data-lazyload-fn", "done"),
            _fn(),
        _op.onchange && _op.onchange($that))
    };


    //loadJs
    /**
     * $that : 当前元素
     *  _url : url
     *
     *
     * */
    Lazyload.prototype.loadJs= function ($that,_url, d) {
        var _this=this,_op=_this.options;
        //console.log(_url)
        if(_url){
            $.ajax({
                url: _url,
                dataType: "script",
                cache: !0,
                success:function(){
                    "0" == $that.attr("data-lazyload-js") && $that.attr("data-lazyload-js", "done"),

                    $.isFunction(_op.onchange) && _op.onchange.call()
                }
            }),d()
        }else{
            $.error("ajax 路径不存在")

        }


    };


    //Utils
    Lazyload.prototype.getTop=function(a) {
        /* var b = a.offsetTop;
         if (null  != a.parentNode) {
         var c = a.offsetParent;
         console.log( a.parentNode)
         console.log(c)

         for (; null  != c; )
         b += c.offsetTop,
         c = c.offsetParent
         }
         return b*/
        return a.offset().top
    };

    // LOADIMG PLUGIN DEFINITION
    // =====================

    function Plugin(option) {
        //每次调用 的时候 生成 相对自己的 缓存数组
        return new Lazyload(this , option)

    }

    $.fn.lazyload             = Plugin;
    $.fn.lazyload.Constructor = Lazyload;

}(jQuery);
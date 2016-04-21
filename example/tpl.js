$.get("tpl/index.html",function(da){
    $("#con2").append($(da)[0]).lazyload({
        blankImgUrl:"../../images/share/loading.gif"
    });
});

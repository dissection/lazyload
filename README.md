# lazyload

## options
                 
**type** [`string`]  
    加载的类型  
    [`defult`] ："img"+

**source** [`string`]  
    标签内 source 路劲  
    [`defult`] ："data-lazy-path"

**delay** [`number`]  
   当触发 scroll resize 事件的时候 ,每次执行 加载的 间隔时间  
    [`defult`] ：100
    
**space** [`number`]  
    如果为0， 的时候 卷入距离 + 屏幕 高度 +space ，来判断是否进入屏幕需要加载  
    [`defult`] ：100
    
**onchange** [`function`]  
    每次加载后 触发的回调  
    [`defult`] ：null
    
**errorClass** [`string`]  
    当没有加载成功的时候给当前元素添加的类  
    [`defult`] ："err-poster"
    
**blankImgUrl** [`string`]  
    当出错时候 所显示的备用图片  
    [`defult`] ：null
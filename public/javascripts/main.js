//=====================================================================================
// 顶部导航面板
function load_header_nav()
{
    $("header .nav_header_panel").click(function(){    // 顶部导航面板打开、关闭的切换
        if($(this).hasClass("panel_open")){
            $(".header_panel .popover").css({display: "none"});
            $(this).removeClass("panel_open");
        }else{
            $(".header_panel .popover").css({display: "inherit"});
            $(this).addClass("panel_open");
        }
    });
}

// 页面右下角导航
function reg_page_nav()
{
    var open = $(this).hasClass("circle_open");    // 是否有 open class
    if(open){
        $(".nav_page li a").each(function(i){
           if($(this).attr("title") != $("#nav_page_icon").attr("title")){
               $(this).css("visibility", "hidden");
           };
        });
        $(this).removeClass("circle_open");    // 移除 open class
        $(this).children().addClass("fa-plus-square")
            .removeClass("fa-minus-square");
    }else{
        $(".nav_page li a").each(function(i){
           if($(this).attr("title") != $("#nav_page_icon").attr("title")){
               $(this).css("visibility", "inherit");
           };
        });
        $(this).addClass("circle_open");    // 添加 open class
        $(this).children().addClass("fa-minus-square")
            .removeClass("fa-plus-square");
    }
}
function load_page_nav()
{
    var h = 60, w = 80, r = 80, start = 200, all = 125, eh = 27, ew = 25;    // 圆心位置 、 半径 、 起始角度、 旋转总角度 、 元素高度和宽度
    var n = $(".nav_page li a").length - 1;
    $(".nav_page li a").each(function (i){
        if(i == n){
            $(this).css({position: "fixed", bottom: h-27/2+"px", right: w-25/2+"px"});
            return;
        }
        var ele = $(this);
        var theta = (start-i/(n-1)*all)/180*Math.PI;
        ele.css({position: "fixed", bottom: (h+r*Math.sin(theta)-eh/2)+"px", right: (w-r*Math.cos(theta)-ew/2)+"px"});
        $(this).css("visibility", "hidden");
    });
}
$(document).ready(function(){
    // 顶部导航
    load_header_nav();
    
    // 右下角导航代码
    load_page_nav();
    $("#nav_page_icon").click(reg_page_nav);
    
    // $("html").niceScroll({autohidemode:"scroll", mousescrollstep: 10});    // 右侧滚动条
    //scroll_bar_header = $(".header_panel .metro_card").niceScroll({autohidemode: true, iframeautoresize: false});    // 鼠标 hove 显示/消失
});


//=====================================================================================
// 图片欣赏 - 右侧图片栏
var img_xinshang_gallery = img_xinshang_gallery || [];    // 
var img_xinshang_index = 0;    //

$(document).ready(function(){
    if(typeof img_xinshang != 'undefined' && img_xinshang === true){
        $.get("/img-xinshang", function(msg){
            if(msg.error){
                return;
            }
            img_xinshang_gallery = msg.objects;
            var imgs = "";
            for(ii = 0; ii < img_xinshang_gallery.length; ii++){
                imgs += "<a class='btn btn-link '><img class='img-circle' src = '/uploads/image/" + img_xinshang_gallery[ii].name + "'index='"+ ii +"'></a>"
            }
            $(".img_xinshang .nav_sitemap").html(imgs);
        });
        
        $(".img_xinshang button").click(function(msg){
            var link = $(this);
            $.get("/img-xinshang?nskip="+img_xinshang_gallery.length+"&n=8", function(msg){
                if(msg.error){
                    return;
                }
                another = msg.objects;
                if(another.length == 0){
                    link.text('已经加载完了 ... ').attr("disabled", "disabled");
                }
                var imgs = "";
                for(ii = 0; ii < another.length; ii++){
                    imgs += "<a class='btn btn-link '><img class='img-circle' src = '/uploads/image/" + another[ii].name + "'index='"+ img_xinshang_gallery.length +"'></a>"
                    img_xinshang_gallery.push(another[ii]);
                }
                $(".img_xinshang .nav_sitemap").append(imgs);
            });
        });
    }
    $(document).on("click", ".gallery_modal img", function(){
        var index = +$(this).attr("index");
        var url = $(this).attr("src");
        show_img_info(index, url);
    });
    
    function show_img_info(index, url){
        if(typeof img_xinshang_gallery != 'undefined' && img_xinshang_gallery && img_xinshang_gallery[index] && img_xinshang_gallery[index].info){
            $("#img_label").text(img_xinshang_gallery[index].info.name);
            $("#img_footer").text(img_xinshang_gallery[index].info.intro);
        }else{
            $("#img_label").text('图片名称 ： ');
            $("#img_footer").text('图片介绍：');
        }
        $("#img_body").html("<img img_id= '" + img_xinshang_gallery[index]._id + "' src=' "+ url + "'><span></span>");
        
        $("#img_modal").modal("show");
    }
    
    // 左移 、 右移 、 放大 、 缩小
    $(".img_left").click(function(){
        --img_xinshang_index;
        if(img_xinshang_index < 0){
            img_xinshang_index = img_xinshang_gallery.length-1;
        }
        var url = $(".gallery_modal img[index="+img_xinshang_index+"]").attr("src");
        show_img_info(img_xinshang_index, url);
    });
    
    $(".img_right").click(function(){
        ++img_xinshang_index;
        if(img_xinshang_index >= img_xinshang_gallery.length){
            img_xinshang_index = 0;
        }
        var url = $(".gallery_modal img[index="+img_xinshang_index+"]").attr("src");
        show_img_info(img_xinshang_index, url);
    });
    
    $(".img_bigger").click(function(){
         img = $("#img_body img");
         $(img).height($(img).height()*1.1);
    });
    $(".img_smaller").click(function(){
         img = $("#img_body img");
         $(img).height($(img).height()*0.9);
    });
    
});

function wookmark_img()
{
    var gbks = gbks || {};
    var options ={offset: 2,container: $('#notes_list')};
    var handler = $('#notes_list li');
    
    gbks.jQueryPlugin = function() { 
      this.init = function() {
        $(window).resize($.proxy(this.resize, this));
        this.resize();
      };
      this.resize = function() {
        handler.wookmark(options);
      };
    };
    $(document).ready(function(){
      instance = new gbks.jQueryPlugin();
      instance.init();
      setTimeout(function(){
        handler.wookmark(options);
      },10);
    });
}

function wookmark_load()
{
    if(typeof other_user == 'undefined' || !other_user){
        return;
    }
    wookmark_finished = false;
    wookmark_loading = false;
    
    $(document).bind("scroll", function(event){
        var closeToBottom = ($(window).scrollTop() + $(window).height() > $(document).height() - 100);
        if(closeToBottom && !wookmark_finished && !wookmark_loading){
            wookmark_loading = true;    // 设置数据在加载
            $.get("/get-one-page-of-images?user_id="+ other_user._id +"&nskip="+(img_xinshang_gallery.length)+"&n=4", function(msg){
                if(msg.error){
                    return;
                }
                var another = msg.objects;
                if(another.length == 0){
                    wookmark_finished = true;
                    return;
                }
                for(ii = 0; ii < another.length; ii++){
                    $("#notes_list").append('<li><a class="btn btn-link"><img src="/uploads/image/'+ another[ii].name +'" index="'+ img_xinshang_gallery.length +'"></a></li>');
                    img_xinshang_gallery.push(another[ii]);
                }
                setTimeout(function(){
                    wookmark_img();
                }, 5);
                wookmark_loading = false;
            });
        }
    });
}
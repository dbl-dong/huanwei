var cWidth,cHeight,scale;
var scaleObj;
var isTouch='ontouchstart' in document.documentElement?true:false;
var ua=navigator.userAgent.toLocaleLowerCase();
var isWeiXin=(ua.indexOf('micromessenger')>-1)?true:false; 
var isQQ=(ua.indexOf('qq/')>-1)?true:false;
var isAndroid=(ua.indexOf('android')>-1||ua.indexOf('linux') > -1 )?true:false;
var isX5=ua.indexOf('tbs/') > -1; 
var touchStartEvent=isTouch?'touchstart':'mousedown';
var touchMoveEvent=isTouch?'touchmove':'mousemove';
var touchEndEvent=isTouch?'touchend':'mouseup';

var swiper;
var swipers = [];
var pageIndex = 0;
var swiperData = [[494,264,843,38],[488,259,1500,50],[498,263,2750,49],[488,258,4650,50],[499,267,5920,48]];
var videoData = [[504,267,3383,50],[494,267,4017,50]];
var canvas = $("#kuaishan")[0];
var ctx = canvas.getContext("2d");
var nextPage = $(".next-page");
var prevPage = $(".prev-page");
var pages = $("body>.page");
var first = $(".first");
var page1 = $(".page1");
var page2 = $(".page2");
var backBtn = $(".back-btn");
var swiperContainers = $(".page2 .swiper-container");
var page2Videos = $(".page2-video");
var fontlist = $(".fontlist");
var playBtn = $(".play-btn");
var videos = $("video");

var projectName="huanwei"; 
window.onerror=function(msg,url,line){
	alert(msg+'\n '+url+'\n '+line);
	//return true;
};

set_weixin_share(init); 
function changePath(path){
    ("pushState"in history)&&history.pushState(null,"",path);
}
function set_weixin_share(fn){
    if(!('startWebCount' in window)){
	    fn&&fn();
	    return;
    }
    startWebCount(projectName,'main');
    cg2.wx.title="好久不见！希望你还没有忘了内刊这回事......";
    cg2.wx.imgUrl="http://h5.shmds.com/"+projectName+"/images/share.jpg";
    cg2.wx.desc="Emmmm....这是一期间隔的有点久的内刊，为什么呢，点击见详情！"; 
    cg2.wx.link="http://h5.shmds.com/"+projectName;
    var shareComplete=function(){
	        var _c=cg2.wx;  
			wx.onMenuShareTimeline({ 
					title: _c.title,
					link: _c.link,
					imgUrl: _c.imgUrl,
					success: function () {
						startWebCount(projectName,'ShareTimeline');
					},
					cancel: function () {}
				});
				wx.onMenuShareAppMessage({
					title:_c.title,
					desc:_c.desc,
					link:_c.link,
					imgUrl:_c.imgUrl,
					type:_c.type,
					dataUrl:_c.dataUrl,
					success:function(){
						startWebCount(projectName,'ShareAppMessage');
					},
					cancle:function(){}
				});
				wx.onMenuShareQQ({
					title: _c.title,
					desc: _c.desc,
					link: _c.link,
					imgUrl: _c.imgUrl,
					success: function () {
					   startWebCount(projectName,'ShareQQ');
					},
					cancel: function () {}
				});
    };
    loadJS({"src":"/php/wechat.php","flag":true,"cb":function(){
	    wx.ready(shareComplete); 
	    fn&&fn();
    }}); 
} 

function init(){
	if(!('localStorage' in window)){
		alert('暂不支持当前浏览器！');
		return;
	}
	scaleObj = $(".scale");
	initEvent();
	var firstImgs = $(".first img,.page1 img,.page2 img");
	syncLoadImg(firstImgs,function(){
		!(function playBgm(){
			if(bgmSound) {
				bgmSound.play();
			} else {
				setTimeout(playBgm,100);
			}
		})();
		$(".first").fadeIn(400);
		swiper = new Swiper('.swiper-container-first', {
	        spaceBetween:30,
	        autoplay:true,
	        effect: 'fade',
	    });
		startKuaishan();
	});
}

function initEvent(){
	initUI();
	window.onresize = initUI;

	prevPage.bind("click",function(){
		if(pageIndex == 2||pageIndex == 1) {
			pageIndex--;
			pages.eq(pageIndex).fadeIn(400);
			pages.eq(pageIndex+1).fadeOut(400);
			if(pageIndex==0) {
				swiper = new Swiper('.swiper-container-first', {
			        spaceBetween:30,
			        autoplay:true,
			        effect: 'fade',
			    });
			}
		}
	});

	nextPage.bind("click",function(){
		if(pageIndex == 0||pageIndex == 1) {
			pageIndex++;
			pages.eq(pageIndex).fadeIn(400);
			pages.eq(pageIndex-1).fadeOut(400);
			if(pageIndex==2) {
				setTimeout(function(){	
					if(!swipers[0]) {		
					    for(var i = 0;i < swiperContainers.length;i++){
					    	swipers[i] = new Swiper('.swiper-container'+(i+1), {
						        spaceBetween: 30,
						        autoplay:true,
						        effect: 'fade',
						        pagination: {
						       		el: '.swiper-pagination'+(i+1),
						        	clickable: true,
						        },
						        navigation: {
						        	nextEl: '.swiper-button-next'+(i+1),
						        	prevEl: '.swiper-button-prev'+(i+1),
						        },
						        observe:true,
						        observeParents:true,
						    });
					    }
					}
				},400);
			}
		}
	});

	playBtn.bind("click",function(){
		$(this).hide();
		var video = $(this).parent().find("video");
		video.show();
		video[0].play();
		video[0].controls = true;
	});

	videos.bind("play",function(){
		bgmSound.pause();
	});

	videos.bind("pause",function(){
		if(videos[0].paused&&videos[1].paused) {
			bgmSound.play();
		}
	});
}

function initUI(){
	cWidth = $(window).width();
	cHeight = $(window).height();

	if(cWidth/cHeight>591/960) {
		scale = cHeight/960;
	} else {
		scale = cWidth/591;
	}
	scaleObj.css({"transform":"scale("+scale+") translate(-50%,-50%)"});

	// 调整page2上元素的缩放比例
	scale2 = cWidth/591;
	for(var i = 0;i < swiperData.length;i++) {
		var no = swiperData[i];
		swiperContainers.eq(i).css({"width":scale2*no[0]+"px","height":no[1]*scale2+"px","top":scale2*no[2]+"px","left":scale2*no[3]+"px"});
	}
	for(var i = 0;i < videoData.length;i++) {
		var no = videoData[i];
		page2Videos.eq(i).css({"width":scale2*no[0]+"px","height":no[1]*scale2+"px","top":scale2*no[2]+"px","left":scale2*no[3]+"px"});
	}
	fontlist.css({"height":250*scale2+"px","top":scale2*6588+"px"});

}

function KuaiShan(){
	 this.opacity=1;
     this.scale=1;
	 this.rotate=0;
	 this.x=0;
	 this.y=0;
	 this.xx=0;
	 this.yy=0;
	 this.txt="";   	 
}
KuaiShan.prototype.update=function(){
	//var size=ctx.measureText(this.txt);
	if(this.opacity==0) return;
	var xx=290+this.x+this.xx;
	var yy=681+this.y+this.yy;
		
	ctx.save();
	ctx.globalAlpha=this.opacity;
	ctx.translate(xx,yy);
	ctx.rotate(this.rotate);
	ctx.scale(this.scale,this.scale);
	ctx.fillText(this.txt,0,0);
	ctx.restore();

	
};
function getStringArr(str){
	return str.replace(/(.)(?=[^$])/g,"$1,").split(",");
}
function startKuaishan(){
	// var canvas=kuaishan[0];
	ctx=canvas.getContext('2d');
	ctx.font="62px font";
	ctx.fillStyle="#ffffff";
	ctx.textBaseline="middle"; 
	ctx.textAlign="center";
	var timelines=[
	                
	    //             [1000,'Emmmmm...','writeIn',100,false,2000,false,0,0,'writeOut'], 	
     //                [3000,'这是一期','scaleIn',600,false,2000,false,0,0,'rotateOut'],  
     //                [4500,'反思','horizontalIn',600,false,2000,false,-65*0.5,-40,'horizontalOut'],
     //                [5000,'为什么','horizontalIn',600,false,2000,false,65*1.5*0.5,40,'horizontalOut',true],					
				 //    [6500,'断刊','horizontalIn'  ,600,false,2000,false,-65*0.5,-40,'horizontalOut'],	
     //                [7000,'那么久','horizontalIn',600,false,2000,false,65*1.5*0.5,40,'horizontalOut',true],
					// [8000,'的内刊','scaleIn',600,false,2000,false,0,0,'rotateOut'],
     //                [9000,'...'    ,'writeIn',100,false,2000,false,0,0,'writeOut'], 

                    [1000,'2019','scaleIn',600,false,2000,false,0,0,'rotateOut'], 	
                    [2500,'爱你！','horizontalIn',600,false,2000,false,-65*0.5,-40,'horizontalOut'],
                    [3000,'永久！','horizontalIn',600,false,2000,false,65*1.5*0.5,40,'horizontalOut',true],	
				    [4500,'先送上','horizontalIn'  ,600,false,2000,false,-65*0.5,-40,'horizontalOut'],	
                    [5000,'鄙人','horizontalIn',600,false,2000,false,65*1.5*0.5,40,'horizontalOut',true],
					[6000,'直白且肤浅的','scaleIn',600,false,2000,false,0,0,'rotateOut'],
                    [7000,'问候！','scaleIn',600,false,2000,false,0,0,'rotateOut',true],
                    [8000,'每逢年末','scaleIn',600,false,2000,false,0,0,'rotateOut'],
                    [9000,'便是大家','writeIn',100,false,2000,false,0,0,'writeOut'], 
                    [10300,'最忙的时候，','scaleIn',600,false,2000,false,0,0,'rotateOut'], 
                   				
                   				
					[1000+10500,'有人问我','horizontalIn',600,false,2000,false,-65*0.5,-40,'horizontalOut'],
					[1500+10500,'为什么','horizontalIn',600,false,2000,false,65*1.5*0.5,40,'horizontalOut',true],  
					[3000+10500,'半年','horizontalIn',600,false,2000,false,-65*0.5,-40,'horizontalOut'],  
					[3500+10500,'不在学校出没？','horizontalIn',600,false,2000,false,65*1.5*0.5,40,'horizontalOut',true], 
					
					
					[1000+14000,'你转行了？','scaleIn',600,false,2000,false,0,0,'rotateOut',true],  
					[2000+14000,'忙什么呢？','scaleIn',600,false,2000,false,0,0,''],
					[3000+14000,'实在是','scaleIn',600,false,2000,false,0,0,'rotateOut',true],
					[4000+14000,'一言难尽！','scaleIn',600,false,2000,false,0,0,''],
					[5000+14000,'往下看呗！','writeIn',100,false,2000,false,0,0,'writeOut'],
					[6100+14000,'请慢慢','horizontalIn',600,false,2000,false,-65*1.5*0.5,-40,'horizontalOut'],
					[6600+14000,'开始欣赏吧！','horizontalIn',600,false,2000,false,65*2*0.5,40,'horizontalOut',true],   
					
					
					
	];
	//自动处理时间轴间隔
	var delay=1000;
	for(var i=0;i<timelines.length;i++){
		var data=timelines[i];
		var type=data[2];
		var hideType=data[9];
		var txt=data[1];
		data[0]-=1000;  
		data[5]=data[0];
		var arr=getStringArr(txt);
		if(type.indexOf('write')<0) data[5]+=900; 
		else data[5]+=data[3]*arr.length+100;
		if(hideType.indexOf('write')>=0) data[5]+=data[3]*arr.length*0.5; 
		
	}
	
	var clock,time=0,count=0;
    var scenes=[];
	for(var i=0;i<timelines.length;i++){
		scenes[i]=new KuaiShan();
	}

	var initKuaishan=function(){
		 for(var j=0;j<timelines.length;j++){
			 timelines[j][4]=false;
			 var obj=scenes[j];
			 obj.opacity=1;
			 obj.scale=1;
			 obj.rotate=0;
			 obj.x=0;
			 obj.y=0;
			 obj.xx=0;
			 obj.yy=0;
			 obj.txt=""; 
		 }  
	}; 
	var isFocus=true;
	window.addEventListener('focus',function(){
		 clock=Date.now();      
		 isFocus=true;
		 //console.log('focus');
	});
	window.addEventListener('blur',function(){
		isFocus=false;
		//console.log('blur');
	});
	var render=function(){
		kuaishan_timer=requestAnimationFrame(render);	
		if(!isFocus) return;  
		ctx.clearRect(0,0,canvas.width,canvas.height);
		TWEEN.update();
		if(!clock){
			clock=Date.now();
		}else{
			var newClock=Date.now();
			time+=newClock-clock;
			clock=newClock;
			for(var i=0;i<timelines.length;i++) scenes[i].update();
			for(var i=0;i<timelines.length;i++){
				var data=timelines[i];
				var showTime=data[0];
				var txt=data[1];
				var type=data[2];
				var speed=data[3];
				var isShow=data[4];
				var hideTime=data[5];
				var isHide=data[6];
				var xx=data[7];
				var yy=data[8];
				var hideType=data[9];
				var isReverse=data[10]?-1:1;
				var kuaishan_obj=scenes[i];
				var invokeAnimation=function(type,isHideAnimation){
					var delay=speed*(isHideAnimation?0.5:1);
					isReverse*=isHideAnimation?-1:1;
					if(type=="writeIn"){
						  var obj={percent:0}; 
						  var texts=getStringArr(txt);
						  new TWEEN.Tween(obj).to({percent:1},texts.length*delay).onUpdate(function(){
							  var arr=texts.slice(0,parseInt(obj.percent*texts.length));
							  kuaishan_obj.txt=arr.join('');
							  kuaishan_obj.opacity=1;							  
						  }).start();
					}else if(type=="writeOut"){ 
						  var obj={percent:0};
						  var texts=getStringArr(txt);
						  new TWEEN.Tween(obj).to({percent:1},texts.length*delay).onUpdate(function(){
							  var arr=texts.slice(0,parseInt((1-obj.percent)*texts.length));
							  kuaishan_obj.txt=arr.join('');
							  kuaishan_obj.opacity=1;	 						  
						  }).start();
					}else if(type=="scaleIn"){
						 var from_scale=data[10]?2:0;
						 kuaishan_obj.scale=from_scale;
						 new TWEEN.Tween(kuaishan_obj).to({scale:1,opacity:1},delay).easing(TWEEN.Easing.Cubic.Out).start();
					}else if(type=="scaleOut"){
						 kuaishan_obj.opacity=1;
						 var from_scale=data[10]?2:1;
						 var to_scale=data[10]?1:2; 
						 kuaishan_obj.scale=from_scale;
						 new TWEEN.Tween(kuaishan_obj).to({scale:to_scale,opacity:0},delay).easing(TWEEN.Easing.Cubic.Out).start();
					}else if(type=="rotateIn"){
						 kuaishan_obj.rotate=-Math.PI*isReverse;
						 new TWEEN.Tween(kuaishan_obj).to({rotate:0,opacity:1},delay).easing(TWEEN.Easing.Cubic.Out).start();
					}else if(type=="rotateOut"){
						 kuaishan_obj.opacity=1;
						 kuaishan_obj.rotate=0;  
						 new TWEEN.Tween(kuaishan_obj).to({rotate:-Math.PI*isReverse,opacity:0},delay).easing(TWEEN.Easing.Cubic.Out).start();
					}else if(type=="verticalIn"){
						 kuaishan_obj.y=-50*isReverse;
						 new TWEEN.Tween(kuaishan_obj).to({y:0,opacity:1},delay).easing(TWEEN.Easing.Cubic.Out).start();
					}else if(type=="verticalOut"){
						 kuaishan_obj.opacity=1;
						 new TWEEN.Tween(kuaishan_obj).to({y:50*isReverse,opacity:0},delay).easing(TWEEN.Easing.Cubic.Out).start();
					}else if(type=="horizontalIn"){
						 kuaishan_obj.x=-50*isReverse; 
						 new TWEEN.Tween(kuaishan_obj).to({x:0,opacity:1},delay).easing(TWEEN.Easing.Cubic.Out).start();
					}else if(type=="horizontalOut"){
						 kuaishan_obj.opacity=1;
						 new TWEEN.Tween(kuaishan_obj).to({x:50*isReverse,opacity:0},delay).easing(TWEEN.Easing.Cubic.Out).start();
					}
				};
				if(time>=showTime&&!isShow){
					data[4]=true;
					//console.log(type+"===>"+txt);
					if(type!="writeIn") kuaishan_obj.txt=txt;
					kuaishan_obj.xx=xx;
					kuaishan_obj.yy=yy;
					invokeAnimation(type);
					 break;
				}else if(time>=hideTime&&!isHide){
						data[6]=true;
						if(hideType) invokeAnimation(hideType,true);
						kuaishan_obj.opacity=0; 
						count++;
						if(count>=timelines.length){ 
                           setTimeout(function(){
                              for(var j=0;j<timelines.length;j++){
								 time=0;
								 timelines[j][4]=false; 
								 timelines[j][6]=false;
								 TWEEN.removeAll();
								 initKuaishan();
							  }  
							   count=0;  
						   },600); 
                        }						
				}
			}
			
		}

		//console.log('loop');
	};
	render();
}

function syncLoadImg(imgs,completeFn,progressFn){
    var imgs_loaded=0;
     //预加载所有图片（去除重复）
    var max=imgs.length;
    if(max==0) completeFn&&completeFn();	
    var loadImg=function(index){
     var obj=imgs.eq(index);
     var tp=obj.attr('tp');
     var url=obj.attr('url');
	 //index++;
     if(url){
		 getAllLinks(['images/'+url],function(links){
			  imgs_loaded++;
			  var lnk=links[0];
			  if(tp=='bg'){
				   if(lnk.indexOf('blob')>-1) obj.parent().addClass('blob').attr('blob',lnk);
				   obj.attr('src',lnk).removeAttr('tp').removeAttr('url').addClass('hide').parent().css({'background-image':'url('+lnk+')'}).attr('blob',lnk);
              }else{
				   obj.attr('src',lnk).removeAttr('url');
				   if(lnk.indexOf('blob')>-1) obj.addClass('blob').attr('blob',lnk);
				  /*
				  if(isX5&&url.indexOf('qrcode.jpg')<0){   
					  var canvas=document.createElement('canvas');
					  var ctx=canvas.getContext('2d');
					  var img=obj[0];
					  canvas.width=img.width;
					  canvas.height=img.height; 
					  canvas.className=img.className;
					  canvas.style.display=img.style.display;
					  ctx.drawImage(img,0,0); 
					  obj.parent().append(canvas);
					  obj.parent()[0].insertBefore(canvas,obj[0]);
     				  obj.remove();           					  
				  }
				  */
			  }
			  if(imgs_loaded==max){
				  completeFn&&completeFn();
			  }else{
				    progressFn&&progressFn(imgs_loaded/(max));
			  }
			  //if(index<max) loadImg();
		 });
	 }else{
		 //loadImg(); 
	 }
   };
   for(var i=0;i<imgs.length;i++){
	   loadImg(i); 
   }
   //loadImg();
}
function getUrlArgument(name){
	var search=location.search.split('?')[1]||'';
	var arr=search.split('&');
	for(var i in arr){
	 var cArr=arr[i].split('=');
	 if(cArr[0]==name) return cArr[1];
	}
	return '';
}
function loadImages(imgs,completeCallBack,progressCallBack){
    var loaded=0;
    if(imgs){
        var load=function(file){
            var img=new Image();
            img.onload=function(){
                loaded++;
                //hideImage.appendChild(this);
                if(progressCallBack) progressCallBack((loaded+1)/(imgs.length+1));
                if(loaded==imgs.length&&completeCallBack) completeCallBack();
                return true;
            };
            img.onerror=function(){
                var re=load(file);
                if(re) loaded++;
                console.log('Failed to load '+img.currentSrc);
                return false;
            };
            img.src='images/'+file;
        }
        for(var i=0;i<imgs.length;i++){
            load(imgs[i]);
        }
    }else if(completeCallBack)  completeCallBack();
}
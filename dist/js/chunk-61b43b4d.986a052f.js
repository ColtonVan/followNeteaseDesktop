(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-61b43b4d"],{"0e7b":function(t,e,n){"use strict";n("4085")},4085:function(t,e,n){},8173:function(t,e,n){"use strict";n.r(e);var c=n("5530"),a=(n("b0c0"),n("7db0"),n("d81d"),n("4d90"),n("caad"),n("2532"),n("7a23")),i=Object(a["R"])("data-v-77605732");Object(a["w"])("data-v-77605732");var s={class:"pb-5 d-flex"},r={class:"flex-grow-1"},l={class:"d-flex align-items-center"},u=Object(a["i"])("div",{class:"MusicListTag rounded flex-center me-2"},"歌单",-1),o={class:"fs-3 fw-bold canSelect text-ellipsis flex-grow-1",style:{width:"0"}},d={class:"d-flex align-items-center mt-3"},b={class:"me-3 cursor-pointer"},j={class:"text-muted"},O={class:"mt-4"},p={class:"mt-4"},f={class:"me-3"},m=Object(a["h"])("歌曲："),v={class:"text-black-50"},k=Object(a["h"])("播放："),h={class:"text-black-50"},w={class:"text-muted me-3"},y={class:"me-3"};Object(a["u"])();var x=i((function(t,e,n,x,L,g){var D,M,R,B=Object(a["B"])("PlayAllListBtn"),I=Object(a["B"])("HorizontalNav"),C=Object(a["B"])("LikedIcon"),E=Object(a["B"])("HaveLikedIcon"),Y=Object(a["B"])("DownloadMusicIcon"),S=Object(a["B"])("MusicList"),U=Object(a["B"])("CommonToast");return Object(a["t"])(),Object(a["f"])(a["a"],null,[Object(a["i"])("div",s,[Object(a["i"])("img",{src:t.playListDetail.coverImgUrl,width:"190",class:"rounded-5 me-5",alt:""},null,8,["src"]),Object(a["i"])("div",r,[Object(a["i"])("div",l,[u,Object(a["i"])("div",o,Object(a["E"])(t.playListDetail.name),1)]),Object(a["i"])("div",d,[Object(a["i"])("img",{width:"35",class:"rounded-pill me-3 cursor-pointer",src:null===(D=t.playListDetail.creator)||void 0===D?void 0:D.avatarUrl,alt:""},null,8,["src"]),Object(a["i"])("a",b,Object(a["E"])(null===(M=t.playListDetail.creator)||void 0===M?void 0:M.nickname),1),Object(a["i"])("span",j,Object(a["E"])(t.YYYYMMDD(t.playListDetail.createTime))+"创建",1)]),Object(a["i"])("div",O,[Object(a["i"])(B,{musicList:t.playListDetail.tracks},null,8,["musicList"])]),Object(a["i"])("div",p,[Object(a["i"])("span",f,[m,Object(a["i"])("span",v,Object(a["E"])(t.playListDetail.trackCount),1)]),Object(a["i"])("span",null,[k,Object(a["i"])("span",h,Object(a["E"])(t.playListDetail.playCount),1)])])])]),Object(a["i"])(I,{navs:t.navs,"onUpdate:navs":e[1]||(e[1]=function(e){return t.navs=e}),class:"pb-2"},null,8,["navs"]),0===t.navs.find((function(t){return t.active})).key?(Object(a["t"])(),Object(a["f"])(S,{key:0,columns:t.columns,dataSource:null===(R=t.playListDetail.tracks)||void 0===R?void 0:R.map((function(t,e){return Object(c["a"])(Object(c["a"])({},t),{},{index:e})}))},{toolBar:i((function(e){var n=e.id,c=e.index,i=e.name;return[Object(a["i"])("span",w,Object(a["E"])(String(c+1).padStart(2,"0")),1),Object(a["i"])("span",y,[t.likedMusicList.includes(n)?(Object(a["t"])(),Object(a["f"])(E,{key:1,class:"cursor-pointer",onClick:function(e){return t.collectMusic(!1,n)},width:"15",height:"15"},null,8,["onClick"])):(Object(a["t"])(),Object(a["f"])(C,{key:0,class:"cursor-pointer",onClick:function(e){return t.collectMusic(!0,n)},width:"15",height:"15"},null,8,["onClick"]))]),Object(a["i"])(Y,{onClick:function(e){return t.handleDownloadMusic({id:n,name:i})},class:"cursor-pointer",width:"15",height:"15"},null,8,["onClick"])]})),_:1},8,["columns","dataSource"])):Object(a["g"])("",!0),Object(a["i"])(U,{ref:"toastRef"},null,512)],64)})),L=n("1da1"),g=(n("96cf"),n("a15b"),n("668f")),D=n("6c02"),M=n("87db"),R=n("5502"),B=n("54ba"),I=n("3c08"),C=n("6e21"),E=Object(a["j"])({setup:function(){var t=Object(D["c"])(),e=Object(R["b"])(),n=Object(a["x"])({columns:[{title:"",span:1,dataIndex:"toolBar",slots:{customRender:"toolBar"}},{title:"音乐标题",span:3,dataIndex:"name"},{title:"歌手",span:3,dataIndex:"ar",render:function(t){return t.map((function(t){return t.name})).join("、")}},{title:"专辑",span:2,dataIndex:"al",render:function(t){return t.name}},{title:"时长",span:1,dataIndex:"dt",render:function(t){return Object(M["f"])(t)}}],playListDetail:{coverImgUrl:"https://p1.music.126.net/jWE3OEZUlwdz0ARvyQ9wWw==/109951165474121408.jpg"},navs:[{title:"歌曲列表",active:!0,key:0},{title:Object(a["d"])((function(){return"评论(".concat(n.playListDetail.commentCount||0,")")})),key:1},{title:"收藏者",key:2}],likedMusicList:Object(a["d"])((function(){return e.state.likedMusicList})),toastRef:Object(a["y"])(null)}),i=function(){var t=Object(L["a"])(regeneratorRuntime.mark((function t(a){return regeneratorRuntime.wrap((function(t){while(1)switch(t.prev=t.next){case 0:return Object(g["a"])({id:a,t:Date.now()}).then(function(){var t=Object(L["a"])(regeneratorRuntime.mark((function t(e){return regeneratorRuntime.wrap((function(t){while(1)switch(t.prev=t.next){case 0:if(200!==e.code){t.next=9;break}return t.t0=c["a"],t.t1=Object(c["a"])({},e.playlist),t.t2={},t.next=6,Object(M["b"])(e.playlist.tracks);case 6:t.t3=t.sent,t.t4={tracks:t.t3},n.playListDetail=(0,t.t0)(t.t1,t.t2,t.t4);case 9:case"end":return t.stop()}}),t)})));return function(e){return t.apply(this,arguments)}}()),t.next=3,e.dispatch("getLikedMusicList");case 3:case"end":return t.stop()}}),t)})));return function(e){return t.apply(this,arguments)}}(),s=function(t,c){Object(B["g"])({id:c,like:t}).then(function(){var c=Object(L["a"])(regeneratorRuntime.mark((function c(a){return regeneratorRuntime.wrap((function(c){while(1)switch(c.prev=c.next){case 0:if(200!==a.code){c.next=4;break}return c.next=3,e.dispatch("getLikedMusicList");case 3:n.toastRef.success(t?"已添加到我喜欢的音乐":"取消喜欢成功");case 4:case"end":return c.stop()}}),c)})));return function(t){return c.apply(this,arguments)}}())};Object(a["L"])((function(){return t.query.id}),(function(t){i(t)}),{immediate:!0});var r=function(t){var e=t.id,c=t.name;Object(C["c"])({id:e}).then((function(t){if(200===t.code){var e=t.data;e&&e.length?Object(I["a"])(e[0].url,c).then((function(){n.toastRef.success("已添加至下载")})).catch((function(){n.toastRef.warn("下载失败")})):n.toastRef.warn("获取音乐链接失败")}}))};return Object(c["a"])(Object(c["a"])({},Object(a["F"])(n)),{},{YYYYMMDD:M["a"],collectMusic:s,handleDownloadMusic:r})}});n("0e7b");E.render=x,E.__scopeId="data-v-77605732";e["default"]=E}}]);
//# sourceMappingURL=chunk-61b43b4d.986a052f.js.map
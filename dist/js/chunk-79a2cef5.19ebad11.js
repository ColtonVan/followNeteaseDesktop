(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-79a2cef5"],{"54c5":function(t,e,a){},8173:function(t,e,a){"use strict";a.r(e);a("b0c0"),a("7db0");var c=a("7a23"),n=Object(c["P"])("data-v-55d50be5");Object(c["v"])("data-v-55d50be5");var i={class:"pb-5 d-flex"},l={class:"d-flex align-items-center"},s=Object(c["i"])("div",{class:"MusicListTag rounded flex-center me-2"},"歌单",-1),r={class:"fs-3 fw-bold canSelect"},d={class:"d-flex align-items-center mt-3"},b={class:"me-3 cursor-pointer"},u={class:"text-muted"},o={class:"mt-4"},j={class:"mt-4"},O={class:"me-3"},p=Object(c["h"])("歌曲："),v={class:"text-black-50"},f=Object(c["h"])("播放："),m={class:"text-black-50"};Object(c["t"])();var y=n((function(t,e,a,n,y,D){var L,k,w=Object(c["A"])("PlayAllListBtn"),x=Object(c["A"])("HorizontalNav"),g=Object(c["A"])("MusicList");return Object(c["s"])(),Object(c["f"])(c["a"],null,[Object(c["i"])("div",i,[Object(c["i"])("img",{src:t.playListDetail.coverImgUrl,width:"190",class:"rounded-5 me-5",alt:""},null,8,["src"]),Object(c["i"])("div",null,[Object(c["i"])("div",l,[s,Object(c["i"])("div",r,Object(c["D"])(t.playListDetail.name),1)]),Object(c["i"])("div",d,[Object(c["i"])("img",{width:"35",class:"rounded-pill me-3 cursor-pointer",src:null===(L=t.playListDetail.creator)||void 0===L?void 0:L.avatarUrl,alt:""},null,8,["src"]),Object(c["i"])("a",b,Object(c["D"])(null===(k=t.playListDetail.creator)||void 0===k?void 0:k.nickname),1),Object(c["i"])("span",u,Object(c["D"])(t.YYYYMMDD(t.playListDetail.createTime))+"创建",1)]),Object(c["i"])("div",o,[Object(c["i"])(w)]),Object(c["i"])("div",j,[Object(c["i"])("span",O,[p,Object(c["i"])("span",v,Object(c["D"])(t.playListDetail.trackCount),1)]),Object(c["i"])("span",null,[f,Object(c["i"])("span",m,Object(c["D"])(t.playListDetail.playCount),1)])])])]),Object(c["i"])(x,{navs:t.navs,"onUpdate:navs":e[1]||(e[1]=function(e){return t.navs=e}),class:"pb-2"},null,8,["navs"]),0===t.navs.find((function(t){return t.active})).key?(Object(c["s"])(),Object(c["f"])(g,{key:0,columns:t.columns,dataSource:t.playListDetail.tracks},null,8,["columns","dataSource"])):Object(c["g"])("",!0)],64)})),D=a("5530"),L=(a("a15b"),a("d81d"),a("b32d")),k=function(t){return L["a"].get("/playlist/detail",{params:t})},w=a("6c02"),x=a("87db"),g=Object(c["j"])({setup:function(){var t=Object(w["c"])(),e=Object(c["w"])({columns:[{title:"音乐标题",dataIndex:"name"},{title:"歌手",dataIndex:"ar",render:function(t){return t.map((function(t){return t.name})).join("、")}},{title:"专辑",dataIndex:"al",render:function(t){return t.name}},{title:"时长",dataIndex:"dt",render:function(t){return Object(x["d"])(t)}}],playListDetail:{},navs:[{title:"歌曲列表",active:!0,key:0},{title:Object(c["d"])((function(){return"评论(".concat(e.playListDetail.commentCount,")")})),key:1},{title:"收藏者",key:2}]}),a=function(t){k({id:t,t:Date.now()}).then((function(t){200===t.code&&(e.playListDetail=t.playlist)}))};return Object(c["K"])((function(){return t.query.id}),(function(t){a(t)}),{immediate:!0}),Object(D["a"])(Object(D["a"])({},Object(c["E"])(e)),{},{YYYYMMDD:x["a"]})}});a("a5bf");g.render=y,g.__scopeId="data-v-55d50be5";e["default"]=g},a5bf:function(t,e,a){"use strict";a("54c5")}}]);
//# sourceMappingURL=chunk-79a2cef5.19ebad11.js.map
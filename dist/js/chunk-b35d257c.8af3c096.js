(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-b35d257c"],{"10c1":function(e,t,c){},"71f5":function(e,t,c){"use strict";c.r(t);c("b0c0"),c("7db0");var i=c("7a23"),n=Object(i["P"])("data-v-1be9c71c");Object(i["v"])("data-v-1be9c71c");var o={class:"videos w-100 h-100 d-flex flex-column"},r={class:"d-flex justify-content-between align-align-items-center w-100 position-relative"},a={class:"text-muted"},s={class:"videoCats d-flex align-items-center justify-content-end text-ellipsis"},u={class:"flex-grow-1"},d={class:"container h-100"},l={class:"h-100 row d-flex flex-column align-items-center"},b={class:"h-100 col-xxl-10 containerCol"};Object(i["t"])();var p=n((function(e,t,c,n,p,f){var j=Object(i["A"])("HorizontalNav"),O=Object(i["A"])("ArrowRightIcon"),v=Object(i["A"])("VideoGroupPanel"),g=Object(i["A"])("VideoList");return Object(i["s"])(),Object(i["f"])("div",o,[Object(i["i"])(j,{navs:e.navs,"onUpdate:navs":t[1]||(t[1]=function(t){return e.navs=t})},null,8,["navs"]),Object(i["i"])("div",r,[Object(i["i"])("div",{onClick:t[2]||(t[2]=Object(i["O"])((function(t){return e.groupVisible=!e.groupVisible}),["stop"])),class:"rounded-pill border px-3 py-2 me-5 cursor-pointer my-2 flex-shrink-0 currentGroup text-center"},[Object(i["i"])("span",a,Object(i["D"])(e.groupList.find((function(t){return t.id===e.groupId})).name),1),Object(i["i"])(O,{width:"12",height:"12",class:"filter-invert-1 opacity-25 translate-y--10 ms-1"})]),Object(i["i"])(v,{onConfirm:e.confirmGroup,onClick:t[3]||(t[3]=Object(i["O"])((function(){}),["stop"])),groupId:e.groupId,"onUpdate:groupId":t[4]||(t[4]=function(t){return e.groupId=t}),visible:e.groupVisible,"onUpdate:visible":t[5]||(t[5]=function(t){return e.groupVisible=t})},null,8,["onConfirm","groupId","visible"]),Object(i["i"])("div",s,[(Object(i["s"])(!0),Object(i["f"])(i["a"],null,Object(i["y"])(e.categoryList,(function(t){return Object(i["s"])(),Object(i["f"])("span",{onClick:function(c){return e.groupId=t.id},class:[{selected:t.id===e.groupId},"videoCat rounded-pill px-3 py-1 hover-opacity text-secondary"],key:t.id},Object(i["D"])(t.name),11,["onClick"])})),128))])]),Object(i["i"])("div",u,[Object(i["i"])("div",d,[Object(i["i"])("div",l,[Object(i["i"])("div",b,[Object(i["i"])(g,{style:{"max-height":"calc(100vh - 75px - 60px - 38px - 40px - 3.3rem)"},class:"pt-5",id:e.groupId,"onUpdate:id":t[6]||(t[6]=function(t){return e.groupId=t})},null,8,["id"])])])])])])})),f=c("5530"),j=(c("d81d"),c("99af"),c("c5e7")),O=c("f7cc"),v=Object(i["j"])({setup:function(){var e=Object(i["w"])({navs:[{title:"视频",active:!0},{title:"MV"}],categoryList:[],groupId:0,groupVisible:!1,groupList:[{name:"全部视频",id:0}]});e.navs=e.navs.map((function(e,t){return Object(f["a"])(Object(f["a"])({},e),{},{key:t})}));var t=function(){Object(j["b"])().then((function(t){200===t.code&&(e.categoryList=t.data)})),Object(j["d"])().then((function(t){200===t.code&&(e.groupList=[{name:"全部视频",id:0}].concat(t.data))}))};t(),Object(O["a"])((function(){e.groupVisible=!1}));var c=function(t){e.groupId=t.id};return Object(f["a"])(Object(f["a"])({},Object(i["E"])(e)),{},{confirmGroup:c})}});c("b371");v.render=p,v.__scopeId="data-v-1be9c71c";t["default"]=v},b371:function(e,t,c){"use strict";c("10c1")}}]);
//# sourceMappingURL=chunk-b35d257c.8af3c096.js.map
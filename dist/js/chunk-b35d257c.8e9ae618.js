(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-b35d257c"],{"10c1":function(t,e,c){},"71f5":function(t,e,c){"use strict";c.r(e);c("b0c0"),c("7db0");var i=c("7a23"),n=Object(i["R"])("data-v-1be9c71c");Object(i["w"])("data-v-1be9c71c");var o={class:"videos w-100 h-100 d-flex flex-column"},r={class:"d-flex justify-content-between align-align-items-center w-100 position-relative"},a={class:"text-muted"},s={class:"videoCats d-flex align-items-center justify-content-end text-ellipsis"},u={class:"flex-grow-1"},d={class:"container h-100"},l={class:"h-100 row d-flex flex-column align-items-center"},b={class:"h-100 col-xxl-10 containerCol"};Object(i["u"])();var p=n((function(t,e,c,n,p,f){var j=Object(i["B"])("HorizontalNav"),O=Object(i["B"])("ArrowRightIcon"),v=Object(i["B"])("VideoGroupPanel"),g=Object(i["B"])("VideoList");return Object(i["t"])(),Object(i["f"])("div",o,[Object(i["i"])(j,{navs:t.navs,"onUpdate:navs":e[1]||(e[1]=function(e){return t.navs=e})},null,8,["navs"]),Object(i["i"])("div",r,[Object(i["i"])("div",{onClick:e[2]||(e[2]=Object(i["Q"])((function(e){return t.groupVisible=!t.groupVisible}),["stop"])),class:"rounded-pill border px-3 py-2 me-5 cursor-pointer my-2 flex-shrink-0 currentGroup text-center"},[Object(i["i"])("span",a,Object(i["E"])(t.groupList.find((function(e){return e.id===t.groupId})).name),1),Object(i["i"])(O,{width:"12",height:"12",class:"filter-invert-1 opacity-25 translate-y--10 ms-1"})]),Object(i["i"])(v,{onConfirm:t.confirmGroup,onClick:e[3]||(e[3]=Object(i["Q"])((function(){}),["stop"])),groupId:t.groupId,"onUpdate:groupId":e[4]||(e[4]=function(e){return t.groupId=e}),visible:t.groupVisible,"onUpdate:visible":e[5]||(e[5]=function(e){return t.groupVisible=e})},null,8,["onConfirm","groupId","visible"]),Object(i["i"])("div",s,[(Object(i["t"])(!0),Object(i["f"])(i["a"],null,Object(i["z"])(t.categoryList,(function(e){return Object(i["t"])(),Object(i["f"])("span",{onClick:function(c){return t.groupId=e.id},class:[{selected:e.id===t.groupId},"videoCat rounded-pill px-3 py-1 hover-opacity text-secondary"],key:e.id},Object(i["E"])(e.name),11,["onClick"])})),128))])]),Object(i["i"])("div",u,[Object(i["i"])("div",d,[Object(i["i"])("div",l,[Object(i["i"])("div",b,[Object(i["i"])(g,{style:{"max-height":"calc(100vh - 75px - 60px - 38px - 40px - 3.3rem)"},class:"pt-5",id:t.groupId,"onUpdate:id":e[6]||(e[6]=function(e){return t.groupId=e})},null,8,["id"])])])])])])})),f=c("5530"),j=(c("d81d"),c("99af"),c("c5e7")),O=c("f7cc"),v=Object(i["j"])({setup:function(){var t=Object(i["x"])({navs:[{title:"视频",active:!0},{title:"MV"}],categoryList:[],groupId:0,groupVisible:!1,groupList:[{name:"全部视频",id:0}]});t.navs=t.navs.map((function(t,e){return Object(f["a"])(Object(f["a"])({},t),{},{key:e})}));var e=function(){Object(j["b"])().then((function(e){200===e.code&&(t.categoryList=e.data)})),Object(j["d"])().then((function(e){200===e.code&&(t.groupList=[{name:"全部视频",id:0}].concat(e.data))}))};e(),Object(O["a"])((function(){t.groupVisible=!1}));var c=function(e){t.groupId=e.id};return Object(f["a"])(Object(f["a"])({},Object(i["F"])(t)),{},{confirmGroup:c})}});c("b371");v.render=p,v.__scopeId="data-v-1be9c71c";e["default"]=v},b371:function(t,e,c){"use strict";c("10c1")}}]);
//# sourceMappingURL=chunk-b35d257c.8e9ae618.js.map
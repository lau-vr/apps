!function(e){var t={};function n(r){if(t[r])return t[r].exports;var c=t[r]={i:r,l:!1,exports:{}};return e[r].call(c.exports,c,c.exports,n),c.l=!0,c.exports}n.m=e,n.c=t,n.d=function(e,t,r){n.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:r})},n.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},n.t=function(e,t){if(1&t&&(e=n(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var r=Object.create(null);if(n.r(r),Object.defineProperty(r,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var c in e)n.d(r,c,function(t){return e[t]}.bind(null,c));return r},n.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return n.d(t,"a",t),t},n.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},n.p="",n(n.s=155)}({155:function(e,t){var n=0,r=0,c=0,o=0,u=[];let i=!1;window.onload=function(){document.querySelector("#choosemodel").addEventListener("click",e=>{location.href="mainmenue.html"}),document.querySelector("#quiz").addEventListener("click",e=>{location.href="FCCquiz.html"}),document.querySelector("#AR_VR").addEventListener("click",e=>{location.href="fccAR.html"}),document.querySelector("#n1").addEventListener("click",(function(){o<3&&(1==i?(u.push(-1),o+=1,i=!1):(u.push(1),o+=1))})),document.querySelector("#n2").addEventListener("click",(function(){o<3&&(0==i&&(u[o]=2,o+=1),1==i&&(u[o]=-2,o+=1,i=!1))})),document.querySelector("#n3").addEventListener("click",(function(){o<3&&(0==i&&(u[o]=3,o+=1),1==i&&(u[o]=-3,o+=1,i=!1))})),document.querySelector("#n4").addEventListener("click",(function(){o<3&&(0==i&&(u[o]=4,o+=1),1==i&&(u[o]=-4,o+=1,i=!1))})),document.querySelector("#n5").addEventListener("click",(function(){o<3&&(0==i&&(u[o]=5,o+=1),1==i&&(u[o]=-5,o+=1,i=!1))})),document.querySelector("#n6").addEventListener("click",(function(){o<3&&(0==i&&(u[o]=6,o+=1),1==i&&(u[o]=-6,o+=1,i=!1))})),document.querySelector("#n7").addEventListener("click",(function(){o<3&&(0==i&&(u[o]=7,o+=1),1==i&&(u[o]=-7,o+=1,i=!1))})),document.querySelector("#n8").addEventListener("click",(function(){o<3&&(0==i&&(u[o]=8,o+=1),1==i&&(u[o]=-8,o+=1,i=!1))})),document.querySelector("#n0").addEventListener("click",(function(){o<3&&(0==i&&(u[o]=0,o+=1),1==i&&(u[o]=0,o+=1,i=!1))})),document.querySelector("#play").addEventListener("click",(function(){c=u[2],n=u[0],r=u[1],o=0,u=[]})),document.querySelector("#nope").addEventListener("click",(function(){i=!0}))},window.addEventListener("click",(function(){var e,t,o,l;null==c&&(c=0),null==r&&(r=0),null==n&&(n=0),document.querySelector("#text").setAttribute("text","value: "+n+"   "+r+"   "+c+";wrapCount:7; align:center;"),n>=0&&r>=0&&c>=0?0==n&&0!=r&&0!=c?(e="0 "+5/c+" 0",t="0 "+5/c+" 5",o=5/r+" 0 5",l=5/r+" 0 0"):0==r&&0!=n&&0!=c?(e="0 "+5/c+" 0",t="0 0 "+5/n,o="5 0 "+5/n,l="5 "+5/c+" 0"):0==c&&0!=n&&0!=r?(o=5/r+" 0 0",t="0 0 "+5/n,e="0 5 "+5/n,l=5/r+" 5 0"):0!=n&&0!=r&&0!=c?(e="0 "+5/c+" 0",t="0 0 "+5/n,l=o=5/r+" 0 0"):0==r&&0==n&&0!=c?(e="0 "+5/c+" 0",t="0 "+5/c+" 5",o="5 "+5/c+" 5",l="5 "+5/c+" 0"):0==n&&0==c&&0!=r?(e=5/r+" 5 5",t=5/r+" 0 5",o=5/r+" 0 0",l=5/r+" 5 0"):0==r&&0==c&&0!=n&&(e="5 5 "+5/n,t="0 5 "+5/n,o="0 0 "+5/n,l="5 0 "+5/n):c<0&&n>=0&&r>=0?(0!=n&&0!=r&&0!=c&&(e="0 "+(5+5/c)+" 0",t="0 5 "+5/n,l=o=5/r+" 5 0"),0==n&&0!=r&&0!=c&&(e="0 "+(5+5/c)+" 0",t="0 "+(5+5/c)+" 5",o=5/r+" 5 5",l=5/r+" 5 0"),0==r&&0!=n&&0!=c&&(e="0 "+(5+5/c)+" 0",t="0 5 "+5/n,o="5 5 "+5/n,l="5 "+(5+5/c)+" 0"),0==r&&0==n&&0!=c&&(e="0 "+(5+5/c)+" 0",t="0 "+(5+5/c)+" 5",o="5 "+(5+5/c)+" 5",l="5 "+(5+5/c)+" 0")):n<0&&c>=0&&r>=0?(0!=n&&0!=r&&0!=c&&(e="0 "+5/c+" 5",t="0 0 "+(5+5/n),l=o=5/r+" 0 5"),0==r&&0!=n&&0!=c&&(e="0 "+5/c+" 5",t="0 0 "+(5+5/n),o="5 0 "+(5+5/n),l="5 "+5/c+" 5"),0==c&&0!=n&&0!=r&&(o=5/r+" 0 5",t="0 0 "+(5+5/n),e="0 5 "+(5+5/n),l=5/r+" 5 5"),0==r&&0==c&&0!=n&&(e="5 5 "+(5+5/n),t="0 5 "+(5+5/n),o="0 0 "+(5+5/n),l="5 0 "+(5+5/n))):r<0&&c>=0&&n>=0?(0!=n&&0!=r&&0!=c&&(e="5 "+5/c+" 0",t="5 0 "+5/n,l=o=5+5/r+" 0 0"),0==c&&0!=n&&0!=r&&(o=5+5/r+" 0 0",t="5 0 "+5/n,e="5 5 "+5/n,l=5+5/r+" 5 0"),0==n&&0!=r&&0!=c&&(e="5 "+5/c+" 0",t="5 "+5/c+" 5",o=5+5/r+" 0 5",l=5+5/r+" 0 0"),0==n&&0==c&&0!=r&&(e=5+5/r+" 5 5",t=5+5/r+" 0 5",o=5+5/r+" 0 0",l=5+5/r+" 5 0")):n<0&&r<0&&c>=0?(0!=c&&(e="5 "+5/c+" 5",t="5 0 "+(5+5/n),l=o=5+5/r+" 0 5"),0==c&&(o=5+5/r+" 0 5",t="5 0 "+(5+5/n),e="5 5 "+(5+5/n),l=5+5/r+" 5 5")):n<0&&c<0&&r>=0?(0!=r&&(e="0 "+(5+5/c)+" 5",t="0 5 "+(5+5/n),l=o=5/r+" 5 5"),0==r&&(e="0 "+(5+5/c)+" 5",t="0 5 "+(5+5/n),o="5 5 "+(5+5/n),l="5 "+(5+5/c)+" 5")):r<0&&c<0&&n>=0?(0!=n&&(e="5 "+(5+5/c)+" 0",t="5 5 "+5/n,l=o=5+5/r+" 5 0"),0==n&&(e="5 "+(5+5/c)+" 0",t="5 "+(5+5/c)+" 5",o=5+5/r+" 5 5",l=5+5/r+" 5 0")):(e="5 "+(5+5/c)+" 5",t="5 5 "+(5+5/n),l=o=5+5/r+" 5 5"),document.querySelector("#triangle1").setAttribute("vertex-a",o),document.querySelector("#triangle1").setAttribute("vertex-b",l),document.querySelector("#triangle1").setAttribute("vertex-c",t),document.querySelector("#triangle2").setAttribute("vertex-a",l),document.querySelector("#triangle2").setAttribute("vertex-b",t),document.querySelector("#triangle2").setAttribute("vertex-c",e),document.querySelector("#input").setAttribute("text","value:"+u.toString()),1==i?document.querySelector("#numpad").setAttribute("material."," color:white"):document.querySelector("#numpad").setAttribute("material","color: black")}))}});
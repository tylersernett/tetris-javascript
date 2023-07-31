(()=>{"use strict";var e={426:(e,n,t)=>{t.d(n,{Z:()=>c});var o=t(81),r=t.n(o),i=t(645),a=t.n(i)()(r());a.push([e.id,"html,\nbody {\n    margin: 0;\n    height: 100%;\n    font-family: 'Silkscreen', monospace;\n    touch-action: manipulation; /*remove double-tap zoom*/\n}\n\n:root {\n    --fullWidth: 412px;\n    --fullHeight: 462px;\n}\n\nbody {\n    background: #fff;\n}\n\n#my-canvas {\n    background: #fff;\n    margin: 10px 5px 0px 5px;\n    /* pixel perfect drawing: */\n    image-rendering: -moz-crisp-edges;\n    image-rendering: -webkit-crisp-edges;\n    image-rendering: pixelated;\n}\n\n.full-container {\n    width: var(--fullWidth);\n    margin: auto;\n}\n\nh1 {\n    margin: 0;\n    line-height: 1.05em;\n}\n\nh2 {\n    margin: 0;\n}\n\nh3 {\n    margin: 0;\n    font-size: 1.2rem;\n}\n\n.right-col {\n    position: absolute;\n    width: 145px;\n    height: var(--fullHeight); /* Full height (cover the whole page) */\n    left: 0;\n    right: calc(var(--fullWidth) - 642px);\n    margin: 0 auto;\n}\n\n.overlay {\n    position: absolute;/* Sit on top of the page content */\n    width: 214px;  /* Full width (cover the whole page) */\n    height: var(--fullHeight); /* Full height (cover the whole page) */\n    top: 40px;\n    left: 0;\n    right: calc(var(--fullWidth) - 246px);\n    bottom: 0;\n    margin: 0 auto;\n}\n\n.game-over, .highscore-prompt {\n    display: block;\n    text-align: center;\n    font-size: 1.5rem;\n    color: red;\n    background: rgba(255, 255, 255, 0.92);\n    border: 1px solid black;\n    margin-bottom: 10px;\n}\n\n.highscore-outer {\n    border: 1px solid black;\n    text-align: center;\n    color: red;\n    margin-bottom: 10px;\n    background: rgba(255, 255, 255, 0.92);\n}\n\n.highscore-display {\n    visibility: inherit;\n    text-align: left;\n    font-size: .9rem;\n}\n\n.text-number {\n    font-size: 1.5rem;\n    margin: -5px 0 5px;\n}\n\n.text-controls {\n    margin-bottom: 5px;\n}\n\n#next-title {\n    margin-bottom: 66px;\n}\n\n.mobile-controls {\n    margin: 0 5px;\n    width: 349px;\n}\n\ninput, button {\n    font-family: 'Silkscreen', monospace;\n    margin: 0 10px 10px;\n    width: calc(100% - 20px);\n    -webkit-box-sizing: border-box;\n    -moz-box-sizing: border-box;\n    box-sizing: border-box;\n}\n\nbutton {\n    outline: 0;\n    align-items: center;\n    background: 0 0;\n    border: 1px solid #000;\n    color: black;\n    cursor: pointer;\n    display: inline-flex;\n    flex-shrink: 0;\n    font-size: 16px;\n    justify-content: center;\n    line-height: 1.5;\n    overflow: hidden;\n    padding: 12px 16px;\n    text-decoration: none;\n    text-overflow: ellipsis;\n    transition: all .14s ease-out;\n    white-space: nowrap;\n    box-shadow: 2px 2px 0 #000;\n    margin: 0;\n}\n\nbutton:hover {\n    background-color: #f8f8f8;\n}\n\nbutton:active {\n    box-shadow: 0px 0px 0 #000;\n    transform: translate(2px, 2px);\n}\n\n.shadowed {\n    box-shadow: 2px 2px 0 #000;\n    transform: translate(-2px, -2px);\n}\n\n.option-button {\n    font-family: 'Silkscreen', monospace;\n    font-size: 1rem;\n    margin-bottom: 10px;\n    width: 146px;\n}\n\n.rot-controls, .dir-controls {\n    display: flex;\n    gap: 6px;\n    margin-bottom: 6px;\n}\n\n.rot-button, .dir-button {\n    font-size: 2rem;\n    flex: 1 0 0;\n    min-height: 60px;\n}\n\n/* keep these off screen */\n.block-renders {\n    visibility: hidden;\n}\n\n/* BIG */\n@media only screen and (min-width: 601px) {\n    .mobile-controls, .title-break {\n        display: none;\n    }\n}\n\n/* MOBILE */\n@media only screen and (max-width: 600px) {\n    body {\n        font-size: 12px;\n    }\n\n    #controls, .text-controls, .title-hide {\n        display: none;\n    }\n\n    .full-container {\n        width: 360px;\n        margin: auto;\n        /* Safari */\n        -webkit-user-select: none;\n        /* IE 10 and IE 11 */\n        -ms-user-select: none;\n        /* Standard syntax */\n        user-select: none;\n    }\n\n    .right-col {\n        width: 115px;\n        right: -250px;\n    }\n\n    .overlay {\n        right: 114px;\n        bottom: 0;\n    }\n\n    .option-button{\n        width: 107px;\n    }\n}",""]);const c=a},645:e=>{e.exports=function(e){var n=[];return n.toString=function(){return this.map((function(n){var t="",o=void 0!==n[5];return n[4]&&(t+="@supports (".concat(n[4],") {")),n[2]&&(t+="@media ".concat(n[2]," {")),o&&(t+="@layer".concat(n[5].length>0?" ".concat(n[5]):""," {")),t+=e(n),o&&(t+="}"),n[2]&&(t+="}"),n[4]&&(t+="}"),t})).join("")},n.i=function(e,t,o,r,i){"string"==typeof e&&(e=[[null,e,void 0]]);var a={};if(o)for(var c=0;c<this.length;c++){var s=this[c][0];null!=s&&(a[s]=!0)}for(var l=0;l<e.length;l++){var d=[].concat(e[l]);o&&a[d[0]]||(void 0!==i&&(void 0===d[5]||(d[1]="@layer".concat(d[5].length>0?" ".concat(d[5]):""," {").concat(d[1],"}")),d[5]=i),t&&(d[2]?(d[1]="@media ".concat(d[2]," {").concat(d[1],"}"),d[2]=t):d[2]=t),r&&(d[4]?(d[1]="@supports (".concat(d[4],") {").concat(d[1],"}"),d[4]=r):d[4]="".concat(r)),n.push(d))}},n}},81:e=>{e.exports=function(e){return e[1]}},379:e=>{var n=[];function t(e){for(var t=-1,o=0;o<n.length;o++)if(n[o].identifier===e){t=o;break}return t}function o(e,o){for(var i={},a=[],c=0;c<e.length;c++){var s=e[c],l=o.base?s[0]+o.base:s[0],d=i[l]||0,u="".concat(l," ").concat(d);i[l]=d+1;var p=t(u),f={css:s[1],media:s[2],sourceMap:s[3],supports:s[4],layer:s[5]};if(-1!==p)n[p].references++,n[p].updater(f);else{var h=r(f,o);o.byIndex=c,n.splice(c,0,{identifier:u,updater:h,references:1})}a.push(u)}return a}function r(e,n){var t=n.domAPI(n);return t.update(e),function(n){if(n){if(n.css===e.css&&n.media===e.media&&n.sourceMap===e.sourceMap&&n.supports===e.supports&&n.layer===e.layer)return;t.update(e=n)}else t.remove()}}e.exports=function(e,r){var i=o(e=e||[],r=r||{});return function(e){e=e||[];for(var a=0;a<i.length;a++){var c=t(i[a]);n[c].references--}for(var s=o(e,r),l=0;l<i.length;l++){var d=t(i[l]);0===n[d].references&&(n[d].updater(),n.splice(d,1))}i=s}}},569:e=>{var n={};e.exports=function(e,t){var o=function(e){if(void 0===n[e]){var t=document.querySelector(e);if(window.HTMLIFrameElement&&t instanceof window.HTMLIFrameElement)try{t=t.contentDocument.head}catch(e){t=null}n[e]=t}return n[e]}(e);if(!o)throw new Error("Couldn't find a style target. This probably means that the value for the 'insert' parameter is invalid.");o.appendChild(t)}},216:e=>{e.exports=function(e){var n=document.createElement("style");return e.setAttributes(n,e.attributes),e.insert(n,e.options),n}},565:(e,n,t)=>{e.exports=function(e){var n=t.nc;n&&e.setAttribute("nonce",n)}},795:e=>{e.exports=function(e){if("undefined"==typeof document)return{update:function(){},remove:function(){}};var n=e.insertStyleElement(e);return{update:function(t){!function(e,n,t){var o="";t.supports&&(o+="@supports (".concat(t.supports,") {")),t.media&&(o+="@media ".concat(t.media," {"));var r=void 0!==t.layer;r&&(o+="@layer".concat(t.layer.length>0?" ".concat(t.layer):""," {")),o+=t.css,r&&(o+="}"),t.media&&(o+="}"),t.supports&&(o+="}");var i=t.sourceMap;i&&"undefined"!=typeof btoa&&(o+="\n/*# sourceMappingURL=data:application/json;base64,".concat(btoa(unescape(encodeURIComponent(JSON.stringify(i))))," */")),n.styleTagTransform(o,e,n.options)}(n,e,t)},remove:function(){!function(e){if(null===e.parentNode)return!1;e.parentNode.removeChild(e)}(n)}}}},589:e=>{e.exports=function(e,n){if(n.styleSheet)n.styleSheet.cssText=e;else{for(;n.firstChild;)n.removeChild(n.firstChild);n.appendChild(document.createTextNode(e))}}}},n={};function t(o){var r=n[o];if(void 0!==r)return r.exports;var i=n[o]={id:o,exports:{}};return e[o](i,i.exports,t),i.exports}t.n=e=>{var n=e&&e.__esModule?()=>e.default:()=>e;return t.d(n,{a:n}),n},t.d=(e,n)=>{for(var o in n)t.o(n,o)&&!t.o(e,o)&&Object.defineProperty(e,o,{enumerable:!0,get:n[o]})},t.o=(e,n)=>Object.prototype.hasOwnProperty.call(e,n),t.nc=void 0;var o={};(()=>{function e(e,n){return(e%n+n)%n}function n(e){return e>=be}function r(e){return e>ve-1||e<0}function i(e,n){return 0!==xe[n][e]}function a(){const{rotations:e,rotationIndex:n,gridX:t,gridY:o,image:r}=Be,a=e[n];let c=!1;a.forEach((e=>{const n=e.x+t,a=e.y+o;ye[a][n]=1;const{x:s,y:l}=ge[a][n];ue.drawImage(r,s,l),i(n,a)&&(c=!0)})),c&&Pe()}function c(){let e=Se[0][0].x,n=Se[0][0].y;ue.fillStyle="white",ue.fillRect(e,n,4*(1+he+1),3*(1+he+1)),He.rotations[0].forEach((e=>{const n=e.x,t=e.y,{x:o,y:r}=Se[t][n];ue.drawImage(He.image,o,r)}))}function s(){let e=.5;Be.rotations[Be.rotationIndex].forEach((n=>{let t=n.x+Be.gridX,o=n.y+Be.gridY;ye[o][t]=0;let r=ge[o][t].x,i=ge[o][t].y;ue.fillStyle=Oe,ue.fillRect(r-e,i-e,he+e+2,he+e+2)}))}function l(){for(let e=0;e<be;e++)for(let n=0;n<ve;n++){let t=ge[e][n].x,o=ge[e][n].y,r=0!==xe[e][n]?xe[e][n]:void 0;r&&ue.drawImage(r,t,o)}}t.d(o,{Um:()=>Oe,jy:()=>he,s1:()=>Je,x9:()=>ge,Ok:()=>$e,Xl:()=>ue,curTetromino:()=>Be,y1:()=>ze,bA:()=>De,Y1:()=>be,FD:()=>ve,Dg:()=>ye,e2:()=>Ce,Tx:()=>Pe,pe:()=>F,y3:()=>Z,Cb:()=>P,Zm:()=>W,_O:()=>He,St:()=>Se,Pk:()=>je,Y6:()=>N,Lv:()=>Ne,xy:()=>xe});const d="https://tetris-javascript.onrender.com";function u(){je.show=!je.show,je.show?p(!1):Z.style.visibility="hidden"}async function p(e){je.show=!0;const n=await h();f(n),e&&(n.length<5||je.score>n[4]?.score)&&(P.style.visibility="visible")}function f(e){const n=e.map((e=>`<li>${e.name}: ${e.score}</li>`)).join("");F.innerHTML=`<ol>${n}</ol>`,Z.style.visibility="visible"}async function h(){try{const e=await fetch(`${d}/highscores`);return await e.json()}catch(e){return console.error("Error getting scores:",e),[]}}let m={hspeed:0,vspeed:0,rspeed:0},w=6,g=2,y=-w,x=-g;function b(e){Ce||("ArrowLeft"===e.key?m.hspeed=-1:"ArrowRight"===e.key?m.hspeed=1:"ArrowDown"===e.key?k():"x"===e.key?(m.rspeed=1,I(1)):"z"===e.key&&(m.rspeed=-1,I(-1)))}function v(e){"ArrowLeft"===e.key||"ArrowRight"===e.key?m.hspeed=0:"ArrowDown"===e.key?S():"x"!==e.key&&"z"!==e.key||(m.rspeed=0)}function k(){m.vspeed=1}function S(){m.vspeed=0,Ne(!0)}function I(t){Ce||function(t){let o=Be.rotationIndex+t;return Be.rotations[e(o,Be.rotLength)].some((e=>{let t=e.x+Be.gridX,o=e.y+Be.gridY;return r(t)||n(o)||i(t,o)}))}(t)||(s(),Be.rotationIndex+=t,Be.rotationIndex=e(Be.rotationIndex,Be.rotLength),a())}function E(){Ce||function(e){const t=Be.rotations[Be.rotationIndex];return!!t.some((e=>{const t=e.x+Be.gridX,o=e.y+Be.gridY+1;return n(o)||i(t,o)}))&&(t.forEach((e=>{const n=e.x+Be.gridX,t=e.y+Be.gridY;xe[t][n]=Be.image})),Je(),$e(),a(),!0)}()||(s(),Be.gridY++,a())}var q=t(379),L=t.n(q),A=t(795),T=t.n(A),z=t(569),M=t.n(z),j=t(565),C=t.n(j),Y=t(216),O=t.n(Y),R=t(589),X=t.n(R),B=t(426),H={};let D,Z,F,P,N,$,W,J,U,_,G,K,Q,V,ee,ne,te,oe,re,ie,ae,ce,se,le,de,ue,pe,fe;H.styleTagTransform=X(),H.setAttributes=C(),H.insert=M().bind(null,"head"),H.domAPI=T(),H.insertStyleElement=O(),L()(B.Z,H),B.Z&&B.Z.locals&&B.Z.locals,document.addEventListener("DOMContentLoaded",(()=>{D=document.querySelector("#my-canvas"),$=document.getElementById("game-over"),Z=document.getElementById("highscore-outer"),F=document.getElementById("highscore-display"),P=document.getElementById("highscore-prompt"),J=document.querySelector("#highscore-button"),U=document.querySelector("#restart-button"),_=document.querySelector("#score-form"),N=document.querySelector("#score-form-submit"),W=document.querySelector("#name-submit"),G=document.getElementById("score"),K=document.getElementById("lines"),Q=document.getElementById("level"),V=document.querySelector("#rot-ccw"),ee=document.querySelector("#rot-cw"),ne=document.querySelector("#move-left"),te=document.querySelector("#move-down"),oe=document.querySelector("#move-right"),re=document.querySelector("#block-t"),ie=document.querySelector("#block-i"),ae=document.querySelector("#block-j"),ce=document.querySelector("#block-sq"),se=document.querySelector("#block-l"),le=document.querySelector("#block-s"),de=document.querySelector("#block-z"),document.addEventListener("keydown",b),document.addEventListener("keyup",v,!1),_.addEventListener("submit",(function(e){e.preventDefault(),async function(e){e.preventDefault(),N.disabled=!0;try{f(await async function(e,n){const t=await fetch(`${d}/add-score`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({name:e.value,score:n.score,lines:n.lines,level:n.level})});return await t.json()}(W,je)),P.style.visibility="hidden"}catch(e){console.error("Error submitting score:",e)}}(e)})),J.onclick=u,U.onclick=Xe,V.onclick=()=>I(-1),ee.onclick=()=>I(1),ne.onpointerdown=()=>m.hspeed=-1,ne.onpointerup=()=>m.hspeed=0,ne.onpointerleave=()=>m.hspeed=0,te.onpointerdown=k,te.onpointerup=S,te.onpointerleave=S,oe.onpointerdown=()=>m.hspeed=1,oe.onpointerup=()=>m.hspeed=0,oe.onpointerleave=()=>m.hspeed=0,function(){ue=D.getContext("2d"),pe=4*me+ve*(he+2*me),fe=2*me+be*(he+2*me);D.width=1*(pe+5*(he+2*me)),D.height=1*(5+fe),ue.scale(1,1)}(),function(){ge=Array.from({length:be},(()=>Array.from({length:ve},(()=>new we(0,0)))));let e=1+he+1;for(let n=0;n<be;n++)for(let t=0;t<ve;t++)ge[n][t]=new we(3+e*t,1+e*n);for(let n=0;n<3;n++)for(let t=0;t<4;t++)Se[n][t]=new we(244+e*t,105+e*n)}(),Me.push(new qe([[new we(0,1),new we(1,1),new we(2,1),new we(1,2)],[new we(1,0),new we(0,1),new we(1,1),new we(1,2)],[new we(0,1),new we(1,1),new we(2,1),new we(1,0)],[new we(1,0),new we(2,1),new we(1,1),new we(1,2)]],re,"T")),Me.push(new qe([[new we(0,2),new we(1,2),new we(2,2),new we(3,2)],[new we(2,0),new we(2,1),new we(2,2),new we(2,3)]],ie,"I")),Me.push(new qe([[new we(0,1),new we(1,1),new we(2,1),new we(2,2)],[new we(1,0),new we(0,2),new we(1,1),new we(1,2)],[new we(0,1),new we(1,1),new we(2,1),new we(0,0)],[new we(1,0),new we(2,0),new we(1,1),new we(1,2)]],ae,"J")),Me.push(new qe([[new we(1,1),new we(2,1),new we(1,2),new we(2,2)]],ce,"sq")),Me.push(new qe([[new we(0,1),new we(1,1),new we(2,1),new we(0,2)],[new we(1,0),new we(0,0),new we(1,1),new we(1,2)],[new we(0,1),new we(1,1),new we(2,1),new we(2,0)],[new we(1,0),new we(2,2),new we(1,1),new we(1,2)]],se,"L")),Me.push(new qe([[new we(1,1),new we(2,1),new we(0,2),new we(1,2)],[new we(1,1),new we(2,1),new we(1,0),new we(2,2)]],le,"S")),Me.push(new qe([[new we(0,1),new we(1,1),new we(1,2),new we(2,2)],[new we(2,0),new we(1,1),new we(1,2),new we(2,1)]],de,"Z")),Xe(),h()}));let he=21,me=1;class we{constructor(e,n){this.x=e,this.y=n}}let ge,ye,xe,be=20,ve=10;function ke(e){return new Array(be).fill(0).map((()=>new Array(ve).fill(0)))}const Se=Array.from({length:3},(()=>Array.from({length:4},(()=>new we(0,0)))));let Ie=4,Ee=0;class qe{constructor(e,n,t,o=0,r=Ie,i=Ee){this.rotations=e,this.image=n,this.name=t,this.rotationIndex=o,this.gridX=r,this.gridY=i}get rotLength(){return this.rotations?.length||0}getSecondArrayLength(){return this.rotations[0]?.length||0}}let Le,Ae,Te,ze,Me=[],je={show:!1,score:0,level:1,lines:0},Ce=!1,Ye=60,Oe="#f8f8f8",Re="black";function Xe(){N.disabled=!1,je={show:!1,score:0,level:1,lines:0},Ce=!1,Ue(),Te=60,Fe(),$.style.visibility="hidden",Z.style.visibility="hidden",P.style.visibility="hidden",ye=ke(),xe=ke(),ue.clearRect(0,0,D.width,D.height),We(),$e(),ze=!0,clearInterval(Le),Le=setInterval(Ze,1e3/Ye)}let Be,He,De=0;function Ze(){var e;Ce||(ue.clearRect(0,0,D.width,D.height),ue.fillStyle=Oe,ue.fillRect(0,0,pe,fe),ue.strokeStyle=Re,ue.strokeRect(.5,.5,pe-1,fe-1),0!==m.hspeed&&De-y>=w&&(function(e){return 0!==e&&Be.rotations[Be.rotationIndex].some((n=>{const t=n.x+Be.gridX+e,o=n.y+Be.gridY;return r(t)||i(t,o)}))}(e=m.hspeed)||(s(),Be.gridX+=e,a()),y=De),0!==m.vspeed&&De-x>=g&&ze&&(E(),x=De),a(),l(),c(),De++)}function Fe(){let e;switch(je.level){case 1:e=48;break;case 2:e=43;break;case 3:e=38;break;case 4:e=33;break;case 5:e=28;break;case 6:e=23;break;case 7:e=18;break;case 8:e=13;break;case 9:e=8;break;case 10:e=6;break;case 11:case 12:case 13:e=5;break;case 14:case 15:case 16:e=4;break;case 17:case 18:case 19:e=3;break;default:e=2}if(Te!==e){Te=e;let n=e/Ye*1e3;clearInterval(Ae),Ae=setInterval((()=>{Ce||E()}),n)}}function Pe(){Ce=!0,$.style.visibility="visible",p(!0),clearInterval(Le)}function Ne(e){ze=e}function $e(){ze=!1,Be=He,Be.gridX=Ie,Be.gridY=Ee,Be.rotationIndex=0,We(),c()}function We(){let e=Math.floor(Math.random()*Me.length);He=Me[e]}function Je(){let e=0;for(let n=0;n<be;n++){let t=!1;if(xe[n].every((e=>0!==e))&&(t=!0),t){e++;for(let e=0;e<ve;e++)xe[n][e]=0,ye[n][e]=0;let t=xe.splice(n,1);xe.unshift(...t);let o=ye.splice(n,1);ye.unshift(...o)}}e>0&&(je.score+=function(e){switch(e){case 1:return 40;case 2:return 100;case 3:return 300;case 4:return 1200;default:return 0}}(e)*je.level,je.lines+=e,je.level=Math.floor(je.lines/10)+1,Fe(),Ue(),l())}function Ue(){G.innerHTML=je.score.toString(),K.innerHTML=je.lines.toString(),Q.innerHTML=je.level.toString()}})()})();
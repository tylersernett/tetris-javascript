(()=>{"use strict";var e={426:(e,n,t)=>{t.d(n,{Z:()=>c});var o=t(81),r=t.n(o),i=t(645),a=t.n(i)()(r());a.push([e.id,"html,\nbody {\n    margin: 0;\n    height: 100%;\n    font-family: 'Silkscreen', monospace;\n    touch-action: manipulation; /*remove double-tap zoom*/\n}\n\n:root {\n    --fullWidth: 412px;\n    --fullHeight: 462px;\n}\n\nbody {\n    background: #fff;\n}\n\n#my-canvas {\n    background: #fff;\n    margin: 10px 5px 0px 5px;\n    /* pixel perfect drawing: */\n    image-rendering: -moz-crisp-edges;\n    image-rendering: -webkit-crisp-edges;\n    image-rendering: pixelated;\n}\n\n.full-container {\n    width: var(--fullWidth);\n    margin: auto;\n}\n\nh1 {\n    margin: 0;\n    line-height: 1.05em;\n}\n\nh2 {\n    margin: 0;\n}\n\nh3 {\n    margin: 0;\n    font-size: 1.2rem;\n}\n\n.right-col {\n    position: absolute;\n    width: 145px;\n    height: var(--fullHeight); /* Full height (cover the whole page) */\n    left: 0;\n    right: calc(var(--fullWidth) - 642px);\n    margin: 0 auto;\n}\n\n.overlay {\n    position: absolute;/* Sit on top of the page content */\n    width: 214px;  /* Full width (cover the whole page) */\n    height: var(--fullHeight); /* Full height (cover the whole page) */\n    top: 40px;\n    left: 0;\n    right: calc(var(--fullWidth) - 246px);\n    bottom: 0;\n    margin: 0 auto;\n}\n\n.game-over, .highscore-prompt {\n    display: block;\n    text-align: center;\n    font-size: 1.5rem;\n    color: red;\n    background: rgba(255, 255, 255, 0.92);\n    border: 1px solid black;\n    margin-bottom: 10px;\n}\n\n.highscore-outer {\n    border: 1px solid black;\n    text-align: center;\n    color: red;\n    margin-bottom: 10px;\n    background: rgba(255, 255, 255, 0.92);\n}\n\n.highscore-display {\n    visibility: inherit;\n    text-align: left;\n    font-size: .9rem;\n}\n\n.text-number {\n    font-size: 1.5rem;\n    margin: -5px 0 5px;\n}\n\n.text-controls {\n    margin-bottom: 5px;\n}\n\n#next-title {\n    margin-bottom: 66px;\n}\n\n.mobile-controls {\n    margin: 0 5px;\n    width: 349px;\n}\n\ninput, button {\n    font-family: 'Silkscreen', monospace;\n    margin: 0 10px 10px;\n    width: calc(100% - 20px);\n    -webkit-box-sizing: border-box;\n    -moz-box-sizing: border-box;\n    box-sizing: border-box;\n}\n\nbutton {\n    outline: 0;\n    align-items: center;\n    background: 0 0;\n    border: 1px solid #000;\n    color: black;\n    cursor: pointer;\n    display: inline-flex;\n    flex-shrink: 0;\n    font-size: 16px;\n    justify-content: center;\n    line-height: 1.5;\n    overflow: hidden;\n    padding: 12px 16px;\n    text-decoration: none;\n    text-overflow: ellipsis;\n    transition: all .14s ease-out;\n    white-space: nowrap;\n    box-shadow: 2px 2px 0 #000;\n    margin: 0;\n}\n\nbutton:hover {\n    background-color: #f8f8f8;\n}\n\nbutton:active {\n    box-shadow: 0px 0px 0 #000;\n    transform: translate(2px, 2px);\n}\n\n.shadowed {\n    box-shadow: 2px 2px 0 #000;\n    transform: translate(-2px, -2px);\n}\n\n.option-button {\n    font-family: 'Silkscreen', monospace;\n    font-size: 1rem;\n    margin-bottom: 10px;\n    width: 146px;\n}\n\n.rot-controls, .dir-controls {\n    display: flex;\n    gap: 6px;\n    margin-bottom: 6px;\n}\n\n.rot-button, .dir-button {\n    font-size: 2rem;\n    flex: 1 0 0;\n    min-height: 60px;\n}\n\n/* keep these off screen */\n.block-renders {\n    visibility: hidden;\n}\n\n/* BIG */\n@media only screen and (min-width: 601px) {\n    .mobile-controls, .title-break {\n        display: none;\n    }\n}\n\n/* MOBILE */\n@media only screen and (max-width: 600px) {\n    body {\n        font-size: 12px;\n    }\n\n    #controls, .text-controls, .title-hide {\n        display: none;\n    }\n\n    .full-container {\n        width: 360px;\n        margin: auto;\n        /* Safari */\n        -webkit-user-select: none;\n        /* IE 10 and IE 11 */\n        -ms-user-select: none;\n        /* Standard syntax */\n        user-select: none;\n    }\n\n    .right-col {\n        width: 115px;\n        right: -250px;\n    }\n\n    .overlay {\n        right: 114px;\n        bottom: 0;\n    }\n\n    .option-button{\n        width: 107px;\n    }\n}",""]);const c=a},645:e=>{e.exports=function(e){var n=[];return n.toString=function(){return this.map((function(n){var t="",o=void 0!==n[5];return n[4]&&(t+="@supports (".concat(n[4],") {")),n[2]&&(t+="@media ".concat(n[2]," {")),o&&(t+="@layer".concat(n[5].length>0?" ".concat(n[5]):""," {")),t+=e(n),o&&(t+="}"),n[2]&&(t+="}"),n[4]&&(t+="}"),t})).join("")},n.i=function(e,t,o,r,i){"string"==typeof e&&(e=[[null,e,void 0]]);var a={};if(o)for(var c=0;c<this.length;c++){var s=this[c][0];null!=s&&(a[s]=!0)}for(var l=0;l<e.length;l++){var u=[].concat(e[l]);o&&a[u[0]]||(void 0!==i&&(void 0===u[5]||(u[1]="@layer".concat(u[5].length>0?" ".concat(u[5]):""," {").concat(u[1],"}")),u[5]=i),t&&(u[2]?(u[1]="@media ".concat(u[2]," {").concat(u[1],"}"),u[2]=t):u[2]=t),r&&(u[4]?(u[1]="@supports (".concat(u[4],") {").concat(u[1],"}"),u[4]=r):u[4]="".concat(r)),n.push(u))}},n}},81:e=>{e.exports=function(e){return e[1]}},379:e=>{var n=[];function t(e){for(var t=-1,o=0;o<n.length;o++)if(n[o].identifier===e){t=o;break}return t}function o(e,o){for(var i={},a=[],c=0;c<e.length;c++){var s=e[c],l=o.base?s[0]+o.base:s[0],u=i[l]||0,d="".concat(l," ").concat(u);i[l]=u+1;var p=t(d),f={css:s[1],media:s[2],sourceMap:s[3],supports:s[4],layer:s[5]};if(-1!==p)n[p].references++,n[p].updater(f);else{var h=r(f,o);o.byIndex=c,n.splice(c,0,{identifier:d,updater:h,references:1})}a.push(d)}return a}function r(e,n){var t=n.domAPI(n);return t.update(e),function(n){if(n){if(n.css===e.css&&n.media===e.media&&n.sourceMap===e.sourceMap&&n.supports===e.supports&&n.layer===e.layer)return;t.update(e=n)}else t.remove()}}e.exports=function(e,r){var i=o(e=e||[],r=r||{});return function(e){e=e||[];for(var a=0;a<i.length;a++){var c=t(i[a]);n[c].references--}for(var s=o(e,r),l=0;l<i.length;l++){var u=t(i[l]);0===n[u].references&&(n[u].updater(),n.splice(u,1))}i=s}}},569:e=>{var n={};e.exports=function(e,t){var o=function(e){if(void 0===n[e]){var t=document.querySelector(e);if(window.HTMLIFrameElement&&t instanceof window.HTMLIFrameElement)try{t=t.contentDocument.head}catch(e){t=null}n[e]=t}return n[e]}(e);if(!o)throw new Error("Couldn't find a style target. This probably means that the value for the 'insert' parameter is invalid.");o.appendChild(t)}},216:e=>{e.exports=function(e){var n=document.createElement("style");return e.setAttributes(n,e.attributes),e.insert(n,e.options),n}},565:(e,n,t)=>{e.exports=function(e){var n=t.nc;n&&e.setAttribute("nonce",n)}},795:e=>{e.exports=function(e){if("undefined"==typeof document)return{update:function(){},remove:function(){}};var n=e.insertStyleElement(e);return{update:function(t){!function(e,n,t){var o="";t.supports&&(o+="@supports (".concat(t.supports,") {")),t.media&&(o+="@media ".concat(t.media," {"));var r=void 0!==t.layer;r&&(o+="@layer".concat(t.layer.length>0?" ".concat(t.layer):""," {")),o+=t.css,r&&(o+="}"),t.media&&(o+="}"),t.supports&&(o+="}");var i=t.sourceMap;i&&"undefined"!=typeof btoa&&(o+="\n/*# sourceMappingURL=data:application/json;base64,".concat(btoa(unescape(encodeURIComponent(JSON.stringify(i))))," */")),n.styleTagTransform(o,e,n.options)}(n,e,t)},remove:function(){!function(e){if(null===e.parentNode)return!1;e.parentNode.removeChild(e)}(n)}}}},589:e=>{e.exports=function(e,n){if(n.styleSheet)n.styleSheet.cssText=e;else{for(;n.firstChild;)n.removeChild(n.firstChild);n.appendChild(document.createTextNode(e))}}}},n={};function t(o){var r=n[o];if(void 0!==r)return r.exports;var i=n[o]={id:o,exports:{}};return e[o](i,i.exports,t),i.exports}t.n=e=>{var n=e&&e.__esModule?()=>e.default:()=>e;return t.d(n,{a:n}),n},t.d=(e,n)=>{for(var o in n)t.o(n,o)&&!t.o(e,o)&&Object.defineProperty(e,o,{enumerable:!0,get:n[o]})},t.o=(e,n)=>Object.prototype.hasOwnProperty.call(e,n),t.nc=void 0;var o={};(()=>{function e(e,n){return(e%n+n)%n}function n(e){return e>=be}function r(e){return e>ve-1||e<0}function i(e,n){return 0!==xe[n][e]}function a(){if(!He)return;const{rotations:e,rotationIndex:n,gridX:t,gridY:o,image:r}=He,a=e[n];let c=!1;a.forEach((e=>{const n=e.x+t,a=e.y+o;ye[a][n]=1;const{x:s,y:l}=ge[a][n];de.drawImage(r,s,l),i(n,a)&&(c=!0)})),c&&Pe()}function c(){let e=Se[0][0].x,n=Se[0][0].y;de.fillStyle="white",de.fillRect(e,n,4*(1+he+1),3*(1+he+1)),Oe.rotations[0].forEach((e=>{const n=e.x,t=e.y,{x:o,y:r}=Se[t][n];de.drawImage(Oe.image,o,r)}))}function s(){let e=.5;He.rotations[He.rotationIndex].forEach((n=>{let t=n.x+He.gridX,o=n.y+He.gridY;ye[o][t]=0;let r=ge[o][t].x,i=ge[o][t].y;de.fillStyle=Ye,de.fillRect(r-e,i-e,he+e+2,he+e+2)}))}function l(){for(let e=0;e<be;e++)for(let n=0;n<ve;n++){let t=ge[e][n].x,o=ge[e][n].y,r=0!==xe[e][n]?xe[e][n]:void 0;r&&de.drawImage(r,t,o)}}t.d(o,{Um:()=>Ye,jy:()=>he,s1:()=>Je,x9:()=>ge,Xl:()=>de,curTetromino:()=>He,y1:()=>Te,bA:()=>De,Y1:()=>be,FD:()=>ve,Dg:()=>ye,e2:()=>Ce,Tx:()=>Pe,pe:()=>Z,y3:()=>F,Cb:()=>P,Zm:()=>W,_O:()=>Oe,St:()=>Se,Pk:()=>je,Y6:()=>N,Lv:()=>Ne,xy:()=>xe});const u="https://tetris-javascript.onrender.com";function d(){je.show=!je.show,je.show?p(!1):F.style.visibility="hidden"}async function p(e){je.show=!0;const n=await h();f(n),e&&(n.length<5||je.score>n[4]?.score)&&(P.style.visibility="visible")}function f(e){const n=e.map((e=>`<li>${e.name}: ${e.score}</li>`)).join("");Z.innerHTML=`<ol>${n}</ol>`,F.style.visibility="visible"}async function h(){try{const e=await fetch(`${u}/highscores`);return await e.json()}catch(e){return console.error("Error getting scores:",e),[]}}let m={hspeed:0,vspeed:0,rspeed:0},w=6,g=2,y=-w,x=-g;function b(e){He&&(Ce||("ArrowLeft"===e.key?m.hspeed=-1:"ArrowRight"===e.key?m.hspeed=1:"ArrowDown"===e.key?k():"x"===e.key?(m.rspeed=1,I(1)):"z"===e.key&&(m.rspeed=-1,I(-1))))}function v(e){"ArrowLeft"===e.key||"ArrowRight"===e.key?m.hspeed=0:"ArrowDown"===e.key?S():"x"!==e.key&&"z"!==e.key||(m.rspeed=0)}function k(){m.vspeed=1}function S(){m.vspeed=0,Ne(!0)}function I(t){Ce||function(t){let o=He.rotationIndex+t;return He.rotations[e(o,He.rotLength)].some((e=>{let t=e.x+He.gridX,o=e.y+He.gridY;return r(t)||n(o)||i(t,o)}))}(t)||(s(),He.rotationIndex+=t,He.rotationIndex=e(He.rotationIndex,He.rotLength),a())}function E(){He&&(Ce||function(e){const t=He.rotations[He.rotationIndex];return!!t.some((e=>{const t=e.x+He.gridX,o=e.y+He.gridY+1;return n(o)||i(t,o)}))&&(t.forEach((e=>{const n=e.x+He.gridX,t=e.y+He.gridY;xe[t][n]=He.image})),Je(),!0)}()||(s(),He.gridY++,a()))}var q=t(379),A=t.n(q),L=t(795),M=t.n(L),T=t(569),z=t.n(T),j=t(565),C=t.n(j),R=t(216),Y=t.n(R),X=t(589),B=t.n(X),H=t(426),O={};let D,F,Z,P,N,$,W,J,U,_,G,K,Q,V,ee,ne,te,oe,re,ie,ae,ce,se,le,ue,de,pe,fe;O.styleTagTransform=B(),O.setAttributes=C(),O.insert=z().bind(null,"head"),O.domAPI=M(),O.insertStyleElement=Y(),A()(H.Z,O),H.Z&&H.Z.locals&&H.Z.locals,document.addEventListener("DOMContentLoaded",(()=>{D=document.querySelector("#my-canvas"),$=document.getElementById("game-over"),F=document.getElementById("highscore-outer"),Z=document.getElementById("highscore-display"),P=document.getElementById("highscore-prompt"),J=document.querySelector("#highscore-button"),U=document.querySelector("#restart-button"),_=document.querySelector("#score-form"),N=document.querySelector("#score-form-submit"),W=document.querySelector("#name-submit"),G=document.getElementById("score"),K=document.getElementById("lines"),Q=document.getElementById("level"),V=document.querySelector("#rot-ccw"),ee=document.querySelector("#rot-cw"),ne=document.querySelector("#move-left"),te=document.querySelector("#move-down"),oe=document.querySelector("#move-right"),re=document.querySelector("#block-t"),ie=document.querySelector("#block-i"),ae=document.querySelector("#block-j"),ce=document.querySelector("#block-sq"),se=document.querySelector("#block-l"),le=document.querySelector("#block-s"),ue=document.querySelector("#block-z"),document.addEventListener("keydown",b),document.addEventListener("keyup",v,!1),_.addEventListener("submit",(function(e){e.preventDefault(),async function(e){e.preventDefault(),N.disabled=!0;try{f(await async function(e,n){const t=await fetch(`${u}/add-score`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({name:e.value,score:n.score,lines:n.lines,level:n.level})});return await t.json()}(W,je)),P.style.visibility="hidden"}catch(e){console.error("Error submitting score:",e)}}(e)})),J.onclick=d,U.onclick=Be,V.onclick=()=>I(-1),ee.onclick=()=>I(1),ne.onpointerdown=()=>m.hspeed=-1,ne.onpointerup=()=>m.hspeed=0,ne.onpointerleave=()=>m.hspeed=0,te.onpointerdown=k,te.onpointerup=S,te.onpointerleave=S,oe.onpointerdown=()=>m.hspeed=1,oe.onpointerup=()=>m.hspeed=0,oe.onpointerleave=()=>m.hspeed=0,function(){de=D.getContext("2d"),pe=4*me+ve*(he+2*me),fe=2*me+be*(he+2*me);D.width=1*(pe+5*(he+2*me)),D.height=1*(5+fe),de.scale(1,1)}(),function(){ge=Array.from({length:be},(()=>Array.from({length:ve},(()=>new we(0,0)))));let e=1+he+1;for(let n=0;n<be;n++)for(let t=0;t<ve;t++)ge[n][t]=new we(3+e*t,1+e*n);for(let n=0;n<3;n++)for(let t=0;t<4;t++)Se[n][t]=new we(244+e*t,105+e*n)}(),ze.push(new qe([[new we(0,1),new we(1,1),new we(2,1),new we(1,2)],[new we(1,0),new we(0,1),new we(1,1),new we(1,2)],[new we(0,1),new we(1,1),new we(2,1),new we(1,0)],[new we(1,0),new we(2,1),new we(1,1),new we(1,2)]],re,"T")),ze.push(new qe([[new we(0,2),new we(1,2),new we(2,2),new we(3,2)],[new we(2,0),new we(2,1),new we(2,2),new we(2,3)]],ie,"I")),ze.push(new qe([[new we(0,1),new we(1,1),new we(2,1),new we(2,2)],[new we(1,0),new we(0,2),new we(1,1),new we(1,2)],[new we(0,1),new we(1,1),new we(2,1),new we(0,0)],[new we(1,0),new we(2,0),new we(1,1),new we(1,2)]],ae,"J")),ze.push(new qe([[new we(1,1),new we(2,1),new we(1,2),new we(2,2)]],ce,"sq")),ze.push(new qe([[new we(0,1),new we(1,1),new we(2,1),new we(0,2)],[new we(1,0),new we(0,0),new we(1,1),new we(1,2)],[new we(0,1),new we(1,1),new we(2,1),new we(2,0)],[new we(1,0),new we(2,2),new we(1,1),new we(1,2)]],se,"L")),ze.push(new qe([[new we(1,1),new we(2,1),new we(0,2),new we(1,2)],[new we(1,1),new we(2,1),new we(1,0),new we(2,2)]],le,"S")),ze.push(new qe([[new we(0,1),new we(1,1),new we(1,2),new we(2,2)],[new we(2,0),new we(1,1),new we(1,2),new we(2,1)]],ue,"Z")),Be(),h()}));let he=21,me=1;class we{constructor(e,n){this.x=e,this.y=n}}let ge,ye,xe,be=20,ve=10;function ke(e){return new Array(be).fill(0).map((()=>new Array(ve).fill(0)))}const Se=Array.from({length:3},(()=>Array.from({length:4},(()=>new we(0,0)))));let Ie=4,Ee=0;class qe{constructor(e,n,t,o=0,r=Ie,i=Ee){this.rotations=e,this.image=n,this.name=t,this.rotationIndex=o,this.gridX=r,this.gridY=i}get rotLength(){return this.rotations?.length||0}getSecondArrayLength(){return this.rotations[0]?.length||0}}let Ae,Le,Me,Te,ze=[],je={show:!1,score:0,level:1,lines:0},Ce=!1,Re=60,Ye="#f8f8f8",Xe="black";function Be(){N.disabled=!1,je={show:!1,score:0,level:1,lines:0},Ce=!1,Ue(),Me=60,Ze(je.level),$.style.visibility="hidden",F.style.visibility="hidden",P.style.visibility="hidden",ye=ke(),xe=ke(),de.clearRect(0,0,D.width,D.height),We(),$e(),Te=!0,clearInterval(Ae),Ae=setInterval(Fe,1e3/Re)}let He,Oe,De=0;function Fe(){var e;Ce||(de.clearRect(0,0,D.width,D.height),de.fillStyle=Ye,de.fillRect(0,0,pe,fe),de.strokeStyle=Xe,de.strokeRect(.5,.5,pe-1,fe-1),He&&(0!==m.hspeed&&De-y>=w&&(function(e){return 0!==e&&He.rotations[He.rotationIndex].some((n=>{const t=n.x+He.gridX+e,o=n.y+He.gridY;return r(t)||i(t,o)}))}(e=m.hspeed)||(s(),He.gridX+=e,a()),y=De),0!==m.vspeed&&De-x>=g&&Te&&(E(),x=De)),a(),l(),c(),De++)}function Ze(e){let n;switch(e){case-1:n=999999;break;case 1:n=48;break;case 2:n=43;break;case 3:n=38;break;case 4:n=33;break;case 5:n=28;break;case 6:n=23;break;case 7:n=18;break;case 8:n=13;break;case 9:n=8;break;case 10:n=6;break;case 11:case 12:case 13:n=5;break;case 14:case 15:case 16:n=4;break;case 17:case 18:case 19:n=3;break;default:n=2}if(Me!==n){Me=n;let e=n/Re*1e3;clearInterval(Le),Le=setInterval((()=>{Ce||E()}),e)}}function Pe(){Ce=!0,$.style.visibility="visible",p(!0),clearInterval(Ae)}function Ne(e){Te=e}function $e(){Te=!1,He=Oe,He.gridX=Ie,He.gridY=Ee,He.rotationIndex=0,We(),c()}function We(){let e=Math.floor(Math.random()*ze.length);Oe=ze[e]}function Je(){let e=[];for(let n=0;n<be;n++)xe[n].every((e=>0!==e))&&e.push(n);const n=[];e.length>0?(He=null,Ze(-1),e.forEach((t=>{!function(e,n){const t=performance.now();requestAnimationFrame((function o(r){const i=r-t,a=Math.min(i/300,1);for(let n=0;n<ve;n++){const t=ge[e][n];if(t&&1===ye[e][n]){const e=t.x,n=t.y,o=he*a,r=he;de.fillStyle=Ye,de.fillRect(e,n,o,r)}}if(a<1)requestAnimationFrame(o);else{for(let n=0;n<ve;n++)1===ye[e][n]&&(ye[e][n]=0,xe[e][n]=0);let t=xe.splice(e,1);xe.unshift(...t);let o=ye.splice(e,1);ye.unshift(...o),n()}}))}(t,(()=>function(t){n.push(t),n.length===e.length&&(je.score+=function(e){switch(e){case 1:return 40;case 2:return 100;case 3:return 300;case 4:return 1200;default:return 0}}(e.length)*je.level,je.lines+=e.length,je.level=Math.floor(je.lines/10)+1,Ze(je.level),Ue(),$e(),l())}(t)))}))):($e(),a())}function Ue(){G.innerHTML=je.score.toString(),K.innerHTML=je.lines.toString(),Q.innerHTML=je.level.toString()}})()})();
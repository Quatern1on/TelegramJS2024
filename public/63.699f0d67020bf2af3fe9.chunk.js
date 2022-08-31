"use strict";(this.webpackChunktweb=this.webpackChunktweb||[]).push([[63,709,810],{9638:(e,t,n)=>{n.d(t,{Z:()=>u});var a=n(3910),i=n(2738),r=n(4541),o=n(2325),s=n(3512),c=n(4494),d=n(279);let l,g=!1;function u(e){g||(l||(l=s.Z.managers.apiManager.getConfig().then((e=>e.suggested_lang_code!==o.ZP.lastRequestedLangCode?Promise.all([e,o.ZP.getStrings(e.suggested_lang_code,["Login.ContinueOnLanguage"]),o.ZP.getCacheLangPack()]):[])))).then((([t,n])=>{if(!t)return;const l=[];n.forEach((e=>{const t=o.ZP.strings.get(e.key);t&&(l.push(t),o.ZP.strings.set(e.key,e))}));const u="Login.ContinueOnLanguage",p=(0,c.Z)("btn-primary btn-secondary btn-primary-transparent primary",{text:u});p.lastElementChild.classList.remove("i18n"),(0,r.Z)({text:[o.ZP.format(u,!0)]}).then((()=>{window.requestAnimationFrame((()=>{e.append(p)}))})),s.Z.addEventListener("language_change",(()=>{p.remove()}),{once:!0}),l.forEach((e=>{o.ZP.strings.set(e.key,e)})),(0,i.fc)(p,(e=>{(0,a.Z)(e),g=!0,p.disabled=!0,(0,d.y)(p),o.ZP.getLangPack(t.suggested_lang_code)}))}))}},810:(e,t,n)=>{n.r(t),n.d(t,{default:()=>C});var a=n(279),i=n(4874),r=n(9807),o=n(4494),s=n(5432),c=n(4159),d=n(2325),l=n(1447),g=n(1405),u=n(9709),p=n(9638),h=n(3910),m=n(2738),y=n(5565),v=n(1656),f=n(7487),Z=n(2398),L=n(6669),_=n(7922),w=n(3512),b=n(709),k=n(3855),S=n(5431);let E,P=null;const x=new i.Z("page-sign",!0,(()=>{const e=document.createElement("div");let t,i;e.classList.add("input-wrapper");const g=new S.Z({onCountryChange:(e,n)=>{t=e,i=n,n&&(C.value=C.lastValue="+"+n.country_code,setTimeout((()=>{R.focus(),(0,Z.Z)(R,!0)}),0))}}),C=new b.Z({onInput:e=>{l.Z.loadLottieWorkers();const{country:n,code:a}=e||{},r=n?n.name||n.default_name:"";r===g.value||t&&n&&a&&(t===n||i.country_code===a.country_code)||g.override(n,a,r),n||C.value.length-1>1?P.style.visibility="":P.style.visibility="hidden"}}),R=C.input;R.addEventListener("keypress",(e=>{if(!P.style.visibility&&"Enter"===e.key)return A()}));const T=new r.Z({text:"Login.KeepSigned",name:"keepSession",withRipple:!0,checked:!0});T.input.addEventListener("change",(()=>{const e=T.checked;w.Z.managers.appStateManager.pushToState("keepSigned",e),k.Z.toggleStorages(e,!0)})),k.Z.getState().then((e=>{_.Z.isAvailable()?T.checked=e.keepSigned:(T.checked=!1,T.label.classList.add("checkbox-disabled"))})),P=(0,o.Z)("btn-primary btn-color-primary",{text:"Login.Next"}),P.style.visibility="hidden";const A=e=>{e&&(0,h.Z)(e);const t=(0,v.Z)([P,E],!0);(0,y.Z)(P,(0,d.ag)("PleaseWait")),(0,a.y)(P);const i=C.value;w.Z.managers.apiManager.invokeApi("auth.sendCode",{phone_number:i,api_id:c.Z.id,api_hash:c.Z.hash,settings:{_:"codeSettings"}}).then((e=>{n.e(392).then(n.bind(n,6392)).then((t=>t.default.mount(Object.assign(e,{phone_number:i}))))})).catch((e=>{t(),"PHONE_NUMBER_INVALID"===e.type?(C.setError(),(0,y.Z)(C.label,(0,d.ag)("Login.PhoneLabelInvalid")),R.classList.add("error"),(0,y.Z)(P,(0,d.ag)("Login.Next"))):(console.error("auth.sendCode error:",e),P.innerText=e.type)}))};(0,m.fc)(P,A),E=(0,o.Z)("btn-primary btn-secondary btn-primary-transparent primary",{text:"Login.QR.Login"}),E.addEventListener("click",(()=>{u.default.mount()})),e.append(g.container,C.container,T.label,P,E);const M=document.createElement("h4");M.classList.add("text-center"),(0,d.$d)(M,"Login.Title");const O=document.createElement("div");O.classList.add("subtitle","text-center"),(0,d.$d)(O,"Login.StartText"),x.pageEl.querySelector(".container").append(M,O,e),s.Z||setTimeout((()=>{R.focus()}),0),(0,p.Z)(e),w.Z.managers.apiManager.invokeApi("help.getNearestDc").then((e=>{var t;const n=_.Z.getFromCache("langPack");n&&!(null===(t=n.countries)||void 0===t?void 0:t.hash)&&d.ZP.getLangPack(n.lang_code).then((()=>{(0,L.Z)(R,"input")}));const a=new Set([1,2,3,4,5]),i=[e.this_dc];let r;return e.nearest_dc!==e.this_dc&&(r=w.Z.managers.apiManager.getNetworkerVoid(e.nearest_dc).then((()=>{i.push(e.nearest_dc)}))),(r||Promise.resolve()).then((()=>{i.forEach((e=>{a.delete(e)}));const e=[...a],t=()=>{return n=void 0,a=void 0,r=function*(){const n=e.shift();if(!n)return;const a=`dc${n}_auth_key`;if(yield f.Z.get(a))return t();setTimeout((()=>{w.Z.managers.apiManager.getNetworkerVoid(n).finally(t)}),3e3)},new((i=void 0)||(i=Promise))((function(e,t){function o(e){try{c(r.next(e))}catch(e){t(e)}}function s(e){try{c(r.throw(e))}catch(e){t(e)}}function c(t){var n;t.done?e(t.value):(n=t.value,n instanceof i?n:new i((function(e){e(n)}))).then(o,s)}c((r=r.apply(n,a||[])).next())}));var n,a,i,r};t()})),e})).then((e=>{g.value.length||C.value.length||g.selectCountryByIso2(e.country)}))}),(()=>{P&&((0,y.Z)(P,(0,d.ag)("Login.Next")),(0,g.Z)(P,void 0,void 0,!0),P.removeAttribute("disabled")),E&&E.removeAttribute("disabled"),w.Z.managers.appStateManager.pushToState("authState",{_:"authStateSignIn"})})),C=x},9709:(e,t,n)=>{n.r(t),n.d(t,{default:()=>y});var a=n(4874),i=n(4159),r=n(4494),o=n(2325),s=n(3512),c=n(279),d=n(9638),l=n(5418),g=n(9895);function u(e){return e<26?e+65:e<52?e+71:e<62?e-4:62===e?43:63===e?47:65}var p=function(e,t,n,a){return new(n||(n=Promise))((function(i,r){function o(e){try{c(a.next(e))}catch(e){r(e)}}function s(e){try{c(a.throw(e))}catch(e){r(e)}}function c(e){var t;e.done?i(e.value):(t=e.value,t instanceof n?t:new n((function(e){e(t)}))).then(o,s)}c((a=a.apply(e,t||[])).next())}))};let h;const m=new a.Z("page-signQR",!0,(()=>h),(()=>{h||(h=p(void 0,void 0,void 0,(function*(){const e=m.pageEl.querySelector(".auth-image");let t=(0,c.y)(e,!0);const a=document.createElement("div");a.classList.add("input-wrapper");const y=(0,r.Z)("btn-primary btn-secondary btn-primary-transparent primary",{text:"Login.QR.Cancel"});a.append(y),(0,d.Z)(a);const v=e.parentElement,f=document.createElement("h4");(0,o.$d)(f,"Login.QR.Title");const Z=document.createElement("ol");Z.classList.add("qr-description"),["Login.QR.Help1","Login.QR.Help2","Login.QR.Help3"].forEach((e=>{const t=document.createElement("li");t.append((0,o.ag)(e)),Z.append(t)})),v.append(f,Z,a),y.addEventListener("click",(()=>{n.e(810).then(n.bind(n,810)).then((e=>e.default.mount())),_=!0}));const L=(yield Promise.all([n.e(630).then(n.t.bind(n,1915,23))]))[0].default;let _=!1;s.Z.addEventListener("user_auth",(()=>{_=!0,h=null}),{once:!0});const w={ignoreErrors:!0};let b;const k=a=>p(void 0,void 0,void 0,(function*(){try{let r=yield s.Z.managers.apiManager.invokeApi("auth.exportLoginToken",{api_id:i.Z.id,api_hash:i.Z.hash,except_ids:[]},{ignoreErrors:!0});if("auth.loginTokenMigrateTo"===r._&&(w.dcId||(w.dcId=r.dc_id,s.Z.managers.apiManager.setBaseDcId(r.dc_id)),r=yield s.Z.managers.apiManager.invokeApi("auth.importLoginToken",{token:r.token},w)),"auth.loginTokenSuccess"===r._){const e=r.authorization;return s.Z.managers.apiManager.setUser(e.user),n.e(781).then(n.bind(n,5436)).then((e=>e.default.mount())),!0}if(!b||!(0,g.Z)(b,r.token)){b=r.token;const n="tg://login?token="+function(e){let t,n="";for(let a=e.length,i=0,r=0;r<a;++r)t=r%3,i|=e[r]<<(16>>>t&24),2!==t&&a-r!=1||(n+=String.fromCharCode(u(i>>>18&63),u(i>>>12&63),u(i>>>6&63),u(63&i)),i=0);return n.replace(/A(?=A$|$)/g,"=")}(r.token).replace(/\+/g,"-").replace(/\//g,"_").replace(/\=+$/,""),a=window.getComputedStyle(document.documentElement),i=a.getPropertyValue("--surface-color").trim(),o=a.getPropertyValue("--primary-text-color").trim(),s=a.getPropertyValue("--primary-color").trim(),c=yield fetch("assets/img/logo_padded.svg").then((e=>e.text())).then((e=>{e=e.replace(/(fill:).+?(;)/,`$1${s}$2`);const t=new Blob([e],{type:"image/svg+xml;charset=utf-8"});return new Promise((e=>{const n=new FileReader;n.onload=t=>{e(t.target.result)},n.readAsDataURL(t)}))})),d=new L({width:240*window.devicePixelRatio,height:240*window.devicePixelRatio,data:n,image:c,dotsOptions:{color:o,type:"rounded"},cornersSquareOptions:{type:"extra-rounded"},imageOptions:{imageSize:1,margin:0},backgroundOptions:{color:i},qrOptions:{errorCorrectionLevel:"L"}});let g;d.append(e),e.lastChild.classList.add("qr-canvas"),g=d._drawingPromise?d._drawingPromise:Promise.race([(0,l.Z)(1e3),new Promise((e=>{d._canvas._image.addEventListener("load",(()=>{window.requestAnimationFrame((()=>e()))}),{once:!0})}))]),yield g.then((()=>{if(t){t.style.animation="hide-icon .4s forwards";const n=e.children[1];n.style.display="none",n.style.animation="grow-icon .4s forwards",setTimeout((()=>{n.style.display=""}),150),setTimeout((()=>{n.style.animation=""}),500),t=void 0}else Array.from(e.children).slice(0,-1).forEach((e=>{e.remove()}))}))}if(a){const e=Date.now()/1e3,t=r.expires-e-(yield s.Z.managers.timeManager.getServerTimeOffset());yield(0,l.Z)(t>3?3e3:1e3*t|0)}}catch(e){return"SESSION_PASSWORD_NEEDED"===e.type?(console.warn("pageSignQR: SESSION_PASSWORD_NEEDED"),e.handled=!0,n.e(774).then(n.bind(n,9437)).then((e=>e.default.mount())),_=!0,h=null):(console.error("pageSignQR: default error:",e),_=!0),!0}return!1}));return()=>p(void 0,void 0,void 0,(function*(){for(_=!1;!_&&!(yield k(!0)););}))}))),h.then((e=>{e()})),s.Z.managers.appStateManager.pushToState("authState",{_:"authStateSignQr"})})),y=m}}]);
//# sourceMappingURL=63.699f0d67020bf2af3fe9.chunk.js.map
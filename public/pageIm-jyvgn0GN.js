import{a as o,e as t,g as r,_ as a,l as s}from"./index-1XCs23jU.js";import{P as l}from"./page-GAj3-m6E.js";const n=()=>(o.managers.appStateManager.pushToState("authState",{_:"authStateSignedIn"}),t.requestedServerLanguage||t.getCacheLangPack().then(e=>{e.local&&t.getLangPack(e.lang_code)}),i.pageEl.style.display="",r(),Promise.all([a(()=>import("./appDialogsManager-0HIScvR7.js"),__vite__mapDeps([0,1,2,3,4,5,6,7,8,9,10,11,12,13]),import.meta.url),s(),"requestVideoFrameCallback"in HTMLVideoElement.prototype?Promise.resolve():a(()=>import("./requestVideoFrameCallbackPolyfill-GsYXQx88.js"),__vite__mapDeps([]),import.meta.url)]).then(([e])=>{e.default.start(),setTimeout(()=>{document.getElementById("auth-pages").remove()},1e3)})),i=new l("page-chats",!1,n);export{i as default};
//# sourceMappingURL=pageIm-jyvgn0GN.js.map
function __vite__mapDeps(indexes) {
  if (!__vite__mapDeps.viteFileDeps) {
    __vite__mapDeps.viteFileDeps = ["./appDialogsManager-0HIScvR7.js","./avatar-hGaJVwIC.js","./button-85HZPfu9.js","./index-1XCs23jU.js","./index-G2JAgzYZ.css","./page-GAj3-m6E.js","./wrapEmojiText-Zbd43m96.js","./scrollable-bzlznXHJ.js","./putPreloader-cEMZBXwJ.js","./htmlToSpan-NoTSgfFv.js","./countryInputField-YItR_N_s.js","./textToSvgURL-Z4O-nL1S.js","./codeInputField-wa0VHF12.js","./appDialogsManager-6QNcK96s.css"]
  }
  return indexes.map((i) => __vite__mapDeps.viteFileDeps[i])
}
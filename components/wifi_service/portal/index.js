(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const i of document.querySelectorAll('link[rel="modulepreload"]'))o(i);new MutationObserver(i=>{for(const a of i)if(a.type==="childList")for(const l of a.addedNodes)l.tagName==="LINK"&&l.rel==="modulepreload"&&o(l)}).observe(document,{childList:!0,subtree:!0});function n(i){const a={};return i.integrity&&(a.integrity=i.integrity),i.referrerPolicy&&(a.referrerPolicy=i.referrerPolicy),i.crossOrigin==="use-credentials"?a.credentials="include":i.crossOrigin==="anonymous"?a.credentials="omit":a.credentials="same-origin",a}function o(i){if(i.ep)return;i.ep=!0;const a=n(i);fetch(i.href,a)}})();const Ot={mode:"absolute",position:"bottom",height:"6rem",strength:2,divCount:5,exponential:!1,opacity:1,curve:"linear",zIndex:2},ot={linear:t=>t,bezier:t=>t*t*(3-2*t),"ease-in":t=>t*t,"ease-out":t=>1-Math.pow(1-t,2),"ease-in-out":t=>t<.5?2*t*t:1-Math.pow(-2*t+2,2)/2};function Nt(t){switch(t){case"top":return"to top";case"left":return"to left";case"right":return"to right";default:return"to bottom"}}function Dt(){if(typeof CSS>"u"||typeof CSS.supports!="function")return!1;const t=CSS.supports("backdrop-filter","blur(1px)")||CSS.supports("-webkit-backdrop-filter","blur(1px)"),e=CSS.supports("mask-image","linear-gradient(to bottom, transparent, black)")||CSS.supports("-webkit-mask-image","linear-gradient(to bottom, transparent, black)");return t&&e}function $t(t){const e={...Ot,...t},n=document.createElement("div"),o=document.createElement("div"),i=Nt(e.position),a=Dt(),l=e.position==="top"||e.position==="bottom";if(n.className="gradual-blur",e.className&&n.classList.add(e.className),a||(n.classList.add("gradual-blur--fallback"),n.style.background=`linear-gradient(${i}, transparent 0%, ${e.fallbackColor||"rgba(255, 255, 255, 0.95)"} 100%)`),n.style.position=e.mode,n.style.pointerEvents="none",n.style.zIndex=String(e.zIndex),n.style.opacity="0",n.style.borderRadius="inherit",l?(n.style.height=e.height,n.style.width=e.width||"100%",n.style[e.position]="0",e.mode==="fixed"?(n.style.left="50%",n.style.right="auto",n.style.transform="translateX(-50%)"):(n.style.left="0",n.style.right="0")):(n.style.width=e.width||e.height,n.style.height="100%",n.style.top="0",n.style.bottom="0",n.style[e.position]="0"),o.className="gradual-blur__inner",n.appendChild(o),a){const c=100/e.divCount,d=ot[e.curve]||ot.linear;for(let f=1;f<=e.divCount;f+=1){const p=document.createElement("div"),A=d(f/e.divCount);let T=0;e.exponential?T=Math.pow(2,A*4)*.0625*e.strength:T=.0625*(A*e.divCount+1)*e.strength;const b=Math.round((c*f-c)*10)/10,y=Math.round(c*f*10)/10,k=Math.round((c*f+c)*10)/10,E=Math.round((c*f+c*2)*10)/10;let s=`transparent ${b}%, black ${y}%`;k<=100&&(s+=`, black ${k}%`),E<=100&&(s+=`, transparent ${E}%`),p.className="gradual-blur__layer",p.style.maskImage=`linear-gradient(${i}, ${s})`,p.style.webkitMaskImage=`linear-gradient(${i}, ${s})`,p.style.backdropFilter=`blur(${T.toFixed(3)}rem)`,p.style.setProperty("-webkit-backdrop-filter",`blur(${T.toFixed(3)}rem)`),p.style.opacity=String(e.opacity),o.appendChild(p)}}return window.getComputedStyle(e.mount).position==="static"&&(e.mount.style.position="relative"),e.mount.appendChild(n),{element:n,setVisible(c){n.style.opacity=c?"1":"0"},destroy(){n.remove()}}}const Vt=`:host {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 1.75rem;
  padding: 0 var(--spacing-sm);
  border: var(--border-01) solid var(--color-border);
  border-radius: var(--radius-full);
  background-color: var(--color-bg-selected);
  color: var(--color-text-secondary);
  font-size: var(--font-size-caption);
  font-weight: var(--font-weight-semibold);
  line-height: 1;
  white-space: nowrap;
}

*,
*::before,
*::after {
  box-sizing: border-box;
}

.badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  white-space: inherit;
}
`,Ht=document.createElement("template");Ht.innerHTML=`
  <style>${Vt}</style>
  <span class="badge">
    <slot></slot>
  </span>
`;const Kt=`:host {
  display: inline-flex;
  height: 44px;
  width: auto;
  min-width: 96px;
  vertical-align: middle;
}

*,
*::before,
*::after {
  box-sizing: border-box;
}

button {
  all: unset;
  box-sizing: border-box;
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 44px;
  width: auto;
  min-height: 44px;
  min-width: 96px;
  padding: var(--spacing-3xs) var(--spacing-sm);
  border: var(--border-01) solid transparent;
  border-radius: var(--button-radius);
  background-color: var(--color-text-secondary);
  color: var(--color-text-inverse);
  cursor: pointer;
  font-family: var(--font-family);
  font-size: var(--font-size-label);
  font-weight: var(--font-weight-regular);
  line-height: 1.25;
  text-align: center;
}

button:focus-visible {
  outline: var(--focus-ring-width) solid var(--focus-ring-color);
  outline-offset: var(--focus-ring-offset);
}

button:disabled {
  background-color: var(--color-bg-mute);
  color: var(--color-text-mute);
  cursor: default;
}

:host([variant="primary"]) button {
  background-color: var(--color-bg-brand);
  color: var(--color-text-inverse);
}

:host([variant="primary"]) button:not(:disabled):is(:hover, :active) {
  background-color: var(--color-bg-brand-hover);
}

:host([variant="secondary"]) button {
  background-color: var(--color-bg-active);
  color: var(--color-fg-active);
}

:host([variant="secondary"]) button:not(:disabled):is(:hover, :active) {
  background-color: var(--color-bg-active);
  color: var(--color-fg-active);
}

:host([variant="outline"]) button {
  background-color: transparent;
  border-color: var(--color-border);
  color: var(--color-text-secondary);
}

:host([variant="outline"]) button:not(:disabled):is(:hover, :active) {
  background-color: var(--color-border);
  border-color: var(--color-border);
}

:host([variant="ghost"]) button {
  background-color: transparent;
  border-color: transparent;
  color: var(--color-text-secondary);
}

:host([variant="ghost"]) button:not(:disabled):is(:hover, :active) {
  background-color: var(--color-overlay);
}

:host([inverse]) button {
  color: var(--color-text-inverse);
}

:host([variant="outline"][inverse]) button {
  border-color: var(--color-text-inverse);
}

:host([variant="outline"][inverse]) button:not(:disabled):is(:hover, :active),
:host([variant="ghost"][inverse]) button:not(:disabled):is(:hover, :active) {
  background-color: var(--color-overlay);
  border-color: var(--color-text-inverse);
}

:host([rounded]) button {
  border-radius: var(--radius-full);
  padding: var(--spacing-xs) var(--spacing-lg);
}

::slotted(svg) {
  flex-shrink: 0;
}
`,F="ui-button",ft=document.createElement("template");ft.innerHTML=`
  <style>${Kt}</style>
  <button type="button" part="button">
    <slot></slot>
  </button>
`;function rt(t){return t==="submit"||t==="reset"?t:"button"}class Ft extends HTMLElement{static get observedAttributes(){return["disabled","aria-label","type"]}constructor(){super();const e=this.attachShadow({mode:"open",delegatesFocus:!0});e.append(ft.content.cloneNode(!0)),this.button=e.querySelector("button")}connectedCallback(){this.dataset.component=F,this.syncAttributes()}attributeChangedCallback(){this.syncAttributes()}get disabled(){return this.hasAttribute("disabled")}set disabled(e){this.toggleAttribute("disabled",e)}get type(){return rt(this.getAttribute("type"))}set type(e){this.setAttribute("type",rt(e))}focus(e){this.button.focus(e)}click(){this.button.click()}syncAttributes(){this.button.disabled=this.disabled,this.button.type=this.type,this.tabIndex=this.disabled?-1:0;const e=this.getAttribute("aria-label");e?this.button.setAttribute("aria-label",e):this.button.removeAttribute("aria-label")}}function Rt(){customElements.get(F)||customElements.define(F,Ft)}const Gt=`:host {
  display: contents;
}

:host([hidden]) {
  display: none;
}

*,
*::before,
*::after {
  box-sizing: border-box;
}

.bottom-sheet-dialog {
  position: fixed;
  inset: auto 0 0 0;
  display: flex;
  width: 100%;
  max-height: 96vh;
  padding: 0;
  border: 0;
  background: transparent;
  color: var(--color-text);
  overflow: visible;
  transform: translateY(100%);
  max-width: 768px;
  margin: auto;
}

.bottom-sheet-dialog:not([open]) {
  pointer-events: none;
  visibility: hidden;
}

.bottom-sheet-dialog[open] {
  animation: bottom-sheet-open 320ms ease forwards;
}

.bottom-sheet-dialog.closing {
  animation: bottom-sheet-close 320ms ease forwards;
}

.bottom-sheet-dialog::backdrop {
  background: var(--color-overlay);
  backdrop-filter: blur(4px) saturate(180%);
  -webkit-backdrop-filter: blur(4px) saturate(180%);
}

.bottom-sheet-content {
  display: flex;
  flex-direction: column;
  width: 100%;
  min-height: 0;
  border-top: var(--border-01) solid var(--color-border);
  border-radius: var(--radius-xl) var(--radius-xl) 0 0;
  background: var(--color-bg);
  box-shadow: 0 -8px 24px rgb(0 0 0 / 0.16);
  overflow: hidden;
}

.bottom-sheet-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: var(--spacing-sm);
  padding: var(--spacing-sm) var(--spacing-md);
  padding-right: var(--spacing-sm);
  border-bottom: var(--border-01) solid var(--color-border);
}

.bottom-sheet-header-copy {
  display: grid;
  gap: var(--spacing-3xs);
  min-width: 0;
}

.bottom-sheet-title,
.bottom-sheet-description {
  margin: 0;
}

.bottom-sheet-title {
  font-size: var(--font-size-heading);
  font-weight: var(--font-weight-semibold);
  line-height: 1.2;
}

.bottom-sheet-description {
  color: var(--color-text-secondary);
  font-size: var(--font-size-label);
  line-height: 1.5;
}

.bottom-sheet-header-actions {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: var(--spacing-xs);
  flex-shrink: 0;
}

.bottom-sheet-body {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
  min-height: 0;
  padding: var(--spacing-md);
  overflow: auto;
}

.bottom-sheet-footer {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  gap: var(--spacing-sm);
  /* Extra bottom padding so the footer buttons clear the iOS home indicator / safe area and
     aren't clipped at the bottom of the sheet. */
  padding: var(--spacing-md) var(--spacing-md) var(--spacing-6xl);
  border-top: var(--border-01) solid var(--color-border);
  background: var(--color-bg);
}

.bottom-sheet-title[hidden],
.bottom-sheet-description[hidden],
.bottom-sheet-header-actions[hidden],
.bottom-sheet-footer[hidden] {
  display: none;
}

::slotted([slot="footer"]) {
  flex-shrink: 0;
}

@keyframes bottom-sheet-open {
  from {
    transform: translateY(100%);
  }

  to {
    transform: translateY(0);
  }
}

@keyframes bottom-sheet-close {
  from {
    transform: translateY(0);
  }

  to {
    transform: translateY(100%);
  }
}
`,R="ui-bottom-sheet",mt=document.createElement("template"),Zt=["a[href]","button:not([disabled])","details summary","input:not([disabled])","select:not([disabled])","textarea:not([disabled])",'[tabindex]:not([tabindex="-1"])'].join(", ");let V=0;mt.innerHTML=`
  <style>${Gt}</style>
  <dialog class="bottom-sheet-dialog" part="dialog">
    <div class="bottom-sheet-content" part="content">
      <div class="bottom-sheet-header" part="header">
        <div class="bottom-sheet-header-copy">
          <h2 class="bottom-sheet-title" part="title"></h2>
          <p class="bottom-sheet-description" part="description"></p>
        </div>
        <div class="bottom-sheet-header-actions" part="header-actions">
          <slot name="header-actions"></slot>
        </div>
      </div>
      <div class="bottom-sheet-body" part="body">
        <slot></slot>
      </div>
      <div class="bottom-sheet-footer" part="footer">
        <slot name="footer"></slot>
      </div>
    </div>
    <div class="bottom-sheet-floating" part="floating-content">
      <slot name="floating-content"></slot>
    </div>
  </dialog>
`;function st(t){const e=getComputedStyle(t);return t.hasAttribute("hidden")||t.getAttribute("aria-hidden")==="true"||e.display==="none"||e.visibility==="hidden"?!1:t.tagName.includes("-")?e.display==="contents"||!!t.getClientRects().length:t.offsetParent!==null||e.position==="fixed"||!!t.getClientRects().length}function H(t){if(!t.shadowRoot)return[];const e=[],n=new Set;function o(i){if(i instanceof HTMLSlotElement){const a=i.assignedElements({flatten:!0});a.length>0?a.forEach(o):Array.from(i.children).forEach(o);return}if(i instanceof HTMLElement&&st(i)){if(i.shadowRoot){Array.from(i.shadowRoot.childNodes).forEach(o);return}!n.has(i)&&i.matches(Zt)&&st(i)&&(n.add(i),e.push(i)),Array.from(i.children).forEach(o)}}return Array.from(t.shadowRoot.childNodes).forEach(o),e}function Ut(t,e){if(e===t||e.contains(t))return!0;let n=t;for(;n;){if(n===e)return!0;const o=n.getRootNode();if(!(o instanceof ShadowRoot))break;n=o.host}return!1}function K(t){return t.assignedNodes({flatten:!0}).some(e=>e.nodeType===Node.TEXT_NODE?e.textContent?.trim().length:e.nodeType===Node.ELEMENT_NODE)}class Wt extends HTMLElement{constructor(){super(),this.isAnimatingClose=!1,this.isSyncingOpenAttribute=!1,this.previousDocumentOverflow="",this.previousBodyOverflow="",this.triggerElement=null;const e=this.attachShadow({mode:"open"});e.append(mt.content.cloneNode(!0)),this.dialog=e.querySelector(".bottom-sheet-dialog"),this.titleElement=e.querySelector(".bottom-sheet-title"),this.descriptionElement=e.querySelector(".bottom-sheet-description"),this.headerActionsContainer=e.querySelector(".bottom-sheet-header-actions"),this.footerContainer=e.querySelector(".bottom-sheet-footer"),this.floatingContainer=e.querySelector(".bottom-sheet-floating"),this.headerActionsSlot=e.querySelector('slot[name="header-actions"]'),this.footerSlot=e.querySelector('slot[name="footer"]'),this.floatingSlot=e.querySelector('slot[name="floating-content"]'),V+=1,this.titleId=`bottomSheetTitle${V}`,this.descriptionId=`bottomSheetDescription${V}`,this.handleAnimationEndBound=this.handleAnimationEnd.bind(this),this.handleCancelBound=this.handleCancel.bind(this),this.handleClickBound=this.handleClick.bind(this),this.handleKeyDownBound=this.handleKeyDown.bind(this),this.handleSlotChangeBound=this.syncSlotVisibility.bind(this)}static get observedAttributes(){return["description","open","title"]}connectedCallback(){this.dataset.component=R,this.dialog.addEventListener("animationend",this.handleAnimationEndBound),this.dialog.addEventListener("cancel",this.handleCancelBound),this.dialog.addEventListener("click",this.handleClickBound),this.dialog.addEventListener("keydown",this.handleKeyDownBound),this.addEventListener("keydown",this.handleKeyDownBound),this.headerActionsSlot.addEventListener("slotchange",this.handleSlotChangeBound),this.footerSlot.addEventListener("slotchange",this.handleSlotChangeBound),this.floatingSlot.addEventListener("slotchange",this.handleSlotChangeBound),this.syncAttributes(),this.syncSlotVisibility(),this.hasAttribute("open")&&this.openInternal()}disconnectedCallback(){this.dialog.removeEventListener("animationend",this.handleAnimationEndBound),this.dialog.removeEventListener("cancel",this.handleCancelBound),this.dialog.removeEventListener("click",this.handleClickBound),this.dialog.removeEventListener("keydown",this.handleKeyDownBound),this.removeEventListener("keydown",this.handleKeyDownBound),this.headerActionsSlot.removeEventListener("slotchange",this.handleSlotChangeBound),this.footerSlot.removeEventListener("slotchange",this.handleSlotChangeBound),this.floatingSlot.removeEventListener("slotchange",this.handleSlotChangeBound),this.dialog.open&&this.dialog.close(),this.unlockDocumentScroll()}attributeChangedCallback(e){if(e==="open"){if(!this.isConnected||this.isSyncingOpenAttribute)return;this.hasAttribute("open")?this.openInternal():this.startClosing();return}this.syncAttributes()}get open(){return this.hasAttribute("open")}set open(e){this.toggleAttribute("open",e)}openBottomSheet(){this.open&&!this.isAnimatingClose||(this.triggerElement=document.activeElement instanceof HTMLElement?document.activeElement:null,this.open=!0)}closeBottomSheet(){!this.open&&!this.dialog.open||(this.open=!1)}focus(e){(H(this)[0]??this.dialog).focus(e)}syncAttributes(){const e=this.getAttribute("title")||"",n=this.getAttribute("description")||"";this.titleElement.id=this.titleId,this.titleElement.textContent=e,this.titleElement.hidden=e.length===0,this.descriptionElement.id=this.descriptionId,this.descriptionElement.textContent=n,this.descriptionElement.hidden=n.length===0,e.length>0?this.dialog.setAttribute("aria-labelledby",this.titleId):this.dialog.removeAttribute("aria-labelledby"),n.length>0?this.dialog.setAttribute("aria-describedby",this.descriptionId):this.dialog.removeAttribute("aria-describedby")}syncSlotVisibility(){this.headerActionsContainer.hidden=!K(this.headerActionsSlot),this.footerContainer.hidden=!K(this.footerSlot),this.floatingContainer.hidden=!K(this.floatingSlot)}handleAnimationEnd(e){!this.isAnimatingClose||e.target!==this.dialog||(this.dialog.classList.remove("closing"),this.dialog.close(),this.isAnimatingClose=!1,this.unlockDocumentScroll(),this.restoreTriggerFocus(),this.dispatchEvent(new Event("close",{bubbles:!0,composed:!0})))}handleCancel(e){e.preventDefault(),this.closeBottomSheet()}handleClick(e){this.isAnimatingClose||e.target===this.dialog&&this.closeBottomSheet()}handleKeyDown(e){if(e.currentTarget===this&&e.composedPath().includes(this.dialog))return;if(e.key==="Escape"){e.preventDefault(),this.closeBottomSheet();return}if(e.key!=="Tab")return;const n=H(this);if(n.length===0){e.preventDefault(),this.dialog.focus();return}const o=e.composedPath()[0],i=o instanceof HTMLElement?o:document.activeElement instanceof HTMLElement?document.activeElement:null,a=i===null?-1:n.findIndex(f=>Ut(i,f)),l=e.shiftKey?-1:1,c=e.shiftKey?n.length-1:0,d=a===-1?c:(a+l+n.length)%n.length;e.preventDefault(),n[d].focus()}openInternal(){this.syncAttributes(),this.syncSlotVisibility(),this.isAnimatingClose&&(this.dialog.classList.remove("closing"),this.isAnimatingClose=!1),this.dialog.open?this.lockDocumentScroll():(this.lockDocumentScroll(),this.dialog.showModal()),requestAnimationFrame(()=>{if(!this.dialog.open)return;(H(this)[0]??this.dialog).focus()})}startClosing(){!this.dialog.open||this.isAnimatingClose||(this.dialog.classList.add("closing"),this.isAnimatingClose=!0)}lockDocumentScroll(){this.previousDocumentOverflow.length===0&&this.previousBodyOverflow.length===0&&(this.previousDocumentOverflow=document.documentElement.style.overflow,this.previousBodyOverflow=document.body.style.overflow),document.documentElement.style.overflow="hidden",document.body.style.overflow="hidden"}unlockDocumentScroll(){document.documentElement.style.overflow=this.previousDocumentOverflow,document.body.style.overflow=this.previousBodyOverflow,this.previousDocumentOverflow="",this.previousBodyOverflow=""}restoreTriggerFocus(){this.triggerElement&&document.contains(this.triggerElement)&&this.triggerElement.focus(),this.triggerElement=null}}function Jt(){customElements.get(R)||customElements.define(R,Wt)}const jt=`:host {
  display: block;
  width: 100%;
}

:host([hidden]) {
  display: none;
  visibility: hidden;
}

*,
*::before,
*::after {
  box-sizing: border-box;
}

h2 {
  margin: 0;
}

.card-component {
  background-color: var(--color-bg-input);
  border-radius: var(--radius-lg);
  border: var(--border-01) solid var(--color-border);
  box-shadow: none;
}

.card-component__container {
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
  background-color: var(--color-bg);
  border-radius: inherit;
  padding: var(--spacing-lg);
  box-shadow: none;
}

.card-component__header {
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
  margin-bottom: var(--spacing-sm);
}

.card-icon {
  display: flex;
  align-items: center;
  justify-content: center;
}

.card-component__icon {
  width: 24px;
  height: 24px;
  fill: var(--color-text-secondary);
  margin-right: var(--spacing-xs);
}

.card-component__title {
  font-size: var(--font-size-heading);
  font-weight: var(--font-weight-semibold);
  margin: 0;
}

.card-component__content {
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
  margin-top: var(--spacing-xs);
  gap: var(--spacing-md);
}

.connection-notification {
  position: relative;
  display: flex;
  width: 100%;
  flex-direction: column;
  margin-bottom: var(--spacing-sm);
  color: var(--color-text-secondary);
  font-size: var(--font-size-label);
}

.connection-notification[hidden] {
  display: none;
}

.connection-notification[data-status="warning"] {
  color: var(--color-text-warning);
}

.connection-notification[data-status="success"] {
  color: var(--color-meter-green);
}

.connection-notification[data-status="error"],
.connection-notification[data-status="danger"] {
  color: var(--color-text-danger);
}

.card-actions {
  margin-top: var(--spacing-xl);
}

.wifi-connection-form__actions {
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
  gap: var(--spacing-sm);
}

.card-component__footer[hidden] {
  display: none;
}

::slotted(.card-component__description) {
  font-size: var(--font-size-label);
  line-height: 1.5;
  margin-bottom: var(--spacing-md);
  color: var(--color-text-secondary);
}

::slotted([slot="footer"]) {
  width: auto;
}
`,G="ui-card",pt=document.createElement("template");pt.innerHTML=`
  <style>${jt}</style>
  <div class="card-component">
    <div class="card-component__container">
      <div class="card-component__header">
        <span class="card-icon">
          <span class="card-component__icon"></span>
        </span>
        <h2 class="card-component__title"></h2>
      </div>
      <div
        class="connection-notification"
        role="status"
        aria-live="polite"
        aria-atomic="true"
        hidden
      ></div>
      <div class="card-component__content">
        <slot></slot>
      </div>
      <div class="card-actions wifi-connection-form__actions card-component__footer">
        <slot name="footer"></slot>
      </div>
    </div>
  </div>
`;function Yt(t,e){return t.includes("class=")?t.replace("<svg",`<svg class="${e}"`):t.replace("<svg",`<svg class="${e}"`)}class Xt extends HTMLElement{static get observedAttributes(){return["title"]}constructor(){super();const e=this.attachShadow({mode:"open"});e.append(pt.content.cloneNode(!0)),this.footerContainer=e.querySelector(".card-component__footer"),this.footerSlot=e.querySelector('slot[name="footer"]'),this.footerSlot.addEventListener("slotchange",()=>{this.syncFooterVisibility()}),this.iconElement=e.querySelector(".card-component__icon"),this.notificationElement=e.querySelector(".connection-notification"),this.titleElement=e.querySelector(".card-component__title")}connectedCallback(){this.dataset.component=G,this.syncAttributes(),this.syncFooterVisibility()}attributeChangedCallback(){this.syncAttributes()}get iconSvg(){return this.iconElement.innerHTML}set iconSvg(e){this.iconElement.innerHTML=e?Yt(e,"card-component__icon"):""}setNotification(e,n="info"){if(!e){this.notificationElement.hidden=!0,this.notificationElement.textContent="",this.notificationElement.removeAttribute("data-status"),this.notificationElement.setAttribute("role","status"),this.notificationElement.setAttribute("aria-live","polite");return}this.notificationElement.hidden=!1,this.notificationElement.textContent=e,this.notificationElement.setAttribute("data-status",n),n==="error"||n==="danger"?(this.notificationElement.setAttribute("role","alert"),this.notificationElement.setAttribute("aria-live","assertive")):n==="warning"?(this.notificationElement.setAttribute("role","alert"),this.notificationElement.setAttribute("aria-live","polite")):(this.notificationElement.setAttribute("role","status"),this.notificationElement.setAttribute("aria-live","polite"))}syncAttributes(){this.titleElement.textContent=this.getAttribute("title")||""}syncFooterVisibility(){const e=this.footerSlot.assignedElements({flatten:!0}).length>0;this.footerContainer.hidden=!e}}function Qt(){customElements.get(G)||customElements.define(G,Xt)}const te=`:host {
  display: block;
  width: 100%;
}

*,
*::before,
*::after {
  box-sizing: border-box;
}

.form-control {
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
}

.form-control label {
  font-size: var(--font-size-label);
  font-weight: var(--font-weight-regular);
  margin-bottom: var(--spacing-xs);
}

.form-control__input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
  gap: var(--spacing-sm);
}

.duration-fields {
  align-items: center;
}

.duration-fields ui-input {
  min-width: 0;
  flex: 1 1 0;
}
`,ee=document.createElement("template");ee.innerHTML=`
  <style>${te}</style>
  <div class="form-control">
    <label></label>
    <div class="form-control__input-wrapper duration-fields">
      <ui-input variant="number" inputmode="numeric"></ui-input>
      <ui-input variant="number" inputmode="numeric"></ui-input>
    </div>
  </div>
`;const ne=`:host {
  display: block;
  width: 100%;
}

*,
*::before,
*::after {
  box-sizing: border-box;
}

input,
textarea {
  margin: 0;
  font: inherit;
  color: inherit;
  -webkit-user-select: auto;
}

p {
  margin: 0;
}

.form-control {
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
}

.form-control label {
  font-size: var(--font-size-label);
  font-weight: var(--font-weight-regular);
  margin-bottom: var(--spacing-xs);
}

.form-control__input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
  gap: var(--spacing-sm);
}

.form-control__input-wrapper input {
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
  border: var(--border-01) solid var(--color-border);
  min-height: 44px;
  padding: var(--spacing-sm);
  border-radius: var(--input-radius);
  background-color: var(--color-bg-input);
  color: var(--color-text);
  font-size: var(--font-size-label);
}

.form-control__input-wrapper input:focus-visible {
  outline: var(--focus-ring-width) solid var(--focus-ring-color);
  outline-offset: var(--focus-ring-offset);
}

.form-control__input-wrapper input::file-selector-button {
  background-color: transparent;
  border: var(--border-01) solid var(--color-border);
  background-color: var(--color-bg);
  color: var(--color-text);
  border-radius: var(--radius-sm);
  min-height: 24px;
  font-size: var(--font-size-label);
  padding: var(--spacing-xs) var(--spacing-md);
  margin-right: var(--spacing-md);
}

.progress-bar {
  position: relative;
  width: 100%;
}

.progress-bar[hidden] {
  display: none;
}

.progress-bar progress[value] {
  -webkit-appearance: none;
  appearance: none;
  border: none;
  width: 100%;
  height: 12px;
  border-radius: var(--radius-lg);
  overflow: hidden;
  margin-top: var(--spacing-sm);
}

.progress-bar progress[value]::-webkit-progress-bar {
  background-color: var(--color-bg-active);
  border-radius: var(--radius-lg);
}

.progress-bar progress[value]::-webkit-progress-value {
  background-color: var(--color-meter-green);
  border-radius: var(--radius-lg);
}

.progress-bar__message {
  font-size: var(--font-size-label);
  line-height: 1.25;
  color: var(--color-text-secondary);
  margin-top: var(--spacing-xs);
}

.form-helper-text {
  margin-top: var(--spacing-lg);
  font-size: var(--font-size-caption);
  line-height: 1.5;
  color: var(--color-text-secondary);
}
`,ie=document.createElement("template");ie.innerHTML=`
  <style>${ne}</style>
  <div class="form-control">
    <label></label>
    <div class="form-control__input-wrapper">
      <input type="file" />
    </div>
    <div class="progress-bar">
      <progress value="0" max="100"></progress>
      <div class="progress-bar__message"></div>
    </div>
    <p class="form-helper-text"></p>
  </div>
`;const oe=`:host {
  display: inline-flex;
  width: 44px;
  height: 44px;
  min-width: 44px;
  vertical-align: middle;
}

*,
*::before,
*::after {
  box-sizing: border-box;
}

button {
  all: unset;
  box-sizing: border-box;
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  min-width: 44px;
  min-height: 44px;
  padding: 0;
  border: var(--border-01) solid transparent;
  border-radius: var(--button-radius);
  background-color: var(--color-text-secondary);
  color: var(--color-text-inverse);
  cursor: pointer;
}

button:focus-visible {
  outline: var(--focus-ring-width) solid var(--focus-ring-color);
  outline-offset: var(--focus-ring-offset);
}

button:disabled {
  background-color: var(--color-bg-mute);
  color: var(--color-text-mute);
  cursor: default;
}

:host([variant="primary"]) button {
  background-color: var(--color-bg-brand);
  color: var(--color-text-inverse);
}

:host([variant="primary"]) button:not(:disabled):is(:hover, :active) {
  background-color: var(--color-bg-brand-hover);
}

:host([variant="secondary"]) button {
  background-color: var(--color-bg-active);
  color: var(--color-fg-active);
}

:host([variant="secondary"]) button:not(:disabled):is(:hover, :active) {
  background-color: var(--color-bg-active);
  color: var(--color-fg-active);
}

:host([variant="outline"]) button {
  background-color: transparent;
  border-color: var(--color-border);
  color: var(--color-text-secondary);
}

:host([variant="outline"]) button:not(:disabled):is(:hover, :active) {
  background-color: var(--color-border);
  border-color: var(--color-border);
}

:host([variant="ghost"]) button {
  background-color: transparent;
  border-color: transparent;
  color: var(--color-text-secondary);
}

:host([variant="ghost"]) button:not(:disabled):is(:hover, :active) {
  background-color: var(--color-overlay);
}

:host([inverse]) button {
  color: var(--color-text-inverse);
}

:host([variant="outline"][inverse]) button {
  border-color: var(--color-text-inverse);
}

:host([variant="outline"][inverse]) button:not(:disabled):is(:hover, :active),
:host([variant="ghost"][inverse]) button:not(:disabled):is(:hover, :active) {
  background-color: var(--color-overlay);
  border-color: var(--color-text-inverse);
}

:host([rounded]) button {
  border-radius: var(--radius-full);
}

::slotted(svg) {
  width: 24px;
  height: 24px;
  flex-shrink: 0;
  fill: currentColor;
}
`,Z="ui-icon-button",bt=document.createElement("template");bt.innerHTML=`
  <style>${oe}</style>
  <button type="button" part="button">
    <slot></slot>
  </button>
`;function at(t){return t==="submit"||t==="reset"?t:"button"}class re extends HTMLElement{static get observedAttributes(){return["disabled","aria-label","type"]}constructor(){super();const e=this.attachShadow({mode:"open",delegatesFocus:!0});e.append(bt.content.cloneNode(!0)),this.button=e.querySelector("button")}connectedCallback(){this.dataset.component=Z,this.syncAttributes()}attributeChangedCallback(){this.syncAttributes()}get disabled(){return this.hasAttribute("disabled")}set disabled(e){this.toggleAttribute("disabled",e)}get type(){return at(this.getAttribute("type"))}set type(e){this.setAttribute("type",at(e))}focus(e){this.button.focus(e)}click(){this.button.click()}syncAttributes(){this.button.disabled=this.disabled,this.button.type=this.type,this.tabIndex=this.disabled?-1:0;const e=this.getAttribute("aria-label");e?this.button.setAttribute("aria-label",e):this.button.removeAttribute("aria-label")}}function se(){customElements.get(Z)||customElements.define(Z,re)}const ae='<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed"><path d="m644-428-58-58q9-47-27-88t-93-32l-58-58q17-8 34.5-12t37.5-4q75 0 127.5 52.5T660-500q0 20-4 37.5T644-428Zm128 126-58-56q38-29 67.5-63.5T832-500q-50-101-143.5-160.5T480-720q-29 0-57 4t-55 12l-62-62q41-17 84-25.5t90-8.5q151 0 269 83.5T920-500q-23 59-60.5 109.5T772-302Zm20 246L624-222q-35 11-70.5 16.5T480-200q-151 0-269-83.5T40-500q21-53 53-98.5t73-81.5L56-792l56-56 736 736-56 56ZM222-624q-29 26-53 57t-41 67q50 101 143.5 160.5T480-280q20 0 39-2.5t39-5.5l-36-38q-11 3-21 4.5t-21 1.5q-75 0-127.5-52.5T300-500q0-11 1.5-21t4.5-21l-84-82Zm319 93Zm-151 75Z"/></svg>',le='<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed"><path d="M480-320q75 0 127.5-52.5T660-500q0-75-52.5-127.5T480-680q-75 0-127.5 52.5T300-500q0 75 52.5 127.5T480-320Zm0-72q-45 0-76.5-31.5T372-500q0-45 31.5-76.5T480-608q45 0 76.5 31.5T588-500q0 45-31.5 76.5T480-392Zm0 192q-146 0-266-81.5T40-500q54-137 174-218.5T480-800q146 0 266 81.5T920-500q-54 137-174 218.5T480-200Zm0-300Zm0 220q113 0 207.5-59.5T832-500q-50-101-144.5-160.5T480-720q-113 0-207.5 59.5T128-500q50 101 144.5 160.5T480-280Z"/></svg>',ce=`:host {
  display: block;
  width: 100%;
}

*,
*::before,
*::after {
  box-sizing: border-box;
}

input,
button,
select,
textarea {
  margin: 0;
  font: inherit;
  color: inherit;
}

input,
textarea {
  -webkit-user-select: auto;
}

p {
  margin: 0;
}

.form-control__input-wrapper input,
.password-toggle-btn {
  font: inherit;
}

.form-control {
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
}

.form-control label {
  font-size: var(--font-size-label);
  font-weight: var(--font-weight-regular);
  margin-bottom: var(--spacing-xs);
}

.form-helper-text {
  margin-top: var(--spacing-xs);
  font-size: var(--font-size-caption);
  line-height: 1.25;
  color: var(--color-text-secondary);
}

.form-control__input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
  gap: var(--spacing-sm);
}

.form-control__input-wrapper input {
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
  border: var(--border-01) solid var(--color-border);
  min-height: 44px;
  padding: var(--spacing-xs) var(--spacing-sm);
  border-radius: var(--input-radius);
  background-color: var(--color-bg-input);
  color: var(--color-text);
  font-size: var(--font-size-label);
  line-height: normal;
  appearance: none;
  -webkit-appearance: none;
}

.form-control__input-wrapper input::placeholder {
  color: var(--color-text-mute);
}

.form-control__input-wrapper input[type="time"]::-webkit-calendar-picker-indicator,
.form-control__input-wrapper input[type="date"]::-webkit-calendar-picker-indicator {
  display: none;
  -webkit-appearance: none;
}

.form-control__input-wrapper input:focus-visible,
.password-toggle-btn:focus-visible {
  outline: var(--focus-ring-width) solid var(--focus-ring-color);
  outline-offset: var(--focus-ring-offset);
}

:host(.error) input,
:host([invalid]) input,
:host([aria-invalid="true"]) input,
.form-control__input-wrapper input.error {
  outline: var(--focus-ring-width) solid var(--color-meter-red);
  outline-offset: var(--focus-ring-offset);
}

.duration-fields {
  align-items: center;
}

.duration-fields input {
  min-width: 0;
  flex: 1 1 0;
}

.duration-fields__unit {
  flex: 0 0 auto;
  font-size: var(--font-size-caption);
  font-weight: var(--font-weight-regular);
  color: var(--color-text-secondary);
  text-transform: uppercase;
}

.duration-fields__unit[hidden] {
  display: none;
}

.password-toggle-btn {
  position: absolute;
  right: 6px;
  display: flex;
  width: 36px;
  height: 36px;
  align-items: center;
  justify-content: center;
  padding: 0;
  border: none;
  border-radius: var(--radius-xs);
  background-color: transparent;
  color: var(--color-text-secondary);
  cursor: pointer;
  appearance: none;
  -webkit-appearance: none;
}

.password-toggle-btn:disabled {
  color: var(--color-text-mute);
  cursor: default;
}

.password-toggle-btn:not(:disabled):is(:hover, :active) {
  background-color: var(--color-overlay);
}

.password-icon {
  width: 24px;
  height: 24px;
  fill: var(--color-text-secondary);
}
`,U="ui-input",vt=document.createElement("template");vt.innerHTML=`
  <style>${ce}</style>
  <div class="form-control">
    <label></label>
    <div class="form-control__input-wrapper">
      <input />
      <span class="duration-fields__unit"></span>
    </div>
    <p class="form-helper-text"></p>
  </div>
`;function de(t){return t==="number"||t==="password"||t==="time"||t==="date"?t:"text"}function ue(t){return t==="password"||t==="number"||t==="time"||t==="date"?t:"text"}class he extends HTMLElement{constructor(){super(),this.isPasswordVisible=!1,this.customValidationMessage="";const e=this.attachShadow({mode:"open",delegatesFocus:!0});e.append(vt.content.cloneNode(!0)),this.input=e.querySelector("input"),this.helperText=e.querySelector(".form-helper-text"),this.label=e.querySelector("label"),this.suffix=e.querySelector(".duration-fields__unit"),this.toggleButton=document.createElement("button"),this.wrapper=e.querySelector(".form-control__input-wrapper"),this.toggleButton.className="password-toggle-btn",this.toggleButton.type="button",this.input.addEventListener("input",n=>{this.syncValidationState(),n.stopPropagation(),this.dispatchEvent(new Event("input",{bubbles:!0,composed:!0}))}),this.input.addEventListener("change",n=>{this.syncValidationState(),n.stopPropagation(),this.dispatchEvent(new Event("change",{bubbles:!0,composed:!0}))}),this.input.addEventListener("invalid",()=>{this.syncValidationState()}),this.toggleButton.addEventListener("click",()=>{this.togglePasswordVisibility()})}static get observedAttributes(){return["aria-label","aria-invalid","autocomplete","disabled","helper-text","invalid","inputmode","label","max","maxlength","min","name","placeholder","readonly","required","step","suffix","type","value","variant"]}connectedCallback(){this.hasAttribute("variant")||this.setAttribute("variant","text"),this.dataset.component=U,this.syncAttributes()}attributeChangedCallback(){this.syncAttributes()}get disabled(){return this.hasAttribute("disabled")}set disabled(e){this.toggleAttribute("disabled",e)}get type(){return this.input.type}set type(e){this.setAttribute("type",e)}get value(){return this.input.value}set value(e){this.input.value=e,this.syncValidationState()}focus(e){this.input.focus(e)}select(){this.input.select()}get validationMessage(){return this.input.validationMessage}get validity(){return this.input.validity}get willValidate(){return this.input.willValidate}checkValidity(){const e=this.input.checkValidity();return this.syncValidationState(),e}reportValidity(){const e=this.input.reportValidity();return this.syncValidationState(),e}setCustomValidity(e){this.customValidationMessage=e,this.input.setCustomValidity(e),this.syncValidationState()}syncAttributes(){const e=de(this.getAttribute("variant")),n=this.getAttribute("helper-text")||"",o=this.id?`${this.id}Input`:"input",i=this.getAttribute("label")||"",a=this.getAttribute("suffix")||"",l=e==="password"?this.isPasswordVisible?"text":"password":this.getAttribute("type")||ue(e);if(this.input.id=o,this.input.type=l,this.input.disabled=this.disabled,this.tabIndex=this.disabled?-1:0,this.input.readOnly=this.hasAttribute("readonly"),this.input.required=this.hasAttribute("required"),this.syncStringAttribute("aria-label"),this.syncStringAttribute("autocomplete"),this.syncStringAttribute("inputmode"),this.syncStringAttribute("max"),this.syncStringAttribute("maxlength"),this.syncStringAttribute("min"),this.syncStringAttribute("name"),this.syncStringAttribute("placeholder"),this.syncStringAttribute("step"),this.hasAttribute("value")&&this.input.value!==this.getAttribute("value")&&(this.input.value=this.getAttribute("value")||""),this.input.setCustomValidity(this.customValidationMessage),this.label.htmlFor=o,this.label.textContent=i,this.label.hidden=i.length===0,this.helperText.textContent=n,this.helperText.hidden=n.length===0,this.wrapper.classList.toggle("duration-fields",e==="number"),this.suffix.textContent=a,this.suffix.hidden=e!=="number"||a.length===0,n.length>0){const c=`${o}HelperText`;this.helperText.id=c,this.input.setAttribute("aria-describedby",c)}else this.helperText.removeAttribute("id"),this.input.removeAttribute("aria-describedby");e==="password"?(this.toggleButton.isConnected||this.wrapper.append(this.toggleButton),this.toggleButton.disabled=this.disabled,this.toggleButton.setAttribute("aria-label",this.isPasswordVisible?"Hide password":"Show password"),this.toggleButton.innerHTML=ge(this.isPasswordVisible?ae:le,"password-icon")):(this.isPasswordVisible=!1,this.toggleButton.remove()),this.syncValidationState()}syncStringAttribute(e){const n=this.getAttribute(e);if(n===null){this.input.removeAttribute(e);return}this.input.setAttribute(e,n)}togglePasswordVisibility(){this.isPasswordVisible=!this.isPasswordVisible,this.syncAttributes()}syncValidationState(){const e=this.hasAttribute("invalid")||this.getAttribute("aria-invalid")==="true"||!this.input.validity.valid;this.classList.toggle("error",e),this.input.classList.toggle("error",e),this.hasAttribute("invalid")!==e&&this.toggleAttribute("invalid",e),this.getAttribute("aria-invalid")!==String(e)&&this.setAttribute("aria-invalid",String(e)),this.input.getAttribute("aria-invalid")!==String(e)&&this.input.setAttribute("aria-invalid",String(e))}}function ge(t,e){return t.includes("class=")?t.replace("<svg",`<svg class="${e}"`):t.replace("<svg",`<svg class="${e}"`)}function fe(){customElements.get(U)||customElements.define(U,he)}const me=`:host {
  display: block;
  width: 100%;
}

:host([hidden]) {
  display: none;
}

*,
*::before,
*::after {
  box-sizing: border-box;
}

ol,
ul,
menu,
summary {
  margin: 0;
  padding: 0;
  list-style: none;
}

p {
  margin: 0;
}

.networks {
  position: relative;
  width: 100%;
  display: flex;
  flex-direction: column;
  margin-bottom: var(--spacing-lg);
}

.networks__list {
  position: relative;
  display: flex;
  width: 100%;
  flex-direction: column;
  height: 320px;
  overflow-y: auto;
  border: var(--border-01) solid var(--color-border);
  padding: var(--spacing-xs);
  border-radius: var(--radius-lg);
}

.networks__list:focus {
  outline: var(--focus-ring-width) solid var(--focus-ring-color);
  outline-offset: var(--focus-ring-offset);
}

.networks__list-empty-state {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  color: var(--color-text-secondary);
  font-size: var(--font-size-heading);
}

.wifi-find-icon {
  width: 64px;
  height: 64px;
  fill: var(--color-text-mute);
}

.networks__item {
  position: relative;
  width: 100%;
  display: flex;
  align-items: center;
  cursor: pointer;
  padding: var(--spacing-sm) var(--spacing-xs);
  border: var(--border-01) solid transparent;
  min-height: 32px;
  font-size: var(--font-size-label);
  justify-content: space-between;
  border-radius: var(--radius-xs);
}

.networks__item-ssid {
  font-weight: var(--font-weight-semibold);
}

.networks__item-details {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
}

.networks__item ~ .networks__item {
  border-top: var(--border-01) solid var(--color-bg-selected);
}

.networks__item[aria-selected="true"] {
  background-color: var(--color-bg-active);
  outline: var(--focus-ring-width) solid var(--color-fg-active);
  outline-offset: var(--focus-ring-offset);
}

.wifi-security-icon,
.wifi-signal-icon,
.wifi-connected-icon {
  width: 16px;
  height: 16px;
  fill: var(--color-text-secondary);
}
`,W="ui-network-list",yt="networkList",J="network-list-label",wt=document.createElement("template");wt.innerHTML=`
  <style>${me}</style>
  <div class="networks">
    <span id="${J}" hidden>Available networks</span>
    <ul
      id="${yt}"
      class="networks__list"
      role="listbox"
      aria-labelledby="${J}"
      tabindex="0"
    ></ul>
  </div>
`;class pe extends HTMLElement{static get observedAttributes(){return["aria-label","label"]}constructor(){super();const e=this.attachShadow({mode:"open",delegatesFocus:!0});e.append(wt.content.cloneNode(!0)),this.labelElement=e.querySelector(`#${J}`),this.listElement=e.querySelector(`#${yt}`),this.listElement.addEventListener("keydown",n=>{(n.key==="ArrowDown"||n.key==="ArrowUp"||n.key==="Home"||n.key==="End"||n.key===" ")&&n.preventDefault()})}connectedCallback(){this.tabIndex=0,this.dataset.component=W,this.syncAttributes()}attributeChangedCallback(){this.syncAttributes()}appendItem(e){this.listElement.appendChild(e)}clearItems(){this.listElement.innerHTML=""}focus(e){this.listElement.focus(e)}getOptions(){return Array.from(this.listElement.querySelectorAll('[role="option"]'))}scrollOptionIntoView(e){const n=this.getOptions()[e];if(!n)return;const o=this.listElement.scrollTop,i=o+this.listElement.clientHeight,a=n.offsetTop,l=a+n.offsetHeight;if(a<o){this.listElement.scrollTop=a;return}l>i&&(this.listElement.scrollTop=l-this.listElement.clientHeight)}setActiveDescendant(e){if(e){this.listElement.setAttribute("aria-activedescendant",e);return}this.listElement.removeAttribute("aria-activedescendant")}setEmptyState(e){this.clearItems(),this.appendItem(e)}syncAttributes(){const e=this.getAttribute("label")||"Available networks",n=this.getAttribute("aria-label");this.labelElement.textContent=e,n?this.listElement.setAttribute("aria-label",n):this.listElement.removeAttribute("aria-label")}}function be(){customElements.get(W)||customElements.define(W,pe)}const ve=`:host {
  display: block;
  width: 100%;
}

:host([hidden]) {
  display: none;
}

*,
*::before,
*::after {
  box-sizing: border-box;
}

.wifi-status-card {
  position: relative;
  display: flex;
  width: 100%;
  align-items: center;
  background-color: var(--color-bg-brand);
  padding: var(--spacing-md) var(--spacing-md);
  border-radius: var(--radius-lg);
}

.wifi-status-card__content {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--spacing-sm);
  flex-wrap: wrap;
  width: 100%;
}

.wifi-status-card__content .wifi-icon {
  width: 32px;
  height: 32px;
  fill: var(--color-text-inverse);
}

.wifi-status-card__actions {
  position: relative;
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  margin-left: auto;
}

.wifi-status-card__status {
  position: relative;
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  min-width: 0;
}

.wifi-status-card__label {
  font-size: var(--font-size-label);
  color: var(--color-text-inverse);
  font-weight: var(--font-weight-medium);
}

.wifi-status-card__network {
  font-size: var(--font-size-label);
  color: var(--color-text-inverse);
  font-weight: var(--font-weight-semibold);
  min-width: 0;
  overflow-wrap: anywhere;
}
`,j="ui-network-status",xt="actionBtn",St="settingsBtn",Tt="wifiStatusLabel",kt="wifiStatusIcon",At="wifiStatusNetwork",Ct=document.createElement("template");Ct.innerHTML=`
  <style>${ve}</style>
  <div class="wifi-status-card">
    <div class="wifi-status-card__content">
      <div class="wifi-status-card__status">
        <span class="card-icon" id="${kt}"></span>
        <span id="${Tt}" class="wifi-status-card__label">
          Disconnected
        </span>
        <span
          id="${At}"
          class="wifi-status-card__network"
        ></span>
      </div>
      <div class="wifi-status-card__actions">
        <ui-button
          id="${xt}"
          variant="outline"
          inverse
          aria-label="Connect"
        >
          Connect
        </ui-button>
        <ui-button
          id="${St}"
          variant="outline"
          inverse
          aria-label="Settings"
        >
          Settings
        </ui-button>
      </div>
    </div>
  </div>
`;function ye(t,e){return t.includes("class=")?t.replace("<svg",`<svg class="${e}"`):t.replace("<svg",`<svg class="${e}"`)}class we extends HTMLElement{static get observedAttributes(){return["action-label","network","status-label"]}constructor(){super();const e=this.attachShadow({mode:"open"});e.append(Ct.content.cloneNode(!0)),this.actionButton=e.querySelector(`#${xt}`),this.actionButton.addEventListener("click",n=>{n.stopPropagation(),this.dispatchEvent(new Event("action",{bubbles:!0,composed:!0}))}),this.iconElement=e.querySelector(`#${kt}`),this.labelElement=e.querySelector(`#${Tt}`),this.networkElement=e.querySelector(`#${At}`),this.settingsButton=e.querySelector(`#${St}`),this.settingsButton.addEventListener("click",n=>{n.stopPropagation(),this.dispatchEvent(new Event("settings",{bubbles:!0,composed:!0}))})}connectedCallback(){this.dataset.component=j,this.syncAttributes()}attributeChangedCallback(){this.syncAttributes()}get actionDisabled(){return!!this.actionButton.disabled}set actionDisabled(e){this.actionButton.disabled=e}get iconSvg(){return this.iconElement.innerHTML}set iconSvg(e){this.iconElement.innerHTML=e?ye(e,"wifi-icon"):""}get network(){return this.getAttribute("network")||""}set network(e){this.setAttribute("network",e)}get actionLabel(){return this.getAttribute("action-label")||"Connect"}set actionLabel(e){this.setAttribute("action-label",e)}get statusLabel(){return this.getAttribute("status-label")||"Disconnected"}set statusLabel(e){this.setAttribute("status-label",e)}syncAttributes(){this.actionButton.textContent=this.actionLabel,this.actionButton.setAttribute("aria-label",this.actionLabel),this.labelElement.textContent=this.statusLabel,this.networkElement.textContent=this.network,this.networkElement.hidden=this.network.length===0}}function xe(){customElements.get(j)||customElements.define(j,we)}const Se=`:host {
  display: block;
  width: 100%;
}

*,
*::before,
*::after {
  box-sizing: border-box;
}

input,
textarea {
  margin: 0;
  font: inherit;
  color: inherit;
  -webkit-user-select: auto;
}

.form-control {
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
}

.form-control label {
  font-size: var(--font-size-label);
  font-weight: var(--font-weight-regular);
  margin-bottom: var(--spacing-xs);
}

.range-slider {
  width: 100%;
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}

.range-slider__range {
  -webkit-appearance: none;
  appearance: none;
  width: 100%;
  height: 34px;
  border-radius: var(--radius-full);
  background: var(--color-bg-input);
  outline: none;
}

.range-slider__range:focus-visible {
  outline: var(--focus-ring-width) solid var(--focus-ring-color);
  outline-offset: var(--focus-ring-offset);
}

.range-slider__range::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background: var(--color-bg);
  border: var(--border-03) solid var(--color-bg-brand);
  box-shadow: 0px 2px 6px -2px rgba(32, 32, 32, 0.4);
  cursor: pointer;
  transition: background 0.15s ease-in-out;
}

.range-slider__range::-webkit-slider-thumb:hover {
  background: var(--color-bg);
}

.range-slider__range:active::-webkit-slider-thumb {
  background: var(--color-bg);
}

.range-slider__range::-moz-range-thumb {
  width: 30px;
  height: 30px;
  border: var(--border-03) solid var(--color-bg-brand);
  border-radius: 50%;
  background: var(--color-bg);
  box-shadow: 0px 2px 6px -2px rgba(32, 32, 32, 0.4);
  cursor: pointer;
  transition: background 0.15s ease-in-out;
}

.range-slider__range::-moz-range-thumb:hover {
  background: var(--color-bg);
}

.range-slider__range:active::-moz-range-thumb {
  background: var(--color-bg);
}

.range-slider__value {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 48px;
  height: 28px;
  font-size: var(--font-size-label);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-inverse);
  background: var(--color-bg-brand);
  border-radius: var(--radius-md);
}
`,Te=document.createElement("template");Te.innerHTML=`
  <style>${Se}</style>
  <div class="form-control">
    <label></label>
    <div class="range-slider">
      <input class="range-slider__range" type="range" />
      <span class="range-slider__value"></span>
    </div>
  </div>
`;const ke='<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed"><path d="M480-80 240-320l57-57 183 183 183-183 57 57L480-80ZM298-584l-58-56 240-240 240 240-58 56-182-182-182 182Z"/></svg>',Ae=`:host {
  display: block;
  width: 100%;
}

*,
*::before,
*::after {
  box-sizing: border-box;
}

input,
button,
select,
textarea {
  margin: 0;
  font: inherit;
  color: inherit;
}

input,
textarea {
  -webkit-user-select: auto;
}

p {
  margin: 0;
}

.form-control {
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
}

.form-control label {
  font-size: var(--font-size-label);
  font-weight: var(--font-weight-regular);
  margin-bottom: var(--spacing-xs);
}

.form-helper-text {
  margin-top: var(--spacing-xs);
  font-size: var(--font-size-caption);
  line-height: 1.25;
  color: var(--color-text-secondary);
}

.form-control__input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
  gap: var(--spacing-sm);
}

.form-control__input-wrapper select {
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
  border: var(--border-01) solid var(--color-border);
  min-height: 44px;
  padding: var(--spacing-xs) var(--spacing-sm);
  border-radius: var(--input-radius);
  background-color: var(--color-bg-input);
  color: var(--color-text);
  font-size: var(--font-size-label);
  line-height: normal;
  appearance: none;
  -webkit-appearance: none;
}

.select-icon {
  position: absolute;
  width: 32px;
  height: 18px;
  background-color: transparent;
  border-radius: var(--radius-xs);
  right: 2px;
  fill: var(--color-text-secondary);
  pointer-events: none;
}

.form-control__input-wrapper select:focus-visible {
  outline: var(--focus-ring-width) solid var(--focus-ring-color);
  outline-offset: var(--focus-ring-offset);
}

:host(.error) select,
:host([invalid]) select,
:host([aria-invalid="true"]) select,
.form-control__input-wrapper select.error {
  outline: var(--focus-ring-width) solid var(--color-meter-red);
  outline-offset: var(--focus-ring-offset);
}
`,Y="ui-select",Et=document.createElement("template");Et.innerHTML=`
  <style>${Ae}</style>
  <div class="form-control">
    <label></label>
    <div class="form-control__input-wrapper">
      <select></select>
      <span class="select-icon"></span>
    </div>
    <p class="form-helper-text"></p>
  </div>
`;class Ce extends HTMLElement{constructor(){super(),this.customValidationMessage="";const e=this.attachShadow({mode:"open",delegatesFocus:!0});e.append(Et.content.cloneNode(!0)),this.helperText=e.querySelector(".form-helper-text"),this.labelElement=e.querySelector("label"),this.select=e.querySelector("select");const n=e.querySelector(".select-icon");n.innerHTML=_e(ke,"select-icon"),this.select.addEventListener("change",o=>{this.syncValidationState(),o.stopPropagation(),this.dispatchEvent(new Event("change",{bubbles:!0,composed:!0}))}),this.select.addEventListener("input",o=>{this.syncValidationState(),o.stopPropagation(),this.dispatchEvent(new Event("input",{bubbles:!0,composed:!0}))}),this.select.addEventListener("invalid",()=>{this.syncValidationState()})}static get observedAttributes(){return["aria-invalid","aria-label","disabled","helper-text","invalid","label","name","required","value"]}connectedCallback(){this.moveLightDomOptions(),this.dataset.component=Y,this.syncAttributes()}attributeChangedCallback(){this.syncAttributes()}get disabled(){return this.hasAttribute("disabled")}set disabled(e){this.toggleAttribute("disabled",e)}get innerHTML(){return this.select.innerHTML}set innerHTML(e){this.select.innerHTML=e,this.syncValidationState()}get value(){return this.select.value}set value(e){this.select.value=e,this.syncValidationState()}appendChild(e){return e instanceof HTMLOptionElement||e instanceof HTMLOptGroupElement?(this.select.appendChild(e),e):super.appendChild(e)}focus(e){this.select.focus(e)}get validationMessage(){return this.select.validationMessage}get validity(){return this.select.validity}get willValidate(){return this.select.willValidate}checkValidity(){const e=this.select.checkValidity();return this.syncValidationState(),e}reportValidity(){const e=this.select.reportValidity();return this.syncValidationState(),e}setCustomValidity(e){this.customValidationMessage=e,this.select.setCustomValidity(e),this.syncValidationState()}moveLightDomOptions(){Array.from(this.children).forEach(e=>{(e instanceof HTMLOptionElement||e instanceof HTMLOptGroupElement)&&this.select.appendChild(e)})}syncAttributes(){const e=this.getAttribute("helper-text")||"",n=this.id?`${this.id}Select`:"select",o=this.getAttribute("label")||"";if(this.select.id=n,this.select.disabled=this.disabled,this.tabIndex=this.disabled?-1:0,this.select.required=this.hasAttribute("required"),this.syncStringAttribute("aria-label"),this.syncStringAttribute("name"),this.hasAttribute("value")&&(this.select.value=this.getAttribute("value")||""),this.select.setCustomValidity(this.customValidationMessage),this.labelElement.htmlFor=n,this.labelElement.textContent=o,this.labelElement.hidden=o.length===0,this.helperText.textContent=e,this.helperText.hidden=e.length===0,e.length>0){const i=`${n}HelperText`;this.helperText.id=i,this.select.setAttribute("aria-describedby",i)}else this.helperText.removeAttribute("id"),this.select.removeAttribute("aria-describedby");this.syncValidationState()}syncStringAttribute(e){const n=this.getAttribute(e);if(n===null){this.select.removeAttribute(e);return}this.select.setAttribute(e,n)}syncValidationState(){const e=this.hasAttribute("invalid")||this.getAttribute("aria-invalid")==="true"||!this.select.validity.valid;this.classList.toggle("error",e),this.select.classList.toggle("error",e),this.hasAttribute("invalid")!==e&&this.toggleAttribute("invalid",e),this.getAttribute("aria-invalid")!==String(e)&&this.setAttribute("aria-invalid",String(e)),this.select.getAttribute("aria-invalid")!==String(e)&&this.select.setAttribute("aria-invalid",String(e))}}function Ee(){customElements.get(Y)||customElements.define(Y,Ce)}function _e(t,e){return t.includes("class=")?t.replace("<svg",`<svg class="${e}"`):t.replace("<svg",`<svg class="${e}"`)}const Le=`:host {
  display: block;
  width: 100%;
}

*,
*::before,
*::after {
  box-sizing: border-box;
}

.form-control {
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
}

.switch-container {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}

.switch-label {
  font-size: var(--font-size-label);
  font-weight: var(--font-weight-medium);
  flex-shrink: 0;
}

button {
  all: unset;
  box-sizing: border-box;
  position: relative;
  display: inline-flex;
  align-items: center;
  flex-shrink: 0;
  width: 62px;
  height: 34px;
  padding: 0;
  border: none;
  border-radius: var(--radius-full);
  background-color: var(--color-bg-input);
  color: inherit;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

button:disabled {
  cursor: not-allowed;
  opacity: 0.6;
}

.switch-label[hidden] {
  display: none;
}

button[data-checked] {
  background-color: var(--color-bg-brand);
}

button::before {
  content: "";
  position: absolute;
  inset: 0;
  border-radius: inherit;
  opacity: 0;
  box-shadow: 0 0 0 var(--focus-ring-width) currentColor;
  transition: opacity 0.2s ease;
}

button:focus-visible::before {
  opacity: 0.35;
}

.knob {
  position: absolute;
  left: 2px;
  width: 30px;
  height: 30px;
  border-radius: var(--radius-full);
  background-color: var(--color-fg-knob-off);
  box-shadow: 0 2px 6px -2px rgba(32, 32, 32, 0.4);
  transition:
    transform 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275),
    background-color 0.2s ease;
}

button[data-checked] .knob {
  background-color: var(--color-fg-knob-on);
}
`,Ie=document.createElement("template");Ie.innerHTML=`
  <style>${Le}</style>
  <div class="form-control">
    <div class="switch-container">
      <button type="button" part="button">
        <span class="knob"></span>
      </button>
      <span class="switch-label"></span>
    </div>
  </div>
`;const ze=`:host {
  display: contents;
}

*,
*::before,
*::after {
  box-sizing: border-box;
}

.toast-dialog {
  position: fixed;
  left: 50%;
  bottom: var(--spacing-4xl);
  margin: 0;
  padding: 0;
  border: none;
  background: transparent;
  color: inherit;
  width: min(50vw, calc(100vw - 2rem));
  max-width: calc(100vw - 2rem);
  pointer-events: none;
  z-index: 30;
}

.toast-dialog[open] {
  display: block;
  animation: toast-dialog-fade 2.6s ease forwards;
}

.toast-dialog::backdrop {
  display: none;
}

.toast-dialog__message {
  margin: 0;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: var(--spacing-sm) var(--spacing-lg);
  min-height: 44px;
  overflow: hidden;
  border: var(--border-01) solid var(--color-meter-green);
  border-radius: var(--radius-lg);
  background: var(--color-bg-active);
  color: var(--color-text);
  box-shadow: 0 0.5rem 1.25rem var(--color-overlay);
  font-size: var(--font-size-label);
  line-height: 1.25;
  text-align: center;
  text-overflow: ellipsis;
}

.toast-dialog[data-status='error'] .toast-dialog__message,
.toast-dialog[data-status='danger'] .toast-dialog__message {
  border-color: var(--color-text-danger);
  background: var(--color-bg-danger);
  color: var(--color-text-danger);
}

.toast-dialog[data-status='warning'] .toast-dialog__message {
  border-color: var(--color-meter-yellow);
  background: var(--color-bg-selected);
  color: var(--color-text-warning);
}

@keyframes toast-dialog-fade {
  0% {
    opacity: 0;
    transform: translate(-50%, 0.75rem);
  }

  12%,
  78% {
    opacity: 1;
    transform: translate(-50%, 0);
  }

  100% {
    opacity: 0;
    transform: translate(-50%, -0.25rem);
  }
}
`,X="ui-toast",_t=document.createElement("template");_t.innerHTML=`
  <style>${ze}</style>
  <dialog class="toast-dialog" aria-live="polite">
    <p class="toast-dialog__message"></p>
  </dialog>
`;function lt(t){return t==="success"||t==="info"||t==="warning"||t==="error"||t==="danger"?t:null}class Be extends HTMLElement{static get observedAttributes(){return["aria-label","message","status"]}constructor(){super();const e=this.attachShadow({mode:"open"});e.append(_t.content.cloneNode(!0)),this.dialog=e.querySelector("dialog"),this.messageElement=e.querySelector(".toast-dialog__message")}connectedCallback(){this.dataset.component=X,this.syncAttributes()}attributeChangedCallback(){this.syncAttributes()}get message(){return this.messageElement.textContent||""}set message(e){this.setAttribute("message",e)}get status(){return lt(this.getAttribute("status"))}set status(e){if(e){this.setAttribute("status",e);return}this.removeAttribute("status")}show(e,n){typeof e=="string"&&(this.message=e),n&&(this.status=n),this.dialog.open||this.dialog.show()}close(e){this.dialog.close(e)}syncAttributes(){const e=this.getAttribute("aria-label"),n=this.getAttribute("message")||"",o=lt(this.getAttribute("status"));e?this.dialog.setAttribute("aria-label",e):this.dialog.removeAttribute("aria-label"),this.messageElement.textContent=n,this.messageElement.id=this.id?`${this.id}Message`:"statusToastMessage",this.dialog.id=this.id||"statusToast",o?this.dialog.setAttribute("data-status",o):this.dialog.removeAttribute("data-status")}}function Me(){customElements.get(X)||customElements.define(X,Be)}const qe='<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed"><path d="m109-531-85-85q92-89 210-136.5T480-800q128 0 246 47.5T936-616l-85 85q-75-72-171-110.5T480-680q-104 0-200 38.5T109-531Zm169 169-84-84q59-55 132.5-84.5T480-560q80 0 153.5 29.5T766-446l-84 84q-42-38-93.5-58T480-440q-57 0-108.5 20T278-362Zm202 202q-33 0-56.5-23.5T400-240q0-33 23.5-56.5T480-320q33 0 56.5 23.5T560-240q0 33-23.5 56.5T480-160Z"/></svg>',Pe='<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed"><path d="M240-80q-33 0-56.5-23.5T160-160v-400q0-33 23.5-56.5T240-640h40v-80q0-83 58.5-141.5T480-920q83 0 141.5 58.5T680-720v80h40q33 0 56.5 23.5T800-560v400q0 33-23.5 56.5T720-80H240Zm0-80h480v-400H240v400Zm240-120q33 0 56.5-23.5T560-360q0-33-23.5-56.5T480-440q-33 0-56.5 23.5T400-360q0 33 23.5 56.5T480-280ZM360-640h240v-80q0-50-35-85t-85-35q-50 0-85 35t-35 85v80ZM240-160v-400 400Z"/></svg>',Oe='<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed"><path d="M480-120 0-600q96-98 220-149t260-51q137 0 261 51t219 149L480-120ZM361-353q25-18 55.5-28t63.5-10q33 0 63.5 10t55.5 28l245-245q-78-59-170.5-90.5T480-720q-101 0-193.5 31.5T116-598l245 245Z"/></svg>',Ne='<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed"><path d="M480-120 0-600q96-98 220-149t260-51q137 0 261 51t219 149L480-120ZM299-415q38-28 84-43.5t97-15.5q51 0 97 15.5t84 43.5l183-183q-78-59-170.5-90.5T480-720q-101 0-193.5 31.5T116-598l183 183Z"/></svg>',De='<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed"><path d="M480-120 0-600q96-98 220-149t260-51q137 0 261 51t219 149L480-120ZM232-482q53-38 116-59.5T480-563q69 0 132 21.5T728-482l116-116q-78-59-170.5-90.5T480-720q-101 0-193.5 31.5T116-598l116 116Z"/></svg>',$e='<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed"><path d="M480-120 0-600q95-97 219.5-148.5T480-800q136 0 260.5 51.5T960-600L480-120Z"/></svg>',Ve='<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed"><path d="M480-120 0-601q93-93 215.5-146T480-800q142 0 264.5 53T960-601l-56 57q-81-81-190-128.5T480-720q-103 0-195 32.5T117-597l419 420-56 57Zm384-40L761-262q-18 11-38 16.5t-43 5.5q-68 0-114-46t-46-114q0-68 46-114t114-46q68 0 114 46t46 114q0 23-5.5 43T818-319l102 103-56 56ZM680-320q34 0 57-23t23-57q0-34-23-57t-57-23q-34 0-57 23t-23 57q0 34 23 57t57 23ZM480-177Z"/></svg>',He='<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed"><path d="M280-240q-100 0-170-70T40-480q0-100 70-170t170-70q66 0 121 33t87 87h432v240h-80v120H600v-120H488q-32 54-87 87t-121 33Zm0-80q66 0 106-40.5t48-79.5h246v120h80v-120h80v-80H434q-8-39-48-79.5T280-640q-66 0-113 47t-47 113q0 66 47 113t113 47Zm0-80q33 0 56.5-23.5T360-480q0-33-23.5-56.5T280-560q-33 0-56.5 23.5T200-480q0 33 23.5 56.5T280-400Zm0-80Z"/></svg>',Ke='<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed"><path d="M382-240 154-468l57-57 171 171 367-367 57 57-424 424Z"/></svg>',Fe='<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed"><path d="m612-292 56-56-148-148v-184h-80v216l172 172ZM480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-400Zm0 320q133 0 226.5-93.5T800-480q0-133-93.5-226.5T480-800q-133 0-226.5 93.5T160-480q0 133 93.5 226.5T480-160Z"/></svg>',Re={"Content-Type":"application/json",Accept:"application/json"},ct=64,Ge=2e3,Ze=8,Ue=2e3,We=8,Je=3e3,je=750,Ye=20,Xe="/api/settings",Qe=`${Xe}/time`,tn="/api/runtime/time",en=1e4;async function B(t,e){const n=new AbortController,o=setTimeout(()=>n.abort(),en);let i;try{i=await fetch(t,{cache:"no-store",...e,signal:e?.signal??n.signal,headers:{...Re,...e?.headers||{}}})}catch(d){throw n.signal.aborted?new Error(`Request to ${t} timed out. Check the device is still reachable.`):d}finally{clearTimeout(o)}const a=i.headers.get("content-type")||"",l=await i.text();if(!a.includes("application/json"))throw new Error(`Unexpected response for ${t}. Make sure you are connected to the device AP and loading the portal from the ESP32.`);const c=JSON.parse(l);if(!i.ok||c.success!==!0)throw new Error(c.message||"Request failed.");return c}const nn=(t,e)=>B(t,e),on=(t,e)=>B(t,e),rn=(t,e)=>B(t,e),Lt=(t,e)=>B(t,e),sn=(t,e)=>B(t,e);function v(t){const e=document.getElementById(t);if(!e)throw new Error(`Required portal element "#${t}" was not found.`);return e}function an(){return{wifiStatusCard:v("wifiStatusCard"),wifiSettingsSheet:v("wifiSettingsSheet"),wifiSettingsCloseBtn:v("wifiSettingsCloseBtn"),wifiSettingsNotification:v("wifiSettingsNotification"),networkList:v("networkList"),passwordInput:v("password"),scanBtn:v("scanBtn"),connectBtn:v("connectBtn"),geminiCard:v("geminiCard"),geminiApiKeyInput:v("geminiApiKeyInput"),geminiClearBtn:v("geminiClearBtn"),geminiSaveBtn:v("geminiSaveBtn"),timezoneLocationCard:v("timezoneLocationCard"),timezoneSelect:v("timezoneSelect"),manualTimeInput:v("manualTimeInput"),manualDateInput:v("manualDateInput"),timezoneLocationClearBtn:v("timezoneLocationClearBtn"),timezoneLocationSaveBtn:v("timezoneLocationSaveBtn")}}function It(t){return(e,n="info")=>{t.setNotification(e,n)}}function ln(t){return(e,n="info")=>{if(!e){t.hidden=!0,t.textContent="",t.removeAttribute("data-status"),t.setAttribute("role","status"),t.setAttribute("aria-live","polite");return}t.hidden=!1,t.textContent=e,t.setAttribute("data-status",n),n==="error"||n==="danger"?(t.setAttribute("role","alert"),t.setAttribute("aria-live","assertive")):n==="warning"?(t.setAttribute("role","alert"),t.setAttribute("aria-live","polite")):(t.setAttribute("role","status"),t.setAttribute("aria-live","polite"))}}function tt(t){t.classList.remove("error"),t.removeAttribute("invalid"),t.setAttribute("aria-invalid","false"),t.setCustomValidity?.("")}function et(t,e){t.classList.add("error"),t.setAttribute("invalid",""),t.setAttribute("aria-invalid","true"),t.setCustomValidity?.(e)}function cn(t,e){t.setAttribute("aria-checked",e?"true":"false")}function dn(t){return t.getAttribute("aria-checked")==="true"}function un(t,e){return t.includes("class=")?t.replace("<svg",`<svg class="${e}"`):t.replace("<svg",`<svg class="${e}"`)}function hn(t){return new Promise(e=>{setTimeout(e,t)})}function gn(){const t=document.documentElement.lang?.trim();return t||"en-US"}function fn(t){try{return new Intl.DateTimeFormat(gn(),{hour:"numeric",timeZone:t,timeZoneName:"longGeneric"}).formatToParts(new Date).find(o=>o.type==="timeZoneName")?.value?.trim()||""}catch(e){return console.warn(`Failed to format timezone label for "${t}".`,e),""}}function dt(t){return/^(GMT|UTC)(?:[+-]\d{1,2}(?::\d{2})?)?$/.test(t)}function mn(t){return(t.split("/").pop()||t).replace(/_/g," ")}function zt(t){return t.split("/").map(e=>e.replace(/_/g," ")).join(" / ")}function pn(t){const e=t.map(i=>{const a=fn(i.name);return{cityLabel:mn(i.name),genericLabel:a,name:i.name}}),n=new Map(e.map(i=>[i.name,i])),o=new Map;return e.forEach(i=>{!i.genericLabel||dt(i.genericLabel)||o.set(i.genericLabel,(o.get(i.genericLabel)||0)+1)}),new Map(t.map(i=>{const a=n.get(i.name),l=i.description?.trim()||"";if(a?.genericLabel&&!dt(a.genericLabel)){const d=(o.get(a.genericLabel)||0)>1?`${a.genericLabel} (${a.cityLabel})`:a.genericLabel;return[i.name,d]}return l?[i.name,l]:[i.name,zt(i.name)]}))}function bn(t,e){return e.get(t.name)||t.description?.trim()||zt(t.name)}function vn(t){const e=t.value.trim();if(!e)return null;const n=/^(\d{2}):(\d{2})$/.exec(e);if(!n)return null;const o=Number.parseInt(n[1],10),i=Number.parseInt(n[2],10);return!Number.isFinite(o)||!Number.isFinite(i)||o<0||o>23||i<0||i>59?null:o*60+i}function P(t,e,n){t.hasKey=n?.has_key===!0,t.last4=typeof n?.last4=="string"?n.last4:"",e.value=t.hasKey?t.last4?`******${t.last4}`:"******":""}function ut(t,e,n){t.hasKey=!1,t.last4="",e.value="",n("")}async function ht(t,e,n,o,i,a,l){const c=e.value.trim();if(!c){n(`${l} is required.`,"warning");return}t.isBusy=!0,n(a,"info"),o();try{const d=await i(t.settingsApi,{method:"PATCH",body:JSON.stringify({api_key:c})});P(t,e,d.settings),n(d.message||`${l} stored.`,"success")}catch(d){console.error(`${l} save failed:`,d),n(d instanceof Error?d.message:`Failed to store ${l}.`,"error")}finally{t.isBusy=!1,o()}}async function gt(t,e,n,o,i,a,l){t.isBusy=!0,n(a,"info"),o();try{const c=await i(t.resetApi,{method:"POST"});P(t,e,c.settings),n(c.message||l,"success")}catch(c){console.error(`${l} failed:`,c),n(c instanceof Error?c.message:`Failed to clear ${l}.`,"error")}finally{t.isBusy=!1,o()}}function yn(t){const e={hasKey:!1,isBusy:!1,last4:"",resetApi:"/api/settings/gemini/reset",settingsApi:"/api/settings/gemini"},n={hasKey:!1,isBusy:!1,last4:"",resetApi:"/api/settings/openai/reset",settingsApi:"/api/settings/openai"};function o(b){const y=b?.routes;e.settingsApi=y?.settings||"/api/settings/gemini",e.resetApi=y?.reset||"/api/settings/gemini/reset"}function i(b){const y=b?.routes;n.settingsApi=y?.settings||"/api/settings/openai",n.resetApi=y?.reset||"/api/settings/openai/reset"}function a(b){P(e,t.geminiApiKeyInput,b)}function l(){ut(e,t.geminiApiKeyInput,t.notifyGemini)}function c(b){P(n,t.openAiApiKeyInput,b)}function d(){ut(n,t.openAiApiKeyInput,t.notifyOpenAi)}async function f(){if(!t.isGeminiModuleActive()||e.isBusy||e.hasKey)return;if(!t.geminiApiKeyInput.value.trim()){t.notifyGemini("Gemini API key is required.","warning");return}await ht(e,t.geminiApiKeyInput,t.notifyGemini,t.updateButtons,t.fetchGeminiModuleJson,"Saving Gemini API key...","Gemini API key")}async function p(){!t.isGeminiModuleActive()||e.isBusy||await gt(e,t.geminiApiKeyInput,t.notifyGemini,t.updateButtons,t.fetchGeminiModuleJson,"Clearing Gemini API key...","Gemini API key cleared.")}async function A(){if(!t.isOpenAiModuleActive()||n.isBusy||n.hasKey)return;if(!t.openAiApiKeyInput.value.trim()){t.notifyOpenAi("OpenAI API key is required.","warning");return}await ht(n,t.openAiApiKeyInput,t.notifyOpenAi,t.updateButtons,t.fetchOpenAiModuleJson,"Saving OpenAI API key...","OpenAI API key")}async function T(){!t.isOpenAiModuleActive()||n.isBusy||await gt(n,t.openAiApiKeyInput,t.notifyOpenAi,t.updateButtons,t.fetchOpenAiModuleJson,"Clearing OpenAI API key...","OpenAI API key cleared.")}return{applyGeminiSettings:a,applyOpenAiSettings:c,clearGeminiKey:p,clearGeminiSettings:l,clearOpenAiKey:T,clearOpenAiSettings:d,getGeminiHasKey:()=>e.hasKey,getOpenAiHasKey:()=>n.hasKey,isGeminiBusy:()=>e.isBusy,isOpenAiBusy:()=>n.isBusy,saveGeminiKey:f,saveOpenAiKey:A,updateGeminiRoutes:o,updateOpenAiRoutes:i}}function wn(t){let e=!1,n=!1,o=!1,i=!1;async function a(){return t.fetchTimezoneListJson("/api/timezone/list")}function l(s){const h=s.settings,m=s.runtime;t.setSwitchChecked(t.clockModeToggle,!!h?.enabled),t.timezoneSelect.value=h?.timezone_name||"",t.clearFieldError(t.timezoneSelect),t.manualDateInput.value=typeof m?.current_date=="string"?m.current_date:"",t.manualTimeInput.value=typeof m?.current_time=="string"?m.current_time:""}function c(s){s&&(typeof s.clock_enabled=="boolean"&&t.setSwitchChecked(t.clockModeToggle,s.clock_enabled),t.manualDateInput.value=typeof s.current_date=="string"?s.current_date:"",t.manualTimeInput.value=typeof s.current_time=="string"?s.current_time:"")}async function d(){t.timezoneSelect.innerHTML="";const s=document.createElement("option");s.value="",s.textContent="Select timezone",t.timezoneSelect.appendChild(s);try{const h=await a(),m=Array.isArray(h.timezones)?h.timezones:[],S=t.buildTimezoneLabelMap(m);m.map(w=>({value:w.name,label:t.formatTimezoneLabel(w,S)})).sort((w,C)=>w.label.localeCompare(C.label)).forEach(w=>{const C=document.createElement("option");C.value=w.value,C.textContent=w.label,t.timezoneSelect.appendChild(C)})}catch(h){console.error("Timezone list fetch failed:",h),t.notify(h instanceof Error?h.message:"Failed to load timezones.","error")}}async function f(){if(!(e||n||o)){e=!0,n=!0,o=!0,t.onStateChange();try{const s=await t.fetchTimeSettingsJson(t.timeSettingsApi);l(s)}catch(s){console.error("Time settings status failed:",s),t.notify(s instanceof Error?s.message:"Time settings status failed.","error")}finally{e=!1,n=!1,o=!1,t.onStateChange()}}}async function p(){if(!(o||i)){i=!0;try{for(let s=0;s<t.clockSyncPollAttempts;s++){const h=await t.fetchTimeRuntimeJson(t.timeRuntimeApi);if(c(h.runtime),h.runtime?.time_valid===!0&&typeof h.runtime.current_time=="string"&&h.runtime.current_time.length>0)return;s<t.clockSyncPollAttempts-1&&await new Promise(m=>{setTimeout(m,t.clockSyncPollIntervalMs)})}}catch(s){console.error("Clock refresh after WiFi connect failed:",s)}finally{i=!1}}}async function A(){if(!(document.hidden||e||n||o)&&t.isSwitchChecked(t.clockModeToggle))try{const s=await t.fetchTimeRuntimeJson(t.timeRuntimeApi);c(s.runtime)}catch(s){console.error("Time runtime status failed:",s)}}function T(){const s=t.timezoneSelect.value.trim(),h=t.manualDateInput.value.trim(),m=t.manualTimeInput.value.trim(),S=t.parseClockTimeInputValue(t.wakeupTimeInput),w=t.parseClockTimeInputValue(t.bedtimeTimeInput);return!!h!=!!m?(t.notify("Provide both current date and time for a manual clock set.","error"),null):{timezoneName:s,manualDate:h,manualTime:m,wakeupMinutes:S??void 0,bedtimeMinutes:w??void 0}}async function b(s,h){return t.fetchTimeSettingsJson(t.timeSettingsApi,{method:"PATCH",body:JSON.stringify({timezone_name:s.timezoneName,enabled:h,manual_date:s.manualDate,manual_time:s.manualTime})})}async function y(){if(o||e||n){t.notifyClockMode("Clock mode update already in progress.","warning");return}const s=t.isSwitchChecked(t.clockModeToggle),h=!s,m=t.timezoneSelect.value.trim();t.setSwitchChecked(t.clockModeToggle,h),o=!0,t.notifyClockMode(h?"Enabling clock mode...":"Disabling clock mode...","info"),t.onStateChange();try{const S=await t.fetchTimeSettingsJson(t.timeSettingsApi,{method:"PATCH",body:JSON.stringify({enabled:h,timezone_name:h&&m?m:void 0})});l(S),t.notifyClockMode(S.message||(h?"Clock mode enabled.":"Clock mode disabled."),"success")}catch(S){t.setSwitchChecked(t.clockModeToggle,s),console.error("Clock mode toggle failed:",S);const w=S instanceof Error?S.message:"Failed to update clock mode.",C=w==="timezone_name required to enable clock"?"Please set timezone first.":w;w==="timezone_name required to enable clock"&&(t.setFieldError(t.timezoneSelect,"Select a timezone."),t.timezoneSelect.focus({preventScroll:!0})),t.notifyClockMode(C,"error")}finally{o=!1,t.onStateChange()}}async function k(){if(e||n||o||t.isTalkingClockModuleBusy()){t.notify("Time configuration update already in progress.","warning");return}const s=T();if(s){if(!s.timezoneName){t.setFieldError(t.timezoneSelect,"Select a timezone."),t.notify("Select a timezone.","error"),t.timezoneSelect.focus({preventScroll:!0});return}if(t.clearFieldError(t.timezoneSelect),t.isTalkingClockModuleActive()&&(s.wakeupMinutes===void 0||s.bedtimeMinutes===void 0)){t.notify("Wakeup and bedtime times are required for the talking clock module.","error"),t.focusTalkingClockTimeInput();return}e=!0,n=!0,o=!0,t.onTalkingClockBusyChange(t.isTalkingClockModuleActive()),t.notify("Saving time configuration...","info"),t.onStateChange();try{const h=await b(s,t.isSwitchChecked(t.clockModeToggle));if(l(h),t.isTalkingClockModuleActive()){const m=await t.patchTalkingClockSettings({wakeup_minutes:s.wakeupMinutes,bedtime_minutes:s.bedtimeMinutes});t.applyTalkingClockModuleSettings(m.settings)}t.notify("Time configuration saved successfully.","success")}catch(h){console.error("Timezone/location save failed:",h),t.notify(h instanceof Error?h.message:"Failed to save time configuration.","error")}finally{e=!1,n=!1,o=!1,t.onTalkingClockBusyChange(!1),t.onStateChange()}}}async function E(){if(e||n||o){t.notify("Time configuration update already in progress.","warning");return}e=!0,n=!0,o=!0,t.notify("Clearing timezone/location...","info"),t.onStateChange();try{const s=await t.fetchTimeSettingsJson(t.timeSettingsApi,{method:"PATCH",body:JSON.stringify({enabled:!1,timezone_name:""})});l(s),t.notify("Timezone/location cleared successfully.","success")}catch(s){console.error("Timezone/location clear failed:",s),t.notify(s instanceof Error?s.message:"Failed to clear timezone/location.","error")}finally{e=!1,n=!1,o=!1,t.onStateChange()}}return{applyTimeRuntimeStatus:c,applyTimeSettingsStatus:l,clearTimezoneLocation:E,fetchTimeRuntimeStatus:A,fetchTimeSettingsStatus:f,isClockBusy:()=>o,isLocationBusy:()=>n,isTimezoneBusy:()=>e,populateTimezoneOptions:d,refreshClockStatusAfterWifiConnect:p,saveTimezoneLocation:k,toggleClockModeSetting:y}}function xn(t,e){return t>=-50?e.fourBar:t>=-60?e.threeBar:t>=-70?e.twoBar:e.oneBar}function Sn(t){let e=[],n="",o=!1,i="",a=!1,l=!1,c=!1,d=-1;function f(){t.wifiStatusCard.hidden=!1,t.wifiStatusCard.statusLabel=o?"Connected":"Disconnected",t.wifiStatusCard.network=o?i:""}function p(){const r=document.createElement("li");r.className="networks__list-empty-state",r.innerHTML=`${t.svgWithClass(t.wifiFindIcon,"wifi-find-icon")}<p>Scan for available networks</p>`,t.networkList.setEmptyState(r)}function A(){if(e.length===0){n="",d=-1;return}const r=e.findIndex(u=>u.ssid===n);if(r>=0){d=r;return}n="",d=-1}function T(){const r=t.networkList.getOptions();r.forEach((u,g)=>{u.setAttribute("aria-selected",String(n===e[g]?.ssid))}),d>=0&&d<r.length?t.networkList.setActiveDescendant(r[d].id):t.networkList.setActiveDescendant(null)}function b(){const r=e.find(u=>u.ssid===n);return r?!r.is_open:!0}function y(r){n=r,d=e.findIndex(u=>u.ssid===r),b()||t.clearFieldError(t.passwordInput),T(),t.onStateChange()}function k(){if(A(),t.networkList.clearItems(),e.length===0){p();return}e.forEach((r,u)=>{const g=document.createElement("li");g.className="networks__item",g.id=`network-option-${u}`,g.setAttribute("role","option"),g.setAttribute("tabindex","-1"),g.setAttribute("aria-selected",String(n===r.ssid));const O=document.createElement("span");O.className="networks__item-ssid",O.textContent=r.ssid;const I=document.createElement("div");if(I.className="networks__item-details",i===r.ssid&&o){const $=document.createElement("span");$.title="Currently connected",$.innerHTML=t.svgWithClass(t.checkIcon,"wifi-connected-icon"),I.appendChild($)}const N=document.createElement("span");N.title=r.is_open?"Open":"Secured",r.is_open||(N.innerHTML=t.svgWithClass(t.securityIcon,"wifi-security-icon")),I.appendChild(N);const D=document.createElement("span");D.title=`Signal strength: ${r.signal_strength} (${r.rssi} dBm)`,D.innerHTML=t.svgWithClass(xn(r.rssi,t.signalIcons),"wifi-signal-icon"),I.appendChild(D),g.append(O,I),g.addEventListener("click",()=>{d=u,y(r.ssid),t.networkList.focus({preventScroll:!0})}),t.networkList.appendItem(g)}),T()}function E(r){const u=o,g=i;o=r.connected===!0,i=typeof r.ssid=="string"?r.ssid:"",f(),(u!==o||g!==i)&&k(),t.onConnectionStateChange?.({wasConnected:u,previousNetwork:g,isCurrentlyConnected:o,connectedNetwork:i})}async function s(){if(!a){a=!0,t.notify("Scanning for networks...","info"),t.onStateChange();try{let r="Scanning for networks...";for(let u=0;u<t.scanPollAttempts;u++){const g=await t.fetchPortalJson("/api/scan");if(r=g.message||r,g.scan_in_progress===!0){if(t.notify(r,"info"),u<t.scanPollAttempts-1){await t.delayMs(t.scanPollIntervalMs);continue}}else{e=Array.isArray(g.networks)?g.networks:[],t.notify(r||"Scan complete.","success"),k();return}}throw new Error("Network scan timed out. Please try again.")}catch(r){console.error("Scan failed:",r),t.notify(r instanceof Error?r.message:"Scan failed. Please try again.","error"),e=[],k()}finally{a=!1,t.onStateChange()}}}async function h(){if(!l){l=!0,t.onStateChange();try{const r=await t.fetchPortalJson("/api/status");E(r),a||t.notify(r.message||"Status updated.",r.connected?"success":"info")}catch(r){console.error("Status check failed:",r),t.notify(r instanceof Error?r.message:"Status check failed.","error")}finally{l=!1,t.onStateChange()}}}async function m(){if(!(c||!n)){if(b()&&t.passwordInput.value.trim().length===0){t.setFieldError(t.passwordInput,"Please enter a WiFi password."),t.passwordInput.focus({preventScroll:!0});return}if(t.passwordInput.value.length>ct){t.setFieldError(t.passwordInput,`WiFi password must be ${ct} characters or fewer.`),t.passwordInput.focus({preventScroll:!0});return}t.clearFieldError(t.passwordInput),c=!0,t.notify(`Connecting to ${n}...`,"info"),t.onStateChange();try{const r=await t.fetchPortalJson("/api/configure",{method:"POST",body:JSON.stringify({ssid:n,password:t.passwordInput.value})});t.notify(r.message||"Connection request sent.","info");for(let u=0;u<t.statusPollAttempts;u++){await t.delayMs(t.statusPollIntervalMs);const g=await t.fetchPortalJson("/api/status");if(E(g),g.connected){t.notify(g.message||"Connected.","success");break}}o||t.notify("Connection in progress...","info")}catch(r){console.error("Connection failed:",r),t.notify(r instanceof Error?r.message:"Connection failed.","error")}finally{c=!1,t.onStateChange()}}}async function S(){if(!(c||l||!o)){l=!0,t.notify("Disconnecting...","info"),t.onStateChange();try{const r=await t.fetchPortalJson("/api/disconnect",{method:"POST"}),u=o,g=i;o=!1,i="",f(),k(),t.notify(r.message||"Disconnected.","success"),t.onConnectionStateChange?.({wasConnected:u,previousNetwork:g,isCurrentlyConnected:o,connectedNetwork:i})}catch(r){console.error("Disconnect failed:",r),t.notify(r instanceof Error?r.message:"Disconnect failed.","error")}finally{l=!1,t.onStateChange()}}}function w(){if(it()){S();return}if(c||l){t.notify("WiFi status is busy. Please wait.","warning");return}if(!n){t.notify("Select a WiFi network first.","error"),t.networkList.focus({preventScroll:!0});return}if(b()&&t.passwordInput.value.trim().length===0){t.setFieldError(t.passwordInput,"Please enter a WiFi password."),t.notify("Please check if your password is correct.","error"),t.passwordInput.focus({preventScroll:!0});return}t.clearFieldError(t.passwordInput),m()}function C(){t.passwordInput.value?.trim().length&&t.clearFieldError(t.passwordInput),t.onStateChange()}function Pt(r){if(e.length!==0)switch(A(),r.key){case"Tab":break;case"ArrowDown":{r.preventDefault();const u=d<e.length-1?d+1:0;d=u,y(e[u].ssid),t.networkList.scrollOptionIntoView(u);break}case"ArrowUp":{r.preventDefault();const u=d>0?d-1:e.length-1;d=u,y(e[u].ssid),t.networkList.scrollOptionIntoView(u);break}case"Home":{r.preventDefault(),d=0,y(e[0].ssid),t.networkList.scrollOptionIntoView(0);break}case"End":{r.preventDefault();const u=e.length-1;d=u,y(e[u].ssid),t.networkList.scrollOptionIntoView(u);break}case"Enter":case" ":{r.preventDefault(),d>=0&&d<e.length&&y(e[d].ssid);break}}}function it(){return o&&i.length>0&&n===i}return{applyPortalStatus:E,checkStatus:h,connect:m,disconnect:S,getConnectedNetwork:()=>i,getSelectedNetwork:()=>n,handleConnectAction:w,handleListboxKeyDown:Pt,handlePasswordInput:C,isCheckingStatus:()=>l,isConnecting:()=>c,isCurrentlyConnected:()=>o,isScanning:()=>a,isSelectedConnected:it,renderNetworkList:k,requiresPassword:b,scanNetworks:s,updateWifiStatusCard:f}}function M(t,e){e().finally(()=>{!t.disabled&&t.offsetParent!==null&&setTimeout(()=>{!t.disabled&&t.offsetParent!==null&&t.focus()},0)})}function Tn(t){const{controllers:e,dom:n,helpers:o}=t;function i(){n.wifiSettingsSheet.openBottomSheet(),e.wifiController.scanNetworks()}n.scanBtn.addEventListener("click",()=>{e.wifiController.scanNetworks()}),n.connectBtn.addEventListener("click",()=>{e.wifiController.handleConnectAction()}),n.wifiStatusCard.addEventListener("action",()=>{if(e.wifiController.isCurrentlyConnected()){e.wifiController.disconnect();return}i()}),n.wifiStatusCard.addEventListener("settings",()=>{i()}),n.wifiSettingsCloseBtn.addEventListener("click",()=>{n.wifiSettingsSheet.closeBottomSheet()}),n.passwordInput.addEventListener("input",()=>{e.wifiController.handlePasswordInput()}),n.networkList.addEventListener("keydown",a=>{e.wifiController.handleListboxKeyDown(a)}),n.geminiSaveBtn.addEventListener("click",()=>{M(n.geminiSaveBtn,()=>e.geminiController.saveGeminiKey())}),n.geminiClearBtn.addEventListener("click",()=>{M(n.geminiClearBtn,()=>e.geminiController.clearGeminiKey())}),n.geminiApiKeyInput.addEventListener("input",o.updateUi),n.timezoneLocationSaveBtn.addEventListener("click",()=>{if(!n.timezoneSelect.value.trim()){o.setFieldError(n.timezoneSelect,"Select a timezone."),o.setTimezoneLocationNotification("Select a timezone.","error"),n.timezoneSelect.focus({preventScroll:!0});return}o.clearFieldError(n.timezoneSelect),M(n.timezoneLocationSaveBtn,()=>e.timeController.saveTimezoneLocation())}),n.timezoneLocationClearBtn.addEventListener("click",()=>{M(n.timezoneLocationClearBtn,()=>e.timeController.clearTimezoneLocation())}),n.timezoneSelect.addEventListener("change",()=>{n.timezoneSelect.value?.trim().length&&o.clearFieldError(n.timezoneSelect),o.updateUi()}),n.manualDateInput.addEventListener("input",o.updateUi),n.manualTimeInput.addEventListener("input",o.updateUi)}function kn(t){const{controllers:e,dom:n}=t,o=e.wifiController.isScanning()||e.wifiController.isConnecting()||e.wifiController.isCheckingStatus(),i=e.wifiController.isSelectedConnected(),a=e.wifiController.getSelectedNetwork().trim(),l=a.length>0&&!i&&e.wifiController.requiresPassword(),c=i||a.length>0&&(!l||n.passwordInput.value.trim().length>0);n.scanBtn.disabled=o,n.connectBtn.disabled=o||!c,n.wifiStatusCard.actionDisabled=o,n.passwordInput.disabled=e.wifiController.isConnecting(),e.wifiController.isConnecting()?(n.connectBtn.textContent="Connecting...",n.wifiStatusCard.actionLabel="Connecting..."):i?(n.connectBtn.textContent="Disconnect",n.wifiStatusCard.actionLabel="Disconnect"):(n.connectBtn.textContent="Connect",n.wifiStatusCard.actionLabel=e.wifiController.isCurrentlyConnected()?"Disconnect":"Connect");const d=e.timeController.isTimezoneBusy()||e.timeController.isLocationBusy()||e.timeController.isClockBusy();n.timezoneSelect.disabled=d,n.manualDateInput.disabled=d,n.manualTimeInput.disabled=d,n.timezoneLocationSaveBtn.disabled=d||n.timezoneSelect.value.trim().length===0,n.timezoneLocationClearBtn.disabled=d||n.timezoneSelect.value.trim().length===0;const f=e.geminiController.isGeminiBusy(),p=e.geminiController.getGeminiHasKey();n.geminiApiKeyInput.readOnly=p||f,n.geminiApiKeyInput.disabled=f,n.geminiSaveBtn.disabled=f||p||n.geminiApiKeyInput.value.trim().length===0,n.geminiSaveBtn.hidden=p,n.geminiClearBtn.disabled=f||!p,n.geminiClearBtn.hidden=!p}Jt();Rt();Qt();se();fe();be();xe();Ee();Me();let Q=null;const x=an(),Bt=ln(x.wifiSettingsNotification),An=It(x.geminiCard),Mt=It(x.timezoneLocationCard),qt=()=>document.createElement("input"),Cn=document.createElement("button"),En=qt(),_n=qt(),Ln=document.createElement("input");function _(){kn({controllers:{geminiController:nt,timeController:L,wifiController:z},dom:x})}const nt=yn({fetchGeminiModuleJson:Lt,fetchOpenAiModuleJson:()=>Promise.resolve({}),geminiApiKeyInput:x.geminiApiKeyInput,isGeminiModuleActive:()=>!0,isOpenAiModuleActive:()=>!1,notifyGemini:An,notifyOpenAi:()=>{},openAiApiKeyInput:Ln,updateButtons:_}),L=wn({applyTalkingClockModuleSettings:()=>{},bedtimeTimeInput:_n,clearFieldError:tt,clockModeToggle:Cn,clockSyncPollAttempts:We,clockSyncPollIntervalMs:Ue,fetchTimeRuntimeJson:rn,fetchTimeSettingsJson:on,fetchTimezoneListJson:sn,focusTalkingClockTimeInput:()=>{},buildTimezoneLabelMap:pn,formatTimezoneLabel:bn,isSwitchChecked:dn,isTalkingClockModuleActive:()=>!1,isTalkingClockModuleBusy:()=>!1,manualDateInput:x.manualDateInput,manualTimeInput:x.manualTimeInput,notifyClockMode:()=>{},notify:Mt,onStateChange:_,onTalkingClockBusyChange:()=>{},parseClockTimeInputValue:vn,patchTalkingClockSettings:()=>Promise.resolve({success:!0}),setFieldError:et,setSwitchChecked:cn,timeRuntimeApi:tn,timeSettingsApi:Qe,timezoneSelect:x.timezoneSelect,wakeupTimeInput:En}),z=Sn({checkIcon:Ke,clearFieldError:tt,delayMs:hn,fetchPortalJson:nn,networkList:x.networkList,notify:Bt,onConnectionStateChange:({wasConnected:t,isCurrentlyConnected:e})=>{!t&&e&&L.refreshClockStatusAfterWifiConnect()},onStateChange:_,passwordInput:x.passwordInput,scanPollAttempts:Ye,scanPollIntervalMs:je,securityIcon:Pe,setFieldError:et,signalIcons:{oneBar:Oe,twoBar:Ne,threeBar:De,fourBar:$e},statusPollAttempts:Ze,statusPollIntervalMs:Ge,svgWithClass:un,wifiFindIcon:Ve,wifiStatusCard:x.wifiStatusCard});function q(){if(!Q)return;const t=document.documentElement,e=t.scrollHeight>window.innerHeight+1,n=window.scrollY+window.innerHeight>=t.scrollHeight-1;Q.setVisible(e&&!n)}function In(){x.wifiStatusCard.iconSvg=qe,x.geminiCard.iconSvg=He,x.timezoneLocationCard.iconSvg=Fe,z.renderNetworkList(),document.body&&(Q=$t({mount:document.body,mode:"fixed",position:"bottom",height:"6rem",width:"100vw",strength:1.8,divCount:5,curve:"bezier",exponential:!0,opacity:1,zIndex:20,className:"page-gradual-blur",fallbackColor:"var(--color-bg-selected)"}),q(),window.addEventListener("scroll",q,{passive:!0}),window.addEventListener("resize",q),typeof ResizeObserver<"u"&&new ResizeObserver(()=>{q()}).observe(document.body)),_(),z.updateWifiStatusCard(),Bt(""),Tn({controllers:{geminiController:nt,timeController:L,wifiController:z},dom:x,helpers:{clearFieldError:tt,setFieldError:et,setTimezoneLocationNotification:Mt,updateUi:_}}),zn(),window.setInterval(()=>{L.fetchTimeRuntimeStatus()},Je)}async function zn(){await Promise.allSettled([L.populateTimezoneOptions(),L.fetchTimeSettingsStatus(),z.checkStatus(),Bn()])}async function Bn(){try{const t=await Lt("/api/settings/gemini");nt.applyGeminiSettings(t.settings)}catch(t){console.error("Gemini settings status failed:",t)}finally{_()}}In();

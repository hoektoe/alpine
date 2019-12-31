function e(){return navigator.userAgent.includes("Node.js")||navigator.userAgent.includes("jsdom")}function t(e,n,r){if(void 0===r&&(r=!0),!e.hasAttribute("x-data")||r){n(e);for(var i=e.firstElementChild;i;)t(i,n,!1),i=i.nextElementSibling}}function n(e,t,n){return void 0===n&&(n={}),new Function(["$data"].concat(Object.keys(n)),"var result; with($data) { result = "+e+" }; return result").apply(void 0,[t].concat(Object.values(n)))}function r(e){return/x-(on|bind|data|text|model|if|show|cloak|ref)/.test(e.name)}function i(e,t){return Array.from(e.attributes).filter(r).map(function(e){var t=e.name.match(/x-(on|bind|data|text|model|if|show|cloak|ref)/),n=e.name.match(/:([a-zA-Z\-]+)/),r=e.name.match(/\.[^.\]]+(?=[^\]]*$)/g)||[];return{type:t?t[1]:null,value:n?n[1]:null,modifiers:r.map(function(e){return e.replace(".","")}),expression:e.value}}).filter(function(e){return!t||e.type===name})}var o=function(e){this.el=e;var t=n(this.el.getAttribute("x-data"),{});this.data=this.wrapDataInObservable(t),this.initialize(),this.listenForNewElementsToInitialize()};o.prototype.wrapDataInObservable=function(e){this.concernedData=[];var t=this,n=function(e){return{set:function(n,r,i){var o=e?e+"."+r:r,a=Reflect.set(n,r,i);return-1===t.concernedData.indexOf(o)&&t.concernedData.push(o),t.refresh(),a},get:function(t,r){return"object"==typeof t[r]&&null!==t[r]?new Proxy(t[r],n(e?e+"."+r:r)):t[r]}}};return new Proxy(e,n())},o.prototype.initialize=function(){var e=this;t(this.el,function(t){e.initializeElement(t)})},o.prototype.initializeElement=function(e){var t=this;i(e).forEach(function(n){var r=n.value,i=n.modifiers,o=n.expression;switch(n.type){case"on":t.registerListener(e,a=r,i,o);break;case"model":var a="select"===e.tagName.toLowerCase()||["checkbox","radio"].includes(e.type)||i.includes("lazy")?"change":"input",u=t.generateExpressionForXModelListener(e,i,o);t.registerListener(e,a,i,u);var s="value",c=t.evaluateReturnExpression(o);t.updateAttributeValue(e,s,c.output);break;case"bind":s=r;var l=t.evaluateReturnExpression(o);t.updateAttributeValue(e,s,l.output);break;case"text":var d=t.evaluateReturnExpression(o);t.updateTextValue(e,d.output);break;case"show":var p=t.evaluateReturnExpression(o);t.updateVisibility(e,p.output);break;case"if":var f=t.evaluateReturnExpression(o);t.updatePresence(e,f.output);break;case"cloak":e.removeAttribute("x-cloak")}})},o.prototype.listenForNewElementsToInitialize=function(){var e=this,t=this.el;new MutationObserver(function(t){for(var r=0;r<t.length;r++){if(!t[r].target.closest("[x-data]").isSameNode(e.el))return;if("attributes"===t[r].type&&"x-data"===t[r].attributeName){var o=n(t[r].target.getAttribute("x-data"),{});Object.keys(o).forEach(function(t){e.data[t]!==o[t]&&(e.data[t]=o[t])})}t[r].addedNodes.length>0&&t[r].addedNodes.forEach(function(t){1===t.nodeType&&(t.matches("[x-data]")||i(t).length>0&&e.initializeElement(t))})}}).observe(t,{childList:!0,attributes:!0,subtree:!0})},o.prototype.refresh=function(){var e,n,r=this,o={model:function(e){r.updateAttributeValue(e.el,"value",e.output)},bind:function(e){r.updateAttributeValue(e.el,e.attrName,e.output)},text:function(e){r.updateTextValue(e.el,e.output)},show:function(e){r.updateVisibility(e.el,e.output)},if:function(e){r.updatePresence(e.el,e.output)}};(e=function(e,n){t(e,n),r.concernedData=[]},function(){var t=this,r=arguments;clearTimeout(n),n=setTimeout(function(){n=null,e.apply(t,r)},5)})(this.el,function(e){i(e).forEach(function(t){var n=t.type,i=t.value;if(o[n]){var a=r.evaluateReturnExpression(t.expression),u=a.output,s=a.deps;r.concernedData.filter(function(e){return s.includes(e)}).length>0&&o[n]({el:e,attrName:i,output:u})}})})},o.prototype.generateExpressionForXModelListener=function(e,t,n){var r;return r="checkbox"===e.type?Array.isArray(this.data[n])?"$event.target.checked ? "+n+".concat([$event.target.value]) : "+n+".filter(i => i !== $event.target.value)":"$event.target.checked":"select"===e.tagName.toLowerCase()&&e.multiple?t.includes("number")?"Array.from($event.target.selectedOptions).map(option => { return parseFloat(option.value || option.text) })":"Array.from($event.target.selectedOptions).map(option => { return option.value || option.text })":t.includes("number")?"parseFloat($event.target.value)":t.includes("trim")?"$event.target.value.trim()":"$event.target.value","radio"===e.type&&(e.hasAttribute("name")||e.setAttribute("name",n)),n+" = "+r},o.prototype.registerListener=function(e,t,n,r){var i=this;if(n.includes("away")){var o=function(a){e.contains(a.target)||e.offsetWidth<1&&e.offsetHeight<1||(i.runListenerHandler(r,a),n.includes("once")&&document.removeEventListener(t,o))};document.addEventListener(t,o)}else{var a=n.includes("window")?window:e,u=function(e){var o=n.filter(function(e){return"window"!==e});"keydown"===t&&o.length>0&&!o.includes(e.key.replace(/([a-z])([A-Z])/g,"$1-$2").replace(/[_\s]/,"-").toLowerCase())||(n.includes("prevent")&&e.preventDefault(),n.includes("stop")&&e.stopPropagation(),i.runListenerHandler(r,e),n.includes("once")&&a.removeEventListener(t,u))};a.addEventListener(t,u)}},o.prototype.runListenerHandler=function(e,t){this.evaluateCommandExpression(e,{$event:t,$refs:this.getRefsProxy()})},o.prototype.evaluateReturnExpression=function(e){var t=[],r=function(e){return{get:function(n,i){if("symbol"!=typeof i){var o=e?e+"."+i:i;return"object"!=typeof n[i]||null===n[i]||Array.isArray(n[i])?(t.push(o),n[i]):new Proxy(n[i],r(o))}}}};return{output:n(e,new Proxy(this.data,r())),deps:t}},o.prototype.evaluateCommandExpression=function(e,t){!function(e,t,n){void 0===n&&(n={}),new Function(["$data"].concat(Object.keys(n)),"with($data) { "+e+" }").apply(void 0,[t].concat(Object.values(n)))}(e,this.data,t)},o.prototype.updateTextValue=function(e,t){e.innerText=t},o.prototype.updateVisibility=function(e,t){t?1===e.style.length&&""!==e.style.display?e.removeAttribute("style"):e.style.removeProperty("display"):e.style.display="none"},o.prototype.updatePresence=function(e,t){"template"!==e.nodeName.toLowerCase()&&console.warn("Alpine: [x-if] directive should only be added to <template> tags.");var n=e.nextElementSibling&&!0===e.nextElementSibling.__x_inserted_me;if(t&&!n){var r=document.importNode(e.content,!0);e.parentElement.insertBefore(r,e.nextElementSibling),e.nextElementSibling.__x_inserted_me=!0}else!t&&n&&e.nextElementSibling.remove()},o.prototype.updateAttributeValue=function(e,t,n){if("value"===t)if("radio"===e.type)e.checked=e.value==n;else if("checkbox"===e.type)if(Array.isArray(n)){var r=!1;n.forEach(function(t){t==e.value&&(r=!0)}),e.checked=r}else e.checked=!!n;else"SELECT"===e.tagName?this.updateSelect(e,n):e.value=n;else"class"===t?Array.isArray(n)?e.setAttribute("class",n.join(" ")):Object.keys(n).forEach(function(t){n[t]?t.split(" ").forEach(function(t){return e.classList.add(t)}):t.split(" ").forEach(function(t){return e.classList.remove(t)})}):["disabled","readonly","required","checked","hidden"].includes(t)?n?e.setAttribute(t,""):e.removeAttribute(t):e.setAttribute(t,n)},o.prototype.updateSelect=function(e,t){var n=[].concat(t).map(function(e){return e+""});Array.from(e.options).forEach(function(e){e.selected=n.includes(e.value||e.text)})},o.prototype.getRefsProxy=function(){var e=this;return new Proxy({},{get:function(n,r){var i;return t(e.el,function(e){e.hasAttribute("x-ref")&&e.getAttribute("x-ref")===r&&(i=e)}),i}})};var a={start:function(){try{var t=this;function n(){t.discoverComponents(function(e){t.initializeComponent(e)}),document.addEventListener("turbolinks:load",function(){t.discoverUninitializedComponents(function(e){t.initializeComponent(e)})}),t.listenForNewUninitializedComponentsAtRunTime(function(e){t.initializeComponent(e)})}var r=function(){if(!e())return Promise.resolve(new Promise(function(e){"loading"==document.readyState?document.addEventListener("DOMContentLoaded",e):e()})).then(function(){})}();return Promise.resolve(r&&r.then?r.then(n):n())}catch(e){return Promise.reject(e)}},discoverComponents:function(e){document.querySelectorAll("[x-data]").forEach(function(t){e(t)})},discoverUninitializedComponents:function(e){var t=document.querySelectorAll("[x-data]");Array.from(t).filter(function(e){return void 0===e.__x}).forEach(function(t){e(t)})},listenForNewUninitializedComponentsAtRunTime:function(e){var t=document.querySelector("body");new MutationObserver(function(t){for(var n=0;n<t.length;n++)t[n].addedNodes.length>0&&t[n].addedNodes.forEach(function(t){1===t.nodeType&&t.matches("[x-data]")&&e(t)})}).observe(t,{childList:!0,attributes:!0,subtree:!0})},initializeComponent:function(e){e.__x=new o(e)}};e()||(window.Alpine=a,window.Alpine.start()),module.exports=a;
//# sourceMappingURL=alpine.js.map
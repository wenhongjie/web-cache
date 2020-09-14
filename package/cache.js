!function(t,e){"object"==typeof exports&&"object"==typeof module?module.exports=e():"function"==typeof define&&define.amd?define([],e):"object"==typeof exports?exports.WebCache=e():t.WebCache=e()}(window,(function(){return function(t){var e={};function r(n){if(e[n])return e[n].exports;var o=e[n]={i:n,l:!1,exports:{}};return t[n].call(o.exports,o,o.exports,r),o.l=!0,o.exports}return r.m=t,r.c=e,r.d=function(t,e,n){r.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:n})},r.r=function(t){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},r.t=function(t,e){if(1&e&&(t=r(t)),8&e)return t;if(4&e&&"object"==typeof t&&t&&t.__esModule)return t;var n=Object.create(null);if(r.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var o in t)r.d(n,o,function(e){return t[e]}.bind(null,o));return n},r.n=function(t){var e=t&&t.__esModule?function(){return t.default}:function(){return t};return r.d(e,"a",e),e},r.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},r.p="",r(r.s=0)}([function(t,e,r){"use strict";r.r(e),r.d(e,"WebStorage",(function(){return n}));var n=function(){function t(t){this.callbacks={},"local"!==t?"session"!==t||(this.store=sessionStorage):this.store=localStorage}return t.prototype.set=function(e,r,n){if(void 0===n&&(n=0),null===r)return this;var o=typeof r;if(!t.enabledType.has(o))return this;var i={value:null,exp:0};return i.value=r,i.exp=n?Date.now()+1e3*n:0,this.callbacks[e]&&this.callbacks[e].forEach((function(t){return t(e,r,i)})),this.store.setItem(e,JSON.stringify(i)),this},t.prototype.get=function(t,e){var r=this;void 0===e&&(e=null);var n,o=(n=t,Object.prototype.toString.call(n).slice(8,-1).toLowerCase());if("string"===o){var i=this.store.getItem(t);if(null===i)return e;var a=JSON.parse(i);return a.exp>Date.now()||0===a.exp?a.value:(this.remove(t),e)}if("array"===o)return t.map((function(t){return r.get(t)}));throw Error("get第一个参数的类型应该是string或者array, 但传入的值是"+o+"类型")},t.prototype.remove=function(t){var e=this;return void 0===t?this.store.clear():"string"==typeof t?this.store.removeItem(t):Array.isArray(t)&&t.forEach((function(t){return e.remove(t)})),this},t.prototype.on=function(t,e){this.callbacks[t]?this.callbacks[t].push(e):this.callbacks[t]=[e]},t.prototype.off=function(t){var e=this;"string"==typeof t?delete this.callbacks[t]:void 0===t?this.callbacks={}:Array.isArray(t)&&t.forEach((function(t){return e.off(t)}))},t.enabledType=new Set(["string","number","object","boolean","bigint"]),t}(),o={create:function(t){var e=this[t];return void 0!==e?e:(this[t]=new n(t),this[t])}};e.default=o}]).default}));
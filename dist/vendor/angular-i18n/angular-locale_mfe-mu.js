"use strict";angular.module("ngLocale",[],["$provide",function(e){function m(e){e+="";var m=e.indexOf(".");return-1==m?0:e.length-m-1}function a(e,a){var i=a;void 0===i&&(i=Math.min(m(e),3));var n=Math.pow(10,i),r=(e*n|0)%n;return{v:i,f:r}}var i={ZERO:"zero",ONE:"one",TWO:"two",FEW:"few",MANY:"many",OTHER:"other"};e.value("$locale",{DATETIME_FORMATS:{AMPMS:["AM","PM"],DAY:["dimans","lindi","mardi","merkredi","zedi","vandredi","samdi"],MONTH:["zanvie","fevriye","mars","avril","me","zin","zilye","out","septam","oktob","novam","desam"],SHORTDAY:["dim","lin","mar","mer","ze","van","sam"],SHORTMONTH:["zan","fev","mar","avr","me","zin","zil","out","sep","okt","nov","des"],fullDate:"EEEE d MMMM y",longDate:"d MMMM y",medium:"d MMM, y HH:mm:ss",mediumDate:"d MMM, y",mediumTime:"HH:mm:ss","short":"d/M/y HH:mm",shortDate:"d/M/y",shortTime:"HH:mm"},NUMBER_FORMATS:{CURRENCY_SYM:"MURs",DECIMAL_SEP:".",GROUP_SEP:" ",PATTERNS:[{gSize:3,lgSize:3,maxFrac:3,minFrac:0,minInt:1,negPre:"-",negSuf:"",posPre:"",posSuf:""},{gSize:3,lgSize:3,maxFrac:2,minFrac:2,minInt:1,negPre:"¤ -",negSuf:"",posPre:"¤ ",posSuf:""}]},id:"mfe-mu",pluralCat:function(e,m){var n=0|e,r=a(e,m);return 1==n&&0==r.v?i.ONE:i.OTHER}})}]);
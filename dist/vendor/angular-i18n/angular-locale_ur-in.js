"use strict";angular.module("ngLocale",[],["$provide",function(e){function n(e){e+="";var n=e.indexOf(".");return-1==n?0:e.length-n-1}function a(e,a){var r=a;void 0===r&&(r=Math.min(n(e),3));var M=Math.pow(10,r),m=(e*M|0)%M;return{v:r,f:m}}var r={ZERO:"zero",ONE:"one",TWO:"two",FEW:"few",MANY:"many",OTHER:"other"};e.value("$locale",{DATETIME_FORMATS:{AMPMS:["قبل دوپہر","بعد دوپہر"],DAY:["اتوار","پیر","منگل","بدھ","جمعرات","جمعہ","ہفتہ"],MONTH:["جنوری","فروری","مارچ","اپریل","مئی","جون","جولائی","اگست","ستمبر","اکتوبر","نومبر","دسمبر"],SHORTDAY:["اتوار","پیر","منگل","بدھ","جمعرات","جمعہ","ہفتہ"],SHORTMONTH:["جنوری","فروری","مارچ","اپریل","مئی","جون","جولائی","اگست","ستمبر","اکتوبر","نومبر","دسمبر"],fullDate:"EEEE، d MMMM، y",longDate:"d MMMM، y",medium:"d MMM، y h:mm:ss a",mediumDate:"d MMM، y",mediumTime:"h:mm:ss a","short":"d/M/yy h:mm a",shortDate:"d/M/yy",shortTime:"h:mm a"},NUMBER_FORMATS:{CURRENCY_SYM:"₹",DECIMAL_SEP:".",GROUP_SEP:",",PATTERNS:[{gSize:2,lgSize:3,maxFrac:3,minFrac:0,minInt:1,negPre:"-",negSuf:"",posPre:"",posSuf:""},{gSize:2,lgSize:3,maxFrac:2,minFrac:2,minInt:1,negPre:"¤ -",negSuf:"",posPre:"¤ ",posSuf:""}]},id:"ur-in",pluralCat:function(e,n){var M=0|e,m=a(e,n);return 1==M&&0==m.v?r.ONE:r.OTHER}})}]);
"use strict";angular.module("ngLocale",[],["$provide",function(e){function o(e){e+="";var o=e.indexOf(".");return-1==o?0:e.length-o-1}function a(e,a){var M=a;void 0===M&&(M=Math.min(o(e),3));var r=Math.pow(10,M),n=(e*r|0)%r;return{v:M,f:n}}var M={ZERO:"zero",ONE:"one",TWO:"two",FEW:"few",MANY:"many",OTHER:"other"};e.value("$locale",{DATETIME_FORMATS:{AMPMS:["AM","PM"],DAY:["Sontaga","Mosupalogo","Labobedi","Laboraro","Labone","Labohlano","Mokibelo"],MONTH:["Janaware","Feberware","Matšhe","Aporele","Mei","June","Julae","Agostose","Setemere","Oktobore","Nofemere","Disemere"],SHORTDAY:["Son","Mos","Bed","Rar","Ne","Hla","Mok"],SHORTMONTH:["Jan","Feb","Mat","Apo","Mei","Jun","Jul","Ago","Set","Okt","Nof","Dis"],fullDate:"y MMMM d, EEEE",longDate:"y MMMM d",medium:"y MMM d HH:mm:ss",mediumDate:"y MMM d",mediumTime:"HH:mm:ss","short":"y-MM-dd HH:mm",shortDate:"y-MM-dd",shortTime:"HH:mm"},NUMBER_FORMATS:{CURRENCY_SYM:"R",DECIMAL_SEP:".",GROUP_SEP:" ",PATTERNS:[{gSize:3,lgSize:3,maxFrac:3,minFrac:0,minInt:1,negPre:"-",negSuf:"",posPre:"",posSuf:""},{gSize:3,lgSize:3,maxFrac:2,minFrac:2,minInt:1,negPre:"¤-",negSuf:"",posPre:"¤",posSuf:""}]},id:"nso",pluralCat:function(e,o){var r=0|e,n=a(e,o);return 1==r&&0==n.v?M.ONE:M.OTHER}})}]);
"use strict";angular.module("ngLocale",[],["$provide",function(e){function M(e){e+="";var M=e.indexOf(".");return-1==M?0:e.length-M-1}function n(e,n){var r=n;void 0===r&&(r=Math.min(M(e),3));var a=Math.pow(10,r),m=(e*a|0)%a;return{v:r,f:m}}var r={ZERO:"zero",ONE:"one",TWO:"two",FEW:"few",MANY:"many",OTHER:"other"};e.value("$locale",{DATETIME_FORMATS:{AMPMS:["לפנה״צ","אחה״צ"],DAY:["יום ראשון","יום שני","יום שלישי","יום רביעי","יום חמישי","יום שישי","יום שבת"],MONTH:["ינואר","פברואר","מרץ","אפריל","מאי","יוני","יולי","אוגוסט","ספטמבר","אוקטובר","נובמבר","דצמבר"],SHORTDAY:["יום א׳","יום ב׳","יום ג׳","יום ד׳","יום ה׳","יום ו׳","שבת"],SHORTMONTH:["ינו׳","פבר׳","מרץ","אפר׳","מאי","יוני","יולי","אוג׳","ספט׳","אוק׳","נוב׳","דצמ׳"],fullDate:"EEEE, d בMMMM y",longDate:"d בMMMM y",medium:"d בMMM y HH:mm:ss",mediumDate:"d בMMM y",mediumTime:"HH:mm:ss","short":"d.M.y HH:mm",shortDate:"d.M.y",shortTime:"HH:mm"},NUMBER_FORMATS:{CURRENCY_SYM:"₪",DECIMAL_SEP:".",GROUP_SEP:",",PATTERNS:[{gSize:3,lgSize:3,maxFrac:3,minFrac:0,minInt:1,negPre:"-",negSuf:"",posPre:"",posSuf:""},{gSize:3,lgSize:3,maxFrac:2,minFrac:2,minInt:1,negPre:"-",negSuf:" ¤",posPre:"",posSuf:" ¤"}]},id:"he-il",pluralCat:function(e,M){var a=0|e,m=n(e,M);return 1==a&&0==m.v?r.ONE:2==a&&0==m.v?r.TWO:0==m.v&&(0>e||e>10)&&e%10==0?r.MANY:r.OTHER}})}]);
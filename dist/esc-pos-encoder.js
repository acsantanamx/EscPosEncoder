!function(e){if("object"==typeof exports&&"undefined"!=typeof module)module.exports=e();else if("function"==typeof define&&define.amd)define([],e);else{("undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self?self:this).EscPosEncoder=e()}}(function(){return function(){return function e(t,n,i){function s(r,o){if(!n[r]){if(!t[r]){var h="function"==typeof require&&require;if(!o&&h)return h(r,!0);if(a)return a(r,!0);var c=new Error("Cannot find module '"+r+"'");throw c.code="MODULE_NOT_FOUND",c}var l=n[r]={exports:{}};t[r][0].call(l.exports,function(e){return s(t[r][1][e]||e)},l,l.exports,e,t,n,i)}return n[r].exports}for(var a="function"==typeof require&&require,r=0;r<i.length;r++)s(i[r]);return s}}()({1:[function(e,t,n){t.exports=new class{grayscale(e){for(let t=0;t<e.data.length;t+=4){const n=.299*e.data[t]+.587*e.data[t+1]+.114*e.data[t+2];e.data.fill(n,t,t+3)}return e}threshold(e,t){for(let n=0;n<e.data.length;n+=4){const i=.299*e.data[n]+.587*e.data[n+1]+.114*e.data[n+2]<t?0:255;e.data.fill(i,n,n+3)}return e}bayer(e,t){const n=[[15,135,45,165],[195,75,225,105],[60,180,30,150],[240,120,210,90]];for(let i=0;i<e.data.length;i+=4){const s=.299*e.data[i]+.587*e.data[i+1]+.114*e.data[i+2],a=i/4%e.width,r=Math.floor(i/4/e.width),o=Math.floor((s+n[a%4][r%4])/2)<t?0:255;e.data.fill(o,i,i+3)}return e}floydsteinberg(e){const t=e.width,n=new Uint8ClampedArray(e.width*e.height);for(let t=0,i=0;i<e.data.length;t++,i+=4)n[t]=.299*e.data[i]+.587*e.data[i+1]+.114*e.data[i+2];for(let i=0,s=0;s<e.data.length;i++,s+=4){const a=n[i]<129?0:255,r=Math.floor((n[i]-a)/16);e.data.fill(a,s,s+3),n[i+1]+=7*r,n[i+t-1]+=3*r,n[i+t]+=5*r,n[i+t+1]+=1*r}return e}atkinson(e){const t=e.width,n=new Uint8ClampedArray(e.width*e.height);for(let t=0,i=0;i<e.data.length;t++,i+=4)n[t]=.299*e.data[i]+.587*e.data[i+1]+.114*e.data[i+2];for(let i=0,s=0;s<e.data.length;i++,s+=4){const a=n[i]<129?0:255,r=Math.floor((n[i]-a)/8);e.data.fill(a,s,s+3),n[i+1]+=r,n[i+2]+=r,n[i+t-1]+=r,n[i+t]+=r,n[i+t+1]+=r,n[i+2*t]+=r}return e}}},{}],2:[function(e,t,n){t.exports=new class{flatten(e,t){for(let n=0;n<e.data.length;n+=4){const i=e.data[n+3],s=255-i;e.data[n]=(i*e.data[n]+s*t[0])/255,e.data[n+1]=(i*e.data[n+1]+s*t[1])/255,e.data[n+2]=(i*e.data[n+2]+s*t[2])/255,e.data[n+3]=255}return e}}},{}],3:[function(e,t,n){const i=e("./lib/parse-font");n.parseFont=i,n.createCanvas=function(e,t){return Object.assign(document.createElement("canvas"),{width:e,height:t})},n.createImageData=function(e,t,n){switch(arguments.length){case 0:return new ImageData;case 1:return new ImageData(e);case 2:return new ImageData(e,t);default:return new ImageData(e,t,n)}},n.loadImage=function(e,t){return new Promise(function(n,i){const s=Object.assign(document.createElement("img"),t);function a(){s.onload=null,s.onerror=null}s.onload=function(){a(),n(s)},s.onerror=function(){a(),i(new Error('Failed to load the image "'+e+'"'))},s.src=e})}},{"./lib/parse-font":4}],4:[function(e,t,n){"use strict";const i="'([^']+)'|\"([^\"]+)\"|[\\w\\s-]+",s=new RegExp("(bold|bolder|lighter|[1-9]00) +","i"),a=new RegExp("(italic|oblique) +","i"),r=new RegExp("(small-caps) +","i"),o=new RegExp("(ultra-condensed|extra-condensed|condensed|semi-condensed|semi-expanded|expanded|extra-expanded|ultra-expanded) +","i"),h=new RegExp("([\\d\\.]+)(px|pt|pc|in|cm|mm|%|em|ex|ch|rem|q) *((?:"+i+")( *, *(?:"+i+"))*)"),c={};t.exports=function(e){if(c[e])return c[e];const t=h.exec(e);if(!t)return;const n={weight:"normal",style:"normal",stretch:"normal",variant:"normal",size:parseFloat(t[1]),unit:t[2],family:t[3].replace(/["']/g,"").replace(/ *, */g,",")};let i,l,p,d,u=e.substring(0,t.index);switch((i=s.exec(u))&&(n.weight=i[1]),(l=a.exec(u))&&(n.style=l[1]),(p=r.exec(u))&&(n.variant=p[1]),(d=o.exec(u))&&(n.stretch=d[1]),n.unit){case"pt":n.size/=.75;break;case"pc":n.size*=16;break;case"in":n.size*=96;break;case"cm":n.size*=96/2.54;break;case"mm":n.size*=96/25.4;break;case"%":break;case"em":case"rem":n.size*=16/.75;break;case"q":n.size*=96/25.4/4}return c[e]=n}},{}],5:[function(e,t,n){const i={cp437:{name:"USA, Standard Europe",languages:["en"],offset:128,chars:"ÇüéâäàåçêëèïîìÄÅÉæÆôöòûùÿÖÜ¢£¥₧ƒáíóúñÑªº¿⌐¬½¼¡«»░▒▓│┤╡╢╖╕╣║╗╝╜╛┐└┴┬├─┼╞╟╚╔╩╦╠═╬╧╨╤╥╙╘╒╓╫╪┘┌█▄▌▐▀αßΓπΣσµτΦΘΩδ∞φε∩≡±≥≤⌠⌡÷≈°∙·√ⁿ²■ "},cp720:{name:"Arabic",languages:["ar"],offset:128,chars:"éâàçêëèïîّْô¤ـûùءآأؤ£إئابةتثجحخدذرزسشص«»░▒▓│┤╡╢╖╕╣║╗╝╜╛┐└┴┬├─┼╞╟╚╔╩╦╠═╬╧╨╤╥╙╘╒╓╫╪┘┌█▄▌▐▀ضطظعغفµقكلمنهوىي≡ًٌٍَُِ≈°∙·√ⁿ²■ "},cp737:{name:"Greek",languages:["el"],offset:128,chars:"ΑΒΓΔΕΖΗΘΙΚΛΜΝΞΟΠΡΣΤΥΦΧΨΩαβγδεζηθικλμνξοπρσςτυφχψ░▒▓│┤╡╢╖╕╣║╗╝╜╛┐└┴┬├─┼╞╟╚╔╩╦╠═╬╧╨╤╥╙╘╒╓╫╪┘┌█▄▌▐▀ωάέήϊίόύϋώΆΈΉΊΌΎΏ±≥≤ΪΫ÷≈°∙·√ⁿ²■ "},cp775:{name:"Baltic Rim",languages:["et","lt"],offset:128,chars:"ĆüéāäģåćłēŖŗīŹÄÅÉæÆōöĢ¢ŚśÖÜø£Ø×¤ĀĪóŻżź”¦©®¬½¼Ł«»░▒▓│┤ĄČĘĖ╣║╗╝ĮŠ┐└┴┬├─┼ŲŪ╚╔╩╦╠═╬Žąčęėįšųūž┘┌█▄▌▐▀ÓßŌŃõÕµńĶķĻļņĒŅ’­±“¾¶§÷„°∙·¹³²■ "},cp850:{name:"Multilingual",languages:["en"],offset:128,chars:"ÇüéâäůćçłëŐőîŹÄĆÉĹĺôöĽľŚśÖÜŤťŁ×čáíóúĄąŽžĘę¬źČş«»░▒▓│┤ÁÂĚŞ╣║╗╝Żż┐└┴┬├─┼Ăă╚╔╩╦╠═╬¤đĐĎËďŇÍÎě┘┌█▄ŢŮ▀ÓßÔŃńňŠšŔÚŕŰýÝţ´­˝˛ˇ˘§÷¸°¨˙űŘř■ "},cp851:{name:"Greek",languages:["el"],offset:128,chars:"ÇüéâäàΆçêëèïîΈÄΉΊ ΌôöΎûùΏÖÜά£έήίϊΐόύΑΒΓΔΕΖΗ½ΘΙ«»░▒▓│┤ΚΛΜΝ╣║╗╝ΞΟ┐└┴┬├─┼ΠΡ╚╔╩╦╠═╬ΣΤΥΦΧΨΩαβγ┘┌█▄δε▀ζηθικλμνξοπρσςτ´­±υφχ§ψ¸°¨ωϋΰώ■ "},cp852:{name:"Latin 2",languages:["hu","pl","cz"],offset:128,chars:"ÇüéâäůćçłëŐőîŹÄĆÉĹĺôöĽľŚśÖÜŤťŁ×čáíóúĄąŽžĘę¬źČş«»░▒▓│┤ÁÂĚŞ╣║╗╝Żż┐└┴┬├─┼Ăă╚╔╩╦╠═╬¤đĐĎËďŇÍÎě┘┌█▄ŢŮ▀ÓßÔŃńňŠšŔÚŕŰýÝţ´­˝˛ˇ˘§÷¸°¨˙űŘř■ "},cp853:{name:"Turkish",languages:["tr"],offset:128,chars:"ÇüéâäàĉçêëèïîìÄĈÉċĊôöòûùİÖÜĝ£Ĝ×ĵáíóúñÑĞğĤĥ�½Ĵş«»░▒▓│┤ÁÂÀŞ╣║╗╝Żż┐└┴┬├─┼Ŝŝ╚╔╩╦╠═╬¤��ÊËÈıÍÎÏ┘┌█▄�Ì▀ÓßÔÒĠġµĦħÚÛÙŬŭ�´­�ℓŉ˘§÷¸°¨˙�³²■ "},cp855:{name:"Cyrillic",languages:["bg"],offset:128,chars:"ђЂѓЃёЁєЄѕЅіІїЇјЈљЉњЊћЋќЌўЎџЏюЮъЪаАбБцЦдДеЕфФгГ«»░▒▓│┤хХиИ╣║╗╝йЙ┐└┴┬├─┼кК╚╔╩╦╠═╬¤лЛмМнНоОп┘┌█▄Пя▀ЯрРсСтТуУжЖвВьЬ№­ыЫзЗшШэЭщЩчЧ§■ "},cp857:{name:"Turkish",languages:["tr"],offset:128,chars:"ÇüéâäàåçêëèïîıÄÅÉæÆôöòûùİÖÜø£ØŞşáíóúñÑĞğ¿®¬½¼¡«»░▒▓│┤ÁÂÀ©╣║╗╝¢¥┐└┴┬├─┼ãÃ╚╔╩╦╠═╬¤ºªÊËÈ�ÍÎÏ┘┌█▄¦Ì▀ÓßÔÒõÕµ�×ÚÛÙìÿ¯´­±�¾¶§÷¸°¨·¹³²■ "},cp858:{name:"Euro",languages:["en"],offset:128,chars:"ÇüéâäàåçêëèïîìÄÅÉæÆôöòûùÿÖÜø£Ø×ƒáíóúñÑªº¿®¬½¼¡«»░▒▓│┤ÁÂÀ©╣║╗╝¢¥┐└┴┬├─┼ãÃ╚╔╩╦╠═╬¤ðÐÊËÈ€ÍÎÏ┘┌█▄¦Ì▀ÓßÔÒõÕµþÞÚÛÙýÝ¯´­±‗¾¶§÷¸°¨·¹³²■ "},cp860:{name:"Portuguese",languages:["pt"],offset:128,chars:"ÇüéâãàÁçêÊèÍÔìÃÂÉÀÈôõòÚùÌÕÜ¢£Ù₧ÓáíóúñÑªº¿Ò¬½¼¡«»░▒▓│┤╡╢╖╕╣║╗╝╜╛┐└┴┬├─┼╞╟╚╔╩╦╠═╬╧╨╤╥╙╘╒╓╫╪┘┌█▄▌▐▀αßΓπΣσµτΦΘΩδ∞φε∩≡±≥≤⌠⌡÷≈°∙·√ⁿ²■ "},cp861:{name:"Icelandic",languages:["is"],offset:128,chars:"ÇüéâäàåçêëèÐðÞÄÅÉæÆôöþûÝýÖÜø£Ø₧ƒáíóúÁÍÓÚ¿⌐¬½¼¡«»░▒▓│┤╡╢╖╕╣║╗╝╜╛┐└┴┬├─┼╞╟╚╔╩╦╠═╬╧╨╤╥╙╘╒╓╫╪┘┌█▄▌▐▀αßΓπΣσµτΦΘΩδ∞φε∩≡±≥≤⌠⌡÷≈°∙·√ⁿ²■ "},cp862:{name:"Hebrew",languages:["he"],offset:128,chars:"אבגדהוזחטיךכלםמןנסעףפץצקרשת¢£¥₧ƒáíóúñÑªº¿⌐¬½¼¡«»░▒▓│┤╡╢╖╕╣║╗╝╜╛┐└┴┬├─┼╞╟╚╔╩╦╠═╬╧╨╤╥╙╘╒╓╫╪┘┌█▄▌▐▀αßΓπΣσµτΦΘΩδ∞φε∩≡±≥≤⌠⌡÷≈°∙·√ⁿ²■ "},cp863:{name:"Canadian French",languages:["fr"],offset:128,chars:"ÇüéâÂà¶çêëèïî‗À§ÉÈÊôËÏûù¤ÔÜ¢£ÙÛƒ¦´óú¨¸³¯Î⌐¬½¼¾«»░▒▓│┤╡╢╖╕╣║╗╝╜╛┐└┴┬├─┼╞╟╚╔╩╦╠═╬╧╨╤╥╙╘╒╓╫╪┘┌█▄▌▐▀αßΓπΣσµτΦΘΩδ∞φε∩≡±≥≤⌠⌡÷≈°∙·√ⁿ²■ "},cp864:{name:"Arabic",languages:["ar"],offset:0,chars:"\0\b\t\n\v\f\r !\"#$٪&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~°·∙√▒─│┼┤┬├┴┐┌└┘β∞φ±½¼≈«»ﻷﻸ��ﻻﻼ� ­ﺂ£¤ﺄ��ﺎﺏﺕﺙ،ﺝﺡﺥ٠١٢٣٤٥٦٧٨٩ﻑ؛ﺱﺵﺹ؟¢ﺀﺁﺃﺅﻊﺋﺍﺑﺓﺗﺛﺟﺣﺧﺩﺫﺭﺯﺳﺷﺻﺿﻁﻅﻋﻏ¦¬÷×ﻉـﻓﻗﻛﻟﻣﻧﻫﻭﻯﻳﺽﻌﻎﻍﻡﹽّﻥﻩﻬﻰﻲﻐﻕﻵﻶﻝﻙﻱ■�"},cp865:{name:"Nordic",languages:["sv","dk"],offset:128,chars:"ÇüéâäàåçêëèïîìÄÅÉæÆôöòûùÿÖÜø£Ø₧ƒáíóúñÑªº¿⌐¬½¼¡«¤░▒▓│┤╡╢╖╕╣║╗╝╜╛┐└┴┬├─┼╞╟╚╔╩╦╠═╬╧╨╤╥╙╘╒╓╫╪┘┌█▄▌▐▀αßΓπΣσµτΦΘΩδ∞φε∩≡±≥≤⌠⌡÷≈°∙·√ⁿ²■ "},cp866:{name:"Cyrillic 2",languages:["ru"],offset:128,chars:"АБВГДЕЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯабвгдежзийклмноп░▒▓│┤╡╢╖╕╣║╗╝╜╛┐└┴┬├─┼╞╟╚╔╩╦╠═╬╧╨╤╥╙╘╒╓╫╪┘┌█▄▌▐▀рстуфхцчшщъыьэюяЁёЄєЇїЎў°∙·√№¤■ "},cp869:{name:"Greek",languages:["el"],offset:128,chars:"������Ά�·¬¦‘’Έ―ΉΊΪΌ��ΎΫ©Ώ²³ά£έήίϊΐόύΑΒΓΔΕΖΗ½ΘΙ«»░▒▓│┤ΚΛΜΝ╣║╗╝ΞΟ┐└┴┬├─┼ΠΡ╚╔╩╦╠═╬ΣΤΥΦΧΨΩαβγ┘┌█▄δε▀ζηθικλμνξοπρσςτ΄­±υφχ§ψ΅°¨ωϋΰώ■ "},cp874:{name:"Thai",languages:["th"],offset:128,chars:"€����…�����������‘’“”•–—�������� กขฃคฅฆงจฉชซฌญฎฏฐฑฒณดตถทธนบปผฝพฟภมยรฤลฦวศษสหฬอฮฯะัาำิีึืฺุู����฿เแโใไๅๆ็่้๊๋์ํ๎๏๐๑๒๓๔๕๖๗๘๙๚๛����"},cp1098:{name:"Farsi",languages:["fa"],offset:128,chars:"  ،؛؟ًآﺂاﺎءأﺄؤﺋبﺑﭖﭘتﺗثﺛجﺟﭺﭼ×حﺣخﺧدذرزﮊسﺳشﺷصﺻ«»░▒▓│┤ضﺿﻁﻃ╣║╗╝¤ﻅ┐└┴┬├─┼ﻇع╚╔╩╦╠═╬ ﻊﻋﻌغﻎﻏﻐفﻓ┘┌█▄قﻗ▀ﮎﻛﮒﮔلﻟمﻣنﻧوهﻫﻬﮤﯼ­ﯽﯾـ٠١٢٣٤٥٦٧٨٩■ "},cp1118:{name:"Lithuanian",languages:["lt"],offset:128,chars:"ÇüéâäàåçêëèïîìÄÅÉæÆôöòûùÿÖÜ¢£¥₧ƒáíóúñÑªº¿⌐¬½¼¡«»░▒▓│┤ĄČĘĖ╣║╗╝ĮŠ┐└┴┬├─┼ŲŪ╚╔╩╦╠═╬Žąčęėįšųūž┘┌█▄▌▐▀αβΓπΣσµτΦΘΩδ∞φε⋂≡±≥≤„“÷≈°∙˙√ⁿ²■ "},cp1119:{name:"Lithuanian",languages:["lt"],offset:128,chars:"АБВГДЕЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯабвгдежзийклмноп░▒▓│┤ĄČĘĖ╣║╗╝ĮŠ┐└┴┬├─┼ŲŪ╚╔╩╦╠═╬Žąčęėįšųūž┘┌█▄▌▐▀рстуфхцчшщъыьэюяЁё≥≤„“÷≈°∙·√ⁿ²■ "},cp1125:{name:"Ukrainian",languages:["uk"],offset:128,chars:"АБВГДЕЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯабвгдежзийклмноп░▒▓│┤╡╢╖╕╣║╗╝╜╛┐└┴┬├─┼╞╟╚╔╩╦╠═╬╧╨╤╥╙╘╒╓╫╪┘┌█▄▌▐▀рстуфхцчшщъыьэюяЁёҐґЄєІіЇї·√№¤■ "},cp1162:{name:"Thai",languages:["th"],offset:128,chars:"€…‘’“”•–— กขฃคฅฆงจฉชซฌญฎฏฐฑฒณดตถทธนบปผฝพฟภมยรฤลฦวศษสหฬอฮฯะัาำิีึืฺุู����฿เแโใไๅๆ็่้๊๋์ํ๎๏๐๑๒๓๔๕๖๗๘๙๚๛����"},cp2001:{name:"Lithuanian KBL or 771",languages:["lt"],offset:128,chars:"АБВГДЕЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯабвгдежзийклмноп░▒▓│┤╡╢╖╕╣║╗╝╜╛┐└┴┬├─┼╞╟╚╔╩╦╠═╬╧╨╤╥╙╘╒╓╫╪┘┌█ĄąČčрстуфхцчшщъыьэюяĘęĖėĮįŠšŲųŪūŽž■ "},cp3001:{name:"Estonian 1 or 1116",languages:["et"],offset:128,chars:"ÇüéâäàåçêëèïîìÄÅÉæÆôöòûùÿÖÜø£Ø×ƒáíóúñÑªº¿®¬½¼¡«»░▒▓│┤ÁÂÀ©╣║╗╝¢¥┐└┴┬├─┼ãÃ╚╔╩╦╠═╬¤šŠÊËÈıÍÎÏ┘┌█▄¦Ì▀ÓßÔÒõÕµžŽÚÛÙýÝ¯´­±‗¾¶§÷¸°¨·¹³²■ "},cp3002:{name:"Estonian 2",languages:["et"],offset:128,chars:" ¡¢£¤¥¦§¨©ª«¬­®‾°±²³´µ¶·¸¹º»¼½¾¿ÀÁÂÃÄÅÆÇÈÉÊËÌÍÎÏŠÑÒÓÔÕÖ×ØÙÚÛÜÝŽßàáâãäåæçèéêëìíîïšñòóôõö÷øùúûüýžÿ"},cp3011:{name:"Latvian 1",languages:["lv"],offset:128,chars:"ÇüéâäàåçêëèïîìÄÅÉæÆôöòûùÿÖÜ¢£¥₧ƒáíóúñÑªº¿⌐¬½¼¡«»░▒▓│┤Ā╢ņ╕╣║╗╝╜╛┐└┴┬├─┼ā╟╚╔╩╦╠═╬╧Š╤čČ╘╒ģĪī┘┌█▄ūŪ▀αßΓπΣσµτΦΘΩδ∞φε∩ĒēĢķĶļĻžŽ∙·√Ņš■ "},cp3012:{name:"Latvian 2 (modified 866)",languages:["lv"],offset:128,chars:"АБВГДЕЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯабвгдежзийклмноп░▒▓│┤Ā╢ņ╕╣║╗╝Ō╛┐└┴┬├─┼ā╟╚╔╩╦╠═╬╧Š╤čČ╘╒ģĪī┘┌█▄ūŪ▀рстуфхцчшщъыьэюяĒēĢķĶļĻžŽō·√Ņš■ "},cp3021:{name:"Bulgarian (MIK)",languages:["bg"],offset:128,chars:"АБВГДЕЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯабвгдежзийклмнопрстуфхцчшщъыьэюя└┴┬├─┼╣║╚╔╩╦╠═╬┐░▒▓│┤№§╗╝┘┌█▄▌▐▀αßΓπΣσµτΦΘΩδ∞φε∩≡±≥≤⌠⌡÷≈°∙·√ⁿ²■ "},cp3041:{name:"Maltese ISO 646",languages:["mt"],offset:0,chars:"\0\b\t\n\v\f\r !\"#$%&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZġżħ^_ċabcdefghijklmnopqrstuvwxyzĠŻĦĊ"},cp3840:{name:"Russian (modified 866)",languages:["ru"],offset:128,chars:"АБВГДЕЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯабвгдежзийклмноп░▒▓│┤╡╢╖╕╣║╗╝╜╛┐└┴┬├─┼╞╟╚╔╩╦╠═╬╧╨╤╥╙╘╒╓╫╪┘┌█▄▌▐▀рстуфхцчшщъыьэюя≡±≥≤⌠⌡÷≈°∙·√ⁿ²■ "},cp3841:{name:"Ghost",languages:["ru"],offset:128,chars:"ғәёіїјҝөўүӽӈҹҷє£ҒӘЁІЇЈҜӨЎҮӼӇҸҶЄЪ !\"#$%&'()*+,-./0123456789:;<=>?юабцдефгхийклмнопярстужвьызшэщчъЮАБЦДЕФГХИЙКЛМНОПЯРСТУЖВЬЫЗШЭЩЧ∅"},cp3843:{name:"Polish (Mazovia)",languages:["pl"],offset:128,chars:"ÇüéâäàąçêëèïîćÄĄĘęłôöĆûùŚÖÜ¢Ł¥śƒŹŻóÓńŃźż¿⌐¬½¼¡«»░▒▓│┤╡╢╖╕╣║╗╝╜╛┐└┴┬├─┼╞╟╚╔╩╦╠═╬╧╨╤╥╙╘╒╓╫╪┘┌█▄▌▐▀αßΓπΣσµτΦΘΩδ∞φε∩≡±≥≤⌠⌡÷≈°∙·√ⁿ²■ "},cp3844:{name:"Czech (Kamenický)",languages:["cz"],offset:128,chars:"ČüéďäĎŤčěĚĹÍľĺÄÁÉžŽôöÓůÚýÖÜŠĽÝŘťáíóúňŇŮÔšřŕŔ¼§«»░▒▓│┤╡╢╖╕╣║╗╝╜╛┐└┴┬├─┼╞╟╚╔╩╦╠═╬╧╨╤╥╙╘╒╓╫╪┘┌█▄▌▐▀αßΓπΣσµτΦΘΩδ∞φε∩≡±≥≤⌠⌡÷≈°∙·√ⁿ²■ "},cp3845:{name:"Hungarian (CWI-2)",languages:["hu"],offset:128,chars:"ÇüéâäàåçêëèïîÍÄÁÉæÆőöÓűÚŰÖÜ¢£¥₧ƒáíóúñÑªŐ¿⌐¬½¼¡«»░▒▓│┤╡╢╖╕╣║╗╝╜╛┐└┴┬├─┼╞╟╚╔╩╦╠═╬╧╨╤╥╙╘╒╓╫╪┘┌█▄▌▐▀αßΓπΣσµτΦΘΩδ∞φε∩≡±≥≤⌠⌡÷≈°∙·√ⁿ²■ "},cp3846:{name:"Turkish",languages:["tr"],offset:128,chars:"ÇüéâäàåçêëèïîıÄÅÉæÆôöòûùİÖÜ¢£¥ŞşáíóúñÑĞğ¿⌐¬½¼¡«»░▒▓│┤╡╢╖╕╣║╗╝╜╛┐└┴┬├─┼╞╟╚╔╩╦╠═╬╧╨╤╥╙╘╒╓╫╪┘┌█▄▌▐▀αßΓπΣσµτΦΘΩδ∞φε∩≡±≥≤⌠⌡÷≈°∙·√ⁿ²■ "},cp3847:{name:"Brazil ABNT",languages:["pt"],offset:256,chars:""},cp3848:{name:"Brazil ABICOMP",languages:["pt"],offset:160,chars:" ÀÁÂÃÄÇÈÉÊËÌÍÎÏÑÒÓÔÕÖŒÙÚÛÜŸ¨£¦§°¡àáâãäçèéêëìíîïñòóôõöœùúûüÿßªº¿±"},iso88591:{name:"Latin 1",languages:["en"],offset:128,chars:" ¡¢£¤¥¦§¨©ª«¬­®¯°±²³´µ¶·¸¹º»¼½¾¿ÀÁÂÃÄÅÆÇÈÉÊËÌÍÎÏÐÑÒÓÔÕÖ×ØÙÚÛÜÝÞßàáâãäåæçèéêëìíîïðñòóôõö÷øùúûüýþÿ"},iso88592:{name:"Latin 2",languages:["hu","pl","cz"],offset:128,chars:" Ą˘Ł¤ĽŚ§¨ŠŞŤŹ­ŽŻ°ą˛ł´ľśˇ¸šşťź˝žżŔÁÂĂÄĹĆÇČÉĘËĚÍÎĎĐŃŇÓÔŐÖ×ŘŮÚŰÜÝŢßŕáâăäĺćçčéęëěíîďđńňóôőö÷řůúűüýţ˙"},iso88597:{name:"Greek",languages:["el"],offset:128,chars:" ‘’£€₯¦§¨©ͺ«¬­�―°±²³΄΅Ά·ΈΉΊ»Ό½ΎΏΐΑΒΓΔΕΖΗΘΙΚΛΜΝΞΟΠΡ�ΣΤΥΦΧΨΩΪΫάέήίΰαβγδεζηθικλμνξοπρςστυφχψωϊϋόύώ�"},iso885915:{name:"Latin 9",languages:["fr"],offset:128,chars:" ¡¢£€¥Š§š©ª«¬­®¯°±²³Žµ¶·ž¹º»ŒœŸ¿ÀÁÂÃÄÅÆÇÈÉÊËÌÍÎÏÐÑÒÓÔÕÖ×ØÙÚÛÜÝÞßàáâãäåæçèéêëìíîïðñòóôõö÷øùúûüýþÿ"},rk1048:{name:"Kazakh",languages:["kk"],offset:128,chars:"ЂЃ‚ѓ„…†‡€‰Љ‹ЊҚҺЏђ‘’“”•–—�™љ›њқһџ ҰұӘ¤Ө¦§Ё©Ғ«¬­®Ү°±Ііөµ¶·ё№ғ»әҢңүАБВГДЕЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯабвгдежзийклмнопрстуфхцчшщъыьэюя"},windows1250:{name:"Latin 2",languages:["hu","pl","cz"],offset:128,chars:"€�‚�„…†‡�‰Š‹ŚŤŽŹ�‘’“”•–—�™š›śťžź ˇ˘Ł¤Ą¦§¨©Ş«¬­®Ż°±˛ł´µ¶·¸ąş»Ľ˝ľżŔÁÂĂÄĹĆÇČÉĘËĚÍÎĎĐŃŇÓÔŐÖ×ŘŮÚŰÜÝŢßŕáâăäĺćçčéęëěíîďđńňóôőö÷řůúűüýţ˙"},windows1251:{name:"Cyrillic",languages:["ru"],offset:128,chars:"ЂЃ‚ѓ„…†‡€‰Љ‹ЊЌЋЏђ‘’“”•–—�™љ›њќћџ ЎўЈ¤Ґ¦§Ё©Є«¬­®Ї°±Ііґµ¶·ё№є»јЅѕїАБВГДЕЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯабвгдежзийклмнопрстуфхцчшщъыьэюя"},windows1252:{name:"Latin",languages:["fr"],offset:128,chars:"€�‚ƒ„…†‡ˆ‰Š‹Œ�Ž��‘’“”•–—˜™š›œ�žŸ ¡¢£¤¥¦§¨©ª«¬­®¯°±²³´µ¶·¸¹º»¼½¾¿ÀÁÂÃÄÅÆÇÈÉÊËÌÍÎÏÐÑÒÓÔÕÖ×ØÙÚÛÜÝÞßàáâãäåæçèéêëìíîïðñòóôõö÷øùúûüýþÿ"},windows1253:{name:"Greek",languages:["el"],offset:128,chars:"€�‚ƒ„…†‡�‰�‹�����‘’“”•–—�™�›���� ΅Ά£¤¥¦§¨©�«¬­®―°±²³΄µ¶·ΈΉΊ»Ό½ΎΏΐΑΒΓΔΕΖΗΘΙΚΛΜΝΞΟΠΡ�ΣΤΥΦΧΨΩΪΫάέήίΰαβγδεζηθικλμνξοπρςστυφχψωϊϋόύώ�"},windows1254:{name:"Turkish",languages:["tr"],offset:128,chars:"€�‚ƒ„…†‡ˆ‰Š‹Œ����‘’“”•–—˜™š›œ��Ÿ ¡¢£¤¥¦§¨©ª«¬­®¯°±²³´µ¶·¸¹º»¼½¾¿ÀÁÂÃÄÅÆÇÈÉÊËÌÍÎÏĞÑÒÓÔÕÖ×ØÙÚÛÜİŞßàáâãäåæçèéêëìíîïğñòóôõö÷øùúûüışÿ"},windows1255:{name:"Hebrew",languages:["he"],offset:128,chars:"€�‚ƒ„…†‡ˆ‰�‹�����‘’“”•–—˜™�›���� ¡¢£₪¥¦§¨©×«¬­®¯°±²³´µ¶·¸¹÷»¼½¾¿ְֱֲֳִֵֶַָֹֺֻּֽ־ֿ׀ׁׂ׃װױײ׳״�������אבגדהוזחטיךכלםמןנסעףפץצקרשת��‎‏�"},windows1256:{name:"Arabic",languages:["ar"],offset:128,chars:"€پ‚ƒ„…†‡ˆ‰ٹ‹Œچژڈگ‘’“”•–—ک™ڑ›œ‌‍ں ،¢£¤¥¦§¨©ھ«¬­®¯°±²³´µ¶·¸¹؛»¼½¾؟ہءآأؤإئابةتثجحخدذرزسشصض×طظعغـفقكàلâمنهوçèéêëىيîïًٌٍَôُِ÷ّùْûü‎‏ے"},windows1257:{name:"Baltic Rim",languages:["et","lt"],offset:128,chars:"€�‚�„…†‡�‰�‹�¨ˇ¸�‘’“”•–—�™�›�¯˛� �¢£¤�¦§Ø©Ŗ«¬­®Æ°±²³´µ¶·ø¹ŗ»¼½¾æĄĮĀĆÄÅĘĒČÉŹĖĢĶĪĻŠŃŅÓŌÕÖ×ŲŁŚŪÜŻŽßąįāćäåęēčéźėģķīļšńņóōõö÷ųłśūüżž˙"},windows1258:{name:"Vietnamese",languages:["vi"],offset:128,chars:"€�‚ƒ„…†‡ˆ‰�‹Œ����‘’“”•–—˜™�›œ��Ÿ ¡¢£¤¥¦§¨©ª«¬­®¯°±²³´µ¶·¸¹º»¼½¾¿ÀÁÂĂÄÅÆÇÈÉÊË̀ÍÎÏĐÑ̉ÓÔƠÖ×ØÙÚÛÜỮßàáâăäåæçèéêë́íîïđṇ̃óôơö÷øùúûüư₫ÿ"}},s={en:"The quick brown fox jumps over the lazy dog.",jp:"イロハニホヘト チリヌルヲ ワカヨタレソ ツネナラム",pt:"O próximo vôo à noite sobre o Atlântico, põe freqüentemente o único médico.",fr:"Les naïfs ægithales hâtifs pondant à Noël où il gèle sont sûrs d'être déçus en voyant leurs drôles d'œufs abîmés.",sv:"Flygande bäckasiner söka strax hwila på mjuka tuvor.",dk:"Quizdeltagerne spiste jordbær med fløde",el:"ξεσκεπάζω την ψυχοφθόρα βδελυγμία",tr:"Pijamalı hasta, yağız şoföre çabucak güvendi.",ru:"Съешь же ещё этих мягких французских булок да выпей чаю",hu:"Árvíztűrő tükörfúrógép",pl:"Pchnąć w tę łódź jeża lub ośm skrzyń fig",cz:"Mohu jíst sklo, neublíží mi.",ar:"أنا قادر على أكل الزجاج و هذا لا يؤلمني.",et:"Ma võin klaasi süüa, see ei tee mulle midagi.",lt:"Aš galiu valgyti stiklą ir jis manęs nežeidžia.",bg:"Мога да ям стъкло, то не ми вреди.",is:"Ég get etið gler án þess að meiða mig.",he:"אני יכול לאכול זכוכית וזה לא מזיק לי.",fa:".من می توانم بدونِ احساس درد شيشه بخورم",uk:"Я можу їсти скло, і воно мені не зашкодить.",vi:"Tôi có thể ăn thủy tinh mà không hại gì.",kk:"қазақша",lv:"Es varu ēst stiklu, tas man nekaitē.",mt:"Nista' niekol il-ħġieġ u ma jagħmilli xejn.",th:"ฉันกินกระจกได้ แต่มันไม่ทำให้ฉันเจ็บ"};t.exports=class{static getEncodings(){return Object.keys(i)}static getTestStrings(e){return void 0!==i[e]&&void 0!==i[e].languages?i[e].languages.map(e=>({language:e,string:s[e]})):[]}static supports(e){return void 0!==i[e]&&void 0!==i[e].chars}static encode(e,t){const n=new Uint8Array(t.length);let s="\0".repeat(128),a=128;void 0!==i[e]&&void 0!==i[e].chars&&(s=i[e].chars,a=i[e].offset);for(let e=0;e<t.length;e++){const i=t.codePointAt(e);if(i<128)n[e]=i;else{const r=s.indexOf(t[e]);-1!==r?n[e]=a+r:i<256&&(i<a||i>=a+s.length)?n[e]=i:n[e]=63}}return n}}},{}],6:[function(e,t,n){var i={html:{skipScheme:"html",lineBreakScheme:"html",whitespace:"collapse"}},s=/<\s*br(?:[\s/]*|\s[^>]*)>/gi,a={unix:[/\n/g,"\n"],dos:[/\r\n/g,"\r\n"],mac:[/\r/g,"\r"],html:[s,"<br>"],xhtml:[s,"<br/>"]},r={"ansi-color":/\x1B\[[^m]*m/g,html:/<[^>]*>/g,bbcode:/\[[^]]*\]/g},o={soft:1,hard:1},h={collapse:1,default:1,line:1,all:1},c={all:1,multi:1,none:1},l=/([sm])(\d+)/,p=/[-/\\^$*+?.()|[\]{}]/g;function d(e){return e.replace(p,"\\$&")}var u=t.exports=function(e,t,n){"object"==typeof e&&(e=(n=e).start,t=n.stop),"object"==typeof t&&(n=t,e=e||n.start,t=void 0),t||(t=e,e=0),n||(n={});var s,p,u,g,f,w,m,b,_,y,v,k,x,E,q,L,j,I,A="soft",B="default",R=4,M="all",S="",z="";if(s=n.preset)for(s instanceof Array||(s=[s]),I=0;I<s.length;I++){if(!(L=i[s[I]]))throw new TypeError('preset must be one of "'+Object.keys(i).join('", "')+'"');L.mode&&(A=L.mode),L.whitespace&&(B=L.whitespace),void 0!==L.tabWidth&&(R=L.tabWidth),L.skip&&(p=L.skip),L.skipScheme&&(u=L.skipScheme),L.lineBreak&&(g=L.lineBreak),L.lineBreakScheme&&(f=L.lineBreakScheme),L.respectLineBreaks&&(M=L.respectLineBreaks),void 0!==L.preservedLineIndent&&(m=L.preservedLineIndent),void 0!==L.wrapLineIndent&&(b=L.wrapLineIndent),L.wrapLineIndentBase&&(_=L.wrapLineIndentBase)}if(n.mode){if(!o[n.mode])throw new TypeError('mode must be one of "'+Object.keys(o).join('", "')+'"');A=n.mode}if(n.whitespace){if(!h[n.whitespace])throw new TypeError('whitespace must be one of "'+Object.keys(h).join('", "')+'"');B=n.whitespace}if(void 0!==n.tabWidth){if(!(parseInt(n.tabWidth,10)>=0))throw new TypeError("tabWidth must be a non-negative integer");R=parseInt(n.tabWidth,10)}if(q=new Array(R+1).join(" "),n.respectLineBreaks){if(!c[n.respectLineBreaks]&&!l.test(n.respectLineBreaks))throw new TypeError('respectLineBreaks must be one of "'+Object.keys(c).join('", "')+'", "m<num>", "s<num>"');M=n.respectLineBreaks}if("multi"===M)M="m",w=2;else if(!c[M]){var T=l.exec(M);M=T[1],w=parseInt(T[2],10)}if(void 0!==n.preservedLineIndent){if(!(parseInt(n.preservedLineIndent,10)>=0))throw new TypeError("preservedLineIndent must be a non-negative integer");m=parseInt(n.preservedLineIndent,10)}if(m>0&&(S=new Array(m+1).join(" ")),void 0!==n.wrapLineIndent){if(isNaN(parseInt(n.wrapLineIndent,10)))throw new TypeError("wrapLineIndent must be an integer");b=parseInt(n.wrapLineIndent,10)}if(n.wrapLineIndentBase&&(_=n.wrapLineIndentBase),_){if(void 0===b)throw new TypeError("wrapLineIndent must be specified when wrapLineIndentBase is specified");if(_ instanceof RegExp)E=_;else{if("string"!=typeof _)throw new TypeError("wrapLineIndentBase must be either a RegExp object or a string");E=new RegExp(d(_))}}else if(b>0)z=new Array(b+1).join(" ");else if(b<0)throw new TypeError("wrapLineIndent must be non-negative when a base is not specified");if(n.skipScheme){if(!r[n.skipScheme])throw new TypeError('skipScheme must be one of "'+Object.keys(r).join('", "')+'"');u=n.skipScheme}if(n.skip&&(p=n.skip),p)if(p instanceof RegExp)(y=p).global||(j="g",y.ignoreCase&&(j+="i"),y.multiline&&(j+="m"),y=new RegExp(y.source,j));else{if("string"!=typeof p)throw new TypeError("skip must be either a RegExp object or a string");y=new RegExp(d(p),"g")}if(!y&&u&&(y=r[u]),n.lineBreakScheme){if(!a[n.lineBreakScheme])throw new TypeError('lineBreakScheme must be one of "'+Object.keys(a).join('", "')+'"');f=n.lineBreakScheme}if(n.lineBreak&&(g=n.lineBreak),f&&(L=a[f])&&(v=L[0],k=L[1]),g)if(g instanceof Array&&(1===g.length?g=g[0]:g.length>=2&&(g[0]instanceof RegExp?(v=g[0],"string"==typeof g[1]&&(k=g[1])):g[1]instanceof RegExp?(v=g[1],"string"==typeof g[0]&&(k=g[0])):"string"==typeof g[0]&&"string"==typeof g[1]?(v=new RegExp(d(g[0]),"g"),k=g[1]):g=g[0])),"string"==typeof g)k=g,v||(v=new RegExp(d(g),"g"));else if(g instanceof RegExp)v=g;else if(!(g instanceof Array))throw new TypeError("lineBreak must be a RegExp object, a string, or an array consisted of a RegExp object and a string");v||(v=/\n/g,k="\n"),j="g",v.ignoreCase&&(j+="i"),v.multiline&&(j+="m"),x=new RegExp("\\s*(?:"+v.source+")(?:"+v.source+"|\\s)*",j),v.global||(v=new RegExp(v.source,j));var C="hard"===A?/\b/:/(\S+\s+)/,O=new Array(e+1).join(" "),U="default"===B||"collapse"===B,N="collapse"===B,W="line"===B,P="all"===B,D=/\t/g,F=/  +/g,G=/^\s+/,H=/\s+$/,K=/\S/,$=/\s/,Q=t-e;return function(n){var i;if(n=n.toString().replace(D,q),!k){if(v.lastIndex=0,!(i=v.exec(n)))throw new TypeError("Line break string for the output not specified");k=i[0]}var s,a,r,o,h,c,l,p,d,u=0;for(s=[],x.lastIndex=0,i=x.exec(n);i;){if(s.push(n.substring(u,i.index)),"none"!==M){for(r=[],o=0,v.lastIndex=0,a=v.exec(i[0]);a;)r.push(i[0].substring(o,a.index)),o=a.index+a[0].length,a=v.exec(i[0]);r.push(i[0].substring(o)),s.push({type:"break",breaks:r})}else h=N?" ":i[0].replace(v,""),s.push({type:"break",remaining:h});u=i.index+i[0].length,i=x.exec(n)}if(s.push(n.substring(u)),y)for(d=[],c=0;c<s.length;c++){var g=s[c];if("string"!=typeof g)d.push(g);else{for(u=0,y.lastIndex=0,i=y.exec(g);i;)d.push(g.substring(u,i.index)),d.push({type:"skip",value:i[0]}),u=i.index+i[0].length,i=y.exec(g);d.push(g.substring(u))}}else d=s;var f=[];for(c=0;c<d.length;c++){var m=d[c];if("string"!=typeof m)f.push(m);else{N&&(m=m.replace(F," "));var _=m.split(C),L=[];for(l=0;l<_.length;l++){var j=_[l];if("hard"===A)for(p=0;p<j.length;p+=Q)L.push(j.slice(p,p+Q));else L.push(j)}f=f.concat(L)}}var I,B=0,R=e+S.length,T=[O+S],V=0,J=!0,X=!0,Y=z;function Z(n){var i,s,a,r=T[B];if(P)R>t&&(V=V||t,a=r.length-(R-V),T[B]=r.substring(0,a)),V=0;else{for(i=r.length-1;i>=e&&" "===r[i];)i--;for(;i>=e&&$.test(r[i]);)i--;++i!==r.length&&(T[B]=r.substring(0,i)),X&&J&&W&&R>t&&(a=r.length-(R-t))<i&&(a=i)}if(X&&(X=!1,E&&(i=T[B].substring(e).search(E),Y=i>=0&&i+b>0?new Array(i+b+1).join(" "):"")),a){for(;a+Q<r.length;)P?(s=r.substring(a,a+Q),T.push(O+Y+s)):T.push(O+Y),a+=Q,B++;if(!n)return s=r.substring(a),Y+s;P?(s=r.substring(a),T.push(O+Y+s)):T.push(O+Y),B++}return""}for(c=0;c<f.length;c++){var ee=f[c];if(""!==ee)if("string"==typeof ee){for(var te;;){if(te=void 0,R+ee.length>t&&R+(te=ee.replace(H,"")).length>t&&""!==te&&R>e){if(I=Z(!1),T.push(O+Y),B++,R=e+Y.length,I){T[B]+=I,R+=I.length,J=!0;continue}!U&&(!W||X&&J)||(ee=ee.replace(G,"")),J=!1}else J&&(U||W&&(!X||!J)?""!==(ee=ee.replace(G,""))&&(J=!1):K.test(ee)&&(J=!1));break}P&&te&&R+te.length>t&&(V=R+te.length),T[B]+=ee,R+=ee.length}else if("break"===ee.type)if("none"!==M){var ne=ee.breaks,ie=ne.length-1;if("s"===M){for(l=0;l<ie;l++)ne[l+1].length<w?ne[l+1]=N?" ":ne[l]+ne[l+1]:(P&&(T[B]+=ne[l],R+=ne[l].length),Z(!0),T.push(O+S),B++,R=e+S.length,X=J=!0);(!J||P||W&&X)&&((N||!J&&""===ne[ie])&&(ne[ie]=" "),T[B]+=ne[ie],R+=ne[ie].length)}else if("m"===M&&ie<w)(!J||P||W&&X)&&(N?ee=" ":(ee=ne.join(""),J||""!==ee||(ee=" ")),T[B]+=ee,R+=ee.length);else if(U){for(Z(!0),l=0;l<ie;l++)T.push(O+S),B++;R=e+S.length,X=J=!0}else for((P||X&&J)&&(T[B]+=ne[0],R+=ne[0].length),l=0;l<ie;l++)Z(!0),T.push(O+S+ne[l+1]),B++,R=e+S.length+ne[l+1].length,X=J=!0}else(!J||P||W&&X)&&(ee=ee.remaining,(N||!J&&""===ee)&&(ee=" "),T[B]+=ee,R+=ee.length);else"skip"===ee.type&&(R>t&&(I=Z(!1),T.push(O+Y),B++,R=e+Y.length,I&&(T[B]+=I,R+=I.length),J=!0),T[B]+=ee.value)}return Z(!0),T.join(k)}};u.soft=u,u.hard=function(){var e=[].slice.call(arguments),t=e.length-1;return"object"==typeof e[t]?e[t].mode="hard":e.push({mode:"hard"}),u.apply(null,e)},u.wrap=function(e){var t=[].slice.call(arguments);return t.shift(),u.apply(null,t)(e)}},{}],7:[function(e,t,n){const i=e("linewrap"),{createCanvas:s}=e("canvas"),a=e("canvas-dither"),r=e("canvas-flatten"),o=e("codepage-encoder"),h={epson:{cp437:0,shiftjis:1,cp850:2,cp860:3,cp863:4,cp865:5,cp851:11,cp853:12,cp857:13,cp737:14,iso88597:15,windows1252:16,cp866:17,cp852:18,cp858:19,cp720:32,cp775:33,cp855:34,cp861:35,cp862:36,cp864:37,cp869:38,iso88592:39,iso885915:40,cp1098:41,cp1118:42,cp1119:43,cp1125:44,windows1250:45,windows1251:46,windows1253:47,windows1254:48,windows1255:49,windows1256:50,windows1257:51,windows1258:52,rk1048:53},zjiang:{cp437:0,shiftjis:1,cp850:2,cp860:3,cp863:4,cp865:5,windows1252:16,cp866:17,cp852:18,cp858:19,windows1255:32,cp861:56,cp855:60,cp857:61,cp862:62,cp864:63,cp737:64,cp851:65,cp869:66,cp1119:68,cp1118:69,windows1250:72,windows1251:73,cp3840:74,cp3843:76,cp3844:77,cp3845:78,cp3846:79,cp3847:80,cp3848:81,cp2001:83,cp3001:84,cp3002:85,cp3011:86,cp3012:87,cp3021:88,cp3041:89,windows1253:90,windows1254:91,windows1256:92,cp720:93,windows1258:94,cp775:95},bixolon:{cp437:0,shiftjis:1,cp850:2,cp860:3,cp863:4,cp865:5,cp851:11,cp858:19},star:{cp437:0,shiftjis:1,cp850:2,cp860:3,cp863:4,cp865:5,windows1252:16,cp866:17,cp852:18,cp858:19},legacy:{cp437:0,cp737:64,cp850:2,cp775:95,cp852:18,cp855:60,cp857:61,cp858:19,cp860:3,cp861:56,cp862:62,cp863:4,cp864:28,cp865:5,cp866:17,cp869:66,cp936:255,cp949:253,cp950:254,cp1252:16,iso88596:22,shiftjis:252,windows874:30,windows1250:72,windows1251:73,windows1252:71,windows1253:90,windows1254:91,windows1255:32,windows1256:92,windows1257:25,windows1258:94}};class c{constructor(e){this._reset(e)}_reset(e){this._options=Object.assign({width:null,embedded:!1,wordWrap:!0,imageMode:"column",codepageMapping:"epson",codepageCandidates:["cp437","cp858","cp860","cp861","cp863","cp865","cp852","cp857","cp855","cp866","cp869"]},e),this._embedded=this._options.width&&this._options.embedded,this._buffer=[],this._queued=[],this._cursor=0,this._codepage="ascii",this._state={codepage:0,align:"left",bold:!1,italic:!1,underline:!1,invert:!1,width:1,height:1}}_encode(e){if("auto"!=this._codepage)return o.encode(e,this._codepage);let t;t="string"==typeof this._options.codepageMapping?h[this._options.codepageMapping]:this._options.codepageMapping;const n=o.autoEncode(e,this._options.codepageCandidates);let i=0;for(let e=0;e<n.length;e++)i+=3+n[e].bytes.byteLength;const s=new Uint8Array(i);let a=0;for(let e=0;e<n.length;e++)s.set([27,116,t[n[e].codepage]],a),s.set(n[e].bytes,a+3),a+=3+n[e].bytes.byteLength,this._state.codepage=t[n[e].codepage];return s}_queue(e){e.forEach(e=>this._queued.push(e))}_flush(){if(this._embedded){let e=this._options.width-this._cursor;if("left"==this._state.align&&this._queued.push(new Array(e).fill(32)),"center"==this._state.align){const t=e%2;(e>>=1)>0&&this._queued.push(new Array(e).fill(32)),e+t>0&&this._queued.unshift(new Array(e+t).fill(32))}"right"==this._state.align&&this._queued.unshift(new Array(e).fill(32))}this._buffer=this._buffer.concat(this._queued),this._queued=[],this._cursor=0}_wrap(e,t){if(t||this._options.wordWrap&&this._options.width){const n="-".repeat(this._cursor);return i(t||this._options.width,{lineBreak:"\n",whitespace:"all"})(n+e).substring(this._cursor).split("\n")}return[e]}_restoreState(){this.bold(this._state.bold),this.italic(this._state.italic),this.underline(this._state.underline),this.invert(this._state.invert),this._queue([27,116,this._state.codepage])}_getCodepageIdentifier(e){let t;return(t="string"==typeof this._options.codepageMapping?h[this._options.codepageMapping]:this._options.codepageMapping)[e]}initialize(){return this._queue([27,64]),this._flush(),this}codepage(e){if("auto"===e)return this._codepage=e,this;if(!o.supports(e))throw new Error("Unknown codepage");let t;if(void 0===(t="string"==typeof this._options.codepageMapping?h[this._options.codepageMapping]:this._options.codepageMapping)[e])throw new Error("Codepage not supported by printer");return this._codepage=e,this._state.codepage=t[e],this._queue([27,116,t[e]]),this}text(e,t){const n=this._wrap(e,t);for(let e=0;e<n.length;e++){const t=this._encode(n[e]);this._queue([t]),this._cursor+=n[e].length*this._state.width,this._options.width&&!this._embedded&&(this._cursor=this._cursor%this._options.width),e<n.length-1&&this.newline()}return this}newline(){return this._flush(),this._queue([10,13]),this._embedded&&this._restoreState(),this}line(e,t){return this.text(e,t),this.newline(),this}underline(e){return void 0===e&&(e=!this._state.underline),this._state.underline=e,this._queue([27,45,Number(e)]),this}italic(e){return void 0===e&&(e=!this._state.italic),this._state.italic=e,this._queue([27,52,Number(e)]),this}bold(e){return void 0===e&&(e=!this._state.bold),this._state.bold=e,this._queue([27,69,Number(e)]),this}width(e){if(void 0===e&&(e=1),"number"!=typeof e)throw new Error("Width must be a number");if(e<1||e>8)throw new Error("Width must be between 1 and 8");return this._state.width=e,this._queue([29,33,this._state.height-1|this._state.width-1<<4]),this}height(e){if(void 0===e&&(e=1),"number"!=typeof e)throw new Error("Height must be a number");if(e<1||e>8)throw new Error("Height must be between 1 and 8");return this._state.height=e,this._queue([29,33,this._state.height-1|this._state.width-1<<4]),this}invert(e){return void 0===e&&(e=!this._state.invert),this._state.invert=e,this._queue([29,66,Number(e)]),this}size(e){return e="small"===e?1:0,this._queue([27,77,e]),this}align(e){const t={left:0,center:1,right:2};if(!(e in t))throw new Error("Unknown alignment");return this._state.align=e,this._embedded||this._queue([27,97,t[e]]),this}table(e,t){0!=this._cursor&&this.newline();for(let n=0;n<t.length;n++){const s=[];let a=0;for(let r=0;r<e.length;r++){const o=[];if("string"==typeof t[n][r]){const s=i(e[r].width,{lineBreak:"\n"})(t[n][r]).split("\n");for(let t=0;t<s.length;t++)"right"==e[r].align?o[t]=this._encode(s[t].padStart(e[r].width)):o[t]=this._encode(s[t].padEnd(e[r].width))}if("function"==typeof t[n][r]){const i=new c(Object.assign({},this._options,{width:e[r].width,embedded:!0}));i._codepage=this._codepage,i.align(e[r].align),t[n][r](i);const s=i.encode();let a=[];for(let e=0;e<s.byteLength;e++)e<s.byteLength-1&&10===s[e]&&13===s[e+1]?(o.push(a),a=[],e++):a.push(s[e]);a.length&&o.push(a)}a=Math.max(a,o.length),s[r]=o}for(let t=0;t<e.length;t++)if(s[t].length<a)for(let n=s[t].length;n<a;n++){let n="top";void 0!==e[t].verticalAlign&&(n=e[t].verticalAlign),"bottom"==n?s[t].unshift(new Array(e[t].width).fill(32)):s[t].push(new Array(e[t].width).fill(32))}for(let t=0;t<a;t++){for(let n=0;n<e.length;n++)void 0!==e[n].marginLeft&&this.raw(new Array(e[n].marginLeft).fill(32)),this.raw(s[n][t]),void 0!==e[n].marginRight&&this.raw(new Array(e[n].marginRight).fill(32));this.newline()}}return this}rule(e){return e=Object.assign({style:"single",width:this._options.width||10},e||{}),this._queue([27,116,this._getCodepageIdentifier("cp437"),new Array(e.width).fill("double"===e.style?205:196)]),this._queue([27,116,this._state.codepage]),this.newline(),this}box(e,t){let n;n="double"==(e=Object.assign({style:"single",width:this._options.width||30,marginLeft:0,marginRight:0,paddingLeft:0,paddingRight:0},e||{})).style?[201,187,200,188,205,186]:[218,191,192,217,196,179],0!=this._cursor&&this.newline(),this._restoreState(),this._queue([27,116,this._getCodepageIdentifier("cp437")]),this._queue([new Array(e.marginLeft).fill(32),n[0],new Array(e.width-2).fill(n[4]),n[1],new Array(e.marginRight).fill(32)]),this.newline();const s=[];if("string"==typeof t){const n=i(e.width-2-e.paddingLeft-e.paddingRight,{lineBreak:"\n"})(t).split("\n");for(let t=0;t<n.length;t++)"right"==e.align?s[t]=this._encode(n[t].padStart(e.width-2-e.paddingLeft-e.paddingRight)):s[t]=this._encode(n[t].padEnd(e.width-2-e.paddingLeft-e.paddingRight))}if("function"==typeof t){const n=new c(Object.assign({},this._options,{width:e.width-2-e.paddingLeft-e.paddingRight,embedded:!0}));n._codepage=this._codepage,n.align(e.align),t(n);const i=n.encode();let a=[];for(let e=0;e<i.byteLength;e++)e<i.byteLength-1&&10===i[e]&&13===i[e+1]?(s.push(a),a=[],e++):a.push(i[e]);a.length&&s.push(a)}for(let t=0;t<s.length;t++)this._queue([new Array(e.marginLeft).fill(32),n[5],new Array(e.paddingLeft).fill(32)]),this._queue([s[t]]),this._restoreState(),this._queue([27,116,this._getCodepageIdentifier("cp437")]),this._queue([new Array(e.paddingRight).fill(32),n[5],new Array(e.marginRight).fill(32)]),this.newline();return this._queue([new Array(e.marginLeft).fill(32),n[2],new Array(e.width-2).fill(n[4]),n[3],new Array(e.marginRight).fill(32)]),this._restoreState(),this.newline(),this}barcode(e,t,n){if(this._embedded)throw new Error("Barcodes are not supported in table cells or boxes");const i={upca:0,upce:1,ean13:2,ean8:3,code39:4,coda39:4,itf:5,codabar:6,code93:72,code128:73,"gs1-128":80,"gs1-databar-omni":81,"gs1-databar-truncated":82,"gs1-databar-limited":83,"gs1-databar-expanded":84,"code128-auto":85};if(!(t in i))throw new Error("Symbology not supported by printer");{const s=o.encode(e,"ascii");0!=this._cursor&&this.newline(),this._queue([29,104,n,29,119,"code39"===t?2:3]),"code128"==t&&123!==s[0]?this._queue([29,107,i[t],s.length+2,123,66,s]):i[t]>64?this._queue([29,107,i[t],s.length,s]):this._queue([29,107,i[t],s,0])}return this._flush(),this}qrcode(e,t,n,i){if(this._embedded)throw new Error("QR codes are not supported in table cells or boxes");this._queue([10]);const s={1:49,2:50};if(void 0===t&&(t=2),!(t in s))throw new Error("Model must be 1 or 2");if(this._queue([29,40,107,4,0,49,65,s[t],0]),void 0===n&&(n=6),"number"!=typeof n)throw new Error("Size must be a number");if(n<1||n>8)throw new Error("Size must be between 1 and 8");this._queue([29,40,107,3,0,49,67,n]);const a={l:48,m:49,q:50,h:51};if(void 0===i&&(i="m"),!(i in a))throw new Error("Error level must be l, m, q or h");this._queue([29,40,107,3,0,49,69,a[i]]);const r=o.encode(e,"iso88591"),h=r.length+3;return this._queue([29,40,107,h%255,h/255,49,80,48,r]),this._queue([29,40,107,3,0,49,81,48]),this._flush(),this}image(e,t,n,i,o){if(this._embedded)throw new Error("Images are not supported in table cells or boxes");if(t%8!=0)throw new Error("Width must be a multiple of 8");if(n%8!=0)throw new Error("Height must be a multiple of 8");void 0===i&&(i="threshold"),void 0===o&&(o=128);const h=s(t,n).getContext("2d");h.drawImage(e,0,0,t,n);let c=h.getImageData(0,0,t,n);switch(c=r.flatten(c,[255,255,255]),i){case"threshold":c=a.threshold(c,o);break;case"bayer":c=a.bayer(c,o);break;case"floydsteinberg":c=a.floydsteinberg(c);break;case"atkinson":c=a.atkinson(c)}const l=(e,i)=>e<t&&i<n?c.data[4*(t*i+e)]>0?0:1:0;return 0!=this._cursor&&this.newline(),"column"==this._options.imageMode&&(this._queue([27,51,36]),((e,t)=>{const n=[];for(let i=0;i<Math.ceil(t/24);i++){const t=new Uint8Array(3*e);for(let n=0;n<e;n++)for(let e=0;e<3;e++)for(let s=0;s<8;s++)t[3*n+e]|=l(n,24*i+s+8*e)<<7-s;n.push(t)}return n})(t,n).forEach(e=>{this._queue([27,42,33,255&t,t>>8&255,e,10])}),this._queue([27,50])),"raster"==this._options.imageMode&&this._queue([29,118,48,0,t>>3&255,t>>3>>8&255,255&n,n>>8&255,((e,t)=>{const n=new Uint8Array(e*t>>3);for(let i=0;i<t;i++)for(let t=0;t<e;t+=8)for(let s=0;s<8;s++)n[i*(e>>3)+(t>>3)]|=l(t+s,i)<<7-s;return n})(t,n)]),this._flush(),this}cut(e){if(this._embedded)throw new Error("Cut is not supported in table cells or boxes");let t=0;return"partial"==e&&(t=1),this._queue([29,86,t]),this}pulse(e,t,n){if(this._embedded)throw new Error("Pulse is not supported in table cells or boxes");return void 0===e&&(e=0),void 0===t&&(t=100),void 0===n&&(n=500),t=Math.min(500,Math.round(t/2)),n=Math.min(500,Math.round(n/2)),this._queue([27,112,e?1:0,255&t,255&n]),this}raw(e){return this._queue(e),this}encode(){this._flush();let e=0;this._buffer.forEach(t=>{"number"==typeof t?e++:e+=t.length});const t=new Uint8Array(e);let n=0;return this._buffer.forEach(e=>{"number"==typeof e?(t[n]=e,n++):(t.set(e,n),n+=e.length)}),this._reset(),t}}t.exports=c},{canvas:3,"canvas-dither":1,"canvas-flatten":2,"codepage-encoder":5,linewrap:6}]},{},[7])(7)});
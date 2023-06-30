import { message } from "antd";

/* eslint no-useless-escape:0 import/prefer-default-export:0 */
const reg = /(((^https?:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+(?::\d+)?|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)$/;

export const isUrl = (path: string): boolean => reg.test(path);

export const isAntDesignPro = (): boolean => {
  if (ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION === 'site') {
    return true;
  }
  return window.location.hostname === 'preview.pro.ant.design';
};

// 给官方演示站点用，用于关闭真实开发环境不需要使用的特性
export const isAntDesignProOrDev = (): boolean => {
  const { NODE_ENV } = process.env;
  if (NODE_ENV === 'development') {
    return true;
  }
  return isAntDesignPro();
};

export const authorizationError=(response:any)=>{
  switch (response.status) {
      case 401:
          message.error('401: The authentication information has expired. Please refresh the interface or log in again.');
          return true;
      case 403:
          message.error('403: No relevant authority, request rejected');
          return true;
      default:
          return false;
  }
}

function padLeftZero(str) {
  return ('00'+str).substr(str.length);
 }
export function formatDate(date,fmt) {
  if(/(y+)/.test(fmt)){
    fmt = fmt.replace(RegExp.$1,(date.getFullYear()+'').substr(4-RegExp.$1.length));
  }
  let o = {
  'M+':date.getMonth() + 1,
  'd+':date.getDate(),
  'h+':date.getHours(),
  'm+':date.getMinutes(),
  's+':date.getSeconds()
  };
 
  // 遍历这个对象
  for(let k in o){
  if(new RegExp(`(${k})`).test(fmt)){
   let str = o[k] + '';
   fmt = fmt.replace(RegExp.$1,(RegExp.$1.length===1)?str:padLeftZero(str));
  }
  }
  return fmt;
 };
 export function toPercent(num:number,n=2){ //转为%
   let ret=(Math.round(num*1e7)/1e5).toString()
   if(ret.indexOf(".")==-1) return ret+"%"
   ret=ret.slice(0,ret.indexOf(".")+n+1)+"%";
   return ret
 }
 export function myTofix(num:number){ //保留2位小数
   let ret=(Math.round(num*1e5)/1e5).toString()
   if(ret.indexOf(".")==-1) return ret
   ret=ret.slice(0,ret.indexOf(".")+3);
   return ret
 }
 export function strTofixed(num:string,n:number=3){ //保留2位小数
   return num.indexOf(".")==-1?num:num.slice(0,num.indexOf(".")+n+1);
 }
 export function toUrl(paramObj:any){
  if (!paramObj) {
    return ''
  }
  let paramList:string[] = []
  Object.keys(paramObj) && Object.keys(paramObj).forEach(key => {
    let val = paramObj[key]
    if (val instanceof Array) {
      val.forEach(_val => {
        paramList.push(key + '=' + _val)
      })
    } else if(val!=undefined) {
      paramList.push(key + '=' + val)
    }
  })
  return paramList.join('&')
 }  

export function getMousePosInElement(e:any,element:any){
  let rect = element.getBoundingClientRect()
  let x = e.clientX - rect.left
  let y = e.clientY - rect.top
  return {x,y}
}

//将长字符串折行显示
export function splitStr(str:string,len:number){
  let strArr = str.split("")
  let strLen = strArr.length
  let strArr2 = []
  let str2 = ""
  for(let i=0;i<strLen;i++){
    if(i%len==0&&i!=0){
      strArr2.push(str2)
      str2=""
    }
    str2+=strArr[i]
  }
  strArr2.push(str2)
  return strArr2.join("\n")
}

export function deepCompareTwoObj(obj1:any,obj2:any){
  if(typeof obj1!="object"||typeof obj2!="object"){
    return obj1===obj2
  }
  if(Object.keys(obj1).length!=Object.keys(obj2).length){
    return false
  }
  for(let key in obj1){
    if(!deepCompareTwoObj(obj1[key],obj2[key])){
      return false
    }
  }
  return true
}

//去掉字符串里的\n
export function removeEnter(str:string){
  return str.replace(/\n/g,"")
}

export function deepCopy(obj:any){
  return JSON.parse(JSON.stringify(obj))
}


///颜色渐变生成
// 颜色#FF00FF格式转为Array(255,0,255)
function color2rgb(color)
{
 var r = parseInt(color.substr(1, 2), 16);
 var g = parseInt(color.substr(3, 2), 16);
 var b = parseInt(color.substr(5, 2), 16);
 return new Array(r, g, b);
}

// 颜色Array(255,0,255)格式转为#FF00FF
function rgb2color(rgb)
{
 var s = "#";
 for (var i = 0; i < 3; i++)
 {
  var c = Math.round(rgb[i]).toString(16);
  if (c.length == 1)
   c = '0' + c;
  s += c;
 }
 return s.toUpperCase();
}

// 生成渐变
//使用方式：
//const colors= gradient("#871400","#ffd8bf",) 会生成一个颜色数组，注意第二个颜色必须比第一个大
export function gradient(startColor:string,endColor:string)
{
 var result = [];
 var Step = 6;

 var Gradient = new Array(3);
 var A = color2rgb(startColor);
 var B = color2rgb(endColor);

 for (var N = 0; N <= Step; N++)
 {
  for (var c = 0; c < 3; c++) // RGB通道分别进行计算
  {
   Gradient[c] = A[c] + (B[c]-A[c]) / Step * N;
  }
  result.push(rgb2color(Gradient))
 }
 return result
}

export function getGradientColorByStep(startColor:string,endColor:string,step:number)
{
  var Gradient = new Array(3);
  var A = color2rgb(startColor);
  var B = color2rgb(endColor);
  for (var N = 0; N <= step; N++){
    for (var c = 0; c < 3; c++) // RGB通道分别进行计算
    {
      Gradient[c] = A[c] + (B[c]-A[c]) / step * N;
    }
  }
  return rgb2color(Gradient)
}


export const safeReq=async (req:Function,callback?:Function,hideMsg?:boolean)=>{
  try {
    const result = await req()
    if (result && result.code==0) {
      callback?.(result)
      return result
    } else {
      if(!hideMsg){
        message.error('Server status error')
        message.error(result.msg)
      }
      console.log(result)
    }
  } catch (error) {
    console.log(error);
    if(!hideMsg){
      message.error('Response error')
    }
  }
}
///颜色渐变生成

//如何获取hash路由里的参数
export const getHashParams=()=>{
  // import { createHashHistory } from 'history';
  // const history = createHashHistory(); // app.js在路由外面，里不能用useHistroy
  // history.push({ pathname: `/login?redirect=${encodeURIComponent(window.location.hash.slice(1,9999))}` });
  const hash = window.location.hash;
  const queryStart = hash.indexOf('?');
  const queryPart = queryStart !== -1 ? hash.substring(queryStart + 1) : '';
  const urlParams = new URLSearchParams(queryPart);
  const redirect = urlParams.get('redirect');
  // history.push(decodeURIComponent(redirect));
  return decodeURIComponent(redirect)
}
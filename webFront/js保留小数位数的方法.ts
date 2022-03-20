let s=1.23456;
s.slice(0,s.indexOf(".")+3)+"%" 保留3位小数

s.toFixed(2) 保留2位小数，注意：这种方式的弊端是会四舍五入

上述返回都是string类型
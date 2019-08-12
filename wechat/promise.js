console.log("aaaa")
let p = new Promise((resolve,reject) => {
    //...
    let random = Math.random();//小于1大于0
    setTimeout(()=>{resolve('time out')},1000)
    setTimeout(()=>{reject('time out')},1000)
});

p.then(result => {
    console.log('resolve',result);
}, result => {
    console.log('reject',result);
}).catch(a=>{console.log("aaaaassss"+a)});

p.then(result=>{console.log("resolve2",result)})
p.then(null,result=>{console.log("reject",result)})
async function f(){
	return new Promise((resolve,reject)=>{
		console.log('aazzzzz')
		setTimeout(()=>{resolve(99);},2000)
		setTimeout(()=>{reject("aync timeout reject")},4000)
	})
}
async function f1(){
	let x=await f()	;
	console.log("x="+x)
	return new Promise((resolve,reject)=>{
	})
}
f1()
if (false)
    var a =
    new Promise(function (resolve, reject) {
    console.log("1")
    setTimeout(function () {
        console.log("First");
        // resolve("resolve1");
        // resolve(1);
        setTimeout(function () {
            resolve(2)
        },1000)
        console.log("1.1")
        return "resolve2"
    }, 1000);
}).then(function (p1,p2,p3) {
    console.log("2")
    return new Promise(function (resolve, reject) {
        setTimeout(function () {
            console.log("Second");
            resolve();
            // reject()

            console.log("2.1")
        }, 2000);
    });
}).then(function () {
    console.log("3")
    setTimeout(function () {
        console.log("Third");
    }, 1000);
}); 
console.log("end")
if (false) {
    function print(delay, message) {
        return new Promise(function (resolve, reject) {
            setTimeout(function () {
                console.log(message);
                resolve("bbb");
            }, delay);
        });
    }
    async function asyncFunc() {
        var result=await print(1000, "First");
        console.log("1")
        console.log(result)
        await print(1000, "Second");
        console.log("2")
        await new Promise(function (resolve, reject) {
            setTimeout(function () {
                console.log("third");
                resolve();
            }, 1000);
        });
        console.log("3")
    }
    asyncFunc();
}

if(true){
    async function test1() { console.log('start test1');  //output1
            console.log(await test2());
            console.log('end test1');}
        async function test2() {
            console.log('test2');  //output2
            return await 'return test2 value' //不输出，await会加入队列
        }
        test1();
        console.log('start async');
        setTimeout(() => console.log('setTimeout'), 0);
        let p=new Promise((resolve, reject) => {
            console.log('promise1');
            resolve();
        }).then(() => console.log('promise2'));
        console.log('end async');

}
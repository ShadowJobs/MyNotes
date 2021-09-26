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
if (true) {
    function print(delay, message) {
        return new Promise(function (resolve, reject) {
            setTimeout(function () {
                console.log(message);
                resolve();
            }, delay);
        });
    }
    async function asyncFunc() {
        await print(1000, "First");
        console.log("1")
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

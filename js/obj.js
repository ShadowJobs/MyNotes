function ob1() {
    this.name = 'ob1'
    this.x=1
}
ob1.z = 4;
var o1 = new ob1()
o1.y = 2;
console.log(o1)

class A{
    constructor(x) {
        this.x=x
    }
    print() {
        console.log("A")
    }
}
o2 = new A()

class B extends A{
    constructor(a, b) {
        super(a)
        this.a = a;
        this.b = b
        
    }
    print() {
        // super();
        super.print()
        console.log("B")
    }
}
var o3 = new B()
o3.print()
console.log(o2)
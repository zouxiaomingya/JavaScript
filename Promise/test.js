// 类调用类中的方法

class Animal{
    constructor(color, fn){
        this.color = color;
        fn.call(this,this.getColor.bind(this));
    }
    getColor (){
        console.log(this)
        return this.color;
    }
}

const cat = new Animal('black', function(fn){
    console.log(this, '>>>>')
    const color = fn();
    console.log(color);
})
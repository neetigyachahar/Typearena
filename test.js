const onChange = require('on-change');

let data = 10
object = {
    name: 'hello',
    dataValue: function(){
        return data;
    }
}

const watchedObject = onChange(object, function (path, value, previousValue) {
	// console.log('Object changed:', ++i);
	console.log('this:', this);
	console.log('path:', path);
	console.log('value:', value);
	console.log('previousValue:', previousValue);
});


setTimeout(()=>{
    console.log(watchedObject.dataValue());
    data = 20;
    console.log(watchedObject.dataValue());
}, 3000);
/**
 * @file Super simple example.
 */

var Model = require('./index');

var Person = Model.create('Parent', {name: String, age: Number});
Person.defineProperty('parent', Person); // Required for recursive typing.

var father = new Person();
father.name = 'Arthur';
father.age = 42;

var son = new Person();
son.name = 'Ron';
son.age = 17;
son.parent = father;

console.log('Son name: ' + son.name);
console.log('Son age: ' + son.age);

console.log('Father name: ' + father.name);
console.log('Father age: ' + father.age);

console.log('Son.parent name: ' + son.parent.name);
console.log('Son.parent age: ' + son.parent.age);

// Type validation done at set time.
son.name = 17;
console.log('Son name: ' + son.name);

son.age = 'Ron';
console.log('Son age: ' + son.age);

// Setting null deletes, passes type check (won't be true once required is implemented)
son.name = son.age = null;

console.log('Son name: ' + son.name);
console.log('Son age: ' + son.age);
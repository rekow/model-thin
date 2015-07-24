/**
 * @file Super simple example.
 */

var Model = require('./index');

var Person = Model.create('Person', {
  name: String,
  age: Number
});

Person.defineProperty('parent', Person); // Required for recursive typing.
Person.prototype.greet = function () {
  return 'Hi, my name is ' + this.name + ' and I\'m ' + this.age + ' years old.';
};

var father = new Person();
father.name = 'Arthur';
father.age = 42;

var son = new Person();
son.name = 'Ron';
son.age = 17;
son.parent = father;

console.log('son.greet(): %s', son.greet());
console.log('father.greet(): %s', father.greet());
console.log('son.parent.greet(): %s', son.parent.greet());

// Setting invalid values fails with a warning.
son.name = 17;
son.age = 'Ron';

console.log('son.greet(): %s', son.greet());

// Setting null deletes, passing type check (won't be true once required is implemented)
son.name = son.age = null;

console.log('son.greet(): %s', son.greet());

// Defining properties at construction time
var daughter = new Person({
  name: 'Ginny',
  age: 15,
  parent: father
});

console.log('daughter.greet(): %s', daughter.greet());
console.log('daughter.parent.greet(): %s', daughter.parent.greet());

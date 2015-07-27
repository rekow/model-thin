/**
 * @file Super simple example.
 */

var Model = require('./src');

var Person = Model.create('Person', {
  name: String,
  age: Number,
  greet: function () {
    return 'Hi, my name is ' + this.name + ' and I\'m ' + this.age + ' years old.';
  }
});

Person.defineProperty('parent', Person); // Required for recursive typing.

function runExample () {
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

  // Setting null deletes, passing type check (won't be true for required once implemented)
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

  son.name = 'Ron';
  son.age = 17;

  // Storing models (uses in-memory storage by default)
  console.log('\nQuerying stored models:');
  father.put();
  son.put();
  daughter.put();

  // Querying models

  var handleQuery = function(msg) {
    return function (err, results) {
      if (err) {
        console.error('ERROR:');
        console.error(err);
      } else {
        console.log('\n\n%s\n', msg);
        console.log(results);
      }
    };
  }

  Person.find(handleQuery("just grab \'em all"));

  Person.find({
    limit: 1
  }, handleQuery('just one result'));

  Person.find({
    select: 'name'
  }, handleQuery('select names only'));

  Person.find({
    offset: 1
  }, handleQuery('skip the first result'));

  Person.find({
    filter: [function (p) { return p.age < 20; }]
  }, handleQuery('no olds allowed'));
};

console.log('Running example code:\n\n%s\n\n', runExample);
runExample();

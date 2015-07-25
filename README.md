# model-thin
A super-skinny model layer, with simple object property syntax and type validation.

Supported types:

- `String`
- `Number`
- `Boolean`
- `Object`
- `Array`
- `Date`
- `Model` subclasses
- `null` (indicates a deleted property)

Still in early development.

## installation

install with `npm install model-thin`, or add to your project dependencies:

```json
dependencies: {
  "model-thin": ">=0.1.4"
}
```

## usage

```javascript
var Model = require('model');
```

### creating model classes

```javascript
/*
 * Model.create(kind, properties[, parent]);
 */
var Person = Model.create('Person', {
  name: String,
  age: Number,
  greet: function () {
    return "Hi, my name is " + this.name + " and I'm " + this.age + " years old.";
  }
});
```

`kind` is the string name of the class to create, usually capitalized.

`properties` is a map of property names to types (constructors). `properties` can also define methods, declared as a function that isn't one of the supported type constructors. Methods are exposed on the prototype of the new model class.

The optional `parent` param will be ignored if it isn't a subclass of `Model`.

Properties can also be defined after the class is constructed - this method is required for any self-referential model types:

```javascript
/**
 * Model.defineProperty(name, type);
 */
Person.defineProperty('parent', Person);
```

### using models

```javascript
var father = new Person();
father.name = 'Arthur';
father.age = 42;

var son = new Person();
son.name = 'Ron';
son.age = 17;
son.parent = father;

// Setting values of an invalid type fails with a console warning
son.name = 24;
son.age = 'Charlie';

console.log(son.greet()); // prints "Hi, my name is Ron and I'm 17 years old."

// Setting to null 'deletes' the property
son.name = son.age = null;

// Properties can also be set at construction time
var daughter = new Person({
  name: 'Ginny',
  age: 15,
  parent: father
});
```

## why?

Because it's seemingly impossible to find a simple, unopinionated, framework-and-storage-agnostic model layer for Node that also offers object property syntax.

## yet to come:

- drivers for storage integration, with key management
- API for above (`model.put()`/`model.get()`/`model.del()`, etc.)
- required and indexed properties


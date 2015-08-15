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

Unless a property is marked `required`, all types are nullable.

Still in early development.

## installation

install with `npm install model-thin`, or add to your project dependencies:

```javascript
dependencies: {
  "model-thin": "^0.4.1"
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

To provide meta property information use the extended property specification syntax:

```javascript
// Inherits `age` property & `greet` method by passing Person as parent
var NamedPerson = Model.create('NamedPerson', {
  name: { type: String, required: true, indexed: true }
}, Person);
```

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

### storing models

Interacting with storage is abstracted into a common-sense set of async methods on every `Model` instance which proxy to an underlying storage adapter:

- `model.get(callback)`
- `model.put([callback])`
- `model.del([callback])`

Callbacks will be invoked with the server response after a successful or failed operation. Callback params should follow the idiomatic `(err, response)` schema.

Persistence is configured via the extensible storage adapter system and can be configured globally:

```javascript
// Sets the adapter for all model types
Model.useAdapter(adapter);
```

or at the level of individual subclasses:

```javascript
// Sets the adapter for all models of type Person
Person.useAdapter(adapter);
```

#### <a name="adapters"></a>storage adapters

A storage adapter is any object that fulfills the [`Adapter` interface](https://github.com/davidrekow/model-thin/blob/master/src/adapter.js#L6:L73), and should handle:

- configuration
- connecting and disconnecting
- keying models
- converting models from responses
- CRUD operations
- querying by kind

Adapters can be used anonymously by passing the adapter itself to `useAdapter()`, or they can be registered for [use by name](https://github.com/davidrekow/model-thin/blob/master/src/index.js#L266):

```javascript
Model.adapters('adapter-name', adapter);
```

Custom storage adapters should ideally be published as a separate NPM module with the naming schema `model-thin-<db>`, so they can be managed as package-level dependencies.

The [in-memory](https://github.com/davidrekow/model-thin/blob/master/src/adapters/memory.js) adapter is the only built-in storage provided, and is selected by default.

Available adapters:

- [Google Cloud Datastore](https://www.npmjs.com/package/model-thin-gcloud-datastore)

### querying models

Querying is provided through a single static method, available for kinded querying on all model classes:

```javascript
Model.find(queryOpts, callback);
```

This method will handle building model classes out of any result set returned (unless the query contains a property select), by calling the adapter's `toModel()` method. All other heavy lifting is expected to be accomplished by the selected storage adapter, which receives the `queryOpts` object with the Model `kind` added. The `callback` should expect any error as the first param, and a list of results as the second. If the adapter supports query cursors, they will be passed through as the third parameter.

There is a suggested [`Query` interface](https://github.com/davidrekow/model-thin/blob/master/src/query.js) for the `queryOpts` that is lightweight but richly configurable.

A sample implementation can be found in the [gcloud-datastore adapter](https://github.com/davidrekow/model-thin-gcloud-datastore/blob/master/index.js), while samples of its usage are in the [example](https://github.com/davidrekow/model-thin/blob/master/example.js#L75:L91) code.

## why?

Because it's seemingly impossible to find a simple, unopinionated, framework-and-storage-agnostic model layer for Node that also offers object property syntax.

Because you like querying declaratively, not imperatively.

Because it's models, for javascript™ (lol). If you're looking for ActiveRecord on Node, try [Waterline](https://github.com/balderdashy/waterline).

## in progress/todo:
- collections
- transactions
- adapters: redis, mongodb, postgresql
- streaming interface
- schema management?

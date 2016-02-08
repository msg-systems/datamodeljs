# datamodeljs
Data Model Management Library for JavaScript


> __The main goal of *datamodeljs* is to ensure a consistent and reliable data structure when communicating with a backend service.__

In all projects the data structure between backend and frontend can be considered as an interface contract. If either side changes the structure of the data - the counterpart has problems validating and handling the data.
 
In order to avoid long lasting debugging sessions in a JavaScript application we use *datamodeljs* to read in and validate the delivered data against the defined entity model classes.


> __A secondary goal of *datamodeljs* is the ability to manage entity objects and keep track of their states__ (e.g. newly created, marked as changed, marked for deletion)

This entity object management allows the JavaScript application to manipulate business objects on block before sending them anywhere.

In order to be able to handle complex business objects *datamodeljs* implements a bi-directional entity model. Examples can be seen in "Defining entity classes" 

# Entity object states

Entities created with *datamodeljs* know their entity class name:

1. `_className` - the string representation of the entities class name (as declared with the `define` function)

Entities created with *datamodeljs* also can track four different states:

1. `_isDirty` -   has the entity changed on client side since it load time
2. `_isDeleted` - is the entity marked for deletion on client side 
3. `_isTransient` - was the entity created newly on client side
4. `_isStub` - is the entity referenced by another entities relationship, but the entity itself was not loaded by now	  

In most cases a dirty entity leads to an PUT call in the backend. A deleted entity leads a DELETE call. A transient entity results in a POST call and a stub entity should be loaded using a GET call. Mapping this is not part of *datamodeljs* since it has not the goal to cover the AJAX requests. Mapping the entity states to proper AJAX requests is the applications task.

# Entity serialisation and cloning

When serialising or cloning entity objects their internal object properties `_className`, `_isDirty`, `_isDeleted`, `_isTransient` and `_isStub` are not exposed. So using JSON.stringify before sending entites to a service ensures that no internal property is send to the service. Also cloning entity objects simply creates a new JavaScript object that has the entites properties and values set - but it is not considered an entity object anymore since the internal object properties are not cloned.

# Initialization

*datamodeljs* exposes itself to the global variable '`datamodeljs`'. In case that a different symbol for datamodeljs is needed use the `symbol` function. This function allows you to occupy a different global name by giving a new name or releasing the last name by providing no name or an empty name.


        datamodeljs.symbol([symbol:String]) : datamodeljs
         
Example:
```js
    // define an alternate global exposure 
    datamodeljs.symbol("dmjs")
    // delete the former alternate global exposure and restore the old value of 'dmjs'
    datamodeljs.symbol("")
    datamodeljs.symbol()
```

*datamodeljs* allows the definition of different dataManager storages by using the `dm` function:

        datamodeljs.dm(name:String) : dataManager

Example:
```js
    var myDataManager = datamodeljs.dm("mine");
    // all further examples are working with this dataManager
    var dm = datamodeljs.dm("default")
```

# Data management

The `dataManager` created by *datamodeljs* enables the entity class definition and entity management. The following chapters describe the possibilities in detail:

## Defining entity classes

Defining an entity class is the basic for working with entities. Entities are defined with the `define` function. A class definition needs at least an unique class name (`cls`) and its specification (`spec`). A parent class name is optional. If a parent class name is given, all attributes of that class will be copied into the new class name. Please be aware that this is no real extends mechanism of those classes. 

        dataManager.define(cls:String, [parentCls:String], spec:Object) : void

The class specification is a list of attributes following this syntax:

    	{
        	(attribute: (primary)?type(arity)?  )*
    	};
    

1. The attribute's name is set by the `attribute` tag. 
The internal properties  `_className`, `_isDirty`, `_isDeleted`, `_isTransient` and `_isStub` are reserved and can not be used as an class attribute. 
2. One attribute can be defined as `primary` field with the prefix `@`. 
3. The attribute's `type` can be either `number`, `boolean`, `string`, `object` or any other class name 
4. The `arity` defines this attributes relation as an arrayed relation and it can have different options
	1. `?` - stands for zero or one(0..1) elements of the given `type`
	2. `+` - stands for one or more(1..n) elements of the given `type`
	3. `*` - stands for zero or more(0..n) elements of the given `type`

Examples:
```js
    dm.define("AbstractData", {
        id: '@number',                          // this is the primary field
        version: 'number'
    });
    
    dm.define("Verweis", "AbstractData", {      // get all attributes of AbstractData copied
        verweisTyp: "string", 
        anzeigename: "string",
        knoten: "Knoten"                        // relation to objects of class Knoten
    });
    
    dm.define("Knoten", "AbstractData", {
        anzeigename: 'string',
        kindKnoten: 'Knoten*',                  // Knoten can have n childs being Knoten as well
        pfad: 'string'
    });
```

## Undefining entity classes

Removing a class definition from the `dataManager` is possible with the `undefine` function:

        dataManager.undefine(cls:String) : void

Using this function is removing the class, its specification and all entity objects from the `dataManager`. It is most useful when data models are loaded dynamically. 
    
## Creating entity objects

Creating objects of entities is available with the `create` function.

        dataManager.create(cls:String, payload:Object) : entity

1. The `cls` must be one of the defined class names within the `dataManager` 
2. The `payload` is the JSON object that should be converted into an entity. The given payload is hereby validated against the entity class specification

Example:
```js 
    dm.create("Verweis", {
	    id: 1,
		version: 1,
        verweisTyp: "Symbol",
		anzeigename: "symbolic link",
		knoten: 1						// it is sufficient to only provide the id of the related object
 										// the dataManager resolves the relation using the given unique id
    })
```

The given example creates two entity objects. The first is the desired `Verweis`. The second object is a `Knoten` with `id` set to  but the flag __stub__ set to `true`. Meaning that this object is referenced somewhere but it was not yet loaded. If this objects get loaded and created later on, then the reference to this `Knoten` wont change, only its content will be updated and its __stub__ flag will be set to `false`.

Example:
```js
    dm.create("Knoten", {
	    id: 1,
		version: 1,
		anzeigename: "Root Knoten",
		kindKnoten: [],					// it is ok if this array is empty since the arity is *
		pfad: "/" 
    })
```

## Deleting entity objects

Deleting a single entity object is possible using the `destroy` function.

        dataManager.destroy(cls:String, obj:Object, [force:Boolean]) : void

The object will be immediatly removed from the `dataManager` if it was marked as `transient` entity or if `force` is set to `true`. Otherwise it will be marked as `deleted`. This way the JavaScript application can still handle the deletion with a proper AJAX call.

Example: 
```js
    dm.destroy("Verweis", dm.findById("Verweis", 1))
```
----------

The deletion of all objects of a given entity class(`cls`) is possible using the `destroyAll` function.
 
        dataManager.destroyAll(cls:String) : void

Example: 
```js
    dm.destroyAll("Knoten")
```

## Tracking and changing entity object states

Changing the states of an entity is the JavaScript application's task. Entity attributes can be altered as usual in JavaScript applications. The entity class name `_className` can not be changed or deleted from the entity object. The specific entity states `_isDirty`, `_isDeleted`, `_isTransient` and `_isStub` can only be altered to a new legal boolean value. 

		// entity object properties
		entityObj._className : String
		entityObj._isDirty : Boolean
		entityObj._isDeleted : Boolean
		entityObj._isTransient : Boolean
		entityObj._isStub : Boolean

For backward compatibility the `dataManager` functions `isDirty`, `isDeleted`, `isTransient` and `isStub` still remain as decprecated functions (see documentation in [release 1.1.0#tracking-and-changing-entity-object-states](https://github.com/msg-systems/datamodeljs/tree/1.1.0#tracking-and-changing-entity-object-states)). 

## Finding entity objects

Finding entities can be reached over several ways

1. `findAll` - find all objects of a given entity class
2. `findAllDirty` - find all objects of a given entity class that are marked as `dirty`  
3. `findAllDeleted` - find all objects of a given entity class that are marked as `deleted`  
4. `findAllTransient` - find all objects of a given entity class that are marked as `transient`  
5. `findAllStub` - find all objects of a given entity class that are marked as `stub`  
5. `findById` - find all objects of a given entity class that match the given primary key  
5. `findByExample` - find all objects of a given entity class that match a given example object  

The following finder functions only need the class name (`cls`) and will return an array of entity objects that match the finder.

    	dataManager.findAll(cls:String) : Array(entity)
    	dataManager.findAllDirty(cls:String) : Array(entity)
    	dataManager.findAllDeleted(cls:String) : Array(entity)
    	dataManager.findAllTransient(cls:String) : Array(entity) 
    	dataManager.findAllStub(cls:String) : Array(entity)

Example:
```js
    dm.findAll("Verweis")
    dm.findAllDirty("Knoten")  
    dm.findAllDeleted("Knoten")
    dm.findAllTransient("Knoten") 
    dm.findAllStub("Knoten")
```

----------

Finding entities by primary key is quite easy by providing the desired primary as additional parameter (`id`). The `id` is defined as `Any` since it depends on the class specification. Basically it is either a `string` or a `number`.

    	dataManager.findById(cls:String, id:Any) : entity

Example:
```js
    dm.findById("Verweis", 1)
```

----------

Finding entities by a given `example` object is available via the `findByExample` function. 

    	dataManager.findByExample(cls:String, example:Object) : Array(entity)

Example:

    // find all Verweis entities where verweisTyp is equal to "Symbol"
	dm.findByExample("Verweis", { verweisTyp: "Symbol" })
    // find all Verweis entities where verweisTyp is equal to "Symbol" and knoten is equal to Knoten with id 1
	dm.findByExample("Verweis", { verweisTyp: "Symbol", knoten: 1 })

## Partial entity import

Sometimes it is useful or necessary to import data into existing entity objects. The problem with this is that any existing relationship with other others or from other objects should not be influenced. Importing data fields into an existing entity is possible with the `import` function. A given example object (`example`) will hereby be merged into an existing entity object (`obj`). 

    	dataManager.import(cls:String, obj:Object, example:Object) : entity

Example:
```js
    dm.import("Verweis", dm.findById("Verweis", 1), { verweisTyp: "Copy", anzeigename: "Partial change" })
```

This is often needed, if a JavaScript application edits entities then stores changes to any other system and gets a newly changed object as result back. In this case the old 'saved' object still exists in the `dataManager` and it must be updated with the new result of the service. 

## Debugging entity class and objects

Since the `dataManager` does quite some jobs for us and a data model might be slightly huge and complex *datamodeljs* enables a little debugging help for developers. 

		dataManager.dump() : void

Using the `dump` function on the `dataManager` shows you two lists with information:

1. a full list of all defined classes and their specification
2. a full list of all defined entity objects ordered by class
	- once as an arrayed list
	- and once as an object map allowing access by primary key

 
So at any time during development, application test and application runtime it should be possible to get an insight to what the `dataManager` handles. 

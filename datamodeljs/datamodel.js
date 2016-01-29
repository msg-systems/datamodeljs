/*
 **  DatamodelJS - Entity management
 **  Design and Development by msg Applied Technology Research
 **  Copyright (c) 2013 - 2016 msg systems ag (http://www.msg-systems.com/)
 */

/*  Universal Module Definition (UMD)  */
(function (root, factory) {
    /* global define:false */
    /* global exports:false */
    if (typeof define === "function" && define.amd)
        define('datamodeljs', function () { return factory(root); });
    else if (typeof module === "object" && typeof exports === "object")
        module.exports = factory(root);
    else
        root.datamodeljs = factory(root);
}(this, function (root) {
    /*  create internal and external API  */
    var em = {};
    var _em = {};

    /*  utility function: create an exception  */
    _em.exception = function (method, error) {
        return new Error("[EM]: ERROR: " + method + ": " + error);
    };

    /*  utility function: logging via environment console  */
    _em.log = function (msg) {
        /*  try Firebug-style console (in regular browser or Node)  */
        if (typeof console !== "undefined" &&
            typeof console.log !== "undefined")
            console.log("[EM]: " + msg);
    };

    /*  utility function: debugging  */
    _em.debug = (function () {
        var debug_level = 9;
        return function (level, msg) {
            if (arguments.length === 0)
            /*  return old debug level  */
                return debug_level;
            else if (arguments.length === 1)
            /*  configure new debug level  */
                debug_level = level;
            else {
                /*  perform runtime logging  */
                if (level <= debug_level) {
                    /*  determine indentation based on debug level  */
                    var indent = "";
                    for (var i = 1; i < level; i++)
                        indent += "    ";

                    /*  display debug message  */
                    _em.log("DEBUG[" + level + "]: " + indent + msg);
                }
            }
        };
    })();

    /*  API method: change symbol of external API  */
    em.symbol = (function () {
        /*  internal state  */
        var value_original;
        value_original = undefined;
        var symbol_current = null;

        /*  top-level API method  */
        return function (symbol) {
            /*  release old occupation  */
            if (symbol_current !== null)
                root[symbol_current] = value_original;

            /*  perform new occupation  */
            if (typeof symbol === "undefined" || symbol === "")
            /*  occupy no global slot at all  */
                symbol_current = null;
            else {
                /*  occupy new global slot  */
                symbol_current = symbol;
                value_original = root[symbol_current];
                root[symbol_current] = em;
            }

            /*  return the global API  */
            return em;
        };
    })();

    /*  internal: entity manager data models  */
    _em.dm = {};

    /*  API method: resolve and on-the-fly create data model context  */
    em.dm = function (name) {
        if (arguments.length === 0)
            name = "default";
        var dm = _em.dm[name];
        if (typeof dm === "undefined") {
            dm = new _em.dm_api();
            _em.dm[name] = dm;
        }
        return dm;
    };

    /*  internal: data model methods  */
    _em.dm.getPrimaryFieldsForClass = function (cls) {
        var spec = this.entities[cls];
        var ret = [];
        for (var field in spec) {
            if (!spec.hasOwnProperty(field))
                continue;
            if (spec[field].isKey) {
                ret.push(field);
            }
        }
        return ret;
    };

    _em.dm.createInitialObjectForClass = function (dm, cls) {
        // create a new object major in this method and considered as the result object
        var obj = {};
        // initialize the obj for each spec field in the class spec with a default value
        for (var field in dm.entities[cls]) {
            var specField = dm.entities[cls][field];
            // any arity is considered as arrayed value to simplify things
            if (specField.arity.type) {
                obj[field] = [];
            } else {
                switch (specField.type) {
                    case "string":
                        obj[field] = "";
                        break;
                    case "number":
                        obj[field] = 0;
                        break;
                    case "boolean":
                        obj[field] = false;
                        break;
                    case "object":
                        obj[field] = {};
                        break;
                    default:
                        if (dm.entities[specField.type] === undefined)
                            throw _em.exception("dm:create", "class(" + specField.type + ") is not defined. can not create object yet.");
                        obj[field] = undefined;
                        break;
                }
            }
        }
        return obj;
    };

    _em.dm.getArityValue = function (value) {
        if (Object.prototype.toString.call(value) === Object.prototype.toString.call([]))
            return value;
        return [ value ];
    };

    _em.dm.getPrimaryKeyNameForClass = function (dm, cls) {
        var result = dm.entityPrimaryKeyFields[cls];
        if (result === undefined) {
            for (var field in dm.entities[cls]) {
                if (!dm.entities[cls].hasOwnProperty(field))
                    continue;
                var specField = dm.entities[cls][field];
                if (specField.isKey) {
                    result = field;
                    break;
                }
            }
            dm.entityPrimaryKeyFields[cls] = result;
        }
        return result;
    };

    _em.dm.getPrimaryKeyValueFromObject = function (dm, cls, obj) {
        return obj[_em.dm.getPrimaryKeyNameForClass(dm, cls)];
    };

    _em.dm.createStubObject = function (dm, cls, primaryKeyValue) {
        var primaryKeyField = _em.dm.getPrimaryKeyNameForClass(dm, cls);
        var obj = _em.dm.createInitialObjectForClass(dm, cls);
        obj[primaryKeyField] = primaryKeyValue;
        dm.entityObjs[cls].idx[primaryKeyValue] = obj;
        dm.entityObjs[cls].objs.push(obj);
        this.flagObjectAsStub(dm, cls, obj);
        return obj;
    };

    _em.dm.setFlags = function (dm, cls, primaryKeyValue, flags) {
        if (dm.flags[cls].idx[primaryKeyValue] === undefined)
            dm.flags[cls].idx[primaryKeyValue] = { isStub : false, isDeleted : false, isTransient : false, isDirty : false };
        var knownFlags = ["isStub", "isDeleted", "isTransient", "isDirty"];
        for (var idx in knownFlags) {
            if (!knownFlags.hasOwnProperty(idx))
                continue;
            var flag = knownFlags[idx];
            if (flags[flag] !== undefined && typeof flags[flag] === "boolean") {
                dm.flags[cls].idx[primaryKeyValue][flag] = flags[flag];
            }
        }
    };

    _em.dm.flagObjectAsStub = function (dm, cls, obj) {
        this.setFlags(dm, cls, this.getPrimaryKeyValueFromObject(dm, cls, obj), { isStub : true });
    };

    _em.dm.unflagObjectAsStub = function (dm, cls, obj) {
        this.setFlags(dm, cls, this.getPrimaryKeyValueFromObject(dm, cls, obj), { isStub : false });
    };

    _em.dm.flagObjectAsDeleted = function (dm, cls, obj) {
        this.setFlags(dm, cls, this.getPrimaryKeyValueFromObject(dm, cls, obj), { isDeleted : true });
    };

    _em.dm.unflagObjectAsDeleted = function (dm, cls, obj) {
        this.setFlags(dm, cls, this.getPrimaryKeyValueFromObject(dm, cls, obj), { isDeleted : false });
    };

    _em.dm.flagObjectAsTransient = function (dm, cls, obj) {
        this.setFlags(dm, cls, this.getPrimaryKeyValueFromObject(dm, cls, obj), { isTransient : true });
    };

    _em.dm.unflagObjectAsTransient = function (dm, cls, obj) {
        this.setFlags(dm, cls, this.getPrimaryKeyValueFromObject(dm, cls, obj), { isTransient : false });
    };

    _em.dm.flagObjectAsDirty = function (dm, cls, obj) {
        this.setFlags(dm, cls, this.getPrimaryKeyValueFromObject(dm, cls, obj), { isDirty : true });
    };

    _em.dm.unflagObjectAsDirty = function (dm, cls, obj) {
        this.setFlags(dm, cls, this.getPrimaryKeyValueFromObject(dm, cls, obj), { isDirty : false });
    };

    _em.dm.sanityCheckArgumentsLength = function (method, minArgs, maxArgs, args) {
        if (args.length < minArgs)
            throw _em.exception(method, "missing arguments");
        else if (args.length > maxArgs)
            throw _em.exception(method, "too many arguments");
    };

    _em.dm.sanityCheckClassArgument = function (method, dm, cls, failOnExistance) {
        if (typeof cls !== "string")
            throw _em.exception(method, "invalid entity class argument");
        if (failOnExistance && dm.entities[cls] !== undefined)
            throw _em.exception(method, "class(" + cls + ") is already defined");
        if (!failOnExistance && dm.entities[cls] === undefined)
            throw _em.exception(method, "class(" + cls + ") is not defined");
    };

    _em.dm.sanityCheckFieldType = function (methodId, cls, field, fieldType, fieldValue) {
        if (typeof fieldValue != fieldType)
            throw _em.exception(methodId, "class(" + cls + ") has field(" + field + ") defined as '" + fieldType + "'. " +
                "one given object data at field(" + field + ") is of type '" + typeof fieldValue + "'");
    };

    /*  data model API  */
    _em.dm_api = function () {
        this.entities = {};
        this.entityPrimaryKeyFields = {};
        this.entityObjs = {};
        this.flags = {};
        this._dm = _em._dm;
    };
    _em.dm_api.prototype = {

        /*  define an entity class  */
        define : function (cls) {
            var methodId = "dm:define";
            _em.dm.sanityCheckArgumentsLength(methodId, 2, 3, arguments);
            _em.dm.sanityCheckClassArgument(methodId, this, cls, true);
            var spec;
            var parentClsArr;
            if (arguments.length === 3) {
                parentClsArr = arguments[1];
                spec = arguments[2];
                if (typeof parentClsArr === "string")
                    parentClsArr = [ parentClsArr ];
                if (Object.prototype.toString.call(parentClsArr) !== Object.prototype.toString.call([]))
                    throw _em.exception(methodId, "invalid extend class argument - must be string or array");
                for (var i = parentClsArr.length - 1; i >= 0; i--) {
                    var tmpParentCls = parentClsArr[i];
                    if (this.entities[tmpParentCls] === undefined) {
                        throw _em.exception(methodId, "parent class(" + tmpParentCls + ") is not defined");
                    }
                    for (var key in this.entities[tmpParentCls]) {
                        if (!this.entities[tmpParentCls].hasOwnProperty(key))
                            continue;
                        var value = this.entities[tmpParentCls][key];
                        if (spec[key] === undefined) {
                            spec[key] = value;
                        }
                    }
                }
            } else if (arguments.length === 2) {
                if (Object.prototype.toString.call(arguments[1]) !== Object.prototype.toString.call({}))
                    throw _em.exception(methodId, "invalid class spec argument - must be an object");
                spec = arguments[1]
            }

            var keyCount = 0;
            for (var field in spec) {
                if (!spec.hasOwnProperty(field))
                    continue;
                if (typeof spec[field] === "string") {
                    var type = spec[field];
                    var isKey = false;
                    var arity = {type : undefined, min : 1, max : 1};
                    var m;
                    if ((m = type.match(/^(@)?(.+?)([?+*])?$/)) !== null) {
                        type = m[2];
                        isKey = m[1] !== undefined;
                        switch (m[3]) {
                            case "?":
                                arity.type = "?";
                                arity.min = 0;
                                break;
                            case "+":
                                arity.type = "+";
                                arity.max = undefined;
                                break;
                            case "*":
                                arity.type = "*";
                                arity.min = 0;
                                arity.max = undefined;
                                break;
                        }
                    }
                    spec[field] = { type : type, isKey : isKey, arity : arity };
                    if (isKey) keyCount++
                } else {
                    // count primary keys of spec fields of parent classes
                    if (spec[field].isKey) keyCount++;
                }
            }
            if (keyCount !== 1)
                throw _em.exception(methodId, "invalid class(" + cls + ") spec - class must contain exactly one field marked as primary field (@) but has " + keyCount);

            this.entities[cls] = spec;
            this.entityObjs[cls] = { idx : {}, objs : []};
            this.flags[cls] = { idx : {} };
        },

        /*  undefine an entity class  */
        undefine : function (cls) {
            var methodId = "dm:undefine";
            _em.dm.sanityCheckArgumentsLength(methodId, 1, 1, arguments);
            _em.dm.sanityCheckClassArgument(methodId, this, cls, false);
            delete this.entities[cls];
            delete this.entityPrimaryKeyFields[cls];
            delete this.entityObjs[cls];
            delete this.flags[cls];
        },

        /*  create an entity object (based on a defined entity class)  */
        create : function (cls, payload) {
            var methodId = "dm:create";
            _em.dm.sanityCheckArgumentsLength(methodId, 2, 2, arguments);
            _em.dm.sanityCheckClassArgument(methodId, this, cls, false);
            // search for the possible stub object for the given primaryKeyValue
            var primaryKeyValue = payload[_em.dm.getPrimaryKeyNameForClass(this, cls)];
            var obj;
            var objIsTransient = false;
            if (primaryKeyValue !== undefined) {
                obj = this.findById(cls, primaryKeyValue);
                // Error when object exists and is not flagged as stub object
                if (!this.isStub(cls, payload) && obj !== undefined) {
                    throw _em.exception(methodId, "Object of class(" + cls + ") with id(" + primaryKeyValue + ") already exists");
                }
            } else {
                // if no primary key value is provided we assume the object is transient and gets an id from backend servers
                objIsTransient = true;
            }
            // create a new object major in this method and considered as the result object
            // all defined class fields are initialized with default values
            if (obj === undefined)
                obj = _em.dm.createInitialObjectForClass(this, cls);

            var fieldCount = 0;
            var relPrimaryKeyValue;
            var relObj;
            // all payload values are checked for validity and written into the result object
            // object relations are checked and resolved if possible
            for (var field in payload) {
                if (!payload.hasOwnProperty(field) || field === "constructor" || field === "prototype")
                    continue;
                var payloadValue = payload[field];
                var specField = this.entities[cls][field];
                fieldCount++;
                // sanity check
                if (specField === undefined)
                    throw _em.exception(methodId, "class(" + cls + ") has no field(" + field + ") defined. Object is not valid.");

                // arity fields are handled
                if (specField.arity.type !== undefined) {
                    payloadValue = _em.dm.getArityValue(payloadValue);
                    // sanity check for arity sizes
                    if (specField.arity.min !== undefined && specField.arity.min > payloadValue.length)
                        throw _em.exception(methodId, "missing relational objects - field(" + field + ") has arity '" +
                            specField.arity.type + "' but only " + payloadValue.length + " object are provided");
                    if (specField.arity.max !== undefined && specField.arity.max < payloadValue.length)
                        throw _em.exception(methodId, "too many relational objects - field(" + field + ") has arity '" +
                            specField.arity.type + "' but " + payloadValue.length + " object are provided");
                    var resolvedPayloadValue = [];
                    for (var idx in payloadValue) {
                        if (!payloadValue.hasOwnProperty(idx))
                            continue;
                        var singleValue = payloadValue[idx];
                        switch (specField.type) {
                            case "string":
                            case "number":
                            case "boolean":
                                _em.dm.sanityCheckFieldType(methodId, cls, field, specField.type, singleValue);
                                resolvedPayloadValue.push(singleValue);
                                break;
                            default:
                                // in case payload value is an object .. try to find the corresponding relational object inside the EM
                                // if it can't be found -- throw an exception
                                if (Object.prototype.toString.call(singleValue) === Object.prototype.toString.call({})) {
                                    relPrimaryKeyValue = singleValue[_em.dm.getPrimaryKeyNameForClass(this, specField.type)];
                                } else {
                                    relPrimaryKeyValue = singleValue;
                                }
                                relObj = this.findById(specField.type, relPrimaryKeyValue);
                                if (relObj === undefined) {
                                    if (relPrimaryKeyValue !== "" && relPrimaryKeyValue !== undefined)
                                        relObj = _em.dm.createStubObject(this, specField.type, relPrimaryKeyValue);
                                    else {
                                        relObj = singleValue;
                                    }
                                }
                                resolvedPayloadValue.push(relObj);
                                break;
                        }
                    }
                    obj[field] = resolvedPayloadValue;
                } else {
                    switch (specField.type) {
                        case "string":
                        case "number":
                        case "boolean":
                            _em.dm.sanityCheckFieldType(methodId, cls, field, specField.type, payloadValue);
                            obj[field] = payloadValue;
                            break;
                        default:
                            // in case payload value is an object .. try to find the corresponding relational object inside the EM
                            // if it can't be found -- throw an exception
                            if (Object.prototype.toString.call(payloadValue) === Object.prototype.toString.call({})) {
                                relPrimaryKeyValue = payloadValue[_em.dm.getPrimaryKeyNameForClass(this, specField.type)];
                            } else {
                                relPrimaryKeyValue = payloadValue;
                            }
                            relObj = this.findById(specField.type, relPrimaryKeyValue);
                            if (relObj === undefined)
                                relObj = _em.dm.createStubObject(this, specField.type, relPrimaryKeyValue);

                            obj[field] = relObj;
                            break;
                    }
                }
            }

            if (fieldCount === 0)
                throw _em.exception(methodId, "Parameter payload for object creation of class(" + cls + ") has no fields. Object creation failed.");

            if (objIsTransient) {
                // can only add object to our array, since it has no primaryKey value
                // also flags cant be created due to missing primaryKey value
                this.entityObjs[cls].objs.push(obj);
            } else {
                primaryKeyValue = this.primaryKeyValue(cls, obj);
                if (this.isStub(cls, obj)) {
                    // unStub object if it was stub created somewhen before
                    this.isStub(cls, obj, false);
                } else {
                    // otherwise push the object into the collections and initially set its flags
                    this.entityObjs[cls].idx[primaryKeyValue] = obj;
                    this.entityObjs[cls].objs.push(obj);
                    _em.dm.setFlags(this, cls, primaryKeyValue, {});
                }
            }
            return obj;
        },

        /*  destroy an entity object  */
        destroy : function (cls, obj, force) {
            var methodId = "dm:destroy";
            _em.dm.sanityCheckArgumentsLength(methodId, 2, 3, arguments);
            _em.dm.sanityCheckClassArgument(methodId, this, cls, false);
            if (Object.prototype.toString.call(obj) !== Object.prototype.toString.call({}))
                throw _em.exception(methodId, "Object must be of type " + Object.prototype.toString.call({}) +
                    " but is " + Object.prototype.toString.call(obj));

            var i = this.entityObjs[cls].objs.length;
            for (i--; i >= 0; i--) {
                if (this.entityObjs[cls].objs[i] === obj) {
                    break;
                }
            }
            if (i > -1) {
                var primaryKeyValue = _em.dm.getPrimaryKeyValueFromObject(this, cls, obj);
                var isTransient = this.isTransient(cls, obj);
                if (isTransient || force === true) {
                    this.entityObjs[cls].objs.splice(i, 1);
                    delete this.entityObjs[cls].idx[primaryKeyValue];
                    delete this.flags[cls].idx[primaryKeyValue];
                } else {
                    // real objects only get marked as deleted
                    this.isDeleted(cls, obj, true);
                }
            } else
                throw _em.exception(methodId, "object was not found in class (" + cls + ")");
        },

        destroyAll : function (cls) {
            var methodId = "dm:destroyAll";
            _em.dm.sanityCheckArgumentsLength(methodId, 1, 1, arguments);
            _em.dm.sanityCheckClassArgument(methodId, this, cls, false);
            this.entityObjs[cls] = { idx : {}, objs : []};
            this.flags[cls] = { idx : {} }
        },

        /*  determine the primary key value of an entity object */
        primaryKeyValue : function (cls, obj) {
            var methodId = "dm:primaryKeyValue";
            _em.dm.sanityCheckArgumentsLength(methodId, 2, 2, arguments);
            _em.dm.sanityCheckClassArgument(methodId, this, cls, false);
            return obj[_em.dm.getPrimaryKeyNameForClass(this, cls)]
        },

        /*  find all entity objects of an entity class  */
        findAll : function (cls) {
            var methodId = "dm:findAll";
            _em.dm.sanityCheckArgumentsLength(methodId, 1, 1, arguments);
            _em.dm.sanityCheckClassArgument(methodId, this, cls, false);
            return this.entityObjs[cls].objs.concat();
        },

        /*  find all newly created entity objects of an entity class  */
        findAllTransient : function (cls) {
            var methodId = "dm:findAllTransient";
            _em.dm.sanityCheckArgumentsLength(methodId, 1, 1, arguments);
            _em.dm.sanityCheckClassArgument(methodId, this, cls, false);
            var result = [];
            for (var key in this.flags[cls].idx){
                if (!this.flags[cls].idx.hasOwnProperty(key))
                    continue;
                var objFlags = this.flags[cls].idx[key];
                if (objFlags.isTransient)
                    result.push(this.entityObjs[cls].idx[key])
            }
            return result;
        },

        /*  find all changed entity objects of an entity class  */
        findAllDirty : function (cls) {
            var methodId = "dm:findAllDirty";
            _em.dm.sanityCheckArgumentsLength(methodId, 1, 1, arguments);
            _em.dm.sanityCheckClassArgument(methodId, this, cls, false);
            var result = [];
            for (var key in this.flags[cls].idx){
                if (!this.flags[cls].idx.hasOwnProperty(key))
                    continue;
                var objFlags = this.flags[cls].idx[key];
                if (objFlags.isDirty)
                    result.push(this.entityObjs[cls].idx[key])
            }
            return result;
        },

        /*  find all deleted entity objects of an entity class  */
        findAllDeleted : function (cls) {
            var methodId = "dm:findAllDeleted";
            _em.dm.sanityCheckArgumentsLength(methodId, 1, 1, arguments);
            _em.dm.sanityCheckClassArgument(methodId, this, cls, false);
            var result = [];
            for (var key in this.flags[cls].idx){
                if (!this.flags[cls].idx.hasOwnProperty(key))
                    continue;
                var objFlags = this.flags[cls].idx[key];
                if (objFlags.isDeleted)
                    result.push(this.entityObjs[cls].idx[key])
            }
            return result;
        },

        /*  find all stub entity objects of an entity class  */
        findAllStub : function (cls) {
            var methodId = "dm:findAllStub";
            _em.dm.sanityCheckArgumentsLength(methodId, 1, 1, arguments);
            _em.dm.sanityCheckClassArgument(methodId, this, cls, false);
            var result = [];
            for (var key in this.flags[cls].idx){
                if (!this.flags[cls].idx.hasOwnProperty(key))
                    continue;
                var objFlags = this.flags[cls].idx[key];
                if (objFlags.isStub)
                    result.push(this.entityObjs[cls].idx[key])
            }
            return result;
        },

        /*  find entity object by id of an entity class  */
        findById : function (cls, id) {
            var methodId = "dm:findById";
            _em.dm.sanityCheckArgumentsLength(methodId, 2, 2, arguments);
            _em.dm.sanityCheckClassArgument(methodId, this, cls, false);

            // primary field should only be only 1 field for now
            return this.entityObjs[cls].idx[id];
        },

        /*  find entity objects by example object of an entity class  */
        findByExample : function (cls, example) {
            var methodId = "dm:findByExample";
            _em.dm.sanityCheckArgumentsLength(methodId, 2, 2, arguments);
            _em.dm.sanityCheckClassArgument(methodId, this, cls, false);
            var result = [];
            var allClassObj = this.findAll(cls);
            for (var idx in allClassObj) {
                if (!allClassObj.hasOwnProperty(idx))
                    continue;
                var objectMatch = true;
                var singleObj = allClassObj[idx];
                for (var field in example) {
                    if (!example.hasOwnProperty(field))
                        continue;
                    var exampleFieldValue = example[field];
                    var specField = this.entities[cls][field];
                    if (specField === undefined)
                        throw _em.exception(methodId, "class(" + cls + ") has no field(" + field + ") defined. Object is not valid.");

                    if (Object.prototype.toString.call(exampleFieldValue) === Object.prototype.toString.call([])) {
                        // given parameter is an array and specField is not because no arity type exists
                        if (specField.arity.type === undefined)
                            throw _em.exception(methodId, "class(" + cls + ") has field(" + field + ") defined as '" + specField.type + "'. " +
                                "Given object data at field(" + field + ") is an array'");
                        for (var arrayIdx in exampleFieldValue) {
                            if (!exampleFieldValue.hasOwnProperty(arrayIdx))
                                continue;
                            var subValue = exampleFieldValue[arrayIdx];
                            if (singleObj[field].indexOf(subValue) === -1) {
                                objectMatch = false;
                                break;
                            }
                        }
                    } else {
                        if (specField.arity.type === undefined) {
                            if (singleObj[field] !== exampleFieldValue) {
                                objectMatch = false;
                            }
                        } else {
                            if (singleObj[field].indexOf(exampleFieldValue) === -1) {
                                objectMatch = false;
                                break;
                            }
                        }
                    }
                    if (!objectMatch)
                        break;
                }
                if (objectMatch)
                    result.push(singleObj);
            }
            return result;
        },

        /*  check (or set) whether entity object is transient (id still not known)  */
        isTransient : function (cls, obj, val) {
            var methodId = "dm:isTransient";
            _em.dm.sanityCheckArgumentsLength(methodId, 2, 3, arguments);
            _em.dm.sanityCheckClassArgument(methodId, this, cls, false);
            var primaryKeyValue = _em.dm.getPrimaryKeyValueFromObject(this, cls, obj);
            if (primaryKeyValue === "" || primaryKeyValue === undefined) {
                var possibleObj = this.findByExample(cls, obj);
                if (possibleObj.length === 0)
                    throw _em.exception(methodId, "Can not find an object that matches the given obj. Try using findByExample yourself before calling isTransient.");
                else if (possibleObj.length > 1)
                    throw _em.exception(methodId, "Object is ambiguous, found " + possibleObj.length + " matches. Try using findByExample yourself before calling isTransient.");
                else {
                    primaryKeyValue = _em.dm.getPrimaryKeyValueFromObject(this, cls, possibleObj[0]);
                    if (primaryKeyValue === "" || primaryKeyValue === undefined)
                        return true;
                }
            }
            if (arguments.length === 3) {
                if (typeof val !== "boolean")
                    throw _em.exception(methodId, "Object value must be of type boolean but is " + typeof val + ".");
                _em.dm.setFlags(this, cls, primaryKeyValue, { isTransient : val });
            }
            var flags = this.flags[cls].idx[primaryKeyValue];
            if (flags === undefined)
                return false;
            else
                return flags.isTransient;
        },

        /*  check (or set) whether entity object is dirty (fields modified since last save)  */
        isDirty : function (cls, obj, val) {
            var methodId = "dm:isDirty";
            _em.dm.sanityCheckArgumentsLength(methodId, 2, 3, arguments);
            _em.dm.sanityCheckClassArgument(methodId, this, cls, false);
            var primaryKeyValue = _em.dm.getPrimaryKeyValueFromObject(this, cls, obj);
            if (primaryKeyValue === "" || primaryKeyValue === undefined) {
                var possibleObj = this.findByExample(cls, obj);
                if (possibleObj.length === 0)
                    throw _em.exception(methodId, "Can not find an object that matches the given obj. Try using findByExample yourself before calling isDirty.");
                else if (possibleObj.length > 1)
                    throw _em.exception(methodId, "Object is ambiguous, found " + possibleObj.length + " matches. Try using findByExample yourself before calling isDirty.");
                else {
                    primaryKeyValue = _em.dm.getPrimaryKeyValueFromObject(this, cls, possibleObj[0]);
                    if (primaryKeyValue === "" || primaryKeyValue === undefined)
                        return true;
                }
            }
            if (arguments.length === 3) {
                if (typeof val !== "boolean")
                    throw _em.exception(methodId, "Object value must be of type boolean but is " + typeof val + ".");
                _em.dm.setFlags(this, cls, primaryKeyValue, { isDirty : val });
            }
            var flags = this.flags[cls].idx[primaryKeyValue];
            if (flags === undefined)
                return false;
            else
                return flags.isDirty;
        },

        /*  check (or set) whether entity object is deleted  */
        isDeleted : function (cls, obj, val) {
            var methodId = "dm:isDeleted";
            _em.dm.sanityCheckArgumentsLength(methodId, 2, 3, arguments);
            _em.dm.sanityCheckClassArgument(methodId, this, cls, false);
            var primaryKeyValue = _em.dm.getPrimaryKeyValueFromObject(this, cls, obj);
            if (primaryKeyValue === "" || primaryKeyValue === undefined) {
                var possibleObj = this.findByExample(cls, obj);
                if (possibleObj.length === 0)
                    throw _em.exception(methodId, "Can not find an object that matches the given obj. Try using findByExample yourself before calling isDeleted.");
                else if (possibleObj.length > 1)
                    throw _em.exception(methodId, "Object is ambiguous, found " + possibleObj.length + " matches. Try using findByExample yourself before calling isDeleted.");
                else {
                    primaryKeyValue = _em.dm.getPrimaryKeyValueFromObject(this, cls, possibleObj[0]);
                    if (primaryKeyValue === "" || primaryKeyValue === undefined)
                        return true;
                }
            }
            if (arguments.length === 3) {
                if (typeof val !== "boolean")
                    throw _em.exception(methodId, "Object value must be of type boolean but is " + typeof val + ".");
                _em.dm.setFlags(this, cls, primaryKeyValue, { isDeleted : val });
            }
            var flags = this.flags[cls].idx[primaryKeyValue];
            if (flags === undefined)
                return false;
            else
                return flags.isDeleted;

        },

        /*  check (or set) whether entity object is a stub object  */
        isStub : function (cls, obj, val) {
            var methodId = "dm:isStub";
            _em.dm.sanityCheckArgumentsLength(methodId, 2, 3, arguments);
            _em.dm.sanityCheckClassArgument(methodId, this, cls, false);
            var primaryKeyValue = _em.dm.getPrimaryKeyValueFromObject(this, cls, obj);
            if (primaryKeyValue === "" || primaryKeyValue === undefined) {
                var possibleObj = this.findByExample(cls, obj);
                if (possibleObj.length === 0)
                    throw _em.exception(methodId, "Can not find an object that matches the given obj. Try using findByExample yourself before calling isStub.");
                else if (possibleObj.length > 1)
                    throw _em.exception(methodId, "Object is ambiguous, found " + possibleObj.length + " matches. Try using findByExample yourself before calling isStub.");
                else {
                    primaryKeyValue = _em.dm.getPrimaryKeyValueFromObject(this, cls, possibleObj[0]);
                    if (primaryKeyValue === "" || primaryKeyValue === undefined)
                        return true;
                }
            }
            if (arguments.length === 3) {
                if (typeof val !== "boolean")
                    throw _em.exception(methodId, "Object value must be of type boolean but is " + typeof val + ".");
                _em.dm.setFlags(this, cls, primaryKeyValue, { isStub : val });
            }
            var flags = this.flags[cls].idx[primaryKeyValue];
            if (flags === undefined)
                return false;
            else
                return flags.isStub;
        },

        /*  import example object into an entity object  */
        import : function (cls, obj, example) {
            var methodId = "dm:import";
            _em.dm.sanityCheckArgumentsLength(methodId, 3, 3, arguments);
            _em.dm.sanityCheckClassArgument(methodId, this, cls, false);
            var objPrimaryKeyValue = _em.dm.getPrimaryKeyValueFromObject(this, cls, obj);
            if (objPrimaryKeyValue === undefined)
                throw _em.exception(methodId, "Can not find an object that matches the given obj. Try using findByExample yourself before calling import.");
            var possibleObj = this.findById(cls, objPrimaryKeyValue);
            if (possibleObj === undefined)
                throw _em.exception(methodId, "Can not find an object that matches the given obj. Try using findByExample yourself before calling import.");
            if (this.isStub(cls, possibleObj))
                throw _em.exception(methodId, "Given obj is a stub object. Try creating the obj first before you import value in it.");
            var examplePrimaryKeyValue = _em.dm.getPrimaryKeyValueFromObject(this, cls, example);
            var primaryKeyField = _em.dm.getPrimaryKeyNameForClass(this, cls);
            if (examplePrimaryKeyValue !== undefined)
                _em.dm.sanityCheckFieldType(methodId, cls, primaryKeyField, this.entities[cls][primaryKeyField].type, examplePrimaryKeyValue);
            if (examplePrimaryKeyValue === undefined || objPrimaryKeyValue === examplePrimaryKeyValue) {
                var relPrimaryKeyValue;
                var relObj;
                // all payload values are checked for validity and written into the result object
                // object relations are checked and resolved if possible
                for (var field in example) {
                    if (!example.hasOwnProperty(field) || field === "constructor" || field === "prototype")
                        continue;
                    var payloadValue = example[field];
                    var specField = this.entities[cls][field];
                    // sanity check
                    if (specField === undefined)
                        throw _em.exception(methodId, "class(" + cls + ") has no field(" + field + ") defined. Object is not valid.");

                    // arity fields are handled
                    if (specField.arity.type !== undefined) {
                        payloadValue = _em.dm.getArityValue(payloadValue);
                        // sanity check for arity sizes
                        if (specField.arity.min !== undefined && specField.arity.min > payloadValue.length)
                            throw _em.exception(methodId, "missing relational objects - field(" + field + ") has arity '" +
                                specField.arity.type + "' but only " + payloadValue.length + " object are provided");
                        if (specField.arity.max !== undefined && specField.arity.max < payloadValue.length)
                            throw _em.exception(methodId, "too many relational objects - field(" + field + ") has arity '" +
                                specField.arity.type + "' but " + payloadValue.length + " object are provided");
                        var resolvedPayloadValue = [];
                        for (var idx in payloadValue) {
                            if (!payloadValue.hasOwnProperty(idx))
                                continue;
                            var singleValue = payloadValue[idx];
                            switch (specField.type) {
                                case "string":
                                case "number":
                                case "boolean":
                                    _em.dm.sanityCheckFieldType(methodId, cls, field, specField.type, singleValue);
                                    resolvedPayloadValue.push(singleValue);
                                    break;
                                default:
                                    // in case payload value is an object .. try to find the corresponding relational object inside the EM
                                    // if it can't be found -- throw an exception
                                    if (Object.prototype.toString.call(singleValue) === Object.prototype.toString.call({})) {
                                        relPrimaryKeyValue = singleValue[_em.dm.getPrimaryKeyNameForClass(this, specField.type)];
                                    } else {
                                        relPrimaryKeyValue = singleValue;
                                    }
                                    relObj = this.findById(specField.type, relPrimaryKeyValue);
                                    if (relObj === undefined) {
                                        if (relPrimaryKeyValue !== "" && relPrimaryKeyValue !== undefined)
                                            relObj = _em.dm.createStubObject(this, specField.type, relPrimaryKeyValue);
                                        else {
                                            relObj = singleValue;
                                        }
                                    }
                                    resolvedPayloadValue.push(relObj);
                                    break;
                            }
                        }
                        possibleObj[field] = resolvedPayloadValue;
                    } else {
                        switch (specField.type) {
                            case "string":
                            case "number":
                            case "boolean":
                                _em.dm.sanityCheckFieldType(methodId, cls, field, specField.type, payloadValue);
                                possibleObj[field] = payloadValue;
                                break;
                            default:
                                // in case payload value is an object .. try to find the corresponding relational object inside the EM
                                // if it can't be found -- throw an exception
                                if (Object.prototype.toString.call(payloadValue) === Object.prototype.toString.call({})) {
                                    relPrimaryKeyValue = payloadValue[_em.dm.getPrimaryKeyNameForClass(this, specField.type)];
                                } else {
                                    relPrimaryKeyValue = payloadValue;
                                }
                                relObj = this.findById(specField.type, relPrimaryKeyValue);
                                if (relObj === undefined)
                                    relObj = _em.dm.createStubObject(this, specField.type, relPrimaryKeyValue);

                                possibleObj[field] = relObj;
                                break;
                        }
                    }
                }
            } else {
                throw _em.exception(methodId, "Can not import object with primaryKeyValue(" + examplePrimaryKeyValue +
                    ") into object with primaryKeyValue(" + objPrimaryKeyValue + ")");
            }
        },

        /*  dump to console all entities of all entity classes in entire data model  */
        dump : function () {
            console.log("=================\nDefined entities:\n=================");
            console.log(this.entities);
            console.log("================\nDefined objects:\n================");
            console.log(this.entityObjs);
            console.log("=============\nObject flags:\n=============");
            console.log(this.flags);
        }
    };

    /*  export external API  */
    return em;
}));


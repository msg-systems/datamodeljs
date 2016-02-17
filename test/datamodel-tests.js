/*
 **  DatamodelJS - Entity management
 **  Design and Development by msg Applied Technology Research
 **  Copyright (c) 2013 - 2016 msg systems ag (http://www.msg-systems.com/)
 */

/* global require: false */
var should = require('should');
var datamodeljs = require("../lib/datamodel.js");
// Unit Tests
/* jshint immed: false*/

// DataManager creation
var dm = datamodeljs.dm("default");
should.exist(dm);
//      _       __ _                      _               _
//   __| | ___ / _(_)_ __   ___          | |__   __ _  __| |
//  / _` |/ _ \ |_| | '_ \ / _ \  _____  | '_ \ / _` |/ _` |
// | (_| |  __/  _| | | | |  __/ |_____| | |_) | (_| | (_| |
//  \__,_|\___|_| |_|_| |_|\___|         |_.__/ \__,_|\__,_|
//
//              Wrong arguments size
(function () {dm.define() }).should.throw(/^.*?missing arguments.*?$/);
(function () {dm.define(4711) }).should.throw(/^.*?missing arguments.*?$/);
(function () {dm.define(["Person"]) }).should.throw(/^.*?missing arguments.*?$/);
(function () {dm.define({id : "Person"}) }).should.throw(/^.*?missing arguments.*?$/);
(function () {dm.define(true)}).should.throw(/^.*?missing arguments.*?$/);
(function () {dm.define(false) }).should.throw(/^.*?missing arguments.*?$/);
(function () {dm.define("Person") }).should.throw(/^.*?missing arguments.*?$/);
(function () {dm.define(function () {}) }).should.throw(/^.*?missing arguments.*?$/);
//              wrong specification argument type
(function () {dm.define("Person", 4711) }).should.throw(/^.*?invalid class spec argument - must be.*?$/);
(function () {dm.define("Person", ["Hacker"]) }).should.throw(/^.*?invalid class spec argument - must be.*?$/);
(function () {dm.define("Person", "Hacker") }).should.throw(/^.*?invalid class spec argument - must be.*?$/);
(function () {dm.define("Person", true) }).should.throw(/^.*?invalid class spec argument - must be.*?$/);
(function () {dm.define("Person", false) }).should.throw(/^.*?invalid class spec argument - must be.*?$/);
(function () {dm.define("Person", function () {}) }).should.throw(/^.*?invalid class spec argument - must be.*?$/);
//              wrong class extension type
(function () {dm.define("Person", {}, { id : "@string" }) }).should.throw(/^.*?invalid extend class argument - must be.*?$/);
(function () {dm.define("Person", true, { id : "@string" }) }).should.throw(/^.*?invalid extend class argument - must be.*?$/);
(function () {dm.define("Person", false, { id : "@string" }) }).should.throw(/^.*?invalid extend class argument - must be.*?$/);
(function () {dm.define("Person", 4711, { id : "@string" }) }).should.throw(/^.*?invalid extend class argument - must be.*?$/);
(function () {dm.define("Person", function () {}, { id : "@string" }) }).should.throw(/^.*?invalid extend class argument - must be.*?$/);
//              missing primary key
(function () {dm.define("Car", { }) }).should.throw(/^.*?class must contain exactly one field marked as primary field.*?$/);
(function () {dm.define("Car", { id : "string" }) }).should.throw(/^.*?class must contain exactly one field marked as primary field.*?$/);
//              more then one primary keys
(function () {dm.define("Car", { id : "@string", type : "@string" }) }).should.throw(/^.*?class must contain exactly one field marked as primary field.*?$/);
//              using reserved keywords
(function () {dm.define("Keyword", { id : "@string", _className : "string" }) }).should.throw(/^.*?invalid class spec - attribute '_className' is a reserved keyword.*?$/);
(function () {dm.define("Keyword", { id : "@string", _isTransient : "string" }) }).should.throw(/^.*?invalid class spec - attribute '_isTransient' is a reserved keyword.*?$/);
(function () {dm.define("Keyword", { id : "@string", _isStub : "string" }) }).should.throw(/^.*?invalid class spec - attribute '_isStub' is a reserved keyword.*?$/);
(function () {dm.define("Keyword", { id : "@string", _isDirty : "string" }) }).should.throw(/^.*?invalid class spec - attribute '_isDirty' is a reserved keyword.*?$/);
(function () {dm.define("Keyword", { id : "@string", _isDeleted : "string" }) }).should.throw(/^.*?invalid class spec - attribute '_isDeleted' is a reserved keyword.*?$/);
//      _       __ _                                            _
//   __| | ___ / _(_)_ __   ___            __ _  ___   ___   __| |
//  / _` |/ _ \ |_| | '_ \ / _ \  _____   / _` |/ _ \ / _ \ / _` |
// | (_| |  __/  _| | | | |  __/ |_____| | (_| | (_) | (_) | (_| |
//  \__,_|\___|_| |_|_| |_|\___|          \__, |\___/ \___/ \__,_|
//                                        |___/
(function () {
    dm.define("Country", {
        id : '@string',
        name : 'string'
    });

    dm.define("OrgUnit", {
        id : '@string',
        name : 'string',
        owner : 'Person*',
        parent : 'OrgUnit?',
        country : 'Country'
    });

    dm.define("Person", {
        id : '@string',
        firstName : 'string',
        middleInitial : 'string',
        lastName : 'string',
        born : 'number',
        hobbies : 'string*',
        proxies : 'Person*',
        supervisor : 'Person?',
        organizations : 'OrgUnit+'
    });


    dm.define("Hacker", [ "Person" ], {
        hackerCode : 'string'
    });

    dm.define("Nerd", "Hacker", {
    });
}).should.not.throw();
//                  _       __ _                      _               _
//  _   _ _ __   __| | ___ / _(_)_ __   ___          | |__   __ _  __| |
// | | | | '_ \ / _` |/ _ \ |_| | '_ \ / _ \  _____  | '_ \ / _` |/ _` |
// | |_| | | | | (_| |  __/  _| | | | |  __/ |_____| | |_) | (_| | (_| |
//  \__,_|_| |_|\__,_|\___|_| |_|_| |_|\___|         |_.__/ \__,_|\__,_|
//
//          Bad Case
//              Wrong arguments size
(function () {dm.undefine() }).should.throw(/^.*?missing arguments.*?$/);
(function () {dm.undefine("Person", "Hacker") }).should.throw(/^.*?too many arguments.*?$/);
//              Wrong class name
(function () {dm.undefine(4711) }).should.throw(/^.*?invalid entity class argument.*?$/);
(function () {dm.undefine(["Person"]) }).should.throw(/^.*?invalid entity class argument.*?$/);
(function () {dm.undefine({id : "Person"}) }).should.throw(/^.*?invalid entity class argument.*?$/);
(function () {dm.undefine(true)}).should.throw(/^.*?invalid entity class argument.*?$/);
(function () {dm.undefine(false) }).should.throw(/^.*?invalid entity class argument.*?$/);
(function () {dm.undefine(function () {}) }).should.throw(/^.*?invalid entity class argument.*?$/);
//              Never defined class
(function () {dm.undefine("Unknown") }).should.throw(/^.*?is not defined.*?$/);
//                  _       __ _                                            _
//  _   _ _ __   __| | ___ / _(_)_ __   ___            __ _  ___   ___   __| |
// | | | | '_ \ / _` |/ _ \ |_| | '_ \ / _ \  _____   / _` |/ _ \ / _ \ / _` |
// | |_| | | | | (_| |  __/  _| | | | |  __/ |_____| | (_| | (_) | (_) | (_| |
//  \__,_|_| |_|\__,_|\___|_| |_|_| |_|\___|          \__, |\___/ \___/ \__,_|
//                                                    |___/
//              Defined class gets undefined
(function () { dm.undefine("Nerd")}).should.not.throw();
//                      _                 _               _
//   ___ _ __ ___  __ _| |_ ___          | |__   __ _  __| |
//  / __| '__/ _ \/ _` | __/ _ \  _____  | '_ \ / _` |/ _` |
// | (__| | |  __/ (_| | ||  __/ |_____| | |_) | (_| | (_| |
//  \___|_|  \___|\__,_|\__\___|         |_.__/ \__,_|\__,_|
//
//              Wrong arguments size
(function () {dm.create()}).should.throw(/^.*?missing arguments.*?$/);
(function () {dm.create(4711)}).should.throw(/^.*?missing arguments.*?$/);
(function () {dm.create(true)}).should.throw(/^.*?missing arguments.*?$/);
(function () {dm.create(false)}).should.throw(/^.*?missing arguments.*?$/);
(function () {dm.create({id : "Country"})}).should.throw(/^.*?missing arguments.*?$/);
(function () {dm.create(["Country"])}).should.throw(/^.*?missing arguments.*?$/);
(function () {dm.create("Country")}).should.throw(/^.*?missing arguments.*?$/);
(function () {dm.create(function () {})}).should.throw(/^.*?missing arguments.*?$/);
//              Wrong class name
(function () {dm.create(4711, { id : "1", name : "Deutschland" })}).should.throw(/^.*?invalid entity class argument.*?$/);
(function () {dm.create(true, { id : "1", name : "Deutschland" })}).should.throw(/^.*?invalid entity class argument.*?$/);
(function () {dm.create(false, { id : "1", name : "Deutschland" })}).should.throw(/^.*?invalid entity class argument.*?$/);
(function () {dm.create(["DE"], { id : "1", name : "Deutschland" })}).should.throw(/^.*?invalid entity class argument.*?$/);
(function () {dm.create({id : 1}, { id : "1", name : "Deutschland" })}).should.throw(/^.*?invalid entity class argument.*?$/);
(function () {dm.create(function () {}, { id : "1", name : "Deutschland" })}).should.throw(/^.*?invalid entity class argument.*?$/);
//              Wrong Field types
(function () {dm.create("Country", { id : 49, name : "Deutschland" })}).should.throw(/^.*?defined as.*?is of type.*?$/);
(function () {dm.create("Country", { id : true, name : "Deutschland" })}).should.throw(/^.*?defined as.*?is of type.*?$/);
(function () {dm.create("Country", { id : false, name : "Deutschland" })}).should.throw(/^.*?defined as.*?is of type.*?$/);
(function () {dm.create("Country", { id : ["DE"], name : "Deutschland" })}).should.throw(/^.*?defined as.*?is of type.*?$/);
(function () {dm.create("Country", { id : {id : "DE"}, name : "Deutschland" })}).should.throw(/^.*?defined as.*?is of type.*?$/);
(function () {dm.create("Country", { id : function () {}, name : "Deutschland" })}).should.throw(/^.*?defined as.*?is of type.*?$/);
//              Never defined class
(function () {dm.create("Unknown", {}) }).should.throw(/^.*?is not defined.*?$/);
//              Missing Payload content
(function () {dm.create("Country", {}) }).should.throw(/^.*?has no fields. Object creation failed..*?$/);
(function () {dm.create("Country", {constructor : function () {}}) }).should.throw(/^.*?has no fields. Object creation failed..*?$/);
//              Double Definition - ID already defined
(function () {
    dm.create("Country", { id : "Dummy", name : "Nowhere" })
    dm.create("Country", { id : "Dummy", name : "Else but Here" })
}).should.throw(/^.*?already exists.*?$/);
//                      _                                       _
//   ___ _ __ ___  __ _| |_ ___            __ _  ___   ___   __| |
//  / __| '__/ _ \/ _` | __/ _ \  _____   / _` |/ _ \ / _ \ / _` |
// | (__| | |  __/ (_| | ||  __/ |_____| | (_| | (_) | (_) | (_| |
//  \___|_|  \___|\__,_|\__\___|          \__, |\___/ \___/ \__,_|
//                                        |___/
var germany = dm.create("Country", {
    id: "DE",
    name: "Deutschland"
});

var msg = dm.create("OrgUnit", {
    id: "msg",
    name: "msg systems ag",
    owner: "HZ",
    country: germany
});

dm.create("OrgUnit", {
    id: "msgCH",
    name: "msg Schweiz",
    owner: "HZ",
    country: "CH"
});

var xt = dm.create("OrgUnit", {
    id: "XT",
    name: "msg Applied Technology Research",
    owner: "MWS",
    parent: msg,
    country: "DE"
});

var mws = dm.create("Person", {
    id: "MWS",
    firstName: "Mark-W.",
    lastName: "Schmidt",
    born: 1971,
    organizations: [xt],
    hobbies: ["motorbike ride"]
});

var rse = dm.create("Hacker", {
    id: "RSE",
    firstName: "Ralf",
    middleInitial: "S",
    lastName: "Engelschall",
    born: 1972,
    hobbies: ["Foo", "Bar"],
    supervisor: "MWS",
    proxies: [mws, "JHO"],
    organizations: ["XT"],
    hackerCode: "what?"
});

dm.create("Person", {
    id: "JHO",
    firstName: "Jochen",
    lastName: "Hoertreiter",
    supervisor: rse,
    organizations: [xt],
    hobbies: [""]
});

var biebl = dm.create("Person", {firstName: "Biebl"});
var agile = dm.create("OrgUnit", {
    id: "CoC Agile",
    owner: [biebl]
});
agile.owner.should.have.length(1);
agile.owner[0].should.have.property("firstName", "Biebl");
(agile.country === undefined).should.be.true();

dm.create("Person", {
    id: "LTU",
    firstName: "Linda",
    lastName: "Turke",
    supervisor: "RSE",
    organizations: ["XT"]
}).should.have.ownProperty("_className");
dm.findById("Person", "LTU")._className.should.be.equal("Person");

JSON.stringify(dm.create("Person", {
    id: "LDA",
    firstName: "Lisa",
    lastName: "Daske"
})).should.match(/^((?!_className).)*$/);

//      _           _                             _               _
//   __| | ___  ___| |_ _ __ ___  _   _          | |__   __ _  __| |
//  / _` |/ _ \/ __| __| '__/ _ \| | | |  _____  | '_ \ / _` |/ _` |
// | (_| |  __/\__ \ |_| | | (_) | |_| | |_____| | |_) | (_| | (_| |
//  \__,_|\___||___/\__|_|  \___/ \__, |         |_.__/ \__,_|\__,_|
//                                |___/
//              Wrong arguments size
(function () {dm.destroy()}).should.throw(/^.*?missing arguments.*?$/);
(function () {dm.destroy(4711)}).should.throw(/^.*?missing arguments.*?$/);
(function () {dm.destroy(true)}).should.throw(/^.*?missing arguments.*?$/);
(function () {dm.destroy(false)}).should.throw(/^.*?missing arguments.*?$/);
(function () {dm.destroy({id : "Country"})}).should.throw(/^.*?missing arguments.*?$/);
(function () {dm.destroy(["Country"])}).should.throw(/^.*?missing arguments.*?$/);
(function () {dm.destroy("Country")}).should.throw(/^.*?missing arguments.*?$/);
(function () {dm.destroy(function () {})}).should.throw(/^.*?missing arguments.*?$/);
(function () { dm.undefine("Country", {}, true) }).should.throw(/^.*?too many arguments.*?$/);
//              Wrong Class name
(function () {dm.destroy(4711, {})}).should.throw(/^.*?invalid entity class argument.*?$/);
(function () {dm.destroy(true, {})}).should.throw(/^.*?invalid entity class argument.*?$/);
(function () {dm.destroy(false, {})}).should.throw(/^.*?invalid entity class argument.*?$/);
(function () {dm.destroy({id : "Country"}, {})}).should.throw(/^.*?invalid entity class argument.*?$/);
(function () {dm.destroy(["Country"], {})}).should.throw(/^.*?invalid entity class argument.*?$/);
(function () {dm.destroy(function () {}, {})}).should.throw(/^.*?invalid entity class argument.*?$/);
//              Never defined class
(function () {dm.destroy("Unknown", {}) }).should.throw(/^.*?is not defined.*?$/);
//              Double deletion
(function () {
    var dummy = dm.findById("Country", "Dummy");
    dm.isTransient("Country", dummy, true);
    dm.destroy("Country", dummy);
    dm.destroy("Country", dummy);
}).should.throw(/^.*?object was not found in class.*?$/);
//              Wrong object deletion
(function () {
    dm.destroy("Country", {id : "DE"})
}).should.throw(/^.*?object was not found in class.*?$/);
//              Wrong object parameter
(function () {
    dm.destroy("Country", [
        {id : "DE"}
    ])
}).should.throw(/^.*?Object must be of type.*?$/);
//      _           _                                                   _
//   __| | ___  ___| |_ _ __ ___  _   _            __ _  ___   ___   __| |
//  / _` |/ _ \/ __| __| '__/ _ \| | | |  _____   / _` |/ _ \ / _ \ / _` |
// | (_| |  __/\__ \ |_| | | (_) | |_| | |_____| | (_| | (_) | (_) | (_| |
//  \__,_|\___||___/\__|_|  \___/ \__, |          \__, |\___/ \___/ \__,_|
//                                |___/           |___/
//
//              Deletion of a non stub, non transient object
(function () {
    var china = dm.create("Country", { id : "China", name : "China"});
    dm.destroy("Country", china);
    china = dm.findById("Country", "China")
    should.exist(china);
    dm.isDeleted("Country", china).should.be.true();
}).should.not.throw();
//              Deletion of a non stub, non transient object with force
(function () {
    var japan = dm.create("Country", { id : "Japan", name : "Japan"});
    dm.destroy("Country", japan, true);
    japan = dm.findById("Country", "Japan")
    should.not.exist(japan);
}).should.not.throw();
//              Deletion of an object already marked as deleted
(function () {
    // china is created an example earlier
    var china = dm.findById("Country", "China")
    should.exist(china);
    dm.destroy("Country", china);
    dm.destroy("Country", china);
    dm.destroy("Country", china);
    dm.isDeleted("Country", china).should.be.true();
}).should.not.throw();
//              Deletion of a transient object
var nameOfBuxdehude = "msg Buxdehude";
// OrgUnit without a primary id is marked as transient
var buxdehude = dm.create("OrgUnit", {
    name: nameOfBuxdehude,
    owner: "HZ",
    country: "AT"
});
dm.isTransient("OrgUnit", buxdehude).should.be.true();
buxdehude._isTransient.should.be.true();
dm.destroy("OrgUnit", buxdehude);
var allOrgUnits = dm.findAll("OrgUnit");
for (var idx in allOrgUnits) {
    allOrgUnits[idx].name.should.not.equal(nameOfBuxdehude);
}
//   __ _           _   _   _ _           _               _
//  / _(_)_ __   __| | /_\ | | |         | |__   __ _  __| |
// | |_| | '_ \ / _` |//_\\| | |  _____  | '_ \ / _` |/ _` |
// |  _| | | | | (_| /  _  \ | | |_____| | |_) | (_| | (_| |
// |_| |_|_| |_|\__,_\_/ \_/_|_|         |_.__/ \__,_|\__,_|
//
//              Wrong arguments size
(function () {dm.findAll()}).should.throw(/^.*?missing arguments.*?$/);
(function () {dm.findAll("Country", {}, true) }).should.throw(/^.*?too many arguments.*?$/);
//              Wrong Class name
(function () {dm.findAll(4711)}).should.throw(/^.*?invalid entity class argument.*?$/);
(function () {dm.findAll(true)}).should.throw(/^.*?invalid entity class argument.*?$/);
(function () {dm.findAll(false)}).should.throw(/^.*?invalid entity class argument.*?$/);
(function () {dm.findAll({id : "Country"})}).should.throw(/^.*?invalid entity class argument.*?$/);
(function () {dm.findAll(["Country"])}).should.throw(/^.*?invalid entity class argument.*?$/);
(function () {dm.findAll(function () {})}).should.throw(/^.*?invalid entity class argument.*?$/);
//              Never defined class
(function () {dm.findAll("Unknown") }).should.throw(/^.*?is not defined.*?$/);
//   __ _           _   _   _ _                                 _
//  / _(_)_ __   __| | /_\ | | |           __ _  ___   ___   __| |
// | |_| | '_ \ / _` |//_\\| | |  _____   / _` |/ _ \ / _ \ / _` |
// |  _| | | | | (_| /  _  \ | | |_____| | (_| | (_) | (_) | (_| |
// |_| |_|_| |_|\__,_\_/ \_/_|_|          \__, |\___/ \___/ \__,_|
//                                        |___/
(function () {
    dm.define("Jokes", { id : "@string", text : "string"});
    dm.create("Jokes", {id : "1", text : "first joke"});
    dm.findAll("Jokes").should.have.length(1);
    dm.create("Jokes", {id : "2", text : "second joke"});
    var jokeThree = dm.create("Jokes", {id : "3", text : "third joke"});
    dm.findAll("Jokes").should.have.length(3);
    dm.destroy("Jokes", jokeThree);
    dm.findAll("Jokes").should.have.length(3); // jokeThree is only flagged as deleted but still exists
    var jokeFour = dm.create("Jokes", {text : "fourth joke"});
    dm.destroy("Jokes", jokeFour);             // transient object deletion
    dm.findAll("Jokes").should.have.length(3);
}).should.not.throw();
//   __ _           _   ___        _____    _           _               _
//  / _(_)_ __   __| | / __\_   _  \_   \__| |         | |__   __ _  __| |
// | |_| | '_ \ / _` |/__\// | | |  / /\/ _` |  _____  | '_ \ / _` |/ _` |
// |  _| | | | | (_| / \/  \ |_| /\/ /_| (_| | |_____| | |_) | (_| | (_| |
// |_| |_|_| |_|\__,_\_____/\__, \____/ \__,_|         |_.__/ \__,_|\__,_|
//                          |___/
//              Wrong arguments size
(function () {dm.findById()}).should.throw(/^.*?missing arguments.*?$/);
(function () {dm.findById(4711)}).should.throw(/^.*?missing arguments.*?$/);
(function () {dm.findById(true)}).should.throw(/^.*?missing arguments.*?$/);
(function () {dm.findById(false)}).should.throw(/^.*?missing arguments.*?$/);
(function () {dm.findById({id : "Country"})}).should.throw(/^.*?missing arguments.*?$/);
(function () {dm.findById(["Country"])}).should.throw(/^.*?missing arguments.*?$/);
(function () {dm.findById(function () {})}).should.throw(/^.*?missing arguments.*?$/);
(function () {dm.findById("Country", {}, true) }).should.throw(/^.*?too many arguments.*?$/);
//              Wrong Class name
(function () {dm.findById(4711, {})}).should.throw(/^.*?invalid entity class argument.*?$/);
(function () {dm.findById(true, {})}).should.throw(/^.*?invalid entity class argument.*?$/);
(function () {dm.findById(false, {})}).should.throw(/^.*?invalid entity class argument.*?$/);
(function () {dm.findById({id : "Country"}, {})}).should.throw(/^.*?invalid entity class argument.*?$/);
(function () {dm.findById(["Country"], {})}).should.throw(/^.*?invalid entity class argument.*?$/);
(function () {dm.findById(function () {}, {})}).should.throw(/^.*?invalid entity class argument.*?$/);
//              Never defined class
(function () {dm.findById("Unknown", {}) }).should.throw(/^.*?is not defined.*?$/);
//   __ _           _   ___        _____    _                                 _
//  / _(_)_ __   __| | / __\_   _  \_   \__| |           __ _  ___   ___   __| |
// | |_| | '_ \ / _` |/__\// | | |  / /\/ _` |  _____   / _` |/ _ \ / _ \ / _` |
// |  _| | | | | (_| / \/  \ |_| /\/ /_| (_| | |_____| | (_| | (_) | (_) | (_| |
// |_| |_|_| |_|\__,_\_____/\__, \____/ \__,_|          \__, |\___/ \___/ \__,_|
//                          |___/                       |___/
(function () {
    should.exist(dm.findById("Country", "DE"));
    should.exist(dm.findById("Country", "CH"));
    should.exist(dm.findById("Person", "HZ"));
    should.exist(dm.findById("Person", "JHO"));
    should.exist(dm.findById("Person", "MWS"));
    should.exist(dm.findById("Person", "RSE"));
    should.exist(dm.findById("Hacker", "RSE"));
    should.exist(dm.findById("OrgUnit", "msg"));
    should.exist(dm.findById("OrgUnit", "msgCH"));
    should.exist(dm.findById("OrgUnit", "XT"));
    should.not.exist(dm.findById("OrgUnit", "Magische Trinkhalme"));
}).should.not.throw();
//   __ _           _   ___         __                           _                _               _
//  / _(_)_ __   __| | / __\_   _  /__\_  ____ _ _ __ ___  _ __ | | ___          | |__   __ _  __| |
// | |_| | '_ \ / _` |/__\// | | |/_\ \ \/ / _` | '_ ` _ \| '_ \| |/ _ \  _____  | '_ \ / _` |/ _` |
// |  _| | | | | (_| / \/  \ |_| //__  >  < (_| | | | | | | |_) | |  __/ |_____| | |_) | (_| | (_| |
// |_| |_|_| |_|\__,_\_____/\__, \__/ /_/\_\__,_|_| |_| |_| .__/|_|\___|         |_.__/ \__,_|\__,_|
//                          |___/                         |_|
//              Wrong arguments size
(function () {dm.findByExample()}).should.throw(/^.*?missing arguments.*?$/);
(function () {dm.findByExample(4711)}).should.throw(/^.*?missing arguments.*?$/);
(function () {dm.findByExample(true)}).should.throw(/^.*?missing arguments.*?$/);
(function () {dm.findByExample(false)}).should.throw(/^.*?missing arguments.*?$/);
(function () {dm.findByExample({id : "Country"})}).should.throw(/^.*?missing arguments.*?$/);
(function () {dm.findByExample(["Country"])}).should.throw(/^.*?missing arguments.*?$/);
(function () {dm.findByExample(function () {})}).should.throw(/^.*?missing arguments.*?$/);
(function () {dm.findByExample("Country", {}, true) }).should.throw(/^.*?too many arguments.*?$/);
//              Wrong Class name
(function () {dm.findByExample(4711, {})}).should.throw(/^.*?invalid entity class argument.*?$/);
(function () {dm.findByExample(true, {})}).should.throw(/^.*?invalid entity class argument.*?$/);
(function () {dm.findByExample(false, {})}).should.throw(/^.*?invalid entity class argument.*?$/);
(function () {dm.findByExample({id : "Country"}, {})}).should.throw(/^.*?invalid entity class argument.*?$/);
(function () {dm.findByExample(["Country"], {})}).should.throw(/^.*?invalid entity class argument.*?$/);
(function () {dm.findByExample(function () {}, {})}).should.throw(/^.*?invalid entity class argument.*?$/);
//              Never defined class
(function () {dm.findByExample("Unknown", {}) }).should.throw(/^.*?is not defined.*?$/);
//              Invalid example object parameter name
(function () {dm.findByExample("Country", {unknownField : "DE"}) }).should.throw(/^.*?has no field.*?$/);
//              Invalid example object parameter type
(function () {dm.findByExample("OrgUnit", {name : ["XT"] }) }).should.throw(/^.*?Given object data at field.*?$/);
//   __ _           _   ___         __                           _                                      _
//  / _(_)_ __   __| | / __\_   _  /__\_  ____ _ _ __ ___  _ __ | | ___            __ _  ___   ___   __| |
// | |_| | '_ \ / _` |/__\// | | |/_\ \ \/ / _` | '_ ` _ \| '_ \| |/ _ \  _____   / _` |/ _ \ / _ \ / _` |
// |  _| | | | | (_| / \/  \ |_| //__  >  < (_| | | | | | | |_) | |  __/ |_____| | (_| | (_) | (_) | (_| |
// |_| |_|_| |_|\__,_\_____/\__, \__/ /_/\_\__,_|_| |_| |_| .__/|_|\___|          \__, |\___/ \___/ \__,_|
//                          |___/                         |_|                     |___/
dm.findByExample("Country", {name: "Deutschland"}).should.not.have.length(0);
dm.findByExample("Country", {name: ""}).should.not.have.length(0);
dm.findByExample("Person", {firstName: ""}).should.not.have.length(0);
dm.findByExample("Person", {hobbies: []}).should.not.have.length(0);
dm.findByExample("Person", {hobbies: [""]}).should.not.have.length(0);
dm.findByExample("Person", {hobbies: ["skate"]}).should.have.length(0);
dm.findByExample("Person", {hobbies: ["motorbike ride"]}).should.not.have.length(0);
dm.findByExample("Person", {hobbies: ["motorbike ride", "skate"]}).should.have.length(0);
dm.findByExample("Person", {organizations: dm.findById("OrgUnit", "XT")}).should.not.have.length(0);
dm.findByExample("Person", {organizations: [dm.findById("OrgUnit", "XT"), dm.findById("OrgUnit", "msg")]}).should.have.length(0);
dm.findByExample("Country", {id: ""}).should.have.length(0);
//  _     _____                     _            _             _               _
// (_)___/__   \_ __ __ _ _ __  ___(_) ___ _ __ | |_          | |__   __ _  __| |
// | / __| / /\/ '__/ _` | '_ \/ __| |/ _ \ '_ \| __|  _____  | '_ \ / _` |/ _` |
// | \__ \/ /  | | | (_| | | | \__ \ |  __/ | | | |_  |_____| | |_) | (_| | (_| |
// |_|___/\/   |_|  \__,_|_| |_|___/_|\___|_| |_|\__|         |_.__/ \__,_|\__,_|
//
//              Wrong arguments size
(function () {dm.isTransient()}).should.throw(/^.*?missing arguments.*?$/);
(function () {dm.isTransient(4711)}).should.throw(/^.*?missing arguments.*?$/);
(function () {dm.isTransient(true)}).should.throw(/^.*?missing arguments.*?$/);
(function () {dm.isTransient(false)}).should.throw(/^.*?missing arguments.*?$/);
(function () {dm.isTransient({id : "Country"})}).should.throw(/^.*?missing arguments.*?$/);
(function () {dm.isTransient(["Country"])}).should.throw(/^.*?missing arguments.*?$/);
(function () {dm.isTransient(function () {})}).should.throw(/^.*?missing arguments.*?$/);
(function () {dm.isTransient("Country", {}, true, false) }).should.throw(/^.*?too many arguments.*?$/);
//              Wrong Class name
(function () {dm.isTransient(4711, {})}).should.throw(/^.*?invalid entity class argument.*?$/);
(function () {dm.isTransient(true, {})}).should.throw(/^.*?invalid entity class argument.*?$/);
(function () {dm.isTransient(false, {})}).should.throw(/^.*?invalid entity class argument.*?$/);
(function () {dm.isTransient({id : "Country"}, {})}).should.throw(/^.*?invalid entity class argument.*?$/);
(function () {dm.isTransient(["Country"], {})}).should.throw(/^.*?invalid entity class argument.*?$/);
(function () {dm.isTransient(function () {}, {})}).should.throw(/^.*?invalid entity class argument.*?$/);
//              Never defined class
(function () {dm.isTransient("Unknown", {}) }).should.throw(/^.*?is not defined.*?$/);
//              Unknown Object
(function () {dm.isTransient("Country", { id : "" }, true); }).should.throw(/^.*?Can not find an object that matches the given obj.*?$/);
//              Ambiguous Object
(function () {dm.isTransient("Person", { hobbies : [] }, true); }).should.throw(/^.*?Object is ambiguous.*?$/);
//              Wrong argument type for setter
(function () {dm.isTransient("Country", { id : "DE" }, 1); }).should.throw(/^.*?Object value must be of type boolean.*?$/);
(function () {dm.isTransient("Country", { id : "DE" }, "true"); }).should.throw(/^.*?Object value must be of type boolean.*?$/);
(function () {dm.isTransient("Country", { id : "DE" }, ["true"]); }).should.throw(/^.*?Object value must be of type boolean.*?$/);
(function () {dm.isTransient("Country", { id : "DE" }, {val : "true"}); }).should.throw(/^.*?Object value must be of type boolean.*?$/);

//  _     _____                     _            _                                   _
// (_)___/__   \_ __ __ _ _ __  ___(_) ___ _ __ | |_            __ _  ___   ___   __| |
// | / __| / /\/ '__/ _` | '_ \/ __| |/ _ \ '_ \| __|  _____   / _` |/ _ \ / _ \ / _` |
// | \__ \/ /  | | | (_| | | | \__ \ |  __/ | | | |_  |_____| | (_| | (_) | (_) | (_| |
// |_|___/\/   |_|  \__,_|_| |_|___/_|\___|_| |_|\__|          \__, |\___/ \___/ \__,_|
//                                                             |___/
(function () {
    var misterX = dm.create("Person", {firstName : "Mister X"});
    dm.isTransient("Person", misterX).should.be.true();
    misterX._isTransient.should.be.true();
    dm.isTransient("Person", {firstName : "Mister X"}).should.be.true();
    dm.destroy("Person", misterX);
    dm.isTransient("Person", dm.findById("Person", "JHO")).should.be.false();
    dm.findById("Person", "JHO")._isTransient.should.be.false();
    dm.isTransient("Person", dm.findById("Person", "JHO"), true).should.be.true();
    dm.findById("Person", "JHO")._isTransient.should.be.true();
    dm.isTransient("Person", dm.findById("Person", "JHO")).should.be.true();
    dm.isTransient("Person", dm.findById("Person", "JHO"), false).should.be.false();
    dm.findById("Person", "JHO")._isTransient.should.be.false();
}).should.not.throw();

//  _        ___ _      _                   _               _
// (_)___   /   (_)_ __| |_ _   _          | |__   __ _  __| |
// | / __| / /\ / | '__| __| | | |  _____  | '_ \ / _` |/ _` |
// | \__ \/ /_//| | |  | |_| |_| | |_____| | |_) | (_| | (_| |
// |_|___/___,' |_|_|   \__|\__, |         |_.__/ \__,_|\__,_|
//                          |___/
//              Wrong arguments size
(function () {dm.isDirty()}).should.throw(/^.*?missing arguments.*?$/);
(function () {dm.isDirty(4711)}).should.throw(/^.*?missing arguments.*?$/);
(function () {dm.isDirty(true)}).should.throw(/^.*?missing arguments.*?$/);
(function () {dm.isDirty(false)}).should.throw(/^.*?missing arguments.*?$/);
(function () {dm.isDirty({id : "Country"})}).should.throw(/^.*?missing arguments.*?$/);
(function () {dm.isDirty(["Country"])}).should.throw(/^.*?missing arguments.*?$/);
(function () {dm.isDirty(function () {})}).should.throw(/^.*?missing arguments.*?$/);
(function () {dm.isDirty("Country", {}, true, false) }).should.throw(/^.*?too many arguments.*?$/);
//              Wrong Class name
(function () {dm.isDirty(4711, {})}).should.throw(/^.*?invalid entity class argument.*?$/);
(function () {dm.isDirty(true, {})}).should.throw(/^.*?invalid entity class argument.*?$/);
(function () {dm.isDirty(false, {})}).should.throw(/^.*?invalid entity class argument.*?$/);
(function () {dm.isDirty({id : "Country"}, {})}).should.throw(/^.*?invalid entity class argument.*?$/);
(function () {dm.isDirty(["Country"], {})}).should.throw(/^.*?invalid entity class argument.*?$/);
(function () {dm.isDirty(function () {}, {})}).should.throw(/^.*?invalid entity class argument.*?$/);
//              Never defined class
(function () {dm.isDirty("Unknown", {}) }).should.throw(/^.*?is not defined.*?$/);
//              Unknown Object
(function () {dm.isDirty("Country", { id : "" }, true); }).should.throw(/^.*?Can not find an object that matches the given obj.*?$/);
//              Ambiguous Object
(function () {dm.isDirty("Person", { hobbies : [] }, true); }).should.throw(/^.*?Object is ambiguous.*?$/);
//              Wrong argument type for setter
(function () {dm.isDirty("Country", { id : "DE" }, 1); }).should.throw(/^.*?Object value must be of type boolean.*?$/);
(function () {dm.isDirty("Country", { id : "DE" }, "true"); }).should.throw(/^.*?Object value must be of type boolean.*?$/);
(function () {dm.isDirty("Country", { id : "DE" }, ["true"]); }).should.throw(/^.*?Object value must be of type boolean.*?$/);
(function () {dm.isDirty("Country", { id : "DE" }, {val : "true"}); }).should.throw(/^.*?Object value must be of type boolean.*?$/);
//  _        ___ _      _                                         _
// (_)___   /   (_)_ __| |_ _   _            __ _  ___   ___   __| |
// | / __| / /\ / | '__| __| | | |  _____   / _` |/ _ \ / _ \ / _` |
// | \__ \/ /_//| | |  | |_| |_| | |_____| | (_| | (_) | (_) | (_| |
// |_|___/___,' |_|_|   \__|\__, |          \__, |\___/ \___/ \__,_|
//                          |___/           |___/
(function () {
    var dirtyObj = dm.create("Person", {
        id : "Dirt",
        firstName : "Kevin",
        born : 1981
    });
    dm.isDirty("Person", dirtyObj).should.be.false();
    dirtyObj._isDirty.should.be.false();
    dm.isDirty("Person", {id : "Dirt"}).should.be.false();
    dm.isDirty("Person", {firstName : "Kevin"}).should.be.false();
    dirtyObj.hobbies = ["tennis", "football"];
    dm.isDirty("Person", dirtyObj, true).should.be.true();
    dirtyObj._isDirty.should.be.true();
    dm.isDirty("Person", dirtyObj).should.be.true();
    dm.isDirty("Person", {id : "Dirt"}).should.be.true();
    dm.isDirty("Person", {hobbies : ["tennis", "football"]}).should.be.true();
    dm.isDirty("Person", {id : "Dirt"}, false).should.be.false();
    dirtyObj._isDirty.should.be.false();
    dm.isDirty("Person", {hobbies : ["tennis", "football"]}, true).should.be.true();
    dirtyObj._isDirty.should.be.true();
}).should.not.throw();
//  _      __ _         _               _               _
// (_)___ / _\ |_ _   _| |__           | |__   __ _  __| |
// | / __|\ \| __| | | | '_ \   _____  | '_ \ / _` |/ _` |
// | \__ \_\ \ |_| |_| | |_) | |_____| | |_) | (_| | (_| |
// |_|___/\__/\__|\__,_|_.__/          |_.__/ \__,_|\__,_|
//
//              Wrong arguments size
(function () {dm.isStub()}).should.throw(/^.*?missing arguments.*?$/);
(function () {dm.isStub(4711)}).should.throw(/^.*?missing arguments.*?$/);
(function () {dm.isStub(true)}).should.throw(/^.*?missing arguments.*?$/);
(function () {dm.isStub(false)}).should.throw(/^.*?missing arguments.*?$/);
(function () {dm.isStub({id : "Country"})}).should.throw(/^.*?missing arguments.*?$/);
(function () {dm.isStub(["Country"])}).should.throw(/^.*?missing arguments.*?$/);
(function () {dm.isStub(function () {})}).should.throw(/^.*?missing arguments.*?$/);
(function () {dm.isStub("Country", {}, true, false) }).should.throw(/^.*?too many arguments.*?$/);
//              Wrong Class name
(function () {dm.isStub(4711, {})}).should.throw(/^.*?invalid entity class argument.*?$/);
(function () {dm.isStub(true, {})}).should.throw(/^.*?invalid entity class argument.*?$/);
(function () {dm.isStub(false, {})}).should.throw(/^.*?invalid entity class argument.*?$/);
(function () {dm.isStub({id : "Country"}, {})}).should.throw(/^.*?invalid entity class argument.*?$/);
(function () {dm.isStub(["Country"], {})}).should.throw(/^.*?invalid entity class argument.*?$/);
(function () {dm.isStub(function () {}, {})}).should.throw(/^.*?invalid entity class argument.*?$/);
//              Never defined class
(function () {dm.isStub("Unknown", {}) }).should.throw(/^.*?is not defined.*?$/);
//              Unknown Object
(function () {dm.isStub("Country", { id : "" }, true); }).should.throw(/^.*?Can not find an object that matches the given obj.*?$/);
//              Ambiguous Object
(function () {dm.isStub("Person", { hobbies : [] }, true); }).should.throw(/^.*?Object is ambiguous.*?$/);
//              Wrong argument type for setter
(function () {dm.isStub("Country", { id : "DE" }, 1); }).should.throw(/^.*?Object value must be of type boolean.*?$/);
(function () {dm.isStub("Country", { id : "DE" }, "true"); }).should.throw(/^.*?Object value must be of type boolean.*?$/);
(function () {dm.isStub("Country", { id : "DE" }, ["true"]); }).should.throw(/^.*?Object value must be of type boolean.*?$/);
(function () {dm.isStub("Country", { id : "DE" }, {val : "true"}); }).should.throw(/^.*?Object value must be of type boolean.*?$/);
//  _      __ _         _                                     _
// (_)___ / _\ |_ _   _| |__             __ _  ___   ___   __| |
// | / __|\ \| __| | | | '_ \   _____   / _` |/ _ \ / _ \ / _` |
// | \__ \_\ \ |_| |_| | |_) | |_____| | (_| | (_) | (_) | (_| |
// |_|___/\__/\__|\__,_|_.__/           \__, |\___/ \___/ \__,_|
//                                      |___/
(function () {
    dm.create("OrgUnit", {id : "stubTest", owner : "HansDampf"});
    var stubTest = dm.findById("Person", "HansDampf");
    // ask known object
    dm.isStub("Person", stubTest).should.be.true();
    stubTest._isStub.should.be.true();
    // ask by id
    dm.isStub("Person", {id : "HansDampf"}).should.be.true();
    var stubTest1 = dm.create("Person", {
        id : "HansDampf",
        firstName : "Hans Richard"
    });
    stubTest._isStub.should.be.false();
    stubTest.should.be.equal(stubTest1);
    // ask known object
    dm.isStub("Person", stubTest1).should.be.false();
    stubTest1._isStub.should.be.false();
    // ask by id
    dm.isStub("Person", {id : "HansDampf"}).should.be.false();
    // ask by example
    dm.isStub("Person", {firstName : "Hans Richard"}).should.be.false();
}).should.not.throw();
//  _        ___     _      _           _           _               _
// (_)___   /   \___| | ___| |_ ___  __| |         | |__   __ _  __| |
// | / __| / /\ / _ \ |/ _ \ __/ _ \/ _` |  _____  | '_ \ / _` |/ _` |
// | \__ \/ /_//  __/ |  __/ ||  __/ (_| | |_____| | |_) | (_| | (_| |
// |_|___/___,' \___|_|\___|\__\___|\__,_|         |_.__/ \__,_|\__,_|
//
//              Wrong arguments size
(function () {dm.isDeleted()}).should.throw(/^.*?missing arguments.*?$/);
(function () {dm.isDeleted(4711)}).should.throw(/^.*?missing arguments.*?$/);
(function () {dm.isDeleted(true)}).should.throw(/^.*?missing arguments.*?$/);
(function () {dm.isDeleted(false)}).should.throw(/^.*?missing arguments.*?$/);
(function () {dm.isDeleted({id : "Country"})}).should.throw(/^.*?missing arguments.*?$/);
(function () {dm.isDeleted(["Country"])}).should.throw(/^.*?missing arguments.*?$/);
(function () {dm.isDeleted(function () {})}).should.throw(/^.*?missing arguments.*?$/);
(function () {dm.isDeleted("Country", {}, true, false) }).should.throw(/^.*?too many arguments.*?$/);
//              Wrong Class name
(function () {dm.isDeleted(4711, {})}).should.throw(/^.*?invalid entity class argument.*?$/);
(function () {dm.isDeleted(true, {})}).should.throw(/^.*?invalid entity class argument.*?$/);
(function () {dm.isDeleted(false, {})}).should.throw(/^.*?invalid entity class argument.*?$/);
(function () {dm.isDeleted({id : "Country"}, {})}).should.throw(/^.*?invalid entity class argument.*?$/);
(function () {dm.isDeleted(["Country"], {})}).should.throw(/^.*?invalid entity class argument.*?$/);
(function () {dm.isDeleted(function () {}, {})}).should.throw(/^.*?invalid entity class argument.*?$/);
//              Never defined class
(function () {dm.isDeleted("Unknown", {}) }).should.throw(/^.*?is not defined.*?$/);
//              Unknown Object
(function () {dm.isDeleted("Country", { id : "" }, true); }).should.throw(/^.*?Can not find an object that matches the given obj.*?$/);
//              Ambiguous Object
(function () {dm.isDeleted("Person", { hobbies : [] }, true); }).should.throw(/^.*?Object is ambiguous.*?$/);
//              Wrong argument type for setter
(function () {dm.isDeleted("Country", { id : "DE" }, 1); }).should.throw(/^.*?Object value must be of type boolean.*?$/);
(function () {dm.isDeleted("Country", { id : "DE" }, "true"); }).should.throw(/^.*?Object value must be of type boolean.*?$/);
(function () {dm.isDeleted("Country", { id : "DE" }, ["true"]); }).should.throw(/^.*?Object value must be of type boolean.*?$/);
(function () {dm.isDeleted("Country", { id : "DE" }, {val : "true"}); }).should.throw(/^.*?Object value must be of type boolean.*?$/);
//  _        ___     _      _           _                                 _
// (_)___   /   \___| | ___| |_ ___  __| |           __ _  ___   ___   __| |
// | / __| / /\ / _ \ |/ _ \ __/ _ \/ _` |  _____   / _` |/ _ \ / _ \ / _` |
// | \__ \/ /_//  __/ |  __/ ||  __/ (_| | |_____| | (_| | (_) | (_) | (_| |
// |_|___/___,' \___|_|\___|\__\___|\__,_|          \__, |\___/ \___/ \__,_|
//                                                  |___/
(function () {
    var deleteTest = dm.create("Country", {id : "SWE", name : "Sweden"});
    // ask known object
    dm.isDeleted("Country", deleteTest).should.be.false();
    deleteTest._isDeleted.should.be.false();
    // ask object by id
    dm.isDeleted("Country", {id : "SWE"}).should.be.false();
    // ask object by example
    dm.isDeleted("Country", {name : "Sweden"}).should.be.false();

    dm.destroy("Country", deleteTest);
    // ask known object
    dm.isDeleted("Country", deleteTest).should.be.true();
    deleteTest._isDeleted.should.be.true();
    // ask object by id
    dm.isDeleted("Country", {id : "SWE"}).should.be.true();
    // ask object by example
    dm.isDeleted("Country", {name : "Sweden"}).should.be.true();
}).should.not.throw();
//  _                            _             _               _
// (_)_ __ ___  _ __   ___  _ __| |_          | |__   __ _  __| |
// | | '_ ` _ \| '_ \ / _ \| '__| __|  _____  | '_ \ / _` |/ _` |
// | | | | | | | |_) | (_) | |  | |_  |_____| | |_) | (_| | (_| |
// |_|_| |_| |_| .__/ \___/|_|   \__|         |_.__/ \__,_|\__,_|
//             |_|
//              Wrong arguments size
(function () {dm.import()}).should.throw(/^.*?missing arguments.*?$/);
(function () {dm.import(4711)}).should.throw(/^.*?missing arguments.*?$/);
(function () {dm.import(true)}).should.throw(/^.*?missing arguments.*?$/);
(function () {dm.import(false)}).should.throw(/^.*?missing arguments.*?$/);
(function () {dm.import({id : "Country"})}).should.throw(/^.*?missing arguments.*?$/);
(function () {dm.import(["Country"])}).should.throw(/^.*?missing arguments.*?$/);
(function () {dm.import(function () {})}).should.throw(/^.*?missing arguments.*?$/);
(function () {dm.import("Country", {}, true, false) }).should.throw(/^.*?too many arguments.*?$/);
//              Wrong Class name
(function () {dm.import(4711, {}, {})}).should.throw(/^.*?invalid entity class argument.*?$/);
(function () {dm.import(true, {}, {})}).should.throw(/^.*?invalid entity class argument.*?$/);
(function () {dm.import(false, {}, {})}).should.throw(/^.*?invalid entity class argument.*?$/);
(function () {dm.import({id : "Country"}, {}, {})}).should.throw(/^.*?invalid entity class argument.*?$/);
(function () {dm.import(["Country"], {}, {})}).should.throw(/^.*?invalid entity class argument.*?$/);
(function () {dm.import(function () {}, {}, {})}).should.throw(/^.*?invalid entity class argument.*?$/);
//              Never defined class
(function () {dm.import("Unknown", {}, {}) }).should.throw(/^.*?is not defined.*?$/);
//              Unknown Object
(function () {dm.import("Country", { id : "Madagaskar"}, {}); }).should.throw(/^.*?Can not find an object that matches the given obj.*?$/);
//              Stub Object
(function () {dm.import("Person", { id : "HZ"}, {}); }).should.throw(/^.*?Given obj is a stub object.*?$/);
//              Invalid import field
(function () {dm.import("Person", { id: "JHO"}, { husten: true }); }).should.throw(/^.*?has no field.*?$/);
//  _                            _                                   _
// (_)_ __ ___  _ __   ___  _ __| |_            __ _  ___   ___   __| |
// | | '_ ` _ \| '_ \ / _ \| '__| __|  _____   / _` |/ _ \ / _ \ / _` |
// | | | | | | | |_) | (_) | |  | |_  |_____| | (_| | (_) | (_) | (_| |
// |_|_| |_| |_| .__/ \___/|_|   \__|          \__, |\___/ \___/ \__,_|
//             |_|                             |___/
(function () {
    dm.import("Person", { id : "JHO"}, { firstName : "Jochen", lastName : "Hörtreiter", supervisor: "JHO"});
}).should.not.throw();
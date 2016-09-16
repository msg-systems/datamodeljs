/*
 **  DatamodelJS - Entity management
 **  Design and Development by msg Applied Technology Research
 **  Copyright (c) 2013 - 2016 msg systems ag (http://www.msg-systems.com/)
 */

/* jshint expr:true */
describe('DatamodelJS Datamanger API - define()', function () {
    var dm = datamodeljs.dm('define')

    //      _       __ _                      _               _
    //   __| | ___ / _(_)_ __   ___          | |__   __ _  __| |
    //  / _` |/ _ \ |_| | '_ \ / _ \  _____  | '_ \ / _` |/ _` |
    // | (_| |  __/  _| | | | |  __/ |_____| | |_) | (_| | (_| |
    //  \__,_|\___|_| |_|_| |_|\___|         |_.__/ \__,_|\__,_|
    //
    it('should check for wrong argument size', function () {
        var regexp = /^.*?missing arguments.*?$/
        expect(function () {dm.define()}).to.throw(regexp)
        expect(function () {dm.define(4711)}).to.throw(regexp)
        expect(function () {dm.define(['Person'])}).to.throw(regexp)
        expect(function () {dm.define({id: 'Person'})}).to.throw(regexp)
        expect(function () {dm.define(true)}).to.throw(regexp)
        expect(function () {dm.define(false)}).to.throw(regexp)
        expect(function () {dm.define('Person')}).to.throw(regexp)
        expect(function () {dm.define(function () {})}).to.throw(regexp)
    })

    it('should check for wrong specification argument type', function () {
        var regexp = /^.*?invalid class spec argument - must be.*?$/
        expect(function () {dm.define('Person', 4711) }).to.throw(regexp)
        expect(function () {dm.define('Person', ['Hacker']) }).to.throw(regexp)
        expect(function () {dm.define('Person', 'Hacker') }).to.throw(regexp)
        expect(function () {dm.define('Person', true) }).to.throw(regexp)
        expect(function () {dm.define('Person', false) }).to.throw(regexp)
        expect(function () {dm.define('Person', function () {}) }).to.throw(regexp)
    })

    it('should check for wrong class extension', function () {
        var regexp = /^.*?invalid extend class argument - must be.*?$/
        expect(function () {dm.define('Person', {}, {id: '@string'}) }).to.throw(regexp)
        expect(function () {dm.define('Person', true, {id: '@string'}) }).to.throw(regexp)
        expect(function () {dm.define('Person', false, {id: '@string'}) }).to.throw(regexp)
        expect(function () {dm.define('Person', 4711, {id: '@string'}) }).to.throw(regexp)
        expect(function () {dm.define('Person', function () {}, {id: '@string'}) }).to.throw(regexp)
    })

    it('should check for missing primary key', function () {
        var regexp = /^.*?class must contain exactly one field marked as primary field.*?$/
        expect(function () {dm.define('Car', {}) }).to.throw(regexp)
        expect(function () {dm.define('Car', {id: 'string'}) }).to.throw(regexp)
    })

    it('should check for more then one primary keys', function () {
        var regexp = /^.*?class must contain exactly one field marked as primary field.*?$/
        expect(function () {dm.define('Car', {id: '@string', type: '@string'}) }).to.throw(regexp)
    })

    // TODO test primary not as number or string

    it('should check for using reserved keywords', function () {
        var regexp = /^.*?invalid class spec - attribute '(_className|_isTransient|_isStub|_isDirty|_isDeleted)' is a reserved keyword.*?$/
        expect(function () {dm.define('Keyword', {id: '@string', _className: 'string'}) }).to.throw(regexp)
        expect(function () {dm.define('Keyword', {id: '@string', _isTransient: 'string'})}).to.throw(regexp);
        expect(function () {dm.define('Keyword', {id: '@string', _isStub: 'string'}) }).to.throw(regexp);
        expect(function () {dm.define('Keyword', {id: '@string', _isDirty: 'string'}) }).to.throw(regexp);
        expect(function () {dm.define('Keyword', {id: '@string', _isDeleted: 'string'}) }).to.throw(regexp);
    })

    //      _       __ _                                            _
    //   __| | ___ / _(_)_ __   ___            __ _  ___   ___   __| |
    //  / _` |/ _ \ |_| | '_ \ / _ \  _____   / _` |/ _ \ / _ \ / _` |
    // | (_| |  __/  _| | | | |  __/ |_____| | (_| | (_) | (_) | (_| |
    //  \__,_|\___|_| |_|_| |_|\___|          \__, |\___/ \___/ \__,_|
    //                                        |___/
    it('should define classes with a number primary key', function () {
        dm.define('NumberClass', {id: '@number'});
        expect(dm.entityClasses.NumberClass).to.be.a('function')
    })

    it('should define classes with a string primary key', function () {
        dm.define('StringClass', {id: '@string'});
        expect(dm.entityClasses.StringClass).to.be.a('function')
    })

    it('should define classes with primitive attributes (string, number, boolean, object)', function () {
        dm.define('Country', {id: '@string', name: 'string', amount: 'number', active: 'boolean', reference: 'object'});
        expect(dm.entityClasses.Country).to.be.a('function')
    })

    it('should define classes with attributes referencing another entity in a 1..1 relation', function () {
        dm.define('OrgUnit', {id: '@number', name: 'string', country: 'Country'});
        expect(dm.entityClasses.OrgUnit).to.be.a('function')
    })

    it('should define classes with attributes referencing another entity in a 0..1 relation', function () {
        dm.define('OrgUnit2', {id: '@string', name: 'string', owner: 'Person?'});
        expect(dm.entityClasses.OrgUnit2).to.be.a('function')
    })

    it('should define classes with attributes referencing another entity in a 0..N relation', function () {
        dm.define('OrgUnit3', {id: '@string', name: 'string', owner: 'Person*'});
        expect(dm.entityClasses.OrgUnit3).to.be.a('function')
    })

    it('should define classes with attributes referencing another entity in a 1..N relation', function () {
        dm.define('OrgUnit4', {id: '@string', name: 'string', owner: 'Person+'});
        expect(dm.entityClasses.OrgUnit4).to.be.a('function')
    })

    it('should define classes with attributes referencing itself', function () {
        dm.define('Person', {
            id: '@string',
            firstName: 'string',
            middleInitial: 'string',
            lastName: 'string',
            born: 'number',
            hobbies: 'string*',
            proxies: 'Person*',
            supervisor: 'Person?',
            organizations: 'OrgUnit+'
        });
        expect(dm.entityClasses.Person).to.be.a('function')
    })

    it('should define classes in extension of other classes', function () {
        dm.define('Animal', {id: '@string'})
        dm.define('Cow', 'Animal', {
            produces: 'string'
        });
        expect(dm.entityClasses.Animal).to.be.a('function')
        expect(dm.entityClasses.Cow).to.be.a('function')
        expect(dm.entities.Cow).to.have.keys('id', 'produces')
    })

    it('should define classes in extension of other classes using multiple extensions', function () {
        dm.define('Human', {id: '@string', age: 'number'})
        dm.define('NaturalPerson', {id: '@string', firstname: 'string', lastname: 'string'})
        dm.define('Hacker', ['NaturalPerson', 'Human'], {
            hackerCode: 'string'
        });
        expect(dm.entityClasses.Human).to.be.a('function')
        expect(dm.entityClasses.NaturalPerson).to.be.a('function')
        expect(dm.entityClasses.Hacker).to.be.a('function')
        expect(dm.entities.Human).to.have.keys('id', 'age')
        expect(dm.entities.NaturalPerson).to.have.keys('id', 'firstname', 'lastname')
        expect(dm.entities.Hacker).to.have.keys('id', 'age', 'firstname', 'lastname', 'hackerCode')
    })

})
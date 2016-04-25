/*
 **  DatamodelJS - Entity management
 **  Design and Development by msg Applied Technology Research
 **  Copyright (c) 2013 - 2016 msg systems ag (http://www.msg-systems.com/)
 */

/* jshint expr:true */
describe('DatamodelJS Datamanger API - isStub()', function () {
    var dm = datamodeljs.dm('isStub')
    require('../classes').defineClassesInDatamanager(dm)
    require('../objects').defineObjectsInDatamanager(dm)

    //  _      __ _         _               _               _
    // (_)___ / _\ |_ _   _| |__           | |__   __ _  __| |
    // | / __|\ \| __| | | | '_ \   _____  | '_ \ / _` |/ _` |
    // | \__ \_\ \ |_| |_| | |_) | |_____| | |_) | (_| | (_| |
    // |_|___/\__/\__|\__,_|_.__/          |_.__/ \__,_|\__,_|
    //
    it('should check for wrong argument size', function () {
        var regexp = /^.*?missing arguments.*?$/
        expect(function () {dm.isStub()}).to.throw(regexp)
        expect(function () {dm.isStub(4711)}).to.throw(regexp)
        expect(function () {dm.isStub(true)}).to.throw(regexp)
        expect(function () {dm.isStub(false)}).to.throw(regexp)
        expect(function () {dm.isStub({id: 'Country'})}).to.throw(regexp)
        expect(function () {dm.isStub(['Country'])}).to.throw(regexp)
        expect(function () {dm.isStub(function () {})}).to.throw(regexp)

        expect(function () {dm.isStub('Country', {}, true, false) }).to.throw(/^.*?too many arguments.*?$/)
    })

    it('should check for wrong class name', function () {
        var regexp = /^.*?invalid entity class argument.*?$/
        expect(function () {dm.isStub(4711, {})}).to.throw(regexp)
        expect(function () {dm.isStub(true, {})}).to.throw(regexp)
        expect(function () {dm.isStub(false, {})}).to.throw(regexp)
        expect(function () {dm.isStub({id: 'Country'}, {})}).to.throw(regexp)
        expect(function () {dm.isStub(['Country'], {})}).to.throw(regexp)
        expect(function () {dm.isStub(function () {}, {})}).to.throw(regexp)
    })

    it('should check setter parameter type', function () {
        var regexp = /^.*?Object value must be of type boolean.*?$/
        expect(function () {dm.isStub('Country', {id: 'DE'}, 1) }).to.throw(regexp)
        expect(function () {dm.isStub('Country', {id: 'DE'}, 'true') }).to.throw(regexp)
        expect(function () {dm.isStub('Country', {id: 'DE'}, ['true']) }).to.throw(regexp)
        expect(function () {dm.isStub('Country', {id: 'DE'}, {val: 'true'}) }).to.throw(regexp)
    })

    it('should check for undefined class', function () {
        expect(function () {dm.isStub('Unknown', {}) }).to.throw(/^.*?is not defined.*?$/)
    })

    it('should check for object existence', function () {
        expect(function () {dm.isStub('Country', {id: ''}, true) }).to.throw(/^.*?Can not find an object that matches the given obj.*?$/)
    })

    it('should check for object uniqueness', function () {
        expect(function () {dm.isStub('Person', {hobbies: []}, true) }).to.throw(/^.*?Object is ambiguous.*?$/)
    })

    //  _      __ _         _                                     _
    // (_)___ / _\ |_ _   _| |__             __ _  ___   ___   __| |
    // | / __|\ \| __| | | | '_ \   _____   / _` |/ _ \ / _ \ / _` |
    // | \__ \_\ \ |_| |_| | |_) | |_____| | (_| | (_) | (_) | (_| |
    // |_|___/\__/\__|\__,_|_.__/           \__, |\___/ \___/ \__,_|
    //                                      |___/
    it('should be possible to read the flag _isStub', function () {
        dm.create('OrgUnit', {id: 'stubTest', owner: 'HansDampf'})
        var stubTest = dm.findById('Person', 'HansDampf')
        expect(dm.isStub('Person', stubTest)).to.be.true
        expect(stubTest._isStub).to.be.true
        expect(dm.isStub('Person', {id: 'HansDampf'})).to.be.true
    })

    it('should set the flag _isStub to true when creating a new object that was stub', function () {
        var stubTest = dm.findById('Person', 'HansDampf')
        var stubTest1 = dm.create('Person', {id: 'HansDampf', firstName: 'Hans Richard', organizations: 'XT'})
        expect(stubTest._isStub).to.be.false
        expect(stubTest).to.be.equal(stubTest1)
        expect(dm.isStub('Person', stubTest1)).to.be.false
        expect(stubTest1._isStub).to.be.false
        expect(dm.isStub('Person', {id: 'HansDampf'})).to.be.false
        expect(dm.isStub('Person', {firstName: 'Hans Richard'})).to.be.false
    })

})
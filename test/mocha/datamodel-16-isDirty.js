/*
 **  DatamodelJS - Entity management
 **  Design and Development by msg Applied Technology Research
 **  Copyright (c) 2013 - 2016 msg systems ag (http://www.msg-systems.com/)
 */

/* jshint expr:true */
describe('DatamodelJS Datamanger API - isDirty()', function () {
    var dm = datamodeljs.dm('isDirty')
    require('../classes').defineClassesInDatamanager(dm)
    require('../objects').defineObjectsInDatamanager(dm)

    //  _        ___ _      _                   _               _
    // (_)___   /   (_)_ __| |_ _   _          | |__   __ _  __| |
    // | / __| / /\ / | '__| __| | | |  _____  | '_ \ / _` |/ _` |
    // | \__ \/ /_//| | |  | |_| |_| | |_____| | |_) | (_| | (_| |
    // |_|___/___,' |_|_|   \__|\__, |         |_.__/ \__,_|\__,_|
    //                          |___/
    it('should check for wrong argument size', function () {
        var regexp = /^.*?missing arguments.*?$/
        expect(function () {dm.isDirty()}).to.throw(regexp)
        expect(function () {dm.isDirty(4711)}).to.throw(regexp)
        expect(function () {dm.isDirty(true)}).to.throw(regexp)
        expect(function () {dm.isDirty(false)}).to.throw(regexp)
        expect(function () {dm.isDirty({id: 'Country'})}).to.throw(regexp)
        expect(function () {dm.isDirty(['Country'])}).to.throw(regexp)
        expect(function () {dm.isDirty(function () {})}).to.throw(regexp)

        expect(function () {dm.isDirty('Country', {}, true, false) }).to.throw(/^.*?too many arguments.*?$/)
    })

    it('should check for wrong class name', function () {
        var regexp = /^.*?invalid entity class argument.*?$/
        expect(function () {dm.isDirty(4711, {})}).to.throw(regexp)
        expect(function () {dm.isDirty(true, {})}).to.throw(regexp)
        expect(function () {dm.isDirty(false, {})}).to.throw(regexp)
        expect(function () {dm.isDirty({id: 'Country'}, {})}).to.throw(regexp)
        expect(function () {dm.isDirty(['Country'], {})}).to.throw(regexp)
        expect(function () {dm.isDirty(function () {}, {})}).to.throw(regexp)
    })

    it('should check setter parameter type', function () {
        var regexp = /^.*?Object value must be of type boolean.*?$/
        expect(function () {dm.isDirty('Country', {id: 'DE'}, 1) }).to.throw(regexp)
        expect(function () {dm.isDirty('Country', {id: 'DE'}, 'true') }).to.throw(regexp)
        expect(function () {dm.isDirty('Country', {id: 'DE'}, ['true']) }).to.throw(regexp)
        expect(function () {dm.isDirty('Country', {id: 'DE'}, {val: 'true'}) }).to.throw(regexp)
    })

    it('should check for undefined class', function () {
        expect(function () {dm.isDirty('Unknown', {}) }).to.throw(/^.*?is not defined.*?$/)
    })

    it('should check for object existence', function () {
        expect(function () {dm.isDirty('Country', {id: ''}, true) }).to.throw(/^.*?Can not find an object that matches the given obj.*?$/)
    })

    it('should check for object uniqueness', function () {
        expect(function () {dm.isDirty('Person', {hobbies: []}, true) }).to.throw(/^.*?Object is ambiguous.*?$/)
    })

    //  _        ___ _      _                                         _
    // (_)___   /   (_)_ __| |_ _   _            __ _  ___   ___   __| |
    // | / __| / /\ / | '__| __| | | |  _____   / _` |/ _ \ / _ \ / _` |
    // | \__ \/ /_//| | |  | |_| |_| | |_____| | (_| | (_) | (_) | (_| |
    // |_|___/___,' |_|_|   \__|\__, |          \__, |\___/ \___/ \__,_|
    //                          |___/           |___/
    it('should be possible to read the flag _isDirty', function () {
        var dirtyObj = dm.create('Person', {id: 'Dirt', firstName: 'Kevin', born: 1981, organizations: 'XT'})
        expect(dm.isDirty('Person', dirtyObj)).to.be.false
        expect(dirtyObj._isDirty).to.be.false
        expect(dm.isDirty('Person', {id: 'Dirt'})).to.be.false
        expect(dm.isDirty('Person', {firstName: 'Kevin'})).to.be.false
    })

    it('should be possible to set the flag _isDirty', function () {
        var dirtyObj = dm.findById('Person', 'Dirt')
        dirtyObj.hobbies = ['tennis', 'football']
        expect(dm.isDirty('Person', dirtyObj, true)).to.be.true
        expect(dirtyObj._isDirty).to.be.true
        expect(dm.isDirty('Person', dirtyObj)).to.be.true
        expect(dm.isDirty('Person', {id: 'Dirt'})).to.be.true
        expect(dm.isDirty('Person', {hobbies: ['tennis', 'football']})).to.be.true
        expect(dm.isDirty('Person', {id: 'Dirt'}, false)).to.be.false
        expect(dirtyObj._isDirty).to.be.false
        expect(dm.isDirty('Person', {hobbies: ['tennis', 'football']}, true)).to.be.true
        expect(dirtyObj._isDirty).to.be.true
    })

})
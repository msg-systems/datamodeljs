/*
 **  DatamodelJS - Entity management
 **  Design and Development by msg Applied Technology Research
 **  Copyright (c) 2013 - 2016 msg systems ag (http://www.msg-systems.com/)
 */

/* jshint expr:true */
describe('DatamodelJS Datamanger API - isTransient()', function () {
    var dm = datamodeljs.dm('isTransient')
    require('../classes').defineClassesInDatamanager(dm)
    require('../objects').defineObjectsInDatamanager(dm)

    //  _     _____                     _            _             _               _
    // (_)___/__   \_ __ __ _ _ __  ___(_) ___ _ __ | |_          | |__   __ _  __| |
    // | / __| / /\/ '__/ _` | '_ \/ __| |/ _ \ '_ \| __|  _____  | '_ \ / _` |/ _` |
    // | \__ \/ /  | | | (_| | | | \__ \ |  __/ | | | |_  |_____| | |_) | (_| | (_| |
    // |_|___/\/   |_|  \__,_|_| |_|___/_|\___|_| |_|\__|         |_.__/ \__,_|\__,_|
    //
    it('should check for wrong argument size', function () {
        var regexp = /^.*?missing arguments.*?$/
        expect(function () {dm.isTransient()}).to.throw(regexp)
        expect(function () {dm.isTransient(4711)}).to.throw(regexp)
        expect(function () {dm.isTransient(true)}).to.throw(regexp)
        expect(function () {dm.isTransient(false)}).to.throw(regexp)
        expect(function () {dm.isTransient({id: 'Country'})}).to.throw(regexp)
        expect(function () {dm.isTransient(['Country'])}).to.throw(regexp)
        expect(function () {dm.isTransient(function () {})}).to.throw(regexp)

        expect(function () {dm.isTransient('Country', {}, true, false) }).to.throw(/^.*?too many arguments.*?$/)
    })

    it('should check for wrong class name', function () {
        var regexp = /^.*?invalid entity class argument.*?$/
        expect(function () {dm.isTransient(4711, {})}).to.throw(regexp)
        expect(function () {dm.isTransient(true, {})}).to.throw(regexp)
        expect(function () {dm.isTransient(false, {})}).to.throw(regexp)
        expect(function () {dm.isTransient({id: 'Country'}, {})}).to.throw(regexp)
        expect(function () {dm.isTransient(['Country'], {})}).to.throw(regexp)
        expect(function () {dm.isTransient(function () {}, {})}).to.throw(regexp)
    })

    it('should check setter parameter type', function () {
        var regexp = /^.*?Object value must be of type boolean.*?$/
        expect(function () {dm.isTransient('Country', {id: 'DE'}, 1) }).to.throw(regexp)
        expect(function () {dm.isTransient('Country', {id: 'DE'}, 'true') }).to.throw(regexp)
        expect(function () {dm.isTransient('Country', {id: 'DE'}, ['true']) }).to.throw(regexp)
        expect(function () {dm.isTransient('Country', {id: 'DE'}, {val: 'true'}) }).to.throw(regexp)
    })

    it('should check for undefined class', function () {
        expect(function () {dm.isTransient('Unknown', {}) }).to.throw(/^.*?is not defined.*?$/)
    })

    it('should check for object existence', function () {
        expect(function () {dm.isTransient('Country', {id: ''}, true) }).to.throw(/^.*?Can not find an object that matches the given obj.*?$/)
    })

    it('should check for object uniqueness', function () {
        expect(function () {dm.isTransient('Person', {hobbies: []}, true) }).to.throw(/^.*?Object is ambiguous.*?$/)
    })

    //  _     _____                     _            _                                   _
    // (_)___/__   \_ __ __ _ _ __  ___(_) ___ _ __ | |_            __ _  ___   ___   __| |
    // | / __| / /\/ '__/ _` | '_ \/ __| |/ _ \ '_ \| __|  _____   / _` |/ _ \ / _ \ / _` |
    // | \__ \/ /  | | | (_| | | | \__ \ |  __/ | | | |_  |_____| | (_| | (_) | (_) | (_| |
    // |_|___/\/   |_|  \__,_|_| |_|___/_|\___|_| |_|\__|          \__, |\___/ \___/ \__,_|
    //                                                             |___/
    it('should be possible to read the flag _isTransient', function () {
        var misterX = dm.create('Person', {firstName: 'Mister X', organizations: 'XT'})
        expect(dm.isTransient('Person', misterX)).to.be.true
        expect(misterX._isTransient).to.be.true
        expect(dm.isTransient('Person', {firstName: 'Mister X'})).to.be.true

        dm.destroy('Person', misterX)
        expect(dm.isTransient('Person', dm.findById('Person', 'JHO'))).to.be.false
    })

    it('should be possible to set the flag _isTransient', function () {
        expect(dm.findById('Person', 'JHO')._isTransient).to.be.false
        expect(dm.isTransient('Person', dm.findById('Person', 'JHO'), true)).to.be.true
        expect(dm.findById('Person', 'JHO')._isTransient).to.be.true
        expect(dm.isTransient('Person', dm.findById('Person', 'JHO'))).to.be.true
        expect(dm.isTransient('Person', dm.findById('Person', 'JHO'), false)).to.be.false
        expect(dm.findById('Person', 'JHO')._isTransient).to.be.false
    })

})
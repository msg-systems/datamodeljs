/*
 **  DatamodelJS - Entity management
 **  Design and Development by msg Applied Technology Research
 **  Copyright (c) 2013 - 2016 msg systems ag (http://www.msg-systems.com/)
 */

/* jshint expr:true */
describe('DatamodelJS Datamanger API - isDeleted()', function () {
    var dm = datamodeljs.dm('isDeleted')
    require('../classes').defineClassesInDatamanager(dm)
    require('../objects').defineObjectsInDatamanager(dm)

    //  _        ___     _      _           _           _               _
    // (_)___   /   \___| | ___| |_ ___  __| |         | |__   __ _  __| |
    // | / __| / /\ / _ \ |/ _ \ __/ _ \/ _` |  _____  | '_ \ / _` |/ _` |
    // | \__ \/ /_//  __/ |  __/ ||  __/ (_| | |_____| | |_) | (_| | (_| |
    // |_|___/___,' \___|_|\___|\__\___|\__,_|         |_.__/ \__,_|\__,_|
    //
    it('should check for wrong argument size', function () {
        var regexp = /^.*?missing arguments.*?$/
        expect(function () {dm.isDeleted()}).to.throw(regexp)
        expect(function () {dm.isDeleted(4711)}).to.throw(regexp)
        expect(function () {dm.isDeleted(true)}).to.throw(regexp)
        expect(function () {dm.isDeleted(false)}).to.throw(regexp)
        expect(function () {dm.isDeleted({id: 'Country'})}).to.throw(regexp)
        expect(function () {dm.isDeleted(['Country'])}).to.throw(regexp)
        expect(function () {dm.isDeleted(function () {})}).to.throw(regexp)

        expect(function () {dm.isDeleted('Country', {}, true, false) }).to.throw(/^.*?too many arguments.*?$/)
    })

    it('should check for wrong class name', function () {
        var regexp = /^.*?invalid entity class argument.*?$/
        expect(function () {dm.isDeleted(4711, {})}).to.throw(regexp)
        expect(function () {dm.isDeleted(true, {})}).to.throw(regexp)
        expect(function () {dm.isDeleted(false, {})}).to.throw(regexp)
        expect(function () {dm.isDeleted({id: 'Country'}, {})}).to.throw(regexp)
        expect(function () {dm.isDeleted(['Country'], {})}).to.throw(regexp)
        expect(function () {dm.isDeleted(function () {}, {})}).to.throw(regexp)
    })

    it('should check setter parameter type', function () {
        var regexp = /^.*?Object value must be of type boolean.*?$/
        expect(function () {dm.isDeleted('Country', {id: 'DE'}, 1) }).to.throw(regexp)
        expect(function () {dm.isDeleted('Country', {id: 'DE'}, 'true') }).to.throw(regexp)
        expect(function () {dm.isDeleted('Country', {id: 'DE'}, ['true']) }).to.throw(regexp)
        expect(function () {dm.isDeleted('Country', {id: 'DE'}, {val: 'true'}) }).to.throw(regexp)
    })

    it('should check for undefined class', function () {
        expect(function () {dm.isDeleted('Unknown', {}) }).to.throw(/^.*?is not defined.*?$/)
    })

    it('should check for object existence', function () {
        expect(function () {dm.isDeleted('Country', {id: ''}, true) }).to.throw(/^.*?Can not find an object that matches the given obj.*?$/)
    })

    it('should check for object uniqueness', function () {
        expect(function () {dm.isDeleted('Person', {hobbies: []}, true) }).to.throw(/^.*?Object is ambiguous.*?$/)
    })

    //  _        ___     _      _           _                                 _
    // (_)___   /   \___| | ___| |_ ___  __| |           __ _  ___   ___   __| |
    // | / __| / /\ / _ \ |/ _ \ __/ _ \/ _` |  _____   / _` |/ _ \ / _ \ / _` |
    // | \__ \/ /_//  __/ |  __/ ||  __/ (_| | |_____| | (_| | (_) | (_) | (_| |
    // |_|___/___,' \___|_|\___|\__\___|\__,_|          \__, |\___/ \___/ \__,_|
    //                                                  |___/
    it('should be possible to read the flag _isDeleted', function () {
        var deleteTest = dm.create('Country', {id: 'SWE', name: 'Sweden'})
        expect(dm.isDeleted('Country', deleteTest)).to.be.false
        expect(deleteTest._isDeleted).to.be.false
        expect(dm.isDeleted('Country', {id: 'SWE'})).to.be.false
        expect(dm.isDeleted('Country', {name: 'Sweden'})).to.be.false
    })

    it('should be possible to set the flag _isDeleted by destroying an entity', function () {
        var deleteTest = dm.findById('Country', 'SWE')
        dm.destroy('Country', deleteTest)
        expect(dm.isDeleted('Country', deleteTest)).to.be.true
        expect(deleteTest._isDeleted).to.be.true
        expect(dm.isDeleted('Country', {id: 'SWE'})).to.be.true
        expect(dm.isDeleted('Country', {name: 'Sweden'})).to.be.true
    })

})
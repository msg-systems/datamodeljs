/*
 **  DatamodelJS - Entity management
 **  Design and Development by msg Applied Technology Research
 **  Copyright (c) 2013 - 2016 msg systems ag (http://www.msg-systems.com/)
 */

/* jshint expr:true */
describe('DatamodelJS Datamanger API - findById()', function () {
    var dm = datamodeljs.dm('findById')
    require('../classes').defineClassesInDatamanager(dm)

    //   __ _           _   ___        _____    _           _               _
    //  / _(_)_ __   __| | / __\_   _  \_   \__| |         | |__   __ _  __| |
    // | |_| | '_ \ / _` |/__\// | | |  / /\/ _` |  _____  | '_ \ / _` |/ _` |
    // |  _| | | | | (_| / \/  \ |_| /\/ /_| (_| | |_____| | |_) | (_| | (_| |
    // |_| |_|_| |_|\__,_\_____/\__, \____/ \__,_|         |_.__/ \__,_|\__,_|
    //                          |___/
    it('should check for wrong argument size', function () {
        var regexp = /^.*?missing arguments.*?$/
        expect(function () {dm.findById()}).to.throw(regexp)
        expect(function () {dm.findById(4711)}).to.throw(regexp)
        expect(function () {dm.findById(true)}).to.throw(regexp)
        expect(function () {dm.findById(false)}).to.throw(regexp)
        expect(function () {dm.findById({id: 'Country'})}).to.throw(regexp)
        expect(function () {dm.findById(['Country'])}).to.throw(regexp)
        expect(function () {dm.findById(function () {})}).to.throw(regexp)

        expect(function () {dm.findById('Country', {}, true) }).to.throw(/^.*?too many arguments.*?$/)
    })

    it('should check for wrong class name', function () {
        var regexp = /^.*?invalid entity class argument.*?$/
        expect(function () {dm.findById(4711, {})}).to.throw(regexp)
        expect(function () {dm.findById(true, {})}).to.throw(regexp)
        expect(function () {dm.findById(false, {})}).to.throw(regexp)
        expect(function () {dm.findById({id: 'Country'}, {})}).to.throw(regexp)
        expect(function () {dm.findById(['Country'], {})}).to.throw(regexp)
        expect(function () {dm.findById(function () {}, {})}).to.throw(regexp)
    })

    it('should check for undefined class', function () {
        expect(function () {dm.findById('Unknown', {}) }).to.throw(/^.*?is not defined.*?$/)
    })

    //   __ _           _   ___        _____    _                                 _
    //  / _(_)_ __   __| | / __\_   _  \_   \__| |           __ _  ___   ___   __| |
    // | |_| | '_ \ / _` |/__\// | | |  / /\/ _` |  _____   / _` |/ _ \ / _ \ / _` |
    // |  _| | | | | (_| / \/  \ |_| /\/ /_| (_| | |_____| | (_| | (_) | (_) | (_| |
    // |_| |_|_| |_|\__,_\_____/\__, \____/ \__,_|          \__, |\___/ \___/ \__,_|
    //                          |___/                       |___/
    it('should find normal entity objects by id', function () {
        dm.create('Country', {id: 'DE', name: 'Deutschland'})
        expect(dm.findById('Country', 'DE')).to.exist
    })

    it('should find stub entity objects by id', function () {
        dm.create('OrgUnit', {id: 'XT', country: 'CH'})
        expect(dm.findById('Country', 'CH')).to.exist
        expect(dm.findById('Country', 'CH')).to.have.ownProperty('_isStub', true)
    })

    it('should find entity objects marked for deletion by id', function () {
        var at = dm.create('Country', {id: 'AT', name: 'Österreich'})
        dm.destroy('Country', at)
        expect(dm.findById('Country', 'AT')).to.exist
        expect(dm.findById('Country', 'AT')).to.have.ownProperty('_isDeleted', true)
    })

    it('should not find transient entity objects by id', function () {
        dm.create('Country', {name: 'Deutschland'})
        expect(dm.findById('Country', '')).to.not.exist
    })


    it('should not find non-existing entity objects by id', function () {
        expect(dm.findById('OrgUnit', 'Magische Trinkhalme')).to.not.exist
        var fr = dm.create('Country', {id: 'FR', name: 'Frankreich'})
        dm.destroy('Country', fr, true)
        expect(dm.findById('Country', 'FR')).to.not.exist

    })

})
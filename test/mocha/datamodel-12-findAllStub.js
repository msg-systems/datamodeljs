/*
 **  DatamodelJS - Entity management
 **  Design and Development by msg Applied Technology Research
 **  Copyright (c) 2013 - 2016 msg systems ag (http://www.msg-systems.com/)
 */

/* jshint expr:true */
describe('DatamodelJS Datamanger API - findAllStub()', function () {
    var dm = datamodeljs.dm('findAllStub')
    require('../classes').defineClassesInDatamanager(dm)

    //   __ _           _   _   _ _ __ _         _               _               _
    //  / _(_)_ __   __| | /_\ | | / _\ |_ _   _| |__           | |__   __ _  __| |
    // | |_| | '_ \ / _` |//_\\| | \ \| __| | | | '_ \   _____  | '_ \ / _` |/ _` |
    // |  _| | | | | (_| /  _  \ | |\ \ |_| |_| | |_) | |_____| | |_) | (_| | (_| |
    // |_| |_|_| |_|\__,_\_/ \_/_|_\__/\__|\__,_|_.__/          |_.__/ \__,_|\__,_|
    //
    it('should check for wrong argument size', function () {
        var regexp = /^.*?missing arguments.*?$/
        expect(function () {dm.findAllStub()}).to.throw(regexp)

        expect(function () {dm.findAllStub('Country', {}, true) }).to.throw(/^.*?too many arguments.*?$/)
    })

    it('should check for wrong class name', function () {
        var regexp = /^.*?invalid entity class argument.*?$/
        expect(function () {dm.findAllStub(4711)}).to.throw(regexp)
        expect(function () {dm.findAllStub(true)}).to.throw(regexp)
        expect(function () {dm.findAllStub(false)}).to.throw(regexp)
        expect(function () {dm.findAllStub({id: 'Country'})}).to.throw(regexp)
        expect(function () {dm.findAllStub(['Country'])}).to.throw(regexp)
        expect(function () {dm.findAllStub(function () {})}).to.throw(regexp)
    })

    it('should check for undefined class', function () {
        expect(function () {dm.findAllStub('Unknown') }).to.throw(/^.*?is not defined.*?$/)
    })

    //   __ _           _   _   _ _ __ _         _                                     _
    //  / _(_)_ __   __| | /_\ | | / _\ |_ _   _| |__             __ _  ___   ___   __| |
    // | |_| | '_ \ / _` |//_\\| | \ \| __| | | | '_ \   _____   / _` |/ _ \ / _ \ / _` |
    // |  _| | | | | (_| /  _  \ | |\ \ |_| |_| | |_) | |_____| | (_| | (_) | (_) | (_| |
    // |_| |_|_| |_|\__,_\_/ \_/_|_\__/\__|\__,_|_.__/           \__, |\___/ \___/ \__,_|
    //                                                           |___/
    it('should find all stub objects of a given entity class', function () {
        dm.create('Person', {id: 'JHO', organizations: ['Foo', 'Bar']})
        expect(dm.findAllStub('Person')).to.have.lengthOf(0)
        expect(dm.findAllStub('OrgUnit')).to.have.lengthOf(2)
    })

})
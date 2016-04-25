/*
 **  DatamodelJS - Entity management
 **  Design and Development by msg Applied Technology Research
 **  Copyright (c) 2013 - 2016 msg systems ag (http://www.msg-systems.com/)
 */

/* jshint expr:true */
describe('DatamodelJS Datamanger API - findAllDirty()', function () {
    var dm = datamodeljs.dm('findAllDirty')
    require('../classes').defineClassesInDatamanager(dm)

    //   __ _           _   _   _ _    ___ _      _                   _               _
    //  / _(_)_ __   __| | /_\ | | |  /   (_)_ __| |_ _   _          | |__   __ _  __| |
    // | |_| | '_ \ / _` |//_\\| | | / /\ / | '__| __| | | |  _____  | '_ \ / _` |/ _` |
    // |  _| | | | | (_| /  _  \ | |/ /_//| | |  | |_| |_| | |_____| | |_) | (_| | (_| |
    // |_| |_|_| |_|\__,_\_/ \_/_|_/___,' |_|_|   \__|\__, |         |_.__/ \__,_|\__,_|
    //                                                |___/
    it('should check for wrong argument size', function () {
        var regexp = /^.*?missing arguments.*?$/
        expect(function () {dm.findAllDirty()}).to.throw(regexp)

        expect(function () {dm.findAllDirty('Country', {}, true) }).to.throw(/^.*?too many arguments.*?$/)
    })

    it('should check for wrong class name', function () {
        var regexp = /^.*?invalid entity class argument.*?$/
        expect(function () {dm.findAllDirty(4711)}).to.throw(regexp)
        expect(function () {dm.findAllDirty(true)}).to.throw(regexp)
        expect(function () {dm.findAllDirty(false)}).to.throw(regexp)
        expect(function () {dm.findAllDirty({id: 'Country'})}).to.throw(regexp)
        expect(function () {dm.findAllDirty(['Country'])}).to.throw(regexp)
        expect(function () {dm.findAllDirty(function () {})}).to.throw(regexp)
    })

    it('should check for undefined class', function () {
        expect(function () {dm.findAllDirty('Unknown') }).to.throw(/^.*?is not defined.*?$/)
    })

    //   __ _           _   _   _ _    ___ _      _                                         _
    //  / _(_)_ __   __| | /_\ | | |  /   (_)_ __| |_ _   _            __ _  ___   ___   __| |
    // | |_| | '_ \ / _` |//_\\| | | / /\ / | '__| __| | | |  _____   / _` |/ _ \ / _ \ / _` |
    // |  _| | | | | (_| /  _  \ | |/ /_//| | |  | |_| |_| | |_____| | (_| | (_) | (_) | (_| |
    // |_| |_|_| |_|\__,_\_/ \_/_|_/___,' |_|_|   \__|\__, |          \__, |\___/ \___/ \__,_|
    //                                                |___/           |___/

    it('should find all dirty objects of a given entity class', function () {
        var jho = dm.create('Person', {id: 'JHO', organizations: ['XT']})
        jho.firstName = 'Jochen'
        dm.isDirty('Person', jho, true)
        expect(dm.findAllDirty('Person')).to.have.lengthOf(1)
        expect(dm.findAllDirty('OrgUnit')).to.have.lengthOf(0)

        var xt = dm.create('OrgUnit', {id: 'XT', country: 'DE'})
        xt._isDirty = true
        expect(dm.findAllDirty('OrgUnit')).to.have.lengthOf(1)
    })

})
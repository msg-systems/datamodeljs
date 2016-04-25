/*
 **  DatamodelJS - Entity management
 **  Design and Development by msg Applied Technology Research
 **  Copyright (c) 2013 - 2016 msg systems ag (http://www.msg-systems.com/)
 */

/* jshint expr:true */
describe('DatamodelJS Datamanger API - findAllDeleted()', function () {
    var dm = datamodeljs.dm('findAllDeleted')
    require('../classes').defineClassesInDatamanager(dm)

    //   __ _           _   _   _ _    ___     _      _           _           _               _
    //  / _(_)_ __   __| | /_\ | | |  /   \___| | ___| |_ ___  __| |         | |__   __ _  __| |
    // | |_| | '_ \ / _` |//_\\| | | / /\ / _ \ |/ _ \ __/ _ \/ _` |  _____  | '_ \ / _` |/ _` |
    // |  _| | | | | (_| /  _  \ | |/ /_//  __/ |  __/ ||  __/ (_| | |_____| | |_) | (_| | (_| |
    // |_| |_|_| |_|\__,_\_/ \_/_|_/___,' \___|_|\___|\__\___|\__,_|         |_.__/ \__,_|\__,_|
    //
    it('should check for wrong argument size', function () {
        var regexp = /^.*?missing arguments.*?$/
        expect(function () {dm.findAllDeleted()}).to.throw(regexp)

        expect(function () {dm.findAllDeleted('Country', {}, true) }).to.throw(/^.*?too many arguments.*?$/)
    })

    it('should check for wrong class name', function () {
        var regexp = /^.*?invalid entity class argument.*?$/
        expect(function () {dm.findAllDeleted(4711)}).to.throw(regexp)
        expect(function () {dm.findAllDeleted(true)}).to.throw(regexp)
        expect(function () {dm.findAllDeleted(false)}).to.throw(regexp)
        expect(function () {dm.findAllDeleted({id: 'Country'})}).to.throw(regexp)
        expect(function () {dm.findAllDeleted(['Country'])}).to.throw(regexp)
        expect(function () {dm.findAllDeleted(function () {})}).to.throw(regexp)
    })

    it('should check for undefined class', function () {
        expect(function () {dm.findAllDeleted('Unknown') }).to.throw(/^.*?is not defined.*?$/)
    })

    //   __ _           _   _   _ _    ___     _      _           _                                 _
    //  / _(_)_ __   __| | /_\ | | |  /   \___| | ___| |_ ___  __| |           __ _  ___   ___   __| |
    // | |_| | '_ \ / _` |//_\\| | | / /\ / _ \ |/ _ \ __/ _ \/ _` |  _____   / _` |/ _ \ / _ \ / _` |
    // |  _| | | | | (_| /  _  \ | |/ /_//  __/ |  __/ ||  __/ (_| | |_____| | (_| | (_) | (_) | (_| |
    // |_| |_|_| |_|\__,_\_/ \_/_|_/___,' \___|_|\___|\__\___|\__,_|          \__, |\___/ \___/ \__,_|
    //                                                                        |___/
    it('should find all deleted objects of a given entity class', function () {
        var jho = dm.create('Person', {id: 'JHO', organizations: ['Foo', 'Bar']})
        dm.destroy('Person', jho)
        expect(jho._isDeleted).to.be.true
        expect(dm.findAllDeleted('Person')).to.have.lengthOf(1)
    })

})
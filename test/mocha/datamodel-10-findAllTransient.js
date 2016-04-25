/*
 **  DatamodelJS - Entity management
 **  Design and Development by msg Applied Technology Research
 **  Copyright (c) 2013 - 2016 msg systems ag (http://www.msg-systems.com/)
 */

/* jshint expr:true */
describe('DatamodelJS Datamanger API - findAllTransient()', function () {
    var dm = datamodeljs.dm('findAllTransient')
    require('../classes').defineClassesInDatamanager(dm)

    //   __ _           _   _   _ _ _____                     _            _             _               _
    //  / _(_)_ __   __| | /_\ | | /__   \_ __ __ _ _ __  ___(_) ___ _ __ | |_          | |__   __ _  __| |
    // | |_| | '_ \ / _` |//_\\| | | / /\/ '__/ _` | '_ \/ __| |/ _ \ '_ \| __|  _____  | '_ \ / _` |/ _` |
    // |  _| | | | | (_| /  _  \ | |/ /  | | | (_| | | | \__ \ |  __/ | | | |_  |_____| | |_) | (_| | (_| |
    // |_| |_|_| |_|\__,_\_/ \_/_|_|\/   |_|  \__,_|_| |_|___/_|\___|_| |_|\__|         |_.__/ \__,_|\__,_|
    //
    it('should check for wrong argument size', function () {
        var regexp = /^.*?missing arguments.*?$/
        expect(function () {dm.findAllTransient()}).to.throw(regexp)

        expect(function () {dm.findAllTransient('Country', {}, true) }).to.throw(/^.*?too many arguments.*?$/)
    })

    it('should check for wrong class name', function () {
        var regexp = /^.*?invalid entity class argument.*?$/
        expect(function () {dm.findAllTransient(4711)}).to.throw(regexp)
        expect(function () {dm.findAllTransient(true)}).to.throw(regexp)
        expect(function () {dm.findAllTransient(false)}).to.throw(regexp)
        expect(function () {dm.findAllTransient({id: 'Country'})}).to.throw(regexp)
        expect(function () {dm.findAllTransient(['Country'])}).to.throw(regexp)
        expect(function () {dm.findAllTransient(function () {})}).to.throw(regexp)
    })

    it('should check for undefined class', function () {
        expect(function () {dm.findAllTransient('Unknown') }).to.throw(/^.*?is not defined.*?$/)
    })

    //   __ _           _   _   _ _ _____                     _            _                                   _
    //  / _(_)_ __   __| | /_\ | | /__   \_ __ __ _ _ __  ___(_) ___ _ __ | |_            __ _  ___   ___   __| |
    // | |_| | '_ \ / _` |//_\\| | | / /\/ '__/ _` | '_ \/ __| |/ _ \ '_ \| __|  _____   / _` |/ _ \ / _ \ / _` |
    // |  _| | | | | (_| /  _  \ | |/ /  | | | (_| | | | \__ \ |  __/ | | | |_  |_____| | (_| | (_) | (_) | (_| |
    // |_| |_|_| |_|\__,_\_/ \_/_|_|\/   |_|  \__,_|_| |_|___/_|\___|_| |_|\__|          \__, |\___/ \___/ \__,_|
    //                                                                                   |___/
    it('should find all transient objects of a given entity class', function () {
        dm.create('Person', {id: 'JHO', organizations: [{name: 'Foo'}, {name: 'Bar'}]})
        expect(dm.findAllTransient('Person')).to.have.lengthOf(0)
        expect(dm.findAllTransient('OrgUnit')).to.have.lengthOf(2)
    })

})
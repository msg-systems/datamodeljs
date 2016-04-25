/*
 **  DatamodelJS - Entity management
 **  Design and Development by msg Applied Technology Research
 **  Copyright (c) 2013 - 2016 msg systems ag (http://www.msg-systems.com/)
 */

/* jshint expr:true */
describe('DatamodelJS Datamanger API - destroyAll()', function () {
    var dm = datamodeljs.dm('destroyAll')
    require('../classes').defineClassesInDatamanager(dm)

    //      _           _                     _   _ _           _               _
    //   __| | ___  ___| |_ _ __ ___  _   _  /_\ | | |         | |__   __ _  __| |
    //  / _` |/ _ \/ __| __| '__/ _ \| | | |//_\\| | |  _____  | '_ \ / _` |/ _` |
    // | (_| |  __/\__ \ |_| | | (_) | |_| /  _  \ | | |_____| | |_) | (_| | (_| |
    //  \__,_|\___||___/\__|_|  \___/ \__, \_/ \_/_|_|         |_.__/ \__,_|\__,_|
    //                                |___/
    it('should check for wrong argument size', function () {
        var regexp = /^.*?missing arguments.*?$/
        expect(function () {dm.destroyAll()}).to.throw(regexp)

        expect(function () {dm.destroyAll('Country', {}, true) }).to.throw(/^.*?too many arguments.*?$/)
    })

    it('should check for wrong class name', function () {
        var regexp = /^.*?invalid entity class argument.*?$/
        expect(function () {dm.destroyAll(4711)}).to.throw(regexp)
        expect(function () {dm.destroyAll(true)}).to.throw(regexp)
        expect(function () {dm.destroyAll(false)}).to.throw(regexp)
        expect(function () {dm.destroyAll({id: 'Country'})}).to.throw(regexp)
        expect(function () {dm.destroyAll(['Country'])}).to.throw(regexp)
        expect(function () {dm.destroyAll(function () {})}).to.throw(regexp)
    })

    it('should check for undefined class', function () {
        expect(function () {dm.destroyAll('Unknown') }).to.throw(/^.*?is not defined.*?$/)
    })

    //      _           _                     _   _ _                                 _
    //   __| | ___  ___| |_ _ __ ___  _   _  /_\ | | |           __ _  ___   ___   __| |
    //  / _` |/ _ \/ __| __| '__/ _ \| | | |//_\\| | |  _____   / _` |/ _ \ / _ \ / _` |
    // | (_| |  __/\__ \ |_| | | (_) | |_| /  _  \ | | |_____| | (_| | (_) | (_) | (_| |
    //  \__,_|\___||___/\__|_|  \___/ \__, \_/ \_/_|_|          \__, |\___/ \___/ \__,_|
    //                                |___/                     |___/
    it('should destroyAll objects of a given entity class', function () {
        dm.define('Jokes', {id: '@string', text: 'string'})
        dm.create('Jokes', {id: '1', text: 'first joke'})
        dm.create('Jokes', {id: '2', text: 'second joke'})
        dm.create('Jokes', {id: '3', text: 'third joke'})
        expect(dm.findAll('Jokes')).to.have.lengthOf(3)

        dm.destroyAll('Jokes')
        expect(dm.findAll('Jokes')).to.have.lengthOf(0)
    })

})
/*
 **  DatamodelJS - Entity management
 **  Design and Development by msg Applied Technology Research
 **  Copyright (c) 2013 - 2016 msg systems ag (http://www.msg-systems.com/)
 */

/* jshint expr:true */
describe('DatamodelJS Datamanger API - findAll()', function () {
    var dm = datamodeljs.dm('findAll')
    require('../classes').defineClassesInDatamanager(dm)

    //   __ _           _   _   _ _           _               _
    //  / _(_)_ __   __| | /_\ | | |         | |__   __ _  __| |
    // | |_| | '_ \ / _` |//_\\| | |  _____  | '_ \ / _` |/ _` |
    // |  _| | | | | (_| /  _  \ | | |_____| | |_) | (_| | (_| |
    // |_| |_|_| |_|\__,_\_/ \_/_|_|         |_.__/ \__,_|\__,_|
    //
    it('should check for wrong argument size', function () {
        var regexp = /^.*?missing arguments.*?$/
        expect(function () {dm.findAll()}).to.throw(regexp)

        expect(function () {dm.findAll('Country', {}, true) }).to.throw(/^.*?too many arguments.*?$/)
    })

    it('should check for wrong class name', function () {
        var regexp = /^.*?invalid entity class argument.*?$/
        expect(function () {dm.findAll(4711)}).to.throw(regexp)
        expect(function () {dm.findAll(true)}).to.throw(regexp)
        expect(function () {dm.findAll(false)}).to.throw(regexp)
        expect(function () {dm.findAll({id: 'Country'})}).to.throw(regexp)
        expect(function () {dm.findAll(['Country'])}).to.throw(regexp)
        expect(function () {dm.findAll(function () {})}).to.throw(regexp)
    })

    it('should check for undefined class', function () {
        expect(function () {dm.findAll('Unknown') }).to.throw(/^.*?is not defined.*?$/)
    })

    //   __ _           _   _   _ _                                 _
    //  / _(_)_ __   __| | /_\ | | |           __ _  ___   ___   __| |
    // | |_| | '_ \ / _` |//_\\| | |  _____   / _` |/ _ \ / _ \ / _` |
    // |  _| | | | | (_| /  _  \ | | |_____| | (_| | (_) | (_) | (_| |
    // |_| |_|_| |_|\__,_\_/ \_/_|_|          \__, |\___/ \___/ \__,_|
    //                                        |___/
    it('should findAll objects of a given entity class', function () {
        dm.define('Jokes', {id: '@string', text: 'string'})
        dm.create('Jokes', {id: '1', text: 'first joke'})
        expect(dm.findAll('Jokes')).to.have.lengthOf(1)

        dm.create('Jokes', {id: '2', text: 'second joke'})
        var jokeThree = dm.create('Jokes', {id: '3', text: 'third joke'})
        expect(dm.findAll('Jokes')).to.have.lengthOf(3)

        dm.destroy('Jokes', jokeThree)
        expect(dm.findAll('Jokes')).to.have.lengthOf(3) // jokeThree is only flagged as deleted but still exists

        var jokeFour = dm.create('Jokes', {text: 'fourth joke'})
        dm.destroy('Jokes', jokeFour)             // transient object deletion
        expect(dm.findAll('Jokes')).to.have.lengthOf(3)

        dm.destroyAll('Jokes')
        expect(dm.findAll('Jokes')).to.have.lengthOf(0)
    })

})
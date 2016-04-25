/*
 **  DatamodelJS - Entity management
 **  Design and Development by msg Applied Technology Research
 **  Copyright (c) 2013 - 2016 msg systems ag (http://www.msg-systems.com/)
 */

/* jshint expr:true */
describe('DatamodelJS Datamanger API - findByExample()', function () {
    var dm = datamodeljs.dm('findByExample')
    require('../classes').defineClassesInDatamanager(dm)
    require('../objects').defineObjectsInDatamanager(dm)

    //   __ _           _   ___         __                           _                _               _
    //  / _(_)_ __   __| | / __\_   _  /__\_  ____ _ _ __ ___  _ __ | | ___          | |__   __ _  __| |
    // | |_| | '_ \ / _` |/__\// | | |/_\ \ \/ / _` | '_ ` _ \| '_ \| |/ _ \  _____  | '_ \ / _` |/ _` |
    // |  _| | | | | (_| / \/  \ |_| //__  >  < (_| | | | | | | |_) | |  __/ |_____| | |_) | (_| | (_| |
    // |_| |_|_| |_|\__,_\_____/\__, \__/ /_/\_\__,_|_| |_| |_| .__/|_|\___|         |_.__/ \__,_|\__,_|
    //                          |___/                         |_|
    it('should check for wrong argument size', function () {
        var regexp = /^.*?missing arguments.*?$/
        expect(function () {dm.findByExample()}).to.throw(regexp)
        expect(function () {dm.findByExample(4711)}).to.throw(regexp)
        expect(function () {dm.findByExample(true)}).to.throw(regexp)
        expect(function () {dm.findByExample(false)}).to.throw(regexp)
        expect(function () {dm.findByExample({id: 'Country'})}).to.throw(regexp)
        expect(function () {dm.findByExample(['Country'])}).to.throw(regexp)
        expect(function () {dm.findByExample(function () {})}).to.throw(regexp)

        expect(function () {dm.findByExample('Country', {}, true) }).to.throw(/^.*?too many arguments.*?$/)
    })

    it('should check for wrong class name', function () {
        var regexp = /^.*?invalid entity class argument.*?$/
        expect(function () {dm.findByExample(4711, {})}).to.throw(regexp)
        expect(function () {dm.findByExample(true, {})}).to.throw(regexp)
        expect(function () {dm.findByExample(false, {})}).to.throw(regexp)
        expect(function () {dm.findByExample({id: 'Country'}, {})}).to.throw(regexp)
        expect(function () {dm.findByExample(['Country'], {})}).to.throw(regexp)
        expect(function () {dm.findByExample(function () {}, {})}).to.throw(regexp)
    })

    it('should check for undefined class', function () {
        expect(function () {dm.findByExample('Unknown', {}) }).to.throw(/^.*?is not defined.*?$/)
    })

    it('should check the example structure for unknown attributes', function () {
        expect(function () {dm.findByExample('Country', {unknownField: 'DE'}) }).to.throw(/^.*?has no field.*?$/)
    })

    it('should check the example object for wrong attribute types', function () {
        expect(function () {dm.findByExample('OrgUnit', {name: ['XT']}) }).to.throw(/^.*?Given object data at field.*?$/)
    })

    //   __ _           _   ___         __                           _                                      _
    //  / _(_)_ __   __| | / __\_   _  /__\_  ____ _ _ __ ___  _ __ | | ___            __ _  ___   ___   __| |
    // | |_| | '_ \ / _` |/__\// | | |/_\ \ \/ / _` | '_ ` _ \| '_ \| |/ _ \  _____   / _` |/ _ \ / _ \ / _` |
    // |  _| | | | | (_| / \/  \ |_| //__  >  < (_| | | | | | | |_) | |  __/ |_____| | (_| | (_) | (_) | (_| |
    // |_| |_|_| |_|\__,_\_____/\__, \__/ /_/\_\__,_|_| |_| |_| .__/|_|\___|          \__, |\___/ \___/ \__,_|
    //                          |___/                         |_|                     |___/
    it('should find objects by simple example', function () {
        var allDE = dm.findByExample('Country', {name: 'Deutschland'})
        expect(allDE).to.have.lengthOf(1)
        expect(allDE[0].id).to.be.equal('DE')

        var allEmpty = dm.findByExample('Country', {name: ''})
        expect(allEmpty).to.have.length.above(0)
        expect(allEmpty[0].id).to.be.equal('CH')

        expect(dm.findByExample('Person', {firstName: ''})).to.have.length.above(0)

        dm.findByExample('Person', {organizations: dm.findById('OrgUnit', 'XT')}).should.not.have.length(0)
        dm.findByExample('Person', {organizations: [dm.findById('OrgUnit', 'XT'), dm.findById('OrgUnit', 'msg')]}).should.have.length(0)
    })

    it('should find objects by example with arrayed attributes', function () {
        expect(dm.findByExample('Person', {hobbies: []})).to.have.length.above(0)
        expect(dm.findByExample('Person', {hobbies: ['']})).to.have.length.above(0)
        expect(dm.findByExample('Person', {hobbies: ['skate']})).to.have.length.above(0)
        expect(dm.findByExample('Person', {hobbies: ['motorbike ride']})).to.have.length.above(0)
        expect(dm.findByExample('Person', {hobbies: ['motorbike ride', 'skate']})).to.have.length.above(0)
        expect(dm.findByExample('Person', {hobbies: ['motorbike ride', 'skate', 'diving']})).to.have.lengthOf(0)
    })

    it('should not find object by example with empty id', function () {
        expect(dm.findByExample('Country', {id: ''})).to.have.lengthOf(0)
    })

})
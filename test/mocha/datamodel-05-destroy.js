/*
 **  DatamodelJS - Entity management
 **  Design and Development by msg Applied Technology Research
 **  Copyright (c) 2013 - 2016 msg systems ag (http://www.msg-systems.com/)
 */

/* jshint expr:true */
describe('DatamodelJS Datamanger API - destroy()', function () {
    var dm = datamodeljs.dm('destroy')
    require('../classes').defineClassesInDatamanager(dm)

    //      _           _                             _               _
    //   __| | ___  ___| |_ _ __ ___  _   _          | |__   __ _  __| |
    //  / _` |/ _ \/ __| __| '__/ _ \| | | |  _____  | '_ \ / _` |/ _` |
    // | (_| |  __/\__ \ |_| | | (_) | |_| | |_____| | |_) | (_| | (_| |
    //  \__,_|\___||___/\__|_|  \___/ \__, |         |_.__/ \__,_|\__,_|
    //                                |___/
    it('should check for wrong argument size', function () {
        var regexp = /^.*?missing arguments.*?$/
        expect(function () {dm.destroy()}).to.throw(regexp)
        expect(function () {dm.destroy(4711)}).to.throw(regexp)
        expect(function () {dm.destroy(true)}).to.throw(regexp)
        expect(function () {dm.destroy(false)}).to.throw(regexp)
        expect(function () {dm.destroy({id: 'Country'})}).to.throw(regexp)
        expect(function () {dm.destroy(['Country'])}).to.throw(regexp)
        expect(function () {dm.destroy('Country')}).to.throw(regexp)
        expect(function () {dm.destroy(function () {})}).to.throw(regexp)

        expect(function () {dm.destroy('Country', {}, true, false) }).to.throw(/^.*?too many arguments.*?$/)
    })

    it('should check for wrong class name', function () {
        var regexp = /^.*?invalid entity class argument.*?$/
        expect(function () {dm.destroy(4711, {})}).to.throw(regexp)
        expect(function () {dm.destroy(true, {})}).to.throw(regexp)
        expect(function () {dm.destroy(false, {})}).to.throw(regexp)
        expect(function () {dm.destroy({id: 'Country'}, {})}).to.throw(regexp)
        expect(function () {dm.destroy(['Country'], {})}).to.throw(regexp)
        expect(function () {dm.destroy(function () {}, {})}).to.throw(regexp)
    })

    it('should check for wrong object parameter', function () {
        expect(function () {
            dm.destroy('Country', [
                {id: 'DE'}
            ])
        }).to.throw(/^.*?Object must be of type.*?$/)
    })

    it('should check for undefined class', function () {
        expect(function () {dm.destroy('Unknown', {}) }).to.throw(/^.*?is not defined.*?$/)
    })

    it('should check for object existance', function () {
        expect(function () {
            dm.destroy('Country', {id: 'DE'})
        }).to.throw(/^.*?object was not found in class.*?$/)
    })

    it('should check for double deletion', function () {
        expect(function () {
            var dummy = dm.create('Country', {id: 'Dummy', name: 'Nowhere'})
            dm.isTransient('Country', dummy, true)
            dm.destroy('Country', dummy)
            dm.destroy('Country', dummy)
        }).to.throw(/^.*?object was not found in class.*?$/)

    })

    //      _           _                                                   _
    //   __| | ___  ___| |_ _ __ ___  _   _            __ _  ___   ___   __| |
    //  / _` |/ _ \/ __| __| '__/ _ \| | | |  _____   / _` |/ _ \ / _ \ / _` |
    // | (_| |  __/\__ \ |_| | | (_) | |_| | |_____| | (_| | (_) | (_) | (_| |
    //  \__,_|\___||___/\__|_|  \___/ \__, |          \__, |\___/ \___/ \__,_|
    //                                |___/           |___/
    it('should mark an existing object as _isDeleted', function () {
        var china = dm.create('Country', {id: 'China', name: 'China'})
        dm.destroy('Country', china)
        china = dm.findById('Country', 'China')
        expect(china).to.exist
        expect(china._isDeleted).to.be.true
        expect(dm.isDeleted('Country', china)).to.be.true
    })

    it('should mark an already marked _isDeleted object as _isDeleted', function () {
        // china is created an example earlier
        var china = dm.findById('Country', 'China')
        expect(china).to.exist
        dm.destroy('Country', china)
        dm.destroy('Country', china)
        dm.destroy('Country', china)
        expect(dm.isDeleted('Country', china)).to.be.true
    })

    it('should delete an existing object with force', function () {
        var japan = dm.create('Country', {id: 'Japan', name: 'Japan'})
        dm.destroy('Country', japan, true)
        japan = dm.findById('Country', 'Japan')
        expect(japan).to.not.exist

    })
    it('should delete a transient object', function () {
        var nameOfBuxdehude = 'msg Buxdehude'
        // OrgUnit without a primary id is marked as transient
        var buxdehude = dm.create('OrgUnit', {
            name: nameOfBuxdehude,
            owner: 'HZ',
            country: 'DE'
        })
        expect(dm.isTransient('OrgUnit', buxdehude)).to.be.true
        expect(buxdehude._isTransient).to.be.true
        dm.destroy('OrgUnit', buxdehude)
        var allOrgUnits = dm.findAll('OrgUnit')
        for (var idx in allOrgUnits) {
            expect(allOrgUnits[idx].name).to.not.equal(nameOfBuxdehude)
        }

    })

})
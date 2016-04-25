/*
 **  DatamodelJS - Entity management
 **  Design and Development by msg Applied Technology Research
 **  Copyright (c) 2013 - 2016 msg systems ag (http://www.msg-systems.com/)
 */

/* jshint expr:true */
describe('DatamodelJS Datamanger API - create()', function () {
    var dm = datamodeljs.dm('create')
    require('../classes').defineClassesInDatamanager(dm)

    //                      _                 _               _
    //   ___ _ __ ___  __ _| |_ ___          | |__   __ _  __| |
    //  / __| '__/ _ \/ _` | __/ _ \  _____  | '_ \ / _` |/ _` |
    // | (__| | |  __/ (_| | ||  __/ |_____| | |_) | (_| | (_| |
    //  \___|_|  \___|\__,_|\__\___|         |_.__/ \__,_|\__,_|
    //
    it('should check for wrong argument size', function () {
        var regexp = /^.*?missing arguments.*?$/
        expect(function () {dm.create()}).to.throw(regexp)
        expect(function () {dm.create(4711)}).to.throw(regexp)
        expect(function () {dm.create(true)}).to.throw(regexp)
        expect(function () {dm.create(false)}).to.throw(regexp)
        expect(function () {dm.create({id: 'Country'})}).to.throw(regexp)
        expect(function () {dm.create(['Country'])}).to.throw(regexp)
        expect(function () {dm.create('Country')}).to.throw(regexp)
        expect(function () {dm.create(function () {})}).to.throw(regexp)
    })

    it('should check for wrong class name', function () {
        var regexp = /^.*?invalid entity class argument.*?$/
        expect(function () {dm.create(4711, {id: '1', name: 'Deutschland'})}).to.throw(regexp)
        expect(function () {dm.create(true, {id: '1', name: 'Deutschland'})}).to.throw(regexp)
        expect(function () {dm.create(false, {id: '1', name: 'Deutschland'})}).to.throw(regexp)
        expect(function () {dm.create(['DE'], {id: '1', name: 'Deutschland'})}).to.throw(regexp)
        expect(function () {dm.create({id: 1}, {id: '1', name: 'Deutschland'})}).to.throw(regexp)
        expect(function () {dm.create(function () {}, {id: '1', name: 'Deutschland'})}).to.throw(regexp)
    })

    it('should check for wrong field types', function () {
        var regexp = /^.*?defined as.*?is of type.*?$/
        expect(function () {dm.create('Country', {id: 49, name: 'Deutschland'})}).to.throw(regexp)
        expect(function () {dm.create('Country', {id: true, name: 'Deutschland'})}).to.throw(regexp)
        expect(function () {dm.create('Country', {id: false, name: 'Deutschland'})}).to.throw(regexp)
        expect(function () {dm.create('Country', {id: ['DE'], name: 'Deutschland'})}).to.throw(regexp)
        expect(function () {dm.create('Country', {id: {id: 'DE'}, name: 'Deutschland'})}).to.throw(regexp)
        expect(function () {dm.create('Country', {id: function () {}, name: 'Deutschland'})}).to.throw(regexp)
    })

    it('should check for undefined class', function () {
        expect(function () {dm.create('Unknown', {})}).to.throw(/^.*?is not defined.*?$/)
    })

    it('should check for empty class payload', function () {
        var regexp = /^.*?has no fields. Object creation failed..*?$/
        expect(function () {dm.create('Country', {}) }).to.throw(regexp)
        expect(function () {dm.create('Country', {constructor: function () {}}) }).to.throw(regexp)
    })

    it('should check for empty class payload of cascaded entities', function () {
        expect(function () {
            dm.create('Person', {id: 'HWA', firstName: 'Hans', lastName: 'Wagner', organizations: [{}]})
        }).to.throw(/^.*?Parameter payload for object creation of class\(OrgUnit\).*?$/)
        expect(dm.findById('Person', 'HWA')).to.not.exist

        expect(function () {
            dm.create('OrgUnit', {id: 'XIS', country: {}})
        }).to.throw(/^.*?Parameter payload for object creation of class\(Country\).*?$/)
        expect(dm.findById('OrgUnit', 'XIS')).to.not.exist

        expect(function () {
            dm.create('Person', {id: 'AFL', organizations: {id: 'XIS', country: {}}})
        }).to.throw(/^.*?Parameter payload for object creation of class\(Country\).*?$/)
        expect(dm.findById('OrgUnit', 'XIS')).to.not.exist
        expect(dm.findById('Person', 'AFL')).to.not.exist

    })

    it('should not allow creation of entities already existing', function () {
        expect(function () {
            dm.create('Country', {id: 'Dummy', name: 'Nowhere'})
            dm.create('Country', {id: 'Dummy', name: 'Else but Here'})
        }).to.throw(/^.*?already exists.*?$/)
    })

    it('should not create any object in case of a wrong entity within an object hierarchy', function () {
        expect(function () {
            dm.create('Person', {
                id: 'AFL', // AFL is new
                supervisor: {
                    id: 'SAFL', // SAFL is new
                    supervisor: {
                        id: 'SSAFL', // SSAFL is new
                        organizations: 'SXIS' // SXIS is new
                    },
                    organizations: 'XIS'
                },
                organizations: {
                    id: 'XIS',  // XIS is new
                    country: {} // illegal country
                }
            })
        }).to.throw(/^.*?Parameter payload for object creation of class\(Country\).*?$/)
        expect(dm.findById('OrgUnit', 'XIS')).to.not.exist
        expect(dm.findById('OrgUnit', 'SXIS')).to.not.exist
        expect(dm.findById('Person', 'AFL')).to.not.exist
        expect(dm.findById('Person', 'SAFL')).to.not.exist
        expect(dm.findById('Person', 'SSAFL')).to.not.exist
    })

    it('should check for invalid arity 0..1 references', function () {
        expect(function () {
            dm.create('Person', {
                id: 'RSE',
                firstName: 'Ralf',
                middleInitial: 'S',
                lastName: 'Engelschall',
                supervisor: [{
                    id: 'MWS',
                    firstName: 'Mark-W.',
                    lastName: 'Schmidt',
                    organizations: ['XT']
                }, 'HZ'],
                organizations: ['XT']
            })
        }).to.throw(/^.*too many relational objects - field\(supervisor\) has arity '\?' but 2 object are provided.*$/)
        expect(dm.findById('Person', 'MWS')).to.not.exist
        expect(dm.findById('Person', 'RSE')).to.not.exist
    })

    it('should check for invalid arity 1..* references', function () {
        expect(function () {
            dm.create('Person', {
                id: 'RSE',
                firstName: 'Ralf',
                middleInitial: 'S',
                lastName: 'Engelschall'
            })
        }).to.throw(/^.*missing relational objects - field\(organizations\) has arity '\+' but only 0 object are provided*$/)
        expect(dm.findById('Person', 'RSE')).to.not.exist
    })

    //                      _                                       _
    //   ___ _ __ ___  __ _| |_ ___            __ _  ___   ___   __| |
    //  / __| '__/ _ \/ _` | __/ _ \  _____   / _` |/ _ \ / _ \ / _` |
    // | (__| | |  __/ (_| | ||  __/ |_____| | (_| | (_) | (_) | (_| |
    //  \___|_|  \___|\__,_|\__\___|          \__, |\___/ \___/ \__,_|
    //                                        |___/
    it('should create simple entities', function () {
        var germany = dm.create('Country', {
            id: 'DE',
            name: 'Deutschland'
        })
        dm.create('Country', {
            id: 'CH',
            name: 'Schweiz'
        })
        expect(germany).to.be.an('object')
    })

    it('should create entities with entity references (objects)', function () {
        var germany = dm.findById('Country', 'DE')
        var msg = dm.create('OrgUnit', {
            id: 'msg',
            name: 'msg systems ag',
            country: germany
        })
        expect(msg).to.be.an('object')
        expect(msg.country).to.be.an('object')
        expect(msg.country).to.be.equal(germany)
    })

    it('should create entities with entity references (id only)', function () {
        var msgCH = dm.create('OrgUnit', {
            id: 'msg CH',
            name: 'msg systemsSchweiz',
            owner: 'HZ',
            country: 'CH'
        })
        expect(msgCH).to.be.an('object')
        expect(msgCH.owner).to.be.an('array')
        expect(msgCH.owner).to.be.eql([dm.findById('Person', 'HZ')])
        expect(msgCH.owner[0]._isStub).to.be.true
        expect(msgCH.country).to.be.equal(dm.findById('Country', 'CH'))
    })

    it('should create entities with references to the same entity class', function () {
        var msg = dm.findById('OrgUnit', 'msg')
        var xt = dm.create('OrgUnit', {
            id: 'XT',
            name: 'msg Applied Technology Research',
            owner: 'MWS',
            parent: msg,
            country: 'DE'
        })
        expect(xt).to.be.an('object')
        expect(xt.owner).to.be.an('array')
        expect(xt.owner).to.be.eql([dm.findById('Person', 'MWS')])
        expect(xt.parent).to.be.eql([msg])
    })

    it('should create entities with arity 0..1 references', function () {
        var mws = dm.create('Person', {
            id: 'MWS',
            firstName: 'Mark-W.',
            lastName: 'Schmidt',
            organizations: ['XT']
        })

        var rse = dm.create('Person', {
            id: 'RSE',
            firstName: 'Ralf',
            middleInitial: 'S',
            lastName: 'Engelschall',
            supervisor: 'MWS',
            organizations: ['XT']
        })
        expect(rse.supervisor).to.be.an('array')
        expect(rse.supervisor[0]).to.be.equal(mws)
    })

    it('should create entities with arity 1..* references', function () {
        var hra = dm.create('Person', {
            id: 'HRA',
            firstName: 'Hans',
            lastName: 'Ranft',
            organizations: ['XT', 'msg', 'msgCH']
        })
        expect(hra.organizations).to.be.an('array')
        expect(hra.organizations).to.have.lengthOf(3)
    })

    it('should create entities with arity 0..* references', function () {
        var jho = dm.create('Person', {
            id: 'JHO',
            firstName: 'Jochen',
            lastName: 'Hoertreiter',
            proxies: ['MWS', 'RSE', 'HRA'],
            organizations: ['XT']
        })
        expect(jho.proxies).to.be.an('array')
        expect(jho.proxies).to.have.lengthOf(3)
    })

    it('should create cascaded entities with a single create()', function () {
        var mmu = dm.create('Person', {
            id: 'MMU',
            firstName: 'Max',
            middleInitial: 'M',
            lastName: 'Mustermann',
            born: 1956,
            supervisor: {
                id: 'ARI',
                firstName: 'Adam',
                lastName: 'Riese',
                organizations: ['XT']
            },
            proxies: [{
                id: 'RRU',
                firstName: 'Rainer',
                lastName: 'Rübezahl',
                organizations: ['XT']
            }, {
                id: 'RSE', // beware RSE already exists - all attributes are ignored and the existing RSE is taken
                firstName: 'nicht Ralf',
                lastName: 'nicht Engelschall'
            }, 'MWS'],
            organizations: [{
                id: 'Musterliga',
                name: 'Musterliga',
                owner: 'MMU',
                country: 'FR'
            }]
        })
        var ari = dm.findById('Person', 'ARI')
        var rru = dm.findById('Person', 'RRU')
        var mws = dm.findById('Person', 'RRU')
        var musterliga = dm.findById('OrgUnit', 'Musterliga')
        var fr = dm.findById('Country', 'FR')
        var rse = dm.findById('Person', 'RSE')
        expect(mmu).to.exist
        expect(mmu._isStub).to.be.false
        expect(mmu.proxies).to.contain(mws)
        expect(mmu.proxies).to.contain(rse)
        expect(mmu.proxies).to.contain(rru)

        expect(ari).to.exist
        expect(ari._isStub).to.be.false

        expect(rru).to.exist
        expect(rru._isStub).to.be.false

        expect(musterliga).to.exist
        expect(musterliga._isStub).to.be.false
        expect(musterliga.owner).to.be.eql([mmu])

        expect(fr).to.exist
        expect(fr._isStub).to.be.true

        expect(rse).to.exist
        expect(rse._isStub).to.be.false
        expect(rse.lastName).to.be.equal('Engelschall')
    })

    it('should create transient objects when primary key is missing', function () {
        var biebl = dm.create('Person', {firstName: 'Biebl', organizations: ['XT']})
        expect(biebl).to.be.an('object')
        expect(biebl._isTransient).to.be.true

        var agile = dm.create('OrgUnit', {
            id: 'CoC Agile',
            owner: [biebl]         //TODO - Biebl will be created a second time when used here
        })
        expect(agile).to.be.an('object')
        expect(agile.owner).to.have.lengthOf(1)
        expect(agile.owner[0]).to.have.property('firstName', 'Biebl')
        expect(agile.country).to.not.exist
        expect(agile.owner[0]).to.have.property('_isTransient', true)
    })

    it('should not expose internal properties when cloning or stringifying entities', function () {
        var ltu = dm.create('Person', {
            id: 'LTU',
            firstName: 'Linda',
            lastName: 'Turke',
            supervisor: 'RSE',
            organizations: ['XT']
        })
        expect(ltu).to.have.ownProperty('_className')
        expect(ltu._className).to.be.equal('Person')

        var lda = JSON.stringify(dm.create('Person', {
            id: 'LDA',
            firstName: 'Lisa',
            lastName: 'Daske',
            organizations: ['msgCH']
        }))
        expect(lda).to.match(/^((?!(_className|_isStub|_isDirty|_isTransient|_isDeleted)).)*$/)
    })
})
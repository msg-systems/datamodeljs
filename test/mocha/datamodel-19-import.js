/*
 **  DatamodelJS - Entity management
 **  Design and Development by msg Applied Technology Research
 **  Copyright (c) 2013 - 2016 msg systems ag (http://www.msg-systems.com/)
 */

/* jshint expr:true */
describe('DatamodelJS Datamanger API - import()', function () {
    var dm = datamodeljs.dm('import')
    require('../classes').defineClassesInDatamanager(dm)
    require('../objects').defineObjectsInDatamanager(dm)

    //  _                            _             _               _
    // (_)_ __ ___  _ __   ___  _ __| |_          | |__   __ _  __| |
    // | | '_ ` _ \| '_ \ / _ \| '__| __|  _____  | '_ \ / _` |/ _` |
    // | | | | | | | |_) | (_) | |  | |_  |_____| | |_) | (_| | (_| |
    // |_|_| |_| |_| .__/ \___/|_|   \__|         |_.__/ \__,_|\__,_|
    //             |_|
    it('should check for wrong argument size', function () {
        var regexp = /^.*?missing arguments.*?$/
        expect(function () {dm.import()}).to.throw(regexp)
        expect(function () {dm.import(4711)}).to.throw(regexp)
        expect(function () {dm.import(true)}).to.throw(regexp)
        expect(function () {dm.import(false)}).to.throw(regexp)
        expect(function () {dm.import({id: 'Country'})}).to.throw(regexp)
        expect(function () {dm.import(['Country'])}).to.throw(regexp)
        expect(function () {dm.import(function () {})}).to.throw(regexp)

        expect(function () {dm.import('Country', {}, true, false) }).to.throw(/^.*?too many arguments.*?$/)
    })

    it('should check for wrong class name', function () {
        var regexp = /^.*?invalid entity class argument.*?$/
        expect(function () {dm.import(4711, {}, {})}).to.throw(regexp)
        expect(function () {dm.import(true, {}, {})}).to.throw(regexp)
        expect(function () {dm.import(false, {}, {})}).to.throw(regexp)
        expect(function () {dm.import({id: 'Country'}, {}, {})}).to.throw(regexp)
        expect(function () {dm.import(['Country'], {}, {})}).to.throw(regexp)
        expect(function () {dm.import(function () {}, {}, {})}).to.throw(regexp)
    })

    it('should check for undefined class', function () {
        expect(function () {dm.import('Unknown', {}, {}) }).to.throw(/^.*?is not defined.*?$/)
    })

    it('should check for object existence', function () {
        expect(function () {dm.import('Country', {id: 'Madagaskar'}, {})}).to.throw(/^.*?Can not find an object that matches the given obj.*?$/)
    })

    it('should not import into stub objects', function () {
        expect(function () {dm.import('Person', {id: 'HZ'}, {}); }).to.throw(/^.*?Given obj is a stub object.*?$/)
    })

    it('should not import into deleted object ("forced" destroy)', function () {
        var ihme = dm.create('Person', {id: 'AIH', lastName: 'Ihme', organizations: ['ABC']})
        expect(ihme).to.be.an('object')
        dm.destroy('Person', ihme, true)
        expect(function () {dm.import('Person', ihme, {id: 'AIH', firstName : 'Andre'}) }).to.throw(/^.*?Can not find an object that matches the given obj.*?$/)
    })

    it('should validate import structure', function () {
        expect(function () {dm.import('Person', {id: 'JHO'}, {husten: true}); }).to.throw(/^.*?has no field.*?$/);
    })

    it('should not import a object with a primary key into object with valid primary key', function () {
        var ihme = dm.create('Person', {id: 'AIH', lastName: 'Ihme', organizations: ['ABC']})
        expect(ihme).to.be.an('object')
        expect(ihme.id).to.be.equal('AIH')
        expect(function () {dm.import('Person', ihme, {id: "XXX"})}).to.throw(/^.*?object with primaryKeyValue.*?into object with primaryKeyValue.*?$/)

        dm.destroy('Person', ihme, true)
    })

    it('should not create cascaded entities due import when they have invalid field', function () {
        var ph = dm.create('OrgUnit', {
            id: 'ph',
            name: 'Planet Home',
            owner: 'RSE'
        })
        expect(function () {dm.import('OrgUnit', ph, {
            id: 'ph',
            name: 'Planet Home neu',
            owner:  {
                id: 'LZE',
                firstName: 'Linda',
                lastName: 'Zeman',
                organizations: ['XT'],
                invalidAttr: "Test"
            }
        })}).to.throw(/^.*?class.*?has no field.*?defined. Object is not valid..*?$/)
        expect(dm.findById('Person', 'LZE')).to.not.exist

        expect(function () {dm.import('OrgUnit', ph, {
            id: 'ph',
            name: 'Planet Home neu',
            owner:  {
                id: 'LZE',
                firstName: 'Linda',
                lastName: 'Zeman',
                organizations: [ {
                    id: 'ph2',
                    name: 'Planet Home 2',
                    invalidAttr: "Test"
                }]
            }
        })}).to.throw(/^.*?class.*?has no field.*?defined. Object is not valid..*?$/)
        expect(dm.findById('OrgUnit', 'ph2')).to.not.exist
        expect(dm.findById('Person', 'LZE')).to.not.exist

        expect(ph).to.exist

        dm.destroy('OrgUnit', ph, true)
    })


    it('should not import into stub objects', function () {
        var ph = dm.create('OrgUnit', {
            id: 'ph',
            name: 'Planet Home',
            owner: 'LZE'
        })

        expect(function () {dm.import('OrgUnit', ph, {
            id: 'ph',
            name: 'Planet Home neu',
            owner: {
                id: 'LZE',
                firstName: "Linda"
            }
        })}).to.throw(/^.*?Given obj is a stub object.*?$/)


        var lze = dm.findById('Person', 'LZE')
        expect(lze).to.have.property('_isStub', true)

        dm.destroy('Person', lze, true)
        dm.destroy('OrgUnit', ph, true)
    })

    //  _                            _                                   _
    // (_)_ __ ___  _ __   ___  _ __| |_            __ _  ___   ___   __| |
    // | | '_ ` _ \| '_ \ / _ \| '__| __|  _____   / _` |/ _ \ / _ \ / _` |
    // | | | | | | | |_) | (_) | |  | |_  |_____| | (_| | (_) | (_) | (_| |
    // |_|_| |_| |_| .__/ \___/|_|   \__|          \__, |\___/ \___/ \__,_|
    //             |_|                             |___/
    it('should import attributes into existing entities', function () {
        var jho = dm.findById('Person', 'JHO')
        expect(jho).to.exist

        jho = dm.import('Person', {id: 'JHO'}, {firstName: 'Jochen', lastName: 'Hörtreiter', supervisor: 'JHO'});
        expect(jho).to.exist
        expect(jho.firstName).to.be.equal('Jochen')
        expect(jho.lastName).to.be.equal('Hörtreiter')
        expect(jho.supervisor).to.be.eql([jho])
    })

    it('should be the same object after importing', function () {
        var ihme = dm.create('Person', {id: 'AIH', lastName: 'Ihme', organizations: ['ABC']})
        var ihme2 = dm.import('Person', ihme, {id: 'AIH', firstName : 'Andre'})
        expect(ihme).to.be.equal(ihme2)

        dm.destroy('Person', ihme, true)
    })

    it('should import into deleted object (was destroyed "soft")', function () {
        var ihme = dm.create('Person', {id: 'AIH', lastName: 'Ihme', organizations: ['ABC']})
        expect(ihme).to.be.an('object')
        dm.destroy('Person', ihme)
        expect(ihme._isDeleted).to.be.true
        dm.import('Person', ihme, {id: 'AIH', firstName : 'Andre'})
        expect(ihme._isDeleted).to.be.true

        dm.destroy('Person', ihme, true)
    })

    it('should import into dirty object', function () {
        var ihme = dm.create('Person', {id: 'AIH', lastName: 'Ihme', organizations: ['ABC']})
        expect(ihme._isDirty).to.be.false
        dm.isDirty('Person', ihme, true)
        expect(ihme._isDirty).to.be.true
        dm.import('Person', ihme, {id: 'AIH', firstName : 'Andre'})
        expect(ihme._isDirty).to.be.true
        expect(ihme.firstName).to.be.equal('Andre')

        dm.destroy('Person', ihme, true)
    })

    it('should import into transient object', function () {
        var ihme = dm.create('Person', {id: 'AIH', lastName: 'Ihme', organizations: ['ABC']})
        expect(ihme._isTransient).to.be.false
        dm.isTransient('Person', ihme, true)
        expect(ihme._isTransient).to.be.true
        dm.import('Person', ihme, {id: 'AIH', firstName : 'Andre'})
        expect(ihme._isTransient).to.be.true
        expect(ihme.firstName).to.be.equal('Andre')

        dm.destroy('Person', ihme, true)
    })

    it('should import cascaded entities with a single import()', function () {
        dm.create('OrgUnit', { id: 'XIS', name: 'Security'})
        dm.create('Person', {id: 'BIH', firstName: "Brian", lastName: 'Ihme', organizations: ['XIS']})
        var ca = dm.create('Country', {id: 'CA', name: 'Canada'})
        var hla = dm.create('Person', {
            id: 'HLA',
            firstName: 'Heiner',
            middleInitial: 'L',
            lastName: 'Lauterbach',
            born: 1956,
            supervisor: {
                id: 'ERI',
                firstName: 'Eva',
                lastName: 'Riese',
                organizations: ['XT']
            },
            proxies: [{
                id: 'MRU',
                firstName: 'Moritz',
                lastName: 'Rübezahl',
                organizations: ['XT']
            }, 'MLL'],
            organizations: [{
                id: 'Musterfrau',
                name: 'Musterfrau',
                owner: 'MRU',
                country: 'IT'
            }]
        })
        hla = dm.import('Person', hla, {
            id: 'HLA',
            firstName: 'Heiner neu',
            middleInitial: 'L',
            lastName: 'Lauterbach',
            born: 1956,
            supervisor: {
                id: 'ERI',
                firstName: 'Eva neu',
                lastName: 'Riese',
                organizations: ['XT'],
                supervisor: 'BIH'
            },
            proxies: [{
                id: 'MRU',
                firstName: 'Moritz neu',
                lastName: 'Rübezahl',
                organizations: ['XIS']
            }, {
                id: 'BIH',
                firstName: 'Brian neu',
                lastName: 'Ihme neu'
            }],
            organizations: [{
                id: 'Musterfrau',
                name: 'Musterfrau neu',
                owner: 'BIH',
                country: 'CA'
            }]
        })

        var bih = dm.findById('Person', 'BIH')
        // String in cascaded object has changed
        expect(bih.lastName).to.be.equal('Ihme neu')


        var eri = dm.findById('Person', 'ERI')
        // String in cascaded object has changed
        expect(eri.firstName).to.be.equal('Eva neu')

        var xis = dm.findById('OrgUnit', 'XIS')
        var mru = dm.findById('Person', 'MRU')
        // String in cascaded object has changed
        expect(mru.firstName).to.be.equal('Moritz neu')
        // Array in cascaded object has changed
        expect(mru.organizations).to.be.eql([xis])

        var musterfrau = dm.findById('OrgUnit', 'Musterfrau')
        // String in cascaded object has changed
        expect(musterfrau.name).to.be.equal('Musterfrau neu')
        // Array in cascaded object has changed
        expect(musterfrau.owner).to.be.eql([bih])
        // Object in cascaded object has changed
        expect(musterfrau.country).to.be.equal(ca)


        var mll = dm.findById('Person', 'MLL')
        // String has changed
        expect(hla.firstName).to.be.equal('Heiner neu')
        // Array has changed
        expect(hla.proxies).to.contain(bih)
        expect(hla.proxies).to.not.contain(mll)


        dm.destroy('Person', hla, true)
        dm.destroy('Person', bih, true)
        dm.destroy('Person', eri, true)
        dm.destroy('Person', mru, true)
        dm.destroy('Person', mll, true)
        dm.destroy('OrgUnit', musterfrau, true)
        dm.destroy('OrgUnit', xis, true)
        dm.destroy('Country', dm.findById('Country', 'IT'), true)
        dm.destroy('Country', ca, true)
    })

    it('should import cascaded entities with changed primitive data types in first level', function () {
        var xis = dm.create('OrgUnit', { id: 'XIS', name: 'Security'})
        var hla = dm.create('Person', {
            id: 'HLA',
            firstName: 'Heiner',
            middleInitial: 'L',
            lastName: 'Lauterbach',
            born: 1956,
            supervisor: {
                id: 'ERI',
                firstName: 'Eva',
                lastName: 'Riese',
                organizations: ['XT']
            },
            proxies: [{
                id: 'MRU',
                firstName: 'Moritz',
                lastName: 'Rübezahl',
                organizations: ['XT']
            }, {
                id: 'BIH',
                firstName: 'Brian',
                lastName: 'Ihme',
                organizations: ['XIS']
            }],
            organizations: [{
                id: 'Musterfrau',
                name: 'Musterfrau',
                owner: 'MRU',
                country: 'IT'
            }]
        })
        hla = dm.import('Person', hla, {
            id: 'HLA',
            supervisor: {
                id: 'ERI',
                firstName: 'Eva neu'
            },
            proxies: [{
                id: 'MRU',
                firstName: 'Moritz neu'
            }, {
                id: 'BIH',
                firstName: 'Brian neu'
            }],
            organizations: [{
                id: 'Musterfrau',
                name: 'Musterfrau neu'
            }]
        })

        var bih = dm.findById('Person', 'BIH')
        // String in cascaded object has changed
        expect(bih.firstName).to.be.equal('Brian neu')


        var eri = dm.findById('Person', 'ERI')
        // String in cascaded object has changed
        expect(eri.firstName).to.be.equal('Eva neu')

        var mru = dm.findById('Person', 'MRU')
        // String in cascaded object has changed
        expect(mru.firstName).to.be.equal('Moritz neu')

        var musterfrau = dm.findById('OrgUnit', 'Musterfrau')
        // String in cascaded object has changed
        expect(musterfrau.name).to.be.equal('Musterfrau neu')


        dm.destroy('Person', hla, true)
        dm.destroy('Person', bih, true)
        dm.destroy('Person', eri, true)
        dm.destroy('Person', mru, true)
        dm.destroy('OrgUnit', musterfrau, true)
        dm.destroy('OrgUnit', xis, true)
        dm.destroy('Country', dm.findById('Country', 'IT'), true)
    })

    it('should import cascaded entities with changed primitive data types in second and third level', function () {
        var hla = dm.create('Person', {
            id: 'HLA',
            firstName: 'Heiner',
            middleInitial: 'L',
            lastName: 'Lauterbach',
            born: 1956,
            supervisor: {
                id: 'ERI',
                firstName: 'Eva',
                lastName: 'Riese',
                organizations: [{ id: 'XIS', name: 'Security'}]
            },
            proxies: [{
                id: 'MRU',
                firstName: 'Moritz',
                lastName: 'Rübezahl',
                organizations: ['XT']
            }, {
                id: 'BIH',
                firstName: 'Brian',
                lastName: 'Ihme',
                organizations: ['XIS']
            }],
            organizations: [{
                id: 'Musterfrau',
                name: 'Musterfrau',
                owner: {
                    id: 'BMA',
                    firstName: 'Biene',
                    lastName: 'Maya',
                    organizations: [{ id: 'Biene', name: 'Bienenland'}]
                },
                country: 'IT'
            }]
        })
        hla = dm.import('Person', hla, {
            id: 'HLA',
            supervisor: {
                id: 'ERI',
                organizations: [{ id: 'XIS', name: 'Security neu'}]
            },
            organizations: [{
                id: 'Musterfrau',
                owner: {
                    id: 'BMA',
                    firstName: 'Biene neu',
                    lastName: 'Maya',
                    organizations: [{ id: 'Biene', name: 'Bienenland neu'}]
                }
            }]
        })

        var bih = dm.findById('Person', 'BIH')
        var eri = dm.findById('Person', 'ERI')
        var mru = dm.findById('Person', 'MRU')

        var biene = dm.findById('Person', 'BMA')
        expect(biene.firstName).to.be.equal('Biene neu')
        var orgBiene = dm.findById('OrgUnit', 'Biene')
        expect(orgBiene.name).to.be.equal('Bienenland neu')

        var musterfrau = dm.findById('OrgUnit', 'Musterfrau')

        var xis = dm.findById('OrgUnit', 'XIS')
        expect(xis.name).to.be.equal('Security neu')

        dm.destroy('Person', hla, true)
        dm.destroy('Person', bih, true)
        dm.destroy('Person', eri, true)
        dm.destroy('Person', mru, true)
        dm.destroy('Person', biene, true)
        dm.destroy('OrgUnit', musterfrau, true)
        dm.destroy('OrgUnit', orgBiene, true)
        dm.destroy('OrgUnit', xis, true)
        dm.destroy('Country', dm.findById('Country', 'IT'), true)
    })

    it('should import cascaded entities with changed references in deeper levels', function () {
        var xis = dm.create('OrgUnit', { id: 'XIS', name: 'Security'})
        var ca = dm.create('Country', {id: 'CA', name: 'Canada'})
        var hla = dm.create('Person', {
            id: 'HLA',
            firstName: 'Heiner',
            middleInitial: 'L',
            lastName: 'Lauterbach',
            born: 1956,
            supervisor: {
                id: 'ERI',
                firstName: 'Eva',
                lastName: 'Riese',
                organizations: ['XT']
            },
            proxies: [{
                id: 'MRU',
                firstName: 'Moritz',
                lastName: 'Rübezahl',
                organizations: [{
                    id: 'XIS2',
                    name: 'Security 2',
                    owner: [
                        {
                            id: 'BIH3',
                            firstName: 'Brian3',
                            lastName: 'Ihme',
                            organizations: [{ id: 'XIS3', name: 'Security 3'}]
                        },
                        {
                            id: 'BIH4',
                            firstName: 'Brian4',
                            lastName: 'Ihme',
                            organizations: [{ id: 'XIS4', name: 'Security 4'}]
                        }
                    ]
                }]
            }, {
                id: 'BIH',
                firstName: 'Brian',
                lastName: 'Ihme',
                organizations: ['XIS']
            }],
            organizations: [{
                id: 'Musterfrau',
                name: 'Musterfrau',
                owner: 'MRU',
                country: 'IT'
            }]
        })
        hla = dm.import('Person', hla, {
            id: 'HLA',
            supervisor: {
                id: 'ERI',
                organizations: ['XIS']
            },
            proxies: [{
                id: 'MRU',
                organizations: [{
                    id: 'XIS2',
                    name: 'Security 2',
                    owner: {
                        id: 'BIH3',
                        firstName: 'Brian3',
                        lastName: 'Ihme',
                        organizations: [{ id: 'XIS5', name: 'Security 5'}]
                    }
                }]
            }, {
                id: 'BIH2',
                firstName: 'Brian 2',
                organizations: ['XIS']
            }],
            organizations: [{
                id: 'Musterfrau',
                owner: 'ERI',
                country: ca
            }]
        })

        var bih = dm.findById('Person', 'BIH')
        var bih2 = dm.findById('Person', 'BIH2')
        var bih3 = dm.findById('Person', 'BIH3')
        var xis5 = dm.findById('OrgUnit', 'XIS5')

        var eri = dm.findById('Person', 'ERI')
        // String in cascaded object has changed
        expect(eri.organizations.length).to.be.equal(1)
        expect(eri.organizations).to.contain(xis)

        var mru = dm.findById('Person', 'MRU')
        var xis2 = dm.findById('OrgUnit', 'XIS2')
        expect(mru.organizations.length).to.be.equal(1)
        expect(mru.organizations).to.contain(xis2)

        expect(xis2.owner).to.contain(bih3)
        expect(xis2.owner.length).to.be.equal(1)

        expect(bih3.organizations.length).to.be.equal(1)
        expect(bih3.organizations).to.contain(xis5)

        var musterfrau = dm.findById('OrgUnit', 'Musterfrau')
        // String in cascaded object has changed
        expect(musterfrau.country).to.be.equal(ca)


        expect(hla.proxies).to.contain(mru)
        expect(hla.proxies).to.contain(bih2)
        expect(hla.proxies.length).to.be.equal(2)


        dm.destroy('Person', hla, true)
        dm.destroy('Person', eri, true)
        dm.destroy('Person', mru, true)
        dm.destroy('Person', bih, true)
        dm.destroy('Person', bih2, true)
        dm.destroy('Person', bih3, true)
        dm.destroy('Person', dm.findById('Person', 'BIH4'), true)
        dm.destroy('OrgUnit', musterfrau, true)
        dm.destroy('OrgUnit', xis, true)
        dm.destroy('OrgUnit', xis2, true)
        dm.destroy('OrgUnit', dm.findById('OrgUnit', 'XIS3'), true)
        dm.destroy('OrgUnit', dm.findById('OrgUnit', 'XIS4'), true)
        dm.destroy('Country', dm.findById('Country', 'IT'), true)
        dm.destroy('Country', ca, true)
    })

    it('should create cascaded entites due import (stub and non stub)', function () {
        var hla = dm.create('Person', {
            id: 'HLA',
            firstName: 'Heiner',
            middleInitial: 'L',
            lastName: 'Lauterbach',
            born: 1956,
            organizations: ['XT']
        })
        var bihBefore = dm.findById('Person', 'BIH')
        var xt2Before = dm.findById('OrgUnit', 'XT2')
        hla = dm.import('Person', hla, {
            id: 'HLA',
            supervisor: {
                id: 'ERI',
                firstName: 'Eva',
                lastName: 'Riese',
                organizations: ['XT']
            },
            proxies: [{
                id: 'BIH',
                firstName: 'Brian',
                lastName: 'Ihme',
                organizations: ['XIS'],
                supervisor: {
                    id: 'MRU',
                    firstName: 'Moritz',
                    lastName: 'Rübezahl',
                    organizations: ['XT2']
                }
            }],
            organizations: [{
                id: 'Musterfrau',
                name: 'Musterfrau',
                owner: 'MRU',
                country: 'IT'
            }]
        })

        var bih = dm.findById('Person', 'BIH')
        expect(bihBefore).to.not.exist
        expect(bih).to.exist
        expect(bih._isStub).to.be.false

        var eri = dm.findById('Person', 'ERI')
        expect(eri).to.exist
        expect(eri._isStub).to.be.false

        var mru = dm.findById('Person', 'MRU')
        expect(mru).to.exist
        expect(mru._isStub).to.be.false

        var musterfrau = dm.findById('OrgUnit', 'Musterfrau')
        expect(musterfrau).to.exist
        expect(musterfrau._isStub).to.be.false

        var xis = dm.findById('OrgUnit', 'XIS')
        expect(xis).to.exist
        expect(xis._isStub).to.be.true

        var xt2 = dm.findById('OrgUnit', 'XT2')
        expect(xt2Before).to.not.exist
        expect(xt2).to.exist
        expect(xt2._isStub).to.be.true


        dm.destroy('Person', hla, true)
        dm.destroy('Person', bih, true)
        dm.destroy('Person', eri, true)
        dm.destroy('Person', mru, true)
        dm.destroy('OrgUnit', musterfrau, true)
        dm.destroy('OrgUnit', xis, true)
        dm.destroy('OrgUnit', xt2, true)
        dm.destroy('Country', dm.findById('Country', 'IT'), true)
    })

    it('should create a transient object in first level', function () {
        var ph = dm.create('OrgUnit', {
            id: 'ph',
            name: 'Planet Home',
            owner: 'RSE'
        })

        dm.import('OrgUnit', ph, {
            id: 'ph',
            owner:  {firstName: 'Biebl', organizations: ['XT']}
        })

        expect(ph.owner[0]).to.have.property('_isTransient', true)
        expect(ph.owner[0]).to.have.property('_isStub', false)

        dm.destroy("Person", dm.findAllTransient("Person")[0], true)
        dm.destroy('OrgUnit', ph, true)
    })

    it('should create a stub object in first level', function () {
        var ph = dm.create('OrgUnit', {
            id: 'ph',
            name: 'Planet Home',
            owner: 'RSE'
        })

        dm.import('OrgUnit', ph, {
            id: 'ph',
            owner:  'Biebl'
        })

        var biebl = dm.findById("Person", "Biebl")
        expect(biebl).to.exist
        expect(biebl).to.have.property('_isStub', true)
        expect(biebl).to.have.property('_isTransient', false)

        dm.destroy("Person", biebl, true)
        dm.destroy('OrgUnit', ph, true)
    })

    it('should use only id on import in first level', function () {
        var biebl = dm.create('Person', {
            id: 'Biebl',
            firstName: 'Biebl',
            organizations: 'XT'
        })

        var ph = dm.create('OrgUnit', {
            id: 'ph',
            name: 'Planet Home',
            owner: 'RSE'
        })

        dm.import('OrgUnit', ph, {
            id: 'ph',
            owner: 'Biebl'
        })

        expect(biebl).to.exist
        expect(biebl).to.have.property('_isStub', false)
        expect(biebl).to.have.property('_isTransient', false)
        expect(biebl).to.equal(ph.owner[0])

        dm.destroy("Person", biebl, true)
        dm.destroy('OrgUnit', ph, true)
    })

    // TODO - more tests for import

})
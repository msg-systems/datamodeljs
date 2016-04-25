/*
 **  DatamodelJS - Entity management
 **  Design and Development by msg Applied Technology Research
 **  Copyright (c) 2013 - 2016 msg systems ag (http://www.msg-systems.com/)
 */

module.exports.defineObjectsInDatamanager = function (dm) {
    var germany = dm.create('Country', {id: 'DE', name: 'Deutschland'})
    var msg = dm.create('OrgUnit', {id: 'msg', name: 'msg systems ag', owner: 'HZ', country: germany})
    dm.create('OrgUnit', {id: 'msgCH', name: 'msg Schweiz', owner: 'HZ', country: 'CH'})
    var xt = dm.create('OrgUnit', {id: 'XT', name: 'msg Applied Technology Research', owner: 'MWS', parent: msg, country: 'AT'})
    var mws = dm.create('Person', {id: 'MWS', firstName: 'Mark-W.', lastName: 'Schmidt', born: 1971, organizations: [xt], hobbies: ['motorbike ride']})
    var rse = dm.create('Person', {
        id: 'RSE',
        firstName: 'Ralf',
        middleInitial: 'S',
        lastName: 'Engelschall',
        born: 1972,
        hobbies: ['skate', 'motorbike ride'],
        supervisor: 'MWS',
        proxies: [mws, 'JHO'],
        organizations: ['XT']
    })
    dm.create('Hacker', {
        id: 'HCK',
        firstName: 'Fuh',
        lastName: 'Manschu',
        born: 1878,
        hobbies: ['skate'],
        supervisor: 'RSE',
        hackerCode: 'Buboh',
        organizations: ['XT']
    })
    dm.create('Person', {id: 'JHO', firstName: 'Jochen', lastName: 'Hoertreiter', supervisor: rse, organizations: [xt], hobbies: ['']})

    dm.create('Person', {
        id: 'MMU',
        firstName: 'Max',
        middleInitial: 'M',
        lastName: 'Mustermann',
        born: 1956,
        supervisor: {id: 'ARI', firstName: 'Adam', lastName: 'Riese', organizations: ['XT']},
        proxies: [{id: 'RRU', firstName: 'Rainer', lastName: 'Rübezahl', organizations: ['XT']},
            {
                id: 'RSE', // beware RSE already exists - all attributes are ignored and the existing RSE is taken            firstName: 'nicht Ralf',
                lastName: 'nicht Engelschall'
            }, 'MWS'],
        organizations: [{id: 'Musterliga', name: 'Musterliga', owner: 'MMU', country: 'FR'}]
    })
}
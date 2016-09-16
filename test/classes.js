/*
 **  DatamodelJS - Entity management
 **  Design and Development by msg Applied Technology Research
 **  Copyright (c) 2013 - 2016 msg systems ag (http://www.msg-systems.com/)
 */

module.exports.defineClassesInDatamanager = function (dm) {
    dm.define("Country", {
        id: '@string',
        name: 'string'
    });

    dm.define("OrgUnit", {
        id: '@string',
        name: 'string',
        owner: 'Person*',
        parent: 'OrgUnit?',
        country: 'Country'
    });

    dm.define("Person", {
        id: '@string',
        firstName: 'string',
        middleInitial: 'string',
        lastName: 'string',
        born: 'number',
        hobbies: 'string*',
        proxies: 'Person*',
        supervisor: 'Person?',
        organizations: 'OrgUnit+',
        address: 'object'
    });


    dm.define("Hacker", ["Person"], {
        hackerCode: 'string'
    });

    dm.define("Nerd", "Hacker", {});
}
/*
 **  DatamodelJS - Entity management
 **  Design and Development by msg Applied Technology Research
 **  Copyright (c) 2013 - 2016 msg systems ag (http://www.msg-systems.com/)
 */

/* jshint expr:true */
describe('DatamodelJS Datamanger API - undefine()', function () {
    var dm = datamodeljs.dm('undefine')

    //                  _       __ _                      _               _
    //  _   _ _ __   __| | ___ / _(_)_ __   ___          | |__   __ _  __| |
    // | | | | '_ \ / _` |/ _ \ |_| | '_ \ / _ \  _____  | '_ \ / _` |/ _` |
    // | |_| | | | | (_| |  __/  _| | | | |  __/ |_____| | |_) | (_| | (_| |
    //  \__,_|_| |_|\__,_|\___|_| |_|_| |_|\___|         |_.__/ \__,_|\__,_|
    //
    it('should check for wrong argument size', function () {
        expect(function () {dm.undefine() }).to.throw(/^.*?missing arguments.*?$/);
        expect(function () {dm.undefine("Person", "Hacker") }).to.throw(/^.*?too many arguments.*?$/);
    })

    it('should check for wrong class name', function () {
        var regexp = /^.*?invalid entity class argument.*?$/
        expect(function () {dm.undefine(4711) }).to.throw(regexp);
        expect(function () {dm.undefine(["Person"]) }).to.throw(regexp);
        expect(function () {dm.undefine({id: "Person"}) }).to.throw(regexp);
        expect(function () {dm.undefine(true)}).to.throw(regexp);
        expect(function () {dm.undefine(false) }).to.throw(regexp);
        expect(function () {dm.undefine(function () {}) }).to.throw(regexp);
    })

    it('should check for undefined class', function () {
        expect(function () {dm.undefine("Unknown") }).to.throw(/^.*?is not defined.*?$/);
    })

    //                  _       __ _                                            _
    //  _   _ _ __   __| | ___ / _(_)_ __   ___            __ _  ___   ___   __| |
    // | | | | '_ \ / _` |/ _ \ |_| | '_ \ / _ \  _____   / _` |/ _ \ / _ \ / _` |
    // | |_| | | | | (_| |  __/  _| | | | |  __/ |_____| | (_| | (_) | (_) | (_| |
    //  \__,_|_| |_|\__,_|\___|_| |_|_| |_|\___|          \__, |\___/ \___/ \__,_|
    //                                                    |___/
    it('should undefine class', function () {
        dm.define('Nerd', {id: '@number'});
        expect(dm.entityClasses.Nerd).to.be.a('function')
        dm.undefine("Nerd")
        expect(dm.entityClasses.Nerd).to.not.exist
    })

})
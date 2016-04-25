/*
 **  DatamodelJS - Entity management
 **  Design and Development by msg Applied Technology Research
 **  Copyright (c) 2013 - 2016 msg systems ag (http://www.msg-systems.com/)
 */

/* global dm: false */
/* jshint expr:true */
describe('DatamodelJS API Management', function () {
    describe('symbol()', function () {
        if (typeof module === "object" && typeof exports === "object") {
            it("cannot be tested in Node's CommonJS environment", function () {
                /*  cannot be tested  */
            })
        } else {
            it("should rename to global.datamodeljs to global.dm", function () {
                datamodeljs.symbol("dm")
                expect(global.dm).to.exist()
                expect(global.datamodeljs).to.not.exist()
            })
            it("should remove the global.dm symbol and reestablish global.datamodeljs", function () {
                dm.symbol()
                expect(global.dm).to.not.exist()
                expect(global.datamodeljs).to.exist()
            })
        }
    })

    describe('dm()', function () {
        it("should initialize a default datamanager", function () {
            var dm = datamodeljs.dm()
            expect(dm).to.have.keys(["entities", "entityClasses", "entityPrimaryKeyFields", "entityObjs"])
            dm.define("TestClass", {id: "@number"})
        })
        it("should initialize a datamanager by name", function () {
            var dm = datamodeljs.dm("MyManager")
            expect(dm).to.have.keys(["entities", "entityClasses", "entityPrimaryKeyFields", "entityObjs"])
            dm.define("TestClass1", {id: "@number"})
        })
        it("should separate datamanagers", function () {
            var dm = datamodeljs.dm("MyManager")
            expect(dm).to.have.keys(["entities", "entityClasses", "entityPrimaryKeyFields", "entityObjs"])
            expect(dm.entities.TestClass).to.not.exist
            expect(dm.entities.TestClass1).to.be.an('object')
        })
    })
});
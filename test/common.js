/*
 **  DatamodelJS - Entity management
 **  Design and Development by msg Applied Technology Research
 **  Copyright (c) 2013 - 2016 msg systems ag (http://www.msg-systems.com/)
 */

/* global global: true */
/* global require: true */
/* global chai: true */

/*  provide exception swallowing  */
global.swallow = function (thrower) { try { thrower(); } catch (e) {} };

/*  provide assertion functionality (base features)  */
global.chai    = require("chai");
global.should  = require("chai").should();
global.expect  = require("chai").expect;
global.assert  = require("chai").assert;

/*  print stack traces on assertion failures  */
chai.config.includeStack = true;

/*  load all library parts  */
global.datamodeljs = require("../lib/datamodel.js");
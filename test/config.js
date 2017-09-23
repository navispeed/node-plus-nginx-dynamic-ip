/**
 * Created by greg on 23/09/2017.
 */

const assert = require('assert');
var config = require('../helpers/config');
var it = require("mocha").it;
var describe = require("mocha").describe;

// config.init(`conf.example.${/^win/.test(process.platform) ? 'windows' : "unix"}.json`)
config.init(`conf.example.${/^win/.test(process.platform) ? 'windows' : "unix"}.json`)
describe('Config', function () {

    describe('#getPort()', function () {
        it('should throw on invalid port number', function () {
            var save = config.conf["port"];
            config.conf["port"] = "abc";
            assert.throws(config.getPort.bind(config));
            config.conf["port"] = save;
        });
        it('should throw on invalid conf file', function () {
            var save = config.conf["port"];
            delete config.conf["port"];
            assert.throws(config.getPort.bind(config));
            config.conf["port"] = save;
        });

        it('should return a valid port number', function () {
            assert.equal(true, !isNaN(config.getPort()))
        });
    });

    describe("#getPathToSiteAvailable", function () {
        it('should throw when no path is specified', function () {
            var save = config.conf["site-available"];
            delete config.conf["site-available"];
            assert.throws(config.getPathToSiteAvailable.bind(this));
            config.conf["site-available"] = save;
        });

        it('should return a path', function () {
            var path = !!config.getPathToSiteAvailable();
            assert.equal(path, true);
        });

    });

    describe("#getSiteFromFilename", function () {

        it("Should return undefined on not found", function () {
            assert.equal(config.getSiteFromFilename("mocha.test.com"), undefined);
        });

        it("Should return a valid site object", function () {
            config.conf["site-registered"].push({
                    "file": "mocha.test.com",
                    "variable_name": "ip_of_my_host",
                    "protocol": "https"
                }
            );
            assert.equal(!!config.getSiteFromFilename("mocha.test.com"), true);
        });
    });

/*
    describe("#checkIfRegisteredSiteIsValid", function () {
        it("Should return false on invalid variable name", function () {
            var siteWithInvalidVariableName = {
                "file": "mocha.test.com",
                "variable_name": "42ip_of_my_host",
                "protocol": "https"
            };
            assert.equal(config.checkIfRegisteredSiteIsValid(siteWithInvalidVariableName), false);
        });
/!*        it("", function () {

        });
        it("", function () {

        });
        it("", function () {

        });*!/
        it("Should return true on valid config site", function () {
            var validSite = {
                "file": "mocha.test.com",
                "variable_name": "ip_of_my_host",
                "protocol": "https"
            };

            assert(config.checkIfRegisteredSiteIsValid(validSite), true)
        });
    });
*/
});

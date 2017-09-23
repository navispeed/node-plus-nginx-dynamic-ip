/**
 * Created by greg on 21/09/2017.
 */

const fs = require('fs')

class Site {
    /**
     *
     * @param file {String}
     * @param variable_name {String}
     * @param protocol {String}
     */
    constructor(file, variable_name, protocol) {

    }
}

class Config {

    /**
     * Open the JSON conf file and file this.conf with it
     */
    constructor() {
        this.filename = `conf.${/^win/.test(process.platform) ? 'windows' : "unix"}.json`;
        this.conf = JSON.parse(fs.readFileSync(this.filename, "UTF-8"));
        this.allowedProtocol = ["http", "https", "ws", "ftp"];
        fs.exists(this.getPathToSiteAvailable(), function (exist) {
            if (!exist) {
                throw (this.getPathToSiteAvailable() + " is not a valid path to nginx/site-available");
            }
        }.bind(this));
        if (this.conf["site-registered"].length == 0) {
            console.log("No site were registered in " + process.env["config.file"]);
        }
        this.conf["site-registered"].forEach(this.checkIfRegisteredSiteIsValid.bind(this));
    }

    /**
     * Retrieve used port
     * @returns {Number}
     */
    getPort() {
        var port_number = this.conf["port"];
        if (!port_number || isNaN(parseInt(port_number))) {
            throw "Invalid port was provided in " + this.filename;
        }
        return port_number;
    }

    /**
     * Get the path to the nginx/site-available folder
     * @returns {String}
     */
    getPathToSiteAvailable() {
        var path = this.conf["site-available"];
        if (!path)
            throw "Property 'site-available' was not specified";
        return path;
    }

    /**
     * Get Site object (describe in conf file) from it filename
     * @param filename {String}
     * @returns {Site|undefined}
     */
    getSiteFromFilename(filename) {
        return this.conf["site-registered"].filter(function (site) {
            return site["file"] === filename;
        })[0];
    }

    /**
     * private function, should not be used by other function than constructor
     * Check some error case
     * @param site{Site}
     * @return boolean{boolean} => false if warning
     */
    checkIfRegisteredSiteIsValid(site) {
        var file = site["file"];
        var variable_name = site["variable_name"];
        var protocol = site["protocol"];
        var pathToSite = this.getPathToSiteAvailable() + "/" + file;

        if (!(/^[a-zA-Z_]+$/.test(variable_name))) {
            console.log("WARN", "Variable_name should match with [a-zA-Z_]+");
            return false;
        }
        fs.exists(pathToSite, function (exist) {
            if (!exist) throw pathToSite + " doesn't exist"
        });
        fs.readFile(pathToSite, "utf-8", function (error, data) {
            if (error || data.indexOf("$" + variable_name) === -1) throw "Cannot find " + variable_name + " in " + pathToSite + " doesn't exist"
        });
        if (this.allowedProtocol.indexOf(protocol) === -1) {
            console.log("WARN", "protocol should be one of these protocol :", this.allowedProtocol);
        }
        return true;
    }
}

module.exports = new Config();
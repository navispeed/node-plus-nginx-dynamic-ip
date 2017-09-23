/**
 * Created by greg on 22/09/2017.
 */

const fs = require("fs");
const config = require("./config");
const child_process = require("child_process");

class NginxSite {

    constructor() {
        this.conf = config;
    }

    /**
     *
     * @param site {String}, see site-registered[0]
     * @param ip {String} in format XXX.XXX.XXX.XXX
     */
    updateSite(site, ip) {

        let path = config.getPathToSiteAvailable() + "/" + site["file"];
        fs.readFile(path, "utf-8", function (e, data) {
            let variable_name = site['variable_name'];
            fs.writeFile(path, data.split("\n").map((line) => line.replace(new RegExp(`^.{0,}set.{0,}\\$${variable_name}.{0,}`), `\t set $${variable_name} '${ip}'; `)).join("\n"), "utf-8", function (error) {
                if (error)
                    console.log(error);
            });

        });
        return true;
    }

    reload() {
        if (/^win/.test(process.platform)) {
            console.log("WARN", "WINDOWS Systems are currently not supported");
            return true;
        }
        child_process.exec('sudo nginx -s reload', function (error, stdout, stderr) {
            if (error) {
                console.log(arguments);
            }
        });
        return true;
    }
}

module.exports = new NginxSite();
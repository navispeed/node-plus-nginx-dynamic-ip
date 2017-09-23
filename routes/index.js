var express = require('express');
var config = require('../helpers/config');
var nginxSite = require('../helpers/nginx-site');
var router = express.Router();

router.get('/:site', function (req, res) {
    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    var siteFromFilename = config.getSiteFromFilename(req.params["site"]);
    if (!siteFromFilename) {
        res.status(404).json({});
        return;
    }
    // const request = {ip: ip, site: siteFromFilename};
    nginxSite.updateSite(siteFromFilename, ip) && nginxSite.reload();
    res.status(200).json({});
});

module.exports = router;

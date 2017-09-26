node-plus-nginx-dynamic-ip
==========================

[![Build Status](https://jenkins.navispeed.eu/buildStatus/icon?job=Github/node-plus-nginx-dynamic-ip/master)](https://jenkins.navispeed.eu/job/Github/node-plus-nginx-dynamic-ip/master)

A way to quickly update nginx configuration with dynamic ip, by replacing nginx variable value by correct ip

## How to use it

## Minimal requirement

Tested with success on Ubuntu 16, all Unix like system should work with this package.
Windows system may be support in a future release.
Working nginx with site conf loaded.

###Install & Run

```sh
    $> npm install -g node-plus-nginx-dynamic-ip
    $> node-plus-nginx-dynamic-ip
    Listening for request on port 15000
```

##Configure

On the first run, it will say ``No site were registered in /path/to/conf.unix.json``
Simply open with your favorite editor the specified path, and add site like in `conf.example.unix.json`
```json
{
  "port": 15000,
  "site-available": "./test/res/sites-available",
  "site-registered": [
    {
      "file": "test.myserver.com.conf",
      "variable_name": "ip_of_my_host",
      "protocol": "https"
    }
  ]
}
```


## Use case

My case was the following : 

```
    raspberry-pi (XXX.XXX.XXX.XXX) <-> Home modem (Dynamic ip : YYY.YYY.YYY.YYY) <-> My external server (myserver.com)
```

###Client side

Or simply, how to update my nginx conf to proxy_pass on the correct IP ? 
With this basic crontab : 
```crontab
@hourly wget -O /dev/null bind.myserver.com/mysite.conf
```
My raspberry pi tell myserver.com that it ip should be used by nginx in mysite.conf.

###Server side

* Load the configuration (witch site may be updated)
* Listen for http request from remote client (like my raspi)
* On each request, open correspondent file (test.myserver.com.conf) and update the variable `ip_of_my_host` 
* Reload nginx 

## Contribution

Feel free to fork and push new functionality.
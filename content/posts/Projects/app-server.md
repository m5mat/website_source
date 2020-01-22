title: Deadbeef Cafe App Server
date: 2019-12-09 17:30:00
image: /media/images/appserver.jpg
tags:
    - AppServer


Deadbeef Cafe appserver setup. This is mostly for my own reference

Inbound connections permitted on 80, 443 and 8080. 8080 goes directly to Tomcat, 80 & 443 are terminated by an nginx reverse proxy. This proxy redirects 80 to 443 and terminates SSL with a LetsEncrypt Cert (for app.deadbeef.cafe, other subdomains not implemented). LetsEncrypt cert is managed by certbot.

Services
---

The following services are running on the app server:

 * Tomcat
 * Nginx (as reverse proxy for tomcat)
 * MySQL server (not accessible to anything other than localhost)
 * Mosquitto MQTT broker (app.deadbeef.cafe:1883)

Sites
---

* Avatar (https://app.deadbeef.cafe/avatar)
* [DXClusterBridge](app-server-dxclusterbridge.html) - Bridges DXCluster messages to an MQTT Broker which is accessible on app.deadbeef.cafe:1883. Messages are posted to the broker using the username ```admin```. You'll need a user account on the broker to get access to messages. Request access from Matt MØIZZ. At this time messages posted to the broker do not go out to the wider DXCluster servers.
* Weblog (in progress)

title: DXClusterBridge
date: 2019-12-09 18:00:00
image: /media/images/mqtt.png
tags:
    - AppServer


Deadbeef Cafe appserver DXClusterBridge setup. This is mostly for my own reference


Admin
===

Add a user
---

`sudo mosquitto_passwd /etc/mosquitto/passwd <callsign>`

Stop and start the broker (note that a restart doesn't seem to work)

`sudo systemctl stop mosquitto`

wait a bit...

`sudo systemctl start mosquitto`

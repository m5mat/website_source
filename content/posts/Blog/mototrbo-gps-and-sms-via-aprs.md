title: GPS and SMS messaging via APRS on Motorola MotoTRBO radios
date: 2020-01-21 12:00:00
tags: motorola,mototrbo,aprs



The following information is mostly derived from a [hamdigitaal.nl](https://www.hamdigitaal.nl/download/algemene-informatie/GPS_Motorola_BM262.pdf) article and is only for use on the **Brandmeister Network** - this will not work on Phoenix UK or any other networks.


Firstly, you need to know your local Brandmeister master node id. The UK node is `2341` (list [here](https://brandmeister.network/?page=masters)). The ID that we need to use is the first three digits of this id, with `999` added, so `234999` for the UK (USA: `310999`, France: `208999` etc.)

**Note 1:** there is still quite a lot of old info about this on the internet. ID `5057` is no longer in use on Brandmeister. If you read an article that uses this ID then you're either reading an out-of-date article, or one about the Phoenix UK Network.

**Note 2:** You'll need to put CPS into `Expert Mode` to change some of these settings

General setup
----

In `Network -> Radio Network`, set the following settings:

| Setting | Value |
|---------|-------|
| CAI Network | 12 |
| CAI Group Network | 225 |
| Protected Mode Control Station | unselected |
| Max TX PDU Size | 1500 |
| Telemetry UDP Port | 4008 |
| Forward to PC | Disabled |

In `Network -> Services`, set the following settings:

| Setting | Value |
|---------|-------|
| ARS Radio ID | `234999` (or whatever your local master is) |
| ARS UDP Port | 4005 |
| TMS Radio ID | `234999` (or whatever your local master is) |
| TMS UDP Port | 4007 |
| User Defined UDP Port 1 | Disabled |
| User Defined UDP Port 2 | Disabled |
| User Defined UDP Port 3 | Disabled |
| XCMP Server ID | `234999` (or whatever your local master is) |
| Battery Management Server ID | blank |

Now, for each channel on which you want to be able to use messaging/APRS, the following settings need to be correct:

| Setting | Value |
|---------|-------|
| ARS | On System/Site Change |
| Enhanced GPS | not selected |
| IP Site Connect | Selected |
| Messaging Delay (ms) | 60 |
| Compressed UDP Data Header | DMR Standard |
| Text Message Type | DMR Standard |

And in the channel's TX Section

| Setting | Value |
|---------|-------|
| GPS Revert | Selected |
| Private Call Confirmed | Selected |
| Data Call Confirmed | Selected |
| Location Data Delivery Mode | Follow Data Call Confirmed |
| Enhanced Channel Access | not selected |
| CSBK Data | not selected |

On the Brandmeister Self-care portal, the `Brand` for each ID should be set to `Motorola`

GPS setup
----

To enable GPS, select the `GPS` tickbox in `General Settings`. Reports suggest that changing the GNSS setting to include GLONASS also helps with fix-times - presumable this is a European thing.

In `General Settings -> Persistent LRRP Requests`, set `Persistent LRRP Requests` to `Save` - this makes APRS updates more reliable.

Testing
-----

* If the radio is sending position reports, then your callsign should show up on [aprs.fi](http://aprs.fi).

* You can try sending an SMS message to your radio by using [findu.com](http://www.findu.com/cgi-bin/entermsg.cgi?)

* To send a message from your radio to APRS, send an SMS to the master id (`234999` for the UK, it might be worth storing this as a contact). The format of the message must be the destination callsign (with SSID), followed by a space, followed by the test of the message, e.g. `M5MAT-10 Hello Matt!`.

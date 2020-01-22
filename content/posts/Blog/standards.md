title: 2E1HNK Interconnection Standards
author: Matt, 2E1HNK
date: 2019-09-11 08:00:00
tags:
    - TechNote
    - Standards
image: https://imgs.xkcd.com/comics/standards.png


Standards exist to promote interoperability between systems. They define the physical and electrical characteristics of interconnections, such that two systems both implementing the same standard are able to connect to each other and interoperate without any concern about misunderstanding. Given that amateur radio deployments often consist of multiple different 'boxes' which need to be connected, it seems sensible to adhere to standards where possible. This is a list of the standards which I adhere to. It is primarily for my own reference although if anyone else decides to adopt these standards then that's great. In most cases I've tried to use publically-available already-published standards.


Power
=====

<center>
  ![Red and black Powerpole connectors showing red mounted to the right of black with tongues down, when viewed from the cable side](/media/images/powerpole.gif)
</center>

Wherever possible equipment should run off 13.8VDC. Connections will be via 30A powerpole connectors wired to the [ARES/RACES standard](http://www.westmountainradio.com/kb_view_topic.php?id=ST166)

Where connection to domestic 230VAC mains power is required then the UK mains connectors will be used.

Antenna connectors
==================

For frequencies above 100MHz, N-Type connectors will be used. For frequencies below 100MHz, SO239/PL259 connectors will be used. In some cases BNC connections are used. This should be restricted to specific deployment scenarios (typically portable) and in all cases an appropriate adapted should be on hand to convert to the standard connector.

Audio interconnections
======================

<center>
  ![3.5mm 4-pole (TRRS) audio jack showing the use of each pole](/media/images/ctia-standard.png)
</center>

Where 4-pole (TRRS) 3.5mm jacks are used, they will use the CTIA standard.

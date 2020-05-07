title: Coronavirus/COVID-19 Lockdown & HF Data Modes (again)
author: Matt, M5MAT
date: 2020-05-07 23:00:00
tags: Coronavirus, COVID-19, Lockdown, HF


Just a quick update on my lockdown activity...

FT8 is fully up and running now and as it's easier to use than FLDigi over a remote link I've pretty much completely switched over to that. The main change here is that I've rebuilt the shack PC. It's now running Xubuntu 18.04 LTS like the laptop I use for UKAC portable operation - however I have decided to keep the base OS as stock as possible. This means that all the radio apps are running in docker containers. So far I have the following running:

 - CQRLog (running in a docker compose stack with a MySQL database)
 - Hamlib
 - WSJT-X
 - FLDigi
 - Xastir (another docker compose stack, also running direwolf)
 - Cloudlog (again, a compose stack with it's own MySQL DB)
 - Chirp
 - GPredict
 - Minos

I also have a compose stack set up as an AX25 BBS with LinBPQ (the BBS), DXSpider and direwolf. This is to use (at some point) with the DingleBop board that I bought from DF2ET.

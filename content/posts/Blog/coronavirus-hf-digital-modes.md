title: Coronavirus/COVID-19 Lockdown & HF Data Modes
author: Matt, M5MAT
date: 2020-04-2 11:00:00


Like most of the country, and indeed the world, I'm currently stuck at home due to coronavirus. Most of my radio kit lives in the car most of the time for UKAC contests, and general commuter-mobile use. As that won't be happening for the foreseeable future I've moved the FT-857d into the garage, hooked it up to a G5RV Jr antenna which is strung up in the roof of the garage (via my YT-100 tuner) and also to an X200 dual-band colinear. The G5RV is all of 3m agl (possibly 4m if I'm being generous) with significantly folded ends and the base of the colinear is at 1.5m agl. This isn't ideal but it's better than being unused in the car.

Given that I'm also working from home and we're home-schooling the two kids I don't have time to sit in from of the rig, so it's set up from remote access and use on data modes.

FT-8 has been my go-to HF data mode for a while but as I hadn't used it in over a year there was an update available for WSJT-X. I duly updated from 2.0.0 to 2.1.2 and it sort of doesn't work now. It works a bit but within a few cycles the decodes stop - they do sometimes come back again later but not always. TX-ing seems to make things worse too. The usual culprits (audio level & time sync) seem to be ok so not sure what's going on there.

As a result of WSJT-X not playing ball I've been using PSK31 on FLDigi - something I last played with during JOTA in about 1999/2000. It's been pleasantly refreshing, and compared to FT8 actually feels quite fast!

Despite having an auto-tuner in, I can't remotely trigger a tuning cycle, so I'm stuck on one band until I can nip out to the garage to re-tune. I've been using 40m for a few days and just switched over to 20m for a bit.

I've also been running WSPR overnight. WSPR still seems to have reasonable usage but the WSPRnet seems to be suffering - most of the time my reports fail to get logged which implies the infrastructure on their end is creaking a bit. The WSPRnet forum is full of unanswered posts about this problem (and also unanswered posts offering to help with infrastructure).

One interesting problem I've come across is that the audio level expected by FLDigi, WSJT-X and WSPR all seem to be different. In order to change this remotely you have to go into the microphone properties - which I can never find (hurray for Win10 making things easy...). After a bit of poking around I found a PowerShell [AudioDeviceCmdlets](https://github.com/frgnca/AudioDeviceCmdlets) thing which allows you to change the audio level via a script. I just leave a powershell window running in the background and run `Set-AudioDevice -RecordingVolume xx` with the appropriate level (FLDigi - 80, WSPR - 18, WSJT-X - 67).

I was also a little unsure about how the rig was behaving (i.e. was it actually transmitting? Has it stopped transmitting? etc.) so I've set up a webcam pointing at the front of the rig (and also the tuner, for getting feedback when I get round to making a remote interface for it). At the moment this is only visible within my home network but I may open it up to the world at some point.

Edit (@14:30): Backing off the RF Gain seems to help with FT8 decoding, [thanks G0HDB](https://groups.io/g/WSJTX/topic/wsjt_x_is_not_decoding_but/32439146?p=,,,20,0,0,0::recentpostdate%2Fsticky,,,20,2,0,32439146).

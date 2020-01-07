title: Yaesu FT-857d Power Output Stuck
category: Blog
author: Matt, 2E1HNK
date: 2018-04-04 23:00:00
tags:
    - TechNote
    - FT857
image: /media/images/ysu-ft-857d_xl.jpg


![Yaesu FT-857d]([[images/ysu-ft-857d_xl.jpg]])


I fired up my Yaesu FT857d to take part in the RSGB's April 2018 2m
UKAC Contest a couple of days ago to discover that the RF power
output (Menu Option 75) was stuck at 50W and wouldn't change by
rotating the VFO knob as it should.


Thankfully, despite being /P, I
was in an area with good mobile coverage I had a quick google and
although I found a few others who had experienced a few similar
[issues][eham],
there was only one viable suggestion for resolving the problem,
which was to perform a reset. There are three variations of reset
available on an FT857d detailed [here][reset].
It was the FUNC + PWR one that worked for me, however it wasn't
clear to me that this is a power-on reset, so the rig has to be off
for it to work. There is a sort of 'confirmation beep' to indicate
that the memory has been reset and you'll also notice that the VFO
will probably have changed (in my case it reset to 7MHz).

[eham]: http://www.eham.net/ehamforum/smf/index.php?topic=74837.0
[reset]: https://www.hamradio.hanklambert.com/8-ham-radio/23-yaesu-ft-857d-reset-procedures

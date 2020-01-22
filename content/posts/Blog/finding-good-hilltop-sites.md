title: Finding Good Hill-Top Portable Sites
author: Matt, 2E1HNK
date: 2018-04-26 23:00:00
tags:
    - TechNote
    - UKAC
    - FMAC



Finding good portable operating sites historically relied on local
knowledge, anecdotal evidence from other amateurs, plenty of
experimentation and a good dose of luck. Whilst there's nothing
wrong with this approach it does rely on either knowing the local
area well, or having contact with someone who does. This isn't
always available, for example holiday operation, moving to a new
area or simply that all the good peaks have been taken. There must
be a better way...


My approach to finding new hilltops to
activate involves finding candidate hilltops, assessing whether
operation is possible from that location, and then working out
whether it's worth the effort of attempting to activate it. These
are some of the resources I use to do this.

### Find Candidate Sites

#### Overpass Turbo

[Overpass Turbo][overpass] allows users to run scripts against the Overpass API, part
of the OpenStreetMap project. The script below finds ways, nodes
and relationships (i.e. any object) with an elevation greater
than 300m a.s.l (which works well for the area I'm interested in,
depending on your local area you might need to change this). It
then searches the area around those objects up to a radius to
100m (you can tune this too, if you need to) to see if there are
any highways, but excluding footpaths, bridleways, tracks,
service roads, unclassified roads etc. This theoretically returns
a list/map of summits which are accessible by car.

<pre><code class="json">
[out:json][timeout:800];
(
  way({{bbox}})(if:t["ele"] > 300);
  node({{bbox}})(if:t["ele"] > 300);
  rel({{bbox}})(if:t["ele"] > 300);
)->.summits;

way
  (around.summits:100)
  [highway]
  [highway!~"^(footway|path|bridleway|track|unclassified|cycleway|service)$"]
->.streets;

(
  node.summits(around.streets:100);
  way.summits(around.streets:100);
  rel.summits(around.streets:100);
)->.matchingSummits;

(.matchingSummits; .streets;);
out geom;
</code></pre>

#### UKACMap

[UKACMap][ukacmap] queries the Google
Maps API to try to find the highest point in view. In some ways
this is more reliable that the OverPass API approach as the
Google Maps elevation data comes from surveys rather than
user-entered data, however there are limitations in how many
times the Google Maps API can be queried, so the application is
not as accurate as it could be.

### Assess Accessability

* Is the land privately owned?
* Is it possible to get a vehicle to the site?
* Are there time restrictions (for example a car park that closes at dusk)?
* Is there sufficient space to set up antennas?

The answers to many of these questions can be found using online
mapping services including [Bing Maps][bing] which has Ordnance Survey maps available and Google Maps
which has aerial photography and also Google's fantastic Street
View service.

### Assess Radio Coverage

Of cource there's no point investing time and energy into
climbing a peak is it's not going to give you the coverage you
need.
[Radio Mobile Online][rmonline] (and also the offline version) and Splat! are fantastic
tools for assessing a site's radio coverage. Their use cannot be
described briefly here but there are plenty of tutorials
available. One I particularly like for Radio Mobile's offline
versions can be found [here][rmonline_tutorial]

[overpass]: http://overpass-turbo.eu
[ukacmap]: ukacmap.html
[bing]: https://www.bing.com/maps
[rmonline]: http://www.ve2dbe.com/rmonline.html
[rmonline_tutorial]: http://radiomobile.pe1mew.nl/?How_to:A_first_example
[reset]: https://www.hamradio.hanklambert.com/8-ham-radio/23-yaesu-ft-857d-reset-procedures

title: 2m/70cm Satellite Station
description: >
    A copy of ??'s satellite antenna.
date: 2019-04-26 08:00:00
links:
    description:  http://n5dux.com/ham/pubs/hammag-2010/hammag-04-2010.pdf
phase: in-progress


# Satellite Reception using RTL-SDR, GQRX and GPredict

This is mostly sourced from http://teslaintheether.blogspot.com/2018/02/setting-up-gqrx-and-gpredict-for.html, all credit goes to Jacen Solo and it's only reproduced here in case the original disappears. All images come from his original blog post.

<hr />

1. Install and start both GQRX and GPredict

1. In GPredict, click `Edit` > `Preferences`

1. Click `Interfaces` then `Add New`

1. Fill in the following:

  + Name: GQRX

  + Host: localhost

  + Port: 7356

  + Radio Type: RX Only


1. Click `OK` then `OK` again.

1. now bring up the interface by clicking on the down arrow at the upper-left of the main screen then `Radio Control`

    ![GPredict Connect to Radio](/media/images/sat-station-1.png)

1. Under 'Downlink', enter the downlink frequency of the satellite.

1. In GQRX, click the two computers icon (below) to connect it to GPredict.

    ![GQRX Connect to GPredict](/media/images/sat-station-2.png)

1. Back in GPredict, select the target satellite in the drop-down menu and click `Track`

    ![GPredict Track Satellite](/media/images/sat-station-3.png)

1. Ensure that GPredict is linked to GQRX

    ![Ensure GPredict is linked to GQRX](/media/images/sat-station-4.png)

1. Now you will see the frequencies tracking in both the radio control window and in GQRX. Next just hit play in GQRX and you'll be all set to receive your target satellite.

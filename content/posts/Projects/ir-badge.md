title: Scouts JOTA Infrared Badge Kit
description: >
    An IR-enabled badge kit for JOTA 2020
date: 2020-02-04 23:00:00
links:
    description:  ''
phase: in-progress

Features
-----

* [ATtiny-13a](http://ww1.microchip.com/downloads/en/DeviceDoc/doc8126.pdf) microcontroller
* IR LED
* [IR Receiver](https://www.vishay.com/docs/82492/tsop312.pdf)
* 2 LEDs (one green and one red)
* Button
* Badge PCB
* 3V Coin Cell

Description
-----

The badge will work in a few different modes, these are tailored to the different age groups

Cubs: The badge will periodically beacon, and when it's not beaconing it will listen. When it receives a beacon from another badge it will flash its LEDs.

Scouts: Badges will be in two groups ('Team A' and 'Team B'). The badge will periodically beacon its team and while it's not beaconing it will listen. If it receives a beacon from another member of the same team then it will flass it's green LED, if it receives a beacon from the other team then it will flash its red LED.

Explorers: Pressing the button will trigger a query transmission. This transmission includes the badges own team. Any badges in range which see this query transmission will respond with their own team. If the badges are from the same team then they'll flash their green LEDs, if they are from different teams then they'll flash their red LEDs.

Expansion Activities
-----

* Is it possible to control a TV using this hardware? Could turn it into a [TV-B-Gone](http://www.makery.info/en/2015/04/07/bricole-it-yourself-la-telecommande-qui-eteint-toutes-les-teles/) type device.

* Can we create some sort of game, maybe something like laser-tag?

* Game idea 1: *Laser Tag* - Badges are on two teams. If your badge 'sees' a member of the other team then you lose a life. After you lose three lives (or some other configurable number) then you're out of the game.

* Game idea 2: *Zombies* - All badges are 'people' (green LED lit), one badge becomes a 'zombie' (red LED lit). If a person 'sees' a zombie then they become a zombie too. Last person alive wins.

* Could add a piezo buzzer for audio? (would tie in nicely with the game idea).

Circuit Diagram
-----

![circuit diagram](/media/images/jota-badge-circuit.png "Circuit Diagram")

References
-----

[Sending](https://learnthetechnology.com/how-to-easily-send-ir-signals-using-the-attiny85/)

[Receiving](https://blog.podkalicki.com/attiny13-ir-receiver-nec-proto-analyzer/)

[JLCPCB](https://jlcpcb.com/)

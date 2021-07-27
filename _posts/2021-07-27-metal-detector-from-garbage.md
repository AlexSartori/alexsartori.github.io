---
layout: post
title: "A Metal Detector From Garbage"
description: "How we built a metal detector entirely from electronic scraps found around"
date: 2021-07-27
categories: electronics
tags: metal-detector DIY recycling
image: "/assets/posts/md-cover.jpg"
---

{% assign html_video_pre_url = "<video controls class='vid-big'><source src='" %}
{% assign html_video_post_url = "' type='video/mp4'></video>" %}


Here at the FSAE lab we fancy quite a lot salvaging improbable parts from electronic garbage here and there, and in our spare time what's better than playing around with any weird component that still appears to work?

## How It Started
While dismantling a power supply unit, we found a line filtering stage with two quite big inductors, which contained several meters of insulted copper wire. At first it started as a joke, but soon the idea of turning the inductors into a large coil and try to detect nearby metals became actually interesting.
Here's how the detector coil turned out after attaching it to a random scrap of wood (to act as its handle) that was laying around:

![Detector coil winding](/assets/posts/md-1.jpg){:.img-big}

## Circuit and Operation
The principle of operation is essentially as follows: a capacitor and an inductor (the detector coil) are connected in parallel and are kept oscillating (a good ol' [LC tank](https://en.wikipedia.org/wiki/LC_circuit)). Since the resonant frequency of the circuit will be inversely proportional to the C and L values, it follows that when a metallic object is brought close to the coil, its inductance will increase and so will the oscillation period. Observe this quick test where brief pulses were sent to the circuit to charge it, and notice how the resonance frequency slightly varies when moving the ferrite core.

{{ html_video_pre_url }}/assets/posts/md-2.mp4{{ html_video_post_url }}

After several other trials to better understand its working, we ended up with an Arduino Mega driving 12V through a power MOSFET (to input more power into the coil and generate more field), an OP-amp to turn the sinusoidal oscillation into a square wave, and the Arduino reading back the oscillation to count its peaks (before the signal fades and generates no more output) and buzzing a speaker with a frequency proportional to the change in inductance. Apart from the Arduino, all components were salvaged from random garbage, and this is a detail I simply love. Here's the working circuit on a breadboard:

{{ html_video_pre_url }}/assets/posts/md-3.mp4{{ html_video_post_url }}

Lastly, we soldered all components on a prototyping board (obligatory salvaged from garbage as well) and the result looked like this:

![Finished DIY metal detector](/assets/posts/md-4.jpg){:.img-big}

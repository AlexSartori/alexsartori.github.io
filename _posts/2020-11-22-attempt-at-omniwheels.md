---
layout: post
title: "My Attempt at Omni-Wheels"
description: "Some omni-wheel prototypes I attempted to 3D print"
date: 2020-11-22
categories: handcrafting 3d-printing
tags: 3d-printing DIY omniwheel omni-wheel
---

First off, this little project is not something I’m currently working on. It’s just a failed attempt of 2 years ago of which I recently found the remains, so here’s to you why I did it, what I did, and why it didn’t work.

![All the omniwheel attempts](/assets/posts/omni-1.jpg){:.img-big}

## What are Omni-Wheels though?

They are SUPER COOL WHEELS! :heart_eyes: …or, more technically speaking:

> **Omni wheels** or **poly wheels**, similar to [Mecanum](https://en.wikipedia.org/wiki/Mecanum_wheel) wheels, are wheels with small discs (called rollers) around the circumference which are perpendicular to the turning direction. The effect is that the wheel can be driven with full force, but will also slide laterally with great ease.\\
> \- *From [wikipedia.org](https://en.wikipedia.org/wiki/Omni_wheel)*

Which is a lot of wording to describe something similar to this, a wheel that can spin along the usual axis but also slide horizontally:

![Omniwheel from Wikipedia](/assets/posts/omni-2.jpg){:.img-big}

As you can see, this curious-looking wheel can serve the usual function but also slide sideways without effort (picture from [Wikipedia.org](https://en.wikipedia.org/wiki/Omni_wheel)).

## My Project
My initial goal was to build a small robot that could move around above a sheet of paper (or anything similar) with a pen or marker and draw stuff while driven by an MCU that could process and recreate a given picture. Since I needed quite a lot of precision when moving, I discarded any steering mechanism that I could think of and decided to use 4 perpendicular omniwheels, each driven by a stepper motor with a precision of 360° / 4096 steps = 0° 5′ 24″. Here’s a draft of the chassis that I prepared:

![Chassis with steppers](/assets/posts/omni-3.jpg){:.img-big}

At this point, I realized I was not so eager to spend some 50 Euros for 4 wheels (I could only find them for 10-20 Euros each), so I thought it would have been very interesting to model and print a prototype of my own.

## Prototype #1
![Omniwheel #1](/assets/posts/omni-4.jpg){:.img-big}

In this first iteration I modelled the wheel with three main structural components to be “sandiwitched” together that would hold the rollers and their axle (a metal wire). Everything was solid and spun freely, but the wheel was overall too wide: the weight of the chassis would make the wheel pivot on the bottom roller and cause the internal edge of the rim to scrape the ground and block transversal movement.

## Prototype #2
![Omniwheel #2](/assets/posts/omni-5.jpg){:.img-big}
My next try was putting rollers all around the circumference and keeping them aligned on the same line, so that contact with the ground could be maintained even when inclined.

Unfortunately, if the wheel stands (even approximately) on tip of the cones, these apparently provide too little contact surface and instead of spinning they grip to the paper and generate lateral friction.

## Prototype #3
![Omniwheel](/assets/posts/omni-6.jpg){:.img-big}

Very simple upgrade here: thicker rollers. Probably the situation was a bit better, but for reasons that I’m not sure I understand, when the wheel laid above the tips it still preferred to grip than to roll.

## Prototype #4 - Almost Worked
![Omniwheel](/assets/posts/omni-7.jpg){:.img-big}

Out of ideas, I tried to combine the two previous approaches: a double line of rollers to have a good base in each point of the circumference, but with thin rims to avoid the problem of the first attempt. And well... It almost worked!

![Omniwheel](/assets/posts/omni-8.gif){:.img-big}

As you can see, the movement actually happens, except... Grip is not sufficient to have a precise movement, probably because of the smooth texture of plastic. At this point I really ran out of ideas and paused the project, which as you can guess never really resumed.

Thanks for reading through and let me know any idea you may have to get this curious thing to work!

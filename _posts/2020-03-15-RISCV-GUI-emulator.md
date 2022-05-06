---
layout: post
title: "RISC-V GUI Emulator"
description: "A Py3 + Qt5 emulator and disassembler for the rising RISC-V architecture"
date: 2020-03-15
categories: computer-science
tags: risc-v risc-v-emulator python3 qt tomasulo gui-emulator
image: "/assets/posts/risc-cover.png"
---

## RISC-V
RISC-V (“risc-five”) is an open Instruction Set Architecture (ISA) based on the well known RISC principles. If you’re interested in its history and design innovations please refer to the dedicated [Wikipedia page](https://en.wikipedia.org/wiki/RISC-V#Design).

## RISC-emV
[RISC-emV](https://github.com/AlexSartori/RISC-emV/) is how me and [Davide](https://github.com/davidezanella) named our project for the Advanced Computing Architectures course at University of Trento. The name comes from what the software is: a **RISC**-V **emu**lator. Everything is hosted on my Github at [AlexSartori/RISC-emV](https://github.com/AlexSartori/RISC-emV), where you will also find a more technical [documentation](https://github.com/AlexSartori/RISC-emV/blob/master/documentation.pdf) of the code.

## Features
We wrote it in Python 3.x & PyQt5, and it currently provides the following features:
- Emulation of the [Tomasulo Algorithm](https://en.wikipedia.org/wiki/Tomasulo_algorithm)
- Support for Simultaneous Multithreading
- ELF-file/object-code disassembling
- Step-by-step or continuous execution with variable delay
- Configurable ISA: customize every instruction’s running-time in cycles and its equivalent pseudocode
- Expandable ISA: current support is for **RV32I**, **RV32M** and **RV32F**, but you can contribute and add any ISA extension just by editing a JSON file
- Configurable environment (Data Memory size, number of Reservation Stations/Functional Units, …)
- Ready-to-use sample programs

## Graphical Interface
![The GUI of the RISC-V emulator](/assets/posts/risc-1.png){:.img-big}

The GUI is mainly composed of two vertical panels: the one on the left lets the user interact with the code being executed, while the rightmost one displays the state of the emulator components. The code panel has two tabs, one with a text editor which allows for both writing code and for loading/disassembling external programs, and another tab (displayed in the picture above) showing the contents of the instruction memory and some details about active instructions such as issue time, execution length and finish time. On the right panel, the displayed components are, in order from top to bottom: integer registers, FP registers, register status table, reservation stations/functional units, and data memory dump.

## Installation and Usage
Until made available on the official PyPI repositories, the software is installable by cloning the Github repository and installing it locally:

```shell
$ git clone https://github.com/AlexSartori/RISC-emV
$ cd RISC-emV
$ pip install -e .
```

Then simply launch it with:

```shell
$ riscemv
```

At this point the GUI will pop up. You can either write your own code or import an existing program with “Open” button. Next, click “Load” to parse the instructions and load them into memory. If you haven’t provided a .text section or an entry point, RISC-emV will do it for you now.

At this point, the only thing left to do is to start the execution: you can either request the emulator to perform a single step with the “Step Forward” button, or start a continuous execution with the “Start” button, which will interleave a delay between every instruction proportional to the value of the slider on the top bar. Lastly, a double-click on any field of a component will allow you to edit the associated value, be it a register or a functional unit.

![Demo of the RISC-V emulator](/assets/posts/risc-2.gif){:.img-big}

If you have any suggestion don’t hesitate to reach out, file an issue on Github, or even create a pull request with any improvement!

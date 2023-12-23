---
title: "Yet? Not Yet? Let's give a thought to where is AI on Hardware Design"
layout: post
date: 2023-12-23
image: /assets/images/blog/ai_hw_blog_cover.png
headerImage: true
tag:
- ai
- blog
- hardware
category: blog
author: navadeepganeshu
description: yet? not yet? where is AI with hardware design? This blog takes you through what it takes for a hardware design to come in place and is it something logical, streamlined which machines seemingly pose to do these days. Let's wait and watch? or let's dive and give a thought to it...
---

Breathe in, breathe out. That's how an observation is done with breath but with hardware design in place and AI air all around, the same observation is to be repeated. Fixing the context, by hardware design I am specific to circuit board design and AI itself is a huge bite now. Observation is hard without clarity and getting clarity itself requires observation. So in this context, by the word AI, our quick imagination is of doing something without human intervention or us giving thought to the process. This school of thought is quite right but to rationalize there is no better resource than 'Goals' explained in [this](https://en.wikipedia.org/wiki/Artificial_intelligence) page.

<p>Why to think of hardware design afterall? It is not a very celebrated job and once done, it's done and no scope for fixing things without additional costs. We see software development high-level is logical and converges through a sequence of steps which modern compuational models pose to do. Code generators have been alive for a long time now probably since 1975 and they predomanintaly functioned as iterators unlike from a logical proceeding or through the training of models with feedback. One level down, thinking of everthing that runs on a computer is translated as 'code'. Be it a Paint tool or circuit design software for that matter. Fancy part is that I use KiCAD project files with git source control and edit back of the screen <i>file.kicad_sch</i> code to modify KiCAD schematics and quick edit the component footprints. Now that we've shorted in imagination the hardware design and software development, it's all code and can a modern 'iterator' be used for this activity?</p>

Hardware design is an onion building type of activity where one consideration is taken after the other layer by layer leading to a full-fledged design. I feel one should also have a certain degree of [OCD](https://en.wikipedia.org/wiki/Obsessive%E2%80%93compulsive_disorder) to be a better hardware designer.

<br>
<img src="/assets/images/blog/block_hw_design_blog.png" width="620" height="400">
<br>
<p>Let's go into the word AI now and use it from there. It's high level to use directly unless for a business presentation. Iterator works for iterative tasks - obvious! And trained models work for any entity that tends to converge at a logical result based on the set of data available. Not many things are iterative in hardware design and involves giving immense thought to edge-cases while making the design(no luxury of iterating the design after completion), real-world electrical considerations like electromagnetic compatability, integrity related to power and signal and more that are realized after design ceases to operate as expected. As we know, it is all code, but is the code creative enough to judge how wide a power plane should be poured and where to put a via for jumping to the another layer? Story flipped.</p>

<p><b>INTERVAL</b></p>

<p>What can be automated and what not? There is a plethora of activities while saying board design itself. Placement of component itself is an activity where a fair amount of thought process goes into understanding the clearances, availability of connectors at the board edges, zoning the passive components around it's host chip and then decoupling capacitor placement in itself is a maze. Routing is a fairly light activity once constraints are defined. This is potentially where automation tools can help in matching the trace lengths and finding shortest routes. This method isn't finding success in high density design for a reason. It is true in software testing as well, like you cannot define constraints one by one for a self-driving car. Dropping this meaningful image
<br>
<img src="/assets/images/blog/ai_blog_failure_cases.png" width="620" height="400">
<br>
Optimization is still left for a thoughtful designer where high-frequency, high-power designs will require validation with multiphysics tools and rigurous check for signal integrities.</p>

<p>Some great examples of using machine to do some of the tedious job in design cycle are here. While these are great, it can be observed that none of this involves keeping all the checkboxes ticked from block diagram we've seen above.</p>

[Circuitmind](https://www.circuitmind.io/product): This looks like a promising tool doing the job of architecting a system and doing component selection based on the design requirement given. It functions more like a LEGO block thing wiring one to other and many to a central controller. While we have tools reading the component datasheet and generating footprints based on the numbers and pin names given, this tool is a culmination of this act.
<br>
[Quilter](https://www.quilter.ai): This is a compiler for board design and does the task of placing components based on math(so-called generative AI) to achieve the least intersection and routes down it. This input to this process is the schematic(netlist) and the board layout with placement of connectors specified(too much intelligence may lead to placing of USB connector in the middle of the board)
<br>

It can be done. If so how? Here are some closest things I can imagine:
- Building a custom GPT with a lot more dataset related to circuit design and gives streamlined pointers on how and why's in the  process for the designer. We have seen build your own GPT in the recent [OpenAI Dev Day 2023](https://openai.com/blog/introducing-gpts)
- Using scripting utilities for replicating layouts and keeping the design modular. There can be sections in a circuit board like power regulator which is repetitive for multiple different voltage levels with just the feedback resistor value chaning. The layout can be made as a block and applied at multiple places in the design. KiCAD already has some of such [plugins available](https://forum.kicad.info/t/replicate-layout-action-plugin/8539)
- Be a good hardware designer and do-it-yourself!
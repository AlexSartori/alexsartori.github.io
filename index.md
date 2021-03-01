---
layout: default
title: Home
permalink: /
---

## \>>> Welcome
---
Hey there, welcome to my portfolio!

On this website I mainly share my professional or recreational achievements, but I also like to write short stories or summaries of the works and experiments I carry out in my free time and share them with anyone that might find them interesting. I have so many hobbies and so little time! I hope you'll enjoy the variety of topics in my blog.

In the sections that follow, you will find some quick highlights from the various pages in which I have organized this portal, accessible either from the navbar above or from the "see all..." link at the end of each list below.

Should you have any suggestion, comment, or topic you wish to discuss about, you are very welcome to reach out!

## \>>> Highlighted projects
---
{% for p in site.data.projects limit:3 %}
- [**{{ p.name }}**]({{ p.url }}){:.highlight-blue}: {{ p.summary }}
{% endfor %}
([*...see all*](/projects))

## \>>> Latest articles in my blog
---
{% for p in site.posts limit:3 %}
- [**{{ p.title }}**]({{ p.url }}){:.highlight-green}: {{ p.description }}
{% endfor %}
([*...see all*](/blog))

## \>>> Recent competitions

| Competition | Result | Team |
|---|
{% for c in site.data.competitions limit:3 %} | [**{{ c.name }}**]({{ c.url }}){:.highlight-red} | {{ c.result }} | {{ c.team }} |
{% endfor %}

([*...see all*](/competitions))

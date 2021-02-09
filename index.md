---
layout: default
title: Home
permalink: /
---

## \>>> Welcome
---
Bla bla bla [\...]

## \>>> Latest works in my blog
---
{% for p in site.posts limit:3 %}
- [{{ p.title }}]({{ p.url }})
{% endfor %}
- [*...see all*](/blog)

## \>>> Recent competitions
---
- \...
- \...
- [*...see all*](/competitions)

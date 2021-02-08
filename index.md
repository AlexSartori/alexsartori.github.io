---
layout: default
title: Home
permalink: /
---

## Home
---

Hello, world!

## \>>> Latest works in my blog
---
{% for p in site.posts limit:3 %}
- [{{ p.title }}]({{ p.url }})
{% endfor %}

## \>>> ...

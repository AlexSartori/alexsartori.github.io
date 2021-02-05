---
layout: default
title: Home
permalink: /
---

## Home
---

Hello, world!

## \>>> Latest Posts
---
{% for p in site.posts limit:3 %}
- [{{ p.title }}]({{ p.url }})
{% endfor %}

## \>>> ...

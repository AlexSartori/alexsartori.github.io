---
layout: default
title: Home
permalink: /
---

## \>>> Welcome
---
Bla bla bla [\...]

## \>>> Highlighted projects
---
{% for p in site.data.projects limit:3 %}
- [**{{ p.name }}**]({{ p.url }}){:.highlight-blue}: {{ p.summary }}
{% endfor %}
- [*...see all*](/projects)

## \>>> Latest articles in my blog
---
{% for p in site.posts limit:3 %}
- [**{{ p.title }}**]({{ p.url }}){:.highlight-green}: {{ p.description }}
{% endfor %}
- [*...see all*](/blog)

## \>>> Recent competitions

| Competition | Result | Team |
|---|
{% for c in site.data.competitions limit:3 %} | [{{ c.name }}]({{ c.url }}) | {{ c.result }} | {{ c.team }} |
{% endfor %}

([*...see all*](/competitions))

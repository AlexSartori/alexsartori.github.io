---
layout: default
title: All Projects
permalink: /projects
---

## \>>> All projects

{% for p in site.data.projects %}

### [{{ p.name }}]({{ p.url }}){:.highlight-blue}
{{ p.summary }}

---
{% endfor %}

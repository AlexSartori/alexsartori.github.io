---
layout: default
title: Competitions
permalink: /competitions
---

{% for c in site.data.competitions %}

### \>>> {{ c.name }}
{:.highlight-red}
**Link:** [{{ c.url }}]({{ c.url }}) \\
**Result:** {{ c.result }} \\
**Team:** {{ c.team }}

---
{% endfor %}

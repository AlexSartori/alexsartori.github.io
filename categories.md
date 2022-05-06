---
layout: default
title: Posts by Category
permalink: /categories
---

## \>>> Blog Posts by Category

{% capture all_cats %}{% for cat in site.categories %}{{ cat | first }} {% endfor %}{% endcapture %}
{% assign sorted_cats = all_cats | split: ' ' | sort %}

{% for category in sorted_cats %}
  - **{{ category | upcase }}**{:.highlight-green} ({{site.categories[category].size}} posts)
  {% for post in site.categories[category] %}
    - [{{ post.title }}]({{ post.url }})
  {% endfor %}
{% endfor %}

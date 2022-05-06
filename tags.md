---
layout: default
title: Posts by Tag
permalink: /tags
---

## \>>> Blog Posts by Tag

{% capture all_tags %}{% for tag in site.tags %}{{ tag | first }} {% endfor %}{% endcapture %}
{% assign sorted_tags = all_tags | split: ' ' | sort %}

{% for tag in sorted_tags %}
  - **{{ tag | upcase }}**{:.highlight-blue} ({{site.tags[tag].size}} posts)
  {% for post in site.tags[tag] %}
    - [{{ post.title }}]({{ post.url }})
  {% endfor %}
{% endfor %}

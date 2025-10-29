---
layout: page
title: POIs List
permalink: /pois/

---
<h1>{{ page.title }}</h1>

<ul>
  {% for p in site.pois %}
    <li>
      <a href="{{ p.url | relative_url}}">{{ p.title }}</a>
    </li>
  {% endfor %}
</ul>

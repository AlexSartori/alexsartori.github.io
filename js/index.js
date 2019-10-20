function load_projects(elm) {
    elm = $(elm);
    template =
        '<div class="project">\
            <a href="{proj.href}"><h3 class="proj-header">{proj.title}</h3></a>\
            {proj.logo_html}\
            <p>{proj.desc}</p>\
        </div>';

    $.getJSON("data/projects.json", function(data) {
        var items = [];
        $.each(data, function(key, p) {
            items.push(template
                .replace('{proj.title}', p.title)
                .replace('{proj.desc}', p.desc)
                .replace('{proj.href}', p.href)
                .replace('{proj.logo_html}', p.logo_html)
            );
        });

        elm.html(items.join("\n"));

        elm.slick({
            infinite: true,
            slidesToScroll: 1,
            autoplay: true,
            autoplaySpeed: 2000,
            variableWidth: true,
            centerMode: true
        });
    });
}

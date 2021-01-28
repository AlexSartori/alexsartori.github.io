module Jekyll
    module AssetFilter
        def ascii_box(txt)
            txt.chomp!
            len = txt.length
            pad = 3
            box = "+" + "-"*(len+pad*2) + "+\n"
            box += "|" + " "*pad + txt + " "*pad + "|\n"
            box += "+" + "-"*(len+pad*2) + "+"
        end
    end
end

Liquid::Template.register_filter(Jekyll::AssetFilter)

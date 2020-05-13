const confadoc =
`ifeval::["{lang}" == "fr"]
include::https://raw.githubusercontent.com/asciidoctor/asciidoctor/master/data/locale/attributes-fr.adoc[]
endif::[]

// Scaffolding
:experimental:
:hide-uri-scheme:
:numbered:
:toc: left

// IDs management
:idprefix:
:idseparator: -

// DocInfo
:docinfo: shared
:docinfodir: ./project/docinfo/

include::./variables.adoc[]

`

module.exports = confadoc;

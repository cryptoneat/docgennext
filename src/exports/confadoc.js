const confadoc = `// French translation
ifeval::["{lang}" == "fr"]
include::https://raw.githubusercontent.com/asciidoctor/asciidoctor/master/data/locale/attributes-fr.adoc[]
endif::[]

// Scaffolding
:experimental:
:hide-uri-scheme:
:numbered:
:toc: left
:toclevels: 3
:sectnumlevels: 2

// IDs management
:idprefix:
:idseparator: -

// DocInfo
:docinfo: shared
:docinfodir: ./docinfo/

ifeval::["{backend}" == "html5"]
:highlightjs-theme: github
:nofooter:
:source-highlighter: highlightjs
endif::[]

include::./variables.adoc[]
`

module.exports = confadoc

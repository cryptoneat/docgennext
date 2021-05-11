const confadoc = `// French translation
ifeval::["{lang}" == "fr"]
include::https://raw.githubusercontent.com/asciidoctor/asciidoctor/master/data/locale/attributes-fr.adoc[]
endif::[]

// Folders
:docinfodir: ./docinfo/
:iconsdir: ./icons
:imagesdir: ./images
:stylesdir: ./styles

// Scaffolding
:docinfo: shared
:experimental:
:hide-uri-scheme:
:icons: font
:numbered:
:sectnumlevels: 2
:toc: left
:toclevels: 3

// IDs management
:idprefix:
:idseparator: -

ifeval::["{backend}" == "html5"]
:highlightjs-theme: github
:nofooter:
:source-highlighter: highlightjs
endif::[]

include::./variables.adoc[]
`

module.exports = confadoc

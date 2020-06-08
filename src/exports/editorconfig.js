const editorconfig = `# EditorConfig is awesome: https://editorconfig.org
root = true

[*]
charset = utf-8
indent_style = space
indent_size = 2
insert_final_newline = true
trim_trailing_whitespace = true
end_of_line = lf

[{*.md, *.adoc}]
max_line_length = off
trim_trailing_whitespace = false
`

module.exports = editorconfig

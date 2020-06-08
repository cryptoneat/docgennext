const index = `// Requires node
const util = require('util')
const stat = util.promisify(require('fs').stat)
const mkdir = util.promisify(require('fs').mkdir)
const readFile = util.promisify(require('fs').readFile)
const readdir = util.promisify(require('fs').readdir)
const copyFile = util.promisify(require('fs').copyFile)
const writeFile = util.promisify(require('fs').writeFile)
const unlink = util.promisify(require('fs').unlink)

// Requires third party
const moment = require('moment')
const asciidoctor = require('asciidoctor')()
const asciidoctorCore = require('@asciidoctor/core')()
const kroki = require('asciidoctor-kroki')
const chalk = require('chalk')

const packageJsonFile = 'package.json'

// Set configuration
kroki.register(asciidoctorCore.Extensions)
moment.locale('fr')

readFile(packageJsonFile, { encoding: 'utf8' }, (error, data) => {
  if (error) throw error

  const packageJson = JSON.parse(data)

  // TODO : Il faudra récupérer le port dans le fichier package.json pour le serveur local.
  const options = {
    standalone: true,
    doctype: 'article',
    safe: 'unsafe',
    mkdirs: true,
    to_dir: './build/',
    to_file: 'index.html',
    attributes: {
      lang: packageJson.config.attributes.lang,
      encoding: packageJson.config.attributes.encoding,
      doctitle: packageJson.config.attributes.doctitle,
      subtitle: packageJson.config.attributes.subtitle,
      description: packageJson.description,
      author: packageJson.config.attributes.author,
      authors: packageJson.config.attributes.authors,
      email: packageJson.config.attributes.email,
      revdate: moment().format('dddd Do MMMM YYYY[,] HH:mm'),
      revnumber: packageJson.version,
      imagesdir: 'images/',
      imagesoutdir: './build/images/',
      'allow-uri-read': '',
      'kroki-server-url': packageJson.config.attributes['kroki-server-url'],
      'kroki-fetch-diagram': packageJson.config.attributes['kroki-fetch-diagram']
    }
  }

  /* ! WARNING : DO NOT USE / AT THE END OF STRING */
  const copyToBuild = [
    './project/icons',
    './project/images',
    './project/styles'
  ]

  /* ! WARNING : DO NOT USE / AT THE END OF STRING */
  const gitkeepWatch = [
    './project/chapters',
    './project/docinfo',
    './project/templates',
    ...copyToBuild
  ]

  // Keep folders on track with the .gitkeep file
  gitkeepWatch.forEach(folder => {
    // Take files from folder
    readdir(folder, (error, files) => {
      if (error) throw error

      if (files.length > 1 && files.includes('.gitkeep')) {
        // Delete
        unlink(\`\${folder}/.gitkeep\`, (error) => {
          if (error) console.log(error)
        })
      } else if (files.length === 0) {
        // Or create
        writeFile(\`\${folder}/.gitkeep\`, (error) => {
          if (error) console.log(error)
        })
      }
    })
  })

  // Copy files in a build directory
  copyToBuild.forEach(folder => {
    const destination = \`./build/\${folder.slice(10)}/\`

    // Get files in a source folder
    readdir(folder, (error, files) => {
      if (error) console.log(error)

      files.forEach((file, index) => {
        // If not hidden file
        if (file.charAt(0) !== '.') {
          // Create the folder structure
          mkdir(destination, { recursive: true }, () => {
            const filecopied = \`\${folder}/\${file}\`

            // Get the modification time of the destination file
            stat(\`\${destination}/\${file}\`, (error, stats) => {
              const destFile = (!error) ? stats.mtimeMs : 0

              // Get the modification time of the source file
              stat(filecopied, (error, stats) => {
                if (!error) {
                  const srcFile = stats.mtimeMs

                  // If the source it's newer from the destination, then copy file to the destination folder
                  if (destFile < srcFile) {
                    copyFile(filecopied, \`\${destination}/\${file}\`)

                    if (packageJson.config.attributes.lang === 'fr') {
                      console.log('Fichier', chalk.green(filecopied), 'copié dans le dossier', chalk.green(destination))
                    } else {
                      console.log('File', chalk.green(filecopied), 'copied in the folder:', chalk.green(destination))
                    }
                  }
                }
              })
            })
          }).catch(e => { throw e })
        }
      })
    })
  })

  asciidoctor.convertFile('./project/main.adoc', options)
})
`

module.exports = index

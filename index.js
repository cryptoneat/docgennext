#!/usr/bin/env node

/**
 * Writen with Node v12.16.3 & npm 6.14.4
 */

// Requires node
const util = require('util')
const readFile = util.promisify(require('fs').readFile)
const writeFile = util.promisify(require('fs').writeFile)
const appendFile = util.promisify(require('fs').appendFile)
const mkdir = util.promisify(require('fs').mkdir)
const exec = util.promisify(require('child_process').exec)
const spawn = require('child_process').spawn
const https = require('https')
const path = require('path')

// Requires third party
const simpleGit = require('simple-git/promise')()
const yargs = require('yargs').argv
const prompts = require('prompts')
const chalk = require('chalk')

// Requires files
const pack = require('./package.json')
const i18n = require('./src/questions-i18n')
const gentools = require('./src/gentools')
const index = require('./src/exports/index')
const readme = require('./src/exports/readme')
const confadoc = require('./src/exports/confadoc')
const editorconfig = require('./src/exports/editorconfig')

const processEnvLang = (process.env.LANG !== undefined && process.env.LANG.substr(0, 2) === 'fr') ? 'fr' : 'en'
const packageJsonFile = 'package.json'

// If the questions are canceled, quit all process become after this.
let next = true
let autolaunch = true

const questions = [
  {
    type: 'text',
    name: 'title',
    message: i18n[processEnvLang].title,
    validate: value => value !== '',
    format: value => {
      const name = gentools.filterName(value) // name for the package.json (npm normalise).
      const title = gentools.filterCapitalizeFirst(value) // documentation title (:doctitle:).
      return { name: name, title: title }
    }
  },
  {
    type: 'select',
    name: 'lang',
    message: i18n[processEnvLang].lang,
    choices: [
      { title: 'fr', description: 'Documentation en Français', value: 'fr' },
      { title: 'en', description: 'English documentation', value: 'en' }
    ],
    initial: 0,
    validate: value => Number.isFinite(value)
  },
  {
    type: 'text',
    name: 'author',
    message: i18n[processEnvLang].author,
    initial: process.env.USER,
    validate: value => value !== '',
    format: value => value.trim()
  },
  {
    type: 'text',
    name: 'email',
    message: i18n[processEnvLang].email,
    validate: value => value === '' || gentools.filterEmail(value), // Accepted value : empty or checked email.
    format: value => value.trim()
  },
  {
    type: 'text',
    name: 'description',
    message: i18n[processEnvLang].description,
    validate: value => value !== '',
    format: value => gentools.filterCapitalizeFirst(value)
  },
  {
    type: 'text',
    name: 'versionDoc',
    message: i18n[processEnvLang].version,
    initial: '0.1.0',
    format: value => gentools.filterVersion(value)
  },
  {
    type: 'number',
    name: 'port',
    message: i18n[processEnvLang].port,
    initial: 8080,
    style: 'default',
    max: 9999
  },
  {
    type: 'text',
    name: 'kroki',
    message: i18n[processEnvLang].kroki,
    initial: 'https://kroki.io/',
    format: value => value.trim()
  },
  {
    type: 'confirm',
    name: 'autolaunch',
    message: i18n[processEnvLang].autolaunch,
    initial: true
  }
]

// Clean the Terminal
// console.clear() do not work on Windows (only nodejs console).
console.log('\x1Bc')

// Welcoming announcement
console.log(
  chalk.grey(i18n[processEnvLang].welcome + chalk.white(' Asciidoc.js') + ' (version : ' + pack.version + ').')
)

prompts.override(yargs)

function start () {
  const onCancel = (prompt) => {
    next = false
    // The goodbye announcement
    return console.log(chalk.green(`\n${i18n[processEnvLang].bye}\n`))
  }

  return prompts(questions, { onCancel })
}

async function init (answers) {
  if (next) {
    await exec('npm init --yes')
    await building(answers)
  }
}

function building (answers) {
  let newPackageJson = ''

  readFile(path.resolve(packageJsonFile), { encoding: 'utf8' }, (error, data) => {
    if (error) throw error

    autolaunch = answers.autolaunch

    newPackageJson = JSON.parse(data)

    newPackageJson.name = answers.title.name
    newPackageJson.version = answers.versionDoc
    newPackageJson.description = answers.description
    newPackageJson.main = 'index.js'
    newPackageJson.scripts.start = 'node index.js && npm run concurrently'
    newPackageJson.scripts.concurrently = 'concurrently -n "reload,script" -p "[{name}]" -c "green,blue" "npm run reload" "npm run nodemon"'
    newPackageJson.scripts.reload = 'reload -b -p $npm_package_config_port -d build'
    newPackageJson.scripts.nodemon = 'nodemon --exec "node index.js" --watch project --ext adoc,md,html,css,ico,png,jpg,gif'
    newPackageJson.scripts.pdf = `asciidoctor-web-pdf -T ./project/templates -o ./build/${answers.title.name}.pdf ./project/main.adoc`
    newPackageJson.scripts['pdf-preview'] = 'asciidoctor-web-pdf --preview --watch -T ./project/templates ./project/main.adoc'
    newPackageJson.scripts.docbook = 'asciidoctor --require @asciidoctor/docbook-converter --backend docbook project/main.adoc -o build/book.xml'
    newPackageJson.scripts.pandoc = 'pandoc build/book.xml -f docbook -t docx -s -o build/index.docx'
    newPackageJson.scripts.word = 'npm run docbook && npm run pandoc'
    newPackageJson.config = {
      port: answers.port,
      creation: new Date(),
      attributes: {
        lang: answers.lang,
        encoding: 'utf-8',
        doctitle: answers.title.title,
        author: answers.author.split(',')[0], // Keep the first and main author.
        // If more then one, we keep everyone or no one.
        authors: (answers.author.split(',').length > 1) ? answers.author : '',
        email: answers.email,
        imagesdir: 'images/',
        imagesoutdir: './build/images/',
        'allow-uri-read': '',
        'kroki-server-url': answers.kroki,
        'kroki-fetch-diagram': true
      }
    }

    writeFile(path.resolve(packageJsonFile), JSON.stringify(newPackageJson, null, 2), error => {
      if (error) throw error
    }).then(() => {
      let cmd = 'npm'

      if (process.platform === 'win32') {
        cmd = 'npm.cmd'
      }

      const install = spawn(cmd, ['i', '--save',
        '@asciidoctor/core',
        '@asciidoctor/docbook-converter',
        'asciidoctor',
        'asciidoctor-color',
        'asciidoctor-emoji',
        'asciidoctor-kroki',
        'asciidoctor-pdf',
        'chalk',
        'concurrently',
        'moment',
        'nodemon',
        'nunjucks',
        'reload',
        'yargs'
      ], { stdio: 'inherit' })

      install.on('close', () => {
        https.get('https://www.toptal.com/developers/gitignore/api/osx,vim,node,linux,emacs,nanoc,windows,intellij+all,visualstudiocode',
          (res) => {
            if (res.statusCode === 200) {
              let gitignore = ''

              res.on('data', (datas) => {
                gitignore += datas
              })

              res.on('end', () => {
                writeFile('.gitignore', gitignore, 'utf8').then(() => {
                  appendFile('.gitignore', '\n# Doc project\nbuild/\nproject/*.pdf\nproject/*.html\n').then(() => {
                    simpleGit.init().then(() => {
                      simpleGit.add('.').then(() => {
                        simpleGit.commit('Initial commit').then(() => {
                          // Ending announcement
                          console.log(chalk.green('\n' + i18n[processEnvLang].finished + '\n'))

                          if (autolaunch) {
                            spawn(cmd, ['start'], { stdio: 'inherit' })
                          }
                        })
                      })
                    })
                  })
                }).catch(e => { throw e })
              })
            } else {
              console.log(chalk.red('[ERROR]', res.statusCode))
            }
          })
      })
    })

    mkdir(path.resolve('./project' + '/chapters'), { recursive: true }, () => {
      writeFile(path.resolve('./project' + '/chapters' + '/.gitkeep'), '')
      writeFile(path.resolve('./project' + '/' + 'variables.adoc'), `// ${i18n[processEnvLang].varfilecomment}\n`)
      writeFile(path.resolve('./project' + '/' + 'confadoc.adoc'), confadoc)
      writeFile(path.resolve('./project' + '/' + 'main.adoc'),
        `include::./confadoc.adoc[]\n\n= ${answers.title.title}\n`)
    }).catch(e => { throw e })

    mkdir(path.resolve('./project' + '/docinfo'), { recursive: true }, () => {
      writeFile(path.resolve('./project' + '/docinfo' + '/.gitkeep'), '')
    }).catch(e => { throw e })

    mkdir(path.resolve('./project' + '/icons'), { recursive: true }, () => {
      writeFile(path.resolve('./project' + '/icons' + '/.gitkeep'), '')
    }).catch(e => { throw e })

    mkdir(path.resolve('./project' + '/images'), { recursive: true }, () => {
      writeFile(path.resolve('./project' + '/images' + '/.gitkeep'), '')
    }).catch(e => { throw e })

    mkdir(path.resolve('./project' + '/styles'), { recursive: true }, () => {
      writeFile(path.resolve('./project' + '/styles' + '/.gitkeep'), '')
    }).catch(e => { throw e })

    mkdir(path.resolve('./project' + '/templates'), { recursive: true }, () => {
      writeFile(path.resolve('./project' + '/templates' + '/.gitkeep'), '')
    }).catch(e => { throw e })

    writeFile('.editorconfig', editorconfig).catch(e => { throw e })

    writeFile('README.md', readme(answers.title.title, answers.description)).catch(e => { throw e })

    writeFile('index.js', index).catch(e => { throw e })
  })

  return newPackageJson
}

(async function final () {
  const answers = await start()
  await init(answers)
})()

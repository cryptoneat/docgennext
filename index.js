#!/usr/bin/env node

/**
 * Writen with Node v12.16.3 & npm 6.14.4
 */

// Requires node
const util = require('util');
const readFile = util.promisify(require('fs').readFile);
const writeFile = util.promisify(require('fs').writeFile);
const appendFile = util.promisify(require('fs').appendFile);
const mkdir = util.promisify(require('fs').mkdir);
const exec = util.promisify(require('child_process').exec);
const spawn = require('child_process').spawn;
const https = require('https');

// Requires third party
const simpleGit = require('simple-git/promise')();
const yargs = require('yargs').argv;
const prompts = require('prompts');
const chalk = require('chalk');

// Requires files
const pack = require('./package.json');
const i18n = require('./src/questions-i18n');
const gentools = require('./src/gentools');
const index = require('./src/exports/index');
const readme = require('./src/exports/readme');
const confadoc = require('./src/exports/confadoc');
const editorconfig = require('./src/exports/editorconfig');

const processEnvLang = (process.env.LANG.substr(0,2) === 'fr')  ? 'fr' : 'en';
const packageJsonFile = 'package.json';

const questions = [
  {
    type: 'text',
    name: 'title',
    message: i18n[processEnvLang].title,
    validate: value => value !== '',
    format: value => {
      let name = gentools.filterName(value);             // name for the package.json (npm normalise).
      let title = gentools.filterCapitalizeFirst(value); // documentation title (:doctitle:).
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
    name: 'subtitle',
    message: i18n[processEnvLang].subtitle,
    format: value => value.trim()
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
    validate: value => value === '' || gentools.filterEmail(value), // Accepted value : empty or checked email.
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
];

// Clean the Terminal
// console.clear() do not work on Windows (only nodejs console).
console.log('\x1Bc');

// Welcoming announcement
console.log(
  chalk.grey(i18n[processEnvLang].welcome + chalk.white(' Asciidoc.js') + ' (version : ' + pack.version + ').')
);

// If the questions are canceled, quit all process become after this.
let next = true;

prompts.override(yargs);

function start() {
  const onCancel = (prompt) => {
    next = false;
    // The goodbye announcement
    return console.log(chalk.green(`\n${i18n[processEnvLang].bye}\n`));
  };

  return prompts(questions, { onCancel });
}

async function init(answers) {
  if (next) {
    try {
      await exec('npm init --yes');
      await building(answers);
    } catch (e) {
      throw e;
    }
  }
}

function building(answers) {
  let newPackageJson = '';

  readFile(packageJsonFile, { encoding: 'utf8' }, (error, data) => {
    if (error) throw error;

    newPackageJson = JSON.parse(data);

    newPackageJson.name = answers.title.name;
    newPackageJson.version = answers.versionDoc;
    newPackageJson.description = answers.description;
    newPackageJson.main = 'index.js';
    newPackageJson.scripts.start = 'node index.js';
    newPackageJson.scripts.pdf = 'asciidoctor-pdf -T ./project/templates ./main.adoc';
    newPackageJson.config = {
      confirm: answers.autolaunch,
      port: answers.port,
      creation: new Date(),
      attributes: {
        'lang': answers.lang,
        'encoding': 'utf-8',
        'doctitle': answers.title.title,
        'subtitle': answers.subtitle,
        'author': answers.author.split(',')[0], // Keep the first and main author.
        // If more then one, we keep everyone or no one.
        'authors': (answers.author.split(',').length > 1) ? answers.author : '',
        'email': answers.email,
        'imagesdir': 'images/',
        'imagesoutdir': './build/images/',
        'allow-uri-read': '',
        'kroki-server-url': answers.kroki,
        'kroki-fetch-diagram': true
      }
    };

    writeFile(packageJsonFile, JSON.stringify(newPackageJson, null, 2), error => {
      if (error) throw error;
    }).then(() => {
      const install = spawn('npm', ['i', '--save',
        '@asciidoctor/core',
        'asciidoctor',
        'asciidoctor-pdf',
        'asciidoctor-kroki',
        'chalk',
        'moment',
        'nunjucks',
        'yargs'
      ], { stdio: 'inherit' });

      install.on('close', () => {
        https.get('https://www.gitignore.io/api/osx,vim,node,linux,emacs,nanoc,windows,intellij+all,visualstudiocode',
          (res) => {
            if (res.statusCode === 200) {
              let gitignore =  '';

              res.on('data', (datas) => {
                gitignore += datas;
              });

              res.on('end', () => {
                writeFile('.gitignore', gitignore, 'utf8').then(() => {
                  appendFile('.gitignore', '\n# Doc project\nbuild/\n').then(() => {
                    simpleGit.init().then(() => {
                      simpleGit.add('.').then(() => {
                        simpleGit.commit('Initial commit.').then(() => {
                          // Ending announcement
                          console.log(chalk.green('\n' + i18n[processEnvLang].finished + '\n'));
                        });
                      });
                    });
                  });
                }).catch(e => { throw e });
              });
            }
          });
      });
    });

    mkdir('./project/chapters', { recursive: true }, () => {
      writeFile('./project/chapters/.gitkeep', '');
      writeFile('./project/variables.adoc', `// ${i18n[processEnvLang].varfilecomment}\n`);
      writeFile('./project/confadoc.adoc', confadoc);
      writeFile('./project/main.adoc', 'include::./confadoc.adoc[]\n');
    }).catch(e => { throw e });

    mkdir('./project/icons', { recursive: true }, () => {
      writeFile('./project/icons/.gitkeep', '');
    }).catch(e => { throw e });

    mkdir('./project/images', { recursive: true }, () => {
      writeFile('./project/images/.gitkeep', '');
    }).catch(e => { throw e });

    mkdir('./project/styles', { recursive: true }, () => {
      writeFile('./project/styles/.gitkeep', '');
    }).catch(e => { throw e });

    mkdir('./project/docinfo', { recursive: true }, () => {
      writeFile('./project/docinfo/.gitkeep', '');
    }).catch(e => { throw e });

    mkdir('./project/templates', { recursive: true }, () => {
      writeFile('./project/templates/.gitkeep', '');
    }).catch(e => { throw e });

    writeFile('.editorconfig', editorconfig).catch(e => { throw e });

    writeFile('README.md', readme(answers.title.title, answers.description)).catch(e => { throw e });

    writeFile('index.js', index).catch(e => { throw e });
  });

  return newPackageJson;
}

(async function final() {
  try {
    const answers = await start();

    await init(answers);
  } catch (e) {
    throw e;
  }
})();

#!/usr/bin/env node

const prompts = require('prompts');
const chalk = require('chalk');

const pack = require('./package.json');
const i18n = require('./src/questions-i18n');
const gentools = require('./src/gentools');

const processEnvLang = process.env.LANG.substr(0,2);
const lang = (processEnvLang === 'fr') ? 'fr' : 'en';
const ganl = (processEnvLang !== 'fr') ? 'fr' : 'en';

const questions = [
  {
    type: 'text',
    name: 'titles',
    message: i18n[lang].titles,
    validate: value => value !== '',
    format: value => {
      let name = gentools.filterName(value);             // name for the package.json (npm normalise).
      let title = gentools.filterCapitalizeFirst(value); // documentation title.
      return { name: name, title: title }
    }
  },
  {
    type: 'toggle',
    name: 'lang',
    message: i18n[lang].lang,
    initial: processEnvLang,
    active: lang,
    inactive: ganl
  },
  {
    type: 'text',
    name: 'subtitle',
    message: i18n[lang].subtitle,
    format: value => value.trim()
  },
  {
    type: 'text',
    name: 'author',
    message: i18n[lang].author,
    initial: process.env.USER,
    validate: value => value !== '',
    format: value => value.trim()
  },
  {
    type: 'text',
    name: 'mail',
    message: i18n[lang].mail,
    validate: value => value === '' || gentools.filterEmail(value)
  },
  {
    type: 'text',
    name: 'description',
    message: i18n[lang].description,
    validate: value => value !== '',
    format: value => gentools.filterCapitalizeFirst(value)
  },
  {
    type: 'text',
    name: 'version',
    message: i18n[lang].version,
    initial: '0.1.0',
    format: value => gentools.filterVersion(value)
  },
  {
    type: 'number',
    name: 'port',
    message: i18n[lang].port,
    initial: 8080,
    style: 'default',
    max: 9999
  },
  {
    type: 'text',
    name: 'kroki',
    message: i18n[lang].kroki,
    initial: 'https://kroki.io/',
    format: value => value.trim()
  },
  {
    type: 'confirm',
    name: 'autolaunch',
    message: i18n[lang].autolaunch,
    initial: true
  }
];

// Clean the Terminal
// console.clear() do not work on Windows (only nodejs console).
console.log('\x1Bc');

// Welcoming announcement
console.log(chalk.grey(i18n[lang].welcome + chalk.white(' Asciidocjs') + '. (version : ' + pack.version + ')'));

prompts.override(require('yargs').argv);

(async () => {
  const onCancel = (prompt) => {
    console.log(chalk.green('\n' + i18n[lang].bye + '\n'));
    return false;
  };

  const response = await prompts(questions, { onCancel });
})();

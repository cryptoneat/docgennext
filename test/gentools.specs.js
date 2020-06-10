const Gentools = require('../src/gentools')
const expect = require('chai').expect
const chalk = require('chalk')

/* eslint-disable no-unused-expressions */
describe('Using GenTools', () => {
  describe(`- Call ${chalk.italic('filterCapitalizeAll')} :`, () => {
    it(`It's a ${chalk.italic('fonction')}.`, () => {
      expect(Gentools.filterCapitalizeAll).to.be.a('function')
    })
    it(`Return a ${chalk.italic('string')}.`, () => {
      expect(Gentools.filterCapitalizeAll()).to.be.a('string').that.is.empty
      expect(Gentools.filterCapitalizeAll('')).to.be.a('string').that.is.empty
    })
    it('Works for edge case.', () => {
      expect(Gentools.filterCapitalizeAll(1)).to.equal('').that.is.empty
      expect(Gentools.filterCapitalizeAll(null)).to.equal('').that.is.empty
      expect(Gentools.filterCapitalizeAll(undefined)).to.equal('').that.is.empty
      expect(Gentools.filterCapitalizeAll(true)).to.equal('').that.is.empty
      expect(Gentools.filterCapitalizeAll(function () {})).to.equal('').that.is.empty
      expect(Gentools.filterCapitalizeAll({})).to.equal('').that.is.empty
      expect(Gentools.filterCapitalizeAll([])).to.equal('').that.is.empty
      expect(Gentools.filterCapitalizeAll([3, 'test'])).to.equal('').that.is.empty
    })
    it('It\'s ok.', () => {
      expect(Gentools.filterCapitalizeAll('')).to.equal('').that.is.empty
      expect(Gentools.filterCapitalizeAll('lorem ipsum dolor sit amet')).to.equal('Lorem Ipsum Dolor Sit Amet')
      expect(Gentools.filterCapitalizeAll('nom d\'une documentation')).to.equal('Nom D\'une Documentation')
      expect(Gentools.filterCapitalizeAll('noM d\'uNe dOcumENtaTion')).to.equal('Nom D\'une Documentation')
      expect(Gentools.filterCapitalizeAll('nom')).to.equal('Nom')
    })
  })

  describe(`- Call ${chalk.italic('filterCapitalizeFirst')} :`, () => {
    it(`It's a ${chalk.italic('fonction')}.`, () => {
      expect(Gentools.filterCapitalizeFirst).to.be.a('function')
    })
    it(`Return a ${chalk.italic('string')}.`, () => {
      expect(Gentools.filterCapitalizeFirst()).to.be.a('string').that.is.empty
      expect(Gentools.filterCapitalizeFirst('')).to.be.a('string').that.is.empty
    })
    it('Works for edge case.', () => {
      expect(Gentools.filterCapitalizeFirst(1)).to.equal('').that.is.empty
      expect(Gentools.filterCapitalizeFirst(null)).to.equal('').that.is.empty
      expect(Gentools.filterCapitalizeFirst(undefined)).to.equal('').that.is.empty
      expect(Gentools.filterCapitalizeFirst(false)).to.equal('').that.is.empty
      expect(Gentools.filterCapitalizeFirst(function () {})).to.equal('').that.is.empty
      expect(Gentools.filterCapitalizeFirst({})).to.equal('').that.is.empty
      expect(Gentools.filterCapitalizeFirst([])).to.equal('').that.is.empty
      expect(Gentools.filterCapitalizeFirst([3, 'test'])).to.equal('').that.is.empty
    })
    it('It\'s ok.', () => {
      expect(Gentools.filterCapitalizeFirst('')).to.equal('').that.is.empty
      expect(Gentools.filterCapitalizeFirst('lorem ipsum dolor sit amet')).to.equal('Lorem ipsum dolor sit amet')
      expect(Gentools.filterCapitalizeFirst('nom d\'une documentation')).to.equal('Nom d\'une documentation')
      expect(Gentools.filterCapitalizeFirst('noM d\'uNe dOcumENtaTion')).to.equal('Nom d\'une documentation')
      expect(Gentools.filterCapitalizeFirst('nom')).to.equal('Nom')
    })
  })

  describe(`- Vérification du mail avec ${chalk.italic('filterEmail')} :`, () => {
    it(`It's a ${chalk.italic('fonction')}.`, () => {
      expect(Gentools.filterEmail).to.be.a('function')
    })
    it(`Return a ${chalk.italic('boolean')}.`, () => {
      expect(Gentools.filterEmail()).to.be.a('boolean')
      expect(Gentools.filterEmail('')).to.be.a('boolean')
    })
    it('Works for edge case.', () => {
      expect(Gentools.filterEmail(1)).to.equal(false)
      expect(Gentools.filterEmail(null)).to.equal(false)
      expect(Gentools.filterEmail(undefined)).to.equal(false)
      expect(Gentools.filterEmail(false)).to.equal(false)
      expect(Gentools.filterEmail(function () {})).to.equal(false)
      expect(Gentools.filterEmail({})).to.equal(false)
      expect(Gentools.filterEmail([])).to.equal(false)
      expect(Gentools.filterEmail([3, 'test'])).to.equal(false)
    })
    it('Not an email.', () => {
      expect(Gentools.filterEmail('john doe')).to.equal(false)
      expect(Gentools.filterEmail('john.doemail.fr')).to.equal(false)
      expect(Gentools.filterEmail('john.döe@mail.fr')).to.equal(false)
      expect(Gentools.filterEmail('john.doe@mail')).to.equal(false)
    })
    it('It\'s an email.', () => {
      expect(Gentools.filterEmail('john.doe@mail.fr')).to.equal(true)
      expect(Gentools.filterEmail('John.Doe@mail.fr')).to.equal(true)
      expect(Gentools.filterEmail('John22@mail.fr')).to.equal(true)
    })
  })

  describe(`- Check the field ${chalk.bold('npm')} with ${chalk.italic('filterName')} :`, () => {
    it(`It's a ${chalk.italic('fonction')}.`, () => {
      expect(Gentools.filterName).to.be.a('function')
    })
    it(`Return a ${chalk.italic('string')}.`, () => {
      expect(Gentools.filterName()).to.be.a('string').that.is.empty
      expect(Gentools.filterName('')).to.be.a('string').that.is.empty
    })
    it('Works for edge case.', () => {
      expect(Gentools.filterName(1)).to.be.a('string').that.is.empty
      expect(Gentools.filterName(null)).to.be.a('string').that.is.empty
      expect(Gentools.filterName(undefined)).to.be.a('string').that.is.empty
      expect(Gentools.filterName(false)).to.be.a('string').that.is.empty
      expect(Gentools.filterName(function () {})).to.be.a('string').that.is.empty
      expect(Gentools.filterName({})).to.be.a('string').that.is.empty
      expect(Gentools.filterName([])).to.be.a('string').that.is.empty
      expect(Gentools.filterName([3, 'test'])).to.be.a('string').that.is.empty
    })
    it('It\'s ok.', () => {
      expect(Gentools.filterName('paquet npm')).to.equal('paquet_npm')
      expect(Gentools.filterName(' ÉmilE d\'ÜvalEt   ')).to.equal('emile_duvalet')
    })
  })

  describe(`- Check the field ${chalk.bold('port')} with ${chalk.italic('filterPort')} :`, () => {
    it(`It's a ${chalk.italic('fonction')}.`, () => {
      expect(Gentools.filterPort).to.be.a('function')
    })
    it(`Return a ${chalk.italic('number')}.`, () => {
      expect(Gentools.filterPort()).to.be.a('number').that.equal(6660)
      expect(Gentools.filterPort('')).to.be.a('number').that.equal(6660)
      expect(Gentools.filterPort(999)).to.be.a('number').that.equal(6660)
      expect(Gentools.filterPort(1000)).to.be.a('number').that.equal(1000)
      expect(Gentools.filterPort(10000)).to.be.a('number').that.equal(6660)
    })
    it('Works for edge case.', () => {
      expect(Gentools.filterPort(1)).to.be.a('number').that.equal(6660)
      expect(Gentools.filterPort(null)).to.be.a('number').that.equal(6660)
      expect(Gentools.filterPort(undefined)).to.be.a('number').that.equal(6660)
      expect(Gentools.filterPort(false)).to.be.a('number').that.equal(6660)
      expect(Gentools.filterPort(function () {})).to.be.a('number').that.equal(6660)
      expect(Gentools.filterPort({})).to.be.a('number').that.equal(6660)
      expect(Gentools.filterPort([])).to.be.a('number').that.equal(6660)
      expect(Gentools.filterPort([3, 'test'])).to.be.a('number').that.equal(6660)
    })
    it('It\'s ok.', () => {
      expect(Gentools.filterPort(0)).to.equal(6660)
      expect(Gentools.filterPort(1)).to.equal(6660)
      expect(Gentools.filterPort(999)).to.equal(6660)
      expect(Gentools.filterPort(1000)).to.equal(1000)
      expect(Gentools.filterPort(6660)).to.equal(6660)
      expect(Gentools.filterPort(9999)).to.equal(9999)
      expect(Gentools.filterPort(10000)).to.equal(6660)
    })
  })

  describe(`- Check the field ${chalk.bold('version')} with ${chalk.italic('filterVersion')} :`, () => {
    it(`It's a ${chalk.italic('fonction')}.`, () => {
      expect(Gentools.filterVersion).to.be.a('function')
    })
    it(`Return a ${chalk.italic('string')}.`, () => {
      expect(Gentools.filterVersion()).to.be.a('string').that.equal('0.1.0')
      expect(Gentools.filterVersion('')).to.be.a('string').that.equal('0.1.0')
    })
    it('Works for edge case.', () => {
      expect(Gentools.filterVersion(1)).to.be.a('string').that.equal('0.1.0')
      expect(Gentools.filterVersion(null)).to.be.a('string').that.equal('0.1.0')
      expect(Gentools.filterVersion(undefined)).to.be.a('string').that.equal('0.1.0')
      expect(Gentools.filterVersion(false)).to.be.a('string').that.equal('0.1.0')
      expect(Gentools.filterVersion(function () {})).to.be.a('string').that.equal('0.1.0')
      expect(Gentools.filterVersion({})).to.be.a('string').that.equal('0.1.0')
      expect(Gentools.filterVersion([])).to.be.a('string').that.equal('0.1.0')
      expect(Gentools.filterVersion([3, 'test'])).to.be.a('string').that.equal('0.1.0')
    })
    it('It\'s ok.', () => {
      expect(Gentools.filterVersion('0.1.0')).to.equal('0.1.0')
      expect(Gentools.filterVersion('  0,1,45   ')).to.equal('0.1.45')
      expect(Gentools.filterVersion(' 2;14;0  ')).to.equal('2.14.0')
      expect(Gentools.filterVersion(' 42;3,9  ')).to.equal('42.3.9')
    })
  })
})

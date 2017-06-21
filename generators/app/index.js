/**
 * @license
 * Copyright (c) 2016 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
 */

'use strict';

const chalk = require('chalk');
const path = require('path');
const Generator = require('yeoman-generator');

module.exports = Generator.extend({
  initializing() {
    this.appname = this.appname.replace(/\s+/g, '-');
  },
  prompting() {
    const prompts = [
      {
        name: 'name',
        type: 'input',
        message: 'Element name',
        default: `${this.appname}${this.appname.includes('-') ? '' : '-element'}`),
        validate(name) {
          const nameContainsHyphen = name.includes('-');
          if (!nameContainsHyphen) {
            this.log(
              '\nUh oh, custom elements must include a hyphen in ' +
              'their name. Please try again.');
          }
        },
      },
      {
        name: 'description',
        type: 'input',
        message: 'Brief description of the element',
      },
    ];

    return this.prompt(prompts)
      .then((props) => {
        this.props = props;
        this.props.elementClassName = this.props.replace(
          /(^|-)(\w)/g,
          (_match, _p0, p1) => p1.toUpperCase());
      });
  },
  writing() {
    const name = this.props.name;

    this.sourceRoot(path.join(path.dirname(this.resolved), 'template'));

    this.fs.copyTpl(
      `${this.templatePath()}/**/?(.)!(_)*`,
      this.destinationPath(),
      this.props);

    this.fs.copyTpl(
      this.templatePath('_element.html'), `${name}.html`, this.props);

    this.fs.copyTpl(
      this.templatePath('test/_element_test.html'),
      `test/${name}_test.html`,
      this.props);
  },

  install() {
    this.log(chalk.bold('\nProject generated!'));
    this.log('Installing dependencies...');
    this.installDependencies({
      npm: false,
    });
  },

  end() {
    this.log(chalk.bold('\nSetup Complete!'));
    this.log(
        'Check out your new project README for information about what to do next.\n');
  }
});

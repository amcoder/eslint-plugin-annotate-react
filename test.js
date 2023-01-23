'use strict';

const { join } = require('path');

//------------------------------------------------------------------------------
// Test File Definitions
//------------------------------------------------------------------------------

const tests = {
  'data-component': {
    // Require the actual rule definition
    rule: require('./index').rules['data-component'],

    // Define eslintrc for the test
    ruleConfig: {
      env: {
        es6: true,
      },
      parser: join(__dirname, 'node_modules/@typescript-eslint/parser'),
      parserOptions: {
        ecmaVersion: 2019,
        sourceType: 'module',
        ecmaFeatures: {
          jsx: true,
        },
      },
      rules: {
        'data-component': 'error',
      },
    },

    // Define the test cases
    testCases: {
      valid: [
        // {
        //   code: `const Component = () => <div data-component="foo" />;`,
        // },
        {
          // Multiple return paths should not trigger the eslint warning
          code: `const Component = ({value}) => {
  if(value) {
    return <div />;
  } else {
    return <span />;
  }
}`,
        },
        {
          // Multiple return paths should not trigger the eslint warning
          code: `const Component = ({value}) => {
            return value ? <div /> : <span />
          };`,
        },
        {
          // Multiple return paths should not trigger the eslint warning
          code: `const Component = ({value}) => {
            const foo = <Foo />;

            return null;
          };`,
        },
      ],
      invalid: [
        {
          // Multiple components with errors
          code: `
            const Component1 = () => <div />;
            const Component2 = () => <span />;
          `,
          output: `
            const Component1 = () => <div data-component="Component1" />;
            const Component2 = () => <span data-component="Component2" />;
          `,
          errors: [
            'Component1 is missing the data-component attribute for the top-level element.',
            'Component2 is missing the data-component attribute for the top-level element.',
          ],
        },
        //         {
        //           code: /* tsx */ `const temp = () => {
        //             <Icon name="metrics-insights/insight-icon" size={24} />;
        //           };`,
        //           output: /* tsx */ `const temp = () => {
        //             <Icon
        // data-component="temp" name="metrics-insights/insight-icon" size={24} />;
        //           };`,
        //           errors: [
        //             'temp is missing the data-component attribute for the top-level element.',
        //           ],
        //         },
      ],
    },
  },
};

//------------------------------------------------------------------------------
// Test Runner Definition
//------------------------------------------------------------------------------

const { RuleTester } = require('eslint');

RuleTester.it = function (text, method) {
  test(text, method);
};

RuleTester.describe = function (text, method) {
  describe(text, method);
};

Object.keys(tests).forEach((key) => {
  const test = tests[key];

  const ruleTester = new RuleTester(test.ruleConfig);

  ruleTester.run(key, test.rule, test.testCases);
});

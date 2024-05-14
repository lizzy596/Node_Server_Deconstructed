# **Chapter 3b Converting to Typescript**

yarn add typescript --d

npx tsc –init

add express types
added type:module to package.json
added sourceType: module, to package.json

add node types

and type and sourceType module to the package.json
add your outDir folder to .gitignore
change index.js to index.ts

consulted https://blog.logrocket.com/how-to-set-up-node-typescript-express/
https://archive.is/Dkhxo#selection-1107.0-1171.1
https://typestrong.org/ts-node/docs/configuration/
https://github.com/tsconfig/bases/blob/main/bases/node20.json
https://codeforgeek.com/fix-unknown-file-extension-ts-error-in-ts-node/

    target: Enables the specification of the target JavaScript version that the compiler will output
    module: Facilitates the utilization of a module manager in the compiled JavaScript code, CommonJS is supported and is a standard in Node.js
    strict: Toggles strict type-checking protocols
    esModuleInterop: Enables the compilation of ES6 modules to CommonJS modules
    skipLibCheck: When set to true, bypasses type-checking of default library declaration files
    forceConsistentCasingInFileNames: When set to true, enforces case-sensitive file naming

(base tsconfig.json for various versions of node: npm install @tsconfig/node-lts --save-dev)

**Adding A Linter**

A linter-Code linting is the automated analysis of source code to find and report programmatic and stylistic errors. It helps reduce errors, thereby improving the quality of code delivered. Code linting has numerous benefits, including error detection, enforcing best practices, and enforcing coding style amongst others.

Linting helps catch errors by performing syntax checks, checking code quality, and ensuring consistency in formatting style. It is advisable to use always in projects to enforce a coding style.

ESLint is a static code analysis tool for JavaScript that helps developers find and fix problems in their code. It analyzes code for potential errors, enforces coding style conventions, and helps identify patterns that could lead to runtime errors or other issues. ESLint works by parsing JavaScript code into an abstract syntax tree (AST) and then applying a set of configurable rules to that AST.

add eslint/js and typescript-eslint
make eslint.config.js
added config recc by eslint-typescript
added scripts to package.json via https://gist.github.com/silver-xu/1dcceaa14c4f0253d9637d4811948437

{
"scripts": {
"lint": "eslint src/**/\*.ts",
"format": "eslint src/**/\*.ts --fix"
}
}

Adding Prettier --

Prettier is a well-known code formatter that supports a variety of different programming languages. It helps us avoid manually formatting our code by automatically formatting it based on a specified code style. The primary function of a linter is to improve your code by analyzing it and alerting you to any potential issues based on customizable or pre-defined rulesets. These rulesets, or rules, allow development teams to maintain a consistent coding style and identify potential bugs caused by inconsistent coding styles.

On the other hand, a code formatter like Prettier ensures a consistent style by parsing your code and re-printing it according to its rules. For example, you can specify a style that all JavaScript statements must end with a semicolon; the code formatter will automatically add the semicolon to all statements without one.

In essence, you can use ESLint to specify rulesets that must be adhered to and then use Prettier to fix cases in your code where these rulesets are broken.


From Prettier documentation regarding it vs linters

Linters have two categories of rules:

Formatting rules: eg: max-len, no-mixed-spaces-and-tabs, keyword-spacing, comma-style…

Prettier alleviates the need for this whole category of rules! Prettier is going to reprint the entire program from scratch in a consistent way, so it’s not possible for the programmer to make a mistake there anymore :)

Code-quality rules: eg no-unused-vars, no-extra-bind, no-implicit-globals, prefer-promise-reject-errors…

Prettier does nothing to help with those kind of rules. They are also the most important ones provided by linters as they are likely to catch real bugs with your code!

In other words, use Prettier for formatting and linters for catching bugs!

create .pretterrc
added scripts to package.json
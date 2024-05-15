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



module and moduleResolution

The first thing that needs clarification is the difference the module and moduleResolution compiler options. The former is an emit setting: what module-related code will tsc be willing to emit to JS? The easiest way to see the effect of this option is by toggling between settings commonjs and esnext:
Input code 	Output --module commonjs 	Output --module esnext
import { createSourceFile } from "typescript" 	"use strict"; Object.defineProperty(exports, "__esModule", { value: true }); const typescript_1 = require("typescript"); 	import { createSourceFile } from "typescript"

While this setting fundamentally controls emit, it can impose limitations on what module-related input code is allowed. For example, you cannot write imports in the style of import fs = require("fs") under --module es2015 (or higher ES targets) because there is no require to speak of in the ES module system. Additionally, using top-level await is only allowed in --module es2022 (or higher) or system because it requires corresponding support in the module loading system.

On the other hand, --moduleResolution is all about the algorithm used to answer the question “given a file system and some input file containing an import from "lodash", what files should I look for to find that module?” Obviously, the decision to look in a folder with a magical name node_modules is one related to Node (albeit one that a huge amount of non-Node tooling has copied for convenience), and is not going to be correct for every possible runtime.
Differences in moduleResolution

With this context, we’re ready to begin answering your question directly. The biggest, most noticeable difference between --module nodenext and --module esnext is that the former implies --moduleResolution nodenext, a new resolution mode designed for Node’s specific implementation of co-existing ESM and CJS, while the latter does not imply a moduleResolution setting because there is no such corresponding setting in TypeScript right now. Put another way, when you say you’re using --module esnext, you’re allowed to write, and we will emit, the latest and greatest ES module code constructs, but we will not do anything differently with deciding how imports resolve. You’ll likely continue using --moduleResolution node, which was designed for Node’s implementation of CJS. What does this mean for you? If you’re writing ESM for Node, you can probably make some stuff work with --module esnext and --moduleResolution node, but newer Node-specific features like package.json exports won’t work, and it will be extremely easy to shoot yourself in the foot when writing import paths. Paths will be evaluated by tsc under Node’s CJS rules, but then at runtime, Node will evaluate them under its ESM rules since you’re emitting ESM. There are significant differences between these algorithms—notably, the latter requires relative imports to use file extensions instead of dropping the .js, and index files have no special meaning, so you can’t import the index file just by naming the path to the directory.
Differences in module

The difference observable in the --module setting itself is a bit more subtle. As I mentioned before, in esnext you aren’t allowed to write import Foo = require("bar") because we assume there is no require. In nodenext, we know that a given module might be an ES module or it might be a CJS module, based on its file extension (.mts → .mjs implies ESM and .cts → .cjs implies CJS) and/or the type field in the nearest package.json file. --module nodenext enables looking at these things to make decisions about what kind of module a given file is, which controls what kind of module output we emit. If the aforementioned conditions result in a module being interpreted as CJS, the output for that file is nearly identical (maybe identical?) to what you’d get from --module commonjs. If the module is interpreted as ESM, the output is very similar to what you’d get from --module esnext, with one exception I can recall off the top of my head: you’re still allowed to write import Foo = require("bar"), and that gets compiled to:

import { createRequire as _createRequire } from "module";
const __require = _createRequire(import.meta.url);
const Foo = __require("bar");

Summary

I think the answer to your question can be summarized like this:

    Node 12+ has support for CJS and ESM side-by-side, indicated by package.json type and special file extensions, so we need a module emit mode that understands that stuff. That mode can be thought of roughly as a Node-based selector between the existing commonjs and esnext modes, with a few additional little differences tailored to Node.
    Node 12+ also brings major new features to how module specifiers in packages can resolve, and enforces a different and much stricter resolution algorithm specifically for ESM imports. Without a matching TypeScript resolution mode, we both fail to resolve in the face of those new features and let you write paths that won’t resolve in ESM resolution.


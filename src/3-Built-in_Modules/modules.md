
### **MODULES:**

You split your code into modules. The key is that a module is encapsulated code, so you only share what you want to share.
The built in module global has a property called exports which is just an empty object **ex.  exports: {}**,
Everything dumped in this object (like your functions) is something you'll have access to globally



module.exports = thingBeingExported

module.exports = { firstThing, secondThing }

you can also export like this since module.exports is an empty object, this is like setting a property on an object:

modules.exports.items = ['item1', 'item2]




You can also import code just like this require('./someModule'), if we have a function inside the module that we invoke in that module, because when you import a
module you are actually invoking it already (because when node exports the code its actually wrapping the exported code in a function).

Some of the built in modules include: http, fs, buffer, os, process, stream, events, path


HTTP MODULE - Notice that we are not exiting when we run an http server, because we servers continue to listen


**package-lock.json** --keeps a record of the version of your dependencies and versions of the dependencies your dependencies use
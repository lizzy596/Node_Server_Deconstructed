# **Chapter 3 Error Handling and Validation**

Errors are any undesired or unexpected conditions of the application or its data. Any state or condition that conflicts with our application's expectations is considered an error, and errors are context specific. Thus an error in one application may not be an error in another.

In General, its useful to think of errors as belonging to two broad categories.

**Operational Errors** -> Errors you can account for and expect and have decided handling for in the normal course of the user using the app.

**Programming Errors** -> problems in the code. Example: console.log(apple) when there's no variable called apple. 

Another way to think of errors, is in terms of **Recoverable vs Unrecoverable** (wrong user input vs server runs out of memory).


Common error causes: network connection failure, unopenable file, attempted unauthorized access to a resource

**Any action that has a probability of not completing successfully can be seen as a possible cause of errors.**

If error is recoverable: log and recover
If unrecoverable: log, report and attempt a mitigation effort like creating a new app instance.

**Exceptions: (javascript, c#, java, python): errors are called exceptions. Exceptions are special conditions or states that can happen at runtime.**

All exceptions have a **stack trace** or text description of where the error was thrown.

**Languages with exceptions or runtime-errors, also have ways of catching them (try/catch in JS), every exception raised within a try block, will stop the regular running of the app and will proceed onto the catch block with the right type of exception where the app is supposed to recover.**


ex. 
task-controller
 const getTask = async (req, res) => {
  console.log(apple)
  const task = await taskService.getTaskById(req.params.taskId);
  res.send(task);
};

app crashes and you get this console message ReferenceError: apple is not defined


Operational Error Handling:

1. No record in DB with no error handling

const getTask = async (req, res) => {
    const task = await taskService.getTaskById(req.params.taskId);
    res.send(task);
};

-app crashes and you get some huge mongo error object

2. Wrap controller in try/catch

const getTask = async (req, res, next) => {
  try {
    const task = await taskService.getTaskById(req.params.taskId);
    res.send(task);

  } catch (err) {
    next(err);
  }
};

Message: CastError: Cast to ObjectId failed for value "{{deleted}}" (type string) at path "_id" for model "Task"
AND---the server isnt completely crashed


With No Error Handling when console.log a null task value the app will completey crash, on the client you will not get any http response code and the error will simplete be an axios error called network error

From axios: message: "Network Error", name: "AxiosError", code: "ERR_NETWORK"

const getTask = async (req, res) => {
    const task = await taskService.getTaskById(req.params.taskId);
    console.log('task:', task.title);
    res.send(task);
};


With the built-in error being passed to next via try/catch, You get an error message and the app doesn't crash


On the client you get:  message: "Request failed with status code 500", name: "AxiosError", code: "ERR_BAD_RESPONSE", config: {…}, request: XMLHttpRequest, response: {…}
​
code: "ERR_BAD_RESPONSE"

const getTask = async (req, res, next) => {
  console.log('this ran')
  try {
    console.log('the try ran')
    const task = await taskService.getTaskById(req.params.taskId);
    console.log('task:', task.title);
    res.send(task);

  } catch (err) {
    console.log('this error code ran')
    next(err);
  }
};

if you don’t catch your errors close to the source, for example immediately after a database query, then you won’t have an actual error code and end up with lots of 500’s. 


In complied languages some errors are caught at compile time. Modern compilers are great at analyzing static code.

Some lanaguages like Golang choose to have errors returned rather than thrown as exceptions, they force you to capture and handle the possible error returned by the function.

Errors bubble up across the execution stack. They will be caught by the nearest try catch block.

function function1() {
  console.log("Inside function1");
  function2();
}

function function2() {
  console.log("Inside function2");
  function3();
}

function function3() {
  console.log("Inside function3");
  // Simulate an error
  throw new Error("Error in function3");
}

try {
  function1();
} catch (error) {
  console.error("Caught error:", error.message);
}

    function1 is called.
    function1 calls function2.
    function2 calls function3.
    Inside function3, an error is thrown.
    The error bubbles up the call stack until it's caught by the try...catch block surrounding the call to function1.





Error handling in Express. 

Express will automatically handle synchronous errors and async errors must be passed to the next middleware where Express will catch and process them

Note that the default error handler can get triggered if you call next() with an error in your code more than once, even if custom error handling middleware is in place.

**Define error-handling middleware functions in the same way as other middleware functions, except error-handling functions have four arguments instead of three: (err, req, res, next).**

**You define error-handling middleware last, after other app.use() and routes calls**


**If you pass an error to next() and you do not handle it in a custom error handler, it will be handled by the built-in error handler; the error will be written to the client with the stack trace. The stack trace is not included in the production environment.**

From the Express Docs:

app.use(bodyParser.json())
app.use(methodOverride())
app.use(logErrors)
app.use(clientErrorHandler)
app.use(errorHandler)

**a. Generic error logger:**

function logErrors (err, req, res, next) {
  console.error(err.stack)
  next(err)
}

**b. clientErrorHandler:** 

function clientErrorHandler (err, req, res, next) {
  if (req.xhr) {
    res.status(500).send({ error: 'Something failed!' })
  } else {
    next(err)
  }
}

**c. catchAllErrorHandler:**

function errorHandler (err, req, res, next) {
  res.status(500)
  res.render('error', { error: err })
}


Express comes with a built-in error handler, which takes care of any errors that might be encountered in the app. This default error-handling middleware function is added at the end of the middleware function stack.

If you pass an error to next() and you do not handle it in an error handler, it will be handled by the built-in error handler; the error will be written to the client with the stack trace. The stack trace is not included in the production environment.

 JavaScript exception is a value that is thrown as a result of an invalid operation or as the target of a throw statement. While it is not required that these values are instances of Error or classes which inherit from Error, all exceptions thrown by Node.js or the JavaScript runtime will be instances of Error.

 res.locals

 The `res.locals` property is an object that holds response local variables specific to the current request. It has a scope limited to the request and is accessible only to the view(s) rendered during that particular request/response cycle, if any. 


 Throwing vs Returning an Error: It depends on where you want your control. throw immediately hands control back to the caller: See MDN: "and control will be passed to the first catch block in the call stack. If no catch block exists among caller functions, the program will terminate.", while if you return a new Error, you have to handle it a different way, in another location 



When you design a function interface and there are errors to deal with, you have a design choice for how to return errors. If the function is synchronous, you can either return some sentinel value that indicates an error and is easily distinguished from an actual result (often null in Javascript) or you can throw an exception or you can return an object that has a property that indicates the success or failure of the operation.

When you have an asynchronous operation with a promise interface, one would usually reject the Promise with an Error object as the reject reason to signify an error. That's the core design theory of promises. Success resolves with an optional value, errors reject with a reason.

** 
return dbstore
  .getItem(key)
  .then(function(value) {
    return value;
  })
  .catch(function(err) {
    return new Error('The key (' + key + ") isn't accessible: " + err);
  });
  **



When you design a function interface and there are errors to deal with, you have a design choice for how to return errors. If the function is synchronous, you can either return some sentinel value that indicates an error and is easily distinguished from an actual result (often null in Javascript) or you can throw an exception or you can return an object that has a property that indicates the success or failure of the operation.

When you have an asynchronous operation with a promise interface, one would usually reject the Promise with an Error object as the reject reason to signify an error. That's the core design theory of promises. Success resolves with an optional value, errors reject with a reason.

This block of code:

return dbstore
  .getItem(key)
  .then(function(value) {
    return value;
  })
  .catch(function(err) {
    return new Error('The key (' + key + ") isn't accessible: " + err);
  });

is resolving the returned promise with either a value or an Error object. This is generally not how promise code is written because it will require the caller to test the type of the resolved value to figure out if there's an error or not which is not the simple, straightforward way to use promises. So, to your question, you would usually do this:


return dbstore.getItem(key).catch(function(err) {
    throw new Error('The key (' + key + ") isn't accessible: " + err);
});



When you design a function interface and there are errors to deal with, you have a design choice for how to return errors. If the function is synchronous, you can either return some sentinel value that indicates an error and is easily distinguished from an actual result (often null in Javascript) or you can throw an exception or you can return an object that has a property that indicates the success or failure of the operation.

When you have an asynchronous operation with a promise interface, one would usually reject the Promise with an Error object as the reject reason to signify an error. That's the core design theory of promises. Success resolves with an optional value, errors reject with a reason.

This block of code:

return dbstore
  .getItem(key)
  .then(function(value) {
    return value;
  })
  .catch(function(err) {
    return new Error('The key (' + key + ") isn't accessible: " + err);
  });

is resolving the returned promise with either a value or an Error object. This is generally not how promise code is written because it will require the caller to test the type of the resolved value to figure out if there's an error or not which is not the simple, straightforward way to use promises. So, to your question, you would usually do this:

return dbstore.getItem(key).catch(function(err) {
    throw new Error('The key (' + key + ") isn't accessible: " + err);
});

There are other signs in this function, that it's just bad code.

    .then(function(value) {return value;}) is completely superfluous and unnecessary. It adds no value at all. The value is already the resolved value of the promise. No need to declare it again.

    

When you design a function interface and there are errors to deal with, you have a design choice for how to return errors. If the function is synchronous, you can either return some sentinel value that indicates an error and is easily distinguished from an actual result (often null in Javascript) or you can throw an exception or you can return an object that has a property that indicates the success or failure of the operation.

When you have an asynchronous operation with a promise interface, one would usually reject the Promise with an Error object as the reject reason to signify an error. That's the core design theory of promises. Success resolves with an optional value, errors reject with a reason.

This block of code:

return dbstore
  .getItem(key)
  .then(function(value) {
    return value;
  })
  .catch(function(err) {
    return new Error('The key (' + key + ") isn't accessible: " + err);
  });

is resolving the returned promise with either a value or an Error object. This is generally not how promise code is written because it will require the caller to test the type of the resolved value to figure out if there's an error or not which is not the simple, straightforward way to use promises. So, to your question, you would usually do this:

return dbstore.getItem(key).catch(function(err) {
    throw new Error('The key (' + key + ") isn't accessible: " + err);
});

There are other signs in this function, that it's just bad code.

    .then(function(value) {return value;}) is completely superfluous and unnecessary. It adds no value at all. The value is already the resolved value of the promise. No need to declare it again.

    The function sometimes returns a promise and sometimes throws a synchronous exception.
    This is even a further pain to use. If you look at the first if (!key) { statement, it returns an Error object if the key argument isn't supplied. That means that to use this function you have to catch synchronous exceptions, provide .then() and .catch() handlers AND check the type of the resolved promise to see if it happens to be an error object. This function is a nightmare to use. It's bad code.

To use the function as it is, the caller would likely have to do this:

let retVal = someObj.get(aKey);
if (retVal instanceof Error) {
    // got some synchronous error
} else {
    retVal.then(val => {
        if (val instanceof Error) {
            // got some asynchronous error
        } else {
            // got an actual successful value here
        }
    }).catch(err => {
        // got some asynchronous error
    })
}

The function implementation probably should be this:

get(key, store = null) {
    if (!key) {
        return Promise.reject(new Error('There is no key to get!'));
    }

    let dbstore = store || this.localforage;

    return dbstore.getItem(key).catch(function(err) {
        throw new Error('The key (' + key + ") isn't accessible: " + err);
    });
}

This can then be used like this:

someObj.get(aKey).then(val => {
    // got some successful value here
}).catch(err => {
    // got some error here
});

Compare the simplicity for the caller here to the mess above.

This implementation has these consistencies:

    It always returns a promise. If key isn't supplied, it returns a rejected promise.
    All errors come via a rejected promise.
    The value the promise resolves with is always an actual successful value.
    There's no .then() handler that does nothing useful.



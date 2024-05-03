Chapter 3 Error Handling and Validation

Error handling in Express. 

Express will automatically handle synchronous errors and async errors must be passed to the next middleware where Express will catch and process them


Operational Errors -> Errors you can account for and expect and have decided handling for
Programming Errors -> problems in the code. Example: console.log(apple) when there's no variable called apple. 
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

Note that the default error handler can get triggered if you call next() with an error in your code more than once, even if custom error handling middleware is in place.

Define error-handling middleware functions in the same way as other middleware functions, except error-handling functions have four arguments instead of three: (err, req, res, next).

You define error-handling middleware last, after other app.use() and routes calls; for example:




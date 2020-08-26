async function logObject(object) { 
  console.log(JSON.stringify(object, null, 5));
}

async function asyncExecutor(asyncFuntionToExecute, arg1, arg2) { 
  let result;
  
  try {
      var returnValue = await asyncFuntionToExecute(arg1, arg2);

      result = {
          success: true,
          returnValue: returnValue
      };
  } catch(e) {
      dotAlignUtils.logObject(e);

      result = {
          success: false,
          error: e,
          returnValue: null
      };
  }

  return result;
}

module.exports = { logObject, asyncExecutor }
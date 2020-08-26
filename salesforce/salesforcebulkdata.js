var dotalignUtils = require('./../dotaligncloud/dotalignutils');
var metadata = require('./salesforcemetadata');

async function loadContacts(connection, contacts) {
    
    await bulkLoad(
        connection,
        metadata.entities.contact.fullName, 
        contacts);
} 

async function deleteContacts(connection, entityName, criteria) { 
    connection
        .sobject(entityName)
        .find(criteria)
        .destroy(async function(error, result) {
            if (error) { 
                return { 
                    success: false,
                    error: error
                };
            }
      
            dotalignUtils.logObject(result);

            return { 
                success: true,
                result: result
            };
        });
}

async function bulkLoad(connection, entityName, entityData) { 
    var job = connection.bulk.createJob(entityName, "insert");
    var batch = job.createBatch();
    batch.execute(entityData);

    batch.on("queue", async function(batchInfo) { 
        dotalignUtils.logObject(batchInfo);
        batchId = batchInfo.id;
        jobId = batchInfo.jobId;

        // the batch needs to be polled until it has completed. Below
        // we are polling at a one second interval for  20 seconds
        batch.poll(1000 /* interval(ms) */, 200000 /* timeout(ms) */);
    });

    batch.on("error", async function(error) {
        dotalignUtils.logObject(error);
    });

    batch.on("response", async function(result) {
        dotalignUtils.logObject(result);

        for (var i = 0; i < result.length; i++) {
            if (result[i].success) {
                console.log("#" + (i+1) + " loaded successfully, id = " + result[i].id);
            } else {
                console.log("#" + (i+1) + " error occurred, message = " + result[i].errors.join(', '));
            }
        }
    });
}

module.exports = { loadContacts, deleteContacts }
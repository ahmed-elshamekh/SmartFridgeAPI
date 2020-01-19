const aws = require('aws-sdk');
aws.config.update({region: "us-east-1"});

new aws.DynamoDB({apiVersion: "2012-10-08"});

// The document client simplifies working with items in Amazon DynamoDB by abstracting away the notion of attribute values.
// This abstraction annotates native JavaScript types supplied as input parameters, as well as converts annotated response data to native JavaScript types.
const docClient = new aws.DynamoDB.DocumentClient({region: "us-east-1"});
    
exports.handler = async (event, context) => {
    var responseBody;
    var responseCode;
    
    var {fridgesn} = event.pathParameters;
    
    var params = {
        TableName: "Fridges",
        Key: {
            fridgeSN: fridgesn
        }
    }
    
    try {
        // Returns a set of attributes for the item with the given primary key by delegating to AWS.DynamoDB.getItem().
        const data = await docClient.get(params).promise();
        
        // Convert the response to a JSON string.
        responseBody = JSON.stringify(data.Item);
        
         // If the user is trying to get a fridge that doesn't exist in the database.
        if (!responseBody) {
            responseBody = 'This fridge does not exist.';
            responseCode = 404;
        }
        else {    
            // Standard response for successful HTTP requests.
            responseCode = 200;
        }
    }
    catch (err) {
        responseBody = 'Viewing the existing fridge failed!';
        responseBody = 404;
    }
    
    // Create a response to be returned upon execution to indicate success or failure.
    const response = {
        statusCode: responseCode,
        headers: {
            "testHeaders": "test"
        },
        body: responseBody
    }
    
    return response;
}

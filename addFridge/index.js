const aws = require('aws-sdk');
aws.config.update({region: "us-east-1"});

const db = new aws.DynamoDB({apiVersion: "2012-10-08"});

// The document client simplifies working with items in Amazon DynamoDB by abstracting away the notion of attribute values.
// This abstraction annotates native JavaScript types supplied as input parameters, as well as converts annotated response data to native JavaScript types.
const docClient = new aws.DynamoDB.DocumentClient({region: "us-east-1"});
    
exports.handler = async (event, context) => {
    var responseBody;
    var responseCode;

    // The input from AWS test event is already JSON Object and you don't need to parse it again.
    var {fridgeSN} = event;
    
    // Check if the fridge you want to create exists.
    var checkFridgeExist = {
        TableName: "Fridges",
        Key:
        {
            fridgeSN: fridgeSN
        }
    }
        
    var result = await docClient.get(checkFridgeExist).promise();
    
    // Convert the response to a JSON string.
    responseBody = JSON.stringify(result.Item);
    
    if (responseBody) {
        responseBody = 'This fridge already exists.';
        responseCode = 200;
    }
    else {
        var params = {
                TableName: "Fridges",
            Item: {
                fridgeSN: fridgeSN
            }
        }
    
        try {
            const data = await docClient.put(params).promise();
            responseBody = 'A new fridge was successfully created.';
            responseCode = 200;
        }
        catch (err) {
            responseBody = 'Creating a fridge failed!';
            responseBody = 404;
        }
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

const aws = require('aws-sdk');
aws.config.update({region: "us-east-1"});

new aws.DynamoDB({apiVersion: "2012-10-08"});

// The document client simplifies working with items in Amazon DynamoDB by abstracting away the notion of attribute values.
// This abstraction annotates native JavaScript types supplied as input parameters, as well as converts annotated response data to native JavaScript types.
const docClient = new aws.DynamoDB.DocumentClient({region: "us-east-1"});
    
exports.handler = async (event, context) => {
    var responseBody;
    var responseCode;
    var exists;
    
    // Get the data to be used in the DELETE request.
    // Construct the JavaScript object described by the string
    var {fridgeSN, itemName} = JSON.parse(event.body);
    
    // Check if the fridge you want to update exists.
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
    
    if (!responseBody) {
        responseBody = 'The specified fridge cannot be found.';
        // The requested resource could not be found but may be available in the future. Subsequent requests by the client are permissible.
        responseCode = 404;
    }
    else {
        // Convert the JSON string to a JavaScript object described by the string.
        var parsedResponse = JSON.parse(responseBody);
                
        // Get an array of all the keys in the object (items in this fridge).
        const fridgeItems = Object.keys(parsedResponse);
        
        // Check to see if the item really exists in this fridge.
        for (const key of fridgeItems) {
            if (key === itemName ) {
                exists = true;
                break;
            }
            else {
                exists = false;
            }
        }
        
        // Get the updated Object in a JSON string format.
        responseBody = JSON.stringify(parsedResponse);
        
        if (exists) {
            var params = {
            TableName: "Fridges",
                Key: {
                    fridgeSN: fridgeSN
                },
                UpdateExpression: "REMOVE #MyVariable",
                ExpressionAttributeNames: {
                    "#MyVariable": itemName
                },
                ReturnValues:"UPDATED_NEW"
            }
    
            try {
                const data = await docClient.update(params).promise();
                responseBody = 'An item was successfully removed from the fridge.';
                responseCode = 200;
            }
            catch (err) {
                responseBody = 'failed to remove an item!';
                responseCode = 404;
            }
        }
        else {
            responseBody = 'This item does not exist in this fridge.';
            // The server cannot or will not process the request due to an apparent client error (e.g., malformed request syntax)
            responseCode = 400;
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

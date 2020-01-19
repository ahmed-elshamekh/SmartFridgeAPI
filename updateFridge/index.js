const aws = require('aws-sdk');
aws.config.update({region: "us-east-1"});

const db = new aws.DynamoDB({apiVersion: "2012-10-08"});

// The document client simplifies working with items in Amazon DynamoDB by abstracting away the notion of attribute values.
// This abstraction annotates native JavaScript types supplied as input parameters, as well as converts annotated response data to native JavaScript types.
const docClient = new aws.DynamoDB.DocumentClient({region: "us-east-1"});
    
exports.handler = async (event, context) => {
    var responseBody;
    var responseCode;

    // Get the data to be used in the PUT request.
    // Construct the JavaScript object described by the string
    var {fridgeSN, itemName, count} = JSON.parse(event.body);
    
    if (count <= 0) {
        responseBody = 'The quantity of this item is invalid.';
        // The server cannot or will not process the request due to an apparent client error (e.g., malformed request syntax)
        responseCode = 400;
    }
    
    // You cannot have more than 12 cans of soda in any fridge at any time.
    else if (itemName === "soda" && count > 12) {
        responseBody = 'You cannot have more than 12 cans of soda in your fridge.';
        responseCode = 200;
    }
    
    else {
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
            var params = {
            TableName: "Fridges",
                Key: {
                    fridgeSN: fridgeSN
                },
                UpdateExpression: "set #MyVariable = :count",
                ExpressionAttributeNames: {
                    "#MyVariable": itemName
                },
                ExpressionAttributeValues: {
                    ":count": count
                },
                ReturnValues:"UPDATED_NEW"
            }
    
            try {
                const data = await docClient.update(params).promise();
                responseBody = 'Changes have been applied to your fridge.';
                responseCode = 200;
            }
            catch (err) {
                responseBody = 'failed to update the fridge!';
                responseCode = 404;
            }
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

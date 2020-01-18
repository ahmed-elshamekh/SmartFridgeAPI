# SmartFridgeAPI

# Description: 

This is a RESTful API that simulates a smart fridge. For this API, **Amazon API Gateway** was used to expose **Lambda functions** that interact with a table in **DynamoDB**. This API is on the public Internet and with it, you can do the following:

- Add a new fridge to the database.
- Add different items to a certain fridge specifying the target fridge, the item's name, and quantity.
- Update the quantity of an item in a certain fridge.
- Remove an item from a fridge by specifying its quantity to be 0.

# How To Test:

To test and use this API, you will need an API client like **Postman API Client**. You can download this api client from here: https://www.getpostman.com/downloads/

## Add a new fridge to The database ##

1. In the Postman desktop software, click on *Create a request* under *Start something new*.
2. From the drop-down menu, select the **POST** request.
3. In the URL text field, type the following: https://1v8jk3tfk1.execute-api.us-east-1.amazonaws.com/test/fridge
4. Click on *Body* to specify the body of the request.
5. Select *raw* and make sure the JSON format is selected.
6. In the input pane, specify the serial number of the fridge you want to add to the database as follows:

{
	"fridgeSN": "44444"
}

7. Hit Send.

Note: To add a new fridge to the database, the serial number of the new fridge has to be unique.

## View contents of a certain fridge ##

1. In the Postman desktop software, click on *Create a request* under *Start something new*.
2. From the drop-down menu, select the **GET** request.
3. In the URL text field, type the following: https://1v8jk3tfk1.execute-api.us-east-1.amazonaws.com/test/fridge/<FRIDGE_SERIAL_NUMBER>, where FRIDGE_SERIAL_NUMBER is the serial number of a previously added fridge.

Note: You can also view the contents of a certain fridge from your browser by pasting the previous link in the URL field and specify the serial number of the fridge you want to view its contents after .../fridge as follows:
https://1v8jk3tfk1.execute-api.us-east-1.amazonaws.com/test/fridge/11111 

## Add a new item to the fridge ##

1. In the Postman desktop software, click on *Create a request* under *Start something new*.
2. From the drop-down menu, select the **PUT** request.
3. In the URL text field, type the following: https://1v8jk3tfk1.execute-api.us-east-1.amazonaws.com/test/fridge
4. Click on *Body* to specify the body of the request.
5. Select *raw* and make sure the JSON format is selected.
6. In the input pane, specify the serial number of the fridge, the item's name, and quantity as follows

{
	"fridgeSN": "44444",
  "itemName": "soda",
  "count": 6
}

 7. Hit Send.
 
 ## Update the quantity of an item in a certain fridge ##
 
1. In the Postman desktop software, click on *Create a request* under *Start something new*.
2. From the drop-down menu, select the **PUT** request.
3. In the URL text field, type the following: https://1v8jk3tfk1.execute-api.us-east-1.amazonaws.com/test/fridge
4. Click on *Body* to specify the body of the request.
5. Select *raw* and make sure the JSON format is selected.
6. In the input pane, specify the serial number of an existing fridge, the item's name, and the new quantity as follows

{
	"fridgeSN": "44444",
  "itemName": "soda",
  "count": 4
}

 7. Hit Send.
 
 ## Remove an item from a certain fridge ##
 
1. In the Postman desktop software, click on *Create a request* under *Start something new*.
2. From the drop-down menu, select the **PUT** request.
3. In the URL text field, type the following: https://1v8jk3tfk1.execute-api.us-east-1.amazonaws.com/test/fridge
4. Click on *Body* to specify the body of the request.
5. Select *raw* and make sure the JSON format is selected.
6. In the input pane, specify the serial number of the fridge, the item's name, and set the quantity to 0 as follows:

{
	"fridgeSN": "44444",
  "itemName": "soda",
  "count": 0
}

 7. Hit Send.
 
 # Constraints:
 
 - The quantity of "soda" in any fridge cannot be more than 12 at any given time.
 - You MUST follow the provided JSON object format for the **PUT** and **POST** requests. 
 - The database already has the following fridges:
 
   1. {"fridgeSN":"11111","juice":13,"soda":12}

   2. {"fridgeSN":"22222","eggs":30,"fish":2}

   3. {"fridgeSN":"33333","chicken":3,"soda":12,"butter sticks":6} 

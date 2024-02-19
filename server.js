const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(__dirname));

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// http://expressjs.com/en/starter/basic-routing.html
app.get('/', function(request, response) {
  response.sendFile(__dirname + '/views/index.html');
});

const listener = app.listen(process.env.PORT, () => {
  console.log('Your app is listening on port ' + listener.address().port);
});

app.post("/initialize", async (request, response) => {
    const body = request.body;
    const conversationId = body.canvas.context.conversation_id;
    const adminToken = process.env.INTERCOM_AUTH_TOKEN;
  
    // Fetch the conversation data from Intercom
    const conversationData = await axios.get(`https://api.intercom.io/conversations/${conversationId}`, {
      headers: { 'Authorization': `Bearer ${adminToken}` }
    });
  
    // Extract the current value of the custom attribute
    const customAttributeValue = conversationData.data.custom_attributes.tags || '';
  
    // Split the custom attribute value into an array
    const values = customAttributeValue.split(', ');
  
    // Define the options for the buttons
    const options = [
      { text: "Attribute 1", value: "attribute1" },
      { text: "Attribute 2", value: "attribute2" },
      { text: "Attribute 3", value: "attribute3" },
      // Add more options as needed
    ];
  
    // Generate the components based on the options
    const components = options.map((option, index) => ({
      type: "button",
      id: `attribute${index}`,
      label: option.text,
      action: { type: "submit", payload: option.value },
      style: values.includes(option.value) ? "primary" : "secondary"
    }));
  
    response.send({
      canvas: {
        content: {
          components
        },
      },
    });
  });
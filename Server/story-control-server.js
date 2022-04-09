let server;
let story = "";

function initialize()
{
    server = require("./index.js");
}

function interpretStoryControlCommand(message)
{
    let eventType = message.data.event;
    console.log("interpreting story event: " + eventType);
    console.log(message);
    switch (eventType)
    {
        case "storyAddition":
            addToStory(message.data.addition);
            break;
        case "storyReset":
            resetStory()
            break;
    }
}

function addToStory(addition)
{
    initialize();
    console.log("adding: " + addition);
    story += addition;
    sendStoryUpdate();
}

function resetStory()
{
    initialize();
    story = "";
    sendStoryUpdate();
}

function sendStoryUpdate()
{
    server.send_data_to_all_clients(
        {
            "messageType":"storyControl",
            "eventType":"storyUpdate",
            "story": story
        }
    );
}

module.exports = {
    interpretStoryControlCommand
};
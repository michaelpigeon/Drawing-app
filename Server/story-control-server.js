let server;
let story = "";
let storySubmissions = [];

function initialize()
{
    server = require("./index.js");
}

function interpretStoryControlCommand(player, message)
{
    let eventType = message.data.event;
    console.log("interpreting story event: " + eventType);
    console.log(message);
    switch (eventType)
    {
        case "storyAddition":
            // addToStory(message.data.addition);
            submitStoryAddition(player, message.data.addition);
            break;
        case "storyReset":
            resetStory()
            break;
        case "storyVote":
            voteForStoryAddition(message.data.additionId);
        case "getStorySubmissions":
            sendStorySubmissions();
            break;
    }
}

function submitStoryAddition(player, addition)
{
    let entry = storySubmissions.find(e => e.player == player);
    if (entry == null)
    {
        storySubmissions.push(
            {
                "player":player, 
                "addition":addition, 
                "votes":0
            }
        );
    }
    else
    {
        entry.addition = addition;
    }
    console.log("new story submission: " + addition);
    console.log("current story additions:");
    storySubmissions.forEach(element => {
        console.log(element);
    });
    sendStorySubmissions();
}

function voteForStoryAddition(additionVotedOnId)
{
    storySubmissions[additionVotedOnId].votes++;
    console.log(storySubmissions[additionVotedOnId]);
}

function sendStorySubmissions()
{
    initialize();
    server.send_data_to_all_clients(
        {
            "messageType": "storyControl",
            "eventType": "getStorySubmissions",
            "submissions": storySubmissions
        }
    )
}

function addMostVotedAdditionToStory()
{
    if (storySubmissions.length == 0) return;
    let entry = storySubmissions[0];
    storySubmissions.forEach(submission => {
        if (submission.votes > entry.votes)
        {
            entry = submission;
        }
    });
    addToStory(entry.addition);
    resetStorySubmissions();
}

function resetStorySubmissions()
{
    storySubmissions = [];
    sendStorySubmissions();
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
    interpretStoryControlCommand,
    addMostVotedAdditionToStory
};
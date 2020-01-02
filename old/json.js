const archive = require('./message_1.json');
const db = require('./db');

function align_message(message_json) {
    let reactions = [];
    for (let i in message_json.reactions) {
        reactions.push({
            reaction: message_json.reactions[i].reaction,
            userID: message_json.reactions[i].actor
        });
    }
    // TODO attachements ?
    return {
        "type": "message",
        "attachments": [],
        "body": message_json.content,
        "isGroup": true,
        "messageID": message_json.timestamp_ms.toString(),
        "senderID": message_json.sender_name,
        "threadID": "2175128779192067",
        "timestamp": message_json.timestamp_ms.toString(),
        "mentions": {},
        "isUnread": false,
        "messageReactions": reactions,
        "isSponsored": false,
        "snippet": null
    }
}

function dump_json() {
    let to_push = [];
    for (let i in archive.messages) {
        to_push.push(align_message(archive.messages[i]));
    }
    db.saveMessages(to_push, true);
}

dump_json();
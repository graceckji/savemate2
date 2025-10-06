{
  "name": "Friend",
  "type": "object",
  "properties": {
    "requester_email": {
      "type": "string",
      "description": "Email of user who sent the friend request"
    },
    "recipient_email": {
      "type": "string",
      "description": "Email of user who received the friend request"
    },
    "status": {
      "type": "string",
      "enum": [
        "pending",
        "accepted",
        "rejected"
      ],
      "default": "pending",
      "description": "Status of the friendship"
    }
  },
  "required": [
    "requester_email",
    "recipient_email"
  ]
}

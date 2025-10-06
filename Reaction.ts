{
  "name": "Reaction",
  "type": "object",
  "properties": {
    "post_id": {
      "type": "string",
      "description": "ID of the post being reacted to"
    },
    "user_email": {
      "type": "string",
      "description": "Email of user who reacted"
    },
    "emoji": {
      "type": "string",
      "description": "Emoji used for reaction"
    }
  },
  "required": [
    "post_id",
    "user_email",
    "emoji"
  ]
}

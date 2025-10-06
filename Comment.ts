{
  "name": "Comment",
  "type": "object",
  "properties": {
    "post_id": {
      "type": "string",
      "description": "ID of the post being commented on"
    },
    "user_email": {
      "type": "string",
      "description": "Email of user who made the comment"
    },
    "text": {
      "type": "string",
      "description": "Comment text"
    }
  },
  "required": [
    "post_id",
    "user_email",
    "text"
  ]
}

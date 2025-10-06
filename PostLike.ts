{
  "name": "PostLike",
  "type": "object",
  "properties": {
    "post_id": {
      "type": "string",
      "description": "ID of the post being liked"
    },
    "user_email": {
      "type": "string",
      "description": "Email of user who liked the post"
    }
  },
  "required": [
    "post_id",
    "user_email"
  ]
}

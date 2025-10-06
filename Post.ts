{
  "name": "Post",
  "type": "object",
  "properties": {
    "user_email": {
      "type": "string",
      "description": "Email of user who created the post"
    },
    "caption": {
      "type": "string",
      "description": "Post caption or description"
    },
    "image_url": {
      "type": "string",
      "description": "URL to the post image"
    },
    "price": {
      "type": "number",
      "description": "Price amount shown on the post"
    },
    "privacy": {
      "type": "string",
      "enum": [
        "public",
        "friends"
      ],
      "default": "friends",
      "description": "Post privacy setting"
    }
  },
  "required": [
    "user_email",
    "image_url",
    "price"
  ]
}

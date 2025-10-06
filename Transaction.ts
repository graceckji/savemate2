{
  "name": "Transaction",
  "type": "object",
  "properties": {
    "user_email": {
      "type": "string",
      "description": "Email of user who created the transaction"
    },
    "description": {
      "type": "string",
      "description": "Description of the transaction"
    },
    "amount": {
      "type": "number",
      "description": "Amount spent"
    },
    "category": {
      "type": "string",
      "enum": [
        "Food",
        "Travel",
        "Shopping",
        "Subscriptions",
        "Other"
      ],
      "default": "Other",
      "description": "Category of the transaction"
    },
    "image_url": {
      "type": "string",
      "description": "URL to receipt or transaction image"
    },
    "transaction_date": {
      "type": "string",
      "format": "date",
      "description": "Date of the transaction"
    }
  },
  "required": [
    "user_email",
    "description",
    "amount",
    "category",
    "transaction_date"
  ]
}

{
  "name": "Budget",
  "type": "object",
  "properties": {
    "user_email": {
      "type": "string",
      "description": "Email of user who created the budget"
    },
    "amount": {
      "type": "number",
      "description": "Budget amount limit"
    },
    "period": {
      "type": "string",
      "enum": [
        "weekly",
        "monthly"
      ],
      "default": "monthly",
      "description": "Budget period"
    },
    "start_date": {
      "type": "string",
      "format": "date",
      "description": "Budget start date"
    },
    "end_date": {
      "type": "string",
      "format": "date",
      "description": "Budget end date"
    }
  },
  "required": [
    "user_email",
    "amount",
    "period",
    "start_date",
    "end_date"
  ]
}

{
  "name": "string",
  "tableName": "string",
  "fields": [
    {
      "name": "string",
      "type": "string | int | long | double | boolean | date | datetime",
      "nullable": false,
      "unique": false,
      "length": 255
    },
    {
      "name": "string",
      "type": {
        "reference": {
          "targetEntity": "string",
          "cardinality": "one-to-one | one-to-many | many-to-one | many-to-many"
        }
      }
    }
  ]
}

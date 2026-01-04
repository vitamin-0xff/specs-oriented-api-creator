{
  "enabled": true,
  "operations": [
    {
      "name": "string",
      "type": "find | exists | count | delete | custom",
      "returnType": "entity | list | page | boolean | number",
      "criteria": [
        {
          "field": "string",
          "operator": "eq | like | gt | lt | in"
        }
      ]
    }
  ]
}

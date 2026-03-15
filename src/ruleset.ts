import {
  defined,
  enumeration,
  truthy,
  falsy,
  pattern,
  schema,
} from "@stoplight/spectral-functions";
import { oas3 } from "@stoplight/spectral-formats";
// import { DiagnosticSeverity } from "@stoplight/types";

export default {
  description:
    "# [{json:api}](https://jsonapi.org/) - [v1.1](https://jsonapi.org/format/1.1/)\n> A Specification for Building APIs in JSON\n\nJSON:API is a media format for building APIs in JSON, that covers how clients and servers should communicate to minimize both the number of requests and the amount of data transmitted between clients and servers. \n\nJSON:API requires use of the JSON:API media type `application/vnd.api+json` for exchanging data.\n\n---\nThis style guide / ruleset can be found on GitHub: [spectral-jsonapi](https://github.com/philsturgeon/spectral-jsonapi)",
  formats: [oas3],
  aliases: {
    AllContentSchemas: ["$.paths..content['application/vnd.api+json'].schema"],
    ResourceObjects: [
      "$.paths..responses..content[application/vnd.api+json].schema.properties.data.properties",
      "$.paths..responses..content[application/vnd.api+json].schema.properties.data.allOf[*].properties",
      "$.paths..responses..content[application/vnd.api+json].schema.properties.data.items.properties",
      "$.paths..responses..content[application/vnd.api+json].schema.properties.data.items.allOf[*].properties",
      "$.paths..content[application/vnd.api+json].schema.properties.included.items.properties",
      "$.paths..content[application/vnd.api+json].schema.properties.included.items.allOf[*].properties",
      "$.paths..patch.requestBody.content[application/vnd.api+json].schema.properties.data.properties",
      "$.paths..patch.requestBody.content[application/vnd.api+json].schema.properties.data.allOf[*].properties",
    ],
    POSTResourceObjects: [
      "$.paths..post.requestBody.content[application/vnd.api+json].schema.properties.data.properties",
      "$.paths..post.requestBody.content[application/vnd.api+json].schema.properties.data.allOf[*].properties",
    ],
    LinkObjects: ["#AllContentSchemas..properties[links]"],
    MetaObjects: ["#AllContentSchemas..properties[meta]"],
    Relationships: ["#AllContentSchemas..properties[relationships]"],
    RelationshipData: ["#Relationships..data"],
    POSTRelationships: [
      "$.paths..post.requestBody.content[application/vnd.api+json].schema.properties.data.properties[relationships].properties[*]",
      "$.paths..post.requestBody.content[application/vnd.api+json].schema.properties.data.allOf[*].properties[relationships].properties[*]",
    ],
    PATCHRelationships: [
      "$.paths..patch.requestBody.content[application/vnd.api+json].schema.properties.data.properties[relationships].properties[*]",
      "$.paths..patch.requestBody.content[application/vnd.api+json].schema.properties.data.allOf[*].properties[relationships].properties[*]",
    ],
    ErrorObjects: [
      "$.paths..responses[default,400,500].content[application/vnd.api+json].schema.properties.errors.items.properties",
      "$.paths..responses[default,400,500].content[application/vnd.api+json].schema.properties.errors.items.allOf[*].properties",
      "$.paths..responses[?(@property > '400' && @property < '600')].content[application/vnd.api+json].schema.properties.errors.items.properties",
      "$.paths..responses[?(@property > '400' && @property < '600')].content[application/vnd.api+json].schema.properties.errors.items.allOf[*].properties",
    ],
  },
  rules: {
    "content-type": {
      description: `
Requests and responses **MUST** all use the content type of \`application/vnd.api+json\`.

**Invalid Examples:**
\`\`\`yaml
requestBody:
  content:
    application/json

responses:
  '200':
    content:
      application/json
\`\`\`

**Valid Examples:**
\`\`\`yaml
requestBody:
  content:
    application/vnd.api+json

responses:
  '200':
    content:
      application/vnd.api+json
\`\`\`

Related specification information can be found [here](https://jsonapi.org/format/1.1/#content-negotiation-servers).`,
      documentationUrl: "https://jsonapi.org/format/1.1/#content-negotiation",
      message:
        "content type MUST be 'application/vnd.api+json' for all requests and responses",
      severity: "error",
      given: ["$.paths..requestBody.content", "$.paths..responses..content"],
      then: {
        field: "@key",
        function: pattern,
        functionOptions: {
          match: "^application/vnd\\.api\\+json;?",
        },
      },
    },
    "406-response-code": {
      description:
        "Servers **MUST** document and support response code **406** paths in case of invalid `ACCEPT` media values.\n\n**Invalid Example:**\n```YAML\npaths:\n  /myResources:\n    get:\n      responses:\n        '200':\n          $ref: '#/components/responses/MyResource_Collection'\n```\n\n**Valid Example:**\n```YAML\npaths:\n  /myResources:\n    get:\n      responses:\n        '200':\n          $ref: '#/components/responses/MyResource_Collection'\n        '406':\n          $ref: '#/components/responses/406Error'\n```\n\nRelated specification information can be found [here](https://jsonapi.org/format/1.1/#content-negotiation-servers).",
      documentationUrl:
        "https://jsonapi.org/format/1.1/#content-negotiation-servers",
      message: "All paths must support response codes: 406",
      severity: "error",
      given: "$.paths..responses",
      then: {
        field: "406",
        function: truthy,
      },
    },
    "415-response-code": {
      description:
        "Servers **MUST** document and support response code **415** on `POST` or `PATCH` paths in case of invalid `Content-Type` media values.\n\n**Invalid Example:**\n```YAML\npaths:\n  /myResources:\n    post:\n      responses:\n        '200':\n          $ref: '#/components/responses/MyResource_Collection'\n```\n\n**Valid Example:**\n```YAML\npaths:\n  /myResources:\n    post:\n      responses:\n        '200':\n          $ref: '#/components/responses/MyResource_Collection'\n        '415':\n          $ref: '#/components/responses/415Error'\n```\n\nRelated specification information can be found [here](https://jsonapi.org/format/1.1/#content-negotiation-servers).",
      documentationUrl:
        "https://jsonapi.org/format/1.1/#content-negotiation-servers",
      message: "POST and PATCH paths must support response code: 415",
      severity: "error",
      given: "$.paths[*][post,patch].responses",
      then: {
        field: "415",
        function: truthy,
      },
    },
    "top-level-json-object": {
      description:
        "A JSON object **MUST** be at the root of every JSON:API request/response body containing data\n\nValid Examples:\n```YAML\ncontent:\n  application/vnd.api+json:\n    schema:\n      type: object\n```\n\nRelated specification information can be found [here](https://jsonapi.org/format/1.1/#document-top-level).",
      documentationUrl: "https://jsonapi.org/format/1.1/#document-top-level",
      message:
        "Request/response body must be wrapped in root level JSON object",
      severity: "error",
      given: "#AllContentSchemas",
      then: {
        field: "type",
        function: enumeration,
        functionOptions: {
          values: ["object"],
        },
      },
    },
    "top-level-json-properties": {
      description:
        "Root JSON object **MUST** follow the jsonapi schema\n\n**Schema Rules:**\n- **MUST** contain at least one of: `data`, `errors`, `meta` properties\n- `data` and `errors` **MAY NOT** coexist in the same document\n- **MAY** contain: `jsonapi`,`links`,`included`\n- if `included` exists, `data` is **REQUIRED**\n\n**Invalid Examples:**\n```YAML\ntype: object\nproperties:\n    data:\n        type: object\n    errors:\n        type: array\n\ntype: object\nproperties:\n    links:\n        type: object\n    included:\n        type: array\n```\n\n**Valid Examples:**\n```YAML\ntype: object\nproperties:\n    jsonapi:\n        type: object\n    links:\n        type: object\n    meta:\n        type: object\n    data:\n        type: object\n    included:\n        type: array\n\n\ntype: object\nproperties:\n    errors:\n        type: array\n```\n\nRelated specification information can be found [here](https://jsonapi.org/format/1.1/#document-top-level).",
      documentationUrl: "https://jsonapi.org/format/1.1/#document-top-level",
      message: "Root JSON object MUST follow the jsonapi schema",
      severity: "error",
      given: "#AllContentSchemas",
      then: {
        field: "properties",
        function: schema,
        functionOptions: {
          dialect: "draft2020-12",
          schema: {
            type: "object",
            anyOf: [
              {
                required: ["data"],
              },
              {
                required: ["errors"],
              },
              {
                required: ["meta"],
              },
            ],
            not: {
              anyOf: [
                {
                  required: ["data", "errors"],
                },
              ],
            },
            dependentRequired: {
              included: ["data"],
            },
            properties: {
              data: {
                type: "object",
                properties: {
                  type: {
                    type: "string",
                    enum: ["object", "array", "null"],
                  },
                },
              },
              errors: {
                type: "object",
                properties: {
                  type: {
                    type: "string",
                    enum: ["array"],
                  },
                },
              },
              meta: {
                type: "object",
                properties: {
                  type: {
                    type: "string",
                    enum: ["object"],
                  },
                },
              },
              jsonapi: {
                type: "object",
                properties: {
                  type: {
                    type: "string",
                    enum: ["object"],
                  },
                },
              },
              links: {
                type: "object",
                properties: {
                  type: {
                    type: "string",
                    enum: ["object"],
                  },
                },
              },
              included: {
                type: "object",
                properties: {
                  type: {
                    type: "string",
                    enum: ["array"],
                  },
                },
              },
            },
          },
        },
      },
    },
    "resource-object-properties": {
      description:
        "Verify allowed properties in Resource Objects\n\n**Allowed properties:** `id`,`type`,`attributes`,`relationships`,`links`,`meta`\n\n**Invalid Example:**\n```YAML\ntype: object\nproperties:\n  id:\n    type: string\n    format: uri\n    example: 4257c52f-6c78-4747-8106-e185c081436b\n  type:\n    type: string\n    enum:\n      - resources\n  name:\n    type: string\n```\n\n**Valid Example:**\n```YAML\ntype: object\nrequired:\n  - id\n  - type\n  - attributes\n  - relationships\nproperties:\n  id:\n    type: string\n    format: uri\n    example: 4257c52f-6c78-4747-8106-e185c081436b\n  type:\n    type: string\n    enum:\n      - resources\n  attributes:\n    type: object\n  relationships:\n    type: object\n  meta:\n    type: object\n  links:\n    type: object\n```\n\nRelated specification information can be found [here](https://jsonapi.org/format/1.1/#document-resource-objects).",
      documentationUrl:
        "https://jsonapi.org/format/1.1/#document-resource-objects",
      message: "'data' objects/items MUST meet Resource Object restrictions",
      severity: "error",
      given: ["#ResourceObjects", "#POSTResourceObjects"],
      then: [
        {
          field: "type",
          function: truthy,
        },
        {
          field: "@key",
          function: enumeration,
          functionOptions: {
            values: [
              "id",
              "type",
              "attributes",
              "relationships",
              "links",
              "meta",
            ],
          },
        },
      ],
    },
    "resource-object-id-required": {
      description:
        "Verify `id` property exists in Resource Object (except POST requestBody)\n\n**Valid Example:**\n```YAML\n# path..responses...\n# path.patch.requestBody...\n\ntype: object\nrequired:\n  - id\n  - type\nproperties:\n  id:\n    type: string\n    format: uuid\n    example: 4257c52f-6c78-4747-8106-e185c081436b\n  type:\n    type: string\n  meta:\n    type: object\n```\n**NOTE:** Currently this rule triggers against `allOf` structures unless all items have `id`. Until this is corrected it is set as a warning.\n\n\nRelated specification information can be found [here](https://jsonapi.org/format/1.1/#document-resource-objects).",
      documentationUrl:
        "https://jsonapi.org/format/1.1/#document-resource-objects",
      message: "Could be missing 'id' property. Please verify the resource.",
      severity: "warn",
      given: "#ResourceObjects",
      then: {
        field: "id",
        function: truthy,
      },
    },
    "resource-object-property-types": {
      description:
        "`id` and `type` **MUST** be of type `string`\n\n**Invalid Example:**\n```YAML\ntype: object\nproperties:\n  id:\n    type: number\n  type:\n    type: string\n    enum:\n      - resources\n```\n\n**Valid Example:**\n```YAML\ntype: object\nrequired:\n  - id\n  - type\nproperties:\n  id:\n    type: string\n    format: uri\n    example: 4257c52f-6c78-4747-8106-e185c081436b\n  type:\n    type: string\n    enum:\n      - resources\n```\n\nRelated specification information can be found [here](https://jsonapi.org/format/1.1/#document-resource-object-identification).",
      documentationUrl:
        "https://jsonapi.org/format/1.1/#document-resource-object-identification",
      message: "'id' and 'type' MUST be of type 'string'",
      severity: "error",
      given: [
        "#ResourceObjects.id",
        "#ResourceObjects.type",
        "#POSTResourceObjects.type",
      ],
      then: {
        field: "type",
        function: enumeration,
        functionOptions: {
          values: ["string"],
        },
      },
    },
    "resource-object-reserved-fields": {
      description:
        "`id` and `type` **MUST NOT** exist in `attributes` or `relationships`\n\n**Invalid Example:**\n```YAML\ntype: object\nrequired:\n  - id\n  - type\n  - attributes\nproperties:\n  id:\n    type: string\n    format: uri\n    example: 4257c52f-6c78-4747-8106-e185c081436b\n  type:\n    type: string\n    enum:\n      - resources\n  attributes:\n    type: object\n    properties:\n      id:\n        type: number\n      type:\n        type: string\n```\n\n**Valid Example:**\n```YAML\ntype: object\nrequired:\n  - id\n  - type\n  - attributes\nproperties:\n  id:\n    type: string\n    format: uri\n    example: 4257c52f-6c78-4747-8106-e185c081436b\n  type:\n    type: string\n    enum:\n      - resources\n  attributes:\n    type: object\n    properties:\n        name:\n          type: string\n        descrpition:\n          type: string\n  meta:\n    type: object\n  links:\n    type: object\n```\n\nRelated specification information can be found [here](https://jsonapi.org/format/1.1/#document-resource-object-fields).",
      documentationUrl:
        "https://jsonapi.org/format/1.1/#document-resource-object-fields",
      message:
        "'id' and 'type' MUST NOT exist in 'attributes' or 'relationships'",
      severity: "error",
      given:
        "#AllContentSchemas..properties[attributes,relationships].properties",
      then: [
        {
          field: "id",
          function: falsy,
        },
        {
          field: "type",
          function: falsy,
        },
      ],
    },
    "attributes-object-type": {
      description:
        "`attributes` property **MUST** be an `object`\n\n**Invalid Examples:**\n```YAML\n# data (Resource Object)\n# ...  \nproperties:\n  attributes:\n    type: array \n```\n\n**Valid Example:**\n```YAML\n# data (Resource Object)\n# ...  \nproperties:\n  attributes:\n    type: object\n```\n\nRelated specification information can be found [here](https://jsonapi.org/format/1.1/#document-resource-object-attributes).",
      documentationUrl:
        "https://jsonapi.org/format/1.1/#document-resource-object-attributes",
      message: "The value of 'attributes' property MUST be an object",
      severity: "error",
      given: "#AllContentSchemas..properties[attributes]",
      then: {
        field: "type",
        function: enumeration,
        functionOptions: {
          values: ["object"],
        },
      },
    },
    "attributes-object-properties": {
      description:
        "`attributes` object **MUST NOT** contain a `relationships` or `links` property\n\n**Invalid Example:**\n```YAML\n# data (Resource Object)\n# ...  \nproperties:\n  attributes:\n    type: object\n    required:\n      - name\n    properties:\n      name:\n        type: string\n        example: do-hickey\n      description:\n        type: string\n        example: thing that does stuff\n      links:\n        type: array\n          items:\n            type: string\n      relationships:\n        type: array\n          items:\n            type: string\n```\n\n**Valid Example:**\n```YAML\n# data (Resource Object)\n# ...  \nproperties:\n  attributes:\n    type: object\n    required:\n      - name\n    properties:\n      name:\n        type: string\n        example: do-hickey\n      description:\n        type: string\n        example: thing that does stuff\n```\n\nRelated specification information can be found [here](https://jsonapi.org/format/1.1/#document-resource-object-attributes).",
      documentationUrl:
        "https://jsonapi.org/format/1.1/#document-resource-object-attributes",
      message:
        "Attributes object MUST NOT contain a 'relationships' or 'links' property",
      severity: "error",
      given: "#AllContentSchemas..properties[attributes]..properties",
      then: [
        {
          field: "relationships",
          function: falsy,
        },
        {
          field: "links",
          function: falsy,
        },
      ],
    },
    "attributes-object-foreign-keys": {
      description:
        "Foreign Keys **SHOULD NOT** appear in `attributes`. **RECOMMEND** using `relationships`\n\nAlthough has-one foreign keys (e.g. author_id) are often stored internally alongside other information to be represented in a resource object, these keys **SHOULD NOT** appear as attributes.\n\nForeign keys are supported through the use of [relationships](https://jsonapi.org/format/1.1/#document-resource-object-relationships) and [related resource links](https://jsonapi.org/format/1.1/#document-resource-object-related-resource-links).\n\n**Example:** Use relationship primary data rather than foreign key.\n```YAML\ntype: object\nproperties:\n  id:\n    type: string\n    format: uuid\n  type:\n    type: string\n    enum:\n      - widgets\n  attributes:\n    type: object\n      required:\n        - name\n      properties:\n        account_id:\n          type: string\n        name:\n          type: string\n          example: do-hickey\n        description:\n          type: string\n          example: thing that does stuff\n  relationships:\n    type: object\n    properties:\n      manufacturer: #<------ a widget has a relationship with a manufacturer\n        type: object\n          required:\n            - links\n            - data\n          properties:\n            data:\n              type: object\n              properties:\n                id: #<---------- primary/foreign key value\n                  type: string\n                  format: uuid\n                type:\n                  type: string\n                  enum:\n                    - businesses\n```\n**NOTE:** This would normally be a severity of `hint`, though this can be missed visually in vscode. Until this changes it will be a severity of `info`.\n\nRelated specification information can be found [here](https://jsonapi.org/format/1.1/#document-resource-object-attributes).",
      documentationUrl:
        "https://jsonapi.org/format/1.1/#document-resource-object-attributes",
      message:
        "Foreign key? If so, it would be better to remove and use a relationship.",
      severity: "info",
      given: "#AllContentSchemas..properties[attributes]..properties[*]~",
      then: {
        function: pattern,
        functionOptions: {
          notMatch: ".*_id$",
        },
      },
    },
    "relationships-object-type": {
      description:
        "relationships **MUST** be an `object`\n\n**Invalid Example:**\n```YAML\nrelationships:\n  type: array\n```\n\n**Valid Example:**\n```YAML\nrelationships:\n  type: object\n```\n\nRelated specification information can be found [here](https://jsonapi.org/format/1.1/#document-resource-object-relationships).",
      documentationUrl:
        "https://jsonapi.org/format/1.1/#document-resource-object-relationships",
      message: "Relationships MUST be an object",
      severity: "error",
      given: "#Relationships",
      then: {
        field: "type",
        function: enumeration,
        functionOptions: {
          values: ["object"],
        },
      },
    },
    "relationship-schema": {
      description:
        "relationship object **MUST** follow the schema\n\n**Schema Rules:**\n- **MUST** contain at least one of: `links`,`data`,`meta`\n- `links` object **MUST** contain at least one of: `self`, `related`\n- `data` **MAY** be `null`, single or array of resource identifiers\n- `meta` **MUST** be an `object`\n\n**Valid Example:**\n```YAML\n'relationshipNameSingle':\n  type: object\n  required:\n    - links\n    - data\n  properties:\n    links:\n      type: object\n      required:\n        - self\n        - related\n      properties:\n        self:\n          $ref: '#/components/schemas/Link'\n          example: http://api.domain.com/v1/myResources/{id}/relationships/manufacturers\n        related:\n          type: string\n          example: http://api.domain.com/v1/manufacturers/{id}\n    data:\n      type: object\n      required:\n        - id\n        - type\n      properties:\n        id:\n          type: string\n          format: uri\n          example: 4257c52f-6c78-4747-8106-e185c081436b\n        type:\n          type: string\n          enum:\n            - 'relationshipNamePlural'\n```\n\nRelated specification information can be found [here](https://jsonapi.org/format/1.1/#document-resource-object-relationships).",
      documentationUrl:
        "https://jsonapi.org/format/1.1/#document-resource-object-relationships",
      message: "relationship object MUST follow the schema",
      severity: "error",
      given: "#Relationships.properties[*]",
      then: [
        {
          field: "type",
          function: enumeration,
          functionOptions: {
            values: ["object"],
          },
        },
        {
          field: "properties",
          function: schema,
          functionOptions: {
            dialect: "draft2020-12",
            schema: {
              type: "object",
              anyOf: [
                {
                  required: ["links"],
                },
                {
                  required: ["data"],
                },
                {
                  required: ["meta"],
                },
              ],
              properties: {
                links: {
                  type: "object",
                  properties: {
                    type: {
                      type: "string",
                      enum: ["object"],
                    },
                    properties: {
                      type: "object",
                      anyOf: [
                        {
                          required: ["self"],
                        },
                        {
                          required: ["related"],
                        },
                      ],
                      properties: {
                        self: {
                          type: "object",
                        },
                        related: {
                          type: "object",
                        },
                      },
                    },
                  },
                },
                data: {
                  type: "object",
                  properties: {
                    type: {
                      type: "string",
                      enum: ["object", "array", "null"],
                    },
                  },
                },
                meta: {
                  type: "object",
                  properties: {
                    type: {
                      type: "string",
                      enum: ["object"],
                    },
                  },
                },
              },
              additionalProperties: false,
            },
          },
        },
      ],
    },
    "relationship-data-properties": {
      description:
        "relationship `data` **MAY** only contain: `id`, `type` and `meta`\n\nInvalid Example:\n```YAML\ntype: object\nrequired:\n  - id\n  - type\nproperties:\n  id:\n    type: string\n    format: uuid\n    example: 2357c52f-6c78-4747-8106-e185c08143aa\n  type:\n    type: string\n  attributes:\n    type: object\n  meta:\n    type: object\n```\n\nValid Example:\n```YAML\ntype: object\nrequired:\n  - id\n  - type\nproperties:\n  id:\n    type: string\n    format: uuid\n    example: 2357c52f-6c78-4747-8106-e185c08143aa\n  type:\n    type: string\n  meta:\n    type: object\n```\n\nRelated specification information can be found [here](https://jsonapi.org/format/1.1/#document-resource-identifier-objects).",
      documentationUrl:
        "https://jsonapi.org/format/1.1/#document-resource-identifier-objects",
      message: "relationship data May only contain: 'id', 'type' and 'meta'",
      severity: "error",
      given: [
        "#RelationshipData.properties",
        "#RelationshipData.allOf[*].properties",
        "#RelationshipData.items.properties",
        "#RelationshipData.items.allOf[*].properties",
      ],
      then: {
        field: "@key",
        function: enumeration,
        functionOptions: {
          values: ["id", "type", "meta"],
        },
      },
    },
    "relationship-data-schema": {
      description:
        "relationship data items **MUST** follow schema\n\n**Schema Rules:**\n- `id` **MUST** be a `string`\n- `type` **MUST** be a `string`\n- `meta` **MUST** be an `object`\n\n**Invalid Examples:**\n```YAML\ntype: object\nrequired:\n  - id\n  - type\nproperties:\n  id:\n    type: number\n  type:\n    type: number\n  meta:\n    type: object\n```\n\n**Valid Example:**\n```YAML\ntype: object\nrequired:\n  - id\n  - type\nproperties:\n  id:\n    type: string\n    format: uuid\n    example: 2357c52f-6c78-4747-8106-e185c08143aa\n  type:\n    type: string\n  meta:\n    type: object   \n```\n\nRelated specification information can be found [here](https://jsonapi.org/format/1.1/#document-resource-identifier-objects).",
      documentationUrl:
        "https://jsonapi.org/format/1.1/#document-resource-identifier-objects",
      message: "relationship data items MUST follow schema",
      severity: "error",
      given: [
        "#RelationshipData.properties",
        "#RelationshipData.allOf[0].properties",
        "#RelationshipData.items.properties",
        "#RelationshipData.items.allOf[0].properties",
      ],
      then: {
        function: schema,
        functionOptions: {
          dialect: "draft2020-12",
          schema: {
            type: "object",
            required: ["id", "type"],
            properties: {
              id: {
                type: "object",
                properties: {
                  type: {
                    type: "string",
                    enum: ["string"],
                  },
                },
              },
              type: {
                type: "object",
                properties: {
                  type: {
                    type: "string",
                    enum: ["string"],
                  },
                },
              },
              meta: {
                type: "object",
                properties: {
                  type: {
                    type: "string",
                    enum: ["object"],
                  },
                },
              },
            },
          },
        },
      },
    },
    "meta-object": {
      description:
        "`meta` property **MUST** be of type `object`\n\n**Invalid Examples:**\n```YAML\nproperties:\n  meta:\n    type: string \n```\n\n**Valid Example:**\n```YAML\nproperties:\n  meta:\n    type: object\n```\n\nRelated specification information can be found [here](https://jsonapi.org/format/1.1/#document-meta).",
      documentationUrl: "https://jsonapi.org/format/1.1/#document-meta",
      message: "'meta' property MUST be of type object",
      severity: "error",
      given: "#MetaObjects",
      then: {
        field: "type",
        function: enumeration,
        functionOptions: {
          values: ["object"],
        },
      },
    },
    "links-object": {
      description:
        "`links` property **MUST** be an `object`\n\n**Invalid Examples:**\n```YAML\nproperties:\n  links:\n    type: array \n```\n\n**Valid Example:**\n```YAML\nproperties:\n  links:\n    type: object\n```\n\nRelated specification information can be found [here](https://jsonapi.org/format/1.1/#document-links).",
      documentationUrl: "https://jsonapi.org/format/1.1/#document-links",
      message: "'links' property MUST be an object",
      severity: "error",
      given: "#LinkObjects",
      then: {
        field: "type",
        function: enumeration,
        functionOptions: {
          values: ["object"],
        },
      },
    },
    "links-object-schema": {
      description:
        "A link **MUST** be represented as either a `string` containing the link's URL or an `object`.\n\n**Invalid Examples:**\n```YAML\nproperties:\n  links:\n    type: object\n    properties:\n        self:\n            type: number\n```\n\n**Valid Example:**\n```YAML\nproperties:\n  links:\n    type: object\n    properties:\n        self:\n          oneOf:\n            - type: string\n              format: uri\n            - type: object\n              required:\n                - href\n              properties:\n                href:\n                  type: string\n                  format: uri\n                meta:\n                  type: object    \n```\n\nRelated specification information can be found [here](https://jsonapi.org/format/1.1/#document-links).",
      documentationUrl: "https://jsonapi.org/format/1.1/#document-links",
      message: "'link' properties must be of type string or object",
      severity: "error",
      given: "#LinkObjects.properties[*]..[?(@property === 'type')]^",
      then: {
        field: "type",
        function: enumeration,
        functionOptions: {
          values: ["string", "object"],
        },
      },
    },
    "links-object-schema-properties": {
      description:
        "objects contained within a `links` object **MUST** contain `href` (string) and **MAY** contain `meta`\n\nA link **MUST** be represented as either a `string` containing the link's URL or an `object`.\n\n**Invalid Examples:**\n```YAML\nproperties:\n  links:\n    type: object\n    properties:\n        self:\n          oneOf:\n            - type: string\n              format: uri\n            - type: object\n              properties:\n                url:\n                  type: string\n                  format: uri\n                meta:\n                  type: object    \n```\n\n**Valid Example:**\n```YAML\nproperties:\n  links:\n    type: object\n    properties:\n        self:\n          oneOf:\n            - type: string\n              format: uri\n            - type: object\n              required:\n                - href\n              properties:\n                href:\n                  type: string\n                  format: uri\n                meta:\n                  type: object    \n```\n\nRelated specification information can be found [here](https://jsonapi.org/format/1.1/#document-links).",
      documentationUrl: "https://jsonapi.org/format/1.1/#document-links",
      message:
        "objects contained within a links object MUST contain 'href' (string) and MAY contain 'meta'",
      severity: "error",
      given: "#LinkObjects.properties..properties",
      then: [
        {
          field: "@key",
          function: enumeration,
          functionOptions: {
            values: ["href", "meta"],
          },
        },
        {
          field: "href",
          function: truthy,
        },
        {
          field: "href.type",
          function: enumeration,
          functionOptions: {
            values: ["string"],
          },
        },
      ],
    },
    "jsonapi-object": {
      description:
        "`jsonapi` object **MUST** match schema\n\n**Schema Rules:**\n- `jsonapi` **MUST** be an `object`\n- **MUST** contain `string` `version`\n\n**Valid Example:**\n```YAML\nproperties:\n  jsonapi:\n    type: object\n    properties:\n      version:\n        type: string\n        example: '1.0'\n```\n\nRelated specification information can be found [here](https://jsonapi.org/format/1.1/#document-jsonapi-object).",
      documentationUrl:
        "https://jsonapi.org/format/1.1/#document-jsonapi-object",
      message: "jsonapi object MUST match schema",
      severity: "error",
      given: "#AllContentSchemas..properties[?(@property === 'jsonapi')]",
      then: [
        {
          field: "type",
          function: enumeration,
          functionOptions: {
            values: ["object"],
          },
        },
        {
          field: "properties[*]~",
          function: enumeration,
          functionOptions: {
            values: ["version"],
          },
        },
        {
          field: "properties.version",
          function: truthy,
        },
        {
          field: "properties.version.type",
          function: enumeration,
          functionOptions: {
            values: ["string"],
          },
        },
      ],
    },
    "fetching-resource-200": {
      description:
        "`GET` requests **MUST** support response code 200\n\n**Invalid Example:**\n```YAML\npaths:\n  /tickets/{id}:\n    get:\n      responses:\n        '404':\n          $ref: '#/components/responses/404Error'\n```\n\n**Valid Examples:**\n```YAML\npaths:\n  /tickets/{id}:\n    get:\n      responses:\n        '200':\n          $ref: '#/components/responses/Ticket'\n        '404':\n          $ref: '#/components/responses/404Error'\n```\n\nRelated specification information can be found [here](https://jsonapi.org/format/1.1/#fetching-resources-responses).",
      documentationUrl:
        "https://jsonapi.org/format/1.1/#fetching-resources-responses",
      message: "GET paths must support response code: 200",
      severity: "error",
      given: "$.paths[*][get].responses",
      then: {
        field: "200",
        function: truthy,
      },
    },
    "fetching-resource-404": {
      description:
        "`GET` requests to single resource endpoints **MUST** support response code 404\n\nPer the JSON:API specification, a server MUST respond with 404 Not Found when\nprocessing a request to fetch a single resource that does not exist.\n\nSingle resource endpoints are identified by a path parameter (e.g. `{id}`).\n\n**Invalid Example:**\n```YAML\npaths:\n  /tickets/{id}:\n    get:\n      responses:\n        '200':\n          $ref: '#/components/responses/Ticket'\n```\n\n**Valid Example:**\n```YAML\npaths:\n  /tickets/{id}:\n    get:\n      responses:\n        '200':\n          $ref: '#/components/responses/Ticket'\n        '404':\n          $ref: '#/components/responses/404Error'\n```\n\nRelated specification information can be found [here](https://jsonapi.org/format/1.1/#fetching-resources-responses).",
      documentationUrl:
        "https://jsonapi.org/format/1.1/#fetching-resources-responses",
      message: "GET paths for single resources must support response code: 404",
      severity: "error",
      given: "$.paths[*][get].responses",
      then: {
        field: "404",
        function: truthy,
      },
    },
    "400-response-code": {
      description:
        "Servers **MUST** document and support response code **400** for all paths\n\n**Invalid Example:**\n```YAML\npaths:\n  /myResources:\n    get:\n      responses:\n        '200':\n          $ref: '#/components/responses/MyResource_Collection'\n```\n\n**Valid Example:**\n```YAML\npaths:\n  /myResources:\n    get:\n      responses:\n        '200':\n          $ref: '#/components/responses/MyResource_Collection'\n        '400':\n          $ref: '#/components/responses/400Error'\n```",
      message: "All paths must support response codes: 400",
      severity: "error",
      given: "$.paths..responses",
      then: {
        field: "400",
        function: truthy,
      },
    },
    "include-parameter": {
      description:
        '`include` query param **MUST** be a string array (csv)\n\n**Valid Example:**\n```YAML\nname: include\ndescription: csv formatted parameter of relationship names to include in response\nin: query\nstyle: form\nexplode: false\nschema:\ntype: array\nitems:\n    type: string\nexample: ["ratings","comments.author"]\n```\nExample query string: `/articles/1?include=comments.author,ratings`\n\nRelated specification information can be found [here](https://jsonapi.org/format/1.1/#fetching-includes).',
      documentationUrl: "https://jsonapi.org/format/1.1/#fetching-includes",
      message: "'include' query param MUST be a string array (csv)",
      severity: "error",
      given:
        "$.paths..parameters[*][?(@property === 'name' && @ === 'include')]^",
      then: [
        {
          field: "in",
          function: enumeration,
          functionOptions: {
            values: ["query"],
          },
        },
        {
          field: "style",
          function: truthy,
        },
        {
          field: "style",
          function: enumeration,
          functionOptions: {
            values: ["form"],
          },
        },
        {
          field: "explode",
          function: defined,
        },
        {
          field: "explode",
          function: falsy,
        },
        {
          field: "schema",
          function: schema,
          functionOptions: {
            dialect: "draft2020-12",
            schema: {
              type: "object",
              properties: {
                type: {
                  type: "string",
                  enum: ["array"],
                },
                items: {
                  type: "object",
                  properties: {
                    type: {
                      type: "string",
                      enum: ["string"],
                    },
                  },
                },
              },
            },
          },
        },
      ],
    },
    "fields-parameter": {
      description:
        '`fields` query param **MUST** be a `deepObject`\n\n**Valid Example:**\n```YAML\nname: fields\ndescription: schema for \'fields\' query parameter\nin: query\nschema:\n  type: object\nstyle: deepObject\nexample:\n  people: "name"\n  articles: "title,body"\n```\nExample query string: `/articles?fields[articles]=title,body&fields[people]=name`\n\nRelated specification information can be found [here](https://jsonapi.org/format/1.1/#fetching-sparse-fieldsets).',
      documentationUrl:
        "https://jsonapi.org/format/1.1/#fetching-sparse-fieldsets",
      message: "'fields' query param MUST be a deepObject",
      severity: "error",
      given:
        "$.paths..parameters[*][?(@property === 'name' && @ === 'fields')]^",
      then: [
        {
          field: "in",
          function: enumeration,
          functionOptions: {
            values: ["query"],
          },
        },
        {
          field: "style",
          function: truthy,
        },
        {
          field: "style",
          function: enumeration,
          functionOptions: {
            values: ["deepObject"],
          },
        },
        {
          field: "schema",
          function: schema,
          functionOptions: {
            dialect: "draft2020-12",
            schema: {
              type: "object",
              properties: {
                type: {
                  type: "string",
                  enum: ["object"],
                },
              },
            },
          },
        },
      ],
    },
    "sort-parameter": {
      description:
        '`sort` query param **MUST** be a string array (csv)\n\n**Valid Example:**\n```YAML\nname: sort\ndescription: csv formatted parameter of fields to sort by\nin: query\nstyle: form\nexplode: false\nschema:\n  type: array\n  items:\n    type: string\nexample: ["-age","name"]\n```\nExample query string: `/people?sort=-age,name`\n\nRelated specification information can be found [here](https://jsonapi.org/format/1.1/#fetching-sorting).',
      documentationUrl: "https://jsonapi.org/format/1.1/#fetching-sorting",
      message: "'sort' query param MUST be a string array (csv)",
      severity: "error",
      given: "$.paths..parameters[*][?(@property === 'name' && @ === 'sort')]^",
      then: [
        {
          field: "in",
          function: enumeration,
          functionOptions: {
            values: ["query"],
          },
        },
        {
          field: "style",
          function: truthy,
        },
        {
          field: "style",
          function: enumeration,
          functionOptions: {
            values: ["form"],
          },
        },
        {
          field: "explode",
          function: defined,
        },
        {
          field: "explode",
          function: falsy,
        },
        {
          field: "schema",
          function: schema,
          functionOptions: {
            dialect: "draft2020-12",
            schema: {
              type: "object",
              properties: {
                type: {
                  type: "string",
                  enum: ["array"],
                },
                items: {
                  type: "object",
                  properties: {
                    type: {
                      type: "string",
                      enum: ["string"],
                    },
                  },
                },
              },
            },
          },
        },
      ],
    },
    "page-parameter": {
      description:
        '`page` query param **MUST** follow schema\n\n**Schema Rules:**\n- **MUST** be type `object`\n- **MUST** be style `deepObject`\n- contents depend on strategy:\n  - cursor: `string` `cursor` and `int32` `limit`\n  - offset: `int32` `offset` and `int32` `limit`\n\n**Valid Examples:**\n```YAML\nname: page\ndescription: Paging parameter, cursor based.\nin: query\nschema:\n  type: object\n  required: ["cursor","limit"]\n  properties:\n    cursor:\n      type: string\n    limit:\n      type: integer\n      format: int32\nstyle: deepObject\n\nname: page\ndescription: Paging parameter, offset based.\nin: query\nschema:\n  type: object\n  required: ["offset","limit"]\n  properties:\n    cursor:\n      type: integer\n      format: int32\n    limit:\n      type: integer\n      format: int32\nstyle: deepObject\n```\nExample query string: \n- `/myResources?page[cursor]=fdsJ34lkjSfjsdfk&page[limit]=10`\n- `/myResources?page[offset]=2&page[limit]=10`\n\nRelated specification information can be found [here](https://jsonapi.org/format/1.1/#fetching-pagination).',
      documentationUrl: "https://jsonapi.org/format/1.1/#fetching-pagination",
      message: "'page' query param MUST follow schema",
      severity: "error",
      given: "$.paths..parameters[*][?(@property === 'name' && @ === 'page')]^",
      then: [
        {
          field: "in",
          function: enumeration,
          functionOptions: {
            values: ["query"],
          },
        },
        {
          field: "style",
          function: truthy,
        },
        {
          field: "style",
          function: enumeration,
          functionOptions: {
            values: ["deepObject"],
          },
        },
        {
          field: "schema",
          function: schema,
          functionOptions: {
            dialect: "draft2020-12",
            schema: {
              type: "object",
              properties: {
                type: {
                  type: "string",
                  enum: ["object"],
                },
                properties: {
                  type: "object",
                  additionalProperties: false,
                  properties: {
                    cursor: {
                      type: "object",
                      properties: {
                        type: {
                          type: "string",
                          enum: ["string"],
                        },
                      },
                    },
                    offset: {
                      type: "object",
                      properties: {
                        type: {
                          type: "string",
                          enum: ["integer"],
                        },
                        format: {
                          type: "string",
                          enum: ["int32"],
                        },
                        minimum: {
                          type: "integer",
                          minimum: 0,
                        },
                      },
                    },
                    limit: {
                      type: "object",
                      properties: {
                        type: {
                          type: "string",
                          enum: ["integer"],
                        },
                        format: {
                          type: "string",
                          enum: ["int32"],
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      ],
    },
    "post-requests-single-object": {
      description:
        "POST requests **MUST** only contain a single resource object\n\n**Invalid Example:**\n```YAML\ncontent:\n  application/vnd.api+json:\n    schema:\n      type: object\n      required:\n        - data\n      properties:\n        data:\n            type: array\n            items: \n              $ref: '#/components/schemas/MyResourcePostObject'\n```\n\n**Valid Example:**\n```YAML\ncontent:\n  application/vnd.api+json:\n    schema:\n      type: object\n      required:\n        - data\n      properties:\n        data:\n          $ref: '#/components/schemas/MyResourcePostObject'\n```\n\nRelated specification information can be found [here](https://jsonapi.org/format/1.1/#crud-creating).",
      documentationUrl: "https://jsonapi.org/format/1.1/#crud-creating",
      message: "POST requests MAY only contain a single resource object",
      severity: "error",
      given:
        "$.paths..post.requestBody.content[application/vnd.api+json].schema.properties.data[?(@property==='type' && @ === 'array')]",
      then: {
        function: falsy,
      },
    },
    "post-relationships": {
      description:
        "If relationships exist in POST request, `data` is REQUIRED\n\n**Invalid Example:**\n```YAML\nrelationships:\n  type: object\n  properties:\n    manufacturer:\n      type: object\n      properties:\n        links:\n          type: object\n```\n\n**Valid Example:**\n```YAML\nrelationships:\n  type: object\n  properties:\n    manufacturer:\n      type: object\n      properties:\n        data:\n          type: object\n        links:\n          type: object\n```\n\nRelated specification information can be found [here](https://jsonapi.org/format/1.1/#crud-creating).",
      documentationUrl: "https://jsonapi.org/format/1.1/#crud-creating",
      message: "If relationships exist in POST request, 'data' is REQUIRED",
      severity: "error",
      given: "#POSTRelationships",
      then: {
        field: "required",
        function: schema,
        functionOptions: {
          schema: {
            type: "array",
            items: {
              type: "string",
              anyOf: [
                {
                  enum: ["data"],
                },
                {
                  enum: ["data", "links", "meta"],
                },
              ],
            },
          },
        },
      },
    },
    "403-response-code": {
      description:
        "Servers **MUST** document and support response code **403** for all paths\n\n**Invalid Example:**\n```YAML\npaths:\n  /myResources:\n    get:\n      responses:\n        '200':\n          $ref: '#/components/responses/MyResource_Collection'\n```\n\n**Valid Example:**\n```YAML\npaths:\n  /myResources:\n    get:\n      responses:\n        '200':\n          $ref: '#/components/responses/MyResource_Collection'\n        '403':\n          $ref: '#/components/responses/403Error'\n```",
      message: "All paths must support response codes: 403",
      severity: "error",
      given: "$.paths..responses",
      then: {
        field: "403",
        function: truthy,
      },
    },
    "201-response-location-header": {
      description:
        "A POST 201 response **SHOULD** return a `Location` header identifying the location of the newly created resource.\n\n**Valid Example:**\n```YAML\nheaders:\n  Location:\n    schema:\n      type: string\n      format: uri\n    example: 'http://example.com/photos/550e8400-e29b-41d4-a716-446655440000'\ncontent:\n  application/vnd.api+json:\n    schema:\n    type: object\n```\n\nRelated specification information can be found [here](https://jsonapi.org/format/1.1/#crud-creating-responses).",
      documentationUrl:
        "https://jsonapi.org/format/1.1/#crud-creating-responses",
      message: "A POST 201 response SHOULD return a Location header",
      severity: "info",
      given: "$.paths[*][post].responses.201.headers",
      then: {
        field: "Location",
        function: defined,
      },
    },
    "post-201-response": {
      description:
        "A POST 201 response **MUST** return the primary resource\n\nRelated specification information can be found [here](https://jsonapi.org/format/1.1/#crud-creating-responses).",
      documentationUrl:
        "https://jsonapi.org/format/1.1/#crud-creating-responses",
      message: "A POST 201 response MUST return the primary resource",
      severity: "info",
      given:
        "$.paths[*][post].responses.201.content[application/vnd.api+json].schema",
      then: {
        field: "required",
        function: schema,
        functionOptions: {
          schema: {
            type: "array",
            items: {
              type: "string",
              anyOf: [
                {
                  enum: ["data"],
                },
                {
                  enum: ["data", "meta", "jsonapi", "links"],
                },
              ],
            },
          },
        },
      },
    },
    "post-2xx-response-codes": {
      description:
        "`POST` requests **MUST** support one Of the following 2xx codes: 201, 202 or 204\n\n**Invalid Example:**\n```YAML\npaths:\n  /myResources:\n    post:\n      responses:\n        '404':\n          $ref: '#/components/responses/404Error'\n```\n\n**Valid Examples:**\n```YAML\npaths:\n  /myResources:\n    post:\n      responses:\n        '201':\n          $ref: '#/components/responses/MyResource_Single'\n        '404':\n          $ref: '#/components/responses/404Error'\n\npaths:\n  /myResources:\n    post:\n      responses:\n        '202':\n          description: Accepted.\n        '404':\n          $ref: '#/components/responses/404Error'\n\npaths:\n  /myResources:\n    post:\n      responses:\n        '204':\n          description: Successful Operation. No Content.\n        '404':\n          $ref: '#/components/responses/404Error'  \n```\n\nRelated specification information can be found [here](https://jsonapi.org/format/1.1/#crud-creating-responses).",
      documentationUrl:
        "https://jsonapi.org/format/1.1/#crud-creating-responses",
      message:
        "POST requests MUST support one Of the following 2xx codes: 201, 202 or 204",
      severity: "error",
      given: "$.paths[*][post].responses",
      then: {
        function: schema,
        functionOptions: {
          dialect: "draft2020-12",
          schema: {
            type: "object",
            anyOf: [
              {
                required: ["201"],
              },
              {
                required: ["202"],
              },
              {
                required: ["204"],
              },
            ],
          },
        },
      },
    },
    "post-409-response-code": {
      description:
        "`POST` requests **MUST** document and support response code 409\n\n**Invalid Example:**\n```YAML\npaths:\n  /myResources:\n    post:\n      responses:\n        '201':\n          $ref: '#/components/responses/MyResource_Single'\n```\n\n**Valid Examples:**\n```YAML\npaths:\n  /myResources:\n    post:\n      responses:\n        '201':\n          $ref: '#/components/responses/MyResource_Single'\n        '409':\n          $ref: '#/components/responses/409Error'\n```\n\nRelated specification information can be found [here](https://jsonapi.org/format/1.1/#crud-creating-responses).",
      documentationUrl:
        "https://jsonapi.org/format/1.1/#crud-creating-responses",
      message: "POST paths must support response codes: 409",
      severity: "error",
      given: "$.paths[*][post].responses",
      then: {
        field: "409",
        function: truthy,
      },
    },
    "post-409-response": {
      description:
        "POST 409 response **SHOULD** return `source` property to identify conflict\n\n**Example:**\n```YAML\n# Example showing use of source in error object.\n\ntype: array\nitems:\n    type: object\n    properties:\n      id:\n        type: string\n      status:\n        type: string\n        enum:\n          - 409\n      title:\n        type: string\n        enum:\n          - Conflict\n      source:\n        type: object\n        properties:\n          pointer:\n            oneOf:\n              - type: string\n                format: json-pointer\n                example: /data/attributes/id\n              - type: array\n                items:\n                  type: string\n                  format: json-pointer\nmaxItems:1\n```\n\nRelated specification information can be found [here](https://jsonapi.org/format/1.1/#crud-creating-responses).",
      documentationUrl:
        "https://jsonapi.org/format/1.1/#crud-creating-responses",
      message:
        "POST 409 response SHOULD return 'source' property to identify conflict",
      severity: "info",
      given: "$.paths[*][post].responses",
      then: {
        field: "409",
        function: falsy,
      },
    },
    "put-disallowed": {
      description:
        "`PUT` verb is not allowed in jsonapi, use `PATCH` instead.\n\n**Invalid Example:**\n```YAML\n/myResources/{id}:\n    put:\n```\n\n**Valid Example:**\n```YAML\n/myResources/{id}:\n    patch:\n```\n\nRelated specification information can be found [here](https://jsonapi.org/format/1.1/#crud-updating).",
      documentationUrl: "https://jsonapi.org/format/1.1/#crud-updating",
      message: "PUT verb is not allowed in jsonapi, use PATCH instead.",
      severity: "error",
      given: "$.paths[*][put]",
      then: [
        {
          function: falsy,
        },
      ],
    },
    "patch-requests-single-object": {
      description:
        "PATCH requests **MUST** only contain a single resource object\n\n**Invalid Example:**\n```YAML\ncontent:\n  application/vnd.api+json:\n    schema:\n      type: object\n      required:\n        - data\n      properties:\n        data:\n            type: array\n            items: \n              $ref: '#/components/schemas/MyResourcePostObject'\n```\n\n**Valid Example:**\n```YAML\ncontent:\n  application/vnd.api+json:\n    schema:\n      type: object\n      required:\n        - data\n      properties:\n        data:\n          $ref: '#/components/schemas/MyResourcePostObject'\n```\n\nRelated specification information can be found [here](https://jsonapi.org/format/1.1/#crud-updating).",
      documentationUrl: "https://jsonapi.org/format/1.1/#crud-creating",
      message: "PATCH requests MAY only contain a single resource object",
      severity: "error",
      given:
        "$.paths..patch.requestBody.content[application/vnd.api+json].schema.properties.data[?(@property==='type' && @ === 'array')]",
      then: {
        function: falsy,
      },
    },
    "patch-relationships": {
      description:
        "If relationships exist in PATCH request, `data` is REQUIRED\n\n**Invalid Example:**\n```YAML\nrelationships:\n  type: object\n  properties:\n    manufacturer:\n      type: object\n      properties:\n        links:\n          type: object\n```\n\n**Valid Example:**\n```YAML\nrelationships:\n  type: object\n  properties:\n    manufacturer:\n      type: object\n      properties:\n        data:\n          type: object\n        links:\n          type: object\n```\n\nRelated specification information can be found [here](https://jsonapi.org/format/1.1/#crud-updating-resource-relationships).",
      documentationUrl: "https://jsonapi.org/format/1.1/#crud-creating",
      message: "If relationships exist in PAST request, 'data' is REQUIRED",
      severity: "error",
      given: "#PATCHRelationships",
      then: {
        field: "required",
        function: schema,
        functionOptions: {
          schema: {
            type: "array",
            items: {
              type: "string",
              anyOf: [
                {
                  enum: ["data"],
                },
                {
                  enum: ["data", "links", "meta"],
                },
              ],
            },
          },
        },
      },
    },
    "patch-2xx-response-codes": {
      description:
        "`PATCH` requests **MUST** support at least one of the following 2xx codes: 200, 202 or 204\n\n**Invalid Example:**\n```YAML\npaths:\n  /myResources/{id}:\n    patch:\n      responses:\n        '404':\n          $ref: '#/components/responses/404Error'\n```\n\n**Valid Examples:**\n```YAML\npaths:\n  /myResources/{id}:\n    patch:\n      responses:\n        '200':\n          $ref: '#/components/responses/MyResource_Single'\n        '404':\n          $ref: '#/components/responses/404Error'\n\npaths:\n  /myResources/{id}:\n    patch:\n      responses:\n        '202':\n          description: Accepted.\n        '404':\n          $ref: '#/components/responses/404Error'\n\npaths:\n  /myResources/{id}:\n    patch:\n      responses:\n        '204':\n          description: Successful Operation. No Content.\n        '404':\n          $ref: '#/components/responses/404Error'  \n```\n\nRelated specification information can be found [here](https://jsonapi.org/format/1.1/#crud-updating-responses).",
      documentationUrl:
        "https://jsonapi.org/format/1.1/#crud-updating-responses",
      message:
        "POST requests MUST support at least one of the following 2xx codes: 200, 202 or 204",
      severity: "error",
      given: "$.paths[*][patch].responses",
      then: {
        function: schema,
        functionOptions: {
          dialect: "draft2020-12",
          schema: {
            type: "object",
            anyOf: [
              {
                required: ["200"],
              },
              {
                required: ["202"],
              },
              {
                required: ["204"],
              },
            ],
          },
        },
      },
    },
    "patch-404-response-code": {
      description:
        "`PATCH` requests **MUST** support response code 404\n\n**Invalid Example:**\n```YAML\npaths:\n  /myResources/{id}:\n    patch:\n      responses:\n        '200':\n          $ref: '#/components/responses/MyResource_Single'\n```\n\n**Valid Examples:**\n```YAML\npaths:\n  /myResources/{id}:\n    patch:\n      responses:\n        '200':\n          $ref: '#/components/responses/MyResource_Single'\n        '404':\n          $ref: '#/components/responses/404Error'\n```\n\nRelated specification information can be found [here](https://jsonapi.org/format/1.1/#crud-updating-responses).",
      documentationUrl:
        "https://jsonapi.org/format/1.1/#crud-updating-responses",
      message: "PATCH requests MUST support response code 404",
      severity: "error",
      given: "$.paths[*][patch].responses",
      then: {
        field: "404",
        function: truthy,
      },
    },
    "patch-409-response-code": {
      description:
        "`PATCH` requests **MUST** document and support response code 409\n\n**Invalid Example:**\n```YAML\npaths:\n  /myResources/{id}:\n    patch:\n      responses:\n        '200':\n          $ref: '#/components/responses/MyResource_Single'\n```\n\n**Valid Examples:**\n```YAML\npaths:\n  /myResources/{id}:\n    patch:\n      responses:\n        '200':\n          $ref: '#/components/responses/MyResource_Single'\n        '409':\n          $ref: '#/components/responses/409Error'\n```\n\nRelated specification information can be found [here](https://jsonapi.org/format/1.1/#crud-updating-responses).",
      documentationUrl:
        "https://jsonapi.org/format/1.1/#crud-updating-responses",
      message: "PATCH requests MUST support response codes: 409",
      severity: "error",
      given: "$.paths[*][patch].responses",
      then: {
        field: "409",
        function: truthy,
      },
    },
    "patch-409-response": {
      description:
        "PATCH 409 response **SHOULD** return `source` property to identify conflict\n\n**Example:**\n```YAML\n# Example showing use of source in error object.\n# Examples describe a conflict between the {id} parameter and the id field in the request body.\n\ntype: array\nitems:\n    type: object\n    properties:\n      id:\n        type: string\n      status:\n        type: string\n        enum:\n          - 409\n      title:\n        type: string\n        enum:\n          - Conflict\n      source:\n        type: object\n        properties:\n          pointer:\n            oneOf:\n              - type: string\n                format: json-pointer\n                example: /data/attributes/id\n              - type: array\n                items:\n                  type: string\n                  format: json-pointer\n          parameter:\n            type: string\n            example: id\nmaxItems:1\n```\n\nRelated specification information can be found [here](https://jsonapi.org/format/1.1/#crud-updating-responses).",
      documentationUrl:
        "https://jsonapi.org/format/1.1/#crud-updating-responses",
      message:
        "PATCH 409 response SHOULD return 'source' property to identify conflict",
      severity: "info",
      given: "$.paths[*][patch].responses",
      then: {
        field: "409",
        function: falsy,
      },
    },
    "delete-2xx-response-codes": {
      description:
        "`DELETE` requests **MUST** support at least one of the following 2xx codes: 200, 202, or 204\n\n**Invalid Example:**\n```YAML\npaths:\n  /myResources/{id}:\n    delete:\n      responses:\n        '404':\n          $ref: '#/components/responses/404Error'\n```\n\n**Valid Examples:**\n```YAML\npaths:\n  /myResources/{id}:\n    delete:\n      responses:\n        '200':\n          $ref: '#/components/responses/delete_meta_data'\n        '404':\n          $ref: '#/components/responses/404Error'\n\npaths:\n  /myResources/{id}:\n    delete:\n      responses:\n        '202':\n          description: Accepted.\n        '404':\n          $ref: '#/components/responses/404Error'\n\npaths:\n  /myResources/{id}:\n    delete:\n      responses:\n        '204':\n          description: Successful Operation. No Content.\n        '404':\n          $ref: '#/components/responses/404Error'  \n```\n\nRelated specification information can be found [here](https://jsonapi.org/format/1.1/#crud-deleting-responses).",
      documentationUrl:
        "https://jsonapi.org/format/1.1/#crud-deleting-responses",
      message:
        "DELETE requests MUST support at least one of the following 2xx codes: 200, 202 or 204",
      severity: "error",
      given: "$.paths[*][delete].responses",
      then: {
        function: schema,
        functionOptions: {
          dialect: "draft2020-12",
          schema: {
            type: "object",
            anyOf: [
              {
                required: ["200"],
              },
              {
                required: ["202"],
              },
              {
                required: ["204"],
              },
            ],
          },
        },
      },
    },
    "delete-404-response-code": {
      description:
        "`DELETE` requests **MUST** support response code 404\n\n**Invalid Example:**\n```YAML\npaths:\n  /myResources/{id}:\n    delete:\n      responses:\n        '204':\n          description: Successful Operation. No Content.\n```\n\n**Valid Examples:**\n```YAML\npaths:\n  /myResources/{id}:\n    delete:\n      responses:\n        '204':\n          description: Successful Operation. No Content.\n        '404':\n          $ref: '#/components/responses/404Error'\n```\n\nRelated specification information can be found [here](https://jsonapi.org/format/1.1/#crud-deleting-responses).",
      documentationUrl:
        "https://jsonapi.org/format/1.1/#crud-deleting-responses",
      message: "DELETE requests MUST support response code 404",
      severity: "error",
      given: "$.paths[*][delete].responses",
      then: {
        field: "404",
        function: truthy,
      },
    },
    "error-object-schema": {
      description:
        "error objects **MUST** follow schema\n\n**Schema Rules:**\n- **MAY** contain the following fields: `id`,`links`,`status`,`code`,`title`,`detail`,`source`,`meta`\n- `id`,`status`,`code`,`title`,`detail` **MUST** be an `object`\n- `links`,`source`,`meta` **MUST** be an `object`\n\n**Valid Example:** Using all fields\n```YAML\ntype: object\ndescription: JSON:API Error Object\nproperties:\n  id:\n    type: string\n    description: a unique identifier for this particular occurrence of the problem\n  links:\n    type: object\n    description: links that lead to further detail about the particular occurrence of the problem\n    properties:\n      about:\n        $ref: '#/components/schemas/Link'\n  status:\n    type: string\n    description: the HTTP status code applicable to this problem\n  code:\n    type: string\n    description: an application-specific error code\n  title:\n    type: string\n    description:  a human-readable summary specific of the problem. Usually the http status friendly name.\n  detail:\n    type: string\n    description:  a human-readable explanation specific to this occurrence of the problem\n  source:\n    type: object\n    description: an object containing references to the source of the error\n    properties:\n      pointer:\n        description: a JSON Pointer [RFC6901] to the associated entity in the request document\n        oneOf:\n          - type: string\n            format: json-pointer\n          - type: array\n            items:\n              type: string\n              format: json-pointer\n      parameter:\n        description: a string indicating which URI query parameter caused the error\n        type: string\n  meta:\n    type: object\n```\n\nRelated specification information can be found [here](https://jsonapi.org/format/1.1/#error-objects).",
      documentationUrl: "https://jsonapi.org/format/1.1/#error-objects",
      message: "Error objects (item object) MUST follow schema",
      severity: "error",
      given: "#ErrorObjects",
      then: [
        {
          field: "@key",
          function: enumeration,
          functionOptions: {
            values: [
              "id",
              "links",
              "status",
              "code",
              "title",
              "detail",
              "source",
              "meta",
            ],
          },
        },
        {
          field: "links.type",
          function: enumeration,
          functionOptions: {
            values: ["object"],
          },
        },
        {
          field: "source.type",
          function: enumeration,
          functionOptions: {
            values: ["object"],
          },
        },
        {
          field: "meta.type",
          function: enumeration,
          functionOptions: {
            values: ["object"],
          },
        },
        {
          field: "status.type",
          function: enumeration,
          functionOptions: {
            values: ["string"],
          },
        },
        {
          field: "code.type",
          function: enumeration,
          functionOptions: {
            values: ["string"],
          },
        },
        {
          field: "title.type",
          function: enumeration,
          functionOptions: {
            values: ["string"],
          },
        },
        {
          field: "detail.type",
          function: enumeration,
          functionOptions: {
            values: ["string"],
          },
        },
      ],
    },
    "error-object-links": {
      description:
        "error object `links` property **MUST** contain an `about` link.\n\n**Invalid Example:**\n```YAML\n# Error Object\n# ...\nlinks:\n  type: object\n  description: links that lead to further detail about the particular occurrence of the problem\n  properties:\n    self:\n      $ref: '#/components/schemas/Link'\n```\n\n**Valid Example:**\n```YAML\n# Error Object\n# ...\nlinks:\n  type: object\n  description: links that lead to further detail about the particular occurrence of the problem\n  properties:\n    about:\n      $ref: '#/components/schemas/Link'\n```\n\nRelated specification information can be found [here](https://jsonapi.org/format/1.1/#error-objects).",
      documentationUrl: "https://jsonapi.org/format/1.1/#error-objects",
      message: "Error object links property MUST contain 'about'",
      severity: "error",
      given: "#ErrorObjects.links.properties",
      then: [
        {
          field: "about",
          function: truthy,
        },
      ],
    },
    "error-object-source-schema": {
      description:
        "error object `source` **MUST** follow schema\n\n**Schema Rules:**\n- `source` **MUST** be an `object`\n- **MUST** contain at least one of: `pointer` or `parameter`\n- `parameter` **MUST** be a `string`\n- `pointer` **MUST** be a single json-pointer[[RFC6901]](https://tools.ietf.org/html/rfc6901) string or array of json-pointer strings\n\n**Valid Example:**\n```YAML\ntype: object\ndescription: an object containing references to the source of the error\nproperties:\n  pointer:\n    description: a JSON Pointer [RFC6901] to the associated entity in the request document\n    oneOf:\n      - type: string\n        format: json-pointer\n      - type: array\n        items:\n          type: string\n          format: json-pointer\n  parameter:\n    description: a string indicating which URI query parameter caused the error\n    type: string\n```\n\nRelated specification information can be found [here](https://jsonapi.org/format/1.1/#error-objects).",
      documentationUrl: "https://jsonapi.org/format/1.1/#error-objects",
      message: "Error object source MUST follow schema",
      severity: "error",
      given: "#ErrorObjects.source",
      then: {
        field: "properties",
        function: schema,
        functionOptions: {
          dialect: "draft2020-12",
          schema: {
            type: "object",
            properties: {
              parameter: {
                type: "object",
                properties: {
                  type: {
                    type: "string",
                    enum: ["string"],
                  },
                },
              },
              pointer: {
                type: "object",
                properties: {
                  oneOf: {
                    type: "array",
                    items: {
                      oneOf: [
                        {
                          type: "object",
                          required: ["type", "format"],
                          properties: {
                            type: {
                              type: "string",
                              enum: ["string"],
                            },
                            format: {
                              type: "string",
                              enum: ["json-pointer"],
                            },
                          },
                        },
                        {
                          type: "object",
                          properties: {
                            type: {
                              type: "string",
                              enum: ["array"],
                            },
                            items: {
                              type: "object",
                              required: ["type", "format"],
                              properties: {
                                type: {
                                  type: "string",
                                  enum: ["string"],
                                },
                                format: {
                                  type: "string",
                                  enum: ["json-pointer"],
                                },
                              },
                            },
                          },
                        },
                      ],
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  },
};

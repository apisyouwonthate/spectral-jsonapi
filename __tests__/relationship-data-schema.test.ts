import { DiagnosticSeverity } from "@stoplight/types";
import testRule from "./__helpers__/helper";

const sharedRelationshipSchemas = {
  BaseModel: {
    type: "object",
    properties: {
      id: {
        type: "string",
      },
    },
  },
  Link: {
    type: "object",
  },
  RelationshipPlural: {
    title: "Relationship Plural",
    type: "object",
    properties: {
      data: {
        type: "array",
        items: {
          type: "object",
          properties: {
            type: {
              type: "string",
            },
            id: {
              type: "string",
            },
          },
        },
      },
      links: {
        type: "object",
        properties: {
          self: {
            $ref: "#/components/schemas/Link",
          },
          related: {
            $ref: "#/components/schemas/Link",
          },
        },
      },
    },
  },
};

const componentResponseDocument = (
  schemaName: string,
  schemas: Record<string, unknown>,
) => ({
  openapi: "3.1.0",
  info: {
    title: "Test",
    version: "1.0.0",
  },
  paths: {
    "/articles/{id}": {
      get: {
        responses: {
          "200": {
            description: "ok",
            content: {
              "application/vnd.api+json": {
                schema: {
                  type: "object",
                  properties: {
                    data: {
                      $ref: `#/components/schemas/${schemaName}`,
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
  components: {
    schemas,
  },
});

const invalidDocument = {
  openapi: "3.1.0",
  info: {
    title: "Test",
    version: "1.0.0",
  },
  paths: {
    "/articles/{id}": {
      get: {
        responses: {
          "200": {
            description: "ok",
            content: {
              "application/vnd.api+json": {
                schema: {
                  type: "object",
                  properties: {
                    data: {
                      type: "object",
                      properties: {
                        type: {
                          type: "string",
                        },
                        relationships: {
                          type: "object",
                          properties: {
                            author: {
                              type: "object",
                              properties: {
                                data: {
                                  type: "object",
                                  properties: {
                                    id: {
                                      type: "integer",
                                    },
                                    type: {
                                      type: "string",
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
                },
              },
            },
          },
        },
      },
    },
  },
};

const validDocument = structuredClone(invalidDocument);
validDocument.paths["/articles/{id}"].get.responses["200"].content[
  "application/vnd.api+json"
].schema.properties.data.properties.relationships.properties.author.properties.data.properties.id.type =
  "string";

testRule("relationship-data-schema", [
  {
    name: "relationship data id is not string",
    document: invalidDocument,
    errors: [
      {
        message:
          "Relationship data entries must match the resource identifier schema.",
        path: [
          "paths",
          "/articles/{id}",
          "get",
          "responses",
          "200",
          "content",
          "application/vnd.api+json",
          "schema",
          "properties",
          "data",
          "properties",
          "relationships",
          "properties",
          "author",
          "properties",
          "data",
          "properties",
        ],
        severity: DiagnosticSeverity.Error,
      },
      {
        message:
          "Relationship data entries must match the resource identifier schema.",
        path: [
          "paths",
          "/articles/{id}",
          "get",
          "responses",
          "200",
          "content",
          "application/vnd.api+json",
          "schema",
          "properties",
          "data",
          "properties",
          "relationships",
          "properties",
          "author",
          "properties",
          "data",
          "properties",
          "id",
          "type",
        ],
        severity: DiagnosticSeverity.Error,
      },
      {
        message:
          "Relationship data entries must match the resource identifier schema.",
        path: [
          "paths",
          "/articles/{id}",
          "get",
          "responses",
          "200",
          "content",
          "application/vnd.api+json",
          "schema",
          "properties",
          "data",
          "properties",
          "relationships",
          "properties",
          "author",
          "properties",
          "data",
          "properties",
          "type",
        ],
        severity: DiagnosticSeverity.Error,
      },
    ],
  },
  {
    name: "valid relationship-data-schema case",
    document: validDocument,
    errors: [],
  },
  {
    name: "valid: allOf relationship data narrowed in second member",
    document: componentResponseDocument("IncludedQuestionnaire", {
      ...sharedRelationshipSchemas,
      IncludedQuestionnaire: {
        allOf: [
          {
            $ref: "#/components/schemas/BaseModel",
          },
          {
            type: "object",
            properties: {
              type: {
                type: "string",
                enum: ["questionnaire"],
              },
              relationships: {
                type: "object",
                properties: {
                  sections: {
                    allOf: [
                      {
                        $ref: "#/components/schemas/RelationshipPlural",
                      },
                      {
                        type: "object",
                        properties: {
                          data: {
                            type: "array",
                            items: {
                              type: "object",
                              properties: {
                                type: {
                                  type: "string",
                                  enum: ["questionnaire_section"],
                                },
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
        ],
      },
    }),
    errors: [],
  },
]);

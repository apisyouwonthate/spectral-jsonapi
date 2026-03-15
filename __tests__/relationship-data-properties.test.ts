import { DiagnosticSeverity } from "@stoplight/types";
import testRule from "./__helpers__/helper";

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
                                      type: "string",
                                    },
                                    type: {
                                      type: "string",
                                    },
                                    attributes: {
                                      type: "object",
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
delete validDocument.paths["/articles/{id}"].get.responses["200"].content[
  "application/vnd.api+json"
].schema.properties.data.properties.relationships.properties.author.properties
  .data.properties.attributes;

testRule("relationship-data-properties", [
  {
    name: "relationship data includes attributes",
    document: invalidDocument,
    errors: [
      {
        message: "Relationship data may only include id, type, and meta.",
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
          "attributes",
        ],
        severity: DiagnosticSeverity.Error,
      },
    ],
  },
  {
    name: "valid relationship-data-properties case",
    document: validDocument,
    errors: [],
  },
]);

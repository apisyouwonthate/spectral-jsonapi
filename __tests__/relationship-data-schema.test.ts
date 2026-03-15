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
          "id",
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
]);

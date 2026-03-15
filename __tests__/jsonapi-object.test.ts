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
                    jsonapi: {
                      type: "object",
                      properties: {
                        revision: {
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
};

const validDocument = structuredClone(invalidDocument);
delete validDocument.paths["/articles/{id}"].get.responses["200"].content[
  "application/vnd.api+json"
].schema.properties.jsonapi.properties.revision;
validDocument.paths["/articles/{id}"].get.responses["200"].content[
  "application/vnd.api+json"
].schema.properties.jsonapi.properties.version = {
  type: "string",
};

testRule("jsonapi-object", [
  {
    name: "jsonapi contains unsupported property",
    document: invalidDocument,
    errors: [
      {
        message: "jsonapi must be an object with a string version.",
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
          "jsonapi",
          "properties",
        ],
        severity: DiagnosticSeverity.Error,
      },
    ],
  },
  {
    name: "valid jsonapi-object case",
    document: validDocument,
    errors: [],
  },
]);

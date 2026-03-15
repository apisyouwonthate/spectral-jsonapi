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
                    links: {
                      type: "object",
                      properties: {
                        self: {
                          type: "object",
                          properties: {
                            url: {
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
};

const validDocument = structuredClone(invalidDocument);
delete validDocument.paths["/articles/{id}"].get.responses["200"].content[
  "application/vnd.api+json"
].schema.properties.links.properties.self.properties.url;
validDocument.paths["/articles/{id}"].get.responses["200"].content[
  "application/vnd.api+json"
].schema.properties.links.properties.self.properties.href = {
  type: "string",
};

testRule("links-object-schema-properties", [
  {
    name: "link object uses url field instead of href",
    document: invalidDocument,
    errors: [
      {
        message:
          "Link objects may only contain href and meta, and must include href.",
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
          "links",
          "properties",
          "self",
          "properties",
        ],
        severity: DiagnosticSeverity.Error,
      },
      {
        message:
          "Link objects may only contain href and meta, and must include href.",
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
          "links",
          "properties",
          "self",
          "properties",
          "url",
        ],
        severity: DiagnosticSeverity.Error,
      },
    ],
  },
  {
    name: "valid links-object-schema-properties case",
    document: validDocument,
    errors: [],
  },
]);

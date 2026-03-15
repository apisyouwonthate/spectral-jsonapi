import { DiagnosticSeverity } from "@stoplight/types";
import testRule from "./__helpers__/helper";

const invalidDocument = {
  openapi: "3.1.0",
  info: {
    title: "Test",
    version: "1.0.0",
  },
  paths: {
    "/articles": {
      post: {
        requestBody: {
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
                            required: ["foo"],
                            properties: {
                              links: {
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
        responses: {
          "201": {
            description: "created",
          },
        },
      },
    },
  },
};

const validDocument = structuredClone(invalidDocument);
validDocument.paths["/articles"].post.requestBody.content[
  "application/vnd.api+json"
].schema.properties.data.properties.relationships.properties.author.required[0] =
  "data";

testRule("post-relationships", [
  {
    name: "post relationship required contains invalid member",
    document: invalidDocument,
    errors: [
      {
        message: "If POST relationships are present, they must include data.",
        path: [
          "paths",
          "/articles",
          "post",
          "requestBody",
          "content",
          "application/vnd.api+json",
          "schema",
          "properties",
          "data",
          "properties",
          "relationships",
          "properties",
          "author",
          "required",
          "0",
        ],
        severity: DiagnosticSeverity.Error,
      },
    ],
  },
  {
    name: "valid post-relationships case",
    document: validDocument,
    errors: [],
  },
]);

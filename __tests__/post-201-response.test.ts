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
        responses: {
          "201": {
            description: "created",
            content: {
              "application/vnd.api+json": {
                schema: {
                  type: "object",
                  required: ["errors"],
                  properties: {
                    meta: {
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
};

const validDocument = structuredClone(invalidDocument);
validDocument.paths["/articles"].post.responses["201"].content[
  "application/vnd.api+json"
].schema.required[0] = "data";
validDocument.paths["/articles"].post.responses["201"].content[
  "application/vnd.api+json"
].schema.properties.data = {
  type: "object",
};

testRule("post-201-response", [
  {
    name: "201 response required contains invalid member",
    document: invalidDocument,
    errors: [
      {
        message: "POST 201 responses should include primary resource data.",
        path: [
          "paths",
          "/articles",
          "post",
          "responses",
          "201",
          "content",
          "application/vnd.api+json",
          "schema",
          "required",
          "0",
        ],
        severity: DiagnosticSeverity.Information,
      },
    ],
  },
  {
    name: "valid post-201-response case",
    document: validDocument,
    errors: [],
  },
]);

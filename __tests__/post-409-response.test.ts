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
          "409": {
            description: "conflict",
          },
        },
      },
    },
  },
};

const validDocument = structuredClone(invalidDocument);
delete validDocument.paths["/articles"].post.responses["409"];

testRule("post-409-response", [
  {
    name: "post includes explicit 409 response",
    document: invalidDocument,
    errors: [
      {
        message:
          "POST 409 responses should include source to explain the conflict.",
        path: ["paths", "/articles", "post", "responses", "409"],
        severity: DiagnosticSeverity.Information,
      },
    ],
  },
  {
    name: "valid post-409-response case",
    document: validDocument,
    errors: [],
  },
]);

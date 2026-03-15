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
        },
      },
    },
  },
};

const validDocument = structuredClone(invalidDocument);
validDocument.paths["/articles"].post.responses["409"] = {
  description: "conflict",
};

testRule("post-409-response-code", [
  {
    name: "post missing 409 response",
    document: invalidDocument,
    errors: [
      {
        message: "POST operations must define a 409 conflict response.",
        path: ["paths", "/articles", "post", "responses"],
        severity: DiagnosticSeverity.Error,
      },
    ],
  },
  {
    name: "valid post-409-response-code case",
    document: validDocument,
    errors: [],
  },
]);

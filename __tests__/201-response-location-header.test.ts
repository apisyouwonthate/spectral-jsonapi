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
            headers: {},
          },
        },
      },
    },
  },
};

const validDocument = structuredClone(invalidDocument);
validDocument.paths["/articles"].post.responses["201"].headers = {
  Location: {
    schema: {
      type: "string",
    },
  },
};

testRule("201-response-location-header", [
  {
    name: "201 response omits Location header",
    document: invalidDocument,
    errors: [
      {
        message: "POST 201 responses should include a Location header.",
        path: ["paths", "/articles", "post", "responses", "201", "headers"],
        severity: DiagnosticSeverity.Information,
      },
    ],
  },
  {
    name: "valid 201-response-location-header case",
    document: validDocument,
    errors: [],
  },
]);

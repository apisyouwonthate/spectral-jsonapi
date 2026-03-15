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
          },
        },
      },
    },
  },
};

const validDocument = structuredClone(invalidDocument);
validDocument.paths["/articles"].post.responses["415"] = {
  description: "unsupported media type",
};

testRule("415-response-code", [
  {
    name: "missing 415 on post",
    document: invalidDocument,
    errors: [
      {
        message:
          "Document a 415 response for invalid Content-Type headers on POST and PATCH.",
        path: ["paths", "/articles", "post", "responses"],
        severity: DiagnosticSeverity.Error,
      },
    ],
  },
  {
    name: "valid 415-response-code case",
    document: validDocument,
    errors: [],
  },
]);

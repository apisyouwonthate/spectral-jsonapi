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
      get: {
        parameters: [
          {
            name: "sort",
            in: "query",
            style: "form",
            explode: true,
            schema: {
              type: "array",
              items: {
                type: "string",
              },
            },
          },
        ],
        responses: {
          "200": {
            description: "ok",
          },
        },
      },
    },
  },
};

const validDocument = structuredClone(invalidDocument);
validDocument.paths["/articles"].get.parameters[0].explode = false;

testRule("sort-parameter", [
  {
    name: "sort incorrectly uses explode true",
    document: invalidDocument,
    errors: [
      {
        message: "sort must be a query parameter using CSV array style.",
        path: ["paths", "/articles", "get", "parameters", "0", "explode"],
        severity: DiagnosticSeverity.Error,
      },
    ],
  },
  {
    name: "valid sort-parameter case",
    document: validDocument,
    errors: [],
  },
]);

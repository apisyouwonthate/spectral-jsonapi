import { DiagnosticSeverity } from "@stoplight/types";
import testRule from "./__helpers__/helper";
import { base } from "./__helpers__/fixtures";

testRule("page-parameter", [
  {
    name: "page uses deepObject but invalid member types",
    document: {
      ...base,
      paths: {
        "/articles": {
          get: {
            parameters: [
              {
                name: "page",
                in: "query",
                style: "deepObject",
                schema: {
                  type: "object",
                  properties: {
                    limit: { type: "string" },
                  },
                },
              },
            ],
            responses: { "200": { description: "ok" } },
          },
        },
      },
    },
    errors: [
      {
        message:
          "page must be a deepObject query parameter that matches the pagination schema.",
        path: [
          "paths",
          "/articles",
          "get",
          "parameters",
          "0",
          "schema",
          "properties",
          "limit",
          "type",
        ],
        severity: DiagnosticSeverity.Error,
      },
    ],
  },
  {
    name: "cursor pagination shape passes",
    document: {
      ...base,
      paths: {
        "/articles": {
          get: {
            parameters: [
              {
                name: "page",
                in: "query",
                style: "deepObject",
                schema: {
                  type: "object",
                  properties: {
                    cursor: { type: "string" },
                    limit: { type: "integer", format: "int32" },
                  },
                },
              },
            ],
            responses: { "200": { description: "ok" } },
          },
        },
      },
    },
    errors: [],
  },
]);

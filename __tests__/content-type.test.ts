import { DiagnosticSeverity } from "@stoplight/types";
import testRule from "./__helpers__/helper";

testRule("content-type", [
  {
    name: "valid content type",
    document: {
      openapi: "3.1.0",
      info: { title: "Test", version: "1.0.0" },
      paths: {
        "/items": {
          get: {
            responses: {
              "200": {
                description: "ok",
                content: {
                  "application/vnd.api+json": {
                    schema: {},
                  },
                },
              },
            },
          },
        },
      },
    },
    errors: [],
  },
  {
    name: "content type with parameters",
    document: {
      openapi: "3.1.0",
      info: { title: "Test", version: "1.0.0" },
      paths: {
        "/items": {
          get: {
            responses: {
              "200": {
                description: "ok",
                content: {
                  "application/vnd.api+json; ext=example": {
                    schema: {},
                  },
                },
              },
            },
          },
        },
      },
    },
    errors: [],
  },
  {
    name: "invalid content type",
    document: {
      openapi: "3.1.0",
      info: { title: "Test", version: "1.0.0" },
      paths: {
        "/items": {
          get: {
            responses: {
              "200": {
                description: "ok",
                content: {
                  "application/json": {
                    schema: { type: "object" },
                  },
                },
              },
            },
          },
        },
      },
    },
    errors: [
      {
        message: "content MUST be 'application/vnd.api+json'",
        path: [
          "paths",
          "/items",
          "get",
          "responses",
          "200",
          "content",
          "application/json",
        ],
        severity: DiagnosticSeverity.Error,
      },
    ],
  },
]);

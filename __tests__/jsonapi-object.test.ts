import { DiagnosticSeverity } from "@stoplight/types";
import { createWithRules, expectRuleErrors } from "./__helpers__/helper";
import { openApiBase } from "./__helpers__/fixtures";

describe("Rule jsonapi-object", () => {
  let spectral = createWithRules(["jsonapi-object"]);

  beforeEach(() => {
    spectral = createWithRules(["jsonapi-object"]);
  });

  it("jsonapi contains unsupported property", async () => {
    const document = {
      ...openApiBase,
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
                        jsonapi: {
                          type: "object",
                          properties: {
                            revision: {
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
    };

    await expectRuleErrors(spectral, "jsonapi-object", document, [
      {
        message: "jsonapi must be an object with a string version.",
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
          "jsonapi",
          "properties",
        ],
        severity: DiagnosticSeverity.Error,
      },
    ]);
  });

  it("valid jsonapi-object case", async () => {
    const document = {
      ...openApiBase,
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
                        jsonapi: {
                          type: "object",
                          properties: {
                            version: {
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
    };

    await expectRuleErrors(spectral, "jsonapi-object", document, []);
  });
});

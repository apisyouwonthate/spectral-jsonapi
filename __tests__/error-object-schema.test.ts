import { DiagnosticSeverity } from "@stoplight/types";
import { createWithRules, expectRuleErrors } from "./__helpers__/helper";
import { openApiBase } from "./__helpers__/fixtures";

describe("Rule error-object-schema", () => {
  let spectral = createWithRules(["error-object-schema"]);

  beforeEach(() => {
    spectral = createWithRules(["error-object-schema"]);
  });

  it("error object includes unsupported member", async () => {
    const document = {
      ...openApiBase,
      paths: {
        "/articles": {
          get: {
            responses: {
              "400": {
                description: "bad request",
                content: {
                  "application/vnd.api+json": {
                    schema: {
                      type: "object",
                      properties: {
                        errors: {
                          type: "array",
                          items: {
                            type: "object",
                            properties: {
                              badField: {
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
      },
    };

    await expectRuleErrors(spectral, "error-object-schema", document, [
      {
        message: "Error objects must follow the JSON:API error object schema.",
        path: [
          "paths",
          "/articles",
          "get",
          "responses",
          "400",
          "content",
          "application/vnd.api+json",
          "schema",
          "properties",
          "errors",
          "items",
          "properties",
          "badField",
        ],
        severity: DiagnosticSeverity.Error,
      },
    ]);
  });

  it("valid error-object-schema case", async () => {
    const document = {
      ...openApiBase,
      paths: {
        "/articles": {
          get: {
            responses: {
              "400": {
                description: "bad request",
                content: {
                  "application/vnd.api+json": {
                    schema: {
                      type: "object",
                      properties: {
                        errors: {
                          type: "array",
                          items: {
                            type: "object",
                            properties: {
                              status: {
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
      },
    };

    await expectRuleErrors(spectral, "error-object-schema", document, []);
  });
});

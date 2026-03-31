import { DiagnosticSeverity } from "@stoplight/types";
import { createWithRules, expectRuleErrors } from "./__helpers__/helper";
import { openApiBase } from "./__helpers__/fixtures";

describe("Rule post-409-response", () => {
  let spectral = createWithRules(["post-409-response"]);

  beforeEach(() => {
    spectral = createWithRules(["post-409-response"]);
  });

  it("invalid: 409 response does not define a source", async () => {
    const document = {
      ...openApiBase,
      paths: {
        "/articles": {
          post: {
            responses: {
              "409": {
                description: "conflict",
                content: {
                  "application/vnd.api+json": {
                    schema: {
                      type: "object",
                      properties: {
                        nonsense: {},
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

    await expectRuleErrors(spectral, "post-409-response", document, [
      {
        message:
          "POST 409 responses should include source to explain the conflict.",
        path: [
          "paths",
          "/articles",
          "post",
          "responses",
          "409",
          "content",
          "application/vnd.api+json",
          "schema",
          "properties",
        ],
        severity: DiagnosticSeverity.Information,
      },
    ]);
  });

  it("valid: JSON response shows source of conflict", async () => {
    const document = {
      ...openApiBase,
      paths: {
        "/articles": {
          post: {
            responses: {
              "409": {
                description: "conflict",
                content: {
                  "application/vnd.api+json": {
                    schema: {
                      type: "object",
                      properties: {
                        source: {
                          type: "object",
                          properties: {
                            pointer: {
                              type: "string",
                              format: "json-pointer",
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

    await expectRuleErrors(spectral, "post-409-response", document, []);
  });
});

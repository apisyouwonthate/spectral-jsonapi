import { DiagnosticSeverity } from "@stoplight/types";
import { createWithRules, expectRuleErrors } from "./__helpers__/helper";
import { openApiBase } from "./__helpers__/fixtures";

describe("Rule post-2xx-response-codes", () => {
  let spectral = createWithRules(["post-2xx-response-codes"]);

  beforeEach(() => {
    spectral = createWithRules(["post-2xx-response-codes"]);
  });

  it("invalid: post has no success 2xx response", async () => {
    const document = {
      ...openApiBase,
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
              "409": {
                description: "conflict",
              },
            },
          },
        },
      },
    };

    await expectRuleErrors(spectral, "post-2xx-response-codes", document, [
      {
        message:
          "POST operations must define at least one success response: 201, 202, or 204.",
        path: ["paths", "/articles", "post", "responses"],
        severity: DiagnosticSeverity.Error,
      },
    ]);
  });

  it("valid: 201 response is defined", async () => {
    const document = {
      ...openApiBase,
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

    await expectRuleErrors(spectral, "post-2xx-response-codes", document, []);
  });
});

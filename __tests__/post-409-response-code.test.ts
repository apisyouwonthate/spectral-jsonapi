import { DiagnosticSeverity } from "@stoplight/types";
import { createWithRules, expectRuleErrors } from "./__helpers__/helper";
import { openApiBase } from "./__helpers__/fixtures";

describe("Rule post-409-response-code", () => {
  let spectral = createWithRules(["post-409-response-code"]);

  beforeEach(() => {
    spectral = createWithRules(["post-409-response-code"]);
  });

  it("post missing 409 response", async () => {
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
            },
          },
        },
      },
    };

    await expectRuleErrors(spectral, "post-409-response-code", document, [
      {
        message: "POST operations must define a 409 conflict response.",
        path: ["paths", "/articles", "post", "responses"],
        severity: DiagnosticSeverity.Error,
      },
    ]);
  });

  it("valid: 409 response defined", async () => {
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

    await expectRuleErrors(spectral, "post-409-response-code", document, []);
  });
});

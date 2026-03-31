import { DiagnosticSeverity } from "@stoplight/types";
import { createWithRules, expectRuleErrors } from "./__helpers__/helper";
import { openApiBase } from "./__helpers__/fixtures";

describe("Rule patch-2xx-response-codes", () => {
  let spectral = createWithRules(["patch-2xx-response-codes"]);

  beforeEach(() => {
    spectral = createWithRules(["patch-2xx-response-codes"]);
  });

  it("patch has no success 2xx response", async () => {
    const document = {
      ...openApiBase,
      paths: {
        "/articles/{id}": {
          patch: {
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

    await expectRuleErrors(spectral, "patch-2xx-response-codes", document, [
      {
        message:
          "PATCH operations must define at least one success response: 200, 202, or 204.",
        path: ["paths", "/articles/{id}", "patch", "responses"],
        severity: DiagnosticSeverity.Error,
      },
    ]);
  });

  it("valid patch-2xx-response-codes case", async () => {
    const document = {
      ...openApiBase,
      paths: {
        "/articles/{id}": {
          patch: {
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
              "200": {
                description: "ok",
              },
              "409": {
                description: "conflict",
              },
            },
          },
        },
      },
    };

    await expectRuleErrors(spectral, "patch-2xx-response-codes", document, []);
  });
});

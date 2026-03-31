import { DiagnosticSeverity } from "@stoplight/types";
import { createWithRules, expectRuleErrors } from "./__helpers__/helper";
import { openApiBase } from "./__helpers__/fixtures";

describe("Rule patch-409-response-code", () => {
  let spectral = createWithRules(["patch-409-response-code"]);

  beforeEach(() => {
    spectral = createWithRules(["patch-409-response-code"]);
  });

  it("patch missing 409 response", async () => {
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
              "404": {
                description: "not found",
              },
            },
          },
        },
      },
    };

    await expectRuleErrors(spectral, "patch-409-response-code", document, [
      {
        message: "PATCH operations must define a 409 conflict response.",
        path: ["paths", "/articles/{id}", "patch", "responses"],
        severity: DiagnosticSeverity.Error,
      },
    ]);
  });

  it("valid patch-409-response-code case", async () => {
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
              "404": {
                description: "not found",
              },
              "409": {
                description: "conflict",
              },
            },
          },
        },
      },
    };

    await expectRuleErrors(spectral, "patch-409-response-code", document, []);
  });
});

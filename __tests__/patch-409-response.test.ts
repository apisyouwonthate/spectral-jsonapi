import { DiagnosticSeverity } from "@stoplight/types";
import { createWithRules, expectRuleErrors } from "./__helpers__/helper";
import { openApiBase } from "./__helpers__/fixtures";

describe("Rule patch-409-response", () => {
  let spectral = createWithRules(["patch-409-response"]);

  beforeEach(() => {
    spectral = createWithRules(["patch-409-response"]);
  });

  it("patch includes explicit 409 response", async () => {
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

    await expectRuleErrors(spectral, "patch-409-response", document, [
      {
        message:
          "PATCH 409 responses should include source to explain the conflict.",
        path: ["paths", "/articles/{id}", "patch", "responses", "409"],
        severity: DiagnosticSeverity.Information,
      },
    ]);
  });

  it("valid patch-409-response case", async () => {
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
            },
          },
        },
      },
    };

    await expectRuleErrors(spectral, "patch-409-response", document, []);
  });
});

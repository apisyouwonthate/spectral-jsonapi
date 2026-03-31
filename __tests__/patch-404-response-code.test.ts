import { DiagnosticSeverity } from "@stoplight/types";
import { createWithRules, expectRuleErrors } from "./__helpers__/helper";
import { openApiBase } from "./__helpers__/fixtures";

describe("Rule patch-404-response-code", () => {
  let spectral = createWithRules(["patch-404-response-code"]);

  beforeEach(() => {
    spectral = createWithRules(["patch-404-response-code"]);
  });

  it("patch missing 404 response", async () => {
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

    await expectRuleErrors(spectral, "patch-404-response-code", document, [
      {
        message: "PATCH operations must define a 404 response.",
        path: ["paths", "/articles/{id}", "patch", "responses"],
        severity: DiagnosticSeverity.Error,
      },
    ]);
  });

  it("valid patch-404-response-code case", async () => {
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

    await expectRuleErrors(spectral, "patch-404-response-code", document, []);
  });
});

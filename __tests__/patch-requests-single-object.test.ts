import { DiagnosticSeverity } from "@stoplight/types";
import { createWithRules, expectRuleErrors } from "./__helpers__/helper";
import { openApiBase } from "./__helpers__/fixtures";

describe("Rule patch-requests-single-object", () => {
  let spectral = createWithRules(["patch-requests-single-object"]);

  beforeEach(() => {
    spectral = createWithRules(["patch-requests-single-object"]);
  });

  it("patch data is incorrectly an array", async () => {
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
                        type: "array",
                        items: {
                          type: "object",
                        },
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

    await expectRuleErrors(spectral, "patch-requests-single-object", document, [
      {
        message:
          "PATCH request data must be a single resource object, not an array.",
        path: [
          "paths",
          "/articles/{id}",
          "patch",
          "requestBody",
          "content",
          "application/vnd.api+json",
          "schema",
          "properties",
          "data",
          "type",
        ],
        severity: DiagnosticSeverity.Error,
      },
    ]);
  });

  it("valid patch-requests-single-object case", async () => {
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

    await expectRuleErrors(
      spectral,
      "patch-requests-single-object",
      document,
      [],
    );
  });
});

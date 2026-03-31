import { DiagnosticSeverity } from "@stoplight/types";
import { createWithRules, expectRuleErrors } from "./__helpers__/helper";
import { openApiBase } from "./__helpers__/fixtures";

describe("Rule post-requests-single-object", () => {
  let spectral = createWithRules(["post-requests-single-object"]);

  beforeEach(() => {
    spectral = createWithRules(["post-requests-single-object"]);
  });

  it("post data is incorrectly an array", async () => {
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
              "201": {
                description: "created",
              },
            },
          },
        },
      },
    };

    await expectRuleErrors(spectral, "post-requests-single-object", document, [
      {
        message:
          "POST request data must be a single resource object, not an array.",
        path: [
          "paths",
          "/articles",
          "post",
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

  it("valid post-requests-single-object case", async () => {
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

    await expectRuleErrors(
      spectral,
      "post-requests-single-object",
      document,
      [],
    );
  });
});

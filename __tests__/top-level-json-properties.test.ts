import { DiagnosticSeverity } from "@stoplight/types";
import { createWithRules, expectRuleErrors } from "./__helpers__/helper";
import { openApiBase } from "./__helpers__/fixtures";

describe("Rule top-level-json-properties", () => {
  let spectral = createWithRules(["top-level-json-properties"]);

  beforeEach(() => {
    spectral = createWithRules(["top-level-json-properties"]);
  });

  it("top-level schema has links only", async () => {
    const document = {
      ...openApiBase,
      paths: {
        "/articles/{id}": {
          get: {
            responses: {
              "200": {
                description: "ok",
                content: {
                  "application/vnd.api+json": {
                    schema: {
                      type: "object",
                      properties: {
                        links: {
                          type: "object",
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

    await expectRuleErrors(spectral, "top-level-json-properties", document, [
      {
        message:
          "Top-level documents must include data, errors, or meta and follow JSON:API member rules.",
        path: [
          "paths",
          "/articles/{id}",
          "get",
          "responses",
          "200",
          "content",
          "application/vnd.api+json",
          "schema",
          "properties",
        ],
        severity: DiagnosticSeverity.Error,
      },
    ]);
  });

  it("valid top-level-json-properties case", async () => {
    const document = {
      ...openApiBase,
      paths: {
        "/articles/{id}": {
          get: {
            responses: {
              "200": {
                description: "ok",
                content: {
                  "application/vnd.api+json": {
                    schema: {
                      type: "object",
                      properties: {
                        links: {
                          type: "object",
                        },
                        meta: {
                          type: "object",
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

    await expectRuleErrors(spectral, "top-level-json-properties", document, []);
  });
});

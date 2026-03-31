import { DiagnosticSeverity } from "@stoplight/types";
import { createWithRules, expectRuleErrors } from "./__helpers__/helper";
import { openApiBase } from "./__helpers__/fixtures";

describe("Rule top-level-json-object", () => {
  let spectral = createWithRules(["top-level-json-object"]);

  beforeEach(() => {
    spectral = createWithRules(["top-level-json-object"]);
  });

  it("top-level schema is not an object", async () => {
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
                      type: "array",
                    },
                  },
                },
              },
            },
          },
        },
      },
    };

    await expectRuleErrors(spectral, "top-level-json-object", document, [
      {
        message:
          "Request and response bodies must have a top-level JSON object.",
        path: [
          "paths",
          "/articles/{id}",
          "get",
          "responses",
          "200",
          "content",
          "application/vnd.api+json",
          "schema",
          "type",
        ],
        severity: DiagnosticSeverity.Error,
      },
    ]);
  });

  it("valid top-level-json-object case", async () => {
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
                    },
                  },
                },
              },
            },
          },
        },
      },
    };

    await expectRuleErrors(spectral, "top-level-json-object", document, []);
  });
});

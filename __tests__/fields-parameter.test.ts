import { DiagnosticSeverity } from "@stoplight/types";
import { createWithRules, expectRuleErrors } from "./__helpers__/helper";
import { openApiBase } from "./__helpers__/fixtures";

describe("Rule fields-parameter", () => {
  let spectral = createWithRules(["fields-parameter"]);

  beforeEach(() => {
    spectral = createWithRules(["fields-parameter"]);
  });

  it("fields incorrectly uses form style", async () => {
    const document = {
      ...openApiBase,
      paths: {
        "/articles": {
          get: {
            parameters: [
              {
                name: "fields",
                in: "query",
                style: "form",
                schema: {
                  type: "object",
                },
              },
            ],
            responses: {
              "200": {
                description: "ok",
              },
            },
          },
        },
      },
    };

    await expectRuleErrors(spectral, "fields-parameter", document, [
      {
        message: "fields must be a query parameter using deepObject style.",
        path: ["paths", "/articles", "get", "parameters", "0", "style"],
        severity: DiagnosticSeverity.Error,
      },
    ]);
  });

  it("valid fields-parameter case", async () => {
    const document = {
      ...openApiBase,
      paths: {
        "/articles": {
          get: {
            parameters: [
              {
                name: "fields",
                in: "query",
                style: "deepObject",
                schema: {
                  type: "object",
                },
              },
            ],
            responses: {
              "200": {
                description: "ok",
              },
            },
          },
        },
      },
    };

    await expectRuleErrors(spectral, "fields-parameter", document, []);
  });
});

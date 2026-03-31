import { DiagnosticSeverity } from "@stoplight/types";
import { createWithRules, expectRuleErrors } from "./__helpers__/helper";
import { openApiBase } from "./__helpers__/fixtures";

describe("Rule sort-parameter", () => {
  let spectral = createWithRules(["sort-parameter"]);

  beforeEach(() => {
    spectral = createWithRules(["sort-parameter"]);
  });

  it("sort incorrectly uses explode true", async () => {
    const document = {
      ...openApiBase,
      paths: {
        "/articles": {
          get: {
            parameters: [
              {
                name: "sort",
                in: "query",
                style: "form",
                explode: true,
                schema: {
                  type: "array",
                  items: {
                    type: "string",
                  },
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

    await expectRuleErrors(spectral, "sort-parameter", document, [
      {
        message: "sort must be a query parameter using CSV array style.",
        path: ["paths", "/articles", "get", "parameters", "0", "explode"],
        severity: DiagnosticSeverity.Error,
      },
    ]);
  });

  it("valid sort-parameter case", async () => {
    const document = {
      ...openApiBase,
      paths: {
        "/articles": {
          get: {
            parameters: [
              {
                name: "sort",
                in: "query",
                style: "form",
                explode: false,
                schema: {
                  type: "array",
                  items: {
                    type: "string",
                  },
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

    await expectRuleErrors(spectral, "sort-parameter", document, []);
  });
});

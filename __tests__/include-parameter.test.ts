import { DiagnosticSeverity } from "@stoplight/types";
import { createWithRules, expectRuleErrors } from "./__helpers__/helper";
import { openApiBase } from "./__helpers__/fixtures";

describe("Rule include-parameter", () => {
  let spectral = createWithRules(["include-parameter"]);

  beforeEach(() => {
    spectral = createWithRules(["include-parameter"]);
  });

  it("include incorrectly uses explode true", async () => {
    await expectRuleErrors(
      spectral,
      "include-parameter",
      {
        ...openApiBase,
        paths: {
          "/articles": {
            get: {
              parameters: [
                {
                  name: "include",
                  in: "query",
                  style: "form",
                  explode: true,
                  schema: { type: "array", items: { type: "string" } },
                },
              ],
              responses: { "200": { description: "ok" } },
            },
          },
        },
      },
      [
        {
          message: "include must be a query parameter using CSV array style.",
          path: ["paths", "/articles", "get", "parameters", "0", "explode"],
          severity: DiagnosticSeverity.Error,
        },
      ],
    );
  });

  it("include supports dotted relationship paths", async () => {
    await expectRuleErrors(
      spectral,
      "include-parameter",
      {
        ...openApiBase,
        paths: {
          "/articles/{id}": {
            get: {
              parameters: [
                {
                  name: "include",
                  in: "query",
                  style: "form",
                  explode: false,
                  schema: { type: "array", items: { type: "string" } },
                  example: ["comments.author", "ratings"],
                },
              ],
              responses: { "200": { description: "ok" } },
            },
          },
        },
      },
      [],
    );
  });
});

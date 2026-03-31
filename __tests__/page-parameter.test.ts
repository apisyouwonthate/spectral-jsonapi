import { DiagnosticSeverity } from "@stoplight/types";
import { createWithRules, expectRuleErrors } from "./__helpers__/helper";
import { openApiBase } from "./__helpers__/fixtures";

describe("Rule page-parameter", () => {
  let spectral = createWithRules(["page-parameter"]);

  beforeEach(() => {
    spectral = createWithRules(["page-parameter"]);
  });

  it("page uses deepObject but invalid member types", async () => {
    await expectRuleErrors(
      spectral,
      "page-parameter",
      {
        ...openApiBase,
        paths: {
          "/articles": {
            get: {
              parameters: [
                {
                  name: "page",
                  in: "query",
                  style: "deepObject",
                  schema: {
                    type: "object",
                    properties: {
                      limit: { type: "string" },
                    },
                  },
                },
              ],
              responses: { "200": { description: "ok" } },
            },
          },
        },
      },
      [
        {
          message:
            "page must be a deepObject query parameter that matches the pagination schema.",
          path: [
            "paths",
            "/articles",
            "get",
            "parameters",
            "0",
            "schema",
            "properties",
            "limit",
            "type",
          ],
          severity: DiagnosticSeverity.Error,
        },
      ],
    );
  });

  it("cursor pagination shape passes", async () => {
    await expectRuleErrors(
      spectral,
      "page-parameter",
      {
        ...openApiBase,
        paths: {
          "/articles": {
            get: {
              parameters: [
                {
                  name: "page",
                  in: "query",
                  style: "deepObject",
                  schema: {
                    type: "object",
                    properties: {
                      cursor: { type: "string" },
                      limit: { type: "integer", format: "int32" },
                    },
                  },
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

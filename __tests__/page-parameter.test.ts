import { DiagnosticSeverity } from "@stoplight/types";
import { createWithRules, expectRuleErrors } from "./__helpers__/helper";
import { openApiBase } from "./__helpers__/fixtures";

describe("Rule page-parameter", () => {
  let spectral = createWithRules(["page-parameter"]);

  beforeEach(() => {
    spectral = createWithRules(["page-parameter"]);
  });

  it("invalid: single page parameter must use deepObject", async () => {
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
                  style: "form",
                  schema: {
                    type: "object",
                    properties: {
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
      [
        {
          message:
            "page query parameters must use either deepObject page or page[...] query parameters.",
          path: ["paths", "/articles", "get", "parameters", "0", "style"],
          severity: DiagnosticSeverity.Error,
        },
      ],
    );
  });

  it("invalid: deepObject page parameter set but no defined properties lay within", async () => {
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
                    properties: {},
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
            "page query parameters must use either deepObject page or page[...] query parameters.",
          path: [
            "paths",
            "/articles",
            "get",
            "parameters",
            "0",
            "schema",
            "properties",
          ],
          severity: DiagnosticSeverity.Error,
        },
      ],
    );
  });

  it("valid: deepObject page parameter passes when it has properties", async () => {
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

  it("valid: any page[] parameters pass", async () => {
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
                  name: "page[size]",
                  in: "query",
                  required: false,
                  schema: {
                    type: "integer",
                  },
                },
                {
                  name: "page[anything]",
                  in: "query",
                  required: false,
                  schema: {
                    type: "integer",
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

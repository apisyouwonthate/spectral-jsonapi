import { DiagnosticSeverity } from "@stoplight/types";
import { createWithRules, expectRuleErrors } from "./__helpers__/helper";
import { openApiBase } from "./__helpers__/fixtures";

describe("Rule post-201-response", () => {
  let spectral = createWithRules(["post-201-response"]);

  beforeEach(() => {
    spectral = createWithRules(["post-201-response"]);
  });

  it("201 response required contains invalid member", async () => {
    const document = {
      ...openApiBase,
      paths: {
        "/articles": {
          post: {
            responses: {
              "201": {
                description: "created",
                content: {
                  "application/vnd.api+json": {
                    schema: {
                      type: "object",
                      properties: {
                        foo: {
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

    await expectRuleErrors(spectral, "post-201-response", document, [
      {
        message: expect.stringContaining(
          "POST 201 responses should include primary resource data",
        ),
        path: [
          "paths",
          "/articles",
          "post",
          "responses",
          "201",
          "content",
          "application/vnd.api+json",
          "schema",
        ],
        severity: DiagnosticSeverity.Information,
      },
    ]);
  });

  it("valid post-201-response case", async () => {
    const document = {
      ...openApiBase,
      paths: {
        "/articles": {
          post: {
            responses: {
              "201": {
                description: "created",
                content: {
                  "application/vnd.api+json": {
                    schema: {
                      type: "object",
                      required: ["data"],
                      properties: {
                        data: {
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

    await expectRuleErrors(spectral, "post-201-response", document, []);
  });
});

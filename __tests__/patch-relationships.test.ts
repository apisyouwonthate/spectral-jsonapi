import { DiagnosticSeverity } from "@stoplight/types";
import { createWithRules, expectRuleErrors } from "./__helpers__/helper";
import { openApiBase } from "./__helpers__/fixtures";

describe("Rule patch-relationships", () => {
  let spectral = createWithRules(["patch-relationships"]);

  beforeEach(() => {
    spectral = createWithRules(["patch-relationships"]);
  });

  it("patch relationship required contains invalid member", async () => {
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
                        properties: {
                          type: {
                            type: "string",
                          },
                          relationships: {
                            type: "object",
                            properties: {
                              author: {
                                type: "object",
                                required: ["foo"],
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

    await expectRuleErrors(spectral, "patch-relationships", document, [
      {
        message: "If PATCH relationships are present, they must include data.",
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
          "properties",
          "relationships",
          "properties",
          "author",
          "required",
          "0",
        ],
        severity: DiagnosticSeverity.Error,
      },
    ]);
  });

  it("valid patch-relationships case", async () => {
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
                        properties: {
                          type: {
                            type: "string",
                          },
                          relationships: {
                            type: "object",
                            properties: {
                              author: {
                                type: "object",
                                required: ["data"],
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

    await expectRuleErrors(spectral, "patch-relationships", document, []);
  });
});

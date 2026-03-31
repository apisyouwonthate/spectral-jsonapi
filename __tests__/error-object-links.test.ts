import { DiagnosticSeverity } from "@stoplight/types";
import { createWithRules, expectRuleErrors } from "./__helpers__/helper";
import { openApiBase } from "./__helpers__/fixtures";

describe("Rule error-object-links", () => {
  let spectral = createWithRules(["error-object-links"]);

  beforeEach(() => {
    spectral = createWithRules(["error-object-links"]);
  });

  it("error links lacks about link", async () => {
    const document = {
      ...openApiBase,
      paths: {
        "/articles": {
          get: {
            responses: {
              "400": {
                description: "bad request",
                content: {
                  "application/vnd.api+json": {
                    schema: {
                      type: "object",
                      properties: {
                        errors: {
                          type: "array",
                          items: {
                            type: "object",
                            properties: {
                              links: {
                                type: "object",
                                properties: {
                                  self: {
                                    type: "string",
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
          },
        },
      },
    };

    await expectRuleErrors(spectral, "error-object-links", document, [
      {
        message: "Error object links must include about.",
        path: [
          "paths",
          "/articles",
          "get",
          "responses",
          "400",
          "content",
          "application/vnd.api+json",
          "schema",
          "properties",
          "errors",
          "items",
          "properties",
          "links",
          "properties",
        ],
        severity: DiagnosticSeverity.Error,
      },
    ]);
  });

  it("valid error-object-links case", async () => {
    const document = {
      ...openApiBase,
      paths: {
        "/articles": {
          get: {
            responses: {
              "400": {
                description: "bad request",
                content: {
                  "application/vnd.api+json": {
                    schema: {
                      type: "object",
                      properties: {
                        errors: {
                          type: "array",
                          items: {
                            type: "object",
                            properties: {
                              links: {
                                type: "object",
                                properties: {
                                  // self: {
                                  //   type: "string",
                                  // },
                                  about: {
                                    type: "string",
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
          },
        },
      },
    };

    await expectRuleErrors(spectral, "error-object-links", document, []);
  });
});

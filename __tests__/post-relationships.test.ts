import { DiagnosticSeverity } from "@stoplight/types";
import { createWithRules, expectRuleErrors } from "./__helpers__/helper";
import { openApiBase } from "./__helpers__/fixtures";

describe("Rule post-relationships", () => {
  let spectral = createWithRules(["post-relationships"]);

  beforeEach(() => {
    spectral = createWithRules(["post-relationships"]);
  });

  it("post relationship required contains invalid member", async () => {
    const document = {
      ...openApiBase,
      paths: {
        "/articles": {
          post: {
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
              "201": {
                description: "created",
              },
            },
          },
        },
      },
    };

    await expectRuleErrors(spectral, "post-relationships", document, [
      {
        message: "If POST relationships are present, they must include data.",
        path: [
          "paths",
          "/articles",
          "post",
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

  it("valid post-relationships case", async () => {
    const document = {
      ...openApiBase,
      paths: {
        "/articles": {
          post: {
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
              "201": {
                description: "created",
              },
            },
          },
        },
      },
    };

    await expectRuleErrors(spectral, "post-relationships", document, []);
  });
});

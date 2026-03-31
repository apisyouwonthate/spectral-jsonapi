import { DiagnosticSeverity } from "@stoplight/types";
import { createWithRules, expectRuleErrors } from "./__helpers__/helper";
import { openApiBase } from "./__helpers__/fixtures";

describe("Rule resource-object-properties", () => {
  let spectral = createWithRules(["resource-object-properties"]);

  beforeEach(() => {
    spectral = createWithRules(["resource-object-properties"]);
  });

  it("resource object includes unknown field", async () => {
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
                      properties: {
                        data: {
                          type: "object",
                          properties: {
                            id: {
                              type: "string",
                            },
                            type: {
                              type: "string",
                            },
                            name: {
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
    };

    await expectRuleErrors(spectral, "resource-object-properties", document, [
      {
        message:
          "Resource objects may only use id, type, attributes, relationships, links, and meta.",
        path: [
          "paths",
          "/articles/{id}",
          "get",
          "responses",
          "200",
          "content",
          "application/vnd.api+json",
          "schema",
          "properties",
          "data",
          "properties",
          "name",
        ],
        severity: DiagnosticSeverity.Error,
      },
    ]);
  });

  it("valid resource-object-properties case", async () => {
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
                      properties: {
                        data: {
                          type: "object",
                          properties: {
                            id: {
                              type: "string",
                            },
                            type: {
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
    };

    await expectRuleErrors(
      spectral,
      "resource-object-properties",
      document,
      [],
    );
  });
});

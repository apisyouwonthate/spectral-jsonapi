import { DiagnosticSeverity } from "@stoplight/types";
import { createWithRules, expectRuleErrors } from "./__helpers__/helper";
import { openApiBase } from "./__helpers__/fixtures";

describe("Rule attributes-object-properties", () => {
  let spectral = createWithRules(["attributes-object-properties"]);

  beforeEach(() => {
    spectral = createWithRules(["attributes-object-properties"]);
  });

  it("attributes declares links property", async () => {
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
                            type: {
                              type: "string",
                            },
                            attributes: {
                              type: "object",
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
        },
      },
    };

    await expectRuleErrors(spectral, "attributes-object-properties", document, [
      {
        message: "attributes must not contain links or relationships.",
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
          "attributes",
          "properties",
          "links",
        ],
        severity: DiagnosticSeverity.Error,
      },
    ]);
  });

  it("valid attributes-object-properties case", async () => {
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
                            type: {
                              type: "string",
                            },
                            attributes: {
                              type: "object",
                              properties: {},
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
      "attributes-object-properties",
      document,
      [],
    );
  });
});

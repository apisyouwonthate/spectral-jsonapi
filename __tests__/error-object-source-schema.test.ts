import { DiagnosticSeverity } from "@stoplight/types";
import { createWithRules, expectRuleErrors } from "./__helpers__/helper";
import { openApiBase } from "./__helpers__/fixtures";

describe("Rule error-object-source-schema", () => {
  let spectral = createWithRules(["error-object-source-schema"]);

  beforeEach(() => {
    spectral = createWithRules(["error-object-source-schema"]);
  });

  it("error source pointer misses json-pointer format", async () => {
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
                              source: {
                                type: "object",
                                properties: {
                                  pointer: {
                                    oneOf: [
                                      {
                                        type: "string",
                                      },
                                    ],
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

    await expectRuleErrors(spectral, "error-object-source-schema", document, [
      {
        message:
          "Error object source must include pointer or parameter and match schema.",
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
          "source",
          "properties",
          "pointer",
          "oneOf",
          "0",
        ],
        severity: DiagnosticSeverity.Error,
      },
      {
        message:
          "Error object source must include pointer or parameter and match schema.",
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
          "source",
          "properties",
          "pointer",
          "oneOf",
          "0",
          "type",
        ],
        severity: DiagnosticSeverity.Error,
      },
    ]);
  });

  it("valid error-object-source-schema case", async () => {
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
                              source: {
                                type: "object",
                                properties: {
                                  pointer: {
                                    oneOf: [
                                      {
                                        type: "string",
                                        format: "json-pointer",
                                      },
                                    ],
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

    await expectRuleErrors(
      spectral,
      "error-object-source-schema",
      document,
      [],
    );
  });
});

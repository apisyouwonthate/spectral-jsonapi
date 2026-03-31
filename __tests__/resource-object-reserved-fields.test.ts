import { DiagnosticSeverity } from "@stoplight/types";
import { createWithRules, expectRuleErrors } from "./__helpers__/helper";
import { openApiBase } from "./__helpers__/fixtures";

describe("Rule resource-object-reserved-fields", () => {
  let spectral = createWithRules(["resource-object-reserved-fields"]);

  beforeEach(() => {
    spectral = createWithRules(["resource-object-reserved-fields"]);
  });

  it("attributes contains reserved id", async () => {
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
                            attributes: {
                              type: "object",
                              properties: {
                                id: {
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
    };

    await expectRuleErrors(
      spectral,
      "resource-object-reserved-fields",
      document,
      [
        {
          message:
            "Do not define id or type inside attributes or relationships.",
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
            "id",
          ],
          severity: DiagnosticSeverity.Error,
        },
      ],
    );
  });

  it("valid resource-object-reserved-fields case", async () => {
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
      "resource-object-reserved-fields",
      document,
      [],
    );
  });

  it("ignores deprecated reserved fields in attributes and relationships", async () => {
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
                            attributes: {
                              type: "object",
                              properties: {
                                id: {
                                  type: "string",
                                  deprecated: true,
                                },
                              },
                            },
                            relationships: {
                              type: "object",
                              properties: {
                                type: {
                                  type: "object",
                                  deprecated: true,
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
      "resource-object-reserved-fields",
      document,
      [],
    );
  });

  it("still reports reserved fields when deprecated is false", async () => {
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
                            attributes: {
                              type: "object",
                              properties: {
                                id: {
                                  type: "string",
                                  deprecated: false,
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
      "resource-object-reserved-fields",
      document,
      [
        {
          message:
            "Do not define id or type inside attributes or relationships.",
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
            "id",
          ],
          severity: DiagnosticSeverity.Error,
        },
      ],
    );
  });
});

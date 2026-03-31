import { DiagnosticSeverity } from "@stoplight/types";
import { createWithRules, expectRuleErrors } from "./__helpers__/helper";
import { openApiBase } from "./__helpers__/fixtures";

const sharedRelationshipSchemas = {
  BaseModel: {
    type: "object",
    properties: {
      id: {
        type: "string",
      },
    },
  },
  Link: {
    type: "object",
  },
  RelationshipPlural: {
    title: "Relationship Plural",
    type: "object",
    properties: {
      data: {
        type: "array",
        items: {
          type: "object",
          properties: {
            type: {
              type: "string",
            },
            id: {
              type: "string",
            },
          },
        },
      },
      links: {
        type: "object",
        properties: {
          self: {
            $ref: "#/components/schemas/Link",
          },
          related: {
            $ref: "#/components/schemas/Link",
          },
        },
      },
    },
  },
};

const componentResponseDocument = (
  schemaName: string,
  schemas: Record<string, unknown>,
) => ({
  openapi: "3.1.0",
  info: {
    title: "Test",
    version: "1.0.0",
  },
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
                      $ref: `#/components/schemas/${schemaName}`,
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
  components: {
    schemas,
  },
});

describe("Rule relationship-data-schema", () => {
  let spectral = createWithRules(["relationship-data-schema"]);

  beforeEach(() => {
    spectral = createWithRules(["relationship-data-schema"]);
  });

  it("relationship data id is not string", async () => {
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
                            relationships: {
                              type: "object",
                              properties: {
                                author: {
                                  type: "object",
                                  properties: {
                                    data: {
                                      type: "object",
                                      properties: {
                                        id: {
                                          type: "integer",
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
                },
              },
            },
          },
        },
      },
    };

    await expectRuleErrors(spectral, "relationship-data-schema", document, [
      {
        message:
          "Relationship data entries must match the resource identifier schema.",
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
          "relationships",
          "properties",
          "author",
          "properties",
          "data",
          "properties",
        ],
        severity: DiagnosticSeverity.Error,
      },
      {
        message:
          "Relationship data entries must match the resource identifier schema.",
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
          "relationships",
          "properties",
          "author",
          "properties",
          "data",
          "properties",
          "id",
          "type",
        ],
        severity: DiagnosticSeverity.Error,
      },
      {
        message:
          "Relationship data entries must match the resource identifier schema.",
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
          "relationships",
          "properties",
          "author",
          "properties",
          "data",
          "properties",
          "type",
        ],
        severity: DiagnosticSeverity.Error,
      },
    ]);
  });

  it("valid relationship-data-schema case", async () => {
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
                            relationships: {
                              type: "object",
                              properties: {
                                author: {
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
                },
              },
            },
          },
        },
      },
    };

    await expectRuleErrors(spectral, "relationship-data-schema", document, []);
  });

  it("valid: allOf relationship data narrowed in second member", async () => {
    await expectRuleErrors(
      spectral,
      "relationship-data-schema",
      componentResponseDocument("IncludedQuestionnaire", {
        ...sharedRelationshipSchemas,
        IncludedQuestionnaire: {
          allOf: [
            {
              $ref: "#/components/schemas/BaseModel",
            },
            {
              type: "object",
              properties: {
                type: {
                  type: "string",
                  enum: ["questionnaire"],
                },
                relationships: {
                  type: "object",
                  properties: {
                    sections: {
                      allOf: [
                        {
                          $ref: "#/components/schemas/RelationshipPlural",
                        },
                        {
                          type: "object",
                          properties: {
                            data: {
                              type: "array",
                              items: {
                                type: "object",
                                properties: {
                                  type: {
                                    type: "string",
                                    enum: ["questionnaire_section"],
                                  },
                                },
                              },
                            },
                          },
                        },
                      ],
                    },
                  },
                },
              },
            },
          ],
        },
      }),
      [],
    );
  });
});

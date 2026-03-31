import { DiagnosticSeverity } from "@stoplight/types";
import { createWithRules, expectRuleErrors } from "./__helpers__/helper";
import { asResponseDoc } from "./__helpers__/fixtures";

const documentTemplate = (relationshipsSchema: any) =>
  asResponseDoc({
    type: "object",
    properties: {
      data: {
        type: "object",
        properties: {
          type: { type: "string" },
          relationships: relationshipsSchema,
        },
      },
    },
  });

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
  RelationshipSingular: {
    title: "Relationship Singular",
    type: "object",
    properties: {
      data: {
        oneOf: [
          {
            type: "object",
            properties: {
              type: {
                type: "string",
              },
              id: {
                type: "string",
              },
            },
            required: ["type", "id"],
          },
          {
            type: "null",
          },
        ],
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
  ...asResponseDoc({
    type: "object",
    properties: {
      data: {
        $ref: `#/components/schemas/${schemaName}`,
      },
    },
  }),
  components: {
    schemas,
  },
});

describe("Rule relationship-schema", () => {
  let spectral = createWithRules(["relationship-schema"]);

  beforeEach(() => {
    spectral = createWithRules(["relationship-schema"]);
  });

  it("valid: relationship that only has links.related passes", async () => {
    await expectRuleErrors(
      spectral,
      "relationship-schema",
      documentTemplate({
        type: "object",
        properties: {
          comments: {
            type: "object",
            properties: {
              links: {
                type: "object",
                properties: {
                  related: { type: "object" },
                },
              },
            },
          },
        },
      }),
      [],
    );
  });

  it("valid: having both links and data works even when using allOf", async () => {
    await expectRuleErrors(
      spectral,
      "relationship-schema",
      {
        ...documentTemplate({
          comments: {
            allOf: [
              {
                $ref: "#/components/schemas/RelationshipPlural",
              },
              {
                type: "object",
                properties: {
                  data2: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        type: {
                          type: "string",
                          const: "people",
                        },
                      },
                    },
                  },
                },
              },
            ],
          },
        }),
        components: {
          schemas: {
            RelationshipPlural: {
              type: "object",
              properties: {
                links: {
                  type: "object",
                  properties: {},
                },
              },
            },
          },
        },
      },
      [],
    );
  });

  it("invalid: relationship entry missing links data and meta", async () => {
    await expectRuleErrors(
      spectral,
      "relationship-schema",
      documentTemplate({
        type: "object",
        properties: {
          author: {
            type: "object",
            properties: {},
          },
        },
      }),
      [
        {
          message:
            "Each relationship object must include links, data, or meta, and match JSON:API structure.",
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
          ],
          severity: DiagnosticSeverity.Error,
        },
        {
          message:
            "Each relationship object must include links, data, or meta, and match JSON:API structure.",
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
          ],
          severity: DiagnosticSeverity.Error,
        },
      ],
    );
  });

  it("invalid: relationship entry with link data but no meta", async () => {
    await expectRuleErrors(
      spectral,
      "relationship-schema",
      documentTemplate({
        type: "object",
        properties: {
          author: {
            type: "object",
            properties: {
              links: {
                type: "object",
                properties: {
                  href: { type: "string" },
                },
              },
            },
          },
        },
      }),
      [
        {
          message:
            "Each relationship object must include links, data, or meta, and match JSON:API structure.",
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
          ],
          severity: DiagnosticSeverity.Error,
        },
        {
          message:
            "Each relationship object must include links, data, or meta, and match JSON:API structure.",
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
            "links",
            "properties",
          ],
          severity: DiagnosticSeverity.Error,
        },
      ],
    );
  });

  it("valid: real PortalListing relationship composed with allOf is not flagged", async () => {
    await expectRuleErrors(
      spectral,
      "relationship-schema",
      componentResponseDocument("PortalListing", {
        ...sharedRelationshipSchemas,
        PortalListing: {
          allOf: [
            {
              $ref: "#/components/schemas/BaseModel",
            },
            {
              type: "object",
              properties: {
                type: {
                  type: "string",
                  enum: ["portal_listing"],
                },
                relationships: {
                  type: "object",
                  properties: {
                    portal: {
                      allOf: [
                        {
                          $ref: "#/components/schemas/RelationshipSingular",
                        },
                        {
                          type: "object",
                          properties: {
                            data: {
                              type: ["object", "null"],
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

  it("valid: real IncludedQuestionnaire plural relationship composed with allOf is not flagged", async () => {
    await expectRuleErrors(
      spectral,
      "relationship-schema",
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

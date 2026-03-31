import { DiagnosticSeverity } from "@stoplight/types";
import { createWithRules, expectRuleErrors } from "./__helpers__/helper";
import { openApiBase } from "./__helpers__/fixtures";

describe("Rule links-object-schema-properties", () => {
  let spectral = createWithRules(["links-object-schema-properties"]);

  beforeEach(() => {
    spectral = createWithRules(["links-object-schema-properties"]);
  });

  it("link object uses url field instead of href", async () => {
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
                        links: {
                          type: "object",
                          properties: {
                            self: {
                              type: "object",
                              properties: {
                                url: {
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
      "links-object-schema-properties",
      document,
      [
        {
          message:
            "Link objects may only contain href and meta, and must include href.",
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
            "links",
            "properties",
            "self",
            "properties",
          ],
          severity: DiagnosticSeverity.Error,
        },
        {
          message:
            "Link objects may only contain href and meta, and must include href.",
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
            "links",
            "properties",
            "self",
            "properties",
            "url",
          ],
          severity: DiagnosticSeverity.Error,
        },
      ],
    );
  });

  it("valid links-object-schema-properties case", async () => {
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
                        links: {
                          type: "object",
                          properties: {
                            self: {
                              type: "object",
                              properties: {
                                href: {
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
      "links-object-schema-properties",
      document,
      [],
    );
  });
});

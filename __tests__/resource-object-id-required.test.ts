import { DiagnosticSeverity } from "@stoplight/types";
import { createWithRules, expectRuleErrors } from "./__helpers__/helper";
import { openApiBase } from "./__helpers__/fixtures";

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

const componentCollectionResponseDocument = (
  schemaName: string,
  schemas: Record<string, unknown>,
) => ({
  openapi: "3.1.0",
  info: {
    title: "Test",
    version: "1.0.0",
  },
  paths: {
    "/articles": {
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
                      type: "array",
                      items: {
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
  },
  components: {
    schemas,
  },
});

describe("Rule resource-object-id-required", () => {
  let spectral = createWithRules(["resource-object-id-required"]);

  beforeEach(() => {
    spectral = createWithRules(["resource-object-id-required"]);
  });

  it("resource object omits id", async () => {
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

    await expectRuleErrors(spectral, "resource-object-id-required", document, [
      {
        message: "Resource objects should include an id property.",
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
        ],
        severity: DiagnosticSeverity.Warning,
      },
    ]);
  });

  it("valid resource-object-id-required case", async () => {
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
      "resource-object-id-required",
      document,
      [],
    );
  });

  it("valid: id provided by allOf base schema", async () => {
    await expectRuleErrors(
      spectral,
      "resource-object-id-required",
      componentResponseDocument("Applicant", {
        BaseModel: {
          type: "object",
          properties: {
            id: {
              type: "string",
            },
          },
        },
        Applicant: {
          allOf: [
            {
              $ref: "#/components/schemas/BaseModel",
            },
            {
              type: "object",
              properties: {
                type: {
                  type: "string",
                  enum: ["applicant"],
                },
              },
            },
          ],
        },
      }),
      [],
    );
  });

  it("valid: allOf with only a $ref when base schema provides id", async () => {
    await expectRuleErrors(
      spectral,
      "resource-object-id-required",
      componentResponseDocument("Media", {
        BaseModel: {
          type: "object",
          properties: {
            id: {
              type: "string",
            },
          },
        },
        Media: {
          title: "Media",
          allOf: [
            {
              $ref: "#/components/schemas/BaseModel",
            },
          ],
        },
      }),
      [],
    );
  });

  it("invalid: response resource object missing id", async () => {
    await expectRuleErrors(
      spectral,
      "resource-object-id-required",
      componentResponseDocument("MissingId", {
        MissingId: {
          type: "object",
          properties: {
            type: {
              type: "string",
              enum: ["missing_id"],
            },
          },
        },
      }),
      [
        {
          message: "Resource objects should include an id property.",
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
          ],
          severity: DiagnosticSeverity.Warning,
        },
      ],
    );
  });

  it("invalid: collection item component missing id like Street virtual resources", async () => {
    await expectRuleErrors(
      spectral,
      "resource-object-id-required",
      componentCollectionResponseDocument("AvailableSlotResource", {
        AvailableSlotAttributes: {
          type: "object",
          properties: {
            start_time: {
              type: "string",
              format: "date-time",
            },
          },
        },
        AvailableSlotResource: {
          type: "object",
          required: ["type", "attributes"],
          properties: {
            type: {
              type: "string",
              enum: ["availableSlot"],
            },
            attributes: {
              $ref: "#/components/schemas/AvailableSlotAttributes",
            },
          },
        },
      }),
      [
        {
          message: "Resource objects should include an id property.",
          path: [
            "paths",
            "/articles",
            "get",
            "responses",
            "200",
            "content",
            "application/vnd.api+json",
            "schema",
            "properties",
            "data",
            "items",
          ],
          severity: DiagnosticSeverity.Warning,
        },
      ],
    );
  });

  it("valid: collection item component with id passes", async () => {
    await expectRuleErrors(
      spectral,
      "resource-object-id-required",
      componentCollectionResponseDocument("CalendarEventResource", {
        CalendarEventAttributes: {
          type: "object",
          properties: {
            event_start: {
              type: "string",
              format: "date-time",
            },
          },
        },
        CalendarEventResource: {
          type: "object",
          required: ["id", "type", "attributes"],
          properties: {
            id: {
              type: "string",
            },
            type: {
              type: "string",
              enum: ["calendarEvent"],
            },
            attributes: {
              $ref: "#/components/schemas/CalendarEventAttributes",
            },
          },
        },
      }),
      [],
    );
  });

  it("valid: opt-out with x-jsonapi-virtual-resource for collection item component", async () => {
    await expectRuleErrors(
      spectral,
      "resource-object-id-required",
      componentCollectionResponseDocument("AvailableSlotResource", {
        AvailableSlotAttributes: {
          type: "object",
          properties: {
            start_time: {
              type: "string",
              format: "date-time",
            },
          },
        },
        AvailableSlotResource: {
          type: "object",
          "x-jsonapi-virtual-resource": true,
          required: ["type", "attributes"],
          properties: {
            type: {
              type: "string",
              enum: ["availableSlot"],
            },
            attributes: {
              $ref: "#/components/schemas/AvailableSlotAttributes",
            },
          },
        },
      }),
      [],
    );
  });

  it("invalid: x-jsonapi-virtual-resource false does not opt out", async () => {
    await expectRuleErrors(
      spectral,
      "resource-object-id-required",
      componentCollectionResponseDocument("AvailableSlotResource", {
        AvailableSlotAttributes: {
          type: "object",
          properties: {
            start_time: {
              type: "string",
              format: "date-time",
            },
          },
        },
        AvailableSlotResource: {
          type: "object",
          "x-jsonapi-virtual-resource": false,
          required: ["type", "attributes"],
          properties: {
            type: {
              type: "string",
              enum: ["availableSlot"],
            },
            attributes: {
              $ref: "#/components/schemas/AvailableSlotAttributes",
            },
          },
        },
      }),
      [
        {
          message: "Resource objects should include an id property.",
          path: [
            "paths",
            "/articles",
            "get",
            "responses",
            "200",
            "content",
            "application/vnd.api+json",
            "schema",
            "properties",
            "data",
            "items",
            "x-jsonapi-virtual-resource",
          ],
          severity: DiagnosticSeverity.Warning,
        },
      ],
    );
  });

  it("valid: included anyOf refs with id-bearing resource objects", async () => {
    await expectRuleErrors(
      spectral,
      "resource-object-id-required",
      {
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
                            type: "object",
                            properties: {
                              id: {
                                type: "string",
                              },
                            },
                          },
                          included: {
                            type: "array",
                            items: {
                              anyOf: [
                                {
                                  $ref: "#/components/schemas/IncludedA",
                                },
                                {
                                  $ref: "#/components/schemas/IncludedB",
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
        components: {
          schemas: {
            BaseModel: {
              type: "object",
              properties: {
                id: {
                  type: "string",
                },
              },
            },
            IncludedA: {
              allOf: [
                {
                  $ref: "#/components/schemas/BaseModel",
                },
                {
                  type: "object",
                  properties: {
                    type: {
                      type: "string",
                      enum: ["included_a"],
                    },
                  },
                },
              ],
            },
            IncludedB: {
              allOf: [
                {
                  $ref: "#/components/schemas/BaseModel",
                },
                {
                  type: "object",
                  properties: {
                    type: {
                      type: "string",
                      enum: ["included_b"],
                    },
                  },
                },
              ],
            },
          },
        },
      },
      [],
    );
  });

  it("valid: collection items anyOf with single $ref to composed schema", async () => {
    await expectRuleErrors(
      spectral,
      "resource-object-id-required",
      {
        openapi: "3.1.0",
        info: {
          title: "Test",
          version: "1.0.0",
        },
        paths: {
          "/properties": {
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
                            type: "array",
                            items: {
                              anyOf: [
                                {
                                  $ref: "#/components/schemas/Media",
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
        components: {
          schemas: {
            BaseModel: {
              type: "object",
              properties: {
                id: {
                  type: "string",
                },
              },
            },
            Media: {
              allOf: [
                {
                  $ref: "#/components/schemas/BaseModel",
                },
              ],
            },
          },
        },
      },
      [],
    );
  });
});

import { DiagnosticSeverity } from "@stoplight/types";
import testRule from "./__helpers__/helper";

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

const invalidDocument = {
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

const validDocument = structuredClone(invalidDocument);
validDocument.paths["/articles/{id}"].get.responses["200"].content[
  "application/vnd.api+json"
].schema.properties.data.properties.id = {
  type: "string",
};

testRule("resource-object-id-required", [
  {
    name: "resource object omits id",
    document: invalidDocument,
    errors: [
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
          "properties",
        ],
        severity: DiagnosticSeverity.Warning,
      },
    ],
  },
  {
    name: "valid resource-object-id-required case",
    document: validDocument,
    errors: [],
  },
  {
    name: "valid: id provided by allOf base schema",
    document: componentResponseDocument("Applicant", {
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
    errors: [],
  },
  {
    name: "invalid: response resource object missing id",
    document: componentResponseDocument("MissingId", {
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
    errors: [
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
          "properties",
        ],
        severity: DiagnosticSeverity.Warning,
      },
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
  },
  {
    name: "valid: included anyOf refs with id-bearing resource objects",
    document: {
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
    errors: [],
  },
]);

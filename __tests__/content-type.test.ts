import { DiagnosticSeverity } from "@stoplight/types";
import { createWithRules, expectRuleErrors } from "./__helpers__/helper";

describe("Rule content-type", () => {
  let spectral = createWithRules(["content-type"]);

  beforeEach(() => {
    spectral = createWithRules(["content-type"]);
  });

  it("valid content type", async () => {
    await expectRuleErrors(
      spectral,
      "content-type",
      {
        openapi: "3.1.0",
        info: { title: "Test", version: "1.0.0" },
        paths: {
          "/items": {
            get: {
              responses: {
                "200": {
                  description: "ok",
                  content: {
                    "application/vnd.api+json": {
                      schema: {},
                    },
                  },
                },
              },
            },
          },
        },
      },
      [],
    );
  });

  it("content type with parameters", async () => {
    await expectRuleErrors(
      spectral,
      "content-type",
      {
        openapi: "3.1.0",
        info: { title: "Test", version: "1.0.0" },
        paths: {
          "/items": {
            get: {
              responses: {
                "200": {
                  description: "ok",
                  content: {
                    "application/vnd.api+json; ext=example": {
                      schema: {},
                    },
                  },
                },
              },
            },
          },
        },
      },
      [],
    );
  });

  it("allows non-json content type", async () => {
    await expectRuleErrors(
      spectral,
      "content-type",
      {
        openapi: "3.1.0",
        info: { title: "Test", version: "1.0.0" },
        paths: {
          "/items": {
            get: {
              responses: {
                "200": {
                  description: "ok",
                  content: {
                    "text/html": {
                      schema: { type: "string" },
                    },
                  },
                },
              },
            },
          },
        },
      },
      [],
    );
  });

  it("invalid content type", async () => {
    await expectRuleErrors(
      spectral,
      "content-type",
      {
        openapi: "3.1.0",
        info: { title: "Test", version: "1.0.0" },
        paths: {
          "/items": {
            get: {
              responses: {
                "200": {
                  description: "ok",
                  content: {
                    "application/json": {
                      schema: { type: "object" },
                    },
                  },
                },
              },
            },
          },
        },
      },
      [
        {
          message:
            "Use application/vnd.api+json for JSON request and response bodies.",
          path: [
            "paths",
            "/items",
            "get",
            "responses",
            "200",
            "content",
            "application/json",
          ],
          severity: DiagnosticSeverity.Error,
        },
      ],
    );
  });

  it("invalid +json content type", async () => {
    await expectRuleErrors(
      spectral,
      "content-type",
      {
        openapi: "3.1.0",
        info: { title: "Test", version: "1.0.0" },
        paths: {
          "/items": {
            get: {
              responses: {
                "200": {
                  description: "ok",
                  content: {
                    "application/problem+json": {
                      schema: { type: "object" },
                    },
                  },
                },
              },
            },
          },
        },
      },
      [
        {
          message:
            "Use application/vnd.api+json for JSON request and response bodies.",
          path: [
            "paths",
            "/items",
            "get",
            "responses",
            "200",
            "content",
            "application/problem+json",
          ],
          severity: DiagnosticSeverity.Error,
        },
      ],
    );
  });
});

import { DiagnosticSeverity } from "@stoplight/types";
import { createWithRules, expectRuleErrors } from "./__helpers__/helper";
import { openApiBase } from "./__helpers__/fixtures";

describe("Rule 403-response-code", () => {
  let spectral = createWithRules(["403-response-code"]);

  beforeEach(() => {
    spectral = createWithRules(["403-response-code"]);
  });

  it("missing 403 response", async () => {
    const document = {
      ...openApiBase,
      paths: {
        "/articles": {
          get: {
            responses: {
              "200": {
                description: "ok",
              },
            },
          },
        },
      },
    };

    await expectRuleErrors(spectral, "403-response-code", document, [
      {
        message: "Document a 403 response for every operation.",
        path: ["paths", "/articles", "get", "responses"],
        severity: DiagnosticSeverity.Error,
      },
    ]);
  });

  it("valid 403-response-code case", async () => {
    const document = {
      ...openApiBase,
      paths: {
        "/articles": {
          get: {
            responses: {
              "200": {
                description: "ok",
              },
              "403": {
                description: "forbidden",
              },
            },
          },
        },
      },
    };

    await expectRuleErrors(spectral, "403-response-code", document, []);
  });
});

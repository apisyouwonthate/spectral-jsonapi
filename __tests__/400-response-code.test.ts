import { DiagnosticSeverity } from "@stoplight/types";
import { createWithRules, expectRuleErrors } from "./__helpers__/helper";
import { openApiBase } from "./__helpers__/fixtures";

describe("Rule 400-response-code", () => {
  let spectral = createWithRules(["400-response-code"]);

  beforeEach(() => {
    spectral = createWithRules(["400-response-code"]);
  });

  it("missing 400 response", async () => {
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

    await expectRuleErrors(spectral, "400-response-code", document, [
      {
        message: "Document a 400 response for every operation.",
        path: ["paths", "/articles", "get", "responses"],
        severity: DiagnosticSeverity.Error,
      },
    ]);
  });

  it("valid 400-response-code case", async () => {
    const document = {
      ...openApiBase,
      paths: {
        "/articles": {
          get: {
            responses: {
              "200": {
                description: "ok",
              },
              "400": {
                description: "bad request",
              },
            },
          },
        },
      },
    };

    await expectRuleErrors(spectral, "400-response-code", document, []);
  });
});

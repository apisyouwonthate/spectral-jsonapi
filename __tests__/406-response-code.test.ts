import { DiagnosticSeverity } from "@stoplight/types";
import { createWithRules, expectRuleErrors } from "./__helpers__/helper";
import { openApiBase } from "./__helpers__/fixtures";

describe("Rule 406-response-code", () => {
  let spectral = createWithRules(["406-response-code"]);

  beforeEach(() => {
    spectral = createWithRules(["406-response-code"]);
  });

  it("missing 406 response", async () => {
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

    await expectRuleErrors(spectral, "406-response-code", document, [
      {
        message: "Document a 406 response for invalid Accept headers.",
        path: ["paths", "/articles", "get", "responses"],
        severity: DiagnosticSeverity.Error,
      },
    ]);
  });

  it("valid 406-response-code case", async () => {
    const document = {
      ...openApiBase,
      paths: {
        "/articles": {
          get: {
            responses: {
              "200": {
                description: "ok",
              },
              "406": {
                description: "not acceptable",
              },
            },
          },
        },
      },
    };

    await expectRuleErrors(spectral, "406-response-code", document, []);
  });
});

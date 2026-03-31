import { DiagnosticSeverity } from "@stoplight/types";
import { createWithRules, expectRuleErrors } from "./__helpers__/helper";

describe("Rule get-200-response-code", () => {
  let spectral = createWithRules(["get-200-response-code"]);

  beforeEach(() => {
    spectral = createWithRules(["get-200-response-code"]);
  });

  it("valid get includes 200", async () => {
    await expectRuleErrors(
      spectral,
      "get-200-response-code",
      {
        openapi: "3.1.0",
        info: { title: "Test", version: "1.0.0" },
        paths: {
          "/tickets/{id}": {
            get: {
              responses: {
                "200": { description: "ok" },
                "404": { description: "not found" },
              },
            },
          },
        },
      },
      [],
    );
  });

  it("invalid get missing 200", async () => {
    await expectRuleErrors(
      spectral,
      "get-200-response-code",
      {
        openapi: "3.1.0",
        info: { title: "Test", version: "1.0.0" },
        paths: {
          "/tickets/{id}": {
            get: {
              responses: {
                "404": { description: "not found" },
              },
            },
          },
        },
      },
      [
        {
          message: "GET operations must define a 200 response.",
          path: ["paths", "/tickets/{id}", "get", "responses"],
          severity: DiagnosticSeverity.Error,
        },
      ],
    );
  });
});

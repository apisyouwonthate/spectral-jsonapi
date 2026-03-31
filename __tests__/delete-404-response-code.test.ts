import { DiagnosticSeverity } from "@stoplight/types";
import { createWithRules, expectRuleErrors } from "./__helpers__/helper";
import { openApiBase } from "./__helpers__/fixtures";

describe("Rule delete-404-response-code", () => {
  let spectral = createWithRules(["delete-404-response-code"]);

  beforeEach(() => {
    spectral = createWithRules(["delete-404-response-code"]);
  });

  it("delete missing 404 response", async () => {
    const document = {
      ...openApiBase,
      paths: {
        "/articles/{id}": {
          delete: {
            responses: {
              "204": {
                description: "no content",
              },
            },
          },
        },
      },
    };

    await expectRuleErrors(spectral, "delete-404-response-code", document, [
      {
        message: "DELETE operations must define a 404 response.",
        path: ["paths", "/articles/{id}", "delete", "responses"],
        severity: DiagnosticSeverity.Error,
      },
    ]);
  });

  it("valid delete-404-response-code case", async () => {
    const document = {
      ...openApiBase,
      paths: {
        "/articles/{id}": {
          delete: {
            responses: {
              "204": {
                description: "no content",
              },
              "404": {
                description: "not found",
              },
            },
          },
        },
      },
    };

    await expectRuleErrors(spectral, "delete-404-response-code", document, []);
  });
});

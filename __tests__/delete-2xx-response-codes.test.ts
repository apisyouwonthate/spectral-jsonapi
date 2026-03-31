import { DiagnosticSeverity } from "@stoplight/types";
import { createWithRules, expectRuleErrors } from "./__helpers__/helper";
import { openApiBase } from "./__helpers__/fixtures";

describe("Rule delete-2xx-response-codes", () => {
  let spectral = createWithRules(["delete-2xx-response-codes"]);

  beforeEach(() => {
    spectral = createWithRules(["delete-2xx-response-codes"]);
  });

  it("delete has no success 2xx response", async () => {
    const document = {
      ...openApiBase,
      paths: {
        "/articles/{id}": {
          delete: {
            responses: {
              "404": {
                description: "not found",
              },
            },
          },
        },
      },
    };

    await expectRuleErrors(spectral, "delete-2xx-response-codes", document, [
      {
        message:
          "DELETE operations must define at least one success response: 200, 202, or 204.",
        path: ["paths", "/articles/{id}", "delete", "responses"],
        severity: DiagnosticSeverity.Error,
      },
    ]);
  });

  it("valid delete-2xx-response-codes case", async () => {
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

    await expectRuleErrors(spectral, "delete-2xx-response-codes", document, []);
  });
});

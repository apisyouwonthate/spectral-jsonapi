import { DiagnosticSeverity } from "@stoplight/types";
import { createWithRules, expectRuleErrors } from "./__helpers__/helper";
import { openApiBase } from "./__helpers__/fixtures";

describe("Rule put-disallowed", () => {
  let spectral = createWithRules(["put-disallowed"]);

  beforeEach(() => {
    spectral = createWithRules(["put-disallowed"]);
  });

  it("put operation is present", async () => {
    const document = {
      ...openApiBase,
      paths: {
        "/articles/{id}": {
          put: {
            responses: {
              "200": {
                description: "ok",
              },
            },
          },
        },
      },
    };

    await expectRuleErrors(spectral, "put-disallowed", document, [
      {
        message: "PUT is not allowed by JSON:API; use PATCH.",
        path: ["paths", "/articles/{id}", "put"],
        severity: DiagnosticSeverity.Error,
      },
    ]);
  });

  it("valid put-disallowed case", async () => {
    const document = {
      ...openApiBase,
      paths: {
        "/articles/{id}": {
          patch: {
            responses: {
              "200": {
                description: "ok",
              },
            },
          },
        },
      },
    };

    await expectRuleErrors(spectral, "put-disallowed", document, []);
  });
});

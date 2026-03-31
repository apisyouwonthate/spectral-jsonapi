import { DiagnosticSeverity } from "@stoplight/types";
import { createWithRules, expectRuleErrors } from "./__helpers__/helper";
import { openApiBase } from "./__helpers__/fixtures";

describe("Rule 415-response-code", () => {
  let spectral = createWithRules(["415-response-code"]);

  beforeEach(() => {
    spectral = createWithRules(["415-response-code"]);
  });

  it("missing 415 on post", async () => {
    const document = {
      ...openApiBase,
      paths: {
        "/articles": {
          post: {
            responses: {
              "201": {
                description: "created",
              },
            },
          },
        },
      },
    };

    await expectRuleErrors(spectral, "415-response-code", document, [
      {
        message:
          "Document a 415 response for invalid Content-Type headers on POST and PATCH.",
        path: ["paths", "/articles", "post", "responses"],
        severity: DiagnosticSeverity.Error,
      },
    ]);
  });

  it("valid 415-response-code case", async () => {
    const document = {
      ...openApiBase,
      paths: {
        "/articles": {
          post: {
            responses: {
              "201": {
                description: "created",
              },
              "415": {
                description: "unsupported media type",
              },
            },
          },
        },
      },
    };

    await expectRuleErrors(spectral, "415-response-code", document, []);
  });
});

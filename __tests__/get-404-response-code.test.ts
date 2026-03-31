import { DiagnosticSeverity } from "@stoplight/types";
import { createWithRules, expectRuleErrors } from "./__helpers__/helper";
import { openApiBase } from "./__helpers__/fixtures";

// TODO make a get-404-response that returns a single response

describe("Rule get-404-response-code", () => {
  let spectral: any;

  beforeEach(() => {
    spectral = createWithRules(["get-404-response-code"]);
  });

  it("will return no error when theres a 404 response", async () => {
    await expectRuleErrors(
      spectral,
      "get-404-response-code",
      {
        ...openApiBase,
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

  it("assumes any URL without a parameter is probably not a single-resource GET so does not need a 404", async () => {
    await expectRuleErrors(
      spectral,
      "get-404-response-code",
      {
        ...openApiBase,
        paths: {
          "/tickets": {
            get: {
              responses: {
                "200": { description: "ok" },
              },
            },
          },
        },
      },
      [],
    );
  });

  it("returns errors when GET is missing 404", async () => {
    await expectRuleErrors(
      spectral,
      "get-404-response-code",
      {
        ...openApiBase,
        paths: {
          "/tickets/{id}": {
            get: {
              responses: {
                "200": { description: "ok" },
              },
            },
          },
        },
      },
      [
        {
          message: "Single-resource GET operations must define a 404 response.",
          path: ["paths", "/tickets/{id}", "get", "responses"],
          severity: DiagnosticSeverity.Error,
        },
      ],
    );
  });
});

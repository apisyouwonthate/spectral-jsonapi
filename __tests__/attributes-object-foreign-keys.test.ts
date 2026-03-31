import { DiagnosticSeverity } from "@stoplight/types";
import { createWithRules, expectRuleErrors } from "./__helpers__/helper";
import { asResponseDoc } from "./__helpers__/fixtures";

const document = (attributes: Record<string, any>) => {
  return asResponseDoc({
    type: "object",
    properties: {
      data: {
        type: "object",
        properties: {
          type: {},
          attributes: {
            type: "object",
            properties: attributes,
          },
        },
      },
    },
  });
};

describe("Rule attributes-object-foreign-keys", () => {
  let spectral = createWithRules(["attributes-object-foreign-keys"]);

  beforeEach(() => {
    spectral = createWithRules(["attributes-object-foreign-keys"]);
  });

  it("invalid: attributes includes foreign key field", async () => {
    await expectRuleErrors(
      spectral,
      "attributes-object-foreign-keys",
      document({
        author_id: { type: "string" },
      }),
      [
        {
          message:
            "attributes should not include *_id foreign keys; model links with relationships.",
          path: [
            "paths",
            "/articles/{id}",
            "get",
            "responses",
            "200",
            "content",
            "application/vnd.api+json",
            "schema",
            "properties",
            "data",
            "properties",
            "attributes",
            "properties",
            "author_id",
          ],
          severity: DiagnosticSeverity.Information,
        },
      ],
    );
  });

  it("valid: snake_case field that is not a foreign key", async () => {
    await expectRuleErrors(
      spectral,
      "attributes-object-foreign-keys",
      document({
        profile_image: { type: "string" },
      }),
      [],
    );
  });

  it("valid: snake_case _id field is not greedy", async () => {
    await expectRuleErrors(
      spectral,
      "attributes-object-foreign-keys",
      document({
        user_idea: { type: "string" },
      }),
      [],
    );
  });
});

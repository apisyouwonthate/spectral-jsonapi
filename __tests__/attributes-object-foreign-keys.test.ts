import { DiagnosticSeverity } from "@stoplight/types";
import testRule from "./__helpers__/helper";
import { asResponseDoc } from "./__helpers__/fixtures";

testRule("attributes-object-foreign-keys", [
  {
    name: "attributes includes foreign key field",
    document: asResponseDoc({
      type: "object",
      properties: {
        data: {
          type: "object",
          properties: {
            type: { type: "string" },
            attributes: {
              type: "object",
              properties: {
                author_id: { type: "string" },
              },
            },
          },
        },
      },
    }),
    errors: [
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
  },
  {
    name: "real-world snake_case field that is not a foreign key",
    document: asResponseDoc({
      type: "object",
      properties: {
        data: {
          type: "object",
          properties: {
            type: { type: "string" },
            attributes: {
              type: "object",
              properties: {
                profile_image: { type: "string" },
              },
            },
          },
        },
      },
    }),
    errors: [],
  },
]);

## [2.1.0](https://github.com/apisyouwonthate/spectral-jsonapi/compare/v2.0.0...v2.1.0) (2026-04-07)

### Changed

- The `content-type` rule now allows other non-JSON content, but still demands all JSON requests/responses use `application/vnd.api+json`.

## [2.0.0](https://github.com/apisyouwonthate/spectral-jsonapi/compare/v2.0.0...v2.1.0) (2026-04-01)

### Added
- Created TypeScript version of the ruleset. YAML still available.
- Test suite now fully tested with Jest.
- New rule `get-404-response-code` to make sure there's a 404 on any GET that can reasonably assumed to be a "single resource". This implementation looks for any URL parameter, so `/tickets` does not need a 404, but `/tickets/{id}` does.
- New `x-jsonapi-virtual-resource` to opt-out of certain functionality when a response schema is intentionally not a standard JSON:API resource object (for example, ephemeral computed resources without stable IDs).

### Changed
- Now supporting JSON:API v1.1 instead of v1.0, with updated documentation links.
- Content type may now start with `application/vnd.api+json` instead of matching entirely. This is to allow for `ext=` media type parameters, `charset=`, etc.
- Rule `resource-object-reserved-fields` will not appear for deprecate properties.

### Removed
- Rule `error-processing` has been removed as behavior did not match what the JSON:API spec was talking about.

### Fixed
- Rule `resource-object-id-required` will now look into an `allOf` to look for `id` instead of failing.
- Rules `relationships-object-type` and `resource-object-id-required` will work on the resolved version of the document to peek through `$ref`.

# Spectral JSON:API Ruleset

![Node.js CI](https://github.com/apisyouwonthate/spectral-jsonapi/workflows/Node.js%20CI/badge.svg)

Automatically check if OpenAPI descriptions are compliant with JSON:API v1.1 using this Spectral ruleset so API teams can catch problems early in editors, CI, and pull requests.

## ⚡️ Quick Start

```bash
npm install --save-dev spectral-jsonapi @stoplight/spectral-cli
```

Create a local ruleset file:

```yaml
# .spectral.yaml
extends:
  - spectral:oas
  - "@apisyouwonthate/spectral-jsonapi"
```

Lint your OpenAPI description:

```bash
spectral lint api/openapi.yaml
```

## 🔨 Usage

### Use as npm package

Use this when the project already installs dependencies with npm.

```yaml
# .spectral.yaml
extends:
  - spectral:oas
  - "@apisyouwonthate/spectral-jsonapi"
```

### Use legacy YAML directly from GitHub

Use this when you want to consume the generated YAML ruleset without installing the package:

```yaml
extends:
  - "https://raw.githubusercontent.com/apisyouwonthate/spectral-jsonapi/refs/heads/main/.spectral.yml"
```

Once you have the ruleset set up, you can run Spectral in the same directory as your `.spectral.yml` ruleset, and it will include the JSON:API rules in its check

```bash
spectral lint api/openapi.yaml
```

This does not include `spectral:oas` rules, so to get these add it to the `extend` list:

```yaml
extends:
  - "https://raw.githubusercontent.com/apisyouwonthate/spectral-jsonapi/refs/heads/main/.spectral.yml"
  - spectral:oas
```

## Rule Opt-Outs

### resource-object-id-required

Use this opt-out only when a response schema is intentionally not a standard JSON:API resource object (for example, ephemeral computed resources without stable IDs).

Set `x-jsonapi-virtual-resource: true` on the resource schema to skip the `resource-object-id-required` warning.

```yaml
components:
  schemas:
    AvailableSlotResource:
      type: object
      x-jsonapi-virtual-resource: true
      required:
        - type
        - attributes
      properties:
        type:
          type: string
          enum:
            - availableSlot
        attributes:
          $ref: "#/components/schemas/AvailableSlotAttributes"
```

## 👥 Contributing

For testing approach and contributor workflow, see [CONTRIBUTING.md](CONTRIBUTING.md).

## 🎉 Thanks

- [Jeff Marquez](https://www.linkedin.com/in/jeffmarquez)
- [Ali Fazal](https://linkedin.com/in/ali-fazal-424904140)
- Ananya Poddar
- Anthony MacAllister

## 📜 License

MIT. See [LICENSE](LICENSE).

## 🌳 Sponsor

If you'd like to say thanks for this style guide, consider supporting [Protect Earth](https://protect.earth/donate?ref=spectral-jsonapi), a charity co-founded by APIs You Won't Hate's co-founder Phil Sturgeon, focused on nature-based climate solutions. Phil spends most of his time planting trees and re-wetting bogs now, especially at the [Warleigh Nature Reserve](https://www.crowdfunder.co.uk/p/warleigh-nature-reserve), so this is a great way to support his work and the planet at the same time.

import {
  IRuleResult,
  Spectral,
  Ruleset,
  RulesetDefinition,
} from "@stoplight/spectral-core";
import { httpAndFileResolver } from "@stoplight/spectral-ref-resolver";
import jsonApiRuleset from "../../src/ruleset";

export type RuleName = keyof Ruleset["rules"];

export async function expectRuleErrors(
  spectral: Spectral,
  ruleName: RuleName,
  document: unknown,
  expectedErrors: ReadonlyArray<Partial<IRuleResult>>,
): Promise<void> {
  const results = await spectral.run(JSON.stringify(document));

  expect(results.filter(({ code }) => code === ruleName)).toEqual(
    expectedErrors.map((error) => expect.objectContaining(error) as unknown),
  );
}

export function createWithRules(rules: (keyof Ruleset["rules"])[]): Spectral {
  const s = new Spectral({ resolver: httpAndFileResolver });
  const baseRuleset =
    (jsonApiRuleset as unknown as { default?: RulesetDefinition }).default ??
    (jsonApiRuleset as unknown as RulesetDefinition);

  const baseRules = ((
    baseRuleset as unknown as { rules?: Record<string, unknown> }
  ).rules ?? {}) as Record<string, unknown>;

  const selectedRules = rules.reduce((obj: Record<string, unknown>, name) => {
    const key = String(name);
    if (key in baseRules) {
      obj[key] = baseRules[key];
    }
    return obj;
  }, {});

  s.setRuleset({
    ...baseRuleset,
    extends: [],
    rules: selectedRules,
  });

  return s;
}

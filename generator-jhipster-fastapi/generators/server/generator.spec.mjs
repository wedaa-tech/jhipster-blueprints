import { jestExpect as expect } from "mocha-expect-snapshot";

import { helpers, lookups } from "#test-utils";

const SUB_GENERATOR = "server";
const BLUEPRINT_NAMESPACE = `jhipster:${SUB_GENERATOR}`;

describe("SubGenerator server of fastapi JHipster blueprint", () => {
  describe("run", () => {
    let result;
    before(async function () {
      result = await helpers
        .create(BLUEPRINT_NAMESPACE)
        .withOptions({
          reproducible: true,
          defaults: true,
          baseName: "jhipster",
          ignoreNeedlesError: true,
          blueprint: "fastapi",
        })
        .withLookups(lookups)
        .run();
    });

    it("should succeed", () => {
      expect(result.getStateSnapshot()).toMatchSnapshot();
    });
  });
});

import { readFileSync } from "node:fs";
import { xrayGraphQL, gqlString } from "./client.mjs";

const [, , seedPath, indexArg] = process.argv;
if (!seedPath || indexArg === undefined) {
  console.error("Usage: node create-test.mjs <seed-file.json> <test-index>");
  process.exit(1);
}

const seed = JSON.parse(readFileSync(seedPath, "utf8"));
const index = Number(indexArg);
const test = seed.tests[index];
if (!test) {
  throw new Error(`No test at index ${index} in ${seedPath} (${seed.tests.length} tests available)`);
}

const stepsLiteral = `[${test.steps
  .map(
    (s) =>
      `{ action: ${gqlString(s.action)}, data: ${gqlString("")}, result: ${gqlString(s.expectedResult)} }`
  )
  .join(", ")}]`;

const description = `Precondition: ${test.precondition}`;

const mutation = `
  mutation {
    createTest(
      testType: { name: "Manual" }
      steps: ${stepsLiteral}
      jira: {
        fields: {
          summary: ${gqlString(test.summary)}
          description: ${gqlString(description)}
          project: { key: "TS" }
        }
      }
    ) {
      test {
        issueId
        jira(fields: ["key", "summary"])
      }
      warnings
    }
  }
`;

const data = await xrayGraphQL(mutation);
console.log(JSON.stringify(data.createTest, null, 2));

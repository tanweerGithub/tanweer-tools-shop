import { xrayGraphQL, gqlString } from "./client.mjs";

const [, , summaryArg, startDateArg, ...testIssueIds] = process.argv;
if (!summaryArg || !startDateArg || testIssueIds.length === 0) {
  console.error(
    "Usage: node create-test-execution.mjs <summary> <YYYY-MM-DD start date> <testIssueId...>"
  );
  process.exit(1);
}

const issueIdsLiteral = `[${testIssueIds.map((id) => gqlString(id)).join(", ")}]`;

const createMutation = `
  mutation {
    createTestExecution(
      testIssueIds: ${issueIdsLiteral}
      jira: {
        fields: {
          summary: ${gqlString(summaryArg)}
          project: { key: "TS" }
          customfield_10015: ${gqlString(startDateArg)}
        }
      }
    ) {
      testExecution {
        issueId
        jira(fields: ["key", "summary"])
      }
      warnings
    }
  }
`;

const created = await xrayGraphQL(createMutation);
const execIssueId = created.createTestExecution.testExecution.issueId;
const execKey = created.createTestExecution.testExecution.jira.key;
console.log(`Created Test Execution ${execKey} (issueId ${execIssueId})`);
if (created.createTestExecution.warnings?.length) {
  console.warn("Warnings:", created.createTestExecution.warnings);
}

for (const testIssueId of testIssueIds) {
  const runQuery = `
    query {
      getTestRun(testIssueId: ${gqlString(testIssueId)}, testExecIssueId: ${gqlString(execIssueId)}) {
        id
      }
    }
  `;
  const runData = await xrayGraphQL(runQuery);
  const runId = runData.getTestRun.id;

  const statusMutation = `
    mutation {
      updateTestRunStatus(id: ${gqlString(runId)}, status: "PASSED")
    }
  `;
  await xrayGraphQL(statusMutation);
  console.log(`  testIssueId ${testIssueId} -> run ${runId} -> PASSED`);
}

console.log(`Done: ${execKey}`);

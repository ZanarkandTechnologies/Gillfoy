import { validateTestabilityContract } from "./testability-contract.js";

async function main(): Promise<void> {
  const issues = await validateTestabilityContract();

  if (issues.length === 0) {
    console.log("testability contract: ok");
    return;
  }

  console.error("testability contract: failed");
  for (const issue of issues) {
    console.error(`- ${issue.filePath}: ${issue.message}`);
  }
  process.exitCode = 1;
}

void main();

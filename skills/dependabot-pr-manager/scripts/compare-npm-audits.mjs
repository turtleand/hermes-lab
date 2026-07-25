#!/usr/bin/env node

import { readFile } from 'node:fs/promises';

const severityRank = {
  info: 0,
  low: 1,
  moderate: 2,
  high: 3,
  critical: 4,
};

function usage() {
  console.error('Usage: node compare-npm-audits.mjs <baseline-audit.json> <candidate-audit.json>');
  process.exitCode = 2;
}

function parseAudit(text, filePath) {
  const jsonStart = text.indexOf('{');
  if (jsonStart === -1) {
    throw new Error(`No JSON object found in ${filePath}`);
  }

  return JSON.parse(text.slice(jsonStart));
}

function packageFindings(report) {
  return new Map(
    Object.entries(report.vulnerabilities ?? {}).map(([name, value]) => [
      name,
      value.severity ?? 'info',
    ]),
  );
}

function advisoryFindings(report) {
  const findings = new Map();

  for (const [packageName, vulnerability] of Object.entries(report.vulnerabilities ?? {})) {
    for (const via of vulnerability.via ?? []) {
      if (typeof via === 'string') continue;

      const key = via.url || `${packageName}:${via.source ?? via.title ?? 'unknown'}`;
      findings.set(key, {
        packageName,
        severity: via.severity ?? vulnerability.severity ?? 'info',
        title: via.title ?? key,
      });
    }
  }

  return findings;
}

function totals(report) {
  const values = report.metadata?.vulnerabilities ?? {};
  return {
    high: values.high ?? 0,
    critical: values.critical ?? 0,
    total: values.total ?? 0,
  };
}

function worsened(before, after) {
  return (severityRank[after] ?? -1) > (severityRank[before] ?? -1);
}

async function main() {
  const [baselinePath, candidatePath] = process.argv.slice(2);
  if (!baselinePath || !candidatePath) {
    usage();
    return;
  }

  const [baselineText, candidateText] = await Promise.all([
    readFile(baselinePath, 'utf8'),
    readFile(candidatePath, 'utf8'),
  ]);

  const baseline = parseAudit(baselineText, baselinePath);
  const candidate = parseAudit(candidateText, candidatePath);
  const baselinePackages = packageFindings(baseline);
  const candidatePackages = packageFindings(candidate);
  const baselineAdvisories = advisoryFindings(baseline);
  const candidateAdvisories = advisoryFindings(candidate);
  const regressions = [];

  for (const [name, severity] of candidatePackages) {
    const previousSeverity = baselinePackages.get(name);
    if (previousSeverity === undefined) {
      regressions.push(`new vulnerable package ${name} (${severity})`);
    } else if (worsened(previousSeverity, severity)) {
      regressions.push(`package ${name} worsened from ${previousSeverity} to ${severity}`);
    }
  }

  for (const [key, finding] of candidateAdvisories) {
    const previous = baselineAdvisories.get(key);
    if (previous === undefined) {
      regressions.push(`new advisory for ${finding.packageName}: ${finding.title} (${finding.severity})`);
    } else if (worsened(previous.severity, finding.severity)) {
      regressions.push(
        `advisory for ${finding.packageName} worsened from ${previous.severity} to ${finding.severity}: ${finding.title}`,
      );
    }
  }

  const baselineTotals = totals(baseline);
  const candidateTotals = totals(candidate);
  if (candidateTotals.high > baselineTotals.high) {
    regressions.push(
      `high findings increased from ${baselineTotals.high} to ${candidateTotals.high}`,
    );
  }
  if (candidateTotals.critical > baselineTotals.critical) {
    regressions.push(
      `critical findings increased from ${baselineTotals.critical} to ${candidateTotals.critical}`,
    );
  }

  console.log(
    `Baseline: ${baselineTotals.total} total, ${baselineTotals.high} high, ${baselineTotals.critical} critical`,
  );
  console.log(
    `Candidate: ${candidateTotals.total} total, ${candidateTotals.high} high, ${candidateTotals.critical} critical`,
  );

  if (regressions.length > 0) {
    console.error('FAIL: audit regressions detected');
    for (const regression of regressions) {
      console.error(`- ${regression}`);
    }
    process.exitCode = 1;
    return;
  }

  console.log('PASS: no new or worsened npm audit findings');
}

main().catch((error) => {
  console.error(`ERROR: ${error.message}`);
  process.exitCode = 2;
});

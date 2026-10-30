/* eslint-disable @typescript-eslint/no-require-imports -- CommonJS hook loads the real TS modules in Node's test runner. */
const assert = require("node:assert/strict");
const { test } = require("node:test");
const fs = require("node:fs");
const ts = require("typescript");

// Exercise the actual TypeScript modules without adding a runtime dependency.
require.extensions[".ts"] = (module, filename) => {
  const { outputText } = ts.transpileModule(fs.readFileSync(filename, "utf8"), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
    fileName: filename,
  });
  module._compile(outputText, filename);
};

const { isPastEvent, mergeEventRows, toEventRow } = require("../lib/event-feed.ts");
const { isFounderGithub } = require("../convex/founders.ts");

const date = Date.parse("2026-10-30T00:00:00Z");
const event = { title: "Meetup", place: "Lima", summary: "Construimos juntos", startsAt: date, status: "confirmed", createdAt: date };

test("Convex calendar days stay upcoming throughout the selected UTC day", () => {
  const row = toEventRow(event);
  assert.equal(isPastEvent(row, date + 86_399_999), false);
  assert.equal(isPastEvent(row, date + 86_400_000), true);
});

test("Explicit archive status and actual Luma end times control the archive", () => {
  assert.equal(isPastEvent(toEventRow({ ...event, status: "past" }), date - 1), true);
  const timed = { ...toEventRow(event), dateOnly: false, endDate: new Date(date + 3_600_000) };
  assert.equal(isPastEvent(timed, date + 1_800_000), false);
  assert.equal(isPastEvent(timed, date + 3_600_000), true);
});

test("Undated possible gatherings stay undated rather than inventing a midnight appointment", () => {
  const row = toEventRow({ ...event, startsAt: undefined, status: "possible", whenLabel: "En noviembre" });
  assert.equal(row.date, null);
  assert.equal(row.whenLabel, "En noviembre");
  assert.equal(isPastEvent(row, date + 365 * 86_400_000), false);
});

test("Luma aliases and tracking links deduplicate in favor of editable Convex records", () => {
  const local = { ...toEventRow({ ...event, id: "convex-event" }), url: "https://lu.ma/meetup/?utm_source=site" };
  const external = { ...local, id: "luma:event", source: "luma", url: "https://www.luma.com/meetup" };
  assert.deepEqual(mergeEventRows([local], [external]), [local]);
});

test("Events without links are not accidentally merged and dated entries sort first", () => {
  const unknown = toEventRow({ ...event, startsAt: undefined, whenLabel: "Pronto" });
  const dated = { ...toEventRow(event), id: "luma:dated", source: "luma" };
  assert.deepEqual(mergeEventRows([unknown], [dated]), [dated, unknown]);
});

test("GabMun gains founder access with normalized GitHub handles; unknown users do not", () => {
  assert.equal(isFounderGithub("@GabGabOGabito"), true);
  assert.equal(isFounderGithub("Andy18acaro"), true);
  assert.equal(isFounderGithub("unrelated-user"), false);
  assert.equal(isFounderGithub(undefined), false);
});

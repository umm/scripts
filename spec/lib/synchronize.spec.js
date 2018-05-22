const fs = require('fs');
const path = require('path');

const mkdirp = require('mkdirp');

const umm = require('../../index');

const ORIGINAL_DIRECTORY = path.resolve("./spec/fixtures/original/");
const OUTPUT_DIRECTORY = path.resolve("./spec/fixtures/outputs/");

const PATH_FOO = "foo";
const PATH_BAR = "bar";
const PATH_BAZ = "baz";
const PATH_QUX = path.join("baz", "qux");
const PATH_NEST = path.join("nest1", "nest2", "item");

describe("Synchronize", () => {

  beforeEach(() => {
    mkdirp.sync(OUTPUT_DIRECTORY);
  });

  afterEach(() => {
    umm.libraries.removeRecursive(OUTPUT_DIRECTORY);
  });

  it("normal", () => {
    umm.libraries.synchronize(
      ORIGINAL_DIRECTORY,
      OUTPUT_DIRECTORY
    );
    expect(fs.existsSync(path.join(OUTPUT_DIRECTORY, PATH_FOO))).toBeTruthy();
    expect(fs.existsSync(path.join(OUTPUT_DIRECTORY, PATH_BAR))).toBeTruthy();
    expect(fs.existsSync(path.join(OUTPUT_DIRECTORY, PATH_QUX))).toBeTruthy();
    expect(fs.existsSync(path.join(OUTPUT_DIRECTORY, PATH_NEST))).toBeTruthy();
  });

  it("specification glob (all)", () => {
    umm.libraries.synchronize(
      ORIGINAL_DIRECTORY,
      OUTPUT_DIRECTORY,
      [
        "**/*",
      ]
    );
    expect(fs.existsSync(path.join(OUTPUT_DIRECTORY, PATH_FOO))).toBeTruthy();
    expect(fs.existsSync(path.join(OUTPUT_DIRECTORY, PATH_BAR))).toBeTruthy();
    expect(fs.existsSync(path.join(OUTPUT_DIRECTORY, PATH_QUX))).toBeTruthy();
    expect(fs.existsSync(path.join(OUTPUT_DIRECTORY, PATH_NEST))).toBeTruthy();
  });

  it("specification glob (flat)", () => {
    umm.libraries.synchronize(
      ORIGINAL_DIRECTORY,
      OUTPUT_DIRECTORY,
      [
        "*",
      ],
      {
        extract_directory: false
      }
    );
    expect(fs.existsSync(path.join(OUTPUT_DIRECTORY, PATH_FOO))).toBeTruthy();
    expect(fs.existsSync(path.join(OUTPUT_DIRECTORY, PATH_BAR))).toBeTruthy();
    expect(fs.existsSync(path.join(OUTPUT_DIRECTORY, PATH_QUX))).toBeFalsy();
    expect(fs.existsSync(path.join(OUTPUT_DIRECTORY, PATH_NEST))).toBeFalsy();
  });

  it("designation multiple", () => {
    umm.libraries.synchronize(
      ORIGINAL_DIRECTORY,
      OUTPUT_DIRECTORY,
      [
        "foo",
        "baz/*",
      ]
    );
    expect(fs.existsSync(path.join(OUTPUT_DIRECTORY, PATH_FOO))).toBeTruthy();
    expect(fs.existsSync(path.join(OUTPUT_DIRECTORY, PATH_BAR))).toBeFalsy();
    expect(fs.existsSync(path.join(OUTPUT_DIRECTORY, PATH_QUX))).toBeTruthy();
    expect(fs.existsSync(path.join(OUTPUT_DIRECTORY, PATH_NEST))).toBeFalsy();
  });

});
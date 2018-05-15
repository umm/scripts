const util = require('util');
const fs = require('fs');
const path = require('path');

const mkdirp = require('mkdirp');

const glob = require('glob');
const walk = require('ignore-walk');

const concat = (x, y) => x.concat(y);

const flatMap = (f, xs) => xs.map(f).reduce(concat, []);

Array.prototype.flatMap = function(f) {
  return flatMap(f, this);
};

const synchronize = (source, destination, patterns, overwrite_options, callback) => {
  let default_options = {
    overwrite: true,
    extract_directory: true,
    remove_source: false,
    remove_empty_source_directory: false,
    remove_deleted_files: false,
  };

  if (typeof patterns === "object" && !(patterns instanceof Array)) {
    overwrite_options = patterns;
    patterns = undefined;
  }
  if (typeof callback === "undefined" && typeof overwrite_options === "function") {
    callback = overwrite_options;
    overwrite_options = undefined;
  }
  if (typeof callback === "undefined" && typeof patterns === "function") {
    callback = patterns;
    patterns = undefined;
  }
  if (typeof callback === "undefined") {
    callback = (err) =>{
      if (err) {
        console.error(err);
      }
    }
  }

  if (typeof overwrite_options !== "undefined" && typeof overwrite_options === "object") {
    default_options = {
      overwrite: overwrite_options.hasOwnProperty('overwrite') ? overwrite_options.overwrite : default_options.overwrite,
      extract_directory: overwrite_options.hasOwnProperty('extract_directory') ? overwrite_options.extract_directory : default_options.extract_directory,
      remove_source: overwrite_options.hasOwnProperty('remove_source') ? overwrite_options.remove_source : default_options.remove_source,
      remove_empty_source_directory: overwrite_options.hasOwnProperty('remove_empty_source_directory') ? overwrite_options.remove_empty_source_directory : default_options.remove_empty_source_directory,
      remove_deleted_files: overwrite_options.hasOwnProperty('remove_deleted_files') ? overwrite_options.remove_deleted_files : default_options.remove_deleted_files,
    };
  }

  source = path.resolve(source);
  destination = path.resolve(destination);

  // パターン指示を正規化
  patterns = (patterns || ["**/*"])
  .map((pattern, index) => {
    if (typeof pattern  === "object" && pattern.pattern) {
      return {
        pattern: pattern.pattern,
        overwrite: pattern.hasOwnProperty('overwrite') ? pattern.overwrite : default_options.overwrite,
        extract_directory: pattern.hasOwnProperty('extract_directory') ? pattern.extract_directory : default_options.extract_directory,
        remove_source: pattern.hasOwnProperty('remove_source') ? pattern.remove_source : default_options.remove_source,
        remove_empty_source_directory: pattern.hasOwnProperty('remove_empty_source_directory') ? pattern.remove_empty_source_directory : default_options.remove_empty_source_directory,
        remove_deleted_files: pattern.hasOwnProperty('remove_deleted_files') ? pattern.remove_deleted_files : default_options.remove_deleted_files,
      };
    }
    if (typeof pattern  === "string") {
      return {
        pattern: pattern,
        overwrite: default_options.overwrite,
        extract_directory: default_options.extract_directory,
        remove_source: default_options.remove_source,
        remove_empty_source_directory: default_options.remove_empty_source_directory,
        remove_deleted_files: default_options.remove_deleted_files,
      };
    }
  });

  // 対象ファイル情報一覧を構築
  let source_file_list = patterns
  // パターンをファイル・ディレクトリの一覧に展開
  .flatMap(
    (pattern, index) => glob
    .sync(path.join(source, pattern.pattern))
    .map((entry) => {
      let file_path = path.relative(source, entry);

      return {
        path: file_path,
        source_path: path.join(source, file_path),
        destination_path: path.join(destination, file_path),
        overwrite: pattern.overwrite,
        extract_directory: pattern.extract_directory,
        remove_source: pattern.remove_source,
        remove_empty_source_directory: pattern.remove_empty_source_directory,
        remove_deleted_files: pattern.remove_deleted_files,
      };
    })
  )
  // ディレクトリの場合更に展開
  .flatMap(
    (pattern, index) => {
      let list = [];
      if (
        pattern.extract_directory
        && fs.existsSync(pattern.source_path)
        && fs.statSync(pattern.source_path).isDirectory()
      ) {
        list = glob
        .sync(path.join(pattern.source_path, '**/*'))
        .map((entry) => {
          let file_path = path.relative(source, entry);

          return {
            path: file_path,
            source_path: path.join(source, file_path),
            destination_path: path.join(destination, file_path),
            overwrite: pattern.overwrite,
            extract_directory: pattern.extract_directory,
            remove_source: pattern.remove_source,
            remove_empty_source_directory: pattern.remove_empty_source_directory,
            remove_deleted_files: pattern.remove_deleted_files,
          };
        });
      }
      list.push(pattern);
      return list;
    }
  )
  // ディレクトリの処理を最後に回したいので逆順ソート
  .sort((a, b) => {
    if (a.source_path < b.source_path) {
      return 1;
    }
    if (a.source_path > b.source_path) {
      return -1;
    }
    return 0;
  });
  source_file_list = source_file_list.filter((item, index, array) => array.indexOf(item) === index);

  // 対象ファイル情報一覧を構築
  let destination_file_list = patterns
  // パターンをファイル・ディレクトリの一覧に展開
  .flatMap(
    (pattern, index) => glob
    .sync(path.join(destination, pattern.pattern))
    .map((entry) => {
      let file_path = path.relative(destination, entry);

      return {
        path: file_path,
        source_path: path.join(source, file_path),
        destination_path: path.join(destination, file_path),
        overwrite: pattern.overwrite,
        extract_directory: pattern.extract_directory,
        remove_source: pattern.remove_source,
        remove_empty_source_directory: pattern.remove_empty_source_directory,
        remove_deleted_files: pattern.remove_deleted_files,
      };
    })
  )
  // ディレクトリの処理を最後に回したいので逆順ソート
  .sort((a, b) => {
    if (a.source_path < b.source_path) {
      return 1;
    }
    if (a.source_path > b.source_path) {
      return -1;
    }
    return 0;
  });
  destination_file_list = destination_file_list.filter((item, index, array) => array.indexOf(item) === index);

  // .gitignore, .npmignore を適用した「コピー可能」なファイル一覧を構築
  let candidate_file_list = source_file_list.map(item => item.source_path);
  if (fs.existsSync(source)) {
    candidate_file_list = walk
    // ignore-walk を用いて一覧
    .sync({
      path: source,
      ignoreFiles: glob
      .sync(path.join(source, '**/{.gitignore,.npmignore}'))
      .map(item => path.relative(source, item))
    })
    .map(item => path.join(source, item));
  }

  source_file_list
  .filter((item) => candidate_file_list.some((x) => item.source_path == x))
  .map((entry) => {
    // ファイルコピー
    // 宛先ディレクトリ作成
    mkdirp.sync(path.dirname(entry.destination_path));
    if (
      fs.existsSync(entry.source_path)
      && !fs.statSync(entry.source_path).isDirectory()
      && (entry.overwrite || !fs.existsSync(entry.destination_path))
    ) {
      fs.copyFileSync(entry.source_path, entry.destination_path);
    }

    // 元ファイル削除（オプション）
    // 通常ファイルを削除
    if (
      entry.remove_source
      && fs.existsSync(entry.source_path)
      && !fs.statSync(entry.source_path).isDirectory()
    ) {
      fs.unlinkSync(entry.source_path);
    }
    // 空ディレクトリを削除（オプション）
    if (
      entry.remove_empty_source_directory
      && fs.existsSync(entry.source_path)
      && fs.statSync(entry.source_path).isDirectory()
      && !fs.readdirSync(entry.source_path).some((item) => !/^\.+$/.test(item))
    ) {
      fs.rmdirSync(entry.source_path);
    }
    return entry;
  });

  destination_file_list
  // 削除フラグが立っており、元ファイルリストに存在しない要素に絞り込み
  .filter((item) => item.remove_deleted_files && !source_file_list.some((x) => x.path == item.path))
  .map((entry) => {
    // 削除済みファイルの削除
    // 通常ファイルを削除
    if (
      fs.existsSync(entry.destination_path)
      && !fs.statSync(entry.destination_path).isDirectory()
    ) {
      fs.unlinkSync(entry.destination_path);
    }
    // 空ディレクトリを削除
    if (
      fs.existsSync(entry.destination_path)
      && fs.statSync(entry.destination_path).isDirectory()
      && !fs.readdirSync(entry.destination_path).some((item) => !/^\.+$/.test(item))
    ) {
      fs.rmdirSync(entry.destination_path);
    }
    return entry;
  });

  if (typeof callback === "function") {
    callback();
  }
};

module.exports = synchronize;

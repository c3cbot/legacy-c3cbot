/*
    C3C Invisible Protocol implementation
    Copyright (C) 2020 UIRI

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <https://www.gnu.org/licenses/>.
*/

/*
  Protocol description: 
    This protocol will be used on Facebook Messenger text channel to detect for
    other bots in the same thread, and then do the payload configured in a
    config file (or maybe hardcoded to this file).

  Protocol specification:
    - Character mapping: U+200B, U+200E, U+200C, U+200D as 0, 1, 2, 3
    - Prefix: 1003
    - EOT suffix: 0010

    - Notify other bots: PREFIX + SUFFIX (10030100) without any data 
      in-between

  still working on... this is a draft.
*/

let mapping = {
  "0": "\u200B",
  "1": "\u200E",
  "2": "\u200C",
  "3": "\u200D"
}

let prefix = "1003";
let suffix = "0010";

let getData = function getData(content) {
  let prefixLoc = content.indexOf(prefix.objectReplace(mapping));
  if (prefixLoc + 1) {
    let suffixLoc = content.indexOf(suffix.objectReplace(mapping), prefixLoc + 4);
    if (suffixLoc + 1) {
      return prefixLoc;
    }
    return null;
  } else {
    return null;
  }
}

let parseData = function parseData(content) {
  let data = getData(content);
  if (data) {
    if (data === "") {
      //should return data to other bots. no specification for this yet. it's still being worked on.
    } else {
      //parse data from other bots.
    }
  }
}

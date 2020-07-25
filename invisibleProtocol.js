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

    - Response to a ping: PREFIX + 00 (TYPE) + (ID of ping sender encoded as Base-4 and
      replaced with IPROTOCOL character mapping) + SUFFIX

  still working on... this is a draft.
*/

let mapping = {
  "0": "\u200B",
  "1": "\u200E",
  "2": "\u200C",
  "3": "\u200D"
}

let reverseMapping = {
  "\u200B": "0",
  "\u200E": "1",
  "\u200C": "2",
  "\u200D": "3"
}

let prefix = "1003";
let suffix = "0010";

let getData = function getData(content) {
  let prefixLoc = content.indexOf(prefix.objectReplace(mapping));
  if (prefixLoc + 1) {
    let continueSearching = true;
    let suffixLoc = content.indexOf(suffix.objectReplace(mapping), prefixLoc + 4);
    while (continueSearching) {
      let tempSuffixLoc = content.indexOf(suffix.objectReplace(mapping), suffixLoc + 1);
      if (tempSuffixLoc + 1) {
        suffixLoc = tempSuffixLoc;
      } else {
        continueSearching = false;
      }
    }

    if (suffixLoc + 1) {
      return prefixLoc;
    }
    return null;
  } else {
    return null;
  }
}

let parseData = function parseData(message) {
  let data = getData(message.body);
  if (data) {
    if (data === "") {
      return [{
        message: 
          prefix.objectReplace(mapping) +
          "00".objectReplace(mapping) +
          BigInt(message.senderID).toString(4).objectReplace(mapping) +
          suffix.objectReplace(mapping),
        when: 0
      }];
    } else {
      //parse data from other bots.
    }
  }
}

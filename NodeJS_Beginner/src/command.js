import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import {
  newNote,
  getAllNotes,
  findNotes,
  removeNote,
  removeAllNotes,
} from "./notes.js";

// this function could be put into separate js file like utils since it's used more than once
const listNodes = (notes) => {
  notes.forEach(({ id, content, tags }) => {
    console.log("id: ", id);
    console.log("tags: ", tags);
    console.log("content: ", content);
    console.log("\n");
  });
};

yargs(hideBin(process.argv))
  .command(
    "new <note>",
    "create a new note",
    (yargs) => {
      return yargs.positional("note", {
        describe: "The content of the note you want to create",
        type: "string",
      });
    },
    async (argv) => {
      const tags = argv.tags ? argv.tags.split(",") : [];
      const note = await newNote(argv.note, tags);
      console.log("New note! ", note);
    }
  )
  .option("tags", {
    alias: "t",
    type: "string",
    description: "tags to add to the note",
  })
  .command(
    "all",
    "get all notes",
    () => {},
    async (argv) => {
      const notes = await getAllNotes();
      listNodes(notes);
    }
  )
  .command(
    "find <filter>",
    "get matching notes",
    (yargs) => {
      return yargs.positional("filter", {
        describe:
          "The search term to filter notes by, will be applied to note.content",
        type: "string",
      });
    },
    async (argv) => {
      const matches = await findNotes(argv.filter);
      listNodes(matches);
    }
  )
  .command(
    "remove <id>",
    "remove a note by id",
    (yargs) => {
      return yargs.positional("id", {
        type: "number",
        description: "The id of the note you want to remove",
      });
    },
    async (argv) => {
      const id = await removeNote(argv.id);
      console.log(id);
    }
  )
  .command(
    "web [port]",
    "launch website to see notes",
    (yargs) => {
      return yargs.positional("port", {
        describe: "port to bind on",
        default: 5000,
        type: "number",
      });
    },
    async (argv) => {}
  )
  .command(
    "clean",
    "remove all notes",
    () => {},
    async (argv) => {
      await removeAllNotes();
      console.log("db resetted");
    }
  )
  .demandCommand(1)
  .parse();

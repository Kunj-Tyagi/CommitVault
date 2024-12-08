const fs = require("fs").promises; //promises is the utility jo files ko create karna mai help karta hai
const path = require("path"); //for Current working directory.
const { v4: uuidv4 } = require("uuid"); //For unique id(v4>v5)

// Staging area se content ko commit folder mai transfer karega (for permanent changes).

async function commitRepo(message) {
  const repoPath = path.resolve(process.cwd(), ".apnaGit");
  const stagedPath = path.join(repoPath, "staging");
  const commitPath = path.join(repoPath, "commits");

  try {
    const commitID = uuidv4();
    // commitDir, is a complete path that points to a new folder for that specific commit.
    const commitDir = path.join(commitPath, commitID);
    // folder banega on commitpath address with commitID name.
    await fs.mkdir(commitDir, { recursive: true });

    const files = await fs.readdir(stagedPath);
    for (const file of files) {
      await fs.copyFile(
        path.join(stagedPath, file), //Source
        path.join(commitDir, file) //Sink
      );
    }
    await fs.writeFile(
      path.join(commitDir, "commit.json"),
      JSON.stringify({ message, date: new Date().toISOString() })
    );
    console.log(`Commit ${commitID} created with message:${message}`);
  } catch (err) {
    console.error("Error commiting files:", err);
  }
}

module.exports = { commitRepo };

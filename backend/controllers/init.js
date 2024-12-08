// fs-File system of node!
const fs=require('fs').promises;//promises is the utility jo files ko create karna mai help karta hai
const path=require("path");//for Current working directory.

async function initRepo(){
    // Repo ka path kya hona chayiye!
    const repoPath=path.resolve(process.cwd(),".apnaGit");
    const commitsPath=path.join(repoPath,"commits");//apnaGit mai commits.

    try{
        await fs.mkdir(repoPath,{recursive:true});
        await fs.mkdir(commitsPath,{recursive:true});

        await fs.writeFile(
            path.join(repoPath,"config.json"),
            JSON.stringify({bucket:process.env.S3_BUCKET})
        );
        console.log("Repository initialised");
    }
    catch(err){
        console.error("Error initailising repository");
    }
}

module.exports={initRepo};
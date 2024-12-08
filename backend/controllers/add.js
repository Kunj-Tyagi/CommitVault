const fs=require('fs').promises;//promises is the utility jo files ko create karna mai help karta hai
const path=require("path");//for Current working directory.

// Jo user file de raha hume uski copy banani hai aur fir ausko move karani hai staging file mai

async function addRepo(filePath){
    const repoPath=path.resolve(process.cwd(),".apnaGit");
    const stagingPath=path.join(repoPath,"staging");

    try{
        await fs.mkdir(stagingPath,{recursive:true});
        const fileName=path.basename(filePath);//Jo bhi filepath user ne hume di hai auus path pe jo bhi file hai hume ausko read karlega!
        // path.join(stagingPath, fileName) is a simple way to put together a folder path and a file name into one complete path so you know exactly where the file will go.
        await fs.copyFile(filePath,path.join(stagingPath,fileName));
        console.log(`File ${fileName} added to the staging area!`);
    }
    catch(err){
        console.error("Error adding file:",err);
    }
}

module.exports={addRepo};
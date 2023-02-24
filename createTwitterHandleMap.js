const fs = require('fs');
const path = require('path');

let json_obj = [];
let map = new Map();

const DIRECTORY_PATH = './sessions'

function parseFilesRecursively(directoryPath = DIRECTORY_PATH) {
    const files = fs.readdirSync(directoryPath);
  
    files.forEach((file) => {
        const filePath = path.join(directoryPath, file);
        const stat = fs.statSync(filePath);
    
        if (stat.isDirectory()) {
            // Recursively parse files in subdirectory
            parseFilesRecursively(filePath);
        } else {
            // Parse contents of file -> attendees.adoc
            if(filePath.endsWith('attendees.adoc')) {
                const fileContents = fs.readFileSync(filePath, 'utf8');
                collectUsernames(fileContents);
            }
            // console.log(`Parsing file ${filePath} with contents: ${fileContents}`);
        }
    });
  }

function collectUsernames(data) {
    
    /**
     * fileData
     * 
    ==== Attendees

    . link:https://twitter.com/ayushb_tweets[Ayush Bhosle^]
    . link:https://twitter.com/annshagrawaal[Annsh Agrawaal^]
    . link:https://twitter.com/DhiruCodes[Dheeraj Lalwani^]
     *
     */
    
    let fileData = data
    .toString()
    .split('\n')
    .slice(2)
    .join('\n');
    
    /**
     * fileData
     * 
    . link:https://twitter.com/ayushb_tweets[Ayush Bhosle^]
    . link:https://twitter.com/annshagrawaal[Annsh Agrawaal^]
    . link:https://twitter.com/DhiruCodes[Dheeraj Lalwani^]
     * 
     */
    
    // fileData = fileData.replaceAll('. link:https://twitter.com/', '');
    fileData = fileData.replaceAll('. link:', '');
    fileData = fileData.replaceAll('. ', '');
    fileData = fileData.replaceAll('[', ' ');
    fileData = fileData.replaceAll('^]', '');
    
    /**
     * fileData
     * 
    https://twitter.com/ayushb_tweets Ayush Bhosle
    https://twitter.com/annshagrawaal Annsh Agrawaal 
    https://twitter.com/DhiruCodes Dheeraj Lalwani
     * 
     */

    /**
     * newData - [array of strings]
     * where string = "twitterLink firstName Lastname"
     */
    
    let newData = fileData.split('\n');

    for(let line of newData) {
        let curr = line.split(" ");
        if(curr[0].startsWith("https://")) {
            let handle = curr[0].trim();
            let name = curr
                        .splice(1)
                        .join(' ')
                        .trim();

            if(json_obj.filter(item => (item.name === name)).length == 0) {
                json_obj.push(
                    {
                        "name": name, 
                        "handle": handle
                    }
                );
            }

            map.set(name, handle);
        }
    }
    // console.log(json_obj);
    // console.log(map);
    
    fs.writeFileSync('map.json', JSON.stringify(json_obj, null, 4));
}

parseFilesRecursively(DIRECTORY_PATH);

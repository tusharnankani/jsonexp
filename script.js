const fs = require('fs');
const path = require('path');

json_obj = [
    {
        "name": "ABC",
        "handle": "abc",
    }
];

let map = new Map(); 

function parseFilesRecursively(directoryPath = './') {
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
            let handle = curr[0];
            let name = curr
                        .splice(1)
                        .join(' ');

            json_obj.push(
                {
                    "name": name, 
                    "handle": handle
                }
            );

            map.set(name, handle);
        }
    }
    console.log(json_obj);
    console.log(map);
    
    fs.writeFileSync('map.json', JSON.stringify(json_obj, null, 4));
}

parseFilesRecursively()

/*

Map(17) {
    'Ayush Bhosle' => 'https://twitter.com/ayushb_tweets',
    'Annsh Agrawaal' => 'https://twitter.com/annshagrawaal',
    'Dheeraj Lalwani' => 'https://twitter.com/DhiruCodes',
    'Hardik Raheja' => 'https://twitter.com/hardikraheja',
    'Harsh Kapadia' => 'https://twitter.com/harshgkapadia',
    'Jay Kaku' => 'https://twitter.com/kaku_jay',
    'Krishna Gadia' => 'https://twitter.com/KRISHNAGADIA',
    'Pooja Gera' => 'https://twitter.com/poojagera0_0',
    'Pratik Thakare' => 'https://twitter.com/t3_pat',
    'Rishit Dagli' => 'https://twitter.com/rishit_dagli',
    'Saifuddin Saifee' => 'https://twitter.com/SaifSaifee_dev',
    'Siddharth Bhatia' => 'https://twitter.com/Darth_Sid512',
    'Siddharth Kaduskar' => 'https://twitter.com/ambitions2003',
    'Vatsal Patel' => 'https://twitter.com/guyinthecape',
    'Wilfred Almeida' => 'https://twitter.com/WilfredAlmeida_',
    'Jaden Furtado' => 'https://twitter.com/furtado_jaden',
    'Tushar Nankani' => 'https://twitter.com/tusharnankanii'
  }

  */
 
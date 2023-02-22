const fs = require('fs');

json_obj = [
    {
        "name": "ABC",
        "handle": "abc",
    }
]

fs.readFile('attendee.adoc', (err, data) => {
    if (err) throw err;

    let fileData = (data.toString());
    // console.log(fileData)
    fileData = fileData
                    .split('\n')
                    .slice(2)
                    .join('\n');

    fileData = fileData.replaceAll('. link:', '');
    fileData = fileData.replaceAll('. ', '');
    fileData = fileData.replaceAll('[', ' ');
    fileData = fileData.replaceAll('^]', '');

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
        }
    }
    console.log(json_obj)
})

// let item = JSON.stringify(json);
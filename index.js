const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');


const app = express();
const port = 3000;

app.use(bodyParser.json());

const nodeJsonPath = 'node.json';

app.get('/api/data', (request,response) => {

    fs.readFile(nodeJsonPath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading file:', err);
            response.status(500).send('Internal Server Error');
            return;
        }

        const nodeJson = JSON.parse(data);

    response.send(nodeJson);
    });
})

app.post('/api/data', (request, response) => {
    // Extract data from request body
    const newData = request.body;

    // Read existing data from node.json
    fs.readFile(nodeJsonPath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading file:', err);
            response.status(500).send('Internal Server Error');
            return;
        }

        // Parse existing data
        const existingData = JSON.parse(data);

        // Add new data to existing data
        existingData.push(newData);

        // Write updated data back to node.json
        fs.writeFile(nodeJsonPath, JSON.stringify(existingData, null, 2), (err) => {
            if (err) {
                console.error('Error writing file:', err);
                response.status(500).send('Internal Server Error');
                return;
            }

            console.log('Data added successfully');
            response.status(201).send('Data added successfully');
        });
    });
});

// app.put('/api/data/:id', (request, response) => {
//     const id  = request.params.id;
//     const updateData = request.body;

//     fs.readFile(nodeJsonPath, 'uf8', (err, data) => {
//         if (err) {
//             console.error('Error reading file:', err);
//             response.status(500).send('Internal Server Error');
//             return;
//         }
//     })

// })

// app.delete('/api/data:id', (request, response) => {
//     const id= parseInt(request,params.id);
//     setTimeout(() =>{
      
//     })
// })
app.put('/api/data/:id', (request, response) => {
    const id = request.params.id; // Corrected typo here
    const updateData = request.body;

    fs.readFile(nodeJsonPath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading file:', err);
            response.status(500).send('Internal Server Error');
            return;
        }

        let jsonData = [];
        try {
            jsonData = JSON.parse(data);
        } catch (error) {
            console.error('Error parsing JSON:', error);
            response.status(400).send('Invalid JSON');
            return;
        }

        // Find the index of the item with the matching ID
        const index = jsonData.findIndex(item => item.id === id);

        if (index === -1) {
            response.status(404).send('Entry not found');
            return;
        }

        // Update the item
        jsonData[index] = updateData;

        // Write the updated data back to the file
        fs.writeFile(nodeJsonPath, JSON.stringify(jsonData, null, 2), (err) => {
            if (err) {
                console.error('Error writing file:', err);
                response.status(500).send('Internal Server Error');
                return;
            }

            response.status(200).send('Entry updated successfully');
        });
    });
});

app.delete('/api/data/:id', (request, response) => {
    const id = parseInt(request.params.id); // Corrected typo here

    fs.readFile(nodeJsonPath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading file:', err);
            response.status(500).send('Internal Server Error');
            return;
        }

        let jsonData = [];
        try {
            jsonData = JSON.parse(data);
        } catch (error) {
            console.error('Error parsing JSON:', error);
            response.status(400).send('Invalid JSON');
            return;
        }

        // Filter out the item with the matching ID
        const filteredData = jsonData.filter(item => item.id!== id);

        // Write the filtered data back to the file
        fs.writeFile(nodeJsonPath, JSON.stringify(filteredData, null, 2), (err) => {
            if (err) {
                console.error('Error writing file:', err);
                response.status(500).send('Internal Server Error');
                return;
            }

            response.status(200).send('Entry deleted successfully');
        });
    });
});



app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
  })
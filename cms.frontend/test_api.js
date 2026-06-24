const https = require('https');
const agent = new https.Agent({ rejectUnauthorized: false });

https.get('https://localhost:7004/api/products/categoryproduct/9', { agent }, (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
        console.log("Data:", data);
    });
}).on('error', err => console.log(err));

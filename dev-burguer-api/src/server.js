import app from './app.js';
import'./database/index.js';
import 'dotenv/config'

app.listen(3001, () => console.log('server is running at port 3001'));

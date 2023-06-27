import express, {Request,Response,Application} from 'express';
import { createConnection, Connection } from 'mysql2';
import bodyParser from 'body-parser';

import { setupDatabase } from './config/database';
import { todosRoutes } from './src/todos';

const app:Application = express();
const PORT = process.env.PORT || 8000;
const conn: Connection = createConnection({
    host: 'sql8.freesqldatabase.com',
    user: 'sql8628897',
    password: 'HE362xnknt',
    database: 'sql8628897',
    port: 3306,
});

app.use(express.static('public'));
app.use(bodyParser.json());

// Mount the API routes
app.use('/api', todosRoutes(conn));

/*this is a function that uses the connection you created to connect to your db*/
conn.connect((err: Error | null) =>{
    if (err){
        console.log("Cannot connect to database")
    }
    else{
        console.log("Successfully connected to database")
    }
});

setupDatabase(conn);

app.listen(PORT, ():void => {
    console.log(`Server Running here 👉 http://localhost:${PORT}`);
});
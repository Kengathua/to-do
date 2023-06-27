import { Connection } from 'mysql2';
import { createTodosTableQuery } from "./queries";

const executeQuery = (conn: Connection, query: string): void => {
  // Execute the query to create the table
  conn.query(query, (queryError: Error | null) => {
    if (queryError) {
      console.error('Error executing query:', queryError);
      return;
    }
    console.log('Table created successfully.');
  });
};

export function setupDatabase(connection: Connection){
  const queries: string[]= [createTodosTableQuery]
  for (let i=0; i < queries.length; i++){
    executeQuery(connection, queries[i]);
  }
};

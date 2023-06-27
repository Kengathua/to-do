export const createTodosTableQuery = `
    CREATE TABLE IF NOT EXISTS todos (
      id INT AUTO_INCREMENT PRIMARY KEY,
      order_id INT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP,
      title VARCHAR(300) NOT NULL,
      content VARCHAR(300) NOT NULL,
      category VARCHAR(300) NOT NULL,
      done BOOLEAN DEFAULT false
    )
`;
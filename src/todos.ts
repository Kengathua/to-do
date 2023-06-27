import express from 'express';
import { Connection } from 'mysql2';
import { Request, Response } from 'express';

type OrderedTODOData = {
    max_order_id: number,
}

type TODOData = {
    id: number,
    order_id: number
}

type TODOPayload = {
  title: string,
  content: string,
  category: string,
}

const todosRoutes = (conn: Connection) => {
    const router = express.Router();

    // Get all todos
    router.get('/todos', (req: Request, res:Response) => {
      const title = req.query.title;
      let query = 'SELECT * FROM todos ORDER BY order_id DESC';
      if (title) {
          query = `SELECT * FROM todos WHERE title LIKE '%${title}%' ORDER BY order_id DESC`;
        }

      conn.query(query, (error, results) => {
        if (error) {
            console.error('Failed to fetch todos', error);
            res.status(500).json({ error: 'Failed to fetch todos' });
        } else {
            res.json(results);
            console.log(results);
        }
      });
    });

    // Create a new todo
    router.post('/todos', (req: Request, res:Response) => {
        const now = new Date();
        let orderId = 0;
        let data: TODOPayload = {
          title: req?.body?.title || "",
          content: req?.body?.content || "",
          category: req?.body?.category || ""
        };
        console.log("The values are ", data);
        console.log("The request body is ", req?.body);

        const { title, content, category }: TODOPayload = req?.body || {};

        const query = 'INSERT INTO todos (order_id, created_at, updated_at, title, content, category) VALUES (?, ?, ?, ?, ?, ?)';
        const values = [orderId, now, now, title, content, category];
        console.log("The values are ", values);

        const maxOrderIdQuery = 'SELECT MAX(order_id) AS max_order_id FROM todos';
        conn.query(maxOrderIdQuery, (error: Error | null, result: OrderedTODOData[]) => {
            if (error) {
                console.error('Failed to get max order id:', error);
                res.status(404).json({ error: 'Failed to get max order id' });
                return;
            };

            const orderId = result[0].max_order_id + 1;
            console.log("Incremented the order id to", orderId);
            values[0] = orderId;

            conn.query(query, values, (error, result) => {
            if (error) {
                console.error('Failed to create todo:', error);
                res.status(500).json({ error: 'Failed to create todo' });
                return;
            }
            res.json(result);
            });
        });
    });

    // Update a todo
    router.put('/todos/:id', (req, res) => {
      const { title, content, category, done } = req?.body;
      const { id } = req.params;
      const now = new Date();

      const query = 'UPDATE todos SET updated_at = ?, title = ?, content = ?, category = ?, done = ? WHERE id = ?';
      const values = [now, title, content, category, done, id];

      conn.query(query, values, (error, result) => {
        if (error) {
          console.error('Failed to update todo', error);
          res.status(500).json({ error: 'Failed to update todo' });
        } else if ((result as any).affectedRows === 0) {
          res.status(404).json({ error: 'Todo not found' });
        } else {
          res.json(result);
        }
      });      
    });

    // Bulk update endpoint
    router.post('/todos/update_order', (req, res) => {
        const todos:TODOData[] = req?.body; // Array of todos with updated data

        // Prepare the SQL statement
        let sql = 'UPDATE todos SET order_id = CASE id ';

        // Create an array to store the values for each todo update
        const values = [];

        // Build the SQL statement and values array
        todos.forEach(todo => {
            const { id, order_id } = todo;
            sql += `WHEN ${id} THEN ? `;
            values.push(order_id);
        });

        sql += 'END WHERE id IN (?)';

        const ids = todos.map(todo => todo.id);
        values.push(ids);

        // Execute the bulk update operation
        conn.query(sql, values, (error, results) => {
            if (error) {
            console.error('Failed to update todos', error);
            res.status(500).json({ error: 'Failed to update todos' });
            } else {
            res.json({ message: 'Todos updated successfully' });
            }
        });
    });

    // Delete a todo
    router.delete('/todos/:id', (req, res) => {
      const { id } = req.params;

      const query = 'DELETE FROM todos WHERE id = ?';
      const values = [id];

      conn.query(query, values, (error, result) => {
        if (error) {
          console.error('Failed to delete todo', error);
          res.status(500).json({ error: 'Failed to delete todo' });
        } else if ((result as any).affectedRows === 0) {
            res.status(404).json({ error: 'Todo not found' });
        } else {
          res.json({ message: 'Todo deleted successfully' });
        }
      });
    });

    return router;
};

export { todosRoutes };

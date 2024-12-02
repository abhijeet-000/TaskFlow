from flask import Flask, request, jsonify  
from flask_cors import CORS  
from database import get_db_connection, init_db  

app = Flask(__name__)  
CORS(app)  

# Initialize database  
init_db()  

# Create a new task  
@app.route('/tasks', methods=['POST'])  
def create_task():  
    data = request.json  
    if 'title' not in data:  
        return jsonify({'error': 'Title is required'}), 400  

    conn = get_db_connection()  
    cursor = conn.cursor()  
    cursor.execute('''  
        INSERT INTO tasks (title, description, due_date, status)  
        VALUES (?, ?, ?, ?)  
    ''', (data['title'], data.get('description', ''),   
           data.get('due_date', ''), data.get('status', 'Pending')))  
    conn.commit()  
    task_id = cursor.lastrowid  
    conn.close()  
    return jsonify({'id': task_id}), 201  

# Get all tasks  
@app.route('/tasks', methods=['GET'])  
def get_tasks():  
    conn = get_db_connection()  
    cursor = conn.cursor()  
    cursor.execute('SELECT * FROM tasks')  
    tasks = [dict(task) for task in cursor.fetchall()]  
    conn.close()  
    return jsonify(tasks)  

# Update a task  
@app.route('/tasks/<int:task_id>', methods=['PUT'])  
def update_task(task_id):  
    data = request.json
    
    # Remove the title requirement
    conn = get_db_connection()
    cursor = conn.cursor()
    
    # Only update the status if provided
    if 'status' in data:
        cursor.execute('''
            UPDATE tasks 
            SET status=?
            WHERE id=?
        ''', (data['status'], task_id))
        conn.commit()
        conn.close()
        return jsonify({'success': True})
    
    conn.close()
    return jsonify({'error': 'No status provided'}), 400

# Delete a task  
@app.route('/tasks/<int:task_id>', methods=['DELETE'])  
def delete_task(task_id):  
    conn = get_db_connection()  
    cursor = conn.cursor()  
    cursor.execute('DELETE FROM tasks WHERE id=?', (task_id,))  
    conn.commit()  
    conn.close()  
    return jsonify({'success': True})  

if __name__ == '__main__':  
    app.run(debug=True)
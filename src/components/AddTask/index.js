import React, { useState, useEffect } from 'react';
import Header from '../Header';

import './index.css';

const AddTask = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [status, setStatus] = useState('pending'); // Default status
  const [tasks, setTasks] = useState([]);
  const [error, setError] = useState('');
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editingTaskData, setEditingTaskData] = useState({});
  
  // Filters
  const [filterStatus, setFilterStatus] = useState('all'); // Filter by status
  const [sortByDueDate, setSortByDueDate] = useState('none'); // Sorting option

  const fetchTasks = async () => {
    const storedTasks = JSON.parse(localStorage.getItem('tasks')) || [];
    setTasks(storedTasks);
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // Handle task creation
  const createTask = async (e) => {
    e.preventDefault();

    if (!title || !description || !dueDate) {
      setError('All fields (Title, Description, Due Date, and Status) are required.');
      return;
    }

    const newTask = {
      id: Date.now(),
      title,
      description,
      dueDate,
      status,
    };

    const updatedTasks = [...tasks, newTask];
    setTasks(updatedTasks);
    localStorage.setItem('tasks', JSON.stringify(updatedTasks));

    setTitle('');
    setDescription('');
    setDueDate('');
    setStatus('pending');
    setError('');
  };

  // Handle status change
  const changeStatus = async (taskId, newStatus) => {
    const updatedTasks = tasks.map((task) =>
      task.id === taskId ? { ...task, status: newStatus } : task
    );
    setTasks(updatedTasks);
    localStorage.setItem('tasks', JSON.stringify(updatedTasks));
  };

  // Delete Task
  const deleteTask = async (taskId) => {
    const updatedTasks = tasks.filter((task) => task.id !== taskId);
    setTasks(updatedTasks);
    localStorage.setItem('tasks', JSON.stringify(updatedTasks));
  };

  // Start editing a task
  const startEditing = (taskId) => {
    const taskToEdit = tasks.find((task) => task.id === taskId);
    setEditingTaskId(taskId);
    setEditingTaskData({ ...taskToEdit });
  };

  // Handle editing input changes
  const handleEditChange = (field, value) => {
    setEditingTaskData({ ...editingTaskData, [field]: value });
  };

  // Save edited task
  const saveEditedTask = () => {
    const updatedTasks = tasks.map((task) =>
      task.id === editingTaskId ? { ...task, ...editingTaskData } : task
    );
    setTasks(updatedTasks);
    localStorage.setItem('tasks', JSON.stringify(updatedTasks));
    setEditingTaskId(null);
    setEditingTaskData({});
  };

  // Cancel editing
  const cancelEditing = () => {
    setEditingTaskId(null);
    setEditingTaskData({});
  };

  // Filter and sort tasks
  const getFilteredAndSortedTasks = () => {
    let filteredTasks = tasks;

    // Apply status filter
    if (filterStatus !== 'all') {
      filteredTasks = filteredTasks.filter((task) => task.status === filterStatus);
    }

    // Apply sorting by due date
    if (sortByDueDate === 'asc') {
      filteredTasks.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
    } else if (sortByDueDate === 'desc') {
      filteredTasks.sort((a, b) => new Date(b.dueDate) - new Date(a.dueDate));
    }

    return filteredTasks;
  };

  const filteredAndSortedTasks = getFilteredAndSortedTasks();

  return (
    <>
      <Header />
      <div className="add-task-container">
        <h2>Create Task</h2>
        <form onSubmit={createTask}>
          <div className="form-group">
            <label>Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter task title"
              required
            />
          </div>
          <div className="form-group">
            <label>Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter task description"
              required
            />
          </div>
          <div className="form-group">
            <label>Due Date</label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              required
            >
              <option value="pending">Pending</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          </div>
          <button type="submit">Create Task</button>
        </form>
        {error && <p className="error">{error}</p>}

        <h2>My Tasks</h2>
        <div className="filters">
          <label className='filter-by-status'>Status Filter:</label>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="all">All</option>
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>

          <label className='sort-by-date'>Sort by Due Date:</label>
          <select
            value={sortByDueDate}
            onChange={(e) => setSortByDueDate(e.target.value)}
          >
            <option value="none">None</option>
            <option value="asc">Ascending</option>
            <option value="desc">Descending</option>
          </select>
        </div>
        <table className="task-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Description</th>
              <th>Due Date</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredAndSortedTasks.length > 0 ? (
              filteredAndSortedTasks.map((task) =>
                editingTaskId === task.id ? (
                  <tr key={task.id}>
                    <td>
                      <input
                        type="text"
                        value={editingTaskData.title}
                        onChange={(e) => handleEditChange('title', e.target.value)}
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        value={editingTaskData.description}
                        onChange={(e) => handleEditChange('description', e.target.value)}
                      />
                    </td>
                    <td>
                      <input
                        type="date"
                        value={editingTaskData.dueDate}
                        onChange={(e) => handleEditChange('dueDate', e.target.value)}
                      />
                    </td>
                    <td>
                      <select
                        value={editingTaskData.status}
                        onChange={(e) => handleEditChange('status', e.target.value)}
                      >
                        <option value="pending">Pending</option>
                        <option value="in-progress">In Progress</option>
                        <option value="completed">Completed</option>
                      </select>
                    </td>
                    <td>
                      <button onClick={saveEditedTask}>Save</button>
                      <button onClick={cancelEditing}>Cancel</button>
                    </td>
                  </tr>
                ) : (
                  <tr key={task.id}>
                    <td>{task.title}</td>
                    <td>{task.description}</td>
                    <td>{task.dueDate}</td>
                    <td>
                      <select
                        value={task.status}
                        onChange={(e) => changeStatus(task.id, e.target.value)}
                      >
                        <option value="pending">Pending</option>
                        <option value="in-progress">In Progress</option>
                        <option value="completed">Completed</option>
                      </select>
                    </td>
                    <td>
                      <button onClick={() => startEditing(task.id)}>Edit</button>
                      <button onClick={() => deleteTask(task.id)}>Delete</button>
                    </td>
                  </tr>
                )
              )
            ) : (
              <tr>
                <td colSpan="5">No tasks available</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default AddTask;




// import React, { useState, useEffect } from 'react';
// import Header from '../Header';

// import './index.css';

// const AddTask = () => {
//   const [title, setTitle] = useState('');
//   const [description, setDescription] = useState('');
//   const [dueDate, setDueDate] = useState('');
//   const [status, setStatus] = useState('pending'); // Default status
//   const [tasks, setTasks] = useState([]);
//   const [error, setError] = useState('');
//   const [editingTaskId, setEditingTaskId] = useState(null); // ID of the task being edited
//   const [editingTaskData, setEditingTaskData] = useState({}); // Data of the task being edited

//   const fetchTasks = async () => {
//     const storedTasks = JSON.parse(localStorage.getItem('tasks')) || [];
//     setTasks(storedTasks);
//   };

//   useEffect(() => {
//     fetchTasks();
//   }, []);

//   // Handle task creation
//   const createTask = async (e) => {
//     e.preventDefault();

//     if (!title || !description || !dueDate) {
//       setError('All fields (Title, Description, Due Date, and Status) are required.');
//       return;
//     }

//     const newTask = {
//       id: Date.now(), // Unique ID based on timestamp
//       title,
//       description,
//       dueDate,
//       status,
//     };

//     const updatedTasks = [...tasks, newTask];
//     setTasks(updatedTasks);
//     localStorage.setItem('tasks', JSON.stringify(updatedTasks));

//     // Reset form fields
//     setTitle('');
//     setDescription('');
//     setDueDate('');
//     setStatus('pending');
//     setError('');
//   };

//   // Handle status change
//   const changeStatus = async (taskId, newStatus) => {
//     const updatedTasks = tasks.map((task) =>
//       task.id === taskId ? { ...task, status: newStatus } : task
//     );
//     setTasks(updatedTasks);
//     localStorage.setItem('tasks', JSON.stringify(updatedTasks));
//   };

//   // Delete Task
//   const deleteTask = async (taskId) => {
//     const updatedTasks = tasks.filter((task) => task.id !== taskId);
//     setTasks(updatedTasks);
//     localStorage.setItem('tasks', JSON.stringify(updatedTasks));
//   };

//   // Start editing a task
//   const startEditing = (taskId) => {
//     const taskToEdit = tasks.find((task) => task.id === taskId);
//     setEditingTaskId(taskId);
//     setEditingTaskData({ ...taskToEdit });
//   };

//   // Handle editing input changes
//   const handleEditChange = (field, value) => {
//     setEditingTaskData({ ...editingTaskData, [field]: value });
//   };

//   // Save edited task
//   const saveEditedTask = () => {
//     const updatedTasks = tasks.map((task) =>
//       task.id === editingTaskId ? { ...task, ...editingTaskData } : task
//     );
//     setTasks(updatedTasks);
//     localStorage.setItem('tasks', JSON.stringify(updatedTasks));
//     setEditingTaskId(null);
//     setEditingTaskData({});
//   };

//   // Cancel editing
//   const cancelEditing = () => {
//     setEditingTaskId(null);
//     setEditingTaskData({});
//   };

//   return (
//     <>
//       <Header />
//       <div className="add-task-container">
//         <h2>Create Task</h2>
//         <form onSubmit={createTask}>
//           <div className="form-group">
//             <label>Title</label>
//             <input
//               type="text"
//               value={title}
//               onChange={(e) => setTitle(e.target.value)}
//               placeholder="Enter task title"
//               required
//             />
//           </div>
//           <div className="form-group">
//             <label>Description</label>
//             <textarea
//               value={description}
//               onChange={(e) => setDescription(e.target.value)}
//               placeholder="Enter task description"
//               required
//             />
//           </div>
//           <div className="form-group">
//             <label>Due Date</label>
//             <input
//               type="date"
//               value={dueDate}
//               onChange={(e) => setDueDate(e.target.value)}
//               required
//             />
//           </div>
//           <div className="form-group">
//             <label>Status</label>
//             <select
//               value={status}
//               onChange={(e) => setStatus(e.target.value)}
//               required
//             >
//               <option value="pending">Pending</option>
//               <option value="in-progress">In Progress</option>
//               <option value="completed">Completed</option>
//             </select>
//           </div>
//           <button type="submit">Create Task</button>
//         </form>
//         {error && <p className="error">{error}</p>}

//         <h2>My Tasks</h2>
//         <table className="task-table">
//           <thead>
//             <tr>
//               <th>Title</th>
//               <th>Description</th>
//               <th>Due Date</th>
//               <th>Status</th>
//               <th>Action</th>
//             </tr>
//           </thead>
//           <tbody>
//             {tasks.length > 0 ? (
//               tasks.map((task) =>
//                 editingTaskId === task.id ? (
//                   <tr key={task.id}>
//                     <td>
//                       <input
//                         type="text"
//                         value={editingTaskData.title}
//                         onChange={(e) => handleEditChange('title', e.target.value)}
//                       />
//                     </td>
//                     <td>
//                       <input
//                         type="text"
//                         value={editingTaskData.description}
//                         onChange={(e) => handleEditChange('description', e.target.value)}
//                       />
//                     </td>
//                     <td>
//                       <input
//                         type="date"
//                         value={editingTaskData.dueDate}
//                         onChange={(e) => handleEditChange('dueDate', e.target.value)}
//                       />
//                     </td>
//                     <td>
//                       <select
//                         value={editingTaskData.status}
//                         onChange={(e) => handleEditChange('status', e.target.value)}
//                       >
//                         <option value="pending">Pending</option>
//                         <option value="in-progress">In Progress</option>
//                         <option value="completed">Completed</option>
//                       </select>
//                     </td>
//                     <td>
//                       <button onClick={saveEditedTask}>Save</button>
//                       <button onClick={cancelEditing}>Cancel</button>
//                     </td>
//                   </tr>
//                 ) : (
//                   <tr key={task.id}>
//                     <td>{task.title}</td>
//                     <td>{task.description}</td>
//                     <td>{task.dueDate}</td>
//                     <td>
//                       <select
//                         value={task.status}
//                         onChange={(e) => changeStatus(task.id, e.target.value)}
//                       >
//                         <option value="pending">Pending</option>
//                         <option value="in-progress">In Progress</option>
//                         <option value="completed">Completed</option>
//                       </select>
//                     </td>
//                     <td>
//                       <button onClick={() => startEditing(task.id)}>Edit</button>
//                       <button onClick={() => deleteTask(task.id)}>Delete</button>
//                     </td>
//                   </tr>
//                 )
//               )
//             ) : (
//               <tr>
//                 <td colSpan="5">No tasks available</td>
//               </tr>
//             )}
//           </tbody>
//         </table>
//       </div>
//     </>
//   );
// };

// export default AddTask;
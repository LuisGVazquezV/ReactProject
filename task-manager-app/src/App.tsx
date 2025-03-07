import React, { useState, useEffect } from 'react';
import { Button, TextField, Box, CssBaseline, ThemeProvider, createTheme, Switch } from '@mui/material';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import TaskList from './components/TaskList';
import TaskAltIcon from '@mui/icons-material/TaskAlt';

type Task = {
  id: number;
  name: string;
  completed: boolean;
};

const App: React.FC = () => {
  const [taskName, setTaskName] = useState<string>(''); // Name of the task being added
  const [tasks, setTasks] = useState<Task[]>([]); // Array of tasks
  const [editingTaskId, setEditingTaskId] = useState<number | null>(null); // Track the task being edited
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false); // State for dark mode

  // Light and dark theme configuration
  const theme = createTheme({
    palette: {
      mode: isDarkMode ? 'dark' : 'light',
      primary: {
        main: '#2E8B57', // Blue
      },
      secondary: {
        main: '#228B22', // Gray
      },
      background: {
        default: isDarkMode ? '#2F4F4F' : '#F0FFF0 ', // Dark or light background
      },
      text: {
        primary: isDarkMode ? '#FFFFFF' : '#006400', // Text color for light/dark mode
      },
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            '&:hover': {
              backgroundColor: '#1976d2', // Hover effect for buttons
              color: '#fff',
            },
          },
        },
      },
      MuiCheckbox: {
        styleOverrides: {
          root: {
            '&:checked': {
              color: '#1976d2', // Checkbox color on checked
            },
            '&:hover': {
              backgroundColor: 'rgba(25, 118, 210, 0.08)', // Hover effect for checkboxes
            },
          },
        },
      },
    },
  });

  // Load tasks from localStorage on initial load
  useEffect(() => {
    const savedTasks = localStorage.getItem('tasks');
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks));
    }
  }, []);

  // Save tasks to localStorage whenever tasks change
  useEffect(() => {
    if (tasks.length > 0) {
      localStorage.setItem('tasks', JSON.stringify(tasks));
    }
  }, [tasks]);

  // Handle adding a new task
  const handleAddTask = (): void => {
    if (taskName.trim() === '') return;

    const newTask: Task = {
      id: tasks.length + 1,
      name: taskName,
      completed: false, // New tasks are not completed by default
    };

    setTasks((prevTasks) => [...prevTasks, newTask]);
    setTaskName('');
  };

  // Handle toggling the completion status of a task
  const handleToggleComplete = (id: number): void => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  // Handle removing a task
  const handleRemoveTask = (id: number): void => {
    setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id));
  };

  // Start editing a task
  const handleEditTask = (id: number, name: string): void => {
    setEditingTaskId(id);
    setTaskName(name);
  };

  // Save edited task
  const handleSaveEdit = (): void => {
    if (editingTaskId !== null && taskName.trim() !== '') {
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === editingTaskId ? { ...task, name: taskName } : task
        )
      );
      setEditingTaskId(null);
      setTaskName('');
    }
  };

  // Toggle dark/light mode
  const toggleDarkMode = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsDarkMode(event.target.checked);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline /> {/* To apply the global styles and theme */}
      <Router>
        <Box sx={{ flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', padding: '20px', width: '100vw' }}>
          <Box sx={{ padding: '20px', maxWidth: 400, margin: '0 auto' }}>

            {/* Task Manager Icon above the text */}
            <Box sx={{ marginBottom: 2 }}>
              <TaskAltIcon sx={{ alignItems: 'center', justifyContent: 'center', fontSize: 40, color: '#0077B6' }} />
            </Box>
            <h1>Task Manager</h1>

            {/* Dark Mode Slider at Top Right */}
            <Box sx={{ position: 'absolute', top: 16, right: 16 }}>
              <Switch checked={isDarkMode} onChange={toggleDarkMode} />
            </Box>

            {/* Task input field */}
            <TextField
              label={editingTaskId ? 'Edit Task' : 'New Task'}
              variant="outlined"
              fullWidth
              value={taskName}
              onChange={(e) => setTaskName(e.target.value)}
              sx={{ marginBottom: 2 }}
              data-testid="task-input"
            />

            {/* Add or Save task button */}
            <Button
              variant="contained"
              color="primary"
              onClick={editingTaskId ? handleSaveEdit : handleAddTask}
              fullWidth
              data-testid="add-task-button"
            >
              {editingTaskId ? 'Save Edit' : 'Add Task'}
            </Button>

            {/* Navigation Links */}
            <Box sx={{ marginTop: 2, display: 'flex', justifyContent: 'center', gap: '10px' }}>
              <Link to="/" style={{ textDecoration: 'none' }}>
                <Button variant="outlined" data-testid="all-tasks-link">
                  All Tasks
                </Button>
              </Link>
              <Link to="/active" style={{ textDecoration: 'none' }}>
                <Button variant="outlined" data-testid="active-tasks-link">
                  Active Tasks
                </Button>
              </Link>
              <Link to="/completed" style={{ textDecoration: 'none' }}>
                <Button variant="outlined" data-testid="completed-tasks-link">
                  Completed Tasks
                </Button>
              </Link>
            </Box>

            {/* Routes */}
            <Routes>
              <Route
                path="/"
                element={
                  <TaskList
                    tasks={tasks}
                    handleToggleComplete={handleToggleComplete}
                    handleRemoveTask={handleRemoveTask}
                    handleEditTask={handleEditTask}
                  />
                }
              />
              <Route
                path="/active"
                element={
                  <TaskList
                    tasks={tasks.filter((task) => !task.completed)}
                    handleToggleComplete={handleToggleComplete}
                    handleRemoveTask={handleRemoveTask}
                    handleEditTask={handleEditTask}
                  />
                }
              />
              <Route
                path="/completed"
                element={
                  <TaskList
                    tasks={tasks.filter((task) => task.completed)}
                    handleToggleComplete={handleToggleComplete}
                    handleRemoveTask={handleRemoveTask}
                    handleEditTask={handleEditTask}
                  />
                }
              />
            </Routes>
          </Box>
        </Box>
      </Router>
    </ThemeProvider>
  );
};

export default App;

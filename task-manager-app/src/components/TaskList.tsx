import { Button, List, ListItem, ListItemText, Checkbox } from '@mui/material';
import React from 'react';

type Task = {

    id: number;
    name: string;
    completed: boolean;
  };

interface TaskListProps {
    tasks: Task[];
    handleToggleComplete: (id: number) => void;
    handleRemoveTask: (id: number) => void;
    handleEditTask: (id: number, name: string) => void;
}


const TaskList: React.FC<TaskListProps> = ({
    tasks,
    handleToggleComplete,
    handleRemoveTask,
    handleEditTask,
  }) => (
    <List sx={{ marginTop: 2 }}>
      {tasks.map((task) => (
        <ListItem key={task.id} sx={{ display: 'flex', alignItems: 'center' }}>
          <Checkbox
            checked={task.completed}
            onChange={() => handleToggleComplete(task.id)}
            sx={{ marginRight: 1 }}
          />
          <ListItemText primary={task.name} />
          <Button
            variant="outlined"
            onClick={() => handleEditTask(task.id, task.name)}
            sx={{ marginLeft:2, marginRight: 2, '&:hover': {
                  backgroundColor: '#28a745 ',
                  borderColor: '#2C6B31',
                }, }}
          >
            Edit
          </Button>
          <Button variant="outlined" color="error" onClick={() => handleRemoveTask(task.id)} sx={{
                '&:hover': {
                  backgroundColor: '#c62828',
                  borderColor: '#C62828'
                },
              }} >
            Remove
          </Button>
        </ListItem>
      ))}
    </List>
  );

export default TaskList;

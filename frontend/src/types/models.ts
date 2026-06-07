export interface Item {
  id: string;
  title: string;
  description: string;
  is_completed: boolean;
  created_at: string;
  tasks?: Task[];
}

export interface Task {
  id: string;
  task_id: string; 
  title: string;
  is_completed: boolean;
  created_at: string;
}
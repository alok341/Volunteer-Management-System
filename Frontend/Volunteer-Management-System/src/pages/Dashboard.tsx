import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { getTasks, createTask, updateTask, deleteTask } from "@/services/api";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Loader2, Plus, Pencil, Trash2, User, Mail, Clock, Award, CheckCircle, XCircle } from "lucide-react";
interface Task {
  id: string;
  title: string;
  description: string;
  status: string;
  createdAt?: string;
}

const statusColors: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-800 border-yellow-300",
  IN_PROGRESS: "bg-blue-100 text-blue-800 border-blue-300",
  COMPLETED: "bg-green-100 text-green-800 border-green-300",
};

// Default color for unknown statuses
const defaultStatusColor = "bg-gray-100 text-gray-800 border-gray-300";

const Dashboard = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("PENDING");
  const [submitting, setSubmitting] = useState(false);

const fetchTasks = async () => {
  setLoading(true);
  try {
    const res = await getTasks();
    // If your API returns array directly
    setTasks(res.data as Task[]);
  } catch (error) {
    toast({ 
      title: "Failed to fetch tasks", 
      variant: "destructive" 
    });
  } finally {
    setLoading(false);
  }
};

  useEffect(() => { 
    fetchTasks(); 
  }, []);

  const resetForm = () => {
    setTitle(""); 
    setDescription(""); 
    setStatus("PENDING"); 
    setEditingTask(null);
  };

  const openCreate = () => { 
    resetForm(); 
    setFormOpen(true); 
  };
  
  const openEdit = (task: Task) => {
    setEditingTask(task); 
    setTitle(task.title); 
    setDescription(task.description || ""); 
    setStatus(task.status); 
    setFormOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) { 
      toast({ title: "Title is required", variant: "destructive" }); 
      return; 
    }
    
    setSubmitting(true);
    try {
      if (editingTask) {
        await updateTask(editingTask.id, { title, description, status });
        toast({ title: "Success", description: "Task updated successfully!" });
      } else {
        await createTask({ title, description, status });
        toast({ title: "Success", description: "Task created successfully!" });
      }
      setFormOpen(false); 
      resetForm(); 
      fetchTasks();
    } catch (err: any) {
      toast({ 
        title: "Error", 
        description: err.response?.data?.error || err.response?.data?.message || "Something went wrong", 
        variant: "destructive" 
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteTask(id);
      toast({ title: "Success", description: "Task deleted successfully" });
      fetchTasks();
    } catch (error) {
      toast({ 
        title: "Failed to delete task", 
        description: error instanceof Error ? error.message : "Unknown error",
        variant: "destructive" 
      });
    }
  };

  const getStatusColor = (status: string) => {
    return statusColors[status] || defaultStatusColor;
  };

  return (
    <div className="mx-auto max-w-7xl space-y-6 px-4 py-8">
      {/* Profile Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="flex items-center gap-3 pt-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
              <User className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Welcome</p>
              <p className="font-semibold">{user?.name || "User"}</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="flex items-center gap-3 pt-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
              <Mail className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Email</p>
              <div className="flex items-center gap-1.5">
                <p className="text-sm font-medium">{user?.email}</p>
                {user?.emailVerified ? (  // Fixed: emailVerified instead of verified
                  <CheckCircle className="h-4 w-4 text-green-500" />
                ) : (
                  <XCircle className="h-4 w-4 text-red-500" />
                )}
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="flex items-center gap-3 pt-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
              <Award className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Impact Score</p>
              <p className="font-semibold">{user?.impactScore ?? 0}</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="flex items-center gap-3 pt-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
              <Clock className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Hours</p>
              <p className="font-semibold">{user?.totalHours ?? 0}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tasks Section */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>My Tasks</CardTitle>
            <CardDescription>
              {tasks.length} task{tasks.length !== 1 ? 's' : ''} found
            </CardDescription>
          </div>
          <Dialog open={formOpen} onOpenChange={(open) => { 
            setFormOpen(open); 
            if (!open) resetForm(); 
          }}>
            <DialogTrigger asChild>
              <Button onClick={openCreate}>
                <Plus className="mr-1.5 h-4 w-4" />
                New Task
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{editingTask ? "Edit Task" : "Create New Task"}</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input 
                    id="title"
                    value={title} 
                    onChange={(e) => setTitle(e.target.value)} 
                    placeholder="Enter task title" 
                    disabled={submitting}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea 
                    id="description"
                    value={description} 
                    onChange={(e) => setDescription(e.target.value)} 
                    placeholder="Enter task description" 
                    disabled={submitting}
                    rows={3}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select value={status} onValueChange={setStatus} disabled={submitting}>
                    <SelectTrigger id="status">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="PENDING">Pending</SelectItem>
                      <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                      <SelectItem value="COMPLETED">Completed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <Button type="submit" className="w-full" disabled={submitting}>
                  {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {editingTask ? "Update Task" : "Create Task"}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </CardHeader>
        
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : tasks.length === 0 ? (
            <div className="py-12 text-center">
              <p className="text-muted-foreground">No tasks yet.</p>
              <Button 
                variant="link" 
                onClick={openCreate}
                className="mt-2"
              >
                Create your first task
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead className="hidden sm:table-cell">Description</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="hidden md:table-cell">Created</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tasks.map((task) => (
                    <TableRow key={task.id}>
                      <TableCell className="font-medium">{task.title}</TableCell>
                      <TableCell className="hidden max-w-[200px] truncate sm:table-cell">
                        {task.description || "—"}
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant="outline" 
                          className={getStatusColor(task.status)}
                        >
                          {task.status.replace('_', ' ')}
                        </Badge>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        {task.createdAt 
                          ? new Date(task.createdAt).toLocaleDateString() 
                          : "—"}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => openEdit(task)}
                            title="Edit task"
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className="text-destructive hover:text-destructive"
                                title="Delete task"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Delete Task?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to delete "{task.title}"? 
                                  This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction 
                                  onClick={() => handleDelete(task.id)}
                                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                >
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
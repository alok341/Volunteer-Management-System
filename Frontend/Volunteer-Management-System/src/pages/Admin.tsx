import { useState, useEffect } from "react";
import { getAllUsers, deleteUser, getAllTasksAdmin } from "@/services/api";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Loader2, Trash2, Users, ListTodo, CheckCircle, XCircle } from "lucide-react";

// Define interfaces
interface UserItem {
  id: string;
  name: string;
  email: string;
  role: string;
  emailVerified?: boolean;
}

interface TaskItem {
  id: string;
  title: string;
  description: string;
  status: string;
  createdAt?: string;
  userId?: string;
}

const statusColors: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-800 border-yellow-300",
  IN_PROGRESS: "bg-blue-100 text-blue-800 border-blue-300",
  COMPLETED: "bg-green-100 text-green-800 border-green-300",
};

const defaultStatusColor = "bg-gray-100 text-gray-800 border-gray-300";

const Admin = () => {
  const { toast } = useToast();
  const [users, setUsers] = useState<UserItem[]>([]);
  const [tasks, setTasks] = useState<TaskItem[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [loadingTasks, setLoadingTasks] = useState(false);

  // Fixed fetchUsers function
  const fetchUsers = async () => {
    setLoadingUsers(true);
    try {
      const res = await getAllUsers();
      // Type assertion to help TypeScript
      const data = res.data as any;
      
      // Handle different response structures
      let usersData: UserItem[] = [];
      
      if (Array.isArray(data)) {
        usersData = data;
      } else if (data?.users && Array.isArray(data.users)) {
        usersData = data.users;
      } else if (data?.content && Array.isArray(data.content)) {
        usersData = data.content;
      } else if (data?.data && Array.isArray(data.data)) {
        usersData = data.data;
      } else {
        usersData = [];
        console.warn("Unexpected users API response:", data);
      }
      
      setUsers(usersData);
    } catch (error) {
      toast({ 
        title: "Failed to fetch users", 
        description: error instanceof Error ? error.message : "Unknown error",
        variant: "destructive" 
      });
    } finally {
      setLoadingUsers(false);
    }
  };

  // Fixed fetchAllTasks function
  const fetchAllTasks = async () => {
    setLoadingTasks(true);
    try {
      const res = await getAllTasksAdmin();
      // Type assertion to help TypeScript
      const data = res.data as any;
      
      // Handle different response structures
      let tasksData: TaskItem[] = [];
      
      if (Array.isArray(data)) {
        tasksData = data;
      } else if (data?.tasks && Array.isArray(data.tasks)) {
        tasksData = data.tasks;
      } else if (data?.content && Array.isArray(data.content)) {
        tasksData = data.content;
      } else if (data?.data && Array.isArray(data.data)) {
        tasksData = data.data;
      } else {
        tasksData = [];
        console.warn("Unexpected tasks API response:", data);
      }
      
      setTasks(tasksData);
    } catch (error) {
      toast({ 
        title: "Failed to fetch tasks", 
        description: error instanceof Error ? error.message : "Unknown error",
        variant: "destructive" 
      });
    } finally {
      setLoadingTasks(false);
    }
  };

  useEffect(() => { 
    fetchUsers(); 
  }, []);

  const handleDeleteUser = async (id: string) => {
    try {
      await deleteUser(id);
      toast({ 
        title: "Success", 
        description: "User deleted successfully" 
      });
      fetchUsers();
    } catch (error) {
      toast({ 
        title: "Failed to delete user", 
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
      <h1 className="text-3xl font-bold">Admin Panel</h1>

      <Tabs defaultValue="users">
        <TabsList>
          <TabsTrigger value="users" className="gap-1.5">
            <Users className="h-4 w-4" />
            Users
          </TabsTrigger>
          <TabsTrigger 
            value="tasks" 
            className="gap-1.5" 
            onClick={() => { 
              if (tasks.length === 0) fetchAllTasks(); 
            }}
          >
            <ListTodo className="h-4 w-4" />
            All Tasks
          </TabsTrigger>
        </TabsList>

        <TabsContent value="users">
          <Card>
            <CardHeader>
              <CardTitle>All Users</CardTitle>
              <CardDescription>
                {users.length} user{users.length !== 1 ? 's' : ''} registered
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loadingUsers ? (
                <div className="flex justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : users.length === 0 ? (
                <p className="py-12 text-center text-muted-foreground">
                  No users found.
                </p>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Verified</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {users.map((user) => (
                        <TableRow key={user.id}>
                          <TableCell className="font-medium">{user.name}</TableCell>
                          <TableCell>{user.email}</TableCell>
                          <TableCell>
                            <Badge variant={user.role === "ADMIN" ? "default" : "secondary"}>
                              {user.role}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {user.emailVerified ? (
                              <CheckCircle className="h-4 w-4 text-green-500" />
                            ) : (
                              <XCircle className="h-4 w-4 text-red-500" />
                            )}
                          </TableCell>
                          <TableCell className="text-right">
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button 
                                  variant="ghost" 
                                  size="icon" 
                                  className="text-destructive hover:text-destructive"
                                  title="Delete user"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Delete User?</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    This will permanently delete {user.name} and all their tasks. 
                                    This action cannot be undone.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction 
                                    onClick={() => handleDeleteUser(user.id)}
                                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                  >
                                    Delete
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tasks">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>All Tasks</CardTitle>
                <CardDescription>
                  {tasks.length} task{tasks.length !== 1 ? 's' : ''} from all users
                </CardDescription>
              </div>
              <Button variant="outline" size="sm" onClick={fetchAllTasks}>
                Refresh
              </Button>
            </CardHeader>
            <CardContent>
              {loadingTasks ? (
                <div className="flex justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : tasks.length === 0 ? (
                <p className="py-12 text-center text-muted-foreground">
                  No tasks found.
                </p>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Title</TableHead>
                        <TableHead className="hidden sm:table-cell">Description</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="hidden md:table-cell">Created</TableHead>
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
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Admin;
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { ArrowRight, Shield, Users, ListTodo } from "lucide-react";

const Index = () => {
  const { token } = useAuth();

  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col">
      {/* Hero Section */}
      <section className="flex flex-1 flex-col items-center justify-center px-4 py-16 text-center">
        <h1 className="mb-4 text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
          Task<span className="text-primary">Manager</span>
        </h1>
        <p className="mb-8 max-w-2xl text-base text-muted-foreground sm:text-lg">
          A simple task management system with authentication, role-based access, and complete CRUD operations.
        </p>
        <div className="flex flex-col gap-3 sm:flex-row">
          {token ? (
            <Button size="lg" asChild>
              <Link to="/dashboard">
                Dashboard <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          ) : (
            <>
              <Button size="lg" asChild>
                <Link to="/register">
                  Get Started <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link to="/login">Sign In</Link>
              </Button>
            </>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="border-t bg-muted/30 px-4 py-16">
        <div className="mx-auto max-w-5xl">
          <h2 className="mb-8 text-center text-2xl font-semibold">Features</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {/* Feature 1 */}
            <div className="rounded-lg border bg-card p-6 transition-shadow hover:shadow-md">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mb-2 font-semibold">User Management</h3>
              <p className="text-sm text-muted-foreground">
                Register, login, and manage profiles with role-based access control.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="rounded-lg border bg-card p-6 transition-shadow hover:shadow-md">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <ListTodo className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mb-2 font-semibold">Task Management</h3>
              <p className="text-sm text-muted-foreground">
                Create, update, delete, and track tasks with status (Pending, In Progress, Completed).
              </p>
            </div>

            {/* Feature 3 */}
            <div className="rounded-lg border bg-card p-6 transition-shadow hover:shadow-md sm:col-span-2 lg:col-span-1">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mb-2 font-semibold">Admin Panel</h3>
              <p className="text-sm text-muted-foreground">
                Admin-only access to manage users and view all tasks across the system.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-card py-6 text-center text-sm text-muted-foreground">
        <p>Backend Developer Intern Assignment • Built with React & TypeScript</p>
      </footer>
    </div>
  );
};

export default Index;
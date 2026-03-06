import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { LogOut, Menu, X, Shield, LayoutDashboard, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const Navbar = () => {
  const { user, token, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="sticky top-0 z-50 border-b bg-card/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
        <Link to="/" className="text-xl font-bold text-primary">
          VolunteerHub
        </Link>

        {/* Desktop */}
        <div className="hidden items-center gap-1 md:flex">
          <Button variant="ghost" size="sm" asChild>
            <Link to="/"><Home className="mr-1.5 h-4 w-4" />Home</Link>
          </Button>
          {token && (
            <Button variant="ghost" size="sm" asChild>
              <Link to="/dashboard"><LayoutDashboard className="mr-1.5 h-4 w-4" />Dashboard</Link>
            </Button>
          )}
          {isAdmin && (
            <Button variant="ghost" size="sm" asChild>
              <Link to="/admin"><Shield className="mr-1.5 h-4 w-4" />Admin</Link>
            </Button>
          )}
          {token ? (
            <Button variant="outline" size="sm" onClick={handleLogout}>
              <LogOut className="mr-1.5 h-4 w-4" />Logout
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button variant="ghost" size="sm" asChild><Link to="/login">Login</Link></Button>
              <Button size="sm" asChild><Link to="/register">Register</Link></Button>
            </div>
          )}
        </div>

        {/* Mobile toggle */}
        <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setOpen(!open)}>
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="border-t bg-card p-4 md:hidden">
          <div className="flex flex-col gap-2">
            <Link to="/" onClick={() => setOpen(false)} className="rounded-md px-3 py-2 text-sm hover:bg-accent">Home</Link>
            {token && <Link to="/dashboard" onClick={() => setOpen(false)} className="rounded-md px-3 py-2 text-sm hover:bg-accent">Dashboard</Link>}
            {isAdmin && <Link to="/admin" onClick={() => setOpen(false)} className="rounded-md px-3 py-2 text-sm hover:bg-accent">Admin</Link>}
            {token ? (
              <button onClick={() => { handleLogout(); setOpen(false); }} className="rounded-md px-3 py-2 text-left text-sm text-destructive hover:bg-accent">Logout</button>
            ) : (
              <>
                <Link to="/login" onClick={() => setOpen(false)} className="rounded-md px-3 py-2 text-sm hover:bg-accent">Login</Link>
                <Link to="/register" onClick={() => setOpen(false)} className="rounded-md px-3 py-2 text-sm hover:bg-accent">Register</Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;

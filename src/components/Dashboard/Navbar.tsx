import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Plus, Command, User, Menu } from "lucide-react";
import { CommandPalette } from "./ComandPallete";
import logo from "@/assets/logo-reliability.png";
import { useNavigate } from "react-router-dom";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

import ProjectStore from "@/store/project.store";
import useAuthStore from "@/store/auth.store";

const NavbarAdmin = () => {
  const navigate = useNavigate();
  const { ProjectList, getAllProject } = ProjectStore();
  const { project, setProject } = useAuthStore();
  const [selectedProject, setSelectedProject] = useState("");
  const [isCommandOpen, setIsCommandOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setIsCommandOpen(true);
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    setSelectedProject(project?.activeProjectId ?? "");
    getAllProject();
  }, []);
  
  useEffect(() => {
    if (project) {
      setSelectedProject(project?.activeProjectId);
    }
  }, [project]);

  const handleSelectComand = (path: string) => {
    navigate(path);
    setIsMenuOpen(false);
  };

  const handleSelect = (id: string) => {
    setSelectedProject(id);
    const newProject = {
      activeProjectId: id,
    };
    setProject(newProject);
  };

  return (
    <div>
      <header className="sticky top-0 z-40 border-b border-white/10 bg-[#121A26]/50 backdrop-blur-md">
        <div className="container mx-auto px-4 md:px-6 py-2.5 md:py-4">
          <div className="flex items-center justify-between gap-3">
            {/* Left: Logo */}
            <div className="flex items-center gap-3">
              <img
                src={logo}
                alt="Reliability Lite"
                className="w-24 md:w-32 h-auto"
              />
            </div>

            {/* Center (Desktop): Project Switcher */}
            <div className="hidden md:flex items-center gap-2 rounded-2xl p-1">
              <Select value={selectedProject} onValueChange={handleSelect}>
                <SelectTrigger className="w-56 lg:w-64 bg-[#121A26] border-white/20 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-[#121A26] border-white/20 text-white">
                  {ProjectList?.map((item) => (
                    <SelectItem value={item.id} key={item.id}>
                      {item.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Badge
                variant="outline"
                className="border-[#00E5FF] text-[#00E5FF] bg-[#00E5FF]/10"
              >
                Free
              </Badge>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-2">
              {/* Create (Desktop only) */}
              <Button
                className="hidden md:inline-flex bg-[#00E5FF] text-black hover:bg-[#00E5FF]/90 rounded-xl hover-scale"
                size="sm"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Project
              </Button>

              {/* Command (always visible) */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsCommandOpen(true)}
                className="text-white/80 hover:text-white hover:bg-white/10 rounded-xl hover-scale"
                aria-label="Open command palette"
              >
                <Command className="w-4 h-4" />
                <span className="ml-2 text-xs hidden sm:inline">⌘K</span>
              </Button>

              {/* Avatar (always visible) */}
              <Avatar className="w-8 h-8 hover-scale cursor-pointer">
                <AvatarImage src="/placeholder.svg?height=32&width=32" />
                <AvatarFallback className="bg-[#9B5CFF] text-white">
                  <User className="w-4 h-4" />
                </AvatarFallback>
              </Avatar>

              {/* Mobile menu trigger */}
              <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
                <SheetTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="md:hidden text-white/80 hover:text-white hover:bg-white/10 rounded-xl hover-scale"
                    aria-label="Open menu"
                  >
                    <Menu className="w-5 h-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent
                  side="right"
                  className="w-[92vw] sm:w-[360px] bg-[#0F1622] border-white/10 text-white px-5"
                >
                  <div className="mt-6 space-y-6">
                    {/* Project switcher (Mobile) */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        <p className="text-xs text-white/60">Project</p>
                        <div>
                          <Badge
                            variant="outline"
                            className="border-[#00E5FF] text-[#00E5FF] bg-[#00E5FF]/10"
                          >
                            Free
                          </Badge>
                        </div>
                      </div>
                      <Select
                        value={selectedProject}
                        onValueChange={setSelectedProject}
                      >
                        <SelectTrigger className="w-full bg-[#121A26] border-white/20 text-white">
                          <SelectValue placeholder="Select project" />
                        </SelectTrigger>
                        <SelectContent className="bg-[#121A26] border-white/20 text-white">
                          <SelectItem value="reliability-lite">
                            Reliability Lite
                          </SelectItem>
                          <SelectItem value="monitoring-pro">
                            Monitoring Pro
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Actions */}
                    <div className="space-y-3">
                      <Button
                        className="w-full bg-[#00E5FF] text-black hover:bg-[#00E5FF]/90 rounded-xl hover-scale"
                        onClick={() => {
                          // arahkan ke halaman create project jika ada
                          // navigate("/projects/new");
                          setIsMenuOpen(false);
                        }}
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Create Project
                      </Button>

                      <Button
                        variant="outline"
                        className="w-full text-black rounded-xl hover-scale"
                        onClick={() => {
                          setIsCommandOpen(true);
                          setIsMenuOpen(false);
                        }}
                      >
                        <Command className="w-4 h-4 mr-2" />
                        Open Command (⌘K)
                      </Button>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </header>

      <CommandPalette
        open={isCommandOpen}
        onOpenChange={setIsCommandOpen}
        onNavigate={(path) => {
          handleSelectComand(path);
        }}
      />
    </div>
  );
};

export default NavbarAdmin;

import { useState } from "react"
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import { Activity, AlertTriangle, BarChart3,  Plus, Settings,  Users, Webhook } from "lucide-react"
import { listed } from "@/constant/listed"

interface CommandPaletteProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onNavigate: (path: string) => void
}

export function CommandPalette({ open, onOpenChange, onNavigate }: CommandPaletteProps) {
  const [searchValue, setSearchValue] = useState("")

  const commands = [
    {
      group: "Navigations",
      items: [
        { icon: BarChart3, label: "Dashboard", value: "dashboard", path: listed.dashboard},
        { icon: Activity, label: "Check List", value: "checks", path: listed.http },
        { icon: Webhook, label: "Webhook", value: "webhook", path: listed.webhook },
        { icon: AlertTriangle, label: "Incidents", value: "incidents", path: listed.incident },
        { icon: Settings, label: "Settings", value: "settings", path: "/settings" },
      ],
    },
    {
      group: "Quick Actions",
      items: [
        { icon: Plus, label: "Create Check", value: "create-http", path: "/checks/new?type=http" },
        { icon: Plus, label: "Create Webhook", value: "create-heartbeat", path: "/checks/new?type=heartbeat" },
        { icon: Users, label: "Invite Team", value: "invite-team", path: "/team/invite" },
      ],
    },
   
  ]

  const handleSelect = (path: string) => {
    onNavigate(path)
    onOpenChange(false)
    setSearchValue("")
  }

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange} className="glass-card bg-[#121A26] border-[#00E5FF]/20">
    
      <CommandInput
        placeholder="Type a command or search..."
        value={searchValue}
        onValueChange={setSearchValue}
        className="glass-card text-white "
      />
      <CommandList className="bg-[#121A26] border-t border-[#00E5FF]/20 text-white">
        <CommandEmpty className="text-muted-foreground py-6">No results found.</CommandEmpty>

        {commands.map((group) => (
          <CommandGroup key={group.group} heading={group.group} className="text-white ">
            {group.items.map((item) => (
              <CommandItem
                key={item.value}
                value={item.value}
                onSelect={() => handleSelect(item.path)}
                className="text-white cursor-pointer"
              >
                <item.icon className="mr-2 h-4 w-4" />
                <span>{item.label}</span>
              </CommandItem>
            ))}
          </CommandGroup>
        ))}
      </CommandList>
    </CommandDialog>
  )
}

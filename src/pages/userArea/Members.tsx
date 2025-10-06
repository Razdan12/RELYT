import { Link, useNavigate } from "react-router-dom";
import { listed } from "@/constant/listed";
import { useEffect } from "react";
import useMemberStore from "@/store/member.store";
import useAuthStore from "@/store/auth.store";

export default function Members() {
  const navigate = useNavigate();
  const { project } = useAuthStore();
  const { members, isLoading, error, GetMembers } = useMemberStore();

  useEffect(() => {
    if (!project?.activeProjectId) return;
    GetMembers(project.activeProjectId);
  }, [project?.activeProjectId]);

  return (
    <div>
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Members</h2>
        <Link to={listed.addMember} className="btn btn-primary">
          Add member
        </Link>
      </div>

      <div className="mt-6">
        {isLoading && <div className="text-sm text-muted-foreground">Loading...</div>}
        {error && <div className="text-sm text-red-400">{error}</div>}

        {!isLoading && !error && (!members || members.length === 0) && (
          <div className="text-sm text-muted-foreground">No members yet.</div>
        )}

        {!isLoading && members && members.length > 0 && (
          <div className="space-y-2">
            {members.map((m: any) => (
              <div key={m.email} className="p-2 rounded border flex items-center justify-between">
                <div>
                  <div className="font-medium">{m.email}</div>
                  <div className="text-sm text-muted-foreground">{m.role}</div>
                </div>
                <div>
                  {/* future: actions like revoke, change role */}
                  <button className="btn btn-ghost btn-sm" onClick={() => navigate(listed.addMember)}>
                    Edit
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

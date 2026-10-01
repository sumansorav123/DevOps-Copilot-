import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import api from "../services/api";
import { unwrapResponse } from "../utils/incidentWorkflow";

const ROLES = ["Administrator", "Incident Responder", "Viewer"];

function TeamAccess() {
  const navigate = useNavigate();
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({ name: "", email: "", role: "Viewer" });
  const [edit, setEdit] = useState({ role: "Viewer", status: "Active" });

  useEffect(() => {
    let cancelled = false;
    api.teamMembers()
      .then((response) => {
        if (!cancelled) setMembers(unwrapResponse(response) || []);
      })
      .catch((requestError) => {
        if (!cancelled) setError(requestError.message || "Team directory unavailable.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, []);

  async function addMember(event) {
    event.preventDefault();
    setBusy(true);
    setError("");
    try {
      const response = unwrapResponse(await api.addTeamMember(form));
      setMembers((current) => [...current, response]);
      setForm({ name: "", email: "", role: "Viewer" });
      setShowAddForm(false);
    } catch (requestError) {
      setError(requestError.message || "Could not add team member.");
    } finally {
      setBusy(false);
    }
  }

  async function saveMember(memberId) {
    setBusy(true);
    setError("");
    try {
      const response = unwrapResponse(await api.updateTeamMember(memberId, edit));
      setMembers((current) => current.map((member) => member.id === memberId ? response : member));
      setEditingId(null);
    } catch (requestError) {
      setError(requestError.message || "Could not update team member.");
    } finally {
      setBusy(false);
    }
  }

  async function removeMember(memberId) {
    setBusy(true);
    setError("");
    try {
      await api.deleteTeamMember(memberId);
      setMembers((current) => current.filter((member) => member.id !== memberId));
    } catch (requestError) {
      setError(requestError.message || "Could not remove team member.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#0d1117] text-white"><div className="flex min-h-screen"><Sidebar /><main className="flex-1 p-8">
      <button onClick={() => navigate("/settings")} className="mb-5 text-sm text-gray-400 hover:text-white">← Back to Settings</button>
      <h1 className="text-3xl font-bold tracking-tight">Team & Access</h1>
      <p className="mt-2 text-sm text-gray-400">Manage the persisted prototype team directory.</p>
      <p className="mt-4 rounded-md border border-yellow-500/20 bg-yellow-500/5 p-3 text-sm text-yellow-100">Roster roles are directory metadata only; this prototype has no login or server-side role enforcement.</p>
      {error && <p role="alert" className="mt-5 text-sm text-red-300">{error}</p>}
      {loading ? <p role="status" className="mt-6 text-sm text-gray-400">Loading team members...</p> : <>
        <div className="mt-7 grid gap-4 md:grid-cols-3"><div className="rounded-lg border border-[#252a31] bg-[#171b20] p-5"><p className="text-xs uppercase text-gray-500">Team Members</p><p className="mt-2 text-2xl">{members.length}</p></div><div className="rounded-lg border border-[#252a31] bg-[#171b20] p-5"><p className="text-xs uppercase text-gray-500">Active</p><p className="mt-2 text-2xl">{members.filter((member) => member.status === "Active").length}</p></div><div className="rounded-lg border border-[#252a31] bg-[#171b20] p-5"><p className="text-xs uppercase text-gray-500">Administrators</p><p className="mt-2 text-2xl">{members.filter((member) => member.role === "Administrator").length}</p></div></div>
        <div className="mt-8 flex flex-wrap items-center justify-between gap-4"><div><h2 className="text-xl font-semibold">Team Members</h2><p className="mt-1 text-sm text-gray-400">Changes persist in the backend JSON directory.</p></div><button disabled={busy} onClick={() => setShowAddForm((value) => !value)} className="rounded-md bg-white px-4 py-2 text-sm font-semibold text-black">{showAddForm ? "Cancel" : "Add Member"}</button></div>
        {showAddForm && <form onSubmit={addMember} className="mt-5 grid gap-3 rounded-lg border border-[#30363d] bg-[#171b20] p-5 md:grid-cols-4"><input required value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} placeholder="Name" className="rounded border border-[#30363d] bg-[#0d1117] px-3 py-2 text-sm"/><input required type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} placeholder="Email" className="rounded border border-[#30363d] bg-[#0d1117] px-3 py-2 text-sm"/><select value={form.role} onChange={(event) => setForm({ ...form, role: event.target.value })} className="rounded border border-[#30363d] bg-[#0d1117] px-3 py-2 text-sm">{ROLES.map((role) => <option key={role}>{role}</option>)}</select><button disabled={busy} className="rounded bg-green-400 px-4 py-2 text-sm font-semibold text-black">{busy ? "Saving..." : "Add Member"}</button></form>}
        <div className="mt-5 space-y-3">{members.map((member) => <article key={member.id} className="rounded-lg border border-[#252a31] bg-[#171b20] p-5"><div className="flex flex-wrap items-center justify-between gap-4"><div><h3 className="font-semibold">{member.name}</h3><p className="mt-1 text-sm text-gray-400">{member.email} · {member.access}</p></div><p className="text-sm">{member.role} · {member.status}</p><div className="flex gap-2"><button disabled={busy} onClick={() => { setEditingId(member.id); setEdit({ role: member.role, status: member.status }); }} className="rounded border border-[#444b53] px-3 py-2 text-sm">Manage</button><button disabled={busy} onClick={() => removeMember(member.id)} className="rounded border border-red-500/40 px-3 py-2 text-sm text-red-300">Remove</button></div></div>{editingId === member.id && <div className="mt-4 flex flex-wrap items-end gap-3 border-t border-[#30363d] pt-4"><label className="text-xs text-gray-400">Role<select value={edit.role} onChange={(event) => setEdit({ ...edit, role: event.target.value })} className="mt-1 block rounded border border-[#30363d] bg-[#0d1117] px-3 py-2 text-sm">{ROLES.map((role) => <option key={role}>{role}</option>)}</select></label><label className="text-xs text-gray-400">Status<select value={edit.status} onChange={(event) => setEdit({ ...edit, status: event.target.value })} className="mt-1 block rounded border border-[#30363d] bg-[#0d1117] px-3 py-2 text-sm"><option>Active</option><option>Inactive</option></select></label><button disabled={busy} onClick={() => saveMember(member.id)} className="rounded bg-green-400 px-4 py-2 text-sm font-semibold text-black">Save</button><button onClick={() => setEditingId(null)} className="rounded border border-[#444b53] px-4 py-2 text-sm">Cancel</button></div>}</article>)}</div>
      </>}
    </main></div></div>
  );
}

export default TeamAccess;

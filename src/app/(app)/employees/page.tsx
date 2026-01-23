"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";

import { formatDate } from "@/lib/utils";
import { employeesApi, Employee } from "@/lib/api";
import { useMemo, useState, useEffect } from "react";
import {
    Users,
    UserCheck,
    UserPlus,
    Search,
    Filter,
    MoreVertical,
    Edit2,
    Trash2,
    Briefcase,
    Phone,
    Mail,
    Calendar,
    IndianRupee,
    Award,
    BookOpen,
    Clock
} from "lucide-react";

const statusColors: Record<string, string> = {
    Active: "bg-emerald-50 text-emerald-700 border-emerald-100",
    "On Permission": "bg-amber-50 text-amber-700 border-amber-100",
    Resigned: "bg-slate-100 text-slate-700 border-slate-200",
};

const roleColors: Record<string, string> = {
    Trainer: "bg-blue-50 text-blue-700 border-blue-100",
    Reception: "bg-purple-50 text-purple-700 border-purple-100",
    Manager: "bg-indigo-50 text-indigo-700 border-indigo-100",
    Cleaner: "bg-slate-50 text-slate-700 border-slate-200",
};

export default function EmployeesPage() {
    const [list, setList] = useState<Employee[]>([]);
    const [loading, setLoading] = useState(true);
    const [query, setQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState<string>("All");
    const [roleFilter, setRoleFilter] = useState<string>("All");
    const [editing, setEditing] = useState<Employee | null>(null);
    const [openCreate, setOpenCreate] = useState(false);
    const [confirmDelete, setConfirmDelete] = useState<Employee | null>(null);

    const [form, setForm] = useState({
        name: "",
        email: "",
        phone: "",
        role: "Trainer" as Employee["role"],
        gender: "Male" as Employee["gender"],
        salaryType: "Monthly" as Employee["salaryType"],
        baseSalary: 0,
        status: "Active" as Employee["status"],
        joiningDate: new Date().toISOString().slice(0, 10),
        specialization: "",
        bio: "",
        experience: "",
    });

    const loadEmployees = async () => {
        try {
            setLoading(true);
            const response = await employeesApi.getAll();
            if (response.success && response.data) {
                setList(response.data);
            }
        } catch (error) {
            console.error("Error loading employees:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadEmployees();
    }, []);

    const stats = useMemo(() => {
        return {
            total: list.length,
            trainers: list.filter(e => e.role === 'Trainer').length,
            active: list.filter(e => e.status === 'Active').length,
        };
    }, [list]);

    const filtered = useMemo(() => {
        return list.filter((emp) => {
            const matchesQuery =
                emp.name.toLowerCase().includes(query.toLowerCase()) ||
                emp.email.toLowerCase().includes(query.toLowerCase()) ||
                emp.employeeId.toLowerCase().includes(query.toLowerCase());
            const matchesStatus = statusFilter === "All" || emp.status === statusFilter;
            const matchesRole = roleFilter === "All" || emp.role === roleFilter;
            return matchesQuery && matchesStatus && matchesRole;
        });
    }, [list, query, statusFilter, roleFilter]);

    const resetForm = () => {
        setForm({
            name: "",
            email: "",
            phone: "",
            role: "Trainer",
            gender: "Male",
            salaryType: "Monthly",
            baseSalary: 0,
            status: "Active",
            joiningDate: new Date().toISOString().slice(0, 10),
            specialization: "",
            bio: "",
            experience: "",
        });
    };

    const handleSave = async () => {
        if (!form.name || !form.email || !form.phone) {
            alert("Please fill in all required fields");
            return;
        }

        try {
            if (editing) {
                const response = await employeesApi.update(editing._id, form);
                if (response.success) {
                    loadEmployees();
                    setEditing(null);
                    setOpenCreate(false);
                    resetForm();
                }
            } else {
                const response = await employeesApi.create(form);
                if (response.success) {
                    loadEmployees();
                    setOpenCreate(false);
                    resetForm();
                }
            }
        } catch (error: any) {
            console.error("Error saving employee:", error);
            alert(error.message || "Failed to save employee");
        }
    };

    const startEdit = (emp: Employee) => {
        setEditing(emp);
        setForm({
            name: emp.name,
            email: emp.email,
            phone: emp.phone,
            role: emp.role,
            gender: emp.gender || "Male",
            salaryType: emp.salaryType,
            baseSalary: emp.baseSalary,
            status: emp.status,
            joiningDate: new Date(emp.joiningDate).toISOString().slice(0, 10),
            specialization: emp.specialization || "",
            bio: emp.bio || "",
            experience: emp.experience || "",
        });
        setOpenCreate(true);
    };

    const handleDelete = async () => {
        if (!confirmDelete) return;
        try {
            const response = await employeesApi.delete(confirmDelete._id);
            if (response.success) {
                loadEmployees();
                setConfirmDelete(null);
            }
        } catch (error: any) {
            console.error("Error deleting employee:", error);
            alert(error.message || "Failed to delete employee");
        }
    };

    return (
        <div className="space-y-6 pb-10 animate-in fade-in duration-500">
            {/* Header Section */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <div className="h-2 w-2 rounded-full bg-blue-600 animate-pulse" />
                        <p className="text-xs font-bold uppercase tracking-wider text-blue-600">Staff Management</p>
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
                        Employee Master
                    </h2>
                    <p className="text-sm text-slate-500 mt-1">Manage, track and organize your gym staff and trainers.</p>
                </div>

                <Button
                    onClick={() => setOpenCreate(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-100 transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                    <div className="flex items-center gap-2">
                        <UserPlus className="w-4 h-4 mr-2" />
                        <span>Add New Employee</span>
                    </div>
                </Button>

            </div>

            {/* Stats Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="p-5 border-none bg-white shadow-sm ring-1 ring-slate-200/60 hover:ring-blue-200 transition-all group">
                    <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 group-hover:scale-110 transition-transform">
                            <Users className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-slate-500">Total Staff</p>
                            <p className="text-2xl font-bold text-slate-900">{stats.total}</p>
                        </div>
                    </div>
                </Card>
                <Card className="p-5 border-none bg-white shadow-sm ring-1 ring-slate-200/60 hover:ring-indigo-200 transition-all group">
                    <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 group-hover:scale-110 transition-transform">
                            <Award className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-slate-500">Active Trainers</p>
                            <p className="text-2xl font-bold text-slate-900">{stats.trainers}</p>
                        </div>
                    </div>
                </Card>
                <Card className="p-5 border-none bg-white shadow-sm ring-1 ring-slate-200/60 hover:ring-emerald-200 transition-all group">
                    <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600 group-hover:scale-110 transition-transform">
                            <UserCheck className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-slate-500">Currently Active</p>
                            <p className="text-2xl font-bold text-slate-900">{stats.active}</p>
                        </div>
                    </div>
                </Card>
            </div>

            {/* Main Table Container */}
            <div className="bg-white border border-slate-200/60 rounded-2xl overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.04)] ring-1 ring-slate-200/50">
                {/* Refined Filter Bar */}
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between px-6 py-6 bg-gradient-to-b from-slate-50/80 to-white border-b border-slate-100">
                    <div>
                        <h2 className="text-lg font-bold text-slate-800 tracking-tight">Staff Directory</h2>
                        <p className="text-xs text-slate-500 font-medium">Manage and monitor your team members</p>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                        <div className="relative group">
                            <Search className="absolute left-3 top-1/3 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                            <Input
                                placeholder="Search staff..."
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                className="pl-10 w-full md:w-64 bg-slate-100/50 border-transparent focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all rounded-xl font-medium text-sm"
                            />
                        </div>

                        <div className="flex gap-2">
                            <select
                                className="text-xs font-bold text-slate-600 bg-slate-100/50 hover:bg-slate-100 px-3 py-2 rounded-xl outline-none transition-colors cursor-pointer border-none"
                                value={roleFilter}
                                onChange={(e) => setRoleFilter(e.target.value)}
                            >
                                <option value="All">All Roles</option>
                                <option value="Trainer">Trainer</option>
                                <option value="Manager">Manager</option>
                            </select>

                            <select
                                className="bg-slate-100/50 border-transparent focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all rounded-xl px-4 py-2 text-sm font-semibold text-slate-700 outline-none appearance-none cursor-pointer"
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                            >
                                <option value="All Status">All Status</option>
                                <option value="Active">Active</option>
                                <option value="On Permission">On Permission</option>
                                <option value="Resigned">Resigned</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Semantic Table */}
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50/50 border-b border-slate-100">
                                <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Employee</th>
                                <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Role & Status</th>
                                <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Contact</th>
                                <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Salary</th>
                                <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Joining Date</th>
                                <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {loading ? (
                                [...Array(5)].map((_, i) => (
                                    <tr key={i} className="animate-pulse">
                                        <td colSpan={6} className="px-6 py-4">
                                            <div className="flex gap-4 items-center">
                                                <div className="h-10 w-10 bg-slate-100 rounded-xl" />
                                                <div className="flex-1 space-y-2">
                                                    <div className="h-4 bg-slate-100 rounded w-1/4" />
                                                    <div className="h-3 bg-slate-50 rounded w-1/6" />
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : filtered.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-20 text-center">
                                        <div className="flex flex-col items-center gap-3 text-slate-400">
                                            <Users className="w-10 h-10 text-slate-200" />
                                            <p className="text-sm font-medium">No employees found matching your criteria</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                filtered.map((emp) => (
                                    <tr key={emp._id} className="hover:bg-slate-50/50 transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-4">
                                                <div className={`h-11 w-11 rounded-2xl flex items-center justify-center text-sm font-bold shadow-sm transition-transform group-hover:scale-105 ${roleColors[emp.role]} border-2 border-white`}>
                                                    {emp.name.charAt(0)}
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{emp.name}</span>
                                                    <span className="text-[11px] font-semibold text-slate-400">ID: {emp.employeeId}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col gap-2">
                                                <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-tight w-fit ${roleColors[emp.role]}`}>
                                                    {emp.role}
                                                </span>
                                                <span className={`flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[10px] font-bold w-fit bg-white border shadow-sm ${statusColors[emp.status]}`}>
                                                    <span className={`h-1.5 w-1.5 rounded-full animate-pulse ${emp.status === 'Active' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                                                    {emp.status}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-2 text-[12px] text-slate-600 font-medium">
                                                    <div className="p-1 bg-slate-100 rounded-md"><Phone className="w-3 h-3 text-slate-500" /></div>
                                                    {emp.phone}
                                                </div>
                                                <div className="flex items-center gap-2 text-[12px] text-slate-400">
                                                    <div className="p-1 bg-slate-100 rounded-md"><Mail className="w-3 h-3 text-slate-500" /></div>
                                                    <span className="truncate max-w-[150px]">{emp.email}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col">
                                                <div className="flex items-center gap-1 text-sm font-black text-slate-800">
                                                    <span className="text-slate-400 font-normal">₹</span>
                                                    {emp.baseSalary.toLocaleString()}
                                                </div>
                                                <span className="text-[10px] font-bold text-blue-500/70">{emp.salaryType}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2 text-xs text-slate-500 font-semibold">
                                                <Calendar className="w-3.5 h-3.5" />
                                                {formatDate(emp.joiningDate)}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-1">
                                                <button onClick={() => startEdit(emp)} className="p-2.5 rounded-xl text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-all">
                                                    <Edit2 className="w-4 h-4" />
                                                </button>
                                                <button onClick={() => setConfirmDelete(emp)} className="p-2.5 rounded-xl text-slate-400 hover:text-red-600 hover:bg-red-50 transition-all">
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Add/Edit Modal */}
            <Modal
                open={openCreate}
                onClose={() => {
                    setOpenCreate(false);
                    setEditing(null);
                    resetForm();
                }}
                title={editing ? "Update Employee Profile" : "Onboard New Employee"}
                className="max-w-2xl"
            >
                <div className="space-y-6 py-2">
                    {/* Basic Information Section */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 pb-1 border-b border-slate-100">
                            <div className="h-6 w-1 rounded-full bg-blue-600" />
                            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Basic Information</h3>
                        </div>
                        <div className="grid gap-4 sm:grid-cols-2">
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-slate-700 uppercase ml-1">Full Name</label>
                                <Input
                                    placeholder="e.g. John Doe"
                                    value={form.name}
                                    onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                                    className="bg-slate-50/50 border-slate-200 focus:bg-white transition-all"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-slate-700 uppercase ml-1">Email Address</label>
                                <Input
                                    type="email"
                                    placeholder="e.g. john@example.com"
                                    value={form.email}
                                    onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                                    className="bg-slate-50/50 border-slate-200 focus:bg-white transition-all"
                                />
                            </div>
                        </div>
                        <div className="grid gap-4 sm:grid-cols-2">
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-slate-700 uppercase ml-1">Phone Number</label>
                                <Input
                                    placeholder="e.g. +91 98765 43210"
                                    value={form.phone}
                                    onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                                    className="bg-slate-50/50 border-slate-200 focus:bg-white transition-all"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-slate-700 uppercase ml-1">Gender</label>
                                <select
                                    className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-slate-50/50 transition-all"
                                    value={form.gender}
                                    onChange={(e) => setForm((f) => ({ ...f, gender: e.target.value as Employee["gender"] }))}
                                >
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                    <option value="Others">Others</option>
                                </select>
                            </div>
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-slate-700 uppercase ml-1">Designated Role</label>
                            <div className="relative">
                                <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                <select
                                    className="w-full text-sm border border-slate-200 rounded-lg pl-10 pr-3 py-2 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-slate-50/50 transition-all appearance-none"
                                    value={form.role}
                                    onChange={(e) => setForm((f) => ({ ...f, role: e.target.value as Employee["role"] }))}
                                >
                                    <option value="Trainer">Trainer</option>
                                    <option value="Reception">Reception</option>
                                    <option value="Manager">Manager</option>
                                    <option value="Cleaner">Cleaner</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Trainer Specific Section */}
                    {form.role === 'Trainer' && (
                        <div className="space-y-4 p-5 bg-blue-50/50 rounded-2xl border border-blue-100/50 animate-in slide-in-from-top-2 duration-300">
                            <div className="flex items-center gap-2 pb-1 border-b border-blue-100">
                                <Award className="w-4 h-4 text-blue-600" />
                                <h3 className="text-sm font-bold text-blue-900 uppercase tracking-wider">Trainer Credentials</h3>
                            </div>
                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-blue-700 uppercase ml-1">Specialization</label>
                                    <Input
                                        placeholder="e.g. Yoga, Bodybuilding"
                                        value={form.specialization}
                                        onChange={(e) => setForm((f) => ({ ...f, specialization: e.target.value }))}
                                        className="bg-white border-blue-200 focus:border-blue-500 transition-all"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-blue-700 uppercase ml-1">Experience</label>
                                    <div className="relative">
                                        <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-400" />
                                        <Input
                                            placeholder="e.g. 5+ Years"
                                            value={form.experience}
                                            onChange={(e) => setForm((f) => ({ ...f, experience: e.target.value }))}
                                            className="pl-10 bg-white border-blue-200 focus:border-blue-500 transition-all"
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-blue-700 uppercase ml-1">Professional Bio</label>
                                <div className="relative">
                                    <BookOpen className="absolute left-3 top-3 w-4 h-4 text-blue-400" />
                                    <textarea
                                        className="w-full text-sm border border-blue-200 rounded-lg pl-10 pr-3 py-2 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white min-h-[80px] transition-all"
                                        placeholder="Briefly describe the trainer's background and achievements..."
                                        value={form.bio}
                                        onChange={(e) => setForm((f) => ({ ...f, bio: e.target.value }))}
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Employment Details Section */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 pb-1 border-b border-slate-100">
                            <div className="h-6 w-1 rounded-full bg-indigo-600" />
                            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Employment Details</h3>
                        </div>
                        <div className="grid gap-4 sm:grid-cols-2">
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-slate-700 uppercase ml-1">Salary Type</label>
                                <select
                                    className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-slate-50/50 transition-all"
                                    value={form.salaryType}
                                    onChange={(e) => setForm((f) => ({ ...f, salaryType: e.target.value as Employee["salaryType"] }))}
                                >
                                    <option value="Monthly">Monthly Salary</option>
                                    <option value="Per-class">Per-class Commission</option>
                                    <option value="Per-hour">Hourly Rate</option>
                                </select>
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-slate-700 uppercase ml-1">Base Amount (₹)</label>
                                <div className="relative">
                                    <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                    <Input
                                        type="number"
                                        placeholder="0.00"
                                        value={form.baseSalary}
                                        onChange={(e) => setForm((f) => ({ ...f, baseSalary: Number(e.target.value) }))}
                                        className="pl-10 bg-slate-50/50 border-slate-200 focus:bg-white transition-all"
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="grid gap-4 sm:grid-cols-2">
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-slate-700 uppercase ml-1">Current Status</label>
                                <select
                                    className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-slate-50/50 transition-all"
                                    value={form.status}
                                    onChange={(e) => setForm((f) => ({ ...f, status: e.target.value as Employee["status"] }))}
                                >
                                    <option value="Active">Active</option>
                                    <option value="On Permission">On Permission</option>
                                    <option value="Resigned">Resigned</option>
                                </select>
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-slate-700 uppercase ml-1">Joining Date</label>
                                <div className="relative">
                                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                    <Input
                                        type="date"
                                        value={form.joiningDate}
                                        onChange={(e) => setForm((f) => ({ ...f, joiningDate: e.target.value }))}
                                        className="pl-10 bg-slate-50/50 border-slate-200 focus:bg-white transition-all"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                        <Button
                            variant="ghost"
                            onClick={() => {
                                setOpenCreate(false);
                                setEditing(null);
                                resetForm();
                            }}
                            className="text-slate-500 hover:text-slate-700 hover:bg-slate-100"
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleSave}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-8 shadow-lg shadow-blue-100 transition-all active:scale-95"
                        >
                            {editing ? "Save Changes" : "Confirm Onboarding"}
                        </Button>
                    </div>
                </div>
            </Modal>

            {/* Delete Confirmation Modal */}
            <Modal
                open={Boolean(confirmDelete)}
                onClose={() => setConfirmDelete(null)}
                title="Confirm Termination"
            >
                <div className="space-y-6 py-2">
                    <div className="flex flex-col items-center text-center gap-4">
                        <div className="h-16 w-16 rounded-full bg-red-50 flex items-center justify-center text-red-600 animate-bounce">
                            <Trash2 className="w-8 h-8" />
                        </div>
                        <div className="space-y-1">
                            <h3 className="text-lg font-bold text-slate-900">Remove Employee?</h3>
                            <p className="text-sm text-slate-500 max-w-[280px]">
                                Are you sure you want to remove <span className="font-bold text-slate-900">{confirmDelete?.name}</span>? This action will terminate their access and cannot be undone.
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3 pt-4">
                        <Button
                            variant="ghost"
                            className="flex-1 text-slate-500 hover:bg-slate-100"
                            onClick={() => setConfirmDelete(null)}
                        >
                            Keep Employee
                        </Button>
                        <Button
                            variant="secondary"
                            className="flex-1 bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-100"
                            onClick={handleDelete}
                        >
                            Yes, Terminate
                        </Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}

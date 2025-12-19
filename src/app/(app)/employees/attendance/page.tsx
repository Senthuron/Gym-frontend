"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { formatDate } from "@/lib/utils";
import { employeesApi, employeeAttendanceApi, Employee, EmployeeAttendance } from "@/lib/api";
import { useState, useEffect, useMemo } from "react";
import {
    Calendar as CalendarIcon,
    CheckCircle2,
    XCircle,
    Clock,
    Search,
    Save,
    Users,
    ChevronLeft,
    ChevronRight,
    AlertCircle,
    UserCheck,
    UserMinus,
    Loader2
} from "lucide-react";

const statusConfig = {
    Present: {
        color: "bg-emerald-50 text-emerald-700 border-emerald-100",
        icon: CheckCircle2,
        label: "Present"
    },
    "On Permission": {
        color: "bg-amber-50 text-amber-700 border-amber-100",
        icon: Clock,
        label: "On Permission"
    },
    Absent: {
        color: "bg-red-50 text-red-700 border-red-100",
        icon: XCircle,
        label: "Absent"
    }
};

export default function EmployeeAttendancePage() {
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [attendance, setAttendance] = useState<Record<string, { status: string; note: string }>>({});
    const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [query, setQuery] = useState("");

    const loadData = async () => {
        try {
            setLoading(true);
            const [empRes, attRes] = await Promise.all([
                employeesApi.getAll(),
                employeeAttendanceApi.getByDate(date)
            ]);

            if (empRes.success && empRes.data) {
                setEmployees(empRes.data);

                // Initialize attendance state
                const initialAttendance: Record<string, { status: string; note: string }> = {};

                // Set all to Present by default if no record exists
                empRes.data.forEach(emp => {
                    initialAttendance[emp._id] = { status: 'Present', note: '' };
                });

                // Overwrite with existing records
                if (attRes.success && attRes.data) {
                    attRes.data.forEach((rec: any) => {
                        const empId = typeof rec.employee === 'string' ? rec.employee : rec.employee._id;
                        initialAttendance[empId] = {
                            status: rec.status,
                            note: rec.note || ''
                        };
                    });
                }

                setAttendance(initialAttendance);
            }
        } catch (error) {
            console.error("Error loading attendance data:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, [date]);

    const filteredEmployees = useMemo(() => {
        return employees.filter(emp =>
            emp.name.toLowerCase().includes(query.toLowerCase()) ||
            emp.employeeId.toLowerCase().includes(query.toLowerCase()) ||
            emp.role.toLowerCase().includes(query.toLowerCase())
        );
    }, [employees, query]);

    const stats = useMemo(() => {
        const counts = { Present: 0, "On Permission": 0, Absent: 0 };
        Object.values(attendance).forEach(val => {
            if (counts[val.status as keyof typeof counts] !== undefined) {
                counts[val.status as keyof typeof counts]++;
            }
        });
        return counts;
    }, [attendance]);

    const handleStatusChange = (empId: string, status: string) => {
        setAttendance(prev => ({
            ...prev,
            [empId]: { ...prev[empId], status }
        }));
    };

    const handleSave = async () => {
        try {
            setSaving(true);
            const attendanceData = Object.entries(attendance).map(([employeeId, data]) => ({
                employeeId,
                status: data.status,
                note: data.note
            }));

            const response = await employeeAttendanceApi.mark(date, attendanceData);
            if (response.success) {
                alert("Attendance saved successfully!");
            }
        } catch (error: any) {
            console.error("Error saving attendance:", error);
            alert(error.message || "Failed to save attendance");
        } finally {
            setSaving(false);
        }
    };

    const changeDate = (days: number) => {
        const d = new Date(date);
        d.setDate(d.getDate() + days);
        setDate(d.toISOString().slice(0, 10));
    };

    return (
        <div className="space-y-6 pb-10 animate-in fade-in duration-500">
            {/* Header Section */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <div className="h-2 w-2 rounded-full bg-blue-600 animate-pulse" />
                        <p className="text-xs font-bold uppercase tracking-wider text-blue-600">Daily Operations</p>
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
                        Staff Attendance
                    </h2>
                    <p className="text-sm text-slate-500 mt-1">Mark and manage daily attendance for all gym employees.</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="flex items-center bg-white border border-slate-200 rounded-xl p-1 shadow-sm">
                        <Button variant="ghost" size="sm" onClick={() => changeDate(-1)} className="h-8 w-8 rounded-lg p-0">
                            <ChevronLeft className="w-4 h-4" />
                        </Button>
                        <div className="px-3 flex items-center gap-2">
                            <CalendarIcon className="w-4 h-4 text-slate-400" />
                            <input
                                type="date"
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                                className="text-sm font-bold text-slate-700 outline-none bg-transparent"
                            />
                        </div>
                        <Button variant="ghost" size="sm" onClick={() => changeDate(1)} className="h-8 w-8 rounded-lg p-0">
                            <ChevronRight className="w-4 h-4" />
                        </Button>
                    </div>
                    <Button
                        onClick={handleSave}
                        disabled={saving || loading}
                        className="bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-100 transition-all active:scale-95"
                    >
                        {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                        Save Attendance
                    </Button>
                </div>
            </div>

            {/* Stats Section */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className="p-5 border-none bg-white shadow-sm ring-1 ring-slate-200/60">
                    <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600">
                            <Users className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-slate-500">Total Staff</p>
                            <p className="text-2xl font-bold text-slate-900">{employees.length}</p>
                        </div>
                    </div>
                </Card>
                <Card className="p-5 border-none bg-white shadow-sm ring-1 ring-slate-200/60">
                    <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600">
                            <UserCheck className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-slate-500">Present</p>
                            <p className="text-2xl font-bold text-slate-900">{stats.Present}</p>
                        </div>
                    </div>
                </Card>
                <Card className="p-5 border-none bg-white shadow-sm ring-1 ring-slate-200/60">
                    <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-600">
                            <Clock className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-slate-500">On Permission</p>
                            <p className="text-2xl font-bold text-slate-900">{stats["On Permission"]}</p>
                        </div>
                    </div>
                </Card>
                <Card className="p-5 border-none bg-white shadow-sm ring-1 ring-slate-200/60">
                    <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-2xl bg-red-50 flex items-center justify-center text-red-600">
                            <UserMinus className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-slate-500">Absent</p>
                            <p className="text-2xl font-bold text-slate-900">{stats.Absent}</p>
                        </div>
                    </div>
                </Card>
            </div>

            {/* Main Content */}
            <Card className="overflow-hidden border-none bg-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] ring-1 ring-slate-200/50 rounded-2xl">
                <div className="px-6 py-6 bg-gradient-to-b from-slate-50/80 to-white border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h2 className="text-lg font-bold text-slate-800 tracking-tight">Attendance Sheet</h2>
                        <p className="text-xs text-slate-500 font-medium">{formatDate(date)}</p>
                    </div>
                    <div className="relative group">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                        <Input
                            placeholder="Search staff..."
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            className="pl-10 w-full md:w-64 bg-slate-100/50 border-transparent focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all rounded-xl font-medium text-sm"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50/50 border-b border-slate-100">
                                <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Employee</th>
                                <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Role</th>
                                <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Attendance Status</th>
                                <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Notes</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {loading ? (
                                [...Array(5)].map((_, i) => (
                                    <tr key={i} className="animate-pulse">
                                        <td colSpan={4} className="px-6 py-4">
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
                            ) : filteredEmployees.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="px-6 py-20 text-center">
                                        <div className="flex flex-col items-center gap-3 text-slate-400">
                                            <Users className="w-10 h-10 text-slate-200" />
                                            <p className="text-sm font-medium">No employees found</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                filteredEmployees.map((emp) => (
                                    <tr key={emp._id} className="hover:bg-slate-50/50 transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-4">
                                                <div className={`h-10 w-10 rounded-xl flex items-center justify-center text-sm font-bold shadow-sm ${emp.role === 'Trainer' ? 'bg-blue-50 text-blue-600' :
                                                    emp.role === 'Manager' ? 'bg-indigo-50 text-indigo-600' :
                                                        'bg-slate-50 text-slate-600'
                                                    } border border-white`}>
                                                    {emp.name.charAt(0)}
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-bold text-slate-900">{emp.name}</span>
                                                    <span className="text-[11px] font-semibold text-slate-400">ID: {emp.employeeId}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-tight w-fit ${emp.role === 'Trainer' ? 'bg-blue-50 text-blue-700 border border-blue-100' :
                                                emp.role === 'Manager' ? 'bg-indigo-50 text-indigo-700 border border-indigo-100' :
                                                    'bg-slate-50 text-slate-700 border border-slate-200'
                                                }`}>
                                                {emp.role}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                {(Object.keys(statusConfig) as Array<keyof typeof statusConfig>).map((status) => {
                                                    const config = statusConfig[status];
                                                    const Icon = config.icon;
                                                    const isActive = attendance[emp._id]?.status === status;

                                                    return (
                                                        <button
                                                            key={status}
                                                            onClick={() => handleStatusChange(emp._id, status)}
                                                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] font-bold transition-all border ${isActive
                                                                ? `${config.color} shadow-sm scale-105`
                                                                : "bg-white text-slate-400 border-slate-100 hover:border-slate-200 hover:text-slate-600"
                                                                }`}
                                                        >
                                                            <Icon className={`w-3.5 h-3.5 ${isActive ? "" : "opacity-50"}`} />
                                                            {config.label}
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <input
                                                type="text"
                                                placeholder="Add note..."
                                                value={attendance[emp._id]?.note || ""}
                                                onChange={(e) => setAttendance(prev => ({
                                                    ...prev,
                                                    [emp._id]: { ...prev[emp._id], note: e.target.value }
                                                }))}
                                                className="w-full bg-slate-50/50 border border-transparent focus:bg-white focus:border-slate-200 rounded-lg px-3 py-1.5 text-xs outline-none transition-all"
                                            />
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </Card>

            {/* Help/Info Section */}
            <div className="flex items-center gap-2 px-4 py-3 bg-blue-50/50 border border-blue-100/50 rounded-xl">
                <AlertCircle className="w-4 h-4 text-blue-600" />
                <p className="text-xs text-blue-700 font-medium">
                    Tip: Attendance is automatically set to "Present" for all employees by default. You only need to mark those who are "On Permission" or "Absent".
                </p>
            </div>
        </div>
    );
}

// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";

// const renderStat = (label, value, color) => (
//     <div style={styles.statCard}>
//         <h3 style={{ ...styles.statNumber, color }}>{value}</h3>
//         <p style={styles.statLabel}>{label}</p>
//     </div>
// );

// export default function AdminDashboard() {
//     const navigate = useNavigate();

//     const name = localStorage.getItem("name") || "Admin";
//     const email = localStorage.getItem("email") || "";

//     const [complaints, setComplaints] = useState([]);
//     const [investigators, setInvestigators] = useState([]);
//     const [activities, setActivities] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [closeModalVisible, setCloseModalVisible] = useState(false);
//     const [assignModalVisible, setAssignModalVisible] = useState(false);
//     const [modalComplaint, setModalComplaint] = useState(null);
//     const [selectedInvestigator, setSelectedInvestigator] = useState("");
//     const [closingId, setClosingId] = useState(null);
//     const [assigningId, setAssigningId] = useState(null);

//     /* ---------------- LOAD DATA ---------------- */

//     const loadDashboard = async () => {
//         try {
//             const results = await Promise.allSettled([
//                 axios.get("http://localhost:7000/api/complaint/all"),
//                 axios.get("http://localhost:7000/api/investigators"),
//                 axios.get("http://localhost:7000/api/case-activity/recent"),
//             ]);

//             const [complaintsRes, investigatorsRes, activityRes] = results;

//             if (complaintsRes.status === 'fulfilled') {
//                 setComplaints(complaintsRes.value.data || []);
//             } else {
//                 console.error('Failed to load complaints:', complaintsRes.reason);
//                 setComplaints([]);
//             }

//             if (investigatorsRes.status === 'fulfilled') {
//                 setInvestigators(investigatorsRes.value.data || []);
//             } else {
//                 console.error('Failed to load investigators:', investigatorsRes.reason);
//                 setInvestigators([]);
//             }

//             if (activityRes.status === 'fulfilled') {
//                 setActivities(activityRes.value.data || []);
//             } else {
//                 // activity endpoint may not exist on your backend; fail gracefully
//                 console.warn('Case activity endpoint unavailable:', activityRes.reason && activityRes.reason.message);
//                 setActivities([]);
//             }
//         } catch (err) {
//             console.error("Admin dashboard load error:", err);
//             setComplaints([]);
//             setInvestigators([]);
//             setActivities([]);
//         } finally {
//             setLoading(false);
//         }
//     };

//     useEffect(() => { loadDashboard(); }, []);

//     if (loading) {
//         return <h3 style={{ textAlign: "center" }}>Loading admin dashboard…</h3>;
//     }

//     /* ---------------- KPIs ---------------- */

//     const stats = {
//         total: complaints.length,
//         // consider unassigned as complaints without an assigned investigator OR marked Pending
//         unassigned: complaints.filter(c => !c.assignedTo || c.status === "Pending").length,
//         notStarted: complaints.filter(c => c.status === "Assigned").length,
//         inProgress: complaints.filter(c => c.status === "Open").length,
//         resolved: complaints.filter(c => c.status === "Resolved").length,
//         closed: complaints.filter(c => c.status === "Closed").length,
//     };

//     /* ---------------- RECENT DATA ---------------- */

//     const recentComplaints = [...(complaints || [])]
//         .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
//         .slice(0, 6);

//     const workload = (investigators || []).map(inv => {
//         const cases = (complaints || []).filter(c => c.assignedTo === inv.email);
//         return {
//             id: inv._id || inv.email,
//             name: inv.name,
//             notStarted: cases.filter(c => c.status === "Assigned").length,
//             inProgress: cases.filter(c => c.status === "Open").length,
//             resolved: cases.filter(c => c.status === "Resolved").length,
//             closed: cases.filter(c => c.status === "Closed").length,
//         };
//     });

//     /* ---------------- ACTION HANDLERS ---------------- */

//     const handleConfirmClose = async () => {
//         if (!modalComplaint) return;
//         setClosingId(modalComplaint._id);
//         try {
//             await axios.put(`http://localhost:7000/api/complaint/${modalComplaint._id}/close`);
//             await loadDashboard();
//             setCloseModalVisible(false);
//             setModalComplaint(null);
//         } catch (err) {
//             console.error('Close failed', err);
//         } finally {
//             setClosingId(null);
//         }
//     };

//     const handleConfirmAssign = async () => {
//         if (!modalComplaint || !selectedInvestigator) return;
//         setAssigningId(modalComplaint._id);
//         try {
//             await axios.put(`http://localhost:7000/api/complaint/${modalComplaint._id}/assign`, { assignedTo: selectedInvestigator });
//             await loadDashboard();
//             setAssignModalVisible(false);
//             setModalComplaint(null);
//             setSelectedInvestigator("");
//         } catch (err) {
//             console.error('Assign failed', err);
//         } finally {
//             setAssigningId(null);
//         }
//     };

//     /* ---------------- UI ---------------- */

//     return (
//         <div style={styles.page}>
//             <div style={styles.container}>

//                 <div style={styles.headerCard}>
//                     <div>
//                         <div style={styles.headerTitle}>Welcome back, {name}</div>
//                         <div style={styles.headerSub}>{email}</div>
//                     </div>

//                     <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
//                         <img alt="avatar" src={`https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=304FFE&color=fff&size=128`} style={styles.avatar} />
//                     </div>
//                 </div>

//                 <div style={styles.statsGrid}>
//                     {renderStat("Total Complaints", stats.total, "#304FFE")}
//                     {renderStat("Unassigned", stats.unassigned, "#FB8C00")}
//                     {renderStat("Not Started", stats.notStarted, "#3F51B5")}
//                     {renderStat("In Progress", stats.inProgress, "#0288D1")}
//                     {renderStat("Resolved", stats.resolved, "#2E7D32")}
//                     {renderStat("Closed", stats.closed, "#616161")}
//                 </div>

//                 {/* ===== RECENT COMPLAINTS ===== */}
//                 <div style={styles.section}>
//                     <h3>Recent Complaints</h3>

//                     <table style={styles.table}>
//                         <thead>
//                             <tr>
//                                 <th style={styles.th}>ID</th>
//                                 <th style={styles.th}>Type</th>
//                                 <th style={styles.th}>Status</th>
//                                 <th style={styles.th}>Assigned To</th>
//                                 <th style={styles.th}>Date</th>
//                                 <th style={styles.th} />
//                             </tr>
//                         </thead>
//                         <tbody>
//                             {recentComplaints.map(c => (
//                                 <tr key={c._id}>
//                                     <td style={styles.td}>{c.complaintId}</td>
//                                     <td style={styles.td}>{c.complaintType}</td>
//                                     <td style={styles.td}>{c.status}</td>
//                                     <td style={styles.td}>{c.assignedTo || "—"}</td>
//                                     <td style={styles.td}>{new Date(c.createdAt).toLocaleDateString()}</td>
//                                     <td style={styles.td}>
//                                         <div style={{ display: 'flex', gap: 8 }}>
//                                             <button style={styles.actionBtn} onClick={() => navigate(`/admin/complaints/${c._id}`)}>View</button>

//                                             {c.status === "Resolved" && (
//                                                 <button
//                                                     style={styles.ghostBtn}
//                                                     onClick={() => {
//                                                         setModalComplaint(c);
//                                                         setCloseModalVisible(true);
//                                                     }}
//                                                 >
//                                                     Close
//                                                 </button>
//                                             )}

//                                             {(!c.assignedTo || c.assignedTo === "") && (
//                                                 <button
//                                                     style={styles.ghostBtn}
//                                                     onClick={() => {
//                                                         setModalComplaint(c);
//                                                         setAssignModalVisible(true);
//                                                         setSelectedInvestigator("");
//                                                     }}
//                                                 >
//                                                     Assign
//                                                 </button>
//                                             )}
//                                         </div>
//                                     </td>
//                                 </tr>
//                             ))}
//                         </tbody>
//                     </table>
//                 </div>

//                 {/* ===== INVESTIGATOR WORKLOAD ===== */}
//                 <div style={styles.section}>
//                     <h3>Investigator Workload</h3>

//                     <table style={styles.table}>
//                         <thead>
//                             <tr>
//                                 <th style={styles.th}>Investigator</th>
//                                 <th style={styles.th}>Not Started</th>
//                                 <th style={styles.th}>In Progress</th>
//                                 <th style={styles.th}>Resolved</th>
//                                 <th style={styles.th}>Closed</th>
//                             </tr>
//                         </thead>
//                         <tbody>
//                             {workload.map((w) => (
//                                 <tr key={w.id}>
//                                     <td style={styles.td}>{w.name}</td>
//                                     <td style={styles.td}>{w.notStarted}</td>
//                                     <td style={styles.td}>{w.inProgress}</td>
//                                     <td style={styles.td}>{w.resolved}</td>
//                                     <td style={styles.td}>{w.closed}</td>
//                                 </tr>
//                             ))}
//                         </tbody>
//                     </table>
//                 </div>

//                 {/* ===== CASE ACTIVITY TIMELINE ===== */}
//                 <div style={styles.section}>
//                     <h3>Recent System Activity</h3>

//                     {activities.length === 0 ? (
//                         <p>No recent activity.</p>
//                     ) : (
//                         <ul style={styles.timeline}>
//                             {activities.map(a => (
//                                 <li key={a._id}>
//                                     <strong>{a.action}</strong>
//                                     {" — "}
//                                     {a.role} ({a.performedBy})
//                                     <div style={styles.time}>
//                                         {new Date(a.createdAt).toLocaleString()}
//                                     </div>
//                                 </li>
//                             ))}
//                         </ul>
//                     )}
//                 </div>

//                 {closeModalVisible && (
//                     <ConfirmCloseModal
//                         complaint={modalComplaint}
//                         onCancel={() => { setCloseModalVisible(false); setModalComplaint(null); }}
//                         onConfirm={handleConfirmClose}
//                         loading={closingId === (modalComplaint && modalComplaint._id)}
//                     />
//                 )}

//                 {assignModalVisible && (
//                     <AssignModal
//                         complaint={modalComplaint}
//                         investigators={investigators}
//                         selected={selectedInvestigator}
//                         setSelected={setSelectedInvestigator}
//                         onCancel={() => { setAssignModalVisible(false); setModalComplaint(null); }}
//                         onConfirm={handleConfirmAssign}
//                         loading={assigningId === (modalComplaint && modalComplaint._id)}
//                     />
//                 )}
//             </div>
//         </div>
//     );
// }

// /* ---------------- MODALS ---------------- */

// const ConfirmCloseModal = ({ complaint, onCancel, onConfirm, loading }) => {
//     if (!complaint) return null;
//     return (
//         <div style={styles.modalOverlay}>
//             <div style={styles.modal}>
//                 <h3>Close Complaint</h3>
//                 <p>Are you sure you want to close complaint <strong>{complaint.complaintId}</strong>? This action is final.</p>

//                 <div style={styles.modalActions}>
//                     <button style={styles.ghostBtn} onClick={onCancel}>Cancel</button>
//                     <button style={styles.actionBtn} onClick={onConfirm} disabled={loading}>{loading ? 'Closing...' : 'Confirm'}</button>
//                 </div>
//             </div>
//         </div>
//     );
// };

// const AssignModal = ({ complaint, investigators, selected, setSelected, onCancel, onConfirm, loading }) => {
//     if (!complaint) return null;
//     return (
//         <div style={styles.modalOverlay}>
//             <div style={styles.modal}>
//                 <h3>Assign Investigator</h3>
//                 <p>Assign an investigator to <strong>{complaint.complaintId}</strong></p>

//                 <select value={selected} onChange={(e) => setSelected(e.target.value)} style={styles.select}>
//                     <option value="">Select investigator</option>
//                     {investigators.map(inv => (
//                         <option key={inv._id || inv.email} value={inv.email}>{inv.name} — Badge #{inv.badgeNumber || '—'}</option>
//                     ))}
//                 </select>

//                 <div style={styles.modalActions}>
//                     <button style={styles.ghostBtn} onClick={onCancel}>Cancel</button>
//                     <button style={styles.actionBtn} onClick={onConfirm} disabled={loading || !selected}>{loading ? 'Assigning...' : 'Assign'}</button>
//                 </div>
//             </div>
//         </div>
//     );
// };

// /* ---------------- STYLES (MINIMAL) ---------------- */

// const styles = {
//     page: { padding: 30 },

//     section: {
//         background: "#fff",
//         padding: 24,
//         borderRadius: 14,
//         marginBottom: 30,
//         boxShadow: "0 4px 14px rgba(0,0,0,0.08)",
//     },
//     container: { width: "100%", maxWidth: "1100px" },

//     headerCard: {
//         background: "linear-gradient(135deg, #4A6EFF, #304FFE)",
//         padding: "22px",
//         borderRadius: "14px",
//         color: "#fff",
//         display: "flex",
//         justifyContent: "space-between",
//         alignItems: "center",
//         marginBottom: "22px",
//         boxShadow: "0 8px 26px rgba(0,0,0,0.12)",
//     },
//     headerTitle: { fontSize: "22px", fontWeight: 700 },
//     headerSub: { opacity: 0.9, marginTop: 4 },
//     avatar: { width: 68, height: 68, borderRadius: "50%" },

//     statsGrid: {
//         display: "grid",
//         gridTemplateColumns: "repeat(6, 1fr)",
//         gap: "18px",
//         marginBottom: "26px",
//     },
//     statCard: {
//         background: "#fff",
//         padding: "18px",
//         borderRadius: "12px",
//         textAlign: "center",
//         boxShadow: "0 6px 16px rgba(0,0,0,0.08)",
//     },
//     statNumber: { fontSize: "26px", fontWeight: "700" },
//     statLabel: { marginTop: 6, color: "#666", fontWeight: "600" },

//     table: {
//         width: "100%",
//         borderCollapse: "collapse",
//     },
//     th: {
//         textAlign: "left",
//         padding: "10px 12px",
//         borderBottom: "1px solid #eee",
//         fontWeight: 700,
//     },
//     td: {
//         padding: "10px 12px",
//         borderBottom: "1px solid #f1f1f1",
//     },
//     actionBtn: {
//         background: "#304FFE",
//         color: "#fff",
//         padding: "8px 12px",
//         borderRadius: 8,
//         border: "none",
//         cursor: "pointer",
//         fontWeight: 600,
//     },
//     timeline: {
//         listStyle: "none",
//         paddingLeft: 0,
//     },
//     time: {
//         fontSize: 12,
//         color: "#666",
//     },
//     modalOverlay: {
//         position: 'fixed',
//         inset: 0,
//         background: 'rgba(0,0,0,0.45)',
//         display: 'flex',
//         alignItems: 'center',
//         justifyContent: 'center',
//         zIndex: 1200,
//     },
//     modal: {
//         background: '#fff',
//         padding: 20,
//         borderRadius: 12,
//         width: 420,
//         textAlign: 'center',
//     },
//     modalActions: {
//         display: 'flex',
//         justifyContent: 'flex-end',
//         gap: 10,
//         marginTop: 16,
//     },
//     ghostBtn: {
//         background: '#fff',
//         border: '1px solid #ddd',
//         padding: '8px 12px',
//         borderRadius: 8,
//         cursor: 'pointer',
//         fontWeight: 600,
//     },
//     select: {
//         width: '100%',
//         padding: '10px 12px',
//         borderRadius: 8,
//         border: '1px solid #ddd',
//         marginTop: 12,
//     },
// };



// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";

// /* ---------------- KPI CARD ---------------- */
// const StatCard = ({ label, value, color }) => (
//     <div style={styles.statCard}>
//         <h2 style={{ color }}>{value}</h2>
//         <p>{label}</p>
//     </div>
// );

// export default function AdminDashboard() {
//     const navigate = useNavigate();

//     const [complaints, setComplaints] = useState([]);
//     const [investigators, setInvestigators] = useState([]);
//     const [activities, setActivities] = useState([]);
//     const [loading, setLoading] = useState(true);

//     useEffect(() => {
//         const loadDashboard = async () => {
//             try {
//                 const [cRes, iRes, aRes] = await Promise.all([
//                     axios.get("http://localhost:7000/api/complaint/all"),
//                     axios.get("http://localhost:7000/api/investigators"),
//                     axios.get("http://localhost:7000/api/case-activity/recent").catch(() => ({ data: [] }))
//                 ]);

//                 setComplaints(cRes.data || []);
//                 setInvestigators(iRes.data || []);
//                 setActivities(aRes.data || []);
//             } catch (err) {
//                 console.error("Admin dashboard load failed", err);
//             } finally {
//                 setLoading(false);
//             }
//         };

//         loadDashboard();
//     }, []);

//     if (loading) return <p style={{ textAlign: "center" }}>Loading dashboard…</p>;

//     /* ---------------- KPI CALCULATION ---------------- */
//     const stats = {
//         total: complaints.length,
//         newCases: complaints.filter(c => !c.assignedTo || c.status === "Pending").length,
//         assigned: complaints.filter(c => ["Assigned", "Open"].includes(c.status)).length,
//         resolved: complaints.filter(c => c.status === "Resolved").length,
//         closed: complaints.filter(c => c.status === "Closed").length,
//     };

//     /* ---------------- ACTION REQUIRED ---------------- */
//     const unassigned = complaints.filter(c => !c.assignedTo || c.status === "Pending");
//     const awaitingClosure = complaints.filter(c => c.status === "Resolved");

//     /* ---------------- RECENT ---------------- */
//     const recentComplaints = [...complaints]
//         .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
//         .slice(0, 5);

//     /* ---------------- WORKLOAD ---------------- */
//     const workload = investigators.map(inv => {
//         const list = complaints.filter(c => c.assignedTo === inv.email);
//         return {
//             name: inv.name,
//             active: list.filter(c => ["Assigned", "Open"].includes(c.status)).length,
//             resolved: list.filter(c => c.status === "Resolved").length,
//             closed: list.filter(c => c.status === "Closed").length,
//         };
//     });

//     return (
//         <div style={styles.page}>

//             {/* ===== KPI SECTION ===== */}
//             <div style={styles.statsGrid}>
//                 <StatCard label="Total Cases" value={stats.total} color="#304FFE" />
//                 <StatCard label="New Cases" value={stats.newCases} color="#FB8C00" />
//                 <StatCard label="Assigned" value={stats.assigned} color="#0288D1" />
//                 <StatCard label="Resolved" value={stats.resolved} color="#2E7D32" />
//                 <StatCard label="Closed" value={stats.closed} color="#616161" />
//             </div>

//             {/* ===== ACTION REQUIRED ===== */}
//             <div style={styles.section}>
//                 <h3>Action Required</h3>

//                 <div style={styles.actionRow}>
//                     <div>
//                         🔴 Unassigned Complaints: <strong>{unassigned.length}</strong>
//                     </div>
//                     <button onClick={() => navigate("/admin/complaints?filter=unassigned")}>
//                         View
//                     </button>
//                 </div>

//                 <div style={styles.actionRow}>
//                     <div>
//                         🟠 Resolved – Awaiting Closure: <strong>{awaitingClosure.length}</strong>
//                     </div>
//                     <button onClick={() => navigate("/admin/complaints?filter=resolved")}>
//                         View
//                     </button>
//                 </div>
//             </div>

//             {/* ===== RECENT COMPLAINTS ===== */}
//             <div style={styles.section}>
//                 <h3>Recent Complaints</h3>

//                 <table style={styles.table}>
//                     <thead>
//                         <tr>
//                             <th>ID</th>
//                             <th>Type</th>
//                             <th>Status</th>
//                             <th>Assigned</th>
//                             <th>Date</th>
//                             <th />
//                         </tr>
//                     </thead>
//                     <tbody>
//                         {recentComplaints.map(c => (
//                             <tr key={c._id}>
//                                 <td>{c.complaintId}</td>
//                                 <td>{c.complaintType}</td>
//                                 <td>{c.status}</td>
//                                 <td>{c.assignedTo || "—"}</td>
//                                 <td>{new Date(c.createdAt).toLocaleDateString()}</td>
//                                 <td>
//                                     <button onClick={() => navigate(`/admin/complaints/${c._id}`)}>
//                                         View
//                                     </button>
//                                 </td>
//                             </tr>
//                         ))}
//                     </tbody>
//                 </table>
//             </div>

//             {/* ===== INVESTIGATOR WORKLOAD ===== */}
//             <div style={styles.section}>
//                 <h3>Investigator Workload</h3>

//                 <table style={styles.table}>
//                     <thead>
//                         <tr>
//                             <th>Investigator</th>
//                             <th>Active</th>
//                             <th>Resolved</th>
//                             <th>Closed</th>
//                         </tr>
//                     </thead>
//                     <tbody>
//                         {workload.map(w => (
//                             <tr key={w.name}>
//                                 <td>{w.name}</td>
//                                 <td>{w.active}</td>
//                                 <td>{w.resolved}</td>
//                                 <td>{w.closed}</td>
//                             </tr>
//                         ))}
//                     </tbody>
//                 </table>
//             </div>

//             {/* ===== SYSTEM ACTIVITY ===== */}
//             <div style={styles.section}>
//                 <h3>Recent System Activity</h3>

//                 {activities.length === 0 ? (
//                     <p>No recent activity.</p>
//                 ) : (
//                     <ul>
//                         {activities.slice(0, 6).map(a => (
//                             <li key={a._id}>
//                                 <strong>{a.action}</strong> — {a.role} ({a.performedBy})
//                             </li>
//                         ))}
//                     </ul>
//                 )}
//             </div>

//         </div>
//     );
// }

// /* ---------------- STYLES ---------------- */

// const styles = {
//     page: { padding: 30 },

//     statsGrid: {
//         display: "grid",
//         gridTemplateColumns: "repeat(5, 1fr)",
//         gap: 20,
//         marginBottom: 30,
//     },

//     statCard: {
//         background: "#fff",
//         padding: 20,
//         borderRadius: 14,
//         textAlign: "center",
//         boxShadow: "0 4px 14px rgba(0,0,0,0.08)",
//     },

//     section: {
//         background: "#fff",
//         padding: 22,
//         borderRadius: 14,
//         marginBottom: 30,
//         boxShadow: "0 4px 14px rgba(0,0,0,0.08)",
//     },

//     actionRow: {
//         display: "flex",
//         justifyContent: "space-between",
//         marginBottom: 12,
//     },

//     table: {
//         width: "100%",
//         borderCollapse: "collapse",
//     },
// };



// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";

// /* ---------------- KPI CARD ---------------- */
// const StatCard = ({ label, value, color }) => (
//     <div style={styles.statCard}>
//         <h2 style={{ ...styles.statNumber, color }}>{value}</h2>
//         <p style={styles.statLabel}>{label}</p>
//     </div>
// );

// export default function AdminDashboard() {
//     const navigate = useNavigate();

//     const [complaints, setComplaints] = useState([]);
//     const [investigators, setInvestigators] = useState([]);
//     const [activities, setActivities] = useState([]);
//     const [loading, setLoading] = useState(true);

//     useEffect(() => {
//         const load = async () => {
//             try {
//                 const [c, i, a] = await Promise.allSettled([
//                     axios.get("http://localhost:7000/api/complaint/all"),
//                     axios.get("http://localhost:7000/api/investigators"),
//                     axios.get("http://localhost:7000/api/case-activity/recent"),
//                 ]);

//                 setComplaints(c.value?.data || []);
//                 setInvestigators(i.value?.data || []);
//                 setActivities(a.value?.data || []);
//             } catch (err) {
//                 console.error("Dashboard load error", err);
//             } finally {
//                 setLoading(false);
//             }
//         };

//         load();
//     }, []);

//     if (loading) {
//         return <p style={{ textAlign: "center", marginTop: 40 }}>Loading dashboard…</p>;
//     }

//     /* ---------------- STATS ---------------- */

//     const stats = {
//         total: complaints.length,
//         newCases: complaints.filter(c => c.status === "Pending").length,
//         assigned: complaints.filter(c =>
//             c.status === "Assigned" || c.status === "Open"
//         ).length,
//         resolved: complaints.filter(c => c.status === "Resolved").length,
//         closed: complaints.filter(c => c.status === "Closed").length,
//     };

//     const recentComplaints = [...complaints]
//         .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
//         .slice(0, 6);

//     const investigatorLoad = investigators.map(inv => {
//         const cases = complaints.filter(c => c.assignedTo === inv.email);
//         return {
//             name: inv.name,
//             active: cases.filter(c => ["Assigned", "Open"].includes(c.status)).length,
//             resolved: cases.filter(c => c.status === "Resolved").length,
//             closed: cases.filter(c => c.status === "Closed").length,
//         };
//     });

//     return (
//         <div style={styles.page}>
//             <div style={styles.container}>

//                 {/* HEADER */}
//                 <h1 style={styles.heading}>Welcome, Admin</h1>

//                 {/* KPI ROW */}
//                 <div style={styles.statsGrid}>
//                     <StatCard label="Total Cases" value={stats.total} color="#304FFE" />
//                     <StatCard label="New" value={stats.newCases} color="#FB8C00" />
//                     <StatCard label="Assigned" value={stats.assigned} color="#0288D1" />
//                     <StatCard label="Resolved" value={stats.resolved} color="#2E7D32" />
//                     <StatCard label="Closed" value={stats.closed} color="#616161" />
//                 </div>

//                 {/* RECENT COMPLAINTS */}
//                 <div style={styles.section}>
//                     <h3 style={styles.sectionTitle}>Recent Complaints</h3>

//                     <table style={styles.table}>
//                         <thead>
//                             <tr>
//                                 <th>ID</th>
//                                 <th>Type</th>
//                                 <th>Status</th>
//                                 <th>Assigned</th>
//                                 <th>Date</th>
//                                 <th />
//                             </tr>
//                         </thead>
//                         <tbody>
//                             {recentComplaints.map(c => (
//                                 <tr key={c._id}>
//                                     <td>{c.complaintId}</td>
//                                     <td>{c.complaintType}</td>
//                                     <td>
//                                         <span style={styles.statusBadge}>{c.status}</span>
//                                     </td>
//                                     <td>{c.assignedTo || "—"}</td>
//                                     <td>{new Date(c.createdAt).toLocaleDateString()}</td>
//                                     <td>
//                                         <button
//                                             style={styles.primaryBtn}
//                                             onClick={() =>
//                                                 navigate(`/admin/complaints/${c._id}`)
//                                             }
//                                         >
//                                             View
//                                         </button>
//                                     </td>
//                                 </tr>
//                             ))}
//                         </tbody>
//                     </table>
//                 </div>

//                 {/* INVESTIGATOR LOAD */}
//                 <div style={styles.section}>
//                     <h3 style={styles.sectionTitle}>Investigator Workload</h3>

//                     <table style={styles.table}>
//                         <thead>
//                             <tr>
//                                 <th>Investigator</th>
//                                 <th>Active</th>
//                                 <th>Resolved</th>
//                                 <th>Closed</th>
//                             </tr>
//                         </thead>
//                         <tbody>
//                             {investigatorLoad.map((i, idx) => (
//                                 <tr key={idx}>
//                                     <td>{i.name}</td>
//                                     <td>{i.active}</td>
//                                     <td>{i.resolved}</td>
//                                     <td>{i.closed}</td>
//                                 </tr>
//                             ))}
//                         </tbody>
//                     </table>
//                 </div>

//                 {/* ACTIVITY */}
//                 <div style={styles.section}>
//                     <h3 style={styles.sectionTitle}>Recent System Activity</h3>

//                     {activities.length === 0 ? (
//                         <p>No recent activity</p>
//                     ) : (
//                         <ul style={styles.timeline}>
//                             {activities.map(a => (
//                                 <li key={a._id}>
//                                     <strong>{a.action}</strong> — {a.role}
//                                     <div style={styles.time}>
//                                         {new Date(a.createdAt).toLocaleString()}
//                                     </div>
//                                 </li>
//                             ))}
//                         </ul>
//                     )}
//                 </div>

//             </div>
//         </div>
//     );
// }

// /* ---------------- STYLES ---------------- */

// const styles = {
//     page: { background: "#F4F6FF", minHeight: "100vh", padding: 30 },
//     container: { maxWidth: 1200, margin: "0 auto" },

//     heading: { fontSize: 28, fontWeight: 700, marginBottom: 25 },

//     statsGrid: {
//         display: "grid",
//         gridTemplateColumns: "repeat(5, 1fr)",
//         gap: 20,
//         marginBottom: 35,
//     },

//     statCard: {
//         background: "#fff",
//         padding: 20,
//         borderRadius: 14,
//         textAlign: "center",
//         boxShadow: "0 6px 18px rgba(0,0,0,0.1)",
//     },

//     statNumber: { fontSize: 30, fontWeight: 700 },
//     statLabel: { marginTop: 6, color: "#666", fontWeight: 600 },

//     section: {
//         background: "#fff",
//         padding: 24,
//         borderRadius: 16,
//         marginBottom: 30,
//         boxShadow: "0 6px 18px rgba(0,0,0,0.08)",
//     },

//     sectionTitle: { fontSize: 20, fontWeight: 700, marginBottom: 18 },

//     table: { width: "100%", borderCollapse: "collapse", textAlign: "left" },

//     statusBadge: {
//         padding: "4px 10px",
//         borderRadius: 8,
//         background: "#E3E7FF",
//         fontWeight: 600,
//     },

//     primaryBtn: {
//         background: "#304FFE",
//         color: "#fff",
//         border: "none",
//         padding: "8px 14px",
//         borderRadius: 8,
//         cursor: "pointer",
//         fontWeight: 600,
//     },

//     timeline: { listStyle: "none", paddingLeft: 0 },
//     time: { fontSize: 12, color: "#666", marginTop: 4 },
// };


import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

/* ---------------- KPI CARD ---------------- */
const StatCard = ({ label, value, color }) => (
    <div style={styles.statCard}>
        <h2 style={{ ...styles.statNumber, color }}>{value}</h2>
        <p style={styles.statLabel}>{label}</p>
    </div>
);

export default function AdminDashboard() {
    const navigate = useNavigate();

    const [complaints, setComplaints] = useState([]);
    const [investigators, setInvestigators] = useState([]);
    const [activities, setActivities] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            try {
                const [c, i, a] = await Promise.allSettled([
                    axios.get("http://localhost:7000/api/complaint/all"),
                    axios.get("http://localhost:7000/api/investigators"),
                    axios.get("http://localhost:7000/api/case-activity/recent"),
                ]);

                setComplaints(c.value?.data || []);
                setInvestigators(i.value?.data || []);
                setActivities(a.value?.data || []);
            } catch (err) {
                console.error("Dashboard load error", err);
            } finally {
                setLoading(false);
            }
        };

        load();
    }, []);

    if (loading) {
        return (
            <p style={{ textAlign: "center", marginTop: 60, fontWeight: 600 }}>
                Loading admin dashboard…
            </p>
        );
    }

    /* ---------------- STATS ---------------- */

    const stats = {
        total: complaints.length,
        newCases: complaints.filter(c => c.status === "Pending").length,
        assigned: complaints.filter(c =>
            ["Assigned", "Open"].includes(c.status)
        ).length,
        resolved: complaints.filter(c => c.status === "Resolved").length,
        closed: complaints.filter(c => c.status === "Closed").length,
    };

    const recentComplaints = [...complaints]
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 6);

    const investigatorLoad = investigators.map(inv => {
        const cases = complaints.filter(c => c.assignedTo === inv.email);
        return {
            name: inv.name,
            active: cases.filter(c => ["Assigned", "Open"].includes(c.status)).length,
            resolved: cases.filter(c => c.status === "Resolved").length,
            closed: cases.filter(c => c.status === "Closed").length,
        };
    });

    return (
        <div style={styles.page}>
            <div style={styles.container}>

                {/* HEADER */}
                <div style={styles.headerRow}>
                    <h1 style={styles.heading}>Admin Dashboard</h1>
                    <p style={styles.subheading}>
                        System overview and operational insights
                    </p>
                </div>

                {/* KPI ROW */}
                <div style={styles.statsGrid}>
                    <StatCard label="Total Cases" value={stats.total} color="#304FFE" />
                    <StatCard label="New Cases" value={stats.newCases} color="#FB8C00" />
                    <StatCard label="Assigned / Open" value={stats.assigned} color="#1E88E5" />
                    <StatCard label="Resolved" value={stats.resolved} color="#2E7D32" />
                    <StatCard label="Closed" value={stats.closed} color="#616161" />
                </div>

                {/* RECENT COMPLAINTS */}
                <div style={styles.section}>
                    <div style={styles.sectionHeader}>
                        <h3 style={styles.sectionTitle}>Recent Complaints</h3>
                        <button
                            style={styles.linkBtn}
                            onClick={() => navigate("/admin/complaints")}
                        >
                            View All
                        </button>
                    </div>

                    <table style={styles.table}>
                        <thead>
                            <tr style={styles.theadRow}>
                                <th style={styles.th}>ID</th>
                                <th style={styles.th}>Type</th>
                                <th style={styles.th}>Status</th>
                                <th style={styles.th}>Assigned To</th>
                                <th style={styles.th}>Date</th>
                                <th style={{ ...styles.th, textAlign: "right" }} />
                            </tr>
                        </thead>
                        <tbody>
                            {recentComplaints.map(c => (
                                <tr key={c._id} style={styles.row}>
                                    <td style={styles.td}>{c.complaintId}</td>
                                    <td style={styles.td}>{c.complaintType}</td>
                                    <td style={styles.td}>
                                        <span style={styles.statusBadge}>
                                            {c.status}
                                        </span>
                                    </td>
                                    <td style={styles.td}>{c.assignedTo || "—"}</td>
                                    <td style={styles.td}>
                                        {new Date(c.createdAt).toLocaleDateString("en-IN")}
                                    </td>
                                    <td style={{ ...styles.td, textAlign: "right" }}>
                                        <button
                                            style={styles.primaryBtn}
                                            onClick={() =>
                                                navigate(`/admin/complaints/${c._id}`)
                                            }
                                        >
                                            View
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* INVESTIGATOR LOAD */}
                <div style={styles.section}>
                    <h3 style={styles.sectionTitle}>Investigator Workload</h3>

                    <table style={styles.table}>
                        <thead>
                            <tr style={styles.theadRow}>
                                <th style={styles.th}>Investigator</th>
                                <th style={styles.th}>Active</th>
                                <th style={styles.th}>Resolved</th>
                                <th style={styles.th}>Closed</th>
                            </tr>
                        </thead>
                        <tbody>
                            {investigatorLoad.map((i, idx) => (
                                <tr key={idx} style={styles.row}>
                                    <td style={styles.td}>{i.name}</td>
                                    <td style={styles.td}>{i.active}</td>
                                    <td style={styles.td}>{i.resolved}</td>
                                    <td style={styles.td}>{i.closed}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* ACTIVITY */}
                <div style={styles.section}>
                    <h3 style={styles.sectionTitle}>Recent System Activity</h3>

                    {activities.length === 0 ? (
                        <p style={styles.empty}>No recent activity</p>
                    ) : (
                        <ul style={styles.timeline}>
                            {activities.map(a => (
                                <li key={a._id} style={styles.timelineItem}>
                                    <strong>{a.action}</strong>
                                    <span style={styles.meta}>
                                        {a.role} • {new Date(a.createdAt).toLocaleString()}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

            </div>
        </div>
    );
}

/* ---------------- STYLES ---------------- */

const styles = {
    page: {
        background: "#F4F6FF",
        minHeight: "100vh",
        padding: 30,
    },
    container: {
        maxWidth: 1200,
        margin: "0 auto",
    },

    headerRow: {
        marginBottom: 28,
    },

    heading: {
        fontSize: 28,
        fontWeight: 700,
    },

    subheading: {
        color: "#666",
        marginTop: 4,
    },

    statsGrid: {
        display: "grid",
        gridTemplateColumns: "repeat(5, 1fr)",
        gap: 20,
        marginBottom: 36,
    },

    statCard: {
        background: "#fff",
        padding: 22,
        borderRadius: 16,
        textAlign: "center",
        boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
    },

    statNumber: {
        fontSize: 30,
        fontWeight: 700,
    },

    statLabel: {
        marginTop: 6,
        color: "#666",
        fontWeight: 600,
    },

    section: {
        background: "#fff",
        padding: 24,
        borderRadius: 18,
        marginBottom: 30,
        boxShadow: "0 8px 26px rgba(0,0,0,0.08)",
    },

    sectionHeader: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 16,
    },

    sectionTitle: {
        fontSize: 20,
        fontWeight: 700,
    },

    linkBtn: {
        background: "transparent",
        border: "none",
        color: "#304FFE",
        fontWeight: 600,
        cursor: "pointer",
    },

    table: {
        width: "100%",
        borderCollapse: "collapse",
    },

    theadRow: {
        background: "#F5F7FF",
    },

    th: {
        padding: "14px 18px",
        textAlign: "left",
        fontSize: 13,
        fontWeight: 700,
        color: "#555",
        textTransform: "uppercase",
        borderBottom: "1px solid #E2E5FF",
    },

    td: {
        padding: "14px 18px",
        borderBottom: "1px solid #F0F0F0",
        fontSize: 14,
    },

    row: {
        transition: "background 0.15s ease",
    },

    statusBadge: {
        padding: "6px 12px",
        background: "#E8ECFF",
        borderRadius: 8,
        fontWeight: 600,
        fontSize: 13,
    },

    primaryBtn: {
        background: "#304FFE",
        color: "#fff",
        border: "none",
        padding: "8px 14px",
        borderRadius: 8,
        fontWeight: 600,
        cursor: "pointer",
    },

    timeline: {
        listStyle: "none",
        paddingLeft: 0,
        marginTop: 10,
    },

    timelineItem: {
        padding: "10px 0",
        borderBottom: "1px solid #EEE",
    },

    meta: {
        display: "block",
        fontSize: 12,
        color: "#666",
        marginTop: 4,
    },

    empty: {
        color: "#777",
        fontWeight: 600,
    },
};

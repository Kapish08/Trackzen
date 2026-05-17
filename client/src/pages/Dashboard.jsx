import React from 'react';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  AreaChart, 
  Area,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { 
  TrendingUp, 
  Target, 
  CheckCircle2, 
  Clock, 
  ArrowUpRight, 
  ArrowDownRight,
  MoreVertical,
  Download,
  Loader2
} from 'lucide-react';
import StatCard from '../components/dashboard/StatCard';
import { Card, Button } from '../components/ui';
import { useDispatch } from 'react-redux';
import { getGoals } from '../store/slices/goalSlice';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { useEffect } from 'react';

const Dashboard = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { goals, isLoading } = useSelector((state) => state.goals);

  useEffect(() => {
    dispatch(getGoals());
  }, [dispatch]);

  const handleDownloadReport = () => {
    const doc = new jsPDF();
    
    // Add header
    doc.setFontSize(22);
    doc.setTextColor(14, 165, 233); // Primary color
    doc.text('TrackZen Performance Report', 14, 22);
    
    doc.setFontSize(11);
    doc.setTextColor(100);
    doc.text(`Employee: ${user?.name}`, 14, 32);
    doc.text(`Department: ${user?.department || 'N/A'}`, 14, 38);
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 14, 44);
    
    // Line separator
    doc.setDrawColor(226, 232, 240);
    doc.line(14, 50, 196, 50);

    // Goal Table
    const tableColumn = ["#", "Goal Title", "Thrust Area", "Target", "Weight", "Status"];
    const tableRows = [];

    if (goals && Array.isArray(goals)) {
      goals.forEach((goal, index) => {
        const goalData = [
          index + 1,
          goal.title || 'Untitled',
          goal.thrustArea || 'N/A',
          goal.target || 0,
          `${goal.weightage || 0}%`,
          goal.status || 'Draft'
        ];
        tableRows.push(goalData);
      });
    }

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 60,
      theme: 'grid',
      headStyles: { fillColor: [14, 165, 233] },
      styles: { fontSize: 9 }
    });

    // Add footer
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(10);
      doc.text(`Page ${i} of ${pageCount}`, 196, 285, null, null, "right");
    }

    doc.save(`TrackZen_Report_${user?.name.replace(' ', '_')}.pdf`);
  };

  // Calculate dynamic stats
  const activeGoalsCount = goals.filter(g => g.status === 'Approved').length;
  const completedGoalsCount = goals.filter(g => g.status === 'Completed' || (g.progress >= g.target && g.target > 0)).length;
  
  const totalProgress = goals.length > 0 
    ? Math.round(goals.reduce((acc, g) => {
        const goalTarget = g.target || 1;
        const goalProgress = g.progress || 0;
        const weight = (g.weightage || 0) / 100;
        return acc + ((goalProgress / goalTarget) * weight * 100);
      }, 0))
    : 0;

  const stats = [
    { label: 'Overall Progress', value: `${totalProgress || 0}%`, icon: <TrendingUp className="text-primary-600" />, trend: '+5%', positive: true },
    { label: 'Active Goals', value: activeGoalsCount.toString(), icon: <Target className="text-blue-600" />, trend: '0%', positive: true },
    { label: 'Completed', value: completedGoalsCount.toString(), icon: <CheckCircle2 className="text-emerald-600" />, trend: '+1', positive: true },
    { label: 'Pending Check-ins', value: '2', icon: <Clock className="text-amber-600" />, trend: '-1', positive: true },
  ];

  const chartData = [
    { name: 'Jan', progress: 40 },
    { name: 'Feb', progress: 55 },
    { name: 'Mar', progress: 48 },
    { name: 'Apr', progress: 65 },
    { name: 'May', progress: 78 },
    { name: 'Jun', progress: 74 },
  ];

  const onTrackCount = goals.filter(g => g.progress >= (g.target * 0.7)).length;
  const atRiskCount = goals.filter(g => g.progress < (g.target * 0.7) && g.progress >= (g.target * 0.3)).length;
  const behindCount = goals.filter(g => g.progress < (g.target * 0.3)).length;

  const pieData = [
    { name: 'On Track', value: goals.length > 0 ? Math.round((onTrackCount / goals.length) * 100) : 0, color: '#0ea5e9' },
    { name: 'At Risk', value: goals.length > 0 ? Math.round((atRiskCount / goals.length) * 100) : 0, color: '#f59e0b' },
    { name: 'Behind', value: goals.length > 0 ? Math.round((behindCount / goals.length) * 100) : 0, color: '#ef4444' },
  ];

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 }
  };

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 dark:text-white">Hello, {user?.name.split(' ')[0]} 👋</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1 font-medium">Here's what's happening with your performance today.</p>
        </div>
        <div className="flex gap-3">
          <Button 
            variant="outline" 
            onClick={handleDownloadReport}
            className="flex items-center gap-2"
          >
            <Download size={18} />
            Download Report
          </Button>
          <Button className="px-6">
            Update Check-in
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {stats.map((stat, i) => (
          <StatCard key={i} stat={stat} variants={item} />
        ))}
      </motion.div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Performance Chart */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:col-span-2"
        >
          <Card className="p-8">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-xl font-bold text-slate-800 dark:text-white">Performance Overview</h3>
              <select className="bg-slate-50 dark:bg-slate-800 border-none rounded-lg text-sm font-medium focus:ring-2 focus:ring-primary-500">
                <option>Last 6 Months</option>
                <option>Last Year</option>
              </select>
            </div>
            <div className="h-[350px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorProgress" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  />
                  <Area type="monotone" dataKey="progress" stroke="#0ea5e9" strokeWidth={3} fillOpacity={1} fill="url(#colorProgress)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </motion.div>

        {/* Status Distribution */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="p-8">
            <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-8">Goal Status</h3>
            <div className="h-[250px] w-full relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={8}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
                <p className="text-3xl font-bold text-slate-800 dark:text-white">{goals.length}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium uppercase tracking-wider">Total</p>
              </div>
            </div>
            <div className="mt-8 space-y-4">
              {pieData.map((item, i) => (
                <div key={i} className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                    <span className="text-sm font-medium text-slate-600 dark:text-slate-400">{item.name}</span>
                  </div>
                  <span className="text-sm font-bold text-slate-800 dark:text-white">{item.value}%</span>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Team Performance Heatmap (Conditional for Manager/Admin) */}
      {(user?.role === 'Manager' || user?.role === 'Admin') && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="p-8">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h3 className="text-xl font-bold text-slate-800 dark:text-white">Department Performance Heatmap</h3>
                <p className="text-sm text-slate-500 mt-1">Aggregated progress across teams and thrust areas.</p>
              </div>
              <button className="text-sm font-bold text-primary-600 hover:bg-primary-50 px-4 py-2 rounded-xl transition-all">View Full Report</button>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {['Revenue', 'CX', 'Ops', 'People', 'Product', 'Legal'].map((area, i) => (
                <div key={i} className="space-y-3">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest text-center">{area}</p>
                  <div 
                    className="h-24 rounded-2xl flex items-center justify-center font-black text-white text-xl shadow-inner"
                    style={{ 
                      backgroundColor: i % 3 === 0 ? '#10b981' : i % 2 === 0 ? '#0ea5e9' : '#f59e0b',
                      opacity: 0.7 + (i * 0.05)
                    }}
                  >
                    {70 + (i * 4)}%
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>
      )}
    </div>
  );
};

export default Dashboard;
